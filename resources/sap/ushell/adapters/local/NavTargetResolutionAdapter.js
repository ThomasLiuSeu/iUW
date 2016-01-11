// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.adapters.local.NavTargetResolutionAdapter");jQuery.sap.require("sap.ui.thirdparty.datajs");sap.ushell.adapters.local.NavTargetResolutionAdapter=function(u,p,a){var A=a.config.applications;this.resolveHashFragment=function(h){var d=new jQuery.Deferred(),i,r,P;if(h&&h.charAt(0)!=="#"){throw new sap.ushell.utils.Error("Hash fragment expected","sap.ushell.renderers.minimal.Shell");}h=h.substring(1);if(!h&&!A[h]){d.resolve(undefined);}else{jQuery.sap.log.info("Hash Fragment: "+h);i=h.indexOf("?");if(i>=0){P=h.slice(i+1);h=h.slice(0,i);}r=A[h];if(r){r={additionalInformation:r.additionalInformation,applicationType:r.applicationType,url:r.url};if(P){r.url+=(r.url.indexOf("?")<0)?"?":"&";r.url+=P;}d.resolve(r);}else{d.reject("Could not resolve link '"+h+"'");}}return d.promise();};this.getSemanticObjectLinks=function(s){var d=new jQuery.Deferred();if(!s){d.resolve(undefined);}else{jQuery.sap.log.info("getSemanticObjectLinks: "+s);var b,r=[],i=0;for(b in A){if(b.substring(0,b.indexOf('-'))===s){r[i]=A[b];r[i].id=b;r[i].text=r[i].text||r[i].description||"no text";r[i].intent="#"+b;i++;}}if(r){d.resolve(r);}else{d.reject("Could not get links for  '"+s+"'");}}return d.promise();};};}());
