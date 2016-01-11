/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.AnalyticMap.
jQuery.sap.declare("sap.ui.vbm.AnalyticMap");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.vbm.GeoMap");


/**
 * Constructor for a new AnalyticMap.
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
 * <li>{@link #getLegendVisible legendVisible} : boolean (default: true)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getRegions regions} : sap.ui.vbm.Region[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.AnalyticMap#event:regionClick regionClick} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.AnalyticMap#event:regionContextMenu regionContextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.ui.vbm.GeoMap#constructor sap.ui.vbm.GeoMap}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * The AnalyticMap control.
 * @extends sap.ui.vbm.GeoMap
 *
 * @author SAP AG
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.AnalyticMap
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.vbm.GeoMap.extend("sap.ui.vbm.AnalyticMap", { metadata : {

	publicMethods : [
		// methods
		"zoomToRegions", "getRegionsInfo"
	],
	library : "sap.ui.vbm",
	properties : {
		"legendVisible" : {type : "boolean", group : "Misc", defaultValue : true}
	},
	aggregations : {
		"regions" : {type : "sap.ui.vbm.Region", multiple : true, singularName : "region"}
	},
	events : {
		"regionClick" : {}, 
		"regionContextMenu" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.AnalyticMap with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.AnalyticMap.extend
 * @function
 */

sap.ui.vbm.AnalyticMap.M_EVENTS = {'regionClick':'regionClick','regionContextMenu':'regionContextMenu'};


/**
 * Getter for property <code>legendVisible</code>.
 * not yet supported
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>legendVisible</code>
 * @public
 * @name sap.ui.vbm.AnalyticMap#getLegendVisible
 * @function
 */

/**
 * Setter for property <code>legendVisible</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bLegendVisible  new value for property <code>legendVisible</code>
 * @return {sap.ui.vbm.AnalyticMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.AnalyticMap#setLegendVisible
 * @function
 */


/**
 * Getter for aggregation <code>regions</code>.<br/>
 * Region properties that are different from the defaults. It is possible to specify the tooltip or color for regions. A region code must match the GeoJSON id2 identifier.
 * 
 * @return {sap.ui.vbm.Region[]}
 * @public
 * @name sap.ui.vbm.AnalyticMap#getRegions
 * @function
 */


/**
 * Inserts a region into the aggregation named <code>regions</code>.
 *
 * @param {sap.ui.vbm.Region}
 *          oRegion the region to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the region should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the region is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the region is inserted at 
 *             the last position        
 * @return {sap.ui.vbm.AnalyticMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.AnalyticMap#insertRegion
 * @function
 */

/**
 * Adds some region <code>oRegion</code> 
 * to the aggregation named <code>regions</code>.
 *
 * @param {sap.ui.vbm.Region}
 *            oRegion the region to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.AnalyticMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.AnalyticMap#addRegion
 * @function
 */

/**
 * Removes an region from the aggregation named <code>regions</code>.
 *
 * @param {int | string | sap.ui.vbm.Region} vRegion the region to remove or its index or id
 * @return {sap.ui.vbm.Region} the removed region or null
 * @public
 * @name sap.ui.vbm.AnalyticMap#removeRegion
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>regions</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.Region[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.AnalyticMap#removeAllRegions
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.vbm.Region</code> in the aggregation named <code>regions</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.vbm.Region}
 *            oRegion the region whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ui.vbm.AnalyticMap#indexOfRegion
 * @function
 */
	

/**
 * Destroys all the regions in the aggregation 
 * named <code>regions</code>.
 * @return {sap.ui.vbm.AnalyticMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.AnalyticMap#destroyRegions
 * @function
 */


/**
 * The event is raised when there is a click or a tap on a region.
 *
 * @name sap.ui.vbm.AnalyticMap#regionClick
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {string} oControlEvent.getParameters.code The regions code.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'regionClick' event of this <code>sap.ui.vbm.AnalyticMap</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.AnalyticMap</code>.<br/> itself. 
 *  
 * The event is raised when there is a click or a tap on a region.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.AnalyticMap</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.AnalyticMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.AnalyticMap#attachRegionClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'regionClick' event of this <code>sap.ui.vbm.AnalyticMap</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.AnalyticMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.AnalyticMap#detachRegionClick
 * @function
 */

