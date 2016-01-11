/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/fl/Persistence","sap/ui/fl/registry/ChangeRegistry","sap/ui/fl/Utils","sap/ui/fl/Change","sap/ui/fl/registry/Settings","sap/ui/fl/ChangePersistenceFactory","sap/ui/core/mvc/View"],function(q,P,C,U,a,F,b,V){"use strict";var c=function(s){this._oChangePersistence=undefined;this._sComponentName=s||"";if(this._sComponentName){this._createChangePersistence();}};c.prototype.setComponentName=function(s){this._sComponentName=s;this._createChangePersistence();};c.prototype.getComponentName=function(){return this._sComponentName;};c.prototype.addChange=function(o,d){var e,f,g,h;var s=this.getComponentName();o.componentName=s;o.namespace=s;o.packageName='$TMP';e=a.createInitialFileContent(o);f=this._oChangePersistence.addChange(e);g=this._getChangeHandler(f,d);if(g){h=new g();h.completeChangeContent(f,o);}else{throw new Error('Change handler could not be retrieved for change '+JSON.stringify(o));}return f;};c.prototype.createAndApplyChange=function(o,d){var e=this.addChange(o,d);try{this.applyChange(e,d);}catch(f){this._oChangePersistence.deleteChange(e);throw f;}};c.prototype.saveAll=function(){return this._oChangePersistence.saveDirtyChanges();};c.prototype.processView=function(v){var t=this;var h=this._hasSmartControls(v);if(!h){return Promise.resolve("No smart control found. Processing skipped.");}return F.getInstance(this.getComponentName()).then(function(s){return t._getChangesForView(v);}).then(function(d){d.forEach(function(o){var e=t._getControlByChange(o);t.applyChangeAndCatchExceptions(o,e);});})['catch'](function(e){U.log.error('Error processing view '+e);});};c.prototype.applyChangeAndCatchExceptions=function(o,d){try{this.applyChange(o,d);}catch(e){var f=o.getDefinition();U.log.error("Change could not be applied: ["+f.layer+"]"+f.namespace+"/"+f.fileName+"."+f.fileType+": "+e);}};c.prototype.applyChange=function(o,d){var e,f;e=this._getChangeHandler(o,d);if(!e){if(o&&d){U.log.warning("Change handler implementation for change not found - Change ignored");}return;}f=new e();if(f&&typeof f.applyChange==='function'){f.applyChange(o,d);}};c.prototype._getChangeHandler=function(o,d){var e,f;e=this._getChangeTypeMetadata(o,d);if(!e){return undefined;}f=e.getChangeHandler();return f;};c.prototype._getChangeTypeMetadata=function(o,d){var e,f;e=this._getChangeRegistryItem(o,d);if(!e||!e.getChangeTypeMetadata){return undefined;}f=e.getChangeTypeMetadata();return f;};c.prototype._getChangeRegistryItem=function(o,d){var s,e,f,l;if(!o||!d){return undefined;}s=o.getChangeType();e=U.getControlType(d);if(!s||!e){return undefined;}l=o.getLayer();f=this._getChangeRegistry().getRegistryItems({"changeTypeName":s,"controlType":e,"layer":l});if(f&&f[e]&&f[e][s]){return f[e][s];}else if(f&&f[e]){return f[e];}else{return f;}};c.prototype._getChangeRegistry=function(){var i=C.getInstance();i.initSettings(this.getComponentName());return i;};c.prototype._getControlByChange=function(o){var s;if(!o){return undefined;}s=o.getSelector();if(s&&typeof s.id==="string"){return sap.ui.getCore().byId(s.id);}return undefined;};c.prototype.getComponentChanges=function(){return this._oChangePersistence.getChangesForComponent();};c.prototype._getChangesForView=function(v){return this._oChangePersistence.getChangesForView(v.getId());};c.prototype._createChangePersistence=function(){this._oChangePersistence=b.getChangePersistenceForComponent(this.getComponentName());return this._oChangePersistence;};c.prototype.discardChanges=function(d){var A=U.getCurrentLayer(false);d.forEach(function(o){if(o&&o.getLayer&&o.getLayer()===A){this._oChangePersistence.deleteChange(o);}}.bind(this));return this._oChangePersistence.saveDirtyChanges();};c.prototype._hasSmartControls=function(p){var A,i,j,d,o;var h=false;var e=p.getMetadata().getAllAggregations();var f=Object.keys(e);for(i=0;i<f.length;i++){A=e[f[i]];if(A.type==='sap.ui.core.Control'){d=p.getAggregation(f[i]);if(d){for(j=0;j<d.length;j++){o=d[j];if(o.getMetadata().getName().indexOf('Smart')>=0){h=true;break;}else{h=this._hasSmartControls(o);if(h===true){break;}}}if(h===true){break;}}}}return h;};c.prototype.deleteChangesForControlDeeply=function(o){return Promise.resolve();};return c;},true);
