/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.GeoMap.
jQuery.sap.declare("sap.ui.vbm.GeoMap");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.vbm.VBI");


/**
 * Constructor for a new GeoMap.
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
 * <li>{@link #getMapConfiguration mapConfiguration} : object</li>
 * <li>{@link #getLegendVisible legendVisible} : boolean (default: true)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getVos vos} <strong>(default aggregation)</strong> : sap.ui.vbm.VoAggregation[]</li>
 * <li>{@link #getResources resources} : sap.ui.vbm.Resource[]</li>
 * <li>{@link #getLegend legend} : sap.ui.vbm.Legend</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.GeoMap#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.GeoMap#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.GeoMap#event:drop drop} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.ui.vbm.VBI#constructor sap.ui.vbm.VBI}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Simple map with standard UI5 interface
 * @extends sap.ui.vbm.VBI
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.GeoMap
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.vbm.VBI.extend("sap.ui.vbm.GeoMap", { metadata : {

	library : "sap.ui.vbm",
	properties : {
		"mapConfiguration" : {type : "object", group : "Misc", defaultValue : null},
		"legendVisible" : {type : "boolean", group : "Misc", defaultValue : true}
	},
	defaultAggregation : "vos",
	aggregations : {
		"vos" : {type : "sap.ui.vbm.VoAggregation", multiple : true, singularName : "vo"}, 
		"resources" : {type : "sap.ui.vbm.Resource", multiple : true, singularName : "resource"}, 
		"legend" : {type : "sap.ui.vbm.Legend", multiple : false}
	},
	events : {
		"click" : {}, 
		"contextMenu" : {}, 
		"drop" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.GeoMap with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.GeoMap.extend
 * @function
 */

sap.ui.vbm.GeoMap.M_EVENTS = {'click':'click','contextMenu':'contextMenu','drop':'drop'};


/**
 * Getter for property <code>mapConfiguration</code>.
 * This is the map configuration for the geo map. The map configuration defines the used maps, the layering of the maps and the servers that can be used to request the map tiles.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {object} the value of property <code>mapConfiguration</code>
 * @public
 * @name sap.ui.vbm.GeoMap#getMapConfiguration
 * @function
 */

/**
 * Setter for property <code>mapConfiguration</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object} oMapConfiguration  new value for property <code>mapConfiguration</code>
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#setMapConfiguration
 * @function
 */


/**
 * Getter for property <code>legendVisible</code>.
 * not supported yet
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>legendVisible</code>
 * @public
 * @name sap.ui.vbm.GeoMap#getLegendVisible
 * @function
 */

/**
 * Setter for property <code>legendVisible</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bLegendVisible  new value for property <code>legendVisible</code>
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#setLegendVisible
 * @function
 */


/**
 * Getter for aggregation <code>vos</code>.<br/>
 * Aggregation of visual object types.
 * 
 * <strong>Note</strong>: this is the default aggregation for GeoMap.
 * @return {sap.ui.vbm.VoAggregation[]}
 * @public
 * @name sap.ui.vbm.GeoMap#getVos
 * @function
 */


/**
 * Inserts a vo into the aggregation named <code>vos</code>.
 *
 * @param {sap.ui.vbm.VoAggregation}
 *          oVo the vo to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the vo should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the vo is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the vo is inserted at 
 *             the last position        
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#insertVo
 * @function
 */

/**
 * Adds some vo <code>oVo</code> 
 * to the aggregation named <code>vos</code>.
 *
 * @param {sap.ui.vbm.VoAggregation}
 *            oVo the vo to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#addVo
 * @function
 */

/**
 * Removes an vo from the aggregation named <code>vos</code>.
 *
 * @param {int | string | sap.ui.vbm.VoAggregation} vVo the vo to remove or its index or id
 * @return {sap.ui.vbm.VoAggregation} the removed vo or null
 * @public
 * @name sap.ui.vbm.GeoMap#removeVo
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>vos</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.VoAggregation[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.GeoMap#removeAllVos
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.vbm.VoAggregation</code> in the aggregation named <code>vos</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.vbm.VoAggregation}
 *            oVo the vo whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ui.vbm.GeoMap#indexOfVo
 * @function
 */
	

/**
 * Destroys all the vos in the aggregation 
 * named <code>vos</code>.
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#destroyVos
 * @function
 */


