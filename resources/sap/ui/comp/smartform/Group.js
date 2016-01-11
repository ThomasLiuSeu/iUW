/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/comp/library','sap/ui/core/Control','sap/ui/fl/registry/ChangeRegistry','sap/ui/fl/registry/SimpleChanges','sap/ui/layout/ResponsiveFlowLayoutData','sap/ui/layout/form/FormContainer'],function(q,l,C,a,S,R,F){"use strict";var G=C.extend("sap.ui.comp.smartform.Group",{metadata:{library:"sap.ui.comp",properties:{label:{type:"string",group:"Misc",defaultValue:null},expandable:{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"groupElements",aggregations:{groupElements:{type:"sap.ui.comp.smartform.GroupElement",multiple:true,singularName:"groupElement"},layout:{type:"sap.ui.layout.GridData",multiple:false}}}});G.prototype.init=function(){if(!G._bHasRegisteredToFlexibilityServices){var c=a.getInstance();c.registerControlForSimpleChange(this.getMetadata().getElementName(),S.hideControl);c.registerControlForSimpleChange(this.getMetadata().getElementName(),S.unhideControl);c.registerControlForSimpleChange(this.getMetadata().getElementName(),S.renameGroup);c.registerControlForSimpleChange(this.getMetadata().getElementName(),S.addField);c.registerControlForSimpleChange(this.getMetadata().getElementName(),S.moveFields);G._bHasRegisteredToFlexibilityServices=true;}var r=new R({"linebreak":true,"linebreakable":true});this._oFormContainer=new F({"expandable":this.getExpandable(),"layoutData":r});this._updateFormContainerLabel();};G._bHasRegisteredToFlexibilityServices=false;G.prototype.setEditMode=function(e){var g=this.getGroupElements();g.forEach(function(o){o.setEditMode(e);});return this;};G.prototype._updateFormContainerLabel=function(){var t;t=new sap.ui.core.Title({text:this.getLabel()});this._oFormContainer.setTitle(t);};G.prototype.setProperty=function(p,v){var r;r=C.prototype.setProperty.apply(this,arguments);if(p==='label'){this._updateFormContainerLabel();}if(p==='expandable'){this._oFormContainer.setExpandable(v);}if(p==='visible'){this._oFormContainer.setVisible(v);}return r;};G.prototype.getFormContainer=function(){return this._oFormContainer;};G.prototype.setFormContainer=function(f){this._oFormContainer=f;};G.prototype.addAggregation=function(A,o){if(A==="groupElements"){this._oFormContainer.addFormElement(o.getFormElement());}return C.prototype.addAggregation.apply(this,arguments);};G.prototype.setAggregation=function(A,o){if(A==="layout"){if(this._oFormContainer){this._oFormContainer.setAggregation("layoutData",o);}}else{return C.prototype.setAggregation.apply(this,arguments);}};G.prototype.addGroupElement=function(g){this._oFormContainer.addFormElement(g.getFormElement());return this.addAggregation("groupElements",g);};G.prototype.addCustomData=function(c){C.prototype.addCustomData.apply(this,arguments);var g=this.getGroupElements();g.forEach(function(o){o.addCustomData(c.clone());});return this;};G.prototype.insertGroupElement=function(g,i){this._oFormContainer.insertFormElement(g.getFormElement(),i);return this.insertAggregation("groupElements",g,i);};G.prototype.removeGroupElement=function(g){var o=null;var b=[];var i=0;if(g instanceof sap.ui.comp.smartform.GroupElement){o=g;}else{b=this.getGroupElements();if(typeof g==="number"){o=b[g];}else if(typeof g==="string"){for(i;i<b.length;i++){if(b[i].sId===g){o=b[i];break;}}}}if(o){this._oFormContainer.removeFormElement(o.getFormElement());return this.removeAggregation("groupElements",o);}else{return null;}};G.prototype.removeAllGroupElements=function(){this._oFormContainer.removeAllFormElements();return this.removeAllAggregation("groupElements");};G.prototype.destroyGroupElements=function(){this._oFormContainer.destroyFormElements();return this.destroyAggregation("groupElements");};return G;},true);
