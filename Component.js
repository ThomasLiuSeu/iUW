sap.ui.define([
   "sap/ui/core/UIComponent",
], function (UIComponent, JSONModel, ResourceModel) {
   "use strict";
   return UIComponent.extend("iUWDemo.Component", {
		metadata : {
			rootView: "iUWDemo.view.app",

			routing: {
		        config: {
		          routerClass: sap.m.routing.Router,
		          viewType: "XML",
		          viewPath: "iUWDemo.view",
		          targetAggregation: "pages",
		          clearTarget: false
		        },
		        routes: [{
		          pattern: "",
		          name: "app",
		          view: "app",
		          targetAggregation: "pages",
		          targetControl: "idAppControl"
		        }, {
		          pattern: "login",
		          name: "login",
		          view: "login",
		          targetAggregation: "pages",
		          targetControl: "idAppControl"
		        }, {
		          pattern: "tile",
		          name: "tile",
		          view: "tile",
		          targetAggregation: "pages",
		          targetControl: "idAppControl"
		        }, {
			          pattern: "submission",
			          name: "submission",
			          view: "submission",
			          targetAggregation: "pages",
			          targetControl: "idAppControl"
		        }, {
			          pattern: "bodyPage/{submissionId}",
			          name: "bodyPage",
			          view: "bodyPage",
			          targetAggregation: "pages",
			          targetControl: "idAppControl"
		        }, {
			          pattern: "masterDetail/{submissionId}/{premium}",
			          name: "masterDetail",
			          view: "masterDetail",
			          targetAggregation: "pages",
			          targetControl: "idAppControl"
			        }]
		      }
		},
	    init : function () {
	        // call the init function of the parent
	        UIComponent.prototype.init.apply(this, arguments);
	     
  	        // create the views based on the url/hash
	        this.getRouter().initialize();
	   }
   });
});