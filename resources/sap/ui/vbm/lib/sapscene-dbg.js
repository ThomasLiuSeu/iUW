//...........................................................................//
// this module does the scene handling.......................................//

// Author: Ulrich Roegelein

//...........................................................................//
// defines...................................................................//

VBI.InputModeDefault = 0;       // standard mode.............................//
VBI.InputModeTrackObject = 1;   // objects handles or boxes are tracked
VBI.InputModeTrackMap = 2;      // map is tracked
VBI.InputModeTrackDesign = 3;   // objects are designed/drawn
VBI.InputModeRectSelect = 4;    // rectangular selection mode  

//...........................................................................//
// the scene manager manages the scene instances in a component context......//

VBI.SceneManager = function()
{

   var scenemanager = {};
   scenemanager.vbiclass = "SceneManager";
   scenemanager.m_SceneArray = [];

   // finding................................................................//
   scenemanager.find = function( name )
   {
      // the scene array.....................................................//
      for( var nJ = 0; nJ < scenemanager.m_SceneArray.length; ++nJ )
         if( scenemanager.m_SceneArray[nJ].m_ID == name )
            return scenemanager.m_SceneArray[nJ];
      
      return null;
   };

   // clearing...............................................................//
   scenemanager.clear = function()
   {
      // clear the scene array...............................................//
      for( var nJ = 0; nJ < scenemanager.m_SceneArray.length; ++nJ )
         scenemanager.m_SceneArray[nJ].clear();
      
      // reset array
      scenemanager.m_SceneArray = [];
   };
   
   scenemanager.load = function( dat, ctx )
   {
	  if ( dat.Set )   scenemanager.loadScenes( dat.Set,  false, dat, ctx );	 
	  if ( dat.Merge ) scenemanager.loadScenes( dat.Merge, true, dat, ctx );	 
   };
   
   scenemanager.loadScenes = function( setNode, bIsMerge, dat, ctx ){
	  if( jQuery.type( setNode ) == 'array' ){
		  for( var nJ = 0; nJ < setNode.length; ++nJ ) 
		     scenemanager.loadScene(setNode[nJ], bIsMerge, dat, ctx);
	  } else {
	     scenemanager.loadScene(setNode, bIsMerge, dat, ctx);	 
	  }
   };
   
   scenemanager.loadScene = function( mainNode, bIsMerge, dat, ctx )
   {
      // loading from the project file..........................................//
      var scene;

      if( mainNode.name )
	  {
	     // set a scene by name........................................//
	     if( scene = scenemanager.find( mainNode.name ) )
	     {
	        // clear the scene before reloading........................//
	  	    if (!bIsMerge)  scene.clear();
	
	        // reload the scene........................................//
	        if( mainNode.SceneGeo )
	           scene.load( mainNode.SceneGeo, ctx, bIsMerge );
	        else
	           scene.load( mainNode.Scene, ctx, bIsMerge );
	
	        if (bIsMerge) scene.ReAwake();
	        
	        return;
	     }
	  }  else
      {
	     // clear all scenes...........................................//
	     if (!bIsMerge) scenemanager.clear();
	  }
      
      if (mainNode.SceneGeo) scenemanager.loadNewScene( mainNode.SceneGeo, true, ctx );
      if (mainNode.Scene   ) scenemanager.loadNewScene( mainNode.Scene   , false, ctx );
      
   };

   scenemanager.loadNewScene = function(sceneNode, bIsSceneGeo, ctx){
      if( jQuery.type( sceneNode ) == 'object' )
      {
         // create the new scene load it and add it to the scene manager
         var scene = bIsSceneGeo ? new VBI.GeoScene( null, null, null ) : new VBI.Scene( null, null, null );
         scene.load( sceneNode, ctx );
         scenemanager.Add( scene ); 
      } else {
         if( jQuery.type( sceneNode ) == 'array' )
         {
            // load array of scenes
            for( var nJ = 0; nJ < sceneNode.length; ++nJ )
            {
               // create the new scene load it and add it to the scene manager
               var scene = bIsSceneGeo ? new VBI.GeoScene( null, null, null ) : new VBI.Scene( null, null, null );
               scene.load( sceneNode[ nJ ], ctx );
               scenemanager.Add( scene ); 
            }
         }
      }
   };


   // functions..............................................................//
   scenemanager.Add = function (scene) { scenemanager.m_SceneArray.push( scene ); };

   // access a specific scene inside vbi.....................................//
   scenemanager.GetScene = function ( target ) 
   {
      for( var i = 0; i < scenemanager.m_SceneArray.length; ++i)
      {
         if( scenemanager.m_SceneArray[i].m_TargetName == target )
            return scenemanager.m_SceneArray[i];
      }
      return null;   // scene not known
   };

   // access a specific scene by name........................................//
   scenemanager.GetSceneByName = function ( name ) 
   {
      for( var i = 0; i < scenemanager.m_SceneArray.length; ++i)
      {
         if( scenemanager.m_SceneArray[i].m_ID == name )
            return scenemanager.m_SceneArray[i];
      }
      return null;   // scene not known
   };        

   return scenemanager;
};


// ..........................................................................//
// Scene object..............................................................//

VBI.Scene = function( target )
{
   var scene = {};
   scene.vbiclass = "Scene";
   scene.m_TargetName = target;

   scene.m_EvtCont = new VBI.Events(); // publish subscribe container........//   
   
   scene.m_ID = "";
   scene.m_Ctx = null;                 // application context of scene
   scene.m_Div = null;                 // the div dom element associated with the scene
   scene.m_Parent = null;              // the window in which the scene is hosted

   scene.m_CaptureVO = null;           // the vo that currently captures mouse
   scene.m_DesignVO = null;            // the vo that is currently used for design

                                       // input
   scene.m_VOS = [];                   // visual objects
   scene.m_Events = null;              // event handling instance
   scene.m_Proj = null;                // Projection         
   scene.m_LastDefinedCenterPos = scene.m_LastZoomArea = undefined; // Only ZoomToGeoPositions defines a concrete CenterPos as long as no Zoom/MoveMap occurs
   
   scene.m_HotItem = { m_VO: null, m_Index: null, m_Design: null, m_HitObj: null }; // the hot item in the scene and if it is a design handle //
   scene.m_DragInfo = null;

   // assign members.........................................................//
   scene.m_Target = target;
  
   // base loading function..................................................//
   // this is called by all kind of scenes...................................//
   
   scene.LoadSingleVO = function( entity, vos, ctx, bIsMerge )
   {
      if( jQuery.type( entity ) == 'object' ) 
      {
         // load the single object........................................//
         var vo = vos.Factory.CreateInstance( entity.type );
         vo.m_Scene = scene;
         vo.load( entity, ctx );
         if (bIsMerge){
            var newID = vo.m_ID;
            for ( var i=scene.m_VOS.length; i--; ){
               if ( scene.m_VOS[i].m_ID == newID){
                  scene.m_VOS[i] = vo;
                  return;
               }             
            }
         }
         scene.m_VOS.push( vo );
      }   
   }

   scene.BaseLoad = function( dat, ctx, bIsMerge )
   {
      if (!bIsMerge)
      {
         // register a keyboard hook............................................//
         VBI.RegisterKeyboardHook();

         // store the application context in the scene..........................//
         // this is necessary to have access to the application context.........//
         scene.m_Ctx = ctx;   

         // loading scene members. todo: enhance loading of scene members.......//
         if( dat.id )
            scene.m_ID = dat.id;

         // load visual objects, these are usually 2d controls with absolute....//
         // positioning.........................................................//
      }

      if( dat.VO )
      {
         // create the vo and load...........................................//
         var vos = new VBI.VisualObjects();

         if( jQuery.type( dat.VO ) == 'array' )
         {
            // load the vo array.............................................//
            for( var nJ = 0; nJ < dat.VO.length; ++nJ )
               scene.LoadSingleVO(dat.VO[nJ], vos, ctx, bIsMerge);
         } else {
            scene.LoadSingleVO(dat.VO, vos, ctx, bIsMerge);
         }
         
      }
   };

   scene.BaseClear = function()
   {
      // clear the vo array..................................................//
      for( var nJ = 0, nlen = scene.m_VOS.length; nJ < nlen; ++nJ )
         scene.m_VOS[ nJ ].clear();

      // reset visual objects array..........................................//
      scene.m_VOS = [];                   // empty visual objects array......//
      
      // clear scene members.................................................//
      scene.m_Ctx = null;
      scene.m_CaptureVO = null;
      scene.m_DesignVO = null;

      // clean up windows reference to the scene.............................//
      if( scene.m_Parent )
    	  scene.m_Parent.m_refSceneInstance = null;
      
      // reset the hot item..................................................//
      scene.m_HotItem = null;

      if( scene.m_Events )
      {
         scene.m_Events.clear();
         scene.m_Events = null;
      }

      // unregister a keyboard hook..........................................//
      VBI.UnRegisterKeyboardHook();
   };

   scene.BaseGetVO = function( id )
   {
      // clear the vo array..................................................//
      for( var nJ = 0, nlen = scene.m_VOS.length; nJ < nlen; ++nJ )
         if( scene.m_VOS[ nJ ].m_ID == id ) return scene.m_VOS[ nJ ];
      return null;   
   };

   // scene loading..........................................................//
   scene.load = function( dat, ctx, bIsMerge )
   {
      // call base function..................................................//
  	   scene.BaseLoad( dat, ctx, bIsMerge );
   };

   scene.clear = function()
   {
      // call clear function.................................................//
      scene.BaseClear();
      
      scene.m_Div = null;
   };

   scene.InternalSetHotItem = function( vo, hitobj )
   {
      var hi = scene.m_HotItem;
      var bModified = false;
      var oldIndex = hi.m_Index;
      var oldVO = hi.m_VO;
      
      // set hot item index..................................................//
      if( hitobj )
      {
         // copy index.......................................................//
         if ( hi.m_Index != hitobj.m_Index  ) 
         {
            hi.m_Index = hitobj.m_Index;
            bModified = true;
         }

         // copy parts of the design info to the root........................//
         if( hi.m_Design != hitobj.m_Design )
         {
            hi.m_Design = hitobj.m_Design;
            bModified = true;
         }

         // copy parts of the entity info to the root........................//
         if( hi.m_Entity != hitobj.m_Entity )
         {
            hi.m_Entity = hitobj.m_Entity;
            bModified = true;
         }
      } else
      {
    	 // there is no hit object, reset the entity and detail info.........//
         if( hi.m_Entity || hi.m_Detail )
         {
            bModified = true;
            hi.m_Entity = null;
            hi.m_Detail = null;
         }
      }
      
      // set hot item vo.....................................................//
      if( hi.m_VO != vo )
      {
         hi.m_VO = vo;
         bModified = true;
      }      
      
      // check if the hit object has changed.................................//
      if( !bModified )
      {
         var ho;
         if( hitobj && ( ho = hi.m_HitObj ) )
         {
            if( !jQuery.sap.equal( ho, hitobj, 2 ) )
               bModified = true; 
         } else
         {
            if( hitobj != null || hi.m_HitObj != null )
               bModified = true;
         }
     }


      // store the detail information........................................//
      hi.m_HitObj = hitobj;
      
      if( bModified ){
    	 if (oldVO) oldVO.InternalChangeHotItem(oldIndex,false); // using PreData? Update value immediately
    	 if (vo)      vo.InternalChangeHotItem(hi.m_Index,true);
         scene.RenderAsync( false); // trigger async rendering when modified
      }

      return bModified;
   };

   scene.InternalRenderVisualObjects = function( canvas, context )
   {
      // iterate through objects and render them.............................//
	   
	  var ts1 = Date.now(); 
      var aVO = scene.m_VOS;
	  VBI.Utilities.BackupFont(context);	   
      for( var nJ = 0; nJ < scene.m_VOS.length; ++nJ )
         aVO[nJ].Render( canvas, context );
      VBI.Utilities.RestoreFont(context);
      scene.m_nLastRenderingTime = Date.now() - ts1;
   };

   scene.Render = function()
   {
      // todo: do rendering for scene (not the geo scene)....................//
   };

   scene.Awake = function( target )
   {   
      // render the visual objects of the scene..............................//
      scene.InternalRenderVisualObjects( null, scene.m_Ctx );
   };

   scene.NotifyDataChange = function()
   {
      // notify all vo's about a datacontext change..........................//
      for( var nJ = 0; nJ < scene.m_VOS.length; ++nJ )
         scene.m_VOS[nJ].NotifyDataChange( scene.m_Ctx );
      scene.m_PreassembledData = undefined;
   };

   scene.GetPointArrayFromPosArray = function( posarray, adjust )
   {
      // todo: implementation for non geo scene..............................//
      return posarray;
   };

   scene.GetPosFromPoint = function( pt )
   {
      // todo: implementation for non geo scene..............................//
      return pt;
   };

   scene.GetPointFromPos = function( pos, adjust )
   {
      // determine the pixel point in the canvas from a position vector......//
      // in the geoscene the GetPointArrayFromPosArray is overwritten so the.//
      // input is expected to be a lon/lat/height while in a 3d/2d scene it..//
      // should be the projected point.......................................//
      return scene.GetPointArrayFromPosArray( pos, adjust );
   };

   //........................................................................//
   // helper functions.......................................................//

   scene.GetEventVPCoords = function( event )
   {   
      // returns the relative pixel coordinates to the viewport of the.......//
      // provided event......................................................//
      if( !event ) return [0,0];

      var rect = scene.m_Div.getBoundingClientRect();
      return [ event.clientX - rect.left, event.clientY - rect.top ];
   };

   scene.GetEventVPCoordsObj = function( event )
   {
      // returns the view port coordinates in an object......................//
      var pos = scene.GetEventVPCoords( event );
      return { x: pos[0].toString() , y: pos[1].toString() };
   };

   scene.GetEventVPCoordsObjWithScene = function( event )
   {
      // returns the view port coordinates in an object......................//
      var pos = scene.GetEventVPCoords( event );
      return { x: pos[0].toString() , y: pos[1].toString(), scene: scene.m_ID };
   };   

   scene.GetEventDropObjWithScene = function( event )
   {
      return {strSource:  scene.m_DragInfo.strScene + "|" + scene.m_DragInfo.strID + "|" + scene.m_DragInfo.strInstance, scene: scene.m_ID };
     
   };
   
   // .......................................................................//
   // do event dispatching...................................................//

   scene.SetCapture = function( vo )
   {
      m_CaptureVO = vo;
   };

   scene.DispatchEvent = function( e, evName )
   {
      VBI.m_bTrace && VBI.Trace( "DispatchEvent " + e.type + " as " + evName + " mode:" + scene.m_nInputMode + (scene.m_Gesture ? " gesture active" : "" ) );

      // when the input mode is tracking, thhere is no dispatching of events.//
      if( scene.m_nInputMode == VBI.InputModeTrackMap )
         return false;

      var func, eventType = e.type;

      // check for abstract event name.......................................//
      if( evName )
         e.m_evName = eventType = evName;

      // dispatch the events to the vos......................................//
      e.m_Scene = scene;

      // do some adjustments for offset parameters, usually only done for ff.//
      // and touch events....................................................//
      if( e.offsetX == undefined || e.offsetY == undefined )
      {
         var rect;
         if( e.clientX !== undefined && e.clientY !== undefined )
         {
            // due to ff, there is no correct offsetX/Y therefore set it now.//
            rect = e.target.getBoundingClientRect();
            e.offsetX = e.clientX - rect.left;        
            e.offsetY = e.clientY - rect.top;
         } else
         if( e.changedTouches !== undefined && ( e.changedTouches.length > 0 ) )
         {
            // use the first changed touch as events offset..................//
            // generate clientX and clientY to be able to create submit event//
            rect = e.target.getBoundingClientRect();
            e.clientX = e.changedTouches[0].clientX;        
            e.clientY = e.changedTouches[0].clientY;
            e.offsetX = e.clientX - rect.left;        
            e.offsetY = e.clientY - rect.top;
         }
      }

      // do adjustments on the keyboard state................................//
      if( e.shiftKey == undefined )
         e.shiftKey = VBI.m_shiftKey;
      if( e.ctrlKey == undefined )
         e.ctrlKey = VBI.m_ctrlKey;

      
      // check for labels: if hit the event dispatching stops here and returns true!
      var aVO = scene.m_VOS;
      for( var nI = 0, len = aVO.length; nI < len; ++nI )
      {
         var aLabels = aVO[nI].getLabelData( false );
         for  ( var nJ = 0; nJ < aLabels.length; ++nJ )
         {
            var lb = aLabels[nJ];
            var rgba = VBI.Types.string2rgba( lb.m_BgColor );
            if ( rgba[3] < 0.1 && rgba[4] == 1 )    //transparent background
               continue; // not as hit considered 
            // x and y are the canvas relative coordinates......................//
            var zf = scene.GetCurrentZoomFactors();
            var nsx = e.offsetX / zf[0];
            var nsy = e.offsetY / zf[1];   
            for  ( var nK = 0; nK < lb.m_Pos.length; ++nK )
            {
               for ( var nL  = 0; nL < lb.m_Pos[nK].length; nL++ )
               {
                  var xPos = lb.m_Pos[nK][nL][0];
                  var yPos = lb.m_Pos[nK][nL][1];
                  var rect = [xPos, yPos, xPos +  lb.m_Width, yPos + lb.m_Height];
                  var point = [nsx, nsy];
                  if ( VBI.Utilities.PtInRect(point, rect ) )
                     return true;   // a label is hit -> no further event processing
               }
            }
         }
      }      
      
      
      // the design vo is the first one that gets events in the loop.........//
      if( scene.m_DesignVO )
      {
         VBI.m_bTrace && VBI.Trace( "DispatchEvent to Design VO" );
         if( ( func = scene.m_DesignVO[ "on" + eventType ] ) && typeof( func ) == 'function' )
         {
            // bind the function to the visual objects context, this ensures.//
            // that the this reference points to the vo......................//
            // and call the handler..........................................//
            if( (func.bind( scene.m_DesignVO ))( e ) == true ) 
               return true;   // handled
         }
      }

      // when a vo wants to have events first it can capture them, events....//
      // are not further dispatched when the event handler returns true......//
      if( scene.m_CaptureVO )
      {         
         if( ( func = scene.m_CaptureVO[ "on" + eventType ] ) && typeof( func ) == 'function' )
         {
            // bind the function to the visual objects context, this ensures.//
            // that the this reference points to the vo......................//
            // and call the handler..........................................//
            if( (func.bind( scene.m_CaptureVO ))( e ) == true ) 
               return true;   // handled
         }
      }

      var idx;
      for( var nJ = 0, len = scene.m_VOS.length; nJ < len; ++nJ )
      {
         // call the event handler on the objects in reverse order...........//

         idx = len - nJ - 1;
         if( ( func = scene.m_VOS[ idx ][ "on" + eventType ] ) && typeof( func ) == 'function' )
         {
            // bind the function to the visual objects context, this ensures.//
            // that the this reference references the vo instance itself.....//
            // and call the handler..........................................//
            if( (func.bind( scene.m_VOS[ idx ] ))( e ) == true ) 
               return true;   // handled
         }
      }

      return false;
   };

   return scene;
};

