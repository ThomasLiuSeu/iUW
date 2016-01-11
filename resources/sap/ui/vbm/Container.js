/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.vbm.Container");jQuery.sap.require("sap.ui.vbm.library");jQuery.sap.require("sap.ui.vbm.VoBase");sap.ui.vbm.VoBase.extend("sap.ui.vbm.Container",{metadata:{publicMethods:["propagateModels"],library:"sap.ui.vbm",properties:{"position":{type:"string",group:"Misc",defaultValue:null},"alignment":{type:"string",group:"Misc",defaultValue:'0'}},aggregations:{"item":{type:"sap.ui.core.Control",multiple:false}},events:{"click":{},"contextMenu":{}}}});sap.ui.vbm.Container.M_EVENTS={'click':'click','contextMenu':'contextMenu'};
sap.ui.vbm.Container.prototype.init=function(){this._oItem=null;};
sap.ui.vbm.Container.prototype.getItem=function(){return this._oItem;};
sap.ui.vbm.Container.prototype.setItem=function(i){return this._oItem=i;};
sap.ui.vbm.Container.prototype.clone=function(i){var c=sap.ui.core.Control.prototype.clone.apply(this,arguments);c.setItem(this.getItem().clone());return c;};
sap.ui.vbm.Container.prototype.exit=function(i){if(this._oItem){this._oItem.destroy();}delete this._oItem;};
sap.ui.vbm.Container.prototype.propagateModels=function(t){for(var n in this.oPropagatedProperties.oModels){(n==="undefined")?t.setModel(this.oPropagatedProperties.oModels[n]):t.setModel(this.oPropagatedProperties.oModels[n],n);}for(var n in this.oModels){(n==="undefined")?t.setModel(this.oModels[n]):t.setModel(this.oModels[n],n);}};
