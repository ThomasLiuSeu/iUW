jQuery.sap.require("sap.m.Dialog");
jQuery.sap.require("sap.m.Button");
jQuery.sap.require("sap.m.Text");

sap.ui.controller("iUWDemo.controller.masterDetail", {

	onInit: function() {
		sap.ui.core.UIComponent.getRouterFor(this).attachRoutePatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched: function(oEvent) {
		if (oEvent.getParameter("name") !== "masterDetail") {
            return;
        }
		this.submissionId = oEvent.getParameter("arguments").submissionId;
		var swithBtn = sap.ui.getCore().byId(this.createId("swithBtn"));
		swithBtn.setState(true);
		this.premium = oEvent.getParameter("arguments").premium;
		var premiumText = sap.ui.getCore().byId(this.createId("premium"));
		premiumText.setText(this.premium + ".00 RMB");

		var iconTabBar = sap.ui.getCore().byId(this.createId("idIconTabBarNoIcons"));
		iconTabBar.setSelectedKey(this.createId("basicInfo"));
	},

	navPress: function() {
		console.log("navButtonPress");
	},

	switchMultiSelect: function() {
		console.log("switchMultiSelect");
	},

	stateChange : function() {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("bodyPage",{submissionId : this.submissionId},  true);
	},
	
	navBack: function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("submission", null, true);
	},
	
	acceptBtnPress: function(oEvent) {
		var dialog = new sap.m.Dialog({
			title: 'Congratulations~!',
			contentWidth: "20%",
			type: 'Message',
			state: 'Success',
			content: new sap.m.Text({
				text: 'The insurance policy(21318467187187312) is generated, and waiting for the signature from customer.'
					+ '\n'
					+ '\n'
					+ 'Once customer sign the policy via ‘IoT Insurance Platform’, the policy will be effective.'
			}),
			beginButton: new sap.m.Button({
				text: 'OK',
				press: function () {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});

		dialog.open();
		this.getView().byId("status1").setText("Accepted");
		this.getView().byId("status2").setText("Accepted");
		this.getView().byId("status3").setText("Accepted");
		this.getView().byId("status4").setText("Accepted");
		this.getView().byId("status5").setText("Accepted");
	}
});
