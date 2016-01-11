/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Spot.
jQuery.sap.declare("sap.ui.vbm.Spot");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.vbm.VoBase");


/**
 * Constructor for a new Spot.
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
 * <li>{@link #getText text} : string</li>
 * <li>{@link #getImage image} : string</li>
 * <li>{@link #getAlignment alignment} : string (default: '5')</li>
 * <li>{@link #getScale scale} : string (default: '1;1;1')</li></ul>
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
 * <li>{@link sap.ui.vbm.Spot#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Spot#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Spot#event:drop drop} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
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
 * Aggregation element for the Spot container
 * @extends sap.ui.vbm.VoBase
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Spot
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.vbm.VoBase.extend("sap.ui.vbm.Spot", { metadata : {

	publicMethods : [
		// methods
		"openDetailWindow", "openContextMenu"
	],
	library : "sap.ui.vbm",
	properties : {
		"position" : {type : "string", group : "Misc", defaultValue : '0;0;0'},
		"text" : {type : "string", group : "Misc", defaultValue : null},
		"image" : {type : "string", group : "Misc", defaultValue : null},
		"alignment" : {type : "string", group : "Misc", defaultValue : '5'},
		"scale" : {type : "string", group : "Misc", defaultValue : '1;1;1'}
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
 * Creates a new subclass of class sap.ui.vbm.Spot with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Spot.extend
 * @function
 */

sap.ui.vbm.Spot.M_EVENTS = {'click':'click','contextMenu':'contextMenu','drop':'drop'};


/**
 * Getter for property <code>position</code>.
 * The position of the spot.
 *
 * Default value is <code>0;0;0</code>
 *
 * @return {string} the value of property <code>position</code>
 * @public
 * @name sap.ui.vbm.Spot#getPosition
 * @function
 */

/**
 * Setter for property <code>position</code>.
 *
 * Default value is <code>0;0;0</code> 
 *
 * @param {string} sPosition  new value for property <code>position</code>
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#setPosition
 * @function
 */


/**
 * Getter for property <code>text</code>.
 * The text that is displayed in the spot. The text should not exceed a few characters.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>text</code>
 * @public
 * @name sap.ui.vbm.Spot#getText
 * @function
 */

/**
 * Setter for property <code>text</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sText  new value for property <code>text</code>
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#setText
 * @function
 */


/**
 * Getter for property <code>image</code>.
 * The image for the spot. This must be a reference to a resource.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>image</code>
 * @public
 * @name sap.ui.vbm.Spot#getImage
 * @function
 */

/**
 * Setter for property <code>image</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sImage  new value for property <code>image</code>
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#setImage
 * @function
 */


/**
 * Getter for property <code>alignment</code>.
 * Alignment of the element to its Position:
 * 0: center
 * 1: top center
 * 2: top right
 * 3: center right
 * 4: bottom right
 * 5: bottom center
 * 6: bottom left
 * 7: center left
 * 8: top left
 *
 * Default value is <code>5</code>
 *
 * @return {string} the value of property <code>alignment</code>
 * @public
 * @name sap.ui.vbm.Spot#getAlignment
 * @function
 */

/**
 * Setter for property <code>alignment</code>.
 *
 * Default value is <code>5</code> 
 *
 * @param {string} sAlignment  new value for property <code>alignment</code>
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#setAlignment
 * @function
 */


/**
 * Getter for property <code>scale</code>.
 * The scale of the spot.
 *
 * Default value is <code>1;1;1</code>
 *
 * @return {string} the value of property <code>scale</code>
 * @public
 * @name sap.ui.vbm.Spot#getScale
 * @function
 */

/**
 * Setter for property <code>scale</code>.
 *
 * Default value is <code>1;1;1</code> 
 *
 * @param {string} sScale  new value for property <code>scale</code>
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#setScale
 * @function
 */


/**
 * Getter for aggregation <code>dragSource</code>.<br/>
 * DragSource aggregation
 * 
 * @return {sap.ui.vbm.DragSource[]}
 * @public
 * @name sap.ui.vbm.Spot#getDragSource
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
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#insertDragSource
 * @function
 */

