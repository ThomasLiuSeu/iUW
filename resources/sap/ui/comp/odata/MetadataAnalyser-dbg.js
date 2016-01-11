/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
// -----------------------------------------------------------------------------
// Analyses the OData service metadata doc ($metadata), having SAP-Annotations,
// to resolve all properties from entities, filterable properties, etc.
// -----------------------------------------------------------------------------
sap.ui.define(['jquery.sap.global', 'sap/ui/model/odata/ODataModel'],
	function(jQuery, ODataModel) {
	"use strict";


	/**
	 * Constructs a utility class to analyse the OData metadata document ($metadata), to resolve SAP-Annotations
	 * 
	 * @constructor
	 * @public
	 * @param {String} oResourceRootUri - The URL of the resource or ODataModel
	 * @author Pavan Nayak
	 */
	var MetadataAnalyser = function(oResourceRootUri) {
		if (typeof oResourceRootUri === "object") {
			this.oModel = oResourceRootUri;
		} else {
			this._sResourceRootUri = oResourceRootUri;
		}
		this._oMetadata = null;
		if (!this.oModel && this._sResourceRootUri) {
			this.oModel = new ODataModel(this._sResourceRootUri);
		}
		if (this.oModel) {
			this._oMetadata = this.oModel.getServiceMetadata();
		}
		// This doesn't work yet, so we parse the above service metadata and get the annotations manually
		// this._aAnnotations = this.oModel.getServiceAnnotations();
	
		// store schema and namespace
		if (this._oMetadata && this._oMetadata.dataServices) {
			this._oSchemaDefinition = this._oMetadata.dataServices.schema[0];
		}
	
		this.util = {
			searchForKeyValue: MetadataAnalyser.searchForKeyValue,
			searchForAndGetAllKeyValue: MetadataAnalyser.searchForAndGetAllKeyValue,
			extractMatchingValue: MetadataAnalyser.extractMatchingValue
		};
	};
	
	// TODO: should we cache all these entity fields for future access?
	// this.mFilterFields[sEntityTypeName] = aFinalFilterableFields;
	
	/**
	 * Returns the namespace from the Schema
	 * 
	 * @returns {string} the namespace
	 * @public
	 */
	MetadataAnalyser.prototype.getNamespace = function() {
		if (this._oSchemaDefinition) {
			return this._oSchemaDefinition.namespace;
		}
	};
	
	/**
	 * Gets the specified attribute (sap:annotation) value from the default entity container
	 * 
	 * @param {String} sAttribute - The name of the attribute (sap:annotation) on the entity container
	 * @returns {String} The value of the specified attribute (if found)|null
	 * @public
	 */
	MetadataAnalyser.prototype.getEntityContainerAttribute = function(sAttribute) {
		var sAttributeValue = null, oResult;
		if (this._oSchemaDefinition && this._oSchemaDefinition.entityContainer[0] && this._oSchemaDefinition.entityContainer[0].extensions) {
			oResult = this.util.searchForKeyValue(this._oSchemaDefinition.entityContainer[0].extensions, "name", sAttribute);
			if (oResult) {
				sAttributeValue = oResult.value;
			}
		}
		return sAttributeValue;
	};
	
	/**
	 * Gets the specified label for an Entity with non annotation
	 * 
	 * @param {string} sEntityType - name of the entity set
	 * @returns {string} - value of the label (if found)|null
	 * @public
	 */
	MetadataAnalyser.prototype.getEntityLabelByEntityTypeName = function(sEntityType) {
		var oEntityDef = this._getEntityDefinition(sEntityType);
		if (oEntityDef) {
			var oResult = this.util.searchForKeyValue(oEntityDef.extensions, "name", "label");
			if (oResult) {
				return oResult.value;
			}
		}
	
		return "";
	};
	
	/**
	 * Gets the entity definition for the specified entity type
	 * 
	 * @param {String} sEntityTypeName - The entity type name as specified in the metadata document (with or without namespace)
	 * @returns {Object} entity definition
	 * @private
	 */
	MetadataAnalyser.prototype._getEntityDefinition = function(sEntityTypeName) {
		var oEntityDef = null;
		if (sEntityTypeName) {
			sEntityTypeName = this.removeNamespace(sEntityTypeName);
			oEntityDef = this.util.searchForKeyValue(this._oSchemaDefinition.entityType, "name", sEntityTypeName);
		}
		return oEntityDef;
	};
	
	/**
	 * Removes the namespace from the specified string
	 * 
	 * @param {string} sString	String
	 * @returns {string} String without name space. If no name space was found, the original string will be returned.
	 * @public
	 */
	MetadataAnalyser.prototype.removeNamespace = function(sString) {
		var sNamespace, sResult;
	
		sNamespace = this.getNamespace();
		if (sString && (sString.indexOf(sNamespace + ".") === 0)) {
			sResult = sString.substring(sNamespace.length + 1);
		} else {
			sResult = sString;
		}
		return sResult;
	};
	
	/**
	 * Gets the entity type from the Entity name (EntitySet name)
	 * 
	 * @param {string} sEntitySetName - The entity name
	 * @returns {string} The entity type
	 * @private
	 */
	MetadataAnalyser.prototype.getEntityTypeNameFromEntitySetName = function(sEntitySetName) {
		var oEntitySet = null, sEntityTypeName = null;
		if (this._oSchemaDefinition && this._oSchemaDefinition.entityContainer && this._oSchemaDefinition.entityContainer[0] && this._oSchemaDefinition.entityContainer[0].entitySet) {
			oEntitySet = this.util.searchForKeyValue(this._oSchemaDefinition.entityContainer[0].entitySet, "name", sEntitySetName);
			if (oEntitySet) {
				sEntityTypeName = oEntitySet.entityType;
			}
		}
		return sEntityTypeName;
	};
	
	/**
	 * Gets the entity set from the Entity Type name (EntityType name)
	 * 
	 * @param {string} sEntityTypeName - The entity name
	 * @returns {string} The entitySet name
	 * @private
	 */
	MetadataAnalyser.prototype.getEntitySetNameFromEntityTypeName = function(sEntityTypeName) {
		var oEntityType, oEntitySet;
		// get entity type
		if (this._oSchemaDefinition && this._oSchemaDefinition.entityType) {
			oEntityType = this.util.searchForKeyValue(this._oSchemaDefinition.entityType, "name", sEntityTypeName);
			if (oEntityType) {
				// get entity set name
				oEntitySet = this.util.searchForKeyValue(this._oSchemaDefinition.entityContainer[0].entitySet, "entityType", oEntityType.entityType);
				if (oEntitySet) {
					return oEntitySet.name;
				}
			}
		}
	
		return null;
	};
	
	/**
	 * Gets the semantics from specified EntitySet Name
	 * 
	 * @private
	 * @param {string} sEntitySetName Entity set name
	 * @returns {string} the semantics of the Entity Set
	 */
	MetadataAnalyser.prototype._getEntitySetSemantics = function(sEntitySetName) {
		var oEntitySet = null, oResult, sSemantics = null;
		if (this._oSchemaDefinition && this._oSchemaDefinition.entityContainer && this._oSchemaDefinition.entityContainer[0] && this._oSchemaDefinition.entityContainer[0].entitySet) {
			oEntitySet = this.util.searchForKeyValue(this._oSchemaDefinition.entityContainer[0].entitySet, "name", sEntitySetName);
			if (oEntitySet) {
				oResult = this.util.searchForKeyValue(oEntitySet.extensions, "name", "semantics");
				if (oResult) {
					sSemantics = oResult.value;
				}
			}
		}
		return sSemantics;
	};
	
	/**
	 * Gets a collection of keys (field names) for the specified entity name
	 * 
	 * @param {String} sEntitySetName - The entity name as specified in the metadata document
	 * @returns {Array} Array of key names
	 * @public
	 */
	MetadataAnalyser.prototype.getKeysByEntitySetName = function(sEntitySetName) {
		var aKeys = null, sEntityTypeName = null;
		if (!this._oMetadata) {
			return undefined;
		}
		sEntityTypeName = this.getEntityTypeNameFromEntitySetName(sEntitySetName);
		if (sEntityTypeName) {
			aKeys = this.getKeysByEntityTypeName(sEntityTypeName);
		}
		return aKeys;
	};
	
	/**
	 * Gets a collection keys (field names) for the specified entity type
	 * 
	 * @param {String} sEntityTypeName - The entity type name as specified in the metadata document
	 * @returns {Array} Array of key names
	 * @public
	 */
	MetadataAnalyser.prototype.getKeysByEntityTypeName = function(sEntityTypeName) {
		var aKeys = null, aPropertyRefs = null, iLen = 0, oEntityDef = null;
		if (!this._oMetadata) {
			return undefined;
		}
		oEntityDef = this._getEntityDefinition(sEntityTypeName);
		if (oEntityDef) {
			if (oEntityDef.key) {
				aPropertyRefs = oEntityDef.key.propertyRef;
				if (aPropertyRefs) {
					iLen = aPropertyRefs.length;
					aKeys = [];
					while (iLen--) {
						aKeys.push(aPropertyRefs[iLen].name);
					}
					aKeys = aKeys.reverse();
				}
			}
		}
		return aKeys;
	};
	
	/**
	 * Gets a collection of fields for the specified entity name
	 * 
	 * @param {String} sEntitySetName - The entity name as specified in the metadata document
	 * @returns {Array} Array of fields
	 * @public
	 */
	MetadataAnalyser.prototype.getFieldsByEntitySetName = function(sEntitySetName) {
		var aFields = null, sEntityTypeName = null;
		if (!this._oMetadata) {
			return undefined;
		}
		sEntityTypeName = this.getEntityTypeNameFromEntitySetName(sEntitySetName);
		if (sEntityTypeName) {
			aFields = this.getFieldsByEntityTypeName(sEntityTypeName);
		}
		return aFields;
	};
	
	/**
	 * Gets a collection fields for the specified entity type
	 * 
	 * @param {String} sEntityTypeName - The entity type name as specified in the metadata document
	 * @returns {Array} Array of fields
	 * @public
	 */
	MetadataAnalyser.prototype.getFieldsByEntityTypeName = function(sEntityTypeName) {
		var oEntityDef;
		if (!this._oMetadata) {
			return undefined;
		}
		oEntityDef = this._getEntityDefinition(sEntityTypeName);
		return this._getFieldsByEntityDefinition(oEntityDef);
	};
	
	/**
	 * Gets a map with fields and their related semantic objects
	 * 
	 * @param {String} sEntitySetName - The entity set for which the map should be returned
	 * @returns {object} map between fields and semantic objects
	 * @public
	 */
	MetadataAnalyser.prototype.getFieldSemanticObjectMap = function(sEntitySetName) {
		var oMap = {};
		var aODataFieldMetadata = this.getFieldsByEntitySetName(sEntitySetName);
		var i, iLen = aODataFieldMetadata.length;
		for (i = 0; i < iLen; i++) {
			var oField = aODataFieldMetadata[i];
			var mAnnotation = this.getSemanticObjectAnnotation(oField.fullName);
			if (mAnnotation && mAnnotation.semanticObject) {
				oMap[oField.name] = mAnnotation.semanticObject;
			}
		}
	
		return oMap;
	};
	
	/**
	 * Gets a collection fields for the specified entity definition
	 * 
	 * @param {Object} oEntityDef - The entity definition as specified in the metadata document
	 * @returns {Array} Array of fields
	 */
	MetadataAnalyser.prototype._getFieldsByEntityDefinition = function(oEntityDef) {
		var aFields = null, iLen = 0, oProperty, mResult, oResult;
		if (oEntityDef) {
			aFields = oEntityDef.property;
		}
		// Enrich the fields with necessary information as an attribute (easy access)
		if (aFields) {
			iLen = aFields.length;
			while (iLen--) {
				oProperty = aFields[iLen];
				mResult = this.util.extractMatchingValue(oProperty.extensions, "name", [
					"label", "quickinfo", "display-format", "aggregation-role", "unit", "semantics", "sortable", "filterable", "required-in-filter", "filter-restriction", "visible"
				]);
				if (mResult) {
					oResult = mResult["label"];
					if (oResult) {
						oProperty.fieldLabel = oResult.value;
					}
					oResult = mResult["quickinfo"];
					if (oResult) {
						oProperty.quickInfo = oResult.value;
					}
					oResult = mResult["display-format"];
					if (oResult) {
						oProperty.displayFormat = oResult.value;
					}
					oResult = mResult["aggregation-role"];
					if (oResult) {
						oProperty.aggregationRole = oResult.value;
					}
					oResult = mResult["unit"];
					if (oResult) {
						oProperty.unit = oResult.value;
					}
					oResult = mResult["semantics"];
					if (oResult) {
						oProperty.semantics = oResult.value;
					}
					oResult = mResult["filter-restriction"];
					if (oResult) {
						oProperty.filterRestriction = oResult.value;
					}
					// Set filterable and sortable attributes on the field
					oResult = mResult["sortable"];
					oProperty.sortable = oResult ? oResult.value !== "false" : true;
	
					oResult = mResult["filterable"];
					oProperty.filterable = oResult ? oResult.value !== "false" : true;
	
					oResult = mResult["required-in-filter"];
					oProperty.requiredField = oResult ? oResult.value === "true" : false;
	
					// Set the visible attribute on the field
					oResult = mResult["visible"];
					oProperty.visible = oResult ? oResult.value !== "false" : true;
					oProperty.entityName = oEntityDef.name;
					oProperty.fullName = this._getFullyQualifiedNameForField(oProperty.name, oEntityDef.name);
				}
			}
		}
		return aFields;
	};
	
	/**
	 * Gets a collection of all possible filterable fields for the specified entity name
	 * 
	 * @param {String} sEntitySetName - The entity name as specified in the metadata document
	 * @returns {Array} Array of overall filterable fields
	 * @public
	 */
	MetadataAnalyser.prototype.getAllFilterableFieldsByEntitySetName = function(sEntitySetName) {
		var aFilterGroups = [], sEntityTypeName = null;
		if (!this._oMetadata) {
			return undefined;
		}
		sEntityTypeName = this.getEntityTypeNameFromEntitySetName(sEntitySetName);
		if (sEntityTypeName) {
			aFilterGroups = this.getAllFilterableFieldsByEntityTypeName(sEntityTypeName);
		}
		return aFilterGroups;
	};
	
	/**
	 * Gets a an Array of the names of all possible filterable fields for the specified entity type
	 * 
	 * @param {String} sEntityTypeName - The entity type name as specified in the metadata document
	 * @returns {Array} Array of names of overall filterable fields
	 * @public
	 */
	MetadataAnalyser.prototype.getAllFilterableFieldNamesByEntityTypeName = function(sEntityTypeName) {
		var aGroup, i, groupLength, j, fieldLength, aResult, oGroup;
	
		aResult = [];
		aGroup = this.getAllFilterableFieldsByEntityTypeName(sEntityTypeName);
		if (aGroup && aGroup.length) {
			groupLength = aGroup.length;
			for (i = 0; i < groupLength; i++) {
				oGroup = aGroup[i];
				if (oGroup.fields && oGroup.fields.length) {
					fieldLength = oGroup.fields.length;
					for (j = 0; j < fieldLength; j++) {
						aResult.push(oGroup.fields[j].name);
					}
				}
			}
		}
		return aResult;
	};
	
	/**
	 * Gets a collection of all possible filterable fields for the specified entity type
	 * 
	 * @param {String} sEntityTypeName - The entity type name as specified in the metadata document
	 * @returns {Array} Array of overall filterable fields
	 * @public
	 */
	MetadataAnalyser.prototype.getAllFilterableFieldsByEntityTypeName = function(sEntityTypeName) {
		var aFilterGroups = [], oEntityDef = null, aAssociations = null, iLen = 0, sSubEntityType = null;
		if (!this._oMetadata) {
			return undefined;
		}
		oEntityDef = this._getEntityDefinition(sEntityTypeName);
		if (oEntityDef) {
			// filterable fields from the main entity
			aFilterGroups.push(this._getFilterableFieldsFromEntityDefinition(oEntityDef));
	
			// filterable fields from associations which have 0..1 or 1 cardinality
			aAssociations = this._getFilterableAssociations(oEntityDef);
			iLen = aAssociations.length;
			while (iLen--) {
				sSubEntityType = aAssociations[iLen];
				oEntityDef = this._getEntityDefinition(sSubEntityType);
				aFilterGroups.push(this._getFilterableFieldsFromEntityDefinition(oEntityDef));
			}
		}
		return aFilterGroups;
	};
	
	/**
	 * Gets an Object containing collection of filterable fields that are directly under the specified entity type
	 * 
	 * @param {Object} oEntityDef - The entity type definition from the metadata document
	 * @returns {Object} Object containing array of filterable fields
	 * @private
	 */
	MetadataAnalyser.prototype._getFilterableFieldsFromEntityDefinition = function(oEntityDef) {
		var oFilterData = {}, aFields = [], aProperties = null, oProperty = null, i, iLen, oProp;
		if (!this._oMetadata || !oEntityDef) {
			return undefined;
		}
		// Set the name and label from entity into the field's group
		oProp = this.util.searchForKeyValue(oEntityDef.extensions, "name", "label");
		if (oProp) {
			oFilterData.groupLabel = oProp.value;
		}
		oFilterData.groupName = oEntityDef.name;
	
		aProperties = this._getFieldsByEntityDefinition(oEntityDef);
		iLen = aProperties.length;
	
		// Extract only filterable fields from all fields!
		for (i = 0; i < iLen; i++) {
			oProperty = aProperties[i];
			if (oProperty.filterable) {
				aFields.push(oProperty);
			}
		}
	
		oFilterData.fields = aFields;
		return oFilterData;
	};
	
	/**
	 * Returns the fully qualified name of a field which is e.g. "com.sap.GL.ZAF.GL_ACCOUNT/CompanyCode". Schema namespace, entity type name and field
	 * name.
	 * 
	 * @param {string} sFieldName - the name of the field/property
	 * @param {string} sEntityTypeName - the entity Type name under which the field/property is present
	 * @returns {string} - the fully qualified name
	 * @private
	 */
	MetadataAnalyser.prototype._getFullyQualifiedNameForField = function(sFieldName, sEntityTypeName) {
		var sNamespace, sResult;
		sNamespace = this.getNamespace();
		if (sNamespace) {
			sResult = sNamespace + "." + sEntityTypeName + "/" + sFieldName;
		} else {
			sResult = sEntityTypeName + "/" + sFieldName;
		}
		return sResult;
	};
	
	/**
	 * @param {string} sFullyQualifiedFieldName	Fully qualified name
	 * @returns {string} The field name without name space and without entity
	 * @public
	 */
	MetadataAnalyser.prototype.getFieldNameByFullyQualifiedFieldName = function(sFullyQualifiedFieldName) {
		var sResult, nPos;
	
		sResult = this.removeNamespace(sFullyQualifiedFieldName);
		nPos = sResult.indexOf("/");
		sResult = sResult.substring(nPos + 1);
		return sResult;
	};
	
	/**
	 * Gets a collection of filterable associations under the specified entity type
	 * 
	 * @param {Object} oEntityDef - The entity type definition from the metadata document
	 * @returns {Array} Array of filterable associations
	 * @private
	 */
	MetadataAnalyser.prototype._getFilterableAssociations = function(oEntityDef) {
		var sNamespace, aFilterableAssociations = [], sRelationship = null, aNavigationProperties = null, oNavigationProperty = null;
		var iLen = 0, oAssociationDef = null, oToRoleDef = null;
		if (!this._oMetadata || !oEntityDef) {
			return undefined;
		}
		sNamespace = this.getNamespace();
		aNavigationProperties = oEntityDef.navigationProperty;
		if (aNavigationProperties && aNavigationProperties.length) {
			iLen = aNavigationProperties.length;
			while (iLen--) {
				oNavigationProperty = aNavigationProperties[iLen];
	
				// get the related association definition and the role specific definitions
				sRelationship = oNavigationProperty.relationship;
				if (sRelationship.indexOf(sNamespace + ".") === 0) {
					sRelationship = sRelationship.substring(sNamespace.length + 1);
				}
				oAssociationDef = this.util.searchForKeyValue(this._oSchemaDefinition.association, "name", sRelationship);
				if (!oAssociationDef) {
					continue;
				}
	
				// get the ToRole of the association definition
				oToRoleDef = this.util.searchForKeyValue(oAssociationDef.end, "role", oNavigationProperty.toRole);
				if (!oToRoleDef) {
					continue;
				}
	
				// check if the navigation property has cardinality 0..1 or 1
				if (oToRoleDef.multiplicity === "1" || oToRoleDef.multiplicity === "0..1") {
					aFilterableAssociations.push(oToRoleDef.type);
				}
			}
		}
		return aFilterableAssociations;
	};
	
	/**
	 * Retrieves the ValueList Annotation for the specified property/target
	 * 
	 * @param {String} sPath the full path of the property/target (including the namespace)
	 * @returns {Object} a Map of resolved ValueHelpList (if any) annotations
	 * @public
	 */
	MetadataAnalyser.prototype.getValueListAnnotation = function(sPath) {
		var mAnnotation = {
			additionalAnnotations: []
		}, aAnnotations, oAnnotations, oResolvedAnnotation, iLen = 0, i = 0, sParentFieldName = null;
		if (this._oSchemaDefinition && this._oSchemaDefinition.annotations) {
			// Get all matching annotations
			aAnnotations = this.util.searchForAndGetAllKeyValue(this._oSchemaDefinition.annotations, "target", sPath);
			sParentFieldName = this.getFieldNameByFullyQualifiedFieldName(sPath);
			if (aAnnotations) {
				iLen = aAnnotations.length;
				for (i = 0; i < iLen; i++) {
					oAnnotations = aAnnotations[i];
					// Check if term is correct
					if (oAnnotations && oAnnotations.annotation) {
						oResolvedAnnotation = this.util.searchForKeyValue(oAnnotations.annotation, "term", "com.sap.vocabularies.Common.v1.ValueList");
						if (oResolvedAnnotation) {
							this._enrichValueHelpAnnotation(oResolvedAnnotation, sParentFieldName);
							// Check if there is no qualifier --> the default/primaryValueListAnnotation
							if (!oAnnotations.qualifier && !mAnnotation.primaryValueListAnnotation) {
								mAnnotation.primaryValueListAnnotation = oResolvedAnnotation;
							} else {
								// Set the qualifier on the resolved annotation
								oResolvedAnnotation.qualifier = oAnnotations.qualifier;
								mAnnotation.additionalAnnotations.push(oResolvedAnnotation);
							}
						}
					}
				}
			}
		}
		return mAnnotation;
	};
	
	/**
	 * Retrieves the SemanticObject Annotation for the specified property/target
	 * 
	 * @param {String} sPath the full path of the property/target (including the namespace)
	 * @returns {Object} the resolved semanticObject annotation object (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getSemanticObjectAnnotation = function(sPath) {
		var aAnnotations, oAnnotations, oResolvedAnnotation, iLen = 0, i = 0, oResult;
		if (this._oSchemaDefinition && this._oSchemaDefinition.annotations) {
			// Get all matching annotations
			aAnnotations = this.util.searchForAndGetAllKeyValue(this._oSchemaDefinition.annotations, "target", sPath);
			if (aAnnotations) {
				iLen = aAnnotations.length;
				for (i = 0; i < iLen; i++) {
					oAnnotations = aAnnotations[i];
					// Check if term is correct
					if (oAnnotations && oAnnotations.annotation) {
						oResolvedAnnotation = this.util.searchForKeyValue(oAnnotations.annotation, "term", "com.sap.vocabularies.Common.v1.SemanticObject");
						if (oResolvedAnnotation) {
							oResult = this.util.searchForKeyValue(oResolvedAnnotation.extensions, "name", "String");
							if (oResult) {
								oResolvedAnnotation.semanticObject = oResult.value;
								break;
							}
						}
					}
				}
			}
		}
		return oResolvedAnnotation;
	};
	
	/**
	 * Enriches the provided Value Help annotation with key and other relevant information
	 * 
	 * @param {object} oAnnotation	Annotation object
	 * @param {string} sParentFieldName - the parent field name
	 * @private
	 */
	MetadataAnalyser.prototype._enrichValueHelpAnnotation = function(oAnnotation, sParentFieldName) {
		var mResult, oResult, aKeys = [], sKey, mInParams = {}, mOutParams = {}, bIsInParam, bIsOutParam, aFields = [], aValueListFields = [], aRecords, oProperty, sValueListProperty, sLocalDataProperty, oParam, iLen = 0, i = 0, iFieldLen = 0;
		if (oAnnotation && oAnnotation.record) {
			mResult = this.util.extractMatchingValue(oAnnotation.record.propertyValue, "property", [
				"CollectionPath", "Label", "SearchSupported", "Parameters"
			]);
			if (mResult) {
				oResult = mResult["SearchSupported"];
				oAnnotation.isSearchSupported = oResult ? oResult.bool === "true" : false;
				oResult = mResult["CollectionPath"];
				// Set the CollectionPath on the annotation
				if (oResult) {
					oAnnotation.valueListEntitySetName = oResult.string;
					oAnnotation.valueListEntityName = this.removeNamespace(this.getEntityTypeNameFromEntitySetName(oAnnotation.valueListEntitySetName));
					oAnnotation.semantics = this._getEntitySetSemantics(oAnnotation.valueListEntitySetName);
					aKeys = this.getKeysByEntityTypeName(oAnnotation.valueListEntityName);
					aFields = this.getFieldsByEntityTypeName(oAnnotation.valueListEntityName);
				}
	
				oResult = mResult["Label"];
				// Set the valueListTitle on the annotation
				if (oResult) {
					oAnnotation.valueListTitle = oResult.string;
				}
	
				// Get all the params to create mappings, fields, key etc
				oResult = mResult["Parameters"];
				if (aFields && oResult && oResult.collection) {
					aRecords = oResult.collection.record;
					iLen = aRecords.length;
				}
				// Loop through all the parameters/records
				for (i = 0; i < iLen; i++) {
					oParam = aRecords[i];
					sValueListProperty = undefined;
					sLocalDataProperty = undefined;
					// Each Parameter on the VL annotation has max 2 properties:
					// LocalDataProperty - Path to the property on the local entity that triggered the ValueList
					// ValueListProperty - Path to property in on the ValueList entity
					mResult = this.util.extractMatchingValue(oParam.propertyValue, "property", [
						"ValueListProperty", "LocalDataProperty"
					]);
					oProperty = mResult["ValueListProperty"];
					if (oProperty) {
						sValueListProperty = oProperty.string;
					}
					oProperty = mResult["LocalDataProperty"];
					if (oProperty) {
						sLocalDataProperty = oProperty.propertyPath;
					}
	
					bIsInParam = false;
					if (oParam.type === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" || oParam.type === "com.sap.vocabularies.Common.v1.ValueListParameterIn") {
						bIsInParam = true;
					}
					bIsOutParam = false;
					if (oParam.type === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" || oParam.type === "com.sap.vocabularies.Common.v1.ValueListParameterOut") {
						bIsOutParam = true;
					}
	
					// Mapping for In/InOut params
					if (bIsInParam) {
						mInParams[sLocalDataProperty] = sValueListProperty;
					}
	
					// Mapping for Out/InOut params
					if (bIsOutParam) {
						mOutParams[sLocalDataProperty] = sValueListProperty;
					}
	
					// For sFin/gateway; this apparently should form the columns/fields in the list!
					if (bIsOutParam || oParam.type === "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly") {
						iFieldLen = aFields.length;
						while (iFieldLen--) {
							if (aFields[iFieldLen].name === sValueListProperty) {
								aValueListFields.push(aFields[iFieldLen]);
								break;
							}
						}
					}
					// The 1st InOut/Out param having the parent field as LocalDataProperty; should be the Key!
					if (!sKey && bIsOutParam && sLocalDataProperty === sParentFieldName) {
						sKey = sValueListProperty;
					}
				}
			}
			// Set the mappings, fields, keys, return key and corresponding description on the annotation
			oAnnotation.inParams = mInParams;
			oAnnotation.outParams = mOutParams;
			oAnnotation.fields = aFields;
			oAnnotation.valueListFields = aValueListFields;
			oAnnotation.keys = aKeys;
			oAnnotation.keyField = sKey;
			oAnnotation.descriptionField = this.getDescriptionFieldName(oAnnotation.keyField, oAnnotation.valueListEntitySetName);
		}
	};
	
	/**
	 * Gets the human readable text/description field's name from the specified Key field's name and entity name
	 * 
	 * @param {string|object} sKeyField - the name of the key field / oField - the field as present in the OData metadata
	 * @param {string} sEntityName - the name of the entity (required if the name of the field is passed as the 1st param)
	 * @returns {string} the description field name, if any
	 * @public
	 */
	MetadataAnalyser.prototype.getDescriptionFieldName = function(sKeyField, sEntityName) {
		var aFields, i = 0, iLength, oField, oResult, sDescriptionField;
		if (typeof sKeyField === "object") {
			oField = sKeyField;
		} else {
			aFields = this.getFieldsByEntitySetName(sEntityName);
			if (aFields) {
				iLength = aFields.length;
				for (i = 0; i < iLength; i++) {
					oField = aFields[i];
					if (oField.name === sKeyField) {
						// Found the specified field, exit loop
						break;
					}
				}
			}
		}
		if (oField) {
			oResult = this.util.searchForKeyValue(oField.extensions, "name", "text");
			if (oResult) {
				sDescriptionField = oResult.value;
			}
		}
		return sDescriptionField;
	};
	
	/**
	 * Returns whether Search query is supported for this value help annotation
	 * 
	 * @param {object} oAnnotation - ValueHelpAnnotation
	 * @returns {boolean} whether search query is supported
	 * @public
	 */
	MetadataAnalyser.prototype.getIsSearchSupported = function(oAnnotation) {
		var bIsSearchSupported, oProperty;
		bIsSearchSupported = false;
	
		if (oAnnotation && oAnnotation.record && oAnnotation.record.propertyValue) {
			oProperty = this.util.searchForKeyValue(oAnnotation.record.propertyValue, "property", "SearchSupported");
			if (oProperty && oProperty.bool === "true") {
				bIsSearchSupported = true;
			}
		}
	
		return bIsSearchSupported;
	};
	
	/**
	 * Retrieves the LineItem Annotation for the specified target entity type
	 * 
	 * @param {String} sPath the full path of the entity type (including the namespace)
	 * @returns {Object} the resolved LineItem annotation object (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getLineItemAnnotation = function(sPath) {
		var aAnnotations, oAnnotations, oResolvedAnnotation, iLen = 0, i = 0;
		if (this._oSchemaDefinition && this._oSchemaDefinition.annotations) {
			// Resolve the path
			sPath = this._getFullyQualifiedNameForEntity(sPath);
			// Get the matching annotations for the path
			aAnnotations = this.util.searchForAndGetAllKeyValue(this._oSchemaDefinition.annotations, "target", sPath);
			if (aAnnotations) {
				iLen = aAnnotations.length;
				for (i = 0; i < iLen; i++) {
					oAnnotations = aAnnotations[i];
					// Check if term is correct --> LineItem
					if (oAnnotations && oAnnotations.annotation) {
						oResolvedAnnotation = this.util.searchForKeyValue(oAnnotations.annotation, "term", "com.sap.vocabularies.UI.v1.LineItem");
						if (oResolvedAnnotation) {
							break;
						}
					}
				}
			}
			// Resolve the annotation data into easily accessible properties
			if (oResolvedAnnotation && oResolvedAnnotation.collection) {
				this._enrichAnnotationWithUIDataField(oResolvedAnnotation, oResolvedAnnotation.collection.record);
			}
		}
		return oResolvedAnnotation;
	};
	
	/**
	 * Retrieves an array of FieldGroup Annotation for the specified target entity type
	 * 
	 * @param {String} sPath the entity type name -or- the full path of the entity type (including the namespace)
	 * @returns {Object} the resolved array of FieldGroup annotations (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getFieldGroupAnnotation = function(sPath) {
		var aAnnotations, oAnnotations, oAnnotation, mResult, oResult, aResolvedAnnotation, iLen = 0, i = 0;
		if (this._oSchemaDefinition && this._oSchemaDefinition.annotations) {
			// Resolve the path
			sPath = this._getFullyQualifiedNameForEntity(sPath);
			// Get the matching annotations for the path
			aAnnotations = this.util.searchForAndGetAllKeyValue(this._oSchemaDefinition.annotations, "target", sPath);
			if (aAnnotations) {
				iLen = aAnnotations.length;
				for (i = 0; i < iLen; i++) {
					oAnnotations = aAnnotations[i];
					// Check if term is correct --> FieldGroup
					if (oAnnotations && oAnnotations.annotation) {
						aResolvedAnnotation = this.util.searchForAndGetAllKeyValue(oAnnotations.annotation, "term", "com.sap.vocabularies.UI.v1.FieldGroup");
						if (aResolvedAnnotation) {
							break;
						}
					}
				}
			}
			// Resolve the annotation data into easily accessible properties
			if (aResolvedAnnotation) {
				iLen = aResolvedAnnotation.length;
				for (i = 0; i < iLen; i++) {
					oAnnotation = aResolvedAnnotation[i];
					// Set the groupName of the annotation
					oResult = this.util.searchForKeyValue(oAnnotation.extensions, "name", "Qualifier");
					if (oResult) {
						oAnnotation.groupName = oResult.value;
					}
					if (oAnnotation && oAnnotation.record && oAnnotation.record.propertyValue) {
						mResult = this.util.extractMatchingValue(oAnnotation.record.propertyValue, "property", [
							"Label", "Data"
						]);
						// Get the label for the group
						oResult = mResult["Label"];
						if (oResult) {
							// Assign the groupLabel to the annotation if it exists
							oAnnotation.groupLabel = oResult.string;
						}
						// Get the collection of UI fields
						oResult = mResult["Data"];
						if (oResult && oResult.collection) {
							this._enrichAnnotationWithUIDataField(oAnnotation, oResult.collection.record);
						}
					}
				}
			}
		}
		return aResolvedAnnotation;
	};
	
	/**
	 * Enriches the provided FieldGroup/LineItem annotation with UI.DataField attributes
	 * 
	 * @param {object} oAnnotation - the annotation that would be enriched
	 * @param {Array} aRecords - array of params having UI.DataField
	 * @private
	 */
	MetadataAnalyser.prototype._enrichAnnotationWithUIDataField = function(oAnnotation, aRecords) {
		var aFields = [], mLabels = {}, mResult, oProperty, sField, oParam, iLen = 0, i = 0;
		if (aRecords) {
			iLen = aRecords.length;
			aFields = [];
			mLabels = {};
			for (i = 0; i < iLen; i++) {
				oParam = aRecords[i];
				// Check if term is correct (TODO: Should be only "com.sap.vocabularies.UI.v1.DataField")
				if (oParam && (oParam.type === "UI.DataField" || oParam.type === "com.sap.vocabularies.UI.v1.DataField")) {
					sField = null;
					mResult = this.util.extractMatchingValue(oParam.propertyValue, "property", [
						"Value", "Label"
					]);
					oProperty = mResult["Value"];
					if (oProperty) {
						sField = oProperty.path;
						aFields.push(sField);
					}
					if (sField) {
						oProperty = mResult["Label"];
						if (oProperty && oProperty.string) {
							mLabels[sField] = oProperty.string;
						}
					}
				}
			}
	
			// Assign the resolved fields and labels to the annotation
			oAnnotation.fields = aFields;
			oAnnotation.labels = mLabels;
	
		}
	
	};
	
	/**
	 * Returns the fully qualified name of an entity which is e.g. "com.sap.GL.ZAF.GL_ACCOUNT" from the specified type name.
	 * 
	 * @param {string} sEntityTypeName - the entity Type name which needs to be converted
	 * @returns {string} - the fully qualified name for this entity
	 * @private
	 */
	MetadataAnalyser.prototype._getFullyQualifiedNameForEntity = function(sEntityTypeName) {
		var sNamespace, sResult;
		if (!sEntityTypeName) {
			return undefined;
		}
		sNamespace = this.getNamespace();
		if (sNamespace && !(sEntityTypeName.indexOf(sNamespace) > -1)) {
			sResult = sNamespace + "." + sEntityTypeName;
		} else {
			sResult = sEntityTypeName;
		}
		return sResult;
	};
	
	/**
	 * Search for and extract the first matching object values, for the specified key and search array, from the object array
	 * 
	 * @param {Object} aObjectArray - The array to search in
	 * @param {String} sKey - The key to search with
	 * @param {String} aSearchArray - Array of strings containing values that should be matched
	 * @returns {Object} - Map of objects with first match, if any
	 * @private
	 */
	MetadataAnalyser.extractMatchingValue = function(aObjectArray, sKey, aSearchArray) {
		var oResult = null, oObject, i, iLength, iSearchArrayLength;
		if (aObjectArray && aSearchArray) {
			iLength = aObjectArray.length;
			iSearchArrayLength = aSearchArray.length;
			oResult = {};
			for (i = 0; i < iLength; i++) {
				oObject = aObjectArray[i];
				if (aSearchArray.indexOf(oObject[sKey]) > -1) {
					if (!oResult[oObject[sKey]]) {
						oResult[oObject[sKey]] = oObject;
						iSearchArrayLength--;
					}
				}
				if (iSearchArrayLength === 0) {
					break;
				}
			}
		}
		return oResult;
	};
	
	/**
	 * Search for and return the first matching object, with the specified key and value, from the array
	 * 
	 * @param {Object} aObjectArray - The array to search in
	 * @param {String} sKey - The key to search with
	 * @param {String} sValue - The value to match with
	 * @returns {Object} - The first matching Object if any
	 * @private
	 */
	MetadataAnalyser.searchForKeyValue = function(aObjectArray, sKey, sValue) {
		var aResult = null, oResult = null;
		aResult = MetadataAnalyser.searchForAndGetAllKeyValue(aObjectArray, sKey, sValue);
		if (aResult && aResult.length) {
			oResult = aResult[0];
		}
		return oResult;
	};
	
	/**
	 * Search for and return all the matching objects, with the specified key and value, from the array
	 * 
	 * @param {Object} aObjectArray - The array to search in
	 * @param {String} sKey - The key to search with
	 * @param {String} sValue - The value to match with
	 * @returns {Array} - array of all the matching objects
	 * @private
	 */
	MetadataAnalyser.searchForAndGetAllKeyValue = function(aObjectArray, sKey, sValue) {
		var aResult = null;
		if (aObjectArray) {
			aResult = jQuery.grep(aObjectArray, function(a) {
				return a[sKey] === sValue;
			});
		}
		return aResult;
	};
	
	/**
	 * Destroys the object
	 * 
	 * @public
	 */
	MetadataAnalyser.prototype.destroy = function() {
		this.oModel = null;
		this._oMetadata = null;
		this._oSchemaDefinition = null;
		this._sResourceRootUri = null;
		this.util = null;
		this.bIsDestroyed = true;
	};
	

	return MetadataAnalyser;

}, /* bExport= */ true);
