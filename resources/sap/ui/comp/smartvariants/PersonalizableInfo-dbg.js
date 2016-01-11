/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartvariants.PersonalizableInfo.
sap.ui.define(['jquery.sap.global', 'sap/ui/comp/library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";


	
	/**
	 * Constructor for a new smartvariants/PersonalizableInfo.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Describes the control associated with the smart variant control.
	 * @extends sap.ui.core.Element
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartvariants.PersonalizableInfo
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var PersonalizableInfo = Element.extend("sap.ui.comp.smartvariants.PersonalizableInfo", /** @lends sap.ui.comp.smartvariants.PersonalizableInfo.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		properties : {
	
			/**
			 * Describes the type of variant management.
			 */
			type : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Name of the data service
			 */
			dataSource : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Defines the property name of the controller containing the stableId.
			 */
			keyName : {type : "string", group : "Misc", defaultValue : null}
		},
		associations : {
	
			/**
			 * Contains the control that can be personalized.
			 */
			control : {type : "sap.ui.core.Control", multiple : false}
		}
	}});
	
	PersonalizableInfo.prototype.addControl = function(oControl) {
		this.addAssociation("control", oControl, true);
	};

	return PersonalizableInfo;

}, /* bExport= */ true);
