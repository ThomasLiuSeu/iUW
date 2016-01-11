//Copyright (c) 2013 SAP AG, All Rights Reserved
//jQuery.sap.require("sap.ushell.components.tiles.Generic");
//Comparison Tile
(function () {
	"use strict";
	/*global jQuery, sap */
	/*jslint nomen: true */

	jQuery.sap.require("sap.ushell.components.tiles.indicatorTileUtils.smartBusinessUtil");
	jQuery.sap.require("sap.ushell.components.tiles.indicatorTileUtils.oData4Analytics");

	jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
	sap.ui.getCore().loadLibrary("sap.suite.ui.commons");

	sap.ui.jsview("tiles.indicatorDual.DualTile", {
		getControllerName: function () {
			return "tiles.indicatorDual.DualTile";
		},
		createContent: function (oController) {

			this.setHeight('100%');
			this.setWidth('100%');

			var view= this;
			view.tileData;  
			view.oGenericTileData = {

			};
			sap.ushell.components.tiles.indicatorTileUtils.util.getParsedChip(
					view.getViewData().chip.configuration.getParameterValueAsString("tileConfiguration"), function(config){
						view.oConfig = config;
					});
			view.tileType = view.oConfig.TILE_PROPERTIES.tileType;

			view.oNumericContent = new sap.suite.ui.commons.NumericContent({
				value: "{/value}",
				scale: "{/scale}",
				unit: "{/unit}",
				indicator: "{/indicator}",
				size: "{/size}",
				formatterValue: "{/isFormatterValue}",
				truncateValueTo: "{/truncateValueTo}",
				valueColor: "{/valueColor}"
			});

			view.oLeftTileContent = new sap.suite.ui.commons.TileContent({
				unit: "{/unit}",
				size: "{/size}",
				footer: "{/footerNum}",
				content: view.oNumericContent
			});

			switch(view.tileType){

			case "DT-CM":
				var oCmprsData = new sap.suite.ui.commons.ComparisonData({

					value : "{value}",
					color : "{color}",
					displayValue : "{displayValue}"
				});

				view.oRightContent = new sap.suite.ui.commons.ComparisonChart({
					size : "{/size}",
					scale : "{/scale}",
					data : {
						template : oCmprsData,
						path : "/data"
					},
				});
				break;

			case "DT-CT":
				var oCmprsData = new sap.suite.ui.commons.ComparisonData({

					value : "{value}",
					color : "{color}",
					displayValue : "{displayValue}"
				});

				view.oRightContent = new sap.suite.ui.commons.ComparisonChart({
					size : "{/size}",
					scale : "{/scale}",
					data : {
						template : oCmprsData,
						path : "/data"
					},
				});
				break;

			case "DT-TT":

				var buildChartItem = function(sName){
				return new sap.suite.ui.commons.MicroAreaChartItem({
					color: "Good",
					points: {
						path: "/"+sName+"/data",
						template: new sap.suite.ui.commons.MicroAreaChartPoint({
							x: "{day}",
							y: "{balance}"

						})
					}
				});
			};

			var buildMACLabel = function(sName) {
				return new sap.suite.ui.commons.MicroAreaChartLabel({ 
					label: "{/"+sName+"/label}", 
					color: "{/"+sName+"/color}" 
				});
			};
			var areaChart = new sap.suite.ui.commons.MicroAreaChart({
				width: "{/width}",
				height: "{/height}",
				size : "{/size}",
				target: buildChartItem("target"),
				innerMinThreshold: buildChartItem("innerMinThreshold"),
				innerMaxThreshold: buildChartItem("innerMaxThreshold"),
				minThreshold: buildChartItem("minThreshold"),
				maxThreshold: buildChartItem("maxThreshold"),
				chart: buildChartItem("chart"),
				minXValue: "{/minXValue}",
				maxXValue: "{/maxXValue}",
				minYValue: "{/minYValue}",
				maxYValue: "{/maxYValue}",
				firstXLabel: buildMACLabel("firstXLabel"), 
				lastXLabel: buildMACLabel("lastXLabel"), 
				firstYLabel: buildMACLabel("firstYLabel"),
				lastYLabel: buildMACLabel("lastYLabel"),
				minLabel: buildMACLabel("minLabel"),
				maxLabel: buildMACLabel("maxLabel"),
			});

			view.oRightContent = new sap.suite.ui.commons.TileContent({
				unit : "{/unit}",
				size : "{/size}",
				content: areaChart,
			});
			break;

			case "DT-AT":
				var oBCDataTmpl = new sap.suite.ui.commons.BulletChartData({
					value: "{value}",
					color: "{color}"
				});

				var oBChart = new sap.suite.ui.commons.BulletChart({
					size: sap.suite.ui.commons.InfoTileSize.Auto,
					scale: "{/scale}",
					actual: {
						value: "{/actual/value}",
						color: "{/actual/color}"
					},
					targetValue: "{/targetValue}",
					actualValueLabel: "{/actualValueLabel}",
					targetValueLabel: "{/targetValueLabel}",
					thresholds: {
						template: oBCDataTmpl,
						path: "/thresholds"
					},
					state: "{/state}",  
					showActualValue: "{/showActualValue}",
					showTargetValue: "{/showTargetValue}"
				});

				view.oRightContent = new sap.suite.ui.commons.TileContent({
					unit : "{/unit}",
					size : "{/size}",
					footer : "{/footerNum}",
					content: oBChart
				});
				break;

			}

			view.oRightTileContent = new sap.suite.ui.commons.TileContent({
				unit : "{/unit}",
				size : "{/size}",
				footer : "{/footerComp}",
				content : view.oRightContent
			});


			view.oGenericTile = new sap.suite.ui.commons.GenericTile({
				subheader : "{/subheader}",
				frameType : "TwoByOne",
				size : "{/size}",
				header : "{/header}",
				tileContent : [view.oLeftTileContent,view.oRightTileContent]
			});


			view.oGenericTileModel = new sap.ui.model.json.JSONModel();
			view.oGenericTileModel.setData(view.oGenericTileData);
			view.oGenericTile.setModel(view.oGenericTileModel);

			return view.oGenericTile;
		}
	});
}());