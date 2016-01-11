/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Region.
jQuery.sap.declare("sap.ui.vbm.Region");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.core.Element");


/**
 * Constructor for a new Region.
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
 * <li>{@link #getColor color} : sap.ui.core.CSSColor</li>
 * <li>{@link #getCode code} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.Region#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Region#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
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
 * Region properties.
 * @extends sap.ui.core.Element
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Region
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Element.extend("sap.ui.vbm.Region", { metadata : {

	library : "sap.ui.vbm",
	properties : {
		"color" : {type : "sap.ui.core.CSSColor", group : "Appearance", defaultValue : null},
		"code" : {type : "string", group : "Misc", defaultValue : null}
	},
	events : {
		"click" : {}, 
		"contextMenu" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.Region with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Region.extend
 * @function
 */

sap.ui.vbm.Region.M_EVENTS = {'click':'click','contextMenu':'contextMenu'};


/**
 * Getter for property <code>color</code>.
 * The color, this must be provided in the rgba(r,g,b,a) format.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSColor} the value of property <code>color</code>
 * @public
 * @name sap.ui.vbm.Region#getColor
 * @function
 */

/**
 * Setter for property <code>color</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSColor} sColor  new value for property <code>color</code>
 * @return {sap.ui.vbm.Region} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Region#setColor
 * @function
 */


/**
 * Getter for property <code>code</code>.
 * The region code.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>code</code>
 * @public
 * @name sap.ui.vbm.Region#getCode
 * @function
 */

/**
 * Setter for property <code>code</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sCode  new value for property <code>code</code>
 * @return {sap.ui.vbm.Region} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Region#setCode
 * @function
 */


/**
 * The event is raised when there is a click action on a region.
 *
 * @name sap.ui.vbm.Region#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {string} oControlEvent.getParameters.code The region code.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.Region</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Region</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on a region.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Region</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Region} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Region#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.Region</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Region} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Region#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'code' of type <code>string</code> The region code.</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Region} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Region#fireClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on a region.
 *
 * @name sap.ui.vbm.Region#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {string} oControlEvent.getParameters.code The region code.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.Region</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Region</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on a region.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Region</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Region} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Region#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.Region</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Region} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Region#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'code' of type <code>string</code> The region code.</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Region} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Region#fireContextMenu
 * @function
 */

// Start of sap/ui/vbm/Region.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.Region.prototype.init = function(){
//   // do something for initialization...
//};
