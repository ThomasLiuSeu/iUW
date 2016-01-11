/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
// -----------------------------------------------------------------------------
// Retrieves the metadata necessary for a value list from the OData metadata
// -----------------------------------------------------------------------------
sap.ui.define([
	'jquery.sap.global', 'sap/ui/comp/smartfilterbar/ControlConfiguration', 'sap/ui/model/type/Date'
], function(jQuery, ControlConfiguration, Date) {
	"use strict";

	/**
	 * Retrieves the data for a collection from the OData metadata to bind to a given control/aggregation
	 * 
	 * @constructor
	 * @experimental This module is only for internal/experimental use!
	 * @public
	 * @param {object} mParams - map containing the control,aggregation,annotation and the oODataModel *
	 * @author Pavan Nayak, Thomas Biesemann
	 */
	var BaseValueListProvider = function(mParams) {
		this.oControl = mParams.control;
		this.sValueListEntitySetName = null;
		this.sValueListEntityName = null;
		this.oODataModel = mParams.model;
		this.oFilterModel = mParams.filterModel;
		this.oFilterProvider = mParams.filterProvider;
		this.oPrimaryValueListAnnotation = mParams.annotation;
		this.sDisplayFormat = mParams.displayFormat;
		// Default resolution of InOut params when used in standard OData scenarios
		this.bResolveInOutParams = (mParams.resolveInOutParams === false) ? false : true;
		// The configured display behaviour
		this.sDisplayBehaviour = mParams.displayBehaviour;
		// the calculated display behaviour for DDLB
		this.sDDLBDisplayBehaviour = this.sDisplayBehaviour;
		if (!this.sDDLBDisplayBehaviour || this.sDDLBDisplayBehaviour === ControlConfiguration.DISPLAYBEHAVIOUR.auto) {
			this.sDDLBDisplayBehaviour = this.oFilterProvider ? this.oFilterProvider.sDefaultDropDownDisplayBehaviour : ControlConfiguration.DISPLAYBEHAVIOUR.descriptionOnly;
		}
		// If the property if part of a complex type this would be filled
		this.sPropertyTypePath = "";
		if (this.bResolveInOutParams && !this.oFilterModel && !this.oFilterProvider) {
			this._resolvePropertyPath();
		}
		this._resolveAnnotationData(this.oPrimaryValueListAnnotation);

		if (!sap.ui.comp.smartfilterbar || !sap.ui.comp.smartfilterbar.FilterProvider) {
			jQuery.sap.require("sap.ui.comp.smartfilterbar.FilterProvider");
		}
	};

	BaseValueListProvider.prototype = jQuery.sap.newObject(sap.ui.base.Object.prototype);

	/**
	 * Resolve the path from control's binding info to find out if the property is part of a ComplexType. (This is valid only for ODataModel In/Out
	 * parameter handling)
	 * 
	 * @private
	 */
	BaseValueListProvider.prototype._resolvePropertyPath = function() {
		var oBindingInfo = this.oControl.getBindingInfo("value"), sPath, sProperty, aPaths;
		if (oBindingInfo && oBindingInfo.parts) {
			sPath = oBindingInfo.parts[0] ? oBindingInfo.parts[0].path : "";
		}
		if (sPath) {
			aPaths = sPath.split("/");
			if (aPaths.length > 1) {
				sProperty = aPaths[aPaths.length - 1];
				this.sPropertyTypePath = sPath.replace("/" + sProperty, "");
			}
		}
	};

	/**
	 * Resolve the annotation data and recalculate the required metadata
	 * 
	 * @param oAnnotation
	 * @private
	 */
	BaseValueListProvider.prototype._resolveAnnotationData = function(oAnnotation) {
		var iLen = 0, i = 0, aCols, oField, sType, oType;
		if (this.oODataModel && oAnnotation) {
			this.bSupportBasicSearch = oAnnotation.isSearchSupported;
			this.sValueListTitle = oAnnotation.valueListTitle || oAnnotation.qualifier;
			this.sKey = oAnnotation.keyField;
			this._aKeys = oAnnotation.keys;
			this.sValueListEntitySetName = oAnnotation.valueListEntitySetName;
			this.sValueListEntityName = oAnnotation.valueListEntityName;
			this.mInParams = oAnnotation.inParams;
			this.mOutParams = oAnnotation.outParams;

			// the calculated display behaviour for tokens
			this.sTokenDisplayBehaviour = this.sDisplayBehaviour;
			if (!this.sTokenDisplayBehaviour || this.sTokenDisplayBehaviour === ControlConfiguration.DISPLAYBEHAVIOUR.auto) {
				this.sTokenDisplayBehaviour = this.oFilterProvider ? this.oFilterProvider.sDefaultTokenDisplayBehaviour : ControlConfiguration.DISPLAYBEHAVIOUR.descriptionAndId;
			}

			// fallback to idOnly if no description is present for tokens
			if (!oAnnotation.descriptionField) {
				this.sTokenDisplayBehaviour = ControlConfiguration.DISPLAYBEHAVIOUR.idOnly;
			}

			this.sDescription = oAnnotation.descriptionField || this.sKey; // fall back to key if there is no description

			if (this.sValueListEntitySetName && this.sKey) {
				// Get the Columns information (all fields on the UI)
				this._aCols = [];
				this.aSelect = [];
				aCols = oAnnotation.valueListFields;
				iLen = aCols.length;
				for (i = 0; i < iLen; i++) {
					oField = aCols[i];
					// Type Handling: Special handling for date and boolean fields
					sType = null;
					oType = null;
					if (oField.type === "Edm.Boolean") {
						sType = "boolean";
					} else if (oField.type === "Edm.DateTime" && oField.displayFormat === "Date") {
						sType = "date";
						oType = new Date();
					} else if (oField.type === "Edm.Decimal") {
						sType = "decimal";
						oType = new sap.ui.model.type.Float();
					} else if (oField.type === "Edm.String") {
						sType = "string";
					}
					this._aCols.push({
						label: oField.fieldLabel,
						type: sType,
						oType: oType,
						width: this._getWidth(oField),
						template: oField.name
					// sort: oField.name // we do not support a sorting on the columns
					});
					this.aSelect.push(oField.name);
				}
				if (oAnnotation.descriptionField) {
					this.aSelect.push(oAnnotation.descriptionField);
				}
			}
		}
	};

	/**
	 * Returns the width from the metadata attributes. undefined if there is no width specified
	 * 
	 * @param {object} oField - OData metadata for the table field
	 * @returns {string} - width of the filter field
	 * @private
	 */
	BaseValueListProvider.prototype._getWidth = function(oField) {
		var sWidth = oField.maxLength || oField.precision, iWidth;

		// Force set the width to 8em for date fields
		if (oField.type === "Edm.DateTime" && oField.displayFormat === "Date") {
			sWidth = "8em";
		} else if (sWidth) {
			iWidth = parseInt(sWidth, 10);
			if (!isNaN(iWidth)) {
				// use a max of 15 (+.75) em
				if (iWidth > 15) {
					iWidth = 15;
				}
				// use a min of 1.5 (+.75) em
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
	 * Called by the control when needed, to get input data for filtering
	 * 
	 * @private
	 */
	BaseValueListProvider.prototype._calculateFilterInputData = function() {
		var sLocalFieldName, sValueListFieldName, oData = null;
		// Search view can be switched for collective search help; reset the mFilterInputData in that case.
		delete this.mFilterInputData;
		// Check if the SmartFilter is present and try to get data for only visible fields from SmartFilter
		// else use the filterModel to get data
		if (this.oFilterProvider && this.oFilterProvider._oSmartFilter) {
			oData = this.oFilterProvider._oSmartFilter.getFilterData();
		} else if (this.oFilterModel) {
			oData = this.oFilterModel.getData();
		} else if (this.oODataModel && this.bResolveInOutParams) {
			oData = this.oODataModel.getData(this.sPropertyTypePath, this.oControl.getBindingContext());
		}
		if (this.mInParams && oData) {
			this.mFilterInputData = {};
			this.aFilterField = [];
			for (sLocalFieldName in this.mInParams) {
				if (sLocalFieldName) {
					sValueListFieldName = this.mInParams[sLocalFieldName];
					if (sValueListFieldName !== this.sKey) {
						// Only set IN parameter data if it is non empty
						if (oData[sLocalFieldName]) {
							this.mFilterInputData[sValueListFieldName] = oData[sLocalFieldName];
							this.aFilterField.push(sValueListFieldName);
						}
					}
				}
			}
		}
	};

	/**
	 * Called when data needs to be set back to the SmartFilter from ValueHelp/suggest
	 * 
	 * @private
	 */
	BaseValueListProvider.prototype._calculateAndSetFilterOutputData = function(aData) {
		var sLocalFieldName, sValueListFieldName, mFilterOutputData = null, oData, oExistingData, oNewData, i, fFilterDuplicates;
		if (this.mOutParams && aData && (this.oFilterProvider || this.oFilterModel)) {
			mFilterOutputData = {};
			fFilterDuplicates = function(obj) {
				return obj.key === oNewData.key;
			};
			for (sLocalFieldName in this.mOutParams) {
				if (sLocalFieldName) {
					sValueListFieldName = this.mOutParams[sLocalFieldName];
					if (sValueListFieldName !== this.sKey) {
						i = aData.length;
						while (i--) {
							oData = aData[i];
							// Only set Out parameter data if it exists in the passed data
							if (oData[sValueListFieldName]) {
								oNewData = {
									key: oData[sValueListFieldName]
								};
								if (!mFilterOutputData[sLocalFieldName]) {
									// Get Existing filter data
									if (!oExistingData && this.oFilterModel) {
										oExistingData = this.oFilterModel.getData();
									}
									// if existing data already contains the property as a multi-value --> amend to it
									if (oExistingData && oExistingData[sLocalFieldName] && oExistingData[sLocalFieldName].items) {
										mFilterOutputData[sLocalFieldName] = oExistingData[sLocalFieldName];
									} else {
										mFilterOutputData[sLocalFieldName] = {
											items: []
										};
									}
								}
								// Check for duplicates before adding new data
								if (mFilterOutputData[sLocalFieldName].items.filter(fFilterDuplicates).length <= 0) {
									mFilterOutputData[sLocalFieldName].items.push(oNewData);
								}
							}
						}
					}
				}
			}

			if (mFilterOutputData) {
				// Use API from FilterProvider if it exists
				if (this.oFilterProvider) {
					this.oFilterProvider.setFilterData(mFilterOutputData);
				} else if (this.oFilterModel) {
					// try to merge data into the filter model
					this.oFilterModel.setData(mFilterOutputData, true);
				}
			}
		} else if (this.oODataModel && this.bResolveInOutParams) {
			// ODataModel --> assume only 1 value can be set back!
			this._calculateAndSetODataModelOutputData(aData[0]);
		}
	};

	/**
	 * Called when data needs to be set back to the Model (ODataModel) from ValueHelp/suggest
	 * 
	 * @private
	 */
	BaseValueListProvider.prototype._calculateAndSetODataModelOutputData = function(oData) {
		var oBindingContext, sLocalFieldName, sValueListFieldName, sPathToResolve, sLocalPath, oValue;
		if (oData && this.mOutParams) {
			oBindingContext = this.oControl.getBindingContext();
			for (sLocalFieldName in this.mOutParams) {
				if (sLocalFieldName) {
					sValueListFieldName = this.mOutParams[sLocalFieldName];
					if (sValueListFieldName !== this.sKey) {
						oValue = oData[sValueListFieldName];
						if (oValue) {
							sPathToResolve = this.sPropertyTypePath ? this.sPropertyTypePath + "/" + sLocalFieldName : sLocalFieldName;
							sLocalPath = this.oODataModel.resolve(sPathToResolve, oBindingContext);
							this.oODataModel.setProperty(sLocalPath, oValue);
						}
					}
				}
			}
		}
	};

	/**
	 * Destroys the object
	 */
	BaseValueListProvider.prototype.destroy = function() {
		sap.ui.base.Object.prototype.destroy.apply(this, arguments);
		this.oControl = null;
		this.mFilterInputData = null;
		this.aFilterField = null;
		this.sValueListEntitySetName = null;
		this.sValueListEntityName = null;
		this.oODataModel = null;
		this.oFilterModel = null;
		this.oFilterProvider = null;
		this.oPrimaryValueListAnnotation = null;
		this.sDisplayFormat = null;
		this.bSupportBasicSearch = null;
		this.sValueListTitle = null;
		this.sKey = null;
		this._aKeys = null;
		this.mInParams = null;
		this.mOutParams = null;
		this.sDescription = null;
		this.aSelect = null;
		this._aCols = null;
		this.sDDLBDisplayBehaviour = null;
		this.sTokenDisplayBehaviour = null;

		this.bIsDestroyed = true;
	};

	return BaseValueListProvider;

}, /* bExport= */true);
