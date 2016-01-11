/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.require('sap.apf.modeler.ui.utils.helper');sap.ui.controller("sap.apf.modeler.ui.controller.applicationList",{onInit:function(){var v=this.getView();v.addStyleClass("sapUiSizeCompact");this._addApplicationStyleClass();var c=this.getOwnerComponent();if(c!==undefined){this.oCoreApi=c.oCoreApi;this._setDisplayText();var s=this;this.oCoreApi.getApplicationHandler(function(A){s.applicationHandler=A;s._updateAppList();});}this.oModel=new sap.ui.model.json.JSONModel({});this.oModel.setSizeLimit(1000);this.bIsEditMode=false;this.byId("idAppDescription").attachBrowserEvent("click",this.navToConfigList().fn);this.byId("idSemanticObject").attachBrowserEvent("click",this.navToConfigList().fn);var a=v.byId("idApplicationTable");var b=v.byId("idAppListScrollContainer");b.addEventDelegate({onAfterRendering:function(){var w=jQuery(v.byId("idAppPage").getDomRef()).width();var h=jQuery(window).height();var d=jQuery(v.byId("idAppTitle").getDomRef()).height()+32;var e=jQuery(v.byId("idApplicationToolbar").getDomRef()).height();var f=jQuery(v.byId("idAppPage").getDomRef()).find("header").height();var g=jQuery(v.byId("idAppPage").getDomRef()).find("footer").height();var o;if(e>0){o=d+e+f+g+25;}else{o=270;}b.setHeight(h-o+"px");b.setWidth("100%");sap.apf.modeler.ui.utils.helper.onResize(function(){if(jQuery(s.getView().getDomRef()).css("display")==="block"){w=jQuery(v.byId("idAppPage").getDomRef()).width();h=jQuery(v.byId("idAppPage").getDomRef()).height();b.setHeight(h-o+"px");b.setWidth("100%");}});sap.ui.core.UIComponent.getRouterFor(s).attachRoutePatternMatched(function(E){if(E.getParameter("name")==="applicationList"){w=jQuery(v.getDomRef()).width();h=jQuery(v.getDomRef()).height();b.setHeight(h-o+"px");b.setWidth("100%");}});}});},_setDisplayText:function(){this.byId("idAppPage").setTitle(this.oCoreApi.getText("configModelerTitle"));this.byId("idAppTitle").setText(this.oCoreApi.getText("applicationOverview"));this.byId("idAppNumberTitle").setText(this.oCoreApi.getText("applications"));this.byId("idDescriptionLabel").setText(this.oCoreApi.getText("description"));this.byId("idSemanticObjectLabel").setText(this.oCoreApi.getText("semanticObject"));this.byId("idEditButton").setText(this.oCoreApi.getText("edit"));this.byId("idSaveButton").setText(this.oCoreApi.getText("save"));this.byId("idCancelButton").setText(this.oCoreApi.getText("cancel"));this.byId("idTextCleanupButton").setText(this.oCoreApi.getText("textCleanUp"));this.byId("idImportButton").setText(this.oCoreApi.getText("import"));this.byId("idNewButton").setTooltip(this.oCoreApi.getText("newApplication"));},_addConfigStyleClass:function(){sap.ui.core.Fragment.byId("idImportConfigurationFragment","idJsonFileLabel").addStyleClass("overwriteConfirmationDialogLabels");sap.ui.core.Fragment.byId("idImportConfigurationFragment","idTextFileLabel").addStyleClass("overwriteConfirmationDialogLabels");},_setOverwriteConfirmationDialogText:function(){sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idOverwriteConfirmationDialog").setTitle(this.oCoreApi.getText("warning"));sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idConfirmationMessage").setText(this.oCoreApi.getText("overwriteConfirmationMsg"));sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idConfirmationMessage").addStyleClass("dialogText");sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idYesButton").setText(this.oCoreApi.getText("yes"));sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idNoButton").setText(this.oCoreApi.getText("no"));},_setImportConfigDialogText:function(){sap.ui.core.Fragment.byId("idImportConfigurationFragment","idImportConfigDialog").setTitle(this.oCoreApi.getText("importConfig"));sap.ui.core.Fragment.byId("idImportConfigurationFragment","idJsonFileLabel").setText(this.oCoreApi.getText("jsonFile"));sap.ui.core.Fragment.byId("idImportConfigurationFragment","idJsonFileUploader").setPlaceholder(this.oCoreApi.getText("jsonFileInputPlaceHolder"));sap.ui.core.Fragment.byId("idImportConfigurationFragment","idTextFileLabel").setText(this.oCoreApi.getText("textFile"));sap.ui.core.Fragment.byId("idImportConfigurationFragment","idTextFileUploader").setPlaceholder(this.oCoreApi.getText("textFileInputPlaceHolder"));sap.ui.core.Fragment.byId("idImportConfigurationFragment","idUploadOfConfig").setText(this.oCoreApi.getText("upload"));sap.ui.core.Fragment.byId("idImportConfigurationFragment","idCancelImportOfConfig").setText(this.oCoreApi.getText("cancel"));},_setConfirmationDialogText:function(){sap.ui.core.Fragment.byId("idConfirmationDialogFragment","idDeleteConfirmation").setTitle(this.oCoreApi.getText("confirmation"));sap.ui.core.Fragment.byId("idConfirmationDialogFragment","idDeleteButton").setText(this.oCoreApi.getText("deleteButton"));sap.ui.core.Fragment.byId("idConfirmationDialogFragment","idCancelButtonDialog").setText(this.oCoreApi.getText("cancel"));},_setNewApplicationText:function(){sap.ui.core.Fragment.byId("idAddNewApplicationFragment","idNewApp").setTitle(this.oCoreApi.getText("newApplication"));sap.ui.core.Fragment.byId("idAddNewApplicationFragment","idDescriptionLabelApp").setText("*"+this.oCoreApi.getText("description"));sap.ui.core.Fragment.byId("idAddNewApplicationFragment","idSemanticObjectLabelApp").setText(this.oCoreApi.getText("semanticObject"));sap.ui.core.Fragment.byId("idAddNewApplicationFragment","idSaveButtonApp").setText(this.oCoreApi.getText("save"));sap.ui.core.Fragment.byId("idAddNewApplicationFragment","idCancelButtonApp").setText(this.oCoreApi.getText("cancel"));},_addApplicationStyleClass:function(){this.byId("idAppNumberTitle").addStyleClass("appCountLabel");this.byId("idAppDescription").addStyleClass("cursor");this.byId("idSemanticObject").addStyleClass("cursor");this.byId("idNewButton").addStyleClass("newButton");this.byId("idAppListScrollContainer").addStyleClass("applicationListScroll");this.byId("idNoOfConfig").addStyleClass("applicationCount");this.byId("idAppTitle").addStyleClass("applicationTitle");this.byId("idApplicationToolbar").addStyleClass("applicationTitleLayout");},_updateAppList:function(){var a=this.applicationHandler.getList();var b=a.length;var A=[];a.forEach(function(c){var o={};o.id=c.Application;o.description=c.ApplicationName;o.semanticObject=c.SemanticObject;A.push(o);});var j={appCount:"("+b+")",tableData:A};if(this.oModel!==undefined){this.oModel.setSizeLimit(1000);this.oModel.setData(j);this.getView().setModel(this.oModel);}},_enableDisplayMode:function(){this.bIsEditMode=false;this.byId("idEditButton").setVisible(true);this.byId("idSaveButton").setVisible(false);this.byId("idSaveButton").setEnabled(false);this.byId("idTextCleanupButton").setEnabled(false);this.byId("idCancelButton").setVisible(false);this.byId("idTextCleanupButton").setVisible(false);this.byId("idApplicationTable").setMode("None");var i=this.byId("idApplicationTable").getItems();i.forEach(function(a){a.setType("Navigation");a.getCells()[0].setEditable(false);a.getCells()[1].setEditable(false);a.getCells()[2].setVisible(false);});this._updateAppList();},enableEditMode:function(){this.bIsEditMode=true;this.byId("idEditButton").setVisible(false);this.byId("idSaveButton").setVisible(true);this.byId("idCancelButton").setVisible(true);this.byId("idTextCleanupButton").setVisible(true);this.byId("idApplicationTable").setMode("SingleSelectMaster");var i=this.byId("idApplicationTable").getItems();if(i.length!==0){i.forEach(function(a){a.getCells()[0].setEditable(true);a.getCells()[1].setEditable(true);a.getCells()[2].setVisible(true);a.setType("Inactive");});}},handleDeletePress:function(e){var p=e.getSource().getBindingContext().getPath().split("/")[2];var r=this.getView().getModel().getData().tableData[p].id;var c=new sap.ui.core.CustomData({value:{removeId:r,sPath:p}});if(!this.confirmationDialog){this.confirmationDialog=sap.ui.xmlfragment("idConfirmationDialogFragment","sap.apf.modeler.ui.fragment.confirmationDialog",this);this.getView().addDependent(this.confirmationDialog);this._setConfirmationDialogText();}var a=new sap.m.Label();a.addStyleClass("dialogText");a.setText(this.oCoreApi.getText("deleteApp"));this.confirmationDialog.removeAllContent();this.confirmationDialog.addContent(a);this.confirmationDialog.removeAllCustomData();this.confirmationDialog.addCustomData(c);jQuery.sap.syncStyleClass("sapUiSizeCompact",this.getView(),this.confirmationDialog);this.confirmationDialog.open();},handleConfirmDeletion:function(){var r=this.confirmationDialog.getCustomData()[0].getValue().removeId;if(r!==undefined){var s=this;this.applicationHandler.removeApplication(r,function(R,m,a){if(a===undefined&&(typeof R==="string")){s.confirmationDialog.close();s._updateAppList();s.enableEditMode();}else{var M=s.oCoreApi.createMessageObject({code:"12001"});M.setPrevious(a);s.oCoreApi.putMessage(M);}});}},closeDialog:function(){if(this.confirmationDialog.isOpen()){this.confirmationDialog.close();}},handleSavePress:function(){var s=this;var j;var u=[];var a=this.applicationHandler.getList();var t=this.getView().getModel().getData().tableData;for(j=0;j<a.length;j++){if(t[j].description!==a[j].ApplicationName||t[j].semanticObject!==a[j].SemanticObject){u.push(t[j]);}}u.forEach(function(b){var c={ApplicationName:b.description,SemanticObject:b.semanticObject};s.applicationHandler.setAndSave(c,function(r,m,d){if(d===undefined&&(typeof r==="string")){s._enableDisplayMode();}else{var M=s.oCoreApi.createMessageObject({code:"12000"});M.setPrevious(d);s.oCoreApi.putMessage(M);}},b.id);});},handleCancelPress:function(){var j;var u=[];var a=this.applicationHandler.getList();var t=this.getView().getModel().getData().tableData;for(j=0;j<a.length;j++){if(t[j].description!==a[j].ApplicationName||t[j].semanticObject!==a[j].SemanticObject){u.push(t[j]);}}if(u.length!==0){this.unsavedDataConfirmationDialog=sap.ui.xmlfragment("idMessageDialogFragment","sap.apf.modeler.ui.fragment.messageDialog",this);this.getView().addDependent(this.unsavedDataConfirmationDialog);this._setUnsavedDataConfirmationDialogText();jQuery.sap.syncStyleClass("sapUiSizeCompact",this.getView(),this.unsavedDataConfirmationDialog);this.unsavedDataConfirmationDialog.open();}else{this._enableDisplayMode();}},_handleNavigationWithSave:function(){this.handleSavePress();if(this.unsavedDataConfirmationDialog.isOpen()){this.unsavedDataConfirmationDialog.close();this.unsavedDataConfirmationDialog.destroy();}},_handleNavigateWithoutSave:function(){if(this.unsavedDataConfirmationDialog.isOpen()){this.unsavedDataConfirmationDialog.close();this.unsavedDataConfirmationDialog.destroy();}this._enableDisplayMode();},_handlePreventNavigation:function(){if(this.unsavedDataConfirmationDialog.isOpen()){this.unsavedDataConfirmationDialog.close();this.unsavedDataConfirmationDialog.destroy();}},_setUnsavedDataConfirmationDialogText:function(){sap.ui.core.Fragment.byId("idMessageDialogFragment","idMessageDialog").setTitle(this.oCoreApi.getText("confirmation"));sap.ui.core.Fragment.byId("idMessageDialogFragment","idYesButton").setText(this.oCoreApi.getText("yes"));sap.ui.core.Fragment.byId("idMessageDialogFragment","idNoButton").setText(this.oCoreApi.getText("no"));sap.ui.core.Fragment.byId("idMessageDialogFragment","idCancelButton").setText(this.oCoreApi.getText("cancel"));var c=new sap.m.Label();c.addStyleClass("dialogText");c.setText(this.oCoreApi.getText("unsavedConfiguration"));this.unsavedDataConfirmationDialog.removeAllContent();this.unsavedDataConfirmationDialog.addContent(c);},handleListItemSelect:function(e){var b=e.getParameter("listItem").getBindingContext().getPath().split("/")[2];this.appId=this.getView().getModel().getData().tableData[b].id;this.byId("idTextCleanupButton").setEnabled(true);},handleListItemPress:function(e){var b=e.getParameter("listItem").getBindingContext().getPath().split("/")[2];var a=this.getView().getModel().getData().tableData[b].id;sap.ui.core.UIComponent.getRouterFor(this).navTo("configurationList",{appId:a});},onLiveChange:function(){this.byId("idSaveButton").setEnabled(true);},addNewApplication:function(){if(!this.addNewItemDialog){this.addNewItemDialog=sap.ui.xmlfragment("idAddNewApplicationFragment","sap.apf.modeler.ui.fragment.newApplication",this);this.getView().addDependent(this.addNewItemDialog);this._setNewApplicationText();}this.addNewItemDialog.getContent()[0].getContent()[1].setValue("");this.addNewItemDialog.getContent()[0].getContent()[3].setValue("FioriApplication");this.addNewItemDialog.getBeginButton().setEnabled(false);jQuery.sap.syncStyleClass("sapUiSizeCompact",this.getView(),this.addNewItemDialog);this.addNewItemDialog.open();},applicationDescChange:function(e){this.isAppDesc=e.getParameters().value!==""?true:false;if(this.isAppDesc){this.addNewItemDialog.getBeginButton().setEnabled(true);}else{this.addNewItemDialog.getBeginButton().setEnabled(false);}},closeNewAppDialog:function(){if(this.addNewItemDialog.isOpen()){this.addNewItemDialog.close();}},handleSaveDialogPress:function(){var s=this;var d=this.getView().getDependents();var a={};d.forEach(function(D){if(D.sId==="idAddNewApplicationFragment--idNewApp"){a.ApplicationName=D.getContent()[0].getContent()[1].getValue()!==""?D.getContent()[0].getContent()[1].getValue():undefined;a.SemanticObject=D.getContent()[0].getContent()[3].getValue()!==""?D.getContent()[0].getContent()[3].getValue():undefined;}});this.applicationHandler.setAndSave(a,function(r,m,b){if(b===undefined&&(typeof r==="string")){s._enableDisplayMode();s.byId('idApplicationTable').rerender();var c=s.byId('idApplicationTable').getItems()[s.byId('idApplicationTable').getItems().length-1].$();if(c.length!==0){c[0].scrollIntoView();}s.addNewItemDialog.close();}else{var M=s.oCoreApi.createMessageObject({code:"12000"});M.setPrevious(b);s.oCoreApi.putMessage(M);}});},handleImportButtonPress:function(){if(!this.importConfigurationDialog){this.importConfigurationDialog=sap.ui.xmlfragment("idImportConfigurationFragment","sap.apf.modeler.ui.fragment.importConfiguration",this);this.getView().addDependent(this.importConfigurationDialog);this._setImportConfigDialogText();this._addConfigStyleClass();}sap.ui.core.Fragment.byId("idImportConfigurationFragment","idJsonFileUploader").setValue("");sap.ui.core.Fragment.byId("idImportConfigurationFragment","idTextFileUploader").setValue("");jQuery.sap.syncStyleClass("sapUiSizeCompact",this.getView(),this.importConfigurationDialog);this.importConfigurationDialog.open();},handleUploadOfConfig:function(){this.oJSONFileUploader=sap.ui.core.Fragment.byId("idImportConfigurationFragment","idJsonFileUploader");this.oTextPropertyFileUploader=sap.ui.core.Fragment.byId("idImportConfigurationFragment","idTextFileUploader");if((this.oJSONFileUploader.getValue()&&this.oTextPropertyFileUploader.getValue())||this.oJSONFileUploader.getValue()){this.oJSONFileUploader.upload();}else{this.oTextPropertyFileUploader.upload();}},addAcceptAttribute:function(){var j=jQuery("#idImportConfigurationFragment--idJsonFileUploader-fu");var p=jQuery("#idImportConfigurationFragment--idTextFileUploader-fu");j.attr('accept','.json');p.attr('accept','.properties');},closeImportConfigDialog:function(){if(this.importConfigurationDialog.isOpen()){this.importConfigurationDialog.close();}},handleJSONFileUploadComplete:function(e){var s=this;var m=this.oCoreApi.getText("errorReadingJSONFile");var f=e.getSource().oFileUpload.files[0];if(f){var r=new FileReader();r.readAsText(f,"UTF-8");r.onload=function(a){s.parsedConfigString=JSON.parse(a.target.result);s.appIdFromConfigFile=s.parsedConfigString.configHeader.Application;s._importConfigurationFile(s.parsedConfigString);};r.onerror=function(){sap.m.MessageToast.show(m);};}this.importConfigurationDialog.close();},handleTextFileUploadComplete:function(e){var s=this;var m=this.oCoreApi.getText("errorReadingPropertiesFile");var a=this.oCoreApi.getText("asyncMsg");var f=e.getSource().oFileUpload.files[0];if(f){var r=new FileReader();r.readAsText(f,"UTF-8");r.onload=function(b){var l=b.target.result.split(/\r?\n/);var c=l.length;var d,i;for(i=0;i<c;i++){d=/^\#\s*ApfApplicationId=[0-9A-F]+\s*$/.exec(l[i]);if(d!==null){s.appIdFromTextFile=l[i].split('=')[1];}}var E;for(i=0;i<s.applicationHandler.getList().length;i++){if(s.appIdFromTextFile===s.applicationHandler.getList()[i].Application){E=true;break;}else{E=false;}}if(!E&&!s.oJSONFileUploader.getValue()){sap.m.MessageToast.show("chooseJsonFile");}else if(s.oJSONFileUploader.getValue()){if(s.appIdFromConfigFile&&s.appIdFromTextFile&&s.appIdFromTextFile!==s.appIdFromConfigFile){sap.m.MessageToast.show(a);}else{s._importPropertiesFile(b.target.result);}}else if(E&&!s.oJSONFileUploader.getValue()){s._importPropertiesFile(b.target.result);}};r.onerror=function(){sap.m.MessageToast.show(m);};}this.importConfigurationDialog.close();},_importConfigurationFile:function(p){var s=this;var a=this.oCoreApi.getText("successsMsgForConfigFileImport");this.oCoreApi.importConfiguration(JSON.stringify(p),function(b,d){s.callbackOverwrite=b;s.callbackCreateNew=d;s._openConfirmationDialog();},c);function c(b,m,d){if(d===undefined){s._updateAppList();sap.m.MessageToast.show(a);if(s.oTextPropertyFileUploader.getValue()){s.oTextPropertyFileUploader.upload();}}else{var M=s.oCoreApi.createMessageObject({code:"12002"});M.setPrevious(d);s.oCoreApi.putMessage(M);}}},_importPropertiesFile:function(p){var s=this;var a=this.oCoreApi.getText("successsMsgForPropertyFileImport");this.oCoreApi.importTexts(p,function(m){if(m===undefined){sap.m.MessageToast.show(a);}else{var M=s.oCoreApi.createMessageObject({code:"12003"});M.setPrevious(m);s.oCoreApi.putMessage(M);}});},handleTypeMissmatchForJSONFile:function(){var m=this.oCoreApi.getText("jsonFileMissmatch");sap.m.MessageToast.show(m);},handleTypeMissmatchForPropertiesFile:function(){var m=this.oCoreApi.getText("propertiesFileMissmatch");sap.m.MessageToast.show(m);},_openConfirmationDialog:function(){if(!this.overwriteConfirmationDialog){this.overwriteConfirmationDialog=sap.ui.xmlfragment("idOverwriteConfirmationFragment","sap.apf.modeler.ui.fragment.overwriteConfirmation",this);this.getView().addDependent(self.overwriteConfirmationDialog);this._setOverwriteConfirmationDialogText();}jQuery.sap.syncStyleClass("sapUiSizeCompact",this.getView(),this.overwriteConfirmationDialog);this.overwriteConfirmationDialog.open();},handleConfirmOverwriting:function(){this.callbackOverwrite();this.overwriteConfirmationDialog.close();},handleNoButtonPress:function(){this.callbackCreateNew();this.overwriteConfirmationDialog.close();},handleTextCleanUpPress:function(){var s=this;this.oCoreApi.getConfigurationHandler(this.appId,function(c){s.oTextPool=c.getTextPool();s.oCoreApi.getUnusedTextKeys(s.appId,function(u,m){if(m===undefined){s.oTextPool.removeTexts(u,function(m){if(m===undefined){var a=s.oCoreApi.getText("successtextCleanup");sap.m.MessageToast.show(a,{width:"20em"});}});}else{var M=s.oCoreApi.createMessageObject({code:"12000"});M.setPrevious(m);s.oCoreApi.putMessage(M);}});});},navToConfigList:function(){var s=this;return{fn:function(){if(!s.bIsEditMode){var b=this.getBindingContext().getPath().split("/")[2];var a=s.getView().getModel().getData().tableData[b].id;sap.ui.core.UIComponent.getRouterFor(s).navTo("configurationList",{appId:a});}}};}});