/**
 * Fire event regionClick to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'code' of type <code>string</code> The regions code.</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.AnalyticMap} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.AnalyticMap#fireRegionClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on a region.
 *
 * @name sap.ui.vbm.AnalyticMap#regionContextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {string} oControlEvent.getParameters.code The regions code.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'regionContextMenu' event of this <code>sap.ui.vbm.AnalyticMap</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.AnalyticMap</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on a region.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.AnalyticMap</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.AnalyticMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.AnalyticMap#attachRegionContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'regionContextMenu' event of this <code>sap.ui.vbm.AnalyticMap</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.AnalyticMap} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.AnalyticMap#detachRegionContextMenu
 * @function
 */

/**
 * Fire event regionContextMenu to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'code' of type <code>string</code> The regions code.</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.AnalyticMap} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.AnalyticMap#fireRegionContextMenu
 * @function
 */


/**
 * Zoom to one ore more regions.
 *
 * @name sap.ui.vbm.AnalyticMap#zoomToRegions
 * @function
 * @param {string[]} aCodes
 *         Array of region codes. The region codes must match the geo json tags.
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Returns Infos for Regions like name, bounding box and midpoint
 *
 * @name sap.ui.vbm.AnalyticMap#getRegionsInfo
 * @function
 * @param {string[]} aCodes
 *         Array of region codes. The region code must match the geo json tag.
 * @type object
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/ui/vbm/AnalyticMap.js
//...........................................................................//
// global usages.............................................................//
//...........................................................................//

/*global URI *///declare unusual global vars for JSLint/SAPUI5

// Author: Ulrich Roegelein

//...........................................................................//
// Static Configuration......................................................//
//...........................................................................//

// on abap systems the GeoJSON is requested from this handler................//
sap.ui.vbm.AnalyticMap.DefaultABAPGeoJSONURL = "/sap/bc/vbi/geojson/L0.json";
sap.ui.vbm.AnalyticMap.DefaultGeoJSONURL = "media/analyticmap/L0.json";
sap.ui.vbm.AnalyticMap.DefaultRegionColor = "RGB(213,218,221)"; 
sap.ui.vbm.AnalyticMap.DefaultRegionColorBorder = "RGB(255,255,255)";

// Load theming support 
jQuery.sap.require("sap.ui.core.theming.Parameters");

//...........................................................................//
// This section defines behavior for the control,............................//
//...........................................................................//

sap.ui.vbm.AnalyticMap.prototype.exit = function()
{
   sap.ui.vbm.GeoMap.prototype.exit.apply( this, arguments );

   // detach the event.......................................................//
   this.detachEvent('submit', sap.ui.vbm.AnalyticMap.prototype.onAnalyticsSubmit, this );
};

sap.ui.vbm.AnalyticMap.prototype.resize = function( event )
{
   sap.ui.vbm.GeoMap.prototype.resize.apply( this, arguments );
};

sap.ui.vbm.AnalyticMap.prototype.onAfterRendering = function()
{
   sap.ui.vbm.VBI.prototype.onAfterRendering.apply( this, arguments );
};

// changes in regions........................................................//

sap.ui.vbm.AnalyticMap.prototype.destroyRegions = function()
{
   this.m_bRegionsDirty = true;
   this.destroyAggregation( "regions" );
};

sap.ui.vbm.AnalyticMap.prototype.addRegion = function( o )
{
   this.m_bRegionsDirty = true;
   this.addAggregation( "regions", o );
};

sap.ui.vbm.AnalyticMap.prototype.removeRegion = function( o )
{
   this.m_bRegionsDirty = true;
   this.removeAggregation( "regions" );
};

sap.ui.vbm.AnalyticMap.prototype.removeAllRegions = function( o )
{
   this.m_bRegionsDirty = true;
   this.removeAllAggregation( "regions" );
};

//changes in legend..........................................................//

sap.ui.vbm.AnalyticMap.prototype.destroyLegend = function()
{
   this.m_bLegendDirty = true;
   this.destroyAggregation( "legend" );
};

sap.ui.vbm.AnalyticMap.prototype.setLegend = function( o )
{
   this.m_bLegendDirty = true;
   this.setAggregation( "legend", o );
};

