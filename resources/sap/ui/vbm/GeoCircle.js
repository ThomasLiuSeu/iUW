/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.vbm.GeoCircle");jQuery.sap.require("sap.ui.vbm.library");jQuery.sap.require("sap.ui.vbm.VoBase");sap.ui.vbm.VoBase.extend("sap.ui.vbm.GeoCircle",{metadata:{publicMethods:["openDetailWindow","openContextMenu"],library:"sap.ui.vbm",properties:{"position":{type:"string",group:"Misc",defaultValue:'0;0;0'},"colorBorder":{type:"string",group:"Misc",defaultValue:'RGB(0,0,0)'},"radius":{type:"string",group:"Misc",defaultValue:'10000'},"color":{type:"string",group:"Misc",defaultValue:'RGB(0,0,0)'},"slices":{type:"string",group:"Misc",defaultValue:'20'}},events:{"click":{},"contextMenu":{},"drop":{}}}});sap.ui.vbm.GeoCircle.M_EVENTS={'click':'click','contextMenu':'contextMenu','drop':'drop'};
sap.ui.vbm.GeoCircle.prototype.openDetailWindow=function(c,o,a){this.oParent.openDetailWindow(this,{caption:c,offsetX:o,offsetY:a});};
sap.ui.vbm.GeoCircle.prototype.openContextMenu=function(m){this.oParent.openContextMenu(this,m);};
