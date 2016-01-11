/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.vbm.Circles");jQuery.sap.require("sap.ui.vbm.library");jQuery.sap.require("sap.ui.vbm.VoAggregation");sap.ui.vbm.VoAggregation.extend("sap.ui.vbm.Circles",{metadata:{library:"sap.ui.vbm",defaultAggregation:"items",aggregations:{"items":{type:"sap.ui.vbm.Circle",multiple:true,singularName:"item"}},events:{"click":{},"contextMenu":{},"drop":{}}}});sap.ui.vbm.Circles.M_EVENTS={'click':'click','contextMenu':'contextMenu','drop':'drop'};
sap.ui.vbm.Circles.prototype.HandleEvent=function(e){var s=e.Action.name;var f="fire"+s[0].toUpperCase()+s.slice(1);var c;if(c=this.FindInstance(e.Action.instance)){if(c.mEventRegistry[s]){if(s=="contextMenu"){c.mClickPos=[e.Action.Params.Param[0]['#'],e.Action.Params.Param[1]['#']];jQuery.sap.require("sap.ui.unified.Menu");if(this.oParent.m_VBIContext.m_Menus)this.oParent.m_VBIContext.m_Menus.deleteMenu("DynContextMenu");var m=new sap.ui.unified.Menu();m.vbi_data={};m.vbi_data.menuRef="CTM";m.vbi_data.VBIName="DynContextMenu";c.fireContextMenu({data:e,menu:m});}else c[f]({data:e});}}this[f]({data:e});};
sap.ui.vbm.Circles.prototype.getTemplateObject=function(){var i=this.getId();return{"id":i,"type":"{00100000-2013-0004-B001-7EB3CCC039C4}","datasource":i,"pos.bind":i+".P","tooltip.bind":i+".TT","radius.bind":i+".R","color.bind":i+".C","colorBorder.bind":i+".CB","slices.bind":i+".S"};};
sap.ui.vbm.Circles.prototype.getDataObject=function(){var v=this.getItems();var s=[];for(var n=0,l=v.length;n<l;++n){var i=v[n];var e={"P":i.getPosition(),"TT":i.getTooltip(),"R":i.getRadius(),"C":i.getColor(),"CB":i.getColorBorder(),"S":i.getSlices()};s.push(e);}return{"E":s};};
sap.ui.vbm.Circles.prototype.getTypeObject=function(){return{"A":[{"changeable":"true","name":"P","alias":"P","type":"vector"},{"name":"TT","alias":"TT","type":"string"},{"changeable":"true","name":"R","alias":"R","type":"double"},{"name":"C","alias":"C","type":"color"},{"name":"CB","alias":"CB","type":"color"},{"name":"S","alias":"S","type":"long"}]};};
sap.ui.vbm.Circles.prototype.getActionArray=function(a){var i=this.getId();if(this.mEventRegistry["click"]||this.IsEventRegistered("click"))a.push({"id":i+"1","name":"click","refScene":"MainScene","refVO":i,"refEvent":"Click","AddActionProperty":[{"name":"pos"}]});if(this.mEventRegistry["contextMenu"]||this.IsEventRegistered("contextMenu"))a.push({"id":i+"2","name":"contextMenu","refScene":"MainScene","refVO":i,"refEvent":"ContextMenu"});if(this.mEventRegistry["drop"]||this.IsEventRegistered("drop"))a.push({"id":i+"3","name":"drop","refScene":"MainScene","refVO":i,"refEvent":"Drop"});a=sap.ui.vbm.VoAggregation.prototype.getActionArray.apply(this,arguments);return a;};
sap.ui.vbm.Circles.prototype.openDetailWindow=function(i,p){this.oParent.m_bUseClickPos=false;this.oParent.m_DTOpen=true;this.oParent.m_DTSrc=i;this.oParent.m_DTParams=p;this.oParent.m_bWindowsDirty=true;this.oParent.invalidate(this);};
sap.ui.vbm.Circles.prototype.openContextMenu=function(i,m){this.oParent.openContextMenu("Circle",i,m);};