/**
 * Getter for aggregation <code>resources</code>.<br/>
 * Aggregation of resources. The images of different spots have to be provided in the resources section. Binary resources data like images is pecified as a base64 encoded text.
 * 
 * @return {sap.ui.vbm.Resource[]}
 * @public
 * @name sap.ui.vbm.GeoMap#getResources
 * @function
 */


/**
 * Inserts a resource into the aggregation named <code>resources</code>.
 *
 * @param {sap.ui.vbm.Resource}
 *          oResource the resource to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the resource should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the resource is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the resource is inserted at 
 *             the last position        
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#insertResource
 * @function
 */

/**
 * Adds some resource <code>oResource</code> 
 * to the aggregation named <code>resources</code>.
 *
 * @param {sap.ui.vbm.Resource}
 *            oResource the resource to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#addResource
 * @function
 */

/**
 * Removes an resource from the aggregation named <code>resources</code>.
 *
 * @param {int | string | sap.ui.vbm.Resource} vResource the resource to remove or its index or id
 * @return {sap.ui.vbm.Resource} the removed resource or null
 * @public
 * @name sap.ui.vbm.GeoMap#removeResource
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>resources</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.Resource[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.GeoMap#removeAllResources
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.vbm.Resource</code> in the aggregation named <code>resources</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.vbm.Resource}
 *            oResource the resource whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ui.vbm.GeoMap#indexOfResource
 * @function
 */
	

/**
 * Destroys all the resources in the aggregation 
 * named <code>resources</code>.
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#destroyResources
 * @function
 */


/**
 * Getter for aggregation <code>legend</code>.<br/>
 * Legend for the Map
 * 
 * @return {sap.ui.vbm.Legend}
 * @public
 * @name sap.ui.vbm.GeoMap#getLegend
 * @function
 */


/**
 * Setter for the aggregated <code>legend</code>.
 * @param {sap.ui.vbm.Legend} oLegend
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#setLegend
 * @function
 */
	

/**
 * Destroys the legend in the aggregation 
 * named <code>legend</code>.
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#destroyLegend
 * @function
 */


/**
 * Raised when the map is clicked.
 *
 * @name sap.ui.vbm.GeoMap#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {string} oControlEvent.getParameters.pos Geo coordinates
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.GeoMap</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.GeoMap</code>.<br/> itself. 
 *  
 * Raised when the map is clicked.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.GeoMap</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.GeoMap</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'pos' of type <code>string</code> Geo coordinates</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.GeoMap#fireClick
 * @function
 */


/**
 * Raised when the map is right clicked/longPress(tap and hold).
 *
 * @name sap.ui.vbm.GeoMap#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {int} oControlEvent.getParameters.clientX Client coordinate X
 * @param {int} oControlEvent.getParameters.clientY Client coordinate Y
 * @param {string} oControlEvent.getParameters.pos Geo coordinates
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.GeoMap</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.GeoMap</code>.<br/> itself. 
 *  
 * Raised when the map is right clicked/longPress(tap and hold).
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.GeoMap</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.GeoMap</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'clientX' of type <code>int</code> Client coordinate X</li>
 * <li>'clientY' of type <code>int</code> Client coordinate Y</li>
 * <li>'pos' of type <code>string</code> Geo coordinates</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.GeoMap#fireContextMenu
 * @function
 */


/**
 * Raised when something is dropped on the map.
 *
 * @name sap.ui.vbm.GeoMap#drop
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {string} oControlEvent.getParameters.pos Geo coordinates
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'drop' event of this <code>sap.ui.vbm.GeoMap</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.GeoMap</code>.<br/> itself. 
 *  
 * Raised when something is dropped on the map.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.GeoMap</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#attachDrop
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'drop' event of this <code>sap.ui.vbm.GeoMap</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.GeoMap#detachDrop
 * @function
 */

/**
 * Fire event drop to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'pos' of type <code>string</code> Geo coordinates</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.GeoMap} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.GeoMap#fireDrop
 * @function
 */

// Start of sap/ui/vbm/GeoMap.js

///**
// * This file defines behavior for the control,
// */

// Author: Ulrich Roegelein

//sap.ui.vbm.GeoMap.prototype.init = function(){
//   // do something for initialization...
//};


sap.ui.vbm.GeoMap.DefaultApplicationURL = "media/geomap/geomap.json";

//...........................................................................//
// This section defines behavior for the control,............................//
//...........................................................................//

