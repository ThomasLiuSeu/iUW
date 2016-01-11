
/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

/**
 * Factory class to create controls that are hosted by <code>sap.ui.comp.SmartField</code>.
 * 
 * @public
 * @name sap.ui.comp.smartfield.ODataControlFactory
 * @author SAP SE
 * @version 1.28.1
 * @since 1.28.0
 * @param {jquery.sap.global} jQuery a reference to the jQuery implementation.
 * @param {sap.m.CheckBox} CheckBox a reference to the check box implementation.
 * @param {sap.m.ComboBox} ComboBox a reference to the combo box implementation.
 * @param {sap.m.DatePicker} DatePicker a reference to the DatePicker implementation.
 * @param {sap.m.FlexItemData} FlexItemData a reference to the FlexItemData implementation.
 * @param {sap.m.HBox} HBox a reference to the HBox implementation.
 * @param {sap.m.Input} Input a reference to the Input implementation.
 * @param {sap.m.Text} Text a reference to the Text implementation.
 * @param {sap.ui.comp.navpopover.SmartLink} SmartLink a reference to the smart link implementation.
 * @param {sap.ui.comp.smartfield.ControlFactoryBase} ControlFactoryBase a reference to the control factory base class implementation.
 * @param {sap.ui.comp.smartfield.FieldControl} FieldControl a reference to the field control implementation.
 * @param {sap.ui.comp.smartfield.ODataHelper} ODataHelper a reference to the OData helper implementation.
 * @param {sap.ui.comp.smartfield.ODataTypes} ODataTypes a reference to the OData types implementation.
 * @returns {sap.ui.comp.smartfield.ODataControlFactory} new control factory instance.
 */
