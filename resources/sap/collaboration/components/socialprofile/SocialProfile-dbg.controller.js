/*!
 * @copyright@
 */
jQuery.sap.require("sap.collaboration.components.utils.CommonUtil");
jQuery.sap.require("sap.collaboration.components.utils.OdataUtil");

sap.ui.controller("sap.collaboration.components.socialprofile.SocialProfile", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf sap.collaboration.components.socialprofile.SocialProfile
*/
	onInit: function() {
		this._sJamODataServiceUrl = this.getView().getViewData().collaborationHostServiceUrl;
		this._oODataUtil = new sap.collaboration.components.utils.OdataUtil();
		this._oCommonUtil = new sap.collaboration.components.utils.CommonUtil();
		this._sPrefixId = this.getView().getId();
		this._sJamURL = "";
		this._sJamUserId = "";
		this._sPopoverPrefix = this.getView().getViewData().popoverPrefix;
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf sap.collaboration.components.socialprofile.SocialProfile
*/
	onBeforeRendering: function() {
		if(!this._oJamODataModel){
			this._initializeJamODataModel();
		}
		if(!this._oSMIODataModel){
			this._initializeSMIODataModel();
		}
		if(!this._oJSONModel){
			this._initializeJSONModel();
		}
		
		if(!this._sJamURL){
			this._fetchJamURL();
			this._attachJamButtonPress();
		}

		if(this._memberId !== this.getView().getViewData().memberId){ // if the same user profile is not clicked, then fetch the user's data
			this.getView().resetHeader(); // this is done in case the header is set to 'No user' in the previous call (where the image, user full name and role have been removed)
			this._clearViewData(); // clear some fields before opening the UI
			this._memberId = this.getView().getViewData().memberId;	
			
			var memberInfo = this.getView().getViewData().memberInfo;
			if(!memberInfo){		// if no member information was passed, fetch the data
				this._fetchData();
			}
			else{
				this._fillData(memberInfo);
			}
		}
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf sap.collaboration.components.socialprofile.SocialProfile
*/
//	onAfterRendering: function() {
//	
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf sap.collaboration.components.socialprofile.SocialProfile
*/
//	onExit: function() {
//		
//	},
	
	/**
	 * Initialize the OData Model
	 * @private
	 */
	_initializeJamODataModel : function(){
		var bAsJSON = true;
		this._sJamODataServiceUrl = this.getView().getViewData().collaborationHostServiceUrl;
    	this._oJamODataModel = new sap.ui.model.odata.ODataModel(this._sJamODataServiceUrl, bAsJSON);	
	},
	
	/**
	 * Initialize the SMI OData Model
	 * @private
	 */
	_initializeSMIODataModel : function(){
		var bAsJSON = true;
		this._sSMIODataServiceUrl = this.getView().getViewData().smiServiceUrl;
    	this._oSMIODataModel = new sap.ui.model.odata.ODataModel(this._sSMIODataServiceUrl, bAsJSON);   	
	},
	
	/**
	 * Initialize the JSON Model
	 * @private
	 */
	_initializeJSONModel : function(){
		this._oJSONModel = new sap.ui.model.json.JSONModel({});
		this.getView().setModel(this._oJSONModel);
	},
	
	/**
	 * Attach a press handler function to the press listener in the 'Open in SAP Jam' button
	 * @private
	 */
	_attachJamButtonPress : function(){
		var self = this;
		var oJamButton = sap.ui.getCore().byId(this._sPopoverPrefix + "_JamButton");
		oJamButton.attachPress(function(){
			window.open(self._sJamURL + "/profile/wall/" + self._sJamUserId, "_blank");
		});
	},
	
	/**
	 * Fetch the SAP Jam URL
	 * @private
	 */
	_fetchJamURL: function(){
		var bAsync = true;
		var self = this;
		var oFetchJamURLDeferred = new jQuery.Deferred();
		
		oFetchJamURLDeferred.done(function(sJamURL){
			self._sJamURL = sJamURL;
		});
		oFetchJamURLDeferred.fail(function(sErrorCode){
			jQuery.sap.log.error("SAP Jam request failed at sap.collaboration.components.socialprofile.SocialProfileController._fetchJamURL()");
			self._oCommonUtil.displayError();
		});
		this._oODataUtil.getJamUrl(this._oSMIODataModel, oFetchJamURLDeferred, bAsync);
	},
	
	/**
	 * Fetch the SAP Jam user profile data
	 * @private
	 */
	_fetchData: function(){	
		var self = this;
		
		if(this._oSocialProfileRequest){
			this._oSocialProfileRequest.abort(); // abort an existing request, this is required for cases where the user clicks on a different user profile before the previous request is complete
		}
		this._oSocialProfileRequest = this._oJamODataModel.read( "Members_Autocomplete", { 
			// the success callback returns an array that contains the user's profile, it performs 3 operations:
			// i. set the data to the model
			// ii. set the image url and attach the press event to the footer button ('Open in SAP Jam')
			// iii. call method _fetchMemberPhoneNumbers to get the user's phone numbers
			success: function(oData, response){			
				var oJSONresponse = oData.results[0];
				var oResponsivePopover = sap.ui.getCore().byId(self._sPopoverPrefix + "_Popover");
				
				self._oJSONModel.setData(oJSONresponse);
				
				if(oData.results[0]){ // check that response from SAP Jam is not empty
					var sImageURL = self._sJamODataServiceUrl + "/ThumbnailImages" + "(Id='" + jQuery.sap.encodeURL(oJSONresponse.ThumbnailImage.Id) + "',ThumbnailImageType='" 
					+  jQuery.sap.encodeURL(oJSONresponse.ThumbnailImage.ThumbnailImageType) + "')/$value";
					
					sap.ui.getCore().byId(self._sPrefixId + "_HeaderUserImage").setSrc(sImageURL);
					
					self._sJamUserId = oJSONresponse.Id;
					
					oResponsivePopover.getBeginButton().setEnabled(true); // set the 'Open in SAP Jam' button to enabled
					
					self._fetchMemberPhoneNumbers(self._sJamUserId, self._oJSONModel);
				}
				else {
					self.getView().setHeaderNoUser();
				}
			},
			error: function(oError){
				if(oError.response && oError.response.statusCode){
					jQuery.sap.log.error("SAP Jam request failed at sap.collaboration.components.socialprofile.SocialProfileController._fetchData()");
					self._oCommonUtil.displayError();
				}
			},
			urlParameters: {"Query" : "'" + this._memberId + "'", "$expand" : "ThumbnailImage,MemberProfile"}
		});
	},
	
	/**
	 * Fetch the SAP Jam user phone numbers and update the model
	 * @private
	 */
	_fetchMemberPhoneNumbers: function(sJamUserId, _oJSONModel){
		var self = this;
		
		this._oJamODataModel.read("MemberProfiles('" + sJamUserId + "')" + "/PhoneNumbers" , {
			// the success callback returns an array that contains all the phone numbers associated to the user (work, mobile, home, etc...). 
			// We loop through each item to check if the number belongs to 'Work' or 'Mobile' and set the properties "Work" and "Mobile" to the model
			success: function(oData, response){
				var oJSONresponse = oData.results;
				var sWorkPhone = "";
				var sMobilePhone = "";
				
				for(var i=0, iResponseLength = oJSONresponse.length; i < iResponseLength; i++){
					if(oJSONresponse[i]['PhoneNumberType'] === 'Work'){
						sWorkPhone =  oJSONresponse[i]['PhoneNumber'];
					}
					if(oJSONresponse[i]['PhoneNumberType'] === 'Mobile'){
						sMobilePhone = oJSONresponse[i]['PhoneNumber'];
					}
				}
				_oJSONModel.setProperty("/MemberProfile/PhoneNumbers", {Work: sWorkPhone, Mobile: sMobilePhone});
			},
			error: function(oError){
				jQuery.sap.log.error("SAP Jam request failed at sap.collaboration.components.socialprofile.SocialProfileController._fetchMemberPhoneNumbers()");
				self._oCommonUtil.displayError();
			}
		});
	},
	_fillData: function(oMemberInfo){
		
		var oMemberData = {
				"Id": oMemberInfo.id,
				"FullName": oMemberInfo.fullname,
				"Title": oMemberInfo.title,
				"Email": oMemberInfo.email,
				"MemberProfile": {	"Address":oMemberInfo.address,
									"PhoneNumbers":{}}
		};
		this._oJSONModel.setData(oMemberData);
		sap.ui.getCore().byId(this._sPrefixId + "_HeaderUserImage").setSrc(oMemberInfo.picture);
		
		this._sJamUserId = oMemberInfo.id;
		
		var oResponsivePopover = sap.ui.getCore().byId(this._sPopoverPrefix + "_Popover");
		oResponsivePopover.getBeginButton().setEnabled(true); // set the 'Open in SAP Jam' button to enabled
		
		this._fetchMemberPhoneNumbers(this._sJamUserId, this._oJSONModel);
	},
	/**
	 * Clear the fields in the view
	 * @private
	 */
	_clearViewData: function(){
		sap.ui.getCore().byId(this._sPrefixId + "_HeaderUserImage").setSrc();
		sap.ui.getCore().byId(this._sPrefixId + "_FullName").setText();
		sap.ui.getCore().byId(this._sPrefixId + "_Role").setText();	
		sap.ui.getCore().byId(this._sPrefixId + "_MobileNumber").setText();
		sap.ui.getCore().byId(this._sPrefixId + "_WorkNumber").setText();
		sap.ui.getCore().byId(this._sPrefixId + "_Email").setText();
		sap.ui.getCore().byId(this._sPrefixId + "_CompanyAddress").setText();
		sap.ui.getCore().byId(this._sPopoverPrefix + "_Popover").getBeginButton().setEnabled(false); // disable the 'Open in SAP Jam' button
	}
});