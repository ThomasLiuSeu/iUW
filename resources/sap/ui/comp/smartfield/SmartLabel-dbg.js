/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartfield.SmartLabel.
sap.ui.define(['jquery.sap.global', 'sap/m/Label', 'sap/ui/comp/library', './BindingUtil'],
	function(jQuery, Label, library, BindingUtil) {
	"use strict";


	
	/**
	 * Constructor for a new smartfield/SmartLabel.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * is a wrapper for the sap.m.Label and used with the SmartField-Control
	 * @extends sap.m.Label
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartfield.SmartLabel
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SmartLabel = Label.extend("sap.ui.comp.smartfield.SmartLabel", /** @lends sap.ui.comp.smartfield.SmartLabel.prototype */ { metadata : {
	
		library : "sap.ui.comp"
	}});
	
	
	SmartLabel.prototype.init = function() {

		this._oSmartField = null;
		this._sSmartFieldId = null;
	};
	
	/**
	 * binds the label properties
	 * 
	 * @private
	 */
	SmartLabel.prototype._bindProperties = function() {

	
		var oBinding = new BindingUtil();
	
		var oInfo = this._oSmartField.getBindingInfo("visible");
		if (oInfo) {
			this.bindProperty("visible", oBinding.toBinding(oInfo));
		} else {
			this.setVisible(this._oSmartField.getVisible());
		}
	
		oInfo = this._oSmartField.getBindingInfo("mandatory");
		if (oInfo) {
			this.bindProperty("required", oBinding.toBinding(oInfo));
		} else {
			this.setRequired(this._oSmartField.getMandatory());
		}
	
		oInfo = this._oSmartField.getBindingInfo("textLabel");
		if (oInfo) {
			this.bindProperty("text", oBinding.toBinding(oInfo));
		} else {
			this.setText(this._oSmartField.getTextLabel());
		}
	
		oInfo = this._oSmartField.getBindingInfo("tooltipLabel");
		if (oInfo) {
			this.bindProperty("tooltip", oBinding.toBinding(oInfo));
		} else {
			this.setTooltip(this._oSmartField.getTooltipLabel());
		}
	
	};
	
	/**
	 * apply odata meta data for the label
	 * 
	 * @public
	 */
	SmartLabel.prototype.getLabelInfo = function() {

		var oMetaDataProperty, oLabelInfo;
	
		if (this._oSmartField) {
	
			this._bindProperties();
	
			oMetaDataProperty = this._oSmartField.getDataProperty();
			if (oMetaDataProperty) {
				oLabelInfo = this._getLabelInfo(oMetaDataProperty);
				if (oLabelInfo) {
					if (oLabelInfo.text) {
						if (!this._oSmartField.getTextLabel()) {
							this.setText(oLabelInfo.text);
						}
					}
					if (oLabelInfo.quickinfo) {
						if (!this._oSmartField.getTooltipLabel()) {
							this.setTooltip(oLabelInfo.quickinfo);
						}
					}
				}
			}
	
			if (!oLabelInfo || !oLabelInfo.quickinfo) {
				if (!this._oSmartField.getTooltipLabel()) {
					this.setTooltip(this.getText());
				}
			}
		}
	};
	
	/**
	 * assign the label to a control.
	 * 
	 * @param {sap.ui.comp.SmartField} oSmartField is the smart control
	 * @public
	 */
	SmartLabel.prototype.setLabelFor = function(oSmartField) {
	
		if (oSmartField) {

			if (typeof oSmartField === 'string') {
				this._oSmartField = sap.ui.getCore().getControl(oSmartField);
				if (!this._oSmartField) {
					this._sSmartFieldId = oSmartField;
				}

			} else {
				this._oSmartField = oSmartField;
			}

			this._setLabelFor();
		}
	};
	
	SmartLabel.prototype._setLabelFor = function() {

		var oDataProperty;

		if (this._oSmartField) {
			if (this._oSmartField.getDataProperty) {
				oDataProperty = this._oSmartField.getDataProperty();
				if (oDataProperty) {
					this.getLabelInfo();
				} else {
					this._oSmartField.attachInitialise(jQuery.proxy(this.getLabelInfo, this));
				}
			}

			sap.m.Label.prototype.setLabelFor.apply(this, [
				this._oSmartField
			]);
		}
	};	
	
	/**
	 * Retrieve all label related data from the OData property of a field
	 * 
	 * @param {object} oProperty the definition of a property of an OData entity.
	 * @returns {object} describing label specific data
	 * @private
	 */
	SmartLabel.prototype._getLabelInfo = function(oProperty) {

		if (oProperty) {
			var sText = null;
			if (oProperty.extensions["sap:label"]) {
				sText = oProperty.extensions["sap:label"].value ? oProperty.extensions["sap:label"].value : oProperty.extensions["sap:label"];
			}
			var sQuickInfo = null;
			if (oProperty.extensions["sap:quickinfo"]) {
				sQuickInfo = oProperty.extensions["sap:quickinfo"].value ? oProperty.extensions["sap:quickinfo"].value : oProperty.extensions["sap:quickinfo"];
			}
			return {
				text: sText ? sText : null,
				quickinfo: sQuickInfo ? sQuickInfo : null
			};
		}
	};
	
	
	SmartLabel.prototype.onBeforeRendering = function() {

		if (this._sSmartFieldId) {
			this._oSmartField = sap.ui.getCore().getControl(this._sSmartFieldId);
			this._setLabelFor();

			this._sSmartFieldId = null;
		}

	};
	
	/**
	 * Cleans up the resources associated with this element and all its children. After an element has been destroyed, it can no longer be used in the UI!
	 * Applications should call this method, if they don't need the element any longer.
	 * 
	 * @param {boolean} bSuppressInvalidate if <code>true</code>, the UI element is not marked for redraw.
	 * @public
	 */
	SmartLabel.prototype.destroy = function(bSuppressInvalidate) {

	
		this._oSmartField = null;
		this._sSmartFieldId = null;
		
		Label.prototype.destroy.apply(this, [
			bSuppressInvalidate
		]);
	};
	

	return SmartLabel;

}, /* bExport= */ true);
