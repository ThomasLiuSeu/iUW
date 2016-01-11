/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

/**
 * Initialization Code and shared classes of library sap.ui.comp.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Core', 'sap/ui/core/library', 'sap/ui/fl/library'],
	function(jQuery, Core, library1, library2) {
	"use strict";

	/**
	 * SAPUI5 library with comp controls.
	 *
	 * @namespace
	 * @name sap.ui.comp
	 * @public
	 */
	
	
	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.ui.comp",
		version: "1.28.1",
		dependencies : ["sap.ui.core","sap.ui.fl"],
		types: [
			"sap.ui.comp.smartfield.ControlType",
			"sap.ui.comp.smartfield.DisplayBehaviour",
			"sap.ui.comp.smartfield.JSONType",
			"sap.ui.comp.smarttable.TableType"
		],
		interfaces: [],
		controls: [
			"sap.ui.comp.filterbar.FilterBar",
			"sap.ui.comp.navpopover.NavigationPopover",
			"sap.ui.comp.navpopover.SmartLink",
			"sap.ui.comp.odata.FieldSelector",
			"sap.ui.comp.smartfield.SmartField",
			"sap.ui.comp.smartfield.SmartLabel",
			"sap.ui.comp.smartfilterbar.SmartFilterBar",
			"sap.ui.comp.smartform.Group",
			"sap.ui.comp.smartform.GroupElement",
			"sap.ui.comp.smartform.SmartForm",
			"sap.ui.comp.smartform.flexibility.DialogContent",
			"sap.ui.comp.smartform.flexibility.FieldList",
			"sap.ui.comp.smartform.flexibility.FieldListNode",
			"sap.ui.comp.smartform.flexibility.Input",
			"sap.ui.comp.smarttable.SmartTable",
			"sap.ui.comp.smartvariants.SmartVariantManagement",
			"sap.ui.comp.smartvariants.SmartVariantManagementUi2",
			"sap.ui.comp.transport.TransportDialog",
			"sap.ui.comp.valuehelpdialog.ValueHelpDialog",
			"sap.ui.comp.variants.EditableVariantItem",
			"sap.ui.comp.variants.VariantManagement"
		],
		elements: [
			"sap.ui.comp.filterbar.FilterGroupItem",
			"sap.ui.comp.filterbar.FilterItem",
			"sap.ui.comp.navpopover.LinkData",
			"sap.ui.comp.navpopover.SemanticObjectController",
			"sap.ui.comp.smartfield.Configuration",
			"sap.ui.comp.smartfilterbar.ControlConfiguration",
			"sap.ui.comp.smartfilterbar.GroupConfiguration",
			"sap.ui.comp.smartfilterbar.SelectOption",
			"sap.ui.comp.smartform.Layout",
			"sap.ui.comp.smartvariants.PersonalizableInfo",
			"sap.ui.comp.variants.VariantItem"
		]
	});
	
	/**
	 * The available control types.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.comp.smartfield.ControlType = {
	
		/**
		 * The SmartField chooses the control.
		 * @public
		 */
		auto : "auto",
	
		/**
		 * The SmartField uses a drop down list box.
		 * @public
		 */
		dropDownList : "dropDownList",
	
		/**
		 * The SmartField displays an input field.
		 * @public
		 */
		input : "input",
	
		/**
		 * The SmartField displays a date picker.
		 * @public
		 */
		datePicker : "datePicker",
		
		/**
		 * The SmartField displays a check box.
		 * @public
		 */
		checkBox : "checkBox" 
	
	};
	/**
	 * The different options to define display behavior for a SmartField.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.comp.smartfield.DisplayBehaviour = {
	
		/**
		 * The SmartField chooses the display behavior.
		 * @public
		 */
		auto : "auto",
	
		/**
		 * Only the description is displayed for available values.
		 * @public
		 */
		descriptionOnly : "descriptionOnly",
	
		/**
		 * Description and ID are displayed for available values.
		 * @public
		 */
		descriptionAndId : "descriptionAndId",
	
		/**
		 * ID and description are displayed for available values.
		 * @public
		 */
		idAndDescription : "idAndDescription",
	
		/**
		 * Shows the ID only.
		 * @public
		 */
		idOnly : "idOnly"
	
	};
	/**
	 * Enumeration of the different data types supported by the SmartField, if it is using a JSON model.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.comp.smartfield.JSONType = {
	
		/**
		 * The JavaScript primary type String
		 * @public
		 */
		String : "String",
	
		/**
		 * The JavaScript Date Object
		 * @public
		 */
		Date : "Date",
	
		/**
		 * Float type
		 * @public
		 */
		Float : "Float",
	
		/**
		 * Integer type
		 * @public
		 */
		Integer : "Integer",
	
		/**
		 * Boolean Type
		 * @public
		 */
		Boolean : "Boolean",
	
		/**
		 * Date Time Type
		 * @public
		 */
		DateTime : "DateTime"
	
	};
	/**
	 * 
	 * Provides enumeration sap.ui.comp.smarttable.TableType
	 * A subset of table types that fit to a simple API returning one string.
	 * 
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.comp.smarttable.TableType = {
	
		/**
		 * A table (sap.ui.table.Table) control shall be created as the content of the SmartTable, if no table already exists (default)
		 * @public
		 */
		Table : "Table",
	
		/**
		 * A responsive table (sap.m.Table) control that can be used on mobile devices shall be created as the content of the SmartTable, if no table already exists
		 * @public
		 */
		ResponsiveTable : "ResponsiveTable",
	
		/**
		 * An analytical table (sap.ui.table.AnalyticalTable) control shall be created as the content of the SmartTable, if no table already exists
		 * @public
		 */
		AnalyticalTable : "AnalyticalTable",
	
		/**
		 * A tree table (sap.ui.table.TreeTable) control shall be created as the content of the SmartTable, if no table already exists (TODO)
		 * @public
		 */
		TreeTable : "TreeTable"
	
	};

	return sap.ui.comp;	

}, /* bExport= */ true);
