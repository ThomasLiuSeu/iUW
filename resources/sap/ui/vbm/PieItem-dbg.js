/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.PieItem.
jQuery.sap.declare("sap.ui.vbm.PieItem");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.core.Element");


/**
 * Constructor for a new PieItem.
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
 * <li>{@link #getName name} : string (default: '')</li>
 * <li>{@link #getValue value} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.PieItem#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
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
 * Aggregation element for the Pie
 * @extends sap.ui.core.Element
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.PieItem
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Element.extend("sap.ui.vbm.PieItem", { metadata : {

	library : "sap.ui.vbm",
	properties : {
		"name" : {type : "string", group : "Misc", defaultValue : ''},
		"value" : {type : "string", group : "Misc", defaultValue : null}
	},
	events : {
		"click" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.PieItem with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.PieItem.extend
 * @function
 */

sap.ui.vbm.PieItem.M_EVENTS = {'click':'click'};


/**
 * Getter for property <code>name</code>.
 * The name of the Pie item.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>name</code>
 * @public
 * @name sap.ui.vbm.PieItem#getName
 * @function
 */

/**
 * Setter for property <code>name</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sName  new value for property <code>name</code>
 * @return {sap.ui.vbm.PieItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.PieItem#setName
 * @function
 */


/**
 * Getter for property <code>value</code>.
 * The value of the Pie item.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>value</code>
 * @public
 * @name sap.ui.vbm.PieItem#getValue
 * @function
 */

/**
 * Setter for property <code>value</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sValue  new value for property <code>value</code>
 * @return {sap.ui.vbm.PieItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.PieItem#setValue
 * @function
 */


/**
 * The event is raised when there is a click action on a pie item.
 *
 * @name sap.ui.vbm.PieItem#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.PieItem</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.PieItem</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on a pie item.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.PieItem</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.PieItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.PieItem#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.PieItem</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.PieItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.PieItem#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.PieItem} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.PieItem#fireClick
 * @function
 */

// Start of sap/ui/vbm/PieItem.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.PieItem.prototype.init = function(){
//   // do something for initialization...
//};

