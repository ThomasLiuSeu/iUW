/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2015 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.splitapp.MasterPage");jQuery.sap.require("sap.uiext.inbox.InboxUtils");sap.ui.base.Object.extend("sap.uiext.inbox.splitapp.MasterPage",{constructor:function(I){sap.ui.base.Object.apply(this);this.oCore=sap.ui.getCore();this.Id=I;this.utils=sap.uiext.inbox.InboxUtils;this._oBundle=this.oCore.getLibraryResourceBundle("sap.uiext.inbox");this.bPhoneDevice=jQuery.device.is.phone;this.masterPage=this._create();}});
sap.uiext.inbox.splitapp.MasterPage.prototype.getPage=function(){return this.masterPage;};
sap.uiext.inbox.splitapp.MasterPage.prototype.setShowNavButton=function(v){this.masterPage.setShowNavButton(v);return this;};
sap.uiext.inbox.splitapp.MasterPage.prototype._setTcmServiceURL=function(v){this.tcmServiceURL=v;};
sap.uiext.inbox.splitapp.MasterPage.prototype._create=function(){var m=this.oCore.byId(this.Id+"-masterPage");if(!m){var t=this;var s=new sap.m.SearchField(t.Id+"-searchFld",{showRefreshButton:false,placeholder:t._oBundle.getText("INBOX_LP_SEARCH_LABEL"),tooltip:t._oBundle.getText("INBOX_LP_SEARCH_LABEL_TOOLTIP"),width:"100%"});s.attachSearch(t,t.handleSearch);s.attachLiveChange(t,function(e,t){if(e.getParameter("newValue")===""){t._resetSearch();}});m=new sap.m.Page(t.Id+"-masterPage",{title:t._oBundle.getText("INBOX_LP_TASKS_AND_COUNT",[""]),showNavButton:true,showFooter:false,footer:new sap.m.Bar(t.Id+'fooBar',{contentLeft:[new sap.m.Button(this.Id+"-mangSubstBtn",{tooltip:t._oBundle.getText("INBOX_MANAGE_SUBSTITUTION_RULES_TOOLTIP"),icon:"sap-icon://visits"}).attachPress(t,t._openManageSubstitutionOverlay)]}),subHeader:new sap.m.Bar(t.Id+"-searchBar",{contentMiddle:[s],contentRight:[new sap.m.Button(t.Id+"-refreshBtn",{tooltip:t._oBundle.getText("INBOX_LP_REFRESH_BUTTON_TOOLTIP"),icon:"sap-icon://synchronize"}).attachPress(t,t._refreshTasks)]})}).attachNavButtonTap(function(e){sap.ui.getCore().getEventBus().publish('sap.uiext.inbox',"masterPageNavButtonTapped");});var l=new sap.m.List(t.Id+"-list",{growing:true,growingThreshold:7,visible:true,mode:sap.m.ListMode.SingleSelectMaster,threshhold:50,noDataText:t._oBundle.getText("INBOX_LP_NO_MATCHING_TASKS"),}).attachSelect(this,this.handleListSelect);l.addEventDelegate({ontap:function(e){var S=l.getSelectedItem();if(S&&S.getDomRef().contains(e.target)){if(jQuery.device.is.phone)l.setSelectedItem(S,false);}}});this.oList=l;var o=new Array();o.push(new sap.m.ObjectAttribute({text:"{CreatedByName}"}));o.push(new sap.m.ObjectAttribute().bindProperty("text","CreatedOn",function(v){return t.utils._dateFormat(v);}));var O=new sap.m.ObjectListItem(t.Id+"-objLstItm",{type:"Active",title:"{TaskTitle}",icon:"sap-icon://person-placeholder",attributes:o,firstStatus:new sap.m.ObjectStatus({icon:{path:"CompletionDeadLine",formatter:function(v){if(t.utils._isOverDue(v)){return"sap-icon://pending";}}},state:sap.ui.core.ValueState.Error}),secondStatus:new sap.m.ObjectStatus(t.Id+"-objStatus").bindProperty("text",{parts:[{path:"Status",type:new sap.ui.model.type.String()},{path:"StatusText",type:new sap.ui.model.type.String()}],formatter:function(_,a){if(_!=null&&a){return a;}else if(_!=null&&_!=""){var b=t._oBundle.getText(sap.uiext.inbox.InboxConstants.statusMap[_]);return(b=="")?_:b;}else{return"";}},useRawValues:true})}).addStyleClass("inbox_split_app_wordBreak");O.bindProperty("icon","CreatedBy",function(v){if(this.getBindingContext()){return t.utils.getUserMediaResourceURL(t.tcmServiceURL,this.getBindingContext().getProperty("SAP__Origin"),v);}else{return"sap-icon://person-placeholder";}});this.oListTemplate=O;l.attachUpdateFinished(function(e){if(t.bPhoneDevice){var M=t.oCore.byId(t.Id+"-list");var _=M.mBindingInfos.items.binding.iLength;t.masterPage.setTitle(t._oBundle.getText("INBOX_LP_TASKS_AND_COUNT",[_]));}else{var i=this.getItems();if(i.length>0){this.fireSelect({'listItem':i[0],'selected':true});}}});m.addContent(l);}return m;};
sap.uiext.inbox.splitapp.MasterPage.prototype._selectDetail=function(){var l=this.oCore.byId(this.Id+"-list");var i=l.getItems();if(!jQuery.device.is.phone&&i.length>0&&!l.getSelectedItem()){l.setSelectedItem(i[0],true);this._showDetail(i[0]);}};
sap.uiext.inbox.splitapp.MasterPage.prototype.handleSearch=function(e,m){m._updateList();};
sap.uiext.inbox.splitapp.MasterPage.prototype._updateList=function(){var t=this;var f=new Array();var s=t.oCore.byId(t.Id+"-searchFld").getValue();if(s&&s.length>0){var I="in progress";var b=(s.indexOf(' ')>=0&&I.indexOf(s.toLowerCase())!=-1)?true:false;var T=s.split(" ");var F=[];jQuery.each(T,function(i,c){var d=b?"IN_PROGRESS":c;var o=new sap.ui.model.Filter("TaskTitle",sap.ui.model.FilterOperator.Contains,c);var e=new sap.ui.model.Filter("CreatedByName",sap.ui.model.FilterOperator.Contains,c);var g=new sap.ui.model.Filter("Status",sap.ui.model.FilterOperator.Contains,d);F[i]=new sap.ui.model.Filter({aFilters:[o,e,g],bAnd:false});});f.push(new sap.ui.model.Filter({aFilters:F,bAnd:true}));if(this.aFilters){f=f.concat(t.aFilters);}var l=t.oCore.byId(t.Id+"-list");var S=l.getSelectedItem();var a=l.getBinding("items");a.filter(f);if(f.length==0){l.setSelectedItem(S,true);}}};
sap.uiext.inbox.splitapp.MasterPage.prototype.handleListSelect=function(e,t){var o=e.getParameter('onUpdate');var m=t.oCore.byId(t.Id+"-list");var _=m.mBindingInfos.items.binding.iLength;t.masterPage.setTitle(t._oBundle.getText("INBOX_LP_TASKS_AND_COUNT",[_]));var i=m.getItems();if(i.length>0&&!m.getSelectedItem()){m.setSelectedItem(i[0],true);}var s=m.getSelectedItem();var c=s.getBindingContext();t.oCore.getEventBus().publish('sap.uiext.inbox',"masterPageListSelected",{context:c,onUpdate:o});};
sap.uiext.inbox.splitapp.MasterPage.prototype.bindService=function(f){this.aFilters=f;this.oList.bindItems({path:"/TaskCollection",template:this.oListTemplate,filters:f});};
sap.uiext.inbox.splitapp.MasterPage.prototype._openManageSubstitutionOverlay=function(e,t){var s=t.oCore.byId(t.Id+'--'+'substitutionRulesManager');if(s===undefined){jQuery.sap.require("sap.uiext.inbox.SubstitutionRulesManager");s=new sap.uiext.inbox.SubstitutionRulesManager(t.Id+'--'+'substitutionRulesManager');}if(s.getModel()===undefined){var m=t.oCore.getModel();var n=new sap.ui.model.odata.ODataModel(t.tcmServiceURL,true);s.setModel(n);}jQuery.sap.require("sap.uiext.inbox.tcm.TCMModel");s.oTCMModel=new sap.uiext.inbox.tcm.TCMModel();s.open();};
sap.uiext.inbox.splitapp.MasterPage.prototype._refreshTasks=function(e,t){t.addBusyIndicatorOnRefresh();t.oCoreModel=t.masterPage.getModel('inboxTCMModel');t.oCoreModel.read("/TaskCollection?$filter=Status ne 'COMPLETED'&$orderby=CreatedOn desc",null,null,true,function(d,r){t.oTaskData=d.results;t._updateModel(t);},function(E){sap.m.MessageToast.show(t._oBundle.getText("INBOX_LP_MSG_FAILED_TO_READ_SERVICE_WHILE_REFRESH"));});};
sap.uiext.inbox.splitapp.MasterPage.prototype._updateModel=function(t){var j=t.masterPage.getModel();var a={"TaskCollection":t.oTaskData};j.setData(a);t.bindService(t.aFilters);var b=this.oCore.byId('refreshBI');if(b&&(this.masterPage.indexOfContent(b)>=0)){this.masterPage.removeContent(b);}};
sap.uiext.inbox.splitapp.MasterPage.prototype.rerenderTask=function(t){var a=t.Status=="COMPLETED"?true:false;var m=this.oCore.byId(this.Id+"-list");var s=m.getSelectedItem();var p=s.getBindingContext().getPath();var P=p.split("/");if(a){this.masterPage.getModel().oData.TaskCollection.splice(P[2],1);}else{this.masterPage.getModel().oData.TaskCollection[P[2]]=t;}this.masterPage.getModel().checkUpdate(false);};
sap.uiext.inbox.splitapp.MasterPage.prototype.resetSearchCriteria=function(){var s=this.oCore.byId(this.Id+"-searchFld");if(s){s.setValue("");this._resetSearch();}};
sap.uiext.inbox.splitapp.MasterPage.prototype.addBusyIndicatorOnRefresh=function(){var b=this.oCore.byId('refreshBI');if(!b){b=new sap.m.BusyIndicator('refreshBI',{text:this._oBundle.getText("INBOX_LP_LOADING")});}this.masterPage.insertContent(b,0);};
sap.uiext.inbox.splitapp.MasterPage.prototype._resetSearch=function(){var l=this.oCore.byId(this.Id+"-list");if(l){var s=l.getSelectedItem();var b=l.getBinding("items");}if(b){b.filter(this.aFilters);}if(s&&this.aFilters.length==0){l.setSelectedItem(s,true);}};
