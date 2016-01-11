/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require('sap.apf.ui.utils.helper');sap.ui.controller("sap.apf.ui.reuse.controller.stepGallery",{getGalleryElementsData:function(){var s=this;var g=[];var c=this.oCoreApi.getCategories();var l=this.oCoreApi.getTextNotHtmlEncoded("label");var a=this.oCoreApi.getTextNotHtmlEncoded("steps");var b=this.oCoreApi.getTextNotHtmlEncoded("category");var m;if(c.length===0){m=this.oCoreApi.createMessageObject({code:"6001",aParameters:["Categories"]});this.oCoreApi.putMessage(m);}var i;for(i=0;i<c.length;i++){var G={};var C=c[i];var o={};var d;if(!C.label){m=this.oCoreApi.createMessageObject({code:"6002",aParameters:[l,b+": "+d]});this.oCoreApi.putMessage(m);}else{d=this.oCoreApi.getTextNotHtmlEncoded(C.label);o.title=this.oCoreApi.getTextNotHtmlEncoded(C.label);}o.id=C.id;G.categoryDetails=o;G.stepTemplates=[];C.stepTemplates.forEach(function(e){var f={};if(!e.title){m=s.oCoreApi.createMessageObject({code:"6003",aParameters:["Title"]});s.oCoreApi.putMessage(m);}else{f.maintitle=s.oCoreApi.getTextNotHtmlEncoded(e.title);}f.id=e.id;f.representationtypes=e.getRepresentationInfo();f.representationtypes.forEach(function(r){r.title=s.oCoreApi.getTextNotHtmlEncoded(r.label);if(r.parameter&&r.parameter.orderby){var h=new sap.apf.ui.utils.Helper(s.oCoreApi).getRepresentationSortInfo(r);r.sortDescription=h;}});f.defaultRepresentationType=f.representationtypes[0];G.stepTemplates.push(f);});g.push(G);}var S=this.oCoreApi.getStepTemplates();if(S.length===0){m=this.oCoreApi.createMessageObject({code:"6002",aParameters:[a,b]});this.oCoreApi.putMessage(m);}var j={GalleryElements:g};return j;},onInit:function(){this.oCoreApi=this.getView().getViewData().oCoreApi;this.oUiApi=this.getView().getViewData().uiApi;var g=this.getGalleryElementsData().GalleryElements;var m=new sap.ui.model.json.JSONModel({"GalleryElements":g});this.getView().setModel(m,"json");},getStepDetails:function(c,s){var g=this.getGalleryElementsData().GalleryElements;var a=g[c].stepTemplates[s];return a;},openHierarchicalSelectDialog:function(){if(this.oHierchicalSelectDialog){this.oHierchicalSelectDialog.destroy();}this.oHierchicalSelectDialog=new sap.ui.jsfragment("sap.apf.ui.reuse.fragment.stepGallery",this);this.oHierchicalSelectDialog.setModel(this.getView().getModel("json"),"json");this.oHierchicalSelectDialog.open();},onStepPress:function(i,r){this.oHierchicalSelectDialog.close();this.oUiApi.getLayoutView().setBusy(true);this.oCoreApi.createStep(i,this.oUiApi.getAnalysisPath().getController().callBackForUpdatePathAndSetLastStepAsActive.bind(this.oUiApi.getAnalysisPath().getController()),r);this.oUiApi.getLayoutView().setBusy(true);this.oUiApi.getAnalysisPath().getController().refresh(-1);}});