sap.ui.vbm.AnalyticMap.prototype.onAnalyticsSubmit = function( e )
{
   // analyze the event......................................................//
   var datEvent = JSON.parse( e.mParameters.data );

   // when clicking a region, the key is provided in the instance parameter..//
   // when there are multipolygon regions, the key is enriched by an index...//
   
   var oParams, o, code, len = "Regions".length;

   // fire the events........................................................//
   switch( datEvent.Action.name )
   {
      case "RGN_CONTEXTMENU":
         code = datEvent.Action.instance.slice( len+1, len+3 );
         oParams =  { code:  code };
         if( o = this.FindRegionInAggregation( code ) )
            o.fireContextMenu( oParams );

         this.fireRegionContextMenu( oParams );
         break;
      case "RGN_CLICK":
         code = datEvent.Action.instance.slice( len+1, len+3 );
         oParams =  { code:  code };
         if( o = this.FindRegionInAggregation( code ) )
            o.fireClick( oParams );
         this.fireRegionClick( oParams );
         break;
   };
};

sap.ui.vbm.AnalyticMap.prototype.init = function()
{
   // call base class first.................................................//
   sap.ui.vbm.GeoMap.prototype.init.apply( this, arguments );

   // initially we set the dirty states.....................................//
   this.m_bRegionsDirty = false;
   this.m_bLegendDirty = false;
   
   // indicate that theming is not applied
   this.m_bThemingDirty = true;

   // attach the event
   this.attachEvent('submit', sap.ui.vbm.AnalyticMap.prototype.onAnalyticsSubmit, this ); 
  
   var oApp = this.CreateRegions();
};

sap.ui.vbm.AnalyticMap.prototype.CreateRegions = function()
{
   // set some default colors
   var colC = this.m_ColC = sap.ui.vbm.AnalyticMap.DefaultRegionColor;
   var colCB = this.m_ColCB = sap.ui.vbm.AnalyticMap.DefaultRegionColorBorder;

   // set dirty flag for countries...........................................//

   // get the setter for regions.............................................//
   this.m_oSetRegions = {
         "SAPVB": {
            "Data": {
               "Set":
                  [ {
                          "type": "N",
                          "name": "Regions",
                          "N": {
                             "name":"Regions",
                             "E": []
                           }
                       }
                  ]
               }
            }
      };

   // region constructor.....................................................//
   function Region( id, array, type, color, colorBorder, tooltip, entity )
   {
      this.K = id;
      this.P = "";
      this.T = tooltip;
      this.C = color;
      this.CB = colorBorder;
      this.G = entity;

      for( var nJ = 0, alen = array.length; nJ < alen; ++nJ )
      {
         if( nJ )
            this.P += ";";
            this.P += array[nJ];
      }
   };

   // the constructor needs to be removed, when it is not removed the jquery.//
   // cloning will not work..................................................//
   delete Region.prototype.constructor;

   //........................................................................//
   // load the geojson trying different location.............................//
   // first the explicit path, second abap third the default.................//

   var oData = null, sPathGeoJSON = null;

   // explicit specified.....................................................//
   sPathGeoJSON = sap.ui.vbm.AnalyticMap.GeoJSONURL;
   if( !oData && sPathGeoJSON )
      oData = jQuery.sap.syncGetJSON( sPathGeoJSON ).data;
      
   // abap system............................................................//
   sPathGeoJSON = sap.ui.vbm.AnalyticMap.DefaultABAPGeoJSONURL;
   if( !oData && sap.ui.vbm.AnalyticMap.DefaultABAPGeoJSONURL )
   {
      // append the language parameter to the uri............................//
      var uri = URI( sPathGeoJSON );
      uri.addQuery( "sap-language", sap.ui.getCore().getConfiguration().getLanguage() );
      oData = jQuery.sap.syncGetJSON( sPathGeoJSON = uri.toString() ).data;
   }
   
   // default path...........................................................//
   sPathGeoJSON = sap.ui.resource( "sap.ui.vbm", sap.ui.vbm.AnalyticMap.DefaultGeoJSONURL );
   if( !oData && sPathGeoJSON )      
      oData = jQuery.sap.syncGetJSON( sPathGeoJSON ).data;

   // verify that the json at the specified location was loaded..............//
   if( !oData )
   { 
      alert( "The path or the GeoJSON file at location " + sPathGeoJSON + " or " + sap.ui.vbm.AnalyticMap.DefaultABAPGeoJSONURL + " is invalid.\r\nPlease contact your Administrator." );
      return; 
   }
   
   // load the data with the default settings................................//
   var E = this.m_oSetRegions.SAPVB.Data.Set[0].N.E = [];
   this.m_RegionApplicationTable = E;

   this.m_RegionBox = [];  // region box 
   this.m_Names = [];      // array of names
   this.m_Properties = []; // array of properties
   var minX, maxX, minY, maxY;

   var va, xa, af = oData.features, tt = '';
   for( var nJ = 0, aflen = af.length; nJ < aflen; ++nJ )
   {
      va = [];
      var f = af[nJ];

      // skip the Antarctica.................................................//
      if( f.id2 == "AQ" )  
         continue;


      // get the name of the fragment........................................//
      tt = ( f.properties && f.properties.name ) ? f.properties.name : "";
      this.m_Names[f.id2] = tt;
      this.m_Properties[f.id2] = f.properties;
      
      switch( f.geometry.type )
      {
         case "Polygon":
            minY = Number.MAX_VALUE; maxY = -Number.MAX_VALUE;
            minX = Number.MAX_VALUE; maxX = -Number.MAX_VALUE;

            // null'th element
            var acn = f.geometry.coordinates[0];

            // create the vbi float array for regions
            for( var nK = 0, acnlen = acn.length, tmp, x, y; nK < acnlen; ++nK )
            {
               // do min max detection.......................................//
               tmp = acn[ nK ];
               if( ( x = tmp[0] ) < minX ) minX = x;
               if( x > maxX ) maxX = x;
               if( ( y = tmp[1] ) < minY ) minY = y;
               if( y > maxY ) maxY = y;

               va.push( x, y, "0" );
            }

            E.push( new Region( f.id2, va, f.geometry.type, colC, colCB, tt, f.id2 ) );
            this.m_RegionBox[ f.id2 ] = [ minX, maxX, minY, maxY ];
            break;

         case "MultiPolygon":
            xa = [];
            for( var nL = 0, acmlen = f.geometry.coordinates.length, tmp; nL < acmlen; ++nL )
            {
               minY = Number.MAX_VALUE; maxY = -Number.MAX_VALUE;             
               minX = Number.MAX_VALUE; maxX = -Number.MAX_VALUE;
               var acn = f.geometry.coordinates[nL][0];

               // create the vbi float array for regions.....................//
               va = [];
               for( var nK = 0, acnlen = acn.length, x, y; nK < acnlen; ++nK )
               {
                  tmp = acn[ nK ];

                  // do min max detection....................................//
                  tmp = acn[ nK ];
                  if( ( x = tmp[0] ) < minX ) minX = x;
                  if( x > maxX ) maxX = x;
                  if( ( y = tmp[1] ) < minY ) minY = y;
                  if( y > maxY ) maxY = y;

                  va.push( x, y, "0" );
               }
               xa.push( [ minX, maxX, minY, maxY ] );
               E.push( new Region( f.id2 + "_" + nL, va, f.geometry.type, colC, colCB,  tt, f.id2 ) );
            }
            this.m_RegionBox[ f.id2 ] = window.VBI.MathLib.GetSurroundingBox(xa);
            break;
         case "Point":
            break;
         default:
            break;
      }

      // store minmax values.................................................//
      //this.m_RegionBox[ f.id2 ] = [ minX, maxX, minY, maxY ];
   }


   // load the data context..................................................//
   return this.m_oSetRegions;
};

