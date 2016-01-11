/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.filterbar.FilterItem.
sap.ui.define(['jquery.sap.global', 'sap/m/Label', 'sap/ui/comp/library', 'sap/ui/core/Element', 'sap/ui/core/TooltipBase'],
	function(jQuery, Label, library, Element, TooltipBase) {
	"use strict";


	
	/**
	 * Constructor for a new filterbar/FilterItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * FilterItem represents a selection filed in the basic area of the FilterBar control
	 * @extends sap.ui.core.Element
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.filterbar.FilterItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FilterItem = Element.extend("sap.ui.comp.filterbar.FilterItem", /** @lends sap.ui.comp.filterbar.FilterItem.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		properties : {
	
			/**
			 * the label of the control
			 */
			label : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * the name of the field
			 */
			name : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * mandatory flag
			 */
			mandatory : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * visibility state of the FilterItem
			 */
			visible : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * provide a tooltip for the item. The Tooltip will be assigned to the label.
			 */
			labelTooltip : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Determines if a filter is part of the currently selected variant. This property is ONLY used internally and must not be used by the filter bar consumers.
			 * @since 1.26.1
			 */
			partOfCurrentVariant : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * Controls the visibility of a filter item in the FilterBar
			 * @since 1.26.1
			 */
			visibleInFilterBar : {type : "boolean", group : "Misc", defaultValue : true}
		},
		aggregations : {
	
			/**
			 * the control which will be placed into te basic area
			 */
			control : {type : "sap.ui.core.Control", multiple : false}
		},
		events : {
	
			/**
			 * Fired when the value of a property, for example vVisible, has changed
			 */
			change : {
				parameters : {
	
					/**
					 * Name of the changed property
					 */
					propertyName : {type : "string"}
				}
			}
		}
	}});
	
	
	/**
	 * initialize the filter item
	 * 
	 * @public
	 */
	FilterItem.prototype.init = function() {
		this._oLabel = null;
	};
	
	/**
	 * setter for visible
	 * 
	 * @public
	 * @param {boolean} bIsVisible property
	 */
	FilterItem.prototype.setVisible = function(bIsVisible) {
		this.setProperty("visible", bIsVisible);
		this.fireChange({
			propertyName: "visible"
		});
	};
	
	/**
	 * setter for visible in filter bar
	 * 
	 * @public
	 * @since 1.26.1
	 * @param {boolean} bIsVisible property
	 * @param {boolean} bTriggerWithoutChangeNotification if set, the change notification will not be fired
	 */
	FilterItem.prototype.setVisibleInFilterBar = function(bIsVisible) {
		this.setProperty("visibleInFilterBar", bIsVisible);
	
		this.fireChange({
			propertyName: "visibleInFilterBar"
		});
	};
	
	/**
	 * setter for label
	 * 
	 * @private
	 * @returns {sap.m.Label} label control
	 */
	FilterItem.prototype._createLabelControl = function() {
	
		var sText = this.getLabel();
	
		var oLabelCtrl = new Label({
			text: sText,
			required: this.getMandatory(),
			textAlign: "Begin"
		});
	
		return oLabelCtrl;
	};
	
	/**
	 * setter for mandatory flag
	 * 
	 * @public
	 * @param {string} bValue property
	 */
	FilterItem.prototype.setMandatory = function(bValue) {
		this.setProperty("mandatory", bValue);
	
		if (this._oLabel) {
			this._oLabel.setRequired(bValue);
		}
	
		this.fireChange({
			propertyName: "mandatory"
		});
	};
	
	/**
	 * setter for label
	 * 
	 * @public
	 * @param {string} sValue property
	 */
	FilterItem.prototype.setLabel = function(sValue) {
		this.setProperty("label", sValue);
	
		if (!this._oLabel) {
			this._oLabel = this._createLabelControl();
		}
	
		if (!this.getLabelTooltip()) {
			this.setLabelTooltip(sValue);
		}
	
		this._oLabel.setText(sValue);
	
		this.fireChange({
			propertyName: "label"
		});
	};
	
	/**
	 * setter for tooltip
	 * 
	 * @public
	 * @param {string} sText property
	 */
	FilterItem.prototype.setLabelTooltip = function(sText) {
		this.setProperty("labelTooltip", sText);
	
		if (!this._oLabel) {
			this._oLabel = this._createLabelControl();
		}
	
		this._oLabel.setTooltip(sText);
	};
	
	/**
	 * retrieves the label control. Needed because of an eventual binding to the label
	 * 
	 * @public
	 * @returns {sap.m.Label} the label control
	 */
	FilterItem.prototype.getLabelControl = function() {
	
		if (!this._oLabel) {
			this._oLabel = this._createLabelControl();
		}
	
		return this._oLabel;
	};
	
	/**
	 * destroys this element
	 * 
	 * @public
	 */
	FilterItem.prototype.destroy = function() {
		Element.prototype.destroy.apply(this, arguments);
	
		this._oLabel = null;
	};
	

	return FilterItem;

}, /* bExport= */ true);
