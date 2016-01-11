/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/fl/LrepConnector","sap/ui/fl/Cache","sap/ui/fl/Utils","sap/ui/base/EventProvider"],function(q,L,C,U,E){"use strict";var S=function(s){E.apply(this);if(!s){throw new Error("no flex settings provided");}if(!s.features){s.features={"addField":["CUSTOMER","VENDOR"],"addGroup":["CUSTOMER","VENDOR"],"removeField":["CUSTOMER","VENDOR"],"removeGroup":["CUSTOMER","VENDOR"],"hideControl":["CUSTOMER","VENDOR"],"unhideControl":["CUSTOMER","VENDOR"],"renameField":["CUSTOMER","VENDOR"],"renameGroup":["CUSTOMER","VENDOR"],"moveFields":["CUSTOMER","VENDOR"],"moveGroups":["CUSTOMER","VENDOR"]};}this._oSettings=s;this._bFlexChangeMode=true;};S.prototype=q.sap.newObject(E.prototype);S.events={changeModeUpdated:"changeModeUpdated"};S._instances={};S.getInstance=function(c){return C.getChangesFillingCache(L.createConnector(),c).then(function(f){var s;if(S._instances[c]){s=S._instances[c];}else if(f.changes&&f.changes.settings){s=new S(f.changes.settings);S._instances[c]=s;}else{s=new S({});S._instances[c]=s;}return s;});};S.getInstanceOrUndef=function(c){var s;if(S._instances[c]){s=S._instances[c];}return s;};S.prototype.isKeyUser=function(){var i=false;if(this._oSettings.isKeyUser){i=this._oSettings.isKeyUser;}return i;};S.prototype.isModelS=function(){var i=false;if(this._oSettings.isAtoAvailable){i=this._oSettings.isAtoAvailable;}return i;};S.prototype.isAtoEnabled=function(){var i=false;if(this._oSettings.isAtoEnabled){i=this._oSettings.isAtoEnabled;}return i;};S.prototype.isChangeTypeEnabled=function(c,a){if(!a){a='USER';}var i=false;if(!this._oSettings.features[c]){i=true;}else{var A=q.inArray(a,this._oSettings.features[c]);if(A<0){i=false;}else{i=true;}}return i;};S.prototype.isFlexChangeMode=function(){var f=false;var F=this._isFlexChangeModeFromUrl();if(F===undefined){f=this._bFlexChangeMode;}else{f=F;}return f;};S.prototype._isFlexChangeModeFromUrl=function(){var f;var u=q.sap.getUriParameters();if(u&&u.mParams&&u.mParams['sap-ui-fl-changeMode']&&u.mParams['sap-ui-fl-changeMode'][0]){if(u.mParams['sap-ui-fl-changeMode'][0]==='true'){f=true;}else if(u.mParams['sap-ui-fl-changeMode'][0]==='false'){f=false;}}return f;};S.prototype.activateFlexChangeMode=function(){this._bFlexChangeMode=true;var p={bFlexChangeMode:true};this.fireEvent(S.events.changeModeUpdated,p);};S.prototype.leaveFlexChangeMode=function(){this._bFlexChangeMode=false;var p={bFlexChangeMode:false};this.fireEvent(S.events.changeModeUpdated,p);};S.prototype.isProductiveSystem=function(){var i=false;if(this._oSettings.isProductiveSystem){i=this._oSettings.isProductiveSystem;}return i;};return S;},true);
