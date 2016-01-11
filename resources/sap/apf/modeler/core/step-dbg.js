/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, apf, modeler, jQuery*/

jQuery.sap.declare("sap.apf.modeler.core.step");

(function () {
    'use strict';

    /**
     * @private
     * @name sap.apf.modeler.core.Step
     * @class A step proxy object providing editor methods on configuration objects.
     * @param {String} stepId - unique Id within configuration.
     * @param {Object} inject - Injection of required APF object references, constructors and functions.
     * @param {sap.apf.core.utils.MessageHandler} inject.instance.messageHandler - MessageHandler instance
     * @param {Object} inject.constructor - Injected constructors
     * @param {sap.apf.core.utils.Hashtable} inject.constructor.hashtable - Hashtable constructor
     * @param {Object} dataFromCopy - Optional parameter to set the internal state of the new instance during a copy operation
     * @constructor
     */
    sap.apf.modeler.core.Step = function (stepId, inject, dataFromCopy) {
        var representationContainer,
            request,
            selectProperties,
            filterProperties,
            requestForFilterMapping, 
            selectPropertiesForFilterMapping,
            targetPropertiesForFilterMapping,
            keepSourceForFilterMapping,
            titleId,
            longTitleId,
            leftUpperCornerTextKey,
            rightUpperCornerTextKey,
            leftLowerCornerTextKey,
            rightLowerCornerTextKey;

        if(!dataFromCopy){
        	representationContainer = new inject.constructor.elementContainer(stepId + "-Representation", inject.constructor.representation, inject);
            request = {};
            selectProperties = new inject.constructor.elementContainer("SelectProperty", undefined, inject);
            filterProperties = new inject.constructor.elementContainer("FilterProperty", undefined, inject);
            requestForFilterMapping = {}; 
            selectPropertiesForFilterMapping = new inject.constructor.elementContainer("SelectPropertyForFilterMapping", undefined, inject);
            targetPropertiesForFilterMapping = new inject.constructor.elementContainer("TargetPropertyForFilterMapping", undefined, inject);
            keepSourceForFilterMapping = false;
        }else{
        	representationContainer = dataFromCopy.representationContainer;
            request = dataFromCopy.request;
            selectProperties = dataFromCopy.selectProperties;
            filterProperties = dataFromCopy.filterProperties;
            requestForFilterMapping = dataFromCopy.requestForFilterMapping;
            selectPropertiesForFilterMapping = dataFromCopy.selectPropertiesForFilterMapping;
            targetPropertiesForFilterMapping = dataFromCopy.targetPropertiesForFilterMapping;
            keepSourceForFilterMapping = dataFromCopy.keepSourceForFilterMapping;
            titleId = dataFromCopy.titleId;
            longTitleId = dataFromCopy.longTitleId;
            leftUpperCornerTextKey = dataFromCopy.leftUpperCornerTextKey;
            rightUpperCornerTextKey = dataFromCopy.rightUpperCornerTextKey;
            leftLowerCornerTextKey = dataFromCopy.leftLowerCornerTextKey;
            rightLowerCornerTextKey = dataFromCopy.rightLowerCornerTextKey;
        }

        /**
         * @private
         * @name sap.apf.modeler.core.Step#getId
         * @function
         * @description The immutable id of the step
         * @returns {String}
         */
        this.getId = function () {
            return stepId;
        };

        /**
         * @private
         * @name sap.apf.modeler.core.Step#getService
         * @function
         * @returns {string} - service root
         */
        this.getService = function () {
            return request.service;
        };

        /**
         * @private
         * @name sap.apf.modeler.core.Step#setService
         * @function
         * @description Set the service root.
         * @param {string} serviceRoot - serviceRoot URI
         */
        this.setService = function (serviceRoot) {
            request.service = serviceRoot;
        };

        /**
         * @private
         * @name sap.apf.modeler.core.Step#getEntitySet
         * @function
         * @returns {string} - entitySetName
         */
        this.getEntitySet = function () {
            return request.entitySet;
        };

        /**
         * @private
         * @name sap.apf.modeler.core.Step#setEntitySet
         * @function
         * @description Set the entitySet.
         * @param {string} entitySet - entitySet name
         */
        this.setEntitySet = function (entitySet) {
            request.entitySet = entitySet;
        };

        /**
         * @private
         * @name sap.apf.modeler.core.Step#setTitleId
         * @function
         * @description Set the title id.
         * @param {String} id Title id
         */
        this.setTitleId = function (id) {
            titleId = id;
        };

        /**
         * @private
         * @name sap.apf.modeler.core.Step#getTitleId
         * @function
         * @description Returns the title id.
         * @returns {String}
         */
        this.getTitleId = function () {
            return titleId;
        };

        /**
         * @private
         * @name sap.apf.modeler.core.Step#setLongTitleId
         * @function
         * @description Set the longTitle id.
         * @param {String} id LongTitle id
         */
        this.setLongTitleId = function (id) {
            longTitleId = id;
        };

        /**
         * @private
         * @name sap.apf.modeler.core.Step#getLongTitleId
         * @function
         * @description Returns the longTitle id.
         * @returns {String}
         */
        this.getLongTitleId = function () {
            return longTitleId;
        };

        /**
         * @private
         * @name sap.apf.modeler.core.Step#getSelectProperties
         * @function
         * @description Return an array of the mutable OData properties of the step and its request.
         * @returns {String[]}
         */
        this.getSelectProperties = function () {
            var list = [];
            var lll = selectProperties.getElements();
            lll.forEach(function (item) {
                list.push(item.getId());
            });
            return list;
        };

        /**
         * @private
         * @name sap.apf.modeler.core.Step#addSelectProperty
         * @function
         * @description Add an OData properties.
         * @param {string} property - property name
         */
        this.addSelectProperty = function (property) {
            selectProperties.createElementWithProposedId(undefined, property);
        };
        /**
         * @private
         * @name sap.apf.modeler.core.Step#removeSelectProperty
         * @function
         * @description Remove an OData properties.
         * @param {string} property - property name
         */
        this.removeSelectProperty = function (property) {
            selectProperties.removeElement(property);
        };

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#getFilterProperties
         * @description The mutable filter properties.
         * @returns {String[]}
         */
        this.getFilterProperties = function () {
            var list = [];
            var lll = filterProperties.getElements();
            lll.forEach(function (item) {
                list.push(item.getId());
            });
            return list;
        };

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#addFilterProperty
         * @description Add an OData properties.
         * @param {string} property - property name
         */
        this.addFilterProperty = function (property) {
            return filterProperties.createElementWithProposedId(undefined, property).getId();
        };
        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#removeFilterProperty
         * @description Remove an OData properties.
         * @param {string} property - property name
         */
        this.removeFilterProperty = function (property) {
            filterProperties.removeElement(property);
        };

        /**
         * @private
         * @name sap.apf.modeler.core.Step#setFilterMappingService
         * @function
         * @description Sets the service root for filter mapping. 
         * @param {string} serviceRoot - service root for filter mapping
         */
        this.setFilterMappingService = function(serviceRoot){
        	requestForFilterMapping.service = serviceRoot;
        };
        
        /**
         * @private
         * @name sap.apf.modeler.core.Step#getFilterMappingService
         * @function
         * @description Returns the service root for filter mapping. 
         * @returns {string} - Service root for filter mapping
         */
        this.getFilterMappingService = function () {
            return requestForFilterMapping.service;
        };
        
        /**
         * @private
         * @name sap.apf.modeler.core.Step#setFilterMappingEntitySet
         * @function
         * @description Sets the entity set for filter mapping. 
         * @param {string} entitySet - Entity set for filter mapping
         */
        this.setFilterMappingEntitySet = function(entitySet){
        	requestForFilterMapping.entitySet = entitySet;
        };
        
        /**
         * @private
         * @name sap.apf.modeler.core.Step#getFilterMappingEntitySet
         * @function
         * @description Returns the entity set for filter mapping. 
         * @returns {string} - Entity set for filter mapping
         */
        this.getFilterMappingEntitySet = function () {
            return requestForFilterMapping.entitySet;
        };
        
        /**
         * @private
         * @name sap.apf.modeler.core.Step#addFilterMappingSelectProperty
         * @function
         * @description Adds a select property for filter mapping.
         * @param {string} property - Property name
         */
        this.addFilterMappingSelectProperty = function (property) {
            return;
        };
        
        /**
         * @private
         * @name sap.apf.modeler.core.Step#getFilterMappingSelectProperty
         * @function
         * @description Returns an array of select properties for filter mapping.
         * @returns {String[]}
         */
        this.getFilterMappingSelectProperties = function () {            
            return [];
        };
        
        /**
         * @deprecated
         * @private
         * @name sap.apf.modeler.core.Step#removeFilterMappingSelectProperty
         * @function
         * @description Removes a select property for filter mapping
         * @param {string} property - Property name
         */
        this.removeFilterMappingSelectProperty = function (property) {
        	return;
        };
        
        /**
         * @private
         * @name sap.apf.modeler.core.Step#addFilterMappingTargetProperty
         * @function
         * @description Adds a target property for filter mapping.
         * @param {string} property - Property name
         */
        this.addFilterMappingTargetProperty = function (property) {
            targetPropertiesForFilterMapping.createElementWithProposedId(undefined, property);
        };
        
        /**
         * @private
         * @name sap.apf.modeler.core.Step#getFilterMappingTargetProperties
         * @function
         * @description Returns an array of target properties for filter mapping.
         * @returns {String[]}
         */
        this.getFilterMappingTargetProperties = function () {
            var propertylist = [];
            var propertyElementList = targetPropertiesForFilterMapping.getElements();
            propertyElementList.forEach(function (item) {
            	propertylist.push(item.getId());
            });
            return propertylist;
        };
        
        /**
         * @private
         * @name sap.apf.modeler.core.Step#removeFilterMappingTargetProperty
         * @function
         * @description Removes a filter mapping target property
         * @param {string} property - Property name
         */
        this.removeFilterMappingTargetProperty = function (property) {
        	targetPropertiesForFilterMapping.removeElement(property);
        };
        
        /**
         * @private
         * @name sap.apf.modeler.core.Step#setFilterMappingKeepSource
         * @function
         * @description Sets the keepSource property for filter mapping. 
         * @param {boolean} keepSource 
         */
        this.setFilterMappingKeepSource = function(keepSource){
        	keepSourceForFilterMapping = keepSource;
        };
        /**
         * @private
         * @name sap.apf.modeler.core.Step#getFilterMappingKeepSource
         * @function
         * @description Returns the keepSource property for filter mapping.
         * @returns {boolean}
         */
        this.getFilterMappingKeepSource = function () {
            return keepSourceForFilterMapping;
        };
        
        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#getRepresentations
         * @description A list of representation objects, see {@link sap.apf.modeler.core.Representation}.
         * @returns {sap.apf.modeler.core.Representation[]}
         */
        this.getRepresentations = representationContainer.getElements;

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#getRepresentation
         * @description Return an element if existing, see {@link sap.apf.modeler.core.Representation}.
         * @param {string} representationId
         * @returns {sap.apf.modeler.core.Representation}
         */
        this.getRepresentation = representationContainer.getElement;

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#createRepresentation
         * @param {Object} [element] - Fields of optional object will be merged into created object.
         * @returns {sap.apf.modeler.core.Representation}
         */
        this.createRepresentation = representationContainer.createElement;

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#removeRepresentation
         * @param {string} representationId
         */
        this.removeRepresentation = representationContainer.removeElement;

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#copyRepresentation
         * @param {string} representationId
         * @returns {string} Id for new representation
         */
        this.copyRepresentation = representationContainer.copyElement;
        
        /**
         * Change the ordering by moving one representation in the ordering before another representation.
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#moveRepresentationBefore
         * @param {string} beforeRepresentationId
         * @param {string} movedRepresentationId
         * @returns {number|null} WHEN either Id is not contained or undefined THEN return null.
         *      Otherwise return the index of the index position of movedRepresentationId, after the move.
         */
        this.moveRepresentationBefore = function(beforeRepresentationId, movedRepresentationId) {
        	return representationContainer.moveBefore(beforeRepresentationId, movedRepresentationId);
        };
        
        /**
         * Move a representation up or down some places specified by distance
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#moveRepresentationUpOrDown
         * @param {string} representationId id of the representation, that shall be moved
         * @param {string} distance number of places
         */
        this.moveRepresentationUpOrDown = function(representationId, distance) {
        	return representationContainer.moveUpOrDown(representationId, distance);
        };
        /**
         * Change the ordering of representations by moving one representation in the ordering to the end.
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#moveRepresentationToEnd
         * @param {string} representationId
         * @returns {number|null} WHEN the key representationId is not contained or undefined THEN return null.
         *      Otherwise return the index of the index position of representation(Id), after the move.
         */
        this.moveRepresentationToEnd = function(representationId) {
        	return representationContainer.moveToEnd(representationId);
        };
        
        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#setLeftUpperCornerTextKey
         * @description Optional member.
         *          When the value is null or undefined the corner text will be omitted from the serialized configuration object.
         *          The initial value is set to undefined.
         * @param {String|null} textKey
         */
        this.setLeftUpperCornerTextKey = function (textKey) {
            leftUpperCornerTextKey = textKey;
        };

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#getLeftUpperCornerTextKey
         * @description Get optional member.
         * @returns {String|undefined|null} Return a textKey (GUID). Returns undefined when initial, null or undefined when set to null or undefined.
         */
        this.getLeftUpperCornerTextKey = function () {
            return leftUpperCornerTextKey;
        };

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#setRightUpperCornerTextKey
         * @description Optional member
         * @param {String|null} textKey
         */
        this.setRightUpperCornerTextKey = function (textKey) {
            rightUpperCornerTextKey = textKey;
        };

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#getRightUpperCornerTextKey
         * @description Optional member
         * @returns {String} typeId
         */
        this.getRightUpperCornerTextKey = function () {
            return rightUpperCornerTextKey;
        };

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#setLeftLowerCornerTextKey
         * @description Optional member
         * @param {String|null} textKey
         */
        this.setLeftLowerCornerTextKey = function (textKey) {
            leftLowerCornerTextKey = textKey;
        };

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#getLeftLowerCornerTextKey
         * @description Optional member
         * @returns {String} typeId
         */
        this.getLeftLowerCornerTextKey = function () {
            return leftLowerCornerTextKey;
        };

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#setRightLowerCornerTextKey
         * @description Optional member
         * @param {String|null} textKey
         */
        this.setRightLowerCornerTextKey = function (textKey) {
            rightLowerCornerTextKey = textKey;
        };


        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.Step#getRightLowerCornerTextKey
         * @description Optional member
         * @returns {String} typeId
         */
        this.getRightLowerCornerTextKey = function () {
            return rightLowerCornerTextKey;
        };

        /**
         * @private
         * @name sap.apf.modeler.core.step#copy
         * @function
         * @description Execute a deep copy of the step and its referenced objects
         * @param {String} newStepIdForCopy - New step id for the copied instance
         * @returns {Object} sap.apf.modeler.core.step# - New step object being a copy of this object
         */
        this.copy = function( newStepIdForCopy ){
        	var dataForCopy = {
				request : request,
				selectProperties : selectProperties,
				filterProperties : filterProperties,
				requestForFilterMapping : requestForFilterMapping,
				selectPropertiesForFilterMapping : selectPropertiesForFilterMapping,
				targetPropertiesForFilterMapping : targetPropertiesForFilterMapping,
				keepSourceForFilterMapping : keepSourceForFilterMapping,
				titleId : titleId,
				longTitleId : longTitleId,
				leftUpperCornerTextKey : leftUpperCornerTextKey,
				rightUpperCornerTextKey : rightUpperCornerTextKey,
				leftLowerCornerTextKey : leftLowerCornerTextKey,
				rightLowerCornerTextKey : rightLowerCornerTextKey
			};
        	
        	var dataFromCopy = sap.apf.modeler.core.ConfigurationObjects.deepDataCopy( dataForCopy );
        	dataFromCopy.representationContainer = representationContainer.copy(newStepIdForCopy + "-Representation");
        	
        	return new sap.apf.modeler.core.Step( (newStepIdForCopy || this.getId()), inject, dataFromCopy);
        };    
    };
}());
