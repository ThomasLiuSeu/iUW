/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.vbm.Area");jQuery.sap.require("sap.ui.vbm.library");jQuery.sap.require("sap.ui.vbm.VoBase");sap.ui.vbm.VoBase.extend("sap.ui.vbm.Area",{metadata:{publicMethods:["openDetailWindow","openContextMenu"],library:"sap.ui.vbm",properties:{"position":{type:"string",group:"Misc",defaultValue:null},"color":{type:"string",group:"Misc",defaultValue:null},"colorBorder":{type:"string",group:"Misc",defaultValue:null}},events:{"click":{},"contextMenu":{},"edgeClick":{},"edgeContextMenu":{},"drop":{}}}});sap.ui.vbm.Area.M_EVENTS={'click':'click','contextMenu':'contextMenu','edgeClick':'edgeClick','edgeContextMenu':'edgeContextMenu','drop':'drop'};
sap.ui.vbm.Area.prototype.openDetailWindow=function(c,o,a){this.oParent.openDetailWindow(this,{caption:c,offsetX:o,offsetY:a});};
sap.ui.vbm.Area.prototype.openContextMenu=function(m){this.oParent.openContextMenu(this,m);};
