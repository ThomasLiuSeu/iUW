sap.ui.controller("iUWDemo.controller.app", {
    onInit: function() {
        this.toLogin();
    },

    toLogin: function() {
        //sap.ui.core.UIComponent.getRouterFor(this).navTo("Login", null, true);
    	window.location.replace("#/Login");
    }
});