//...........................................................................//
// helper functions for analytic content.....................................//

sap.ui.vbm.AnalyticMap.prototype.getAnalyticTemplateObject = function()
{
   return {
      "id": "Region",
      "type": "{00100000-2012-0004-B001-F311DE491C77}",
      "entity.bind": "Regions.Entity",
      "datasource": "Regions",
      "posarray.bind": "Regions.PosList",
      "color.bind": "Regions.Color",
      "colorBorder.bind": "Regions.BorderColor",
      "tooltip.bind": "Regions.ToolTip",
      "hotDeltaColor" : "RGBA(240,171,0,128)"
   };
};

sap.ui.vbm.AnalyticMap.prototype.getAnalyticTypeObject = function()
{
   return {
      "name": "Regions",
      "key": "Key",
      "A": [
         {
            "name": "Key",
            "alias": "K",
            "type": "string"
         },
         {
            "name": "PosList",
            "alias": "P",
            "type": "vectorarray"
         },
         {
            "name": "ToolTip",
            "alias": "T",
            "type": "string"
         },
         {
            "name": "Color",
            "alias": "C",
            "type": "color"
         },
         {
            "name": "BorderColor",
            "alias": "CB",
            "type": "color"
         },
         {
            "name": "Entity",
            "alias": "G",
            "type": "string"
         }
      ]
   };
};

