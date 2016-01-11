/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Route.
jQuery.sap.declare("sap.ui.vbm.Route");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.vbm.VoBase");


/**
 * Constructor for a new Route.
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
 * <li>{@link #getColor color} : string (default: 'RGB(0;0;0)')</li>
 * <li>{@link #getStart start} : string (default: '0')</li>
 * <li>{@link #getEnd end} : string (default: '0')</li>
 * <li>{@link #getLinewidth linewidth} : string (default: '5')</li>
 * <li>{@link #getDotcolor dotcolor} : string (default: 'RGB(0;0;0)')</li>
 * <li>{@link #getDotbordercolor dotbordercolor} : string (default: 'RGB(0;0;0)')</li>
 * <li>{@link #getDotwidth dotwidth} : string (default: '0')</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getDragSource dragSource} : sap.ui.vbm.DragSource[]</li>
 * <li>{@link #getDropTarget dropTarget} : sap.ui.vbm.DropTarget[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.Route#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Route#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Route#event:drop drop} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
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
 * Aggregation element for the Route container
 * @extends sap.ui.vbm.VoBase
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Route
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.vbm.VoBase.extend("sap.ui.vbm.Route", { metadata : {

	publicMethods : [
		// methods
		"openDetailWindow", "openContextMenu"
	],
	library : "sap.ui.vbm",
	properties : {
		"position" : {type : "string", group : "Misc", defaultValue : null},
		"color" : {type : "string", group : "Misc", defaultValue : 'RGB(0;0;0)'},
		"start" : {type : "string", group : "Misc", defaultValue : '0'},
		"end" : {type : "string", group : "Misc", defaultValue : '0'},
		"linewidth" : {type : "string", group : "Misc", defaultValue : '5'},
		"dotcolor" : {type : "string", group : "Misc", defaultValue : 'RGB(0;0;0)'},
		"dotbordercolor" : {type : "string", group : "Misc", defaultValue : 'RGB(0;0;0)'},
		"dotwidth" : {type : "string", group : "Misc", defaultValue : '0'}
	},
	aggregations : {
		"dragSource" : {type : "sap.ui.vbm.DragSource", multiple : true, singularName : "dragSource"}, 
		"dropTarget" : {type : "sap.ui.vbm.DropTarget", multiple : true, singularName : "dropTarget"}
	},
	events : {
		"click" : {}, 
		"contextMenu" : {}, 
		"drop" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.Route with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Route.extend
 * @function
 */

sap.ui.vbm.Route.M_EVENTS = {'click':'click','contextMenu':'contextMenu','drop':'drop'};


/**
 * Getter for property <code>position</code>.
 * The position array of the route.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>position</code>
 * @public
 * @name sap.ui.vbm.Route#getPosition
 * @function
 */

/**
 * Setter for property <code>position</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sPosition  new value for property <code>position</code>
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#setPosition
 * @function
 */


/**
 * Getter for property <code>color</code>.
 * The color of the route.
 *
 * Default value is <code>RGB(0;0;0)</code>
 *
 * @return {string} the value of property <code>color</code>
 * @public
 * @name sap.ui.vbm.Route#getColor
 * @function
 */

/**
 * Setter for property <code>color</code>.
 *
 * Default value is <code>RGB(0;0;0)</code> 
 *
 * @param {string} sColor  new value for property <code>color</code>
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#setColor
 * @function
 */


/**
 * Getter for property <code>start</code>.
 * The start point type of the route. 0: no startpoint 1: arrow as startpoint
 *
 * Default value is <code>0</code>
 *
 * @return {string} the value of property <code>start</code>
 * @public
 * @name sap.ui.vbm.Route#getStart
 * @function
 */

/**
 * Setter for property <code>start</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {string} sStart  new value for property <code>start</code>
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#setStart
 * @function
 */


/**
 * Getter for property <code>end</code>.
 * The end point type of the route. 0: no endpoint 1: arrow as endpoint
 *
 * Default value is <code>0</code>
 *
 * @return {string} the value of property <code>end</code>
 * @public
 * @name sap.ui.vbm.Route#getEnd
 * @function
 */

/**
 * Setter for property <code>end</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {string} sEnd  new value for property <code>end</code>
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#setEnd
 * @function
 */


/**
 * Getter for property <code>linewidth</code>.
 * The width of the route line.
 *
 * Default value is <code>5</code>
 *
 * @return {string} the value of property <code>linewidth</code>
 * @public
 * @name sap.ui.vbm.Route#getLinewidth
 * @function
 */

/**
 * Setter for property <code>linewidth</code>.
 *
 * Default value is <code>5</code> 
 *
 * @param {string} sLinewidth  new value for property <code>linewidth</code>
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#setLinewidth
 * @function
 */


/**
 * Getter for property <code>dotcolor</code>.
 * The color for the line dots of a route.
 *
 * Default value is <code>RGB(0;0;0)</code>
 *
 * @return {string} the value of property <code>dotcolor</code>
 * @public
 * @name sap.ui.vbm.Route#getDotcolor
 * @function
 */

/**
 * Setter for property <code>dotcolor</code>.
 *
 * Default value is <code>RGB(0;0;0)</code> 
 *
 * @param {string} sDotcolor  new value for property <code>dotcolor</code>
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#setDotcolor
 * @function
 */


/**
 * Getter for property <code>dotbordercolor</code>.
 * The border color of the line dots of a route.
 *
 * Default value is <code>RGB(0;0;0)</code>
 *
 * @return {string} the value of property <code>dotbordercolor</code>
 * @public
 * @name sap.ui.vbm.Route#getDotbordercolor
 * @function
 */

