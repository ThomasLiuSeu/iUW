/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.vbm.Legend");jQuery.sap.require("sap.ui.vbm.library");jQuery.sap.require("sap.ui.core.Element");sap.ui.core.Element.extend("sap.ui.vbm.Legend",{metadata:{library:"sap.ui.vbm",properties:{"caption":{type:"string",group:"Misc",defaultValue:'Legend'}},defaultAggregation:"items",aggregations:{"items":{type:"sap.ui.vbm.LegendItem",multiple:true,singularName:"item"}}}});
sap.ui.vbm.Legend.prototype.init=function(){};
sap.ui.vbm.Legend.prototype.getTemplateObject=function(){var i=this.getId();var w={};if(!this.oParent.getLegendVisible())w={"Remove":[{"name":i}]};else{w={"Set":[{"name":i,"Window":{"id":i,"type":"legend","caption":this.getCaption(),"type":"legend","refParent":"Main","refScene":"","modal":"true","datasource":i,"colors.bind":i+".C","images.bind":i+".I","texts.bind":i+".T","tooltips.bind":i+"TT"}}]};}return w;};
sap.ui.vbm.Legend.prototype.getDataObject=function(){var i=this.getItems();var s=[];for(var n=0,l=i.length;n<l;++n){var I=i[n];var e={"C":I.getColor(),"I":I.getImage(),"T":I.getText(),"TT":I.getTooltip()};s.push(e);}return{"name":this.getId(),"E":s};};
sap.ui.vbm.Legend.prototype.getTypeObject=function(){return{"A":[{"name":"C","alias":"C","type":"color"},{"name":"I","alias":"I","type":"string"},{"name":"T","alias":"T","type":"string"},{"name":"TT","alias":"TT","type":"string"}]};};
