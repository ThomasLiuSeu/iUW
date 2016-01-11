/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

/**
 * Base class for factory implementations that create controls that are hosted by <code>sap.ui.comp.SmartField</code>.
 * 
 * @public
 * @name sap.ui.comp.smartfield.ControlFactoryBase
 * @author SAP SE
 * @version 1.28.1
 * @since 1.28.0
 * @param {jquery.sap.global} jQuery a reference to the jQuery implementation.
 * @param {sap.ui.base.Object} BaseObject a reference to the base object implementation.
 * @param {sap.ui.comp.providers.ValueHelpProvider} ValueHelpProvider a reference to the value help provider implementation.
 * @param {sap.ui.comp.providers.ValueListProvider} ValueListProvider a reference to the value list provider implementation.
 * @param {sap.ui.comp.smartfield.BindingUtil} BindingUtil a reference to the binding utility implementation.
 * @returns {sap.ui.comp.smartfield.ControlFactoryBase} new control factory instance.
 */
sap.ui.define([ "jquery.sap.global", "sap/ui/base/Object", "sap/ui/comp/providers/ValueHelpProvider", "sap/ui/comp/providers/ValueListProvider", "sap/ui/comp/smartfield/BindingUtil" ], function(jQuery, BaseObject, ValueHelpProvider, ValueListProvider, BindingUtil) { // EXC_JSHINT_037 // EXC_JSHINT_034
	"use strict";

	/**
	 * @public
	 * @constructor
	 * @param {sap.ui.model.Model} oModel the model currently used.
	 * @param {sap.ui.core.Control} oParent the parent control.
	 */
	var ControlFactoryBase = BaseObject.extend("sap.ui.comp.smartfield.ControlFactoryBase", {
		constructor: function(oModel, oParent) {
			BaseObject.apply(this, arguments);
			this.sName = "ControlFactoryBase";
			this._oModel = oModel;
			this._oParent = oParent;
			this._oBinding = new BindingUtil();
			this._aProviders = [];
		}
	});

	/**
	 * Creates a control instance.
	 * 
	 * @param {boolean} bBlockSmartLinkCreation if <code>true</code>, a <code>SmartLink</code> will not be created.
	 * @returns {sap.ui.core.Control} the new control instance or <code>null</code>, if no control could be determined.
	 * @public
	 */
	ControlFactoryBase.prototype.createControl = function(bBlockSmartLinkCreation) {
		var oControl = this[this._getCreator(bBlockSmartLinkCreation)]();

		if (oControl.onCreate) {
			this[oControl.onCreate](oControl.control, oControl.params);
		}

		return oControl;
	};

	/**
	 * Adds validations to the given control.
	 * 
	 * @param {sap.ui.core.Control} oControl the given control.
	 * @param {string} sMethod an optional method name of a method to be invoked on the parent smart field to notify it of the current state.
	 * @public
	 */
	ControlFactoryBase.prototype.addValidations = function(oControl, sMethod) {	
		var fState, fError, that = this;

		fState = function(sState, oEvent) {
			var oException, oSource = oEvent.getSource();

			if (oSource) {
				if (oSource.setValueState) {
					oSource.setValueState(sState);
				}

				oException = oEvent.getParameter("exception");

				if (oException) {
					if (oSource.setValueStateText) {
						oSource.setValueStateText(oException.message);
					}
					
					that._oParent.setValueStateText(oException.message);
				} 
			}
			
			that._oParent.setValueState(sState);
			
			if (sMethod) {
				that._oParent[sMethod](sState === sap.ui.core.ValueState.Error);
			}
		};
		fError = function(oEvent) {
			fState(sap.ui.core.ValueState.Error, oEvent);
		};

		// attach to the errors.
		oControl.attachFormatError(fError);
		oControl.attachParseError(fError);
		oControl.attachValidationError(fError);
		oControl.attachValidationSuccess(function(oEvent) {
			fState(sap.ui.core.ValueState.None, oEvent);
		});		
	};

	/**
	 * Checks whether an annotation for value help exists and adds type-ahead and value help.
	 * 
	 * @param {sap.ui.core.Control} oControl the new control.
	 * @param {object} oProperty the OData property.
	 * @param {object} oValueHelp the value help configuration.
	 * @param {object} oValueHelp.annotation the value help annotation.
	 * @param {string} oValueHelp.aggregation the aggregation to attach the value list to.
	 * @param {boolean} oValueHelp.noDialog if set to <code>true</code> the creation of a value help dialog is omitted.
	 * @param {boolean} oValueHelp.noTypeAhead if set to <code>true</code> the type ahead functionality is omitted.
	 * @param {string} oValueHelp.dialogtitle title for the value help dialog.
	 * @param {sap.ui.model.odata.ODataModel} oModel the OData model currently used.
	 * @public
	 */
	ControlFactoryBase.prototype.addValueHelp = function(oControl, oProperty, oValueHelp, oModel) {
		var oValueHelpDlg, oValueList, oConfig, sDisplay;

		if (oValueHelp.annotation && oValueHelp.annotation.primaryValueListAnnotation) {
			// check the configuration for display behavior.
			oConfig = this._oParent.getConfiguration();

			if (oConfig) {
				sDisplay = oConfig.getDisplayBehaviour();
			}

			if (!sDisplay) {
				sDisplay = this._oParent.data("defaultDropDownDisplayBehaviour");
			}
			
			// add dialog, if necessary.
			if (!oValueHelp.noDialog) {
				if (oControl.setFilterSuggests) {
					oControl.setFilterSuggests(false);
				}

				// create the value help provider.
				oValueHelpDlg = new ValueHelpProvider({
					annotation: oValueHelp.annotation.primaryValueListAnnotation,
					additionalAnnotations: oValueHelp.annotation.additionalAnnotations,
					control: oControl,
					model: oModel,
					preventInitialDataFetchInValueHelpDialog: true,
					takeOverInputValue: false,
					supportMultiSelect: false,
					supportRanges: false,
					fieldName: oProperty.name,
					title: oValueHelp.dialogtitle,
					displayBehaviour: sDisplay
				});
				this._aProviders.push(oValueHelpDlg);
			}

			// create the value list provider.
			if (oControl.setShowValueHelp) {
				oControl.setShowValueHelp(true);
			}

			oValueList = new ValueListProvider({
				control: oControl,
				typeAheadEnabled: !oValueHelp.noTypeAhead,
				aggregation: oValueHelp.aggregation,
				annotation: oValueHelp.annotation.primaryValueListAnnotation,
				model: oModel,
				displayBehaviour: sDisplay
			});

			if (oControl.setShowSuggestion) {
				oControl.setShowSuggestion(true);
			}

			this._aProviders.push(oValueList);
		}
	};

	/**
	 * Returns a binding for a given attribute, if no binding is specified a fixed value or <code>null</code>, which is deduced from the
	 * information maintained on the parent.
	 * 
	 * @param {string} sName the name of the attribute
	 * @returns {object} binding for a given attribute, if no binding is specified a fixed value or <code>null</code>.
	 * @public
	 */
	ControlFactoryBase.prototype.getAttribute = function(sName) {
		var oInfo = this._oParent.getBindingInfo(sName);

		if (oInfo) {
			return this._oBinding.toBindingPath(oInfo);
		}

		return this._oParent["get" + sName.substring(0, 1).toUpperCase() + sName.substring(1)]();
	};

	/**
	 * Returns the standard attributes used during creation of a control.
	 * 
	 * @param {string} sAttribute the "leading" attribute, can be <code>null</code>.
	 * @param {object} oTypeInfo optional type information.
	 * @param {map} mNames the names of the attributes to be set.
	 * @param {object} oEvent the optional description of an event to register to and raise the <code>change</code> event on the
	 *        <code>SmartField</code>.
	 * @param {string} oEvent.event the name of an event to register to and raise the <code>change</code> event on the <code>SmartField</code>.
	 * @param {string} oEvent.parameter the name of a parameter to send with the <code>change</code> event on the <code>SmartField</code>.
	 * @returns {map} the standard attributes used during creation of a control.
	 * @public
	 */
	ControlFactoryBase.prototype.createAttributes = function(sAttribute, oTypeInfo, mNames, oEvent) {
		var that = this, n, oInfo, mAttributes = {};

		// check the standard attributes, whether they are bound or not.
		for (n in mNames) { // EXC_JSHINT_041
			oInfo = this._oParent.getBindingInfo(n);

			if (oInfo) {
				mAttributes[n] = this._oBinding.toBinding(oInfo);
			} else {
				mAttributes[n] = this._oParent["get" + n.substring(0, 1).toUpperCase() + n.substring(1)]();
			}
		}

		// map the value binding of the parent smart field to the child control's attribute.
		if (sAttribute) {
			mAttributes[sAttribute] = {
				model: this._oMetaData.model,
				path: this._oMetaData.path,
				type: oTypeInfo ? this._oTypes.getType(oTypeInfo) : null
			};
		}

		// prepare the event that triggers the parent smart field's change event.
		if (oEvent) {
			mAttributes[oEvent.event] = function(oParam) {
				try {
					that._oParent.fireChange({
						value: oParam.mParameters[oEvent.parameter],
						newValue: oParam.mParameters[oEvent.parameter]
					});
				} catch (ex) {
					jQuery.sap.log.warning(ex);
				}
			};
		}

		// add an optional object binding.
		this.addObjectBinding(mAttributes);
		
		return mAttributes;
	};

	/**
	 * Adds a possibly existing object binding to the attributes.
	 * @param {map} mAttributes the attributes to which to add the object binding.
	 * @param {object} oBinding optional object binding.
	 * @public
	 */
	ControlFactoryBase.prototype.addObjectBinding = function(mAttributes, oBinding) {
		if (!oBinding) {
			oBinding = this._oParent.getObjectBinding(this._oMetaData.model);
		}
		
		if (mAttributes && oBinding) {			
			mAttributes.objectBindings = {};
			mAttributes.objectBindings[this._oMetaData.model] = oBinding.sPath;
		}
	};
	
	/**
	 * Returns format settings, which can be available for the given key.
	 * 
	 * @param {string} sFormat the key identifying the format.
	 * @returns {object} the format settings.
	 * @public
	 */
	ControlFactoryBase.prototype.getFormatSettings = function(sFormat) {
		var mFormat, aCustom, oCustom, len;

		if (sFormat) {
			// check the simple data
			mFormat = this._oParent.data(sFormat);

			// check the custom data as fall-back.
			if (!mFormat) {
				aCustom = this._oParent.getCustomData();

				if (aCustom) {
					len = aCustom.length;

					while (len--) {
						oCustom = aCustom[len];

						if (oCustom.getKey() === sFormat) { // EXC_JSHINT_048
							mFormat = oCustom.getValue();
							break;
						}
					}
				}
			}

			// if we have a format, try to apply it.
			if (mFormat && typeof (mFormat) === "string") {
				try {
					mFormat = JSON.parse(mFormat);
				} catch (ex) {
					return null;
				}
			}
		}

		return mFormat;
	};

	/**
	 * Frees all resources claimed during the life-time of this instance.
	 * 
	 * @public
	 */
	ControlFactoryBase.prototype.destroy = function() { // EXC_JSLINT_021
		var len = this._aProviders.length;

		while (len--) {
			this._aProviders[len].destroy();
		}

		this._oBinding.destroy();
		this._oBinding = null;
		this._oParent = null;
		this._oModel = null;
		this._aProviders = [];
	};

	return ControlFactoryBase;
}, true);
