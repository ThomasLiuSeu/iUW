sap.ui.controller("view.login",{
  performLogin : function  (argument) {
    var oRouter = sap.ui.core.routing.Router.getRouter("appRouter");
    var oHashChanger = new sap.ui.core.routing.HashChanger();
    oHashChanger.setHash(oRouter.getURL("myTile"));
  }
})
