/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Circle.
jQuery.sap.declare("sap.ui.vbm.Circle");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.vbm.VoBase");


/**
 * Constructor for a new Circle.
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
 * <li>{@link #getPosition position} : string (default: '0;0;0')</li>
 * <li>{@link #getRadius radius} : string (default: '20')</li>
 * <li>{@link #getColor color} : string (default: 'RGBA(0,0,128,128)')</li>
 * <li>{@link #getColorBorder colorBorder} : string (default: 'RGB(0,0,0)')</li>
 * <li>{@link #getSlices slices} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.Circle#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Circle#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Circle#event:drop drop} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.ui.vbm.VoBase#constructor sap.ui.vbm.VoBase}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Aggregation element for the Circle container
 * @extends sap.ui.vbm.VoBase
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Circle
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.vbm.VoBase.extend("sap.ui.vbm.Circle", { metadata : {

	publicMethods : [
		// methods
		"openDetailWindow", "openContextMenu"
	],
	library : "sap.ui.vbm",
	properties : {
		"position" : {type : "string", group : "Misc", defaultValue : '0;0;0'},
		"radius" : {type : "string", group : "Misc", defaultValue : '20'},
		"color" : {type : "string", group : "Misc", defaultValue : 'RGBA(0,0,128,128)'},
		"colorBorder" : {type : "string", group : "Misc", defaultValue : 'RGB(0,0,0)'},
		"slices" : {type : "string", group : "Misc", defaultValue : null}
	},
	events : {
		"click" : {}, 
		"contextMenu" : {}, 
		"drop" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.Circle with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Circle.extend
 * @function
 */

sap.ui.vbm.Circle.M_EVENTS = {'click':'click','contextMenu':'contextMenu','drop':'drop'};


/**
 * Getter for property <code>position</code>.
 * The position of the circle.
 *
 * Default value is <code>0;0;0</code>
 *
 * @return {string} the value of property <code>position</code>
 * @public
 * @name sap.ui.vbm.Circle#getPosition
 * @function
 */

/**
 * Setter for property <code>position</code>.
 *
 * Default value is <code>0;0;0</code> 
 *
 * @param {string} sPosition  new value for property <code>position</code>
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Circle#setPosition
 * @function
 */


/**
 * Getter for property <code>radius</code>.
 * The pixel radius of the circle.
 *
 * Default value is <code>20</code>
 *
 * @return {string} the value of property <code>radius</code>
 * @public
 * @name sap.ui.vbm.Circle#getRadius
 * @function
 */

/**
 * Setter for property <code>radius</code>.
 *
 * Default value is <code>20</code> 
 *
 * @param {string} sRadius  new value for property <code>radius</code>
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Circle#setRadius
 * @function
 */


/**
 * Getter for property <code>color</code>.
 * The color of the circle.
 *
 * Default value is <code>RGBA(0,0,128,128)</code>
 *
 * @return {string} the value of property <code>color</code>
 * @public
 * @name sap.ui.vbm.Circle#getColor
 * @function
 */

/**
 * Setter for property <code>color</code>.
 *
 * Default value is <code>RGBA(0,0,128,128)</code> 
 *
 * @param {string} sColor  new value for property <code>color</code>
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Circle#setColor
 * @function
 */


/**
 * Getter for property <code>colorBorder</code>.
 * The border color of the circle.
 *
 * Default value is <code>RGB(0,0,0)</code>
 *
 * @return {string} the value of property <code>colorBorder</code>
 * @public
 * @name sap.ui.vbm.Circle#getColorBorder
 * @function
 */

/**
 * Setter for property <code>colorBorder</code>.
 *
 * Default value is <code>RGB(0,0,0)</code> 
 *
 * @param {string} sColorBorder  new value for property <code>colorBorder</code>
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Circle#setColorBorder
 * @function
 */


/**
 * Getter for property <code>slices</code>.
 * Number of circle slices. The property is required only when the PlugIn is used.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>slices</code>
 * @public
 * @name sap.ui.vbm.Circle#getSlices
 * @function
 */

/**
 * Setter for property <code>slices</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sSlices  new value for property <code>slices</code>
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Circle#setSlices
 * @function
 */


/**
 * The event is raised when there is a click action on a Circle.
 *
 * @name sap.ui.vbm.Circle#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.Circle</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Circle</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on a Circle.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Circle</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Circle#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.Circle</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Circle#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Circle#fireClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on a Circle.
 *
 * @name sap.ui.vbm.Circle#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.Circle</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Circle</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on a Circle.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Circle</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Circle#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.Circle</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Circle#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Circle#fireContextMenu
 * @function
 */


/**
 * The event is raised when something is dropped on a Circle.
 *
 * @name sap.ui.vbm.Circle#drop
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'drop' event of this <code>sap.ui.vbm.Circle</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Circle</code>.<br/> itself. 
 *  
 * The event is raised when something is dropped on a Circle.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Circle</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Circle#attachDrop
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'drop' event of this <code>sap.ui.vbm.Circle</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Circle#detachDrop
 * @function
 */

/**
 * Fire event drop to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Circle} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Circle#fireDrop
 * @function
 */


/**
 * open a Detail Window for the circle at its position
 *
 * @name sap.ui.vbm.Circle#openDetailWindow
 * @function
 * @param {string} sCaption
 *         caption of detail window
 * @param {string} sOffsetX
 *         position offset in x-direction from the anchor point
 * @param {string} sOffsetY
 *         position offset in y-direction from the anchor point
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * open the context menu
 *
 * @name sap.ui.vbm.Circle#openContextMenu
 * @function
 * @param {object} oMenu
 *         the context menu to be opened
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/ui/vbm/Circle.js
sap.ui.vbm.Circle.prototype.openDetailWindow = function( caption, offsetX, offsetY ){
   this.oParent.openDetailWindow( this, {caption : caption, offsetX : offsetX, offsetY : offsetY}  ); 

};

sap.ui.vbm.Circle.prototype.openContextMenu = function( menu ){
   this.oParent.openContextMenu( this, menu ); 

};
