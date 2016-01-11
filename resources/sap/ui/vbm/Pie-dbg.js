/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Pie.
jQuery.sap.declare("sap.ui.vbm.Pie");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.vbm.VoBase");


/**
 * Constructor for a new Pie.
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
 * <li>{@link #getScale scale} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getItems items} <strong>(default aggregation)</strong> : sap.ui.vbm.PieItem[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.Pie#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Pie#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Pie#event:drop drop} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
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
 * Aggregation element for the Pie container
 * @extends sap.ui.vbm.VoBase
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Pie
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.vbm.VoBase.extend("sap.ui.vbm.Pie", { metadata : {

	publicMethods : [
		// methods
		"openDetailWindow", "openContextMenu"
	],
	library : "sap.ui.vbm",
	properties : {
		"position" : {type : "string", group : "Misc", defaultValue : null},
		"scale" : {type : "string", group : "Misc", defaultValue : null}
	},
	defaultAggregation : "items",
	aggregations : {
		"items" : {type : "sap.ui.vbm.PieItem", multiple : true, singularName : "item"}
	},
	events : {
		"click" : {}, 
		"contextMenu" : {}, 
		"drop" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.Pie with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Pie.extend
 * @function
 */

sap.ui.vbm.Pie.M_EVENTS = {'click':'click','contextMenu':'contextMenu','drop':'drop'};


/**
 * Getter for property <code>position</code>.
 * The position of the Pie.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>position</code>
 * @public
 * @name sap.ui.vbm.Pie#getPosition
 * @function
 */

/**
 * Setter for property <code>position</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sPosition  new value for property <code>position</code>
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pie#setPosition
 * @function
 */


/**
 * Getter for property <code>scale</code>.
 * The scaling of the Pie. The scale must be a vector, currently only the x scaling is applied to the Pie.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>scale</code>
 * @public
 * @name sap.ui.vbm.Pie#getScale
 * @function
 */

/**
 * Setter for property <code>scale</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sScale  new value for property <code>scale</code>
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pie#setScale
 * @function
 */


/**
 * Getter for aggregation <code>items</code>.<br/>
 * PieItem object aggregation. A PieItem holds the data for one slice in a Pie.
 * 
 * <strong>Note</strong>: this is the default aggregation for Pie.
 * @return {sap.ui.vbm.PieItem[]}
 * @public
 * @name sap.ui.vbm.Pie#getItems
 * @function
 */


/**
 * Inserts a item into the aggregation named <code>items</code>.
 *
 * @param {sap.ui.vbm.PieItem}
 *          oItem the item to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the item should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the item is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the item is inserted at 
 *             the last position        
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pie#insertItem
 * @function
 */

/**
 * Adds some item <code>oItem</code> 
 * to the aggregation named <code>items</code>.
 *
 * @param {sap.ui.vbm.PieItem}
 *            oItem the item to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pie#addItem
 * @function
 */

/**
 * Removes an item from the aggregation named <code>items</code>.
 *
 * @param {int | string | sap.ui.vbm.PieItem} vItem the item to remove or its index or id
 * @return {sap.ui.vbm.PieItem} the removed item or null
 * @public
 * @name sap.ui.vbm.Pie#removeItem
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>items</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.PieItem[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.Pie#removeAllItems
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.vbm.PieItem</code> in the aggregation named <code>items</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.vbm.PieItem}
 *            oItem the item whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ui.vbm.Pie#indexOfItem
 * @function
 */
	

/**
 * Destroys all the items in the aggregation 
 * named <code>items</code>.
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pie#destroyItems
 * @function
 */


/**
 * The event is raised when there is a click action on a Pie.
 *
 * @name sap.ui.vbm.Pie#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.Pie</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Pie</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on a Pie.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Pie</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pie#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.Pie</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pie#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Pie#fireClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on a Pie.
 *
 * @name sap.ui.vbm.Pie#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.Pie</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Pie</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on a Pie.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Pie</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pie#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.Pie</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pie#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Pie#fireContextMenu
 * @function
 */


/**
 * The event is raised when something is dropped on a Pie.
 *
 * @name sap.ui.vbm.Pie#drop
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'drop' event of this <code>sap.ui.vbm.Pie</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Pie</code>.<br/> itself. 
 *  
 * The event is raised when something is dropped on a Pie.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Pie</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pie#attachDrop
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'drop' event of this <code>sap.ui.vbm.Pie</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pie#detachDrop
 * @function
 */

/**
 * Fire event drop to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Pie} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Pie#fireDrop
 * @function
 */


/**
 * open a Detail Window for the pie at its position
 *
 * @name sap.ui.vbm.Pie#openDetailWindow
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
 * @name sap.ui.vbm.Pie#openContextMenu
 * @function
 * @param {object} oMenu
 *         the context menu to be opened
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/ui/vbm/Pie.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.Pie.prototype.init = function(){
//   // do something for initialization...
//};



sap.ui.vbm.Pie.prototype.openDetailWindow = function( caption, offsetX, offsetY ){
   this.oParent.openDetailWindow( this, {caption : caption, offsetX : offsetX, offsetY : offsetY} ); 

};

sap.ui.vbm.Pie.prototype.openContextMenu = function( menu ){
   this.oParent.openContextMenu( this, menu ); 

};