sap.ui.vbm.GeoMap.prototype.exit = function()
{
   sap.ui.vbm.VBI.prototype.exit.apply( this, arguments );

   // detach the event.......................................................//
   this.detachEvent('submit', sap.ui.vbm.GeoMap.prototype.onGeoMapSubmit, this );
   this.detachEvent('openWindow', sap.ui.vbm.GeoMap.prototype.onGeoMapOpenWindow, this );
   this.detachEvent('closeWindow', sap.ui.vbm.GeoMap.prototype.onGeoMapCloseWindow, this );
};

sap.ui.vbm.GeoMap.prototype.resize = function( event )
{
   sap.ui.vbm.VBI.prototype.resize.apply( this, arguments );
};

sap.ui.vbm.GeoMap.prototype.onAfterRendering = function()
{
   sap.ui.vbm.VBI.prototype.onAfterRendering.apply( this, arguments );
};

//...........................................................................//
// track modifications on resources..........................................//

sap.ui.vbm.GeoMap.prototype.destroyResources = function()
{
   this.m_bResourcesDirty = true;
   return this.destroyAggregation( "resources" );
};

sap.ui.vbm.GeoMap.prototype.addResource = function( o )
{
   this.m_bResourcesDirty = true;
   return this.addAggregation( "resources", o );
};

sap.ui.vbm.GeoMap.prototype.removeResource = function( o )
{
   this.m_bResourcesDirty = true;
   return this.removeAggregation( "resources", o );
};

sap.ui.vbm.GeoMap.prototype.removeAllResources = function( o )
{
   this.m_bResourcesDirty = true;
   return  this.removeAllAggregation( "resources" );
};

//...........................................................................//
// track modifications on vos................................................//

sap.ui.vbm.GeoMap.prototype.destroyVos = function()
{
   this.m_bVosDirty = true;
   return this.destroyAggregation( "vos" );
};

sap.ui.vbm.GeoMap.prototype.addVo = function( o )
{
   this.m_bVosDirty = true;
   return this.addAggregation( "vos", o );
};

sap.ui.vbm.GeoMap.prototype.removeVo = function( o )
{
   this.m_bVosDirty = true;
   return this.removeAggregation( "vos", o );
};

sap.ui.vbm.GeoMap.prototype.removeAllVos = function( o )
{
   this.m_bVosDirty = true;
   return  this.removeAllAggregation( "vos" );
};

//...........................................................................//
// track modifications on mapConfiguration...................................//

sap.ui.vbm.GeoMap.prototype.setMapConfiguration = function( o )
{
   this.m_bMapConfigurationDirty = true;
   this.setProperty( "mapConfiguration", o );
};

//...........................................................................//
// central event handler.....................................................//

sap.ui.vbm.GeoMap.prototype.onGeoMapSubmit = function( e )
{
   // analyze the event......................................................//
   var datEvent = JSON.parse( e.mParameters.data );
   
   // get the container......................................................//
   // and delegate the event to the container first..........................//
   var cont;
   if( cont = this.GetAggregatorContainer( datEvent.Action.object ) )
      return cont.HandleEvent( datEvent );

   // ToDo: other events might be important later
   switch( datEvent.Action.name )
   {
   		case "click":
   		// fire the click..................................................//
   		this.fireClick( { pos: datEvent.Action.AddActionProperties.AddActionProperty[0]['#'] });
   		break;
   		
   		case "contextMenu":
   		// fire the contextMenu..................................................//
   		this.fireContextMenu( { clientX: datEvent.Action.Params.Param[0]['#'], clientY: datEvent.Action.Params.Param[1]['#'], pos: datEvent.Action.AddActionProperties.AddActionProperty[0]['#'] });
   		break;
   		
   		case "drop":
   		// fire the drop..................................................//
   		this.fireDrop( { pos: datEvent.Action.AddActionProperties.AddActionProperty[0]['#'] });
   		break;
    };
};

sap.ui.vbm.GeoMap.prototype.onGeoMapOpenWindow = function( e )
{
   // get the id of the div area where to place the control..................//
   var div = e.getParameter("contentarea");
   if( div.m_ID )
   {
      // get the container...................................................//
      // and delegate the event to the container first.......................//
      var cont;
      if( cont = this.GetAggregatorContainer( div.m_ID ) )
         if( cont.HandleOpenWindow ) cont.HandleOpenWindow( e );
   }
};

