/* -----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ----------------------------------------------------------------------------------- */

/**
 * Initialization Code and shared classes of library sap.collaboration (1.28.1)
 */
jQuery.sap.declare("sap.collaboration.library");
jQuery.sap.require("sap.ui.core.Core");
/**
 * SAP UI library: SAP Collaboration for Social Media Integration.
 *
 * @namespace
 * @name sap.collaboration
 * @public
 */


// library dependencies
jQuery.sap.require("sap.ui.core.library");
jQuery.sap.require("sap.suite.ui.commons.library");

// delegate further initialization of this library to the Core
sap.ui.getCore().initLibrary({
	name : "sap.collaboration",
	dependencies : ["sap.ui.core","sap.suite.ui.commons"],
	types: [
		"sap.collaboration.AppType",
		"sap.collaboration.FeedType"
	],
	interfaces: [],
	controls: [],
	elements: [],
	version: "1.28.1"
});

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.collaboration.AppType.
jQuery.sap.declare("sap.collaboration.AppType");
/**
 * @class Application Type (Mode)
 *
 * @version 1.28.1
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.collaboration.AppType = {

	/**
	 * Fiori Split App
	 * @public
	 */
	split : "split",

	/**
	 * SAP Jam Feed Widget Wrapper
	 * @public
	 */
	widget : "widget"

};
/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.collaboration.FeedType.
jQuery.sap.declare("sap.collaboration.FeedType");
/**
 * @class Feed Types
 *
 * @version 1.28.1
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.collaboration.FeedType = {

	/**
	 * Follows feed type
	 * @public
	 */
	follows : "follows",

	/**
	 * Company feed type
	 * @public
	 */
	company : "company",

	/**
	 * Group feed type
	 * @public
	 */
	group : "group",

	/**
	 * Object group feed type
	 * @public
	 */
	objectGroup : "objectGroup",

	/**
	 * Oject feed type
	 * @public
	 */
	object : "object"

};
