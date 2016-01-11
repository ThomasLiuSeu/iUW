/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.vbm.Pie");jQuery.sap.require("sap.ui.vbm.library");jQuery.sap.require("sap.ui.vbm.VoBase");sap.ui.vbm.VoBase.extend("sap.ui.vbm.Pie",{metadata:{publicMethods:["openDetailWindow","openContextMenu"],library:"sap.ui.vbm",properties:{"position":{type:"string",group:"Misc",defaultValue:null},"scale":{type:"string",group:"Misc",defaultValue:null}},defaultAggregation:"items",aggregations:{"items":{type:"sap.ui.vbm.PieItem",multiple:true,singularName:"item"}},events:{"click":{},"contextMenu":{},"drop":{}}}});sap.ui.vbm.Pie.M_EVENTS={'click':'click','contextMenu':'contextMenu','drop':'drop'};
sap.ui.vbm.Pie.prototype.openDetailWindow=function(c,o,a){this.oParent.openDetailWindow(this,{caption:c,offsetX:o,offsetY:a});};
sap.ui.vbm.Pie.prototype.openContextMenu=function(m){this.oParent.openContextMenu(this,m);};
