/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartform.GroupElement.
sap.ui.define([
	'jquery.sap.global', 'sap/m/Label', 'sap/ui/comp/library', 'sap/ui/core/Control', 'sap/ui/fl/registry/ChangeRegistry', 'sap/ui/fl/registry/SimpleChanges'
], function(jQuery, Label, library, Control, ChangeRegistry, SimpleChanges) {
	"use strict";

	/**
	 * Constructor for a new smartform/GroupElement.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class A GroupElement is a combination of one label and different controls associated to this label.
	 * @extends sap.ui.core.Control
	 * @author Alexander Fürbach
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartform.GroupElement
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var GroupElement = Control.extend("sap.ui.comp.smartform.GroupElement", /** @lends sap.ui.comp.smartform.GroupElement.prototype */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * Label of the fields/elements. If not set the control will use label from metadata.
				 */
				label: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Index of element to be used for label determination
				 */
				elementForLabel: {
					type: "int",
					group: "Misc",
					defaultValue: 0
				}
			},
			defaultAggregation: "elements",
			aggregations: {

				/**
				 * Aggregation of controls to be displayed together with a label.
				 */
				elements: {
					type: "sap.ui.core.Control",
					multiple: true,
					singularName: "element"
				}
			}
		}
	});

	/**
	 * Initialize the control.
	 * 
	 * @private
	 */
	GroupElement.prototype.init = function() {
		// Register to flexibility services statically(only once when the first instance is getting created)
		if (!GroupElement._bHasRegisteredToFlexibilityServices) {
			var oChangeRegistry = ChangeRegistry.getInstance();
			// change Element element label
			oChangeRegistry.registerControlForSimpleChange(this.getMetadata().getElementName(), SimpleChanges.renameField);
			// hide/show Element element
			oChangeRegistry.registerControlForSimpleChange(this.getMetadata().getElementName(), SimpleChanges.hideControl);
			oChangeRegistry.registerControlForSimpleChange(this.getMetadata().getElementName(), SimpleChanges.unhideControl);
			GroupElement._bHasRegisteredToFlexibilityServices = true;
		}
		this.oFormElement = new sap.ui.layout.form.FormElement();
		this._oView = null;
		this._sViewBindingPath = "";
		this._bLayoutApplied = false;
		this._sLabelBindingPath = "";
		this._sEditMode = false;
		this._oLabel = null;
	};

	GroupElement._bHasRegisteredToFlexibilityServices = false;

	/**
	 * Updates the label of the form element.
	 * 
	 * @private
	 */
	GroupElement.prototype.updateLabelOfFormElement = function() {

		var aField = this.oFormElement.getFields();
		var iIndex = this.getElementForLabel();

		if (!this._oLabel) {
			if (aField.length > iIndex && aField[iIndex].getMetadata().getName() === "sap.ui.comp.smartfield.SmartField") {
				if (aField[iIndex].getShowLabel()) {
					if (this.getLabel()) {
						aField[iIndex].setTextLabel(this.getLabel());
					}
					this._oLabel = new sap.ui.comp.smartfield.SmartLabel(); // aField[iIndex].getSmartLabel();
					this._oLabel.setLabelFor(aField[iIndex]);
				}
			} else {
				this._oLabel = new Label();
				if (this.getLabel()) {
					this._oLabel.setText(this.getLabel());
				}
			}
		} else if (this.getLabel()) {
			if (aField.length > iIndex && aField[iIndex].getMetadata().getName() === "sap.ui.comp.smartfield.SmartField") {
				aField[iIndex].setTextLabel(this.getLabel());
				this._oLabel = new sap.ui.comp.smartfield.SmartLabel(); // aField[iIndex].getSmartLabel();
				this._oLabel.setLabelFor(aField[iIndex]);
			} else {
				this._oLabel.setText(this.getLabel());
			}
		}

		if (this._oLabel) {
			this.oFormElement.setLabel(this._oLabel);
		}
	};

	/**
	 * Setter for property editable of all smart fields in children hierarchy.
	 * 
	 * @param {boolean} bEditMode new value for editable property of smart fields.
	 * @return {sap.ui.comp.smartform.GroupElement} <code>this</code> to allow method chaining.
	 * @public
	 */
	GroupElement.prototype.setEditMode = function(bEditMode) {

		this._bEditMode = bEditMode;

		var aElement = this.getElements();
		var aItem = [];

		aElement.forEach(function(oElement) {
			if (oElement.getMetadata().getName() === "sap.m.VBox") {
				aItem = oElement.getItems();
				aItem.forEach(function(oItem) {
					if (oItem.getMetadata().getName() === "sap.ui.comp.smartfield.SmartField") {
						if (!(oItem.data("editable") === false)) {
							oItem.setEditable(bEditMode);
						}
					}
				});
			} else if (oElement.getMetadata().getName() === "sap.ui.comp.smartfield.SmartField") {
				if (!(oElement.data("editable") === false)) {
					oElement.setEditable(bEditMode);
				}
			}
		});
		return this;

	};

	/**
	 * Updates the visibility of the FormElement
	 * 
	 * @private
	 */
	GroupElement.prototype._updateFormElementVisibility = function() {
		if (this.getVisible() === false) {
			return;
		}
		var aFields = this.oFormElement.getFields();
		var bVisible = aFields.some(function(oField) {
			return oField.getVisible();
		});
		if (this.oFormElement.getVisible() != bVisible) {
			this.oFormElement.setVisible(bVisible);
		}
	};

	/**
	 * Returns the text of the label.
	 * 
	 * @return {string} text of the label.
	 * @public
	 */
	GroupElement.prototype.getLabelText = function() {
		if (this._oLabel) {
			if (this._oLabel.getText) {
				return this._oLabel.getText();
			}
		}
	};

	/**
	 * Getter for property <code>label</code>.
	 * 
	 * @return {sap.ui.comp.smartform.Group} <code>this</code> to allow method chaining.
	 * @public
	 */
	GroupElement.prototype.getLabel = function() {
		var sLabel = this.getProperty("label");
		if (!sLabel && this._oLabel) {
			sLabel = this._oLabel.getText();
		}
		return sLabel;
	};

	GroupElement.prototype.onAfterRendering = function() {
		this._bLayoutApplied = false;
	};

	GroupElement.prototype.onBeforeRendering = function() {

		var aFields = this.oFormElement.getFields();

		if (this.getParent().getParent().getProperty("useHorizontalLayout") && !this._bLayoutApplied) {
			this._bLayoutApplied = true;
			this.oFormElement.removeAllFields();
			this.oFormElement.addField(new sap.m.VBox({
				"items": [
					this._oLabel
				].concat(aFields)
			}));
		}
	};

	/**
	 * Sets the given value for the given property
	 * 
	 * @param {string} sPropertyName name of the property to set
	 * @param {any} oValue value to set the property to
	 * @return {sap.ui.comp.smartform.GroupElement} <code>this</code> to allow method chaining.
	 * @public
	 */
	GroupElement.prototype.setProperty = function(sPropertyName, oValue) {
		var returnValue;
		returnValue = Control.prototype.setProperty.apply(this, arguments);
		if (sPropertyName === 'label') {
			this.updateLabelOfFormElement();
		}
		if (sPropertyName === 'visible') {
			this.oFormElement.setVisible(oValue);
			this._updateFormElementVisibility();
		}
		return returnValue;
	};

	/**
	 * Returns the from element.
	 * 
	 * @return {sap.ui.layout.form.FormElement} the form element.
	 * @public
	 */
	GroupElement.prototype.getFormElement = function() {
		return this.oFormElement;
	};

	/**
	 * Adds some control into the aggregation <code>elements</code>
	 * 
	 * @param {sap.ui.core.Control} oElement the control to add.
	 * @public
	 */
	GroupElement.prototype.addElement = function(oElement) {
		var that = this;
		if (oElement.getEditable) {
			if (!oElement.getEditable()) {
				oElement.data("editable", false);
			}
		}
		if (oElement.attachVisibleChanged) {
			oElement.attachVisibleChanged(function(oEvent) {
				that._updateFormElementVisibility();
			});
		}
		this.oFormElement.addField(oElement);
		this.updateLabelOfFormElement();
	};

	/**
	 * Adds some CustomeData into the aggregation <code>customData</code>. Additionally the customData is also added to the SmartFields in the
	 * children hierarchy
	 * 
	 * @param {sap.ui.core.CustomData} oCustomData the customData to add.
	 * @return {sap.ui.comp.smartform.GroupElement} <code>this</code> to allow method chaining.
	 * @public
	 */
	GroupElement.prototype.addCustomData = function(oCustomData) {
		Control.prototype.addCustomData.apply(this, arguments);

		var aElement = this.getFormElement().getFields();

		aElement.forEach(function(oElement) {
			if (oElement.getMetadata().getName() === "sap.ui.comp.smartfield.SmartField") {
				if (oCustomData.getKey() === "defaultDropDownDisplayBehaviour") {
					var oConfiguration = oElement.getConfiguration();
					if (!oConfiguration) {
						oConfiguration = new sap.ui.comp.smartfield.Configuration();
						oElement.setConfiguration(oConfiguration);
					}
					if (oConfiguration.getDisplayBehaviour() === "auto") {
						oConfiguration.setDisplayBehaviour(oCustomData.getValue());
					}
				}
				oElement.addCustomData(oCustomData.clone());
			}
		});
		return this;
	};

	/**
	 * Returns the aggregated object(s) for the named aggregation.
	 * 
	 * @param {string} sAggregationName the name of the aggregation
	 * @return {sap.ui.base.ManagedObject[]} the aggregation object
	 * @public
	 */
	GroupElement.prototype.getAggregation = function(sAggregationName) {
		if (sAggregationName === 'elements') {
			return this.getElements();
		}

		return Control.prototype.getAggregation.apply(this, arguments);
	};

	/**
	 * Inserts a control into the aggregation <code>elements</code>
	 * 
	 * @param {sap.ui.core.Control} oElement the control to insert into aggregation named elements.
	 * @param {int} iIndex the 0-based index the control should be inserted at.
	 * @return {sap.ui.comp.smartform.GroupElement} <code>this</code> to allow method chaining.
	 * @public
	 */
	GroupElement.prototype.insertElement = function(oElement, iIndex) {
		this.oFormElement.insertField.apply(this.oFormElement, arguments);
		return this;
	};

	/**
	 * Removes a control from the aggregation <code>elements</code>
	 * 
	 * @param {int|string|sap.ui.comp.smartform.GroupElement} vElement the GroupElement to remove or its index or id.
	 * @return {sap.ui.core.Control} the removed control or null.
	 * @public
	 */
	GroupElement.prototype.removeElement = function(vElement) {
		return this.oFormElement.removeField.apply(this.oFormElement, arguments);
	};

	/**
	 * Removes all controls from the aggregation <code>elements</code>
	 * 
	 * @return {sap.ui.core.Controls[]} an array of the removed controls.
	 * @public
	 */
	GroupElement.prototype.removeAllElements = function() {
		return this.oFormElement.removeAllFields.apply(this.oFormElement, arguments);
	};

	/**
	 * Getter for aggregation <code>elements</code>
	 * 
	 * @return {sap.ui.core.Controls[]} an array of the removed controls.
	 * @public
	 */
	GroupElement.prototype.getElements = function() {
		return this.oFormElement.getFields();
	};

	/**
	 * Destroys all the controls in the aggregation <code>elements</code>
	 * 
	 * @return {sap.ui.comp.smartform.GroupElement} <code>this</code> to allow method chaining.
	 * @public
	 */
	GroupElement.prototype.destroyElements = function() {
		this.oFormElement.destroyFields();
		return this;
	};

	/**
	 * Checks for the provided control in the aggregation named <code>elements</code> and returns its index if found or -1 otehrwise.
	 * 
	 * @param {sap.ui.core.Control} oElement the control whose index is looked for.
	 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise.
	 * @public
	 */
	GroupElement.prototype.indexOfElement = function(oElement) {
		return this.oFormElement.indexOfField(oElement);
	};

	return GroupElement;

}, /* bExport= */true);
