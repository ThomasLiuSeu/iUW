/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.filterbar.FilterGroupItem.
sap.ui.define(['jquery.sap.global', 'sap/m/Label', './FilterItem', 'sap/ui/comp/library', 'sap/ui/core/TooltipBase'],
	function(jQuery, Label, FilterItem, library, TooltipBase) {
	"use strict";


	
	/**
	 * Constructor for a new filterbar/FilterGroupItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * representation for a filter field in the advanced area. Has the same semantical meaning as the new visible in filter bar property.
	 * @extends sap.ui.comp.filterbar.FilterItem
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.filterbar.FilterGroupItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FilterGroupItem = FilterItem.extend("sap.ui.comp.filterbar.FilterGroupItem", /** @lends sap.ui.comp.filterbar.FilterGroupItem.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		properties : {
	
			/**
			 * the title of the group
			 */
			groupTitle : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * the name of the group
			 */
			groupName : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * If set to true, this field will be added to the advanced area ( Dynamic Selection) by default.
			 * This property is mapped against the new visibleInFilterBar property.
			 */
			visibleInAdvancedArea : {type : "boolean", group : "Misc", defaultValue : false}
		}
	}});
	
	
	FilterGroupItem.prototype.init = function() {
		this.setVisibleInAdvancedArea(false);
	};
	
	/**
	 * setter for group title
	 * 
	 * @public
	 * @param {string}
	 *            sValue property
	 */
	FilterGroupItem.prototype.setGroupTitle = function(sValue) {
		this.setProperty("groupTitle", sValue);
	
		this.fireChange({
			propertyName: "groupTitle"
		});
	};
	
	/**
	 * setter for controlling the filters visibility in the filter bar. This property is deprecated, please use 'visibleInFilterBar' The successor of this property
	 * is 'visibleInFilterBar'.
	 * 
	 * @public
	 * @param {boolean}
	 *            bValue property
	 */
	FilterGroupItem.prototype.setVisibleInAdvancedArea = function(bValue) {
		this.setVisibleInFilterBar(bValue);
	};
	
	/**
	 * getter for controlling the filters visibility in the filter bar. This property is deprecated, please use 'visibleInFilterBar' The successor of this property
	 * is 'visibleInFilterBar'.
	 * 
	 * @public
	 * @returns {boolean} bValue property
	 */
	FilterGroupItem.prototype.getVisibleInAdvancedArea = function() {
		return this.getVisibleInFilterBar();
	};
	
	/**
	 * destroys this element
	 * 
	 * @public
	 */
	FilterGroupItem.prototype.destroy = function() {
		FilterItem.prototype.destroy.apply(this, arguments);
	};
	

	return FilterGroupItem;

}, /* bExport= */ true);
