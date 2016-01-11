/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.vbm.Box");jQuery.sap.require("sap.ui.vbm.library");jQuery.sap.require("sap.ui.vbm.VoBase");sap.ui.vbm.VoBase.extend("sap.ui.vbm.Box",{metadata:{publicMethods:["openDetailWindow","openContextMenu"],library:"sap.ui.vbm",properties:{"position":{type:"string",group:"Misc",defaultValue:'0;0;0'},"scale":{type:"string",group:"Misc",defaultValue:'1;1;1'},"color":{type:"string",group:"Misc",defaultValue:'RGB(255;0;0)'},"colorBorder":{type:"string",group:"Misc",defaultValue:'RGB(255;0;0)'}},events:{"click":{},"contextMenu":{},"drop":{}}}});sap.ui.vbm.Box.M_EVENTS={'click':'click','contextMenu':'contextMenu','drop':'drop'};
sap.ui.vbm.Box.prototype.openDetailWindow=function(c,o,a){this.oParent.openDetailWindow(this,{caption:c,offsetX:o,offsetY:a});};
sap.ui.vbm.Box.prototype.openContextMenu=function(m){this.oParent.openContextMenu(this,m);};
