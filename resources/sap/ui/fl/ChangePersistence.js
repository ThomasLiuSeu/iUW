/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/fl/Change","sap/ui/fl/Utils","jquery.sap.global","sap/ui/fl/LrepConnector","sap/ui/fl/Cache"],function(C,U,$,L,a){"use strict";var b=function(c,l){this._sComponentName=c;if(!this._sComponentName){U.log.error("The Control does not belong to a SAPUI5 component. Personalization and changes for this control might not work as expected.");throw new Error("Missing component name.");}this._oConnector=l||this._createLrepConnector();this._aDirtyChanges=[];};b.prototype.getComponentName=function(){return this._sComponentName;};b.prototype._createLrepConnector=function(){return L.createConnector();};b.prototype.getChangesForComponent=function(){return a.getChangesFillingCache(this._oConnector,this._sComponentName).then(function(w){this._bHasLoadedChangesFromBackend=true;if(!w.changes||!w.changes.changes){return[];}var d=w.changes.changes;return d.filter(p).map(c);}.bind(this));function c(o){return new C(o);}function p(o){if(o.fileType!=='change'){return false;}if(o.changeType==='defaultVariant'){return false;}if(!o.selector||!o.selector.id){return false;}return true;}};b.prototype.getChangesForView=function(v){return this.getChangesForComponent().then(function(d){return d.filter(c);});function c(o){var s=o.getSelector().id;var S=s.slice(0,s.lastIndexOf('--'));return S===v;}};b.prototype.addChange=function(c){var n=new C(c);this._aDirtyChanges.push(n);return n;};b.prototype.saveDirtyChanges=function(){var c=this._sComponentName;var o=this._oConnector;var d=this._aDirtyChanges.slice(0);var D=this._aDirtyChanges;return d.reduce(function(s,e){var f=s.then(p(e));f.then(u(e));return f;},Promise.resolve());function p(e){return function(){if(e.getPendingAction()==='NEW'){return o.create(e.getDefinition(),e.getRequest());}if(e.getPendingAction()==='DELETE'){return o.deleteChange({sChangeName:e.getId(),sLayer:e.getLayer(),sNamespace:e.getNamespace(),sChangelist:e.getRequest()});}};}function u(e){return function(){if(e.getPendingAction()==='NEW'){a.addChange(c,e.getDefinition());}if(e.getPendingAction()==='DELETE'){a.deleteChange(c,e.getDefinition());}var i=D.indexOf(e);if(i>-1){D.splice(i,1);}};}};b.prototype.getDirtyChanges=function(){return this._aDirtyChanges;};b.prototype.deleteChange=function(c){var i=this._aDirtyChanges.indexOf(c);if(i>-1){if(c.getPendingAction()==='DELETE'){return;}this._aDirtyChanges.splice(i,1);return;}c.markForDeletion();this._aDirtyChanges.push(c);};return b;},true);
