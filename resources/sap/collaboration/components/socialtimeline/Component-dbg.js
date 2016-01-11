/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP AG. All rights reserved
 */

jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.suite.ui.commons.Timeline");
jQuery.sap.require("sap.suite.ui.commons.TimelineItem");

jQuery.sap.require("sap.collaboration.components.socialtimeline.controls.TimelineEntryControl");
jQuery.sap.require("sap.collaboration.components.socialtimeline.datahandlers.TimelineDataHandler");
jQuery.sap.require("sap.collaboration.components.socialtimeline.datahandlers.SMIntegrationDataHandler");
jQuery.sap.require("sap.collaboration.components.socialtimeline.datahandlers.JamDataHandler");

jQuery.sap.require("sap.collaboration.components.utils.CommonUtil");

jQuery.sap.declare("sap.collaboration.components.socialtimeline.Component");
/**
* Constructor for the Social Timeline Component.
*
* Accepts an object literal <code>mSettings</code> that defines initial 
* property values, aggregated and associated objects as well as event handlers. 
* 
* If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
* then the framework assumes property, aggregation, association, event in that order. 
* To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
* or "event:" can be added to the name of the setting (such a prefixed name must be
* enclosed in single or double quotes).
*
* The supported settings are:
* <ul>
* 	<li>Properties
* 		<ul>
* 			<li>{@link #getEnableSocial enableSocial} : boolean (default: false) </li>
* 			<li>{@link #getAlignment alignment} : sap.suite.ui.commons.TimelineAlignment (default: sap.suite.ui.commons.TimelineAlignment.Right)</li>
* 			<li>{@link #getAxisOrientation axisOrientation} : sap.suite.ui.commons.TimelineAxisOrientation (default: sap.suite.ui.commons.TimelineAxisOrientation.Vertical)</li>
* 			<li>{@link #getNoDataText noDataText} : string</li>
* 			<li>{@link #getShowIcons showIcons} : boolean (default: true)</li>
* 			<li>{@link #getVisible visible} : boolean (default: true)</li>
* 			<li>{@link #getWidth width} : sap.ui.core.CSSSize (default: '100%')</li>
* 			<li>{@link #getCustomFilter customFilter} : {object}
* 		</ul>
* 	</li>
* 	<li>Events
* 		<ul>
* 			<li>{@link ssap.collaboration.components.socialtimeline.Component:customActionPress customActionPress} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
* 		</ul>
* 	</li>
* </ul> 

* 
* @param {string} [sId] id for the new control, generated automatically if no id is given 
* @param {object} [mSettings] initial settings for the new control
* 
* @class 
* Social Timeline
* @extends sap.ui.core.UIComponent
* @version 1.27.0-SNAPSHOT
* 
* @constructor
* @public
* @name sap.collaboration.components.socialtimeline.Component
* @experimental The API is not stable and the UI is not finalized. The implementation for this feature is subject to change.
* 
*/
sap.ui.core.UIComponent.extend("sap.collaboration.components.socialtimeline.Component",
	/** @lends sap.collaboration.components.socialtimeline.Component */
	{
		metadata: {
			version: "1.0",
			dependencies:{
				libs: [],
				components: [],
				ui5version: ""
			},
			config: {},
			customizing: {},
			rootView: null,
			publicMethods: ["setBusinessObjectKey", "setBusinessObjectMap", "updateTimelineEntry", "deleteTimelineEntry"],
			aggregations: {
			},
			properties: {
				"enableSocial": {type:"boolean",group:"Misc",defaultValue:true},				
				"alignment": {type:"sap.suite.ui.commons.TimelineAlignment",group:"Misc",defaultValue:sap.suite.ui.commons.TimelineAlignment.Right},
				"axisOrientation": {type:"sap.suite.ui.commons.TimelineAxisOrientation",group:"Misc",defaultValue:sap.suite.ui.commons.TimelineAxisOrientation.Vertical},
				"noDataText": {type:"string",group:"Misc",defaultValue:null},
				"showIcons": {type:"boolean",group:"Misc",defaultValue:true},
				"visible": {type:"boolean",group:"Appearance",defaultValue:true},
				"width": {type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},
				"customFilter": {type:"object", group:"Misc"}
			},
			events : {
				"customActionPress": {}
			}
		},
		_defaultAttributes: {
			collaborationHostServiceUrl: "/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData",
			smiServiceUrl: "/sap/opu/odata/sap/SM_INTEGRATION_V2_SRV",
			pageSize: 10
		},

		/**
		* Initializes the Component instance after creation. 
		* @protected
		*/
		init: function(){
			this._oLogger = jQuery.sap.log.getLogger("sap.collaboration.components.socialtimeline.Component");
			
			// OData service models
			this._oCollabHostModel;
			this._oSMIntegrationModel;
			
			// Timeline
			this._oTimeline;
			this._oTimelineModelData = {
					timelineData : [],
					filterData : [],
					suggestions: []
			};
			this._oTimelineModel = new sap.ui.model.json.JSONModel(this._oTimelineModelData);
			this._iGrowingThreshold = this._defaultAttributes.pageSize; 
			this._oFilter = {"backend": undefined, "jam": undefined};
			
			// Business object
			this._oBusinessObjectMap = {};
			this._sBusinessObjectKey = undefined;

			// Utilities
			this._oCommonUtil = new sap.collaboration.components.utils.CommonUtil(); // display error, language bundle, date format
			
			// Language Bundle
			this._oLanguageBundle = this._oCommonUtil.getLanguageBundle();

			this._oTimelineDataHandler;
			this._oJamDataHandler;
			
			// Social Profile
			this._oSocialProfile;
			
			// User that is currently logged in
			this._oTimelineUser = {};
			
			// class variable to store the value of the component's property enableSocial set by the developer
			// this class variable will dictate if the social features for the social timeline component should be visible or hidden 
			// this class variable will be overwritten by the component logic in case of Jam configuration issue 
			this._bEnableSocial;
			
			this._initialize(); // initialize Utilities and Handlers
			
			sap.ui.core.UIComponent.prototype.init.apply(this); // call superclass; needed to call createContent
		},
		/**
		* Cleans up the component instance before destruction.
		* @protected
		*/
		exit: function() {
		},
		/**
		* Function is called when the rendering of the Component Container is started.
		* @protected
		*/
		onBeforeRendering: function(){			
			this._oLogger.info("Creating Timeline Control with parameters");
			this._oLogger.info("enableSocial: " + this.getEnableSocial());
			this._oLogger.info("alignment: " + this.getAlignment());
			this._oLogger.info("axisOrientation: " + this.getAxisOrientation());
			this._oLogger.info("noDataText: " + this.getNoDataText());
			this._oLogger.info("showIcons: " + this.getShowIcons());
			this._oLogger.info("visible: " + this.getVisible());
			this._oLogger.info("width: " + this.getWidth());
			
			this._validateInputParameters();
			
			if(this._bEnableSocial === undefined){
				this._setEnableSocial();
			}
			
			this._oTimeline.setEnableSocial(this._bEnableSocial);				
			this._oTimeline.setAlignment(this.getAlignment());
			this._oTimeline.setAxisOrientation(this.getAxisOrientation());
			this._oTimeline.setEnableBackendFilter(true);
			this._oTimeline.setEnableScroll(false);
			this._oTimeline.setForceGrowing(true);
			this._oTimeline.setGrowingThreshold(this._iGrowingThreshold);
			this._oTimeline.setNoDataText(this.getNoDataText());
			this._oTimeline.setShowIcons(this.getShowIcons());
			this._oTimeline.setVisible(this.getVisible());
			this._oTimeline.setWidth(this.getWidth());
			this._oTimeline.setShowHeaderBar(false);
			
			this._getLoggedInUser();
			this._setTimelineModel();
			this._buildFilter();
		},
		
		/**
		* Function is called when the rendering of the Component Container is completed. 
		* @protected
		*/
		onAfterRendering: function(){
		},
		/**
		 * The method to create the Content (UI Control Tree) of the Component. 
		 * @protected
		 */
		createContent: function(){
			return this._createTimeline();
		},
		/**************************************************************************************
		 * PUBLIC METHODS for the Component
		 **************************************************************************************/
		/**
		 * Set the business object map. It is used to initialize the data needed to retrieve the timeline entries.
		 * This function must be called once before calling setBusinessObjectKey for the first time.
		 * @public
		 * @param {object] businessObjectMap required - JSON object containing the following properties:
		 * 	<ul>
		 * 		<li>{sap.ui.model.odata.ODataModel} serviceModel required - OData model to retrieve timeline entries
		 * 		<li>{string} servicePath: The relative path to the OData service for the business object (example: "/sap/opu/odata/sap/ODATA_SRV")		
		 * 		<li>{string} collection: Entity collection name of the business object
		 * 		<li>{string} applicationContext: The application context (example: "CRM", "SD", etc.)
		 * 		<li>{function} customActionCallback: A callback function to determine which timeline entries should receive the custom action. The function should return an array of text/value objects.
		 * 	<ul>
		 */
		setBusinessObjectMap: function(oBusinessObjectMap){
			this._oLogger.info("servicePath: " + oBusinessObjectMap.servicePath);
			this._oLogger.info("collection: " + oBusinessObjectMap.collection);
			this._oLogger.info("applicationContext: " + oBusinessObjectMap.applicationContext);
			
			if(this._bEnableSocial === undefined){
				this._setEnableSocial();
			}
			
			// recreate timeline terms utility with new object map
			this._oBusinessObjectMap = oBusinessObjectMap;
			
			// check if the customActionCallback passed to this method is a function, if not, then we destroy the Component and log it as an error
			if(this._oBusinessObjectMap.customActionCallback && typeof(this._oBusinessObjectMap.customActionCallback) !== 'function'){
				this._oLogger.error("The property customActionCallback is not a function.");
				this.destroy();
			}
			this._oTimelineDataHandler = new sap.collaboration.components.socialtimeline.datahandlers.TimelineDataHandler(
					this._oBusinessObjectMap, 
					this._oJamDataHandler,
					this._oSMIntegrationModel,
					this._iGrowingThreshold,
					this._bEnableSocial);
		},
		/**
		 * Set the current business object for the social timeline to display.
		 * Note: The function setBusinessObjectMap must be called once before calling setBusinessObjectKey for the first time.
		 * @public
		 * @param {string} sKey
		 */
		setBusinessObjectKey: function(sKey){
			this._oLogger.info("Business Object Key: " + sKey);
			if(!this._oTimelineDataHandler){
				this._oLogger.error("Function setBusinessObjectMap must be called before calling setBusinessObjectKey for the first time.");
			}

			this._sBusinessObjectKey = sKey;
			this._oTimelineDataHandler.setBusinessObjectKey(sKey); // set the current business object
			this._refreshTimelineModel(); // refresh the timeline
			this._oTimeline.setShowHeaderBar(true);
		},
		/**
		 * Update a Timeline Entry text.
		 * This method should be called when a custom action requires a content update of a Timeline entry and should only be called if an
		 * an update to the backend is performed successfully.
		 * @public
		 * @param {string} sText - the text that will be displayed in the content of the timeline entry
		 * @param {string} sId - the id of the timeline entry to update
		 */
		updateTimelineEntry: function(sText, sId){
			// the embedded control consists of a flex box, we are setting the text of the first item in the flexbox here
			var oTimelineEntry = sap.ui.getCore().byId(sId);
			var oEmbCtrl = oTimelineEntry.getAggregation('embeddedControl');
			var aFlexBoxItems = oEmbCtrl._oFlexbox.getItems();
			
			aFlexBoxItems[0].setText(sText);
			// check if the timeline entry has a second item in the flexbox (e.g. link which contains 'and 2 other things') and remove it
			if(aFlexBoxItems.length > 1){
				for(var i=1; i<aFlexBoxItems.length; i++){
					aFlexBoxItems[i].destroy();
				}
			}
			
			// update the timeline entry text in the model with the new text
			var sTimelineEntryPath = oTimelineEntry.getBindingContext().getPath();
			var oTimelineModel = oTimelineEntry.getModel();
			oTimelineModel.getProperty(sTimelineEntryPath).timelineItemData.text = sText;
			oTimelineModel.getProperty(sTimelineEntryPath).timelineItemData.timelineEntryDetails = []; // clear any timeline entry details
			
			
		},
		
		/**
		 * Delete a Timeline Entry.
		 * This method should be called when a custom action requires a deletion of a Timeline entry and should only be called if an
		 * a delete to the backend is performed successfully.
		 * @public
		 * @param {string} sId - the id of the timeline entry to delete
		 */
		deleteTimelineEntry: function(sId){
			var oTimelineEntry = sap.ui.getCore().byId(sId);
			var sTimelineEntryPath = oTimelineEntry.getBindingContext().getPath();
			var oTimelineModel = oTimelineEntry.getModel();
			var oTimelineModelEntry = oTimelineModel.getProperty(sTimelineEntryPath); // get the timeline entry within the model
			 // get the index of the timeline entry within the model
			var iTimelineEntryIndex = oTimelineModel.getData().timelineData.indexOf(oTimelineModelEntry);
			
			// remove the timeline entry from the model. The function splice removes items based on index and number of items to remove
			oTimelineModel.getData().timelineData.splice(iTimelineEntryIndex, 1);
			// by destroying this timeline entry it will also remove it from the content of the timeline
			oTimelineEntry.destroy(); 
		},
		/**************************************************************************************
		 * PRIVATE METHODS for the Component
		 **************************************************************************************/
		
		/**
		 * Set the class variable responsible for enabling the social features to true or false
		 * @private
		 */
		_setEnableSocial : function() {
			if(this._checkJamConfiguration()){
				this._bEnableSocial = this.getEnableSocial();
			}
			else{
				this._bEnableSocial = false;
			}
		},
		
		/**
		 * check Jam Configuration
		 * This method is responsible to check Jam configuration status
		 * if status is false, all social features of the timeline should be hidden
		 * @private
		 */
		_checkJamConfiguration : function() {
			var bStatusOk = true;
			var self = this;
			var fSuccess = function(bConfigurationStatus) {
				if(bConfigurationStatus === false){
					bStatusOk = false;
				}
			};
			var fError = function(sError) {
				self._oCommonUtil.displayError();
			};
			this._oSMIntegrationDataHandler = new sap.collaboration.components.socialtimeline.datahandlers.SMIntegrationDataHandler(this._oSMIntegrationModel);
			this._oSMIntegrationDataHandler.getJamConfigurationStatus(fSuccess, fError);
			
			return bStatusOk;
		},
		/**
		 * initialize the OData models and Jam data handler
		 * @private
		 */
		_initialize: function(){
			// OData service models
			var asJson = true;
			if(!this._oCollabHostModel){
				this._oCollabHostModel = new sap.ui.model.odata.ODataModel(this._defaultAttributes.collaborationHostServiceUrl, asJson);
			}
			if(!this._oSMIntegrationModel){
				this._oSMIntegrationModel = new sap.ui.model.odata.ODataModel(this._defaultAttributes.smiServiceUrl, asJson);	
			}
			
			// Utilities
			if(!this._oJamDataHandler){
				this._oJamDataHandler = new sap.collaboration.components.socialtimeline.datahandlers.JamDataHandler(this._oCollabHostModel);	
			}			
		},
		/**
		 * Create the Timeline Control
		 * @private
		 */
		_createTimeline: function(){
			this._oTimeline = new sap.suite.ui.commons.Timeline( this.getId()+"_timeline", {
				data:[],

				filterSelectionChange : this._onFilterSelectionChange.bind(this),
				grow: this._onGrow.bind(this),
				addPost: this._onAddPost.bind(this),
				suggest: this._onSuggest.bind(this)
			});
			return this._oTimeline;
		},
		/**
		 * Refreshes the model for the timeline control
		 * @private
		 */
		_refreshTimelineModel: function(){
			var self = this;
			
			this._oTimeline.setBusyIndicatorDelay(0).setBusy(true);
			
			this._oTimelineDataHandler.getTimelineData(this._oFilter)
			.then(
				function(oTLData){
					self._oTimeline.setBusy(false);
					self._oTimelineModelData.timelineData = oTLData;
					self._oTimelineModel.setData(self._oTimelineModelData);
					
					self._hideReplyFromJamBarInTLItems(); // hide the replies from the TL items that are TL entries
					
				},
				function(oError){
					self._oCommonUtil.displayError();
					self._oTimeline.setBusy(false);
			});
		},
		/**
		 * Set model and bind the Timeline Item template to the Timeline
		 */
		_setTimelineModel: function(){
			var oCustomDataTemplate = new sap.ui.core.CustomData({
				key:"{key}",
				value: "{value}"
			});
			
			var oTLItemTemplate = new sap.suite.ui.commons.TimelineItem({
				dateTime: "{timelineItemData/dateTime}",
				userName: "{timelineItemData/userName}",
				title: "{timelineItemData/title}",
				icon: "{timelineItemData/icon}",
				filterValue: "{timelineItemData/filterValue}",
				userNameClickable: this._bEnableSocial,
				userNameClicked: this._onUserNameClicked,
				userPicture: "{timelineItemData/userPicture}",
				embeddedControl: this._createEmbeddedControl(),
				customAction: {
					template: oCustomDataTemplate,
					path: "timelineItemData/customActionData"
				},
				customActionClicked: this._onCustomActionClicked.bind(this),
				// The following properties and call back functions are used in the replies
				replyCount: "{_feedEntryData/RepliesCount}",
				replyListOpen: this._onReplyListOpen.bind(this),
				replyList: new sap.m.List({showNoData: false, width: "20rem"}),
				replyPost: this._onReplyPost.bind(this),
				suggest: this._onSuggest.bind(this)
			});
			
			this._oTimeline.setModel(this._oTimelineModel);
			this._oTimeline.bindAggregation("content", {
				path: "/timelineData",
				template: oTLItemTemplate
			});
			
			var oFilterItemTemplate = new sap.suite.ui.commons.TimelineFilterListItem({
				 	key : "{key}",
				 	text: "{text}"
				 });
			this._oTimeline.bindAggregation("filterList", {
	  	    	path: "/filterData",
	  	    	template: oFilterItemTemplate
	  		});
			
		},
		/**
		 * Returns the embedded control for the timeline
		 * @returns {sap.collaboration.components.socialtimeline.controls.TimelineEntryControl}
		 */
		_createEmbeddedControl: function(){
			return new sap.collaboration.components.socialtimeline.controls.TimelineEntryControl(
					this.getId()+"_embeddedControl",{timelineEntry: "{timelineItemData}"});
		},
		/**
		 * Builds the filter for the timeline
		 * 
		 * 1 - build the default filters
		 * 2 - build the custom filters
		 * 3 - concat the custom and default filters, then call method _setFilterData to set the filter to the timeline
		 * @private
		 */
		_buildFilter: function(){
			var aFilter = [];
			var aDefaultFilters = [{key: 0, text: this._oCommonUtil.getLanguageBundle().getText('TE_FILTER_DISCUSSION_POSTS'), value: ""},
				                   {key: 1, text: this._oCommonUtil.getLanguageBundle().getText('TE_FILTER_SYSTEM_UPDATES'), value: ""}];
			
			// if social is not enabled, then we need to remove the filter for the Discussion Posts
			if(this._bEnableSocial === false){
				for(var i=0; i<aDefaultFilters.length; i++){
					if(aDefaultFilters[i].text === this._oCommonUtil.getLanguageBundle().getText('TE_FILTER_DISCUSSION_POSTS')){
						aDefaultFilters.splice(i, 1);
						break;
					}
				}
			}
			
			var aCustomFilters = this.getCustomFilter();
			var iCustomFilterKey = aDefaultFilters.length;
			
			// The following for loop fills the keys of each object in the aCustomFilter array. The keys should start from the length 
			// of the aDefaultFilter, in other words, the last key of aDefaultFilters + 1. This ensures that when we concat both arrays 
			// (aDefaultFilters and aCustomerFilters) to create the entire filter (aFilter) to be set for the timeline every object in 
			// aFilter will receive a unique key.
			if(aCustomFilters){
				for(var i=0; i<aCustomFilters.length; i++){
					aCustomFilters[i].key = iCustomFilterKey;
					iCustomFilterKey++;
				}
			}
			
			aFilter = aDefaultFilters.concat(aCustomFilters);
			this._setFilterData(aFilter);
		},
		/**
		 * Sets the filter data in the timeline
		 * @param aFilter - the filter you want to set to the timeline
		 * @private
		 */
		_setFilterData: function(aFilter){				
			this._oTimelineModelData.filterData = this._oTimelineModelData.filterData.concat(aFilter);
			this._oTimelineModel.setData(this._oTimelineModelData);
		},
		/**
		 * TODO: This method needs to be revisited until it is not needed
		 * Go through the timeline items and hide the 'Reply' if social features are disabled.
		 * Also removes the reply for Timeline Entries because the anchor feed on Jam is not yet implemented.
		 * This is a workaround implementation until a better solution comes from the Timeline and Jam. 
		 */
		_hideReplyFromJamBarInTLItems: function(){
			var self = this;
			var aTimelineItems = this._oTimeline.getContent();
			aTimelineItems.forEach(function(oTLItem){
				var oTLData = oTLItem.getBindingContext().getObject();
				if(!oTLData._feedEntryData){
					self._hideReply(oTLItem);
				}	
			});
		},
		/**
		 * TODO: This method needs to be revisited until it is not needed
		 * Removes the reply link from a timeline item
		 * @param oTLItem
		 */
		_hideReply: function(oTLItem){
			oTLItem._replyLink.setVisible(false);
		},
		
		/**
		 * Get the Feed Entry ID given a Feed List Item
		 * @param {object} oTimelineItem - The TimelineItem event corresponding to the Feed List Item
		 * @returns {string} sFeedEntryId - The Feed Entry ID
		 */
		_getFeedId: function(oTimelineItem){
			var sPath = oTimelineItem.getBindingContext().getPath();
			var aPathElements = sPath.split("/");
			var sPosition = aPathElements[aPathElements.length -1];
			var sFeedEntryId = oTimelineItem.getModel().getData().timelineData[sPosition]._feedEntryData.Id;
			
			return sFeedEntryId;
		},

		/**
		 * Get the sender from Jam and assign it to a member attribute of the component.
		 * @private
		 */
		_getLoggedInUser: function(){
			var self = this;
			var oGetSender = this._oJamDataHandler.getSender();
			oGetSender.promise.done(function(oJamResults, response){
				self._oTimelineUser = oJamResults;
			});
			
			oGetSender.promise.fail(function(oError){
				self._oLogger.error('Failed to get the sender', oError.stack);
				//self._oCommonUtil.displayError(self._oLanguageBundle.getText('ST_POST_REPLY_FAILED')); 
			});
		},
		
		/*************************************************************************************
		 * EVENT HANDLERS
		 *************************************************************************************/
		/**
		 * Event handler for the grow event. 
		 * Appends the next page of data to the model for the timeline control
		 * @private
		 */
		_onGrow: function(){
			var self = this;
			this._oTimelineDataHandler.getTimelineData(this._oFilter)
			.then(
				function(oTLData){
					var oData = self._oTimelineModel.getData();
					oData.timelineData = oData.timelineData.concat(oTLData);
					self._oTimelineModel.setData(oData);
					
					self._hideReplyFromJamBarInTLItems();
				},
				function(oError){
					 self._oCommonUtil.displayError();
			});
		},
		/**
		 * Event Handler for the FilterSelectionChange event 
		 * @param {object} oEventData required - event handler data 
		 * @private
		 */
		_onFilterSelectionChange : function(oEventData) {
			this._oFilter = {"backend": undefined, "jam": undefined}; // reset the filter
			this._oTimelineDataHandler.reset();
			
			var oSelectedItem = oEventData.getParameter('selectedItem');
			
			// The only case where the selected item does not have a key is if the user pressed the filter 'All'.
			// In this case we don't set anything to the filter (this._oFilter)
			if(oSelectedItem.getProperty('key')){
				var sSelectedKey = parseInt(oSelectedItem.getProperty('key'));
				switch(sSelectedKey) {
					case 0: // '0' is the key for the filter 'Discussion Posts'
						this._oFilter.jam = this._oTimelineDataHandler.constants.FILTER_JAM_ALL;
						break;
					case 1: // '1' is the key for the filter 'System Updates'
						this._oFilter.backend = this._oTimelineDataHandler.constants.FILTER_BACKEND_ALL;
						break;
					default: // any other key would have to be a key for the custom filter 
						var aFilterData = this._oTimelineModelData.filterData;
						var iNumberOfFilters = aFilterData.length;
						var iNumberOfCustomFilters = this.getCustomFilter().length;
						
						// To find the index where the custom filters in the aFilterData start, we need to subtract the total number of filters
						// by the number of custom filters. This gives us the starting position for the custom filters in aFilterData, which
						// we loop through to find the value based on the key (sSelectedKey)
						var iIndexOfCustomFilters = iNumberOfFilters - iNumberOfCustomFilters;
						for (var i=iIndexOfCustomFilters; i<aFilterData.length; i++){
							if(sSelectedKey == aFilterData[i].key){
								this._oFilter.backend = aFilterData[i].value;
								break;
							}
						}
				}
			}
			this._refreshTimelineModel();
		},
		/**
		 * Event handler for userNameClicked event
		 * @param {object} oControlEvent - event when the user name is clicked
		 */
		_onUserNameClicked: function(oControlEvent){
			
			var oSocialTimelineComponent = oControlEvent.getSource().getParent().getParent(); // get the Component of the Social Timeline to have a single instance of the SocialProfile
			
			if(!oSocialTimelineComponent._oSocialProfile){
				oSocialTimelineComponent._oSocialProfile = sap.ui.getCore().createComponent(
									{	name:"sap.collaboration.components.socialprofile",
										id: this.getId()+"_socialProfile"
				});
				oSocialTimelineComponent._oSocialProfile._defaultAttributes = oSocialTimelineComponent._defaultAttributes; //copy odata service urls to the Social Profile 
			}
			
			var oSettings = {
					openingControl: oControlEvent.getSource()._userNameLink,
					memberId: oControlEvent.getSource().getBindingContext().getObject().timelineItemData.userEmail
			};
			oSettings.memberInfo = oSocialTimelineComponent._oTimelineDataHandler.getUserInfoFromBuffer(oSettings.memberId);
			oSocialTimelineComponent._oSocialProfile.setSettings(oSettings);
			oSocialTimelineComponent._oSocialProfile.open();
		},
		/**
		 * Event handler for adding post
		 * 
		 * 1 - map internal object to external object in Jam
		 * 2 - add a post for the external object in Jam
		 * @param {object} oControlEvent - event when the + add post button
		 */
		_onAddPost: function(oControlEvent){
			// if no business object is selected, return error
			if(!this._sBusinessObjectKey){
				this._oLogger.error("The business object key is undefined");
				this._oCommonUtil.displayError(this._oLanguageBundle.getText('ST_ADD_POST_NO_OBJECT_ERROR')); 
				return;
			}
				
			var oInternalBO = { 
					"appContext": this._oBusinessObjectMap.applicationContext,
					"collection": this._oBusinessObjectMap.collection,
					"key": this._sBusinessObjectKey,
					"odataServicePath": this._oBusinessObjectMap.servicePath 
			};
			
			var self = this;		
			var sContent = oControlEvent.getParameter("value");
			var fError = function(){
				self._oCommonUtil.displayError();
				self._oTimeline.setBusy(false);
			};
			
			if(sContent && sContent.trim() !== ""){ // post the user content if it's not empty
				var addingTopLevelPost = this._oTimelineDataHandler.addTopLevelPost(sContent, oInternalBO)
				
				// If a backend filter is not set, then add the feed entry to the UI and update the model.
				// If a backend filter is set, do not show the newly added post or update the model, the user will see the new post when
				// the backend filter has been removed
				if(!this._oFilter.backend){
					this._oTimeline.setBusyIndicatorDelay(0).setBusy(true);
					addingTopLevelPost.then(function(oActivity){
						return self._oJamDataHandler.getFeedEntryFromActivity(oActivity.Id);
					}, fError)
					.then(function(oFeedEntryFromActivity){
						// if the promise oFeedEntryFromActivity returned successfully, perform the following 'done'
						oFeedEntryFromActivity.promise.done(function(oData, response){
							var oJamFeedEntry = oData.results;
							var sImageURL = self._oTimelineDataHandler.buildImageUrl(oJamFeedEntry.Creator.ThumbnailImage.Id, oJamFeedEntry.Creator.ThumbnailImage.ThumbnailImageType);
							
							// create the feed entry to be added to the timeline Model
							var oFeedEntry = {
									_feedEntryData: oJamFeedEntry,
									timelineItemData: {
										dateTime: oJamFeedEntry.CreatedAt,
										icon: "sap-icon://post",
										text: oJamFeedEntry.Text,
										title: oJamFeedEntry.Action,
										userEmail: oJamFeedEntry.Creator.Email,
										userName: oJamFeedEntry.Creator.FullName,
										userPicture: sImageURL
									}
							};
							
							var aModelData = self._oTimeline.getModel().getData();
							aModelData.timelineData.push(oFeedEntry);					
							self._oTimeline.setBusy(false);
							
							var oTimelineItem = new sap.suite.ui.commons.TimelineItem({
								dateTime: new Date(oJamFeedEntry.CreatedAt),
								userName: oJamFeedEntry.Creator.FullName,
								title: oJamFeedEntry.Action,
								text: oJamFeedEntry.Text,
								icon: "sap-icon://post",
								userNameClickable: true,
								userNameClicked: self._onUserNameClicked,
								userPicture: sImageURL,
								replyCount: "{_feedEntryData/RepliesCount}",
								replyListOpen: self._onReplyListOpen.bind(self),
								replyList: new sap.m.List({showNoData: false, width: "20rem"}),
								replyPost: self._onReplyPost.bind(self),
								suggest: self._onSuggest.bind(self)
							});
							
							// add the timeline item to the timeline
							self._oTimeline.addContent(oTimelineItem);
							
							// check if the current user who created a new high level post is in the buffer, if not, then add it
							if(!self._oTimelineDataHandler.getUserInfoFromBuffer(oJamFeedEntry.Creator.Email)){
								self._oTimelineDataHandler.addUserInfoToBuffer(oJamFeedEntry.Creator);
							}
							
							// create a binding context in the model with the same path as the newly created feed entry
							// create a context object using the same path and set the binding context for this newly created timeline item
							var iFeedEntryIndex = aModelData.timelineData.indexOf(oFeedEntry);
							oTimelineItem.getParent().getModel().createBindingContext("/timelineData/" + iFeedEntryIndex);
							var oContext = new sap.ui.model.Context(oTimelineItem.getParent().getModel(), "/timelineData/" + iFeedEntryIndex);
							oTimelineItem.setBindingContext(oContext);
						});
						// if the promise oFeedEntryFromActivity returned unsuccessfully, perform the following 'fail'
						oFeedEntryFromActivity.promise.fail(fError);
					});	
				}
			}			
		},
		/**
		 * Gets the suggestions when the user presses '@' in High Level Posts and Replies.
		 * 
		 * 1 - bind a template to the aggregation 'suggestionItems' for the event source (event source could be Timeline or Timeline Item)
		 * 2 - abort existing requests, parse the user input and clear existing suggestions.
		 * 3 - make the call to get the suggestions and update the model with the suggestions
		 * @param {object} oEvent - the event after the user presses '@'
		 * @private
		 */
		_onSuggest: function(oEvent){
			// All aggregation binding for the Timeline is done in the _setTimelineModel method. For the suggestions, this is not the case.
			// The aggregation binding is done here because of a bug in the Timeline itself. If we move the binding to the _setTimelineModel
			// method, it will bug and the entire Social Timeline will not load. We will keep it here until a fix is deployed.
			if(!oEvent.getSource().getBinding('suggestionItems')){
				var oSuggestionItem = new sap.m.StandardListItem({
					title: "{name}", 
					description: "{email}"
					});
				oEvent.getSource().bindAggregation("suggestionItems", {
					path: "/suggestions",
					template: oSuggestionItem
				});
			}
			
			if(this.gettingSuggestions){
				this.gettingSuggestions.request.abort();
			}
			
			var sValue = oEvent.getParameter("suggestValue").substring(1); // remove first character '@'
			var oTimelineModelData = this._oTimelineModel.getData();
			
			// We check if the sValue (user input) is 1, if so, it implies that it's the first letter entered by the user and the first time
			// the suggestions will be triggered. In this case we need to clear any existing suggestions that might be there from the last
			// time the user triggered the suggestions.
			if(sValue.length == 1){
				oTimelineModelData.suggestions = [];
				this._oTimelineModel.setData(oTimelineModelData);
			}
			
			var self = this;
			this.gettingSuggestions = this._oJamDataHandler.getSuggestions(sValue);
			
			this.gettingSuggestions.promise.done(function(oData, response){
				var aJamResults = oData.results;
				var aSuggestions = [];
				oTimelineModelData.suggestions = []; // clear the suggestions from the last user input
				
				for(var i = 0; i < aJamResults.length; i++){
					aSuggestions.push({"name" : aJamResults[i].FullName, "email" : aJamResults[i].Email});
				}
				oTimelineModelData.suggestions = oTimelineModelData.suggestions.concat(aSuggestions);
				self._oTimelineModel.setData(oTimelineModelData);
			});
			
			this.gettingSuggestions.promise.fail(function(oError){
				if(oError.response && oError.response.statusCode){
					self._oCommonUtil.displayError();
				}
			});
		},
		/**
		 * Event handler for customActionClicked event
		 * @param oCustomActionEvent
		 */
		_onCustomActionClicked: function(oCustomActionEvent){
			var oCustomActionEventParam = {};
			var oBindingContext = oCustomActionEvent.getSource().getBindingContext();
			var sBindingPath = oBindingContext.getPath(); 
			var oOdataEntry = oCustomActionEvent.getSource().getModel().getProperty(sBindingPath + "/timelineItemData/customActionData/oDataEntry");
			
			oCustomActionEventParam.oDataEntry = oOdataEntry;
			oCustomActionEventParam.timelineEntryId = oCustomActionEvent.getParameters().id;
			oCustomActionEventParam.key = oCustomActionEvent.getParameters().key;
			this.fireCustomActionPress(oCustomActionEventParam); 
		},
		
		/**
		 * Load replies for a specific High Level Feed when the user clicks on the Reply link of the TimelineItem.
		 * Fetch the replies from the Jam OData Service.
		 * Set the results to the Timeline OData Model.
		 * @param {object} oEventData
		 * @private
		 */
		_onReplyListOpen: function(oEventData){
			
			var self = this;
			var oTimelineItem = oEventData.getSource();
			
			try{
				var sFeedEntryId = this._getFeedId(oTimelineItem);
				if (!sFeedEntryId){
					throw new Error('Failed to get the feed entry ID.');
				}
			}
			catch(oError){
				this._oLogger.error('Failed to get the feed entry ID');
				// In this case, the reply box needs to be closed manually.
				this._oCommonUtil.displayError(this._oLanguageBundle.getText('ST_GET_REPLIES_FAILED'));
				return;	
			}			
						
			oTimelineItem.getReplyList().setBusyIndicatorDelay(0).setBusy(true);
			var gettingReplies = this._oJamDataHandler.getReplies(sFeedEntryId);
			
			gettingReplies.promise.done(function(oJamResults, response){
				
				var aJamResults = oJamResults.results;
				aJamResults.reverse();
				
				oTimelineItem.getReplyList().removeAllItems();
				// A mutation observer is used as workaround to set the focus on the reply box at the bottom of the list (only the first time).
				// The timeline control would need to do something similar, but for them it's working because they provide the replies populated in the model.
				// This workaround needs to be reviewed on SP13 under a new BLI (binding reply to the model)				
				//self._appendListObserver(oTimelineItem.getReplyList());				
				// End of workaround
				for(var i = 0; i < aJamResults.length; i++){
					var oResult = aJamResults[i];
					oTimelineItem.getReplyList().addItem(new sap.m.FeedListItem({
		         		text: oResult.Text,		         		
						icon: self._oTimelineDataHandler.buildImageUrl(oResult.ThumbnailImage.Id, oResult.ThumbnailImage.ThumbnailImageType),		         		
						timestamp: self._oCommonUtil.formatDateToString(oResult.CreatedAt),
						sender: oResult.Creator.FullName,
						iconActive: false,
						senderActive: false
					}));
				}
				
				oTimelineItem.getReplyList().setBusy(false);				
			});
			
			gettingReplies.promise.fail(function(){
				self._oLogger.error('Failed to get the replies.');
				// In this case, the reply box is closed successfully when the error message is displayed
				self._oCommonUtil.displayError(self._oCommonUtil.getLanguageBundle().getText('ST_GET_REPLIES_FAILED')); 
			});			
		},
		
		/**
		 * Add the reply to Jam and the reply list when the user clicks on "Reply" in the replies box. 
		 * Post the reply for a specific High Level Feed to Jam.
		 * Set the results to the Timeline OData Model.
		 * @param {object} oEventData
		 * @private
		 */
		_onReplyPost: function(oEventData){
			var self = this;
			var sReplyText = oEventData.getParameter("value");
			// Add reply if it's not an empty reply
			if(sReplyText && sReplyText.trim() !== ""){
				var oTimelineItem = oEventData.getSource();
							
				try{
					var sFeedEntryId = this._getFeedId(oTimelineItem);
					if (!sFeedEntryId){
						throw new Error('Failed to get the feed entry ID.');
					}
				}
				catch(oError){
					this._oLogger.error('Failed to get the feed entry ID');
					this._oCommonUtil.displayError(this._oLanguageBundle.getText('ST_POST_REPLY_FAILED')); //Pop-over on pop-over not allowed 
					return;	
				}
				
				// Post the reply to Jam
				var postingReply = this._oJamDataHandler.postReply(sFeedEntryId, sReplyText);
	
				postingReply.promise.done(function(oJamResults, response){
	
					// Add reply to the reply list
					// An new FeedListItem will be created and added to the reply list control 
					// The properties iconActive and senderActive of the template are set to false to disable the handler when clicking on the image
					// so the social profile will not be called
					// A mock up is needed to solve the conflicting UX guideline that a pop-over on a pop-over is not allowed
					oTimelineItem.getReplyList().addItem(new sap.m.FeedListItem( {
						text: sReplyText,
						icon : "{timelineItemData/userPicture}",
						timestamp:  self._oCommonUtil.formatDateToString(new Date()),
						sender: self._oTimelineUser.FullName,
						iconActive: false,
						senderActive: false
					}));
					
					oTimelineItem.setReplyCount(oTimelineItem.getReplyList().getItems().length);
				});
				
				postingReply.promise.fail(function(){
					self._oLogger.error('Failed to post the reply.');
					self._oCommonUtil.displayError(self._oCommonUtil.getLanguageBundle().getText('ST_POST_REPLY_FAILED')); 
				});
			}
		},
		
		/**
		 * Create a Mutation Observer and attach it to the Reply List in order to scroll down to the last item.
		 * @param {sap.m.List} oList
		 * @private
		 */
		_appendListObserver: function(oList){
			var self = this;
			// 1. Use the right class for each browser
			var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
			// 2. Get the dom ref for the reply box (pop over)
			var oReplyBox = oList.getParent();
			var oReplyBoxDomRef = oReplyBox.getDomRef();
			var oTextArea = oList.getParent().getContent()[1];
			// 3. Declare the observer object
			self.oListObserver = new MutationObserver(function(mutations) {
				var isFocusSet = false;
			    mutations.forEach(function(mutation) {
			        if (!isFocusSet && mutation.type === 'attributes') {
			        	oTextArea.getParent().focus();
			        	oTextArea.focus();
			        	self.oListObserver.takeRecords();
			        	self.oListObserver.disconnect();
			        	isFocusSet = true;
			        }
			      });
			    });
			// 4. Append obsever to the reply list    
			self.oListObserver.observe(oReplyBoxDomRef, { childList: false , attributes: true, subTree: false });
		},
		
		/**
		 * Validates the input parameters provided to the Social Component
		 * @private
		 */
		_validateInputParameters: function(){
			/*
			 * Validation for the customFilter
			 * */
			var aCustomFilter = this.getCustomFilter();
			if(aCustomFilter){
				if(!jQuery.isArray(aCustomFilter)){
					this._oLogger.error("The type defined for the property customFilter is not an array and not be included in the filter.");
					this.setCustomFilter([]);
				}
				else {
					for(var i=0; i<aCustomFilter.length; i++){
						if(!aCustomFilter[i].value || !aCustomFilter[i].text || typeof(aCustomFilter[i].value) !== "string" || typeof(aCustomFilter[i].text) !== "string"){
							this._oLogger.error("The value or text for the filter " + JSON.stringify(aCustomFilter[i]) + " is not defined or not a string. It has been removed from the filter list.");
							aCustomFilter.splice(i, 1);
							i--;
						}
					}
				}
			}
			else {
				this.setCustomFilter([]);
			}
			
		}
		
	}
);

