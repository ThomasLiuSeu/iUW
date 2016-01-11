/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.configurationHandler");jQuery.sap.require('sap.apf.modeler.core.configurationEditor');jQuery.sap.require("sap.apf.utils.hashtable");jQuery.sap.require("sap.apf.modeler.core.configurationObjects");(function(){'use strict';sap.apf.modeler.core.ConfigurationHandler=function(a){var t=this;var m=a.instance.messageHandler;var p=a.instance.persistenceProxy;var C=a.constructor.configurationEditor;var H=a.constructor.hashtable;var L=a.constructor.lazyLoader;var c=new H(m);var l=new H(m);var b=new H(m);var d,e;var f={constructor:{hashtable:H},instance:{messageHandler:m}};this.exportTexts=function(){return e.exportTexts();};this.getTextPool=function(){return e;};this.setApplicationIdAndContext=function(h,j,T){e=T||e;c=new H(m);var i,k=j.length;for(i=0;i<k;i++){c.setItem(j[i].AnalyticalConfiguration,j[i]);}d=h;};this.getApplicationId=function(){return d;};this.setConfiguration=function(h,i){h.AnalyticalConfiguration=i||g();h.Application=d;c.setItem(h.AnalyticalConfiguration,h);return h.AnalyticalConfiguration;};this.getList=function(){var h=[];var i=function(k,j){h.push(j);};c.each(i);return h;};this.getConfiguration=function(i){return c.getItem(i);};this.loadConfiguration=function(h,i){function j(n,q,r){var s={instance:{coreApi:a.instance.coreApi,messageHandler:m,datajs:a.instance.datajs,configurationHandler:t,persistenceProxy:p,textPool:e,metadataFactory:a.instance.metadataFactory},constructor:{hashtable:H,step:a.constructor.step,facetFilter:a.constructor.facetFilter,navigationTarget:a.constructor.navigationTarget,representation:a.constructor.representation,configurationObjects:a.constructor.configurationObjects,elementContainer:a.constructor.elementContainer,configurationFactory:a.constructor.configurationFactory,registryProbe:a.constructor.registryProbe}};new C(h,s,function(u,v){q(n,u,v);});}var k,n=h.id||h;if(!h.updateExisting){k=l.getItem(n);}if(!k){k=new L(f,j);l.setItem(n,k);}k.asyncGetInstance(n,o);function o(q,r,s){i(q,r);}};this.resetConfiguration=function(h){var i;if(l.hasItem(h)){i=c.getItem(h);i.AnalyticalConfigurationName=l.getItem(h).getInstance().getConfigurationName();l.removeItem(h);return h;}};this.copyConfiguration=function(i,h){var j=this.getConfiguration(i);if(!j){h(null);return;}t.loadConfiguration(i,k);function k(n){var o,q,r,s;s=sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(j);o=g();s.AnalyticalConfiguration=o;t.setConfiguration(s,o);q=n.copy(o);r=new L(f,undefined,{id:o,instance:q});l.setItem(o,r);h(o);}};this.replaceConfigurationId=function(h,s){if(h.indexOf("apf1972-")===0){var i=c.getItem(h);var j=l.getItem(h).getInstance();var n=new L(f,undefined,{id:s,instance:j});i.AnalyticalConfiguration=s;c.setItem(s,i);c.removeItem(h);l.setItem(s,n);l.removeItem(h);}};this.exportConfiguration=function(h,i){var o;this.loadConfiguration(h,j);function j(k){if(!k.isSaved()){m.putMessage(m.createMessageObject({code:"11007",aParameters:[h]}));i(null);}else{var n=a.functions.getApplication(d);o=k.serialize();o.configHeader={Application:d,ApplicationName:n.ApplicationName,SemanticObject:n.SemanticObject,AnalyticalConfiguration:h,AnalyticalConfigurationName:t.getConfiguration(h).AnalyticalConfigurationName,UI5Version:sap.ui.version};p.readEntity("configuration",function(r,q,s){if(s){m.putMessage(m.createMessageObject({code:"5022",aParameters:[h]}));i(null);}else{o.configHeader.CreationUTCDateTime=r.CreationUTCDateTime;o.configHeader.LastChangeUTCDateTime=r.LastChangeUTCDateTime;i(JSON.stringify(o));}},[{name:"AnalyticalConfiguration",value:h}],["CreationUTCDateTime","LastChangeUTCDateTime"],false);}}};this.memorizeConfiguration=function(h){var i,j;j=l.getItem(h);if(!j){return null;}i=j.getInstance();if(i){b.setItem(h,i.copy(h));return h;}return null;};this.restoreMemorizedConfiguration=function(h){var n,i;i=b.removeItem(h);if(i){n=new L(f,undefined,{id:h,instance:i});l.setItem(h,n);return i;}return null;};this.removeConfiguration=function(h,r){function i(j,k){if(!k){c.removeItem(h);l.removeItem(h);}r(h,j,k);}if(h.indexOf("apf1972-")!==0){p.remove("configuration",[{name:"AnalyticalConfiguration",value:h}],i);}else{c.removeItem(h);l.removeItem(h);r(h,undefined,undefined);}};this.removeAllConfigurations=function(){c=new H(m);};function g(){return"apf1972-"+(Math.random()*new Date().getTime());}};}());