sap.ui.define([	"jquery.sap.global", "sap/m/CheckBox", "sap/m/ComboBox", "sap/m/DatePicker", "sap/m/FlexItemData", "sap/m/HBox", "sap/m/Input", "sap/m/Text", "sap/ui/comp/navpopover/SmartLink", "sap/ui/comp/smartfield/ControlFactoryBase", "sap/ui/comp/smartfield/FieldControl", "sap/ui/comp/smartfield/ODataHelper", "sap/ui/comp/smartfield/ODataTypes" ], function(jQuery, CheckBox, ComboBox, DatePicker, FlexItemData, HBox, Input, Text, SmartLink, ControlFactoryBase, FieldControl, ODataHelper, ODataTypes) { // EXC_JSHINT_002 // EXC_JSHINT_037 // EXC_JSHINT_034
	"use strict";

	/**
	 * @public
	 * @constructor
	 * @param {sap.ui.model.odata.ODataModel} oModel the OData model currently used.
	 * @param {sap.ui.core.Control} oParent the parent control.
	 * @param {object} oMetaData the meta data used to initialize the factory.
	 * @param {object} oMetaData.entitySet the name of the OData entity set.
	 * @param {object} oMetaData.model the name of the model.
	 * @param {object} oMetaData.path the path identifying the OData property.
	 */
	var ODataControlFactory = ControlFactoryBase.extend("sap.ui.comp.smartfield.ODataControlFactory", {
		constructor: function(oModel, oParent, oMetaData) {
			ControlFactoryBase.apply(this, [
				oModel, oParent
			]);
			this.sName = "ODataControlFactory";
			this._oMetaData = {
				annotations: {}
			};

			if (oModel) {
				this._oHelper = new ODataHelper(oModel);
			}

			this._oFieldControl = new FieldControl(oParent);
			this._oTypes = new ODataTypes(oParent);
			this._init(oMetaData);
			this._bInitialized = false;
			this._bMetaData = !oModel;
		}
	});

	/**
	 * Initializes the factory.
	 * 
	 * @param {object} oMetaData the meta data used to initialize the factory.
	 * @param {object} oMetaData.entitySet the name of the OData entity set.
	 * @param {object} oMetaData.entityType the name of the OData entity type.
	 * @param {object} oMetaData.property the name of the OData property.
	 * @param {object} oMetaData.model the name of the model.
	 * @param {object} oMetaData.path the path identifying the OData property.
	 * @private
	 */
	ODataControlFactory.prototype._init = function(oMetaData) {
		var oType, sPath, that = this;

		// set the name of the model used, binding path of the property (complex or simple) and entity set.
		this._oMetaData.model = oMetaData.model;
		this._oMetaData.path = oMetaData.path;
		this._oMetaData.namespace = oMetaData.namespace || this._oHelper.getNameSpace();
		this._oMetaData.entitySet = oMetaData.entitySetObject || this._oHelper.getEntitySet(oMetaData.entitySet.replace(this._oMetaData.namespace + ".", ""));

		// entity type.
		oType = oMetaData.entityType || this._oHelper.getEntityType(this._oMetaData.entitySet.entityType.replace(this._oMetaData.namespace + ".", ""));
		this._oMetaData.entityType = oType.type;
		this._oMetaData.typecount = oType.count;

		if (this._oHelper) {
			// get the property, considering navigation properties and complex types.
			if (!this._oHelper.checkNavigationProperty(this._oMetaData)) {
				this._oMetaData.property = this._oHelper.getProperty(oMetaData.path, this._oMetaData.namespace, oType.count);
			}

			// now get the remaining annotations, text, unit of measure and value list using the right path.
			if (this._oMetaData.navigationPath) {
				sPath = this._oMetaData.path.replace(this._oMetaData.navigationPath, "");
			} else {
				sPath = that._oMetaData.path;
			}

			this._oMetaData.annotations.text = this._oHelper.getTextProperty(this._oMetaData.property, sPath, this._oMetaData.namespace, this._oMetaData.typecount); // EXC_JSHINT_037
			this._oMetaData.annotations.uom = this._oHelper.getUnitOfMeasure(this._oMetaData.property, sPath, this._oMetaData.namespace, oType.count); // EXC_JSHINT_037
			this._oMetaData.annotations.valuelist = this._oHelper.getValueListAnnotation(this._oMetaData.namespace, this._oMetaData.entityType, this._oMetaData.property, this._oMetaData.property.typePath); // EXC_JSHINT_037
			this._oMetaData.annotations.lineitem = this._oHelper.oAnalyzer.getLineItemAnnotation(this._oMetaData.entitySet.entityType);
			this._oMetaData.annotations.semantic = this._oHelper.oAnalyzer.getSemanticObjectAnnotation(this._oMetaData.namespace + "." + this._oMetaData.entityType.name + "/" + this._oMetaData.property.property.name); // EXC_JSHINT_037
			this._oHelper.getUOMValueListAnnotation(this._oMetaData); // EXC_JSHINT_037
			this._oHelper.geValueListEntitySet(this._oMetaData);
		} else {
			this._oMetaData.modelObject = oMetaData.modelObject;
			this._oMetaData.property = oMetaData.property;
			this._oMetaData.annotations.text = oMetaData.annotations.text;
			this._oMetaData.annotations.uom = oMetaData.annotations.uom;
			this._oMetaData.annotations.valuelist = oMetaData.annotations.valuelist;
			this._oMetaData.annotations.lineitem = oMetaData.annotations.lineitem;
			this._oMetaData.annotations.semantic = oMetaData.annotations.semantic;
			this._oMetaData.annotations.valuelistuom = oMetaData.annotations.valuelistuom;
			this._oMetaData.annotations.valuelistentityset = oMetaData.annotations.valuelistentityset;
		}
	};

	/**
	 * Creates a control instance based on OData meta data for display-only use cases.
	 * 
	 * @returns {sap.m.Text} the new control instance.
	 * @private
	 */
	ODataControlFactory.prototype._createEdmDisplay = function() {
		var mAttributes, mOptions, mNames = {
			width: true,
			textAlign: true
		};

		// check for check box.
		if (this._checkCheckBox()) {
			return this._createCheckBox();
		}
		
		// prepare the attributes.
		mAttributes = this.createAttributes(null, this._oMetaData.property, mNames);

		// check for date and format correctly.
		if (this._checkDatePicker()) {
			mOptions = this.getFormatSettings("dateFormatSettings");
			mAttributes.text = {
				model: this._oMetaData.model,
				path: this._oMetaData.path,
				type: this._oTypes.getType(this._oMetaData.property, mOptions, {
					displayFormat: "Date"
				})
			};
		} else {
			mAttributes.text = {
				model: this._oMetaData.model,
				path: this._getEdmDisplayPath(),
				type: this._oTypes.getType(this._oMetaData.property)
			};
		}

		// create a text box.
		return {
			control: new Text(mAttributes),
			onCreate: "_onCreate",
			params: {
				noValidations: true
			}
		};
	};

	/**
	 * Calculates the binding path for the <code>text</code> property for the display use case. If a text annotation exists, it is considered,
	 * otherwise the binding path addresses the property.
	 * 
	 * @returns {string} the binding path.
	 * @private
	 */
	ODataControlFactory.prototype._getEdmDisplayPath = function() {
		if (this._oMetaData.annotations.text) {
			return this._oMetaData.path.replace(this._oMetaData.property.property.name, this._oMetaData.annotations.text.property.name);
		}

		return this._oMetaData.path;
	};

	/**
	 * Creates a control instance based on OData meta data to edit a model property of type <code>Edm.String</code>. Either
	 * <code>sap.m.Input</code> is returned or <code>sap.m.Combobox</code> depending on configuration.
	 * 
	 * @returns {sap.ui.core.Control} the new control instance.
	 * @private
	 */
	ODataControlFactory.prototype._createEdmString = function() {
		var bNoValueHelp, bNoTypeAhead, mAttributes, oCheck, oControl, mNames = {
			width: true,
			textAlign: true,
			placeholder: true,
			name: true
		};

		// check for combo box.
		oCheck = this._checkComboBox("input");

		if (oCheck.combobox) {
			return this._createComboBox({
				annotation: oCheck.annotation,
				noDialog: true,
				noTypeAhead: true
			});
		}

		// check for check box.
		if (this._checkCheckBox()) {
			return this._createCheckBox();
		}
		
		// get the configuration properties.
		bNoValueHelp = !this._oParent.getShowValueHelp();
		bNoTypeAhead = !this._oParent.getShowSuggestion();

		// create the default control, sap.m.Input, respect constraints.
		mAttributes = this.createAttributes("value", this._oMetaData.property, mNames);

		// add optional upper case conversion.
		oControl = new Input(mAttributes);
		this._handleEventingForEdmString(oControl);

		return {
			control: oControl,
			onCreate: "_onCreate",
			params: {
				valuehelp: {
					annotation: oCheck.annotation,
					noDialog: bNoValueHelp,
					noTypeAhead: bNoTypeAhead,
					aggregation: "suggestionRows"
				},
				getValue: "getValue",
				type: {
					type: mAttributes.value.type,
					property: this._oMetaData.property
				}
			}
		};
	};

	/**
	 * Checks whether a configuration exists for the given SmartField. If this is the case the controlType property is a validated.
	 * 
	 * @param {string} sType the value of the type property to be checked against.
	 * @returns {boolean} <code>true</code>, if a configuration exists and the controlType property has the given value, <code>false</code>
	 *          otherwise.
	 * @private
	 */
	ODataControlFactory.prototype._checkConfig = function(sType) {
		var oConfig = this._oParent.getConfiguration();

		if (oConfig && oConfig.getControlType() === sType) {
			return true;
		}

		return false;
	};

	/**
	 * Event handler for live changes/changes on the input control. The live-change event handler ensures the value is always in upper case
	 * 
	 * @param {object} oControl attached either to liveChange or change event
	 * @private
	 */
	ODataControlFactory.prototype._handleEventingForEdmString = function(oControl) {
		var bUpperCase, that = this, bChangeNotFromFocusLost = false, bValueUpperChanged = false, bChangeOnEnter;

		var bKeyDown = false;

		if (oControl) {
			bUpperCase = this._oTypes.isDisplayFormatUpperCase(this._oMetaData.property);

			bChangeOnEnter = bUpperCase ? false : true;

			// handle focus lost
			oControl.attachBrowserEvent("focusout", function() {
				if (bValueUpperChanged) {
					oControl._lastValue = "";
					bChangeNotFromFocusLost = true;
				} else {
					/* eslint-disable no-lonely-if */
					if (bUpperCase) {
						bChangeNotFromFocusLost = false;
					} else {
						bChangeNotFromFocusLost = (bKeyDown) ? false : true;
					}
					/* eslint-enable no-lonely-if */
					//bChangeNotFromFocusLost = bUpperCase ? false : ((bKeyDown) ? false : true);
				}

			}).attachBrowserEvent("keydown", function(e) {
				if (e.which === 13) {
					bChangeOnEnter = true;
					bKeyDown = true;
				}
			}).attachBrowserEvent("keyup", function(e) {
				var sValue = oControl.getValue();

				bKeyDown = false;
				if (e.which === 13) {
					bValueUpperChanged = false;
					if (bChangeOnEnter) {
						try {
							that._oParent.fireChange({
								value: sValue,
								newValue: sValue
							});
						} catch (ex) {
							jQuery.sap.log.warning(ex);
						}
					}
				} else if (bUpperCase) {
					oControl.setValue(sValue.toUpperCase());
					bValueUpperChanged = true;
				}
				bChangeOnEnter = false;
			}).attachChange(function(oEvent) {
				try {
					if (oEvent.mParameters.validated || bChangeNotFromFocusLost) {

						bChangeOnEnter = false;
						bChangeNotFromFocusLost = false;
						bValueUpperChanged = false;

						that._oParent.fireChange({
							value: oEvent.mParameters.value,
							newValue: oEvent.mParameters.value,
							validated: oEvent.mParameters.validated
						});
					} else {
						bChangeOnEnter = true;
					}

				} catch (ex) {
					jQuery.sap.log.warning(ex);
				}
			});
		}
	};

	/**
	 * Creates an instance of <code>sap.m.Combobox</code> based on OData meta data.
	 * 
	 * @param {object} oValueHelp the value help configuration.
	 * @param {object} oValueHelp.annotation the value help annotation.
	 * @param {boolean} oValueHelp.noDialog if set to <code>true</code> the creation of a value help dialog is omitted.
	 * @param {boolean} oValueHelp.noTypeAhead if set to <code>true</code> the type ahead functionality is omitted.
	 * @returns {sap.m.Combobox} the new control instance.
	 * @private
	 */
	ODataControlFactory.prototype._createComboBox = function(oValueHelp) {
		var mAttributes, that = this, mNames = {
			width: true,
			textAlign: true,
			placeholder: true,
			name: true
		};

		mAttributes = this.createAttributes(null, this._oMetaData.property, mNames);
		mAttributes.selectionChange = function(oParam) {
			var oKey, oItem;

			try {
				oItem = oParam.getParameter("selectedItem");

				if (oItem && oItem.getKey) {
					oKey = oItem.getKey();
				}

				that._oParent.fireChange({
					value: oKey,
					newValue: oKey
				});
			} catch (ex) {
				jQuery.sap.log.warning(ex);
			}
		};
		mAttributes.selectedKey = {
			model: this._oMetaData.model,
			path: this._oMetaData.path,
			type: this._oTypes.getType(this._oMetaData.property)
		};
		
		// ensure that combo box always takes maximum width.
		if (mAttributes.width === "") {
			mAttributes.width = "100%";
		}

		return {
			control: new ComboBox(mAttributes),
			onCreate: "_onCreate",
			params: {
				valuehelp: {
					annotation: oValueHelp.annotation,
					aggregation: "items",
					noDialog: oValueHelp.noDialog,
					noTypeAhead: oValueHelp.noTypeAhead
				},
				getValue: "getSelectedKey",
				type: {
					type: mAttributes.selectedKey.type,
					property: this._oMetaData.property
				}
			}
		};
	};

	/**
	 * Creates an instance of <code>sap.m.CheckBox</code> based on OData meta data. The Edm.Type of the property is <code>Edm.String</code> with
	 * <code>maxLength</code> <code>1</code>.
	 * 
	 * @returns {sap.m.CheckBox} the new control instance.
	 * @private
	 */
	ODataControlFactory.prototype._createCheckBox = function() {
		var mAttributes = this.createAttributes("selected", null, {}, {
			event: "select",
			parameter: "selected"
		});
		mAttributes.enabled = (this._oParent.getEditable() && this._oParent.getEnabled());
		mAttributes.selected.type = this._oTypes.getAbapBoolean();
		
		return {
			control: new CheckBox(mAttributes),
			onCreate: "_onCreate",
			params: {
				getValue: "getSelected"
			}
		};
	};
	
	/**
	 * Creates a control instance based on OData meta data to edit a model property of type <code>Edm.DateTime</code>. Either an instance of
	 * <code>sap.m.Input</code> is returned or <code>sap.m.DatePicker</code>, if the attribute <code>display-format</code> of the OData
	 * property the control is bound to has the value <code>Date</code> or the control configuration is accordingly.
	 * 
	 * @returns {sap.ui.core.Control} the new control instance.
	 * @private
	 */
	ODataControlFactory.prototype._createEdmDateTime = function() {
		var mAttributes, mOptions, mNames = {
			width: true,
			textAlign: true,
			placeholder: true,
			name: true
		};

		mAttributes = this.createAttributes(null, this._oMetaData.property, mNames, {
			event: "change",
			parameter: "value"
		});
		mOptions = this.getFormatSettings("dateFormatSettings");

		// check whether a date picker has been configured.
		if (this._checkDatePicker()) {
			mAttributes.value = {
				path: this._oMetaData.path,
				type: this._oTypes.getType(this._oMetaData.property, mOptions, {
					displayFormat: "Date"
				}),
				model: this._oMetaData.model
			};

			// set display format to keep data type and date picker control "in sync".
			if (mOptions && mOptions.style) {
				mAttributes.displayFormat = mOptions.style;
			}

			return {
				control: new DatePicker(mAttributes),
				onCreate: "_onCreate",
				params: {
					getValue: "getValue",
					type: {
						type: mAttributes.value.type,
						property: this._oMetaData.property
					}
				}
			};
		}

		// create the default control.
		mAttributes.value = {
			path: this._oMetaData.path,
			model: this._oMetaData.model,
			type: this._oTypes.getType(this._oMetaData.property, mOptions)
		};

		return {
			control: new Input(mAttributes),
			onCreate: "_onCreate",
			params: {
				getValue: "getValue",
				type: {
					type: mAttributes.value.type,
					property: this._oMetaData.property
				}
			}
		};
	};

	/**
	 * Checks whether a <code>sap.m.DatePicker</code> has to be created. The <code>display-format</code> is evaluated and the control
	 * configuration.
	 * 
	 * @returns {boolean} <code>true</code>, if a <code>sap.m.DatePicker</code> has to be created, <code>false</code> otherwise.
	 * @private
	 */
	ODataControlFactory.prototype._checkDatePicker = function() {
		// check the display-format annotation.
		if (this._oMetaData.property.extensions["sap:display-format"] === "Date") {
			return true;
		}

		// check the control configuration.
		return this._checkConfig("datePicker");
	};

	/**
	 * Creates a control instance based on OData meta data to edit a model property of type <code>Edm.DateTimeOffset</code>.
	 * 
	 * @returns {sap.m.DatePicker} the new control instance.
	 * @private
	 */
	ODataControlFactory.prototype._createEdmDateTimeOffset = function() {
		var mOptions, mAttributes, mNames = {
			width: true,
			textAlign: true,
			placeholder: true,
			name: true
		};

		mOptions = this.getFormatSettings("dateFormatSettings");
		mAttributes = this.createAttributes(null, this._oMetaData.property, mNames, {
			event: "change",
			parameter: "value"
		});
		mAttributes.value = {
			model: this._oMetaData.model,
			path: this._oMetaData.path,
			type: this._oTypes.getType(this._oMetaData.property, mOptions)
		};

		return {
			control: new Input(mAttributes),
			onCreate: "_onCreate",
			params: {
				getValue: "getValue",
				type: {
					type: mAttributes.value.type,
					property: this._oMetaData.property
				}
			}
		};
	};

	/**
	 * Creates a control instance based on OData meta data to edit a model property that is of a numeric <code>Edm type</code>.
	 * 
	 * @returns {sap.m.Input} the new control instance.
	 * @private
	 */
	ODataControlFactory.prototype._createEdmNumeric = function() {
		var mAttributes, mNames = {
			width: true,
			textAlign: true,
			placeholder: true,
			name: true
		};

		mAttributes = this.createAttributes(null, this._oMetaData.property, mNames, {
			event: "change",
			parameter: "value"
		});
		mAttributes.value = {
			model: this._oMetaData.model,
			path: this._oMetaData.path,
			type: this._oTypes.getType(this._oMetaData.property)
		};
		return {
			control: new Input(mAttributes),
			onCreate: "_onCreate",
			params: {
				getValue: "getValue",
				type: {
					type: mAttributes.value.type,
					property: this._oMetaData.property
				}
			}
		};
	};

	/**
	 * Creates a control instance based on OData meta data to edit a model property that represents a unit of measure.
	 * 
	 * @returns {sap.m.Input} the new control instance.
	 * @private
	 */
	ODataControlFactory.prototype._createEdmUOM = function() {
		var sNoUnit, oInput, oText, mAttributes, oObject, mParams, that = this, fChange = function(oParam) {
			try {
				that._oParent.fireChange({
					value: oParam.mParameters.value,
					newValue: oParam.mParameters.value
				});
			} catch (ex) {
				jQuery.sap.log.warning(ex);
			}
		};

		// create the input for the amount.
		mAttributes = this._createEdmUOMAttributes(fChange);
		oObject = this._oParent.getObjectBinding(this._oMetaData.model);
		this.addObjectBinding(mAttributes, oObject);
		oInput = new Input(mAttributes);

		// if the unit is not to be displayed, just return the input for the amount.
		sNoUnit = this._oParent.data("suppressUnit");

		if (sNoUnit && sNoUnit === "true") {
			mParams = {
				getValue: "getValue"
			};

			// if not currency-code, the type has to be completed.
			if (!this._oMetaData.annotations.uom || this._oMetaData.annotations.uom.semantics !== "currency-code") {
				mParams.type = {
					type: mAttributes.value.type,
					property: this._oMetaData.property
				};
			}

			return {
				control: oInput,
				onCreate: "_onCreate",
				params: mParams
			};
		}

		// create the attributes for the unit, including object binding, and the control for the unit.
		mAttributes = {
			value: {
				model: this._oMetaData.model,
				path: this._getUOMPath(this._oMetaData.path, this._oMetaData.property.property.name, this._oMetaData.annotations.uom),
				type: this._oTypes.getType(this._oMetaData.annotations.uom.property)
			},
			change: fChange,
			width: "5rem",
			textAlign: sap.ui.core.TextAlign.End
		};

		this.addObjectBinding(mAttributes, oObject);
		oText = new Input(mAttributes);
		this._handleEventingForEdmString(oText);

		// layout both controls.
		oInput.addStyleClass("smartFieldPaddingRight");
		oInput.setLayoutData(new FlexItemData({
			growFactor: 10
		}));
		oText.setLayoutData(new FlexItemData({
			shrinkFactor: 0
		}));

		// return amount and unit in a horizontal box.
		return {
			control: new HBox({
				justifyContent: sap.m.FlexJustifyContent.End,
				items: [
					oInput, oText
				],
				fitContainer: true,
				width: this._oParent.getWidth()
			}),
			onCreate: "_onCreateUOM",
			params: {
				getValue: true,
				valuehelp: true,
				type: {
					type: mAttributes.value.type,
					property: this._oMetaData.annotations.uom
				}
			}
		};
	};

	/**
	 * Creates the arguments for construction call for the unit of measure.
	 * 
	 * @param {function} fChange event handler for change event.
	 * @returns {map} the arguments for construction call for the unit of measure.
	 * @private
	 */
	ODataControlFactory.prototype._createEdmUOMAttributes = function(fChange) {
		var mAttributes = {
			textAlign: sap.ui.core.TextAlign.End,
			placeholder: this.getAttribute("placeholder"),
			name: this.getAttribute("name"),
			change: fChange
		};

		if (this._oMetaData.annotations.uom && this._oMetaData.annotations.uom.semantics === "currency-code") {
			mAttributes.value = {
				parts: [
					{
						path: this._oMetaData.path
					}, {
						path: this._getUOMPath(this._oMetaData.path, this._oMetaData.property.property.name, this._oMetaData.annotations.uom)
					}
				],
				model: this._oMetaData.model,
				type: this._oTypes.getCurrencyType(this._oMetaData.property)
			};
		} else {
			mAttributes.value = {
				model: this._oMetaData.model,
				path: this._oMetaData.path,
				type: this._oTypes.getType(this._oMetaData.property)
			};
		}

		return mAttributes;
	};

	/**
	 * Creates a control instance based on OData meta data to display a model property that represents a unit of measure.
	 * 
	 * @returns {sap.m.Input} the new control instance.
	 * @private
	 */
	ODataControlFactory.prototype._createEdmUOMDisplay = function() {
		var sNoUnit, oValue, oCurrency, sPath, oObject, mAttributes;

		// if the unit is not to be displayed, just return the text field for the amount.
		sNoUnit = this._oParent.data("suppressUnit");

		if (sNoUnit && sNoUnit === "true") {
			return this._createEdmDisplay();
		}

		// create the text field for the amount.
		sPath = this._getUOMPath(this._oMetaData.path, this._oMetaData.property.property.name, this._oMetaData.annotations.uom);
		mAttributes = {
			text: {
				parts: [
					{
						path: this._oMetaData.path,
						type: this._oTypes.getType(this._oMetaData.property)
					}, {
						path: sPath
					}
				],
				model: this._oMetaData.model,
				formatter: this._oTypes.getCurrencyDisplayFormatter(),
				useRawValues: true
			},
			textAlign: sap.ui.core.TextAlign.End
		};
		oObject = this._oParent.getObjectBinding(this._oMetaData.model);
		this.addObjectBinding(mAttributes, oObject);
		oValue = new Text(mAttributes);

		// create the text field for the unit.
		mAttributes = {
			text: {
				path: sPath
			},
			textAlign: sap.ui.core.TextAlign.End
		};
		this.addObjectBinding(mAttributes, oObject);
		oCurrency = new Text(mAttributes);

		// return amount and unit in a horizontal box.
		return {
			control: new HBox({
				justifyContent: sap.m.FlexJustifyContent.Left,
				items: [
					oValue, oCurrency
				],
				width: this._oParent.getWidth()
			})
		};
	};

	/**
	 * Calculates the binding path for the Unit of Measure text.
	 * 
	 * @param {string} sPropertyPath the path identifying the Unit of Measure property.
	 * @param {string} sPropertyName the name of the Unit of Measure property.
	 * @param {object} oUOM the Unit of Measure annotation.
	 * @returns {string} the binding path for the Unit of Measure text, which can be <code>null</code>.
	 * @private
	 */
	ODataControlFactory.prototype._getUOMPath = function(sPropertyPath, sPropertyName, oUOM) {
		var sPath = (oUOM.text && oUOM.text.name) ? oUOM.text.name : oUOM.unit;

		if (sPath) {
			return sPropertyPath.replace(sPropertyName, sPath);
		}

		return null;
	};

	/**
	 * Creates a control instance based on OData meta data.
	 * 
	 * @returns {sap.ui.core.Control} the new control instance.
	 * @private
	 */
	ODataControlFactory.prototype._createEdmSemantic = function() {
		var sPath, oInfo = this._oParent.getBindingInfo("value");
		sPath = oInfo.parts[0].path;

		var sLabel = this._oMetaData.property.property.fieldLabel;
		if (this._oMetaData.annotations.lineitem && this._oMetaData.annotations.lineitem.labels && this._oMetaData.annotations.lineitem.labels[sPath]) {
			sLabel = this._oMetaData.annotations.lineitem.labels[sPath];
		}

		return {
			control: new SmartLink({
				semanticObject: this._oMetaData.annotations.semantic.semanticObject,
				semanticObjectLabel: sLabel,
				fieldName: sPath,
				text: {
					path: sPath,
					model: this._oMetaData.model
				},
				width: this.getAttribute("width"),
				createControlCallback: jQuery.proxy(function() {
					var oControl = this.createControl(true);
					if (oControl) {
						return oControl.control;
					}
					return null;
				}, this)
			}),
			onCreate: "_onCreate",
			params: {
				getValue: "getInnerControlValue"
			}
		};
	};

	/**
	 * Creates a control instance based on OData meta data to edit a model property that is of type <code>Edm.Boolean</code>
	 * 
	 * @returns {sap.m.CheckBox} the new control instance.
	 * @private
	 */
	ODataControlFactory.prototype._createEdmBoolean = function() {
		var mAttributes, oCheck;
		
		oCheck = this._checkComboBox();

		if (oCheck.combobox) {
			return this._createComboBox({
				annotation: oCheck.annotation,
				noDialog: true,
				noTypeAhead: true
			});
		}

		mAttributes = this.createAttributes("selected", this._oMetaData.property, {}, {
			event: "select",
			parameter: "selected"
		});
		mAttributes.enabled = (this._oParent.getEditable() && this._oParent.getEnabled());
		
		return {
			control: new CheckBox(mAttributes),
			onCreate: "_onCreate",
			params: {
				getValue: "getSelected"
			}
		};
	};

	/**
	 * Checks whether a combo-box should be displayed.
	 * 
	 * @param {string} sType optional control type to overwrite value list annotation
	 * @returns {object} a flag indicating whether a combo-box should be displayed and the value list annotation to use the control to be created
	 *          regardless of whether a combo-box has to be created or not.
	 * @private
	 */
	ODataControlFactory.prototype._checkComboBox = function(sType) {
		var mAttributes, oResult = {};

		// no annotation means no combo box in any case.
		if (this._oMetaData.annotations.valuelist && this._oMetaData.annotations.valuelist.primaryValueListAnnotation) {
			oResult.annotation = this._oMetaData.annotations.valuelist;
		}

		if (!oResult.annotation) {
			return oResult;
		}

		// overwrite the behavior optionally.
		if (sType && this._checkConfig(sType)) {
			return oResult;
		}

		//check semantics attribute on entity set.
		if (this._oHelper && this._oMetaData.annotations.valuelistentityset) {
			mAttributes = this._oHelper.getAttributes(this._oMetaData.annotations.valuelistentityset, "extensions", {
				"semantics": "http://www.sap.com/Protocols/SAPData"
			});
		}

		if (mAttributes && mAttributes.semantics === "fixed-values") {
			oResult.combobox = true;
		}

		// check configuration to find out whether a combo box should be created.
		if (!oResult.combobox) {
			oResult.annotation = this._oMetaData.annotations.valuelist;
			oResult.combobox = this._checkConfig("dropDownList");
		}

		return oResult;
	};

	/**
	 * Returns <code>true</code>, if a check box has to be rendered. The prerequisite is a property of Edm.type string with a maximum length of 1.
	 * Additionally the control has to be configured as a check box. 
	 * 
	 * @returns {boolean} <code>true</code>, if a check box has to be rendered <code>false</code> otherwise, 
	 * @private
	 */
	ODataControlFactory.prototype._checkCheckBox = function() {
		var oBind, iMaxLength;
		
		if (this._oMetaData.property.property.type === "Edm.String") {
			oBind = this._oParent.getBindingInfo("value");
			iMaxLength = this._oTypes.getMaxLength(this._oMetaData.property, oBind);
			
			if (iMaxLength === 1) {
				if (this._checkConfig("checkBox")) {
					return true;
				}				
			}
		}
	
		return false;
	};
	
	/**
	 * Returns the name of a method to create a control.
	 * 
	 * @param {boolean} bBlockSmartLinkCreation if true, SmartLink will not be created
	 * @returns {string} the name of the factory method to create the control.
	 * @private
	 */
	ODataControlFactory.prototype._getCreator = function(bBlockSmartLinkCreation) {
		var mMethods = {
			"Edm.Decimal": "_createEdmNumeric",
			"Edm.Double": "_createEdmNumeric",
			"Edm.Float": "_createEdmNumeric",
			"Edm.Single": "_createEdmNumeric",
			"Edm.Int16": "_createEdmNumeric",
			"Edm.Int32": "_createEdmNumeric",
			"Edm.Int64": "_createEdmNumeric",
			"Edm.Byte": "_createEdmNumeric",
			"Edm.DateTimeOffset": "_createEdmDateTimeOffset",
			"Edm.DateTime": "_createEdmDateTime",
			"Edm.Boolean": "_createEdmBoolean",
			"Edm.String": "_createEdmString"
		};

		// check for semantic annotation.
		if (this._oMetaData.annotations && this._oMetaData.annotations.semantic && !bBlockSmartLinkCreation) {
			return "_createEdmSemantic";
		}

		// check for display mode.
		if (!this._oParent.getEditable() || !this._oParent.getEnabled()) {
			if (this._oMetaData.annotations && this._oMetaData.annotations.uom) {
				return "_createEdmUOMDisplay";
			}

			return (this._oMetaData.property.property.type === "Edm.Boolean") ? "_createEdmBoolean" : "_createEdmDisplay";
		}

		// check for unit of measure.
		if (this._oMetaData.annotations && this._oMetaData.annotations.uom) {
			return "_createEdmUOM";
		}

		// check by EdmType.
		return mMethods[this._oMetaData.property.property.type] || "_createEdmString";
	};

	/**
	 * Event handler, that is invoked after successful creation of a nested control.
	 * 
	 * @param {sap.ui.core.Control} oControl the new control.
	 * @param {map} mParams parameters to further define the behavior of the event handler.
	 * @param {function} mParams.getValue optional call-back to get the current value from the current control.
	 * @param {boolean} mParams.valuehelp if set to <code>true</code> a possibly existing value help is attached to the new control.
	 * @private
	 */
	ODataControlFactory.prototype._onCreate = function(oControl, mParams) {
		var sGetValue, fControl, bValidations = true;

		if (mParams) {
			// check for validation.
			if (mParams.noValidation) {
				bValidations = false;
			}

			// add optional value help.
			if (mParams.valuehelp) {
				this._getValueHelpDialogTitle(mParams.valuehelp);
				this.addValueHelp(oControl, this._oMetaData.property.property, mParams.valuehelp, this._oModel || this._oMetaData.modelObject);
			}

			// add optional getValue call-back.
			if (mParams.getValue) {
				sGetValue = mParams.getValue;
				mParams.getValue = function() {
					return oControl[sGetValue]();
				};
			}

			//complete the data: add field-control.
			if (mParams.type) {
				fControl = this._oFieldControl.getMandatoryCheck(mParams.type.property);

				if (fControl) {
					mParams.type.type.oFieldControl = fControl;
				}
			}
		}

		// add optional validations.
		if (bValidations) {
			this.addValidations(oControl, "setSimpleClientError");
		}
	};

	/**
	 * Calculates the title for the value help dialog.
	 * 
	 * @param {object} oValueHelp the value help configuration.
	 * @param {object} oValueHelp.annotation the value help annotation.
	 * @param {string} oValueHelp.aggregation the aggregation to attach the value list to.
	 * @param {boolean} oValueHelp.noDialog if set to <code>true</code> the creation of a value help dialog is omitted.
	 * @param {boolean} oValueHelp.noTypeAhead if set to <code>true</code> the type ahead functionality is omitted.
	 * @param {string} oValueHelp.dialogtitle title for the value help dialog.
	 * @private
	 */
	ODataControlFactory.prototype._getValueHelpDialogTitle = function(oValueHelp) {
		var mAttributes, sLabel;

		sLabel = this._oParent.getTextLabel();

		if (sLabel) {
			oValueHelp.dialogtitle = sLabel;
		} else {
			if (this._oHelper) {
				mAttributes = this._oHelper.getAttributes(this._oMetaData.property.property, "extensions", {
					"label": "http://www.sap.com/Protocols/SAPData"
				});
			}

			if (mAttributes && mAttributes.label) {
				oValueHelp.dialogtitle = mAttributes.label;
			} else {
				oValueHelp.dialogtitle = this._oMetaData.property.property.name;
			}
		}
	};

	/**
	 * Event handler, that is invoked after successful creation of a nested control.
	 * 
	 * @param {sap.ui.core.Control} oControl the new control.
	 * @param {map} mParams parameters to further define the behavior of the event handler.
	 * @param {function} mParams.getValue optional call-back to get the current value from the current control.
	 * @param {boolean} mParams.valuehelp if set to <code>true</code> a possibly existing value help is attached to the new control.
	 * @private
	 */
	ODataControlFactory.prototype._onCreateUOM = function(oControl, mParams) {
		var aItems, oValueHelp, fControl, sMethod, len;

		// add validations to both nested controls.
		aItems = oControl.getItems();
		len = aItems.length;

		while (len--) {
			if (len === 0) {
				sMethod = "setComplexClientErrorFirstOperand";
			} else {
				sMethod = "setComplexClientErrorSecondOperand";
			}

			this.addValidations(aItems[len], sMethod);
		}

		// add optional value help.
		if (mParams.valuehelp) {
			oValueHelp = {
				annotation: this._oMetaData.annotations.valuelistuom,
				aggregation: "suggestionRows"
			};
			this._getValueHelpDialogTitle(oValueHelp);
			this.addValueHelp(aItems[1], this._oMetaData.annotations.uom.property.property, oValueHelp, this._oModel || this._oMetaData.modelObject);
		}

		// add optional value call-back.
		if (mParams && mParams.getValue) {
			mParams.getValue = function() {
				return aItems[0].getValue();
			};
		}

		// add optional unit of measure call-back.
		mParams.uom = function() {
			return aItems[1].getValue();
		};

		mParams.uomset = function(sValue) {
			aItems[1].setValue(sValue);
		};

		//complete the data: add field-control.
		if (mParams.type) {
			fControl = this._oFieldControl.getMandatoryCheck(mParams.type.property.property);

			if (fControl) {
				mParams.type.type.oFieldControl = fControl;
			}
		}
	};

	/**
	 * Binds the properties of the control to formatter functions.
	 * 
	 * @public
	 */
	ODataControlFactory.prototype.bind = function() {
		var that = this, mNames;

		// in case of table there is no need to bind visible and mandatory properties.
		if (this._oParent.data("configdata")) {
			mNames = {
				enabled: true
			};
		} else {
			mNames = {
				enabled: true,
				visible: true,
				mandatory: true
			};
		}

		if (!this._bInitialized) {
			this._bInitialized = true;

			if (this._bMetaData || this._oModel.oMetadata.bLoaded) {
				this._bind(mNames);
			} else {
				this._oModel.getMetaModel().loaded().then(function() {
					that._bind(mNames);
				});
			}
		}
	};

	/**
	 * Replaces the given bindings by formatter functions.
	 * 
	 * @param {map} mBindings current bindings on <code>SmartField</code>.
	 * @private
	 */
	ODataControlFactory.prototype._bind = function(mBindings) {
		var n, oFormatter, mFormatters, aParts;

		mFormatters = this._oFieldControl.getControlProperties(this._oMetaData, mBindings);

		for (n in mFormatters) { // EXC_JSHINT_041
			oFormatter = mFormatters[n];

			if (oFormatter) {
				aParts = oFormatter.path();

				if (aParts.length > 0) {
					this._oParent.bindProperty(n, {
						parts: aParts,
						model: this._oMetaData.model,
						formatter: oFormatter.formatter
					});
				} else {
					this._oParent.bindProperty(n, {
						path: "",
						model: this._oMetaData.model,
						formatter: oFormatter.formatter
					});
				}
			}
		}

		// notify that the meta data are available
		this._oParent.fireInitialise();
	};

	/**
	 * Returns the property of the oData
	 * 
	 * @returns {object} the oData property
	 * @public
	 */
	ODataControlFactory.prototype.getDataProperty = function() {
		return this._oMetaData.property;
	};

	/**
	 * Frees all resources claimed during the life-time of this instance.
	 * 
	 * @public
	 */
	ODataControlFactory.prototype.destroy = function() {
		this._oFieldControl.destroy();
		this._oTypes.destroy();

		if (!this._bMetaData) {
			this._oHelper.destroy();
		}

		this._oHelper = null;
		this._oFieldControl = null;
		this._oTypes = null;
		this._oMetaData = null;

		ControlFactoryBase.prototype.destroy.apply(this, []);
	};

	return ODataControlFactory;
}, true);
