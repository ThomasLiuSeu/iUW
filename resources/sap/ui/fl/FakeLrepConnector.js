/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/thirdparty/URI","sap/ui/fl/Utils","sap/ui/fl/LrepConnector"],function(q,u,F,L){"use strict";var l=Object.create(L.prototype);var i;function a(I){this.sInitialComponentJsonPath=I;}for(var p in l){if(typeof l[p]==='function'){a.prototype[p]=(function(p){return function(){throw new Error('Method '+p+'() is not implemented in FakeLrepConnector.');};}(p));}}a.prototype.loadChanges=function(c){var b=this.sInitialComponentJsonPath;return new Promise(function(r,d){q.getJSON(b).done(function(R){R.changes=l._condense(R.changes);var e={changes:R,componentClassName:c};r(e);}).fail(function(e){d(e);});});};a.prototype.create=function(){return Promise.resolve();};a.prototype.deleteChange=function(){return Promise.resolve();};a.enableFakeConnector=function(I){a.enableFakeConnector.original=L.createConnector;L.createConnector=function(){if(!i){i=new a(I);}return i;};};a.disableFakeConnector=function(){if(a.enableFakeConnector.original){L.createConnector=a.enableFakeConnector.original;}};return a;},true);
