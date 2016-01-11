/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.instance");
//FIXME: Lazy load print only when required
jQuery.sap.require('sap.apf.ui.utils.print');
jQuery.sap.require('sap.apf.ui.utils.constants');
jQuery.sap.require('sap.apf.ui.utils.facetFilterHandler');
//FIXME: Load vizhelper within each representation, where it is used.
//jQuery.sap.require('sap.apf.ui.representations.utils.vizHelper');
//FIXME: Lazy load representations when required
jQuery.sap.require('sap.apf.ui.representations.lineChart');
jQuery.sap.require('sap.apf.ui.representations.columnChart');
jQuery.sap.require('sap.apf.ui.representations.scatterPlotChart');
jQuery.sap.require('sap.apf.ui.representations.stackedColumnChart');
jQuery.sap.require('sap.apf.ui.representations.table');
jQuery.sap.require('sap.apf.ui.representations.pieChart');
jQuery.sap.require('sap.apf.ui.representations.percentageStackedColumnChart');
jQuery.sap.require('sap.apf.ui.representations.bubbleChart');
/**
 *@class Ui Component Instance
 *@name sap.apf.ui.Instance
 *@description Creation of new Ui Component Instance
 *@param {object} oInject - Core Instance
 */
sap.apf.ui.Instance = function(oInject) {
	oInject.uiApi = this;
	var oCoreApi = oInject.oCoreApi;
	var oComponent = oInject.oComponent;
	var oSBHandler = oInject.oSBHandler;
	var oStartParameter = oInject.oStartParameter;
	var stepContainer;
	var analysisPath;
	var messageHandler;
	var oSBEvaluation;
	var apfLocation = oCoreApi.getUriGenerator().getApfLocation();
	this.oEventCallbacks = {};
	//sap.ui.getCore().loadLibrary('sap.viz');
	jQuery.sap.includeStyleSheet(apfLocation + "resources/css/apfUi.css", "apfCss");
	jQuery.sap.includeStyleSheet(apfLocation + "resources/css/apfPrint.css", "printCss");
	jQuery("#printCss").attr("media", "print"); // @comment : Doesn't Support adding attribute
	/**
	 *@description Getter for Analysis Path layout
	 *@see sap.apf.ui.reuse.view.analysisPath
	 *@returns {analysisPath}
	 */
	this.getAnalysisPath = function() {
		if (analysisPath === undefined) {
			analysisPath = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.analysisPath",
				type : sap.ui.core.mvc.ViewType.JS,
				viewData : oInject
			});
		}
		return analysisPath;
	};
	/**
	 *@description Getter for Notification Bar
	 *@see sap.apf.ui.reuse.view.messageHandler
	 *@returns {oNotificationView }
	 */
	this.getNotificationBar = function() {
		if (messageHandler === undefined) {
			messageHandler = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.messageHandler",
				type : sap.ui.core.mvc.ViewType.JS,
				viewData : oInject
			});
		}
		return messageHandler;
	};
	/**
	 *@description Creates a step container to hold representation
	 *@see sap.apf.ui.reuse.view.stepContainer
	 *@returns {stepContainer}
	 */
	this.getStepContainer = function() {
		if (stepContainer === undefined) {
			stepContainer = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.stepContainer",
				type : sap.ui.core.mvc.ViewType.JS,
				viewData : oInject
			});
		}
		return stepContainer;
	};
	/**
	 *@memberOf sap.apf.Api#addMasterFooterContent
	 *@description Calls the updatePath with proper callback for UI. 
	 * 				It also refreshes the steps either from the active step or 
	 * 				all the steps depending on the boolean value passed.
	 *@param {boolean} 
	 */
	this.selectionChanged = function(bRefreshAllSteps) {
		if (bRefreshAllSteps) {
			this.getAnalysisPath().getController().refresh(0);
		} else {
			var nActiveStepIndex = oCoreApi.getSteps().indexOf(oCoreApi.getActiveStep());
			this.getAnalysisPath().getController().refresh(nActiveStepIndex + 1);
		}
		oCoreApi.updatePath(this.getAnalysisPath().getController().callBackForUpdatePath.bind(this.getAnalysisPath().getController()));
	};
	var applicationLayout;
	var oSBHelper;
	/**
	 *@class view
	 *@name view
	 *@memberOf sap.apf.ui
	 *@description holds views for ui
	 */
	/**
	 *@memberOf sap.apf.ui
	 *@description returns app
	 *@return Application
	 */
	var application = new sap.m.App().addStyleClass("sapApf");
	var bIsAppLayoutCreated = false;
	this.createApplicationLayout = function() {
		// Ensure layout page is added only once
		if (!bIsAppLayoutCreated) {
			application.addPage(this.getLayoutView());
			bIsAppLayoutCreated = true;
		}
		return application;
	};
	/**
	 *@memberOf sap.apf.ui
	 *@description Creates a main application layout with the header and main
	 *              view
	 *@return layout view
	 */
	this.getLayoutView = function() {
		if (applicationLayout === undefined) {
			applicationLayout = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.layout",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : oInject
			});
		}
		return applicationLayout;
	};
	/**
	 *@memberOf sap.apf.ui
	 *@description adds content to detail footer
	 *@param oControl
	 *            {object} Any valid UI5 control
	 */
	this.addDetailFooterContent = function(oControl) {
		this.getLayoutView().getController().addDetailFooterContentLeft(oControl);
	};
	/**
	 *@memberOf sap.apf.ui
	 *@description adds content to master footer
	 *@param oControl
	 *            {object} Any valid UI5 control
	 */
	this.addMasterFooterContentRight = function(oControl) {
		this.getLayoutView().getController().addMasterFooterContentRight(oControl);
	};
	/**
	 *@memberOf sap.apf.ui
	 *@description registers callback for event callback.
	 *@param fn callback
	 */
	this.setEventCallback = function(sEventType, fnCallback) {
		this.oEventCallbacks[sEventType] = fnCallback;
	};
	/**
	 *@memberOf sap.apf.ui
	 *@returns the registered callback for event callback.
	 */
	this.getEventCallback = function(sEventType) {
		return this.oEventCallbacks[sEventType];
	};
	var oFacetFilterHandler;
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui#initializeContextHandling
	 * @memberOf sap.apf.ui
	 * @param {Object} SB Handler Instance
	 * @param {String} Type of Navigation mode-Eg- Forward,Backward
	 * @description initializes the context handling by instantiating an initializing the facet filter handler.
	 */
	this.initializeContextHandling = function(oSBHandler, mode) {
		var dependency = {
			oCoreApi : oCoreApi,
			oPathContextHandler : oInject.oPathContextHandler,
			oSBHandler : oSBHandler,
			oUiApi : this,
			mode : mode
		};
		oFacetFilterHandler = new sap.apf.ui.utils.FacetFilterHandler(dependency);
		oFacetFilterHandler.initialize();
	};
	/**
	 * @private
	 * @experimental Refactoring trigerred by the Mozilla bug
	 * @name sap.apf.ui#drawFacetFilter
	 * @member of sap.apf.ui
	 * @param {Object} subHeaderInstance - Pass the sub header instance to add the facet filter view item
	 * @description draws facet filter on layout subHeader.
	 */
	this.drawFacetFilter = function(subHeaderInstance) {
		if (oFacetFilterHandler) {
			oFacetFilterHandler.drawFacetFilter(subHeaderInstance);
		}
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui#contextChanged
	 * @param {boolean} bResetPath - True when new path is triggered.
	 * @memberOf sap.apf.ui
	 * @description Event to be called when the path context is changed/updated.
	 * Notifies facetfilterhandler and application of context change.
	 */
	this.contextChanged = function(bResetPath) {
		if (oFacetFilterHandler) {
			oFacetFilterHandler.contextChanged();
		}
		var fnCallback = this.getEventCallback(sap.apf.core.constants.eventTypes.contextChanged);
		if (typeof fnCallback === "function") {
			var oSerializedFilter;
			if (!bResetPath) {
				oSerializedFilter = oCoreApi.getContext().serialize();
			}
			fnCallback(oSerializedFilter);
		}
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui#getFormattedFilters
	 * @param {string} sProperty - Property name of filter.
	 * @memberOf sap.apf.ui
	 * @description Currently used by printHelper to get formatted filter values.
	 * @returns {Array} when property is available as a facet filter.
	 * 		Array will be of the form : [{
	 * 			name: "sPropertyText",
	 * 			operator: "EQ",
	 * 			value: "sKey - sText",
	 * 			formatted: true
	 * 		}] 
	 * null when property is not available as a facet filter.
	 * */
	this.getFormattedFilters = function(sProperty) {
		if (oFacetFilterHandler) {
			return oFacetFilterHandler.getFormattedFilters(sProperty);
		}
	};
	this.handleStartup = function(promise) {
		var that = this;
		var promiseUi = jQuery.Deferred();
		var promiseStartup = jQuery.Deferred();
		var oSBHandler;
		promise.done(function(mode) {
			if (mode.navigationMode === 'backward') {
				promiseUi.done(function() {
					that.getAnalysisPath().getController().bIsBackNavigation = true; //FIXME Boolean to set busy indicator to false
					oCoreApi.updatePath(that.getAnalysisPath().getController().callBackForUpdatePath.bind(that.getAnalysisPath().getController()));
					promiseStartup.resolve();
				});
			}
			if (mode.navigationMode === 'forward') {
				if (oStartParameter.getEvaluationId()) {
					var oSBHandlerDependencies = {
						getApplicationConfigProperties : oCoreApi.getApplicationConfigProperties,
						createReadRequestByRequiredFilter : oCoreApi.createReadRequestByRequiredFilter,
						getTextNotHtmlEncoded : oCoreApi.getTextNotHtmlEncoded,
						startParameter : oStartParameter,
						oMessageHandler : oCoreApi.getMessageHandler()
					};
					oSBHandler = new sap.apf.utils.SmartBusinessHandler(oSBHandlerDependencies);
				}
				promiseUi.done(function() {
					if(mode.sapApfCumulativeFilter){
						oInject.oPathContextHandler.update('ApfInitialContext', sap.apf.utils.Filter.createFilterFromSapUi5FilterJSON(oCoreApi.getMessageHandler(),mode.sapApfCumulativeFilter));
					}
					
					if (oCoreApi.getStartParameterFacade().getSteps()) {
						var stepId = oCoreApi.getStartParameterFacade().getSteps()[0].stepId;
						var repId = oCoreApi.getStartParameterFacade().getSteps()[0].representationId;
						var callback = that.getAnalysisPath().getController().callBackForUpdatePathAndSetLastStepAsActive.bind(that.getAnalysisPath().getController());
						oCoreApi.createFirstStep(stepId, repId, callback);
					}
					
					promiseStartup.resolve();
				});
			}
			that.initializeContextHandling(oSBHandler, mode.navigationMode);
			that.drawFacetFilter(that.getLayoutView().byId("subHeader"));
			if (oSBHandler) {
				oSBHandler.getAllFilters().then(function() {
					promiseUi.resolve();
				});
			} else {
				promiseUi.resolve();
			}
		});
		return promiseStartup.promise();
	};
};
