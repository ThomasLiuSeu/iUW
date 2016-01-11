jQuery.sap.require("sap.ushell.components.tiles.generic");

(function () {
	"use strict";
	sap.ushell.components.tiles.generic.extend("tiles.indicatorcomparison.ComparisonTile", {
		onInit :  function(){
			this.KPI_VALUE_REQUIRED = false;
		},

		doProcess : function(){

			var that = this;
			this.fetchChartData(function(kpiValue){
				this.CALCULATED_KPI_VALUE=kpiValue;

				this.setTextInTile();
				this._updateTileModel({
					data : this.CALCULATED_KPI_VALUE
				});
				if(that.oConfig.TILE_PROPERTIES.frameType == sap.suite.ui.commons.FrameType.TwoByOne){
					that.oKpiTileView.oGenericTile.setFrameType(sap.suite.ui.commons.FrameType.TwoByOne);
					that.oKpiTileView.oGenericTile.removeAllTileContent();
					that.oKpiTileView.oGenericTile.addTileContent(that.oKpiTileView.oComparisonTile);
					var columnNames= {};
					columnNames.data = this.CALCULATED_KPI_VALUE;
					that.getView().getViewData().parentController._updateTileModel(columnNames);
					that.getView().getViewData().deferredObj.resolve();
				}
				else {
					that.oKpiTileView.oGenericTile.setFrameType(sap.suite.ui.commons.FrameType.OneByOne);
					that.oKpiTileView.oGenericTile.removeAllTileContent();
					that.oKpiTileView.oGenericTile.addTileContent(that.oKpiTileView.oComparisonTile);
					var navTarget = sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(that.oConfig,that.system);
					that.oKpiTileView.oGenericTile.$().wrap("<a href ='" + navTarget + "'/>");
					this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);
				}
				this.setToolTip(null,this.CALCULATED_KPI_VALUE,"COMP");
			}, this.logError);  

		},


		fetchChartData: function(fnSuccess, fnError){

			var that = this;

			try {
				/* Preparing arguments for the prepareQueryServiceUri function */
				var sUri= this.oConfig.EVALUATION.ODATA_URL;
				var entitySet= this.oConfig.EVALUATION.ODATA_ENTITYSET;
				var measure=this.oConfig.EVALUATION.COLUMN_NAME;
				var measures=measure;
				if(this.oConfig.TILE_PROPERTIES.COLUMN_NAMES){
					for(var j=0; j<this.oConfig.TILE_PROPERTIES.COLUMN_NAMES.length;j++){
						if(this.oConfig.TILE_PROPERTIES.COLUMN_NAMES[j].COLUMN_NAME != this.oConfig.EVALUATION.COLUMN_NAME)
							measures = measures + "," +this.oConfig.TILE_PROPERTIES.COLUMN_NAMES[j].COLUMN_NAME ;

					}
				}else{
					for(var j=0;j<this.oConfig.EVALUATION.COLUMN_NAMES.length;j++){
						if(this.oConfig.EVALUATION.COLUMN_NAMES[j].COLUMN_NAME != this.oConfig.EVALUATION.COLUMN_NAME)
							measures = measures + "," +this.oConfig.EVALUATION.COLUMN_NAMES[j].COLUMN_NAME ;

					}
				}

				var data= this.oConfig.EVALUATION_VALUES;
				var cachedValue = sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id);
				if(!cachedValue){
					var variants = sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(this.oConfig.EVALUATION_FILTERS,this.oConfig.ADDITIONAL_FILTERS);

					var orderByObject = {};
					orderByObject["0"] = measure+",asc";
					orderByObject["1"] = measure+",desc";

					var orderByElement = orderByObject[this.oConfig.TILE_PROPERTIES.sortOrder||"0"].split(",");
					var finalQuery = sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(that.oTileApi.url.addSystemToServiceUrl(sUri), entitySet, measures,null, variants, 3);        
					if(this.oConfig.TILE_PROPERTIES.semanticMeasure)
						finalQuery.uri += "&$orderby="+orderByElement[0]+" "+orderByElement[2];
					else
						finalQuery.uri += "&$orderby="+orderByElement[0]+" "+orderByElement[1] ;


					this.comparisionChartODataRef = finalQuery.model.read(finalQuery.uri, null, null, true, function(data) {
						var writeData = {};
						if(finalQuery.unit){
							writeData.unit = finalQuery.unit;

						}

						if(data && data.results && data.results.length) {


							that.oConfig.TILE_PROPERTIES.FINALVALUE = data;
							that.oConfig.TILE_PROPERTIES.FINALVALUE = that._processDataForComparisonChart(that.oConfig.TILE_PROPERTIES.FINALVALUE,measures.split(",")[0], finalQuery.unit);
							if(sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id)){
								writeData = sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id);
								writeData.data = data;
							}
							else{
								writeData.data = data;
							}
							sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, writeData);
							fnSuccess.call(that,that.oConfig.TILE_PROPERTIES.FINALVALUE);
						} 
						else if(data.results.length == 0){
							that.oConfig.TILE_PROPERTIES.FINALVALUE = data;
							if(sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id)){
								writeData = sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id);
								writeData.data = data;
							}
							else{
								writeData.data = data;
							}
							sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, writeData);
							fnSuccess.call(that,that.oConfig.TILE_PROPERTIES.FINALVALUE);
						}
						else {
							fnError.call(that,"no data");
						}
					},function(eObject) {
						if(eObject && eObject.response) {
							jQuery.sap.log.error(eObject.message +" : "+eObject.request.requestUri);
							fnError.call(that,eObject);
						}
					});
				}
				else{

					if(cachedValue.data && cachedValue.data.results && cachedValue.data.results.length) {

						that.oConfig.TILE_PROPERTIES.FINALVALUE = cachedValue.data;
						that.oConfig.TILE_PROPERTIES.FINALVALUE = that._processDataForComparisonChart(that.oConfig.TILE_PROPERTIES.FINALVALUE, measures, cachedValue.unit);
						fnSuccess.call(that,that.oConfig.TILE_PROPERTIES.FINALVALUE);
					} 
					else if(data.results.length == 0){
						that.oConfig.TILE_PROPERTIES.FINALVALUE = cachedValue.data;
						fnSuccess.call(that,that.oConfig.TILE_PROPERTIES.FINALVALUE);
					}
					else {
						fnError.call(that,"no Response from QueryServiceUri");
					}
				}
			}
			catch(e){
				fnError.call(that,e);
			}
		},

		_processDataForComparisonChart: function(data, measure, unit){

			var finalOutput= [], LABEL_MAPPING={}, i, tempObject, l;
			var tempVar;
			var aTitles = [];
			var that = this;

			for(i=0;i<data.results.length;i++) {
				var eachData=data.results[i];
			}
			aTitles = sap.ushell.components.tiles.indicatorTileUtils.util.getAllMeasuresWithLabelText(this.oConfig.EVALUATION.ODATA_URL, this.oConfig.EVALUATION.ODATA_ENTITYSET);
			for(i = 0 , l=aTitles.length; i< l;i++) {
				tempObject = aTitles[i];
				LABEL_MAPPING[tempObject.key] = tempObject.value;
			}

			var columnName = that.oConfig.TILE_PROPERTIES.COLUMN_NAMES ||  that.oConfig.EVALUATION.COLUMN_NAMES;
			for(i=0; i<columnName.length; i++){
				var temp={};
				var columnObject = columnName[i];
				temp.value=Number(eachData[columnObject.COLUMN_NAME]);
				var calculatedValueForScaling = Number(eachData[columnObject.COLUMN_NAME]);
				if(that.oConfig.EVALUATION.SCALING == -2)
					calculatedValueForScaling *= 100;
				tempVar = sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(calculatedValueForScaling, that.oConfig.EVALUATION.SCALING,that.oConfig.EVALUATION.DECIMAL_PRECISION);
				if(that.oConfig.EVALUATION.SCALING == -2)
					tempVar += " %";
				temp.displayValue = tempVar.toString();
				if(unit){
					if(unit[i] && eachData[unit[i].name]){
						temp.displayValue += " " + eachData[unit[i].name];
					}
				}
				temp.color = columnObject.semanticColor;
				temp.title = LABEL_MAPPING[columnObject.COLUMN_NAME] || columnObject.COLUMN_NAME;

				finalOutput.push(temp);

			}

			return finalOutput;
		},

		doDummyProcess : function(){
			var that= this;
			this.setTextInTile();
			that._updateTileModel({
				value: 8888,
				size: sap.suite.ui.commons.InfoTileSize.Auto,
				frameType : sap.suite.ui.commons.FrameType.OneByOne,
				state: sap.suite.ui.commons.LoadState.Loading,
				valueColor:sap.suite.ui.commons.InfoTileValueColor.Error,
				indicator: sap.suite.ui.commons.DeviationIndicator.None,
				title : "Liquidity Structure",
				footer : "Current Quarter",
				description: "Apr 1st 2013 (B$)",
				data: [
				       { title: "Measure 1", value: 1.2, color: "Good" },
				       { title: "Measure 2", value: 0.78, color: "Good" },
				       { title: "Measure 3", value: 1.4, color: "Error" }
				       ],
			});
			this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);
		}

	});

}());