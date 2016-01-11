// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.renderers.fiori2.launchpad.DashboardManager");jQuery.sap.require("sap.ushell.services.Message");var g=function(m,p){return p?sap.ushell.resources.i18n.getText(m,p):sap.ushell.resources.i18n.getText(m);},c=function(C){var a=this.oModel.getProperty('/catalogTiles'),b=a.filter(function(t){return t.catalog===C.title&&t.isTileIntentSupported===true;});return b.length;};sap.ui.base.EventProvider.extend("sap.ushell.renderers.fiori2.launchpad.DashboardManager",{metadata:{publicMethods:["getModel","getDashboardView","getGroupListView","isGroupListViewCreated","loadPersonalizedGroups","attachEvent","detachEvent","attachEventOnce"]},constructor:function(i,s){if(sap.ushell.renderers.fiori2.launchpad.getDashboardManager&&sap.ushell.renderers.fiori2.launchpad.getDashboardManager()){return sap.ushell.renderers.fiori2.launchpad.getDashboardManager();}sap.ushell.renderers.fiori2.launchpad.getDashboardManager=jQuery.sap.getter(this.getInterface());this.oPageBuilderService=sap.ushell.Container.getService("LaunchPage");this.oModel=s.model;this.oConfig=s.config;this.oDashboardView=sap.ui.view('dashboard',{type:sap.ui.core.mvc.ViewType.JS,viewName:"sap.ushell.renderers.fiori2.launchpad.dashboard.DashboardContent",viewData:{config:this.oConfig}});this.oDashboardView.setWidth('');this.oDashboardView.setDisplayBlock(true);this.oSortableDeferred=$.Deferred();this.oSortableDeferred.resolve();this.aRequestQueue=[];this.bRequestRunning=false;this.tagsPool=[];this.registerEvents();this.oTileCatalogToGroupsMap={};this.tileViewUpdateQueue=[];this.tileViewUpdateTimeoutID=0;this.oPopover=null;this.tileUuid=null;this.oGroupNotLockedFilter=new sap.ui.model.Filter("isGroupLocked",sap.ui.model.FilterOperator.EQ,false);},createMoveActionDialog:function(){var G=this.oGroupNotLockedFilter;this.moveDialog=new sap.m.SelectDialog("moveDialog",{title:sap.ushell.resources.i18n.getText('moveTileDialog_title'),rememberSelections:false,search:function(e){var v=e.getParameter("value"),f=new sap.ui.model.Filter("title",sap.ui.model.FilterOperator.Contains,v),b=e.getSource().getBinding("items");b.filter([f,G]);},contentWidth:'400px',confirm:function(e){var C=e.getParameter("selectedContexts"),E=sap.ui.getCore().getEventBus();if(C.length){E.publish("launchpad","moveTile",{sTileId:this.tileUuid,toGroupId:C[0].getObject().groupId,toIndex:C[0].getObject().tiles.length});E.publish("launchpad","scrollToGroup",{groupId:C[0].getObject().groupId,groupChanged:false,focus:false});}}.bind(this),items:{path:"/groups",filters:[G],template:new sap.m.StandardListItem({title:"{title}"})}});this.moveDialog.setModel(this.oModel);},registerEvents:function(){var e=sap.ui.getCore().getEventBus(),t=this;e.subscribe("launchpad","addBookmarkTile",this._createBookmark,this);e.subscribe("sap.ushell.services.Bookmark","bookmarkTileAdded",this._addBookmarkToModel,this);e.subscribe("sap.ushell.services.Bookmark","bookmarkTileDeleted",this.loadPersonalizedGroups,this);e.subscribe("launchpad","loadDashboardGroups",this.loadPersonalizedGroups,this);e.subscribe("launchpad","createGroupAt",this._createGroupAt,this);e.subscribe("launchpad","createGroup",this._createGroup,this);e.subscribe("launchpad","deleteGroup",this._deleteGroup,this);e.subscribe("launchpad","resetGroup",this._resetGroup,this);e.subscribe("launchpad","changeGroupTitle",this._changeGroupTitle,this);e.subscribe("launchpad","moveGroup",this._moveGroup,this);e.subscribe("launchpad","deleteTile",this._deleteTile,this);e.subscribe("launchpad","moveTile",this._moveTile,this);e.subscribe("launchpad","sortableStart",this._sortableStart,this);e.subscribe("launchpad","sortableStop",this._sortableStop,this);e.subscribe("showCatalog",this.loadAllCatalogs,this);this.oPageBuilderService.registerTileActionsProvider(function(T){jQuery.sap.require("sap.m.MessageBox");return[{text:"Remove",press:function(){t._deleteTile(null,null,{originalTileId:t.oPageBuilderService.getTileId(T)});}},{text:sap.ushell.resources.i18n.getText('moveTileDialog_action'),press:function(E){t.tileUuid=t.getModelTileById(t.oPageBuilderService.getTileId(T)).uuid;if(!t.moveDialog){t.createMoveActionDialog();}t.moveDialog.getBinding("items").filter([t.oGroupNotLockedFilter]);t.moveDialog.open();}}];});this.oDashboardView.addEventDelegate({onBeforeFirstShow:jQuery.proxy(function(a){try{this.loadPersonalizedGroups();}catch(b){window.console.log("DahsboardManager ; oDashboardView.addEventDelegate failed ; exception: "+b);}},this),onAfterHide:jQuery.proxy(function(a){try{sap.ushell.utils.setTilesNoVisibility();}catch(b){window.console.log("DahsboardManager ; Call to _sap.ushell.utils.setTilesNoVisibility failed ; exception: "+b);}},this)});},destroy:function(){var e=sap.ui.getCore().getEventBus();e.unsubscribe("launchpad","addBookmarkTile",this._createBookmark,this);e.unsubscribe("launchpad","loadDashboardGroups",this.loadPersonalizedGroups,this);e.unsubscribe("launchpad","createGroupAt",this._createGroupAt,this);e.unsubscribe("launchpad","createGroup",this._createGroup,this);e.unsubscribe("launchpad","deleteGroup",this._deleteGroup,this);e.unsubscribe("launchpad","resetGroup",this._resetGroup,this);e.unsubscribe("launchpad","changeGroupTitle",this._changeGroupTitle,this);e.unsubscribe("launchpad","moveGroup",this._moveGroup,this);e.unsubscribe("launchpad","deleteTile",this._deleteTile,this);e.unsubscribe("launchpad","moveTile",this._moveTile,this);e.unsubscribe("launchpad","sortableStart",this._sortableStart,this);e.unsubscribe("launchpad","sortableStop",this._sortableStop,this);e.unsubscribe("showCatalog",this.loadAllCatalogs,this);e.unsubscribe("sap.ushell.services.Bookmark","bookmarkTileAdded",this._addBookmarkToModel,this);e.unsubscribe("sap.ushell.services.Bookmark","bookmarkTileDeleted",this.loadPersonalizedGroups,this);this.oDashboardView.destroy();sap.ushell.renderers.fiori2.launchpad.getDashboardManager=undefined;},_refreshTiles:function(){var t=this,G=this.oModel.getProperty("/groups");jQuery.each(G,function(n,o){jQuery.each(o.tiles,function(n,T){t.oPageBuilderService.refreshTile(T.object);});});},_sortableStart:function(){this.oSortableDeferred=$.Deferred();},_createBookmark:function(C,e,d){var t=d.group?d.group.object:"";delete d.group;this._addRequest($.proxy(function(){var r=sap.ushell.Container.getService("Bookmark").addBookmark(d,t),R=sap.ushell.resources.i18n;r.always($.proxy(this._checkRequestQueue,this));r.done(function(){if(sap.ushell.Container){sap.ushell.Container.getService('Message').info(R.getText('tile_created_msg'));}});r.fail(function(m){jQuery.sap.log.error("Failed to add bookmark",m,"sap.ushell.ui.footerbar.AddBookmarkButton");if(sap.ushell.Container){sap.ushell.Container.getService('Message').error(R.getText('fail_to_add_tile_msg'));}});},this));},_addBookmarkToModel:function(C,e,d){var t=d.tile,G=d.group;if(!d||!t){this.loadPersonalizedGroups();return;}var i=G?G.isGroupLocked:false,n=this._getTileModel(t,i),a=G?this._getIndexOfGroupByObject(G):0,b=this.oModel.getProperty("/groups/"+a);b.tiles.push(n);this.oModel.setProperty("/groups/"+a,b);},_sortableStop:function(){this.oSortableDeferred.resolve();},_handleAfterSortable:function(f){return $.proxy(function(){var o=Array.prototype.slice.call(arguments);this.oSortableDeferred.done(function(){f.apply(null,o);});},this);},_addRequest:function(r){this.aRequestQueue.push(r);if(!this.bRequestRunning){this.bRequestRunning=true;this.aRequestQueue.shift()();}},_checkRequestQueue:function(){if(this.aRequestQueue.length===0){this.bRequestRunning=false;}else{this.aRequestQueue.shift()();}},_requestFailed:function(){this.aRequestQueue=[];this.bRequestRunning=false;},_createGroup:function(C,e,d){var G=this._getGroupModel(null),a=this.oModel.getProperty("/groups"),m=this.oModel;m.setProperty("/groupList-skipScrollToGroup",true);window.setTimeout(function(){m.setProperty("/groups/"+a.length,G);},500);window.setTimeout(function(){m.setProperty("/groupList-skipScrollToGroup",false);},1000);},_createGroupAt:function(C,e,d){var n=parseInt(d.location,10),G=this.oModel.getProperty("/groups"),o=this._getGroupModel(null,false,n===G.length),m=this.oModel,i;o.index=n;G.splice(n,0,o);for(i=0;i<G.length-1;i++){G[i].isLastGroup=false;}for(i=n+1;i<G.length;i++){G[i].index++;}m.setProperty("/groups",G);},_getIndexOfGroup:function(G){var n=null,a=this.oModel.getProperty("/groups");jQuery.each(a,function(b,o){if(o.groupId===G){n=b;return false;}});return n;},_getIndexOfGroupByObject:function(G){var n=null,a=this.oModel.getProperty("/groups"),s=this.oPageBuilderService.getGroupId(G);a.forEach(function(m,b){var C=this.oPageBuilderService.getGroupId(m.object);if(C===s){n=b;return false;}}.bind(this));return n;},_getPathOfGroup:function(G){return"/groups/"+this._getIndexOfGroup(G);},_getPathOfTile:function(t){var G=this.oModel.getProperty("/groups"),n=null,a=null;jQuery.each(G,function(b,o){jQuery.each(o.tiles,function(d,T){if(T.uuid===t){n=b;a=d;return false;}});if(n!==null){return false;}});return n!==null?"/groups/"+n+"/tiles/"+a:null;},_moveInArray:function(a,n,b){if(b>=a.length){var k=b-a.length;while((k--)+1){a.push(undefined);}}a.splice(b,0,a.splice(n,1)[0]);},_updateGroupIndices:function(a){var k;for(k=0;k<a.length;k++){a[k].index=k;}},_deleteGroup:function(C,e,d){var t=this,G=d.groupId,a=this.oModel.getProperty("/groups"),n=this._getIndexOfGroup(G),i=a.length-1===n,o=null,r,m,b,B;b=i?n-1:n;this._destroyGroupModel("/groups/"+n);o=a.splice(n,1)[0].object;if(i){this.oModel.setProperty("/groups/"+b+"/isLastGroup",i);}m=this.oModel;m.setProperty("/groupList-skipScrollToGroup",true);m.setProperty("/groups",a);this._updateGroupIndices(a);if(b>=0){B=sap.ui.getCore().getEventBus();window.setTimeout($.proxy(B.publish,B,"launchpad","scrollToGroup",{groupId:this.oModel.getProperty("/groups")[b].groupId}),200);}window.setTimeout(function(){m.setProperty("/groupList-skipScrollToGroup",false);},1000);this._addRequest($.proxy(function(){var f=sap.ushell.Container.getService("LaunchPage").getGroupTitle(o);try{r=this.oPageBuilderService.removeGroup(o);}catch(h){this._resetGroupsOnFailure("fail_to_delete_group_msg");return;}r.done($.proxy(this._showLocalizedMessage("group_deleted_msg",[f])));r.fail(this._handleAfterSortable(t._resetGroupsOnFailureHelper("fail_to_delete_group_msg")));r.always($.proxy(this._checkRequestQueue,this));},this));},_resetGroup:function(C,e,d){var t=this,G=d.groupId,n=this._getIndexOfGroup(G),o=this.oModel.getProperty("/groups/"+n),r;this.oModel.setProperty("/groups/"+n+"/sortable",false);this._addRequest($.proxy(function(){try{r=this.oPageBuilderService.resetGroup(o.object);}catch(a){this._resetGroupsOnFailure("fail_to_reset_group_msg");return;}r.done(this._handleAfterSortable($.proxy(function(G,o,R){var n=t._getIndexOfGroup(G);this._loadGroup(n,R||o.object);this._showLocalizedMessage("group_reset_msg",[o.title]);this.oModel.setProperty("/groups/"+n+"/sortable",true);var b=sap.ui.getCore().byId('dashboardGroups').getGroupControlByGroupId(G);if(b){b.rerender();}},this,G,o)));r.fail(this._handleAfterSortable(t._resetGroupsOnFailureHelper("fail_to_reset_group_msg")));r.always($.proxy(this._checkRequestQueue,this));},this));},_moveGroup:function(C,e,d){var f=d.fromIndex,t=d.toIndex,G=this.oModel.getProperty("/groups"),m=this.oModel,a=this.oModel.getProperty("/tileActionModeActive"),r;if(!a){f=this._adjustFromGroupIndex(f,G);}var o=G[f],s=o.groupId;if(!a){t=this._adjustToGroupIndex(t,G,s);}this._moveInArray(G,f,t);this._updateGroupIndices(G);m.setProperty("/groupList-skipScrollToGroup",true);for(var i=0;i<G.length-1;i++){G[i].isLastGroup=false;}G[G.length-1].isLastGroup=true;m.setProperty("/groups",G);window.setTimeout(function(){m.setProperty("/groupList-skipScrollToGroup",false);},1000);this._addRequest($.proxy(function(){var o=this.oModel.getProperty(this._getPathOfGroup(s));try{r=this.oPageBuilderService.moveGroup(o.object,t);}catch(b){this._resetGroupsOnFailure("fail_to_move_group_msg");return;}r.fail(this._handleAfterSortable(this._resetGroupsOnFailureHelper("fail_to_move_group_msg")));r.always($.proxy(this._checkRequestQueue,this));},this));},_adjustToGroupIndex:function(t,a,b){var v=0,I=false,i=0;for(i=0;i<a.length&&v<t;i++){if(a[i].isGroupVisible){if(a[i].groupId===b){I=true;}else{v++;}}}if(I){return i-1;}return i;},_adjustFromGroupIndex:function(a,b){var v=0,i;for(i=0;i<b.length;i++){if(b[i].isGroupVisible){v++;}if(v===a+1){return i;}}return a;},_changeGroupTitle:function(C,e,d){var n=d.newTitle,G=this.oModel.getProperty("/groups"),s=d.groupId,a=this._getIndexOfGroup(s),o=this.oModel.getProperty("/groups/"+a),r;this.oModel.setProperty("/groups/"+a+"/title",n);if(!o.object){this._addRequest($.proxy(function(){try{if(a===G.length-1){r=this.oPageBuilderService.addGroup(n,a);}else{r=this.oPageBuilderService.addGroupAt(n,a);}}catch(b){this._resetGroupsOnFailure("fail_to_create_group_msg");return;}r.done(this._handleAfterSortable($.proxy(function(s,N){var a=this._getIndexOfGroup(s);this._loadGroup(a,N);},this,s)));r.fail(this._handleAfterSortable(this._resetGroupsOnFailureHelper("fail_to_create_group_msg")));},this));}else{this._addRequest($.proxy(function(){try{r=this.oPageBuilderService.setGroupTitle(o.object,n);}catch(b){this._resetGroupsOnFailure("fail_to_rename_group_msg");return;}r.fail(this._handleAfterSortable($.proxy(function(s,O){var f=this._getPathOfGroup(s);this._showLocalizedError("fail_to_rename_group_msg");this.oModel.setProperty(f+"/title",O);this._requestFailed();},this,s)));},this));}r.always($.proxy(this._checkRequestQueue,this));},_createTile:function(d){var C=d.catalogTileContext,o=d.groupContext,G=this.oModel.getProperty(o.getPath()),s=G.groupId,r,a=jQuery.Deferred(),R={};var b=sap.ui.getCore().getEventBus();$.proxy(b.publish,b,"launchpad","addTile",{catalogTileContext:C,groupContext:o});if(!C){jQuery.sap.log.warning("DashboardManager: Did not receive catalog tile object. Abort.",this);return;}this._addRequest($.proxy(function(){try{r=this.oPageBuilderService.addTile(C.getProperty("src"),o.getProperty("object"));}catch(e){this._resetGroupsOnFailure("fail_to_add_tile_msg");return;}var t=this;r.done(this._handleAfterSortable($.proxy(function(s,T){var f=this._getPathOfGroup(s);this._addTileToGroup(f,T);R={group:G,status:1,action:'add'};a.resolve(R);},this,s))).fail(function(){R={group:G,status:0,action:'add'};a.resolve(R);}).always(function(){t._checkRequestQueue();});},this));return a.promise();},_createGroupAndSaveTile:function(d){var C=d.catalogTileContext,n=d.newGroupName,r,a=jQuery.Deferred(),R={};if(sap.ushell.utils.validHash(n)&&C){var G=this._getGroupModel(null,false,true),b=this.oModel.getProperty("/groups"),s=G.groupId;var i=b.length;b[i-1].isLastGroup=false;G.title=n;G.index=i;b.push(G);this.oModel.setProperty("/groups/",b);if(!C){jQuery.sap.log.warning("DashboardManager: Did not receive catalog tile object. Abort.",this);return;}this._addRequest($.proxy(function(){try{r=this.oPageBuilderService.addGroup(n);}catch(e){this._resetGroupsOnFailure("fail_to_create_group_msg");return;}r.done(this._handleAfterSortable($.proxy(function(s,N){var f=this._getIndexOfGroup(s);this._loadGroup(f,N);var o=new sap.ui.model.Context(this.oModel,"/groups/"+f);var p=this._createTile({catalogTileContext:C,groupContext:o});p.done(function(h){R={group:h.group,status:1,action:'addTileToNewGroup'};a.resolve(R);}).fail(function(h){R={group:h.group,status:0,action:'addTileToNewGroup'};a.resolve(R);});},this,s)));r.fail(function(f){this._handleAfterSortable(this._resetGroupsOnFailureHelper("fail_to_create_group_msg"));R={group:f.group,status:0,action:'createNewGroup'};a.resolve(R);});r.always($.proxy(this._checkRequestQueue,this));},this));}return a.promise();},_deleteTile:function(C,e,d){var t=this,T=d.tileId||d.originalTileId,G=this.oModel.getProperty("/groups");jQuery.each(G,function(n,o){var f=false;jQuery.each(o.tiles,function(a,b){if(b.uuid===T||b.originalTileId===T){t._destroyTileModel("/groups/"+n+"/tiles/"+a);var h=o.tiles.splice(a,1)[0],r;t.oModel.setProperty("/groups/"+n+"/tiles",o.tiles);t._addRequest(function(){try{r=t.oPageBuilderService.removeTile(o.object,h.object);}catch(i){this._resetGroupsOnFailure("fail_to_remove_tile_msg");return;}r.done(t._handleAfterSortable(function(){var s=sap.ushell.Container.getService("LaunchPage").getTileTitle(h.object);if(s){t._showLocalizedMessage("tile_deleted_msg",[s,o.title]);}else{t._showLocalizedMessage("tile_deleted_msg",[s,o.title]);}}));r.fail(t._handleAfterSortable(t._resetGroupsOnFailureHelper("fail_to_remove_tile_msg")));r.always($.proxy(t._checkRequestQueue,t));});sap.ushell.utils.handleTilesVisibility();f=true;return false;}});if(f){return false;}});},_sendDeleteTileRequest:function(G,t){var r,a=sap.ushell.Container.getService('LaunchPage');try{r=a.removeTile(G,t.object);}catch(e){jQuery.sap.log.error("_deleteCatalogTileFromGroup ; removeTile ; Exception occurred: "+e);}return r;},_deleteCatalogTileFromGroup:function(d){var t=this,D=decodeURIComponent(d.tileId),G=d.groupIndex,o=this.oModel.getProperty("/groups/"+G),s=sap.ushell.Container.getService("LaunchPage"),a=jQuery.Deferred(),b=[],t=this,f;f=o.tiles.filter(function(T){var e=s.getCatalogTileId(T.object);if(e!==D){return true;}else{var p=jQuery.Deferred(),h=t._sendDeleteTileRequest(o.object,T);h.done((function(a){return function(){a.resolve({status:true});};})(p));h.fail((function(a){return function(){a.resolve({status:false});};})(p));b.push(p);return false;}});o.tiles=f;jQuery.when.apply(jQuery,b).done(function(r){var S=true,i=0,p=b.length;for(i;i<p;i++){if(!r.status){S=false;break;}}if(S){t.oModel.setProperty("/groups/"+G,o);}a.resolve({group:o,status:S,action:'remove'});});return a.promise();},_moveTile:function(C,e,d){var t=this,n=d.toIndex,N=d.toGroupId,T=d.sTileId,o,a,O,b,f,h,G=this.oModel.getProperty("/groups");jQuery.each(G,function(j,k){var F=false;jQuery.each(k.tiles,function(l,m){if(m.uuid===T){o=m;a=l;O=k;b=j;F=true;return false;}});if(F){return false;}});jQuery.each(G,function(j,k){if(k.groupId===N){f=k;h=j;}});if(n&&n>f.tiles.length){n=f.tiles.length;}if(O.groupId===N){if(n===null||n===undefined){O.tiles.splice(a,1);n=O.tiles.length;O.tiles.push(o);}else{n=this._adjustTileIndex(n,o,O);this._moveInArray(O.tiles,a,n);}this.oModel.setProperty("/groups/"+b+"/tiles",O.tiles);}else{O.tiles.splice(a,1);this.oModel.setProperty("/groups/"+b+"/tiles",O.tiles);if(n===null||n===undefined){n=f.tiles.length;f.tiles.push(o);}else{n=this._adjustTileIndex(n,o,f);f.tiles.splice(n,0,o);}this.oModel.setProperty("/groups/"+h+"/tiles",f.tiles);}sap.ushell.utils.handleTilesVisibility();var s=this.oModel.getProperty("/groups/"+b).object,i=this.oModel.getProperty("/groups/"+h).object,r;this._addRequest($.proxy(function(){try{r=this.oPageBuilderService.moveTile(o.object,a,n,s,i);}catch(j){this._resetGroupsOnFailure("fail_to_move_tile_msg");return;}o.tileIsBeingMoved=true;r.done(this._handleAfterSortable($.proxy(function(T,k){var l=this._getPathOfTile(T);if(l){this.oModel.setProperty(l+"/object",k);this.oModel.setProperty(l+"/originalTileId",this.oPageBuilderService.getTileId(k));this.oPageBuilderService.getTileView(k).done(function(v){var m=this.oModel.getProperty(l+"/content");this.oModel.setProperty(l+"/content",[v]);if(m&&m[0]){m[0].destroy();}this.oModel.setProperty(l+"/tileIsBeingMoved",false);}.bind(this));}},this,T)));r.fail(this._handleAfterSortable(this._resetGroupsOnFailureHelper("fail_to_move_tile_msg")));r.always($.proxy(this._checkRequestQueue,this));},this));},_adjustTileIndex:function(n,t,a){var v=0,I=false,i=0;for(i=0;i<a.tiles.length&&v<n;i++){if(a.tiles[i].isTileIntentSupported){if(a.tiles[i]===t){I=true;}else{v++;}}}if(I){return i-1;}return i;},getModel:function(){return this.oModel;},getDashboardView:function(){if(!sap.ui.getCore().byId('dashboard')){this.oDashboardView=sap.ui.jsview("dashboard","sap.ushell.renderers.fiori2.launchpad.dashboard.DashboardContent");}return this.oDashboardView;},getGroupListView:function(){if(!sap.ui.getCore().byId('groupList')){this.oGroupListView=sap.ui.jsview("groupList","sap.ushell.renderers.fiori2.launchpad.group_list.GroupList");}return this.oGroupListView;},isGroupListViewCreated:function(){return this.oGroupListView!=undefined;},loadAllCatalogs:function(C,e,d){if(!this.oModel.getProperty("/catalogs")||!sap.ushell.Container.getService("LaunchPage").isCatalogsValid()){var t=this;if(!this.oModel.getProperty("/groups")||this.oModel.getProperty("/groups").length===0){this.loadPersonalizedGroups();}this.numOfLoadedCatalogs=0;this._destroyAllGroupModels("/catalogs");this._destroyAllTileModels("/catalogTiles");this.oModel.setProperty("/catalogs",[]);this.oModel.setProperty("/catalogTiles",[]);this.aPromises=[];sap.ushell.Container.getService("LaunchPage").getCatalogs().done(function(a){jQuery.when.apply(jQuery,this.aPromises).then(this.onDoneLoadingCatalogs(a));}.bind(this)).fail(t._showLocalizedErrorHelper("fail_to_load_catalog_msg")).progress(this.addCatalogToModel.bind(this));}var G=this.getModel().getProperty("/groups");if(G&&G.length!==0){this.mapCatalogTilesToGroups();this.updateCatalogTilesToGroupsMap();}},updateCatalogTilesToGroupsMap:function(){var a=this.getModel().getProperty("/catalogTiles"),t,i,b,d,G;var s=sap.ushell.Container.getService("LaunchPage");var e=this.getModel().getProperty("/catalogTiles");if(a){for(i=0;i<a.length;i++){t=a[i];b=encodeURIComponent(s.getCatalogTileId(t.src));d=this.getModel().getProperty("/catalogTiles/"+i+"/associatedGroups");G=this.oTileCatalogToGroupsMap[b];d=G?G:[];e[i].associatedGroups=d;}}this.getModel().setProperty("/catalogTiles",e);},addCatalogToModel:function(C){var a=this.oModel.getProperty('/catalogs'),s=sap.ushell.Container.getService("LaunchPage"),b=s.getCatalogId(C),d=s.getCatalogTitle(C),e=false;a.forEach(function(f){if(f.id===b){e=true;}});if(!e){var o={title:s.getCatalogTitle(C),id:s.getCatalogId(C),"static":false,tiles:[],numberOfTiles:0},p;p=s.getCatalogTiles(C);this.aPromises.push(p);p.done(function(t){if(!t.length){return;}var f={catalog:o.title,id:o.id,index:this.numOfLoadedCatalogs,numberOfExistingTiles:0};var u=function(){if(!this.oModel.getProperty('/isCatalogInUpdate')){this.oModel.setProperty('/isCatalogInUpdate',true);var E=this.searchModelCatalogByTitle(o.title);if(E.result){f.index=E.indexOfPreviousInstanceInPage;f.numberOfExistingTiles=E.numOfTilesInCatalog;this.setCatalogTiles("/catalogTiles",true,f,t);var h=this.oModel.getProperty('/catalogs');C=h[E.indexOfPreviousInstanceInModel];C.numIntentSupportedTiles=c.call(this,o);C.numberOfTiles=E.numOfTilesInCatalog+t.length;a[E.indexOfPreviousInstanceInModel]=C;}else{this.setCatalogTiles("/catalogTiles",true,f,t);o.numIntentSupportedTiles=c.call(this,o);o.numberOfTiles=t.length;a.push(o);this.numOfLoadedCatalogs++;}this.oModel.setProperty('/catalogs',a);this.oModel.setProperty('/isCatalogInUpdate',false);return;}setTimeout(u,50);}.bind(this);u();}.bind(this)).fail(this._showLocalizedErrorHelper("fail_to_load_catalog_tiles_msg"));}},searchModelCatalogByTitle:function(a){var b=this.oModel.getProperty('/catalogs'),d=false,i,n=0,G=false;$.each(b,function(e,t){if(t.title===sap.ushell.resources.i18n.getText('catalogsLoading')){G=true;}else if(a==t.title){i=e;n=t.numberOfTiles;d=true;return false;}});return{result:d,indexOfPreviousInstanceInModel:i,indexOfPreviousInstanceInPage:G?i-1:i,numOfTilesInCatalog:n};},getTagList:function(m){var i={},d=0,t=[],e,T,s;for(d=0;d<this.tagsPool.length;d++){T=this.tagsPool[d];if(i[T]){i[T]++;}else{i[T]=1;}}for(e in i){t.push({tag:e,occ:i[e]});}s=t.sort(function(a,b){return b.occ-a.occ;});if(s.length===0){this.oModel.setProperty("/tagFiltering",false);}if(m){this.oModel.setProperty("/tagList",s.slice(0,m));}else{this.oModel.setProperty("/tagList",s);}},onDoneLoadingCatalogs:function(C){var s=sap.ushell.Container.getService("LaunchPage");var l=C.filter(function(o){return!s.getCatalogError(o);});if(l.length!==C.length){this._showLocalizedError("partialCatalogFail");}if(this.oModel.getProperty("/tagFiltering")==true){this.getTagList();}var a=this.oModel.getProperty('/catalogs');if(a[0]&&a[0].title===sap.ushell.resources.i18n.getText('catalogsLoading')){a.splice(0,1);}a.splice(0,0,{title:g("catalogSelect_initial_selection"),"static":true,tiles:[],numIntentSupportedTiles:-1});this.oModel.setProperty('/catalogs',a);sap.ushell.utils.handleTilesVisibility();},setCatalogTiles:function(p,a,d,C){var s=sap.ushell.Container.getService("LaunchPage"),u=$.map(C,function(o,t){var b=encodeURIComponent(s.getCatalogTileId(o)),e=this.oTileCatalogToGroupsMap[b]||[],f=s.getCatalogTileTags(o)||[];if(f.length>0){this.tagsPool=this.tagsPool.concat(f);}return{associatedGroups:e,src:o,catalog:d.catalog,catalogIndex:this.calculateCatalogTileIndex(d.index,d.numberOfExistingTiles,t),catalogId:d.id,title:s.getCatalogTileTitle(o),tags:f,keywords:(s.getCatalogTileKeywords(o)||[]).join(','),id:b,size:s.getCatalogTileSize(o),content:[s.getCatalogTileView(o)],isTileIntentSupported:s.isTileIntentSupported(o)};}.bind(this));this.oModel.setProperty(p,$.merge((a&&this.oModel.getProperty(p))||[],u));},calculateCatalogTileIndex:function(a,n,t){var r=parseInt(a*100000);r+=(n!==undefined?n:0)+t;return r;},mapCatalogTilesToGroups:function(){this.oTileCatalogToGroupsMap={};var G=this.oModel.getProperty("/groups"),s=sap.ushell.Container.getService("LaunchPage"),i=0,o,t,T,a,b,d;for(i=0;i<G.length;i++){o=G[i];T=o.tiles;if(T){for(t=0;t<T.length;++t){a=encodeURIComponent(s.getCatalogTileId(T[t].object));b=this.oTileCatalogToGroupsMap[a]||[];d=s.getGroupId(o.object);if(b.indexOf(d)===-1&&(typeof(o.isGroupVisible)==='undefined'||o.isGroupVisible)&&!o.isGroupLocked){b.push(d);}this.oTileCatalogToGroupsMap[a]=b;}}}},_showLocalizedMessage:function(m,p,t){sap.ushell.Container.getService("Message").show(t||sap.ushell.services.Message.Type.INFO,g(m,p),p);},_showLocalizedError:function(m,p){this._showLocalizedMessage(m,p,sap.ushell.services.Message.Type.ERROR);},_showLocalizedErrorHelper:function(m,p){var t=this;return function(){t._showLocalizedError(m,p);};},_resetGroupsOnFailureHelper:function(m){var t=this;return function(G){t._showLocalizedError(m);setTimeout(function(){t.loadGroupsFromArray(G);});};},_resetGroupsOnFailure:function(m,p){this._requestFailed();this._showLocalizedError(m,p);this.loadPersonalizedGroups();this.oModel.updateBindings(true);},loadGroupsFromArray:function(G){var t=this;this.oPageBuilderService.getDefaultGroup().done(function(d){var i=0,l=[],b,a=G.indexOf(d),n=jQuery.grep(G,function(h){return t.oPageBuilderService.isGroupLocked(h);}).length,N,e=[];G.splice(a,1);while(i<G.length){var o=G[i],f=t.oPageBuilderService.isGroupLocked(o);if(f){l.push(o);G.splice(i,1);}else{i++;}}l.sort(function(x,y){var h=t.oPageBuilderService.getGroupTitle(x).toLowerCase(),j=t.oPageBuilderService.getGroupTitle(y).toLowerCase();return h<j?-1:1;});b=l;b.push(d);b.push.apply(b,G);G=b;t.oModel.setProperty("/groups/indexOfDefaultGroup",n);for(i=G.length;i<t.oModel.getProperty("/groups/length");++i){t._destroyGroupModel("/groups/"+i);}for(i=0;i<G.length;++i){N=t._getGroupModel(G[i],i===n,i===G.length-1);N.index=i;e.push(N);}t.oModel.setProperty('/groups',e);t.oModel.setProperty("/groups/length",G.length);if(t.oModel.getProperty('/currentState/stateName')==="catalog"){t.mapCatalogTilesToGroups();t.updateCatalogTilesToGroupsMap();}}).fail(t._resetGroupsOnFailureHelper("fail_to_get_default_group_msg"));},_loadGroup:function(n,G){var t=this,s="/groups/"+n,d=t.oModel.getProperty("/groups/indexOfDefaultGroup"),i=t.oModel.getProperty(s).isLastGroup;this._destroyGroupModel(s);var o=this.oModel.getProperty(s+"/groupId"),N=this._getGroupModel(G,n===d,i);if(o){N.groupId=o;}N.index=n;this.oModel.setProperty(s,N);},_getGroupModel:function(G,d,l){var s=this.oPageBuilderService,a=(G&&s.getGroupTiles(G))||[],m=[],i,b,S=sap.ui.getCore().byId("shell"),M,e,f;if(S){M=S.getModel();b=M.getProperty("/personalization");e=M.getProperty("/currentState").stateName;if(e){f=e==="home";}}var h=G&&s.isGroupLocked(G)?true:false;for(i=0;i<a.length;++i){m.push(this._getTileModel(a[i],h));}return{title:(d&&g("my_group"))||(G&&s.getGroupTitle(G))||"",object:G,groupId:jQuery.sap.uid(),tiles:m,isDefaultGroup:d||false,editMode:!G&&f,isGroupLocked:h,removable:!G||s.isGroupRemovable(G),sortable:b,isGroupVisible:!G||s.isGroupVisible(G),isEnabled:!d,isLastGroup:l||false};},_addTileToGroup:function(G,t){var T=G+"/tiles",n=this.oModel.getProperty(T).length;var i=this.oModel.getProperty(G+"/isGroupLocked");this.oModel.setProperty(T+"/"+n,this._getTileModel(t,i));},_updateModelWithTileView:function(t,T){var a=this;this.tileViewUpdateQueue.push({uuid:t,view:T});if(this.tileViewUpdateTimeoutID){clearTimeout(this.tileViewUpdateTimeoutID);}this.tileViewUpdateTimeoutID=setTimeout(function(){a.tileViewUpdateTimeoutID=undefined;a.oSortableDeferred.done(function(){a._updateModelWithTilesViews();});},50);},_updateModelWithTilesViews:function(){var G=this.oModel.getProperty("/groups"),t,T,u,s,b,l,r={};if(!G){return;}for(var i=0;i<G.length;i=i+1){t=G[i].tiles;for(var j=0;j<t.length;j=j+1){T=t[j];for(var q=0;q<this.tileViewUpdateQueue.length;q++){u=this.tileViewUpdateQueue[q];if(T.uuid==u.uuid){if(u.view){T.content[0].destroy();T.content=[u.view];s=this.oPageBuilderService.getTileSize(T.object);l=((s!==null)&&(s==="1x2"||s==="2x2"))||false;b=((s!==null)&&(s==="2x1"||s==="2x2"))||false;if(T['long']!==l||T.tall!==b){T['long']=l;T.tall=b;r[G[i].groupId]=true;}}else{T.content[0].setState("Failed");}break;}}}}this.tileViewUpdateQueue=[];this.oModel.setProperty("/groups",G);if(!jQuery.isEmptyObject(r)){var d=this.getDashboardView();var a=d.oDashboardGroupsBox.getGroups();for(var e in r){for(var i=0;i<a.length;i++){if(a[i].getGroupId()===e){sap.ushell.Layout.reRenderGroupLayout(a[i]);break;}}}}},getModelTileById:function(i){var G=this.oModel.getProperty('/groups'),m;G.forEach(function(o){o.tiles.forEach(function(t){if(t.uuid===i||t.originalTileId===i){m=t;return;}});});return m;},_getTileModel:function(t,i){var s=this.oPageBuilderService,S=s.getTileSize(t),T=jQuery.sap.uid(),o,u,a=this,d;s.setTileVisible(t,false);d=s.getTileView(t);d.done(function(v){o=v;if(u){u.apply(a,[T,o]);}});d.fail(function(){if(u){u.apply(a,[T]);}else{jQuery.sap.require('sap.ushell.ui.launchpad.TileState');o=new sap.ushell.ui.launchpad.TileState({state:"Failed"});}});if(!o){u=this._updateModelWithTileView;jQuery.sap.require('sap.ushell.ui.launchpad.TileState');o=new sap.ushell.ui.launchpad.TileState({state:"Loading"});}return{"object":t,"originalTileId":s.getTileId(t),"uuid":T,"tileCatalogId":encodeURIComponent(s.getCatalogTileId(t)),"content":[o],"long":((S!==null)&&(S==="1x2"||S==="2x2"))||false,"tall":((S!==null)&&(S==="2x1"||S==="2x2"))||false,"target":s.getTileTarget(t)||"","debugInfo":s.getTileDebugInfo(t),"isTileIntentSupported":s.isTileIntentSupported(t),"rgba":"","isLocked":i,"showActionsIcon":this.oModel.getProperty("/tileActionsIconEnabled")||false};},_destroyAllGroupModels:function(t){var G=(typeof t==="string")?this.oModel.getProperty(t):t,i;if(G){for(i=0;i<G.length;i=i+1){this._destroyGroupModel(G[i]);}}},_destroyGroupModel:function(t){var G=(typeof t==="string")?this.oModel.getProperty(t):t;if(G){this._destroyAllTileModels(G.tiles);}},_destroyAllTileModels:function(t){var T=(typeof t==="string")?this.oModel.getProperty(t):t,i;if(T){for(i=0;i<T.length;i=i+1){this._destroyTileModel(T[i]);}}},_destroyTileModel:function(t){var T=(typeof t==="string")?this.oModel.getProperty(t):t,i;if(T&&T.content){for(i=0;i<T.content.length;i=i+1){T.content[i].destroy();}}},loadPersonalizedGroups:function(){var t=this,G=this.oPageBuilderService.getGroups();G.done(function(a){t.loadGroupsFromArray(a);});G.fail(t._showLocalizedErrorHelper("fail_to_load_groups_msg"));}});}());