sap.ui.vbm.AnalyticMap.prototype.getAnalyticDataObject = function()
{
   // apply the region properties to the vbi datacontext.....................//
   // do a real clone of the original data, to be able to handle complete....//
   // model changes..........................................................//

   var ct = [];
   jQuery.extend( true, ct, this.m_RegionApplicationTable );

   if( !ct ) return; // return immediately when no regions are available.....//

   // create lookup for modified properties..................................//
   var propMap = [];
   var aCP = this.getRegions();
   for( var nJ = 0, len = aCP ? aCP.length : 0, item; nJ < len; ++nJ )
   {
      item = aCP[nJ];
      propMap[ item.mProperties.code ] = item;
   }

   // check if the data is already loaded....................................//
   var bLoaded = false; // ( this.m_aLoadQueue && this.m_aLoadQueue.length ) ? false : true;

   // iterate over region tables.............................................//
   for( var nJ = 0, len = ct.length, cprop, item, tmp; nJ < len; ++nJ )
   {
      item = ct[ nJ ];

      // remove position vector when queues are already processed............//
      // to reduce load, in all other cases we can modify the existing load..//
      // data................................................................//

      if( bLoaded )
         if( item.P ) delete item.P; 
      
      if( cprop = propMap[ item.K.slice( 0, 2) ] )
      {
         // item found, apply properties.....................................//
         if( tmp = cprop.mProperties.color )
         {
            var c;
            // currently only rgba is supported..............................//
            if( c = /^rgba\(([\d]+)[,;]([\d]+)[,;]([\d]+)[,;]([\d]+|[\d]*.[\d]+)\)/.exec( tmp ) )
               item.C = "RGBA("+c[1]+","+c[2]+","+c[3]+","+ parseInt( c[4]*255 )+")";
         }
         if( tmp = cprop.getTooltip() )
            item.T = tmp;
      }
   }

   return {
            "name": "Regions",
            "type": "N",
            "E": ct
      };
};


sap.ui.vbm.AnalyticMap.prototype.getAnalyticActionArray = function( aActions )
{
   var id = this.getId();

   // check if the different vo events are registered........................//
   aActions.push(  { "id": id + "1", "name": "RGN_CLICK", "refScene": "MainScene", "refVO": "Region", "refEvent": "Click" } );
   aActions.push(  { "id": id + "2", "name": "RGN_CONTEXTMENU", "refScene": "MainScene", "refVO": "Region", "refEvent": "ContextMenu" } );

   return aActions;
};

//...........................................................................//
// helper functions..........................................................//

sap.ui.vbm.AnalyticMap.prototype.FindRegionInAggregation = function( code )
{
   var aCP = this.getRegions();
   if( aCP )
   {
      for( var nJ = 0, len = aCP.length; nJ < len; ++nJ )
         if( aCP[nJ].mProperties.code == code ) return aCP[nJ];
   }
   return null;
};

sap.ui.vbm.AnalyticMap.prototype.Update = function()
{
   var oApp = this.UpdateAnalyticMap();
   
   // remove unnecessary parts from app.....................................//
   return this.MinimizeApp( oApp );
};

sap.ui.vbm.AnalyticMap.prototype.UpdateAnalyticMap = function()
{
   // call base class first.................................................//
   var oGeoMapData = sap.ui.vbm.GeoMap.prototype.UpdateGeoMapData.apply( this, arguments );
   
   if ( this.m_bThemingDirty)
	   this.applyTheming(this.m_RegionApplicationTable);   

   // get analytics specific data...........................................//
   var otO = this.getAnalyticTemplateObject();    // template object
   var otT = this.getAnalyticTypeObject();        // template type
   var oDO = this.getAnalyticDataObject();        // data object containing colors

   // here we insert the static analytic info into the geomap data..........//
   var t;
   // insert vo
   ( t = oGeoMapData ) && (t = t.SAPVB) && (t = t.Scenes) && (t = t.Set) && (t = t.SceneGeo ) && ( t = t.VO ) && t.splice( 0, 0, otO );
   // insert type
   ( t = oGeoMapData ) && (t = t.SAPVB) && (t = t.DataTypes) && (t = t.Set) && (t = t.N ) && t.splice( 0, 0, otT );
   // insert actions	
   ( t = oGeoMapData ) && (t = t.SAPVB) && (t = t.Actions) && (t = t.Set) && (t = t.Action) && this.getAnalyticActionArray( t );

   // insert data
   if( oDO )
      ( t = oGeoMapData ) && (t = t.SAPVB) && (t = t.Data || (t.Data= {}) ) && (t = t.Set || (t.Set= {}) ) && (t = t.N || ( t.N=[] ) ) && t.splice( 0, 0, oDO );

   // when no map configuraton is set we remove it because the default......//
   // of the geomap should not be used......................................//
   if( !this.getMapConfiguration() )
      (t = oGeoMapData ) && (t = t.SAPVB) && (t = t.Scenes) && (t = t.Set) && (t = t.SceneGeo ) && ( t.refMapLayerStack ) && ( t.refMapLayerStack = "" );	
   
   return oGeoMapData;
};

