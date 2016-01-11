/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.collaboration.components.socialtimeline.datahandlers.SMIntegrationDataHandler");
jQuery.sap.require("sap.collaboration.components.utils.OdataUtil");

sap.ui.base.Object.extend("sap.collaboration.components.socialtimeline.datahandlers.SMIntegrationDataHandler",{
	/**
	 * Constructor for the Social Media Integration Data handler
	 * This class is now responsible to provide the mapping of the business object to be used by Jam
	 * 
	 * @class SMIntegrationDataHandler
	 * @name sap.collaboration.components.socialtimeline.datahandlers.SMIntegrationDataHandler
	 *
	 * @constructor
	 * @param {object} oSMIntegrationModel - Social Media Integration OData model
	 */
	constructor: function(oSMIntegrationModel) {	
		this._oLogger = jQuery.sap.log.getLogger("sap.collaboration.components.socialtimeline.datahandlers.SMIntegrationDataHandler");
		
		this._oSMIntegrationModel = oSMIntegrationModel;
		
		this._oOdataUtil = new sap.collaboration.components.utils.OdataUtil();
		
		this._oExternalBOMappingBuffer = {};	// Buffer for external bo mappings
		
		this.oJamConfigurationStatusMap = {
			configurationOk: 0,
			configuartionError: 1
		};
	},
	/**
	 * Map the internal object to external object using the SMI OData service
	 * The mappings for these BOs are buffered to avoid making another call to the service
	 * 
	 * @param {object} oInternalBO - internal identifier of a business object
	 * 			{string} appContext - application context
	 * 			{string} collection - entity collection
	 * 			{string} key - business object key
	 * 			{string} odataServicePath - path for the business object's OData service
	 * @returns {object} Promise object
	 */
	mapInternalBOToExternalBO: function(oInternalBO){
		var sBufferKey = oInternalBO.appContext + oInternalBO.collection + oInternalBO.key + oInternalBO.odataServicePath; 
		var self = this;
		
		var oPromise;
		
		// if not found, get external object mapping
		if(!this._oExternalBOMappingBuffer[sBufferKey]){
			oPromise = 
				this.getExternalObjectMapping(oInternalBO).promise
				.then(function(oData, response){
					self._oLogger.info("External business object mapping was found.");
					self._oExternalBOMappingBuffer[sBufferKey] = oData.MapInternalBOToExternalBO; // add oExternalBOMapping to buffer
					return self._oExternalBOMappingBuffer[sBufferKey];
				});
		}
		else{
			oPromise = new jQuery.Deferred();
			oPromise.resolve(this._oExternalBOMappingBuffer[sBufferKey]);
		}
		return oPromise;
	},
	
	/**
	 * Get Jam Configuration Status
	 * @param {sap.ui.model.odata.ODataModel} oOdataModel The OData model object
	 */
	getJamConfigurationStatus : function(fCallerSuccess, fCallerError){
		var sOdataEndPoint = "/GetJamConfigurationStatus";
		var self = this;
	   	var mParameters = {
				async: false,
				success: function(oData,response){
					if (oData.GetJamConfigurationStatus.StatusCode === self.oJamConfigurationStatusMap.configurationOk){
						fCallerSuccess(true);
					}
					else{
						fCallerSuccess(false);
					}
			   	}, 
				error: function(oError){
					self._oLogger.error(JSON.stringify(oError));
			   		fCallerError();
			   	}
		};
	   	this._oSMIntegrationModel.read(sOdataEndPoint, mParameters);
	},
	
	
	/**
	 * Get the Mapping for the External Object
	 * @param {object} oInternalBO - internal identifier of a business object
	 * 			{string} appContext - application context
	 * 			{string} collection - entity collection
	 * 			{string} key - business object key
	 * 			{string} odataServicePath - path for the business object's OData service
	 * @returns {object} object containing the object to abort the request and promise
	 */
	getExternalObjectMapping: function(oInternalBO){
		var self = this;
		var sEndpoint = "/MapInternalBOToExternalBO";
		var oPromise = new jQuery.Deferred();
		
		//Passing the URL parameters in a map so the encoding is done in SAPUI5 ODataModel class 
		var aUrlParameters = {};
		aUrlParameters["ApplicationContext"] = "'" + oInternalBO.appContext + "'";
		aUrlParameters["ODataCollection"] = "'" + oInternalBO.collection + "'";
		aUrlParameters["ODataKeyPredicate"] = "'" + oInternalBO.key + "'";
		aUrlParameters["ODataServicePath"] = "'" + oInternalBO.odataServicePath + "'";
		
		var fSuccess = function(oData, response){
			self._oLogger.info("External object mapping found");
			oPromise.resolve(oData, response);
		};
		var fError = function(oError){
			self._oLogger.error(oError.response.statusText);
			oPromise.reject(oError);
		};

		var mParameters = {
				context: null,
				urlParameters: aUrlParameters,
				async: true,
				filters: [],
				sorters: [],
				success: fSuccess, 
				error: 	fError
		};
		
	   	return { 
	   		request: this._oSMIntegrationModel.read(sEndpoint,mParameters),
	   		promise: oPromise
	   	};
	}
});