// ..........................................................................//
// GeoScene object...........................................................//

VBI.GeoScene = function( target, mapmanager, maplayerstack )
{
   var scene = new VBI.Scene( target );   // create scene and specialize.....//

   scene.vbiclass = "GeoScene";

   // persisting members.....................................................//
   scene.m_RefMapLayerStack = "";
   scene.m_DivCopyright = null;

   scene.m_Canvas = [];                   // canvas elements
   scene.m_cvObjImg = null;   // image of object layer canvas before the labels are rendered on top
   scene.m_ZoomFactors = [ 1.0, 1.0 ];    // zoom factors

   // store the mapmanager and the maplayerstack that should be used.........//
   scene.m_MapManager = mapmanager;
   scene.m_MapLayerStack = maplayerstack;

   // see discussion in http://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element
   scene.m_nMaxCanvasDimension = 8192; // all desktop browsers support canvas width/height at least up to 8192
   //if (scene.m_bIsIDevice || scene.m_bIsAndroid)
   if ( VBI.m_bIsMobile )
      scene.m_nMaxCanvasDimension = 6144;
   
   // click handler on scene.................................................//
   scene.Click = null;

   // define overlay index...................................................//
   scene.m_nOverlayIndex = 2;
   scene.m_nTapCount = 0;
   
   scene.GetHomeLocation = null;

   scene.m_Touches = [];   // touches history, used to detect double tap etc.//

   // event handling members.................................................//
   scene.m_currentMouseX = 0;
   scene.m_currentMouseY = 0;
   scene.m_oldMouseX = 0;
   scene.m_oldMouseY = 0;
   scene.m_currentMouseDownX = 0;
   scene.m_currentTouchCount = 0;
   scene.m_currentMouseDownY = 0;
   scene.m_midPointX = 0;
   scene.m_midPointY = 0;

   scene.m_currentTouchDistance = 0;
   scene.m_nInputMode = VBI.InputModeDefault;

   scene.m_BlendTimer = null;          // blend timer
   scene.m_AnimZoomTimer = null;       // animation zoom timer

   // initial start position
   scene.m_startPointLonLat = [0.0, 0.0];
   scene.m_startLOD = 0;

   // Navigation Control
   scene.m_bNavControlVisible = true;
   //scene.m_bNavControlVisible = false;
   scene.m_NavControl = null;
   scene.m_RenderTimer = null;

   // Suppressed Navigation
   scene.m_SuppressedNavigation = { zoom:false, move:false };

   // Scale
   scene.m_bScaleVisible = true;
   scene.m_Scale = null;

   // current overlay image data, bits representing the rendered image.......//
   //scene.m_OverlayImageData = null;  
   scene.m_OverlayImage = null;

   scene.m_nCanvasXOversize = 2.2;       // Canvas is sized floor ( viewport + 2.2 tiles ). 
   scene.m_nCanvasYOversize = 2.2;       // It should be at least 1.2 tiles available outside the viewport
   scene.m_nCanvasStdXPos   = scene.m_nCanvasXOversize / 4;
   scene.m_nCanvasStdYPos   = scene.m_nCanvasYOversize / 4;

   scene.m_nTicksInALod     = 5;         // n mouse scroll ticks are needed to scroll to next lod
                                         // which leads to the following factors for zoom in / out

   scene.m_nLodFactorZoomIn  = Math.pow( 2 , 1 / scene.m_nTicksInALod );
   scene.m_nLodFactorZoomOut = 1 / scene.m_nLodFactorZoomIn;
   scene.m_nLodFactorZoomInHalf  = Math.pow( 2 , 1 / ( 2 * scene.m_nTicksInALod ) );
   scene.m_nLodFactorZoomOutHalf = 1 / scene.m_nLodFactorZoomInHalf;
   
   scene.m_nMaxAnimLodDiff = 3; // when Lod difference on ZoomMap Animations is bigger than this value we skip tile requests
   
   scene.m_nZoomMode = 1;

   scene.m_nLastRenderingTime = 0;  // from 25 ms onwards we begin to skip rendering steps, if
   scene.m_nRenderTimeTarget = 250; // rendering takes more then 250 ms all intermediate steps are ommited.
   scene.m_nNumOfScalingVOInst = 0;

   scene.m_nLastClusteringTime = 0;
   // .......................................................................//
   // events.................................................................//
   
   scene.onTileLoaded = null;    // raised when a new tile is loaded

   // clear the scene........................................................//
   scene.clear = function()
   {
      // call base class.....................................................//
      scene.BaseClear();

      // reset touches array.................................................//
      scene.m_Touches = [];               // empty touch event queue.........//

      // remove the scene reference in navigation control....................//
      if( scene.m_NavControl )
      {
         scene.m_NavControl.clear();
         scene.m_NavControl = null;
      }

      // remove the scene reference in scale control.........................//
      if( scene.m_Scale )
      {
         scene.m_Scale.clear();
         scene.m_Scale = null;
      }

      // clear timers........................................................//
      scene.clearTimers();
      scene.clearCanvases();

      // remove potential event listeners from document......................//
      scene.SetInputMode( VBI.InputModeDefault );

      scene.Remove();   // remove the dom elements

      // reset object references.............................................//
      scene.m_RefMapLayerStack = "";
      scene.m_MapManager = null;
      scene.m_MapLayerStack = null;
      scene.m_TargetName = null;
      //scene.m_OverlayImageData = null;
      scene.m_OverlayImage = null;
      scene.m_Proj = null;

      // remove references to DOM elements...................................//
      scene.m_DivCopyright = null;
      scene.m_Target = null;
   };

   scene.loadSingleRemoveOnScene = function( removeNode, ctx )
   {
      if( jQuery.type( removeNode ) == 'object' ){
         switch( removeNode.type )
         {
            case "VO":
               var id = removeNode.id;
               for (var j = scene.m_VOS.length; j--;){
                  if ( scene.m_VOS[j].m_ID == id ){
                     scene.m_VOS.splice(j,1);
                     return;                     
                  }
               }
               break;
         };
      }
   };
   
   scene.loadRemoveOnScene = function( removeNode, ctx )
   {
      if( jQuery.type( removeNode ) == 'array' )
         for (j=0; j < removeNode.length;++j)
            scene.loadSingleRemoveOnScene( removeNode[j], ctx );
      else
         scene.loadSingleRemoveOnScene( removeNode, ctx );
   };

   // scene loading..........................................................//
   scene.load = function( dat, ctx, bIsMerge )
   {
      if ( bIsMerge && dat.Remove )
         scene.loadRemoveOnScene( dat.Remove, ctx);
      
      // call base loading...................................................//
   	scene.BaseLoad( dat, ctx, bIsMerge );

      if( dat.refMapLayerStack )
         scene.m_RefMapLayerStack = ctx.m_MapLayerStackManager.GetMapLayerStack( dat.refMapLayerStack );
      else
         VBI.m_bTrace && VBI.Trace( "no map layer specified in geo scene" );

      if ( bIsMerge )
         return; // as of now only exchange of map layer stack is supported  
         
      var minX = -1000,       maxX = 1000;
      var minY = -90,         maxY = 90;
      scene.m_nMinLodVisualBorder = 0;
      scene.m_nMaxLodVisualBorder = 99;
      scene.m_nOffsetMinLod       = 0;
      scene.m_bYBorderExists      = false;
      if (dat.VisualFrame){
         if (dat.VisualFrame.minX != undefined) minX = dat.VisualFrame.minX ;
         if (dat.VisualFrame.maxX != undefined) maxX = dat.VisualFrame.maxX ;
         if (dat.VisualFrame.minY != undefined) minY = dat.VisualFrame.minY ;
         if (dat.VisualFrame.maxY != undefined) maxY = dat.VisualFrame.maxY ;
         if (dat.VisualFrame.minY != undefined || dat.VisualFrame.maxY != undefined) scene.m_bYBorderExist = true;
         
         if (dat.VisualFrame.minLOD != undefined) scene.m_nMinLodVisualBorder = dat.VisualFrame.minLOD;
         if (dat.VisualFrame.maxLOD != undefined) scene.m_nMaxLodVisualBorder = dat.VisualFrame.maxLOD;

         if ( dat.VisualFrame.offsetMinLOD != undefined ) scene.m_nOffsetMinLod = dat.VisualFrame.offsetMinLOD;
      }

      scene.m_bXBorderExists = ( minX != -1000 ) || ( maxX != 1000 );
      scene.m_nBorderMinPoint = VBI.MathLib.DegToRad( [ minX , maxY ] );       
      scene.m_nBorderMaxPoint = VBI.MathLib.DegToRad( [ maxX , minY ] );       

      scene.m_Proj = scene.setProjection();

      var uxyMin = [ 1.0 , 1.0 ], uxyMax = [ 1.0 , 1.0 ];
      scene.m_Proj.LonLatToUCS ( scene.m_nBorderMinPoint, uxyMin );
      scene.m_Proj.LonLatToUCS ( scene.m_nBorderMaxPoint, uxyMax );
      scene.m_nXSizeVisualBorder = Math.max( 0.0, Math.min( 1.0, uxyMax[0] - uxyMin[0] ));
      scene.m_nYSizeVisualBorder = Math.max( 0.0, Math.min( 1.0, uxyMax[1] - uxyMin[1] ));

      if ( dat.initialStartPosition ){
         var array = dat.initialStartPosition.split(';');
         scene.m_startPointLonLat = VBI.MathLib.DegToRad( [ parseFloat( array[0] ), parseFloat( array[1] ) ] );
      }

      if ( dat.initialZoom ){
        scene.m_startLOD = parseInt( dat.initialZoom );
      }

      // navigation enablement and navigation control visibility
      var SuppressedNavControlVisibility = { zoom:false, move:false, fade:false };
      // read properties of navigation enablement
      if( dat.NavigationDisablement )
      {
        if( dat.NavigationDisablement.zoom )
          scene.m_SuppressedNavigation.zoom = VBI.Types.string2bool(dat.NavigationDisablement.zoom);
        if( dat.NavigationDisablement.move )
          scene.m_SuppressedNavigation.move = VBI.Types.string2bool(dat.NavigationDisablement.move);
      }


      // Navigation visibility
      // read properties of NavControl Visibility
      if ( dat.navControlVisible )
         scene.m_bNavControlVisible = VBI.Types.string2bool( dat.navControlVisible);

         SuppressedNavControlVisibility.zoom = scene.m_SuppressedNavigation.zoom;
         SuppressedNavControlVisibility.move = scene.m_SuppressedNavigation.move;

         if ( scene.m_SuppressedNavigation.zoom && scene.m_SuppressedNavigation.move )
            scene.m_bNavControlVisible = false;
         else{
            if ( scene.m_bNavControlVisible ){
               if ( dat.SuppressedNavControlVisibility ){
                  if ( !SuppressedNavControlVisibility.zoom && dat.SuppressedNavControlVisibility.zoom)
                     SuppressedNavControlVisibility.zoom = VBI.Types.string2bool( dat.SuppressedNavControlVisibility.zoom );
                  if ( !SuppressedNavControlVisibility.move && dat.SuppressedNavControlVisibility.move)
                     SuppressedNavControlVisibility.move = VBI.Types.string2bool( dat.SuppressedNavControlVisibility.move );
                  if (dat.SuppressedNavControlVisibility.fade)
                     SuppressedNavControlVisibility.fade = VBI.Types.string2bool( dat.SuppressedNavControlVisibility.fade );
               }
               if (SuppressedNavControlVisibility.move && SuppressedNavControlVisibility.zoom)
                  scene.m_bNavControlVisible = false;
            }
         }

      if ( scene.m_bNavControlVisible )
         scene.m_NavControl = new VBI.NavigationControl( SuppressedNavControlVisibility );
      
      // Scale
      if ( dat.scaleVisible )
         scene.m_bScaleVisible = VBI.Types.string2bool( dat.scaleVisible );
      if ( scene.m_bScaleVisible )
        scene.m_Scale = new VBI.Scale( scene );
   };

   //........................................................................//
   // scene controlling interface............................................//

   scene.SetInputMode = function( val )
   {
      // trace current input mode............................................//
      VBI.m_bTrace && VBI.Trace("SetInputMode: " + this.m_nInputMode );

      if( this.m_nInputMode == val )
         return;                       // input mode did not change..........//

      // process removal of existing input mode..............................//
      switch( this.m_nInputMode )
      {
         case VBI.InputModeTrackMap:
            scene.SetInputModeTrackMap( false );
            break;
      };

      // process setting of new input mode...................................//
      switch( val )
      {
         case VBI.InputModeTrackMap:
            scene.SetInputModeTrackMap( true );
            break;
      }

      // store input mode....................................................//
      this.m_nInputMode = val;
   };

   //........................................................................//
   // set the tooltip on the canvas..........................................//

   scene.SetToolTip = function( tt )
   {
      var oCanvas = scene.m_Canvas[ scene.m_nOverlayIndex ];
      if( oCanvas.title != tt )
         oCanvas.title = tt;
   };

   scene.SetCursor = function( cc )
   {
      var oCanvas = scene.m_Canvas[ scene.m_nOverlayIndex ];
      if( oCanvas.style.cursor != cc )
         oCanvas.style.cursor = cc;
   };

   scene.RenderAsync = function( bForceRecluster )
   {
	  if ( bForceRecluster != false ) 
		  scene.bForceRecluster = true;
	   
      // the render timer is already active, return immediately..............//
      if( scene.m_RenderTimer )
         return;     

      // set the render timer................................................//
      scene.m_RenderTimer = window.setInterval( scene.DoRender, 20 );
   };
   
   scene.DoRender = function()
   {
	  scene.Render (!scene.bForceRecluster);
   };

   scene.Render = function( suppressReclustering )
   {
	  scene.bForceRecluster = false;	   
      // render the overlay..................................................//
      if( scene.m_RenderTimer )
      {
         // clear pending reder timers.......................................//
         window.clearInterval( scene.m_RenderTimer );      
         scene.m_RenderTimer = null;
      }
      if ( scene.m_Canvas.length )
          scene.InternalRenderLayer(scene.m_Canvas[ scene.m_nOverlayIndex ], false, true, suppressReclustering!=true, scene.m_Canvas[0].m_nExactLOD );
   };

   scene.GoToInitialStart = function()
   {
      if (!scene.ZoomToGeoPosition( scene.m_startPointLonLat, scene.m_startLOD, true, false, true )){
    	  // the target point is outside the allowed are
    	  var minP = VBI.MathLib.RadToDeg( scene.m_nBorderMinPoint );
    	  var maxP = VBI.MathLib.RadToDeg( scene.m_nBorderMaxPoint );
    	  var lons = [ minP[0], maxP[0] ];
    	  var lats = [ minP[1], maxP[1] ];
    	  
    	  scene.ZoomToMultiplePositions ( lons, lats, 1.1, true );
      }
      
      scene.RenderAsync( true );
   };
   
   scene.GetDistance = function( ptStart,  ptEnd )
   {
      var GeoStart = scene.GetPosFromVPPoint( ptStart );
      var GeoEnd   = scene.GetPosFromVPPoint( ptEnd );
      return VBI.MathLib.Distance( VBI.MathLib.DegToRad( GeoStart ), VBI.MathLib.DegToRad( GeoEnd ) );
      
   };
   scene.GetTargetPointForDistance = function( dist, ptStart )
   {
      var ptGeoStart = scene.GetPosFromVPPoint( ptStart );
      var tmpGeoStart = ptGeoStart.slice(0);
      ptGeoStart = VBI.MathLib.DegToRad( ptGeoStart );
      var angle = 90 * Math.PI / 180;
      
      var lat = Math.asin( Math.sin( ptGeoStart[1] ) * Math.cos( dist / VBI.MathLib.earthradius) + Math.cos( ptGeoStart[1] ) * Math.sin( dist / VBI.MathLib.earthradius ) * Math.cos( angle ) );
      var lon = ptGeoStart[0] + Math.atan2( Math.sin( angle ) * Math.sin(  dist / VBI.MathLib.earthradius ) * Math.cos( ptGeoStart[1] ), Math.cos( dist / VBI.MathLib.earthradius ) - Math.sin( ptGeoStart[1] ) * Math.sin( lat ) );
      //double dB_lon = dA_lon + atan2(sin(fYawAngle)*sin(dDistance/EARTH_RADIUS)*cos(dA_lat), cos(dDistance/EARTH_RADIUS)-sin(dA_lat)*sin(dB_lat));
      var tmpGeoEnd = VBI.MathLib.RadToDeg( [lon,lat] );
      return ( scene.GetPointFromGeo( [lon,lat], true ) );
   };
   
   scene.ZoomToMultiplePositions = function( lons, lats, corr, bSuppressRendering ) 
   {
      var minMaxX=[];
      var minMaxY=[];
      if ( lons.length != lats.length )
         return;
      for ( var nJ = 0; nJ < lons.length; nJ++ ){
         var fLon = ( parseFloat( lons[nJ] ) );
         if ( fLon < 0 )
            fLon += 360;
         minMaxX.push( fLon );
         minMaxY.push( parseFloat( lats[nJ] ) );
      }
      if ( minMaxX.length != minMaxY.length || !minMaxX.length )
         return;
      // sort the arrays
      minMaxX.sort(function (a, b) { return a-b; });
      minMaxY.sort(function (a, b) { return a-b; });

      var minX = 0, maxX = 0, minY, maxY;
      minY = minMaxY[0];
      maxY = minMaxY[minMaxY.length - 1];
      var dist = undefined, from, to, tmp;
      from = minMaxX[minMaxX.length - 1];
      // find the largest distance between two points ( only x-axis )
      for( var nJ = 0; nJ < minMaxX.length; nJ++){
         to = minMaxX[nJ];
         tmp = ( to < from ? ( to + 360 - from ) : (to - from));  
         if ( dist == undefined || tmp > dist ) {
            dist = tmp;
            minX = ( to < from ? to + 360 : to );  
            maxX = from;
         }
         from = to;
      }
      scene.ZoomToArea( minX, maxX, minY, maxY, corr ? corr : 0.9, false, bSuppressRendering );
   };
   
   scene.ZoomToAreas = function( areaList, corr )
   {
       var xLOD = Math.log( scene.m_nDivWidth  / ( scene.m_MapManager.m_tileWidth  * scene.m_nXSizeVisualBorder)) * Math.LOG2E;
	   
	   // we call getSurroundingBox with maxXDistShownSeparate == 0, so it adapts to DIV and LOD
       var tg = VBI.MathLib.GetSurroundingBox(areaList, 0, xLOD, scene.CalculateYMinLod);

	   scene.ZoomToArea(tg[0],tg[1],tg[2],tg[3],corr,true);
	   
	   var ts = new Date().getTime(); // overwrite LastZoomArea so ZoomToAreas() may be repeated
	   scene.m_LastZoomArea = [ ts, "Areas" , areaList, corr ];

	   return true;
   };
   
   scene.CalculateYMinLod = function(minY,maxY)
   {
      if (minY==maxY) return 1000;
	  
      var ucsMin = [ 256, 256 ];
      var ucsMax = [ 256, 256 ];

      scene.m_Proj.LonLatToUCS (VBI.MathLib.DegToRad([0,minY]), ucsMin );      
      scene.m_Proj.LonLatToUCS (VBI.MathLib.DegToRad([0,maxY]), ucsMax );   
      lodY = scene.m_nDivHeight  / Math.abs( ucsMax[1] - ucsMin[1] );
      lodY = Math.log(lodY) * Math.LOG2E;
      
      return lodY;
   };
   
   scene.ZoomToArea = function( minX, maxX, minY, maxY, corr, bRoundDown, bSuppressRendering ) 
   {
      // by standard this method zooms in a way that both points are in the visible area
      // with a distance of 10% to the borders ( corr = 0.9 )
	   //  if corr is set to 1.0 the points are exactly on the visible boder of the new area / used for rectangular zoom
	   
      var nTileWidth = 256, nTileHeight = 256;
      if ( scene.m_MapManager )
      {
         nTileWidth = scene.m_MapManager.m_tileWidth;
         nTileHeigth = scene.m_MapManager.m_tileHeight;
      }
      
      var theoHeight = scene.m_nDivHeight ? scene.m_nDivHeight : nTileHeight;
      var theoWidth  = scene.m_nDivWidth  ? scene.m_nDivWidth  : nTileWidth;
      var bInsideRectangle;
      var pixelShift;

      if( jQuery.type( corr ) == 'array')
	  {
    	  if ( corr.length >= 4 )
    	  {
        	  var xCorr = corr[0]+corr[2];
        	  var yCorr = corr[1]+corr[3];
        	  if ((xCorr < theoWidth)&&(yCorr < theoHeight))
    		  {
            	  if ((corr[0] != corr[2])||(corr[1] != corr[3]))
             	     pixelShift = [ ( corr[2]-corr[0] ) / 2 , ( corr[3]-corr[1] ) / 2 ];
                   theoWidth -= xCorr;
                   theoHeight -= yCorr;
                   bInsideRectangle = ( ( xCorr  <  0) || ( yCorr < 0 ) );
    		  }
    	  }
	  }
      else
      {
    	  theoHeight *= corr;
    	  theoWidth  *= corr;
    	  bInsideRectangle = ( corr > 1.0 );
      }
      // calculate midpoint to zoom in
      if( maxX < minX )
          maxX += 360;    
      
      while ( minX > 180 ) minX -= 360;
      while ( maxX > 180 ) maxX -= 360;
      
      var min = [minX, minY];
      var max = [maxX, maxY];
      min = VBI.MathLib.DegToRad( min );
      max = VBI.MathLib.DegToRad( max );
      
      var ucsMin =  [ nTileWidth, nTileHeight ];
      var ucsMax = [ nTileWidth, nTileHeight ];
      scene.m_Proj.LonLatToUCS (min, ucsMin );      
      scene.m_Proj.LonLatToUCS (max, ucsMax );   
      
      var ucsMiddleX = ucsMin[0] + ucsMax[0] + ( ucsMax[0] <= ucsMin[0] ) * nTileWidth;
      var ucsMiddleY = ucsMin[1] + ucsMax[1];
      var ucsZoomPoint = [ucsMiddleX/nTileWidth - 1,ucsMiddleY/nTileHeight - 1 ];
      var zoomPoint=[1,1];
      scene.m_Proj.UCSToLonLat( ucsZoomPoint, zoomPoint);
      
      //calculate the requested lod 
      var lodY = 14, lodX = 14; // default value
      if ( maxY != minY ){
         lodY = theoHeight  / Math.abs( ucsMax[1] - ucsMin[1] );
         lodY = Math.log(lodY) * Math.LOG2E;
      }
      if( maxX != minX ){
         lodX = theoWidth / Math.abs( ( ucsMax[0] - ucsMin[0]  ) + ( ucsMax[0] <= ucsMin[0] ) * nTileWidth );
         lodX = Math.log(lodX) * Math.LOG2E;
      }
      var resultLod = ( bInsideRectangle ) ? Math.max( lodX, lodY ) : Math.min ( lodX, lodY );
      if (bRoundDown)
    	  resultLod = Math.floor(resultLod);
      scene.ZoomToGeoPosition( zoomPoint, resultLod, false, false, bSuppressRendering, pixelShift );
      if ( resultLod !=  Math.floor(resultLod) ){
         setTimeout(function(){scene.AnimateZoomToGeo ( zoomPoint, Math.floor(resultLod) , 40 );},600); 
      }
      
      var ts = new Date().getTime();
      scene.m_LastZoomArea = [ ts, "Area", minX, maxX, minY, maxY, corr ];
      
   };

   scene.AdaptOtherCanvas = function( uxy, lod, lodDist, nExactLodDist) 
   {
      // adapts the canvas to the new scenario if possible, so we can blend over on filling canvas 1 afterwards and togling
      // if this is not possible, canvas is cleared and 0 is returned so we continue on canvas 0
	   
	  var nTarget = lodDist ? 1 : 0; // if stretching fails, target will remain canvas [0]
	  var otherCanvas = scene.m_Canvas[ 1 - nTarget ];

	  if ( ( lodDist <= 1 ) && ( lodDist >= -2 ) )  // we can not stretch the canvas that far to deal with lodDist = 2.
      {
    	 var otherLodDist = lod - otherCanvas.m_nCurrentLOD;
         var lodFactor    = Math.pow( 2, -otherLodDist );
         var poslodFactor = Math.max( 1, lodFactor );

         var pl = otherCanvas.getPixelLeft(),          pt = otherCanvas.getPixelTop();
         var pw = otherCanvas.getPixelWidth(),         ph = otherCanvas.getPixelHeight();
         
         var nOldStretchFactor = pw / scene.m_nWidthCanvas;  // equal in other dimension         
         var oldUxy = 
            [  ( this.m_MapManager.m_tileWidth  *  otherCanvas.m_nCurrentX + ( scene.m_nDivWidth  / 2  - pl ) / nOldStretchFactor ),
               ( this.m_MapManager.m_tileHeight *  otherCanvas.m_nCurrentY + ( scene.m_nDivHeight / 2 - pt ) / nOldStretchFactor  ) ];
         var deltaUxy = [ oldUxy[0] - lodFactor * uxy[0] , oldUxy[1] - lodFactor * uxy[1] ];
         
         if  ( ( Math.abs( deltaUxy[0] ) < poslodFactor * scene.m_nWidthCanvas  ) &&
              ( Math.abs( deltaUxy[1] ) < poslodFactor * scene.m_nHeightCanvas ) ) 
         {
            var nDistortion =  Math.pow(2, nExactLodDist);
            var newpl = nDistortion * ( pl - scene.m_nDivWidth / 2  + nOldStretchFactor * deltaUxy[0] ) + scene.m_nDivWidth / 2;
            var newpt = nDistortion * ( pt - scene.m_nDivHeight / 2 + nOldStretchFactor * deltaUxy[1] ) + scene.m_nDivHeight / 2;
            this.MoveCanvas( otherCanvas, newpl , newpt , pw * nDistortion, ph * nDistortion ) ;
            return nTarget;
         }
      }

      return 0;  // we target 0 now.
   };

   scene.ZoomToGeoPosition = function( lonlat, lod, doNotCorrectInvalidPositions, bSuppressEvents, bSuppressRendering, pixelShift )
   {
	  if (( lonlat.pixelShift != undefined ) && ( pixelShift==undefined ) )
		  pixelShift = lonlat.pixelShift;
	  if ( scene.m_Canvas[3].m_bCanvasValid ){ // in rare cases the move switch is not yet done so do it 
         scene.SwitchTmpCanvasToActive();
	  }	   
	  var xShift=0, yShift=0;
      var canvas = scene.m_Canvas[0];
	  var oldLOD = canvas.m_nExactLOD;
      var nTileWidth  = scene.m_MapManager.m_tileWidth;
      var nTileHeight = scene.m_MapManager.m_tileHeight;

      var nExactLod = Math.min( Math.max( lod, scene.GetMinLOD() ), scene.GetMaxLOD());
      lod = Math.floor(nExactLod);
      var nRemainingFactor = Math.pow(2, nExactLod - lod );
      var nLodDist = ( 1<< lod );
      if (pixelShift != undefined)
	  {
		  xShift = pixelShift[0] / nRemainingFactor;
		  yShift = pixelShift[1] / nRemainingFactor ;
	  }

      // the zooming position should be in the center of the viewport........//
      // determine the position in pixel space...............................//
      var uxy = [ nLodDist * nTileWidth , nLodDist * nTileHeight];
      scene.m_Proj.LonLatToUCS (lonlat, uxy );

      // determine left upper corner point in pixel space 
      var luPoint = [ uxy[0] - scene.m_nDivWidth / 2 + xShift, uxy[1] - scene.m_nDivHeight / 2 + yShift ];
      var ucsMinX = scene.m_Proj.m_nUCSMin * nLodDist;
      
      nTargetCanvas = scene.AdaptOtherCanvas ( uxy, lod, lod - canvas.m_nCurrentLOD, nExactLod - canvas.m_nExactLOD);
      // determine the left top tile number of the canvas....................//
      var newXPos = Math.round( luPoint[0]  / nTileWidth  - scene.m_nCanvasStdXPos - ucsMinX);
      var newYPos = Math.round( luPoint[1]  / nTileHeight - scene.m_nCanvasStdYPos );

      // determine the coordinate in canvas space............................//
      var nUnstretchedLeft = -Math.floor( luPoint[0] - ( newXPos + ucsMinX ) * nTileWidth ) ;
      var nUnstretchedTop  = -Math.floor( luPoint[1] - newYPos * nTileHeight );
       
      var newLeft = Math.round( nUnstretchedLeft + ((nRemainingFactor - 1) * (nUnstretchedLeft - scene.m_nDivWidth  / 2 ) ) ); 
      var newTop  = Math.round( nUnstretchedTop  + ((nRemainingFactor - 1) * (nUnstretchedTop -  scene.m_nDivHeight / 2 ) ) );

      var newWidth  = Math.round( scene.m_nWidthCanvas  * nRemainingFactor );
      var newHeight = Math.round( scene.m_nHeightCanvas * nRemainingFactor );

      // for zoom out we have to check whether we run out of north/south limits. if we would 
      // do so we have to adapt newTop and (eventually) newYPos, so we zoom exactly to the limit
      var uxyLU = [ nLodDist , nLodDist ];
      var uxyRL = [ nLodDist , nLodDist ];
      scene.m_Proj.LonLatToUCS ( scene.m_nBorderMinPoint, uxyLU );
      scene.m_Proj.LonLatToUCS ( scene.m_nBorderMaxPoint, uxyRL );
      
      var nNewStretch = newHeight / scene.m_nHeightCanvas;
      var nTargetDistanceToNorthernBorder = nTileHeight * ( newYPos - uxyLU[1] ) * nNewStretch - newTop;
      var nTargetDistanceToSouthernBorder = nTileHeight * ( newYPos - uxyRL[1]) * nNewStretch + scene.m_nDivHeight - newTop;

      var bTopChanged = true;
      if ( nTargetDistanceToNorthernBorder < -scene.m_nMaxPixelBeyondPoles )
         newTop = nTileHeight * ( newYPos - uxyLU[1] ) * nNewStretch + scene.m_nMaxPixelBeyondPoles;
      else if  ( nTargetDistanceToSouthernBorder > scene.m_nMaxPixelBeyondPoles )
         newTop = nTileHeight * ( newYPos - uxyRL[1] ) * nNewStretch + scene.m_nDivHeight - scene.m_nMaxPixelBeyondPoles;
      else
         bTopChanged = false;

      if (bTopChanged)
      {  // Top has changed, but we have to check whether it is still in the allowed range
         // or whether we have to change the position
    	 if ( doNotCorrectInvalidPositions ) return false;
    	 
    	 var unstretchedTop = ( newTop + ( nRemainingFactor - 1 ) * scene.m_nDivHeight /2 ) / nRemainingFactor ;
         var nPosCorrection = -Math.round( scene.m_nCanvasStdYPos + unstretchedTop / nTileHeight );
         newYPos += nPosCorrection;
         newTop  += nRemainingFactor * nPosCorrection * nTileHeight; 
      }

      if (scene.m_bXBorderExists){
         var nTargetDistanceToWestBorder = nTileWidth * ( newXPos - uxyLU[0] ) * nNewStretch - newLeft;
         var nTargetDistanceToEastBorder = nTileWidth * ( newXPos - uxyRL[0])  * nNewStretch + scene.m_nDivWidth - newLeft;
   
         var bLeftChanged = true;
         if ( nTargetDistanceToWestBorder < -scene.m_nMaxPixelBeyondPoles )
            newLeft = nTileWidth * ( newXPos - uxyLU[0] ) * nNewStretch + scene.m_nMaxPixelBeyondPoles;
         else if  ( nTargetDistanceToEastBorder > scene.m_nMaxPixelBeyondPoles )
            newLeft = nTileWidth * ( newXPos - uxyRL[0] ) * nNewStretch + scene.m_nDivWidth - scene.m_nMaxPixelBeyondPoles;
         else
            bLeftChanged = false;
         
         if (bLeftChanged)
         {  // Top has changed, but we have to check whether it is still in the allowed range
            // or whether we have to change the position
        	if ( doNotCorrectInvalidPositions ) return false;
        	
            var unstretchedLeft = ( newLeft + ( nRemainingFactor - 1 ) * scene.m_nDivWidth /2 ) / nRemainingFactor ;
            var nPosCorrection = -Math.round( scene.m_nCanvasStdXPos + unstretchedLeft / nTileHeight );
            newXPos += nPosCorrection;
            newLeft  += nRemainingFactor * nPosCorrection * nTileWidth; 
         }
      }

      var bJustSmallMove = ((canvas.m_nCurrentX == newXPos) && (canvas.m_nCurrentY == newYPos) && (canvas.m_nCurrentLOD == lod));
      if ( bJustSmallMove) {
          scene.MoveCanvas(canvas, newLeft, newTop, newWidth, newHeight);
          canvas.m_nExactLOD = nExactLod;
      } else {
          // Clear/Invalidate second canvas as it is outdated anyway
          scene.InvalidateCanvas( scene.m_Canvas[1] );
          if (nTargetCanvas==0){
              var context = canvas.getContext("2d");
              context.clearRect(0, 0,canvas.width, canvas.height);
          }

          // we fill canvas 1 in case we can blend over, otherwise canvas 0 directly.
          var canvasNew  = scene.m_Canvas[nTargetCanvas]; 
          // request new tiles into the current canvas...........................//
          scene.MoveCanvas(canvasNew, newLeft, newTop, newWidth, newHeight);
          scene.m_MapManager.RequestTiles( canvasNew, scene.m_MapLayerStack, newXPos, newYPos, scene.m_nTilesX, scene.m_nTilesY, 0, 0, 0, 0, lod, false );
        	  
          canvasNew.m_nExactLOD = nExactLod;

          if ( nTargetCanvas == 1 )   scene.ToggleCanvas(scene);
      }
      if ( bSuppressRendering != true )
         scene.InternalRenderLayer(scene.m_Canvas[ scene.m_nOverlayIndex ], false, !bJustSmallMove, !bJustSmallMove, nExactLod ); // if exact lod changed we may re-render
      
      scene.m_LastDefinedCenterPos =  pixelShift ? undefined : lonlat;

      scene.InternalOnMoveLayer( canvas, bSuppressEvents );
      // call internal function to be able to do additional default behavior...//
      if ( nExactLod != oldLOD ) 
          scene.InternalOnZoomLayer( scene.m_Canvas[ scene.m_nOverlayIndex ], bSuppressEvents);
      
      // notify NavControl.................................................//
      if ( scene.m_bNavControlVisible && scene.m_NavControl ){
         scene.m_NavControl.AdjustScrollPoint( nExactLod );
      }

      return true;
   };

   scene.SetMapLayerStack = function( name )
   {
      var item = VBI.GetMapLayerStack( name ); 
      if( item == null )
         return;           // do nothing
	  if ( scene.m_Canvas[3].m_bCanvasValid ){  
	     scene.SwitchTmpCanvasToActive();
	  }	         

      // set the new layer stack.............................................//
      scene.m_MapLayerStack = item;

      // request new tiles into the current visible canvas...................//
      var canvas = scene.m_Canvas[0];
      scene.m_MapManager.RequestTiles( canvas, scene.m_MapLayerStack, canvas.m_nCurrentX, canvas.m_nCurrentY, scene.m_nTilesX, scene.m_nTilesY, 0, 0, 0, 0, canvas.m_nCurrentLOD, false );

      // set the map layer stack by name.....................................//
      scene.InternalRenderLayer(scene.m_Canvas[ scene.m_nOverlayIndex ], false, true, true, canvas.m_nCurrentLOD);
   };

   scene.ZoomToZoomlevel = function( lonlat, newZoomLevel, bSuppressEvents )
   {
      var rectDiv = scene.m_Div.getBoundingClientRect();
      if ((rectDiv.width != scene.m_nDivWidth ) || (rectDiv.height != scene.m_nDivHeight))
         scene.resizeCanvas( 0 );
      
      scene.ZoomToGeoPosition(lonlat,newZoomLevel, false, bSuppressEvents);
   };

   scene.GetMapLayerStack = function()
   {
      // just return the map layer stack.....................................//
      return scene.m_MapLayerStack;
   };

   scene.GetMinLOD = function()
   {
      var nSpace = Math.max( scene.m_nDivWidth  / ( scene.m_MapManager.m_tileWidth  * scene.m_nXSizeVisualBorder),
                             scene.m_nDivHeight / ( scene.m_MapManager.m_tileHeight * scene.m_nYSizeVisualBorder) );
      var nTheoMinimumLod = Math.log( nSpace ) * Math.LOG2E;

      var mls = scene.m_MapLayerStack;
      var nCustMinLod = Math.max( scene.m_nMinLodVisualBorder - scene.m_nOffsetMinLod, mls ? mls.GetMinLOD() : 0 ) ;
      return Math.max( nTheoMinimumLod, nCustMinLod );
   };

   scene.GetMinLODForWidth = function( width )
   {
      var nSpace = width / scene.m_MapManager.m_tileWidth;
      var nTheoMinimumLod = Math.log( nSpace ) * Math.LOG2E;

      var mls = scene.m_MapLayerStack;
      var nCustMinLod = Math.max( scene.m_nMinLodVisualBorder, mls ? mls.GetMinLOD() : 0 ) - scene.m_nOffsetMinLod;
      return Math.max( nTheoMinimumLod, nCustMinLod );      
   };

   scene.GetMaxLOD = function()
   {
      var mls = scene.m_MapLayerStack;
      return Math.min( mls ? mls.GetMaxLOD() : 20, scene.m_nMaxLodVisualBorder);
   };

   scene.GetCurrentZoomlevel = function()
   {
	   return scene.m_Canvas[0].m_nExactLOD;
   };

   scene.GetCenterPos = function()
   {
      // determine the center position on the viewport.......................//
      // in a geo scene this returned in lonlat and radians..................//

      // if available we use the last exact position
	  if ( scene.m_LastDefinedCenterPos != undefined){
		 return scene.m_LastDefinedCenterPos;
	  }		
      var cv = scene.getCanvas();
      var point = [ scene.m_nDivWidth / 2 - cv.getPixelLeft(), scene.m_nDivHeight / 2 - cv.getPixelTop() ];
      return ( scene.GetGeoFromPoint( point ) );
   };

   //........................................................................//
   //.internal functions.....................................................//

   scene.InternalRenderVisualObjects = function( canvas, dc, clusterData )
   {
      // iterate through objects and render them.............................//
	  var ts1 = Date.now();
      var aVO = scene.m_VOS;
      var aVOLen = aVO.length;
      var cnt;
      
      scene.m_nNumOfScalingVOInst = 0;
      VBI.Utilities.BackupFont(dc);
//      if (( clusterData != undefined ) && clusterData.bShowGrid )
//          for( var nJ = 0; nJ < aVOLen; ++nJ )
//        	  aVO[nJ].ShowGrid( canvas, dc, clusterData[nJ] );
      
      for( var nJ = 0; nJ < aVOLen; ++nJ ){
    	  if (clusterData){
    		  aVO[nJ].m_nPreDataIndex = nJ;
    		  cnt = aVO[nJ].Render( canvas, dc, clusterData[nJ] );
    	  } else
    	      cnt = aVO[nJ].Render( canvas, dc);
    	  if ( cnt != undefined ) scene.m_nNumOfScalingVOInst += cnt;
      }
      //scene.m_OverlayImage = dc.getImageData( 0, 0, scene.m_nWidthCanvas, scene.m_nHeightCanvas );
    	  
      // when there is a design vo, we render it on top of everyting else....//
      if( scene.m_DesignVO )
         scene.m_DesignVO.Render( canvas, dc );

      
      // get the canvas without the labels to store the image
      if ( !scene.m_cvObjImg )
      {
         scene.m_cvObjImg = document.createElement('canvas');
      }         
      scene.m_cvObjImg.width  = canvas.width;
      scene.m_cvObjImg.height = canvas.height;
      
         
      var labelCanvasDc = scene.m_cvObjImg.getContext('2d');
      labelCanvasDc.clearRect(0, 0, scene.m_cvObjImg.width, scene.m_cvObjImg.height);
      labelCanvasDc.drawImage( canvas, 0, 0, canvas.width, canvas.height );
      
      scene.InternalRenderLabels( canvas, dc );
      VBI.Utilities.RestoreFont(dc);

      scene.m_nLastRenderingTime = Date.now() - ts1;
   };
   
   scene.UpdatePreData4Selected = function(VOIndex, InstanceIndex)
   {
	   var clustering = scene.m_Ctx.m_Clustering;
	   if ((VOIndex!=undefined) && clustering)
	       clustering.UpdatePreData4Selected( VOIndex, InstanceIndex, scene.m_PreassembledData, scene.m_VOS, scene.m_Ctx);
   };

   scene.InternalRenderLabels = function ( canvas, dc )
   {
      VBI.Utilities.SetTextAttributes( dc, VBI.Utilities.RemToPixel( 0.75 ) + "px Lucida Sans Unicode", undefined, undefined, "left", "middle" );
      
      // iterate over VOs and call GetLabelData()
      var aVO = scene.m_VOS;
      for( var nI = 0, len = aVO.length; nI < len; ++nI )
      {
         var aLabels = aVO[nI].getLabelData( true );
         for  ( var nY = 0; nY < aLabels.length; ++nY )
         {
            var label = aLabels[nY];
            label.SetDimensions( dc );
            label.AlignLabel();
            var textcolor = label.GetLabelTextColor();
            var substrings = label.m_Text.split(/\r\n/);
            for( var nJ = 0; nJ < label.m_Pos.length; ++nJ )
            {
               for ( var nZ = 0; nZ < label.m_Pos[nJ].length; nZ++ )
               {
                  var posX = label.m_Pos[nJ][nZ][0];
                  var posY = label.m_Pos[nJ][nZ][1];
                  dc.fillStyle = label.m_BgColor;
                  var nLineHeight = textcolor.length == 1 ? VBI.Utilities.RemToPixel( 0.75 ) : VBI.Utilities.RemToPixel( 0.75 ) + 1;
                  dc.fillRect(posX, posY, label.m_Width, label.m_Height );
                  var ntransparentOffset = 0;
                  for ( var nX = 0; nX < textcolor.length; ++nX )
                  {
                	 dc.fillStyle = textcolor[nX]; 
                     var nYOffset = 0;
                     for( var nK = 0; nK < substrings.length; nK++ )
                     {
                        nYOffset = label.m_Padding + nLineHeight *  nK;
                        dc.fillText( substrings[nK], posX + label.m_Padding + ntransparentOffset, posY + nYOffset + ntransparentOffset + 7 );
                     }
                     ntransparentOffset++;
                  }
               }
            }

         }
      }
      //dc.setTransform( 1, 0, 0, 1, 0, 0 );
      
   };
   
   scene.InvalidatePreassembledData = function( clustering, lod )
   {
	   var hotVO = scene.m_HotItem.m_VO;
	   var lastHotCluster;
	   if ( hotVO != undefined && hotVO.IsClusterable())
		   lastHotCluster = hotVO.SwitchHotItemToStandard();
	   clustering.InvalidatePreassembledData( scene, lod );
      return lastHotCluster;
   };
   
   scene.ValidatePreassembledData = function()
   {
	   var newHotIndex = scene.m_PreassembledData.HotItemBBIndex;
	   scene.m_HotItem.m_Index = newHotIndex;
	   if (scene.m_HotItem.m_HitObj)
	      scene.m_HotItem.m_HitObj.m_Index = newHotIndex;
   }
   
   scene.InternalRenderLayer = function ( canvas, bClearLayer, bForceRender, bForceClustering, nNewExactLod )
   {
     var canvas0 = scene.m_Canvas[ 0 ];      
	  var lastHotCluster; // Preserve Info on Hot Item if it is an artifical cluster element 
	  var clustering = scene.m_Ctx.m_Clustering;
	  var clusteringEnabled = ( (clustering != undefined ) && clustering.m_Clusters.length );
      if ( ( scene.m_PreassembledData != undefined ) && ((clustering == undefined ) || ( clustering.m_loadCount != scene.m_PreassembledData.m_version )))
    	  lastHotCluster = scene.InvalidatePreassembledData(clustering, canvas0.m_nCurrentLOD);
      
	  var bReuseClustering = false;	   
	  if ( ( bForceRender == false ) && ( nNewExactLod != undefined ) )  // we have to check whether rendering is applicable
	  {
		 var newLOD = Math.floor( nNewExactLod ); 
		 if  ( nNewExactLod == scene.m_nLastRenderLOD )  return; // no zoom step at all -> nothing to be done
		 if ( ( newLOD == Math.floor(scene.m_nLastRenderLOD)) && ( nNewExactLod != newLOD && ( nNewExactLod > ( scene.GetMinLOD() + 0.00001 ) ) ) )
         {
			var nLodDiff = Math.abs( nNewExactLod - scene.m_nLastRenderLOD ); 
			if ( nLodDiff < scene.m_nLastRenderingTime / scene.m_nRenderTimeTarget )
				return;
 		    if ( nLodDiff < ( scene.m_nLastRenderingTime + scene.m_nLastClusteringTime ) / scene.m_nRenderTimeTarget ) 		
				bReuseClustering = true;
         }
	  } else {
		  bReuseClustering = !bForceClustering;
	  }
      // whenever the overlay layer is rendered, reset the overlay image data//
      //scene.m_OverlayImageData = null;
      scene.m_OverlayImage = null;
      
      scene.m_nLastRenderLOD = ( nNewExactLod == undefined ) ? -1 : nNewExactLod;	  
          

      // canvas is the object layer canvas...................................//
      var oldX = canvas.getPixelWidth();
      var oldY = canvas.getPixelHeight();
      canvas.setPixelWidth( scene.m_nWidthCanvas );
      canvas.setPixelHeight( scene.m_nHeightCanvas );

      // set the zoom factors here...........................................//
      scene.m_ZoomFactors[0] = oldX / scene.m_nWidthCanvas;
      scene.m_ZoomFactors[1] = oldY / scene.m_nHeightCanvas;

      var dc = canvas.getContext('2d');

      if( bClearLayer ) 
      {
         dc.clearRect(0, 0, canvas.width, canvas.height);

         // resize again.....................................................//
         canvas.setPixelWidth( oldX );
         canvas.setPixelHeight( oldY ); 
         return;
      }
      if (( !bReuseClustering || scene.m_PreassembledData == undefined ) && clusteringEnabled )
	   {
          var ts1 = Date.now();
          if (scene.m_PreassembledData)  
        	    lastHotCluster = scene.InvalidatePreassembledData(clustering, canvas0.m_nCurrentLOD);
          scene.m_PreassembledData = clustering.DoClustering( this, canvas0.m_nCurrentLOD, canvas0.m_nCurrentX, canvas0.m_nCurrentY, scene.m_nTilesX, scene.m_nTilesY, scene.m_VOS, scene.m_Ctx, lastHotCluster);
          scene.ValidatePreassembledData();
          scene.m_nLastClusteringTime = Date.now() - ts1;
 	   }
      if (bReuseClustering && scene.m_PreassembledData != undefined)
    	  scene.m_PreassembledData.m_bAlreadyRendered = false;
      // render all visual objects in the layer..............................//
      dc.clearRect( 0, 0, canvas.width, canvas.height );

      scene.InternalRenderVisualObjects( canvas, dc, scene.m_PreassembledData );
      
      // resize again........................................................//
      canvas.setPixelWidth( oldX );
      canvas.setPixelHeight( oldY );

      // call event relevant function........................................//
      scene.InternalOnRenderLayer( canvas );
      if ( scene.m_Scale )
         scene.m_Scale.Update();
   };

   scene.InternalOnMoveLayer = function( canvas, bSuppressEvents )
   {
      // a move is done notify windows about the move........................//
      scene.m_Ctx.m_Windows.NotifySceneMove( this );

      // check for subscribed action and raise it............................//
      var actions;
      if( ( actions = scene.m_Ctx.m_Actions ) && ( bSuppressEvents != true ))  
      {
         // check if action is subscribed....................................//
         var action;
         if( action = actions.findAction( "CenterChanged", scene, "Map" ) )
         {
            // determine the boundaries......................................//
            var cv = scene.m_Canvas[ scene.m_nOverlayIndex ];
            var nPixelWidth  = cv.getPixelWidth ();
            var nPixelHeight = cv.getPixelHeight();

            // get geo positions of corner points.............................//
            var lt = scene.GetPosFromPoint( [0,0] );
            var rb = scene.GetPosFromPoint( [ nPixelWidth, nPixelHeight ] );
            if ( !scene.m_Proj.m_bIsIsogonal  ){ //then we have to check the other corner points also
                var rt = scene.GetPosFromPoint( [nPixelWidth,0] );
                var lb = scene.GetPosFromPoint( [0,nPixelHeight] );
                lt = [ Math.min(lt[0],lb[0]) , Math.min(lt[1],rt[1]) ];
                rb = [ Math.max(rt[0],rb[0]) , Math.max(lb[1],rb[1]) ];
            }
            // get geo positions for viewport corner points
            var rect = scene.m_Div.getBoundingClientRect();
            var vpOffsetLeft = -cv.getPixelLeft();
            var vpOffsetTop  = -cv.getPixelTop();
            var vlt = scene.GetPosFromPoint( [ vpOffsetLeft, vpOffsetTop ] );
            var vrb = scene.GetPosFromPoint( [ vpOffsetLeft + rect.width, vpOffsetTop + rect.height ] );
            

            var params = 
            { 
               level: scene.GetCurrentZoomlevel().toString(),
               min:   lt[0].toString() + ";" + lt[1].toString() + ";0",
               max:   rb[0].toString() + ";" + rb[1].toString() + ";0",
               vpmin: vlt[0].toString() + ";" + vlt[1].toString() + ";0",
               vpmax: vrb[0].toString() + ";" + vrb[1].toString() + ";0",
            };

            scene.m_Ctx.FireAction( action, scene, this, null, params );
         }
      }

      // call into publish subscribe mechanism...............................//
      this.m_EvtCont.fire( "onMove", { canvas: canvas } );
     
      // call into event subscriptions.......................................//
      scene.m_Ctx.onMoveLayer( canvas );
   };
   
   scene.InternalOnZoomLayer = function( canvas, clickCoords )
   {
      // a move is done notify windows about the move........................//
      scene.m_Ctx.m_Windows.NotifySceneZoom( this );

      // check if the standard subscription is done and raise the submit.....//
      // event...............................................................//

      // check for subscribed action and raise it............................//
      if ( clickCoords != true ){  // suppress event mode
	      var actions;
	      if( actions = scene.m_Ctx.m_Actions )
	      {
	         // check if action is subscribed....................................//
	         var action;
	         if( action = actions.findAction( "ZoomChanged", scene, "Map" ) )
	         {
	            // determine the boundaries......................................//
	            var cv = scene.m_Canvas[ scene.m_nOverlayIndex ];
	            var nPixelWidth  = cv.getPixelWidth ();
	            var nPixelHeight = cv.getPixelHeight();
	
	            // get geo positions of corner points.............................//
	            var lt = scene.GetPosFromPoint( [0,0] );
	            var rt = scene.GetPosFromPoint( [nPixelWidth,0] );
	            var lb = scene.GetPosFromPoint( [0,nPixelHeight] );
	            var rb = scene.GetPosFromPoint( [ nPixelWidth, nPixelHeight ] );
	            
	            // get geo positions for viewport corner points
	            var rect = scene.m_Div.getBoundingClientRect();
	            var vpOffsetLeft = -cv.getPixelLeft();
	            var vpOffsetTop  = -cv.getPixelTop();
	            var vlt = scene.GetPosFromPoint( [ vpOffsetLeft, vpOffsetTop ] );
	            var vrb = scene.GetPosFromPoint( [ vpOffsetLeft + rect.width, vpOffsetTop + rect.height ] );
	
	            var params = 
	            { 
	               level: scene.GetCurrentZoomlevel().toString(),
	               min:  Math.min( lt[0], lb[0] ).toString() + ";" + Math.min( lt[1], rt[1] ).toString() + ";0",
	               max:  Math.max( rb[0], rt[0] ).toString() + ";" + Math.max( lb[1], rb[1] ).toString() + ";0",
	               vpmin: vlt[0].toString() + ";" + vlt[1].toString() + ";0",
	               vpmax: vrb[0].toString() + ";" + vrb[1].toString() + ";0",
	            };

	            if ( clickCoords != undefined && clickCoords != false )
	            {
	            	var rect = scene.m_Div.getBoundingClientRect();
	                params.x = clickCoords.x.toString() - rect.left;
	                params.y = clickCoords.y.toString() - rect.top;
                } 		
	
	            scene.m_Ctx.FireAction( action, scene, this, null, params );
	         }
	      }
      }
      
      // call into publish subscribe mechanism...............................//
      this.m_EvtCont.fire( "onZoom", { canvas: canvas } );
      
      
      // call into direct event subscriptions................................//
      scene.m_Ctx.onZoomLayer( canvas );
   };

   // .......................................................................//
   // scene events and their default implementation..........................//

   scene.InternalOnRenderLayer = function( canvas )
   {
      // call into event subscriptions.......................................//
      scene.m_Ctx.onRenderLayer( canvas );

      // do some default implementation......................................//
      if( scene.GetHomeLocation )
      {
         // canvas is the object layer canvas................................//
         var oldX = canvas.getPixelWidth();
         var oldY = canvas.getPixelHeight();


         var lonlat = [0, 0];
         var homeloc = scene.GetHomeLocation();

         lonlat[0] = homeloc[0];
         lonlat[1] = homeloc[1];

         var xy = scene.GetPointFromGeo( lonlat );

         canvas.setPixelWidth( scene.m_nWidthCanvas );
         canvas.setPixelHeight( scene.m_nHeightCanvas );

         var context = canvas.getContext('2d');
         context.clearRect( 0, 0, canvas.width, canvas.height );

         // draw a circle position...........................................//
         context.fillStyle = 'yellow';
         context.beginPath();
         context.arc(xy[0], xy[1], 5, 0, Math.PI * 2, true);
         context.closePath();
         context.fill();

         var image = null;
         if( scene.m_Ctx )
            image = scene.m_Ctx.GetImage("dummy", scene.RenderAsync.bind( ) );

         if( image )
            context.drawImage( image, xy[0] - image.naturalWidth / 2, xy[1] - image.naturalHeight );

         // resize again.....................................................//
         canvas.setPixelWidth( oldX ); 
         canvas.setPixelHeight( oldY );
      }
   };

   // .......................................................................//
   // helper move functions..................................................//

   scene.MoveObject = function( o, x, y, width, height )
   {
      o.m_pixelLeft = Math.round(x);
      o.m_pixelTop  = Math.round(y);
      o.style.left = o.m_pixelLeft.toString() + "px";
      o.style.top = o.m_pixelTop.toString() + "px";
      if (width !== undefined){
          o.m_pixelWidth =  Math.round(width);
          o.style.width = o.m_pixelWidth.toString() + "px";
      }
      if (height !== undefined){
          o.m_pixelHeight = Math.round(height);
          o.style.height = o.m_pixelHeight.toString() + "px";
      }
   };
   
   scene.InvalidateCanvas = function ( canvas )
   {
      var context = canvas.getContext("2d");
      context.fillStyle = 'white';
      context.clearRect( 0, 0, canvas.width, canvas.height );
      canvas.m_bInvalid = true;
   };

   scene.MoveCanvas = function ( canvas, x, y, width, height )
   {
      scene.MoveObject( scene.m_Canvas[scene.m_nOverlayIndex ], x, y, width, height );
      scene.MoveObject( canvas, x, y, width, height );
   };

   scene.MoveOnlyThisCanvas = function( canvas, x, y, width, height )
   {
      scene.MoveObject( canvas, x, y, width, height );
   };

   scene.MoveMap = function ( dx, dy )
   {
      VBI.m_bTrace && VBI.Trace( "MoveMap" + " DX:" + dx + " DY:" + dy );
      
      var tmpCanvas = scene.m_Canvas[3];
      var canvas = scene.m_Canvas[0];
      var currentCanvas = ( tmpCanvas.m_bCanvasValid ? tmpCanvas : canvas ); 

      var mapMan = scene.m_MapManager;

      var nPixelWidth  = currentCanvas.getPixelWidth ();
      var nPixelHeight = currentCanvas.getPixelHeight();
      var nPosX = currentCanvas.getPixelLeft() + dx;
      var nPosY = currentCanvas.getPixelTop()  + dy;
      
      var tw = mapMan.m_tileWidth,         th = mapMan.m_tileHeight;

       // width of a current tile...........................................//
      var nCurrentTilePixelWidth  = nPixelWidth  / scene.m_nTilesX;
      var nCurrentTilePixelHeight = nPixelHeight / scene.m_nTilesY;

      var nStretch = nPixelHeight / scene.m_nHeightCanvas;
  
      // Check whether move goes too far North or too far South
      var nLodDist = ( 1 << canvas.m_nCurrentLOD );
      var uxyLU = [ nLodDist , nLodDist ];
      var uxyRL = [ nLodDist , nLodDist ];
      scene.m_Proj.LonLatToUCS ( scene.m_nBorderMinPoint, uxyLU );
      scene.m_Proj.LonLatToUCS ( scene.m_nBorderMaxPoint, uxyRL );
      
      if ( ( dy > 0 && ( ( th * nStretch * (currentCanvas.m_nCurrentY - uxyLU[1] )  - nPosY ) < -scene.m_nMaxPixelBeyondPoles ) ) ||
           ( dy < 0 && ( ( th * nStretch * (currentCanvas.m_nCurrentY - uxyRL[1] ) + scene.m_nDivHeight - nPosY ) > scene.m_nMaxPixelBeyondPoles ) ) )
      {
         if (dx==0) return;
         dy = 0;  // on diagonal moves we eliminate just the y-component
         nPosY  = currentCanvas.getPixelTop();
      }
      
      if ( scene.m_bXBorderExists  &&
         ( ( dx > 0 && ( ( tw * nStretch * (currentCanvas.m_nCurrentX - uxyLU[0] )  - nPosX ) < -scene.m_nMaxPixelBeyondPoles ) ) ||
           ( dx < 0 && ( ( tw * nStretch * (currentCanvas.m_nCurrentX - uxyRL[0] ) + scene.m_nDivWidth - nPosX ) > scene.m_nMaxPixelBeyondPoles ) ) ) )
      {
         if (dy==0) return;
         dx = 0;
         nPosX = currentCanvas.getPixelLeft();
      }

      var nOffsetX = 0;
      var nOffsetY = 0;
      var nTemp;
      // 
      // First we determine whether a tile shift is required
      // 
      if( ( dx > 0 ) && (nTemp = nPosX + scene.m_nMapMoveXPreLoad) > 0)  
      {                         // left side is missing tiles, calc number of missed tiles //
    	 nOffsetX = Math.ceil(nTemp / nCurrentTilePixelWidth);
      } else
      if ( ( dx < 0 ) && ( (nTemp = scene.m_nMapMoveXPreLoad + scene.m_nDivWidth - (nPosX + nPixelWidth)) > 0))
      {                        // right side is missing tiles ... //
         nOffsetX = -Math.ceil(nTemp / nCurrentTilePixelWidth);
      }     
      var newLeft = currentCanvas.m_nCurrentX - nOffsetX;

      if( (dy > 0 ) && (nTemp = nPosY + scene.m_nMapMoveYPreLoad) > 0)
      {                       // top side is missing tiles ... //
         nOffsetY = Math.ceil(nTemp / nCurrentTilePixelHeight);
      } else
      if ( (dy < 0 ) && (nTemp = (scene.m_nMapMoveYPreLoad + scene.m_nDivHeight - (nPosY + nPixelHeight))) > 0)
      {                       // bottom side is missing tiles ...  //
         nOffsetY = -Math.ceil(nTemp / nCurrentTilePixelHeight);
      }
      var newTop = currentCanvas.m_nCurrentY - nOffsetY;

      // then we execute the move
      // to do so we determine one column block and/or one row block which has to be requested newly
      // the remaining part is copied from old position to new position
      // in case of iphone we simply request the tiles as the copy process does not work well on it
      //
      var mls = scene.m_MapLayerStack;
      var bSingleBMP = mls ? mls.m_bSingleBMP : false;
      
      if ( nOffsetX || nOffsetY )  
      {
    	 var nPendingOffsetX = nPendingOffsetY = 0;
         // if not yet done, invalidate the second canvas as we would have to request here also
         if ( !scene.m_Canvas[1].m_bInvalid ){
            scene.InvalidateCanvas( scene.m_Canvas[1] );
         }
 
         scene.MoveCanvas(canvas, canvas.getPixelLeft() + dx, canvas.getPixelTop() + dy);
		 if ( tmpCanvas.m_bCanvasValid ){
			if ( tmpCanvas.m_nTilesBefSwitch < tmpCanvas.m_nForceSwitchLimit ) {
		       scene.SwitchTmpCanvasToActive();
			}
			else{
    		   nPendingOffsetX = tmpCanvas.m_nOffsetX;
    		   nPendingOffsetY = tmpCanvas.m_nOffsetY;
			}
		 }

		 tmpCanvas.m_nTilesBefSwitch   = ( bSingleBMP || Math.abs( nOffsetX ) >= scene.m_nTilesX || Math.abs( nOffsetY ) >= scene.m_nTilesY ) ? 
	                                	 1 : ( scene.m_nTilesX - Math.abs(nOffsetX) ) * ( scene.m_nTilesY - Math.abs(nOffsetY) );
		 tmpCanvas.m_nForceSwitchLimit = Math.ceil( tmpCanvas.m_nTilesBefSwitch / 2 );   
		 tmpCanvas.m_nOffsetX = nOffsetX + nPendingOffsetX;
		 tmpCanvas.m_nOffsetY = nOffsetY + nPendingOffsetY;
		 scene.MoveOnlyThisCanvas(tmpCanvas, nPosX - nOffsetX * nCurrentTilePixelWidth, nPosY - nOffsetY * nCurrentTilePixelHeight, nPixelWidth, nPixelHeight);
		  
		 var context = tmpCanvas.getContext("2d");
		 context.clearRect( 0 , 0 , canvas.getPixelWidth() , canvas.getPixelHeight());
		 if (mapMan.RequestTiles(tmpCanvas, scene.m_MapLayerStack, newLeft, newTop, scene.m_nTilesX, scene.m_nTilesY, 0, 0, 0, 0,canvas.m_nCurrentLOD, false))
			 tmpCanvas.m_bCanvasValid = true;
		 else
			 scene.SwitchTmpCanvasToActive();
      } else
      {
         // just set the new positions.......................................//
         scene.MoveCanvas(canvas, canvas.getPixelLeft() + dx, canvas.getPixelTop() + dy );
         scene.MoveObject(scene.m_Canvas[1], scene.m_Canvas[1].getPixelLeft() + dx, scene.m_Canvas[1].getPixelTop() + dy);
         if (tmpCanvas.m_bCanvasValid)
            scene.MoveOnlyThisCanvas(tmpCanvas, nPosX, nPosY );
      }

      var aVO = scene.m_VOS;
      var bRerender = false;
      for( var nI = 0, len = aVO.length; nI < len; ++nI )
      {
         if ( aVO[nI].m_Label.length > 0 && aVO[nI].CalculateLabelPos ) 
         {
            bRerender = true;
            break;
         }

      }
      if ( bRerender  )
      {
         if ( scene.m_cvObjImg )
         {
            var ctx = scene.m_Canvas[ scene.m_nOverlayIndex ].getContext("2d");
            ctx.clearRect(0, 0, scene.m_Canvas[ scene.m_nOverlayIndex ].width, scene.m_Canvas[ scene.m_nOverlayIndex ].height);
            ctx.drawImage( scene.m_cvObjImg, 0, 0, scene.m_cvObjImg.width, scene.m_cvObjImg.height );
         }
         VBI.Utilities.BackupFont(ctx);	   
         scene.InternalRenderLabels(scene.m_Canvas[ scene.m_nOverlayIndex ], ctx);
         VBI.Utilities.RestoreFont(ctx);	   
      }

      scene.InternalOnMoveLayer(scene.m_Canvas[ scene.m_nOverlayIndex ]);
      scene.m_LastDefinedCenterPos = undefined;

   };
   
   scene.AdaptZoomFactor = function( canvas, factor, xOffset, yOffset, targetedTicks )
   {
      var result = {};
      result.bZoomNotPossible = true;  // set to false if all checks are passed successfully
      
      var nMaxTiles = ( 1 << canvas.m_nCurrentLOD);

      if (( canvas.m_nCurrentY < 0 ) && ( yOffset < - canvas.m_nCurrentY * (canvas.getPixelHeight() / scene.m_nTilesY)))
         return result;  // GeoPos is above northpole
      if ((( canvas.m_nCurrentY + scene.m_nTilesY ) > nMaxTiles ) && (yOffset > ( nMaxTiles - canvas.m_nCurrentY) * ( canvas.getPixelHeight() / scene.m_nTilesY )))
         return result;  // GeoPos is beyond southpole
      if (factor < 1 )
      {
         var nNumberOfVisibleEarths = Math.max (
                ( scene.m_nDivWidth  / (canvas.getPixelWidth()  * scene.m_nXSizeVisualBorder) ) * ( scene.m_nTilesX / nMaxTiles ),
                ( scene.m_nDivHeight / (canvas.getPixelHeight() * scene.m_nYSizeVisualBorder) ) * ( scene.m_nTilesY / nMaxTiles ) );
         if ( factor < nNumberOfVisibleEarths ) // means NumEarths / factor would have result > 1
         {
            if ( (nNumberOfVisibleEarths >= 1) && (factor!=0) )
               return result;   // no zoom or zoom in wrong direction required -> skip

            factor = nNumberOfVisibleEarths; // change factor to max, so that we see exactly one earth.
            bAdaptToEvenLod = false;
         }
      }
      var bAdaptToEvenLod = targetedTicks && ( scene.m_nZoomMode || (factor == scene.m_nLodFactorZoomIn)||(factor == scene.m_nLodFactorZoomOut));
      var exactLod = canvas.m_nExactLOD + Math.log( factor ) * Math.LOG2E;
      var minLOD = scene.GetMinLOD();
      if ((minLOD != Math.round(minLOD)) &&  (factor != 1.0) && ( canvas.m_nExactLOD <= Math.ceil(minLOD)  ) && (Math.round( targetedTicks * exactLod ) == Math.round( targetedTicks * minLOD )))  // only in case we are at minLod we ommit the rounding.
          bAdaptToEvenLod = false;
      
      if ( bAdaptToEvenLod && Math.round( targetedTicks * exactLod ) != targetedTicks * exactLod )
      {
         exactLod = Math.round( targetedTicks * exactLod ) / targetedTicks;
         factor = Math.pow(2, exactLod - canvas.m_nExactLOD);
      } else
	  {
          if ( exactLod < minLOD ){
              exactLod = minLOD;
              factor = Math.pow(2, exactLod - canvas.m_nExactLOD);
          }
	  }
      result.factor = factor;
      result.nNewLod = Math.floor( exactLod );     
      result.lodFallsOnInteger = ( Math.round(exactLod) == exactLod );

      result.bZoomNotPossible = ( ( exactLod > scene.GetMaxLOD() ) ||
                                  ( exactLod < minLOD ));

      return result;
   };

   //........................................................................//
   // map zoom occured.......................................................//

   scene.ZoomMap = function( factor, xOffset, yOffset, targetedTicks, bSuppressEvent )
   {
	  if ( scene.m_Canvas[3].m_bCanvasValid ){
	         scene.SwitchTmpCanvasToActive();
      }
	   
      var canvas      = scene.m_Canvas[0];
      var otherCanvas = scene.m_Canvas[1];
      var mapMan = scene.m_MapManager;
      var tw = mapMan.m_tileWidth,         th = mapMan.m_tileHeight;
      var nTilesX,nTilesY,nPosX = 0,nPosY = 0; 

      // get old canvas settings
      var oldLeft  = canvas.getPixelLeft(),  oldTop    = canvas.getPixelTop();
      var oldWidth = canvas.getPixelWidth(), oldHeight = canvas.getPixelHeight();
      var otherPixelWidth = otherCanvas.getPixelWidth();
     
      // Adapt factor to MinimalLod and to even lod if required and check whether we can continue
      var zoomData = scene.AdaptZoomFactor( canvas, factor, xOffset, yOffset, targetedTicks);
      if ( zoomData.bZoomNotPossible )  
         return;
      factor = zoomData.factor; // corrected zoom factor
      var nNewLod = zoomData.nNewLod;
      VBI.m_bTrace && VBI.Trace ("Zoom by "+factor+" to "+xOffset+"/"+yOffset);
      
      // Moving current canvas accordingly
      var newWidth  = Math.round( oldWidth  * factor );
      var newHeight = Math.round( oldHeight * factor );
      var newLeft   = Math.round( oldLeft - ((factor - 1) * xOffset ) ); 
      var newTop    = Math.round( oldTop  - ((factor - 1) * yOffset ) );

      if (factor < 1) // for zoom out we have to check whether we run out of north/south limits
      {               // if we would do so we have to adapt yOffset so we zoom exactly to the limit
         var nLodDist = ( 1 << canvas.m_nCurrentLOD );

         var uxyLU = [ nLodDist , nLodDist ];
         var uxyRL = [ nLodDist , nLodDist ];
         scene.m_Proj.LonLatToUCS ( scene.m_nBorderMinPoint, uxyLU );
         scene.m_Proj.LonLatToUCS ( scene.m_nBorderMaxPoint, uxyRL );
         
         var nNewStretch = newHeight / scene.m_nHeightCanvas;
         var nTargetDistanceToNorthernBorder = ( canvas.m_nCurrentY - uxyLU[1] ) * th * nNewStretch - newTop;

         if ( nTargetDistanceToNorthernBorder < -scene.m_nMaxPixelBeyondPoles ) {
            newTop    = Math.round ( th * ( canvas.m_nCurrentY - uxyLU[1] ) * nNewStretch + scene.m_nMaxPixelBeyondPoles );
            yOffset   = ( oldTop - newTop ) / (factor - 1);
         }
         else {   // no zoom out can violate against both conditions as MaxPixelBeyondPoles and MinLod are set accordingly 
            var nTargetDistanceToSouthernBorder = th * ( canvas.m_nCurrentY - uxyRL[1] ) * nNewStretch + scene.m_nDivHeight - newTop;
            if ( nTargetDistanceToSouthernBorder > scene.m_nMaxPixelBeyondPoles )
            {
               newTop    = Math.round ( th * ( canvas.m_nCurrentY - uxyRL[1] ) * nNewStretch + scene.m_nDivHeight - scene.m_nMaxPixelBeyondPoles );
               yOffset   = ( oldTop - newTop ) / (factor - 1);
            }
         }
         if ( scene.m_bXBorderExists ){
            var nTargetDistanceToWestBorder = ( canvas.m_nCurrentX - uxyLU[0] ) * tw * nNewStretch - newLeft;
            if ( nTargetDistanceToWestBorder < -scene.m_nMaxPixelBeyondPoles ) {
               newLeft    = Math.round ( tw * ( canvas.m_nCurrentX - uxyLU[0] ) * nNewStretch + scene.m_nMaxPixelBeyondPoles );
               xOffset   = ( oldLeft - newLeft ) / (factor - 1);
            }
            var nTargetDistanceToEastBorder = ( canvas.m_nCurrentX - uxyRL[0] ) * tw * nNewStretch + scene.m_nDivWidth - newLeft;
            if ( nTargetDistanceToEastBorder > scene.m_nMaxPixelBeyondPoles ) {
               newLeft    = Math.round ( tw * ( canvas.m_nCurrentX - uxyRL[0] ) * nNewStretch + scene.m_nDivWidth - scene.m_nMaxPixelBeyondPoles );
               xOffset   = ( oldLeft - newLeft ) / (factor - 1);
            }
         }
      }

      scene.MoveCanvas(canvas, newLeft, newTop, newWidth, newHeight);

      var newTilePixelWidth  = newWidth / scene.m_nTilesX;
      var newTilePixelHeight = newHeight / scene.m_nTilesY;

      // we request new tiles if LOD changes or we run out of viewport
      var bRequestNewTiles   = false;
      if ( nNewLod == canvas.m_nCurrentLOD ) // no lod switch..........................//
      {
         if ( !otherCanvas.m_bInvalid ){
            // we have to correct position of second canvas as it might be visible also
            var otherCanvasWidth  = Math.round( otherPixelWidth * factor );
            var otherCanvasHeight = Math.round( otherCanvas.getPixelHeight() * factor );
            // if we have enought memory we can stretch, otherwise we clear
            if ( ( otherCanvasWidth <= scene.m_nMaxCanvasDimension ) && ( otherCanvasHeight <= scene.m_nMaxCanvasDimension ) )
            {
               var otherPixelLeft = otherCanvas.getPixelLeft();
               var otherPixelTop  = otherCanvas.getPixelTop();
               
               var otherCanvasLeft   = Math.round( otherPixelLeft - ((factor - 1) * ( xOffset + oldLeft - otherPixelLeft) ) ); 
               var otherCanvasTop    = Math.round( otherPixelTop  - ((factor - 1) * ( yOffset + oldTop  - otherPixelTop ) ) );
               scene.MoveObject( otherCanvas, otherCanvasLeft, otherCanvasTop, Math.round( otherPixelWidth * factor ), Math.round( otherCanvas.getPixelHeight() * factor ));
            }
            else
            {
               scene.InvalidateCanvas( scene.m_Canvas[1] );
            }
         }
         canvas.m_nExactLOD = canvas.m_nCurrentLOD + Math.log(newTilePixelWidth / tw) * Math.LOG2E;
         
         // when we run out of the viewport then correct it..................//
         if( newLeft > 0 || newTop > 0 || (newLeft + newWidth < scene.m_nDivWidth ) || (newTop + newHeight < scene.m_nDivHeight))
         {
            bRequestNewTiles = true;

            nTilesX = -Math.ceil(newLeft / newTilePixelWidth );
            nTilesY = -Math.ceil(newTop / newTilePixelHeight );

            nPosX = newLeft + nTilesX * newTilePixelWidth;
            nPosY = newTop + nTilesY * newTilePixelHeight;
            newLeft = canvas.m_nCurrentX + nTilesX;
            newTop  = canvas.m_nCurrentY + nTilesY;

            VBI.m_bTrace && VBI.Trace("run out viewport newTop="+newTop+" nTilesY="+nTilesY+" nPosY="+nPosY+" yOffset="+yOffset+"\n");
         }
      }
      else
      {                                          // LOD changes
         bRequestNewTiles = true;
         
         var nLodDistance = Math.pow( 2, canvas.m_nCurrentLOD - nNewLod );
         var nCurrentStretch = oldHeight / scene.m_nHeightCanvas;

         // Viewport Middle is calculated in unstretched pixels now. We "move" from origin to offset point which remains fix
         // then we go back to origin by zoomed offset followed by zoomed (left + div/2) to new middle point
         var newViewportMidX = xOffset / nCurrentStretch + ( nLodDistance * ( scene.m_nDivWidth / 2 - oldLeft - xOffset ));
         var newViewportMidY = yOffset / nCurrentStretch + ( nLodDistance * ( scene.m_nDivHeight / 2 - oldTop - yOffset ));

         if ( nNewLod > canvas.m_nCurrentLOD )   // Zoom in
         {
            nTilesX = Math.round( newViewportMidX / nLodDistance / tw - scene.m_nTilesX / 2 );
            nTilesY = Math.round( newViewportMidY / nLodDistance / th - scene.m_nTilesY / 2 );
            
            nPosX = Math.ceil( newLeft + nTilesX * newTilePixelWidth *  nLodDistance);
            nPosY = Math.ceil( newTop  + nTilesY * newTilePixelHeight * nLodDistance);
         }
         else                                    // Zoom Out
         {
            var nOddPartOfX = (( canvas.m_nCurrentX % nLodDistance ) + nLodDistance ) % nLodDistance;
            var nOddPartOfY = (( canvas.m_nCurrentY % nLodDistance ) + nLodDistance ) % nLodDistance;
   
            nTilesX = Math.round( ( newViewportMidX / tw  + nOddPartOfX )/ nLodDistance - scene.m_nTilesX / 2 );
            nTilesY = Math.round( ( newViewportMidY / th  + nOddPartOfY )/ nLodDistance - scene.m_nTilesY / 2 );

            // calculate the new position and align when necessary..............//
            nPosX = newLeft + newTilePixelWidth  * ( nTilesX * nLodDistance - nOddPartOfX );
            nPosY = newTop  + newTilePixelHeight * ( nTilesY * nLodDistance - nOddPartOfY );
         } 

         newLeft = Math.floor ( canvas.m_nCurrentX / nLodDistance + nTilesX );
         newTop  = Math.floor ( canvas.m_nCurrentY / nLodDistance + nTilesY );
         newWidth  = zoomData.lodFallsOnInteger ? ( tw  * scene.m_nTilesX ) : Math.ceil(newWidth * nLodDistance );
         newHeight = zoomData.lodFallsOnInteger ? ( th * scene.m_nTilesY ) : Math.ceil(newHeight * nLodDistance);
      }

      var newExactLod = nNewLod + Math.log(newWidth / scene.m_nWidthCanvas) * Math.LOG2E;  
      if (bRequestNewTiles) // if lod changes or we are running out of viewport, new request is done
      {
         otherCanvas.m_nExactLOD = newExactLod;
         scene.MoveCanvas(otherCanvas, nPosX, nPosY,newWidth, newHeight );
   
         var context = otherCanvas.getContext("2d");
         context.fillStyle = 'white';
         context.clearRect( 0, 0, context.canvas.width, context.canvas.height );
   
         // set properties of new canvas.....................................//
         scene.m_MapManager.RequestTiles(scene.m_Canvas[1], scene.m_MapLayerStack, newLeft, newTop, scene.m_nTilesX, scene.m_nTilesY, 0, 0, 0, 0, nNewLod, true);
         canvas.m_Scene.ToggleCanvas(canvas.m_Scene);
      }
      
      scene.InternalRenderLayer(scene.m_Canvas[ scene.m_nOverlayIndex ], false, bRequestNewTiles, bRequestNewTiles, newExactLod);
      // if new tiles are requested we always render, optherwise its up to the engine
      
      // update the current lod in the navigation control (for mobile devices)
      if ( scene.m_bNavControlVisible && scene.m_NavControl ){
           scene.m_NavControl.AdjustScrollPoint( nNewLod );
      }
      
      scene.InternalOnMoveLayer( canvas, bSuppressEvent );

      // call internal functionto be able to do additional default behavior...//
      scene.InternalOnZoomLayer( scene.m_Canvas[ scene.m_nOverlayIndex ], bSuppressEvent );
      scene.m_LastDefinedCenterPos = scene.m_LastZoomArea = undefined;
   };
   
   scene.ZoomOtherCanvas = function( otherCanvas, canvas, factor, xOffset, yOffset )
   {
     
      var newLeft = Math.round( otherCanvas.getPixelLeft() - ((factor - 1) * xOffset ) ); 
      var newTop = Math.round( otherCanvas.getPixelTop() - ((factor - 1) * yOffset ) );

      var otherCanvasWidth  = Math.round( otherCanvas.getPixelWidth() * factor );
      var otherCanvasHeight = Math.round( otherCanvas.getPixelHeight() * factor );

      scene.MoveObject( otherCanvas, newLeft, newTop, otherCanvasWidth, otherCanvasHeight);
   };


   // do an animated zoom to a specific location.............................// 
   scene.AnimateZoom = function( zoomIn, clientX, clientY, interval, event )
   {
	  var bZeroZoom = false; 
      var clickCoords = ((event != undefined && event.clientX != undefined) ? { x: event.clientX, y: event.clientY} : undefined );
	   
      var nCurrentLOD = scene.m_Canvas[0].m_nExactLOD;
      var targetedTicksInALod = 2 * scene.m_nTicksInALod; 
      
      if( scene.m_AnimZoomTimer && (scene.m_nAnimDirection == zoomIn)){  // Animation in same direction already running
    	  if ( scene.m_nAnimOpenTicks > 22 ) return;
          window.clearInterval( scene.m_AnimZoomTimer );
          scene.m_nAnimOpenTicks += targetedTicksInALod;
          scene.m_nAnimTicks  += targetedTicksInALod;
      } else
  	  {
	      // We zoom that so many times that we reach a even LOD level. In case the next LOD level is only 
	      // 1 or 2 ticks away we target the LOD level after the next one.
    	  if ( nCurrentLOD != Math.round( nCurrentLOD )){
    	      var nCurrentTicks = Math.round(( nCurrentLOD - Math.floor( nCurrentLOD )) * targetedTicksInALod);
    	      scene.m_nAnimTicks = 1 + ( zoomIn ? targetedTicksInALod - nCurrentTicks : nCurrentTicks );
    	  } else
    		  scene.m_nAnimTicks = 1 + targetedTicksInALod;

    	  if ( scene.m_nAnimTicks == 1 ) {
              bZeroZoom = true; 
              scene.m_nAnimTicks++;
           }  
	      
		  scene.m_nAnimOpenTicks = scene.m_nAnimTicks;
		  scene.m_nAnimDirection = zoomIn;
		  if (scene.m_AnimZoomTimer) window.clearInterval( scene.m_AnimZoomTimer ); // we had a running anim in the other direction
  	  }
      
      var correctedInterval = interval * targetedTicksInALod / Math.max( 5, ( scene.m_nAnimOpenTicks - 1) );
      scene.AnimZoomTarget = Math.min(scene.GetMaxLOD(),Math.max(scene.GetMinLOD(),nCurrentLOD + ( scene.m_nAnimDirection ? 1 : -1 ) * ( scene.m_nAnimOpenTicks - 1) / targetedTicksInALod ));
      scene.m_AnimZoomTimer = window.setInterval(
            function ()
            {
               if( --scene.m_nAnimOpenTicks )
               {   
                  var rc = scene.m_Canvas[0].getBoundingClientRect();
                  var oldLod = scene.m_Canvas[0].m_nExactLOD;
                  var zoomFactor = bZeroZoom ? 1.0 : (scene.m_nAnimDirection ? scene.m_nLodFactorZoomInHalf : scene.m_nLodFactorZoomOutHalf);
                  scene.ZoomMap( zoomFactor, clientX - rc.left, clientY - rc.top, targetedTicksInALod, true );
                  if (( scene.m_Canvas[0].m_nExactLOD != oldLod ) || (Math.abs(scene.AnimZoomTarget-oldLod) > scene.m_nMaxAnimLodDiff) )
                     return; // if the Lod doesn't change we can continue and stop animation
               }
               
               scene.InternalOnMoveLayer( scene.m_Canvas[ scene.m_nOverlayIndex ], clickCoords );
               scene.InternalOnZoomLayer( scene.m_Canvas[ scene.m_nOverlayIndex ], clickCoords );

               // clear the animation zoom timer............................. 
               if( scene.m_AnimZoomTimer )
               {
            	  scene.m_nAnimOpenTicks = scene.m_nAnimationTicks = scene.m_nAnimationDirection = scene.AnimZoomTarget = undefined;
                  window.clearInterval( scene.m_AnimZoomTimer );
                  scene.m_AnimZoomTimer = null;
               }
            }, correctedInterval );
   };

   scene.AnimateZoomToGeo = function( lonlat, GeoZoomToLOD, interval )
   {
      var nCurrentLOD = scene.m_Canvas[0].m_nExactLOD;
      if ( nCurrentLOD == GeoZoomToLOD ) return;
      var targetedTicksInALod = 2 * scene.m_nTicksInALod; 

      if( scene.m_AnimZoomTimer ){
          window.clearInterval( scene.m_AnimZoomTimer );
      } 

      scene.m_nAnimTicks = 2 + Math.abs(Math.round(( nCurrentLOD - GeoZoomToLOD) * targetedTicksInALod));
	  scene.m_nAnimOpenTicks = scene.m_nAnimTicks;
	  var nSourceLod = nCurrentLOD;
	  var nTargetLod = GeoZoomToLOD;
      
      var correctedInterval = interval * targetedTicksInALod / scene.m_nAnimTicks;
      scene.m_AnimZoomTimer = window.setInterval(
            function ()
            {
               if( --scene.m_nAnimOpenTicks )
               {   
                  scene.ZoomToZoomlevel (lonlat, nTargetLod - ( scene.m_nAnimOpenTicks - 1 ) * ( nTargetLod - nSourceLod) / ( scene.m_nAnimTicks - 1), true );
                  return;
               }

               scene.InternalOnZoomLayer( scene.m_Canvas[ scene.m_nOverlayIndex ] );
               
               // clear the animation zoom timer............................. 
               if( scene.m_AnimZoomTimer )
               {
            	  scene.m_nAnimOpenTicks = scene.m_nAnimationTicks = undefined;
                  window.clearInterval( scene.m_AnimZoomTimer );
                  scene.m_AnimZoomTimer = null;
                  scene.InternalRenderLayer( scene.m_Canvas[ scene.m_nOverlayIndex ], false, false, false, scene.m_Canvas[ 0 ].m_nExactLOD );
               }
            }, correctedInterval );
   };

   // ........................................................................//
   // helper functions.......................................................//

   scene.IsTransparent = function( clientX, clientY )
   {
      // check if the applied coordinate is on a transparent pixel...........//
      // the coordinates are client relative and are transformed here to.....//
      // canvas relative coords..............................................//

      var oCanvas = scene.m_Canvas[ scene.m_nOverlayIndex ];
      if( !oCanvas ) return false;

      var rect = oCanvas.getBoundingClientRect();
      var nx = Math.round( ( clientX - rect.left ) / scene.m_ZoomFactors[0] );
      var ny = Math.round( ( clientY - rect.top ) / scene.m_ZoomFactors[1] );

      // check for stored overlay image data.................................//
      //if( !scene.m_OverlayImageData )
      if( !scene.m_OverlayImage )
      {
         var ctx = oCanvas.getContext("2d");
         //scene.m_OverlayImageData = ctx.getImageData( 0, 0, scene.m_nWidthCanvas, scene.m_nHeightCanvas ).data;      
         scene.m_OverlayImage = ctx.getImageData( 0, 0, scene.m_nWidthCanvas, scene.m_nHeightCanvas );
      }

      var nIdx = ( ny * scene.m_nWidthCanvas + nx ) * 4 + 3;
      if( ( nIdx < 0 ) || ( nIdx >= ( scene.m_nWidthCanvas * scene.m_nHeightCanvas * 4 ) ) )
      {
         VBI.m_bTrace && VBI.Trace( "GeoScene::IsTransparent coordinate out of bounds");
         return true;
      }

      var ImageData = scene.m_OverlayImage.data;
      //var alpha = scene.m_OverlayImageData[ nIdx ];
      var alpha = ImageData[ nIdx ];
      return alpha ? false : true;
   };

   scene.GetCurrentZoomFactors = function()
   {
      // for performance reasons we use the pre calculated factors...........//
      return scene.m_ZoomFactors;         
   };

   scene.ToggleCanvas = function( scene )
   {
      // toggle canvas.......................................................//
      var tmp = scene.m_Canvas[0];
      scene.m_Canvas[0] = scene.m_Canvas[1];
      scene.m_Canvas[1] = tmp;

      scene.m_Canvas[0].style.opacity = 0.0;
      scene.m_Canvas[1].style.opacity = 1.0;

      // toggle the zindex as well...........................................//
      tmp = scene.m_Canvas[0].style.zIndex;
      scene.m_Canvas[0].style.zIndex = scene.m_Canvas[1].style.zIndex;
      scene.m_Canvas[1].style.zIndex = tmp;

      // do blending over the canvas.........................................//
      scene.BlendCanvas();
   };

   scene.BlendCanvas = function()
   {
      if (scene.m_BlendTimer != null)
         window.clearInterval( scene.m_BlendTimer );

      // get the current canvas opacity......................................//
      var nCurOpacity = parseFloat( scene.m_Canvas[0].style.opacity );

      // increase the opacity step by step...................................//
      if (nCurOpacity < 1.0)
      {
         scene.m_BlendTimer = window.setInterval(scene.BlendCanvas, 40);
         scene.m_Canvas[0].style.opacity = Math.min(nCurOpacity + 0.1, 1.0);
         if (VBI.m_bIsMyChromeTest){
            scene.m_Canvas[0].style.display='none';
            scene.m_Canvas[0].offsetHeight; // no need to store this anywhere, the reference is enough
            scene.m_Canvas[0].style.display='block';
         }
      } else
      {
         window.clearInterval( scene.m_BlendTimer );
      }
   };

   // .......................................................................//
   // determine the point from the geoposition...............................//

   scene.GetNearestPosArray = function( posarray )
   {
      // do a copy of the array..............................................//
      var pa = posarray.slice();
      var nLen = Math.floor( pa.length / 3 ) * 3;

      var nx = pa[0];
      var ny = pa[1];
      var minX = nx, maxX = nx;
      var minY = ny, maxY = ny;

      for( var nJ = 3; nJ < nLen; nJ+=3 )
      {
         // determine the nearest position around............................//
         while( pa[ nJ ] - nx > 180 )
            pa[nJ] -= 360;
          while( nx - pa[ nJ ] > 180 )
             pa[nJ] += 360;

         // next nx..........................................................//
         nx = pa[ nJ ];

         // do minmax........................................................//
         ny = pa[ nJ + 1 ];
         if( minX > nx ) minX = nx; 
         if( maxX < nx ) maxX = nx;
         if( minY > ny ) minY = ny; 
         if( maxY < ny ) maxY = ny;
      }

      // set the minimum and maximum values..................................//
      pa.m_MinX = minX;
      pa.m_MaxX = maxX;
      pa.m_MinY = minY;
      pa.m_MaxY = maxY;

      return pa;
   };

   scene.GetNearestPos = function( pos, nearpos )
   {
      // do a copy of the pos................................................//
      var p = pos.slice();

      // determine the nearest position around...............................//
      var nx = nearpos[0];
      while( p[0] - nx > 180 )
         p[0] -= 360;
      while( nx - p[0] > 180 )
          p[0] += 360;
      return p;
   };

   scene.GetPointArrayFromPosArray = function( posarray, adjust )
   {
      // in a geoscene the pos is specified as lon/lat/height, where lon and.//
      // lat are specified in degrees, convert them to radians...............//
      // the posarray is one large array with triples lon/lat,height.........//

      var lonlat = [ 0.0, 0.0 ], ret = [];
      var cv = scene.m_Canvas[0];
      var nMaxLODTiles = (1 << cv.m_nCurrentLOD );

      var tilePixelWidth = scene.m_nWidthCanvas / scene.m_nTilesX;
      var tilePixelHeight = scene.m_nHeightCanvas / scene.m_nTilesY;

      // normalize complete dimension on current LOD.........................//
      var completeX = nMaxLODTiles * tilePixelWidth;
      var completeY = nMaxLODTiles * tilePixelHeight;

      // adjust to current zoom factor for the rendering canvas..............//
      var cvo = scene.m_Canvas[ scene.m_nOverlayIndex ];
      var fx = cvo.getPixelWidth()/scene.m_nWidthCanvas;
      var fy = cvo.getPixelHeight()/scene.m_nHeightCanvas;

      // geo connversion routine.............................................//
      var lltucs = scene.m_Proj.LonLatToUCS ;

      var ucs = [0,0], mul = Math.PI / 180.0;
      var proj = scene.m_Proj;
      var ucs_min   = proj.m_nUCSMin  * completeX;
      var ucs_max   = proj.m_nUCSMax  * completeX;
      var ucs_compl = proj.m_nXYRatio * completeX;
      
      var ox = cv.m_nCurrentX  * tilePixelWidth + ucs_min;
      var oy = cv.m_nCurrentY  * tilePixelHeight;

      for( var nJ = 0, len = posarray.length / 3; nJ < len; ++nJ )
      {
         // deg to rad now inline due to performance.........................//
         lonlat[0] = mul * posarray[ nJ * 3 ];
         lonlat[1] = mul * posarray[ nJ * 3 + 1 ];

         ucs[0] = completeX;
         ucs[1] = completeY;
         ucs = lltucs( lonlat, ucs );

         // map position into canvas area....................................//
         ucs[0] = ucs[0] - ox;
         ucs[1] = ucs[1] - oy; 
         if( adjust )
         {
            // adjust to round world.........................................//
            while( ucs[0] < ucs_min )
               ucs[0] += ucs_compl;
            while( ucs[0] > ucs_max )
               ucs[0] -= ucs_compl;
         }
         ret.push(  ucs[0] * fx, ucs[1] * fy, 0.0 );

      }

      // only when it was a single point, calculate visibility...............//
      if( nJ == 1 && ucs )
      {
         // do point clipping and set the visible state......................//
         var x, y;         
         ret.m_bVisible = ( ( (x = ucs[0]) > 0) && ( (y = ucs[1]) > 0) && 
                              (x < scene.m_nWidthCanvas ) && 
                              (y < scene.m_nHeightCanvas ) );
      }

      return ret;
   };

   scene.GetPointFromGeo = function( lonlat, adjust )
   {
      // lonlat is specified in !radians! before using the array function....//
      // we must convert them................................................//
      return scene.GetPointArrayFromPosArray( VBI.MathLib.RadToDeg( lonlat ), adjust );
   };

   // determine an array of x offsets that need to be used to render the.....//
   // the object for round world.............................................//
   // this is calculated assuming non zoomed canvas..........................//

   scene.GetInstanceOffsets = function( rect )
   {  
      var rc = rect.slice();  // copy the array..............................//
      
      // determine theoretical pixels of this lod............................//
      var cv = scene.m_Canvas[0];
      var tilePixelWidth = scene.m_nWidthCanvas / scene.m_nTilesX;
      var completeX = ( 1 << cv.m_nCurrentLOD ) * tilePixelWidth * scene.m_Proj.m_nXYRatio;

      var rcCanvas = [ 0, 0, scene.m_nWidthCanvas, scene.m_nHeightCanvas ];
      var nCount = 0;

      // shift the object to the left, till it is out of bounds..............//
      while( rc[2] > 0 )
      {
         --nCount;
         VBI.Utilities.RectOffset( rc, -completeX, 0 );
      }

      // start to shift the object to the right and collect intersection.....//
      var aOffsets = [];
      while( rc[0] < scene.m_nWidthCanvas )
      {
         nCount++;
         VBI.Utilities.RectOffset( rc, completeX, 0 );
         if(  VBI.Utilities.RectIntersect( rc, rcCanvas ) )
            aOffsets.push( nCount * completeX );
      }

      return aOffsets;  // return the offsets for rendering the instance.....// 
   };

   //........................................................................//
   // get the geoposition from a given pixel point of the viewport/div.......//

   scene.GetPosFromVPPoint = function ( pt )
   {
      var canv = scene.m_Canvas[ scene.m_nOverlayIndex ];
      
      // determine the position in the canvas................................//
      var cp = [ pt[0] - canv.getPixelLeft(), pt[1] - canv.getPixelTop(), 0 ];
      var tmp = this.GetGeoFromPoint( cp );     // radians are returned here.//
      return VBI.MathLib.RadToDeg( tmp );       // convert to deg............//
   };

   // .......................................................................//
   // determine the geoposition from a given pixel point of the zoomed.......//
   // canvas.................................................................//

   scene.GetPosFromPoint = function ( pt )
   {
      var tmp = this.GetGeoFromPoint( pt );     // radians are returned here.//
      return VBI.MathLib.RadToDeg( tmp );       // convert to deg............//
   };

   scene.GetGeoFromPoint = function ( pt )
   {
      var cv = scene.m_Canvas[0];
      var nLOD = cv.m_nCurrentLOD;

      // in pixel space we are
      var nMaxLODTiles = (1 << nLOD);
      var canvasPixelLeft = pt[0] * scene.m_nWidthCanvas / cv.getPixelWidth();
      var canvasPixelTop =  pt[1] * scene.m_nHeightCanvas / cv.getPixelHeight();

      var tilePixelWidth = scene.m_nWidthCanvas / scene.m_nTilesX;
      var tilePixelHeight = scene.m_nHeightCanvas / scene.m_nTilesY;

      // number of pixels outside............................................//
      var nOutsideX = cv.m_nCurrentX * tilePixelWidth;
      var nOutsideY = cv.m_nCurrentY * tilePixelHeight;

      // in pixel space for the current lod we are at........................//
      var currentX = nOutsideX + canvasPixelLeft;
      var currentY = nOutsideY + canvasPixelTop;

      // complete pixel space................................................//
      var completeX = nMaxLODTiles * tilePixelWidth;
      var completeY = nMaxLODTiles * tilePixelHeight;

      // do not normalize ...................................................//
      // with normalization we can not handle big geometrical shapes.........//
      /*
      while( currentX < 0 )
         currentX += completeX;
      while( currentY < 0 )
         currentY += completeY;
      while( currentX > completeX )
         currentX -= completeX;
      while( currentY > completeY )
         currentY -= completeY;
      */

      // normalize complete dimension on current LOD.........................//
      var lonlat = [0,0];
      var ucs = [  currentX / completeX * 2.0 - 1.0, currentY / completeY * 2.0 - 1.0 ];

      return scene.m_Proj.UCSToLonLat( ucs, lonlat );
   };
   
   scene.getCanvas = function()
   {
      return scene.m_Canvas[ 0 ];
   };

   // .......................................................................//
   // the following does the killing and genesis of the scene................//

   scene.clearTimers = function()
   {
      // clear the blend timer if active.....................................//
      if( scene.m_BlendTimer )
      {
          window.clearInterval( scene.m_BlendTimer );
          scene.m_BlendTimer = null;
      }

      // clear the animation timer if active.................................//
      if( scene.m_AnimZoomTimer )
      {
          window.clearInterval( scene.m_AnimZoomTimer );
          scene.m_AnimZoomTimer = null;
      }
   };

   scene.clearCanvases = function()
   {
      // clear the canvas-scene references...................................//
      for( var nJ = 0, nLen = scene.m_Canvas.length; nJ < nLen; ++nJ )
      {
         scene.m_Canvas[nJ].m_Scene = null;
         scene.m_Canvas[nJ] = null;
      }
      scene.m_Canvas = [];
   };

   scene.Remove = function()
   {
      // remove the dom elements.............................................//
      if( scene.m_Div )
      {
         // remove potential event listeners from document...................//
         scene.SetInputMode( VBI.InputModeDefault );

         // remove all childs of out div.....................................//
         while( scene.m_Div.firstChild ) 
            scene.m_Div.removeChild( scene.m_Div.firstChild );

         // reset div reference..............................................//
         scene.m_Div.parentElement.removeChild( scene.m_Div );
         scene.m_Div = null;

         // clear any timers.................................................//
         scene.clearTimers();
         scene.clearCanvases();
      }

      if( scene.m_Target )
      {
         while( scene.m_Target.firstChild ) 
            scene.m_Target.removeChild( scene.m_Target.firstChild );
         
         scene.m_Target = null;
      }
   };
   
   scene.AddCopyright= function()
   {
      // return immediately when the maplayerstack is empty..................//
      if( !scene.m_MapLayerStack )  
         return;

      if ( !scene.m_DivCopyright){
          var CopyrightElement = VBI.Utilities.CreateGeoSceneDivCSS( scene.m_Target.id + "-copyright" , "vbi-copyright");
          scene.m_Div.appendChild(CopyrightElement);
          scene.m_DivCopyright = CopyrightElement;
      }
      var sCopyright = scene.m_MapLayerStack.GetCopyright();
      if ( sCopyright ){
         scene.m_DivCopyright.innerHTML = sCopyright;
      }
      else{
         scene.m_DivCopyright.style.paddingRight = 0;
         scene.m_DivCopyright.style.paddingLeft = 0;
      }
   };
   
   scene.ReAwake = function (){
       scene.m_MapLayerStack = scene.m_RefMapLayerStack;
       scene.AddCopyright();
       scene.resizeCanvas( 0, true );
   };

   
   scene.Awake = function( target, mapmanager, maplayerstack )
   {
      if (!(scene.m_Target = VBI.Utilities.GetDOMElement( target )))
         scene.m_Target = VBI.Utilities.CreateDOMElement( target, "1px", "1px");

      // reuse scene parts...................................................//
      if( scene.m_Div )
      {
         // when the scenes div's parent is still the place holder, then.....//
         // everything is still fine and we can return.......................//
         if( scene.m_Div.parentNode == scene.m_Target )
            return;     

         // the scenes div is already but the parent is no longer the........//
         // placeholder. In this case we add again the div as a child element// 
         scene.m_Target.appendChild( scene.m_Div );
         if ( scene.m_bNavControlVisible && scene.m_NavControl )
            //scene.m_NavControl.Awake( scene, target );
            scene.m_NavControl.AttachEvents();
         return;
      }

      // assign scene information............................................//
      scene.m_TargetName = target;   

      scene.m_MapManager = typeof mapmanager !== 'undefined' ? mapmanager : VBI.MapManager;
      scene.m_MapLayerStack = typeof maplayerstack !== 'undefined' ? maplayerstack : scene.m_RefMapLayerStack;

      // create the viewport.................................................//
      scene.m_Div = VBI.Utilities.CreateGeoSceneDiv( target + "-geoscene");
      
      // set the div as a child of the target................................//
      scene.m_Target.appendChild(scene.m_Div);

      // activae   

      // the awakening of the canvases requires the div sizes, if they are not provided
      // behvaiour might be strange. To support a future implementation of a lazy awakening
      // when the div sizes come late this part is put into an own function which may be called
      // from resize also.
      scene.DoAwake( target ); 
   };
   
   scene.setProjection = function ()
   {
      if( !scene.m_RefMapLayerStack || !scene.m_RefMapLayerStack.m_MapLayerArray || !scene.m_RefMapLayerStack.m_MapLayerArray.length )
         return new VBI.MercatorProjection;   
      
      var layerArray = scene.m_RefMapLayerStack.m_MapLayerArray;
      var nProj = layerArray[0].GetMapProvider().m_nProjection; 
      for ( var i = 2; i < layerArray.length; ++i ){
         if ( layerArray[i].GetMapProvider().m_nProjection != nProj ){
            VBI.m_bTrace && VBI.Trace("projection of layer "+i+" is inconsistent to base layer. Choosing projection of base layer");
         }
      }
      
      switch ( nProj ){
         case 1:  
            return new VBI.MercatorProjection;   
         case 2:
            return new VBI.LinearProjection;
         default:
            return new VBI.MercatorProjection;        
      }
   };

   scene.DoAwake = function( target )
   {
      // create the viewport.................................................//
      
      scene.CalculateCanvasDimensions( );
      scene.CreateCanvases();
      // append copyright 
      scene.AddCopyright();
      // attach overlay canvas to scene handled events.......................//
      var oCanvas = scene.m_Canvas[ scene.m_nOverlayIndex ];
      oCanvas.draggable = "true";
      // do event subscriptions..............................................//
      if( scene.m_Events )
         scene.m_Events.clear();

      scene.m_Events = new VBI.SceneEvent( this, oCanvas );
      
      // awake Navigation Control
      if ( scene.m_bNavControlVisible && scene.m_NavControl ){
        scene.m_NavControl.Awake( scene, target );
      }
      
      // awake Scale Control
      if ( scene.m_bScaleVisible && scene.m_Scale ){
         scene.m_Scale.Awake( scene, target );
      }      
      
      // now go to StartPosition
      var exactMinLod = scene.GetMinLOD();
      if ( scene.m_startLOD < exactMinLod ){
      	 var firstIntLOD =  Math.ceil( exactMinLod );
       	 scene.m_startLOD = ( firstIntLOD - exactMinLod ) < 0.6 ? firstIntLOD : exactMinLod;
      }
        	  
      
      scene.GoToInitialStart();

   };
   
   // canvas dimensions...................................................//
   scene.CalcCanvasWidth  = function ( width, tileWidth )  { return (Math.floor(width / tileWidth + scene.m_nCanvasXOversize)) * tileWidth; };
   scene.CalcCanvasHeight = function ( height, tileHeight ) { return ( Math.floor( height / tileHeight + scene.m_nCanvasYOversize)) * tileHeight; };

   scene.CalculateCanvasDimensions = function()
   {
      var nDummy = scene.m_Target.offsetWidth; // to force browser to have consistent state 


      var rect      = scene.m_Div.getBoundingClientRect();
      var mapMan    = scene.m_MapManager;

      var divWidth  = rect.width  ? rect.width  : scene.m_Div.clientWidth;
      var divHeight = rect.height ? rect.height : scene.m_Div.clientHeight;
      if ( ( divWidth == scene.m_nDivWidth ) && ( divHeight == scene.m_nDivHeight ))
         return; // nothing changed
      
      scene.m_nDivWidth         = divWidth;
      scene.m_nDivHeight        = divHeight;
      scene.m_nWidthCanvas      = scene.CalcCanvasWidth ( divWidth, mapMan.m_tileWidth );
      scene.m_nHeightCanvas     = scene.CalcCanvasHeight( divHeight, mapMan.m_tileHeight );
      scene.m_nTilesX           = scene.m_nWidthCanvas  / mapMan.m_tileWidth;
      scene.m_nTilesY           = scene.m_nHeightCanvas / mapMan.m_tileHeight;
      
      mapMan.m_requestTileWidth  = mapMan.m_tileWidth;
      mapMan.m_requestTileHeight = mapMan.m_tileHeight;

      var layerStack = scene.m_MapLayerStack;
      if ( layerStack.m_nMaxSquare && layerStack.m_MapLayerArray.length ){
         var nLowestResolution = 0;
         for ( var i = 0 ; i < layerStack.m_MapLayerArray.length; ++i ){
            if ( !i || ( layerStack.m_MapLayerArray[i].m_refMapProvider.m_nResolution < nLowestResolution ) ) {
               nLowestResolution = parseInt(layerStack.m_MapLayerArray[i].m_refMapProvider.m_nResolution);
            }
         }
         var nMaxPixels = layerStack.m_nMaxSquare * nLowestResolution;
         if ( ( scene.m_nTilesX  * mapMan.m_tileWidth > nMaxPixels ) || ( scene.m_nTilesY * mapMan.m_tileHeight > nMaxPixels ) ){
            var newSize = Math.floor( nMaxPixels / Math.max( scene.m_nTilesX, scene.m_nTilesY ));
            mapMan.m_requestTileWidth  = newSize;
            mapMan.m_requestTileHeight = newSize;
         }
      }
      
      VBI.m_bTrace && VBI.Trace("Setting Canvas Size to ("+scene.m_nWidthCanvas+","+scene.m_nHeightCanvas+") on div with size ("+divWidth+","+divHeight+")");

      // Preload is the number of pixel from the absolute border which triggers a col or row shift in a move
      scene.m_nMapMoveXPreLoad = Math.min( 120 , mapMan.m_tileWidth  * (scene.m_nTilesX - 1) - divWidth ); 
      scene.m_nMapMoveYPreLoad = Math.min( 120 , mapMan.m_tileHeight * (scene.m_nTilesY - 1) - divHeight );
      
      scene.m_nCanvasStdXPos   = ( scene.m_nWidthCanvas  - scene.m_nDivWidth  ) / mapMan.m_tileWidth  / 2;
      scene.m_nCanvasStdYPos   = ( scene.m_nHeightCanvas - scene.m_nDivHeight ) / mapMan.m_tileHeight / 2;

      scene.m_nMaxPixelBeyondPoles = 0;
   };
   
   scene.SwitchTmpCanvasToActive = function()
   {
       var dest = scene.m_Canvas[0], source = scene.m_Canvas[3];
       
	    var destCtx = dest.getContext('2d');
       destCtx.clearRect( 0 , 0 , dest.getPixelWidth() , dest.getPixelHeight());
       destCtx.drawImage(scene.m_Canvas[3], 0, 0);
       scene.MoveCanvas(dest, dest.getPixelLeft() - source.m_nOffsetX * dest.getPixelWidth () / scene.m_nTilesX, dest.getPixelTop() - source.m_nOffsetY * dest.getPixelHeight() / scene.m_nTilesY);

       dest.m_nCurrentX = source.m_nCurrentX;
       dest.m_nCurrentY = source.m_nCurrentY;

       source.m_bCanvasValid = false;
       source.m_CanvasRedirect = dest;
       source.m_CanvasRedirRequest = source.m_nRequest;
       source.m_nOffsetX = source.m_nOffsetY = 0;
	    source.m_nTilesBefSwitch = undefined;
       
       scene.InternalRenderLayer(scene.m_Canvas[ scene.m_nOverlayIndex ], false, true, true, dest.m_nExactLOD );    	
   };
   
   
   scene.CreateCanvases = function( )
   {
      // create the switchable canvases......................................//
      var idPrefix = scene.m_TargetName + "-" + scene.m_ID + "-";
      scene.m_Canvas.push(VBI.Utilities.CreateGeoSceneCanvas( idPrefix + "layer1", scene.m_nWidthCanvas, scene.m_nHeightCanvas, 2));     // map toggle layer
      scene.m_Canvas.push(VBI.Utilities.CreateGeoSceneCanvas( idPrefix + "layer2", scene.m_nWidthCanvas, scene.m_nHeightCanvas, 1));     // map toggle layer
      scene.m_Canvas.push(VBI.Utilities.CreateGeoSceneCanvas( idPrefix + "objectlayer", scene.m_nWidthCanvas, scene.m_nHeightCanvas, 3, 0 ));  // object layer
      scene.m_Canvas.push(VBI.Utilities.CreateGeoSceneCanvas( idPrefix + "nondomlayer", scene.m_nWidthCanvas, scene.m_nHeightCanvas, 4, 0, true ));  // object layer

      for( var nJ = 0; nJ < scene.m_Canvas.length; ++nJ )
      {
         // set the scene reference..........................................//
         scene.m_Canvas[nJ].m_Scene = scene;

         // set current lod..................................................//
         scene.m_Canvas[nJ].m_nCurrentLOD = 2;
         scene.m_Canvas[nJ].m_nExactLOD = 2;
         scene.m_Canvas[nJ].m_nCurrentX = undefined;
         scene.m_Canvas[nJ].m_nCurrentY = undefined;
         scene.m_Canvas[nJ].m_nAppliedRequest = 0; 
         
         scene.m_Canvas[nJ].m_bInvalid = false;
        
         // set the canvas as a child of the div.............................//
         if ( !scene.m_Canvas[nJ].m_bNotInDOM )
            scene.m_Div.appendChild( scene.m_Canvas[nJ] );
      }
   };
   

   scene.resizeCanvas = function( event, bForce )
   {
      if ( !scene.m_Canvas.length ) { // no wake done yet, do it now
         scene.DoAwake();
         return;
      }
      
	  if ( scene.m_Canvas[3].m_bCanvasValid )        scene.SwitchTmpCanvasToActive();
	  
      var mapMan    = scene.m_MapManager;
      var canvas        = scene.m_Canvas[0];
      var oldWidth      = scene.m_nDivWidth;
      var oldHeight     = scene.m_nDivHeight;
      var oldMinLod     = scene.GetMinLODForWidth( oldWidth );
      var stretchFactor = canvas.getPixelWidth() / scene.m_nWidthCanvas;

      scene.m_nLastRenderLOD = -1; // to force Re-Rendering
      
      scene.CalculateCanvasDimensions( );
      if ( (!bForce) && ( scene.m_nDivWidth == oldWidth ) && ( scene.m_nDivHeight == oldHeight ))
         return;

      VBI.m_bTrace && VBI.Trace("Resizing ("+(oldWidth)+","+(oldHeight)+") to ("+(scene.m_nDivWidth)+","+(scene.m_nDivHeight)+")");
      
      var oldCurrentX  = canvas.m_nCurrentX;
      var oldCurrentY  = canvas.m_nCurrentY;
      var lod          = canvas.m_nCurrentLOD;

      // new dimensions for canvas 0
      var newPixelLeft  = canvas.getPixelLeft()  + (scene.m_nDivWidth  - oldWidth ) / 2;
      var xDistToMean   = Math.round( ( - newPixelLeft / mapMan.m_tileWidth - scene.m_nCanvasStdXPos ) / stretchFactor);
      newPixelLeft     += stretchFactor * xDistToMean * mapMan.m_tileWidth;

      var newPixelTop   = canvas.getPixelTop() + (scene.m_nDivHeight - oldHeight ) / 2;
      var yDistToMean   = Math.round( ( - newPixelTop / mapMan.m_tileHeight - scene.m_nCanvasStdYPos ) / stretchFactor);
      newPixelTop      += stretchFactor * yDistToMean * mapMan.m_tileHeight;

      for (var i = 0; i < scene.m_Canvas.length; ++i)
      {
         scene.m_Canvas[i].width = scene.m_nWidthCanvas;
         scene.m_Canvas[i].height = scene.m_nHeightCanvas;
      }

      scene.InvalidateCanvas( scene.m_Canvas[1] );
      scene.MoveCanvas(canvas , newPixelLeft  , newPixelTop  , stretchFactor * scene.m_nWidthCanvas, stretchFactor * scene.m_nHeightCanvas );
      scene.m_MapManager.RequestTiles( canvas, scene.m_MapLayerStack, oldCurrentX + xDistToMean, oldCurrentY + yDistToMean, scene.m_nTilesX, scene.m_nTilesY, 0, 0, 0, 0, lod, false );
      var lza = scene.m_LastZoomArea;     // must be stored before ZoomMap may be able to destroy it

      if (lza == undefined){
          var newMinLod = scene.GetMinLOD();
          if ( canvas.m_nExactLOD < newMinLod ){
        	  scene.ZoomMap( Math.pow(2, newMinLod - canvas.m_nExactLOD) * 1.000001, scene.m_nDivWidth / 2 - newPixelLeft,  scene.m_nDivHeight / 2 - newPixelTop );
          }
          else{
        	 if ( canvas.m_nExactLOD != Math.floor(canvas.m_nExactLOD) ){
           		 scene.AnimateZoomToGeo( scene.GetCenterPos(), Math.floor(canvas.m_nExactLOD),33);
        	 }else{
        		 scene.InternalRenderLayer(scene.m_Canvas[ scene.m_nOverlayIndex ], false, true, true, canvas.m_nExactLOD );
        		 scene.InternalOnMoveLayer(scene.m_Canvas[ scene.m_nOverlayIndex ]);
        	 }
          }
          var newMaxLod = scene.GetMaxLOD();
          if ( canvas.m_nExactLOD > newMaxLod ){
        	  scene.ZoomMap( Math.pow(2, newMaxLod - canvas.m_nExactLOD), scene.m_nDivWidth / 2 - newPixelLeft,  scene.m_nDivHeight / 2 - newPixelTop );
          }
      } else {
    	  var timeNow = new Date().getTime();
    	  if ((timeNow - lza[0]) < 3000 ){
    		  switch ( lza[1] ) {
    			  case "Area":
    				  scene.ZoomToArea( lza[2], lza[3], lza[4], lza[5], lza[6] );
    				  break;
    			  case "Areas":	
    				  scene.ZoomToAreas( lza[2], lza[3] );
    				  break;
    		  }
    	  }
      }

      if ( ( bForce || ( scene.GetMinLOD() != oldMinLod ) ) && scene.m_NavControl )  // if width has changed and minLOD is not set directly it will change
          scene.m_NavControl.AdaptMinMaxLOD( scene );  
       
      if ( scene.m_bNavControlVisible && scene.m_NavControl ){
          scene.m_NavControl.AdjustScrollPoint( scene.m_Canvas[0].m_nCurrentLOD ); // "canvas" might be [1], now so we use scene.m_Canvas[0]
      }

      scene.InternalRenderLayer(scene.m_Canvas[ scene.m_nOverlayIndex ], false, false, true, scene.m_Canvas[0].m_nExactLOD ); // will re-render if none of the above triggered a render
   };

   // when a target is already specified, awake the scene to be alive........//
   if( target )
      scene.Awake( target, mapmanager, maplayerstack );

   return scene;
};

