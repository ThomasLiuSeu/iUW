/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// -----------------------------------------------------------------------------
// Generates the view metadata required for a field using SAP-Annotations metadata
// -----------------------------------------------------------------------------
sap.ui.define([
	'jquery.sap.global', 'sap/m/CheckBox', 'sap/m/ComboBox', 'sap/m/DatePicker', 'sap/m/HBox', 'sap/m/Input', 'sap/m/Text', 'sap/ui/comp/navpopover/SmartLink', 'sap/ui/comp/odata/MetadataAnalyser', 'sap/ui/comp/smartfield/ODataHelper', 'sap/ui/comp/smartfield/SmartField', 'sap/ui/model/type/Date', 'sap/ui/model/type/DateTime', 'sap/ui/model/type/Float'
], function(jQuery, CheckBox, ComboBox, DatePicker, HBox, Input, Text, SmartLink, MetadataAnalyser, ODataHelper, SmartField, Date, DateTime, Float) {
	"use strict";

	// TODO: CleanUp!

	/**
	 * Constructs a class to generate the view/data model metadata for the controls - that can be used in table/forms etc.
	 * 
	 * @constructor
	 * @experimental This module is only for internal/experimental use!
	 * @public
	 * @param {object} mPropertyBag - PropertyBag having members model, entitySet
	 * @author Pavan Nayak
	 */
	var ControlProvider = function(mPropertyBag) {
		if (mPropertyBag) {
			this._oParentODataModel = mPropertyBag.model;
			this._oMetadataAnalyser = mPropertyBag.metadataAnalyser;
			this._aODataFieldMetadata = mPropertyBag.fieldsMetadata;
			this._oDateFormatSettings = mPropertyBag.dateFormatSettings;
			this._oCurrencyFormatSettings = mPropertyBag.currencyFormatSettings;			
			this._oDefaultDropDownDisplayBehaviour = mPropertyBag.defaultDropDownDisplayBehaviour;
			this.useSmartField = mPropertyBag.useSmartField === "true";
			this._sEntitySet = mPropertyBag.entitySet;
		}

		if (!this._oMetadataAnalyser && this._oParentODataModel) {
			this._oMetadataAnalyser = new MetadataAnalyser(this._oParentODataModel);
			this._intialiseMetadata();
		}

		this._mSmartField = {};
		this._oHelper = new ODataHelper(this._oMetadataAnalyser.oModel);

		this._aValueListProvider = [];
		this._aValueHelpProvider = [];
	};

	/**
	 * Initialises the necessary metadata
	 * 
	 * @private
	 */
	ControlProvider.prototype._intialiseMetadata = function() {
		if (!this._aODataFieldMetadata) {
			this._aODataFieldMetadata = this._oMetadataAnalyser.getFieldsByEntitySetName(this.sEntity);
		}
	};

	// TODO: Provide easy to use methods for other consumers

	/**
	 * Get the field metadata
	 * 
	 * @param {object} oFieldODataMetadata - OData metadata for the field
	 * @param {boolean} isEditable - specifies if the control shall be editable
	 * @returns {Array}
	 * @public
	 */
	ControlProvider.prototype.getFieldViewMetadata = function(oFieldODataMetadata, isEditable) {
		var oFieldViewMetadata = this._createFieldMetadata(oFieldODataMetadata);
		// Create and set the template
		this._createFieldTemplate(oFieldViewMetadata, isEditable);
		return oFieldViewMetadata;
	};

	/**
	 * Creates and extends the field view with a template for the UI content
	 * 
	 * @param {object} oViewField - the view field metadata
	 * @param {boolean} isEditable - specifies if the control shall be editable
	 * @private
	 */
	ControlProvider.prototype._createFieldTemplate = function(oViewField, isEditable) {
		if (this.useSmartField) {
			oViewField.template = new SmartField({
				value: {
					path: oViewField.name
				},
				entitySet: this._sEntitySet,
				editable: {
					path: "sm4rtM0d3l>/editable",
					mode: "OneWay"
				}
			});
			this._completeSmartField(oViewField);
		} else {
			if (isEditable) {
				oViewField.template = this._createEditableTemplate(oViewField);
			} else {
				oViewField.template = this._createDisplayOnlyTemplate(oViewField);
			}
		}
	};

	/**
	 * Completes the Smart Field template, adds especially meta data.
	 * 
	 * @param {object} oViewField the current meta data.
	 * @private
	 */
	ControlProvider.prototype._completeSmartField = function(oViewField) {
		var oData = {
			annotations: {},
			path: oViewField.name,
			namespace: this._oMetadataAnalyser.getNamespace()
		};

		if (!this._mSmartField.entitySetObject) {
			this._mSmartField.entitySetObject = this._oHelper.getEntitySet(this._sEntitySet);
			this._mSmartField.entityType = this._oHelper.getEntityType(this._mSmartField.entitySetObject.entityType.replace(oData.namespace + ".", ""));
		}

		oData.modelObject = this._oParentODataModel;
		oData.entitySetObject = this._mSmartField.entitySetObject;
		oData.entityType = this._mSmartField.entityType;
		oData.property = this._oHelper.getProperty(oData.path, oData.namespace, oData.entityType.count);

		oData.annotations.uom = this._oHelper.getUnitOfMeasure(oData.property, oData.path, oData.namespace, oData.entityType.count);
		oData.annotations.text = this._oHelper.getTextProperty(oData.property, oData.path, oData.namespace, oData.entityType.count);
		oData.annotations.lineitem = this._oMetadataAnalyser.getLineItemAnnotation(oData.entitySetObject.entityType);
		oData.annotations.semantic = this._oMetadataAnalyser.getSemanticObjectAnnotation(oData.namespace + "." + oData.entityType.type.name + "/" + oData.property.property.name); // EXC_JSHINT_037
		oData.annotations.valuelist = this._oHelper.getValueListAnnotation(oData.namespace, oData.entityType.type, oData.property, oData.property.typePath);
		this._oHelper.getUOMValueListAnnotation(oData);
		this._oHelper.geValueListEntitySet(oData);
		
		oViewField.template.data("configdata", {
			"configdata": oData
		});

		oViewField.template.data("dateFormatSettings", this._oDateFormatSettings);
		oViewField.template.data("currencyFormatSettings", this._oCurrencyFormatSettings);
		oViewField.template.data("defaultDropDownDisplayBehaviour", this._oDefaultDropDownDisplayBehaviour);
	};

	/**
	 * Creates and extends the field view with a template for editable UI content
	 * 
	 * @param {object} oViewField - the view field
	 * @param {boolean} bBlockSmartLinkCreation - if true, no SmartLink is created independent of the semanitcObject notation
	 * @returns {sap.ui.core.Control} the template control
	 * @private
	 */
	ControlProvider.prototype._createEditableTemplate = function(oViewField, bBlockSmartLinkCreation) {
		var oTemplate = null, oType;
		if (oViewField.type === "Edm.DateTime" || oViewField.type === "Edm.DateTimeOffset") {
			// Create DatePicker for Date display fields
			if (oViewField.displayFormat === "Date") {
				oTemplate = new DatePicker({
					dateValue: {
						path: oViewField.name
					}
				});
			} else {
				oType = new DateTime();
			}
		} else if (oViewField.type === "Edm.Decimal") {
			oType = new Float();
		} else if (oViewField.type === "Edm.Boolean") {
			oTemplate = new CheckBox({
				selected: {
					path: oViewField.name
				}
			});
		}

		// semantic link
		if (oViewField.semanticObject && (!bBlockSmartLinkCreation)) {
			oTemplate = this._createSmartLinkFieldTemplate(oViewField, oType, jQuery.proxy(function() {
				return this._createEditableTemplate(oViewField, true);
			}, this));
		}

		// TODO: ComboBox handling!

		// Default ==> sap.m.Input
		if (!oTemplate) {

			oTemplate = new Input({
				value: {
					path: oViewField.name,
					type: oType
				}
			});

			if (oViewField.isCurrencyField) {
				oTemplate.bindProperty("description", {
					path: oViewField.unit
				});
				oTemplate.setTextAlign("End");
				oTemplate.setFieldWidth("80%");
			}

			if (oViewField.oValueListAnnotation) {
				this._associateValueHelpAndSuggest(oTemplate, oViewField);
			}

		}

		return oTemplate;
	};

	/**
	 * Associates the control with a ValueHelp Dialog and suggest using the details retrieved from the metadata (annotation)
	 * 
	 * @param {object} oControl - The control
	 * @param {object} oFieldViewMetadata - The metadata merged from OData metadata and additional control configuration
	 * @private
	 */
	ControlProvider.prototype._associateValueHelpAndSuggest = function(oControl, oFieldViewMetadata) {
		oControl.setShowValueHelp(true);
		this._aValueHelpProvider.push(new sap.ui.comp.providers.ValueHelpProvider({
			annotation: oFieldViewMetadata.oValueListAnnotation,
			additionalAnnotations: oFieldViewMetadata.additionalAnnotations,
			control: oControl,
			model: this._oParentODataModel,
			preventInitialDataFetchInValueHelpDialog: true,
			takeOverInputValue: false,
			fieldName: oFieldViewMetadata.fieldName,
			type: oFieldViewMetadata.type,
			maxLength: oFieldViewMetadata.maxLength,
			displayFormat: oFieldViewMetadata.displayFormat,
			displayBehaviour: oFieldViewMetadata.displayBehaviour,
			title: oFieldViewMetadata.label
		}));

		oControl.setShowSuggestion(true);
		oControl.setFilterSuggests(false);
		this._aValueListProvider.push(new sap.ui.comp.providers.ValueListProvider({
			annotation: oFieldViewMetadata.oValueListAnnotation,
			control: oControl,
			model: this._oParentODataModel,
			typeAheadEnabled: true,
			aggregation: "suggestionRows",
			displayFormat: oFieldViewMetadata.displayFormat
		}));
	};

	/**
	 * Creates and extends the field view with a template for display only UI content
	 * 
	 * @param {object} oViewField - the view field
	 * @param {boolean} bBlockSmartLinkCreation - if true, no SmartLink is created independent of the semanitcObject notation
	 * @returns {sap.ui.core.Control} the template control
	 * @private
	 */
	ControlProvider.prototype._createDisplayOnlyTemplate = function(oViewField, bBlockSmartLinkCreation) {
		var oTemplate = null, oType = null, sAlign;
		if (oViewField.type === "Edm.DateTime" || oViewField.type === "Edm.DateTimeOffset") {
			// Create Date type for Date display fields
			if (oViewField.displayFormat === "Date") {
				oType = new Date(this._oDateFormatSettings);
			} else {
				oType = new DateTime();
			}
		} else if (oViewField.type === "Edm.Decimal") {
			oType = new Float();
			sAlign = "End";
		}

		if (oViewField.isCurrencyField) {
			oTemplate = this._createCurrencyFieldTemplate(oViewField);
		} else if (oViewField.semanticObject && (!bBlockSmartLinkCreation)) {
			oTemplate = this._createSmartLinkFieldTemplate(oViewField, oType, jQuery.proxy(function() {
				return this._createDisplayOnlyTemplate(oViewField, true);
			}, this));
		} else {
			oTemplate = new Text({
				wrapping: false,
				textAlign: sAlign,
				text: {
					path: oViewField.name,
					type: oType
				}
			});
		}

		oViewField.align = sAlign;

		return oTemplate;
	};

	/**
	 * Creates and extends the field view with a template for currency (display only) content
	 * 
	 * @param {object} oViewField - the view field
	 * @param {object} oType - the binding data type
	 * @param {function} fCreateControl - callback function which creates the control which would have been created instead of the SmartLink
	 * @private
	 */
	ControlProvider.prototype._createSmartLinkFieldTemplate = function(oViewField, oType, fCreateControl) {
		// semantic link
		var oTemplate = new SmartLink({
			semanticObject: oViewField.semanticObject,
			semanticObjectLabel: oViewField.label,
			fieldName: oViewField.name,
			text: {
				path: oViewField.name,
				type: oType
			}
		});

		oTemplate.setCreateControlCallback(fCreateControl);

		return oTemplate;
	};

	/**
	 * Creates and extends the field view with a template for currency (display only) content
	 * 
	 * @param {object} oViewField - the view field
	 * @private
	 */
	ControlProvider.prototype._createCurrencyFieldTemplate = function(oViewField) {
		var oTemplate, oValueText, oCurrencyText;

		if (!this._oCurrencyFormatter) {
			jQuery.sap.require("sap.ui.core.format.NumberFormat");
			this._oCurrencyFormatter = sap.ui.core.format.NumberFormat.getCurrencyInstance({
				showMeasure: false
			});
			// Whitespace characters to align values
			this._FIGURE_SPACE = '\u2007';
			this._PUNCTUATION_SPACE = '\u2008';
			// Default currency precision
			this._iMaxCurrencyDigits = 3;

			// Formatter function for amount part
			this._fCurrencyFormatter = jQuery.proxy(function(oAmount, sCurrency) {
				// Adapted logic from sap.ui.unified.Currency to implement basic padding for some currencies (Ex: JPY)
				var sValue, iCurrencyDigits, iPadding;
				if (oAmount === undefined || oAmount === null || !sCurrency || sCurrency === "*") {
					return "";
				}
				// Get the currency digits
				iCurrencyDigits = this._oCurrencyFormatter.oLocaleData.getCurrencyDigits(sCurrency);

				// Get the formatted numeric value
				sValue = this._oCurrencyFormatter.format(oAmount, sCurrency);

				// Add padding for decimal "."
				if (iCurrencyDigits === 0) {
					sValue += this._PUNCTUATION_SPACE;
				}
				// Calculate and set padding for missing currency digits
				iPadding = this._iMaxCurrencyDigits - iCurrencyDigits;
				if (iPadding) {
					sValue = jQuery.sap.padRight(sValue, this._FIGURE_SPACE, sValue.length + iPadding);
				}

				return sValue;
			}, this);

			// Enable Currency symbol handling via configuration
			if (this._oCurrencyFormatSettings && this._oCurrencyFormatSettings.showCurrencySymbol) {
				// Formatter function for currency symbol conversion
				this._fCurrencySymbolFormatter = jQuery.proxy(function(sCurrency) {
					if (!sCurrency || sCurrency === "*") {
						return "";
					}
					return this._oCurrencyFormatter.oLocaleData.getCurrencySymbol(sCurrency);
				}, this);
			}
		}

		oValueText = new Text({
			wrapping: false,
			textAlign: "End",
			text: {
				parts: [
					{
						path: oViewField.name,
						type: new Float()
					}, {
						path: oViewField.unit
					}
				],
				formatter: this._fCurrencyFormatter,
				useRawValues: true
			}
		});

		oCurrencyText = new Text({
			wrapping: false,
			textAlign: "Begin",
			width: "2.5em",
			text: {
				path: oViewField.unit,
				formatter: this._fCurrencySymbolFormatter
			}
		});
		// Create currency format using HBox --> we need to 2 controls to properly align the numeric and currency part
		oTemplate = new HBox({
			justifyContent: "End",
			items: [
				oValueText, oCurrencyText
			]
		});

		return oTemplate;
	};

	/**
	 * Calculates and sets additional flags and attributes for a field
	 * 
	 * @param {object} oFieldODataMetadata - OData metadata for the field
	 * @returns {object} the field view metadata
	 * @private
	 */
	ControlProvider.prototype._createFieldMetadata = function(oFieldODataMetadata) {
		var oFieldViewMetadata = {};

		oFieldViewMetadata.fullName = oFieldODataMetadata.fullName;
		oFieldViewMetadata.type = oFieldODataMetadata.type;
		oFieldViewMetadata.name = oFieldODataMetadata.name;
		oFieldViewMetadata.displayFormat = oFieldODataMetadata.displayFormat;
		oFieldViewMetadata.maxLength = oFieldODataMetadata.maxLength;
		oFieldViewMetadata.precision = oFieldODataMetadata.precision;
		oFieldViewMetadata.scale = oFieldODataMetadata.scale;
		oFieldViewMetadata.sortable = oFieldODataMetadata.sortable;
		oFieldViewMetadata.filterable = oFieldODataMetadata.filterable;
		oFieldViewMetadata.label = oFieldODataMetadata.fieldLabel || oFieldODataMetadata.name;
		oFieldViewMetadata.quickInfo = oFieldODataMetadata.quickInfo || oFieldViewMetadata.label;
		oFieldViewMetadata.aggregationRole = oFieldODataMetadata.aggregationRole;
		oFieldViewMetadata.unit = oFieldODataMetadata.unit;
		oFieldViewMetadata.isCurrencyField = this._isCurrencyField(oFieldODataMetadata);
		oFieldViewMetadata.filterType = this._getFilterType(oFieldODataMetadata);
		oFieldViewMetadata.entityName = oFieldODataMetadata.entityName;
		this._setAnnotationMetadata(oFieldViewMetadata);

		return oFieldViewMetadata;
	};

	/**
	 * Set any annotation(s) metadata on the control
	 * 
	 * @private
	 */
	ControlProvider.prototype._setAnnotationMetadata = function(oFieldViewMetadata) {
		var mAnnotation = null;
		if (!this.useSmartField && oFieldViewMetadata && oFieldViewMetadata.fullName) {
			// Update with ValueList annotation data
			mAnnotation = this._oMetadataAnalyser.getValueListAnnotation(oFieldViewMetadata.fullName);
			if (mAnnotation) {
				oFieldViewMetadata.oValueListAnnotation = mAnnotation.primaryValueListAnnotation;
				oFieldViewMetadata.additionalAnnotations = mAnnotation.additionalAnnotations;
			}
			// Update with SemanticObject annotation data
			mAnnotation = this._oMetadataAnalyser.getSemanticObjectAnnotation(oFieldViewMetadata.fullName);
			if (mAnnotation) {
				oFieldViewMetadata.semanticObject = mAnnotation.semanticObject;
			}
		}
	};

	/**
	 * Returns a flag indicating whether the field is a CurrencyField (determined from unit)
	 * 
	 * @param {object} oField - OData metadata for the field
	 * @returns {boolean}
	 * @private
	 */
	ControlProvider.prototype._isCurrencyField = function(oField) {
		var bIsCurrencyField = false, oODataField, iLen, oUnitField;

		if (!this.useSmartField && this._aODataFieldMetadata) {
			iLen = this._aODataFieldMetadata.length;
			// Get the currency field
			while (iLen--) {
				oODataField = this._aODataFieldMetadata[iLen];
				if (oODataField.name === oField.unit) {
					oUnitField = oODataField;
					break;
				}
			}
			// Check if the field has semantics="currency-code"
			if (oUnitField && oUnitField.semantics === "currency-code") {
				bIsCurrencyField = true;
			}
		}
		return bIsCurrencyField;
	};

	/**
	 * Returns the filterType of the field based on metadata, else undefined
	 * 
	 * @param {object} oField - OData metadata for the field
	 * @returns {string}
	 * @private
	 */
	ControlProvider.prototype._getFilterType = function(oField) {
		if (oField.type === "Edm.Decimal") {
			return "numeric";
		} else if (oField.type === "Edm.DateTime" && oField.displayFormat === "Date") {
			return "date";
		}
		return undefined;
	};

	/**
	 * Destroys the object
	 * 
	 * @public
	 */
	ControlProvider.prototype.destroy = function() {
		var i;
		if (this._oMetadataAnalyser && this._oMetadataAnalyser.destroy) {
			this._oMetadataAnalyser.destroy();
		}
		this._oMetadataAnalyser = null;
		if (this._aValueHelpProvider) {
			i = this._aValueHelpProvider.length;
			while (i--) {
				this._aValueHelpProvider[i].destroy();
			}
		}
		this._aValueHelpProvider = null;

		if (this._aValueListProvider) {
			i = this._aValueListProvider.length;
			while (i--) {
				this._aValueListProvider[i].destroy();
			}
		}

		if (this._oHelper) {
			this._oHelper.destroy();
		}

		this._oHelper = null;
		this._mSmartField = null;
		this._aValueListProvider = null;
		this._aODataFieldMetadata = null;
		this._oCurrencyFormatter = null;
		this.bIsDestroyed = true;
	};

	return ControlProvider;

}, /* bExport= */true);
