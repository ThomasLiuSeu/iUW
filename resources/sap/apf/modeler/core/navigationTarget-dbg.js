/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2015 SAP SE. All rights reserved
 */
/*global sap, apf, modeler, jQuery*/

jQuery.sap.declare("sap.apf.modeler.core.navigationTarget");

(function () {
    'use strict';

    /**
     * @private
     * @name sap.apf.modeler.core.navigationTarget
     * @class A navigation target proxy object providing editor methods on configuration objects.
     * @param {Object} [dataFromCopy] - Optional parameter to set the internal state of the new instance during a copy operation 
     * @constructor
     */
    sap.apf.modeler.core.NavigationTarget = function (navigationTargetId, dataFromCopy) {
    	var semObject,
    	    actn;
    	
    	if(dataFromCopy){
    		semObject = dataFromCopy.semObject;
    		actn = dataFromCopy.actn;
    	}
    	
    	 /**
         * @private
         * @name sap.apf.modeler.core.NavigationTarget#getId
         * @function
         * @description The immutable id of the navigation target
         * @returns {String} id
         */
        this.getId = function () {
            return navigationTargetId;
        };
    	/**
         * @private
         * @name sap.apf.modeler.core.NavigationTarget#setSemanticObject
         * @function
         * @description Set the semantic object of the navigation target
         * @param {string} semanticObject
         */
        this.setSemanticObject = function(semanticObject) {
        	semObject = semanticObject;
        };
      	/**
         * @private
         * @name sap.apf.modeler.core.NavigationTarget#getSemanticObject
         * @function
         * @description Get the semantic object of the navigation target
         * @returns {String} semantic object 
         */
        this.getSemanticObject = function() {
        	return semObject;
        };
     	/**
         * @private
         * @name sap.apf.modeler.core.NavigationTarget#setAction
         * @function
         * @description Set the action of the navigation target
         * @param {string} action
         */
        this.setAction = function(action) {
        	actn = action;
        };
      	/**
         * @private
         * @name sap.apf.modeler.core.NavigationTarget#getAction
         * @function
         * @description Get the action of the navigation target
         * @returns {String} action 
         */
        this.getAction = function() {
        	return actn;
        };
        
        /**
         * @private
         * @name sap.apf.modeler.core.NavigationTargetr#copy
         * @function
         * @description Execute a deep copy of the navigation target
         * @param {String} [newIdForCopy] - Optional new Id for the copied instance
         * @returns {Object} sap.apf.modeler.core.NavigationTarget# - New navigation target object being a copy of this object
         */
        this.copy = function( newIdForCopy ){
        	var dataForCopy = {
        			semObject : semObject,
		            actn      : actn };
        	var dataFromCopy = sap.apf.modeler.core.ConfigurationObjects.deepDataCopy( dataForCopy );
        	return new sap.apf.modeler.core.NavigationTarget( (newIdForCopy || this.getId()), dataFromCopy);
        };
    };

}()); 