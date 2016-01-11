﻿//...........................................................................//
// this module does the vbicontext handling..................................//

// Author: Ulrich Roegelein

//...........................................................................//
// the scene manager manages the scene instances in a component context......//

VBI.VBIContext = function( control )
{
   var vbcx = {};
   vbcx.vbiclass = "VBIContext";

   vbcx.m_bLoaded = false;
   vbcx.m_Resources = null;
   vbcx.m_Config = null;
   vbcx.m_DataTypeProvider = null;
   vbcx.m_DataProvider = null;
   vbcx.m_SceneManager = null;
   vbcx.m_MapProviders = null;
   vbcx.m_MapLayerStackManager = null;
   vbcx.m_Windows = null;
   vbcx.m_Actions = null;
   vbcx.m_Automations = null;
   vbcx.m_Menus = null;
   vbcx.m_Control = control;

   var now = new Date();
   vbcx.m_StartupTime = now.getTime();

   vbcx.clear = function()
   {
      // reset back reference................................................//
      vbcx.m_Control = null;

      // clear inner objects.................................................//
      if( vbcx.m_Resources ) vbcx.m_Resources.clear();
      if( vbcx.m_Config ) vbcx.m_Config.clear();
      if( vbcx.m_DataTypeProvider ) vbcx.m_DataTypeProvider.clear();
      if( vbcx.m_DataProvider ) vbcx.m_DataProvider.clear();
      if( vbcx.m_SceneManager ) vbcx.m_SceneManager.clear();
      if( vbcx.m_MapProviders ) vbcx.m_MapProviders.clear();
      if( vbcx.m_MapLayerStackManager ) vbcx.m_MapLayerStackManager.clear();
      if( vbcx.m_Windows ) vbcx.m_Windows.clear();
      if( vbcx.m_Actions ) vbcx.m_Actions.clear();
      if( vbcx.m_Automations ) vbcx.m_Automations.clear();
      if( vbcx.m_Menus ) vbcx.m_Menus.clear();

      // todo: reset inner references........................................//
      vbcx.m_Resources = null;
      vbcx.m_Config = null;
      vbcx.m_DataTypeProvider = null;
      vbcx.m_DataProvider = null;
      vbcx.m_SceneManager = null;
      vbcx.m_MapProviders = null;
      vbcx.m_MapLayerStackManager = null;
      vbcx.m_Windows = null;
      vbcx.m_Actions = null;
      vbcx.m_Automations = null;
      vbcx.m_Menus = null;
   };

   // helper functions.......................................................//
   vbcx.GetResources = function()
   {
      var oRes;
      if( oRes = vbcx.m_Resources )
         return oRes;

      return ( vbcx.m_Resources = new VBI.Resources() );
   };
   
   vbcx.GetConfig = function()
   {
      var oConfig;
      if( oConfig = vbcx.m_Config )
         return oConfig;

      return ( vbcx.m_Config = new VBI.Configurations() );
   };

   vbcx.GetMainScene = function() 
   {
      // the main scene is the one that is displayed in the main window......//
      if( vbcx.m_Windows )
      {
         var wnd = null;
         if( wnd = vbcx.m_Windows.GetMainWindow() )
         {
            var scene = null;
            if( scene = wnd.GetScene() )
               return scene;
         }
      }         
      
      return null;   // no scene available...................................//
   };

   vbcx.FireAction = function( action, scene, vo, de, params, instanceDirect )
   {
      // fire the submit data................................................//
      // todo: create the xml or json dependent, on the subscription.........//
      // and fire the submit event, providing a valid json/xml string........//

      // the vo can be a string or an object.................................//
      // usually when the event is fired by the map, a string is specified...//
      var id = null;
      if( jQuery.type( vo ) == 'object' )
         id = vo.m_ID;
      else
      if( jQuery.type( vo ) == 'string' )
         id = vo;

      // create a new json object and fill it with data......................//         

      var o = {};
      var oRoot = ( o["SAPVB"] = {} );
      oRoot["version"] = "2.0";
      oRoot["xmlns:VB"] = "VB";

      // store action........................................................//
      var oAction = ( oRoot["Action"] = {} );
      oAction.name = action.m_name;       // name of action 
      oAction.object = id;                // id of the vo
      oAction.id = action.m_id;           // id of the action

      // add the instance information to the event...........................//
      if (instanceDirect != undefined)
         oAction.instance = instanceDirect;
      else
         if ( de )  oAction.instance = de.GetPath();

      // event coordinates...................................................//
      // these are needed for the additional properties......................//
      var x = 0.0;
      var y = 0.0;
      var bMousePosAvailable = false;

      // add the parameters..................................................//
      if( params )
      {
         oAction.Params = {};
         oAction.Params.Param = [];

         // add the attributes and put them into an array....................//
         for( var a in params )
         { 
            var tmp = {};
            tmp["name"] = a;
            tmp["#"] = params[ a ];
            oAction.Params.Param.push( tmp );

            // get the coordinates from the parameters.......................//
            if( a == 'x' ) {
            	x = params[ a ];
            	bMousePosAvailable = true;
            }
            if( a == 'y' ){
            	y = params[ a ];
            	bMousePosAvailable = true;
            }
         }
      }

      // add modified datacontext data.......................................//
      if( vbcx.m_DataProvider )
         vbcx.m_DataProvider.store( oRoot );

      // add additional properties, this is done to be compatible to the c++.//
      // implementation......................................................//

      var len;
      if( action.m_additionalProperties && ( len = action.m_additionalProperties.length ) )
      {
         var apo = oAction.AddActionProperties = {};  // action properties object
         var apa = apo.AddActionProperty = [];        // action property array

         for( var nJ = 0; nJ < len; ++nJ )
         {
            var pos;
            switch( action.m_additionalProperties[nJ] )
            {
               case 'zoom':
                  // add the current zoom level..............................//
                  apa.push( { name: 'zoom', '#': scene.GetCurrentZoomlevel().toString()  } );
                  break;
               case 'centerpoint': 
                  // add the center position.................................//
                  pos = VBI.MathLib.RadToDeg( scene.GetCenterPos() );
                  apa.push( { name: 'centerpoint', '#': pos[0].toString() + ';' + pos[1].toString() + ';0.0' } );
                  break;
               case 'clustercount': 
                   // add the count of objects inside the cluster............//
            	   clusterGroups = scene.m_PreassembledData;
            	   cluster = clusterGroups[vo.m_nPreDataIndex];
            	   clusteredObjects = vo.m_HotClusterVO.cobjs;
                   apa.push( { name: 'clustercount', '#': vo.m_HotClusterVO.ct } );
                   break;
               case 'pos':
                  // add the current click position..........................//
            	  if (bMousePosAvailable){
                      pos = scene.GetPosFromVPPoint( [ x, y, 0 ] );
                      apa.push( { name: 'pos', '#': pos[0].toString() + ';' + pos[1].toString() + ';0.0' } );
            	  } 
                  break;
               case 'pitch':
                  // pitch is always 0 in flat scenes........................//               
                  apa.push( { name: 'pitch', '#': '0.0' } );
                  break;
               case 'yaw':
                  // yaw is always 0 in flat scenes..........................//
                  apa.push( { name: 'yaw', '#': '0.0' } );
                  break;
            }
         }
      }

      // convert to a json string............................................//
      var txt = JSON.stringify( oRoot, null, '  ' );

      // raise the submit....................................................//
      if( vbcx.m_Control ) 
         vbcx.m_Control.fireSubmit( { data: txt } );
   };


   //........................................................................//
   // low level event delegates..............................................//
  
   vbcx.onRenderLayer = function( canvas )  
   {
      // this function is called when the overlay canvas can be rendered by..//
      // the application.....................................................//
      vbcx.m_Control.fireRender( {canvas: canvas} );
   };

   vbcx.onMoveLayer = function( canvas )  
   {
      // this function is called when the overlay canvas is moved............//
      vbcx.m_Control.fireMove( {canvas: canvas} );
   };

   vbcx.onZoomLayer = function( canvas )  
   {
      // this function is called when the overlay canvas is zoomed...........//
      vbcx.m_Control.fireZoom( {canvas: canvas} );
   };

   vbcx.onOpenWindow = function( id, div )
   {
      // this function is called when a new window is opened.................//
      vbcx.m_Control.fireOpenWindow( { id: id, contentarea: div } );
   };

   vbcx.onCloseWindow = function( id, div )  
   {
      // this function is called when a new window is opened.................//
      vbcx.m_Control.fireCloseWindow( { id: id, contentarea: div } );
   };

   return vbcx;
};
