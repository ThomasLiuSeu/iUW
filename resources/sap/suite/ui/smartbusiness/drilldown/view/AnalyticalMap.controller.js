/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.drilldown.view.AnalyticalMap",{onInit:function(){this.parentController=null;if(this.getView().getViewData()){var v=this.getView().getViewData();this.parentController=v.parent;}this.utilsRef=sap.suite.ui.smartbusiness.lib.Util.utils;this.getAllMapColors();this.mapDetails=this.getMapDetails();},onBeforeRendering:function(){},onAfterRendering:function(){},onExit:function(){},onRegionClick:function(e){var t=this;jQuery.sap.log.info("Clicked on "+e.getParameter("code"));},onRegionContextMenu:function(e){},formatCountryCode:function(c){return c;},renderMap:function(){var t=this;var p=t.parentController;var m=t.getView().analyticalMap;var a={parts:[],formatter:jQuery.proxy(t.formatTooltip,t)};var b=t.mapDetails.getAllMeasures();a.parts.push({path:t.mapDetails.getMapDimension()});a.parts.push({path:t.mapDetails.getMapDimensionTextName()});b.forEach(function(d){a.parts.push({path:d});});var c=new sap.ui.vbm.Region({code:{path:t.mapDetails.getMapDimension(),formatter:jQuery.proxy(t.formatCountryCode,t)},color:{parts:[{path:t.mapDetails.getMapMeasure()},{path:t.mapDetails.getThresholdMeasure()}],formatter:t.getColorFormatterFunction(p.EVALUATION,t)},tooltip:a});m.bindAggregation("regions","/data",c);},getRgbaColorCode:function(s,o){var h=sap.ui.core.theming.Parameters.get(s);var r=this.utilsRef.convertHexToRgba(h,o);return r;},getColorFormatterFunction:function(e,c){var a=null;var s=function(m,t){m=parseFloat(m);t=parseFloat(t);return((m>t)?c.colors.semanticGoodColorRgba:((m==t)?c.colors.semanticNeutralColorRgba:c.colors.semanticBadColorRgba));};var b=function(m,t){m=parseFloat(m);t=parseFloat(t);return((m<t)?c.colors.semanticGoodColorRgba:((m==t)?c.colors.semanticNeutralColorRgba:c.colors.semanticBadColorRgba));};var r=function(m,t){m=parseFloat(m);t=parseFloat(t);return c.colors.semanticNeutralColorRgba;};var n=function(m,t){m=parseFloat(m);t=parseFloat(t);return((m>t)?c.colors.nonSemanticGoodColorRgba:((m==t)?c.colors.nonSemanticNeutralColorRgba:c.colors.nonSemanticBadColorRgba));};var d=function(m,t){m=parseFloat(m);t=parseFloat(t);return((m<t)?c.colors.nonSemanticGoodColorRgba:((m==t)?c.colors.nonSemanticNeutralColorRgba:c.colors.nonSemanticBadColorRgba));};if(e.isMaximizingKpi()){a=(c.mapDetails.isColorSchemeAutoSemantic())?s:n;}else if(e.isMinimizingKpi()){a=(c.mapDetails.isColorSchemeAutoSemantic())?b:d;}else{a=r;}return a;},getAllMapColors:function(){this.colors={};this.colors.NONSEMANTIC_GOOD_OPACITY="1.0";this.colors.NONSEMANTIC_NEUTRAL_OPACITY="0.60";this.colors.NONSEMANTIC_BAD_OPACITY="0.30";this.colors.semanticGoodColorRgba=this.colors.semanticGoodColorRgba||this.getRgbaColorCode("sapUiPositive");this.colors.semanticBadColorRgba=this.colors.semanticBadColorRgba||this.getRgbaColorCode("sapUiNegative");this.colors.semanticNeutralColorRgba=this.colors.semanticNeutralColorRgba||this.getRgbaColorCode("sapUiNeutral");this.colors.nonSemanticGoodColorRgba=this.colors.nonSemanticGoodColorRgba||this.getRgbaColorCode("sapUiNeutral",this.colors.NONSEMANTIC_GOOD_OPACITY);this.colors.nonSemanticBadColorRgba=this.colors.nonSemanticBadColorRgba||this.getRgbaColorCode("sapUiNeutral",this.colors.NONSEMANTIC_BAD_OPACITY);this.colors.nonSemanticNeutralColorRgba=this.colors.nonSemanticNeutralColorRgba||this.getRgbaColorCode("sapUiNeutral",this.colors.NONSEMANTIC_NEUTRAL_OPACITY);},getMapDetails:function(){var p=this.parentController;var s=p.SELECTED_VIEW;var a=s.getDimensions();var b=s.getMeasures();var m=(a&&a.length)?a[0]:"";var c=p.DIMENSION_TEXT_PROPERTY_MAPPING[m];var d=(s.getChartConfiguration()&&s.getChartConfiguration().length)?s.getChartConfiguration()[0]:null;var i=d.getColorScheme().isAutoSemantic();var t="";var e=[];if(d){t=d.getThresholdMeasure();if(t){b.forEach(function(g){if(g!=t){e.push(g);}});}else{e=b;}}var f=e[0];return{getMapMeasure:function(){return f;},getAllMeasures:function(){return b;},getMapDimension:function(){return m;},isColorSchemeAutoSemantic:function(){return i;},getThresholdMeasure:function(){return t;},getMeasuresExceptThreshold:function(){return e;},setMapMeasure:function(g){f=g;},getMapDimensionTextName:function(){return c;}}},formatTooltip:function(){var p=this.parentController;var v=arguments;var c=p.COLUMN_LABEL_MAPPING;var r=p.getView().getModel("i18n").getResourceBundle();var t=r.getText("OTHER_MEASURES")+" : \n";var m=r.getText("MAIN_MEASURE")+" : \n";var a=r.getText("THRESHOLD_MEASURE")+" : \n";var d=r.getText("DIMENSIONS")+" : \n";var b=this.mapDetails.getMapMeasure();var e=this.mapDetails.getThresholdMeasure();var f=this.mapDetails.getAllMeasures();var g=this.mapDetails;d+=(c[this.mapDetails.getMapDimension()]||this.mapDetails.getMapDimension())+" - "+v[1];for(var i=0,l=f.length;i<l;i++){if(f[i]==b){m+=(c[f[i]]||f[i])+" - "+v[i+2];}else if(f[i]==e){a+=(c[f[i]]||f[i])+" - "+v[i+2];}else{t+=(c[f[i]]||f[i])+" - "+v[i+2];}}t=d+"\n\n"+m+"\n\n"+a+"\n\n"+t;return t;}});
