/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

(function () {
	'use strict';

	jQuery.sap.declare('sap.apf.utils.startParameter');
	
	/**
	 * @private 
	 * @class Provides convenience functions to receive parameter set through component`s startup parameter or basic URL parameter.
	 * 		  When both parameter are set then the component`s startup parameter wins.
	 * @param {object} component 
	 */
	sap.apf.utils.StartParameter = function(component){
		var analyticalConfigurationId = null;
		var stepId = null;
		var representationId = null;
		var selectionVariantId = null;
		var appConfigPath;
		var evaluationId;
		var startParameters;
		
		if(component && component.getComponentData && component.getComponentData() && component.getComponentData().startupParameters) {
			startParameters = component.getComponentData().startupParameters;
			if(startParameters['sap-apf-configuration-id']) {
				analyticalConfigurationId = startParameters['sap-apf-configuration-id'][0];
			}
			if(startParameters['sap-apf-step-id']) {
				stepId = startParameters['sap-apf-step-id'][0];
			}
			if(startParameters['sap-apf-representation-id']) {
				representationId = startParameters['sap-apf-representation-id'][0];
			}
			if(startParameters['sap-apf-selection-variant-id']) { //TODO: replace parameter name with official selection variant convention
				selectionVariantId = startParameters['sap-apf-selection-variant-id'][0];
			}
			if(startParameters['sap-apf-app-config-path']) {
				appConfigPath = startParameters['sap-apf-app-config-path'][0];
			}
			if(startParameters['evaluationId']) {
				evaluationId = startParameters['evaluationId'][0];
			}
		}
		
        /**
         * @private
         * @function
         * @name sap.apf.utils.StartParameter#getSteps
         * @description Returns analytical configuration ID.
         * @returns {string} analyticalConfigurationId
         */
		this.getAnalyticalConfigurationId = function() {
			if(!analyticalConfigurationId) {
				analyticalConfigurationId = jQuery.sap.getUriParameters().get('sap-apf-configuration-id');
			}
			return analyticalConfigurationId;
		};

        /**
         * @private
         * @function
         * @name sap.apf.utils.StartParameter#getAnalyticalConfigurationId
         * @description Returns step IDs and representation IDs.
         * @returns {Array} steps Step contains step ID and optional representation ID
         */
		this.getSteps = function() {
			if(!stepId) {
				stepId = jQuery.sap.getUriParameters().get('sap-apf-step-id');
			}
			if(!representationId) {
				representationId = jQuery.sap.getUriParameters().get('sap-apf-representation-id');
			}
			if(!stepId) {
				return null;
			} else {
				return [{
					stepId : stepId,
					representationId : representationId
				}];
			}
		};

        /**
         * @private
         * @function
         * @name sap.apf.utils.StartParameter#getSelectionVariantId
         * @description Returns selection variant ID.
         * @returns {string} selectionVariantId
         */
		this.getSelectionVariantId = function() {
			if(!selectionVariantId) {
				selectionVariantId = jQuery.sap.getUriParameters().get('sap-apf-selection-variant-id'); //TODO: replace parameter name with official selection variant convention
			}
			return selectionVariantId;
		};
		
		this.getApplicationConfigurationPath = function() {
			return appConfigPath;
		};
		
		this.getEvaluationId = function() {
			return evaluationId;
		};
		
		this.getStartUpMode = function() {
			//TODO: Define startup mode CONSTANTS (forward and backward navigation)
			//TODO: Compute startup mode and return correct CONSTANT
		};
	};
}());