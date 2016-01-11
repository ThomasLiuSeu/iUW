sap.ui.controller("view.view2", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf view.View1
	 */
	onInit: function() {

	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf view.View1
	 */
	onBeforeRendering: function() {
		var chartPopover = new sap.viz.ui5.controls.Popover({});

		var oModel = new sap.ui.model.json.JSONModel({
			'businessData': [{
				"Country": "China",
				"Profit": 100,
				"Forcast": 200,
				"Target": 20,
				"Revenue": 20,
				"Revenue2": 20,
				"Revenue3": 512
			}, {
				"Country": "Japan",
				"Profit": 159,
				"Forcast": 140,
				"Target": 150,
				"Revenue": 30,
				"Revenue2": 100,
				"Revenue3": 303
			}, {
				"Country": "India",
				"Profit": 129,
				"Forcast": 120,
				"Target": 100,
				"Revenue": 200,
				"Revenue2": 222,
				"Revenue3": 263
			}, {
				"Country": "France",
				"Profit": 58,
				"Forcast": 60,
				"Target": 80,
				"Revenue": 116,
				"Revenue2": 152,
				"Revenue3": 113
			}, {
				"Country": "Austrilia",
				"Profit": 149,
				"Forcast": 120,
				"Target": 150,
				"Revenue": 249,
				"Revenue2": 292,
				"Revenue3": 443
			}, {
				"Country": "Sweden",
				"Profit": 49,
				"Forcast": 60,
				"Target": 55,
				"Revenue": 1449,
				"Revenue2": 242,
				"Revenue3": 243
			}]
		});

		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			'dimensions': [{
				name: 'Country',
				value: "{Country}"
			}],
			measures: [{
				name: 'Profit',
				value: '{Profit}'
			}, {
				name: 'Target',
				value: '{Target}'
			}, {
				name: "Forcast",
				value: "{Forcast}"
			}, {
				name: "Revenue",
				value: "{Revenue}"
			}, {
				name: 'Revenue2',
				value: '{Revenue2}'
			}, {
				name: "Revenue3",
				value: "{Revenue3}"
			}],
			'data': {
				'path': "/businessData"
			}
		});

		var oVizFrame1 = new sap.viz.ui5.controls.VizFrame("viz1", {
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizType': 'bullet'
		});
		var oVizFrame2 = new sap.viz.ui5.controls.VizFrame("viz2", {
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizType': 'bullet'
		});
		var oVizFrame3 = new sap.viz.ui5.controls.VizFrame("viz3", {
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizType': 'bullet'
		});
		var oVizFrame4 = new sap.viz.ui5.controls.VizFrame("viz4", {
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizType': 'bullet'
		});var oVizFrame5 = new sap.viz.ui5.controls.VizFrame("viz5", {
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizType': 'bullet'
		});

		oVizFrame1.setVizProperties({
			plotArea: {
				colorPalette: [
					'sapUiChartPaletteSemanticNeutral'
				],
				gap: {
					visible: true
				}
			},

			legend: {
				title: {
					visible: false
				}
			},

			title: {
				visible: true,
				text: 'Bullet (with gap enabled)'
			}
		});

		oVizFrame1.setDataset(oDataset);
		oVizFrame1.setModel(oModel);
		
		
		oVizFrame2.setVizProperties({
			plotArea: {
				colorPalette: [
					'sapUiChartPaletteSemanticNeutral'
				],
				gap: {
					visible: true
				}
			},

			legend: {
				title: {
					visible: false
				}
			},

			title: {
				visible: true,
				text: 'Bullet (with gap enabled)'
			}
		});

		oVizFrame2.setDataset(oDataset);
		oVizFrame2.setModel(oModel);
		
		
		oVizFrame3.setVizProperties({
			plotArea: {
				colorPalette: [
					'sapUiChartPaletteSemanticNeutral'
				],
				gap: {
					visible: true
				}
			},

			legend: {
				title: {
					visible: false
				}
			},

			title: {
				visible: true,
				text: 'Bullet (with gap enabled)'
			}
		});

		oVizFrame3.setDataset(oDataset);
		oVizFrame3.setModel(oModel);
		
		
		oVizFrame4.setVizProperties({
			plotArea: {
				colorPalette: [
					'sapUiChartPaletteSemanticNeutral'
				],
				gap: {
					visible: true
				}
			},

			legend: {
				title: {
					visible: false
				}
			},

			title: {
				visible: true,
				text: 'Bullet (with gap enabled)'
			}
		});

		oVizFrame4.setDataset(oDataset);
		oVizFrame4.setModel(oModel);
		
		
		oVizFrame5.setVizProperties({
			plotArea: {
				colorPalette: [
					'sapUiChartPaletteSemanticNeutral'
				],
				gap: {
					visible: true
				}
			},

			legend: {
				title: {
					visible: false
				}
			},

			title: {
				visible: true,
				text: 'Bullet (with gap enabled)'
			}
		});

		oVizFrame5.setDataset(oDataset);
		oVizFrame5.setModel(oModel);

		var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "primaryValues",
				'type': "Measure",
				'values': [
					"Profit"
				]
			}),
			feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "axisLabels",
				'type': "Dimension",
				'values': [
					"Country"
				]
			}),
			feedTargetValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "targetValues",
				'type': "Measure",
				'values': [
					"Target"
				]
			});

		oVizFrame1.addFeed(feedPrimaryValues);
		oVizFrame1.addFeed(feedAxisLabels);
		oVizFrame1.addFeed(feedTargetValues);

		oVizFrame1.attachSelectData(function(event) {
			var data = event.getParameter('data');
			for (var i = 0; i < data.length; i++) {
				// console.log(oDataset.findContext(data[i].data))
			}
		});
		oVizFrame2.addFeed(feedPrimaryValues);
		oVizFrame2.addFeed(feedAxisLabels);
		oVizFrame2.addFeed(feedTargetValues);

		oVizFrame2.attachSelectData(function(event) {
			var data = event.getParameter('data');
			for (var i = 0; i < data.length; i++) {
				// console.log(oDataset.findContext(data[i].data))
			}
		});
		oVizFrame3.addFeed(feedPrimaryValues);
		oVizFrame3.addFeed(feedAxisLabels);
		oVizFrame3.addFeed(feedTargetValues);

		oVizFrame3.attachSelectData(function(event) {
			var data = event.getParameter('data');
			for (var i = 0; i < data.length; i++) {
				// console.log(oDataset.findContext(data[i].data))
			}
		});
		oVizFrame4.addFeed(feedPrimaryValues);
		oVizFrame4.addFeed(feedAxisLabels);
		oVizFrame4.addFeed(feedTargetValues);

		oVizFrame4.attachSelectData(function(event) {
			var data = event.getParameter('data');
			for (var i = 0; i < data.length; i++) {
				// console.log(oDataset.findContext(data[i].data))
			}
		});
		oVizFrame5.addFeed(feedPrimaryValues);
		oVizFrame5.addFeed(feedAxisLabels);
		oVizFrame5.addFeed(feedTargetValues);

		oVizFrame5.attachSelectData(function(event) {
			var data = event.getParameter('data');
			for (var i = 0; i < data.length; i++) {
				// console.log(oDataset.findContext(data[i].data))
			}
		});

		//var chartPopover = new sap.viz.ui5.controls.Popover({});
		//chartPopover.connect(oVizFrame.getVizUid());
		oVizFrame5.placeAt("idview2--chart1");
		//oVizFrame2.placeAt("idview2--chart2");
		//oVizFrame3.placeAt("idview2--chart3");
		//oVizFrame4.placeAt("idview2--chart4");
		//oVizFrame5.placeAt("idview2--chart5");
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf view.View1
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf view.View1
	 */
	//	onExit: function() {
	//
	//	}
	onNavigation: function() {
		var oRouter = sap.ui.core.routing.Router.getRouter("appRouter");
		var oHashChanger = new sap.ui.core.routing.HashChanger();
		oHashChanger.setHash(oRouter.getURL(""));
	}

});