sap.ui.controller("view.myTile", {
        press : function (evt) {
                 var oRouter = sap.ui.core.routing.Router.getRouter("appRouter");
                var oHashChanger = new sap.ui.core.routing.HashChanger();
                oHashChanger.setHash(oRouter.getURL("bodyPage"));
        }
});
