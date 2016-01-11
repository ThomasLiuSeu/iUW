/*
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides FilterController
sap.ui.define(['jquery.sap.global', 'sap/m/P13nFilterItem', 'sap/m/P13nFilterPanel', './BaseController'],
	function(jQuery, P13nFilterItem, P13nFilterPanel, BaseController) {
	"use strict";


	/**
	 * The FilterController can be used to...
	 * 
	 * @class Table Personalization Controller
	 * @extends sap.ui.comp.personalization.BaseController
	 * @author SAP
	 * @version 1.25.0-SNAPSHOT
	 * @alias sap.ui.comp.personalization.FilterController
	 */
	var FilterController = BaseController.extend("sap.ui.comp.personalization.FilterController",
	/** @lends sap.ui.comp.personalization.FilterController */
	{
		constructor: function(sId, mSettings) {
			BaseController.apply(this, arguments);
			this.setType(sap.m.P13nPanelType.filter);
		},
		metadata: {
			events: {
				afterFilterModelDataChange: {}
			}
		}
	});
	
	FilterController.prototype.setTable = function(oTable) {
		BaseController.prototype.setTable.apply(this, arguments);
	
		if (oTable instanceof sap.ui.table.Table) {
			oTable.detachFilter(this._onFilter, this);
			oTable.attachFilter(this._onFilter, this);
		}
	};
	
	FilterController.prototype.getTitleText = function() {
		return sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("PERSODIALOG_TAB_FILTER");
	};
	
	FilterController.prototype.createTableRestoreJson = function() {
		// TODO: this is not correct but the best we can do - problem is that the filter is not extractable from the table instance
		this.setPersistentDataRestore(this.createPersistentStructure());
	};
	
	// sap.ui.comp.personalization.FilterController.prototype._getTable2Json = function() {
	//	
	// }
	
	/**
	 * Overwrite BaseController method because currently we cannot extract persistent model data from table instance
	 */
	FilterController.prototype.syncTable2PersistentModel = function() {
	// NOTE: cannot extract persistent model from table instance
	};
	
	FilterController.prototype.syncTable2TransientModel = function() {
		var oTable = this.getTable();
		var aItems = [];
	
		if (oTable) {
			if (oTable instanceof sap.ui.table.Table) {
				oTable.getColumns().forEach(function(oColumn) {
					if (sap.ui.comp.personalization.Util.isFilterable(oColumn)) {
						aItems.push({
							columnKey: sap.ui.comp.personalization.Util.getColumnKey(oColumn),
							text: oColumn.getLabel().getText(),
							tooltip: (oColumn.getTooltip() instanceof sap.ui.core.TooltipBase) ? oColumn.getTooltip().getTooltip_Text() : oColumn.getTooltip_Text(),
							maxLength: sap.ui.comp.personalization.Util._getCustomProperty(oColumn, "maxLength"),
							type: sap.ui.comp.personalization.Util.getColumnType(oColumn)
						});
					}
				}, this);
			}
			if (oTable instanceof sap.m.Table) {
				oTable.getColumns().forEach(function(oColumn) {
					if (sap.ui.comp.personalization.Util.isFilterable(oColumn)) {
						aItems.push({
							columnKey: sap.ui.comp.personalization.Util.getColumnKey(oColumn),
							text: oColumn.getHeader().getText(),
							tooltip: (oColumn.getHeader().getTooltip() instanceof sap.ui.core.TooltipBase) ? oColumn.getHeader().getTooltip().getTooltip_Text() : oColumn.getHeader().getTooltip_Text(),
							maxLength: sap.ui.comp.personalization.Util._getCustomProperty(oColumn, "maxLength"),
							type: sap.ui.comp.personalization.Util.getColumnType(oColumn)
						});
					}
				}, this);
			}
		}
	
		// Sort the columns in alphabetical order
		var sLanguage;
		try {
			sLanguage = sap.ui.getCore().getConfiguration().getLocale().toString();
		} catch (exception) {
			// this exception can happen if the configured language is not convertible to BCP47 -> getLocale will deliver an exception
			sLanguage = null;
		}
	
		if (sLanguage) {
			aItems.sort(function(a, b) {
				return a.text.localeCompare(b.text, sLanguage, {
					numeric: true
				});
			});
		}
	
		// check if Items was changed at all and take over if it was changed
		var oItemsBefore = this.getModel().getData().transientData.filter.items;
		if (jQuery(aItems).not(oItemsBefore).length !== 0 || jQuery(oItemsBefore).not(aItems).length !== 0) {
			this.getModel().getData().transientData.filter.items = aItems;
		}
	};
	
	FilterController.prototype._onFilter = function(oEvent) {
		// TODO: implement this method. Currently SmartTable does not support filtering directly on the table, only via
		// personalization dialog
	
		// this.fireBeforePotentialTableChange();
		// var oColumn = oEvent.getParameter("column");
		// var sValue = oEvent.getParameter("value");
	
		// if (!bColumnAdded) {
		// this._sort.sortItems = [];
		// this._sort.sortItems.push({createModelDataFromTable
		// key : "0",
		// columnKey : oColumn.getId(),
		// operation : sSortOrder
		// });
		// }
		// this.fireAfterPotentialTableChange();
	
		// this.fireAfterFilterModelDataChange();
	};
	
	FilterController.prototype._hasTableFilterableColumns = function() {
		var oTable = this.getTable();
		if (!oTable) {
			return false;
		}
	
		var bHasFiltering = false;
		oTable.getColumns().some(function(oColumn) {
			if (sap.ui.comp.personalization.Util.isFilterable(oColumn)) {
				bHasFiltering = true;
				return true;
			}
		});
		return bHasFiltering;
	};
	
	FilterController.prototype.getPanel = function(oPayload) {
		if (!this._hasTableFilterableColumns()) {
			return null;
		}
		if (oPayload && oPayload.column) {
			var sColumnKey = sap.ui.comp.personalization.Util.getColumnKey(oPayload.column);
			if (sColumnKey) {
	
				var aItems = this.getModel().getData().transientData.filter.items;
	
				aItems.forEach(function(oItem, iIndex) {
					oItem["isDefault"] = oItem.columnKey === sColumnKey;
				}, this);
			}
		}
		var that = this;
		var oPanel = new P13nFilterPanel({
			containerQuery: true,
			layoutMode: "Desktop",
			type: sap.m.P13nPanelType.filter,
			title: this.getTitleText(),// "{/transientData/filter/title}",
			items: {
				path: "/transientData/filter/items",
				template: new sap.m.P13nItem({
					columnKey: "{columnKey}",
					text: "{text}",
					tooltip: "{tooltip}",
					maxLength: "{maxLength}",
					type: "{type}",
					isDefault: "{isDefault}"
				})
			},
			filterItems: {
				path: "/persistentData/filter/filterItems",
				factory: function(sId, oContext) {
					var oFilterItemData = oContext.getProperty(oContext.sPath);
					var sValue1, sValue2, oFormatter;
					sValue1 = oFilterItemData.value1;
					sValue2 = oFilterItemData.value2;
					// Determine the type to create a formatter
					if (sValue1 instanceof Date) {
						oFormatter = sap.ui.core.format.DateFormat.getDateInstance();
					} else if (typeof sValue1 === "number") {
						oFormatter = sap.ui.core.format.NumberFormat.getFloatInstance();
					}
					// format the value if necessary
					if (oFormatter) {
						sValue1 = sValue1 ? oFormatter.format(sValue1) : sValue1;
						sValue2 = sValue2 ? oFormatter.format(sValue2) : sValue2;
					}
	
					return new P13nFilterItem({
						key: oFilterItemData.key,
						columnKey: oFilterItemData.columnKey,
						exclude: oFilterItemData.exclude,
						operation: oFilterItemData.operation,
						value1: sValue1,
						value2: sValue2
					});
				}
			},
			beforeNavigationTo: that.setModelFunction(that.getModel())
		});
	
		oPanel.attachUpdateFilterItem(function(oEvent) {
			var oData = this.getModel().getData();
			var params = oEvent.getParameters();
			var oFilterItemData = params.filterItemData;
			oData.persistentData.filter.filterItems.some(function(oFilterItem, iIndex) {
				if (oFilterItem.key === params.key) {
					oData.persistentData.filter.filterItems[iIndex] = oFilterItemData;
					return true;
				}
				return false;
			}, this);
		}, this);
	
		oPanel.attachAddFilterItem(function(oEvent) {
			var oData = this.getModel().getData();
			var params = oEvent.getParameters();
			var oFilterItemData = params.filterItemData;
			oData.persistentData.filter.filterItems.forEach(function(oFilterItem, iIndex) {
				if (oFilterItem.key === params.key) {
					oData.persistentData.filter.filterItems[iIndex] = oFilterItemData;
					oFilterItemData = null;
				}
			}, this);
			
			if (oFilterItemData) {
				oData.persistentData.filter.filterItems.push(oFilterItemData);
			}
			
			this.getModel().setData(oData, true);
		}, this);
	
		oPanel.attachRemoveFilterItem(function(oEvent) {
			var params = oEvent.getParameters();
			var oData = this.getModel().getData();
			oData.persistentData.filter.filterItems.some(function(oFilterItem, iIndex) {
				if (oFilterItem.key === params.key) {
					oData.persistentData.filter.filterItems.splice(iIndex, 1);
					this.getModel().setData(oData, true);
					return true;
				}
				return false;
			}, this);
		}, this);
	
		return oPanel;
	};
	
	// sap.ui.comp.personalization.FilterController.prototype.onBeforeSubmit = function() {
	// };
	
	FilterController.prototype.syncJsonModel2Table = function(oJsonModel) {
		var oTable = this.getTable();
		var aColumns = oTable.getColumns();
		var aColumnsUnfiltered = jQuery.extend(true, [], aColumns);
	
		this.fireBeforePotentialTableChange();
	
		if (oTable instanceof sap.ui.table.Table) {
			oJsonModel.filter.filterItems.forEach(function(oFilterItem) {
				var oColumn = sap.ui.comp.personalization.Util.getColumn(oFilterItem.columnKey, aColumns);
				if (oColumn) {
					if (!oColumn.getFiltered()) {
						oColumn.setFiltered(true);
					}
					aColumnsUnfiltered.splice(aColumnsUnfiltered.indexOf(oColumn), 1);
				}
			});
	
			aColumnsUnfiltered.forEach(function(oColumn) {
				if (oColumn && oColumn.getFiltered()) {
					oColumn.setFiltered(false);
				}
			});
		}
	
		this.fireAfterPotentialTableChange();
	};
	
	/**
	 * Operations on filter are processed sometime directly at the table and sometime not. In case that something has been changed via Personalization
	 * Dialog the consumer of the Personalization Dialog has to apply filtering at the table. In case that filter has been changed via user interaction at
	 * table, the change is instantly applied at the table.
	 */
	FilterController.prototype.getChangeType = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataCompare || !oPersistentDataCompare.filter || !oPersistentDataCompare.filter.filterItems) {
			return sap.ui.comp.personalization.Controller.ChangeType.Unchanged;
		}
		var bIsDirty = JSON.stringify(oPersistentDataBase.filter.filterItems) !== JSON.stringify(oPersistentDataCompare.filter.filterItems);
	
		return bIsDirty ? sap.ui.comp.personalization.Controller.ChangeType.ModelChanged : sap.ui.comp.personalization.Controller.ChangeType.Unchanged;
	};
	
	/**
	 * Result is XOR based difference = CurrentModelData - oPersistentDataCompare
	 * 
	 * @param {object} oPersistentDataCompare JSON object. Note: if sortItems is [] then it means that all sortItems have been deleted
	 * @returns {object} JSON object or null
	 */
	FilterController.prototype.getChangeData = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataBase || !oPersistentDataBase.filter || !oPersistentDataBase.filter.filterItems) {
			return this.createPersistentStructure();
		}
	
		if (!oPersistentDataCompare || !oPersistentDataCompare.filter || !oPersistentDataCompare.filter.filterItems) {
			return {
				filter: sap.ui.comp.personalization.Util.copy(oPersistentDataBase.filter)
			};
		}
	
		if (JSON.stringify(oPersistentDataBase.filter.filterItems) !== JSON.stringify(oPersistentDataCompare.filter.filterItems)) {
			return {
				filter: sap.ui.comp.personalization.Util.copy(oPersistentDataBase.filter)
			};
		}
		return null;
	};
	
	/**
	 * @param {object} oPersistentDataBase: JSON object to which different properties from JSON oPersistentDataCompare are added
	 * @param {object} oPersistentDataCompare: JSON object from where the different properties are added to oPersistentDataBase. Note: if filterItems is []
	 *        then it means that all filterItems have been deleted
	 * @returns {object} JSON object as union result of oPersistentDataBase and oPersistentDataCompare
	 */
	FilterController.prototype.getUnionData = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataBase || !oPersistentDataBase.filter || !oPersistentDataBase.filter.filterItems) {
			return this.createPersistentStructure();
		}
	
		if (!oPersistentDataCompare || !oPersistentDataCompare.filter || !oPersistentDataCompare.filter.filterItems) {
			return {
				filter: sap.ui.comp.personalization.Util.copy(oPersistentDataBase.filter)
			};
		}
	
		return {
			filter: sap.ui.comp.personalization.Util.copy(oPersistentDataCompare.filter)
		};
	};
	
	/**
	 * Cleans up before destruction.
	 * 
	 * @private
	 */
	FilterController.prototype.exit = function() {
		BaseController.prototype.exit.apply(this, arguments);
	
		var oTable = this.getTable();
		if (oTable && oTable instanceof sap.ui.table.Table) {
			oTable.detachFilter(this._onFilter, this);
		}
	};
	

	return FilterController;

}, /* bExport= */ true);
