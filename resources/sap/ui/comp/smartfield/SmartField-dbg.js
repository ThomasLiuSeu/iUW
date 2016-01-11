/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartfield.SmartField.
sap.ui.define([ "jquery.sap.global", "sap/ui/comp/library", "./JSONControlFactory", "./ODataControlFactory", "sap/ui/core/Control", "sap/ui/model/ParseException", "sap/ui/model/ValidateException" ], function(jQuery, library, JSONControlFactory, ODataControlFactory, Control, ParseException, ValidateException) { //EXC_JSHINT_034  //EXC_JSHINT_037
	"use strict";
	

	/**
	 * Constructor for a new smartfield/SmartField.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The SmartField Control is a wrapper for other controls. It interprets OData meta data to determine the control that has to be
	 *        instantiated. The OData entity is deduced from the control's binding context. The OData entity's property that is changed or
	 *        displayed with the control is deduced from the control's value property. The control's value property can also be bound to a
	 *        property of a JSON model. In this case the SmartField uses its jsontype property to determine the control to be created.
	 * @extends sap.ui.core.Control
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartfield.SmartField
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SmartField = Control.extend("sap.ui.comp.smartfield.SmartField", /** @lends sap.ui.comp.smartfield.SmartField.prototype */ { metadata : {
		library : "sap.ui.comp",
		properties : {
			/**
			 * The Value Property holds the current value of the control. If a binding expression is configured, this is used to determine the property of an OData entity.
			 */
			value : {type : "any", group : "Misc", defaultValue : null},
	
			/**
			 * Enabled Property
			 */
			enabled : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * The name of entity set for which the control manages values. This is an optional property.
			 */
			entitySet : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Sets the control into an editable mode or a display mode.
			 */
			editable : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * The width can be set to an absolute value.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
	
			/**
			 * Horizontal alignment of the text.
			 */
			textAlign : {type : "sap.ui.core.TextAlign", group : "Misc", defaultValue : null},
	
			/**
			 * Text shown when no value available.
			 */
			placeholder : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * To be used in the HTML code (e.g. for HTML forms that send data to the server via 'submit').
			 */
			name : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Visualizes warnings or errors.
			 */
			valueState : {type : "sap.ui.core.ValueState", group : "Appearance", defaultValue : sap.ui.core.ValueState.None},
	
			/**
			 * The text which is shown in the value state message popup.
			 */
			valueStateText : {type : "string", group : "Appearance", defaultValue : null},
	
			/**
			 * The text which is shown in the value state message popup.
			 */
			showValueStateMessage : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * Data types to be used, if the SmartField is working with a JSON model. ; so if the value property of the control is
			 * bound to a property of an OData entity set, this property is not considered.
			 */
			jsontype : {type : "sap.ui.comp.smartfield.JSONType", group : "Misc", defaultValue : null},
	
			/**
			 * Mandatory property.
			 */
			mandatory : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * Maximum number of characters. Value '0' means the feature is switched off.
			 */
			maxLength : {type : "int", group : "Misc", defaultValue : 0},
	
			/**
			 * If this is set to true, the suggestion feature for a hosted control is enabled, if the hosted control supports it.
			 */
			showSuggestion : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * If set to true, a value help indicator will be displayed inside the hosted control, if the hosted control supports this.
			 */
			showValueHelp : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * If set to false the label is not displayed.
			 */
			showLabel : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * This property allows to handle the text of an associated smart label.
			 */
			textLabel : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * This property allows to handle the tool tip of the associated smart label.
			 */
			tooltipLabel : {type : "string", group : "Misc", defaultValue : null}
		},
		aggregations : {
			/**
			 * Content Aggregation.
			 */
			_content : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}, 
	
			/**
			 * Optional configuration for SmartField.
			 */
			configuration : {type : "sap.ui.comp.smartfield.Configuration", multiple : false}
		},
		events : {
			/**
			 * The OData entity set is either deduced from the control's binding context or from control's entity set property, if a
			 * value for it is specified. In both cases this event is raised.
			 */
			entitySetFound : {}, 
	
			/**
			 * Event is fired when the text in the field has changed and the focus leaves the TextField or the Enter key is pressed.
			 */
			change : {}, 
	
			/**
			 * Event fired when the smart field is initialized and the metadata obtained
			 */
			initialise : {},
			
			/**
			 * The event is fired, if the visibility of the control has changed.
			 */
			visibleChanged: {}
		}
	}});
	
	/**
	 * Returns the Edm data type of either the OData property to which the value property of the control is bound or the data 
	 * type of the attribute in the JSON model used. If no model is available null is returned.
	 *
	 * @name sap.ui.comp.smartfield.SmartField#getDataType
	 * @function
	 * @type string
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	/**
	 * If the OData property the control's value property is bound to semantically represents a unit of measure the value of the current unit of measure is returned. Otherwise null is returned.
	 *
	 * @name sap.ui.comp.smartfield.SmartField#getUnitOfMeasure
	 * @function
	 * @type string
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	/**
	 * If the OData property the control's value property is bound to semantically represents a unit of measure the value of the current unit of measure can be changed.
	 *
	 * @name sap.ui.comp.smartfield.SmartField#setUnitOfMeasure
	 * @function
	 * @param {string} sSUnit
	 *         The new unit of measure to be set.
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	/**
	 * Initialize the control.
	 * 
	 * @private
	 */
	SmartField.prototype.init = function() {
		this._oFactory = null;
		this._oControl = {
			display: null,
			edit: null,
			current: null
		};
		this._oValue = {
			display: null,
			edit: null,
			uom: null,
			uomset: null
		};
		this._oError = {
			bComplex: false,
			bFirst: false,
			bSecond: false
		};
		this._oValueBind = null;
	};
	
	/**
	 * Setter for property <code>visible</code>. Default value is <code>true</code>.
	 * 
	 * @param {boolean} bValue new value for property <code>editable</code>.
	 * @param {boolean} bSuppressInvalidate if <code>true</code>, the managed object is not marked as changed
	 * @return {sap.ui.comp.smartfield.SmartField} <code>this</code> to allow method chaining.
	 * @public
	 */
	SmartField.prototype.setVisible = function(bValue, bSuppressInvalidate) {  //EXC_JSHINT_002
		Control.prototype.setVisible.apply(this, arguments);
		this.fireVisibleChanged({
			visible: bValue
		});
		return this;
	};
	
	/**
	 * Setter for property <code>editable</code>. Default value is <code>false</code>.
	 * 
	 * @param {boolean} bValue new value for property <code>editable</code>.
	 * @return {sap.ui.comp.smartfield.SmartField} <code>this</code> to allow method chaining.
	 * @public
	 */
	SmartField.prototype.setEditable = function(bValue) {
		this.setProperty("editable", bValue, true);
		this._toggleControl();
		return this;
	};
	
	/**
	 * Setter for property <code>entitySet</code>. Default value is <code>undefined</code>.
	 * 
	 * @param {string} sValue new value for property <code>entitySet</code>.
	 * @return {sap.ui.comp.smartfield.SmartField} <code>this</code> to allow method chaining.
	 * @public
	 */
	SmartField.prototype.setEntitySet = function(sValue) {
		this.setProperty("entitySet", sValue, true);
		this.fireEntitySetFound({
			entitySet: sValue
		});
		return this;
	};
	
	/**
	 * Setter for property <code>enabled</code>. Default value is <code>true</code>.
	 * 
	 * @param {boolean} bValue new value for property <code>enabled</code>.
	 * @return {sap.ui.comp.smartfield.SmartField} <code>this</code> to allow method chaining.
	 * @public
	 */
	SmartField.prototype.setEnabled = function(bValue) {
		this.setProperty("enabled", bValue, true);
		this._toggleControl();
		return this;
	};
	
	/**
	 * Returns the value for the <code>value</code> property .
	 * 
	 * @return {any} the value of the property
	 * @public
	 */
	SmartField.prototype.getValue = function() {
		var sProp, fProp;
	
		// as two-way-binding cannot be assumed to be a prerequisite,
		// check for a call-back and return the current value.
		sProp = this._getMode();
		fProp = this._oValue[sProp];
	
		if (fProp) {
			return fProp();
		}
	
		// as fall-back return the property value.
		return this.getProperty("value");
	};
	
	/**
	 * Updates the binding context of this object and all aggregated children.
	 * 
	 * @param {boolean} bSkipLocal if set to <code>true</code>, the binding context of this object is not updated, possible aggregated children are
	 *        considered.
	 * @param {boolean} bSkipChildren if set to <code>true</code>, the binding context of aggregated children is not updated.
	 * @param {string} sModelName the optional name of a specific model to update.
	 * @param {boolean} bUpdateAll if set to <code>true</code>, all known models are used for the update.
	 * @private
	 */
	SmartField.prototype.updateBindingContext = function(bSkipLocal, bSkipChildren, sModelName, bUpdateAll) {
		this._init(sModelName);
	
		if (this._oFactory) {
			if (this._oFactory.bind) {
				this._oFactory.bind();
			} else {
				this._toggleControl();
			}
		}
	
		Control.prototype.updateBindingContext.apply(this, [
			bSkipLocal, bSkipChildren, sModelName, bUpdateAll
		]);
	};
	
	/**
	 * Returns the current SmartField's edit mode
	 * 
	 * @returns {string} returns "edit" or "display"
	 * @private
	 */
	SmartField.prototype._getMode = function() {
		return this.getEditable() && this.getEnabled() ? "edit" : "display";
	};
	
	/**
	 * Sets the current control, depending on <code>displayMode</code> and the binding of the <code>value</code> property of the current control. If
	 * necessary a control is created.
	 * 
	 * @private
	 */
	SmartField.prototype._toggleControl = function() {
		var sMode, oValue, bCreate = true;

		sMode = this._getMode();
	
		if (sMode === "edit") { // always create control if in edit mode
			// _createControl sets the current mode.
			this._createControl(sMode);
		} else {
			oValue = this.getValue();
			
			// optimization for table use cases only.
			// if it is not a table, no configuration data set.
			if (this.data("configdata")) {
				if (oValue === null || oValue === "") {
					bCreate = false;
				}
			}
			
			if (bCreate) { // in display mode, only create control if value is not empty
				// _createControl sets the current mode.
				this._createControl(sMode);
			} else {
				this.setAggregation("_content", null); // if value is empty, our content has to be null
				// better set the current mode, otherwise toggling gets out-of-sync.
				this._oControl.current = "display";
			}
		}
	};
	
	/**
	 * Setter for property <code>value</code>. Default value is <code>true</code>.
	 * 
	 * @param {object} oValue new value for property <code>value</code>.
	 * @return {sap.ui.comp.smartfield.SmartField} <code>this</code> to allow method chaining.
	 * @public
	 */
	SmartField.prototype.setValue = function(oValue) {
		var oReturnValue = this.setProperty("value", oValue);
		this._toggleControl();
	
		return oReturnValue;
	};
	
	/**
	 * Creates the actual control depending on the current edit mode and sets it to the SmartField's content
	 * 
	 * @param {string} sMode the current edit mode, either "edit" or "display"
	 * @private
	 */
	SmartField.prototype._createControl = function(sMode) {
		var oControl;
	
		if (this._oFactory) {
			if (sMode !== this._oControl.current || !this._oControl[sMode]) {
				if (!this._oControl[sMode]) {				
					// create the control and set it.
					oControl = this._oFactory.createControl();
					this._oControl[sMode] = oControl.control;
	
					// set the value call-back.
					if (oControl.params && oControl.params.getValue) {
						this._oValue[sMode] = oControl.params.getValue;
					}
	
					// set the unit-of-measure-get call-back.
					if (oControl.params && oControl.params.uom) {
						this._oValue.uom = oControl.params.uom;
					}
	
					// set the unit-of-measure-set call-back.
					if (oControl.params && oControl.params.uomset) {
						this._oValue.uomset = oControl.params.uomset;
					}
				}
	
				// set the content.
				this._oControl.current = sMode;
				this.setAggregation("_content", this._oControl[sMode]);
			}
		}
	};
	
	/**
	 * Initializes the control, if it has not already been initialized.
	 * 
	 * @param {string} sModelName the name of the model currently used.
	 * @private
	 */
	SmartField.prototype._init = function(sModelName) {
		var oModel, oBindingInfo, oConfig;
	
		if (!this._oFactory) {
			oBindingInfo = this._getBindingInfo(sModelName, "value");
	
			if (oBindingInfo) {
				oConfig = this.data("configdata");
	
				if (!oConfig) {
					oModel = this.getModel(sModelName);
				}
	
				if (oConfig || oModel) {
					this._oFactory = this._createFactory(sModelName, oModel, oBindingInfo, oConfig);
				}
			}
		}
	};
	
	/**
	 * Creates the control factory and returns it. If the variable <code>oModel</code> is <code>null</code> or <code>undefined</code>,
	 * <code>null</code> is returned.
	 * 
	 * @param {string} sModelName the name of the model currently used.
	 * @param {sap.ui.model.Model} oModel the model currently used.
	 * @param {object} oBindingInfo the binding information from the control for the <code>value</code> property.
	 * @param {object} oConfig optional control configuration.
	 * @returns {sap.ui.comp.smartfield.ControlFactoryBase} the new control factory instance.
	 * @private
	 */
	SmartField.prototype._createFactory = function(sModelName, oModel, oBindingInfo, oConfig) {
		var sEntitySet, oParam;
	
		// check whether JSONControlFactoryl can be created.
		if (oModel && oModel instanceof sap.ui.model.json.JSONModel) {
			return new JSONControlFactory(oModel, this, {
				model: sModelName,
				path: oBindingInfo.path
			});
		}
	
		// check whether ODataControlFactory can be created.
		if (!oConfig) {
			sEntitySet = this._getEntitySet(sModelName);
		}
	
		if (sEntitySet || oConfig) {
			if (oConfig) {
				oParam = oConfig.configdata;
			} else {
				oParam = {
					entitySet: sEntitySet,
					model: sModelName,
					path: oBindingInfo.path
				};
			}
	
			return new ODataControlFactory(oModel, this, oParam);
		}
	
		return null;
	};
	
	/**
	 * Calculates the <code>entitySet</code> that is interpreted by this control. The calculation uses either the <code>bindingContext</code> of this
	 * control or alternatively the property <code>entitySet</code>.
	 * 
	 * @param {string} sModelName the name of the model currently used.
	 * @returns {string} the <code>entitySet</code> that is interpreted by this control.
	 * @private
	 */
	SmartField.prototype._getEntitySet = function(sModelName) {
		var oBindingContext, sEntitySet;
	
		// check the entity set property.
		sEntitySet = this.getEntitySet();
	
		if (sEntitySet && !sModelName) {			
			return sEntitySet;
		}
	
		// take the entity set from the binding context.
		oBindingContext = this.getBindingContext(sModelName);
	
		if (oBindingContext) {			
			// check for a defective binding.
			if (!oBindingContext.sPath || (oBindingContext.sPath && oBindingContext.sPath === "/undefined")) {				
				return null;
			}
			
			sEntitySet = this._parseEntity(oBindingContext);
			this.fireEntitySetFound({
				entitySet: sEntitySet
			});
			
			return sEntitySet;
		}
	
		return null;
	};
	
	/**
	 * Calculates the name of the OData entity or entity set a binding context points to.
	 * 
	 * @param {object} oContext the binding context of a control.
	 * @returns {string} name of the OData entity or entity set a binding context points to.
	 * @private
	 */
	SmartField.prototype._parseEntity = function(oContext) {
		var oRegExp, aMatches, sEntity;
	
		oRegExp = /\((.+)\)/;
		aMatches = oRegExp.exec(oContext.sPath);
	
		if (aMatches) {
			sEntity = oContext.sPath.replace(aMatches[0], "");
		} else {
			sEntity = oContext.sPath;
		}
	
		return sEntity.replace("/", "");
	};
	
	/**
	 * Returns the binding information for the given property or aggregation. The binding information contains information about path, binding object,
	 * format options, sorter, filter etc. for the property or aggregation.
	 * 
	 * @param {string} sModel the optional name of a specific model to update.
	 * @param {string} sName the name of the property or aggregation
	 * @returns {object} binding information of the value binding of this control, if the model is the appropriate one, <code>null</code> otherwise.
	 * @private
	 */
	SmartField.prototype._getBindingInfo = function(sModel, sName) {
		if (!this._oValueBind) {
			this._oValueBind = this.getBindingInfo(sName);
	
			try {
				this._oValueBind = this._oValueBind.parts[0];
			} catch (ex) {
			}
		}
	
		if (this._oValueBind) {
			if (!this._oValueBind.model && !sModel) {
				return this._oValueBind;
			}
	
			if (this._oValueBind.model === sModel) {
				return this._oValueBind;
			}
		}
	
		return null;
	};
	
	/**
	 * Message handling.
	 * @param {string} sName The Property Name.
	 * @param {array} aMessages Array of Messages.
	 */	
	SmartField.prototype.updateMessages = function(sName, aMessages) {
		if (aMessages && aMessages.length > 0) {
			this.setValueState(aMessages[0].type);
			this.setValueStateText(aMessages[0].message);
		} else {
			this.setValueState(sap.ui.core.ValueState.None);
			this.setValueStateText("");
		}
	};
	
	/**
	 * Returns the EDM data type of either the OData property to which the value property of the control is bound or the data type of the attribute in the
	 * JSON model used. If no model is available null is returned.
	 * 
	 * @returns {string} the data type to which the value property is bound.
	 * @public
	 */
	SmartField.prototype.getDataType = function() {
		var oProp;
	
		if (this._oFactory) {
			// only ODataControlFactory has the method getDataType.
			if (this._oFactory.getDataProperty) {
				oProp = this._oFactory.getDataProperty();
	
				if (oProp) {
					return oProp.property.type;
				}
			}
	
			return this.getJsonType();
		}
	
		return null;
	};
	
	/**
	 * Returns the property of the oData.
	 * 
	 * @returns {object} the oData property.
	 * @public
	 */
	SmartField.prototype.getDataProperty = function() {
		if (this._oFactory) {
			// only ODataControlFactory has the method getDataProperty.
			if (this._oFactory.getDataProperty) {
				return this._oFactory.getDataProperty();
			}
	
			return null;
		}
	
		return null;
	};
	
	/**
	 * If the OData property the control's value property is bound to semantically represents a unit of measure, the value of the current unit of measure
	 * is returned; otherwise <code>null</code> is returned.
	 * 
	 * @returns {any} the current unit of measure is returned, which can be <code>null</code.
	 * @public
	 */
	SmartField.prototype.getUnitOfMeasure = function() {
		if (this._oValue.uom) {
			return this._oValue.uom();
		}
	
		return null;
	};
	
	/**
	 * If the OData property the control's value property is bound to semantically represents a unit of measure the value of the current unit of measure
	 * can be changed.
	 * 
	 * @param {string} sUnit the new unit of measure to be set.
	 * @public
	 */
	SmartField.prototype.setUnitOfMeasure = function(sUnit) {
		if (sUnit && this._oValue.uomset) {
			this._oValue.uomset(sUnit);
		}
	};

	/**
	 * Setter method to mark the smart field as having a client error.
	 * 
	 * @param {boolean} bError if set to <code>true</code> the field is marked as having an error.
	 * @public
	 */
	SmartField.prototype.setSimpleClientError = function(bError) {
		this._oError.bFirst = bError;
	};
	
	/**
	 * Setter method to mark the smart field as having a client error.
	 * 
	 * @param {boolean} bError if set to <code>true</code> the field is marked as having an error.
	 * @public
	 */
	SmartField.prototype.setComplexClientErrorFirstOperand = function(bError) {
		this._oError.bComplex = true;
		this._oError.bFirst = bError;
	};
	
	/**
	 * Setter method to mark the smart field as having a client error.
	 * 
	 * @param {boolean} bError if set to <code>true</code> the field is marked as having an error.
	 * @public
	 */
	SmartField.prototype.setComplexClientErrorSecondOperand = function(bError) {
		this._oError.bComplex = true;
		this._oError.bSecond = bError;
	};
	
	/**
	 * Returns <code>true</code>, if a client error has been detected, <code>false</code> otherwise.
	 * 
	 * @returns {boolean} <code>true</code>, if a client error has been detected, <code>false</code> otherwise.
	 * @private
	 */
	SmartField.prototype._hasClientError = function() {
		if (this._oError.bComplex) {
			return this._oError.bFirst || this._oError.bSecond;
		}

		return this._oError.bFirst;
	};
	
	/**
	 * Returns <code>true</code>, if a client error is detected, <code>false</code> otherwise. Additionally the error message is shown, if
	 * this is not the case already.
	 * 
	 * @returns {boolean} <code>true</code>, if a client error has been detected, <code>false</code> otherwise.
	 * @public
	 */
	SmartField.prototype.checkClientError = function() {
		var aChildren, len;
		
		// in display mode: no error.
		if (this._getMode() === "display") {
			return false;
		}
		
		// a client error has already been detected.
		if (this._hasClientError()) {
			return true;
		}
		
		// check again.
		aChildren = this.getInnerControls();
		len = aChildren.length;
			
		while (len--) {
			this._checkClientError(aChildren[len]);
		}
			
		// return a possibly detected error.
		return this._hasClientError();
	};
	
	/**
	 * Checks for a client error on the given control. Additionally the error message is shown, if this is not the case already.
	 * 
	 * @param {sap.ui.core.Control} oControl the control to be checked.
	 * @private
	 */
	SmartField.prototype._checkClientError = function(oControl) {
		var oBind, sMethod, sParam, mParameters = {
			"sap.m.Input": "value",
			"sap.m.DatePicker": "value",
			"sap.m.ComboBox": "selectedKey"
		};
		
		sParam = mParameters[oControl.getMetadata()._sClassName];
		
		if (sParam) {
			oBind = oControl.getBinding(sParam);
		}
		
		if (oBind) {
			try {
				sMethod = "get" + sParam.substring(0, 1).toUpperCase() + sParam.substring(1);
				oBind.setExternalValue(oControl[sMethod]());
			} catch (ex) {
				if (ex instanceof ParseException) {
					oControl.fireParseError({
						exception: ex 
					});
				}
				
				if (ex instanceof ValidateException) {
					oControl.fireValidationError({
						exception: ex 
					});
				}
			}
		}
	};
	
	/**
	 * Resolves the controls hosted currently by this <code>Smart Field</code>.
	 * 
	 * @returns {array} the controls hosted currently by this <code>Smart Field</code>.
	 * @public
	 */
	SmartField.prototype.getInnerControls = function() {
		var oContent, fContent, mComplex = {
			"sap.m.HBox": function(oControl) {
				return oControl.getItems();
			},
			"sap.ui.comp.navpopover.SmartLink": function(oControl) {
				var aItems = oControl.getAggregation("innerControl");
				
				if (!aItems) {
					return [];
				}
				
				return aItems;
			}
		};

		oContent = this.getAggregation("_content");
		fContent = mComplex[oContent.getMetadata()._sClassName];

		if (fContent) {
			return fContent(oContent);
		}

		return [ oContent ];
	};
	
	/**
	 * Cleans up the resources associated with this element and all its children.
	 * 
	 * @public
	 */
	SmartField.prototype.exit = function() {
		var oInactiveInnerControl = null;
	
		if (this._oFactory) {
			this._oFactory.destroy();
		}
	
		if (this._getMode() === "edit") {
			oInactiveInnerControl = this._oControl["display"]; // EXC_JSHINT_018
		} else {
			oInactiveInnerControl = this._oControl["edit"]; // EXC_JSHINT_018
		}
	
		if (oInactiveInnerControl && oInactiveInnerControl.destroy) {
			oInactiveInnerControl.destroy();
		}
	
		this._oError = null;
		this._oValue = null;
		this._oFactory = null;
		this._oControl = null;
		this._oValueBind = null;
	};

	return SmartField;

}, /* bExport= */ true);
