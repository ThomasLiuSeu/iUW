/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Area.
jQuery.sap.declare("sap.ui.vbm.Area");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.vbm.VoBase");


/**
 * Constructor for a new Area.
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
 * <li>{@link #getPosition position} : string</li>
 * <li>{@link #getColor color} : string</li>
 * <li>{@link #getColorBorder colorBorder} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.Area#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Area#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Area#event:edgeClick edgeClick} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Area#event:edgeContextMenu edgeContextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Area#event:drop drop} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
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
 * Aggregation element for the Area container
 * @extends sap.ui.vbm.VoBase
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Area
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.vbm.VoBase.extend("sap.ui.vbm.Area", { metadata : {

	publicMethods : [
		// methods
		"openDetailWindow", "openContextMenu"
	],
	library : "sap.ui.vbm",
	properties : {
		"position" : {type : "string", group : "Misc", defaultValue : null},
		"color" : {type : "string", group : "Misc", defaultValue : null},
		"colorBorder" : {type : "string", group : "Misc", defaultValue : null}
	},
	events : {
		"click" : {}, 
		"contextMenu" : {}, 
		"edgeClick" : {}, 
		"edgeContextMenu" : {}, 
		"drop" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.Area with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Area.extend
 * @function
 */

sap.ui.vbm.Area.M_EVENTS = {'click':'click','contextMenu':'contextMenu','edgeClick':'edgeClick','edgeContextMenu':'edgeContextMenu','drop':'drop'};


/**
 * Getter for property <code>position</code>.
 * The position array for the Area.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>position</code>
 * @public
 * @name sap.ui.vbm.Area#getPosition
 * @function
 */

/**
 * Setter for property <code>position</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sPosition  new value for property <code>position</code>
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#setPosition
 * @function
 */


/**
 * Getter for property <code>color</code>.
 * The fill color of the Area.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>color</code>
 * @public
 * @name sap.ui.vbm.Area#getColor
 * @function
 */

/**
 * Setter for property <code>color</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sColor  new value for property <code>color</code>
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#setColor
 * @function
 */


/**
 * Getter for property <code>colorBorder</code>.
 * The border color of the Area.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>colorBorder</code>
 * @public
 * @name sap.ui.vbm.Area#getColorBorder
 * @function
 */

/**
 * Setter for property <code>colorBorder</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sColorBorder  new value for property <code>colorBorder</code>
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#setColorBorder
 * @function
 */


/**
 * The event is raised when there is a click action on an Area.
 *
 * @name sap.ui.vbm.Area#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.Area</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Area</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on an Area.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Area</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.Area</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Area#fireClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on an Area.
 *
 * @name sap.ui.vbm.Area#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.Area</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Area</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on an Area.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Area</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.Area</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Area#fireContextMenu
 * @function
 */


/**
 * This event is raised when the edge of an Area is clicked.
 *
 * @name sap.ui.vbm.Area#edgeClick
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'edgeClick' event of this <code>sap.ui.vbm.Area</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Area</code>.<br/> itself. 
 *  
 * This event is raised when the edge of an Area is clicked.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Area</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#attachEdgeClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'edgeClick' event of this <code>sap.ui.vbm.Area</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#detachEdgeClick
 * @function
 */

/**
 * Fire event edgeClick to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Area#fireEdgeClick
 * @function
 */


/**
 * This event is raised when the edge of an Area is right clicked.
 *
 * @name sap.ui.vbm.Area#edgeContextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'edgeContextMenu' event of this <code>sap.ui.vbm.Area</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Area</code>.<br/> itself. 
 *  
 * This event is raised when the edge of an Area is right clicked.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Area</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#attachEdgeContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'edgeContextMenu' event of this <code>sap.ui.vbm.Area</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#detachEdgeContextMenu
 * @function
 */

/**
 * Fire event edgeContextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Area#fireEdgeContextMenu
 * @function
 */


/**
 * The event is raised when something is dropped on an Area.
 *
 * @name sap.ui.vbm.Area#drop
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'drop' event of this <code>sap.ui.vbm.Area</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Area</code>.<br/> itself. 
 *  
 * The event is raised when something is dropped on an Area.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Area</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#attachDrop
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'drop' event of this <code>sap.ui.vbm.Area</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Area#detachDrop
 * @function
 */

/**
 * Fire event drop to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Area} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Area#fireDrop
 * @function
 */


/**
 * open a Detail Window for the area at click position
 *
 * @name sap.ui.vbm.Area#openDetailWindow
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
 * @name sap.ui.vbm.Area#openContextMenu
 * @function
 * @param {object} oMenu
 *         the context menu to be opened
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/ui/vbm/Area.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.Area.prototype.init = function(){
//   // do something for initialization...
//};

sap.ui.vbm.Area.prototype.openDetailWindow = function( caption, offsetX, offsetY ){
   this.oParent.openDetailWindow( this, {caption : caption, offsetX : offsetX, offsetY : offsetY} ); 

};

sap.ui.vbm.Area.prototype.openContextMenu = function( menu ){
   this.oParent.openContextMenu( this, menu ); 

};
