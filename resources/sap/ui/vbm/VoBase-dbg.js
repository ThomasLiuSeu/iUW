/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.VoBase.
jQuery.sap.declare("sap.ui.vbm.VoBase");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.core.Element");


/**
 * Constructor for a new VoBase.
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
 * <li>{@link #getHotScale hotScale} : string (default: '1.1;1.1;1.0')</li>
 * <li>{@link #getHotDeltaColor hotDeltaColor} : string (default: 'RHLSA(0;1.0;1.0;1.0)')</li>
 * <li>{@link #getSelectColor selectColor} : string (default: 'RHLSA(0.0;1.0;1.0;1.0)')</li>
 * <li>{@link #getFxsize fxsize} : string (default: 'true')</li>
 * <li>{@link #getFxdir fxdir} : string (default: 'true')</li>
 * <li>{@link #getEntity entity} : string</li>
 * <li>{@link #getLabelText labelText} : string</li>
 * <li>{@link #getLabelBgColor labelBgColor} : string (default: 'RGB(255;255;255)')</li>
 * <li>{@link #getLabelPos labelPos} : string</li>
 * <li>{@link #getChangable changable} : boolean (default: false)</li>
 * <li>{@link #getDragData dragData} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.VoBase#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.VoBase#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.VoBase#event:handleMoved handleMoved} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.VoBase#event:handleContextMenu handleContextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.VoBase#event:handleClick handleClick} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
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
 * Aggregation element for the Spot container
 * @extends sap.ui.core.Element
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.VoBase
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Element.extend("sap.ui.vbm.VoBase", { metadata : {

	library : "sap.ui.vbm",
	properties : {
		"hotScale" : {type : "string", group : "Misc", defaultValue : '1.1;1.1;1.0'},
		"hotDeltaColor" : {type : "string", group : "Misc", defaultValue : 'RHLSA(0;1.0;1.0;1.0)'},
		"selectColor" : {type : "string", group : "Misc", defaultValue : 'RHLSA(0.0;1.0;1.0;1.0)'},
		"fxsize" : {type : "string", group : "Misc", defaultValue : 'true'},
		"fxdir" : {type : "string", group : "Misc", defaultValue : 'true'},
		"entity" : {type : "string", group : "Misc", defaultValue : null},
		"labelText" : {type : "string", group : "Misc", defaultValue : null},
		"labelBgColor" : {type : "string", group : "Misc", defaultValue : 'RGB(255;255;255)'},
		"labelPos" : {type : "string", group : "Misc", defaultValue : null},
		"changable" : {type : "boolean", group : "Misc", defaultValue : false},
		"dragData" : {type : "string", group : "Misc", defaultValue : null}
	},
	events : {
		"click" : {}, 
		"contextMenu" : {}, 
		"handleMoved" : {}, 
		"handleContextMenu" : {}, 
		"handleClick" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.VoBase with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.VoBase.extend
 * @function
 */

sap.ui.vbm.VoBase.M_EVENTS = {'click':'click','contextMenu':'contextMenu','handleMoved':'handleMoved','handleContextMenu':'handleContextMenu','handleClick':'handleClick'};


/**
 * Getter for property <code>hotScale</code>.
 * Scaling factor when visual object is hovered.
 *
 * Default value is <code>1.1;1.1;1.0</code>
 *
 * @return {string} the value of property <code>hotScale</code>
 * @public
 * @name sap.ui.vbm.VoBase#getHotScale
 * @function
 */

/**
 * Setter for property <code>hotScale</code>.
 *
 * Default value is <code>1.1;1.1;1.0</code> 
 *
 * @param {string} sHotScale  new value for property <code>hotScale</code>
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#setHotScale
 * @function
 */


/**
 * Getter for property <code>hotDeltaColor</code>.
 * Color shift when visual object is hovered.
 *
 * Default value is <code>RHLSA(0;1.0;1.0;1.0)</code>
 *
 * @return {string} the value of property <code>hotDeltaColor</code>
 * @public
 * @name sap.ui.vbm.VoBase#getHotDeltaColor
 * @function
 */

/**
 * Setter for property <code>hotDeltaColor</code>.
 *
 * Default value is <code>RHLSA(0;1.0;1.0;1.0)</code> 
 *
 * @param {string} sHotDeltaColor  new value for property <code>hotDeltaColor</code>
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#setHotDeltaColor
 * @function
 */


/**
 * Getter for property <code>selectColor</code>.
 * Color when visual object is selected. This can be explicit or a relative one.
 *
 * Default value is <code>RHLSA(0.0;1.0;1.0;1.0)</code>
 *
 * @return {string} the value of property <code>selectColor</code>
 * @public
 * @name sap.ui.vbm.VoBase#getSelectColor
 * @function
 */

/**
 * Setter for property <code>selectColor</code>.
 *
 * Default value is <code>RHLSA(0.0;1.0;1.0;1.0)</code> 
 *
 * @param {string} sSelectColor  new value for property <code>selectColor</code>
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#setSelectColor
 * @function
 */


/**
 * Getter for property <code>fxsize</code>.
 * The visual object should keep its size when the map is zoomed. Default value is 'true'
 *
 * Default value is <code>true</code>
 *
 * @return {string} the value of property <code>fxsize</code>
 * @public
 * @name sap.ui.vbm.VoBase#getFxsize
 * @function
 */