sap.ui.vbm.AnalyticMap.prototype.invalidate = function(oSource){
   // set the regions dirty state when a property has changed in the region..//
   if(oSource instanceof sap.ui.vbm.Region)
      this.m_bRegionsDirty = true;

   // call base class........................................................//
   sap.ui.vbm.GeoMap.prototype.invalidate.apply( this, arguments );
};

sap.ui.vbm.AnalyticMap.prototype.zoomToRegions = function( codes, corr )
{
   if (corr == undefined)
      corr = 0.9999;

   // get the bounding box around............................................//
   var areaList = [];

   // get the min max values from the region boxes...........................//
   for( var nJ = 0, len = codes.length; nJ < len; ++nJ )
   {
      var rb = this.m_RegionBox[ codes[nJ] ];
      if (rb != undefined)
         areaList.push( rb );
   }

   // return immediately when no bounds found................................//
   if( !areaList.length )  
      return;

   // the project must be loaded already.....................................//
   var scene = null;
   if( scene = this.m_VBIContext.GetMainScene() )
         scene.ZoomToAreas( areaList, corr ) ;
};

sap.ui.vbm.AnalyticMap.prototype.getRegionsInfo = function(codes) {
	// var result = {};
	var result = [];
	var code, BBox;
	for( var nJ = 0, len = codes.length; nJ < len; ++nJ ){
	//for( var code in codes ){
		code = codes[nJ];
		result[code] = {};
		result[code].BBox = this.m_RegionBox[code];
		result[code].Midpoint =   [ ( this.m_RegionBox[code][0] + this.m_RegionBox[code][1] )/2,
		                          ( this.m_RegionBox[code][2] + this.m_RegionBox[code][3] )/2 ]; 
		result[code].Name = this.m_Names[code];
		result[code].Properties = this.m_Properties[code];
	}
	return result;
};

sap.ui.vbm.AnalyticMap.prototype.onThemeChanged = function(oEvent) {
	// suppose colors have changed
	this.m_bThemingDirty = true;
	this.invalidate();
};

sap.ui.vbm.AnalyticMap.prototype.applyTheming = function(aRegions) {
	if(sap.ui.core.theming && sap.ui.core.theming.Parameters) { //only if theming parameters are available
		var sColC = sap.ui.vbm.AnalyticMap.DefaultRegionColor = sap.ui.core.theming.Parameters.get("sapUiChartPaletteSequentialNeutralLight3");
		var sColCB = sap.ui.vbm.AnalyticMap.DefaultRegionColorBorder = sap.ui.core.theming.Parameters.get("sapUiChartBackgroundColor");
		if ( this.getPlugin() ) { //plug-in mode -> make sure color format matches plugin requirements
			var aCol = window.VBI.Types.string2rgba( sColC );
			sColC = aCol[4] === 1 ? "RGBA(" + aCol[0] + ";" + aCol[1] + ";" + aCol[2] + ";" + parseInt(aCol[3] * 255) + ")" : "RGB(" + aCol[0] + ";" + aCol[1] + ";" + aCol[2] + ")"; 
			aCol = window.VBI.Types.string2rgba( sColCB );
			sColCB = aCol[4] === 1 ? "RGBA(" + aCol[0] + ";" + aCol[1] + ";" + aCol[2] + ";" + parseInt(aCol[3] * 255) + ")" : "RGB(" + aCol[0] + ";" + aCol[1] + ";" + aCol[2] + ")";  			
		}		
		if (sColC != this.m_ColC || sColCB != this.m_ColCB) {
			// apply new colors colors
			for (var i = 0; i < aRegions.length; ++i) {
				//Note: Only change default colors
				if (aRegions[i].C === this.m_ColC) aRegions[i].C = sColC;
				if (aRegions[i].CB === this.m_ColCB) aRegions[i].CB = sColCB;
			}
			// remember new default colors
			this.m_ColC = sColC;
			this.m_ColCB = sColCB;
		}
		this.m_bThemingDirty = false;
	}
};
