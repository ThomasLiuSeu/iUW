/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global', './MetadataAnalyser'],
	function(jQuery, MetadataAnalyser) {
	"use strict";


	/**
	 * Constructs a utility class to analyse the OData metadata document ($metadata), to resolve SAP-Annotations
	 * 
	 * @constructor
	 * @param {sap.ui.model.odata.ODataModel} oDataModel - odata model
	 * @public
	 * @author Markus Viol
	 */
	var FieldSelectorModelConverter = function(oDataModel) {

		this._oMetadataAnalyzer = new MetadataAnalyser(oDataModel);
		this._aEntityTypes = [];
	};
	
	/**
	 * Returns the OData MetaData Analyzer
	 * 
	 * @returns {sap.ui.comp.odata.MetadataAnalyser} - metadata analyzer instance
	 * @public
	 * @name FieldSelectorModelConverter#getMetaDataAnalyzer
	 * @function
	 */
	FieldSelectorModelConverter.prototype.getMetaDataAnalyzer = function() {

		return this._oMetadataAnalyzer;
	};
	
	/**
	 * Returns the converted inner model for the FieldSelector control
	 * 
	 * @param {string/array} vEntityType - entity type
	 * @param {Array} aIgnoredFields - List of fields which should be ignored.
	 * @returns {object} Internal json map
	 * @public
	 * @name FieldSelectorModelConverter#getConvertedModel
	 * @function
	 */
	FieldSelectorModelConverter.prototype.getConvertedModel = function(vEntityType, aIgnoredFields) {

		var oConvertedData = {};
		this._aEntityTypes = this._getEntityTypes(vEntityType);
		for (var e = 0; e < this._aEntityTypes.length; e++) {
			var aFields = this._oMetadataAnalyzer.getFieldsByEntityTypeName(this._aEntityTypes[e].key);
			if (aFields) {
				oConvertedData[this._aEntityTypes[e].key] = this._updateAndFilterFields(aFields, aIgnoredFields);
			}
		}
	
		return oConvertedData;
	};
	
	/**
	 * Returns the entity type name and labels as an array of map
	 * 
	 * @returns {array} - object of label and EntityType name
	 * @private
	 * @name FieldSelectorModelConverter#getEntitySets
	 * @function
	 */
	FieldSelectorModelConverter.prototype.getEntityTypes = function() {

		return this._aEntityTypes;
	};
	
	/**
	 * @param {array} aFields - fields array
	 * @param {Array} aIgnoredFields - List of fields which should be ignored.
	 * @returns {array} - object of fields which are visible
	 * @private
	 * @name FieldSelectorModelConverter#_updateAndFilterFields
	 * @function
	 */
	FieldSelectorModelConverter.prototype._updateAndFilterFields = function(aFields, aIgnoredFields) {

		var aValidFields = [];
		for (var f = 0; f < aFields.length; f++) {
			var oCurrentField = aFields[f];
			if (oCurrentField.visible === false) {
				continue;
			}
			// TODO: check if the label is overridden in an annotation
	
			// only add fields which are not in ignored list
			var bIsFieldOnIgnoreList = this._isFieldOnIgnoreList(oCurrentField, aIgnoredFields);
			var bIsFieldBlacklisted = this._isFieldBlacklisted(oCurrentField);
			if (!bIsFieldOnIgnoreList && !bIsFieldBlacklisted) {
				aValidFields.push(oCurrentField);
			//} else {
			//	console.log("Property:" + oCurrentField.name + " - " + oCurrentField.type);
			}
		}
		return aValidFields;
	};
	
	/**
	 * Check if a odata property is on the list of ignored fields
	 * 
	 * @param {Object} oCurrentField Current property on entityset
	 * @param {Array} aIgnoredFields List of ignored fields
	 * @returns {Boolean} Returns true if field was found on ignore list else false
	 */
	FieldSelectorModelConverter.prototype._isFieldOnIgnoreList = function(oCurrentField, aIgnoredFields) {
		if (aIgnoredFields) {
			var numberOfEntitySets = this._aEntityTypes.length;
			var sQualifiedName = oCurrentField.entityName + "." + oCurrentField.name;
			// If number of entity sets is only one, then full qualified name or shortname is possible
			if (numberOfEntitySets === 1) {
				if (aIgnoredFields.indexOf(oCurrentField.name) !== -1 || aIgnoredFields.indexOf(sQualifiedName) !== -1) {
					return true;
				}
			// else only full qualified name is valid
			} else if (aIgnoredFields.indexOf(sQualifiedName) !== -1) {
					return true;
			}
		}
		return false;
	};
	
	/**
	 * Check if odata property matches specific checks which identify the field as non-listable
	 * 
	 * @param {object} oCurrentField Current property of entity set
	 * @returns {Boolean} Returns true if field is blacklisted and false if field can be added to list.
	 */
	FieldSelectorModelConverter.prototype._isFieldBlacklisted = function(oCurrentField) {
		if (oCurrentField) {
			if (oCurrentField.name.toLowerCase().indexOf("uxfc") === 0) {
				return true;
			} else if (oCurrentField.type.toLowerCase() === "edm.time") {
				return true;
			}
		}
		return false;
	};
	
	/**
	 * @param {string/array} vEntityTypes - entity types
	 * @param {string} sAnnotation - annotation
	 * @returns {array} - object of label and EntityType name of the entitySet
	 * @private
	 * @name FieldSelectorModelConverter#_getEntitySets
	 * @function
	 */
	FieldSelectorModelConverter.prototype._getEntityTypes = function(vEntityTypes, sAnnotation) {

		var aEntityTypes = [];
		var sLabel;
		var aEntityTypeNames;
	
		if (!this._oMetadataAnalyzer || !this._oMetadataAnalyzer._oSchemaDefinition) {
			return [];
		}
	
		var aAllEntityTypList = this._oMetadataAnalyzer._oSchemaDefinition.entityType;
		// TODO:
		// if (sAnnotation) {
		// aEntityTypeNames = this._oMetadataAnalyzer.getEntityTypeNameByAnnotation(sAnnotation);
		// }
		if (!vEntityTypes) {
			aEntityTypeNames = [];
			for (var t = 0; t < aAllEntityTypList.length; t++) {
				aEntityTypeNames.push(aAllEntityTypList[t].name);
			}
		}
		if (!aEntityTypeNames) {
			aEntityTypeNames = this._convertEntityTypesToArray(vEntityTypes);
		}
	
		for (var e = 0; e < aEntityTypeNames.length; e++) {
			sLabel = this._oMetadataAnalyzer.getEntityLabelByEntityTypeName(aEntityTypeNames[e]);
			aEntityTypes.push({
				key: aEntityTypeNames[e],
				label: sLabel || aEntityTypeNames[e]
			});
		}
	
		return aEntityTypes;
	};
	
	/**
	 * @param {string/array} vEntityTypes - entity types
	 * @returns {array} - entity types
	 * @private
	 * @name sap.ui.comp.odata.FieldSelector#_convertEntityTypesToArray
	 * @function
	 */
	FieldSelectorModelConverter.prototype._convertEntityTypesToArray = function(vEntityTypes) {

		if (typeof (vEntityTypes) === "string") {
			var sRawString = vEntityTypes.replace(/ /g, '');
			return sRawString.split(',');
		}
	
		if (jQuery.isArray(vEntityTypes)) {
			return vEntityTypes;
		}
	
		return undefined;
	};
	
	/**
	 * Destroys the inner references
	 * 
	 * @public
	 * @name sap.ui.comp.odata.FieldSelector#destroy
	 * @function
	 */
	FieldSelectorModelConverter.prototype.destroy = function() {

		if (this._oMetadataAnalyzer && this._oMetadataAnalyzer.destroy) {
			this._oMetadataAnalyzer.destroy();
		}
		this._oMetadataAnalyzer = null;
		this._aEntityTypes = null;
	};
	

	return FieldSelectorModelConverter;

}, /* bExport= */ true);
