// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.require("sap.ui.core.IconPool");jQuery.sap.require("sap.ushell.ui.launchpad.Tile");jQuery.sap.require("sap.ushell.ui.launchpad.TileContainer");jQuery.sap.require("sap.ushell.ui.launchpad.Panel");sap.ui.jsview("sap.ushell.renderers.fiori2.launchpad.catalog.Catalog",{oController:null,createContent:function(c){jQuery.sap.require("sap.m.Input");jQuery.sap.require("sap.m.ListItemBaseRenderer");sap.m.ListItemBaseRenderer.getAriaAnnouncement("active");sap.m.ListItemBaseRenderer.getAriaAnnouncement("navigation");var m=sap.ui.getCore().byId("navContainer").getModel();this.oController=c;function a(L){return((L!==null)&&(L==="1x2"||L==="2x2"))||false;}function b(s){return((s!==null)&&(s==="2x2"||s==="2x1"))||false;}function t(v){return parseInt(v,10)||0;}function g(G){var i=(G&&G.length>0)?"accept":"add";return sap.ui.core.IconPool.getIconURI(i);}function f(v){return(v&&v>0)?v+((v>1&&(" "+translationBundle.getText("tiles")))||(" "+translationBundle.getText("tile"))):translationBundle.getText("no_tiles");}var B=new sap.m.Button({icon:{path:"associatedGroups",formatter:g},tooltip:{parts:["i18n>addTileToGroup","i18n>addAssociatedTileToGroup","associatedGroups"],formatter:function(A,s,G){return G&&G.length?s:A;}},press:[c.onTileFooterClick,c]}),T=new sap.ushell.ui.launchpad.Tile({afterRendering:[c.onTileAfterRendering,c],tileViews:{path:"content",factory:function(i,e){return e.getObject();}},footItems:[B],"long":{path:"size",formatter:a},"tall":{path:"size",formatter:b},index:{path:"id",formatter:t},tileCatalogId:"{id}"}),d=new sap.ushell.ui.launchpad.TileContainer("catalogTiles",{showHeader:false,showPlaceholder:false,showGroupHeader:"{/showCatalogHeaders}",groupHeaderLevel:sap.m.HeaderLevel.H3,showNoData:true,tiles:{path:"/catalogTiles",template:T,sorter:new sap.ui.model.Sorter("catalogIndex",false,function(e){return(e&&e.getProperty("catalog"))||"";})},afterRendering:function(e){var n,i;if(this.getTiles().length||this.getModel().getProperty('/catalogTiles/length')){setTimeout(function(){sap.ui.getCore().byId("catalogSearch").setEnabled(true);});this.setNoDataText(sap.ushell.resources.i18n.getText('noFilteredItems'));sap.ui.getCore().getEventBus().publish("launchpad","contentRendered");if(!sap.ui.Device.os.ios){sap.ui.getCore().getEventBus().publish("launchpad","contentRefresh");}}jQuery.sap.byId("catalogTiles").removeAttr("tabindex",0);jQuery.sap.byId("catalogTilesPage-intHeader-BarPH").removeAttr("tabindex",0);n=jQuery(".sapUshellTile button");for(i=0;i<n.length;i++){n[i].setAttribute("tabindex",-1);}}});d.addEventDelegate({onfocusout:function(e){e.preventDefault();var i=jQuery(e.target);if(!e.relatedTarget){if(i.hasClass("sapMBtn")){sap.ushell.renderers.fiori2.AccessKeysHandler.setFocusOnCatalogTile();}}}});B.constructor.prototype.setIcon=function(v){this.setProperty("icon",v,true);if(v&&this._image&&this._image.setSrc){this._image.setSrc(v);}return this;};var F=new sap.ui.model.Filter("numIntentSupportedTiles",sap.ui.model.FilterOperator.NE,0),C=new sap.m.Select("catalogSelect",{visible:"{/catalogSelection}",name:"Browse",tooltip:"{i18n>catalogSelect_tooltip}",width:"17rem",items:{path:"/catalogs",template:new sap.ui.core.ListItem({text:"{title}"}),filters:[F]},change:[c.onCategoryFilter,c]}),o=C.onAfterRendering;C.addEventDelegate({onsapskipforward:function(E){try{E.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setFocusOnCatalogTile();var i=jQuery('#catalogTiles .sapUshellTile:visible:first');i.focus();}catch(e){}},onsaptabprevious:function(E){try{sap.ushell.renderers.fiori2.AccessKeysHandler.setFocusOnCatalogTile();}catch(e){}},onsapskipback:function(E){try{E.preventDefault();var n=jQuery("#catalogTilesPage header button")[0];n.focus();}catch(e){}}});if(m.getProperty("/enableHelp")){C.addStyleClass('help-id-catalogCategorySelect');}C.onAfterRendering=function(){if(o){o.apply(this,arguments);}jQuery.sap.byId("catalogSelect").attr("tabindex",0);};var h=C._onAfterRenderingPopover;C._onAfterRenderingPopover=function(){if(this._oPopover){this._oPopover.setFollowOf(false);}if(h){h.apply(this,arguments);}};var j=new sap.m.SearchField("catalogSearch",{visible:"{/searchFiltering}",tooltip:"{i18n>catalogSearch_tooltip}",width:"17rem",enabled:false,value:{path:"/catalogSearchFilter"},placeholder:"{i18n>search_catalog}",liveChange:[c.onLiveFilter,c]}),k=j.onAfterRendering;if(m.getProperty("/enableHelp")){j.addStyleClass('help-id-catalogSearch');}j.onAfterRendering=function(){k.apply(this,arguments);jQuery.sap.byId("catalogSearch").find("input").attr("tabindex",0);this.data("sap-ui-fastnavgroup","true",true);};j.addEventDelegate({onsaptabnext:function(E){try{E.preventDefault();var v=jQuery(".sapUshellTile:visible"),i=jQuery(v[0]);sap.ushell.renderers.fiori2.AccessKeysHandler.setFocusOnCatalogTile();i.focus();}catch(e){}},onsapskipback:function(E){try{E.preventDefault();var n=jQuery("#catalogTilesPage header button")[0];n.focus();}catch(e){}},onsapskipforward:function(E){try{E.preventDefault();var i=jQuery('#catalogTiles .sapUshellTile:visible:first');sap.ushell.renderers.fiori2.AccessKeysHandler.setTileFocus(i);}catch(e){}}});var l=new sap.m.MultiComboBox("catalogTagFilter",{visible:"{/tagFiltering}",selectedKeys:{path:"/selectedTags",mode:sap.ui.model.BindingMode.TwoWay},tooltip:"{i18n>catalogTilesTagfilter_tooltip}",width:"17rem",placeholder:"{i18n>catalogTilesTagfilter_HintText}",items:{path:"/tagList",sorter:new sap.ui.model.Sorter("tag",false,false),template:new sap.ui.core.ListItem({text:"{tag}",key:"{tag}"})},selectionChange:[c.onTagsFilter,c]});if(m.getProperty("/enableHelp")){l.addStyleClass('help-id-catalogTagFilter');}l.addEventDelegate({onsapskipback:function(E){try{E.preventDefault();jQuery("#catalogSelect").focus();}catch(e){}},onsapskipforward:function(E){try{E.preventDefault();var i=jQuery('#catalogTiles .sapUshellTile:visible:first');sap.ushell.renderers.fiori2.AccessKeysHandler.setTileFocus(i);}catch(e){}}});var D=new sap.m.Page("catalogTilesPage",{showHeader:true,showFooter:false,showNavButton:true,title:"{i18n>tile_catalog}",content:[new sap.ushell.ui.launchpad.Panel({translucent:true,headerText:"",headerLevel:sap.m.HeaderLevel.H2,headerBar:new sap.m.Bar("catalogHeader",{translucent:true,tooltip:"{i18n>tile_catalog_header_tooltip}",contentLeft:[C,l,j]}).addStyleClass("sapUshellCatalogMain"),content:[d]})],navButtonPress:[c.onNavButtonPress,c]});return D;},onAfterHide:function(e){if(this.oController.oPopover){this.oController.oPopover.close();}},getControllerName:function(){return"sap.ushell.renderers.fiori2.launchpad.catalog.Catalog";}});}());
