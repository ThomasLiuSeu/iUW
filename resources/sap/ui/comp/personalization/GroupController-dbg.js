/*
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides GroupController
sap.ui.define(['jquery.sap.global', 'sap/m/P13nGroupItem', 'sap/m/P13nGroupPanel', './BaseController'],
	function(jQuery, P13nGroupItem, P13nGroupPanel, BaseController) {
	"use strict";


	/**
	 * The GroupController can be used to handling the grouping of the Analytical and sap.m.Table. The Grouping on the sap.ui.table.Table is not supported
	 * and the existing coding is only for testing and finding the limitations integrated.
	 * 
	 * @class Table Personalization Controller
	 * @extends sap.ui.comp.personalization.BaseController
	 * @author SAP
	 * @version 1.25.0-SNAPSHOT
	 * @alias sap.ui.comp.personalization.GroupController
	 */
	var GroupController = BaseController.extend("sap.ui.comp.personalization.GroupController",
	/** @lends sap.ui.comp.personalization.GroupController */
	{
		constructor: function(sId, mSettings) {
			BaseController.apply(this, arguments);
			this.setType(sap.m.P13nPanelType.group);
		},
		metadata: {
			events: {
				afterGroupModelDataChange: {}
			}
		}
	});
	
	GroupController.prototype.setTable = function(oTable) {
		BaseController.prototype.setTable.apply(this, arguments);
	
		if (oTable instanceof sap.ui.table.AnalyticalTable || oTable instanceof sap.ui.table.Table) {
			oTable.detachGroup(this._onGroup, this);
			oTable.attachGroup(this._onGroup, this);
		}
	};
	
	GroupController.prototype.getTitleText = function() {
		return sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("PERSODIALOG_TAB_GROUP");
	};
	
	/**
	 * this method will make a complete json snapshot of the current table instance ("original") from the perspective of the columns controller; the json
	 * snapshot can later be applied to any table instance to recover all columns related infos of the "original" table
	 */
	GroupController.prototype._getTable2Json = function() {
		var oJsonData = this.createPersistentStructure();
		var oTable = this.getTable();
		if (oTable) {
			var aColumns = [];
			if (oTable instanceof sap.ui.table.Table && oTable.getGroupBy) {
				aColumns = oTable.getGroupBy() || [];
				if (typeof aColumns === "string") {
					aColumns = [
						aColumns
					];
				}
				// TODO: the getGroupBy returns no grouping when we call it to early. The result can be that we do not find the default grouping of the
				// ui.Table
			}
			if (oTable instanceof sap.ui.table.AnalyticalTable && oTable.getGroupedColumns) {
				aColumns = oTable.getGroupedColumns() || [];
			}
	
			aColumns.forEach(function(oColumn, iIndex) {
				if (typeof oColumn === "string") {
					oColumn = sap.ui.getCore().byId(oColumn);
				}
				if (oColumn.getGrouped()) {
					oJsonData.group.groupItems.push({
						columnKey: sap.ui.comp.personalization.Util.getColumnKey(oColumn),
						operation: oColumn.getSortOrder && oColumn.getSortOrder() === sap.ui.table.SortOrder.Ascending ? sap.m.P13nConditionOperation.GroupAscending : sap.m.P13nConditionOperation.GroupDescending,
						showIfGrouped: oColumn.getShowIfGrouped ? oColumn.getShowIfGrouped() : false
					});
				}
			}, this);
		}
		return oJsonData;
	};
	
	GroupController.prototype.syncTable2TransientModel = function() {
		var oTable = this.getTable();
		var aItems = [];
	
		if (oTable) {
			if (oTable instanceof sap.ui.table.AnalyticalTable || oTable instanceof sap.ui.table.Table) {
				oTable.getColumns().forEach(function(oColumn) {
					if (sap.ui.comp.personalization.Util.isGroupable(oColumn)) {
						aItems.push({
							columnKey: sap.ui.comp.personalization.Util.getColumnKey(oColumn),
							text: oColumn.getLabel().getText(),
							tooltip: (oColumn.getTooltip() instanceof sap.ui.core.TooltipBase) ? oColumn.getTooltip().getTooltip_Text() : oColumn.getTooltip_Text()
						});
					}
				}, this);
			}
			if (oTable instanceof sap.m.Table) {
				oTable.getColumns().forEach(function(oColumn) {
					if (sap.ui.comp.personalization.Util.isGroupable(oColumn)) {
						aItems.push({
							columnKey: sap.ui.comp.personalization.Util.getColumnKey(oColumn),
							text: oColumn.getHeader().getText(),
							tooltip: (oColumn.getHeader().getTooltip() instanceof sap.ui.core.TooltipBase) ? oColumn.getHeader().getTooltip().getTooltip_Text() : oColumn.getHeader().getTooltip_Text()
						});
					}
				}, this);
			}
		}
	
		// Group the columns in alphabetical order
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
	
		aItems.splice(0, 0, {
			key: null,
			text: "(none)"
		});
	
		// check if groupItems was changed at all and take over if it was changed
		var oGroupItemsBefore = this.getModel().getData().transientData.group.items;
		if (jQuery(aItems).not(oGroupItemsBefore).length !== 0 || jQuery(oGroupItemsBefore).not(aItems).length !== 0) {
			this.getModel().getData().transientData.group.items = aItems;
		}
	};
	
	GroupController.prototype._onGroup = function(oEvent) {
		var oTable = this.getTable();
	
		var aGroupedColumns = oEvent.mParameters.groupedColumns;
	
		this.fireBeforePotentialTableChange();
	
		var oData = this.getModel().getData();
		oData.persistentData.group.groupItems = [];
		aGroupedColumns.forEach(function(oColumn, iIndex) {
			if (typeof oColumn === "string") {
				oColumn = sap.ui.getCore().byId(oColumn);
			}
	
			if (oTable && oTable instanceof sap.ui.table.AnalyticalTable) {
				if (oColumn.getGrouped()) {
					oData.persistentData.group.groupItems.push({
						columnKey: sap.ui.comp.personalization.Util.getColumnKey(oColumn),
						showIfGrouped: oColumn.getShowIfGrouped ? oColumn.getShowIfGrouped() : false
					});
				}
			} else if (oTable && oTable instanceof sap.ui.table.Table) {
				oData.persistentData.group.groupItems.push({
					columnKey: sap.ui.comp.personalization.Util.getColumnKey(oColumn),
					showIfGrouped: false
				});
			}
		}, this);
	
		this.fireAfterPotentialTableChange();
	
		this.fireAfterGroupModelDataChange();
	};
	
	GroupController.prototype._hasTableGroupableColumns = function() {
		var oTable = this.getTable();
		if (!oTable) {
			return false;
		}
	
		var bHasGrouping = false;
		oTable.getColumns().some(function(oColumn) {
			if (sap.ui.comp.personalization.Util.isGroupable(oColumn)) {
				bHasGrouping = true;
				return true;
			}
		});
		return bHasGrouping;
	};
	
	GroupController.prototype.getPanel = function() {
		if (!this._hasTableGroupableColumns()) {
			return null;
		}
	
		var that = this;
		var oPanel = new P13nGroupPanel({
			maxGroups: this.getTable() instanceof sap.ui.table.AnalyticalTable ? "-1" : "1",
			type: sap.m.P13nPanelType.group,
			title: this.getTitleText(),// "{/transientData/group/title}",
			containerQuery: true,
			layoutMode: "Desktop",
			items: {
				path: "/transientData/group/items",
				template: new sap.m.P13nItem({
					columnKey: "{columnKey}",
					text: "{text}",
					tooltip: "{tooltip}"
				})
			},
			groupItems: {
				path: "/persistentData/group/groupItems",
				template: new P13nGroupItem({
					columnKey: "{columnKey}",
					operation: "{operation}",
					showIfGrouped: "{showIfGrouped}"
				})
			},
			beforeNavigationTo: that.setModelFunction(that.getModel())
		});
	
		oPanel.attachAddGroupItem(function(oEvent) {
			var oData = this.getModel().getData();
			var params = oEvent.getParameters();
			var oGroupItem = {
				columnKey: params.groupItemData.getColumnKey(),
				operation: params.groupItemData.getOperation(),
				showIfGrouped: params.groupItemData.getShowIfGrouped()
			};
			if (params.index >= 0) {
				oData.persistentData.group.groupItems.splice(params.index, 0, oGroupItem);
			} else {
				oData.persistentData.group.groupItems.push(oGroupItem);
			}
			this.getModel().setData(oData, true);
		}, this);
	
		oPanel.attachRemoveGroupItem(function(oEvent) {
			var params = oEvent.getParameters();
			var oData = this.getModel().getData();
			oData.persistentData.group.groupItems.splice(params.index, 1);
		}, this);
	
		return oPanel;
	};
	
	GroupController.prototype.syncJsonModel2Table = function(oJsonModel) {
		var oTable = this.getTable();
		var aColumns = oTable.getColumns();
		var aColumnsUngrouped = jQuery.extend(true, [], aColumns);
	
		this.fireBeforePotentialTableChange();
	
		if (oTable instanceof sap.ui.table.AnalyticalTable) {
			oJsonModel.group.groupItems.forEach(function(oGroupItem) {
				var oColumn = sap.ui.comp.personalization.Util.getColumn(oGroupItem.columnKey, aColumns);
				if (!oColumn) {
					return;
				}
				if (!oColumn.getGrouped()) {
					oColumn.setGrouped(true);
				}
				if (oColumn.setShowIfGrouped() !== oGroupItem.showIfGrouped) {
					oColumn.setShowIfGrouped(oGroupItem.showIfGrouped);
				}			
				
				aColumnsUngrouped.splice(aColumnsUngrouped.indexOf(oColumn), 1);
			});
			
			aColumnsUngrouped.forEach(function(oColumn) {
				if (oColumn && oColumn.getGrouped()) {
					oColumn.setGrouped(false);
					oColumn.setShowIfGrouped(false);
				}
			});
		} else if (oTable instanceof sap.ui.table.Table) {
			if (oJsonModel.group.groupItems.length > 0) {
				oJsonModel.group.groupItems.some(function(oGroupItem) {
					var oColumn = sap.ui.comp.personalization.Util.getColumn(oGroupItem.columnKey, aColumns);
					if (oColumn) {
						oTable.setGroupBy(oColumn);
						return true;
					}
					return false;
				}, this);
			} else {
				// TODO removing the grouping does not work. we need a correction on the ui.table https://git.wdf.sap.corp:8080/#/c/776785/
				oTable.setGroupBy(null);
			}
		}
	
		this.fireAfterPotentialTableChange();
	};
	
	/**
	 * Operations on group are processed every time directly at the table. In case that something has been changed via Personalization Dialog or via user
	 * interaction at table, the change is instantly applied at the table.
	 */
	GroupController.prototype.getChangeType = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataCompare || !oPersistentDataCompare.group || !oPersistentDataCompare.group.groupItems) {
			return sap.ui.comp.personalization.Controller.ChangeType.Unchanged;
		}
		var bIsDirty = JSON.stringify(oPersistentDataBase.group.groupItems) !== JSON.stringify(oPersistentDataCompare.group.groupItems);
	
		return bIsDirty ? sap.ui.comp.personalization.Controller.ChangeType.ModelChanged : sap.ui.comp.personalization.Controller.ChangeType.Unchanged;
	};
	
	/**
	 * Result is XOR based difference = CurrentModelData - oPersistentDataCompare
	 * 
	 * @param {object} oPersistentDataCompare JSON object
	 * @returns {object} JSON object or empty object
	 */
	GroupController.prototype.getChangeData = function(oPersistentDataBase, oPersistentDataCompare) {
	
		if (!oPersistentDataBase || !oPersistentDataBase.group || !oPersistentDataBase.group.groupItems) {
			return this.createPersistentStructure();
		}
	
		if (!oPersistentDataCompare || !oPersistentDataCompare.group || !oPersistentDataCompare.group.groupItems) {
			return {
				group: sap.ui.comp.personalization.Util.copy(oPersistentDataBase.group)
			};
		}
	
		if (JSON.stringify(oPersistentDataBase.group.groupItems) !== JSON.stringify(oPersistentDataCompare.group.groupItems)) {
			return {
				group: sap.ui.comp.personalization.Util.copy(oPersistentDataBase.group)
			};
		}
		return null;
	};
	
	/**
	 * @param {object} oPersistentDataBase: JSON object to which different properties from JSON oPersistentDataCompare are added
	 * @param {object} oPersistentDataCompare: JSON object from where the different properties are added to oPersistentDataBase. Note: if groupItems is []
	 *        then it means that all groupItems have been deleted
	 * @returns {object} new JSON object as union result of oPersistentDataBase and oPersistentDataCompare
	 */
	GroupController.prototype.getUnionData = function(oPersistentDataBase, oPersistentDataCompare) {
		// not valid
		if (!oPersistentDataCompare || !oPersistentDataCompare.group || !oPersistentDataCompare.group.groupItems) {
			return {
				group: sap.ui.comp.personalization.Util.copy(oPersistentDataBase.group)
			};
		}
	
		return {
			group: sap.ui.comp.personalization.Util.copy(oPersistentDataCompare.group)
		};
	};
	
	/**
	 * Cleans up before destruction.
	 * 
	 * @private
	 */
	GroupController.prototype.exit = function() {
		BaseController.prototype.exit.apply(this, arguments);
	
		var oTable = this.getTable();
		if (oTable && (oTable instanceof sap.ui.table.AnalyticalTable || oTable instanceof sap.ui.table.Table)) {
			oTable.detachGroup(this._onGroup, this);
		}
	};
	

	return GroupController;

}, /* bExport= */ true);
