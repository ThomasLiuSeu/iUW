/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.tiles.Bullet");jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Generic");sap.suite.ui.smartbusiness.tiles.Generic.extend("sap.suite.ui.smartbusiness.tiles.Bullet",{metadata:{properties:{kpiValueRequired:{type:"boolean",defaultValue:true},tileType:{type:"string",defaultValue:"AT"}}},renderer:{}});
sap.suite.ui.smartbusiness.tiles.Bullet.prototype.init=function(){sap.suite.ui.smartbusiness.tiles.Generic.prototype.init.apply(this);this.setAggregation("_tile",new sap.suite.ui.commons.GenericTile({header:"{/header}",subheader:"{/subheader}",size:this.getSize(),frameType:this.getFrameType(),tileContent:new sap.suite.ui.commons.TileContent({unit:"{/unit}",size:this.getSize(),footer:"{/footerNum}",content:new sap.suite.ui.commons.BulletChart({size:this.getSize(),state:"{/state}",scale:"{/scale}",actual:{value:"{/actual/value}",color:"{/actual/color}"},actualValueLabel:"{/actualValueLabel}",targetValue:"{/targetValue}",targetValueLabel:"{/targetValueLabel}",thresholds:{template:new sap.suite.ui.commons.BulletChartData({value:"{value}",color:"{color}"}),path:"/thresholds"},showActualValue:"{/showActualValue}",showTargetValue:"{/showTargetValue}",})}),press:jQuery.proxy(this.tilePressed,this)}));this.jsonModel=new sap.ui.model.json.JSONModel();this.setModel(this.jsonModel);};
sap.suite.ui.smartbusiness.tiles.Bullet.prototype.onBeforeRendering=function(){sap.suite.ui.smartbusiness.tiles.Generic.prototype.onBeforeRendering.apply(this);if(this.getContentOnly()){this.setAggregation("_tile",new sap.suite.ui.commons.TileContent({unit:"{/unit}",size:this.getSize(),footer:"{/footerNum}",content:new sap.suite.ui.commons.BulletChart({size:this.getSize(),state:"{/state}",scale:"{/scale}",actual:{value:"{/actual/value}",color:"{/actual/color}"},actualValueLabel:"{/actualValueLabel}",targetValue:"{/targetValue}",targetValueLabel:"{/targetValueLabel}",thresholds:{template:new sap.suite.ui.commons.BulletChartData({value:"{value}",color:"{color}"}),path:"/thresholds"},showActualValue:"{/showActualValue}",showTargetValue:"{/showTargetValue}",})}));}};
sap.suite.ui.smartbusiness.tiles.Bullet.prototype.doProcess=function(){var d={};var t=this.getThresholdsObjAndColor(this.KPI_VALUE,this.EVALUATION_DATA.GOAL_TYPE,this.WARNING_LOW_VALUE,this.WARNING_HIGH_VALUE,this.CRITICAL_LOW_VALUE,this.CRITICAL_HIGH_VALUE);var a={value:Number(this.KPI_VALUE),color:t.returnColor};var c=Number(this.KPI_VALUE);if(this.EVALUATION_DATA.SCALING==-2)c*=100;var f=sap.suite.ui.smartbusiness.lib.Util.utils.getLocaleFormattedValue(c,this.EVALUATION_DATA.SCALING,this.EVALUATION_DATA.DECIMAL_PRECISION);c=Number(this.TARGET_VALUE);if(this.EVALUATION_DATA.SCALING==-2)c*=100;var b=sap.suite.ui.smartbusiness.lib.Util.utils.getLocaleFormattedValue(c,this.EVALUATION_DATA.SCALING,this.EVALUATION_DATA.DECIMAL_PRECISION);if(true||this.isAssociatedKpi()){d.subheader=this.EVALUATION_DATA.TITLE;d.header=this.EVALUATION_DATA.INDICATOR_TITLE;}d.actual=a;d.thresholds=[];d.thresholds=t.arrObj;d.targetValue=Number(this.TARGET_VALUE);d.unit=this.UOM;d.actualValueLabel=f.toString();d.targetValueLabel=b.toString();if(this.EVALUATION_DATA.SCALING==-2){d.actualValueLabel+=" %";d.targetValueLabel+=" %";}this.jsonModel.setData(d);this.setDoneState();};
sap.suite.ui.smartbusiness.tiles.Bullet.prototype.doDummyProcess=function(){this.jsonModel.setData(this.getDummyDataForBulletTile());this.setDoneState();};
sap.suite.ui.smartbusiness.tiles.Bullet.prototype.getThresholdsObjAndColor=function(k,g,w,a,c,b){var t={};t.arrObj=[];t.returnColor=sap.suite.ui.commons.InfoTileValueColor.Neutral;if(g==="MI"){if(this.hasSomeValue(b,a)){b=window.parseFloat(b);a=window.parseFloat(a);t.arrObj.push({value:b,color:sap.suite.ui.commons.InfoTileValueColor.Error});t.arrObj.push({value:a,color:sap.suite.ui.commons.InfoTileValueColor.Critical});if(k<a){t.returnColor=sap.suite.ui.commons.InfoTileValueColor.Good;}else if(k<=b){t.returnColor=sap.suite.ui.commons.InfoTileValueColor.Critical;}else{t.returnColor=sap.suite.ui.commons.InfoTileValueColor.Error;}}else{jQuery.sap.log.warning("One of the threshold values for Minimizing type KPI is missing");}}else if(g==="MA"){if(this.hasSomeValue(c,w)){c=window.parseFloat(c);w=window.parseFloat(w);t.arrObj.push({value:c,color:sap.suite.ui.commons.InfoTileValueColor.Error});t.arrObj.push({value:w,color:sap.suite.ui.commons.InfoTileValueColor.Critical});if(k<c){t.returnColor=sap.suite.ui.commons.InfoTileValueColor.Error;}else if(k<=w){t.returnColor=sap.suite.ui.commons.InfoTileValueColor.Critical;}else{t.returnColor=sap.suite.ui.commons.InfoTileValueColor.Good;}}else{jQuery.sap.log.warning("One of the threshold values for Maximizing type KPI is missing");}}else{if(this.hasSomeValue(w,a,c,b)){b=window.parseFloat(b);a=window.parseFloat(a);w=window.parseFloat(w);c=window.parseFloat(c);t.arrObj.push({value:b,color:sap.suite.ui.commons.InfoTileValueColor.Error});t.arrObj.push({value:a,color:sap.suite.ui.commons.InfoTileValueColor.Critical});t.arrObj.push({value:w,color:sap.suite.ui.commons.InfoTileValueColor.Critical});t.arrObj.push({value:c,color:sap.suite.ui.commons.InfoTileValueColor.Error});if(k<c||k>b){t.returnColor=sap.suite.ui.commons.InfoTileValueColor.Error;}else if((k>=c&&k<=w)||(k>=a&&k<=b)){t.returnColor=sap.suite.ui.commons.InfoTileValueColor.Critical;}else{t.returnColor=sap.suite.ui.commons.InfoTileValueColor.Good;}}else{jQuery.sap.log.warning("One of the threshold values for Range type KPI is missing");}}return t;};
