/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define([],function(){"use strict";var B=function(){};B.prototype.toBinding=function(I){var o={},n,p,i,l,N={model:true,formatter:true,mode:true,path:true};if(I){if(I.parts&&I.parts.length){l=I.parts.length;o.parts=[];}for(i=0;i<l;i++){p=I.parts[i];o.parts.push(p);}for(n in N){if(I[n]){o[n]=I[n];}}return o;}return null;};B.prototype.toBindingPath=function(I){var o,O="",p,i,l;o=this.toBinding(I);if(o){if(o.model){O=o.model+">";}if(o.path){O=O+o.path;}else if(o.parts&&o.parts.length>0){l=o.parts.length;for(i=0;i<l;i++){p=o.parts[i];if(p.model){O=O+p.model+">";}O=O+p.path;}}}return O;};B.prototype.destroy=function(){};return B;},true);
