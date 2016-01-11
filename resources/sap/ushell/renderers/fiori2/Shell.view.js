// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.require("sap.ushell.renderers.fiori2.Navigation");jQuery.sap.require("sap.ushell.renderers.fiori2.launchpad.DashboardManager");jQuery.sap.require("sap.ushell.ui.shell.Shell");jQuery.sap.require("sap.ushell.UIActions");jQuery.sap.require("sap.ushell.UserActivityLog");sap.ui.jsview("sap.ushell.renderers.fiori2.Shell",{createContent:function(c){var s=this;var v=this.getViewData()||{},C=v.config||{},S=(C.appState==="embedded")?true:false,b=(C.appState==="headerless")?true:false,p=function(e,i,H){return e?H:i;},f=function(i,e){return sap.ui.getCore().byId(e.getObject());},l=new sap.ushell.ui.launchpad.LoadingDialog({id:"loadingDialog",title:null,text:"",showCancelButton:false}),o=new sap.ushell.ui.shell.ShellHeadItem({id:"configBtn",tooltip:"{i18n>showGrpsBtn_tooltip}",icon:sap.ui.core.IconPool.getIconURI("menu2"),selected:{path:"/currentState/showPane"},press:[c.togglePane,c]}),h=new sap.ushell.ui.shell.ShellHeadItem({id:"homeBtn",title:"{i18n>homeBtn_tooltip}",tooltip:"{i18n>homeBtn_tooltip}",icon:sap.ui.core.IconPool.getIconURI("home"),target:"#"}),B=new sap.ushell.ui.shell.ShellHeadItem({id:"backBtn",title:"{i18n>backBtn_tooltip}",tooltip:"{i18n>backBtn_tooltip}",icon:{parts:["/rtl"],formatter:function(r){return r?sap.ui.core.IconPool.getIconURI("feeder-arrow"):sap.ui.core.IconPool.getIconURI("nav-back");}},press:[c.navigateToHome,c]});h.addEventDelegate({onsapskipback:function(E){try{E.preventDefault();E.stopPropagation();var i=jQuery('#catalogTiles .sapUshellTile:visible:first');sap.ushell.renderers.fiori2.AccessKeysHandler.setTileFocus(i);}catch(e){}},onsapskipforward:function(E){try{E.preventDefault();var n=jQuery("#catalogTilesPage header button")[0];n.focus();}catch(e){}}});o.addEventDelegate({onsapdown:function(e){if(c.getModel().getProperty("/currentState/showPane")){var i=sap.ui.getCore().byId("shell");if(i){e.stopImmediatePropagation();e.stopPropagation();i.setFocusOnFirstGroupInList();}}else{o.firePress();}},onsapup:function(e){if(c.getModel().getProperty("/currentState/showPane")){o.firePress();}},onsapskipforward:function(E){try{E.preventDefault();var i=jQuery(".sapUshellGroupLI:first:visible");if(!i.length){sap.ushell.renderers.fiori2.AccessKeysHandler.goToTileContainer();}else{i.focus();}}catch(e){}}});var a,A;if(S){A=new sap.ushell.ui.shell.ShellHeadItem({id:"standardActionsBtn",tooltip:"{i18n>headerActionsTooltip}",icon:sap.ui.core.IconPool.getIconURI("account"),press:[c.pressActionBtn,c]});}else if(!b){a=new sap.ushell.ui.shell.ShellHeadUserItem({id:"actionsBtn",username:sap.ushell.Container.getUser().getFullName(),tooltip:"{i18n>headerActionsTooltip}",image:sap.ui.core.IconPool.getIconURI("account"),press:[c.pressActionBtn,c]});a.addEventDelegate({onsaptabnext:function(E){try{var n=sap.ui.getCore().byId('shell'),q=n.getModel().getData();if(q.currentState.stateName==="home"){if(q.currentState.showPane){var r=sap.ui.getCore().byId('groupListPage');var t=r.getContent()[1].getItems();var w;for(var i=0;i<t.length&&!w;i++){if(t[i].getDomRef()&&jQuery.sap.getObject("style.display",null,t[i].getDomRef())!=='none'){w=t[i];}}if(w){w.focus();}else{sap.ui.getCore().byId('openCatalogActionItem').focus();}}else{E.preventDefault();if(!sap.ushell.renderers.fiori2.AccessKeysHandler.goToTileContainer()){sap.ui.getCore().byId('configBtn').focus();}}}}catch(e){}}});}var u=new sap.ushell.ui.shell.Shell({id:"shell",fullHeightContent:true,showPane:{path:"/currentState/showPane"},headItems:{path:"/currentState/headItems",factory:f},headEndItems:{path:"/currentState/headEndItems",factory:f},floatingButtons:{path:"/currentState/floatingActions",factory:f},user:a,paneContent:{path:"/currentState/paneContent",factory:f},headerHiding:{path:"/currentState/headerHiding"},headerVisible:{path:"/currentState/headerVisible"},title:{path:"/title"}});u._setStrongBackground(true);var d=u.getHeader();if(d){var g=d.onAfterRendering;d.onAfterRendering=function(){if(g){g.apply(this,arguments);}if(this.getModel().getProperty("/enableHelp")){jQuery('#actionsBtn').addClass('help-id-actionsBtn');jQuery('#configBtn').addClass('help-id-configBtn');jQuery('#homeBtn').addClass('help-id-homeBtn');}jQuery(".sapUshellHeadTitle").removeAttr("tabindex",0);};}if(sap.ui.Device.os.android){o.addEventDelegate({onclick:function(e){e.preventDefault();}});}u.focusOnConfigBtn=function(){jQuery.sap.delayedCall(500,this,function(){if(!b){var C=sap.ui.getCore().byId('configBtn');if(C){C.focus();}}});};u.oldInvalidate=u.invalidate;u.invalidate=function(){this.oldInvalidate.apply(this,arguments);};u.setFocusOnFirstGroupOnPage=function(){var e=sap.ui.getCore().byId('dashboardGroups'),n=jQuery(e.getDomRef()).find(".sapUshellTileContainer:first");if(n[0]){n.focus();}else{sap.ui.getCore().byId('openCatalogActionItem').focus();}};u.setFocusOnFirstGroupInList=function(){var e=sap.ui.getCore().byId('groupList'),n=jQuery(e.getDomRef()).find("li:first");if(n[0]){n.focus();}};this.oDashboardManager=new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr",{model:c.getModel(),config:C});var D=this.pageFactory("dashboardPage",this.oDashboardManager.getDashboardView(),!sap.ui.Device.system.desktop),j=this.pageFactory("shellPage",u,true);j.bindAggregation("footer",{path:"/currentState/footer",factory:f});var k=D.onAfterRendering;D.onAfterRendering=function(){if(k){k.apply(this,arguments);}setTimeout(function(){sap.ui.getCore().getEventBus().publish("grouplist","DashboardRerender");},0);};this.initNavContainer(c);if(S){u.setIcon(sap.ui.resource('sap.ui.core','themes/base/img/1x1.gif'));}else{this.initShellBarLogo(u);}this.setDisplayBlock(true);this.aDanglingControls=[sap.ui.getCore().byId('navContainer'),j,D,B,l,h,o];u.updateAggregation=this.updateShellAggregation;var m=(C.enableSearch!==false);c.getModel().setProperty("/searchAvailable",m);if(m){s.oSearchField=new sap.ushell.ui.shell.ShellHeadItem({id:"sf",tooltip:"{i18n>searchbox_tooltip}",icon:sap.ui.core.IconPool.getIconURI("search"),visible:{path:"/searchAvailable"},showSeparator:false,press:function(e){var i;if(!s.searchShellHelper){jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchShellHelper');s.searchShellHelper=sap.ushell.renderers.fiori2.search.SearchShellHelper;s.searchShellHelper.init(s);i=false;}else{i=s.searchShellHelper.oHeadSearchBox.getVisible();}i=!i;s.searchShellHelper.handleClickMagnifier();u.setSearchVisible(i);}});s.aDanglingControls.push(s.oSearchField);}this.logonIFrameReference=null;return new sap.m.App({pages:j});},loadUserImage:function(){var i=sap.ushell.Container.getUser().getImage();if(i){jQuery.ajax({url:i,headers:{'Cache-Control':'no-cache, no-store, must-revalidate','Pragma':'no-cache','Expires':'0'},success:function(){var a=sap.ui.getCore().byId('actionsBtn');if(a){a.setImage(i);}},error:function(){jQuery.sap.log.error("Could not load user image from: "+i,"","sap.ushell.renderers.fiori2.Shell.view");}});}},_getIconURI:function(i){var r=null;if(i){var m=/url[\s]*\('?"?([^\'")]*)'?"?\)/.exec(i);if(m){r=m[1];}}return r;},initShellBarLogo:function(u){jQuery.sap.require("sap.ui.core.theming.Parameters");var i=sap.ui.core.theming.Parameters.get("sapUiGlobalLogo");if(i){i=this._getIconURI(i);if(!i){u.setIcon(sap.ui.resource("sap.ui.core","mimes/logo/sap_50x26.png"));}}var t=this;sap.ui.getCore().attachThemeChanged(function(){if(u.bIsDestroyed){return;}var n=sap.ui.core.theming.Parameters.get("sapUiGlobalLogo");if(n){n=t._getIconURI(n);if(n){u.setIcon(n);}else{u.setIcon(sap.ui.resource("sap.ui.core","mimes/logo/sap_50x26.png"));}}else{u.setIcon(sap.ui.resource("sap.ui.core","mimes/logo/sap_50x26.png"));}});},initNavContainer:function(c){var d=sap.ui.getCore().byId("dashboardPage"),n=new sap.m.NavContainer({id:"navContainer",pages:[d],initialPage:d,afterNavigate:jQuery.proxy(c.onAfterNavigate,c)});n.addCustomTransition("slideBack",sap.m.NavContainer.transitions.slide.back,sap.m.NavContainer.transitions.slide.back);return n;},updateShellAggregation:function(n){var b=this.mBindingInfos[n],a=this.getMetadata().getJSONKeys()[n],c;jQuery.each(this[a._sGetter](),jQuery.proxy(function(i,v){this[a._sRemoveMutator](v);},this));jQuery.each(b.binding.getContexts(),jQuery.proxy(function(i,v){c=b.factory(this.getId()+"-"+i,v)?b.factory(this.getId()+"-"+i,v).setBindingContext(v,b.model):"";this[a._sMutator](c);},this));},disableBouncing:function(p){p.onBeforeRendering=function(){sap.m.Page.prototype.onBeforeRendering.apply(p);var s=this._oScroller,o=s.onAfterRendering;s.onAfterRendering=function(){o.apply(s);if(s._scroller){s._scroller.options.bounce=false;}};};return p;},getControllerName:function(){return"sap.ushell.renderers.fiori2.Shell";},pageFactory:function(i,c,d){var p=new sap.m.Page({id:i,showHeader:false,content:c,enableScrolling:!!sap.ui.Device.system.desktop}),e=["onAfterHide","onAfterShow","onBeforeFirstShow","onBeforeHide","onBeforeShow"],D={};jQuery.each(e,function(I,E){D[E]=jQuery.proxy(function(a){jQuery.each(this.getContent(),function(I,c){c._handleEvent(a);});},p);});p.addEventDelegate(D);if(d&&sap.ui.Device.system.desktop){this.disableBouncing(p);}return p;},onAfterRendering:function(){if(window.f2p){jQuery.sap.require("sap.ushell.components.perf.monitor");window.f2pMonitor.init(sap.ui.getCore().byId("navContainer"));}},createIFrameDialog:function(){var d=null,l=this.logonIFrameReference,c;var _=function(){if(l){l.remove();}return $('<iframe id="SAMLDialogFrame" src="" frameborder="0"></iframe>');};var a=function(){d.addStyleClass('samlDialogHidden');$('#sap-ui-blocklayer-popup').addClass('samlDialogHidden');};this.destroyIFrameDialog();var b=new sap.m.Button({text:sap.ushell.resources.i18n.getText("samlCloseBtn"),press:function(){sap.ushell.Container.cancelLogon();}});var h=new sap.ui.core.HTML("SAMLDialogFrame");this.logonIFrameReference=_();h.setContent(this.logonIFrameReference.prop('outerHTML'));d=new sap.m.Dialog({id:"SAMLDialog",title:sap.ushell.resources.i18n.getText("samlDialogTitle"),contentWidth:"50%",contentHeight:"50%",rightButton:b});c=sap.ushell.Container.getService("SupportTicket").isEnabled();if(c){jQuery.sap.require("sap.ushell.ui.footerbar.ContactSupportButton");var C=new sap.ushell.ui.footerbar.ContactSupportButton();C.setWidth('150px');C.setIcon('');d.setLeftButton(C);}d.addContent(h);d.open();a();this.logonIFrameReference=$('#SAMLDialogFrame');return this.logonIFrameReference[0];},destroyIFrameDialog:function(){var d=sap.ui.getCore().byId('SAMLDialog');if(d){d.destroy();}this.logonIFrameReference=null;},showIFrameDialog:function(){var d=sap.ui.getCore().byId('SAMLDialog');if(d){d.removeStyleClass('samlDialogHidden');$('#sap-ui-blocklayer-popup').removeClass('samlDialogHidden');}}});}());