/**
 * Setter for property <code>dotbordercolor</code>.
 *
 * Default value is <code>RGB(0;0;0)</code> 
 *
 * @param {string} sDotbordercolor  new value for property <code>dotbordercolor</code>
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#setDotbordercolor
 * @function
 */


/**
 * Getter for property <code>dotwidth</code>.
 * The diameter of a dot in a route.
 *
 * Default value is <code>0</code>
 *
 * @return {string} the value of property <code>dotwidth</code>
 * @public
 * @name sap.ui.vbm.Route#getDotwidth
 * @function
 */

/**
 * Setter for property <code>dotwidth</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {string} sDotwidth  new value for property <code>dotwidth</code>
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#setDotwidth
 * @function
 */


/**
 * Getter for aggregation <code>dragSource</code>.<br/>
 * DragSource aggregation
 * 
 * @return {sap.ui.vbm.DragSource[]}
 * @public
 * @name sap.ui.vbm.Route#getDragSource
 * @function
 */


/**
 * Inserts a dragSource into the aggregation named <code>dragSource</code>.
 *
 * @param {sap.ui.vbm.DragSource}
 *          oDragSource the dragSource to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the dragSource should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the dragSource is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the dragSource is inserted at 
 *             the last position        
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#insertDragSource
 * @function
 */

/**
 * Adds some dragSource <code>oDragSource</code> 
 * to the aggregation named <code>dragSource</code>.
 *
 * @param {sap.ui.vbm.DragSource}
 *            oDragSource the dragSource to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#addDragSource
 * @function
 */

/**
 * Removes an dragSource from the aggregation named <code>dragSource</code>.
 *
 * @param {int | string | sap.ui.vbm.DragSource} vDragSource the dragSource to remove or its index or id
 * @return {sap.ui.vbm.DragSource} the removed dragSource or null
 * @public
 * @name sap.ui.vbm.Route#removeDragSource
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>dragSource</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.DragSource[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.Route#removeAllDragSource
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.vbm.DragSource</code> in the aggregation named <code>dragSource</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.vbm.DragSource}
 *            oDragSource the dragSource whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ui.vbm.Route#indexOfDragSource
 * @function
 */
	

/**
 * Destroys all the dragSource in the aggregation 
 * named <code>dragSource</code>.
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#destroyDragSource
 * @function
 */


/**
 * Getter for aggregation <code>dropTarget</code>.<br/>
 * DropTarget aggregation
 * 
 * @return {sap.ui.vbm.DropTarget[]}
 * @public
 * @name sap.ui.vbm.Route#getDropTarget
 * @function
 */


/**
 * Inserts a dropTarget into the aggregation named <code>dropTarget</code>.
 *
 * @param {sap.ui.vbm.DropTarget}
 *          oDropTarget the dropTarget to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the dropTarget should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the dropTarget is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the dropTarget is inserted at 
 *             the last position        
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#insertDropTarget
 * @function
 */

/**
 * Adds some dropTarget <code>oDropTarget</code> 
 * to the aggregation named <code>dropTarget</code>.
 *
 * @param {sap.ui.vbm.DropTarget}
 *            oDropTarget the dropTarget to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#addDropTarget
 * @function
 */

/**
 * Removes an dropTarget from the aggregation named <code>dropTarget</code>.
 *
 * @param {int | string | sap.ui.vbm.DropTarget} vDropTarget the dropTarget to remove or its index or id
 * @return {sap.ui.vbm.DropTarget} the removed dropTarget or null
 * @public
 * @name sap.ui.vbm.Route#removeDropTarget
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>dropTarget</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.DropTarget[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.Route#removeAllDropTarget
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.vbm.DropTarget</code> in the aggregation named <code>dropTarget</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.vbm.DropTarget}
 *            oDropTarget the dropTarget whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ui.vbm.Route#indexOfDropTarget
 * @function
 */
	

/**
 * Destroys all the dropTarget in the aggregation 
 * named <code>dropTarget</code>.
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#destroyDropTarget
 * @function
 */


/**
 * The event is raised when there is a click action on a Route.
 *
 * @name sap.ui.vbm.Route#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.Route</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Route</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on a Route.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Route</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.Route</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Route#fireClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on a Route.
 *
 * @name sap.ui.vbm.Route#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.Route</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Route</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on a Route.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Route</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.Route</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Route#fireContextMenu
 * @function
 */


/**
 * The event is raised when something is dropped on a Route.
 *
 * @name sap.ui.vbm.Route#drop
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'drop' event of this <code>sap.ui.vbm.Route</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Route</code>.<br/> itself. 
 *  
 * The event is raised when something is dropped on a Route.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Route</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#attachDrop
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'drop' event of this <code>sap.ui.vbm.Route</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Route#detachDrop
 * @function
 */

/**
 * Fire event drop to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Route} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Route#fireDrop
 * @function
 */


/**
 * open a Detail Window attached to the positions of the route
 *
 * @name sap.ui.vbm.Route#openDetailWindow
 * @function
 * @param {string} sCaption
 *         detail window caption
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
 * @name sap.ui.vbm.Route#openContextMenu
 * @function
 * @param {object} oMenu
 *         the context menu to be opened
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/ui/vbm/Route.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.Route.prototype.init = function(){
//   // do something for initialization...
//};

sap.ui.vbm.Route.prototype.openDetailWindow = function( caption, offsetX, offsetY ){
   this.oParent.openDetailWindow( this, {caption : caption, offsetX : offsetX, offsetY : offsetY} ); 

};

sap.ui.vbm.Route.prototype.openContextMenu = function( menu ){
   this.oParent.openContextMenu( this, menu ); 

};
