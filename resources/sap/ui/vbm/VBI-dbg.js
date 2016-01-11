/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.VBI.
jQuery.sap.declare("sap.ui.vbm.VBI");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new VBI.
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
 * <li>{@link #getWidth width} : sap.ui.core.CSSSize (default: '800px')</li>
 * <li>{@link #getHeight height} : sap.ui.core.CSSSize (default: '600px')</li>
 * <li>{@link #getConfig config} : object</li>
 * <li>{@link #getPlugin plugin} : boolean (default: false)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.VBI#event:submit submit} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.VBI#event:render render} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.VBI#event:zoom zoom} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.VBI#event:move move} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.VBI#event:openWindow openWindow} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.VBI#event:closeWindow closeWindow} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * The VBI control.
 * @extends sap.ui.core.Control
 *
 * @author SAP AG
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.VBI
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ui.vbm.VBI", { metadata : {

	publicMethods : [
		// methods
		"load", "zoomToGeoPosition"
	],
	library : "sap.ui.vbm",
	properties : {
		"width" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : '800px'},
		"height" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : '600px'},
		"config" : {type : "object", group : "Misc", defaultValue : null},
		"plugin" : {type : "boolean", group : "Misc", defaultValue : false}
	},
	events : {
		"submit" : {}, 
		"render" : {}, 
		"zoom" : {}, 
		"move" : {}, 
		"openWindow" : {}, 
		"closeWindow" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.VBI with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.VBI.extend
 * @function
 */

sap.ui.vbm.VBI.M_EVENTS = {'submit':'submit','render':'render','zoom':'zoom','move':'move','openWindow':'openWindow','closeWindow':'closeWindow'};


/**
 * Getter for property <code>width</code>.
 * Set the width of the control.
 *
 * Default value is <code>800px</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>width</code>
 * @public
 * @name sap.ui.vbm.VBI#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is <code>800px</code> 
 *
 * @param {sap.ui.core.CSSSize} sWidth  new value for property <code>width</code>
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#setWidth
 * @function
 */


/**
 * Getter for property <code>height</code>.
 * Set the height of the control.
 *
 * Default value is <code>600px</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>height</code>
 * @public
 * @name sap.ui.vbm.VBI#getHeight
 * @function
 */

/**
 * Setter for property <code>height</code>.
 *
 * Default value is <code>600px</code> 
 *
 * @param {sap.ui.core.CSSSize} sHeight  new value for property <code>height</code>
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#setHeight
 * @function
 */


/**
 * Getter for property <code>config</code>.
 * This is the model configuration. Usually the Visual Business application is provided by this property. Nevertheless the property can be used for data binding to the inner Visual Business data model.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {object} the value of property <code>config</code>
 * @public
 * @name sap.ui.vbm.VBI#getConfig
 * @function
 */

/**
 * Setter for property <code>config</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object} oConfig  new value for property <code>config</code>
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#setConfig
 * @function
 */


/**
 * Getter for property <code>plugin</code>.
 * When true, the plugin version of Visual Business should be used.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>plugin</code>
 * @public
 * @name sap.ui.vbm.VBI#getPlugin
 * @function
 */

/**
 * Setter for property <code>plugin</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bPlugin  new value for property <code>plugin</code>
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#setPlugin
 * @function
 */


/**
 * High level API. Submit event is raised.
 *
 * @name sap.ui.vbm.VBI#submit
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {string} oControlEvent.getParameters.data Json or xml string describing the delta state of visual business and the information about the event.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'submit' event of this <code>sap.ui.vbm.VBI</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VBI</code>.<br/> itself. 
 *  
 * High level API. Submit event is raised.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VBI</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#attachSubmit
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'submit' event of this <code>sap.ui.vbm.VBI</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#detachSubmit
 * @function
 */

/**
 * Fire event submit to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'data' of type <code>string</code> Json or xml string describing the delta state of visual business and the information about the event.</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VBI#fireSubmit
 * @function
 */


/**
 * Low level API. Rendering of the canvas content is reqested. This event can be used to do custom rendering into the Visual Business overlay canvas.
 * 
 * This function is not supported in plugin mode.
 *
 * @name sap.ui.vbm.VBI#render
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {object} oControlEvent.getParameters.canvas Canvas object to render into.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'render' event of this <code>sap.ui.vbm.VBI</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VBI</code>.<br/> itself. 
 *  
 * Low level API. Rendering of the canvas content is reqested. This event can be used to do custom rendering into the Visual Business overlay canvas.
 * 
 * This function is not supported in plugin mode.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VBI</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#attachRender
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'render' event of this <code>sap.ui.vbm.VBI</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#detachRender
 * @function
 */

/**
 * Fire event render to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'canvas' of type <code>object</code> Canvas object to render into. </li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VBI#fireRender
 * @function
 */


/**
 * Low level API. The canvas is zoomed.
 * 
 * This function is not supported in plugin mode.
 *
 * @name sap.ui.vbm.VBI#zoom
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {object} oControlEvent.getParameters.canvas Canvas object to render into
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'zoom' event of this <code>sap.ui.vbm.VBI</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VBI</code>.<br/> itself. 
 *  
 * Low level API. The canvas is zoomed.
 * 
 * This function is not supported in plugin mode.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VBI</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#attachZoom
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'zoom' event of this <code>sap.ui.vbm.VBI</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#detachZoom
 * @function
 */

/**
 * Fire event zoom to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'canvas' of type <code>object</code> Canvas object to render into</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VBI#fireZoom
 * @function
 */


/**
 * Low level API. The canvas was moved.
 * 
 * This function is not supported in plugin mode.
 *
 * @name sap.ui.vbm.VBI#move
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {object} oControlEvent.getParameters.canvas Canvas object to render into.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'move' event of this <code>sap.ui.vbm.VBI</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VBI</code>.<br/> itself. 
 *  
 * Low level API. The canvas was moved.
 * 
 * This function is not supported in plugin mode.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VBI</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#attachMove
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'move' event of this <code>sap.ui.vbm.VBI</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#detachMove
 * @function
 */

/**
 * Fire event move to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'canvas' of type <code>object</code> Canvas object to render into.</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VBI#fireMove
 * @function
 */


/**
 * The event is raised raised before a Visual Business window is opened.
 * 
 * This function is not supported in plugin mode.
 *
 * @name sap.ui.vbm.VBI#openWindow
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {object} oControlEvent.getParameters.contentarea Div placeholder to render into.
 * @param {string} oControlEvent.getParameters.id ID of the window that is opened.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'openWindow' event of this <code>sap.ui.vbm.VBI</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VBI</code>.<br/> itself. 
 *  
 * The event is raised raised before a Visual Business window is opened.
 * 
 * This function is not supported in plugin mode.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VBI</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#attachOpenWindow
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'openWindow' event of this <code>sap.ui.vbm.VBI</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#detachOpenWindow
 * @function
 */

/**
 * Fire event openWindow to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'contentarea' of type <code>object</code> Div placeholder to render into.</li>
 * <li>'id' of type <code>string</code> ID of the window that is opened.</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VBI#fireOpenWindow
 * @function
 */


/**
 * The event is raised raised before a Visual Business window is closed.
 * 
 * This function is not supported in plugin mode.
 *
 * @name sap.ui.vbm.VBI#closeWindow
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {object} oControlEvent.getParameters.contentarea Div placeholder for content.
 * @param {string} oControlEvent.getParameters.id ID of the window that is closed.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'closeWindow' event of this <code>sap.ui.vbm.VBI</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VBI</code>.<br/> itself. 
 *  
 * The event is raised raised before a Visual Business window is closed.
 * 
 * This function is not supported in plugin mode.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VBI</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#attachCloseWindow
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'closeWindow' event of this <code>sap.ui.vbm.VBI</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VBI#detachCloseWindow
 * @function
 */

/**
 * Fire event closeWindow to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'contentarea' of type <code>object</code> Div placeholder for content.</li>
 * <li>'id' of type <code>string</code> ID of the window that is closed.</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VBI} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VBI#fireCloseWindow
 * @function
 */


/**
 * High level load function. The function accepts a json string or an already parsed json object. This can be a Visual Business application, any delta operations on the application or other hierachical data that can be mapped by the Visual Business data provider to the inner Visual Business data context.
 *
 * @name sap.ui.vbm.VBI#load
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Zoom to one or multiple geo positions.
 * 
 * This function works only for the main geo scene in the Visual Business control.
 *
 * @name sap.ui.vbm.VBI#zoomToGeoPosition
 * @function
 * @param {float} fLon
 *         Longitude in degrees. This can be an array of longitude values.
 * @param {float} fLat
 *         Latitude in degrees. This can be an array of latitude values.
 * @param {int} iLod
 *         Level of detail, usually between 0 and 20. This will be limited by the map provider capabilities.
 * @type sap.ui.core.CSSSizeShortHand
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/ui/vbm/VBI.js
jQuery.sap.require("sap.ui.vbm.lib.sapvbi");
//jQuery.sap.require("sap.ui.vbm.lib.jquery-mousewheel");
jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-core");
jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-widget");
jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-mouse");
jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-draggable");
jQuery.sap.require("sap.ui.core.IconPool");
//jQuery.sap.require("sap.ui.vbm.lib.jquery-vbinavigation");

/*global VBI *///declare unusual global vars for JSLint/SAPUI5 validation

//...........................................................................//
// This file defines behavior for the control,...............................//
//...........................................................................//

sap.ui.vbm.VBI.prototype.exit = function()
{
   // create the vbi control context.........................................//
   // alert( "destroy" );

   // destroy the vbi control context........................................//
   // or plugin keept resources..............................................//
   
   if( this.getPlugin() )
   {
      var pi = this.GetPlugInControl();
      if( pi ) pi.OnSubmit = null;           // unsubscribe event............//
   } else
   {
      if( this.m_VBIContext )
         this.m_VBIContext.clear(); // clear the resources...................//
   }

   if ( this.resizeID != "" ){
      sap.ui.core.ResizeHandler.deregister(this.resizeID);
      this.resizeID = "";
   }     
   
};

sap.ui.vbm.VBI.prototype.resize = function( event )
{
   var cntrl = ( this.oControl != undefined) ? this.oControl : this; 
   
   var ctx = cntrl.m_VBIContext;
   if ( ctx ) {
      var scene = ctx.GetMainScene();
      if (scene)
         scene.resizeCanvas( event );
   }
};

sap.ui.vbm.VBI.prototype.init = function()
{
   this.m_aLoadQueue = null;                 // load queue...................// 

   // create the vbi control context.........................................//
   if( this.getPlugin() )
   {
   } else
   {
      // just create the context.............................................//
      this.m_VBIContext = new VBI.VBIContext( this );
   }
   this.resizeID = "";
};

sap.ui.vbm.VBI.prototype.loadNative = function( dat )
{
   var l_vbiId = this.getId();
   var elem = document.getElementById( 'VBI' + l_vbiId );

   if( !elem )
      return;     // element not found.......................................//
   
   var sf = function( strVal )
   { 
      // to be compatible with the html version, we skip the root object.....//
      // definition..........................................................//
      try 
      {
         var oD;
         if( oD = JSON.parse( strVal ) )
         {
            var vb = oD.SAPVB;
            var txt = JSON.stringify( vb, null, '  ');
            
            // fire the submit..................................................//
            this.fireSubmit( { data:  txt } );
         }
      } catch( e )
      {
         VBI.m_bTrace && VBI.Trace( "Error submitting plugin event" );
      }
   };

   if( jQuery.type( dat ) == 'object' )
   {
      // input is a json object, convert to sting and load...................//
      var txt = JSON.stringify( dat, null, '  ' );
      try 
      {
         elem.Load( txt );
         elem.OnSubmit = sf.bind( this );
      } catch( e )
      {
      }
   } else
   if( jQuery.type( dat ) == 'string' )
   {
      try 
      {
         elem.Load( dat );
         elem.OnSubmit = sf.bind( this );
      } catch( e )
      {
      }
   }
};

sap.ui.vbm.VBI.prototype.loadHtml = function( data )
{
   var l_vbiId = this.getId();

   var dat = null;

   // ensure that data is converted to a json object.........................//
   // when this is a string, due ABAP servers sometimes sets a BOM at the....//
   // beginning of the string we try to skip this............................//
   if( typeof data  == 'string' )
      dat = JSON.parse( data.indexOf('{') ? data.substr( data.indexOf('{') ) : data );         
   else
   if( typeof data == 'object' )
      dat = data;                      // this is already an object

   // return immediately when data can not be interpreted....................//
   if( !dat )
      return;                 

   // check for data binding.................................................//
   if( !dat["SAPVB"] )
   {
      var md;
      if( this.m_VBIContext && ( md = ( new VBI.Adaptor( this.m_VBIContext ) ).CreateLoadData( dat ) ) )
         return this.loadHtml( md );
      else
         return;  // this is no valid data..............
   }

   // todo: do correct handling when change flags get set....................//
   var bModifiedDataTypes = false;
   var bModifiedData = false;
   var bModifiedMapProviders = false;
   var bModifiedMapLayerStacks = false;
   var bModifiedScenes = false;
   var bModifiedWindows = false;
   var bModifiedActions = false;
   var bModifiedResources = false;
   var bModifiedAutomations = false;
   var bModifiedMenus = false;
   var bModifiedClustering = false;

   // the data can be a json object..........................................//
   if( jQuery.type( dat ) == 'object' )
   {
      if( dat.SAPVB )
      {
         // process configuration ...........................................//
         if( dat.SAPVB.Config )
         {
            // load the configuraiont .......................................//
            this.m_VBIContext.GetConfig().load( dat.SAPVB.Config, this.m_VBIContext );
         }
         // process resources................................................//
         if( dat.SAPVB.Resources )
         {
            // load the resources............................................//
            this.m_VBIContext.GetResources().load( dat.SAPVB.Resources, this.m_VBIContext );
            bModifiedResources = true;
         }
         // process datatypes................................................//
         if( dat.SAPVB.DataTypes )
         {
            // load the datatype provider....................................//
            if( !this.m_VBIContext.m_DataTypeProvider )
    	         this.m_VBIContext.m_DataTypeProvider = new VBI.DataTypeProvider();

    	      this.m_VBIContext.m_DataTypeProvider.load( dat.SAPVB.DataTypes, this.m_VBIContext );
            bModifiedDataTypes = true;
         }
         // process datacontext..............................................//
         if( dat.SAPVB.Data )
         {
            // load the datacontext..........................................//
            // when the datacontext is loaded, provide the datatype info.....//
            if( !this.m_VBIContext.m_DataProvider )
               this.m_VBIContext.m_DataProvider = new VBI.DataProvider();

            this.m_VBIContext.m_DataProvider.load( dat.SAPVB.Data, this.m_VBIContext );
            bModifiedData = true;
         }
         // process mapproviders.............................................//
         if( dat.SAPVB.MapProviders )
         {
            // load the mapproviders.........................................//
            if( !this.m_VBIContext.m_MapProviders )
               this.m_VBIContext.m_MapProviders = new VBI.MapProviders();

            this.m_VBIContext.m_MapProviders.load( dat.SAPVB.MapProviders, this.m_VBIContext );
            bModifiedMapProviders = true;
         }
         // process maplayerstacks...........................................//
         if( dat.SAPVB.MapLayerStacks )
         {
            // load the mapproviders.........................................//
            if( !this.m_VBIContext.m_MapLayerStackManager )
               this.m_VBIContext.m_MapLayerStackManager = new VBI.MapLayerStackManager( this.m_VBIContext );

            this.m_VBIContext.m_MapLayerStackManager.load( dat.SAPVB.MapLayerStacks, this.m_VBIContext );
            bModifiedMapLayerStacks = true;
         }
         // process windows..................................................//
         if( dat.SAPVB.Windows )
         {
            if( !this.m_VBIContext.m_Windows )
               this.m_VBIContext.m_Windows = new VBI.Windows();
            this.m_VBIContext.m_Windows.load( dat.SAPVB.Windows, this.m_VBIContext );
            bModifiedWindows = true;
         }
         // process actions..................................................//
         if( dat.SAPVB.Actions )
         {
            if( !this.m_VBIContext.m_Actions )
               this.m_VBIContext.m_Actions = new VBI.Actions();
            this.m_VBIContext.m_Actions.load( dat.SAPVB.Actions, this.m_VBIContext );
            bModifiedActions = true;
         }
         // process automations..............................................//
         if( dat.SAPVB.Automation )
         {
            if( !this.m_VBIContext.m_Automations )
               this.m_VBIContext.m_Automations = new VBI.Automations();
            this.m_VBIContext.m_Automations.load( dat.SAPVB.Automation, this.m_VBIContext );
            bModifiedAutomations = true;
         }
         // context menues ..................................................//
         if( dat.SAPVB.Menus )
         {
            if( !this.m_VBIContext.m_Menus )
               this.m_VBIContext.m_Menus = new VBI.Menus();
            this.m_VBIContext.m_Menus.load( dat.SAPVB.Menus, this.m_VBIContext );
            bModifiedMenus = true;
         }
         // clustering definition............................................//
         
         if( dat.SAPVB.Clustering )
         {
        	if( !this.m_VBIContext.m_Clustering ) 
        	   this.m_VBIContext.m_Clustering = new VBI.Clustering();        	 
            this.m_VBIContext.m_Clustering.load( dat.SAPVB.Clustering, this.m_VBIContext );
            bModifiedClustering = true;
         }
         
         // process scenes...................................................//
         // Note: process scenes last! Since it triggers a re-rendering everything should be updated before
         if( dat.SAPVB.Scenes )
         {
            if( !this.m_VBIContext.m_SceneManager )
               this.m_VBIContext.m_SceneManager = new VBI.SceneManager();
            this.m_VBIContext.m_SceneManager.load( dat.SAPVB.Scenes, this.m_VBIContext );
            bModifiedScenes = true;
         }         

      }

      // notify framework about data modifications...........................//
      if( bModifiedData )
         if( this.m_VBIContext.m_Windows )
            this.m_VBIContext.m_Windows.NotifyDataChange();

      // control context is loaded
      if( bModifiedScenes || bModifiedWindows )
      {
         if( this.m_VBIContext.m_Windows )
            this.m_VBIContext.m_Windows.Awake( l_vbiId );
      }

      if( bModifiedScenes || bModifiedData || bModifiedClustering  )
         if( this.m_VBIContext.m_Windows )
            this.m_VBIContext.m_Windows.RenderAsync();
   }
};


// high level function interface implementation..............................//
// interface function implementation.........................................//

sap.ui.vbm.VBI.prototype.load = function( dat )
{
   // when the control is not yet rendered, queue the load calls.............//
   if( !this.IsRendered() )
   {
      // create the queue and push load requests.............................//
      if( !this.m_aLoadQueue ) this.m_aLoadQueue = [];
      this.m_aLoadQueue.push( dat );
      return;
   }  

   // do processing when running as a plugin.................................//
   if( this.getPlugin() )
      return this.loadNative( dat );
   else
      return this.loadHtml( dat );
};

//...........................................................................//
// low level interface implementation........................................//

sap.ui.vbm.VBI.prototype.zoomToGeoPosition = function( lon, lat, lod )
{
   // the project must be loaded already
   var scene = null;
   if( scene = this.m_VBIContext.GetMainScene() ){
   	if( jQuery.type( lon ) == 'array' && jQuery.type( lat ) == 'array' ){
   		if ( lon.length > 1 && lat.length > 1 )
   			scene.ZoomToMultiplePositions( lon, lat );
   		else
   			scene.ZoomToGeoPosition( VBI.MathLib.DegToRad( [ parseFloat( lon[0] ), parseFloat( lat[0] ) ] ), parseFloat( lod ) );
   	}
   	else
   		scene.ZoomToGeoPosition( VBI.MathLib.DegToRad( [ parseFloat( lon ), parseFloat( lat ) ] ), parseFloat( lod ) );
   }
};

sap.ui.vbm.VBI.prototype.zoomToAreas = function( areaList, corr )
{
   // the project must be loaded already
   var scene = null;
   if( scene = this.m_VBIContext.GetMainScene() ){
   		scene.ZoomToAreas( areaList, corr );
   }
};

//...........................................................................//
// once VBI control is rendered, we attach navigation bar and map it self....//

sap.ui.vbm.VBI.prototype.onAfterRendering = function()
{
   // when there is preserved content restore it.............................//
   if (this.$oldContent.length > 0) {
      this.$().append(this.$oldContent);
   }
   
   // process the load queue.................................................//
   if( this.m_aLoadQueue )
   {
      var nJ;
      for( nJ = 0; nJ < this.m_aLoadQueue.length; ++nJ )
         this.load( this.m_aLoadQueue[ nJ ] );
      this.m_aLoadQueue = null;
   }

   if ( this.resizeID == "" ){
	  this.resize(); 
      this.resizeID = sap.ui.core.ResizeHandler.register(this, this.resize);   
   }   

   // do a new adjust of DOM placed elements.................................//
   // the function should do nothing if nothing needs to be done.............//
   var l_vbiId = this.getId();
   if( this.m_VBIContext.m_Windows )
      this.m_VBIContext.m_Windows.Awake( l_vbiId );
};

sap.ui.vbm.VBI.prototype.onBeforeRendering = function()
{
   // this is called before the renderer is called...........................//
   
   this.$oldContent = sap.ui.core.RenderManager.findPreservedContent(this.getId());
};


//...........................................................................//
// diagnostics...............................................................//

sap.ui.vbm.VBI.prototype.IsRendered = function()
{
   return this.getDomRef() ? true : false;
};

//...........................................................................//
// helpers...................................................................//

sap.ui.vbm.VBI.prototype.GetPlugInControl = function()
{
   var l_vbiId = this.getId();
   var elem = document.getElementById( 'VBI' + l_vbiId );
   return elem ? elem : null; 
};

//...........................................................................//
// re implement property setters.............................................//

sap.ui.vbm.VBI.prototype.setConfig = function( config )
{
   // just call the load function............................................//
   // this will execute once and discard the config..........................//
   return this.load( config );
};

sap.ui.vbm.VBI.prototype.setWidth = function( val )
{
   if ( typeof val === 'number' )
      this.setProperty("width", parseInt(val, 10).toString()+"px");
   else
      this.setProperty("width", val );
};

sap.ui.vbm.VBI.prototype.setHeight = function( val )
{
   if ( typeof val === 'number' )
      this.setProperty("height", parseInt(val, 10).toString()+"px");
   else
      this.setProperty("height", val );
};
