sap.ui.controller("iUWDemo.controller.submission", {

	onInit: function() {

	},
	
	rowClick: function(oEvent) {
		var rowId = oEvent.getSource().getCustomData()[0].getValue("rowId");
		sap.ui.core.UIComponent.getRouterFor(this).navTo("bodyPage", {submissionId: rowId}, true);
	},
	
	navBack: function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("tile", null, true);
	}

});