sap.ui.vbm.GeoMap.prototype.onGeoMapCloseWindow = function( e )
{
   // get the id of the div area where to place the control..................//
   var div = e.getParameter("contentarea");
   if( div.m_ID )
   {
      // get the container..................................................//
      // and delegate the event to the container first......................//
      var cont;
      if( cont = this.GetAggregatorContainer( div.m_ID ) )
         if( cont.HandleCloseWindow ) cont.HandleCloseWindow( e );
   }
   if ( this.m_DTOpen && e.getParameter("id") == "Detail" ) // detail window gets closed
   {
      
      this.m_DTOpen = false;
      this.m_DTSrc = null;
      this.m_bWindowsDirty = true;
   }
};

sap.ui.vbm.GeoMap.prototype.init = function()
{
   // attach the event 
   this.attachEvent('submit', sap.ui.vbm.GeoMap.prototype.onGeoMapSubmit, this ); 
   this.attachEvent('openWindow', sap.ui.vbm.GeoMap.prototype.onGeoMapOpenWindow, this );
   this.attachEvent('closeWindow', sap.ui.vbm.GeoMap.prototype.onGeoMapCloseWindow, this );

   // initially set dirty state for all elements............................//
   this.m_bVosDirty = true;
   this.m_bMapConfigurationDirty = true;
   this.m_bResourcesDirty = true;
   this.m_bMapProvidersDirty = true;
   this.m_bMapLayerStacksDirty = true;
   this.m_bWindowsDirty = true;
   this.m_bMapconfigDirty = true;
   this.m_bLegendDirty = true;

   // call base class first
   sap.ui.vbm.VBI.prototype.init.apply( this, arguments );
};


//...........................................................................//
// common helper functions...................................................//


sap.ui.vbm.GeoMap.prototype.getWindowsObject = function( )
{
   // determine the windows object..........................................//
   var oWindows = {
         "Set": [
            {
                  "name" : "Main",                  
                  "Window": 
                  {
                     "id": "Main",
                     "caption": "MainWindow",
                     "type": "geo",
                     "refParent": "",
                     "refScene": "MainScene",
                     "modal": "true"
                  }
            }
         ]
      };

   var oLegend = this.getLegend();
   if( oLegend )
   {
      var oLegendWindows = oLegend.getTemplateObject();

      // concat the sets
      if( oLegendWindows.Set )
         oWindows.Set = oWindows.Set.concat( oLegendWindows.Set );
      // concat the removes
      if( oLegendWindows.Remove )
      {
         if( !oWindows.Remove ) 
            oWindows.Remove = oLegendWindows.Remove;
         else
            oWindows.Set = oWindows.Set.concat( oLegendWindows.Remove );
      }
    }
   
   
   if ( this.m_DTSrc && this.m_DTOpen )
   {
      var oDTWindows;
      if ( this.m_bUseClickPos == true && this.m_DTSrc.mClickGeoPos )
         oDTWindows = {
            "Set": [
                    {
                       "name" : "Detail",                  
                       "Window": 
                       {
                          "id": "Detail",
                          "type": "callout",
                          "refParent": "Main",
                          "refScene": "",
                          "modal": "true",
                          "caption": this.m_DTParams.caption ? this.m_DTParams.caption : "",
                          "offsetX": this.m_DTParams.offsetX ? this.m_DTParams.offsetX  : "0",
                          "offsetY": this.m_DTParams.offsetY ? this.m_DTParams.offsetY  : "0",
                          "pos": this.m_DTSrc.mClickGeoPos
                       }
                    }
                    ]
      };      
      else
         oDTWindows = {
            "Set": [
                    {
                       "name" : "Detail",                  
                       "Window": 
                       {
                          "id": "Detail",
                          "type": "callout",
                          "refParent": "Main",
                          "refScene": "",
                          "modal": "true",
                          "caption": this.m_DTParams.caption ? this.m_DTParams.caption : "",
                          "offsetX": this.m_DTParams.offsetX ? this.m_DTParams.offsetX  : "0",
                          "offsetY": this.m_DTParams.offsetY ? this.m_DTParams.offsetY  : "0",
                          "pos.bind": this.m_DTSrc.oParent.sId + "." + this.m_DTSrc.sId + ".P"
                       }
                    }
                    ]
      };      
         
      oWindows.Set = oWindows.Set.concat( oDTWindows.Set );
      
      var oDTWindowsR = {
            "Remove": [
               {
                     "name" : "Detail"                  
               }
            ]
         };      

      if( !oWindows.Remove ) 
         oWindows.Remove = oDTWindowsR.Remove;
      else
         oWindows.Set = oWindows.Set.concat( oDTWindowsR.Remove );
      
   }


   return oWindows;
};

