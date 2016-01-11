/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Box.
jQuery.sap.declare("sap.ui.vbm.Box");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.vbm.VoBase");


/**
 * Constructor for a new Box.
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
 * <li>{@link #getScale scale} : string (default: '1;1;1')</li>
 * <li>{@link #getColor color} : string (default: 'RGB(255;0;0)')</li>
 * <li>{@link #getColorBorder colorBorder} : string (default: 'RGB(255;0;0)')</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.Box#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Box#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Box#event:drop drop} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
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
 * Aggregation element for the Box container
 * @extends sap.ui.vbm.VoBase
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Box
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.vbm.VoBase.extend("sap.ui.vbm.Box", { metadata : {

	publicMethods : [
		// methods
		"openDetailWindow", "openContextMenu"
	],
	library : "sap.ui.vbm",
	properties : {
		"position" : {type : "string", group : "Misc", defaultValue : '0;0;0'},
		"scale" : {type : "string", group : "Misc", defaultValue : '1;1;1'},
		"color" : {type : "string", group : "Misc", defaultValue : 'RGB(255;0;0)'},
		"colorBorder" : {type : "string", group : "Misc", defaultValue : 'RGB(255;0;0)'}
	},
	events : {
		"click" : {}, 
		"contextMenu" : {}, 
		"drop" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.Box with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Box.extend
 * @function
 */

sap.ui.vbm.Box.M_EVENTS = {'click':'click','contextMenu':'contextMenu','drop':'drop'};


/**
 * Getter for property <code>position</code>.
 * The position of the Box.
 *
 * Default value is <code>0;0;0</code>
 *
 * @return {string} the value of property <code>position</code>
 * @public
 * @name sap.ui.vbm.Box#getPosition
 * @function
 */

/**
 * Setter for property <code>position</code>.
 *
 * Default value is <code>0;0;0</code> 
 *
 * @param {string} sPosition  new value for property <code>position</code>
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Box#setPosition
 * @function
 */


/**
 * Getter for property <code>scale</code>.
 * The scale of the box.
 *
 * Default value is <code>1;1;1</code>
 *
 * @return {string} the value of property <code>scale</code>
 * @public
 * @name sap.ui.vbm.Box#getScale
 * @function
 */

/**
 * Setter for property <code>scale</code>.
 *
 * Default value is <code>1;1;1</code> 
 *
 * @param {string} sScale  new value for property <code>scale</code>
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Box#setScale
 * @function
 */


/**
 * Getter for property <code>color</code>.
 * The color of the box.
 *
 * Default value is <code>RGB(255;0;0)</code>
 *
 * @return {string} the value of property <code>color</code>
 * @public
 * @name sap.ui.vbm.Box#getColor
 * @function
 */

/**
 * Setter for property <code>color</code>.
 *
 * Default value is <code>RGB(255;0;0)</code> 
 *
 * @param {string} sColor  new value for property <code>color</code>
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Box#setColor
 * @function
 */


/**
 * Getter for property <code>colorBorder</code>.
 * The border color of the box.
 *
 * Default value is <code>RGB(255;0;0)</code>
 *
 * @return {string} the value of property <code>colorBorder</code>
 * @public
 * @name sap.ui.vbm.Box#getColorBorder
 * @function
 */

/**
 * Setter for property <code>colorBorder</code>.
 *
 * Default value is <code>RGB(255;0;0)</code> 
 *
 * @param {string} sColorBorder  new value for property <code>colorBorder</code>
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Box#setColorBorder
 * @function
 */


/**
 * The event is raised when there is a click action on a Box.
 *
 * @name sap.ui.vbm.Box#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.Box</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Box</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on a Box.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Box</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Box#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.Box</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Box#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Box#fireClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on a Box.
 *
 * @name sap.ui.vbm.Box#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.Box</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Box</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on a Box.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Box</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Box#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.Box</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Box#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Box#fireContextMenu
 * @function
 */


/**
 * The event is raised when something is dropped on a Box.
 *
 * @name sap.ui.vbm.Box#drop
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'drop' event of this <code>sap.ui.vbm.Box</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Box</code>.<br/> itself. 
 *  
 * The event is raised when something is dropped on a Box.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Box</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Box#attachDrop
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'drop' event of this <code>sap.ui.vbm.Box</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Box#detachDrop
 * @function
 */

/**
 * Fire event drop to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Box} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Box#fireDrop
 * @function
 */


/**
 * open a Detail Window for the box at box position
 *
 * @name sap.ui.vbm.Box#openDetailWindow
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
 * @name sap.ui.vbm.Box#openContextMenu
 * @function
 * @param {object} oMenu
 *         the context menu to be opened
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/ui/vbm/Box.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.Box.prototype.init = function(){
//   // do something for initialization...
//};


sap.ui.vbm.Box.prototype.openDetailWindow = function( caption, offsetX, offsetY ){
   this.oParent.openDetailWindow( this, {caption : caption, offsetX : offsetX, offsetY : offsetY} ); 

};

sap.ui.vbm.Box.prototype.openContextMenu = function( menu ){
   this.oParent.openContextMenu( this, menu ); 

};
