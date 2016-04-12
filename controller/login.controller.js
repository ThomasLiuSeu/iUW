sap.ui.controller("iUWDemo.controller.login", {

	onInit: function() {

	},

	performLogin: function() {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("tile", null, true);
	}

});