sap.ui.vbm.GeoMap.prototype.getTemplateObject = function( vo )
{
   var oTemp = vo.getTemplateObject(), id = vo.getId();

   oTemp['id'] = id;

   // the data source name is equivalent to the controls id..................//
   oTemp['datasource'] = id;  

   // add base properties....................................................//
   oTemp['hotScale.bind'] = oTemp.id + ".HS"; 
   oTemp['hotDeltaColor.bind'] = oTemp.id + ".HDC";
   oTemp['selectColor.bind'] = oTemp.id + ".SC";
   oTemp['fxsize.bind'] = oTemp.id + ".FS";
   oTemp['fxdir.bind'] = oTemp.id + ".FD";
   oTemp['entity.bind'] = oTemp.id + ".ET";
   oTemp['labelText.bind'] = oTemp.id + ".LT";
   oTemp['labelBgColor.bind'] = oTemp.id + ".LBC";
   oTemp['labelPos.bind'] = oTemp.id + ".LP";
   oTemp['tooltip.bind'] = oTemp.id + ".TT";
   
   return oTemp; 
}; 

sap.ui.vbm.GeoMap.prototype.getDataObject = function( vo, nodef )
{
   // get instance specialized aggregation...................................//
   var oTemp = vo.getDataObject();

   // set the id of the table................................................//
   oTemp['name'] = vo.getId();
   
   // return immediately when defaults should not be appended................//
   if( nodef )
      return oTemp;
   
   // this is the filled element array of specialized object.................//
   // add standard properties................................................//
   var saE = oTemp.E;

   var aVO = vo.getItems();
   for( var nJ = 0, len = aVO.length; nJ < len; ++nJ )
   {
      // get the control.....................................................//
      var tmp, oInstance = saE[nJ], oVO = aVO[nJ];

      // add the key.........................................................//
      oInstance['K'] = oVO.getId();
      
      // changable...........................................................//
      oInstance['VB:c'] = oVO.getChangable();

      // add the control object description..................................// 
      oInstance['HS'] = oVO.getHotScale();
      oInstance['HDC'] = oVO.getHotDeltaColor();
      oInstance['SC'] = oVO.getSelectColor();
      oInstance['FS'] = oVO.getFxsize();
      oInstance['FD'] = oVO.getFxdir();
      oInstance['ET'] = oVO.getEntity();
      oInstance['LT'] = oVO.getLabelText();
      oInstance['LBC'] = oVO.getLabelBgColor();
      oInstance['LP'] = oVO.getLabelPos();
      oInstance['TT'] = ( tmp = oVO.getTooltip() ) ? tmp : "";
   }
  
   return oTemp; 
}; 

sap.ui.vbm.GeoMap.prototype.getTypeObject = function( vo, nodef )
{
   var oTemp = vo.getTypeObject();
   var id = vo.getId();

   // set the id.............................................................//
   oTemp['name'] = id;
   
   if( nodef ) 
      return oTemp;	// do not append defaults............................// 
   
   oTemp['key'] = 'K';

   // add base attributes....................................................//
   var aA = oTemp.A;

   // extend the object type.................................................//
   oTemp.A = aA.concat( [
                {
                   "name": "K",        // key
                   "alias": "K",
                   "type": "string"
                },
                {
                   "name": "HS",       // hot scale
                   "alias": "HS",
                   "type": "vector"
                },
                {
                   "name": "HDC",      // hot delta color
                   "alias": "HDC",
                   "type": "string"
                },
                {
                   "name": "SC",       // select color
                   "alias": "SC",
                   "type": "string"
                },
                {
                   "name": "FS",       // fix size
                   "alias": "FS",
                   "type": "boolean"
                },
                {
                   "name": "ET",       // image
                   "alias": "ET",
                   "type": "string"
                },
                {
                   "name": "LT",       // label text
                   "alias": "LT",
                   "type": "string"
                },
                {
                   "name": "LBC",      // label background color
                   "alias": "LBC",
                   "type": "color"
                },
                {
                   "name": "LP",       // label position
                   "alias": "LP",
                   "type": "long"
                },
                {
                   "name": "TT",       // tooltip
                   "alias": "TT",
                   "type": "string"
                }
            ] );

   return oTemp;
};

