/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.controller("sap.apf.ui.reuse.controller.stepContainer",{onInit:function(){this.oCoreApi=this.getView().getViewData().oCoreApi;this.oUiApi=this.getView().getViewData().uiApi;},drawSelectionContainer:function(){this.getView().getStepToolbar().getController().showSelectionCount();},resizeContent:function(){if(this.oCoreApi.getActiveStep()){if(this.oCoreApi.getActiveStep().getSelectedRepresentation().type===sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION){this.drawStepContent();var s=((window.innerHeight-jQuery('.tableWithoutHeaders').offset().top)-20)+"px";jQuery('.tableWithoutHeaders').css({"height":s});}else{this.drawStepContent();}}},onAfterRendering:function(){var s=this;var t;jQuery(window).resize(function(){clearTimeout(t);t=setTimeout(function(){s.resizeContent();},500);});},getCurrentRepresentation:function(){return this.representationInstance;},drawRepresentation:function(){var s=this;var a=this.oCoreApi.getActiveStep();if(a.getSelectedRepresentation().bIsAlternateView===undefined||a.getSelectedRepresentation().bIsAlternateView===false){this.representationInstance=a.getSelectedRepresentation();}else{this.representationInstance=a.getSelectedRepresentation().toggleInstance;var d=a.getSelectedRepresentation().getData(),m=a.getSelectedRepresentation().getMetaData();this.representationInstance.setData(d,m);}var l=a.longTitle&&!this.oCoreApi.isInitialTextKey(a.longTitle.key)?a.longTitle:undefined;var t=l||a.title;var S=this.oCoreApi.getTextNotHtmlEncoded(t);var c=this.representationInstance.getMainContent(S);var b=this.getView().getStepToolbar().chartToolbar.getId();this.setHeightAndWidth=function(){var e;var f;if(jQuery("#"+b).length!==0){e=jQuery("#"+b+" > div:first-child > div:nth-child(2)").offset().top;f=jQuery("#"+b+" > div:first-child > div:nth-child(2)").width();}else{e="0";f=jQuery(window).width();}var g=s.getView().getStepToolbar().chartToolbar.getFullScreen()?(jQuery(window).height()-e):(jQuery(window).height()-e)-jQuery(".applicationFooter").height();var h=f;if(s.oCoreApi.getActiveStep().getSelectedRepresentation().bIsAlternateView||s.oCoreApi.getActiveStep().getSelectedRepresentation().type===sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION){c.getContent()[0].setHeight((g-5)+"px");c.getContent()[0].setWidth(h+"px");}else if(s.oCoreApi.getActiveStep().getSelectedRepresentation().type===sap.apf.ui.utils.CONSTANTS.representationTypes.GEO_MAP){var i=(jQuery(c.getContent())[0]);i.style.height=g+"px";i.style.width=h+"px";c.setContent(i.outerHTML);}else{c.setHeight(g+"px");c.setWidth(h+"px");}};c.getIcon=function(){return;};c.getLabel=function(){return;};c.addEventDelegate({onBeforeRendering:function(){s.setHeightAndWidth();}});this.getView().getStepToolbar().getController().drawRepresentation(c);},createAlternateRepresentation:function(I){var s=this;var a=function(b){var e=b.dimensions;var m=s.oCoreApi.getSteps()[I].getSelectedRepresentation().getMetaData();if(m===undefined){return b;}var i;for(i=0;i<e.length;i++){var S=m.getPropertyMetadata(e[i].fieldName).hasOwnProperty('text');if(S){var n={};n.fieldName=m.getPropertyMetadata(e[i].fieldName).text;b.dimensions.push(n);}}b.isAlternateRepresentation=true;return b;};var A=s.oCoreApi.getSteps()[I];var c=A.getSelectedRepresentation();var p=jQuery.extend(true,{},c.getParameter());delete p.alternateRepresentationTypeId;delete p.alternateRepresentationType;p=a(p);this.newToggleInstance=this.oCoreApi.createRepresentation(c.getParameter().alternateRepresentationType.constructor,p);var d=c.getData();var m=c.getMetaData();if(d!==undefined&&m!==undefined){this.newToggleInstance.setData(d,m);}this.newToggleInstance.adoptSelection(c);return this.newToggleInstance;},isActiveStepChanged:function(){var a;if(this.currentActiveStepIndex===undefined){this.currentActiveStepIndex=this.oCoreApi.getSteps().indexOf(this.oCoreApi.getActiveStep());a=true;}else if(this.currentActiveStepIndex!==this.oCoreApi.getSteps().indexOf(this.oCoreApi.getActiveStep())){this.currentActiveStepIndex=this.oCoreApi.getSteps().indexOf(this.oCoreApi.getActiveStep());a=true;}else{a=false;}return a;},isSelectedRepresentationChanged:function(){var s;if(this.currentSelectedRepresentationId===undefined){this.currentSelectedRepresentationId=this.oCoreApi.getActiveStep().getSelectedRepresentationInfo().representationId;s=true;}else if(this.currentSelectedRepresentationId!==this.oCoreApi.getActiveStep().getSelectedRepresentationInfo().representationId){this.currentSelectedRepresentationId=this.oCoreApi.getActiveStep().getSelectedRepresentationInfo().representationId;s=true;}else if(this.getCurrentRepresentation().type!==this.oCoreApi.getActiveStep().getSelectedRepresentation().type){this.currentSelectedRepresentationId=this.oCoreApi.getActiveStep().getSelectedRepresentationInfo().representationId;s=true;}else{s=false;}return s;},drawStepContent:function(d){var n=this.oCoreApi.getSteps().indexOf(this.oCoreApi.getActiveStep());var t=this.oUiApi.getAnalysisPath().getCarousel().getStepView(n).oThumbnailChartLayout.isBusy();var i=this.oUiApi.getAnalysisPath().getController().isOpenPath;var a=this.oUiApi.getAnalysisPath().getController().isNewPath;if(t){this.getView().vLayout.setBusy(true);return;}var A=this.isActiveStepChanged();var s=this.isSelectedRepresentationChanged();var r=(d===undefined||d===true);if(r||A||s||i||a){this.drawRepresentation();}else{if(this.oCoreApi.getSteps().length>=1){this.drawSelectionContainer();}}if(this.getView().vLayout.isBusy()){this.getView().vLayout.removeAllContent();this.getView().vLayout.addContent(this.getView().stepLayout);this.getView().vLayout.setBusy(false);}this.getView().vLayout.setBusy(false);}});
