/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global", "./FieldSelectorModelConverter"],
	function(jQuery, ModelConverter) {
	"use strict";


	/**
	 * Constructs a utility class to analyse the OData metadata document ($metadata), to resolve SAP-Annotations
	 * 
	 * @constructor
	 * @public
	 * @author Niels Hebling
	 */
	var FieldSelectorController = function() {
		this._oModelConverter = null;
		this._oFields = {};
	};
	
	/**
	 * Initialize the controller by providing a reference to the OData model and optionally a special entity set and/or a list of fields which should be ignored.
	 * @param {sap.ui.model.odata.ODataModel} oODataModel - OData model
	 * @param {string} sEntityTypes Entity type name(s) separated by comma-character or array 
	 * @param {Array} [aIgnoredFields] List of fields which should be ignored.
	 */
	FieldSelectorController.prototype.init = function(oODataModel, sEntityTypes, aIgnoredFields){
		
		if (!oODataModel) {
			jQuery.sap.log.error("oModel has to be set otherwise nothing will be displayed");
		}
		if (!sEntityTypes) {
			jQuery.sap.log.error("sEntityTypes has to be set otherwise nothing will be displayed");
		}
		
		this._oModelConverter = new ModelConverter(oODataModel);
		var oConvertedModel = this._oModelConverter.getConvertedModel(sEntityTypes, aIgnoredFields);
		this._sortFields(oConvertedModel);
	};
	
	/**
	 * Sort all fields form the converted model into a map of fields arranged by entity sets.
	 * @param {Object} oConvertedModel Model of the OData service converted into a simple list.
	 */
	FieldSelectorController.prototype._sortFields = function(oConvertedModel){
		var that = this;
		jQuery.each(oConvertedModel, function(key, value) {
			that._oFields[key] = value.sort(function(a, b) {
				if (a.fieldLabel > b.fieldLabel) {
					return 1;
				}
				if (a.fieldLabel < b.fieldLabel) {
					return -1;
				}
				// a must be equal to b
				return 0;
			});
		});
	};
	
	/**
	 * Get all fields of the service sorted by entity set. The fields itself are sorted by the alphabet.
	 * @returns {Object} Returns all fields of the service ordered by entity set
	 * @example {
	 * 				"entitySet_1":{
	 * 					"Field_D",
	 * 					"Field_E"
	 * 				},
	 * 				"entitySet_2":{
	 * 					"Field_A",
	 * 					"Field_B"
	 * 				}
	 * 			}
	 */
	FieldSelectorController.prototype.getFields = function(){
		return this._oFields;
	};
	
	/**
	 * Get all entity types of the OData service
	 * @returns {Array} Returns the list of entity types of the OData service 
	 */
	FieldSelectorController.prototype.getEntityTypes = function(){
		return this._oModelConverter.getEntityTypes();
	};
	
	/**
	 * Get the metadata analyzer
	 * @returns {Object} Returns a reference to the metadata analyzer of the current service
	 */
	FieldSelectorController.prototype.getMetaDataAnalyzer = function(){
		return this._oModelConverter.getMetaDataAnalyzer();
	};
	
	/**
	 * Get maximum number of rows in all entitysets returned in the table data.
	 * @returns {Number} Returns the maximum number of rows available in the largest EntitySet.
	 */
	FieldSelectorController.prototype.getMaxEntitySetSize = function(){
		var maxCount = 0;
		if (this._oFields){
			jQuery.each(this._oFields, function(key, value){
				if (value && value.length){
					if (value.length > maxCount){
						maxCount = value.length;
					}
				}
			});		
		}
		return maxCount;	
	};
	
	/**
	 * Destroy the current instance
	 */
	FieldSelectorController.prototype.destroy = function(){
		if (this._oModelConverter){			
			this._oModelConverter.destroy();
		}
		this._oModelConverter = null;
		this._oFields = null;
		
	};
	
	return FieldSelectorController;
}, /* bExport= */ true);