/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global jQuery, sap */
(function() {
	'use strict';
	jQuery.sap.declare("sap.apf.modeler.Component");
	jQuery.sap.require("sap.ui.core.UIComponent");
	jQuery.sap.require("sap.apf.modeler.core.instance");
	jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
	jQuery.sap.require('sap.apf.modeler.ui.utils.APFRouter');
	jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
	jQuery.sap.require('sap.apf.modeler.ui.utils.APFTree');
	/**
	 * @private
	 * @class Base Component for APF Modeler.
	 * @name sap.apf.modeler.Component
	 * @extends sap.ui.core.UIComponent
	 */
	sap.ui.core.UIComponent.extend("sap.apf.modeler.Component", {
		oCoreApi : null,
		metadata : {
			"dependencies" : {
				"libs" : [ "sap.m", "sap.ui.layout"]
			},
			"config" : {
				"fullWidth" : true
			},
			routing : {
				"config" : {
					viewType : "XML",
					viewPath : "sap.apf.modeler.ui.view",
					clearTarget : false
				},
				"routes" : {
					// contains routing configuration objects
					"applicationList" : {
						pattern : "",
						view : "applicationList",
						targetAggregation : "pages",
						targetControl : "applicationList",
						"subroutes" : [ {
							pattern : "app/{appId}",
							view : "configurationList",
							name : "configurationList",
							targetAggregation : "pages"
						}, {
							pattern : "app/{appId}/config/{configId}",
							view : "configurationList",
							name : "configuration",
							targetAggregation : "pages"
						}, {
							pattern : "app/{appId}/config/{configId}/category/{categoryId}",
							view : "configurationList",
							name : "category",
							targetAggregation : "pages"
						}, {
							pattern : "app/{appId}/config/{configId}/facetFilter/{facetFilterId}",
							view : "configurationList",
							name : "facetFilter",
							targetAggregation : "pages"
						}, {
							pattern : "app/{appId}/config/{configId}/category/{categoryId}/step/{stepId}",
							view : "configurationList",
							name : "step",
							targetAggregation : "pages"
						}, {
							pattern : "app/{appId}/config/{configId}/category/{categoryId}/step/{stepId}/repn/{representationId}",
							view : "configurationList",
							name : "representation",
							targetAggregation : "pages"
						} , {
							pattern : "app/{appId}/config/{configId}/navigationTarget/{navTargetId}",
							view : "configurationList",
							name : "navigationTarget",
							targetAggregation : "pages"
						}]
					}
				}
			}
		},
		/**
		 * @private
		 * @description Initialize the Component instance after creation. The component, that extends this component should call this method.
		 * @function
		 * @name sap.apf.modeler.Component.prototype.init
		 */
		init : function() {
			var persistenceConfiguration = {
				/*This serviceRoot is used only for the modeler, the runtime has a different root
				 reason: user roles with different authorizations, change configuration or read only*/
				serviceRoot : "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata"
			};
			var inject = {
					instances : { component : this }
			};
			this.oCoreApi = new sap.apf.modeler.core.Instance(persistenceConfiguration, inject);
			var apfLocation = this.oCoreApi.getUriGenerator().getApfLocation();
			jQuery.sap.includeStyleSheet(apfLocation + "modeler/resources/css/configModeler.css", "configModelerCss");
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
			//initialize the router
			var oRouter = this.getRouter();
			this.oRouteHandler = new sap.m.routing.RouteMatchedHandler(oRouter);
			oRouter.initialize();
		},
		/**
		 * @private
		 * @description Creates the content of the component. A component, that extends this component should call this method.
		 * @function
		 * @name sap.apf.modeler.Component.prototype.createContent
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent : function() {
			if (applicationListView === undefined) {
				var applicationListView = sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.applicationList",
					type : "XML",
					viewData : this.oCoreApi
				});
			}
			var apfLocation = this.oCoreApi.getUriGenerator().getApfLocation();
			return applicationListView;
		}
	});
}());
