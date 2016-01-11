/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
// -----------------------------------------------------------------------------
// Retrieves the data for a value list from the OData metadata to bind to a given control/aggregation (TODO: take into account Searchsupported +
// ValueList In/Out/InOut parameter to set data)
// -----------------------------------------------------------------------------
sap.ui.define(['jquery.sap.global', 'sap/m/List', 'sap/m/PlacementType', 'sap/m/ResponsivePopover', 'sap/m/StandardListItem', './BaseValueListProvider', 'sap/ui/comp/valuehelpdialog/ValueHelpDialog', 'sap/ui/model/json/JSONModel'],
	function(jQuery, List, PlacementType, ResponsivePopover, StandardListItem, BaseValueListProvider, ValueHelpDialog, JSONModel) {
	"use strict";


	/**
	 * Retrieves the data for a collection from the OData metadata to bind to a given control/aggregation
	 * 
	 * @constructor
	 * @experimental This module is only for internal/experimental use!
	 * @public
	 * @param {object} mParams - map containing the control,aggregation,annotation and the oODataModel
	 * @author Peter Harbusch, Pavan Nayak, Thomas Biesemann
	 */
	var ValueHelpProvider = function(mParams) {
		if (mParams) {
			this.preventInitialDataFetchInValueHelpDialog = mParams.preventInitialDataFetchInValueHelpDialog;
			this.isRangeOnlyDialog = !mParams.annotation; // If no annotation --> Show only Ranges
			this.sTitle = mParams.title;
			this.sFieldName = mParams.fieldName;
			this.bSupportMultiselect = mParams.supportMultiSelect;
			this.bSupportRanges = mParams.supportRanges;
			this.bIsSingleIntervalRange = mParams.isSingleIntervalRange;
			this.bTakeOverInputValue = (mParams.takeOverInputValue === false) ? false : true;
			// If field is of type Single Interval -> The dialog should support only 1 interval range selection
			if (this.bIsSingleIntervalRange) {
				this.isRangeOnlyDialog = true;
				this.bSupportRanges = true;
			}
	
			if (mParams.type === "Edm.Decimal") {
				this._sType = "numeric";
			} else if (mParams.type === "Edm.DateTime" && mParams.displayFormat === "Date") {
				this._sType = "date";
			}
			this._sMaxLength = mParams.maxLength;
	
			this.additionalAnnotations = mParams.additionalAnnotations;
		}
	
		BaseValueListProvider.apply(this, arguments); // Call constructor of base class
	
		this._onInitialise();
	};
	
	// TODO: Instead of extending/inheriting maybe we should try using the same BaseValueListProdiver instance but with different uses
	/**
	 * Inherit from sap.ui.comp.providers.BaseValueListProvider
	 */
	ValueHelpProvider.prototype = jQuery.sap.newObject(BaseValueListProvider.prototype);
	
	/**
	 * Metadata is available --> Initialise the relevant stuff
	 * 
	 * @private
	 */
	ValueHelpProvider.prototype._onInitialise = function() {
		// Check if ValueHelp is supported by the control
		if (this.oControl.attachValueHelpRequest) {
			this._fVHRequested = jQuery.proxy(function(oEvent) {
				this.oControl = oEvent.getSource();
				this.bForceTriggerDataRetreival = oEvent.getParameter("fromSuggestions");
				if (this.bTakeOverInputValue || this.bForceTriggerDataRetreival) {
					this.sBasicSearchText = oEvent.getSource().getValue();
				}
				this._createValueHelpDialog();
			}, this);
			this.oControl.attachValueHelpRequest(this._fVHRequested);
		}
	};
	
	/**
	 * Creates the Value Help Dialog
	 * 
	 * @private
	 */
	ValueHelpProvider.prototype._createValueHelpDialog = function() {
		if (!this.bCreated) {
			this.bCreated = true;
			// Create ValueHelpDialog instance once and reuse it
			this.oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({  // FIXME workaround to make sinon stubs work with AMD
				basicSearchText: this.sBasicSearchText,
				supportRangesOnly: this.isRangeOnlyDialog,
				supportMultiselect: this.bSupportMultiselect,
				title: this.sTitle,
				supportRanges: this.bSupportRanges,
				displayFormat: this.sDisplayFormat,
				ok: jQuery.proxy(this._onOK, this),
				cancel: jQuery.proxy(this._onCancel, this),
				afterClose: jQuery.proxy(function() {
					if (this.oPrimaryValueListAnnotation) {
						this._resolveAnnotationData(this.oPrimaryValueListAnnotation);
					}
					this.oValueHelpDialog.destroy();
					this.bCreated = false;
					if (this.oControl && this.oControl.focus) {
						this.oControl.focus();
					}
				}, this)
			});
	
			// Enable the Dialog to show only 1 interval range selection
			if (this.bIsSingleIntervalRange) {
				this.oValueHelpDialog.setIncludeRangeOperations([
					sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.BT, sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EQ
				]);
				this.oValueHelpDialog.setMaxIncludeRanges(1);
				this.oValueHelpDialog.setMaxExcludeRanges(0);
				this._updateInitialInterval();
			}
	
			if (this.oControl.$() && this.oControl.$().closest(".sapUiSizeCompact").length > 0) { // check if the Token field runs in Compact mode
				this.oValueHelpDialog.addStyleClass("sapUiSizeCompact");
			}
			if (this.bSupportRanges) {
				this.oValueHelpDialog.setRangeKeyFields([
					{
						label: this.sTitle,
						key: this.sFieldName,
						type: this._sType,
						maxLength: this._sMaxLength
					}
				]);
			}
			if (!this.isRangeOnlyDialog) {
				this._createAdditionalValueHelpControls();
				this._createCollectiveSearchControls();
				this.oValueHelpDialog.setModel(this.oODataModel);
			}
	
			// pass the existing tokens to the value help dialog
			if (this.oControl.getTokens) {
				var aTokens = this.oControl.getTokens();
				this.oValueHelpDialog.setTokens(aTokens);
			}
	
			// Force trigger the data request if the fetch was initiated from Suggest
			if (this.bForceTriggerDataRetreival) {
				this._rebindTable();
				this.bForceTriggerDataRetreival = false;
			}
	
			this.oValueHelpDialog.open();
		}
	};
	
	/**
	 * Updated the ValueHelpDialog with the initial value of the interval token
	 * 
	 * @private
	 */
	ValueHelpProvider.prototype._updateInitialInterval = function() {
		var sIntervalValue = this.oControl.getValue(), oToken, oRange, aValues;
		if (sIntervalValue) {
			oToken = new sap.m.Token();
			oRange = {
				exclude: false,
				keyField: this.sKey
			};
			aValues = sIntervalValue.split("-");
			if (aValues && aValues.length === 2) {
				oRange.operation = "BT";
				oRange.value1 = aValues[0];
				oRange.value2 = aValues[1];
			} else {
				oRange.operation = "EQ";
				oRange.value1 = sIntervalValue;
			}
	
			oToken.data("range", oRange);
		}
		if (oToken) {
			this.oValueHelpDialog.setTokens([
				oToken
			]);
		}
	};
	
	/**
	 * Creates the necessary control(s) for Collective Search Help on the ValueHelpDialog
	 * 
	 * @private
	 */
	ValueHelpProvider.prototype._createCollectiveSearchControls = function() {
		var oPopOver, oList, oItem, i = 0, len = 0, fOnSelect, oAdditionalAnnotation, oResourceBundle;
		if (this.additionalAnnotations && this.additionalAnnotations.length) {
			fOnSelect = jQuery.proxy(function(oEvt) {
				var oSource = oEvt.getParameter("listItem"), oAnnotation;
				oPopOver.close();
				if (oSource) {
					oAnnotation = oSource.data("_annotation");
					if (oAnnotation) {
						this._triggerAnnotationChange(oAnnotation);
					}
				}
			}, this);
			// Selection Controls
			oList = new List({
				mode: sap.m.ListMode.SingleSelectMaster,
				selectionChange: fOnSelect
			});
			oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
			oPopOver = new ResponsivePopover({
				placement: PlacementType.Bottom,
				showHeader: true,
				title: oResourceBundle.getText("COLLECTIVE_SEARCH_SELECTION_TITLE"),
				content: [
					oList
				]
			});
	
			oItem = new StandardListItem({
				title: this.oPrimaryValueListAnnotation.valueListTitle
			});
			oItem.data("_annotation", this.oPrimaryValueListAnnotation);
			oList.addItem(oItem);
			oList.setSelectedItem(oItem);
	
			this.oValueHelpDialog.oSelectionTitle.setText(" - " + this.oPrimaryValueListAnnotation.valueListTitle);
			len = this.additionalAnnotations.length;
			for (i = 0; i < len; i++) {
				oAdditionalAnnotation = this.additionalAnnotations[i];
				oItem = new StandardListItem({
					title: oAdditionalAnnotation.valueListTitle
				});
				oItem.data("_annotation", oAdditionalAnnotation);
				oList.addItem(oItem);
			}
			this.oValueHelpDialog.oSelectionButton.setVisible(true);
			this.oValueHelpDialog.oSelectionTitle.setVisible(true);
			this.oValueHelpDialog.oSelectionButton.attachPress(function() {
				oPopOver.openBy(this);
			});
		}
	};
	
	ValueHelpProvider.prototype._triggerAnnotationChange = function(oAnnotation) {
		this.oValueHelpDialog.oSelectionTitle.setText(" - " + oAnnotation.valueListTitle);
		this.oValueHelpDialog.resetTableState();
		this._resolveAnnotationData(oAnnotation);
		this._createAdditionalValueHelpControls();
	};
	
	/**
	 * Create the SmartFilter control on the Value Help Dialog and set the model
	 * 
	 * @private
	 */
	ValueHelpProvider.prototype._createAdditionalValueHelpControls = function() {
		var sBasicSearchFieldName = null;
		this.oValueHelpDialog.setKey(this.sKey);
		this.oValueHelpDialog.setKeys(this._aKeys);
		this.oValueHelpDialog.setDescriptionKey(this.sDescription);
		this.oValueHelpDialog.setTokenDisplayBehaviour(this.sTokenDisplayBehaviour);
	
		/*
		 * This is necessary since, ValueHelpDialog control expects columns for table would be filled from a model called columns with column data!
		 */
		// init the columns model for the table
		var oColModel = new JSONModel();
		oColModel.setData({
			cols: this._aCols
		});
		this.oValueHelpDialog.setModel(oColModel, "columns");
	
		// Set the Basic search field if search is supported
		if (this.bSupportBasicSearch) {
			sBasicSearchFieldName = this.sKey;
		}
		// Create the smart filter
		this.oSmartFilterBar = new sap.ui.comp.smartfilterbar.SmartFilterBar({
			entityType: this.sValueListEntityName,
			basicSearchFieldName: sBasicSearchFieldName,
			advancedMode: true,
			expandAdvancedArea: !this.bForceTriggerDataRetreival,
			search: this._onFilterBarSearchPressed.bind(this),
			reset: this._onFilterBarResetPressed.bind(this),
			filterChange: jQuery.proxy(this._onFilterBarFilterChange, this),
			initialise: jQuery.proxy(this._onFilterBarInitialise, this)
		});
		if (this.oFilterProvider) {
			this.oSmartFilterBar.data("dateFormatSettings", this.oFilterProvider._oDateFormatSettings);
		}
		// This has to be set before the SmartFilter is initialised!
		this.oSmartFilterBar.isRunningInValueHelpDialog = true;
		// Set SmartFilter on ValueHelp Dialog
		this.oValueHelpDialog.setFilterBar(this.oSmartFilterBar);
	};
	
	/**
	 * Called when the filter data is changed in SmartFilter
	 * 
	 * @private
	 */
	ValueHelpProvider.prototype._onFilterBarFilterChange = function() {
		var oTable = this.oValueHelpDialog.theTable;
		if (oTable) {
			oTable.setShowOverlay(true);
		}
		this.oValueHelpDialog.TableStateSearchData();
	};
	
	/**
	 * Called when the search is triggered in SmartFilter
	 * 
	 * @private
	 */
	ValueHelpProvider.prototype._onFilterBarSearchPressed = function() {
		this._rebindTable();
	};
	
	/**
	 * Binds the table taking current filters and parameters into account
	 * 
	 * @private
	 */
	ValueHelpProvider.prototype._rebindTable = function() {
		var aFilters, mParameters, oTable;
		aFilters = this.oSmartFilterBar.getFilters();
		mParameters = this.oSmartFilterBar.getParameters() || {};
		if (this.aSelect && this.aSelect.length) {
			mParameters["select"] = this.aSelect.toString();
		}
	
		oTable = this.oValueHelpDialog.theTable;
		oTable.setShowOverlay(false);
		this.oValueHelpDialog.TableStateDataSearching();
		oTable.setBusy(true);
		oTable.bindRows({
			path: "/" + this.sValueListEntitySetName,
			filters: aFilters,
			parameters: mParameters,
			sorter: new sap.ui.model.Sorter(this.sKey),
			events: {
				dataReceived: jQuery.proxy(function(oEvt) {
					this.oValueHelpDialog.TableStateDataFilled();
					oTable.setBusy(false);
					var oBinding = oEvt.getSource(), iBindingLength;
					if (oBinding && this.oValueHelpDialog && this.oValueHelpDialog.isOpen()) {
						iBindingLength = oBinding.getLength();
						// Infinite number of requests are triggered if an error occurs, so don't update if no data is present
						// TODO: Is this really required?
						// If this update is only relevant for token handling, the below check should be fine!
						if (iBindingLength) {
							this.oValueHelpDialog.update();
						}
					}
				}, this)
			}
		});
	};
	
	/**
	 * Called when the reset button was clicked in the SmartFilter
	 * 
	 * @private
	 */
	ValueHelpProvider.prototype._onFilterBarResetPressed = function() {
		this._calculateFilterInputData();
		if (this.oSmartFilterBar) {
			this.oSmartFilterBar.setFilterData(this.mFilterInputData);
		}
	};
	
	/**
	 * Called when the filterbar is initialised
	 * 
	 * @private
	 */
	ValueHelpProvider.prototype._onFilterBarInitialise = function() {
		var oBasicSearchField = null;
		// (Re-)Set the data to default
		this._onFilterBarResetPressed();
	
		// Update the basic search text!
		if (this.oSmartFilterBar && this.oSmartFilterBar.getBasicSearchControl) {
			oBasicSearchField = this.oSmartFilterBar.getBasicSearchControl();
			if (oBasicSearchField) {
				oBasicSearchField.setValue(this.sBasicSearchText);
			}
		}
		if (!this.preventInitialDataFetchInValueHelpDialog) {
			this._rebindTable();
		}
	};
	
	/**
	 * Callback method after OK is clicked on the VH Dialog
	 * 
	 * @param {object} oControlEvent - the event data from the control
	 * @private
	 */
	ValueHelpProvider.prototype._onOK = function(oControlEvent) {
		var aTokens = oControlEvent.getParameter("tokens"), oRangeData, sKey, i = 0, aRowData = [], oRowData = null;
	
		if (this.oControl instanceof sap.m.MultiInput) {
			this.oControl.setTokens(aTokens);
			i = aTokens.length;
			while (i--) {
				oRowData = aTokens[i].data("row");
				if (oRowData) {
					aRowData.push(oRowData);
				}
			}
		} else {
			if (aTokens[0]) {
				// Single Interval
				if (this.bIsSingleIntervalRange) {
					oRangeData = aTokens[0].data("range");
					if (oRangeData) {
						// check if data is in the format: "2005-2014"
						if (oRangeData.operation === "BT") {
							sKey = oRangeData.value1 + "-" + oRangeData.value2;
						} else {
							sKey = oRangeData.value1;
						}
					}
				} else {
					sKey = aTokens[0].getKey();
				}
				oRowData = aTokens[0].data("row");
				if (oRowData) {
					aRowData.push(oRowData);
				}
			}
			this.oControl.setValue(sKey);
	
			// Manually trigger the change event on sapUI5 control since it doesn't do this internally on setValue!
			this.oControl.fireChange({
				value: sKey,
				validated: true
			});
		}
		this._calculateAndSetFilterOutputData(aRowData);
		this.oValueHelpDialog.close();
		this.oValueHelpDialog.setModel(null);
	};
	
	/**
	 * Callback method after Cancel is clicked on the VH Dialog
	 * 
	 * @private
	 */
	ValueHelpProvider.prototype._onCancel = function() {
		this.oValueHelpDialog.close();
		this.oValueHelpDialog.setModel(null);
	};
	
	/**
	 * Destroys the object
	 */
	ValueHelpProvider.prototype.destroy = function() {
		if (this.oControl && this.oControl.detachValueHelpRequest) {
			this.oControl.detachValueHelpRequest(this._fVHRequested);
			this._fVHRequested = null;
		}
		BaseValueListProvider.prototype.destroy.apply(this, arguments);
		// Destroy other local data
		if (this.oValueHelpDialog) {
			this.oValueHelpDialog.destroy();
			this.oValueHelpDialog = null;
		}
		if (this.oSmartFilterBar) {
			this.oSmartFilterBar.destroy();
			this.oSmartFilterBar = null;
		}
		this.additionalAnnotations = null;
		this.sTitle = null;
		this.sFieldName = null;
	};
	

	return ValueHelpProvider;

}, /* bExport= */ true);