/**
 * Adds some dragSource <code>oDragSource</code> 
 * to the aggregation named <code>dragSource</code>.
 *
 * @param {sap.ui.vbm.DragSource}
 *            oDragSource the dragSource to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#addDragSource
 * @function
 */

/**
 * Removes an dragSource from the aggregation named <code>dragSource</code>.
 *
 * @param {int | string | sap.ui.vbm.DragSource} vDragSource the dragSource to remove or its index or id
 * @return {sap.ui.vbm.DragSource} the removed dragSource or null
 * @public
 * @name sap.ui.vbm.Spot#removeDragSource
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>dragSource</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.DragSource[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.Spot#removeAllDragSource
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
 * @name sap.ui.vbm.Spot#indexOfDragSource
 * @function
 */
	

/**
 * Destroys all the dragSource in the aggregation 
 * named <code>dragSource</code>.
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#destroyDragSource
 * @function
 */


/**
 * Getter for aggregation <code>dropTarget</code>.<br/>
 * DropTarget aggregation
 * 
 * @return {sap.ui.vbm.DropTarget[]}
 * @public
 * @name sap.ui.vbm.Spot#getDropTarget
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
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#insertDropTarget
 * @function
 */

/**
 * Adds some dropTarget <code>oDropTarget</code> 
 * to the aggregation named <code>dropTarget</code>.
 *
 * @param {sap.ui.vbm.DropTarget}
 *            oDropTarget the dropTarget to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#addDropTarget
 * @function
 */

/**
 * Removes an dropTarget from the aggregation named <code>dropTarget</code>.
 *
 * @param {int | string | sap.ui.vbm.DropTarget} vDropTarget the dropTarget to remove or its index or id
 * @return {sap.ui.vbm.DropTarget} the removed dropTarget or null
 * @public
 * @name sap.ui.vbm.Spot#removeDropTarget
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>dropTarget</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.DropTarget[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.Spot#removeAllDropTarget
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
 * @name sap.ui.vbm.Spot#indexOfDropTarget
 * @function
 */
	

/**
 * Destroys all the dropTarget in the aggregation 
 * named <code>dropTarget</code>.
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#destroyDropTarget
 * @function
 */


/**
 * The event is raised when there is a click action on a Spot.
 *
 * @name sap.ui.vbm.Spot#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.Spot</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Spot</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on a Spot.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Spot</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.Spot</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Spot#fireClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on a Spot.
 *
 * @name sap.ui.vbm.Spot#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.Spot</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Spot</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on a Spot.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Spot</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.Spot</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Spot#fireContextMenu
 * @function
 */


/**
 * The event is raised when something is dropped on a Spot.
 *
 * @name sap.ui.vbm.Spot#drop
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'drop' event of this <code>sap.ui.vbm.Spot</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Spot</code>.<br/> itself. 
 *  
 * The event is raised when something is dropped on a Spot.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Spot</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#attachDrop
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'drop' event of this <code>sap.ui.vbm.Spot</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Spot#detachDrop
 * @function
 */

/**
 * Fire event drop to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Spot} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Spot#fireDrop
 * @function
 */


/**
 * open a Detail Window for the spot at spot position
 *
 * @name sap.ui.vbm.Spot#openDetailWindow
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
 * @name sap.ui.vbm.Spot#openContextMenu
 * @function
 * @param {object} oMenu
 *         the context menu to be opened
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/ui/vbm/Spot.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.Spot.prototype.init = function(){
//   // do something for initialization...
//};


sap.ui.vbm.Spot.prototype.openDetailWindow = function( caption, offsetX, offsetY ){
   this.oParent.openDetailWindow( this, {caption : caption, offsetX : offsetX, offsetY : offsetY} ); 

};

sap.ui.vbm.Spot.prototype.openContextMenu = function( menu ){
   this.oParent.openContextMenu( this, menu ); 

};
