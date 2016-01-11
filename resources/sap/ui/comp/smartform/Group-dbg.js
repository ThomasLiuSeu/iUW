/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartform.Group.
sap.ui.define(['jquery.sap.global', 'sap/ui/comp/library', 'sap/ui/core/Control', 'sap/ui/fl/registry/ChangeRegistry', 'sap/ui/fl/registry/SimpleChanges', 'sap/ui/layout/ResponsiveFlowLayoutData', 'sap/ui/layout/form/FormContainer'],
	function(jQuery, library, Control, ChangeRegistry, SimpleChanges, ResponsiveFlowLayoutData, FormContainer) {
	"use strict";

	/**
	 * Constructor for a new smartform/Group.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Groups are used to group group elements.
	 * @extends sap.ui.core.Control
	 *
	 * @author Alexander Fürbach
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartform.Group
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Group = Control.extend("sap.ui.comp.smartform.Group", /** @lends sap.ui.comp.smartform.Group.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		properties : {
	
			/**
			 * Label for the group.
			 */
			label : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Specifies whether the group shall be expandable.
			 */
			expandable : {type : "boolean", group : "Misc", defaultValue : false}
		},
		defaultAggregation : "groupElements",
		aggregations : {
	
			/**
			 * A GroupElement is a combination of one label and different controls associated to this label.
			 */
			groupElements : {type : "sap.ui.comp.smartform.GroupElement", multiple : true, singularName : "groupElement"}, 
	
			/**
			 * Layout to specify how the group shall be rendered (e.g. span and line-break)
			 */
			layout : {type : "sap.ui.layout.GridData", multiple : false}
		}
	}});
	
	
	/**
	 * Initialize the control.
	 * 
	 * @private
	 */
	Group.prototype.init = function() {
		if (!Group._bHasRegisteredToFlexibilityServices) {		
			var oChangeRegistry = ChangeRegistry.getInstance();
			// hide/show group
			oChangeRegistry.registerControlForSimpleChange(this.getMetadata().getElementName(),
					SimpleChanges.hideControl);
			oChangeRegistry.registerControlForSimpleChange(this.getMetadata().getElementName(),
					SimpleChanges.unhideControl);
			// change group label
			oChangeRegistry.registerControlForSimpleChange(this.getMetadata().getElementName(),
					SimpleChanges.renameGroup);
			// add group element
			oChangeRegistry.registerControlForSimpleChange(this.getMetadata().getElementName(),
					SimpleChanges.addField);
			// move group elements
			oChangeRegistry.registerControlForSimpleChange(this.getMetadata().getElementName(),
					SimpleChanges.moveFields);
			Group._bHasRegisteredToFlexibilityServices = true;
		}
	
		var oResponsiveLayout = new ResponsiveFlowLayoutData({
			"linebreak" : true,
			"linebreakable" : true
		});
		this._oFormContainer = new FormContainer({
			"expandable" : this.getExpandable(),
			"layoutData" : oResponsiveLayout
		});
		this._updateFormContainerLabel();
	};
	
	Group._bHasRegisteredToFlexibilityServices = false;
	
	/**
	 * Setter for property editable of all smart fields in children hierarchy.
	 * 
	 * @param {boolean}
	 *          bEditMode new value for editable property of smart fields.
	 * @return {sap.ui.comp.smartform.Group} <code>this</code> to allow method chaining.
	 * @public
	 */
	Group.prototype.setEditMode = function(bEditMode) {
	
		var aGroupElement = this.getGroupElements();
	
		aGroupElement.forEach(function(oGroupElement) {
			oGroupElement.setEditMode(bEditMode);
		});
		return this;
	
	};
	
	/**
	 * Updates title of form container
	 * 
	 * @private
	 */
	Group.prototype._updateFormContainerLabel = function() {
		var oTitle;
		oTitle = new sap.ui.core.Title({
			text : this.getLabel()
		});
		this._oFormContainer.setTitle(oTitle);
	};
	
	/**
	 * Sets the given value for the given property.
	 * 
	 * @param {string} sPropertyName the property to set the value for
	 * @param {any}
	 *          oValue value to set the property to.
	 * @return {sap.ui.comp.smartform.Group} <code>this</code> to allow method chaining.
	 * @public
	 */
	Group.prototype.setProperty = function(sPropertyName, oValue) {
		var returnValue;
		returnValue = Control.prototype.setProperty.apply(this, arguments);
	
		if (sPropertyName === 'label') {
			this._updateFormContainerLabel();
		}
		if (sPropertyName === 'expandable') {
			this._oFormContainer.setExpandable(oValue);
		}
		if (sPropertyName === 'visible') {
			this._oFormContainer.setVisible(oValue);
		}
		return returnValue;
	};
	
	/**
	 * Gets the form container.
	 * 
	 * @return {sap.ui.layout.FormContainer} the form container
	 * @public
	 */
	Group.prototype.getFormContainer = function() {
		return this._oFormContainer;
	};
	
	/**
	 * Sets the form container.
	 * 
	 * @param {sap.ui.layout.FormContainer}
	 *          oFormContainer form container to set
	 * @public
	 */
	Group.prototype.setFormContainer = function(oFormContainer) {
		this._oFormContainer = oFormContainer;
	};
	
	/**
	 * Adds some entity to the given aggregation.
	 * 
	 * @param {string}
	 *          sAggregationName the strung identifying the aggregation that oObject should be added to.
	 * @param {sap.ui.base.ManagedObject}
	 *          oObject the object to add.
	 * @return {sap.ui.comp.smartform.Group} <code>this</code> to allow method chaining.
	 * @public
	 */
	Group.prototype.addAggregation = function(sAggregationName, oObject) {
		if (sAggregationName === "groupElements") {
			this._oFormContainer.addFormElement(oObject.getFormElement());
		}
		return Control.prototype.addAggregation.apply(this, arguments);
	};
	
	/**
	 * Sets a new object in the named 0..1 aggregation.
	 * 
	 * @param {string}
	 *          sAggregationName name of an 0..1 aggregation.
	 * @param {sap.ui.base.ManagedObject}
	 *          oObject the managed object that is set as aggregated object.
	 * @return {sap.ui.comp.smartform.Group} <code>this</code> to allow method chaining.
	 * @public
	 */
	Group.prototype.setAggregation = function(sAggregationName, oObject) {
		if (sAggregationName === "layout") {
			if (this._oFormContainer) {
				this._oFormContainer.setAggregation("layoutData", oObject);
			}
		} else {
			return Control.prototype.setAggregation.apply(this, arguments);
		}
	};
	
	/**
	 * Adds some GroupElement into the aggregation <code>groupElements</code>
	 * 
	 * @param {sap.ui.comp.smartform.GroupElement}
	 *          oGroupElement group element to add to aggregation named groupElements.
	 * @return {sap.ui.comp.smartform.Group} <code>this</code> to allow method chaining.
	 * @public
	 */
	Group.prototype.addGroupElement = function(oGroupElement) {
		this._oFormContainer.addFormElement(oGroupElement.getFormElement());
		return this.addAggregation("groupElements", oGroupElement);
	};
	
	/**
	 * Adds some CustomeData into the aggregation <code>customData</code>. Additionally the customData is also added to
	 * the SmartFields in the children hierarchy
	 * 
	 * @param {sap.ui.core.CustomData}
	 *          oCustomData the customData to add.
	 * @return {sap.ui.comp.smartform.Group} <code>this</code> to allow method chaining.
	 * @public
	 */
	Group.prototype.addCustomData = function(oCustomData) {
		Control.prototype.addCustomData.apply(this, arguments);
	
		var aGroupElement = this.getGroupElements();
	
		aGroupElement.forEach(function(oGroupElement) {
			oGroupElement.addCustomData(oCustomData.clone());
		});
		return this;
	};
	
	/**
	 * Inserts a GroupElement into the aggregation <code>groupElements</code>
	 * 
	 * @param {sap.ui.comp.smartform.GroupElement}
	 *          oGroupElement group element to insert into aggregation named groupElements.
	 * @param {int}
	 *          iIndex the 0-based index the GroupElement should be inserted at.
	 * @return {sap.ui.comp.smartform.Group} <code>this</code> to allow method chaining.
	 * @public
	 */
	Group.prototype.insertGroupElement = function(oGroupElement, iIndex) {
		this._oFormContainer.insertFormElement(oGroupElement.getFormElement(), iIndex);
		return this.insertAggregation("groupElements", oGroupElement, iIndex);
	};
	
	/**
	 * Removes a GroupElement from the aggregation <code>groupElements</code>
	 * 
	 * @param {int|string|sap.ui.comp.smartform.GroupElement}
	 *          vGroupElement the GroupElement to remove or its index or id.
	 * @return {sap.ui.comp.smartform.GroupElement} the removed GroupElement or null.
	 * @public
	 */
	Group.prototype.removeGroupElement = function(vGroupElement) {
		var oGroupElement = null;
		var aGroupElement = [];
		var i = 0;
	
		if (vGroupElement instanceof sap.ui.comp.smartform.GroupElement) {
			oGroupElement = vGroupElement;
		} else {
			aGroupElement = this.getGroupElements();
			if (typeof vGroupElement === "number") {
				oGroupElement = aGroupElement[vGroupElement];
			} else if (typeof vGroupElement === "string") {
				for (i; i < aGroupElement.length; i++) {
					if (aGroupElement[i].sId === vGroupElement) {
						oGroupElement = aGroupElement[i];
						break;
					}
				}
			}
		}
	
		if (oGroupElement) {
			this._oFormContainer.removeFormElement(oGroupElement.getFormElement());
			return this.removeAggregation("groupElements", oGroupElement);
		} else {
			return null;
		}
	};
	
	/**
	 * Removes all group elements from the aggregation <code>groupElements</code>
	 * 
	 * @param {int|string|sap.ui.comp.smartform.GroupElement}
	 *          the GroupElement to remove or its index or id.
	 * @return {sap.ui.comp.smartform.GroupElement[]} an array of the removed elements.
	 * @public
	 */
	Group.prototype.removeAllGroupElements = function() {
		this._oFormContainer.removeAllFormElements();
		return this.removeAllAggregation("groupElements");
	};
	
	/**
	 * Destroys all the group elements in the aggregation <code>groupElements</code>
	 * 
	 * @return {sap.ui.comp.smartform.Group} <code>this</code> to allow method chaining.
	 * @public
	 */
	Group.prototype.destroyGroupElements = function() {
		this._oFormContainer.destroyFormElements();
		return this.destroyAggregation("groupElements");
	};
	

	return Group;

}, /* bExport= */ true);