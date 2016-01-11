/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.ui.vbm.AnalyticMapRenderer");
jQuery.sap.require( "sap.ui.vbm.VBIRenderer" );


/**
 * @class MapRenderer renderer. 
 * @static
 */
sap.ui.vbm.AnalyticMapRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.ui.vbm.AnalyticMapRenderer.render = function( oRm, oControl ) { 
   sap.ui.vbm.VBIRenderer.render( oRm, oControl );

   // update bound data......................................................//
   var oApp;
   if( oApp = oControl.Update() )
	   oControl.load( oApp );
};

/**
function( oRm, oControl )
{ 
   sap.ui.vbm.VBIRenderer.render( oRm, oControl );
/*
 // write the HTML into the render manager
	 oRm.write("<span");
	 oRm.writeControlData(oControl);
	 oRm.addClass("sapUiVbmBla");
	 oRm.writeClasses();
	 oRm.write(">"); // span element
	 oRm.write("</span>");

};
*/
