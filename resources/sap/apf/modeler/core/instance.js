/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.instance");(function(){'use strict';jQuery.sap.require("sap.ui.thirdparty.datajs");jQuery.sap.require("sap.apf.utils.hashtable");jQuery.sap.require('sap.apf.core.constants');jQuery.sap.require('sap.apf.core.messageHandler');jQuery.sap.require('sap.apf.core.sessionHandler');jQuery.sap.require('sap.apf.core.representationTypes');jQuery.sap.require("sap.apf.core.entityTypeMetadata");jQuery.sap.require("sap.apf.core.configurationFactory");jQuery.sap.require("sap.apf.core.utils.uriGenerator");jQuery.sap.require("sap.apf.core.metadata");jQuery.sap.require("sap.apf.core.metadataFacade");jQuery.sap.require("sap.apf.core.metadataProperty");jQuery.sap.require('sap.apf.core.messageDefinition');jQuery.sap.require("sap.apf.core.metadataFactory");jQuery.sap.require('sap.apf.core.odataProxy');jQuery.sap.require('sap.apf.core.ajax');jQuery.sap.require('sap.apf.core.odataRequest');jQuery.sap.require('sap.apf.modeler.core.messageDefinition');jQuery.sap.require('sap.apf.modeler.core.textHandler');jQuery.sap.require('sap.apf.modeler.core.textPool');jQuery.sap.require('sap.apf.modeler.core.applicationHandler');jQuery.sap.require('sap.apf.modeler.core.configurationHandler');jQuery.sap.require('sap.apf.modeler.core.configurationEditor');jQuery.sap.require("sap.apf.modeler.core.step");jQuery.sap.require("sap.apf.modeler.core.facetFilter");jQuery.sap.require("sap.apf.modeler.core.navigationTarget");jQuery.sap.require("sap.apf.modeler.core.elementContainer");jQuery.sap.require("sap.apf.modeler.core.representation");jQuery.sap.require("sap.apf.modeler.core.configurationObjects");jQuery.sap.require("sap.apf.modeler.core.elementContainer");jQuery.sap.require("sap.apf.modeler.core.parseTextPropertyFile");jQuery.sap.require("sap.apf.modeler.core.lazyLoader");jQuery.sap.require("sap.apf.modeler.core.registryWrapper");sap.apf.modeler.core.Instance=function(p,a){var t=this;var A,C,b,c,d,S,F,N,R,E,H,e,M,f,g,h,j,L,k,m,s,l,n,o,q,r,O,u,v,w,x,y,z,B;A=(a&&a.constructor&&a.constructor.applicationHandler)||sap.apf.modeler.core.ApplicationHandler;C=(a&&a.constructor&&a.constructor.configurationHandler)||sap.apf.modeler.core.ConfigurationHandler;b=(a&&a.constructor&&a.constructor.configurationEditor)||sap.apf.modeler.core.ConfigurationEditor;c=(a&&a.constructor&&a.constructor.configurationObjects)||sap.apf.modeler.core.ConfigurationObjects;d=(a&&a.constructor&&a.constructor.configurationFactory)||sap.apf.core.ConfigurationFactory;E=(a&&a.constructor&&a.constructor.elementContainer)||sap.apf.modeler.core.ElementContainer;S=(a&&a.constructor&&a.constructor.step)||sap.apf.modeler.core.Step;F=(a&&a.constructor&&a.constructor.facetFilter)||sap.apf.modeler.core.FacetFilter;N=(a&&a.constructor&&a.constructor.navigationTarget)||sap.apf.modeler.core.NavigationTarget;R=(a&&a.constructor&&a.constructor.representation)||sap.apf.modeler.core.Representation;H=(a&&a.constructor&&a.constructor.hashtable)||sap.apf.utils.Hashtable;e=(a&&a.constructor&&a.constructor.registryProbe)||sap.apf.modeler.core.RegistryWrapper;L=(a&&a.constructor&&a.constructor.LazyLoader)||sap.apf.modeler.core.LazyLoader;M=(a&&a.constructor&&a.constructor.metadata)||sap.apf.core.Metadata;f=(a&&a.constructor&&a.constructor.entityTypeMetadata)||sap.apf.core.EntityTypeMetadata;g=(a&&a.constructor&&a.constructor.metadataFacade)||sap.apf.core.MetadataFacade;h=(a&&a.constructor&&a.constructor.metadataProperty)||sap.apf.core.MetadataProperty;j=(a&&a.constructor&&a.constructor.metadataFactory)||sap.apf.core.MetadataFactory;if(a&&a.constructor&&a.constructor.textHandler){k=new a.constructor.textHandler();}else{k=new sap.apf.modeler.core.TextHandler();}if(a&&a.constructor&&a.constructor.messageHandler){m=new a.constructor.messageHandler(true);}else{m=new sap.apf.core.MessageHandler(true);}m.setTextResourceHandler(k);m.loadConfig(sap.apf.core.messageDefinition);m.loadConfig(sap.apf.modeler.core.messageDefinition);m.activateOnErrorHandling(true);o={instance:{messageHandler:m,coreApi:t}};if(a&&a.constructor&&a.constructor.persistenceProxy){l=new a.constructor.persistenceProxy(p,o);}else{l=new sap.apf.core.OdataProxy(p,o);}if(a&&a.constructor&&a.constructor.sessionHandler){s=new a.constructors.sessionHandler(o.instance);}else{s=new sap.apf.core.SessionHandler(o.instance);}q={entityTypeMetadata:sap.apf.core.EntityTypeMetadata,hashtable:H,metadata:sap.apf.core.Metadata,metadataFacade:sap.apf.core.MetadataFacade,metadataProperty:sap.apf.core.MetadataProperty,messageHandler:m,coreApi:t,datajs:OData,configurationFactory:{getServiceDocuments:function(){return[p.serviceRoot];}},deactivateFatalError:true};n=new sap.apf.core.MetadataFactory(q);r={constructor:{hashtable:H},instance:{messageHandler:m}};v=(a&&a.functions&&a.functions.loadApplicationHandler)||D;function D(i,I){new A({instance:{messageHandler:m,persistenceProxy:l},constructor:{hashtable:H},functions:{resetConfigurationHandler:K}},J);function J(P,Q){I(i,P,Q);}function K(P){if(y.getId()===P){y.getInstance().removeAllConfigurations();y.reset();}}}x=new L(r,v);w=(a&&a.functions&&a.functions.loadConfigurationHandler)||G;function G(i,I,J){var K=function(V,W){var X,Y;var Z;var $;var _=J;if(W){I(i,undefined,W);}else{Z=V[0];$=V[1];Y={instance:{messageHandler:m,persistenceProxy:l},constructor:{hashtable:H}};X=new sap.apf.modeler.core.TextPool(Y,i,$);if(!_){_=new C({instance:{messageHandler:m,persistenceProxy:l,datajs:OData,coreApi:t,metadataFactory:n},constructor:{configurationEditor:b,configurationFactory:d,configurationObjects:c,elementContainer:E,entityTypeMetadata:f,facetFilter:F,navigationTarget:N,hashtable:H,representation:R,registryProbe:e,step:S,lazyLoader:L},functions:{getApplication:x.getInstance().getApplication}});}_.setApplicationIdAndContext(i,Z,X);I(i,_,W);}};var P=new sap.apf.core.utils.Filter(m,'Application','eq',i);var Q=new sap.apf.core.utils.Filter(m,'Language','eq',sap.apf.core.constants.developmentLanguage);Q.addAnd(P);var T=[];var U=["AnalyticalConfiguration","AnalyticalConfigurationName","Application","CreatedByUser","CreationUTCDateTime","LastChangeUTCDateTime","LastChangedByUser"];T.push({entitySetName:"configuration",filter:P,selectList:U});T.push({entitySetName:'texts',filter:Q});l.readCollectionsInBatch(T,K,true);}y=new L(r,w);O=(a&&a.functions&&a.functions.odataRequestWrapper)||sap.apf.core.odataRequestWrapper;u=(a&&a.functions&&a.functions.ajax)||sap.apf.core.ajax;this.ajax=function(i){return u(i);};this.odataRequest=function(i,I,J,K){O(m,i,I,J,K);};this.checkForTimeout=function(i){var I=sap.apf.core.utils.checkForTimeout(i);if(I){m.putMessage(I);}return I;};this.getEntityTypeMetadata=function(i,I){return n.getEntityTypeMetadata(i,I);};this.getXsrfToken=function(i){return s.getXsrfToken(i);};this.getUriGenerator=function(){return sap.apf.core.utils.uriGenerator;};this.getText=function(i,P){return k.getText(i,P);};this.putMessage=function(i){return m.putMessage(i);};this.check=function(i,I,J){return m.check(i,I,J);};this.createMessageObject=function(i){return m.createMessageObject(i);};this.setCallbackForMessageHandling=function(i){m.setMessageCallback(i);};this.importTexts=function(I,J){var K;var i;var P;var Q;var T;function U(W,X,K){var Y;var Z;if(K){J(K);}else{Y={instance:{messageHandler:m,persistenceProxy:l},constructor:{hashtable:H}};Z=new sap.apf.modeler.core.TextPool(Y,T,W);Z.addTextsAndSave(Q.TextElements,J);}}function V(W,X){if(X){J(X);return;}var K;var Y=W.getApplication(T);if(!Y){K=m.createMessageObject({code:11021});J(K);return;}if(y.getId()===T){y.getInstance().getTextPool().addTextsAndSave(Q.TextElements,J);}else{var Z=new sap.apf.core.utils.Filter(m,'Application','eq',T);var $=new sap.apf.core.utils.Filter(m,'Language','eq',sap.apf.core.constants.developmentLanguage);$.addAnd(Z);l.readCollection("texts",U,undefined,undefined,$,true);}}Q=sap.apf.modeler.core.parseTextPropertyFile(I,{instance:{messageHandler:m}});if(Q.Messages.length>0){K=m.createMessageObject({code:11020});P=Q.Messages.length;for(i=0;i<P-1;i++){Q.Messages[i+1].setPrevious(Q.Messages[i]);}K.setPrevious(Q.Messages[P-1]);J(K);}else{T=Q.Application;this.getApplicationHandler(V);}};this.importConfiguration=function(i,I,J){var K=JSON.parse(i);var P=K.configHeader;var Q;if(!T(K,J)){return;}this.getApplicationHandler(U);function T(K,J){var Y=[],T=true,Z;if(!sap.apf.utils.isValidGuid(K.configHeader.Application)){Y.push(m.createMessageObject({code:11037,aParameters:[K.configHeader.Application]}));T=false;}if(!sap.apf.utils.isValidGuid(K.configHeader.AnalyticalConfiguration)){Y.push(m.createMessageObject({code:11038,aParameters:[K.configHeader.AnalyticalConfiguration]}));T=false;}Z=sap.apf.modeler.core.ConfigurationObjects.getTextKeysFromConfiguration(K);Z.forEach(function($){var _=new H(m);if(!_.hasItem($)){_.setItem($,$);if(!sap.apf.utils.isValidGuid($)){Y.push(m.createMessageObject({code:11039,aParameters:[$]}));T=false;}}});if(T){return T;}Y.forEach(function($,_,Y){if(_){$.setPrevious(Y[_-1]);}});J(i,undefined,Y[Y.length-1]);return T;}function U(Y,Z){if(Z){J(undefined,undefined,Z);return;}var $=false;var _=Y.getList();Q=P.Application;_.forEach(function(b1){if(b1.Application===P.Application){$=true;}});if($){t.getConfigurationHandler(P.Application,W);}else{var a1={ApplicationName:P.ApplicationName,SemanticObject:P.SemanticObject};Y.setAndSave(a1,V,P.Application,true);}}function V(Y,Z,$){if($){J(undefined,undefined,$);return;}t.getConfigurationHandler(P.Application,W);}function W(Y,Z){if(Z){J(undefined,undefined,Z);return;}var $=jQuery.extend({},K,true);delete $.configHeader;var _=false;var a1=Y.getList();a1.forEach(function(e1){if(e1.AnalyticalConfiguration===P.AnalyticalConfiguration){_=true;}});if(_){I(c1,d1);}else{Y.setConfiguration({AnalyticalConfigurationName:P.AnalyticalConfigurationName},P.AnalyticalConfiguration);var b1={id:P.AnalyticalConfiguration,creationDate:P.CreationUTCDateTime,lastChangeDate:P.LastChangeUTCDateTime,content:$};Y.loadConfiguration(b1,X);}function c1(){Y.setConfiguration({AnalyticalConfigurationName:P.AnalyticalConfigurationName},P.AnalyticalConfiguration);var b1={updateExisting:true,id:P.AnalyticalConfiguration,creationDate:P.CreationUTCDateTime,lastChangeDate:P.LastChangeUTCDateTime,content:$};Y.loadConfiguration(b1,X);}function d1(){var e1=Y.setConfiguration({AnalyticalConfigurationName:P.AnalyticalConfigurationName});var i={id:e1,content:$};Y.loadConfiguration(i,X);}}function X(Y,Z){if(Z){J(undefined,undefined,Z);return;}Y.save(J);}};this.getApplicationHandler=function(i){x.asyncGetInstance("ApplicationHandlerId",function(I,J){i(I,J);});};this.getConfigurationHandler=function(i,I){y.asyncGetInstance(i,function(J,K){I(J,K);});};this.getUnusedTextKeys=function(i,I){var J={instance:{messageHandler:m,persistenceProxy:l},constructor:{hashtable:H}};var K=new c(J);var P=null,Q=null,T=null;K.getTextKeysFromAllConfigurations(i,function(V,W){if(Q){return;}P=V;Q=W;if(W||T){U();}});this.getConfigurationHandler(i,function(V,W){if(Q){return;}T=V;Q=W;if(W||P){U();}});function U(){var V=[];if(Q){I(undefined,Q);return;}T.getTextPool().getTextKeys().forEach(function(W){if(!P.hasItem(W)){V.push(W);}});I(V,undefined);}};this.resetConfigurationHandler=function(){y.reset();};this.getRepresentationTypes=function(){var i=sap.apf.core.representationTypes();var I=[];jQuery.extend(true,I,i);return I;};this.getAllAvailableSemanticObjects=function(i){function I(P,Q){B=P.results;i(P.results,undefined);}function J(P){var Q;if(P.messageObject){Q=P.messageObject;}else{Q=m.createMessageObject({code:"11041"});}i([],Q);}if(B){i(B,undefined);return;}var K={requestUri:"/sap/opu/odata/UI2/INTEROP/SemanticObjects?$format=json&$select=id,text",method:"GET",headers:{"x-csrf-token":s.getXsrfToken("/sap/opu/odata/UI2/INTEROP/SemanticObjects")}};t.odataRequest(K,I,J);};this.getSemanticActions=function(I){var J;var K=jQuery.Deferred();if(!z){z=new H(m);}J=z.getItem(I);if(J){K.resolve(J);return K.promise();}t.getAllAvailableSemanticObjects(P);return K.promise();function P(Q,T){if(T){fnCallback(undefined,T);return;}var U=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("CrossApplicationNavigation");var V;var i;if(!U){fnCallback(undefined,m.createMessageObject({code:"5038"}));return;}for(i=0;i<Q.length;i++){if(Q[i].id===I){V=Q[i];break;}}U.getSemanticObjectLinks(I,undefined,true,a.instances.component,undefined).done(function(W){var X=[];W.forEach(function(Y){var Z=Y.intent.split("-");var $=Z[1].split("?");var $=$[0].split("~");X.push({id:$[0],text:Y.text});});z.setItem(I,{semanticObject:V,semanticActions:X});K.resolve({semanticObject:V,semanticActions:X});}).fail(function(){K.rejectWith(m.createMessageObject({code:"11042"}));});}};if(a&&a.probe){new a.probe({constructor:{applicationHandler:A,configurationHandler:C,configurationEditor:b,configurationObjects:c,configurationFactory:d,metadataFactory:j,metadata:M,entityTypeMetadata:f,metadataFacade:g,metadataProperty:h,step:S,facetFilter:F,navigationTarget:N,representation:R,elementContainer:E,hashtable:H,lazyLoader:L,registryProbe:e},textHandler:k,messageHandler:m,sessionHandler:s,persistenceProxy:l,applicationHandler:x.getInstance(),configurationHandler:y.getInstance(),metadataFactory:n,injectForFollowUp:o,injectMetadataFactory:q,fnOdataRequestWrapper:O,ajax:u,odataRequestWrapper:O});}};}());