/**
 * Setter for property <code>fxsize</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {string} sFxsize  new value for property <code>fxsize</code>
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#setFxsize
 * @function
 */


/**
 * Getter for property <code>fxdir</code>.
 * The visual object is not rotated when the map is rotated. The property is only required when the PlugIn is used.
 *
 * Default value is <code>true</code>
 *
 * @return {string} the value of property <code>fxdir</code>
 * @public
 * @name sap.ui.vbm.VoBase#getFxdir
 * @function
 */

/**
 * Setter for property <code>fxdir</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {string} sFxdir  new value for property <code>fxdir</code>
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#setFxdir
 * @function
 */


/**
 * Getter for property <code>entity</code>.
 * The visual object builds an entity with other vos when it is hovered. The property is not supported when the PlugIn is used.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>entity</code>
 * @public
 * @name sap.ui.vbm.VoBase#getEntity
 * @function
 */

/**
 * Setter for property <code>entity</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sEntity  new value for property <code>entity</code>
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#setEntity
 * @function
 */


/**
 * Getter for property <code>labelText</code>.
 * The visual objects label text.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>labelText</code>
 * @public
 * @name sap.ui.vbm.VoBase#getLabelText
 * @function
 */

/**
 * Setter for property <code>labelText</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sLabelText  new value for property <code>labelText</code>
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#setLabelText
 * @function
 */


/**
 * Getter for property <code>labelBgColor</code>.
 * The visual objects label background color. The default value is white.
 *
 * Default value is <code>RGB(255;255;255)</code>
 *
 * @return {string} the value of property <code>labelBgColor</code>
 * @public
 * @name sap.ui.vbm.VoBase#getLabelBgColor
 * @function
 */

/**
 * Setter for property <code>labelBgColor</code>.
 *
 * Default value is <code>RGB(255;255;255)</code> 
 *
 * @param {string} sLabelBgColor  new value for property <code>labelBgColor</code>
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#setLabelBgColor
 * @function
 */


/**
 * Getter for property <code>labelPos</code>.
 * The visual objects label position.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>labelPos</code>
 * @public
 * @name sap.ui.vbm.VoBase#getLabelPos
 * @function
 */

/**
 * Setter for property <code>labelPos</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sLabelPos  new value for property <code>labelPos</code>
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#setLabelPos
 * @function
 */


/**
 * Getter for property <code>changable</code>.
 * Set to true if the vo should be changable at runtime.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>changable</code>
 * @public
 * @name sap.ui.vbm.VoBase#getChangable
 * @function
 */

/**
 * Setter for property <code>changable</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bChangable  new value for property <code>changable</code>
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#setChangable
 * @function
 */


/**
 * Getter for property <code>dragData</code>.
 * Data to be dragged.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>dragData</code>
 * @public
 * @name sap.ui.vbm.VoBase#getDragData
 * @function
 */

/**
 * Setter for property <code>dragData</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDragData  new value for property <code>dragData</code>
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#setDragData
 * @function
 */


/**
 * The event is raised when there is a click action on a visual object.
 *
 * @name sap.ui.vbm.VoBase#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.VoBase</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VoBase</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on a visual object.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VoBase</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.VoBase</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VoBase#fireClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on a visual object.
 *
 * @name sap.ui.vbm.VoBase#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.VoBase</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VoBase</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on a visual object.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VoBase</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.VoBase</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VoBase#fireContextMenu
 * @function
 */


/**
 * This event is raised when the design handle of a changable Area is moved.
 *
 * @name sap.ui.vbm.VoBase#handleMoved
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'handleMoved' event of this <code>sap.ui.vbm.VoBase</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VoBase</code>.<br/> itself. 
 *  
 * This event is raised when the design handle of a changable Area is moved.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VoBase</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#attachHandleMoved
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'handleMoved' event of this <code>sap.ui.vbm.VoBase</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#detachHandleMoved
 * @function
 */

/**
 * Fire event handleMoved to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VoBase#fireHandleMoved
 * @function
 */


/**
 * This event is raised when the design handle of a changable Area is right clicked.
 *
 * @name sap.ui.vbm.VoBase#handleContextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'handleContextMenu' event of this <code>sap.ui.vbm.VoBase</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VoBase</code>.<br/> itself. 
 *  
 * This event is raised when the design handle of a changable Area is right clicked.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VoBase</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#attachHandleContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'handleContextMenu' event of this <code>sap.ui.vbm.VoBase</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#detachHandleContextMenu
 * @function
 */

/**
 * Fire event handleContextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VoBase#fireHandleContextMenu
 * @function
 */


/**
 * This event is raised when the design handle of a changable Area is clicked.
 *
 * @name sap.ui.vbm.VoBase#handleClick
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'handleClick' event of this <code>sap.ui.vbm.VoBase</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VoBase</code>.<br/> itself. 
 *  
 * This event is raised when the design handle of a changable Area is clicked.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VoBase</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#attachHandleClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'handleClick' event of this <code>sap.ui.vbm.VoBase</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoBase#detachHandleClick
 * @function
 */

/**
 * Fire event handleClick to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VoBase} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VoBase#fireHandleClick
 * @function
 */

// Start of sap/ui/vbm/VoBase.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.VoBase.prototype.init = function(){
//   // do something for initialization...
//};