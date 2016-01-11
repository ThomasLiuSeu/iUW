/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.utils.facetFilterListHandler');
/**
* @class facetFilter
* @memberOf sap.apf.ui.reuse.controller
* @name facetFilter
* @description controller for view.facetFilter
*/
sap.ui.controller("sap.apf.ui.reuse.controller.facetFilter", {
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#onInit
	 * @description Called on initialization of the view.
	 * Instantiates all facet filter list related resources.
	 * Sets the initial binding.
	 * Populates value help and selected filters.
	 * */
	onInit : function() {
		var oSelf = this;
		this.oView = this.getView();
		this.oCoreApi = this.oView.oCoreApi;
		this.oUiApi = this.oView.oUiApi;
		this.oPathContextHandler = this.oView.oPathContextHandler;
		this.aFacetFilterListData = this.oView.aFacetFilterListData;
		this.aFacetFilterListControls = this.oView.aFacetFilterListControls;
		this.aFacetFilterListHandlers = this.aFacetFilterListData.map(function(oFacetFilterData) {
			return new sap.apf.ui.utils.FacetFilterListHandler(oSelf.oCoreApi, oSelf.oUiApi, oSelf.oPathContextHandler, oFacetFilterData);
		});
		this.aFacetFilterListDatasets = this.aFacetFilterListData.map(function() {
			return [];
		});
		this.aCachedSelections = this.aFacetFilterListData.map(function() {
			return [];
		});
		this.aSizeLimitForLists = this.aFacetFilterListData.map(function() {
			return 100; // Default Size Limit of sapUI5 controls.
		});
		this._setInitialBinding();
		this._populateValueHelpData();
		this._updateSelectedFilters();
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_setInitialBinding
	 * @description Binds the appropriate JSONModel to facet filter list controls.
	 * */
	_setInitialBinding : function() {
		var oSelf = this;
		this.aFacetFilterListControls.forEach(function(oFacetFilterListControl, index) {
			oFacetFilterListControl.bindItems("/", new sap.m.FacetFilterItem({
				key : '{key}',
				text : '{text}',
				selected : '{selected}'
			}));
			var oModel = new sap.ui.model.json.JSONModel(oSelf.aFacetFilterListDatasets[index]);
			oFacetFilterListControl.setModel(oModel);
		});
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_populateValueHelpData
	 * @description Fetches value help data for all facet filter list controls.
	 * */
	_populateValueHelpData : function() {
		var oSelf = this;
		this.aFacetFilterListHandlers.forEach(function(oFflHandler, index) {
			oFflHandler.fetchValueHelpData().then(oSelf._populateValueHelpDataFor(index));
		});
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_updateSelectedFilters
	 * @description Updates selected filter data for all facet filter list controls.
	 * */
	_updateSelectedFilters : function() {
		var oSelf = this;
		this.aFacetFilterListHandlers.forEach(function(oFflHandler, index) {
			oFflHandler.fetchSelectedFilterData().then(oSelf._updateSelectedFilterFor(index));
		});
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_populateValueHelpDataFor
	 * @param {integer} index of facet filter control.
	 * @description Returns a closure which will be invoked when value help promise is resolved.
	 * @returns {function}
	 * */
	_populateValueHelpDataFor : function(index) {
		var oFacetFilterListControl = this.aFacetFilterListControls[index];
		var oFacetFilterData = this.aFacetFilterListData[index];
		var aFacetFilterListDataSet = this.aFacetFilterListDatasets[index];
		var oFacetFilterListModel = oFacetFilterListControl.getModel();
		var nSizeLimitForList = this.aSizeLimitForLists[index];
		return function(aData) {
			aData.forEach(function(oData) {
				var bSelected = false;
				var nIndex = -1;
				aFacetFilterListDataSet.forEach(function(oDataRow, index) {
					if (oDataRow.key === oData.key) {
						nIndex = index;
						return;
					}
				});
				if (nIndex !== -1) {
					bSelected = aFacetFilterListDataSet[nIndex].selected;
					aFacetFilterListDataSet.splice(nIndex, 1);
				}
				aFacetFilterListDataSet.push({
					key : oData.key,
					text : oData.text,
					selected : bSelected
				});
			});
			//Modify the  size limit of the model based on the length of the data so that all values are shown in the facet filter list.
			if (nSizeLimitForList < aData.length) {
				nSizeLimitForList = aData.length;
				oFacetFilterListModel.setSizeLimit(nSizeLimitForList);
			}
			oFacetFilterListModel.updateBindings();
		};
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_updateSelectedFilterFor
	 * @param {integer} index of facet filter control.
	 * @description Returns a closure which will be invoked when selected filter promise is resolved.
	 * 				The facet filter will be removed from the facet filter list if it gets resolved with an error.
	 * @returns {function}
	 * */
	_updateSelectedFilterFor : function(index) {
		var oFacetFilterListControl = this.aFacetFilterListControls[index];
		var oFacetFilterData = this.aFacetFilterListData[index];
		var aFacetFilterListDataSet = this.aFacetFilterListDatasets[index];
		var oFacetFilterListModel = oFacetFilterListControl.getModel();
		var aCachedSelection = this.aCachedSelections[index];
		var nSizeLimitForList = this.aSizeLimitForLists[index];
		return function(aData, oError) {
			if (oError) {
				var oFacetFilterList = oFacetFilterListControl.getParent();
				oFacetFilterList.removeList(index);
				return;
			}
			aFacetFilterListDataSet.forEach(function(oDataRow) {
				oDataRow.selected = false;
			});
			aCachedSelection.splice(0, aCachedSelection.length);
			aData.forEach(function(oData) {
				var aMatchingDataRows = aFacetFilterListDataSet.filter(function(oDataRow) {
					return oDataRow.key === oData.key;
				});
				aMatchingDataRows.forEach(function(oDataRow) {
					oDataRow.selected = true;
				});
				if (!aMatchingDataRows.length) {
					aFacetFilterListDataSet.push({
						key : oData.key,
						text : oData.text,
						selected : true
					});
				}
				aCachedSelection.push(oData.key);
			});
			//Modify the  size limit of the model based on the length of the data so that all values are shown in the facet filter list.
			if (nSizeLimitForList < aData.length) {
				nSizeLimitForList = aData.length;
				oFacetFilterListModel.setSizeLimit(nSizeLimitForList);
			}
			oFacetFilterListModel.updateBindings();
		};
	},
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#onListClose
	 * @param {oEvent} List Close Event.
	 * @description Creates a sap.apf.core.Filter with selected values and update the context path handler.
	 * */
	onListClose : function(oEvent) {
		var oClosedListControl = oEvent.getSource();
		var nIndex = this.aFacetFilterListControls.indexOf(oClosedListControl);
		var sProperty = this.aFacetFilterListData[nIndex].property;
		var bIsAllSelected = oEvent.getParameter('allSelected');
		var aSelectedKeys = [];
		if (bIsAllSelected) {	// Fetch all item keys from model data.
			var oItemBinding = oClosedListControl.getBinding("items");
			var aAllItemData = oItemBinding.getModel().getData();
			aSelectedKeys = aAllItemData.map(function(oData) {
				return oData.key;
			});
		} else {	// Fetch only the selected item keys.
			var aSelectedItems = oEvent.getParameter('selectedItems');
			aSelectedKeys = aSelectedItems.map(function(oItem) {
				return oItem.getKey();
			});
		}
		var aCachedSelections = this.aCachedSelections[nIndex];
		/**
		 * Compare current selections with cache.
		 * */
		if (aSelectedKeys.length === aCachedSelections.length) {
			var sSortedSelectedKeys = JSON.stringify(aSelectedKeys.sort());
			var sSortedCachedSelections = JSON.stringify(aCachedSelections.sort());
			var bFiltersNotChanged = (sSortedSelectedKeys === sSortedCachedSelections);
			if (bFiltersNotChanged) {
				return;
			}
		}
		this.aCachedSelections[nIndex] = aSelectedKeys;
		var oFilter = this.oCoreApi.createFilter();
		var oOrTerm = oFilter.getTopAnd().addOr();
		aSelectedKeys.forEach(function(sValue) {
			oOrTerm.addExpression({
				name : sProperty,
				operator : "EQ",
				value : sValue
			});
		});
		this.oPathContextHandler.update(sProperty, oFilter);
		this.oUiApi.selectionChanged(true);
	},
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#onResetPress
	 * @description Reset the initial filter for all the facet filter list controls and triggers contextChanged.
	 * */
	onResetPress : function() {
		var aFilterProperties = this.aFacetFilterListData.map(function(oFacetFilterData) {
			return oFacetFilterData.property;
		});
		this.oPathContextHandler.restoreInitialContext(aFilterProperties);
		this.onContextChanged();
		this.oUiApi.selectionChanged(true);
	},
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#onContextChanged
	 * @description Invoked by facet filter handler when context is changed.
	 * Updates the facet filter list controls with new path context handler content.
	 * */
	onContextChanged : function() {
		/*this._populateValueHelpData(); UNCOMMENT TO TRIGGER VALUE HELP REQUESTS.*/
		this._updateSelectedFilters();
	},
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#getFormattedFilters
	 * @param {string} sProperty - Property name of filter.
	 * @description Currently used by printHelper to get formatted filter values.
	 * @returns {Array} when property is available as a facet filter.
	 * 		Array will be of the form : [{
	 * 			name: "sPropertyText",
	 * 			operator: "EQ",
	 * 			value: "sKey - sText",
	 * 			formatted: true
	 * 		}] 
	 * null when property is not available as a facet filter.
	 * */
	getFormattedFilters : function(sProperty) {
		var aAllProperties = this.aFacetFilterListData.map(function(oFacetFilterListData) {
			return oFacetFilterListData.property;
		});
		var nFilterControlIndex = aAllProperties.indexOf(sProperty);
		if (nFilterControlIndex === -1) {
			return null;
		}
		var oFacetFilterListControl = this.aFacetFilterListControls[nFilterControlIndex];
		var aResultArray = oFacetFilterListControl.getSelectedItems().map(function(oItem) {
			return {
				name : oFacetFilterListControl.getTitle(),
				operator : "EQ",
				value : oItem.getText(),
				formatted : true
			// TODO Get information from facet filter list handler.
			};
		});
		return aResultArray;
	}
});
