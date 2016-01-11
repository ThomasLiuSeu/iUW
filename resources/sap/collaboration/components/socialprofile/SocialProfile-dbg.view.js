/*!
 * @copyright@
 */
sap.ui.jsview("sap.collaboration.components.socialprofile.SocialProfile", {

	/** 
	* Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @private
	*/
	getControllerName : function() {
		return "sap.collaboration.components.socialprofile.SocialProfile";
	},

	/** 
	* Is the place where the UI is constructed (inherited).<br> 
	* It is initially called once after the Controller has been instantiated.
	* Since the Controller is given to this method, its event handlers can be attached right away.
	* It creates the VBox for the Responsive Popover
	* @param {sap.ui.controller} oController The view Controller 
	* @private
	*/ 
	createContent : function(oController) {
		this._sPrefixId = this.getId();
		this._oVBox= new sap.m.VBox(this._sPrefixId + "_VBox").addStyleClass("vbox");
		this._createVBoxContent();
		
		return this._oVBox;
	},
	
	/**
	 * Creates the content for the Social Profile VBox
	 * @private
	 */
	_createVBoxContent : function(){
		this._oVBox.addItem(this._createHBoxHeader()); // add the header (HBox that contains the user image, full name and title) to the VBox content first
		
		var oContactDetailsLabel = new sap.m.Label(this._sPrefixId + "_ContactDetailsLabel", {
			text: this.getViewData().langBundle.getText("SP_CONTACT_DETAILS_LABEL")
		}).addStyleClass("heading");	
		
		var oMobileLabel = new sap.m.Label(this._sPrefixId + "_MobileLabel", {
			text: this.getViewData().langBundle.getText("SP_MOBILE_LABEL")
		}).addStyleClass("label");	
		
		var oMobileNumber = new sap.m.Text(this._sPrefixId + "_MobileNumber", {
			text: "{/MemberProfile/PhoneNumbers/Mobile}"
		});
		
		var oWorkLabel = new sap.m.Label(this._sPrefixId + "_WorkLabel", {
			text: this.getViewData().langBundle.getText("SP_WORK_LABEL")
		}).addStyleClass("label");	
		
		var oWorkNumber = new sap.m.Text(this._sPrefixId + "_WorkNumber", {
			text: "{/MemberProfile/PhoneNumbers/Work}"
		});
		
		var oEmailLabel = new sap.m.Label(this._sPrefixId + "_EmailLabel", {
			text: this.getViewData().langBundle.getText("SP_EMAIL_LABEL")
		}).addStyleClass("label");	
		
		var oEmail = new sap.m.Link(this._sPrefixId + "_Email", {
			text: "{/Email}",
			press: function(){
				this.setHref("mailto:" + this.getText());
			}
		});
		
		var oCompanyDetailsLabel = new sap.m.Label(this._sPrefixId + "_CompanyDetailsLabel", {
			text: this.getViewData().langBundle.getText("SP_COMPANY_DETAILS_LABEL")
		}).addStyleClass("heading");	
				
		var oCompanyAddressLabel = new sap.m.Label(this._sPrefixId + "_CompanyAddressLabel", {
			text: this.getViewData().langBundle.getText("SP_COMPANY_ADDRESS_LABEL")
		}).addStyleClass("label");	
		
		var oCompanyAddress = new sap.m.Text(this._sPrefixId + "_CompanyAddress", {
			text: "{/MemberProfile/Address}"
		});
		
		this._oVBox.addItem(oContactDetailsLabel)
		.addItem(oMobileLabel)
		.addItem(oMobileNumber)
		.addItem(oWorkLabel)
		.addItem(oWorkNumber)
		.addItem(oEmailLabel)
		.addItem(oEmail)
		.addItem(oCompanyDetailsLabel)
		.addItem(oCompanyAddressLabel)
		.addItem(oCompanyAddress);
	},
	
	/**
	 * Creates the content for the Social Profile Header HBox
	 * @private
	 */
	_createHBoxHeader : function(){
			var oHeaderVBox = new sap.m.VBox(this._sPrefixId + "_HeaderVBox").addStyleClass("headervbox");
			
			var oFullName = new sap.m.Text(this._sPrefixId + "_FullName", {
				text: "{/FullName}"
			}).addStyleClass("fullname");
			
			var oRole = new sap.m.Text(this._sPrefixId + "_Role", {
				text: "{/Title}"
			}).addStyleClass("role");
			
			oHeaderVBox.addItem(oFullName).addItem(oRole);
			
			var oHeaderHBox = new sap.m.HBox(this._sPrefixId + "_HeaderHBox", {
				height: "48px"
			});
			
			var oUserImage = new sap.m.Image(this._sPrefixId + "_HeaderUserImage", {
				alt: "{/FullName}",
				width: "48px",
				height: "48px"
			}).addStyleClass("image");
		
			var oNoUserHeader = new sap.m.ObjectStatus(this._sPrefixId + "_NoUserHeader", {
				text: this.getViewData().langBundle.getText("SP_NO_USER"), 
				state: "Warning", 
				icon: "sap-icon://alert",
				visible: false
			});

		oHeaderHBox.addItem(oUserImage)
		.addItem(oHeaderVBox)
		.addItem(oNoUserHeader);
		
		return oHeaderHBox;
	},
	
	/**
	 * Reset the content header in the Popover to have the image, user full name and role visible
	 * @public
	 */
	resetHeader : function(){
		var oNouserHeader = sap.ui.getCore().byId(this._sPrefixId + "_NoUserHeader");
		
		if(oNouserHeader.getVisible() === true){
			oNouserHeader.setVisible(false);
			sap.ui.getCore().byId(this._sPrefixId + "_HeaderVBox").setVisible(true);
			sap.ui.getCore().byId(this._sPrefixId + "_HeaderUserImage").setVisible(true);
		}
	},
	
	/**
	 * Sets the header for the content if the user does not exist
	 * @public
	 */
	setHeaderNoUser : function(){
		var oUserImage = sap.ui.getCore().byId(this._sPrefixId + "_HeaderUserImage");
		
		if(oUserImage.getVisible() === true){
			oUserImage.setVisible(false);
			sap.ui.getCore().byId(this._sPrefixId + "_HeaderVBox").setVisible(false);
			sap.ui.getCore().byId(this._sPrefixId + "_NoUserHeader").setVisible(true);
		}
	}
});