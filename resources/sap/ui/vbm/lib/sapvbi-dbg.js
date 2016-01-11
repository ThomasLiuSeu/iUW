//...........................................................................//
// VBI namespace.............................................................//

// Author: Ulrich Roegelein


/*global URI *///declare unusual global vars for JSLint/SAPUI5 validation


(function() 
{
    //.......................................................................//
    // check if there is already a VBI object................................//
    //.......................................................................//

    var bInitialized = (typeof VBI == "object") || window.VBI;

    // return immediately when vbi is already initialized....................//
    if( bInitialized ) 
        return;

   //........................................................................//
   // create the vbi object..................................................//

   window.VBI =
   {
      // Mobile devices .....................................................//
      m_bIsMyChromeTest : (/chrome/gi).test(navigator.appVersion),
      
      m_bIsIDevice : (/iphone|ipad/gi).test(navigator.appVersion),
      m_bIsAndroid : (/android/gi).test(navigator.appVersion),
      m_bIsMobile :  (/iphone|ipad|android|BB|blackberry|playbook/gi).test(navigator.appVersion),
      m_bIsPhone : jQuery.device.is.phone,
      //m_bIsPhone : true,

      // global key state....................................................//
      m_ctrlKey : false,
      m_shiftKey : false,
      m_dwRefKeyboardHook : 0,

      //.....................................................................//
      // get the location service............................................//

      GetGeoLocationService:
         function()
         {
            if( this.GeoLocationService )
               return this.GeoLocationService;
                     
            this.GeoLocationService = new VBI.GeoLocation();
            return this.GeoLocationService;
         },

         
		 //.....................................................................//
		 // publish subscribe container.........................................//
		 
		 Events : function()
		 {
		    var oCon = {};
		
		    var hOP = oCon.hasOwnProperty;
		    return {
		          subscribe: function( itm, cb ) 
		          {
		             // add the item to the event container.......................//
		                 if(!hOP.call( oCon, itm ) ) oCon[itm] = [];
		  
		                 // add subscription
		             var nJ = oCon[itm].push( cb )-1;
		             return {
		             unsubscribe: function() {
		                delete oCon[itm][nJ];
		             }
		          };
		       },
		       fire: function( itm, dat ) 
		       {
		          // when item is not there return immediately..................//
		          if(!hOP.call(oCon, itm)) return;
		          oCon[itm].forEach( function(itm) { itm( dat || {} ); } );
		       }
		    };
		 },
		 
         
      //.....................................................................//
      // logging and tracing.................................................//

      m_Log : "",
      m_bTrace : 
         (function()
         { 
            // trace is active when VBITrace div is available................//
            var el = document.getElementById('VBITrace');
            return ( el != null) ? true : false; 
         })(),

      Trace: function( text )
      {
         // do a log on the console, a crlf is appended......................//
         if( typeof console != "undefined" )
            console.log( text + "\r\n" );

         // add the text to a trace element, the <br> linebreak tag is added.//
         var trace = document.getElementById('VBITrace');
         if( trace == null )
            return;
         VBI.m_Log = VBI.m_Log + text + "<br>";
         trace.innerHTML = VBI.m_Log;
      },


      // global register for key events.........................................//
      // for windows 8 surface like devices to get shift and ctrl key state at..//
      // any time...............................................................//

      RegisterKeyboardHook : function()
      {
         // add reference count.................................................//
         ++window.VBI.m_dwRefKeyboardHook;

         // hook already registered.............................................//
         if( window.VBI.m_dwRefKeyboardHook > 1 )
            return;              

         window.VBI.onkeydown = function( e )
         {
            if( e.keyCode == 16 )
               VBI.m_shiftKey = true;
            else
            if( e.keyCode == 17 )
               VBI.m_ctrlKey = true;
         };
         window.VBI.onkeyup = function( e )
         {
            if( e.keyCode == 16 )
               VBI.m_shiftKey = false;
            else
            if( e.keyCode == 17 )
               VBI.m_ctrlKey = false;
         };

         document.addEventListener( 'keydown', window.VBI.onkeydown );
         document.addEventListener( 'keyup', window.VBI.onkeyup );

      },

      UnRegisterKeyboardHook : function()
      {
         --window.VBI.m_dwRefKeyboardHook;

         if( window.VBI.m_dwRefKeyboardHook > 0 ) 
            return;

         // when to unregster the 
         document.removeEventListener('keydown', window.VBI.onkeydown );
         document.removeEventListener('keyup', window.VBI.onkeyup );
         window.VBI.onkeydown = null;
         window.VBI.onkeyup = null;
      }
   };

   //.......................................................................//
   // this is the list of java script files needed for VBI..................//

   var VBIScriptFiles = [
      "saputilities",
      "sapvbicontext",     // control context
      "sapdataprovider",   // data provider
      "sapresources",
      "sapgeomath",
      "sapmaplayer",
      "sapmapprovider",
      "sapmapmanager",
      "sapvobase",         // visual objects base and vo implementation
      "sapevents",         // event subscription
      "sapscene",          // scene handling, scenes
      "sapwindow",         // window handling, detail and so on
      "sapactions",        // actions handling, framework event subscription
      "sapautomations",
      "sapgeolocation",
      "sapgeotool",        // geo tools for VBI namespace
      "sapscale",
      "sapnavigation",
      "sapvbmenu",         // context menu
      "sapprojection",     // map projection (mercator, linear)
      "sapvbcluster",      // VO clustering
      "sapparsing",        // expression evaluation
      "sapconfig"
   ]; 

   // use sap require to load additional scripts.............................//
   for( var nJ = 0, len = VBIScriptFiles.length; nJ < len; ++nJ )
      jQuery.sap.require( "sap.ui.vbm.lib." + VBIScriptFiles[nJ] );

})();

