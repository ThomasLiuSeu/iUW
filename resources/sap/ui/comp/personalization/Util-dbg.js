/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

/**
 * @namespace Provides utitlity functions for the personalization dialog
 * @name sap.ui.comp.personalization.Util
 * @author SAP SE
 * @version 1.28.1
 * @private
 * @since 1.25.0
 */
sap.ui.define([
	'sap/ui/base/Object'
], function(BaseObject) {
	"use strict";
	var Util = {

		copy: function(oObject) {
			if (oObject instanceof Array) {
				return jQuery.extend(true, [], oObject);
			}
			return jQuery.extend(true, {}, oObject);
		},

		sort: function(sKeyName, aArray) {
			var aResult = this.copy(aArray);
			aResult.sort(function(a, b) {
				var aText = a[sKeyName].toLocaleLowerCase();
				var bText = b[sKeyName].toLocaleLowerCase();

				if (aText < bText) {
					return -1;
				}
				if (aText > bText) {
					return 1;
				}
				// a must be equal to b
				return 0;
			});
			return aResult;
		},

		semanticEqual: function(oItemA, oItemB) {
			if (!oItemA || !oItemB) {
				return false;
			}
			for ( var property in oItemA) {
				if (oItemB[property] === undefined || oItemA[property] !== oItemB[property]) {
					return false;
				}
			}
			return true;
		},

		/**
		 * @param {object}
		 * @returns {boolean} true if at least one property of oChangeType has 'ModelChanged' or 'TableChanged'.
		 */
		hasChangedType: function(oChangeType) {
			for ( var type in oChangeType) {
				if (oChangeType[type] === sap.ui.comp.personalization.Controller.ChangeType.ModelChanged || oChangeType[type] === sap.ui.comp.personalization.Controller.ChangeType.TableChanged) {
					return true;
				}
			}
			return false;
		},

		/**
		 * @param {object}
		 * @returns {boolean} true if at least one property of oChangeType has 'ModelChanged' or 'TableChanged'.
		 */
		isTrueForAll: function(oObjectOfBoolean) {
			for ( var type in oObjectOfBoolean) {
				if (oObjectOfBoolean[type] === false) {
					return false;
				}
			}
			return true;
		},

		/**
		 * @param {string} sKey
		 * @param {sap.ui.table.Column[] | sap.m.Column[]} aColumns
		 * @returns {sap.ui.table.Column | sap.m.Column}
		 */
		getColumn: function(sColumnKey, aColumns) {
			var oResultColumn = null;
			aColumns.some(function(oColumn) {
				if (this.getColumnKey(oColumn) === sColumnKey) {
					oResultColumn = oColumn;
					return true;
				}
			}, this);
			return oResultColumn;
		},

		/**
		 * @param {sap.m.P13nSortItem[]} aSortItems
		 * @param {string} sKey
		 * @returns {integer} Index of sKey or -1 if not found
		 */
		getIndexByKey: function(aModelItems, sColumnKey) {
			var iIndex = -1;
			aModelItems.some(function(oModelItem, i) {
				if (oModelItem.columnKey === sColumnKey) {
					iIndex = i;
					return true;
				}
			});
			return iIndex;
		},

		/**
		 * @param {sap.m.Column | sap.ui.table.Column} oColumn
		 * @returns {string | null}
		 */
		getColumnKey: function(oColumn) {
			return this._getCustomProperty(oColumn, "columnKey") || oColumn.getId();
		},

		/**
		 * @param {sap.m.Column | sap.ui.table.Column} oColumn
		 * @returns {string | null}
		 */
		getColumnType: function(oColumn) {
			return this._getCustomProperty(oColumn, "type");
		},

		/**
		 * @param {sap.m.Column | sap.ui.table.Column} oColumn
		 * @returns {boolean}
		 */
		isGroupable: function(oColumn) {
			if (oColumn.getLeadingProperty && oColumn.getLeadingProperty()) {
				if (this._getCustomProperty(oColumn, "aggregationRole") !== "measure") {
					return true;
				}
			}
			if (this._getCustomProperty(oColumn, "leadingProperty")) {
				if (this._getCustomProperty(oColumn, "aggregationRole") !== "measure") {
					return true;
				}
			}

			if (oColumn instanceof sap.ui.table.Column) {
				return oColumn.getParent().getEnableGrouping();
			}
			
			return false;
		},

		/**
		 * @param {sap.m.Column | sap.ui.table.Column} oColumn
		 * @returns {boolean}
		 */
		isSortable: function(oColumn) {
			if (oColumn.getSortProperty) {
				if (oColumn.getSortProperty()) {
					return true;
				}
			}
			if (this._getCustomProperty(oColumn, "sortProperty")) {
				return true;
			}
			return false;
		},

		/**
		 * @param {sap.m.Column | sap.ui.table.Column} oColumn
		 * @returns {boolean}
		 */
		isFilterable: function(oColumn) {
			if (oColumn.getFilterProperty) {
				if (oColumn.getFilterProperty()) {
					return true;
				}
			}
			if (this._getCustomProperty(oColumn, "filterProperty")) {
				return true;
			}
			return false;
		},

		/**
		 * @param {sap.m.Column[] || sap.ui.table.Column[]} aColumns
		 * @returns {boolean} True if all columns support 'columnKey' or all columns do not support 'columnKey'. False in case of mixed situation.
		 */
		isConsistent: function(aColumns) {
			if (!aColumns || !aColumns.length) {
				return true;
			}
			var bConsistent = true;
			var bPersistentFirst = sap.ui.comp.personalization.Util.getColumnKey(aColumns[0]) !== aColumns[0].getId();
			aColumns.some(function(oColumn) {
				var bPersistentCurrent = sap.ui.comp.personalization.Util.getColumnKey(oColumn) !== oColumn.getId();
				if (bPersistentCurrent !== bPersistentFirst) {
					bConsistent = false;
					return true; // leave some()
				}
			});
			return bConsistent;
		},

		/**
		 * @param {string} sKeyName: property name for key
		 * @param {string} sKeyValue: kay value which is looking for
		 * @param {Array} aArray: array where the element with key value 'sKeyValue' is looking for
		 * @returns {object | null} either found array element or null if 'sKeyValue' does not exist in aArray
		 */
		getArrayElementByKey: function(sKeyName, sKeyValue, aArray) {
			if (!aArray || !aArray.length) {
				return null;
			}
			var oElement = null;
			aArray.some(function(oElement_) {
				if (oElement_[sKeyName] !== undefined && oElement_[sKeyName] === sKeyValue) {
					oElement = oElement_;
					return true;
				}
			});
			return oElement;
		},

		/**
		 * @param {sap.m.Column | sap.ui.table.Column} oColumn
		 * @param {string} sProperty
		 * @param {boolean} bParse
		 * @returns {object | null} either value of custom data property or null
		 */
		_getCustomProperty: function(oColumn, sProperty) {
			var oCustomData = this._getCustomData(oColumn);
			if (!oCustomData || !sProperty) {
				return null;
			}
			return oCustomData[sProperty];
		},

		/**
		 * @param {sap.m.Column | sap.ui.table.Column} oColumn
		 * @returns {object | null} either custom data object or null
		 */
		_getCustomData: function(oColumn) {
			if (!oColumn) {
				return null;
			}
			var oCustomData = oColumn.data("p13nData");
			if (typeof oCustomData === "string") {
				try {
					oCustomData = JSON.parse(oCustomData);
					oColumn.data("p13nData", oCustomData);
				} catch (oException) {
					// do not update the custom data, go ahead
				}
			}
			return oCustomData;
		}

	};
	return Util;
}, /* bExport= */true);
