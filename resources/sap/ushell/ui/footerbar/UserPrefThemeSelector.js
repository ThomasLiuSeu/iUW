// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.require("sap.ushell.resources");jQuery.sap.require("sap.ushell.services.Container");jQuery.sap.declare("sap.ushell.ui.footerbar.UserPrefThemeSelector");sap.ushell.ui.footerbar.UserPrefThemeSelector=function(){try{this.userInfoService=sap.ushell.Container.getService("UserInfo");this.oUser=this.userInfoService.getUser();}catch(e){jQuery.sap.log.error("Getting UserInfo service failed.");this.oUser=sap.ushell.Container.getUser();}this.translationBundle=sap.ushell.resources.i18n;this.currentThemeId=this.oUser.getTheme();this.aThemeList=null;};sap.ushell.ui.footerbar.UserPrefThemeSelector.prototype.getTitle=function(){return this.translationBundle.getText("theme");};sap.ushell.ui.footerbar.UserPrefThemeSelector.prototype.getIsChangeThemePermitted=function(){return this.oUser.isSetThemePermitted();};sap.ushell.ui.footerbar.UserPrefThemeSelector.prototype.getValue=function(){var d=jQuery.Deferred();var t=this._getThemeList();var a=this;var b;t.done(function(T){a.aThemeList=T;b=a._getThemeNameById(a.currentThemeId);d.resolve(b);});t.fail(function(e){d.reject(e);});return d.promise();};sap.ushell.ui.footerbar.UserPrefThemeSelector.prototype.getOnCancel=function(){this.currentThemeId=this.oUser.getTheme();};sap.ushell.ui.footerbar.UserPrefThemeSelector.prototype.getOnSave=function(){var d=jQuery.Deferred();var u;var m=sap.ui.getCore().byId("shell").getModel();if(this.oUser.getTheme()!=this.currentThemeId){if(this.currentThemeId){this.oUser.setTheme(this.currentThemeId);u=this.userInfoService.updateUserPreferences(this.oUser);u.done(function(){this.oUser.resetChangedProperties();if(m.getProperty("/tilesOpacity")===true){sap.ushell.utils.handleTilesOpacity();}d.resolve();}.bind(this));u.fail(function(e){this._restoreUserPreferencesProperties(e);d.reject(e);}.bind(this));}else{d.reject("Could not find theme: "+this.currentThemeId);}}else{d.resolve();}return d.promise();};sap.ushell.ui.footerbar.UserPrefThemeSelector.prototype._restoreUserPreferencesProperties=function(e){var m,o=this.oUser.getChangedProperties().filter(function(C){return C.name==="THEME";})[0].oldValue;this.oUser.setTheme(o);m=sap.ushell.Container.getService("Message");m.error(this.translationBundle.getText("changeThemeFailed"));jQuery.sap.log.error(e);};sap.ushell.ui.footerbar.UserPrefThemeSelector.prototype.getContent=function(){var d=jQuery.Deferred();var l=sap.ui.getCore().byId('themeSelectorList');if(l){d.resolve(l);}else{if(this.aThemeList.length>0){this.aThemeList.sort(function(a,b){var c=a.name,e=b.name;if(c<e){return-1;}if(c>e){return 1;}return 0;});for(var i=0;i<this.aThemeList.length;i++){if(this.aThemeList[i].id==this.currentThemeId){this.aThemeList[i].isSelected=true;}else{this.aThemeList[i].isSelected=false;}}this.oModel=new sap.ui.model.json.JSONModel({options:this.aThemeList});var t=this._getThemeListItemTemplate();var L=new sap.m.List('themeSelectorList',{includeItemInSelection:true,mode:"SingleSelectLeft",items:{path:"/options",template:t}});L.setModel(this.oModel);d.resolve(L);}else{d.reject();}}return d.promise();};sap.ushell.ui.footerbar.UserPrefThemeSelector.prototype._getThemeList=function(){var d=jQuery.Deferred();if(this.aThemeList==null){if(this.getIsChangeThemePermitted()==true){var g=this.userInfoService.getThemeList();g.done(function(D){d.resolve(D.options);});g.fail(function(){d.reject("Failed to load theme list.");});}else{d.resolve([this.currentThemeId]);}}else{d.resolve(this.aThemeList);}return d.promise();};sap.ushell.ui.footerbar.UserPrefThemeSelector.prototype._getThemeListItemTemplate=function(){var t=this;var o=function(e){var i=e.srcControl;t.currentThemeId=i.getBindingContext().getProperty("id");};var i=new sap.m.StandardListItem({title:"{name}",selected:"{isSelected}"});i.addEventDelegate({onclick:o});return i;};sap.ushell.ui.footerbar.UserPrefThemeSelector.prototype._getThemeNameById=function(t){if(this.aThemeList){for(var i=0;i<this.aThemeList.length;i++){if(this.aThemeList[i].id==t){return this.aThemeList[i].name;}}}return t;};}());
