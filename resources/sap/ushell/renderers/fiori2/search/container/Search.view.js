// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(g){"use strict";jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchResultListItem");jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchLayout");jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchResultListItemFooter");jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchResultListContainer");jQuery.sap.require("sap.ushell.ui.launchpad.SearchResultApps");jQuery.sap.require("sap.ushell.ui.launchpad.SearchResultAppItem");jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchFacetFilter");jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.DivContainer");jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer");jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchResultList");var S=sap.ushell.renderers.fiori2.search.controls.SearchLayout;var a=sap.ushell.renderers.fiori2.search.controls.SearchResultListItem;var b=sap.ushell.renderers.fiori2.search.controls.SearchResultListItemFooter;var c=sap.ushell.renderers.fiori2.search.controls.SearchResultListContainer;var R=sap.ushell.renderers.fiori2.search.container.ResultListKeyEventHandler;var d=sap.ushell.renderers.fiori2.search.controls.SearchResultList;sap.ui.jsview("sap.ushell.renderers.fiori2.search.container.Search",{createContent:function(C){var s=this;var m=s.assembleMainResultList();s.tabStrips=s.assembleTabStrips();s.appSearchResult=s.assembleAppSearch();s.searchLayout=new S({count:'{/count}',searchTerm:'{/searchBoxTerm}',topList:s.appSearchResult,bottomList:m,tabStrips:s.tabStrips});if(sap.ui.Device.system.phone){s.searchLayout.setFacets(null);}else{s.searchLayout.setFacets(s.assembleFacets());}s.searchContainer=new sap.ushell.renderers.fiori2.search.controls.DivContainer({content:s.searchLayout,cssClass:'searchContainer'});return s.searchContainer;},assembleTabStrips:function(){var s=this;var e=function(t){var f=t.getSelectedKey();var h=t.getItems();for(var i=0;i<h.length;++i){var j=h[i];var k=j.getKey()||j.getId();if(k===f){return j.getBindingContext().getObject();}}return null;};var t=new sap.m.IconTabBar({upperCase:true,expandable:false,selectedKey:{path:'/tabStrips/selected/objectName/value',},select:function(){var f=e(t);s.getModel().setDataSource(f);}});t.addStyleClass('searchTabStrips');t.bindAggregation('items','/tabStrips/strips',function(i,C){return new sap.m.IconTabFilter({text:'{label}',key:"{objectName/value}",content:null});});return t;},assembleMainResultList:function(){var s=this;var r=new d({mode:sap.m.ListMode.None,growing:true,threshold:2,inset:false,showUnread:true,width:"auto",showNoData:false,visible:'{/resultsVisibility}'});r.setGrowingThreshold(2000);r.bindAggregation("items","/results",function(p,D){return s.assembleListItem(D);});var e=new c({resultList:r});return e;},assembleAppSearch:function(){var s=this;var t=new sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer({maxRows:99999,tiles:'{/appResults}',totalLength:'{/appCount}',visible:'{/appsVisibility}',highlightTerms:'{/lastSearchTerm}',showMore:function(){var m=s.getModel();var n=m.getSkip()+m.getTop();m.setSkip(n,false);var r=t.getNumberTiles()/t.getTilesPerRow()+10;var e=r*t.getTilesPerRow()-n;m.setTop(e);}});t.addStyleClass('searchTileResultList');sap.ui.getCore().getEventBus().subscribe('searchLayoutChanged',function(){t.delayedRerender();},this);return t;},assembleFacets:function(){var s=this,f;if(this.getModel()){f=new sap.ushell.renderers.fiori2.search.controls.SearchFacetFilter();f.setModel(this.getModel());}return f;},assembleTitleItem:function(D){var i=new sap.m.CustomListItem();var t=new sap.m.Label({text:"{title}"});t.addStyleClass('bucketTitle');i.addStyleClass('bucketTitleContainer');i.addContent(new sap.m.HBox({items:[t]}));return i;},assembleFooterItem:function(D){var s=this;s.footerItem=new b({text:"{i18n>showMore}",showMore:function(){var C=s.getModel();var n=C.getSkip()+10;C.setSkip(n);}});var l=new sap.m.CustomListItem({content:s.footerItem});l.addStyleClass('searchResultListFooter');return l;},assembleAppContainerResultListItem:function(D,p){var s=this;var e=new sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer({maxRows:sap.ui.Device.system.phone?2:1,tiles:'{tiles}',totalLength:'{/appCount}',highlightTerms:'{/lastSearchTerm}',enableKeyHandler:false,showMore:function(){var m=s.getModel();m.setDataSource(m.appDataSource);}});var l=new sap.m.CustomListItem({content:e});l.addStyleClass('searchResultListItem');l.addStyleClass('searchResultListItemApps');sap.ui.getCore().getEventBus().subscribe('searchLayoutChanged',function(){e.delayedRerender();},this);return l;},assembleResultListItem:function(D,p){var s=this;var i=new a({title:"{$$Name$$}",titleUrl:"{uri}",type:"{dataSourceName}",imageUrl:"{imageUrl}",data:D,visibleAttributes:4,navigate:function(){},firstDetailAttribute:5,maxDetailAttributes:8});var l=new sap.m.CustomListItem({content:i});l.addStyleClass('searchResultListItem');return l;},assembleListItem:function(D){var s=this;var o=D.getObject();if(o.type==='title'){return s.assembleTitleItem(o);}else if(o.type==='footer'){return s.assembleFooterItem(o);}else if(o.type==='appcontainer'){return s.assembleAppContainerResultListItem(o,D.getPath());}else{return s.assembleResultListItem(o,D.getPath());}},onAllSearchStarted:function(){var s=this;s.searchLayout.setSearchBusy(true);if(this.oTilesContainer){this.oTilesContainer.resetGrowing();}},onAllSearchFinished:function(){this.searchLayout.setSearchTerm(this.getModel().getSearchBoxTerm());this.searchLayout.setSearchBusy(false);},onNormalSearchFinished:function(){var s=this;var o=this.getModel();sap.ui.getCore().getEventBus().publish("closeCurtain");},onAppSearchFinished:function(e,f,r){var s=this;},setAppView:function(A){var s=this;s.oAppView=A;if(s.oTilesContainer){s.oTilesContainer.setAppView(A);}},getControllerName:function(){return"sap.ushell.renderers.fiori2.search.container.Search";}});}(window));
