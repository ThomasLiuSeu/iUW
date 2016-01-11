/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Container.
jQuery.sap.declare("sap.ui.vbm.Container");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.vbm.VoBase");


/**
 * Constructor for a new Container.
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
 * <li>{@link #getAlignment alignment} : string (default: '0')</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getItem item} : sap.ui.core.Control</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.Container#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Container#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
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
 * Aggregation element for the Container container
 * @extends sap.ui.vbm.VoBase
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Container
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.vbm.VoBase.extend("sap.ui.vbm.Container", { metadata : {

	publicMethods : [
		// methods
		"propagateModels"
	],
	library : "sap.ui.vbm",
	properties : {
		"position" : {type : "string", group : "Misc", defaultValue : null},
		"alignment" : {type : "string", group : "Misc", defaultValue : '0'}
	},
	aggregations : {
		"item" : {type : "sap.ui.core.Control", multiple : false}
	},
	events : {
		"click" : {}, 
		"contextMenu" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.Container with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Container.extend
 * @function
 */

sap.ui.vbm.Container.M_EVENTS = {'click':'click','contextMenu':'contextMenu'};


/**
 * Getter for property <code>position</code>.
 * The position array for the Container.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>position</code>
 * @public
 * @name sap.ui.vbm.Container#getPosition
 * @function
 */

/**
 * Setter for property <code>position</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sPosition  new value for property <code>position</code>
 * @return {sap.ui.vbm.Container} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Container#setPosition
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
 * Default value is <code>0</code>
 *
 * @return {string} the value of property <code>alignment</code>
 * @public
 * @name sap.ui.vbm.Container#getAlignment
 * @function
 */

/**
 * Setter for property <code>alignment</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {string} sAlignment  new value for property <code>alignment</code>
 * @return {sap.ui.vbm.Container} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Container#setAlignment
 * @function
 */


/**
 * Getter for aggregation <code>item</code>.<br/>
 * The control that should be placed in the container.
 * 
 * @return {sap.ui.core.Control}
 * @public
 * @name sap.ui.vbm.Container#getItem
 * @function
 */


/**
 * Setter for the aggregated <code>item</code>.
 * @param {sap.ui.core.Control} oItem
 * @return {sap.ui.vbm.Container} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Container#setItem
 * @function
 */
	

/**
 * Destroys the item in the aggregation 
 * named <code>item</code>.
 * @return {sap.ui.vbm.Container} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Container#destroyItem
 * @function
 */


/**
 * The event is raised when there is a click action on a Container.
 *
 * @name sap.ui.vbm.Container#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.Container</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Container</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on a Container.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Container</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Container} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Container#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.Container</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Container} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Container#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Container} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Container#fireClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on a Container.
 *
 * @name sap.ui.vbm.Container#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.Container</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Container</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on a Container.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Container</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Container} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Container#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.Container</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Container} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Container#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Container} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Container#fireContextMenu
 * @function
 */


/**
 * For internal use only!
 *
 * @name sap.ui.vbm.Container#propagateModels
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/ui/vbm/Container.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.Container.prototype.init = function(){
//   // do something for initialization...
//};


sap.ui.vbm.Container.prototype.init = function() {
	this._oItem = null;
};

sap.ui.vbm.Container.prototype.getItem = function() {
	return this._oItem;
};

sap.ui.vbm.Container.prototype.setItem = function(oItem) {
	return this._oItem = oItem;
};

sap.ui.vbm.Container.prototype.clone = function(oItem) {
	var oClonedItem = sap.ui.core.Control.prototype.clone.apply(this, arguments);
	oClonedItem.setItem(this.getItem().clone());
	
	return oClonedItem;
};

sap.ui.vbm.Container.prototype.exit = function(oItem) {
	if (this._oItem) {
		this._oItem.destroy();
	}
	delete this._oItem;
};

sap.ui.vbm.Container.prototype.propagateModels = function(target) {
	for (var sName in this.oPropagatedProperties.oModels) { 
		(sName === "undefined") ? target.setModel(this.oPropagatedProperties.oModels[sName]) : target.setModel(this.oPropagatedProperties.oModels[sName], sName); }
	for (var sName in this.oModels) { 
		(sName === "undefined") ? target.setModel(this.oModels[sName]) : target.setModel(this.oModels[sName], sName); }	
};