/**
 * Getter for property <code>alignment</code>.
 * Timeline item alignment.
 *
 * Default value is <code>Right</code>
 *
 * @return {sap.suite.ui.commons.TimelineAlignment} the value of property <code>alignment</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getAlignment
 * @function
 */

/**
 * Setter for property <code>alignment</code>.
 *
 * Default value is <code>Right</code> 
 *
 * @param {sap.suite.ui.commons.TimelineAlignment} oAlignment  new value for property <code>alignment</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setAlignment
 * @function
 */

/**
 * Getter for property <code>axisOrientation</code>.
 * Timeline axis orientation.
 *
 * Default value is <code>Vertical</code>
 *
 * @return {sap.suite.ui.commons.TimelineAxisOrientation} the value of property <code>axisOrientation</code>
 * @public
 * @name sap.collaboration.components.socialtimeline.Component#getAxisOrientation
 * @function
 */

/**
 * Setter for property <code>axisOrientation</code>.
 *
 * Default value is <code>Vertical</code> 
 *
 * @param {sap.suite.ui.commons.TimelineAxisOrientation} oAxisOrientation  new value for property <code>axisOrientation</code>
 * @return {sap.collaboration.components.socialtimeline.Component} <code>this</code> to allow method chaining
 * @public
 * @name sap.collaboration.components.socialtimeline.Component#setAxisOrientation
 * @function
 */

