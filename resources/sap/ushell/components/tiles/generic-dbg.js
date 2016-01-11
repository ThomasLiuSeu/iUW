jQuery.sap.require("sap.ushell.components.tiles.indicatorTileUtils.smartBusinessUtil");
jQuery.sap.require("sap.ui.model.analytics.odata4analytics");

jQuery.sap.require("sap.ui.core.mvc.Controller");
sap.ui.core.mvc.Controller.extend("sap.ushell.components.tiles.generic", {

	onAfterRendering : function () {
		
		var that = this;
		this.firstTimeVisible = false; 
		this.oKpiTileView = this.getView();
		this.oViewData = this.oKpiTileView.getViewData();
		this.oResourceBundle = sap.ushell.components.tiles.utils.getResourceBundleModel().getResourceBundle();
		this.oTileApi = this.oViewData.chip; // instance specific CHIP API
		if (this.oTileApi.visible) {
			this.oTileApi.visible.attachVisible(this.visibleHandler.bind(this));
		}
		this.system = this.oTileApi.url.getApplicationSystem();
		this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loading);

		this.getChipConfiguration( function(){

			if(that.oTileApi.preview.isEnabled()){
				that.doDummyProcess();
			}
			else{

				that.oKpiTileView.oGenericTile.attachPress(function(){
					sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(that.queryServiceUriODataReadRef);
					sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, null);
					window.location.hash = sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(that.oConfig,that.system);
				});
				that.fetchEvaluation(that.oConfig,  function(){
					that.DEFINITION_DATA = that.oConfig;
					if(that.KPI_VALUE_REQUIRED){
						that.fetchKpiValue( function(kpiValue,sThresholdObject){
							this.KPIVALUE = kpiValue;
							that.doProcess(kpiValue,sThresholdObject);
						},that.logError);
					}
					else{
						that.doProcess();
					}
				});
			}
		});

	},

	getChipConfiguration : function(callback){

		var that = this;
		try{
			sap.ushell.components.tiles.indicatorTileUtils.util.getParsedChip(
					that.oTileApi.configuration.getParameterValueAsString("tileConfiguration"), function(config){
						that.oConfig = config;
						if (that.oTileApi.preview) {
							that.oTileApi.preview.setTargetUrl(sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(that.oConfig,that.system));
						}
						callback.call();
					});			
		}
		catch(e){
			that.logError(e.message);
		}
	},

	fetchEvaluation : function(chipConfig,callback){
		var that = this;
		if(Number(that.oTileApi.configuration.getParameterValueAsString("isSufficient"))){
			sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(that.oConfig.TILE_PROPERTIES.id,that.oConfig);
			that.DEFINITION_DATA = chipConfig;
			that._updateTileModel(this.DEFINITION_DATA);
			if(that.oTileApi.visible.isVisible() && !that.firstTimeVisible){
				that.firstTimeVisible = true;
				var evaluationData = sap.ushell.components.tiles.indicatorTileUtils.cache.getEvaluationById(that.oConfig.EVALUATION.ID)
				if(evaluationData){
					that.oConfig.EVALUATION_FILTERS = evaluationData.EVALUATION_FILTERS;
					callback.call(evaluationData);

				}
				else{
					try{
						sap.ushell.components.tiles.indicatorTileUtils.util.getFilterFromRunTimeService(that.oConfig,function(filter){
							that.oConfig.EVALUATION_FILTERS = filter;
							sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(that.oConfig.TILE_PROPERTIES.id,that.oConfig);
							callback.call(filter);
						});

					}
					catch(e){
						that.logError("no evaluation data");
					}
				}
			}
			else{
				try{
					sap.ushell.components.tiles.indicatorTileUtils.util.getFilterFromRunTimeService(that.oConfig,function(filter){
						that.oConfig.EVALUATION_FILTERS = filter;
						sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(that.oConfig.TILE_PROPERTIES.id,that.oConfig);
						callback.call(filter);
					});

				}
				catch(e){
					that.logError("no evaluation data");
				}
			}
		}
		else{
			try{
				sap.ushell.components.tiles.indicatorTileUtils.util.getFilterFromRunTimeService(that.oConfig,function(filter){
					that.oConfig.EVALUATION_FILTERS = filter;
					sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(that.oConfig.TILE_PROPERTIES.id,that.oConfig);
					callback.call(filter);
				});

			}
			catch(e){
				that.logError("no evaluation data");
			}
		}

	},
	fetchKpiValue : function(callback , fnError){
		var that = this;
		var kpiValue = 0;
		var targetValue = 0;
		var criticalHighValue = 0;
		var criticalLowValue = 0;
		var warningHighValue = 0;
		var warningLowValue = 0;
		var trendValue = 0;
		try {
			var sUri = this.DEFINITION_DATA.EVALUATION.ODATA_URL;
			var sEntitySet = this.DEFINITION_DATA.EVALUATION.ODATA_ENTITYSET;
			var sThresholdObject = this.setThresholdValues();
			var sMeasure = sThresholdObject.fullyFormedMeasure;
			var cachedValue = sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id);
			if(!cachedValue){
				var variantData = sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(
						this.DEFINITION_DATA.EVALUATION_FILTERS,this.DEFINITION_DATA.ADDITIONAL_FILTERS);
				var oQuery = sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(
						that.oTileApi.url.addSystemToServiceUrl(sUri), sEntitySet, sMeasure, null, variantData);
				if(oQuery) {
					this.QUERY_SERVICE_MODEL = oQuery.model;
					this.queryUriForKpiValue = oQuery.uri;
					this.queryServiceUriODataReadRef = this.QUERY_SERVICE_MODEL.read(oQuery.uri, null, null, true, function(data) {
						if(data && data.results && data.results.length) {
							kpiValue=data.results[0][that.DEFINITION_DATA.EVALUATION.COLUMN_NAME];
							var writeData = {};
							if(oQuery.unit[0]){
								that._updateTileModel({
									unit : data.results[0][oQuery.unit[0].name]
								});
								writeData.unit = oQuery.unit[0];
								writeData.unit.name = oQuery.unit[0].name;
							}
							if(that.oConfig.TILE_PROPERTIES.frameType == "TwoByOne"){
								if(sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id)){
									writeData = sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id);
								}
								writeData.numericData = data;
							}
							else{
								writeData.data = data;
							}
							
							sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, writeData);
							if(that.DEFINITION_DATA.EVALUATION.VALUES_SOURCE == "MEASURE"){
								sThresholdObject.criticalHighValue = data.results[0][sThresholdObject.sCriticalHigh];
								sThresholdObject.criticalLowValue = data.results[0][sThresholdObject.sCriticalLow] ;
								sThresholdObject.warningHighValue = data.results[0][sThresholdObject.sWarningHigh];
								sThresholdObject.warningLowValue = data.results[0][sThresholdObject.sWarningLow];
								sThresholdObject.targetValue = data.results[0][sThresholdObject.sTarget];
								sThresholdObject.trendValue = data.results[0][sThresholdObject.sTrend];
							}else if(that.DEFINITION_DATA.EVALUATION.VALUES_SOURCE == "RELATIVE"){
								sThresholdObject.targetValue = Number(data.results[0][sThresholdObject.sTarget]);
								sThresholdObject.criticalHighValue = sThresholdObject.targetValue * sThresholdObject.criticalHighValue /100;
								sThresholdObject.criticalLowValue = sThresholdObject.targetValue * sThresholdObject.criticalLowValue /100 ;
								sThresholdObject.warningHighValue = sThresholdObject.targetValue * sThresholdObject.warningHighValue /100;
								sThresholdObject.warningLowValue = sThresholdObject.targetValue * sThresholdObject.warningLowValue /100;
								sThresholdObject.trendValue = Number(data.results[0][sThresholdObject.sTrend]);
							}
							callback.call(that, kpiValue,sThresholdObject );
						} else {
							that.logError("no data");
						}
					},function(eObject) {
                        if(eObject && eObject.response) {
                            jQuery.sap.log.error(eObject.message +" : "+eObject.request.requestUri);
                            fnError.call(that,eObject);
                        }
					});
				}
				else{
					that.logError("Error Preparing Query Service URI");
				}
			}
			else{
				if(cachedValue.numericData && cachedValue.numericData.results && cachedValue.numericData.results.length) {
					kpiValue=cachedValue.numericData.results[0][that.DEFINITION_DATA.EVALUATION.COLUMN_NAME];
					if(cachedValue.unit){
						that._updateTileModel({
							unit : cachedValue.numericData.results[0][cachedValue.unit.name]
						});
					}                        
					if(that.DEFINITION_DATA.EVALUATION.VALUES_SOURCE == "MEASURE"){
						sThresholdObject.criticalHighValue = cachedValue.numericData.results[0][sThresholdObject.sCriticalHigh];
						sThresholdObject.criticalLowValue = cachedValue.numericData.results[0][sThresholdObject.sCriticalLow] ;
						sThresholdObject.warningHighValue = cachedValue.numericData.results[0][sThresholdObject.sWarningHigh];
						sThresholdObject.warningLowValue = cachedValue.numericData.results[0][sThresholdObject.sWarningLow];
						sThresholdObject.targetValue = cachedValue.numericData.results[0][sThresholdObject.sTarget];
						sThresholdObject.trendValue = cachedValue.numericData.results[0][sThresholdObject.sTrend];
					}else if(that.DEFINITION_DATA.EVALUATION.VALUES_SOURCE == "RELATIVE"){
						sThresholdObject.targetValue = Number(cachedValue.numericData.results[0][sThresholdObject.sTarget]);
						sThresholdObject.criticalHighValue = sThresholdObject.targetValue * sThresholdObject.criticalHighValue /100;
						sThresholdObject.criticalLowValue = sThresholdObject.targetValue * sThresholdObject.criticalLowValue /100 ;
						sThresholdObject.warningHighValue = sThresholdObject.targetValue * sThresholdObject.warningHighValue /100;
						sThresholdObject.warningLowValue = sThresholdObject.targetValue * sThresholdObject.warningLowValue /100;
						sThresholdObject.trendValue = Number(cachedValue.numericData.results[0][sThresholdObject.sTrend]);
					}
					callback.call(that, kpiValue,sThresholdObject);
				} else {
					that.logError("no Response from QueryServiceUri");
				}
			}
		}catch(e) {
			that.logError(e);
		}

	},

	_setLocalModelToTile : function() {
		if(this.getTile().getModel()) {

		} else {
			this.getTile().setModel(new sap.ui.model.json.JSONModel({}));
		}
	},

	getTile : function() {
		return this.oKpiTileView.oGenericTile;
	},

	_updateTileModel : function(newData) {
		var modelData  = this.getTile().getModel().getData();
		jQuery.extend(modelData,newData);
		this.getTile().getModel().setData(modelData);
	},

	setToolTip : function(applyColor,calculatedValueForScaling,tileType){

		var that = this;
		var oControl;
		var sThresholdObject = this.setThresholdValues();
		if(tileType == "CONT" || tileType == "COMP"){
			if(this.oKpiTileView.getContent()[0].getTileContent().length){
				//var oControl = this.oKpiTileView.oGenericTile.getTileContent()[0].getContent();
				oControl = that.oKpiTileView.getContent()[0].getTileContent()[0].getContent();
				var m1,m2,m3,v1,v2,v3,c1,c2,c3;
				if(calculatedValueForScaling && calculatedValueForScaling[0]){
					m1 = calculatedValueForScaling[0].title;
					v1 = calculatedValueForScaling[0].value;
					c1 = sap.ushell.components.tiles.indicatorTileUtils.util.getSemanticColorName(calculatedValueForScaling[0].color);
				}
				if(calculatedValueForScaling && calculatedValueForScaling[1]){
					m2 = calculatedValueForScaling[1].title;
					v2 = calculatedValueForScaling[1].value;
					c2 = sap.ushell.components.tiles.indicatorTileUtils.util.getSemanticColorName(calculatedValueForScaling[1].color);
				}
				if(calculatedValueForScaling && calculatedValueForScaling[2]){
					m3 = calculatedValueForScaling[2].title;
					v3 = calculatedValueForScaling[2].value;
					c3 = sap.ushell.components.tiles.indicatorTileUtils.util.getSemanticColorName(calculatedValueForScaling[2].color);
				}
				var valueObj = {
						measure: this.oConfig.EVALUATION.COLUMN_NAME,
						m1 : m1,
						v1 : v1,
						c1 : c1,
						m2 : m2,
						v2 : v2,
						c2 : c2,
						m3 : m3,
						v3 : v3,
						c3 : c3
				};
				sap.ushell.components.tiles.indicatorTileUtils.util.setTooltipInTile(oControl,tileType,valueObj);

			}
			
		}
		else{

			var status = "";
			if(applyColor == "Error")
				status = "sb.error";
			if(applyColor == "Neutral")
				status = "sb.neutral";
			if(applyColor == "Critical")
				status = "sb.critical";
			if(applyColor == "Good")
				status = "sb.good";
			var valueObj = {
					status : status,
					actual : calculatedValueForScaling,
					target : sThresholdObject.targetValue,
					cH : sThresholdObject.criticalHighValue,
					wH : sThresholdObject.warningHighValue,
					wL : sThresholdObject.warningLowValue,
					cL : sThresholdObject.criticalLowValue
			};
			//var oControl = that.oKpiTileView.oGenericTile.getTileContent()[0].getContent();
			var oControl = that.oKpiTileView.getContent()[0].getTileContent()[0].getContent();
			sap.ushell.components.tiles.indicatorTileUtils.util.setTooltipInTile(oControl,tileType,valueObj)
//			if(parseFloat(calculatedValueForScaling)!=0 && !calculatedValueForScaling){
//				this.logError("no data");
//			}
		}
	},

	getTrendColor : function(sThresholdObj){
		var that = this;
		try{
			var improvementDirection = this.DEFINITION_DATA.EVALUATION.GOAL_TYPE;
			var evalValue = this.DEFINITION_DATA.EVALUATION_VALUES;
			var returnColor = sap.suite.ui.commons.InfoTileValueColor.Neutral;
			if(improvementDirection === "MI") {
				if(sThresholdObj.criticalHighValue && sThresholdObj.warningHighValue) {
					criticalHighValue = Number(sThresholdObj.criticalHighValue);
					warningHighValue = Number(sThresholdObj.warningHighValue);
					if(this.CALCULATED_KPI_VALUE < warningHighValue) {
						returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
					} else if(this.CALCULATED_KPI_VALUE <= criticalHighValue) {
						returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
					} else {
						returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
					}
				}
			} else if(improvementDirection === "MA") {
				if(sThresholdObj.criticalLowValue && sThresholdObj.warningLowValue) {
					criticalLowValue = Number(sThresholdObj.criticalLowValue);
					warningLowValue = Number(sThresholdObj.warningLowValue);
					if(this.CALCULATED_KPI_VALUE < criticalLowValue) {
						returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
					} else if(this.CALCULATED_KPI_VALUE <= warningLowValue) {
						returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
					} else {
						returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
					}
				}
			} else {
				if(sThresholdObj.warningLowValue && sThresholdObj.warningHighValue && sThresholdObj.criticalLowValue && sThresholdObj.criticalHighValue) {
					criticalHighValue = Number(sThresholdObj.criticalHighValue);
					warningHighValue = Number(sThresholdObj.warningHighValue);
					warningLowValue = Number(sThresholdObj.warningLowValue);
					criticalLowValue = Number(sThresholdObj.criticalLowValue);
					if(this.CALCULATED_KPI_VALUE < criticalLowValue || this.CALCULATED_KPI_VALUE > criticalHighValue) {
						returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
					} else if((this.CALCULATED_KPI_VALUE >= criticalLowValue && this.CALCULATED_KPI_VALUE <= warningLowValue) || 
							(this.CALCULATED_KPI_VALUE >= warningHighValue && this.CALCULATED_KPI_VALUE <= criticalHighValue)
					) {
						returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
					} else {
						returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
					}
				}
			}
			return returnColor;
		}
		catch(e){
			that.logError(e);
		}
	},

	getTrendIndicator : function(trendValue) {
		var that = this;
		trendValue = Number(trendValue);
		try{
			var trendIndicator = sap.suite.ui.commons.DeviationIndicator.None;
			if(trendValue > this.CALCULATED_KPI_VALUE){
				trendIndicator = sap.suite.ui.commons.DeviationIndicator.Down;
			}
			else if(trendValue < this.CALCULATED_KPI_VALUE){
				trendIndicator = sap.suite.ui.commons.DeviationIndicator.Up;
			}
			return trendIndicator;
		}
		catch(e){
			that.logError(e);
		}
	},


	setThresholdValues : function(){
		var that = this;
		try{ 
			var oThresholdObject = {};
			oThresholdObject.fullyFormedMeasure = this.DEFINITION_DATA.EVALUATION.COLUMN_NAME;
			if(this.DEFINITION_DATA.EVALUATION.VALUES_SOURCE == "MEASURE"){
				switch(this.DEFINITION_DATA.EVALUATION.GOAL_TYPE){
				case "MI" :
					oThresholdObject.sWarningHigh =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WH", "MEASURE");
					oThresholdObject.sCriticalHigh =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CH", "MEASURE");
					oThresholdObject.sTarget =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TA", "MEASURE");
					oThresholdObject.sTrend =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TC", "MEASURE");
					oThresholdObject.fullyFormedMeasure += that.formSelectStatement(oThresholdObject);
					break;
				case "MA" :
					oThresholdObject.sWarningLow =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WL", "MEASURE");
					oThresholdObject.sCriticalLow =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CL", "MEASURE");
					oThresholdObject.sTarget =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TA", "MEASURE");
					oThresholdObject.sTrend =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TC", "MEASURE");
					oThresholdObject.fullyFormedMeasure += that.formSelectStatement(oThresholdObject);
					break;
				case "RA" :
					oThresholdObject.sWarningHigh =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WH", "MEASURE");
					oThresholdObject.sCriticalHigh =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CH", "MEASURE");
					oThresholdObject.sTarget =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TA", "MEASURE");
					oThresholdObject.sTrend =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TC", "MEASURE");
					oThresholdObject.sWarningLow =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WL", "MEASURE");
					oThresholdObject.sCriticalLow =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CL", "MEASURE");
					oThresholdObject.fullyFormedMeasure += that.formSelectStatement(oThresholdObject);
					break;
				}
			} else if(this.DEFINITION_DATA.EVALUATION.VALUES_SOURCE == "RELATIVE"){
                 oThresholdObject.sTarget = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TA", "MEASURE");
                 oThresholdObject.sTrend =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TC", "MEASURE");
                 oThresholdObject.fullyFormedMeasure += that.formSelectStatement(oThresholdObject);
                 oThresholdObject.criticalHighValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CH", "FIXED");
                 oThresholdObject.criticalLowValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CL", "FIXED");
                 oThresholdObject.warningHighValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WH", "FIXED");
                 oThresholdObject.warningLowValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WL", "FIXED");
           } else {
				oThresholdObject.criticalHighValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CH", "FIXED");
				oThresholdObject.criticalLowValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CL", "FIXED");
				oThresholdObject.warningHighValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WH", "FIXED");
				oThresholdObject.warningLowValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WL", "FIXED");
				oThresholdObject.targetValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TA", "FIXED");
				oThresholdObject.trendValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TC", "FIXED");
           }
			return oThresholdObject;
		}
		catch(e){
			that.logError(e);
		}
	},

	formSelectStatement : function(object) {
		var tmpArray = Object.keys(object);
		var sFormedMeasure = "";
		for(var i=0;i<tmpArray.length;i++)
			if((object[tmpArray[i]] !== undefined) && (object.fullyFormedMeasure))sFormedMeasure+=","+object[tmpArray[i]];
		return sFormedMeasure;
	},

	setTextInTile : function(){

		var that =this;
		var titleObj = sap.ushell.components.tiles.indicatorTileUtils.util.getTileTitleSubtitle(this.oTileApi);
		this._updateTileModel({ 

			header : titleObj.title || sap.ushell.components.tiles.indicatorTileUtils.util.getChipTitle(that.oConfig ), 
			subheader : titleObj.subTitle || sap.ushell.components.tiles.indicatorTileUtils.util.getChipSubTitle(that.oConfig )
		});
	},

	logError : function(err){
		this._updateTileModel({
			value : "",
			scale : "",
			unit: ""
		});
		if(this.getView().getViewData().deferredObj){
			this.getView().getViewData().deferredObj.reject();
		}
		else{
			this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);
		}
	},
	
	refreshHandler : function () {
		
		if(!this.firstTimeVisible){
			if(Number(this.oTileApi.configuration.getParameterValueAsString("isSufficient"))){
				if(this.KPI_VALUE_REQUIRED){
					this.doProcess(this.KPIVALUE,this.setThresholdValues());
				}
				else{
					this.doProcess();
				}
			}
			else{
				this.fetchEvaluation(this.oConfig, function(){
					if(this.KPI_VALUE_REQUIRED){
						this.doProcess(this.KPIVALUE,this.setThresholdValues());
					}
					else{
						this.doProcess();
					}
				});
			}
		}
		
	},
	
	visibleHandler : function (isVisible) {
		if (!isVisible) {
			this.firstTimeVisible = false;
			sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.queryServiceUriODataReadRef);
		}
		if (isVisible) {
			this.refreshHandler(this);
		}
	},
	onExit : function(){
		sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.queryServiceUriODataReadRef);
	}

});
