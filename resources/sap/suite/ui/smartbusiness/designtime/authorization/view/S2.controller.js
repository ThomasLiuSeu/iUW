/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util");sap.ca.scfld.md.controller.ScfldMasterController.extend("sap.suite.ui.smartbusiness.designtime.authorization.view.S2",{onInit:function(){var t=this;this.oApplicationFacade.masterListControllerRef=this;this.utilsRef=sap.suite.ui.smartbusiness.lib.Util.utils;jQuery.sap.require("sap.suite.ui.smartbusiness.lib.AppSetting");sap.suite.ui.smartbusiness.lib.AppSetting.init({oControl:this.byId("list"),hideElement:"list",i18n:{checkBoxText:t.oApplicationFacade.getResourceBundle().getText("CHECKBOX_TEXT"),saveText:t.oApplicationFacade.getResourceBundle().getText("OK"),cancelText:t.oApplicationFacade.getResourceBundle().getText("CANCEL"),settingsText:t.oApplicationFacade.getResourceBundle().getText("SETTINGS")},title:t.oApplicationFacade.getResourceBundle().getText("SETTINGS_SB"),});this.settingModel=sap.ui.getCore().getModel("SB_APP_SETTING")||new sap.ui.model.json.JSONModel();sap.ui.getCore().setModel(this.settingModel,"SB_APP_SETTING");this.getView().setModel(sap.ui.getCore().getModel("SB_APP_SETTING"),"SB_APP_SETTING");t.selectedGroupItemKey="workspace";t.selectedGroupItemIndex=0;t.lastSavedIndex=0;t.oApplicationFacade.getODataModel().setSizeLimit(100000);t.lastGroupingOption=new sap.ui.model.Sorter("MANUAL_ENTRY",true,function(c){var i=c.getProperty("MANUAL_ENTRY");var g="";switch(i){case 1:g=t.oApplicationFacade.getResourceBundle().getText("MY_FAVOURITES");break;case 0:g=t.oApplicationFacade.getResourceBundle().getText("MY_LAST_WORKED_UPON");break;default:g=t.oApplicationFacade.getResourceBundle().getText("ALL_KPI_OPI");}return{key:g,text:g}});t.lastSortingOrder={indicatorTextOrder:null,order:new sap.ui.model.Sorter("CHANGED_ON",true,null)};if(!(t.oApplicationFacade.currentLogonHanaUser)){this.oApplicationFacade.getODataModel().read("/SESSION_USER",null,null,true,function(d){t.oApplicationFacade.currentLogonHanaUser=(d.results&&d.results.length)?d.results[0].LOGON_USER:null;},function(e){t.oApplicationFacade.currentLogonHanaUser=null;sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(t.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"),e.response.body);});}this.byId("list").getBinding("items").filter([new sap.ui.model.Filter("IS_ACTIVE","EQ",1)]);},createFilterOptions:function(){var t=this;var f=new sap.m.ViewSettingsDialog({id:this.createId("filterOptionsDialog"),filterItems:[new sap.m.ViewSettingsFilterItem({text:t.oApplicationFacade.getResourceBundle().getText("ACTIVITY"),key:"activity",items:[new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("SELF_CREATED"),key:"self_created"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("RECENTLY_WORKED_UPON"),key:"recently_worked_upon"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("FAVORITE"),key:"favorite"}),]})],confirm:function(e){var a="";var s=e.getParameter("filterItems");t.setFiltering(e.getParameter("filterItems"));if(s&&s.length){var b={};for(var i=0,l=s.length;i<l;i++){b[s[i].getParent().getKey()]=b[s[i].getParent().getKey()]||"";b[s[i].getParent().getKey()]+=(b[s[i].getParent().getKey()])?(","):"";b[s[i].getParent().getKey()]+=s[i].getText();}for(var c in b){if(b.hasOwnProperty(c)){a+=(a)?" ; ":"";a+=b[c];}}t.byId("filterToolbar").setVisible(true);t.byId("visualizationInfo").setText(a);}else{t.byId("visualizationInfo").setText("");t.byId("filterToolbar").setVisible(false);}}});return f;},createSortOptions:function(){var t=this;var s=new sap.m.ViewSettingsDialog({id:this.createId("sortOptionsDialog"),sortItems:[new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("BY_CHANGE_DATE"),key:"changedate"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("BY_NAME"),key:"name"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("BY_ID"),key:"id"})],confirm:function(e){if(e.getParameter("sortItem")){t.setSorting(e.getParameter("sortItem").getKey(),e.getParameter("sortDescending"));}}});s.setSelectedSortItem("changedate");s.setSortDescending(true);return s;},createGroupOptions:function(){var t=this;var j={groupItems:[{text:t.oApplicationFacade.getResourceBundle().getText("BY_WORKSPACE"),key:"workspace",index:0},{text:t.oApplicationFacade.getResourceBundle().getText("BY_INDICATOR"),key:"indicator",index:1},{text:t.oApplicationFacade.getResourceBundle().getText("BY_OWNER"),key:"owner",index:2},{text:t.oApplicationFacade.getResourceBundle().getText("NONE"),key:"none",index:3},]};var m=new sap.ui.model.json.JSONModel(j);var g=new sap.m.Dialog({title:t.oApplicationFacade.getResourceBundle().getText("GROUP_BY"),id:this.createId("groupOptionsDialog"),content:[new sap.m.List({items:{path:"/groupItems",template:new sap.m.ObjectListItem({type:"Active",title:"{text}"})},itemPress:function(e){e.getParameter("listItem").setSelected(true);t.selectedGroupItemKey=e.getParameter("listItem").getBindingContext().getProperty("key");t.selectedGroupItemIndex=e.getParameter("listItem").getBindingContext().getProperty("index");if(t.selectedGroupItemKey=="workspace"){t.setGrouping(t.selectedGroupItemKey,true);}else{t.setGrouping(t.selectedGroupItemKey,false);}t.lastSavedIndex=t.selectedGroupItemIndex;this.getParent().close();}})],endButton:new sap.m.Button({text:t.oApplicationFacade.getResourceBundle().getText("CANCEL"),press:function(e){t.selectedGroupItemIndex=t.lastSavedIndex;this.getParent().close();}})});g.setModel(m);return g;},getHeaderFooterOptions:function(){var t=this;return{sI18NMasterTitle:"MASTER_TITLE",onBack:function(){window.history.back();},oFilterOptions:{onFilterPressed:function(e){t.getView().filterOptionDialog=t.getView().filterOptionDialog||t.createFilterOptions();t.getView().filterOptionDialog.open();}},oSortOptions:{onSortPressed:function(e){t.getView().sortOptionDialog=t.getView().sortOptionDialog||t.createSortOptions();t.getView().sortOptionDialog.open();}},oGroupOptions:{onGroupPressed:function(e){if(t.byId("groupOptionsDialog")){t.byId("groupOptionsDialog").destroy();}t.getView().groupOptionDialog=t.createGroupOptions();t.getView().groupOptionDialog.open();t.byId("groupOptionsDialog").getContent()[0].getItems()[t.selectedGroupItemIndex].setSelected(true);}},};},formatEvaluationHeader:function(i,e){var t=this;if(i==null&&e!=null){return(t.oApplicationFacade.getResourceBundle().getText("TITLE_UNAVAILABLE")+"- "+e);}else if(i!=null&&e==null){return(i+" -"+t.oApplicationFacade.getResourceBundle().getText("TITLE_UNAVAILABLE"));}else if(i==null&&e==null){return(t.oApplicationFacade.getResourceBundle().getText("TITLE_UNAVAILABLE")+" - "+t.oApplicationFacade.getResourceBundle().getText("TITLE_UNAVAILABLE"));}else{return(i+" - "+e);}},formatIndicatorId:function(c){var t=this;var i=c.getProperty("MANUAL_ENTRY");var g="";switch(i){case 1:g=t.oApplicationFacade.getResourceBundle().getText("MY_FAVOURITES");break;case 0:g=t.oApplicationFacade.getResourceBundle().getText("MY_LAST_WORKED_UPON");break;default:g=t.oApplicationFacade.getResourceBundle().getText("ALL_EVALUATIONS");}return{key:g,text:g}},setGrouping:function(k,g){var t=this;g=g||false;var l=t.getView().byId("list");var a;if(k=="workspace"){a=new sap.ui.model.Sorter("MANUAL_ENTRY",g,function(c){var i=c.getProperty("MANUAL_ENTRY");var b="";switch(i){case 1:b=t.oApplicationFacade.getResourceBundle().getText("MY_FAVOURITES");break;case 0:b=t.oApplicationFacade.getResourceBundle().getText("MY_LAST_WORKED_UPON");break;default:b=t.oApplicationFacade.getResourceBundle().getText("ALL_EVALUATIONS");}return{key:b,text:b}})}else if(k=="indicator"){a=new sap.ui.model.Sorter("INDICATOR",g,function(c){return{key:c.getProperty("INDICATOR"),text:("KPI: "+c.getProperty("INDICATOR"))}});}else if(k=="owner"){a=new sap.ui.model.Sorter("OWNER_NAME",g,function(c){var o=c.getProperty("OWNER_NAME");var b="";switch(o){case null:b=t.oApplicationFacade.getResourceBundle().getText("NO_OWNER");break;case"":b=t.oApplicationFacade.getResourceBundle().getText("NO_OWNER");break;default:b=o;}return{key:b,text:b}});}else if(k=="none"){a=null;}if(t.lastSortingOrder.indicatorTextOrder&&t.lastSortingOrder.order&&k!="none"){l.getBinding("items").sort([a,t.lastSortingOrder.order,t.lastSortingOrder.indicatorTextOrder],true);}else if(!t.lastSortingOrder.indicatorTextOrder&&t.lastSortingOrder.order&&k!="none"){l.getBinding("items").sort([a,t.lastSortingOrder.order],true);}else{if(t.lastSortingOrder.indicatorTextOrder&&t.lastSortingOrder.order){l.getBinding("items").sort([t.lastSortingOrder.indicatorTextOrder,t.lastSortingOrder.order]);}else{l.getBinding("items").sort([t.lastSortingOrder.order]);}}this.lastGroupingOption=a;},setFiltering:function(i){var t=this;var f=[];var l=t.getView().byId("list");var a={"self_created":(new sap.ui.model.Filter("CREATED_BY",sap.ui.model.FilterOperator.EQ,t.oApplicationFacade.currentLogonHanaUser)),"recently_worked_upon":(new sap.ui.model.Filter("MANUAL_ENTRY",sap.ui.model.FilterOperator.EQ,0)),"favorite":(new sap.ui.model.Filter("MANUAL_ENTRY",sap.ui.model.FilterOperator.EQ,1))};f=sap.suite.ui.smartbusiness.lib.Util.utils.getFilterArray(i,a);if(f.length){l.getBinding("items").filter(new sap.ui.model.Filter(f,true));}else{l.getBinding("items").filter(f);}},setSorting:function(k,g){var t=this;g=g||false;var l=t.getView().byId("list");var s,a;if(k=="changedate"){s=new sap.ui.model.Sorter("CHANGED_ON",g,null);}else if(k=="name"){s=new sap.ui.model.Sorter("TITLE",g,null);a=new sap.ui.model.Sorter("INDICATOR_TITLE",g,null);}else if(k=="id"){s=new sap.ui.model.Sorter("ID",g,null);}if(t.lastGroupingOption){if(a){l.getBinding("items").sort([t.lastGroupingOption,a,s],true);}else{l.getBinding("items").sort([t.lastGroupingOption,s],true);}}else{if(a){l.getBinding("items").sort([a,s]);}else{l.getBinding("items").sort([s]);}}this.lastSortingOrder={indicatorTextOrder:a,order:s};},applySearchPatternToListItem:function(i,s){return sap.suite.ui.smartbusiness.lib.Util.utils.applySearchPatternToListItem.apply(this,arguments);},refreshMasterList:function(){var t=this;t.utilsRef.refreshMasterList(t,true);}});
