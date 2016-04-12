sap.ui.controller("iUWDemo.controller.tile", {

	onInit: function() {

	},

	press: function() {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("submission", null, true);
	}

});