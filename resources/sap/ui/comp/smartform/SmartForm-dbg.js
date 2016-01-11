/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartform.SmartForm.
sap.ui.define([
	'jquery.sap.global', 'sap/ui/comp/library', 'sap/ui/core/Control', 'sap/ui/fl/registry/ChangeRegistry', 'sap/ui/fl/registry/SimpleChanges', 'sap/ui/layout/form/Form', 'sap/ui/fl/Utils', 'sap/ui/fl/registry/Settings', 'sap/m/Label', 'sap/m/Button', 'sap/m/ButtonType', 'sap/m/Panel', 'sap/m/Toolbar', 'sap/m/ToolbarSpacer', 'sap/m/ToolbarSeparator'
], function(jQuery, library, Control, ChangeRegistry, SimpleChanges, Form, Utils, Settings, Label, Button, ButtonType, Panel, Toolbar, ToolbarSpacer, ToolbarSeparator) {
	"use strict";

	/**
	 * Constructor for a new smartform/SmartForm.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The SmartForm renders a form (sap.ui.layout.form.Form) and makes use of OData metadata annotations. If the controls to be displayed
	 *        inside the form are bound to an OData model the label is taken from the metadata annotation (sap:label) if not specified in the XML
	 *        view.
	 * @extends sap.ui.core.Control
	 * @author Alexander Fürbach
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartform.SmartForm
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SmartForm = Control.extend("sap.ui.comp.smartform.SmartForm", /**
																		 * @lends sap.ui.comp.smartform.SmartForm.prototype
																		 */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * Title of the form.
				 */
				title: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Specifies whether the groups shall be rendered in a ResponsiveLayout with label on top of the group element. Each group will be
				 * rendered in a new line.
				 */
				useHorizontalLayout: {
					type: "boolean",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Specifies whether a check button shall be added to the toolbar.
				 */
				checkButton: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * EntiyType used for the SmartForm.
				 */
				entityType: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Specifies whether the control is expandable. Per default the control is not rendered as expanded.
				 */
				expandable: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * If expandable, this property indicates whether the state is expanded or not. If expanded, then infoToolbar (if available) and
				 * content is rendered; if expanded is false, then only the headerText/headerToolbar is rendered.
				 */
				expanded: {
					type: "boolean",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Specified whether the property editable shall be togglable via button.
				 */
				editTogglable: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Specifies whether the form is editable.
				 */
				editable: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * CSV of fields that must be ignored in the OData metadata, by the SmartForm Note that No validation will be done here, please ensure
				 * you do not add spaces or special characters here!
				 */
				ignoredFields: {
					type: "string",
					group: "Misc",
					defaultValue: null
				}
			},
			defaultAggregation: "groups",
			aggregations: {

				/**
				 * Groups are used to group form elements.
				 */
				groups: {
					type: "sap.ui.comp.smartform.Group",
					multiple: true,
					singularName: "group"
				},

				/**
				 * Content to be rendered.
				 */
				content: {
					type: "sap.ui.core.Control",
					multiple: false,
					visibility: "hidden"
				},

				/**
				 * Layout settings to adjust ResponsiveGridLayout
				 */
				layout: {
					type: "sap.ui.comp.smartform.Layout",
					multiple: false
				},

				/**
				 * The Semantic Object Controller allows to specify and overwrite several semantic object navigation functionalities.
				 */
				semanticObjectController: {
					type: "sap.ui.comp.navpopover.SemanticObjectController",
					multiple: false
				},

				/**
				 * An additional toolbar that can be added by the users, which can contain further custom buttons, controls, etc.
				 */
				customToolbar: {
					type: "sap.m.Toolbar",
					multiple: false
				},

				/**
				 * Toolbar
				 */
				toolbar: {
					type: "sap.m.Toolbar",
					multiple: false,
					visibility: "hidden"
				}
			},
			events: {

				/**
				 * Event is fired when the editable property is toggled.
				 */
				editToggled: {},

				/**
				 * Event is fired after check was performed.
				 */
				checked: {}
			}
		}
	});

	/*global Promise */

	/**
	 * Initialize the control.
	 * 
	 * @private
	 */
	SmartForm.prototype.init = function() {
		if (!SmartForm._bHasRegisteredToFlexibilityServices) {
			var oChangeRegistry = ChangeRegistry.getInstance();
			// remove group
			oChangeRegistry.registerControlForSimpleChange(this.getMetadata().getElementName(),

			SimpleChanges.removeGroup);
			// add group
			oChangeRegistry.registerControlForSimpleChange(this.getMetadata().getElementName(),

			SimpleChanges.addGroup);
			// move groups
			oChangeRegistry.registerControlForSimpleChange(this.getMetadata().getElementName(),

			SimpleChanges.moveGroups);
			// change form title
			oChangeRegistry.registerControlForSimpleChange(this.getMetadata().getElementName(),

			SimpleChanges.renameField);
			SmartForm._bHasRegisteredToFlexibilityServices = true;
		}

		this._sEditToggleId = "";
		this._oForm = null;
		this._oPanel = null;
		this._oTitle = new Label(this.getId() + "-title-sfmain").addStyleClass("title");
		this._bUpdateToolbar = true;
		this._sResizeListenerId = "";
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");

	};

	SmartForm._bHasRegisteredToFlexibilityServices = false;

	SmartForm.prototype.onBeforeRendering = function() {
		var oGroup = null;
		var oForm = null;
		var aCustomData = [];
		var aGroup = [];
		var oToolbar = null;
		var i = 0;
		var that = this;

		// toolbar
		if (this._bUpdateToolbar) {
			if (this._oCustomToolbar) {
				this._cleanToolbar();
				this._addHeaderToToolbar();
				this._addSeparatorToToolbar();
				this._addEditTogglableToToolbar();
				this._addCheckToToolbar();
				this._addChangeModeToToolbar();
				this._removeSeparatorFromToolbar();
			} else {
				this._createToolbar();
				this._oToolbar.addStyleClass("titleBar");
				this._addHeaderToToolbar();
				this._addEditTogglableToToolbar();
				this._addCheckToToolbar();
				this._addChangeModeToToolbar();
				if (this._oToolbar.getContent().length === 1 && !this.getExpandable()) {
					this._oToolbar.destroyContent();
					this._oToolbar.destroy();
					this._oToolbar = null;
					this.setAggregation("toolbar", null);
				}
			}
			this._bUpdateToolbar = false;
		}

		var oLayout = null;

		if (!this._oForm) {
			// grid or form
			if (this.mProperties["useHorizontalLayout"]) {
				oLayout = new sap.ui.layout.form.ResponsiveLayout();
			} else {
				oLayout = this._getLayout();
			}
			oForm = new Form({
				"editable": this.getEditable(),
				"layout": [
					oLayout
				]
			});

			this._oForm = oForm;
		}

		// add groups
		aGroup = this.getAggregation("groups");
		if (aGroup) {
			for (i; i < aGroup.length; i++) {
				oGroup = aGroup[i];
				this._oForm.insertFormContainer(oGroup.getFormContainer(), i);
			}
		}

		aCustomData = this.getCustomData();
		if (aCustomData.length > 0) {
			aGroup.forEach(function(oGroup) {
				aCustomData.forEach(function(oCustomData) {
					oGroup.addCustomData(oCustomData.clone());
				});
			});
		}

		aGroup.forEach(function(oGroup) {
			oGroup.setEditMode(that.mProperties["editable"]);
		});

		oToolbar = this._oCustomToolbar || this._oToolbar;

		if (this.mProperties["expandable"]) {
			this._oPanel = new Panel({
				"expanded": this.mProperties["expanded"],
				"expandable": true,
				"headerText": this.getTitle(),
				"headerToolbar": oToolbar
			});
			this._oPanel.attachExpand(function(oEvent) {
				that.setProperty("expanded", oEvent.getParameters()["expand"], false);
			});

			this._oPanel.addContent(this._oForm);
			this.setAggregation("content", this._oPanel);
		} else {
			if (oToolbar) {
				oToolbar.addStyleClass("titleBar");
			}
			this.setAggregation("content", this._oForm);
		}
	};

	SmartForm.prototype.onAfterRendering = function() {

		var i = 0, iIndexWidth, iIndexPercentage;
		var sCssText = "", sValue = "";
		var that = this;

		if (this._sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
		}
		this._sResizeListenerId = sap.ui.core.ResizeHandler.register(this._oForm.getDomRef(), function(oEvent) {
			that.onAfterRendering();
		});

		var aElement = window.document.getElementsByClassName("sapUiRFLContainer");

		for (i = 0; i < aElement.length; i++) {
			if (aElement[i].id.indexOf("element") != -1 && aElement[i].id.indexOf("cont") != -1) {
				iIndexWidth = aElement[i].style.cssText.indexOf("width");
				iIndexPercentage = aElement[i].style.cssText.indexOf("%", iIndexWidth);
				if ((iIndexPercentage - iIndexWidth) > 10) {
					iIndexWidth = aElement[i].style.cssText.indexOf("width", iIndexWidth + 1);
					iIndexPercentage = aElement[i].style.cssText.indexOf("%", iIndexWidth);
				}
				if ((iIndexPercentage - iIndexWidth) <= 10) {
					sValue = aElement[i].style.cssText.substring(iIndexWidth + 6, iIndexPercentage);
					if (parseInt(sValue, 10) > 25) {

						sCssText = aElement[i].style.cssText.substring(0, iIndexWidth - 1);
						sCssText = sCssText + aElement[i].style.cssText.substring(iIndexPercentage

						+ 2);
						aElement[i].style.cssText = sCssText;
					}
				}
			}
		}

	};

	/**
	 * Creates a ResponsiveGridLayout and applies settings from aggregation <code>layout together with default settings
	 * 
	 * @return {sap.ui.layout.form.ResponsiveGridLayout} the layout to be used for the form.
	 * @private
	 */
	SmartForm.prototype._getLayout = function() {

		var oLayout = this.getAggregation("layout");
		var oFormLayout = null;
		var aGroups = this.getGroups();

		if (oLayout) {
			oFormLayout = new sap.ui.layout.form.ResponsiveGridLayout({
				"labelSpanL": oLayout.mProperties["labelSpanL"] ? oLayout.mProperties["labelSpanL"] : 4,
				"labelSpanM": oLayout.mProperties["labelSpanM"] ? oLayout.mProperties["labelSpanM"] : 4,
				"emptySpanL": oLayout.mProperties["emptySpanL"] ? oLayout.mProperties["emptySpanL"] : 0,
				"emptySpanM": oLayout.mProperties["emptySpanM"] ? oLayout.mProperties["emptySpanM"] : 0,
				"columnsL": oLayout.mProperties["columnsL"] ? oLayout.mProperties["columnsL"] : 3,
				"columnsM": oLayout.mProperties["columnsM"] ? oLayout.mProperties["columnsM"] : 2,
				"breakpointL": oLayout.mProperties["breakpointL"] ? oLayout.mProperties["breakpointL"] :

				1024,
				"breakpointM": oLayout.mProperties["breakpointL"] ? oLayout.mProperties["breakpointL"] :

				600
			});

		} else {
			oFormLayout = new sap.ui.layout.form.ResponsiveGridLayout({
				"labelSpanL": 4,
				"labelSpanM": 4,
				"emptySpanL": 0,
				"emptySpanM": 0,
				"columnsL": 3,
				"columnsM": 2,
				"breakpointL": 1024,
				"breakpointM": 600
			});
		}

		if (aGroups && aGroups.length < oFormLayout.getColumnsL()) {
			oFormLayout.setColumnsL(aGroups.length);
		}

		return oFormLayout;
	};

	SmartForm.prototype._createToolbar = function() {
		if (this._oToolbar) {
			var oContent = this._oToolbar.removeContent(this.getId() + "-button-sfmain-editToggle");
			if (oContent) {
				oContent.destroy();
			}
			oContent = this._oToolbar.removeContent(this.getId() + "-button-sfmain-check");
			if (oContent) {
				oContent.destroy();
			}
			oContent = this._oToolbar.removeContent(this.getId() + "-AdaptationButton");
			if (oContent) {
				oContent.destroy();
			}
			this._oToolbar.removeContent(this.getId() + "-title-sfmain");
		}
		this._oToolbar = new Toolbar({
			"height": "3rem"
		});
		this.setAggregation("toolbar", this._oToolbar);
	};

	/**
	 * Removes content from customToolbar
	 * 
	 * @private
	 */
	SmartForm.prototype._cleanToolbar = function() {
		var oContent = this._oCustomToolbar.removeContent(this.getId() + "-button-sfmain-editToggle");
		if (oContent) {
			oContent.destroy();
		}
		oContent = this._oCustomToolbar.removeContent(this.getId() + "-button-sfmain-check");
		if (oContent) {
			oContent.destroy();
		}
		oContent = this._oCustomToolbar.removeContent(this.getId() + "-AdaptationButton");
		if (oContent) {
			oContent.destroy();
		}
		this._oCustomToolbar.removeContent(this.getId() + "-title-sfmain");
	};

	/**
	 * Adds a title and a toolbar separator to the toolbar.
	 * 
	 * @private
	 */
	SmartForm.prototype._addHeaderToToolbar = function() {
		var oToolbar = this._oCustomToolbar || this._oToolbar;
		var aContent = [];
		var i = 0;
		var oToolbarSpacer = null;

		if (this.getProperty("title") || this.mBindingInfos['title']) {
			oToolbar.insertContent(this._oTitle, 0);
		}

		if (this._oToolbar) {
			oToolbar.insertContent(new ToolbarSpacer(), 1);
		} else {
			aContent = oToolbar.getContent();
			for (i; i < aContent.length; i++) {
				if (aContent[i].getMetadata().getName() === "sap.m.ToolbarSpacer") {
					oToolbarSpacer = aContent[i];
				}
			}
			if (!oToolbarSpacer) {
				oToolbar.addContent(new ToolbarSpacer());
			}
		}
	};

	/**
	 * Adds the button to change between edit and read only mode if property <code>editTogglable</code> equals true
	 * 
	 * @private
	 */
	SmartForm.prototype._addEditTogglableToToolbar = function() {

		var oToolbar = this._oCustomToolbar || this._oToolbar;
		var that = this;
		var oButton = null;
		var sIconSrc = this.getProperty("editable") ? "sap-icon://display" : "sap-icon://edit";

		if (this.getEditTogglable()) {
			oButton = new Button(this.getId() + "-button-sfmain-editToggle", {
				type: ButtonType.Default,
				icon: sIconSrc,
				press: function() {
					SmartForm.prototype._toggleEditMode(that);
				}
			});
			this._sEditToggleId = oButton.getId();
			oToolbar.addContent(oButton);
		}
	};

	/**
	 * Change to edit/read only depending on the current state.
	 * 
	 * @param {sap.ui.comp.smartform.SmartForm} oSmartForm the smart form
	 * @private
	 */
	SmartForm.prototype._toggleEditMode = function(oSmartForm) {

		var oToolbar = oSmartForm._oCustomToolbar || oSmartForm._oToolbar;

		oSmartForm.setEditable(!oSmartForm.mProperties["editable"]);

		oSmartForm.fireEditToggled({
			editable: oSmartForm.mProperties["editable"]
		});

		var sIconSrc = oSmartForm.getProperty("editable") ? "sap-icon://display" : "sap-icon://edit";
		oToolbar.getContent().forEach(function(oItem) {
			if (oItem.sId === oSmartForm._sEditToggleId) {
				oItem.setIcon(sIconSrc);
			}
		});

		var aGroup = oSmartForm.getGroups();
		aGroup.forEach(function(oGroup) {
			oGroup.setEditMode(oSmartForm.mProperties["editable"]);
		});

	};

	/**
	 * Adds the button for personalization to the toolbar, if change mode supported.
	 * 
	 * @returns {Promise} the promise for flexibility settings
	 * @private
	 */
	SmartForm.prototype._addChangeModeToToolbar = function() {
		var that = this;
		var sComponentName = Utils.getComponentClassName(this);
		var addToolbarPromise = Settings.getInstance(sComponentName).then(function(oSettings) {
			var oToolbar = that._oCustomToolbar || that._oToolbar;
			if (oSettings.isFlexChangeMode() && oSettings.isKeyUser() && Utils.checkControlId(that)) {
				if (!oToolbar) {
					that._createToolbar();
					that._oToolbar.addStyleClass("titleBar");
					that._addHeaderToToolbar();
					oToolbar = that._oToolbar;
					that.invalidate();
				}
				oToolbar.addContent(new sap.m.Button(that.getId() + "-AdaptationButton", {
					type: sap.m.ButtonType.Default,
					icon: "sap-icon://action-settings",
					press: function() {
						jQuery.sap.require('sap.ui.comp.smartform.flexibility.FormP13nHandler');
						var handler = new sap.ui.comp.smartform.flexibility.FormP13nHandler();
						handler.init(that);
						handler.show();
					}
				}));
			}
		}, function(oError) {
		});
		return addToolbarPromise || Promise.resolve();
	};

	/**
	 * Adds the button for checking.
	 * 
	 * @private
	 */
	SmartForm.prototype._addCheckToToolbar = function() {
		if (!this.getEditable()) {
			return;
		}

		var oToolbar = this._oCustomToolbar || this._oToolbar;
		var that = this;

		if (this.getCheckButton()) {
			oToolbar.addContent(new sap.m.Button(this.getId() + "-button-sfmain-check", {
				type: sap.m.ButtonType.Default,
				text: this._oRb.getText("SMART_FORM_CHECK"),
				press: function() {
					var aErroneousFields = [];
					aErroneousFields = that.check();
					that.fireChecked({
						erroneousFields: aErroneousFields
					});
				}
			}));
		}

	};

	/**
	 * Checks the object.
	 * 
	 * @returns {string[]} an array of fields with errors
	 * @public
	 */
	SmartForm.prototype.check = function() {
		var aErroneousFields = this._checkClientError();
		return aErroneousFields;
	};

	/**
	 * Check smart fields for client errors.
	 * 
	 * @returns {string[]} an array of fields with errors
	 * @private
	 */
	SmartForm.prototype._checkClientError = function() {
		var aFields = this.getSmartFields();
		var aErroneousFields = [];
		aFields.forEach(function(oField) {
			if (oField.checkClientError()) {
				aErroneousFields.push(oField.getId());
			}
		});
		return aErroneousFields;
	};

	/**
	 * Adds a separator to the toolbar.
	 * 
	 * @private
	 */
	SmartForm.prototype._addSeparatorToToolbar = function() {
		var oToolbar = this._oCustomToolbar || this._oToolbar;
		oToolbar.addContent(new ToolbarSeparator());
	};

	/**
	 * Removes useless separators.
	 * 
	 * @private
	 */
	SmartForm.prototype._removeSeparatorFromToolbar = function() {
		var oToolbar = this._oCustomToolbar || this._oToolbar;
		var oContent = oToolbar.getContent();
		var oLastElement = null;
		var aRemoveElement = [];
		var i = 0;

		// remove last separator
		oLastElement = oContent[oContent.length - 1];
		if (oLastElement.getMetadata().getName() === "sap.m.ToolbarSeparator") {
			oToolbar.removeContent(oLastElement);
		}

		// remove superfluous separator
		oLastElement = null;
		for (i; i < oContent.length; i++) {
			if (oContent[i].getMetadata().getName() === "sap.m.ToolbarSeparator" && oLastElement.getMetadata().getName() != "sap.m.Button") {
				aRemoveElement.push(oContent[i]);
			}
			oLastElement = oContent[i];
		}
		for (i = 0; i < aRemoveElement.length; i++) {
			oToolbar.removeContent(aRemoveElement[i]);
		}
	};

	/**
	 * Setter for property <code>editable</code>.
	 * 
	 * @param {boolean} bEditable new value for property <code>editable</code>.
	 * @return {sap.ui.comp.smartform.SmartForm} <code>this</code> to allow method chaining.
	 * @public
	 */
	SmartForm.prototype.setEditable = function(bEditable) {
		Control.prototype.setProperty.apply(this, [
			"editable", bEditable
		]);
		if (this._oForm) {
			this._oForm.setEditable(bEditable);
		}
		this._bUpdateToolbar = true;
		return this;
	};

	/**
	 * Setter for property <code>editTogglable</code>. Default value is <code>undefined</code>.
	 * 
	 * @param {boolean} bTogglable new value for property <code>editTogglable</code>.
	 * @return {sap.ui.comp.smartform.SmartForm} <code>this</code> to allow method chaining.
	 * @public
	 */
	SmartForm.prototype.setEditTogglable = function(bTogglable) {
		Control.prototype.setProperty.apply(this, [
			"editTogglable", bTogglable
		]);
		this._bUpdateToolbar = true;
		return this;
	};

	/**
	 * Setter for property <code>title</code>. Default value is <code>undefined</code>.
	 * 
	 * @param {string} sTitle new value for property <code>title</code>.
	 * @return {sap.ui.comp.smartform.SmartForm} <code>this</code> to allow method chaining.
	 * @public
	 */
	SmartForm.prototype.setTitle = function(sTitle) {
		Control.prototype.setProperty.apply(this, [
			"title", sTitle
		]);
		this._oTitle.setText(sTitle);
		return this;
	};

	/**
	 * Returns the array of properties currently visible on the UI.
	 * 
	 * @return {string[]} the properties currently visible
	 * @public
	 */
	SmartForm.prototype.getVisibleProperties = function() {

		var aProperty = [];

		var aGroup = this.getGroups();
		aGroup.forEach(function(oGroup) {
			var aGroupElement = oGroup.getGroupElements();
			aGroupElement.forEach(function(oGroupElement) {
				var aField = oGroupElement.getFormElement().getFields();
				aField.forEach(function(oField) {
					if (oField.getVisible()) {
						var sPath = oField.getBindingPath("value");
						if (sPath) {
							aProperty.push(sPath);
						}
					}
				});
			});
		});

		return aProperty;

	};

	/**
	 * Setter for aggregation <code>customToolbar</code>. Default value is <code>undefined</code>.
	 * 
	 * @param {sap.m.Toolbar} oCustomToolbar new value for aggregation <code>customToolbar</code>.
	 * @return {sap.ui.comp.smartform.SmartForm} <code>this</code> to allow method chaining.
	 * @public
	 */
	SmartForm.prototype.setCustomToolbar = function(oCustomToolbar) {
		this._oCustomToolbar = oCustomToolbar;
		this._bUpdateToolbar = true;
		return this;
	};

	/**
	 * Getter for aggregation <code>customToolbar</code>.
	 * 
	 * @return {sap.m.Toolbar} the custom toolbar
	 * @public
	 */
	SmartForm.prototype.getCustomToolbar = function() {
		return this._oCustomToolbar;
	};

	/**
	 * Inserts a <code>group</code> into the aggregation named groups.
	 * 
	 * @param {sap.ui.comp.smartform.Group} oGroup the group to insert
	 * @param {int} iIndex the 0-based index the group should be inserted at
	 * @return {sap.ui.comp.smartform.SmartForm} <code>this</code> to allow method chaining.
	 * @public
	 */
	SmartForm.prototype.insertGroup = function(oGroup, iIndex) {

		// reordering groups only works if form container is recreated
		var aFormElement = [];
		var oFormContainer = oGroup.getFormContainer();

		if (oFormContainer) {
			aFormElement = oFormContainer.getFormElements();
		}

		var oData = {
			"expanded": oFormContainer ? oFormContainer.getExpanded() : true,
			"expandable": oGroup.getExpandable(),
			"visible": oGroup.getVisible(),
			"formElements": aFormElement,
			"title": oGroup.getLabel()
		};

		oGroup.setFormContainer(new sap.ui.layout.form.FormContainer(oData));
		this.insertAggregation("groups", oGroup, iIndex);
		return this;
	};

	/**
	 * Removes all the groups in the aggregation named groups.
	 * 
	 * @return {sap.ui.comp.smartform.Group[]} an array of the removed groups (might be empty).
	 * @public
	 */
	SmartForm.prototype.removeAllGroups = function() {
		if (this._oForm) {
			this._oForm.removeAllFormContainers();
		}
		return this.removeAllAggregation("groups");
	};

	/**
	 * Get all the smart fields of the form.
	 * 
	 * @return {sap.ui.comp.smartfield.SmartField[]} an array of smart fields (might be empty).
	 * @public
	 */
	SmartForm.prototype.getSmartFields = function() {
		var aSmartField = [];

		var aGroup = this.getGroups();
		aGroup.forEach(function(oGroup) {
			var aGroupElement = oGroup.getGroupElements();
			aGroupElement.forEach(function(oGroupElement) {
				var aField = oGroupElement.getFormElement().getFields();
				aField.forEach(function(oField) {
					if (oField.getMetadata().getName() === "sap.ui.comp.smartfield.SmartField") {
						aSmartField.push(oField);
					}
				});
			});
		});

		return aSmartField;
	};
	
	/**
	 * Cleans up the resources associated with this element and all its children.
	 * 
	 * @public
	 */
	SmartForm.prototype.exit = function() {
		if (this._oForm) {
			this._oForm.destroy();
		}
		if (this._oPanel) {
			this._oPanel.destroy();
		}
		if (this._oTitle) {
			this._oTitle.destroy();
		}
		this._sEditToggleId = "";
		this._oForm = null;
		this._oPanel = null;
		this._oTitle = null;
		this._bUpdateToolbar = true;
		this._sResizeListenerId = "";
		this._oRb = null;
	};

	return SmartForm;

}, /* bExport= */true);
