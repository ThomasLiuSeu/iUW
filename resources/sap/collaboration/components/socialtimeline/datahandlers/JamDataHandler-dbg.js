/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.collaboration.components.socialtimeline.datahandlers.JamDataHandler");
jQuery.sap.require("sap.collaboration.components.utils.OdataUtil");

sap.ui.base.Object.extend("sap.collaboration.components.socialtimeline.datahandlers.JamDataHandler",{
	/**
	 * Constructor for the Jam Data handler
	 * This class is responsible for getting and posting requests to Jam
	 * 
	 * @class JamDataHandler
	 * @name sap.collaboration.components.socialtimeline.datahandlers.JamDataHandler
	 *
	 * @constructor
	 * @param oCollabModel Collaboration Host OData Service Model (Jam)
	 */
	constructor: function(oCollabModel) {	
		this._oLogger = jQuery.sap.log.getLogger("sap.collaboration.components.socialtimeline.datahandlers.JamDataHandler");
		this._oOdataUtil = new sap.collaboration.components.utils.OdataUtil();
		
		this._oCollabModel = oCollabModel;
		
		this._oExternalBObuffer = {}; // buffer for external object from Jam
	},
	/**
	 * Add a post to an external object in Jam. 
	 * 1 - Find the external object in Jam 
	 * 2 - Post the feed entry to the object.
	 * 
	 * @param {string} sContent - Feed content to be posted
	 * @param {object} oExternalObjectMapping - Set of URLs used by Jam to create an external object.
	 * 			{string} oExternalObjectMapping.Exid - OData URL of the business object being shared. This URL is URL for the OData service that exposes the business object that is in the SAP system.
	 * 			{string} oExternalObjectMapping.ODataLink - Same as Exid.
	 * 			{string} oExternalObjectMapping.ObjectType - OData service's metadata URL appended with a hash (#) symbol and the business object's entity set. 
	 * 			{string} oExternalObjectMapping.ODataMetadata - Same as ObjectType.
	 * 			{string} oExternalObjectMapping.ODataAnnotations - Annotations URL. Specifies to Jam what to display of the business object.
	 * @returns {jQuery.Deferred} Promise object
	 */
	addPostToExternalObject: function(sContent, oExternalObjectMapping){
		var self = this;
		
		var addingPost = 
		this.getExternalObject(oExternalObjectMapping)	// get external object
		.then(function(oExternalObject){		
			return self.postFeedEntryToObject(sContent, oExternalObject);	// post feed entry to object
		}).then(function(oPostingFeedEntry){												
			return oPostingFeedEntry.promise;	// get the promise returned			
		}).then(function(oData, response){
			return oData.results;	// return activity object
		}).fail(function(oError){
			return oError;
		});
		
		return addingPost;
	},
	/**
	 * Gets the external object from Jam (with buffer)
	 * 1 - Find the external object by Exid and Object Type
	 * 2 - If the external object is not found, create the external object in Jam 
	 * 
	 * @param {object} oExternalObjectMapping - Set of URLs used by Jam to create an external object.
	 * 			{string} oExternalObjectMapping.Exid - OData URL of the business object being shared. This URL is URL for the OData service that exposes the business object that is in the SAP system.
	 * 			{string} oExternalObjectMapping.ODataLink - Same as Exid.
	 * 			{string} oExternalObjectMapping.ObjectType - OData service's metadata URL appended with a hash (#) symbol and the business object's entity set. 
	 * 			{string} oExternalObjectMapping.ODataMetadata - Same as ObjectType.
	 * 			{string} oExternalObjectMapping.ODataAnnotations - Annotations URL. Specifies to Jam what to display of the business object.
	 * @returns {jQuery.Deferred} Promise object
	 */
	getExternalObject: function(oExternalObjectMapping){
		var self = this;
		var sBufferKey = oExternalObjectMapping.ObjectType + oExternalObjectMapping.Exid;
		var oPromise = new jQuery.Deferred();
		
		if(!this._oExternalBObuffer[sBufferKey]){													// if external object is not in buffer
			var gettingExternalObject = 
				this.getExternalObjectByExidAndObjectType(oExternalObjectMapping.Exid, oExternalObjectMapping.ObjectType); // get external object from jam

			gettingExternalObject.promise.done(function(oData, response){
				var oExternalObject = oData.results;
				self._oExternalBObuffer[sBufferKey] = oExternalObject; 								// save to buffer
				oPromise.resolve(oExternalObject);
			});
			gettingExternalObject.promise.fail(function(oError){
				if(oError.response.statusCode == 404){												// if external object not found, create the external object, else call error handling
					var creatingExternalObject = self.postExternalObject(oExternalObjectMapping); 	// create external object in Jam
					creatingExternalObject.promise.done(function(oData, response){
						var oExternalObject = oData.results;
						self._oExternalBObuffer[sBufferKey] = oExternalObject; 						// save to buffer
						oPromise.resolve(oExternalObject);
					});
					creatingExternalObject.promise.fail(function(oError){
						oPromise.reject(oError);
					});
				} 
				else{
					oPromise.reject(oError);
				}
			});
		}
		else{
			oPromise.resolve(this._oExternalBObuffer[sBufferKey]);
		}
		return oPromise;
	},
	
	/**********************************************************************
	 * GET request functions
	 **********************************************************************/
	
	/**
	 * Performs a GET request to get an external object from Jam by exid and object type
	 * 
	 * @param {string} sExid - OData URL of the business object being shared. This URL is URL for the OData service that exposes the business object that is in the SAP system.
	 * @param {string} sObjectType - OData service's metadata URL appended with a hash (#) symbol and the business object's entity set. 
	 * @returns {object} object containing the object to abort the request and promise
	 */
	getExternalObjectByExidAndObjectType: function(sExid, sObjectType){
		var self = this;
		var sEndpoint = "/ExternalObjects_FindByExidAndObjectType";
		
		var oPromise = new jQuery.Deferred();
		var getExternalObjectSuccess = function(oData, response){
			self._oLogger.info("External object found: " + oData.results.Name);
			oPromise.resolve(oData, response);
		};
		var getExternalObjectError = function(oError){
			self._oLogger.error(oError.response.statusText);
			oPromise.reject(oError);
		};
		var mParameters = {
				context: null,
				urlParameters: { "Exid":"'"+ sExid.replace(/'/g, "''") +"'", "ObjectType":"'"+ sObjectType.replace(/'/g, "''") +"'"},
				async: true,
				filters: [],
				sorters: [],
				success: getExternalObjectSuccess, 
				error: 	getExternalObjectError
		};
		
		return { 
			request: this._oCollabModel.read(sEndpoint, mParameters),
			promise: oPromise 
		};
	},
	/**
	 * Perform GET request to read the feed entries of an external object
	 * 
	 * @param {object} oExternalObject - external object from Jam
	 * @returns {object} object containing the object to abort the request and promise
	 */
	getFeedEntries: function(oExternalObject, sNextLink){
		var self = this;
		var sEndpoint = ""; 
		if(sNextLink){
			sEndpoint = sNextLink;
		}
		else {
			sEndpoint = "/ExternalObjects" + "('" +  jQuery.sap.encodeURL(oExternalObject.Id) + "')/FeedEntries";
		}
		
		var oPromise = new jQuery.Deferred();		
		var fSuccess = function(oData, response){
			self._oLogger.info("Feed entries were successfully retrieved.");
			oPromise.resolve(oData, response);
		};
		var fError = function(oError){
			self._oLogger.error("Failed to retrieve feed entries: " + oError.response.statusText);
			oPromise.reject(oError);
		};
		var mParameters = {
				context: null,
				urlParameters: {"$expand":"Creator/ThumbnailImage,Creator/MemberProfile"},
				async: true,
				success: fSuccess, 
				error: 	fError
		};
		
		return { 
			request: this._oCollabModel.read(sEndpoint, mParameters),
			promise: oPromise
		};
	},
	/**
	 * Performs a GET request to get the Autocomplete for a specific value in SAP Jam
	 * 
	 * @param {string} sValue - The value entered for the Autocomplete and will be used to search in SAP Jam.
	 * @returns {object} an object which has an abort function to abort the current request
	 */
	getSuggestions: function(sValue){
		var self = this;
		var sEndpoint = "/Members_Autocomplete";
		
		var oPromise = new jQuery.Deferred();
		var fSuccess = function(oData, response){
			oPromise.resolve(oData, response);
		};
		
		var fError = function(oError){
			oPromise.reject(oError);
		};
		
		var mParameters = {
				urlParameters: {"Query" : "'" + sValue + "'"},
				async: true,
				success: fSuccess,
				error: 	fError			
		};
		return { 
			request: this._oCollabModel.read(sEndpoint, mParameters),
			promise: oPromise 
		};
	},
	/**
	 * Performs a GET request to get the Feed Entry from SAP Jam
	 * 
	 * @param {string} sActivityId - Activity Id for the Feed Entry
	 * @returns {object} object containing the object to abort the request and promise
	 * */
	getFeedEntryFromActivity: function(sActivityId){
		var self = this;
		var sEndpoint = "/Activities('" + jQuery.sap.encodeURL(sActivityId) + "')/FeedEntry";
		
		var oPromise = new jQuery.Deferred();
		var fSuccess = function(oData, response){
			oPromise.resolve(oData, response);
		};
		var fError = function(oError){
			self._oLogger.error("Failed to get the feed entry: "+ oError.response.statusText);
			oPromise.reject(oError);
		};
		var mParameters = {
				urlParameters: {
					$expand: "Creator/ThumbnailImage"
				},
				async: true,
				success: fSuccess, 
				error: 	fError
		};
		
		return { 
			request: this._oCollabModel.read(sEndpoint, mParameters),
			promise: oPromise 
		};
	},
	
	/**
	 * Get the Replies for a specific FeedEntry
	 * 
	 * @param {string} sFeedEntryId - Feed entry ID
	 * @returns {object} object containing the object to abort the request and promise
	 */
	getReplies: function(sFeedEntryId){
		var self = this;
		var sEndpoint = "/FeedEntries('" + jQuery.sap.encodeURL(sFeedEntryId) + "')/Replies";
		
		var oPromise = new jQuery.Deferred();		
		var fSuccess = function(oData, response){
			self._oLogger.info("Replies were successfully retrieved.");
			oPromise.resolve(oData, response);
		};
		var fError = function(oError){
			self._oLogger.error("Failed to retrieve replies: " + oError.response.statusText, oError.stack);
			oPromise.reject(oError);
		};

		var oUrlParameters = { 
				'$top': 100, 
				'$orderby': 'CreatedAt desc',
				'$expand': 'Creator,ThumbnailImage'
		};
		
		var mParameters = {
				context: null,
				urlParameters: oUrlParameters,
				async: true,
				success: fSuccess,
				error: 	fError			
		};
		
		return { 
			request: this._oCollabModel.read(sEndpoint, mParameters),
			promise: oPromise
		};
	},
	
	/**
	 * Perform a GET request to get the member's information
	 * 
	 * @param {string} sUserEmail 
	 * @returns {object} object containing the object to abort the request and promise
	 */
	getMemberByAutocomplete: function(sUserEmail){
		var self = this;
		var sEndpoint = "/Members_Autocomplete";
		var mUrlParameters = {	"Query" : "'"+sUserEmail+"'",
								"$expand" : "ThumbnailImage,MemberProfile" };
		
		var oPromise = new jQuery.Deferred();
		var fSuccess = function(oData, response){
			oPromise.resolve(oData, response);
		};
		var fError = function(oError){
			self._oLogger.error("Failed to get member information: "+ oError.response.statusText);
			oPromise.reject(oError);
		};
		var mParameters = {
				urlParameters: mUrlParameters ,
				async: true,
				success: fSuccess, 
				error: 	fError
		};
		
		return { 
			request: this._oCollabModel.read(sEndpoint, mParameters),
			promise: oPromise 
		};
	},
	
	/**
	 * Perform a $batch request to get the info for several members 
	 * 
	 * @param {array} aUserEmails - array of emails
	 * @returns {object} object containing the object to abort the request and promise
	 */
	getUserInfoBatch: function(aUserEmails){
		var self = this;
		
		var aBatchReadOperations = [];
		aUserEmails.forEach(function(sUserEmail){
			var sEndpoint = "/Members_Autocomplete?Query='"+jQuery.sap.encodeURL(sUserEmail)+"'&$expand=ThumbnailImage,MemberProfile";	
			var sMethod = "GET";
			var oData = null;
			var oParameters = null;
			
			aBatchReadOperations.push(self._oCollabModel.createBatchOperation( sEndpoint, sMethod, oData, oParameters));
		});
		
		this._oCollabModel.addBatchReadOperations(aBatchReadOperations);
		
		var bAsync = true;
		var oPromise = new jQuery.Deferred();
		var fSuccess = function(oData, response){
			var aResults = self._oOdataUtil.parseBatchResponse(oData.__batchResponses);
			oPromise.resolve(aResults, response);
		};
		var fError = function(oError){
			self._oLogger.error("Failed to get member information: "+ oError.response.statusText);
			oPromise.reject(oError);
		};
		return {
			request: this._oCollabModel.submitBatch(fSuccess, fError, bAsync),
			promise: oPromise 
		};
	},
	
	getSender: function(){
		var self = this;
		var sEndpoint = "/Self";
		
		var oPromise = new jQuery.Deferred();
		var fSuccess = function(oData, response){
			self._oLogger.info("The reply was successfully posted.");
			oPromise.resolve(oData.results);
		};
		var fError = function(oError){
			self._oLogger.error("Failed to retrieve the sender: " + oError.response.statusText, oError.stack);
			oPromise.reject(oError);
		};
		var mParameters = {
				urlParameters: null,
				async: true,
				success: fSuccess, 
				error: 	fError
		};
		
		return { 
			request: this._oCollabModel.read(sEndpoint, mParameters),
			promise: oPromise 
		};
	},

	/**********************************************************************
	 * POST request functions
	 **********************************************************************/

	/**
	 * Performs a POST request to create an external object in Jam
	 * 
	 * @param {object} oExternalObjectMapping - Set of URLs used by Jam to create an external object.
	 * 			{string} oExternalObjectMapping.Exid - OData URL of the business object being shared. This URL is URL for the OData service that exposes the business object that is in the SAP system.
	 * 			{string} oExternalObjectMapping.ODataLink - Same as Exid.
	 * 			{string} oExternalObjectMapping.ObjectType - OData service's metadata URL appended with a hash (#) symbol and the business object's entity set. 
	 * 			{string} oExternalObjectMapping.ODataMetadata - Same as ObjectType.
	 * 			{string} oExternalObjectMapping.ODataAnnotations - Annotations URL. Specifies to Jam what to display of the business object.
	 * @returns {object} object containing the object to abort the request and promise
	 */
	postExternalObject: function(oExternalObjectMapping){
		var self = this;
		var sEndpoint = "/ExternalObjects";
		var oDataPayload = oExternalObjectMapping;
		
		var oPromise = new jQuery.Deferred();
		var postExternalObjectSuccess = function(oData, response){
			self._oLogger.info("External object created. " + oData.results.Name);
			oPromise.resolve(oData, response);
		};
		var postExternalObjectError = function(oError){
			self._oLogger.error("Failed to create external object: " + oError.response.statusText);
			oPromise.reject(oError);
		};
		var mParameters = {
				context: null,
				urlParameters: null,
				async: true,
				success: postExternalObjectSuccess, 
				error: 	postExternalObjectError
		};
		
		return {
			request: this._oCollabModel.create(sEndpoint, oDataPayload, mParameters),
			promise: oPromise 
		};
	},
	/**
	 * Performs a POST request to create a feed entry to the object feed of an existing external object in Jam
	 * 
	 * @param {string} sContent - Feed content to be posted
	 * @param {object} oExternalObject - external object from Jam
	 * @returns {object} object containing the object to abort the request and promise
	 */
	postFeedEntryToObject: function(sContent, oExternalObject){
		var self = this;
		var sEndpoint = "/Activities";
		var oDataPayload = { "Content": sContent, "Object":  oExternalObject, "Verb": "comment" };
		
		var oPromise = new jQuery.Deferred();
		var fSuccess = function(oData, response){
			oPromise.resolve(oData, response);
		};
		var fError = function(oError){
			self._oLogger.error("Failed to get the activity: "+ oError.response.statusText);
			oPromise.reject(oError);
		};
		var mParameters = {
				context: null,
				urlParameters: null,
				async: true,
				success: fSuccess, 
				error: 	fError
		};
		
		return { 
			request: this._oCollabModel.create(sEndpoint, oDataPayload, mParameters),
			promise: oPromise 
		};
	},
	/**
	 * Post a Reply for a specific FeedEntry
	 * 
	 * @param {string} sFeedEntryId - Feed entry ID
	 * @param {string} sReplyText - Reply text to post 
	 * @returns {object} object containing the object to abort the request and promise
	 */
	postReply: function(sFeedEntryId, sReplyText){
		var self = this;
		var sEndpoint =  "/FeedEntries('" + jQuery.sap.encodeURL(sFeedEntryId) + "')/Replies";
		var oDataPayload = { "Text": sReplyText };

		var oPromise = new jQuery.Deferred();		
		var fSuccess = function(oData, response){
			self._oLogger.info("The reply was successfully posted.");
			oPromise.resolve(oData);
		};
		var fError = function(oError){
			self._oLogger.error("Failed to post reply: " + oError.response.statusText, oError.stack);
			oPromise.reject(oError);
		};
		
		var mParameters = {
				context: null,
				urlParameters: null,
				async: true,
				success: fSuccess, 
				error: 	fError
		};

		return { 
			request: this._oCollabModel.create(sEndpoint, oDataPayload, mParameters),
			promise: oPromise
		};

	}
});
