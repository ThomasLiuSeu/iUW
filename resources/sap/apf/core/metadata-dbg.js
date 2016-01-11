/*global sap */
/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.core.utils.fileExists");

/**
 * @class This class initializes the metadata and the annotations and merges them together. The class provides methods to access metadata information like parameters of an entity type and their
 *        data types.
 * @param {Object} oInject Injection of dependencies, which are Hashtable, MessageHandler, coreAi.
 * @param {string} sAbsolutePathToServiceDocument Absolute Path to service document like "/sap/hba/apps/wca/s/odata/wca.xsodata"
 */
sap.apf.core.Metadata = function (oInject, sAbsolutePathToServiceDocument) {
    'use strict';

    /**
     * @description Contains 'metadata'
     * @returns {String}
     */
    this.type = "metadata";
    // Private vars
    var that = this;
    var bInitFailed = false;
    var oCoreApi = oInject.coreApi;
    var oMetadata;
    var oAnnotation;
    var aEntityTypes;
    var oHtPropertyMetadata = new oInject.hashtable(oInject.messageHandler);
    var oHtFilterableProperties = new oInject.hashtable(oInject.messageHandler);
    var oHtAllProperties = new oInject.hashtable(oInject.messageHandler);
    var oHtParameterEntitySetKeyProperties = new oInject.hashtable(oInject.messageHandler);
    var oHtEntityTypeMetadata = new oInject.hashtable(oInject.messageHandler);
    var oHtEntityTypeOfEntitySet = new oInject.hashtable(oInject.messageHandler);
    var ODataModel = oInject.ODataModel || sap.ui.model.odata.ODataModel;
    var bDeactivateFatalError = false;
    if (oInject.deactivateFatalError) {
        bDeactivateFatalError = true;
    }

    // Private functions
    /**
     * @description Returns all entity types of service documents
     * @returns {Array} - EntityTypes Returns entity types
     */
    function getEntityTypes() {
        if (!aEntityTypes) {
            aEntityTypes = [];
            oMetadata.dataServices.schema.forEach(function (schemaElement) {
                schemaElement.entityType.forEach(function (element) {
                    aEntityTypes.push(element.name);
                });
            });
        }
        return aEntityTypes;
    }

    function checkInternalObjectStructure() {
        oInject.messageHandler.check(oMetadata !== undefined, 'sap.apf.metadata - oMetadata is undefined');
        oInject.messageHandler.check(oMetadata.dataServices, 'sap.apf.metadata - oMetadata.dataServices is undefined');
        oInject.messageHandler.check(oMetadata.dataServices.schema !== undefined, 'sap.apf.metadata - oMetadata.dataServices.schema is undefined');
        oInject.messageHandler.check(oAnnotation !== undefined, 'sap.apf.metadata - oAnnotation is undefined');
    }

    function getEntityTypeFromMetadata(sEntityType, bAggregate) {
        var done = false,
            result;
        oMetadata.dataServices.schema.forEach(function (aSchema) {
            aSchema.entityType.forEach(function (eType) {
                var aAttribute = eType.extensions;
                if (aAttribute && eType.name.indexOf(sEntityType) > -1) {
                    aAttribute.forEach(function (attribute) {
                        if (done) {
                            return;
                        }
                        if ((attribute.name === "semantics") &&
                            ( ( bAggregate && attribute.value === "aggregate") ||
                            ( !bAggregate && attribute.value === "parameters")
                            )) {
                            done = true;
                            result = eType;
                        }
                    });
                }
            });
        });
        if (done) {
            return result;
        }
        return {
            property: []
        };
    }

    function getEntityTypeFromPropertyAnnotations(sEntityType, bAggregate) {
        var result = {}, done = false, splitted;
        if (!sEntityType || (! oAnnotation.propertyAnnotations))  {
            return {};
        }
        var resultsSuffix = 'Results';
        if (sEntityType.indexOf(resultsSuffix, sEntityType.length - resultsSuffix.length) !== -1) {
            sEntityType = sEntityType.substring(0, sEntityType.length - resultsSuffix.length);
        }
        jQuery.each(oAnnotation.propertyAnnotations, function (oEntityTypeAnnotations, value) {
            if (done) {
                return;
            }
            splitted = oEntityTypeAnnotations.split(".").pop().toString();
            if (splitted === sEntityType || splitted.indexOf((sEntityType + (bAggregate ? "ResultsType" : "Type") )) > -1) {
                done = true;
                result = oAnnotation.propertyAnnotations[oEntityTypeAnnotations];
                return;
            }
        }.bind(that));
        return result;
    }

    function defineApiResult(object) {
        function moveToDataType(property) {
            if (!object.dataType) {
                object.dataType = {};
            }
            object.dataType[property] = object[property];
            delete object[property];
        }

        function map(sAlternativeName, property) {
            if (jQuery.isArray(object[property]) === true) {
                (object[property]).forEach(function(obj){
                    object[obj.name] = obj.value;
                });
                delete object[property];
            } else if (property !== "dataType" && typeof (object[property]) === "object") { // dataType is explicit set by the APF has not to be modified
                if (Object.keys(object[property]).length === 0) {
                    object[sAlternativeName] = "true";
                }
                jQuery.each(object[property], function(objProperty, itsValue){
                    object[sAlternativeName] = itsValue;
                });
                delete object[property];
            } else {
                object[sAlternativeName] = object[property];
            }
        }
        jQuery.each(object, function( sProperty){
            switch (sProperty) {
                case 'type':
                    moveToDataType(sProperty);
                    break;
                case 'maxLength':
                    moveToDataType(sProperty);
                    break;
                case 'precision':
                    moveToDataType(sProperty);
                    break;
                default:
                    var sPropertyName = sProperty.split(".").pop();
                    if (sPropertyName.search("ISO") === 0) {
                        map(sPropertyName, sProperty);
                    } else {
                        map(sPropertyName.replace(/^./, sPropertyName[0].toLowerCase()), sProperty);
                    }
                    break;
            }
        });
        return object;
    }

    function getParameterPropertiesFromEntityType(sEntityType, bOnlyKeyProperties) {
        if (oHtParameterEntitySetKeyProperties.hasItem(sEntityType) !== true) {
            checkInternalObjectStructure();
            var oEntityTypeFromMetadata = getEntityTypeFromMetadata(sEntityType, false);
            var oEntityTypeFromAnnotation = getEntityTypeFromPropertyAnnotations(sEntityType, false);
            var oKeyProperties = {};
            if (oEntityTypeFromMetadata.key && oEntityTypeFromMetadata.key.propertyRef) {
                oEntityTypeFromMetadata.key.propertyRef.forEach(function (oPropRef) {
                    oKeyProperties[oPropRef.name] = null;
                });
            }
            var oMerged = {};
            var oResult = {allParameters: [], keyParameters: []};
            var i, oProperty, oPropertyAnnotation;
            for (i = 0; i < oEntityTypeFromMetadata.property.length; i++) {
                oProperty = oEntityTypeFromMetadata.property[i];
                oProperty.isKey = oKeyProperties.hasOwnProperty(oProperty.name);
                oPropertyAnnotation = oEntityTypeFromAnnotation[oProperty.name];
                if (oPropertyAnnotation !== undefined) {
                    oProperty = jQuery.extend(oProperty, oPropertyAnnotation);
                }
                oMerged[oProperty.name] = oProperty;
            }
            var oProp, oParameter;
            for (oProp in oMerged) { // jshint ignore:line
                oParameter = defineApiResult(oMerged[oProp]);
                oResult.allParameters.push(oParameter);
                if (oParameter.isKey) {
                    oResult.keyParameters.push(oParameter);
                }
            }
            oHtParameterEntitySetKeyProperties.setItem(sEntityType, oResult);
        }
        if (!bOnlyKeyProperties) {
            return oHtParameterEntitySetKeyProperties.getItem(sEntityType).allParameters;
        }
        return oHtParameterEntitySetKeyProperties.getItem(sEntityType).keyParameters;
    }

    function getAllAggregatePropertiesOfEntityType(sEntityType) {
        var aPropertyNames = [];
        var bIsParameterEntityType = isParameterEntityType(sEntityType);
        if (bIsParameterEntityType) {
            sEntityType = getEntityTypeFromAggregateEntitySet(sEntityType);
        }

        var entityType = getEntityTypeFromMetadata(sEntityType, true);
        entityType.property.forEach(function (property) {
            aPropertyNames.push(property.name);
        });
        return aPropertyNames;
    }

    function getAllPropertiesOfExtendedEntityType(sEntityType) {
        var i;
        if (oHtAllProperties.hasItem(sEntityType) === true) {
            return oHtAllProperties.getItem(sEntityType);
        }
        var aAllProperties = [];
        var aPropertyNames = [];
        var aParameterNames = [];


        var sAggregateEntityType = getEntityTypeFromAggregateEntitySet(sEntityType);
        var oEntityTypeFromMetadata = getEntityTypeFromMetadata(sAggregateEntityType, true);
        for (i = 0; i < oEntityTypeFromMetadata.property.length; i++) {
            aPropertyNames.push(oEntityTypeFromMetadata.property[i].name);
        }

        var aParameters = getParameterPropertiesFromEntityType(sEntityType, false);
        for (i = 0; i < aParameters.length; i++) {
            aParameterNames.push(aParameters[i].name);
        }

        aAllProperties = aPropertyNames.concat(aParameterNames);

        oHtAllProperties.setItem(sEntityType, aAllProperties);
        return oHtAllProperties.getItem(sEntityType);
    }

    function determineEntityTypeName(sEntityTypeOrSetName) {

        var sEntityType;
        if (isEntityType(sEntityTypeOrSetName)) {
            sEntityType = sEntityTypeOrSetName;
        } else {
            sEntityType = oHtEntityTypeOfEntitySet.getItem(sEntityTypeOrSetName);
            sEntityType = sEntityType || oHtEntityTypeOfEntitySet.getItem(sEntityTypeOrSetName + "Results"); // compability!!!
        }
        return sEntityType;
    }

    function getFilterablePropertiesFromEntityType(sEntityType) {
        if (oHtFilterableProperties.hasItem(sEntityType) === true) {
            return oHtFilterableProperties.getItem(sEntityType);
        }
        checkInternalObjectStructure();
        var aResult = [];
        var oEntityTypeFromMetadata = getEntityTypeFromMetadata(sEntityType, true);
        var oEntityTypeFromAnnotation = getEntityTypeFromPropertyAnnotations(sEntityType, true);
        for (var i = 0; i < oEntityTypeFromMetadata.property.length; i++) {
            var oPropertyFromMetadata = oEntityTypeFromMetadata.property[i];
            if (oPropertyFromMetadata.extensions && oPropertyFromMetadata.extensions) {
                var bFilterable = true;
                for (var j = 0; j < oPropertyFromMetadata.extensions.length; j++) {
                    var oExtension = oPropertyFromMetadata.extensions[j];
                    if (oExtension.name === "filterable" && oExtension.value === "false") {
                        bFilterable = false;
                        break;
                    }
                }
                if (bFilterable) {
                    aResult.push(oPropertyFromMetadata.name);
                }
            }
        }
        for (var oProperty in oEntityTypeFromAnnotation) {
            if (oEntityTypeFromAnnotation[oProperty] && oEntityTypeFromAnnotation[oProperty].filterable && oEntityTypeFromAnnotation[oProperty].filterable === "true") {
                aResult.push(oProperty);
            }
        }
        oHtFilterableProperties.setItem(sEntityType, aResult);
        return oHtFilterableProperties.getItem(sEntityType);
    }

    function isEntityType(entityType) {
        var aEntityTypes = getEntityTypes();
        return (jQuery.inArray(entityType, aEntityTypes) > -1);
    }

    function isParameterEntityType(sEntityType) {
        var entityTypeName;
        var aAttributes;
        for (var i = 0; i < oMetadata.dataServices.schema.length; i++) {
            for (var j = 0; j < oMetadata.dataServices.schema[i].entityType.length; j++) {
                entityTypeName = oMetadata.dataServices.schema[i].entityType[j].name.split(".").pop();
                if (entityTypeName === sEntityType) {
                    aAttributes = oMetadata.dataServices.schema[i].entityType[j].extensions;
                    if (!aAttributes) {
                        return false;
                    }
                    for (var k = 0; k < aAttributes.length; k++) {
                        if (aAttributes[k].name === "semantics") {
                            return (aAttributes[k].value === "parameters");
                        }
                    }
                }
            }
        }
    }

    function getEntityTypeFromAnnotation(sEntityType) {
        for (var oEntityTypeAnnotations in oAnnotation) {
            if (oEntityTypeAnnotations.split(".").pop().toString().indexOf(sEntityType) > -1) {
                return oAnnotation[oEntityTypeAnnotations];
            }
        }
        return {};
    }

    function getPropertyMetadataFromEntityType(sEntityType, sPropertyName) {
        var sAggregateEntityType;
        var bIsParameterEntityType = isParameterEntityType(sEntityType);
        if (bIsParameterEntityType) {
            sAggregateEntityType = getEntityTypeFromAggregateEntitySet(sEntityType);
        }

        if (oHtPropertyMetadata.hasItem(sEntityType + sPropertyName) === true) {
            return oHtPropertyMetadata.getItem(sEntityType + sPropertyName);
        } else {
            checkInternalObjectStructure();
            var oEntityTypeFromMetadata = getEntityTypeFromMetadata(sEntityType, !bIsParameterEntityType);
            var oEntityTypeFromAnnotation = getEntityTypeFromPropertyAnnotations(sEntityType, !bIsParameterEntityType);

            var oPropertyFromAnnotation;
            var oPropertyFromMetadata = getPropertyFromEntityTypeFromMetadata(oEntityTypeFromMetadata, sPropertyName);
            if (oPropertyFromMetadata && oPropertyFromMetadata.name) {
                oPropertyFromAnnotation = getPropertyFromEntityTypeFromAnnotation(oEntityTypeFromAnnotation, sPropertyName);
            } else {
                oEntityTypeFromMetadata = getEntityTypeFromMetadata(sAggregateEntityType, true);
                oPropertyFromMetadata = getPropertyFromEntityTypeFromMetadata(oEntityTypeFromMetadata, sPropertyName);
                oEntityTypeFromAnnotation = getEntityTypeFromPropertyAnnotations(sAggregateEntityType, true);
                oPropertyFromAnnotation = getPropertyFromEntityTypeFromAnnotation(oEntityTypeFromAnnotation, sPropertyName);
            }

            var oMerged = mergeAnnotationWithMetadata(oPropertyFromAnnotation, oPropertyFromMetadata);
            oHtPropertyMetadata.setItem(sEntityType + sPropertyName, defineApiResult(oMerged));
            return oHtPropertyMetadata.getItem(sEntityType + sPropertyName);
        }
    }

    //KS sEntityType either from parameter entity set or aggregate entity set
    function getEntityTypeFromAggregateEntitySet(sEntityType) {
        var entityType;
        for (var i = 0; i < oMetadata.dataServices.schema.length; i++) {
            for (var j = 0; j < oMetadata.dataServices.schema[i].entityType.length; j++) {
                entityType = oMetadata.dataServices.schema[i].entityType[j];
                if (entityType.name === sEntityType) {
                    if (entityType.navigationProperty && entityType.navigationProperty.length > 0) {
                        return findEntityTypeFromAssocation(entityType.navigationProperty[0].relationship, entityType.navigationProperty[0].toRole);
                    } else {
                        return sEntityType;
                    }
                }
            }
        }
        return sEntityType;
    }

    function findEntityTypeFromAssocation(relationship, toRole) {
        var association;
        var rel = relationship.split(".").pop();
        for (var i = 0; i < oMetadata.dataServices.schema.length; i++) {
            for (var j = 0; j < oMetadata.dataServices.schema[i].association.length; j++) {
                association = oMetadata.dataServices.schema[i].association[j];
                if (association.name === rel) {
                    for (var k = 0; k < association.end.length; k++) {
                        if (association.end[k].role === toRole) {
                            return association.end[k].type.split(".").pop();
                        }
                    }
                }
            }
        }
    }

    function getPropertyFromEntityTypeFromMetadata(oEntityTypeFromMetadata, sPropertyName) {
        for (var i = 0; i < oEntityTypeFromMetadata.property.length; i++) {
            if (oEntityTypeFromMetadata.property[i].name === sPropertyName) {
                return oEntityTypeFromMetadata.property[i];
            }
        }
        return {};
    }

    function getPropertyFromEntityTypeFromAnnotation(oEntityTypeFromAnnotation, sPropertyName) {
        for (var oProperty in oEntityTypeFromAnnotation) {
            if (oProperty === sPropertyName) {
                return oEntityTypeFromAnnotation[oProperty];
            }
        }
        return {};
    }

    function mergeAnnotationWithMetadata(oFirst, oSecond) {
        for (var i in oSecond) { // jshint ignore:line
            oFirst[i] = oSecond[i];
        }
        return oFirst;
    }


    function initMetadata() {

        var entitySet, entityType;
        var sAnnotationUri = oCoreApi.getUriGenerator().getODataPath(sAbsolutePathToServiceDocument) + "annotation.xml";
        var parameterSet = {loadMetadataAsync: false, annotationURI: sAnnotationUri, json: true};
        var oTmpMetadata, oTmpAnnotation;
        var sMessageCode;

        var odataModel = new ODataModel(sAbsolutePathToServiceDocument, parameterSet);

        oTmpMetadata = odataModel.getServiceMetadata();
        if (!oTmpMetadata) {
            sMessageCode = "5018";
            if (bDeactivateFatalError) {
                sMessageCode = "11013";
            }
            oInject.messageHandler.putMessage(oInject.messageHandler.createMessageObject({
                code: sMessageCode,
                aParameters: [sAbsolutePathToServiceDocument],
                oCallingObject: that
            }));
            bInitFailed = true;
            return;
        }

        oTmpAnnotation = odataModel.getServiceAnnotations();
        if (!oTmpAnnotation) {
            oInject.messageHandler.putMessage(oInject.messageHandler.createMessageObject({
                code: "5017",
                aParameters: [sAbsolutePathToServiceDocument],
                oCallingObject: that
            }));
        }

        oMetadata = jQuery.extend(true, {}, oTmpMetadata);
        oAnnotation = jQuery.extend(true, {}, oTmpAnnotation);

        oMetadata.dataServices.schema.forEach(function (schema) {
            schema.entityContainer.forEach(function (entityContainer) {
                if (entityContainer.entitySet) {
                    entityContainer.entitySet.forEach(function (entitySet) {
                        entityType = entitySet.entityType.split(/[. ]+/).pop();
                        oHtEntityTypeOfEntitySet.setItem(entitySet.name, entityType);
                    });
                }
            });
        });
    }

    // Public functions
    /**
     * @description Returns all metadata for the property of the provided entity type
     * @param {String} sEntitySet - identifier of the used OData entity set
     * @param {String} sPropertyName - identifier of the used OData property
     * @returns {Object} - metadata of the property
     */
    this.getPropertyMetadata = function (sEntitySet, sPropertyName) {
        oInject.messageHandler.check(sEntitySet !== undefined && typeof sEntitySet === "string", "sap.apf.core.Metadata:getPropertyMetadata incorrect EntityType name or type");
        oInject.messageHandler.check(sPropertyName !== undefined && typeof sPropertyName === "string", "sap.apf.core.Metadata:getPropertyMetadata incorrect sPropertyName name or type");

        //noinspection JSLint
        var sEntityType = determineEntityTypeName(sEntitySet);
        if (!sEntityType) {
            return {};
        }

        //noinspection JSLint
        return getPropertyMetadataFromEntityType(sEntityType, sPropertyName);
    };

    this.patchEntitySetName = function (sEntitySet) {
        if (oHtEntityTypeOfEntitySet.hasItem(sEntitySet)) {
            return sEntitySet;

        }
        if (oHtEntityTypeOfEntitySet.hasItem(sEntitySet + "Results")) {
            return sEntitySet + "Results";
        }
        return undefined;
    };
    /**
     * @description Returns names of all filterable properties of the provided entity type.
     * @param {String} sEntitySet - identifier of the used OData entity type
     * @returns {Array} aResult - names of the filterable properties
     */
    this.getFilterableProperties = function (sEntitySet) {
        oInject.messageHandler.check(sEntitySet !== undefined && typeof sEntitySet === "string", "sap.apf.core.Metadata:getFilterableProperties incorrect EntityType name or type");

        var sEntityType = determineEntityTypeName(sEntitySet);
        if (!sEntityType) {
            return [];
        }

        sEntityType = getEntityTypeFromAggregateEntitySet(sEntityType);
        return getFilterablePropertiesFromEntityType(sEntityType);

    };

    /**
     * @description Returns all properties (incl. parameters) for a given entity set provided the entitySet has an "extension".
     *      Extension means an annotation in the entityType of metadata.xml which is equal to "sap:semantics"="aggregate" or "sap:semantics"="parameter".
     *      When the entityType does not have this annotation then the result array is empty.
     * @param {String} sEntitySet - identifier of the used OData entity set
     * @returns {Array} aResult - property names
     */
    this.getAllPropertiesOfExtendedEntityType = function (sEntitySet) {
        oInject.messageHandler.check(sEntitySet !== undefined && typeof sEntitySet === "string", "sap.apf.core.Metadata:getAllProperties incorrect EntityType name or type");

        var sEntityType = determineEntityTypeName(sEntitySet);
        if (!sEntityType) {
            return [];
        }
        return getAllPropertiesOfExtendedEntityType(sEntityType);
    };
    /**
     * @description Returns all aggregate properties for a given entity set.
     * @param {String} sEntitySet - identifier of the used OData entity set
     * @returns {String[]} array of aggregate property names
     */
    this.getAllAggregatePropertiesOfEntitySet = function (sEntitySet) {
        oInject.messageHandler.check(sEntitySet !== undefined && typeof sEntitySet === "string", "sap.apf.core.Metadata:getAllProperties incorrect EntityType name or type");

        var sEntityType = determineEntityTypeName(sEntitySet);

        return getAllAggregatePropertiesOfEntityType(sEntityType);
    };


    /**
     * @description Returns names of all aggregate properties of all entity types.
     *            Return empty when the entity type does not contain an annotation "sap:semantics".
     * @returns {String[]} array of all aggregate property names
     */
    this.getAllAggregateProperties = function () {
        var aAllAggregateProperties = [];
        var aEntityTypes = getEntityTypes();

        aEntityTypes.forEach(function (entityType) {
            aAllAggregateProperties = aAllAggregateProperties.concat(getAllAggregatePropertiesOfEntityType(entityType));
        });
        aAllAggregateProperties = sap.apf.utils.eliminateDuplicatesInArray(oInject.messageHandler, aAllAggregateProperties);
        return aAllAggregateProperties;
    };

    /**
     * @description Returns names of all properties (incl. parameters) of all entity types.
     *            Return empty when the entity type does not contain an annotation "sap:semantics".
     * @returns {String[]} array of all property names
     */
    this.getAllProperties = function () {
        var aAllProperties = [];

        getEntityTypes().forEach(function (entityType) {
            aAllProperties = aAllProperties.concat(getAllPropertiesOfExtendedEntityType(entityType));
        });
        aAllProperties = sap.apf.utils.eliminateDuplicatesInArray(oInject.messageHandler, aAllProperties);

        return aAllProperties;
    };

    /**
     * @description Returns names of all parameter entity set key properties of all entity types.
     * @returns {Array} aResult - parameter names
     */
    this.getParameterEntitySetKeyPropertiesForService = function () {
        var aAllParameters = [];
        var aParameterEntitySetKeyProperties = [];

        getEntityTypes().forEach(function (entityType) {
            getParameterPropertiesFromEntityType(entityType, true).forEach(function (parameter) {
                aAllParameters.push(parameter.name);
            });
        });
        aAllParameters = sap.apf.utils.eliminateDuplicatesInArray(oInject.messageHandler, aAllParameters);

        return aAllParameters;
    };

    /**
     * @description Returns names of all key properties of all entity types.
     * @returns {Array} aResult - key names
     */
    this.getAllKeys = function () {
        var aAllKeys = [];
        var aKeys = [];

        getEntityTypes().forEach(function (entityType) {
            var oEntityType = getEntityTypeFromMetadata(entityType, true);
            if (!oEntityType.name) {
                oEntityType = getEntityTypeFromMetadata(entityType, false);
            }
            aKeys = [];
            if (oEntityType.key && oEntityType.key.propertyRef) {
            	oEntityType.key.propertyRef.forEach(function (propertyRef) {
                    aKeys.push(propertyRef.name);
                });
            }
            
            aAllKeys = aAllKeys.concat(aKeys);
        });
        aAllKeys = sap.apf.utils.eliminateDuplicatesInArray(oInject.messageHandler, aAllKeys);
        return aAllKeys;
    };


    /**
     * @description Returns all metadata attributes for a given property. It
     *              will be searched over all entity types for this property
     *              and the first match will be returned.
     * @param {String} sPropertyName
     *            sPropertyName - identifier of the used OData property
     * @returns {Object} - Object with attributes of the property
     */
    this.getAttributes = function (sPropertyName) {
        var aEntityTypes = getEntityTypes();
        var done = false;
        var oPropertyAttributes;
        getEntityTypes().forEach(function (entityType) {
            if (done) {
                return;
            }
            oPropertyAttributes = getPropertyMetadataFromEntityType(entityType, sPropertyName);
            if (oPropertyAttributes.name) {
                done = true;
            }
        });
        return oPropertyAttributes;
    };
    /**
     * @description Returns metadata which includes parameter entity set key properties and their attributes (data type, default value, ...) for the provided entity type.
     * @param {String} sEntitySet - identifier of the used OData entity type
     * @returns {Array} or {undefined} - parameters of the entity type
     */
    this.getParameterEntitySetKeyProperties = function (sEntitySet) {
        oInject.messageHandler.check(sEntitySet !== undefined && typeof sEntitySet === "string", "sap.apf.core.Metadata:getParameterEntitySetKeyProperties incorrect EntityType name or type");
        var sEntityType = determineEntityTypeName(sEntitySet);

        if (!sEntityType) {
            return [];
        }
        return getParameterPropertiesFromEntityType(sEntityType, true);

    };


    /**
     * @description Returns metadata which includes extensions for OData 4.0 like "RequiresFilter"
     * @param {String} sEntitySet - identifier of the used OData entity type
     * @returns {Array} - metadata (including annotations) of the entity type
     */
    this.getEntityTypeMetadata = function (sEntitySet) {
        oInject.messageHandler.check(sEntitySet !== undefined && typeof sEntitySet === "string", "sap.apf.core.Metadata:getEntityTypeMetadata incorrect EntityType name or type");

        var sEntityType = determineEntityTypeName(sEntitySet);

        if (oHtEntityTypeMetadata.hasItem(sEntityType) === true) {
            return oHtEntityTypeMetadata.getItem(sEntityType);
        } else {
            checkInternalObjectStructure();
            var oEntityType = getEntityTypeFromAnnotation(sEntityType);


            var object = {};
            for (var oAnnotation in oEntityType) { // jshint ignore:line
                var sAnnotationName = oAnnotation.split(".").pop();
                sAnnotationName = sAnnotationName.replace(/^./, sAnnotationName[0].toLowerCase()); //!!!
                for (var shape in oEntityType[oAnnotation]) { // jshint ignore:line
                    object[sAnnotationName] = oEntityType[oAnnotation][shape];
                }
            }
            var sAggregatedEntityType = getEntityTypeFromAggregateEntitySet(sEntityType);
            if (sAggregatedEntityType !== sEntityType) {
                var oAggregatedEntityType = getEntityTypeFromAnnotation(sEntityType);
                for (var oAnnotation2 in oAggregatedEntityType) { // jshint ignore:line
                    var sAnnotationName2 = oAnnotation2.split(".").pop();
                    sAnnotationName2 = sAnnotationName2.replace(/^./, sAnnotationName2[0]);
                    for (var shape2 in oEntityType[oAnnotation2]) { // jshint ignore:line
                        object[sAnnotationName2] = oEntityType[oAnnotation2][shape2];
                    }
                }
            }

            oHtEntityTypeMetadata.setItem(sEntityType, object);
            return oHtEntityTypeMetadata.getItem(sEntityType);
        }
    };
    /**
     * @description Returns the suffix after the parameter position in the URI generation
     * @param {String} sEntitySet - entity set from analytical configuration
     * @returns {String} - parameter suffix for URI
     */
    this.getUriSuffix = function (sEntitySet) {
        var sEntityType = determineEntityTypeName(sEntitySet);
        var entityType;
        if (isParameterEntityType(sEntityType)) {
            for (var i = 0; i < oMetadata.dataServices.schema.length; i++) {
                for (var j = 0; j < oMetadata.dataServices.schema[i].entityType.length; j++) {
                    entityType = oMetadata.dataServices.schema[i].entityType[j];
                    if (entityType.name === sEntityType) {
                        if (entityType.navigationProperty && entityType.navigationProperty.length > 0) {
                            return entityType.navigationProperty[0].name;
                        } else {
                            return "";
                        }
                    }
                }
            }

        } else {
            return "";
        }
    };
    /**
     * @description Returns all entity sets of service documents
     * @returns {Array} - EntitySets Returns entity sets
     */
    this.getEntitySets = function () {
        var dependencies = {};
        var validEntitySets = [];
        oMetadata.dataServices.schema.forEach(function (schema) {
            schema.entityContainer.forEach(function (container) {
                if (container.associationSet) {
                    container.associationSet.forEach(function (association) {
                        dependencies[association.end[1].entitySet] = true;
                    });
                }
                if (container.entitySet) {
                    container.entitySet.forEach(function (entitySet) {
                        if (!dependencies[entitySet.name]) {
                            validEntitySets.push(entitySet.name);
                        }
                    });
                }
            });

        });

        return validEntitySets;
    };

    initMetadata();

    if (bInitFailed) {
        this.failed = true;
    }
}; 
