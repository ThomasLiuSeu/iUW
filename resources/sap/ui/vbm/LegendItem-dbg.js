/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.LegendItem.
jQuery.sap.declare("sap.ui.vbm.LegendItem");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.core.Element");


/**
 * Constructor for a new LegendItem.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul>
 * <li>{@link #getColor color} : string (default: '')</li>
 * <li>{@link #getImage image} : string</li>
 * <li>{@link #getText text} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.ui.core.Element#constructor sap.ui.core.Element}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Aggregation element for the Legend
 * @extends sap.ui.core.Element
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.LegendItem
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Element.extend("sap.ui.vbm.LegendItem", { metadata : {

	library : "sap.ui.vbm",
	properties : {
		"color" : {type : "string", group : "Misc", defaultValue : ''},
		"image" : {type : "string", group : "Misc", defaultValue : null},
		"text" : {type : "string", group : "Misc", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.LegendItem with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.ui.vbm.LegendItem.extend
 * @function
 */


/**
 * Getter for property <code>color</code>.
 * The color of the legend marker.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>color</code>
 * @public
 * @name sap.ui.vbm.LegendItem#getColor
 * @function
 */

/**
 * Setter for property <code>color</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sColor  new value for property <code>color</code>
 * @return {sap.ui.vbm.LegendItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.LegendItem#setColor
 * @function
 */


/**
 * Getter for property <code>image</code>.
 * The image for the legend marker.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>image</code>
 * @public
 * @name sap.ui.vbm.LegendItem#getImage
 * @function
 */

/**
 * Setter for property <code>image</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sImage  new value for property <code>image</code>
 * @return {sap.ui.vbm.LegendItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.LegendItem#setImage
 * @function
 */


/**
 * Getter for property <code>text</code>.
 * The text of the legend item.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>text</code>
 * @public
 * @name sap.ui.vbm.LegendItem#getText
 * @function
 */

/**
 * Setter for property <code>text</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sText  new value for property <code>text</code>
 * @return {sap.ui.vbm.LegendItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.LegendItem#setText
 * @function
 */

// Start of sap/ui/vbm/LegendItem.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.LegendItem.prototype.init = function(){
//   // do something for initialization...
//};


