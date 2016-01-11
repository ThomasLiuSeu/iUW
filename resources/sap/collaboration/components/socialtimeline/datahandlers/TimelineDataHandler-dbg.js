/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.collaboration.components.socialtimeline.datahandlers.TimelineDataHandler");
jQuery.sap.require("sap.collaboration.components.socialtimeline.datahandlers.ServiceDataHandler");
jQuery.sap.require("sap.collaboration.components.socialtimeline.datahandlers.SMIntegrationDataHandler");
jQuery.sap.require("sap.collaboration.components.socialtimeline.annotations.TimelineTermsUtility");


sap.ui.base.Object.extend("sap.collaboration.components.socialtimeline.datahandlers.TimelineDataHandler",{
	/**
	 * Constants for the TimelineDataHandler Class
	 */
	constants: {
		FILTER_JAM_ALL: "filter_jam_all",
		FILTER_BACKEND_ALL: "filter_backend_all"
	},
	/**
	 * Constructor for the Timeline Data Handler
	 * This class is responsible for providing the data for the Timeline control.
	 * 
	 * @class TimelineDataHandler
	 * @name sap.collaboration.components.socialtimeline.datahandlers.TimelineDataHandler
	 * 
	 * @constructor
	 * @param oBusinessObjectMap - JSON object containing the following properties:
	 * 	<ul>
	 * 		<li>{sap.ui.model.odata.ODataModel} serviceModel required - OData model to retrieve timeline entries
	 * 		<li>{string} servicePath: The relative path to the OData service for the business object (example: "/sap/opu/odata/sap/ODATA_SRV")		
	 * 		<li>{string} collection: Entity collection name of the business object
	 * 		<li>{string} applicationContext: The application context (example: "CRM", "SD", etc.)
	 * 		<li>{function} customActionCallback: A callback function to determine which timeline entries should receive the custom action. The function should return an array of text/value objects.
	 * 	<ul>
	 * @param {object} oJamDataHandler - Data Handler for Jam
	 * @param {object} oSMIntegrationModel - Social Media Integration OData service model
	 * @param {integer} iPageSize - The page size to be returned to the timeline
	 */
	constructor: function(oBusinessObjectMap, oJamDataHandler, oSMIntegrationModel, iPageSize, bEnableSocial) {	
		this._oLogger = jQuery.sap.log.getLogger("sap.collaboration.components.socialtimeline.datahandlers.TimelineDataHandler");
		
		this._oBusinessObjectMap = oBusinessObjectMap;
		this._sBusinessObjectKey ="";
		
		this._oBOModel = this._oBusinessObjectMap.serviceModel;
		this._oCollabModel = oJamDataHandler._oCollabModel;
		this._oSMIntegrationModel = oSMIntegrationModel;
		
		this._oJamDataHandler = oJamDataHandler;
		
		this._iPageSize = iPageSize;
		this._iTimelineEntriesPageSize = iPageSize;
		this._iTimelineEntriesSkip = 0;
		this._iFeedEntriesPageSize = iPageSize*2;
		this._sFeedEntriesNextLink = "";
		
		this._fCustomActionCallBack = oBusinessObjectMap.customActionCallback;
		
		this._bEnableSocial = bEnableSocial;
		
		this._oTimelineTermsUtility = new sap.collaboration.components.socialtimeline.annotations.TimelineTermsUtility(this._oBOModel.getServiceMetadata(), this._oBOModel.getServiceAnnotations());
		this._oServiceDataHandler = new sap.collaboration.components.socialtimeline.datahandlers.ServiceDataHandler(this._oBOModel, this._oTimelineTermsUtility);
		this._oSMIntegrationDataHandler = new sap.collaboration.components.socialtimeline.datahandlers.SMIntegrationDataHandler(this._oSMIntegrationModel);		
		
		this._aTimelineEntries = [];
		this._aFeedEntries = [];
		
		this._oMemberDataBuffer = {};
	},
	/**
	 * Set the business object for the timeline data handler and reset the skip token
	 * @param {string} sKey - Business Object Key
	 */
	setBusinessObjectKey: function(sKey){
		this.reset();
		
		this._sBusinessObjectKey = sKey;
		
		// Abort request if there is still one running
		if(this._oTimelineEntriesReadRequest){
			this._oTimelineEntriesReadRequest.abort();
		}
		// Abort request if there is still one running
		if(this._oFeedEntriesReadRequest){
			this._oFeedEntriesReadRequest.abort();
		}
	},
	/**
	 * Returns the data for the Timeline Control one page at a time.
	 * The business object key must be set using setBusinessObjectKey before calling this function.
	 * 
	 * 	1a- Get feed entries from Jam
	 *  1b- Get timeline entries from backend 
	 *  2- Merge entries when both GET requests are done
	 *  
	 * @param {Object} oFilter - Filter object for the backend and Jam
	 * @returns {jQuery.Deferred} Promise to handle success or failure 
	 */
	getTimelineData: function(oFilter){
		var self = this;		
		var oPromise = jQuery.Deferred();
		
		var readyingTimelineEntries = new jQuery.Deferred();
		var readyingFeedEntries = new jQuery.Deferred();
		
		// 1a- Read the feed entries from Jam if bEnabledSocial is true and if the backend filter is not set
		if(this._bEnableSocial === true && !oFilter.backend){
			var gettingFeedEntries = this._getFeedEntries();
			gettingFeedEntries.done(function(aFeedEntries){
				var aTimelineItems = self._mapFeedEntriesToTimelineItems(aFeedEntries);
				readyingFeedEntries.resolve(aTimelineItems);
			});
			gettingFeedEntries.fail(function(oError){
				oPromise.reject(oError);
			});
		}
		else{
			readyingFeedEntries.resolve([]);
		}
		
		// 1b- Read Timeline Entries of Business Object if the jam filter is not set
		if(!oFilter.jam){
			var gettingTimelineEntries = this._getTimelineEntries(oFilter.backend);
			gettingTimelineEntries.done(function(aTimelineEntriesData){
				var aTimelineItems = self._mapTimelineEntriesToTimelineItems(aTimelineEntriesData);
				
				if(self._bEnableSocial === true){
					var fillingPictures = self._fillPicturesForTimelineItems(aTimelineItems);
					fillingPictures.always(function(aTLItems){
						readyingTimelineEntries.resolve(aTLItems);
					});
				}
				else{
					readyingTimelineEntries.resolve(aTimelineItems);
				}
				self._iTimelineEntriesSkip += self._iTimelineEntriesPageSize;
			});
			gettingTimelineEntries.fail(function(oError){
				oPromise.reject(oError);
			});
		}
		else {
			readyingTimelineEntries.resolve([]);
		}
		// 2- Merge feed entries and timeline entries
		jQuery.when(readyingTimelineEntries,readyingFeedEntries).then(
			function(aTimelineEntries, aFeedEntries){
				var aTimelineItems = self._mergeEntries(aTimelineEntries, aFeedEntries);
				oPromise.resolve(aTimelineItems);
			},
			function(oError){
				oPromise.reject(oError);
			});
		
		return oPromise;
	},
	/**
	 * Add top level post.
	 * The business object key must be set using setBusinessObjectKey before calling this function.
	 * 
	 * 1- Get the External BO mapping from SMI service
	 * 2- Post a feed entry to the external object
	 * 
	 * @param sContent
	 * @param oInternalBo
	 * @param {object} oPromise - Promise object to handle success or failure of request
	 */
	addTopLevelPost: function(sContent, oInternalBo){
		var self = this;
		
		return this._oSMIntegrationDataHandler.mapInternalBOToExternalBO(oInternalBo)
		.then(function(oExternalBOMapping){
			return self._oJamDataHandler.addPostToExternalObject(sContent, oExternalBOMapping);
		});
	},
	/**
	 * Resets the timeline data by setting the skip counter to 0, the next link to an empty string, and the timeline/feed entries to an empty array
	 */
	reset: function(){
		this._iTimelineEntriesSkip = 0; // reset skip counter
		this._sFeedEntriesNextLink = ""; // reset next link
		this._aTimelineEntries = []; // empty timeline entries 
		this._aFeedEntries = []; // empty feed entries 
	},
	/**
	 * Get the feed entries for the current object in this._sBusinessObjectKey and this._oBusinessObjectMap
	 * 
	 * 1- Get the external object mapping from the SM Integration service
	 * 2- Get the external object from Jam
	 * 3- Get the feed entries for external object
	 * 
	 * @returns {jQuery.Deferred} Promise to handle success or failure 
	 */
	_getFeedEntries: function(){
		var self = this;
		var oInternalBO = { 
				"appContext": this._oBusinessObjectMap.applicationContext,
				"collection": this._oBusinessObjectMap.collection,
				"key": this._sBusinessObjectKey,
				"odataServicePath": this._oBusinessObjectMap.servicePath 
		};
		
		var oPromise = 
			this._oSMIntegrationDataHandler.mapInternalBOToExternalBO(oInternalBO)
			.then(function(oExternalBOMapping){
				// get the external object
				return self._oJamDataHandler.getExternalObject(oExternalBOMapping);
			})
			.then(function(oExternalBO){
				// if there is no next link in buffer, this means there is no more feed entries to retrieve 
				if(self._sFeedEntriesNextLink == undefined){
					var gettingFeedEntries = new jQuery.Deferred();
					gettingFeedEntries.resolve({"results":[]}, null);
					return {request: null,
							promise: gettingFeedEntries };
				}
				// if the link in buffer is "", then get the first page of feed entries
				else if(self._sFeedEntriesNextLink == ""){
					return self._oJamDataHandler.getFeedEntries(oExternalBO); 
				}
				// if the next link in buffer is defined, then get the next page of feed entries defined by the next link
				else{
					return self._oJamDataHandler.getFeedEntries(oExternalBO, self._sFeedEntriesNextLink); 
				}
			})
			.then(function(oGettingFeedEntries){
				self._oFeedEntriesReadRequest = oGettingFeedEntries.request; // save the request
				return oGettingFeedEntries.promise;
			})
			.then(function(oFeedEntries){
				self._sFeedEntriesNextLink = oFeedEntries.__next; // save the next link
				return oFeedEntries.results;
			});
		return oPromise;
	},
	/**
	 * Map a collection of the Feed Entries into items for the Timeline control
	 * @param {Array} aFeedEntries - Array of feed entries
	 * @returns {Array} - Timeline items
	 */
	_mapFeedEntriesToTimelineItems: function(aFeedEntries){
		var self = this;
		var oTimelineItems = [];
		
		aFeedEntries.forEach(function(oFeedEntry){
			var oTLItem = {};
			oTLItem.timelineItemData = self._mapFeedEntryToTimelineItem(oFeedEntry); 
			oTLItem._feedEntryData = oFeedEntry; // keep original feed entry data
			
			oTimelineItems.push(oTLItem);
		});
		return oTimelineItems;
	},
	/**
	 * Map a single Feed Entry into an item for the Timeline control
	 * @param {object} oFeedEntry - A single feed entry
	 * @returns {object} Timeline item 
	 */
	_mapFeedEntryToTimelineItem: function(oFeedEntry){
		var POST_ICON = "sap-icon://post";
		
		if(!this.getUserInfoFromBuffer(oFeedEntry.Creator.Email)){
			this.addUserInfoToBuffer(oFeedEntry.Creator);
		}
		
		var oTimelineItem = {  
				dateTime: oFeedEntry.CreatedAt,
				userName: oFeedEntry.Creator.FullName,
				userEmail: oFeedEntry.Creator.Email,
				title: oFeedEntry.Action,
				text: oFeedEntry.Text,
				icon: POST_ICON
		};
		oTimelineItem.userPicture = this.getUserPicture(oTimelineItem.userEmail);

		return oTimelineItem;
	},
	/**
	 * Map a collection of the Timeline Entries into items for the Timeline control
	 * @param {Array} aTimelineEntriesData - Array of timeline entries
	 * @returns {Array} - Timeline items
	 */
	_mapTimelineEntriesToTimelineItems: function(aTimelineEntriesData){
		var self = this;
		var oTimelineItems = [];
		
		aTimelineEntriesData.forEach(function(oTimelineEntry){
			var oTLItem = {};
			oTLItem.timelineItemData = self._mapTimelineEntryToTimelineItem(oTimelineEntry); 
			
			// custom actions
			var aCustomActions = undefined;
			if(self._fCustomActionCallBack){
				aCustomActions = self._fCustomActionCallBack(oTimelineEntry);
				// if the customActionCallBack returns something that is not an array, we log it as an error
				if(aCustomActions && !jQuery.isArray(aCustomActions)){
					self._oLogger.error("The property customActionCallback does not return an array.");
				}
				else if(aCustomActions){
					aCustomActions.oDataEntry = oTimelineEntry;
					oTLItem.timelineItemData.customActionData = aCustomActions;
				}
			}
			oTimelineItems.push(oTLItem);
		});
		return oTimelineItems;
	},
	/**
	 * Map a single Timeline Entry into an item for the Timeline control
	 * @param {object} oTimelineEntry - A single timeline entry
	 * @returns {object} Timeline item 
	 */
	_mapTimelineEntryToTimelineItem: function(oTimelineEntry){
		var oTimelineEntryFields = this._oTimelineTermsUtility.getTimelineEntryFields(this._oBusinessObjectMap.collection);
		
		var oTimelineItem = {  
				dateTime: oTimelineEntry[oTimelineEntryFields.TimeStamp],
				userName: oTimelineEntry[oTimelineEntryFields.ActorName],
				userEmail: oTimelineEntry[oTimelineEntryFields.ActorExtID].toLowerCase(),
				title: oTimelineEntry[oTimelineEntryFields.ActionText] ,
				text: oTimelineEntry[oTimelineEntryFields.SummaryText],
				icon: oTimelineEntry[oTimelineEntryFields.Icon],
				timelineEntryDetails: this._processTimelineEntryDetails(oTimelineEntry[oTimelineEntryFields.TimelineDetailNavigationPath].results,
																		this._oBusinessObjectMap.collection)
			};
		oTimelineItem.userPicture = this.getUserPicture(oTimelineItem.userEmail);
		return oTimelineItem;
	},
	/**
	 * Returns the timeline entry details in format for the social timeline
	 * @param {Array} aTimelineEntryDetails - Timeline entry details
	 * @param {String} sEntityCollection - Entity collection name
	 * @returns {Array} Timeline entry details for the social timeline 
	 */
	_processTimelineEntryDetails : function(aTimelineEntryDetails, sEntityCollection){
		var self = this;
		var aTimelineEntryDetailsView = [];
		
		var oTimelineEntryDetailFields = self._oTimelineTermsUtility.getTimelineEntryDetailFields(sEntityCollection);
		
		aTimelineEntryDetails.forEach(function(oTimelineEntryDetail){
			var oDetail = {};
			oDetail.afterValue = oTimelineEntryDetail[oTimelineEntryDetailFields.AfterValue];
			oDetail.beforeValue = oTimelineEntryDetail[oTimelineEntryDetailFields.BeforeValue];
			oDetail.changeType = oTimelineEntryDetail[oTimelineEntryDetailFields.ChangeType];
			oDetail.propertyLabel = oTimelineEntryDetail[oTimelineEntryDetailFields.PropertyLabel];
			
			aTimelineEntryDetailsView.push(oDetail);
		});
			
		return aTimelineEntryDetailsView;
	},
	/**
	 * Merges array of timeline entries and feed entries in chronological order and returns the result
	 * The returned array is of length equal to the global variable iPageSize
	 * @param {array} aTimelineEntries - timeline entries
	 * @param {array} aFeedEntries - feed entries
	 * @returns {array} 
	 */
	_mergeEntries: function(aTimelineEntries, aFeedEntries){
				
		this._aTimelineEntries = this._aTimelineEntries.concat(aTimelineEntries);
		this._aFeedEntries = this._aFeedEntries.concat(aFeedEntries);
		
		var aTimelineItems = [];
		
		// get first entry in each array
		var oTLEntry = this._aTimelineEntries.shift();
		var oFeedEntry = this._aFeedEntries.shift();

		do {
			if(!oTLEntry && !oFeedEntry){
				break; // exit loop because there is no more entries 
			}
			else if(!oTLEntry && oFeedEntry){
				aTimelineItems.push(oFeedEntry);
				oFeedEntry = this._aFeedEntries.shift();
			}
			else if(oTLEntry && !oFeedEntry){
				aTimelineItems.push(oTLEntry);
				oTLEntry = this._aTimelineEntries.shift();
			}
			else{
				if(oTLEntry.timelineItemData.dateTime == oFeedEntry.timelineItemData.dateTime){
					aTimelineItems.push(oFeedEntry);
					oFeedEntry = this._aFeedEntries.shift();
				}
				else if (oTLEntry.timelineItemData.dateTime > oFeedEntry.timelineItemData.dateTime){
					aTimelineItems.push(oTLEntry);
					oTLEntry = this._aTimelineEntries.shift();
					
				}
				else if (oTLEntry.timelineItemData.dateTime < oFeedEntry.timelineItemData.dateTime){
					aTimelineItems.push(oFeedEntry);
					oFeedEntry = this._aFeedEntries.shift();
				}
			}
		} 
		while(aTimelineItems.length < this._iPageSize);
		
		// put back the entry in the buffers
		if(oTLEntry){
			this._aTimelineEntries.unshift(oTLEntry);
		}
		if(oFeedEntry){
			this._aFeedEntries.unshift(oFeedEntry);
		}
		
		return aTimelineItems;
	},
	/**
	 * Fill the empty userPicture property of the Timeline items
	 * 
	 * @param {array} aTimelineItems - timeline items
	 * @returns {object} Promise object 
	 */
	_fillPicturesForTimelineItems: function(aTimelineItems){
		var self = this;
		var oPromise = jQuery.Deferred();
		var aEmails = [];
			
		// Find emails of  timeline items with no picture
		aTimelineItems.forEach(function(oTimelineItem){
			if(!oTimelineItem.timelineItemData.userPicture){
				aEmails.push(oTimelineItem.timelineItemData.userEmail);
			}
		});
		// remove duplicate emails
		var aUniqueEmails = aEmails.filter(function(element,index){
			return aEmails.indexOf(element) == index;
		});
		
		if(aUniqueEmails.length > 0){
			var gettingUserInfoBatch = this._oJamDataHandler.getUserInfoBatch(aUniqueEmails);
			gettingUserInfoBatch.promise.done(function(aUserInfo){
				aUserInfo = jQuery.grep(aUserInfo, function(oUserInfo){
					return oUserInfo.results.length > 0
				});
				// add user info to buffer
				aUserInfo.forEach(function(oUserInfo){
					self.addUserInfoToBuffer(oUserInfo.results[0]);
				});
				// fill the pictures
				aTimelineItems.forEach(function(oTLItem){
					if(!oTLItem.timelineItemData.userPicture){
						oTLItem.timelineItemData.userPicture = self.getUserPicture(oTLItem.timelineItemData.userEmail);
					}
				});
				oPromise.resolve(aTimelineItems);	
			});
			gettingUserInfoBatch.promise.fail(function(oError){
				oPromise.resolve(aTimelineItems);	
			});
		}
		else{
			oPromise.resolve(aTimelineItems);
		}
		return oPromise;
	},
	/**
	 * Get timeline entries from the backend
	 * @param {string} sFilter
	 * @returns {object} oPromise
	 */
	_getTimelineEntries: function(sFilter){
		// if the filter is set to get all of the backend entries, then in fact there shouldn't be a filter set. In the method 
		// this._oServiceDataHandler.readTimelineEntries(...) there is a check for this. If the filter is set to undefined then the 
		// parameter $filter is omitted when making the request in method this._oServiceDataHandler.readTimelineEntries(...).
		if(sFilter === this.constants.FILTER_BACKEND_ALL){ 
			sFilter = undefined;
		}
		var readTimelineEntriesPromise = this._oServiceDataHandler.readTimelineEntries( 
				this._oBusinessObjectMap.collection, this._sBusinessObjectKey, sFilter, this._iTimelineEntriesSkip, this._iTimelineEntriesPageSize);
		
		this._oTimelineEntriesReadRequest = readTimelineEntriesPromise.request;
		
		return readTimelineEntriesPromise.promise;
	},
	
	/************************************************************************************************
	 * Member Information Buffer
	 ************************************************************************************************/
	/**
	 * get the user picture
	 * @param {string} sUserEmail
	 * @returns {string} image url
	 */
	getUserPicture: function(sUserEmail){
		var oMember = this.getUserInfoFromBuffer(sUserEmail);
		if(!oMember){
			return "";
		}
		return oMember.picture;
	}, 
	/**
	 * Builds the image url 
	 * @param {string} sId - image id
	 * @param {string} sImageType - image type
	 * @returns {string} image url
	 */
	buildImageUrl: function(sId,sImageType){
		return this._oCollabModel.sServiceUrl + "/ThumbnailImages" + "(Id='" + jQuery.sap.encodeURL(sId) + "',ThumbnailImageType='" 
		+  jQuery.sap.encodeURL(sImageType) + "')/$value";
	},
	/**
	 * Adds member information to the buffer
	 * @param {object} oMember - member entity
	 */
	addUserInfoToBuffer: function(oMember){
		var userPicture = this.buildImageUrl(oMember.ThumbnailImage.Id, oMember.ThumbnailImage.ThumbnailImageType);
		var sUserEmailLC = oMember.Email.toLowerCase();
		this._oMemberDataBuffer[sUserEmailLC] = {
				"email":sUserEmailLC,
				"fullname":oMember.FullName,
				"id":oMember.Id,
				"address":oMember.MemberProfile.Address,
				"title":oMember.Title,
				"role":oMember.Role,
				"picture": userPicture
		};
	},
	/**
	 * Return the user information
	 * @param {string} sUserEmail
	 * @returns {object} user information
	 */
	getUserInfoFromBuffer: function(sUserEmail){
		var sUserEmailLC = sUserEmail.toLowerCase();
		return this._oMemberDataBuffer[sUserEmailLC];
	},
	
	/**
	 * Get Jam connectivity configuration status
	 * @returns {string} Configuration Status
	 */
	getJamConfigurationStatus : function(fCallerSuccess, fCallerError){
		var fnSuccess = function(bConfigurationStatus) {
			fCallerSuccess(bConfigurationStatus);
		};
		var fnError = function(sError) {
			fCallerError(sError);
		};
		
		this._oSMIntegrationDataHandler.getJamConfigurationStatus(this._oSMIntegrationModel, fnSuccess, fnError);
		 
	}
});
