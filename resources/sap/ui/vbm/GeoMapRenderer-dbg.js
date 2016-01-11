/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.ui.vbm.GeoMapRenderer");
jQuery.sap.require( "sap.ui.vbm.VBIRenderer" );

/**
 * @class GeoMap renderer. 
 * @static
 */
sap.ui.vbm.GeoMapRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.ui.vbm.GeoMapRenderer.render = function( oRm, oControl )
{ 
   sap.ui.vbm.VBIRenderer.render( oRm, oControl );

   // update bound data......................................................//
   var oApp;
   if( oApp = oControl.Update() )
	   oControl.load( oApp );
};

