/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// -----------------------------------------------------------------------------
// Generates the view metadata required for SmartTable using SAP-Annotations metadata
// -----------------------------------------------------------------------------
sap.ui.define(['jquery.sap.global', 'sap/ui/comp/odata/MetadataAnalyser', './ControlProvider'],
	function(jQuery, MetadataAnalyser, ControlProvider) {
	"use strict";


	/**
	 * Constructs a class to generate the view/data model metadata for the SmartTable from the SAP-Annotations metadata
	 * 
	 * @constructor
	 * @experimental This module is only for internal/experimental use!
	 * @public
	 * @param {object}
	 *            mPropertyBag - PropertyBag having members model, entitySet
	 * @author Pavan Nayak
	 */
	var TableProvider = function(mPropertyBag) {
		if (mPropertyBag) {
			this._oParentODataModel = mPropertyBag.model;
			this.sEntitySet = mPropertyBag.entitySet;
			this._sIgnoredFields = mPropertyBag.ignoredFields;
			this.isEditableTable = mPropertyBag.isEditableTable;
			this.useSmartField = mPropertyBag.useSmartField;
			try {
				this._oDateFormatSettings = mPropertyBag.dateFormatSettings ? JSON.parse(mPropertyBag.dateFormatSettings) : undefined;
				this._oCurrencyFormatSettings = mPropertyBag.currencyFormatSettings ? JSON.parse(mPropertyBag.currencyFormatSettings) : undefined;				
				this._oDefaultDropDownDisplayBehaviour = mPropertyBag.defaultDropDownDisplayBehaviour;
			} catch (ex) {
				// Invalid dateformat provided!
			}
		}
		this._aODataFieldMetadata = [];
		this._aTableViewMetadata = [];
		this._aIgnoredFields = [];
		this._oMetadataAnalyser = new MetadataAnalyser(this._oParentODataModel);
		this._intialiseMetadata();
	};
	
	/**
	 * Initialises the necessary table metadata
	 * 
	 * @private
	 */
	TableProvider.prototype._intialiseMetadata = function() {
		var aTableViewMetadata = [], i, iLen = 0, oField, oTableViewField, fSorter, sSupportedFormats;
		this._aODataFieldMetadata = this._oMetadataAnalyser.getFieldsByEntitySetName(this.sEntitySet);
		this._oLineItemAnnotation = this._oMetadataAnalyser.getLineItemAnnotation(this._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.sEntitySet));
		sSupportedFormats = this._oMetadataAnalyser.getEntityContainerAttribute("supported-formats");
		if (sSupportedFormats) {
			this._bSupportsExcelExport = sSupportedFormats.indexOf("xlsx") > -1;
		}
		this._generateIgnoredFieldsArray();
	
		if (this._aODataFieldMetadata) {
			iLen = this._aODataFieldMetadata.length;
		}
	
		this._oControlProvider = new ControlProvider({
			metadataAnalyser: this._oMetadataAnalyser,
			model: this._oParentODataModel,
			fieldsMetadata: this._aODataFieldMetadata,
			dateFormatSettings: this._oDateFormatSettings,
			currencyFormatSettings: this._oCurrencyFormatSettings,
			defaultDropDownDisplayBehaviour: this._oDefaultDropDownDisplayBehaviour,
			useSmartField: this.useSmartField,
			entitySet : this.sEntitySet
		});
	
		this._oFieldSemanticObjectMap = {};
	
		for (i = 0; i < iLen; i++) {
			oField = this._aODataFieldMetadata[i];
			// Ignore the fields in the ignored list -or- the one marked with visible="false" in annotation
			if (this._aIgnoredFields.indexOf(oField.name) > -1 || !oField.visible) {
				continue;
			}
			oTableViewField = this._oControlProvider.getFieldViewMetadata(oField, this.isEditableTable);
			this._enrichWithTableViewMetadata(oField, oTableViewField);
			aTableViewMetadata.push(oTableViewField);
	
			if (oTableViewField.semanticObject) {
				this._oFieldSemanticObjectMap[oTableViewField.name] = oTableViewField.semanticObject;
			}
		}
	
		// Sorter function for sorting based on index (undefined has lower prio)
		fSorter = function(field1, field2) {
			if (field1.index || field1.index === 0) {
				if (field2.index || field2.index === 0) {
					// both fields have an index --> return the difference
					return field1.index - field2.index;
				}
				// Only field1 has an index --> it should be shown before field2
				return -1;
			}
			if (field2.index || field2.index === 0) {
				// Only field2 has an index --> field1 should be shown after field2
				return 1;
			}
			// both are equal (in our case no index present) --> keep the existing order
			return 0;
		};
		// Sort the array based on LineItem annotation order
		this._aTableViewMetadata = aTableViewMetadata.sort(fSorter);
	};
	
	/**
	 * Get the field semantic object map.
	 * 
	 * @returns {object}
	 * @public
	 */
	TableProvider.prototype.getFieldSemanticObjectMap = function() {
		return this._oFieldSemanticObjectMap;
	};
	
	/**
	 * Get the fields that can be added as Columns
	 * 
	 * @returns {Array}
	 * @public
	 */
	TableProvider.prototype.getTableViewMetadata = function() {
		return this._aTableViewMetadata;
	};
	
	/**
	 * Returns a flag indicating whether excel export is supported by this table (OData service).
	 * 
	 * @returns {boolean}
	 * @public
	 */
	TableProvider.prototype.getSupportsExcelExport = function() {
		return this._bSupportsExcelExport;
	};
	
	/**
	 * Returns a flag indicating whether date handling with UTC is enabled for the table.
	 * 
	 * @returns {boolean}
	 * @public
	 */
	TableProvider.prototype.getIsUTCDateHandlingEnabled = function() {
		return this._oDateFormatSettings ? this._oDateFormatSettings.UTC : false;
	};
	
	/**
	 * Generate an array of fields that need to be ignored in the SmartTable (if any)
	 * 
	 * @private
	 */
	TableProvider.prototype._generateIgnoredFieldsArray = function() {
		if (this._sIgnoredFields) {
			this._aIgnoredFields = this._sIgnoredFields.split(",");
		}
	};
	
	/**
	 * Calculates additional flags and attributes for a field e.g. whether TypeAhead is switched on
	 * 
	 * @param {object}
	 *            oFieldODataMetadata - OData metadata for the table field
	 * @param {object}
	 *            oFieldViewMetadata - the table view field
	 * @private
	 */
	TableProvider.prototype._enrichWithTableViewMetadata = function(oFieldODataMetadata, oFieldViewMetadata) {
		// Label is already set and can be updated if present in the LineItem annotation
		this._updateLabel(oFieldViewMetadata);
		oFieldViewMetadata.isInitiallyVisible = this._isInitiallyVisible(oFieldODataMetadata);
		oFieldViewMetadata.index = this._getIndex(oFieldODataMetadata);
		oFieldViewMetadata.width = this._getWidth(oFieldODataMetadata);
		// aggregation-role= "measure" --> columns shall be summed on the UI (analytical table)
		oFieldViewMetadata.summed = oFieldODataMetadata.aggregationRole === "measure";
	};
	
	/**
	 * Returns a flag indicating whether the field should be initially visible on the UI *
	 * 
	 * @param {object}
	 *            oField - OData metadata for the table field
	 * @returns {boolean}
	 * @private
	 */
	TableProvider.prototype._isInitiallyVisible = function(oField) {
		var bInitiallyVisible = false;
		if (this._oLineItemAnnotation && this._oLineItemAnnotation.fields) {
			bInitiallyVisible = this._oLineItemAnnotation.fields.indexOf(oField.name) > -1;
		}
		return bInitiallyVisible;
	};
	
	/**
	 * Returns the index if the field was found, else undefined
	 * 
	 * @param {object}
	 *            oField - OData metadata for the table field
	 * @returns {string}
	 * @private
	 */
	TableProvider.prototype._getIndex = function(oField) {
		var iIndex;
		if (this._oLineItemAnnotation && this._oLineItemAnnotation.fields) {
			iIndex = this._oLineItemAnnotation.fields.indexOf(oField.name);
		}
		if (iIndex > -1) {
			return iIndex;
		}
		return undefined;
	};
	
	/**
	 * Updated the label from LineItem annotation metadata (if it exists)
	 * 
	 * @param {object}
	 *            oField - OData view metadata of the field
	 * @private
	 */
	TableProvider.prototype._updateLabel = function(oField) {
		var sLabel;
		if (this._oLineItemAnnotation && this._oLineItemAnnotation.labels) {
			sLabel = this._oLineItemAnnotation.labels[oField.name];
		}
		if (sLabel) {
			oField.label = sLabel;
	
			if (oField.template && oField.template.setSemanticObjectLabel){ //SmartLink needs to know the overwritten name, as it is displayed in the navigation popover
				oField.template.setSemanticObjectLabel(oField.label);
			}
		}
	};
	
	/**
	 * Returns the width from the metadata attributes. undefined if there is no width specified
	 * 
	 * @param {object}
	 *            oField - OData metadata for the table field
	 * @returns {string} - width of the filter field
	 * @private
	 */
	TableProvider.prototype._getWidth = function(oField) {
		var sWidth = oField.maxLength || oField.precision, iWidth;
	
		// Force set the width to 9em for date fields
		if (oField.type === "Edm.DateTime" && oField.displayFormat === "Date") {
			sWidth = "9em";
		} else if (sWidth) {
			iWidth = parseInt(sWidth, 10);
			if (!isNaN(iWidth)) {
				// use a max initial width of 50 (+.75) em
				if (iWidth > 50) {
					iWidth = 50;
				}
				// use a min width of 1.5 (+.75) em
				if (iWidth <= 1) {
					iWidth = 1.5;
				}
				// Add additional .75 em (~12px) to avoid showing ellipsis in some cases!
				sWidth = iWidth + 0.75 + "em";
			}
		}
		return sWidth;
	};
	
	/**
	 * Destroys the object
	 * 
	 * @public
	 */
	TableProvider.prototype.destroy = function() {
		if (this._oMetadataAnalyser && this._oMetadataAnalyser.destroy) {
			this._oMetadataAnalyser.destroy();
		}
		this._oMetadataAnalyser = null;
		this._aODataFieldMetadata = null;
		this._aTableViewMetadata = null;
		this._aIgnoredFields = null;
		this.bIsDestroyed = true;
	};
	

	return TableProvider;

}, /* bExport= */ true);
