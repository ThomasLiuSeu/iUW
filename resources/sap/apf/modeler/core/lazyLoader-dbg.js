/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, apf, modeler, jQuery*/

jQuery.sap.declare("sap.apf.modeler.core.lazyLoader");

(function () {
    'use strict';

    /**
     * @private
     * @name sap.apf.modeler.core.lazyLoader
     * @class A lazy load manager providing the logic for loading objects asynchronously
     * @param {Object} inject - Injection of required APF object references, constructors and functions
     * @param {sap.apf.core.utils.messageHandler} inject.instance.MessageHandler - messageHandler instance
     * @param {sap.apf.core.utils.Hashtable} inject.constructor.hashtable - Hashtable constructor
     * @param {Function} callbackForLoad - A function that executes the asynchronous load with the following signature: callbackForLoad(id, callbackAfterLoad(id, instance, messageObject), oldInstance)
     * @param {Object} dataForInstantiation - Optional data that can be used for the instantiation
     * @param {String} dataForInstantiation.id Id used for instantiation
     * @param {Object} dataForInstantiation.instance Instance used for instantiation                                   
     * @constructor
     */
    sap.apf.modeler.core.LazyLoader = function (inject, callbackForLoad, dataForInstantiation) {
    	
		var object = {
			id              : null,
			instance        : null,
			isInitializing  : false,
			callbacksAfterAsyncGet : new inject.constructor.hashtable(inject.instance.messageHandler)	
		},
		oldInstance = null;
	    
		if(dataForInstantiation){
			object.id       = dataForInstantiation.id;
			object.instance = dataForInstantiation.instance;
		}
		
		this.type = "lazyLoader";
		
		 /**
         * @private
         * @name sap.apf.modeler.core.lazyLoader#getId
         * @function
         * @description Return the id that is currently loaded
         * @returns {String|Null}                    
         */    	
    	this.getId = function(){
    		return object.id;
    		};
		/**
         * @private
         * @name sap.apf.modeler.core.lazyLoader#getInstance
         * @function
         * @description Return the instance that is currently loaded
         * @returns {Object|Null}                    
         */    	
    	this.getInstance = function(){
    		return object.instance;
    	};
    	/**
         * @private
         * @name sap.apf.modeler.core.lazyLoader#isInitializing
         * @function
         * @description Returns whether the loader is initializing
         * @returns {Boolean}                    
         */    	
    	this.isInitializing = function(){
    		return object.isInitializing;
    	};
        /**
         * @private
         * @name sap.apf.modeler.core.lazyLoader#reset
         * @function
         * @description Reset the internal state of the lazyLoad object                    
         */    	
    	this.reset = function(){
    		oldInstance = object.instance; // !!!: to be able to reload the data for the new Id into the old instance
    		object = {
    				id              : null,
    				isInitializing  : false,
    				callbacksAfterAsyncGet : new inject.constructor.hashtable(inject.instance.messageHandler),
    				instance        : null
    			};
    	};

        function callbackAfterLoad(id, instance, messageObject){
            if(id !== object.id){
                return;
            }
            object.isInitializing = false;
            if(!messageObject){
                object.instance = instance;
            }
            object.callbacksAfterAsyncGet.each(function(key, callbackArray){
                callbackArray.forEach(function(callbackAfterAsyncGet){
                    callbackAfterAsyncGet( object.instance, messageObject, object.id);
                });
            });
            object.callbacksAfterAsyncGet = null;
        }
        function memorizeCallback(callbackAfterAsyncGet){
            var i;
            var found,
                callbackArray;
            callbackArray = object.callbacksAfterAsyncGet.getItem(callbackAfterAsyncGet);
            if(!callbackArray){
                object.callbacksAfterAsyncGet.setItem(callbackAfterAsyncGet, [callbackAfterAsyncGet]);
                return;
            }
            found = false;
            for(i = 0; i < callbackArray.length; i++){
                if(callbackArray[i]===callbackAfterAsyncGet){
                    found = true;
                    break;
                }
            }
            if(!found){
                callbackArray.push(callbackAfterAsyncGet);
            }
        }

        /**
         * @private
         * @name sap.apf.modeler.core.lazyLoader#asyncGetInstance
         * @function
         * @description Execute an asynchronous get for a certain object id
         * @param {String} id - Id of the object
         * @param {function(id, instance, messageObject)} callbackAfterAsyncGet Callback return either the object instance or a message object
         * @param {string} callbackAfterAsyncGet.id
         * @param {object} callbackAfterAsyncGet.instance
         * @param {sap.apf.core.MessageObject} callbackAfterAsyncGet.messageObject
         */
    	this.asyncGetInstance = function(id, callbackAfterAsyncGet){
    		
    		if(object.id && id !== object.id){ 
    			this.reset();
    		}
    		if(object.id && object.instance){
    			callbackAfterAsyncGet(object.instance, undefined, object.id);
    			return;  
    		} 
    		
    		memorizeCallback(callbackAfterAsyncGet);
    		
    		if(!object.isInitializing){
    			object.isInitializing = true;    			
    			object.id = id;
    		    object.instance = null;
    		    callbackForLoad(id, callbackAfterLoad, oldInstance);
    		   }
    	};
    	
    };
}());
