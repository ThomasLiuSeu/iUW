/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
// -----------------------------------------------------------------------------
// Retrieves the data for a value list from the OData metadata to bind to a given control/aggregation
// TODO: take into account Searchsupported + ValueList In/Out/InOut parameter (Keys only) to set data+ Multi column
// -----------------------------------------------------------------------------
sap.ui.define(['jquery.sap.global', 'sap/m/Column', 'sap/m/ColumnListItem', 'sap/m/Text', 'sap/m/Token', './BaseValueListProvider', 'sap/ui/core/Item', 'sap/ui/model/Filter', 'sap/ui/model/Sorter', 'sap/ui/model/json/JSONModel'],
	function(jQuery, Column, ColumnListItem, Text, Token, BaseValueListProvider, Item, Filter, Sorter, JSONModel) {
	"use strict";


	/**
	 * Retrieves the data for a collection from the OData metadata to bind to a given control/aggregation
	 * 
	 * @constructor
	 * @experimental This module is only for internal/experimental use!
	 * @public
	 * @param {object} mParams - map containing the control,aggregation,annotation and the oODataModel
	 * @author Pavan Nayak, Thomas Biesemann
	 */
	var ValueListProvider = function(mParams) {
		if (mParams) {
			this.sAggregationName = mParams.aggregation;
			this.bTypeAheadEnabled = mParams.typeAheadEnabled;
	
		}
		BaseValueListProvider.apply(this, arguments);
		// Initialise if there is an entity set and key present
		if (this.sValueListEntitySetName && this.sKey) {
			this._onInitialise();
		}
	};
	
	// TODO: Instead of extending/inheriting maybe we should try using the same BaseValueListProdiver instance but with different uses
	/**
	 * Inherit from sap.ui.comp.providers.BaseValueListProvider
	 */
	ValueListProvider.prototype = jQuery.sap.newObject(BaseValueListProvider.prototype);
	/**
	 * Metadata is available --> Initialise the relevant stuff
	 * 
	 * @private
	 */
	ValueListProvider.prototype._onInitialise = function() {
		var oEventDelegate;
		if (!this.bTypeAheadEnabled) {
			this._oTemplate = new Item({
				key: "{" + this.sKey + "}",
				text: this._getDDLBTextBindingPath()
			});
			// ComboBox/MultiComboBox:
			// Sort based on key if displayBehaviour is based on id
			if (this.sDDLBDisplayBehaviour === sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.idOnly || this.sDDLBDisplayBehaviour === sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.idAndDescription) {
				this._oSorter = new Sorter(this.sKey);
			} else {
				// Sort based on description by default
				this._oSorter = new Sorter(this.sDescription);
			}
			/**
			 * Delay the fetch of data for standard dropdowns until the rendering is done! This inherently causes only the relevant data to be fetched
			 * from the backend!
			 */
			oEventDelegate = {
				onAfterRendering: function() {
					this.oControl.removeEventDelegate(oEventDelegate, this);
					this._fetchData();
				}
			};
			this.oControl.addEventDelegate(oEventDelegate, this);
		} else {
			// Check if Suggest is supported by the control
			if (this.oControl.attachSuggest) {
				this._fSuggest = jQuery.proxy(function(oEvent) {
					this.oControl = oEvent.getSource();
					if (!this.oTemplate || !this.oControl.data("_hassuggestionTemplate")) {
						this._createSuggestionTemplate();
					}
					var sSearchText = oEvent.getParameter("suggestValue");
					this._fetchData(sSearchText);
				}, this);
				this.oControl.attachSuggest(this._fSuggest);
				this.oControl.setMaxSuggestionWidth("90%"); // Use 90% of available space
	
				this._handleSelect();
			}
		}
		// this.oControl.setModel(this.oODataModel);
	};
	
	/**
	 * Creates a template for multi-column suggest
	 * 
	 * @private
	 */
	ValueListProvider.prototype._createSuggestionTemplate = function() {
		var i = 0, iLen = 0, oTooltip;
		// Create a template
		this._oTemplate = new ColumnListItem();
		if (this._aCols) {
			// remove any exiting columns
			this.oControl.removeAllSuggestionColumns();
			iLen = this._aCols.length;
			for (i = 0; i < iLen; i++) {
				// add Column headers
				this.oControl.addSuggestionColumn(new Column({
					header: new Text({
						wrapping: false,
						text: this._aCols[i].label,
						tooltip: this._aCols[i].label
					}),
					width: this._aCols[i].width
				}));
				// Tooltip is only possible for certain (string) fields
				// ignore it for all types other than string!
				oTooltip = null;
				if (this._aCols[i].type === "string") {
					oTooltip = {
						path: this._aCols[i].template
					};
				}
				// Add cells to the template
				this._oTemplate.addCell(new Text({
					wrapping: false,
					text: {
						path: this._aCols[i].template,
						type: this._aCols[i].oType
					},
					tooltip: oTooltip
				}));
			}
		}
		this.oControl.data("_hassuggestionTemplate", true);
	};
	/**
	 * Get Text binding path for dropdowns according to the DisplayBehaviour
	 * 
	 * @private
	 * @returns {String}
	 */
	ValueListProvider.prototype._getDDLBTextBindingPath = function() {
		var sKey = "{" + this.sKey + "}", sDescription = "{" + this.sDescription + "}";
		return sap.ui.comp.smartfilterbar.FilterProvider.getFormattedExpressionFromDisplayBehaviour(this.sDDLBDisplayBehaviour, sKey, sDescription);
	};
	
	/**
	 * Handle validation/selection of Item
	 * 
	 * @private
	 */
	ValueListProvider.prototype._handleSelect = function() {
		var fHandleRowSelect = jQuery.proxy(function(oDataModelRow, fCallback) {
			var sKey, sText, oToken;
			if (oDataModelRow) {
				sKey = oDataModelRow[this.sKey];
				sText = oDataModelRow[this.sDescription];
				this._calculateAndSetFilterOutputData([
					oDataModelRow
				]);
			}
			// Key found
			if (sKey) {
				// MultiInput field --> Create a token with the selected key
				if (this.oControl.addToken) {
					// Format the text as per the displayBehaviour
					sText = sap.ui.comp.smartfilterbar.FilterProvider.getFormattedExpressionFromDisplayBehaviour(this.sTokenDisplayBehaviour, sKey, sText);
					oToken = new Token({
						key: sKey,
						text: sText,
						tooltip: sText
					});
					oToken.data("row", oDataModelRow);
					if (fCallback) {
						fCallback(oToken);
					}
					// Clear the ValidationText
					delete this.oControl.__sValidationText;
				} else {
					// normal input field --> just set the value
					this.oControl.setValue(sKey);
					// Manually trigger the change event on sapUI5 control since it doesn't do this internally on setValue!
					this.oControl.fireChange({
						value: sKey,
						validated: true
					});
				}
			}
	
		}, this);
		// Selection handling has to be done manually for Multi-Column suggest!
		// add Validators --> Only available for Multi-Input
		if (this.oControl.addValidator) {
			this._fValidator = jQuery.proxy(function(oData) {
				var oRow = oData.suggestionObject, oDataModelRow, sInput = oData.text, aFilters = [];
				// Selection via suggestion row --> no round trip needed
				if (oRow) {
					// Get the actual datamodel row
					oDataModelRow = this.oODataModel.getData(oRow.getBindingContextPath());
					fHandleRowSelect(oDataModelRow, oData.asyncCallback);
				} else if (sInput) {
					// Validation required from backend
					sInput = jQuery.sap.encodeURL(sInput.toUpperCase());
					// Check if the input text is same as the ValidationText
					if (this.oControl.__sValidationText !== sInput) {
						// Store the input as Validation text
						this.oControl.__sValidationText = sInput;
						// Set flag to indicate token validation is in progress
						this.oControl.__bValidatingToken = true;
						this._calculateFilterInputData();
						if (this.mFilterInputData && this.aFilterField) {
							aFilters = sap.ui.comp.smartfilterbar.FilterProvider.generateFilters(this.aFilterField, this.mFilterInputData);
						}
						aFilters.push(new Filter(this.sKey, sap.ui.model.FilterOperator.EQ, sInput));
						this.oODataModel.read(this.sValueListEntitySetName, {
							filters: aFilters,
							success: jQuery.proxy(function(oResponseData, response) {
								var oResultRow = oResponseData;
								if (oResponseData) {
									// Check if result has 1 single row
									if (oResponseData.results && oResponseData.results.length === 1) {
										oResultRow = oResponseData.results[0];
									}
									// If returned row has the key do the selection!
									if (oResultRow && oResultRow[this.sKey]) {
										fHandleRowSelect(oResultRow, oData.asyncCallback);
									}
								}
								// Remove the token validation flag
								delete this.oControl.__bValidatingToken;
							}, this)
						});
					}
				}
			}, this);
			this.oControl.addValidator(this._fValidator);
		} else if (this.oControl.attachSuggestionItemSelected) {
			this._fSuggestionItemSelected = jQuery.proxy(function(oEvent) {
				var oRow = oEvent.getParameter("selectedRow"), oDataModelRow;
				// MultiColumn Suggest
				if (oRow) {
					// Get the actual datamodel row
					oDataModelRow = oRow.getModel().getData(oRow.getBindingContextPath());
					fHandleRowSelect(oDataModelRow);
				}
			}, this);
			// Single-Input --> just enable selection handling
			this.oControl.attachSuggestionItemSelected(this._fSuggestionItemSelected);
		}
	};
	
	/**
	 * Bind the control to internally read the data (ODataModel takes care of this) from backend with optional search text to filter data
	 * 
	 * @param {object} sSearchText - the optional search text
	 * @private
	 */
	ValueListProvider.prototype._fetchData = function(sSearchText) {
		var mParams = {}, aFilters = [], length, oEvents;
		if (this.bTypeAheadEnabled) {
			// Convert search text to UpperCase if displayFormat = "UpperCase"
			if (sSearchText && this.sDisplayFormat === "UpperCase") {
				sSearchText = sSearchText.toUpperCase();
			}
			if (this.bSupportBasicSearch) {
				mParams["custom"] = {
					"search-focus": this.sKey,
					"search": sSearchText
				};
			}
			this._calculateFilterInputData();
			if (this.mFilterInputData && this.aFilterField) {
				aFilters = sap.ui.comp.smartfilterbar.FilterProvider.generateFilters(this.aFilterField, this.mFilterInputData);
			}
			// If SearchSupported = false; create a $filter for the keyfield with a StartsWith operator for the typed in/search text
			if (!this.bSupportBasicSearch) {
				aFilters.push(new Filter(this.sKey, sap.ui.model.FilterOperator.StartsWith, sSearchText));
			}
			// Restrict to 10 records for type Ahead
			length = 10;
			// Hide the Show All Items button if the number if items is less than the length (restriction)
			oEvents = {
				dataReceived: jQuery.proxy(function(oEvent) {
					var oBinding = oEvent.getSource(), iBindingLength;
					if (oBinding) {
						iBindingLength = oBinding.getLength();
						if (iBindingLength && iBindingLength <= length) {
							this.oControl.setShowTableSuggestionValueHelp(false);
						} else {
							this.oControl.setShowTableSuggestionValueHelp(true);
						}
					}
				}, this)
			};
		}
	
		if (this.aSelect && this.aSelect.length) {
			mParams["select"] = this.aSelect.toString();
		}
	
		// Bind the specified aggregation with valueList path in the model
		this.oControl.bindAggregation(this.sAggregationName, {
			path: "/" + this.sValueListEntitySetName,
			length: length,
			parameters: mParams,
			filters: aFilters,
			sorter: this._oSorter,
			events: oEvents,
			template: this._oTemplate
		});
	};
	
	/**
	 * Destroys the object
	 */
	ValueListProvider.prototype.destroy = function() {
		if (this.oControl) {
			if (this.oControl.detachSuggest) {
				this.oControl.detachSuggest(this._fSuggest);
				this._fSuggest = null;
			}
			if (this.oControl.removeValidator) {
				this.oControl.removeValidator(this._fValidator);
				this._fValidator = null;
			} else if (this.oControl.detachSuggestionItemSelected) {
				this.oControl.detachSuggestionItemSelected(this._fSuggestionItemSelected);
				this._fSuggestionItemSelected = null;
			}
			this.oControl.unbindAggregation(this.sAggregationName);
			if (this.oControl.removeAllSuggestionColumns) {
				this.oControl.removeAllSuggestionColumns();
			}
			this.oControl.data("_hassuggestionTemplate", false);
			delete this.oControl.__sValidationText;
			delete this.oControl.__bValidatingToken;
		}
		BaseValueListProvider.prototype.destroy.apply(this, arguments);
		// Destroy other local data
		if (this.oJsonModel) {
			this.oJsonModel.destroy();
			this.oJsonModel = null;
		}
		this._oTemplate = null;
		this.sAggregationName = null;
		this.bTypeAheadEnabled = null;
		this._oSorter = null;
	};
	

	return ValueListProvider;

}, /* bExport= */ true);
