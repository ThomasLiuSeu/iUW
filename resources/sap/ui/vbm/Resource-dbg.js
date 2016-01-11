/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Resource.
jQuery.sap.declare("sap.ui.vbm.Resource");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.core.Element");


/**
 * Constructor for a new Resource.
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
 * <li>{@link #getValue value} : string</li>
 * <li>{@link #getSrc src} : string (default: "")</li>
 * <li>{@link #getName name} : string</li></ul>
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
 * A resource is usually a bas64 representation of an image that can be referenced in a spot. When images are specified as a string resource it is guaranteed that the control can access the bits in the image. A resource is referenced by its name.
 * @extends sap.ui.core.Element
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Resource
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Element.extend("sap.ui.vbm.Resource", { metadata : {

	library : "sap.ui.vbm",
	properties : {
		"value" : {type : "string", group : "Misc", defaultValue : null},
		"src" : {type : "string", group : "Misc", defaultValue : ""},
		"name" : {type : "string", group : "Misc", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.Resource with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Resource.extend
 * @function
 */


/**
 * Getter for property <code>value</code>.
 * Value of the resource.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>value</code>
 * @public
 * @name sap.ui.vbm.Resource#getValue
 * @function
 */

/**
 * Setter for property <code>value</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sValue  new value for property <code>value</code>
 * @return {sap.ui.vbm.Resource} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Resource#setValue
 * @function
 */


/**
 * Getter for property <code>src</code>.
 * URL to an image. It is important that the image data is readable fom the visual business control. Therefore e.g. images coming from a local drive or cross domains are not allowed. The preferred way is to use the base 64 encoded data provided using the value property.
 *
 * Default value is <code>""</code>
 *
 * @return {string} the value of property <code>src</code>
 * @public
 * @name sap.ui.vbm.Resource#getSrc
 * @function
 */

/**
 * Setter for property <code>src</code>.
 *
 * Default value is <code>""</code> 
 *
 * @param {string} sSrc  new value for property <code>src</code>
 * @return {sap.ui.vbm.Resource} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Resource#setSrc
 * @function
 */


/**
 * Getter for property <code>name</code>.
 * Name of the resource. The name should be always
 * used when a resource is referenced.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>name</code>
 * @public
 * @name sap.ui.vbm.Resource#getName
 * @function
 */

/**
 * Setter for property <code>name</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sName  new value for property <code>name</code>
 * @return {sap.ui.vbm.Resource} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Resource#setName
 * @function
 */

// Start of sap/ui/vbm/Resource.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.Resource.prototype.init = function(){
//   // do something for initialization...
//};
