/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
sap.ui.controller("sap.apf.modeler.ui.controller.toolbar",{onInit:function(){this.oCoreApi=this.getView().getViewData().oConfigListInstance.oCoreApi;this.oConfigListInstance=this.getView().getViewData().oConfigListInstance;this._setDisplayText();},_setDisplayText:function(){this.byId("idAddButton").setText(this.oCoreApi.getText("addButton"));this.byId("idCopyButton").setText(this.oCoreApi.getText("copyButton"));this.byId("idDeleteButton").setText(this.oCoreApi.getText("deleteButton"));},enableCopyDeleteButton:function(){if(!this.byId("idCopyButton").getEnabled()){this.byId("idCopyButton").setEnabled(true);}if(!this.byId("idDeleteButton").getEnabled()){this.byId("idDeleteButton").setEnabled(true);}},disableCopyDeleteButton:function(){if(this.byId("idCopyButton").getEnabled()){this.byId("idCopyButton").setEnabled(false);}if(this.byId("idDeleteButton").getEnabled()){this.byId("idDeleteButton").setEnabled(false);}},_setAddMenuText:function(){sap.ui.core.Fragment.byId("idAddMenuFragment","idNewConfig").setText(this.oCoreApi.getText("newConfiguration"));sap.ui.core.Fragment.byId("idAddMenuFragment","idNewFacetFilter").setText(this.oCoreApi.getText("newFacetFilter"));sap.ui.core.Fragment.byId("idAddMenuFragment","idNewCategory").setText(this.oCoreApi.getText("newCategory"));sap.ui.core.Fragment.byId("idAddMenuFragment","idNewNavigationTarget").setText(this.oCoreApi.getText("newNavigationTarget"));sap.ui.core.Fragment.byId("idAddMenuFragment","idStep").setText(this.oCoreApi.getText("step"));sap.ui.core.Fragment.byId("idAddMenuFragment","idNewStep").setText(this.oCoreApi.getText("newStep"));sap.ui.core.Fragment.byId("idAddMenuFragment","idExistingStep").setText(this.oCoreApi.getText("existingStep"));sap.ui.core.Fragment.byId("idAddMenuFragment","idNewRepresentation").setText(this.oCoreApi.getText("newRepresentation"));},_setExistingStepDialogText:function(){sap.ui.core.Fragment.byId("idExistingStepDialogFragment","idExistingStepDialog").setTitle(this.oCoreApi.getText("existingStepDialogTitle"));},_enableDisableAddMenuItems:function(s,a){var A=a.getItems();var n;if(this.oConfigListInstance.configurationHandler.getList().length===0||s===null){n="default";}else{n=s.nodeObjectType;}var m={};m["default"]=1;m[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION]=4;m[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER]=4;m[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY]=5;m[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP]=6;m[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION]=6;m[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET]=4;A.forEach(function(M,i){if(i<m[n]){M.setEnabled(true);}else{M.setEnabled(false);}});},_handlePressAddButton:function(e){var s;var S=this;if(this.oConfigListInstance.getView().byId("idConfigDetailData").getContent().length>=1){s=(typeof this.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController==="function")?this.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController():undefined;}e.getSource().$().blur();var n=sap.apf.modeler.ui.utils.navigationHandler.getInstance();var i=(s!==undefined)?(typeof s.getValidationState==="function"?s.getValidationState.call(s):true):true;this.oConfigListInstance.bIsSaved=this.oConfigListInstance.configEditor?this.oConfigListInstance.configEditor.isSaved():undefined;var a=false;var b=function(){var A=e.getSource();var o=this.oConfigListInstance.oTreeInstance.getNodeContext(this.oConfigListInstance.oTreeInstance.getSelection());if(!this.addMenu){this.addMenu=new sap.ui.xmlfragment("idAddMenuFragment","sap.apf.modeler.ui.fragment.addMenu",this);this.getView().addDependent(this.addMenu);this._setAddMenuText();}var c=sap.ui.core.Popup.Dock;this._enableDisableAddMenuItems(o,this.addMenu);this.addMenu.open(false,A,c.BeginTop,c.BeginBottom,A);};if(!i){n.throwMandatoryPopup(S.oConfigListInstance,{yes:function(){var N=S.oConfigListInstance._navMandatoryResetState(S.oConfigListInstance);if(!N.isNewView){b.call(S);}}});a=true;}if(!a){b.call(S);}},_handleAddMenuItemPress:function(e){var i=this.addMenu.getItems();var a=e.getParameters("item");var n;var N={"idAddMenuFragment--idNewFacetFilter":sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER,"idAddMenuFragment--idNewCategory":sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY,"idAddMenuFragment--idNewStep":sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP,"idAddMenuFragment--idNewRepresentation":sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION,"idAddMenuFragment--idNewConfig":sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION,"idAddMenuFragment--idNewNavigationTarget":sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET,"default":sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION};i.forEach(function(I){if(I.getId()===a.id){n=N[I.getId()];}else if(I.getSubmenu()){I.getSubmenu().getItems().forEach(function(I){if(I.getId()===a.id){n=N[I.getId()];}});}});if(a.id==="idAddMenuFragment--idExistingStep"){this._handleAddExistingStepPress();}else if(a.id!=="idAddMenuFragment--idStep"&&n!==undefined){this.oConfigListInstance.oTreeInstance.addNodeInTree(n);}},_copyConfiguration:function(c,n){var C=this.oConfigListInstance.configurationHandler.getConfiguration(c);var o={};o.AnalyticalConfiguration=C.AnalyticalConfiguration;o.name="< "+C.AnalyticalConfigurationName+" >";o.Application=C.Application;o.type=sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION;o.bIsLoaded=false;o.bToggleState=false;o.isSelected=true;o.expanded=true;o.selectable=true;o.hasExpander=true;this.oConfigListInstance.oModel.getData().aConfigDetails.push(o);this.oConfigListInstance.oModel.updateBindings();this.oConfigListInstance.selectedNode=this.oConfigListInstance.oTreeInstance.getNodeByContext(n);var a={appId:this.oConfigListInstance.appId,configId:c};sap.ui.core.UIComponent.getRouterFor(this.oConfigListInstance).navTo(o.type,a);},_handlePressCopyButton:function(e){var s;var S=this;if(this.oConfigListInstance.getView().byId("idConfigDetailData").getContent().length>=1){s=(typeof this.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController==="function")?this.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController():undefined;}e.getSource().$().blur();var n=sap.apf.modeler.ui.utils.navigationHandler.getInstance();var a=(s!==undefined)?(typeof s.getValidationState==="function"?s.getValidationState.call(s):true):true;this.oConfigListInstance.bIsSaved=this.oConfigListInstance.configEditor?this.oConfigListInstance.configEditor.isSaved():undefined;var b=false;var c=function(){var C=this;var g=this.oTreeInstance.getNodeContext(this.oTreeInstance.getSelection()||this.selectedNode);this.selectedNode=this.oTreeInstance.getSelection()||this.selectedNode;var h,k,l,O,p,m,q,r,t,u,v;k=g.nodeContext;switch(g.nodeObjectType){case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER:var F=this.oCoreApi.getText("copyOf")+"  "+g.nodeTitle;var w=this.configEditor.copyFacetFilter(g.nodeAPFId);var x=this.configEditor.getFacetFilter(w);var T=sap.apf.modeler.ui.utils.TranslationFormatMap.FACETFILTER_LABEL;var y=this.oTextPool.setText(F,T);x.setLabelKey(y);O=k.split("/");m=O[2];q=O[6];var z=this.oModel.getData().aConfigDetails[m].configData[0].filters[q];z.isSelected=false;var A=jQuery.extend(true,{},z);A.id=w;A.name="< "+F+" >";A.isSelected=true;l=this.oModel.getData().aConfigDetails[m].configData[0].filters.length;this.oModel.getData().aConfigDetails[m].configData[0].filters.push(A);O[6]=l;h=O.join("/");break;case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY:var B=this.oCoreApi.getText("copyOf")+"  "+g.nodeTitle;var D=this.configEditor.copyCategory(g.nodeAPFId);var E=this.configEditor.getCategory(D);var G=sap.apf.modeler.ui.utils.TranslationFormatMap.CATEGORY_TITLE;var H=this.oTextPool.setText(B,G);var I={labelKey:H};this.configEditor.setCategory(I,D);O=k.split("/");m=O[2];r=O[6];var N=[];var J=this.configEditor.getSteps();J.forEach(function(y1){if(C.configEditor.getCategoriesForStep(y1.getId())[0]===D){N.push(y1.getId());}});var K=this.oModel.getData().aConfigDetails[m].configData[1].categories[r];K.isSelected=false;var L=jQuery.extend(true,{},K);if(L.steps){for(var i=0;i<L.steps.length;i++){L.steps[i].id=N[i];var M=C.configEditor.getStep(N[i]);var P=M.getRepresentations();if(L.steps[i].representations){for(var j=0;j<L.steps[i].representations.length;j++){L.steps[i].representations[j].id=P[j].getId();}}}}L.id=D;L.name="< "+B+" >";L.isSelected=true;l=this.oModel.getData().aConfigDetails[m].configData[1].categories.length;this.oModel.getData().aConfigDetails[m].configData[1].categories.push(L);O[6]=l;h=O.join("/");break;case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET:var Q=this.oCoreApi.getText("copyOf")+"  "+g.nodeTitle;var R=this.configEditor.copyNavigationTarget(g.nodeAPFId);var U=this.configEditor.getNavigationTarget(R);O=k.split("/");m=O[2];t=O[6];var V=this.oModel.getData().aConfigDetails[m].configData[2].navTargets[t];V.isSelected=false;var W=jQuery.extend(true,{},V);W.id=R;W.name="< "+Q+" >";W.isSelected=true;l=this.oModel.getData().aConfigDetails[m].configData[2].navTargets.length;this.oModel.getData().aConfigDetails[m].configData[2].navTargets.push(W);O[6]=l;h=O.join("/");break;case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP:var X=this.oCoreApi.getText("copyOf")+"  "+g.nodeTitle;var Y=this.configEditor.copyStep(g.nodeAPFId);var Z=this.configEditor.getCategoriesForStep(Y);var $=this.configEditor.getStep(Y);var _=sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_TITLE;var a1=this.oTextPool.setText(X,_);$.setTitleId(a1);O=k.split("/");m=O[2];r=O[6];u=O[8];var b1=this.oModel.getData().aConfigDetails[m].configData[1].categories[r].steps[u];b1.isSelected=false;var c1=jQuery.extend(true,{},b1);P=$.getRepresentations();c1.id=Y;c1.name="< "+X+" >";if(c1.representations){for(j=0;j<c1.representations.length;j++){c1.representations[j].id=P[j].getId();}}l=this.oModel.getData().aConfigDetails[m].configData[1].categories[r].steps.length;O[8]=l;h=O.join("/");for(var d1=0;d1<Z.length;d1++){var e1=jQuery.extend(true,{},c1);var f1={arguments:{configId:S.oConfigListInstance.configId,categoryId:Z[d1]}};var g1=S.oConfigListInstance.getSPathFromURL(f1).sPath.split("/");var h1=g1[6];this.oModel.getData().aConfigDetails[m].configData[1].categories[h1].steps.push(e1);}this.oModel.getData().aConfigDetails[m].configData[1].categories[r].steps[l].isSelected=true;break;case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION:O=k.split("/");m=O[2];r=O[6];u=O[8];v=O[10];var i1=this.oModel.getData().aConfigDetails[m].configData[1].categories[r].steps[u].id;var j1=this.configEditor.getStep(i1);var k1=this.configEditor.getCategoriesForStep(i1);this.oModel.getData().aConfigDetails[m].configData[1].categories[r].steps[u].representations[v].isSelected=false;var l1=this.oModel.getData().aConfigDetails[m].configData[1].categories[r].steps[u].representations[v];var m1=jQuery.extend(true,{},l1);var n1=j1.copyRepresentation(m1.id);m1.id=n1;l=this.oModel.getData().aConfigDetails[m].configData[1].categories[r].steps[u].representations.length;O[10]=l;h=O.join("/");for(var o1=0;o1<k1.length;o1++){var p1=jQuery.extend(true,{},m1);var q1={arguments:{configId:S.oConfigListInstance.configId,categoryId:k1[o1],stepId:i1}};var r1=S.oConfigListInstance.getSPathFromURL(q1).sPath.split("/");var s1=r1[6];var t1=r1[8];this.oModel.getData().aConfigDetails[m].configData[1].categories[s1].steps[t1].representations.push(p1);}this.oModel.getData().aConfigDetails[m].configData[1].categories[r].steps[u].representations[l].isSelected=true;break;case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION:var u1=this.oCoreApi.getText("copyOf")+"  "+g.nodeTitle;O=k.split("/");m=O[2];var v1=this.oModel.getData().aConfigDetails[m];v1.isSelected=false;O[2]=this.oModel.getData().aConfigDetails.length;h=O.join("/");this.configurationHandler.copyConfiguration(g.nodeAPFId,function(y1){var z1={AnalyticalConfigurationName:u1};var A1=C.configurationHandler.setConfiguration(z1,y1);C.configTitle=u1;C.configurationHandler.loadConfiguration(A1,function(B1){var u1=C.configTitle;var C1=sap.apf.modeler.ui.utils.TranslationFormatMap.APPLICATION_TITLE;var D1=C.configurationHandler.getTextPool().setText(u1,C1);B1.setApplicationTitle(D1);});S._copyConfiguration(y1,h);});case"default":break;}if(g.nodeObjectType!==sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION){this.oModel.updateBindings();this.selectedNode=this.oTreeInstance.getNodeByContext(h);var w1=this.oTreeInstance.getNodeContext(this.selectedNode);var x1=this.oTreeInstance.getParentNodeContext(w1);this.navigateToDifferntView(x1,w1);this.configEditor.setIsUnsaved();}};var d=function(){var g=new sap.m.Label().addStyleClass("noConfigSelected");g.setText(S.oConfigListInstance.oCoreApi.getText("noConfigSelected"));g.placeAt(S.oConfigListInstance.byId("idConfigDetailData"));S.oConfigListInstance.toolbarController.disableCopyDeleteButton();S.oConfigListInstance.disableExportButton();};var o;if(!a){n.throwMandatoryPopup(S.oConfigListInstance,{yes:function(){S.oConfigListInstance.bIsDifferntConfig=S.oConfigListInstance.oTreeInstance.isConfigurationSwitched(S.oConfigListInstance.oPreviousSelectedNode,S.oConfigListInstance.selectedNode);if(S.oConfigListInstance.bIsDifferntConfig===false){var r=S.oConfigListInstance.getRouteContext(S.oConfigListInstance.oParentNodeDetails);var s=(typeof S.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController==="function")?S.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController():undefined;var i=S.oConfigListInstance._isNewSubView(s.oViewData.oParams);if(!i){var p=S.oConfigListInstance.getSPathForConfig(S.oConfigListInstance.configId);c.call(S.oConfigListInstance);S.oConfigListInstance._navHandleExpandDelete.call(S.oConfigListInstance,S.oConfigListInstance.oSelectedNodeDetails,r);}else{S.oConfigListInstance.handleConfirmDeletion();}}else{var N=S.oConfigListInstance._navMandatoryResetState(S.oConfigListInstance);if(!N.isNewView){if(!N.bIsSaved){o(S.oConfigListInstance);}else{c.call(S.oConfigListInstance);}}}}});b=true;}var f;if(s.oViewData.oParams.name==="configuration"){f=true;}o=function(g){n.throwLossOfDataPopup(g,{yes:function(h){S.oConfigListInstance._navSaveState(function(){h(function(i){if(S.oConfigListInstance.selectedNode){var B=S.oConfigListInstance.selectedNode.getBindingContext().sPath;var C=B.split("/");var j=C[2];}S.oConfigListInstance.oModel.getData().aConfigDetails[j].AnalyticalConfiguration=S.oConfigListInstance.configId;S.oConfigListInstance.oModel.updateBindings();c.call(S.oConfigListInstance);});});},no:function(){var g={appId:S.oConfigListInstance.appId,configId:S.oConfigListInstance.configId};var s=(typeof S.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController==="function")?S.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController():undefined;var f=(s.oViewData.oParams.name==="configuration")?true:false;if(S.oConfigListInstance.configId.indexOf(sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.ISNEWCONFIG)===0){S.oConfigListInstance._navHandleExpandDelete.call(S.oConfigListInstance,{},g,f);S.oConfigListInstance.clearTitleAndBreadCrumb();S.oConfigListInstance.byId("idConfigDetailData").removeAllContent();d();}else{S.oConfigListInstance._navConfigResetState(S.oConfigListInstance,function(){c.call(S.oConfigListInstance);});}}});};if(!S.oConfigListInstance.bIsSaved&&a&&f){o(S.oConfigListInstance);b=true;}if(!b){c.call(S.oConfigListInstance);}},_handlePressDeleteButton:function(e){var d;var s=this.oConfigListInstance.oTreeInstance.getNodeContext(this.oConfigListInstance.oTreeInstance.getSelection());var n=this.oCoreApi.getText(s.nodeObjectType);e.getSource().$().blur();if(s.nodeObjectType===sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP){d=this.oCoreApi.getText("confirmStepDeletion",[s.nodeTitle]);}else{d=this.oCoreApi.getText("confirmDeletion",[n,s.nodeTitle]);}this._openDeleteConfirmationDialog(d);},_openDeleteConfirmationDialog:function(d){var s=this;var c=jQuery.extend(s.oConfigListInstance,{closeDialog:s.closeDialog.bind(s)});if(!this.confirmationDialog){this.confirmationDialog=sap.ui.xmlfragment("idConfigConfirmationDialogFragment","sap.apf.modeler.ui.fragment.confirmationDialog",c);this.getView().addDependent(this.confirmationDialog);this._setConfirmationDialogText();}var a=new sap.m.Label();a.addStyleClass("dialogText");a.setText(d);this.confirmationDialog.removeAllContent();this.confirmationDialog.addContent(a);jQuery.sap.syncStyleClass("sapUiSizeCompact",this.getView(),this.confirmationDialog);this.confirmationDialog.open();},closeDialog:function(){if(this.confirmationDialog&&this.confirmationDialog.isOpen()){this.confirmationDialog.close();}},_setConfirmationDialogText:function(){sap.ui.core.Fragment.byId("idConfigConfirmationDialogFragment","idDeleteConfirmation").setTitle(this.oCoreApi.getText("confirmation"));sap.ui.core.Fragment.byId("idConfigConfirmationDialogFragment","idDeleteButton").setText(this.oCoreApi.getText("deleteButton"));sap.ui.core.Fragment.byId("idConfigConfirmationDialogFragment","idCancelButtonDialog").setText(this.oCoreApi.getText("cancel"));},_handlePressMoveUpButton:function(){this.bIsDown=false;var s=this.oConfigListInstance.oTreeInstance.getSelection();if(s!==null){var a=this.oConfigListInstance.oTreeInstance.getNodeContext(s);if(a!==undefined){this._moveUpOrDown(a,this.bIsDown);}}},_handlePressMoveDownButton:function(){this.bIsDown=true;var s=this.oConfigListInstance.oTreeInstance.getSelection();if(s!==null){var a=this.oConfigListInstance.oTreeInstance.getNodeContext(s);if(a!==undefined){this._moveUpOrDown(a,this.bIsDown);}}},_moveUpOrDown:function(s,i){var a=s.nodeObjectType;var b=s.nodeAPFId;var n=s.nodeContext;var c=n.split('/')[2];var o,d,t,T,l;var S=false;var e=n.split('/')[n.split('/').length-1];switch(a){case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER:o=this.oConfigListInstance.oModel.getData().aConfigDetails[c].configData[0].filters;l=o.length;if(i){if(parseInt(e,10)!==(l-1)){this.oConfigListInstance.configEditor.moveFacetFilterUpOrDown(b,1);d=parseInt(e,10)+1;S=true;}}else{if(parseInt(e,10)!==0){this.oConfigListInstance.configEditor.moveFacetFilterUpOrDown(b,-1);d=parseInt(e,10)-1;S=true;}}break;case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY:o=this.oConfigListInstance.oModel.getData().aConfigDetails[c].configData[1].categories;l=o.length;if(i){if(parseInt(e,10)!==(l-1)){this.oConfigListInstance.configEditor.moveCategoryUpOrDown(b,1);d=parseInt(e,10)+1;S=true;}}else{if(parseInt(e,10)!==0){this.oConfigListInstance.configEditor.moveCategoryUpOrDown(b,-1);d=parseInt(e,10)-1;S=true;}}break;case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET:o=this.oConfigListInstance.oModel.getData().aConfigDetails[c].configData[2].navTargets;l=o.length;if(i){if(parseInt(e,10)!==(l-1)){this.oConfigListInstance.configEditor.moveNavigationTargetUpOrDown(b,1);d=parseInt(e,10)+1;S=true;}}else{if(parseInt(e,10)!==0){this.oConfigListInstance.configEditor.moveNavigationTargetUpOrDown(b,-1);d=parseInt(e,10)-1;S=true;}}break;case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP:var f=n.split('/')[6];var g=this.oConfigListInstance.oModel.getData().aConfigDetails[c].configData[1].categories[f];o=g.steps;l=o.length;if(i){if(parseInt(e,10)!==(l-1)){this.oConfigListInstance.configEditor.moveCategoryStepAssignmentUpOrDown(g.id,b,1);d=parseInt(e,10)+1;S=true;}}else{if(parseInt(e,10)!==0){this.oConfigListInstance.configEditor.moveCategoryStepAssignmentUpOrDown(g.id,b,-1);d=parseInt(e,10)-1;S=true;}}break;case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION:var h=this.oConfigListInstance.oTreeInstance.getSelection();var j=sap.ui.getCore().byId(h.getId());var k=j.getParent();var m=this.oConfigListInstance.oTreeInstance.getNodeContext(k).nodeAPFId;var p=this.oConfigListInstance.configEditor.getStep(m);f=n.split('/')[6];var q=n.split('/')[8];o=this.oConfigListInstance.oModel.getData().aConfigDetails[c].configData[1].categories[f].steps[q].representations;l=o.length;if(i){if(parseInt(e,10)!==(l-1)){p.moveRepresentationUpOrDown(b,1);d=parseInt(e,10)+1;S=true;}}else{if(parseInt(e,10)!==0){p.moveRepresentationUpOrDown(b,-1);d=parseInt(e,10)-1;S=true;}}break;}if(S){t=o[e];T=o[d];o[d]=t;o[e]=T;this.oConfigListInstance.oModel.updateBindings();this.oConfigListInstance.configEditor.setIsUnsaved();}},_handleAddExistingStepPress:function(){var s=this;var a=this.oConfigListInstance.oTreeInstance.getNodeContext(this.oConfigListInstance.oTreeInstance.getSelection());var c=this.oConfigListInstance.oTreeInstance.getParentNodeContext(a).categoryId;var S=this.oConfigListInstance.configEditor.getStepsNotAssignedToCategory(c);var b;var d=[];S.forEach(function(e){var o={};var f=s.oConfigListInstance.configEditor.getStep(e);b=s.oConfigListInstance.oTextPool.get(f.getTitleId()).TextElementDescription;o.id=e;o.name=b;d.push(o);});var m=new sap.ui.model.json.JSONModel({existingStepData:d});if(!this.addExistingStepDialog){this.addExistingStepDialog=sap.ui.xmlfragment("idExistingStepDialogFragment","sap.apf.modeler.ui.fragment.existingStepDialog",this);this._setExistingStepDialogText();}this.getView().addDependent(this.addExistingStepDialog);this.addExistingStepDialog.setModel(m);this.addExistingStepDialog.open();},_handleExistingStepDialogOK:function(e){var s=this;var n=sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP;var a=e.getParameters("listItem").selectedItems;var b=a.length;var c=this.oConfigListInstance.oTreeInstance.getNodeContext(this.oConfigListInstance.oTreeInstance.getSelection());var d=this.oConfigListInstance.oTreeInstance.getParentNodeContext(c).categoryId;var E=[];for(var i=0;i<b;i++){var p=e.getParameters("selectedItems").selectedContexts[i].sPath.split('/')[2];var o=e.getSource().getModel().getData().existingStepData[p];var f=this.oConfigListInstance.configEditor.getStep(o.id);this.oConfigListInstance.configEditor.addCategoryStepAssignment(d,o.id);var r=f.getRepresentations();var g=r.length;var R=[];for(var j=0;j<g;j++){var h={};h.id=r[j].getId();h.name=r[j].getRepresentationType();h.icon=this._getRepresentationIcon(h.name);R.push(h);}var S={};S.step=o;S.representations=R;S.noOfReps=g;E.push(S);}if(b!==0){var k={noOfSteps:b,aExistingStepsToBeAdded:E};this.oConfigListInstance.oTreeInstance.addNodeInTree(n,k);}},_getRepresentationIcon:function(r){var i;var R=this.oCoreApi.getRepresentationTypes();for(var a=0;a<R.length;a++){if(r===R[a].id){i=R[a].picture;break;}}return i;},_handleExistingStepDialogSearch:function(e){var v=e.getParameter("value");var f=new sap.ui.model.Filter("name",sap.ui.model.FilterOperator.Contains,v);var b=e.getSource().getBinding("items");b.filter([f]);},_handleExistingStepDialogClose:function(e){if(this.addExistingStepDialog){e.getSource().getBinding("items").filter([]);}}});
