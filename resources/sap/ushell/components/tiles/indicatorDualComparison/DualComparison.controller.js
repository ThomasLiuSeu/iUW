sap.ui.controller("tiles.indicatorDualComparison.DualComparison",{onInit:function(){var t=this;this.firstTimeVisible=false;this.oDualComparisonView=this.getView();this.oChip=this.oDualComparisonView.getViewData().chip;if(this.oChip.visible){this.oChip.visible.attachVisible(this.visibleHandler.bind(this));}this.system=this.oChip.url.getApplicationSystem();this.oDualComparisonView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loading);try{sap.ushell.components.tiles.indicatorTileUtils.util.getParsedChip(this.oChip.configuration.getParameterValueAsString("tileConfiguration"),function(c){t.oConfig=c;if(t.oChip.preview){t.oChip.preview.setTargetUrl(sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system));}if(t.oChip.preview.isEnabled()){t.setTitle();t._updateTileModel({value:1,size:sap.suite.ui.commons.InfoTileSize.Auto,frameType:"TwoByOne",state:sap.suite.ui.commons.LoadState.Loading,valueColor:sap.suite.ui.commons.InfoTileValueColor.Good,indicator:sap.suite.ui.commons.DeviationIndicator.None,title:"Liquidity Structure",footer:"Current Quarter",description:"Apr 1st 2013 (B$)",data:[{title:"Measure 1",value:1,color:"Good"},{title:"Measure 2",value:2,color:"Good"},{title:"Measure 3",value:3,color:"Good"}],});t.oDualComparisonView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);}else{t.oConfig.TILE_PROPERTIES.FINALVALUE;t.setTitle();t.oDualComparisonView.oGenericTile.attachPress(function(){sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(t.comparisionChartODataRef);sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,null);window.location.hash=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system);});if(Number(t.oChip.configuration.getParameterValueAsString("isSufficient"))){sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(t.oConfig.TILE_PROPERTIES.id,t.oConfig);t.flowWithoutDesignTimeCall();}else{t.flowWithDesignTimeCall();}}});}catch(e){this.logError(e);}},getTile:function(){return this.oDualComparisonView.oGenericTile;},setTitle:function(){var t=this;var a=sap.ushell.components.tiles.indicatorTileUtils.util.getTileTitleSubtitle(this.oChip);this._updateTileModel({header:a.title||sap.ushell.components.tiles.indicatorTileUtils.util.getChipTitle(t.oConfig),subheader:a.subTitle||sap.ushell.components.tiles.indicatorTileUtils.util.getChipSubTitle(t.oConfig)});},_updateTileModel:function(n){var m=this.getTile().getModel().getData();jQuery.extend(m,n);this.getTile().getModel().setData(m);},flowWithoutDesignTimeCall:function(){var t=this;this.DEFINITION_DATA=this.oConfig;this._updateTileModel(this.DEFINITION_DATA);if(this.oChip.visible.isVisible()&&!this.firstTimeVisible){this.firstTimeVisible=true;this.fetchKpiValue(function(k){this.CALCULATED_KPI_VALUE=k;t.oDualComparisonView.oGenericTile.setFrameType("TwoByOne");t.oDualComparisonView.oGenericTile.removeAllTileContent();t.oDualComparisonView.oGenericTile.addTileContent(t.oDualComparisonView.oNumericTile);t.oDualComparisonView.oGenericTile.addTileContent(t.oDualComparisonView.oComparisonTile);var c=this.CALCULATED_KPI_VALUE;var a,b;for(var i=0;i<c.length;i++){if(c[i].title==t.DEFINITION_DATA.EVALUATION.COLUMN_NAME){b=c[i].value;a=c[i].color||"Neutral";t._updateTileModel({value:sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(b),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION).toString(),valueColor:a});break;}}if(!a&&!b){a=t.DEFINITION_DATA.valueColor;b=t.DEFINITION_DATA.value;}this._updateTileModel({value:sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(b),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION).toString(),data:this.CALCULATED_KPI_VALUE});var n=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system);t.oDualComparisonView.oGenericTile.$().wrap("<a href ='"+n+"'/>");this.oDualComparisonView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);var s="";if(a=="Error")s="sb.error";if(a=="Neutral")s="sb.neutral";if(a=="Critical")s="sb.critical";if(a=="Good")s="sb.good";var T=t.setThresholdValues();var m,d,e,v,f,g,h,j,l;if(this.CALCULATED_KPI_VALUE&&this.CALCULATED_KPI_VALUE[0]){m=this.CALCULATED_KPI_VALUE[0].title;v=this.CALCULATED_KPI_VALUE[0].value;h=sap.ushell.components.tiles.indicatorTileUtils.util.getSemanticColorName(this.CALCULATED_KPI_VALUE[0].color);}if(this.CALCULATED_KPI_VALUE&&this.CALCULATED_KPI_VALUE[1]){d=this.CALCULATED_KPI_VALUE[1].title;f=this.CALCULATED_KPI_VALUE[1].value;j=sap.ushell.components.tiles.indicatorTileUtils.util.getSemanticColorName(this.CALCULATED_KPI_VALUE[1].color);}if(this.CALCULATED_KPI_VALUE&&this.CALCULATED_KPI_VALUE[2]){e=this.CALCULATED_KPI_VALUE[2].title;g=this.CALCULATED_KPI_VALUE[2].value;l=sap.ushell.components.tiles.indicatorTileUtils.util.getSemanticColorName(this.CALCULATED_KPI_VALUE[2].color);}var o={status:s,actual:b,target:T.targetValue,cH:T.criticalHighValue,wH:T.warningHighValue,wL:T.warningLowValue,cL:T.criticalLowValue};var p={m1:m,v1:v,c1:h,m2:d,v2:f,c2:j,m3:e,v3:g,c3:l};var C=t.oDualComparisonView.oGenericTile.getTileContent()[0].getContent();var q=t.oDualComparisonView.oGenericTile.getTileContent()[1].getContent();sap.ushell.components.tiles.indicatorTileUtils.util.setTooltipInTile(C,"NT",o);sap.ushell.components.tiles.indicatorTileUtils.util.setTooltipInTile(q,"COMP",p);},this.logError);}},flowWithDesignTimeCall:function(){var t=this;try{var a=sap.ushell.components.tiles.indicatorTileUtils.cache.getEvaluationById(this.oConfig.EVALUATION.ID);if(a){t.oConfig.EVALUATION_FILTERS=a.EVALUATION_FILTERS;t.flowWithoutDesignTimeCall();}else{sap.ushell.components.tiles.indicatorTileUtils.util.getFilterFromRunTimeService(this.oConfig,function(f){t.oConfig.EVALUATION_FILTERS=f;sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(t.oConfig.TILE_PROPERTIES.id,t.oConfig);t.flowWithoutDesignTimeCall();});}}catch(e){this.logError(e);}},fetchKpiValue:function(s,E){var t=this;try{var u=this.oConfig.EVALUATION.ODATA_URL;var a=this.oConfig.EVALUATION.ODATA_ENTITYSET;if(this.oConfig.TILE_PROPERTIES.semanticMeasure){var m=this.oConfig.EVALUATION.COLUMN_NAME+","+this.oConfig.TILE_PROPERTIES.semanticMeasure;}else{var m=this.oConfig.EVALUATION.COLUMN_NAME;var b=m;if(this.oConfig.TILE_PROPERTIES.COLUMN_NAMES){for(var j=0;j<this.oConfig.TILE_PROPERTIES.COLUMN_NAMES.length;j++){if(this.oConfig.TILE_PROPERTIES.COLUMN_NAMES[j].COLUMN_NAME!=this.oConfig.EVALUATION.COLUMN_NAME)b=b+","+this.oConfig.TILE_PROPERTIES.COLUMN_NAMES[j].COLUMN_NAME;}}}var d=this.oConfig.EVALUATION_VALUES;var c=sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);if(!c){var v=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(this.oConfig.EVALUATION_FILTERS,this.oConfig.ADDITIONAL_FILTERS);var o={};o["0"]=m+",asc";o["1"]=m+",desc";var f=o[this.oConfig.TILE_PROPERTIES.sortOrder||"0"].split(",");var g=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oChip.url.addSystemToServiceUrl(u),a,b,null,v,3);if(this.oConfig.TILE_PROPERTIES.semanticMeasure)g.uri+="&$orderby="+f[0]+" "+f[2];else g.uri+="&$orderby="+f[0]+" "+f[1];this.writeData={};this.comparisionChartODataRef=g.model.read(g.uri,null,null,true,function(d){if(d&&d.results&&d.results.length){if(g.unit){t.writeData.unit=g.unit;}t.oConfig.TILE_PROPERTIES.FINALVALUE=d;t.oConfig.TILE_PROPERTIES.FINALVALUE=t._processDataForComparisonChart(t.oConfig.TILE_PROPERTIES.FINALVALUE,b.split(",")[0],g.unit);t.writeData.data=d;var k,l;for(var i=0;i<t.oConfig.TILE_PROPERTIES.FINALVALUE.length;i++){if(t.oConfig.TILE_PROPERTIES.FINALVALUE[i].title==t.DEFINITION_DATA.EVALUATION.COLUMN_NAME){t.writeData.numericData=t.oConfig.TILE_PROPERTIES.FINALVALUE[i];l=t.oConfig.TILE_PROPERTIES.FINALVALUE[i].value;k=t.getTrendIndicator(t.setThresholdValues().trendValue,l);t._updateTileModel({valueColor:t.oConfig.TILE_PROPERTIES.FINALVALUE[i].color,value:sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(calculatedValueForScaling),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION).toString()});break;}}sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,t.writeData);s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else if(d.results.length==0){t.oConfig.TILE_PROPERTIES.FINALVALUE=d;t.writeData.data=d;sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,t.writeData);s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else{E.call(t,"no Response from QueryServiceUri");}},function(i){if(i&&i.response){jQuery.sap.log.error(i.message+" : "+i.request.requestUri);E.call(t,i);}});if(!t.writeData.numericData){var h=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(t.DEFINITION_DATA.EVALUATION_FILTERS,t.DEFINITION_DATA.ADDITIONAL_FILTERS);var q=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oChip.url.addSystemToServiceUrl(u),a,m,null,h);if(q){t.QUERY_SERVICE_MODEL=q.model;t.queryUriForKpiValue=q.uri;t.numericODataReadRef=t.QUERY_SERVICE_MODEL.read(q.uri,null,null,true,function(d){if(d&&d.results&&d.results.length){if(q.unit){t._updateTileModel({unitNumeric:d.results[0][q.unit.name]});t.writeData.unitNumeric=q.unit;t.writeData.unitNumeric.name=q.unit.name;}t.writeData.numericData=d.results[0];t.DEFINITION_DATA.value=t.writeData.numericData[t.DEFINITION_DATA.EVALUATION.COLUMN_NAME];t.writeData.numericData.color=t.getTrendColor(t.setThresholdValues());t.DEFINITION_DATA.valueColor=t.writeData.numericData.color;var S="";var i=d.results[0][t.DEFINITION_DATA.EVALUATION.COLUMN_NAME];var k=t.getTrendIndicator(t.setThresholdValues().trendValue,i);if(t.oConfig.EVALUATION.SCALING==-2){i*=100;t.getView().oNumericContent.setFormatterValue(false);}S=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(i),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION);if(t.oConfig.EVALUATION.SCALING==-2)t._updateTileModel({scale:"%"});t._updateTileModel({value:S.toString(),valueColor:t.writeData.numericData.color,indicator:k});}else{E.call(t,"no Response from QueryServiceUri");}});}}}else{if(c.unit){t._updateTileModel({unit:c.data.results[0][c.unit.name]});}if(c.data&&c.data.results&&c.data.results.length){t.oConfig.TILE_PROPERTIES.FINALVALUE=c.data;t._updateTileModel({value:c.data.results[0][t.DEFINITION_DATA.EVALUATION.COLUMN_NAME]});t.oConfig.TILE_PROPERTIES.FINALVALUE=t._processDataForComparisonChart(t.oConfig.TILE_PROPERTIES.FINALVALUE,b,t.writeData.unit);s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else if(d.results.length==0){t.oConfig.TILE_PROPERTIES.FINALVALUE=c.data;s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else{E.call(t,"no Response from QueryServiceUri");}}}catch(e){E.call(t,e);}},formSelectStatement:function(o){var t=Object.keys(o);var f="";for(var i=0;i<t.length;i++)if((o[t[i]]!==undefined)&&(o.fullyFormedMeasure))f+=","+o[t[i]];return f;},getTrendIndicator:function(t,v){var a=this;t=Number(t);try{var b=sap.suite.ui.commons.DeviationIndicator.None;if(t>v){b=sap.suite.ui.commons.DeviationIndicator.Down;}else if(t<v){b=sap.suite.ui.commons.DeviationIndicator.Up;}return b;}catch(e){a.logError(e);}},getTrendColor:function(t){var a=this;try{var i=this.DEFINITION_DATA.EVALUATION.GOAL_TYPE;var b=this.DEFINITION_DATA.EVALUATION_VALUES;var r=sap.suite.ui.commons.InfoTileValueColor.Neutral;if(i==="MI"){if(t.criticalHighValue&&t.warningHighValue){criticalHighValue=Number(t.criticalHighValue);warningHighValue=Number(t.warningHighValue);if(this.CALCULATED_KPI_VALUE<warningHighValue){r=sap.suite.ui.commons.InfoTileValueColor.Good;}else if(this.CALCULATED_KPI_VALUE<=criticalHighValue){r=sap.suite.ui.commons.InfoTileValueColor.Critical;}else{r=sap.suite.ui.commons.InfoTileValueColor.Error;}}}else if(i==="MA"){if(t.criticalLowValue&&t.warningLowValue){criticalLowValue=Number(t.criticalLowValue);warningLowValue=Number(t.warningLowValue);if(this.CALCULATED_KPI_VALUE<criticalLowValue){r=sap.suite.ui.commons.InfoTileValueColor.Error;}else if(this.CALCULATED_KPI_VALUE<=warningLowValue){r=sap.suite.ui.commons.InfoTileValueColor.Critical;}else{r=sap.suite.ui.commons.InfoTileValueColor.Good;}}}else{if(t.warningLowValue&&t.warningHighValue&&t.criticalLowValue&&t.criticalHighValue){criticalHighValue=Number(t.criticalHighValue);warningHighValue=Number(t.warningHighValue);warningLowValue=Number(t.warningLowValue);criticalLowValue=Number(t.criticalLowValue);if(this.CALCULATED_KPI_VALUE<criticalLowValue||this.CALCULATED_KPI_VALUE>criticalHighValue){r=sap.suite.ui.commons.InfoTileValueColor.Error;}else if((this.CALCULATED_KPI_VALUE>=criticalLowValue&&this.CALCULATED_KPI_VALUE<=warningLowValue)||(this.CALCULATED_KPI_VALUE>=warningHighValue&&this.CALCULATED_KPI_VALUE<=criticalHighValue)){r=sap.suite.ui.commons.InfoTileValueColor.Critical;}else{r=sap.suite.ui.commons.InfoTileValueColor.Good;}}}return r;}catch(e){a.logError(e);}},_processDataForComparisonChart:function(d,m,u){var f=[],L={},i,t,l;var a;var T=[];var b=this;for(i=0;i<d.results.length;i++){var e=d.results[i];}T=sap.ushell.components.tiles.indicatorTileUtils.util.getAllMeasuresWithLabelText(this.oConfig.EVALUATION.ODATA_URL,this.oConfig.EVALUATION.ODATA_ENTITYSET);for(i=0,l=T.length;i<l;i++){t=T[i];L[t.key]=t.value;}var c=b.oConfig.TILE_PROPERTIES.COLUMN_NAMES||b.oConfig.EVALUATION.COLUMN_NAMES;for(i=0;i<c.length;i++){var g={};var h=c[i];g.value=Number(e[h.COLUMN_NAME]);var j=Number(e[h.COLUMN_NAME]);if(b.oConfig.EVALUATION.SCALING==-2)j*=100;a=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(j,b.oConfig.EVALUATION.SCALING,b.oConfig.EVALUATION.DECIMAL_PRECISION);if(b.oConfig.EVALUATION.SCALING==-2)a+=" %";g.displayValue=a.toString();if(u[i]&&e[u[i].name]){g.displayValue+=" "+e[u[i].name];}g.color=h.semanticColor;g.title=L[h.COLUMN_NAME]||h.COLUMN_NAME;f.push(g);}return f;},setThresholdValues:function(){var t=this;try{var T={};T.fullyFormedMeasure=this.DEFINITION_DATA.EVALUATION.COLUMN_NAME;if(this.DEFINITION_DATA.EVALUATION.VALUES_SOURCE=="MEASURE"){switch(this.DEFINITION_DATA.EVALUATION.GOAL_TYPE){case"MI":T.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");T.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;case"MA":T.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");T.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;case"RA":T.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");T.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");T.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;}}else{T.criticalHighValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","FIXED");T.criticalLowValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","FIXED");T.warningHighValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","FIXED");T.warningLowValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","FIXED");T.targetValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","FIXED");T.trendValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","FIXED");}return T;}catch(e){t.logError(e);}},logError:function(e){this.oDualComparisonView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);this.oDualComparisonView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);sap.ushell.components.tiles.indicatorTileUtils.util.logError(e);},refreshHandler:function(c){if(!c.firstTimeVisible){if(Number(this.oChip.configuration.getParameterValueAsString("isSufficient")))c.flowWithoutDesignTimeCall();else c.flowWithDesignTimeCall();}},visibleHandler:function(i){if(!i){this.firstTimeVisible=false;sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.comparisionChartODataRef);}if(i){this.refreshHandler(this);}},onExit:function(){sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.comparisionChartODataRef);}});
