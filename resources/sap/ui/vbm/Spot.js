/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.vbm.Spot");jQuery.sap.require("sap.ui.vbm.library");jQuery.sap.require("sap.ui.vbm.VoBase");sap.ui.vbm.VoBase.extend("sap.ui.vbm.Spot",{metadata:{publicMethods:["openDetailWindow","openContextMenu"],library:"sap.ui.vbm",properties:{"position":{type:"string",group:"Misc",defaultValue:'0;0;0'},"text":{type:"string",group:"Misc",defaultValue:null},"image":{type:"string",group:"Misc",defaultValue:null},"alignment":{type:"string",group:"Misc",defaultValue:'5'},"scale":{type:"string",group:"Misc",defaultValue:'1;1;1'}},aggregations:{"dragSource":{type:"sap.ui.vbm.DragSource",multiple:true,singularName:"dragSource"},"dropTarget":{type:"sap.ui.vbm.DropTarget",multiple:true,singularName:"dropTarget"}},events:{"click":{},"contextMenu":{},"drop":{}}}});sap.ui.vbm.Spot.M_EVENTS={'click':'click','contextMenu':'contextMenu','drop':'drop'};
sap.ui.vbm.Spot.prototype.openDetailWindow=function(c,o,a){this.oParent.openDetailWindow(this,{caption:c,offsetX:o,offsetY:a});};
sap.ui.vbm.Spot.prototype.openContextMenu=function(m){this.oParent.openContextMenu(this,m);};
