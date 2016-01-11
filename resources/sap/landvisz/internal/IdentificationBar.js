/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.IdentificationBar");jQuery.sap.require("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.landvisz.internal.IdentificationBar",{metadata:{publicMethods:["getIdentificationProperties"],library:"sap.landvisz",properties:{"text":{type:"string",group:"Data",defaultValue:null},"type":{type:"string",group:"Data",defaultValue:null},"qualifierText":{type:"string",group:"Data",defaultValue:null},"qualifierTooltip":{type:"string",group:"Data",defaultValue:null},"qualifierType":{type:"string",group:"Data",defaultValue:null},"renderingSize":{type:"sap.landvisz.EntityCSSSize",group:"Dimension",defaultValue:sap.landvisz.EntityCSSSize.Regular},"defaultState":{type:"string",group:"Misc",defaultValue:null},"description":{type:"string",group:"Data",defaultValue:null},"componentType":{type:"sap.landvisz.ComponentType",group:"Identification",defaultValue:null}},events:{"select":{}}}});sap.landvisz.internal.IdentificationBar.M_EVENTS={'select':'select'};
sap.landvisz.internal.IdentificationBar.prototype.init=function(){this.initializationDone=false;};
sap.landvisz.internal.IdentificationBar.prototype.exit=function(){this.oIdentifierIcon&&this.oIdentifierIcon.destroy();this.oQualifierIcon&&this.oQualifierIcon.destroy();this.oDescriptionText&&this.oDescriptionText.destroy();this.oIdentifierText&&this.oIdentifierText.destroy();this.oQualifierText&&this.oQualifierText.destroy();var c=sap.ui.getCore().getConfiguration().getTheme();this._imgResourcePath=sap.ui.resource('sap.uiext.inbox','themes/'+c+'/img/');};
sap.landvisz.internal.IdentificationBar.prototype.initControls=function(){var i=this.getId();this._oBundle=sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");this.OnDemandText=this._oBundle.getText("On_Demand");this.OnPremiseText=this._oBundle.getText("On_Premise");this.oIdentifierIcon&&this.oIdentifierIcon.destroy();this.oIdentifierIcon=new sap.ui.commons.Image(i+"-CLVIdnImg");this.oIdentifierIcon.setParent(this);this.oIdentifierText&&this.oIdentifierText.destroy();this.oIdentifierText=new sap.ui.commons.TextView(i+"-CLVIdnTxt");this.oIdentifierText.setAccessibleRole(sap.ui.core.AccessibleRole.Heading);this.oIdentifierText.setParent(this);this.oQualifierIcon&&this.oQualifierIcon.destroy();this.oQualifierIcon=new sap.ui.commons.Image(i+"-CLVQuaImg").addStyleClass("sapLandviszCursor");this.oQualifierIcon.setParent(this);this.oDescriptionText&&this.oDescriptionText.destroy();this.oDescriptionText=new sap.ui.commons.TextView(i+"-CLVDesTxt");this.oDescriptionText.setParent(this);this.oQualifierText&&this.oQualifierText.destroy();this.oQualifierText=new sap.ui.commons.TextView(i+"-CLVQuaTxt");this.oIdentifierTextIcon&&this.oIdentifierTextIcon.destroy();this.oIdentifierTextIcon=new sap.ui.commons.Image(i+"-CLVIdnSIDImg");this.oQualifierText.setAccessibleRole(sap.ui.core.AccessibleRole.Heading);this.oQualifierText.setParent(this);this.oButton;this.oCallout;this.maxHeight;this.entityMaximized;};
sap.landvisz.internal.IdentificationBar.prototype.select=function(e){this.fireSelect();};
sap.landvisz.LandscapeEntity.prototype.select=function(e){this.fireSelect();};
sap.landvisz.internal.IdentificationBar.prototype.onclick=function(e){sap.landvisz.EntityConstants.internalEvent=true;this.fireSelect();};
