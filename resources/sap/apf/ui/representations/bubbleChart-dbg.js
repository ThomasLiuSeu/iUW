/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.bubbleChart");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");
/**
 * @class columnChart constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
sap.apf.ui.representations.bubbleChart = function(oApi, oParameters) {
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
	this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.BUBBLE_CHART;
	this.bIsGroupTypeChart = true;
	this._createDefaultFeedItemId();
};
sap.apf.ui.representations.bubbleChart.prototype = Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);
//Set the "constructor" property to refer to bubbleChart
sap.apf.ui.representations.bubbleChart.prototype.constructor = sap.apf.ui.representations.bubbleChart;
/** 
 * @private
 * @method createDefaultFeedItemId
 * @description reads the oParameters for chart and modifies it by including a default feedItem id 
 * in case the "kind" property is not defined in dimension/measures
 */
sap.apf.ui.representations.bubbleChart.prototype._createDefaultFeedItemId = function() {
	var self = this;
	this.parameter.measures.forEach(function(measure, index) {
		if (measure.kind === undefined) {//handle the scenario where the kind is not available
			measure.axisfeedItemId = index < 2 ? (index === 0 ? sap.apf.core.constants.vizFrame.feedItemTypes.VALUEAXIS : sap.apf.core.constants.vizFrame.feedItemTypes.VALUEAXIS2) : (index === 2 ? sap.apf.core.constants.vizFrame.feedItemTypes.BUBBLEWIDTH : sap.apf.core.constants.vizFrame.feedItemTypes.BUBBLEHEIGTH);
		}
	});
	this.parameter.dimensions.forEach(function(dimension, index) {
		if (dimension.kind === undefined) {//handle the scenario where the kind is not available
			dimension.axisfeedItemId = index === 0 ? sap.apf.core.constants.vizFrame.feedItemTypes.COLOR : sap.apf.core.constants.vizFrame.feedItemTypes.SHAPE;
		}
	});
};