sap.ui.vbm.GeoMap.prototype.getActionArray = function( vo, saArray )
{
   var oTemp = (saArray) ? saArray : [];
   if (vo)
   {
	   oTemp = vo.getActionArray( saArray );
	   
   }	   
   else
   {
	   // subscribe for map event as well
	   var id = this.getId();
	   // check if the different vo events are registered..............................//
	   if( this.mEventRegistry[ "click" ])
	      oTemp.push(  { "id": id + "1", "name": "click", "refScene": "MainScene", "refVO": "Map", "refEvent": "Click", "AddActionProperty": [{"name": "pos"}] });
	   if( this.mEventRegistry[ "contextMenu" ])
	      oTemp.push(  { "id": id + "2", "name": "contextMenu", "refScene": "MainScene", "refVO": "Map", "refEvent": "ContextMenu", "AddActionProperty": [{"name": "pos"}] });
	   if( this.mEventRegistry[ "drop" ])
	      oTemp.push(  { "id": id + "3", "name": "drop", "refScene": "MainScene", "refVO": "Map", "refEvent": "Drop", "AddActionProperty": [{"name": "pos"}] });
	   if( this.mEventRegistry[ "submit" ]) 
	      oTemp.push(  { "id": id + "4", "name": "zoomChanged", "refScene": "MainScene", "refVO": "Map", "refEvent": "ZoomChanged", "AddActionProperty": [{"name": "zoom"},{"name": "centerpoint"},{"name": "pos"}] });
	   if( this.mEventRegistry[ "submit" ]) 
	      oTemp.push(  { "id": id + "5", "name": "centerChanged", "refScene": "MainScene", "refVO": "Map", "refEvent": "CenterChanged", "AddActionProperty": [{"name": "zoom"},{"name": "centerpoint"},{"name": "pos"}] });
  }   
   return oTemp;
};

//...........................................................................//
// diagnostics...............................................................//

sap.ui.vbm.GeoMap.prototype.MinimizeApp = function( oApp )
{
   // todo: calculate a hash instead of caching the json string..............//

   // remove windows section when not necessary..............................//
   var t, s;
   s = null;
   if ( !this.m_bWindowsDirty )
      (t = oApp) && (t = t.SAPVB) && (t = t.Windows) && ( s = JSON.stringify( t ) ) && ( s == this.m_curWindows ) && (delete oApp.SAPVB.Windows) ||
      (this.m_curWindows = s ? s : this.m_curWindows);
   else
      this.m_bWindowsDirty = false;

   // remove unmodified scenes...............................................//
   s = null;
   (t = oApp) && (t = t.SAPVB) && (t = t.Scenes) && ( s = JSON.stringify( t ) ) && ( s == this.m_curScenes ) && ( delete oApp.SAPVB.Scenes) || 
   (this.m_curScenes = s ? s : this.m_curScenes);

   // remove unmodified actions..............................................//
   s = null;
   (t = oApp) && (t = t.SAPVB) && (t = t.Actions) && ( s = JSON.stringify( t ) ) && ( s == this.m_curActions ) && (delete oApp.SAPVB.Actions) ||
   (this.m_curActions = s ? s : this.m_curActions);

   // remove unmodified datatypes............................................//
   s = null;
   (t = oApp) && (t = t.SAPVB) && (t = t.DataTypes) && ( s = JSON.stringify( t ) ) && ( s == this.m_curDataTypes ) && (delete oApp.SAPVB.DataTypes) ||
   (this.m_curDataTypes = s ? s : this.m_curDataTypes);

   // remove unmodified data.................................................//
   s = null;
   (t = oApp) && (t = t.SAPVB) && (t = t.Data) && ( s = JSON.stringify( t ) ) && ( s == this.m_curData ) && (delete oApp.SAPVB.Data) ||
   (this.m_curData = s ? s : this.m_curData );

   return oApp;
};

//...........................................................................//
// helper functions..........................................................//

sap.ui.vbm.GeoMap.prototype.GetAggregatorContainer = function( id )
{
   // find the right aggregation instance to delegate the event..............//
   var aVO = this.getVos();
   if( !aVO || !aVO.length ) return;
   for( var nJ = 0, len = aVO.length; nJ < len; ++nJ )
   {
      if( aVO[nJ].sId == id )
         return aVO[nJ];
   }
   return null;
};


