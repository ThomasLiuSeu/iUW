/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/**
 *@class navigationTarget 
 *@name navigationTarget
 *@memberOf sap.apf.ui.reuse.view 
 *@description Contains the list of navigation targets possible for the APF Application
 *@returns  {Open in - Navigation Target buttons}  
 */
sap.ui.jsview("sap.apf.ui.reuse.view.navigationTarget", {
	getControllerName : function() {
		return "sap.apf.ui.reuse.controller.navigationTarget";
	},
	createContent : function(oController) {
		var oViewData = this.getViewData();
		this.oNavListPopover = oViewData.oNavListPopover;
		this.oOpenInButtonEventSource = oViewData.oOpenInButtonEventSource;
		this.oNavigationHandler = oViewData.oNavigationHandler;
		this.oUiApi = oViewData.oUiApi;
		this.oController = oController;
		//Call to getNavigationTargetsWithText returns a promise
		this.oUiApi.getLayoutView().byId("applicationPage").setBusy(true);//Set busy indicator to true once open in is pressed
		var oNavTargetsPromise = this.oNavigationHandler.getNavigationTargetsWithText();
		// Call to _prepareActionListModel after promise is done
		oNavTargetsPromise.then(this._prepareActionListModel.bind(this), function(){
			this.oUiApi.getLayoutView().byId("applicationPage").setBusy(false);//Set busy indicator to false once open in is pressed
		});
	},
	/**
	 *@description Prepares Action list model and adds it the openIn button pop over
	 *@param {Array} Array of objects contains the navigation targets with semantic object, action, action's text, id from when the promise is done
	 */
	_prepareActionListModel : function(navTargets) {
		var oActionListItem, navTargets;
		var self = this;
		var oModel = new sap.ui.model.json.JSONModel();
		var oData = {
			navTargets : navTargets
		};
		//Preparing the list of navigation target actions in the list
		oActionListItem = new sap.m.List({
			items : {
				path : "/navTargets",
				template : new sap.m.StandardListItem({
					title : "{text}",
					type : sap.m.ListType.Navigation,
					press : function(oEvent) {
						var selectedNavTarget = oEvent.getSource().getBindingContext().getObject().id;
						self.oController.handleNavigation(selectedNavTarget);//Navigate to app once an action is clicked
					},
				})
			}
		});
		oModel.setData(oData);
		oActionListItem.setModel(oModel);
		this.oNavListPopover.removeAllContent();
		this.oNavListPopover.addContent(oActionListItem);
		this.oUiApi.getLayoutView().byId("applicationPage").setBusy(false);//Set busy indicator to true once open in list is populated
		this.oNavListPopover.openBy(this.oOpenInButtonEventSource);
	}
});