/**
 * Getter for property <code>noDataText</code>.
 * This text is displayed when the control has no data.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>noDataText</code>
 * @public
 * @name sap.collaboration.components.socialtimeline.Component#getNoDataText
 * @function
 */

/**
 * Setter for property <code>noDataText</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sNoDataText  new value for property <code>noDataText</code>
 * @return {sap.collaboration.components.socialtimeline.Component} <code>this</code> to allow method chaining
 * @public
 * @name sap.collaboration.components.socialtimeline.Component#setNoDataText
 * @function
 */

/**
 * Getter for property <code>showIcons</code>.
 * Show icon on each Timeline item.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showIcons</code>
 * @public
 * @name sap.collaboration.components.socialtimeline.Component#getShowIcons
 * @function
 */

/**
 * Setter for property <code>showIcons</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowIcons  new value for property <code>showIcons</code>
 * @return {sap.collaboration.components.socialtimeline.Component} <code>this</code> to allow method chaining
 * @public
 * @name sap.collaboration.components.socialtimeline.Component#setShowIcons
 * @function
 */

/**
 * Getter for property <code>visible</code>.
 * Set Timeline control visibility
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>visible</code>
 * @public
 * @name sap.collaboration.components.socialtimeline.Component#getVisible
 * @function
 */

/**
 * Setter for property <code>visible</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bVisible  new value for property <code>visible</code>
 * @return {sap.collaboration.components.socialtimeline.Component} <code>this</code> to allow method chaining
 * @public
 * @name sap.collaboration.components.socialtimeline.Component#setVisible
 * @function
 */

/**
 * Getter for property <code>width</code>.
 * Sets the width of the Timeline.
 *
 * Default value is <code>100%</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>width</code>
 * @public
 * @name sap.collaboration.components.socialtimeline.Component#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is <code>100%</code> 
 *
 * @param {sap.ui.core.CSSSize} sWidth  new value for property <code>width</code>
 * @return {sap.collaboration.components.socialtimeline.Component} <code>this</code> to allow method chaining
 * @public
 * @name sap.collaboration.components.socialtimeline.Component#setWidth
 * @function
 */

/**
 * Getter for property <code>customFilter</code>.
 *
 * Default value is <code>[]</code>. The customFilter is an array of objects, each object contains text and value.
 * Text is the name of the filter category and value is the filter value.
 *
 * @return {array} the value of property <code>customFilter</code> 
 * @public
 * @name sap.collaboration.components.socialtimeline.Component#getCustomFilter
 * @function
 */

/**
 * Event fire when a custom action is clicked
 *
 * @name sap.collaboration.components.socialtimeline.Component#customActionPress
 * @event
 * @param {object} oEventData
 * @public
 */