sap.ui.vbm.GeoMap.prototype.Update = function()
{
   // here we can check if we can remove parts of the update.................//
   var oApp = this.UpdateGeoMapData();

   // remove unnecessary sections............................................//
   return this.MinimizeApp( oApp );
};

sap.ui.vbm.GeoMap.prototype.UpdateGeoMapData = function()
{
   // get the frame application..............................................//
   var sPathApp = sap.ui.vbm.GeoMap.ApplicationURL ? sap.ui.vbm.GeoMap.ApplicationURL : sap.ui.resource( "sap.ui.vbm", sap.ui.vbm.GeoMap.DefaultApplicationURL );
   var oJSON = jQuery.sap.syncGetJSON( sPathApp );
   var oApp = oJSON.data; 

   // update the resource data...............................................//
   if( this.m_bResourcesDirty )
      this.UpdateResourceData( oApp );

   // update the vo data.....................................................//
   this.UpdateVOData( oApp );

   if( this.m_bMapConfigurationDirty )
      this.UpdateMapConfiguration( oApp );

   this.UpdateMapProviders( oApp );
   this.UpdateMapLayerStacks( oApp );
   this.UpdateWindows( oApp );
   
   //add non VO related actions
   if(oApp.SAPVB.Actions)
	   this.getActionArray( null, oApp.SAPVB.Actions.Set.Action);

   // return application object..............................................//
   return oApp;
};

sap.ui.vbm.GeoMap.prototype.UpdateMapProviders = function( oApp )
{
   if( !this.m_bMapProvidersDirty )
      delete oApp.SAPVB.MapProviders;      // remove MapProviders from app

   this.m_bMapProvidersDirty = false;
};

sap.ui.vbm.GeoMap.prototype.UpdateMapLayerStacks = function( oApp )
{
   if( !this.m_bMapLayerStacksDirty )     // remove MapLayerStacks from app
      delete oApp.SAPVB.MapLayerStacks;

   this.m_bMapLayerStacksDirty = false;
};

sap.ui.vbm.GeoMap.prototype.UpdateWindows = function( oApp )
{
   oApp.SAPVB.Windows = this.getWindowsObject();
};

sap.ui.vbm.GeoMap.prototype.UpdateMapConfiguration = function( oApp )
{
   if( !this.m_bMapConfigurationDirty )
      return;

   // reset dirty state......................................................//
   this.m_bMapConfigurationDirty = false;
   var aConfig = this.getMapConfiguration();

   // set the map providers
   if( aConfig )
   {
      oApp.SAPVB.MapProviders = { Set: { MapProvider: aConfig.MapProvider } };
      oApp.SAPVB.MapLayerStacks = { Set: { MapLayerStack: aConfig.MapLayerStacks } };
   }

   return;
};

sap.ui.vbm.GeoMap.prototype.UpdateResourceData = function( oApp )
{
   if( !this.m_bResourcesDirty )
      return;

   // reset dirty state......................................................//
   this.m_bResourcesDirty = false;
   var aRes = this.getResources();

   ((oApp.SAPVB.Resources = {}).Set = {}).Resource = [];

   // update function for delayed loaded resources...........................//
   function ResUpdate()
   {
      var oApp = this.Update();
      this.load( oApp );
   };

   // read the resources and update them.....................................//
   for( var nJ = 0, len = aRes.length; nJ < len; ++nJ )
   {
      // get the control.....................................................//
      var res = aRes[nJ];
      
      // load the data from an url, when done we replace the value...........//
      if( !res.mProperties.value && res.mProperties.src )
      {
         var canvas = document.createElement('myCanvas');
         var img = document.createElement('img');
         res.m_Img = img; 

         // image load callback..............................................//
         var funcLoaded = function( res ) 
         {
            var canvas = document.createElement('canvas');
            canvas.width = res.m_Img.width; 
            canvas.height = res.m_Img.height;
            var context = canvas.getContext('2d');
            context.drawImage( res.m_Img, 0, 0 );
            res.mProperties.value = canvas.toDataURL(); 
            delete res.m_Img; 
            // mark resources as dirty and apply them again..................//
            this.m_bResourcesDirty = true;
            window.setTimeout( ResUpdate.bind( this ), 10 );
         };

         img.onload = funcLoaded.bind( this, res );
         // we set the data url..............................................//
         img.src = res.mProperties.src;
      } else
      // when a name is specified, use it. In all other cases use id.........//
      oApp.SAPVB.Resources.Set.Resource.push( { "name": ( res.mProperties.name ? res.mProperties.name : res.sId ), "value" : res.mProperties.value } );
   }

   return;
};

