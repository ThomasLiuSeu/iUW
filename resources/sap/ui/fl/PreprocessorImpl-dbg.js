/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */
/*global Promise */

// Provides object sap.ui.fl.ProcessorImpl
sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/Component', 'sap/ui/fl/FlexControllerFactory', 'sap/ui/fl/Utils'
], function(jQuery, Component, FlexControllerFactory, Utils) {
	'use strict';

	/**
	 * UI5 Flexiblity Services Preprocessor implementation that can be hooked in the View life cycle.
	 * 
	 * @author D034127
	 * @name sap.ui.fl.PreprocessorImpl
	 * @class
	 * @public
	 */
	var FlexPreprocessorImpl = function(){
	};
	
	/**
	 * Tries to get the owner ID for an object and falls back to the parent if not successful.
	 * 
	 * @param {sap.ui.base.ManagedObject} oManagedObject object to get the owner ID for
	 * @returns {string} owner ID
	 *  
	 * @private
	 */
	FlexPreprocessorImpl._getOwnerId = function(oManagedObject){
		var sOwnerId;
		if ( oManagedObject ){
			sOwnerId = Component.getOwnerIdFor(oManagedObject);
			if ( !sOwnerId && oManagedObject.getParent ){
				sOwnerId = FlexPreprocessorImpl._getOwnerId(oManagedObject.getParent());
			}
		}
		return sOwnerId;
	};

	/**
	 * Asynchronous view processing method.
	 * 
	 * @param {sap.ui.core.mvc.View} oView view to process
	 * @returns {jquery.sap.promise} result of the processing, promise if executed asynchronously
	 * 
	 * @public
	 */
	 FlexPreprocessorImpl.process = function(oView){
		 return Promise.resolve().then(function(){
			 var sOwnerId = FlexPreprocessorImpl._getOwnerId(oView);
			 if (!sOwnerId) {
				 var sError = "no owner ID found for " + oView.getId();
				 jQuery.sap.log.error(sError);
				 throw new Error(sError);
			 }

			 var sComponentName = sap.ui.getCore().getComponent(sOwnerId).getMetadata().getName();
			 if (sComponentName.indexOf(".Component") < 0) {
				 sComponentName += '.Component';
			 }

			 var oFlexController = FlexControllerFactory.create(sComponentName);
			 return oFlexController.processView(oView);
		 }).then(function() {
			 jQuery.sap.log.debug("flex processing view " + oView.getId() + " finished");
			 return oView;
		 })["catch"](function(error) {
			 var sError = "flex error processing view " + oView.getId() + ": " + error;
			 jQuery.sap.log.error(sError);
			 // throw new Error(sError); // throw again, wenn caller handles the promise
			 return oView;
		 });
	 };
	 
	 return FlexPreprocessorImpl;

}, /* bExport= */true);