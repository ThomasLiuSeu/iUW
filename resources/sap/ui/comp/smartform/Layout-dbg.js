/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartform.Layout.
sap.ui.define(['jquery.sap.global', 'sap/ui/comp/library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";


	
	/**
	 * Constructor for a new smartform/Layout.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Layout settings to adjust ResponsiveGridLayout.
	 * @extends sap.ui.core.Element
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartform.Layout
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Layout = Element.extend("sap.ui.comp.smartform.Layout", /** @lends sap.ui.comp.smartform.Layout.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		properties : {
	
			/**
			 * Default span for labels in large size. This span is only used if more than 1 container is in one line, if only 1 container is in the line the labelSpanM value is used.
			 * Default value is
			 */
			labelSpanL : {type : "int", group : "Misc", defaultValue : null},
	
			/**
			 * Default span for labels in medium size. This property is used for full size containers. if more than one Container is in one line, labelSpanL is used.
			 * Default value is
			 */
			labelSpanM : {type : "int", group : "Misc", defaultValue : null},
	
			/**
			 * Default span for labels in small size.
			 * Default value is
			 */
			labelSpanS : {type : "int", group : "Misc", defaultValue : null},
	
			/**
			 * test
			 */
			emptySpanL : {type : "int", group : "Misc", defaultValue : null},
	
			/**
			 * test
			 */
			emptySpanM : {type : "int", group : "Misc", defaultValue : null},
	
			/**
			 * test
			 */
			emptySpanS : {type : "int", group : "Misc", defaultValue : null},
	
			/**
			 * test
			 */
			columnsL : {type : "int", group : "Misc", defaultValue : null},
	
			/**
			 * test
			 */
			columnsM : {type : "int", group : "Misc", defaultValue : null},
	
			/**
			 * test
			 */
			breakpointL : {type : "int", group : "Misc", defaultValue : null},
	
			/**
			 * test
			 */
			breakpointM : {type : "int", group : "Misc", defaultValue : null}
		}
	}});
	

	return Layout;

}, /* bExport= */ true);