sap.ui.vbm.GeoMap.prototype.UpdateVOData = function( oApp )
{
   // reset dirty state......................................................//
   this.m_bVosDirty = false;
   var aVO = this.getVos();  // mAggregations.vos;

   // process visual objects.................................................//
   // we collect the different array from the vo instances...................//

   var saVO = [];       // visual object array in the scene..................//
   var saData = [];     // data array in the data section....................//
   var saType = [];     // type array in the type section ...................//
   var saAction = [];   // actions...........................................//

   for( var nJ = 0, len = aVO.length; nJ < len; ++nJ )
   {
      // get the control.....................................................//
      var oControl = aVO[nJ];

      // add the control object description..................................//
      saVO.push( this.getTemplateObject( oControl ) );
      saData.push( this.getDataObject( oControl ) );      
      saType.push( this.getTypeObject( oControl ) );
      saAction = this.getActionArray( oControl, saAction );
   }

   // process legend.........................................................//
   var oLegend = this.getLegend();
   if( oLegend )
   {
      saData.push( this.getDataObject( oLegend, true ) );
      saType.push( this.getTypeObject( oLegend, true ) );
   }

   // check if an update of the scene is necessary...........................//
   // failsafe but data has to be created first..............................//
   var bMetaUpdate = ( !this.m_saVO || !( JSON.stringify(this.m_saVO) === JSON.stringify(saVO) ) ) ? true : false;
   this.m_saVO = saVO;   

   // now we should have data, data types and instance information...........//
   // merge it into the app..................................................//

   ((oApp.SAPVB.Data = {}).Set = {}).N = saData;
   bMetaUpdate && ( ((oApp.SAPVB.DataTypes = {}).Set = {}).N = saType );
   bMetaUpdate && ( ((oApp.SAPVB.Actions = {}).Set = {}).Action = saAction );

   // todo: initial zoom position should be configurable 
   bMetaUpdate && ( (((oApp.SAPVB.Scenes = {}).Set = {}).SceneGeo = { "id": "MainScene", "refMapLayerStack": "Default", "initialZoom": "2", }).VO = saVO );

};

sap.ui.vbm.GeoMap.prototype.invalidate = function( oSource )
{
   // set the vos dirty state when the aggregations have changed
   if( oSource instanceof sap.ui.vbm.Areas ||
       oSource instanceof sap.ui.vbm.Boxes ||
       oSource instanceof sap.ui.vbm.Circles ||
       oSource instanceof sap.ui.vbm.Containers ||
       oSource instanceof sap.ui.vbm.GeoCircles ||
       oSource instanceof sap.ui.vbm.Pies ||
       oSource instanceof sap.ui.vbm.Routes ||
       oSource instanceof sap.ui.vbm.Spots ) 
      {
           this.m_bLegendDirty = true;
            this.m_bVosDirty = true;
      }

   if( oSource instanceof sap.ui.vbm.Legend )
   {
      this.m_bLegendDirty = true;
        this.m_bVosDirty = true;
   }

   sap.ui.core.Control.prototype.invalidate.apply( this, arguments );
};

sap.ui.vbm.GeoMap.prototype.openContextMenu = function( typ, inst, menu )
{
   if ( menu && menu.vbi_data && menu.vbi_data.VBIName  == "DynContextMenu")
   {
      if( !this.m_VBIContext.m_Menus )
         this.m_VBIContext.m_Menus = new window.VBI.Menus();
      this.m_VBIContext.m_Menus.m_menus.push( menu );
      var oAutomation = {

            "SAPVB":{  
               "version":"2.0",
               "Automation":{  
                  "Call":{  
                     "earliest":"0",
                     "handler":"CONTEXTMENUHANDLER",
                     "instance": inst.sId,
                     "name":"SHOW",
                     "object":typ,
                     "refID":"CTM",
                     "Param":[  
                              {  
                                 "name":"x",
                                 "#":inst.mClickPos[0]
                              },
                              {  
                                 "name":"y",
                                 "#":inst.mClickPos[1]
                              },
                              {  
                                 "name":"scene",
                                 "#":"MainScene"
                              }
                              ]
                  }
               }      
            }   
      }
      this.loadHtml( oAutomation );
   }
};
