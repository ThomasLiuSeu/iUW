/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
jQuery.sap.declare("sap.ushell.ui.launchpad.DashboardGroupsContainer");jQuery.sap.require("sap.ushell.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ushell.ui.launchpad.DashboardGroupsContainer",{metadata:{library:"sap.ushell",properties:{"accessibilityLabel":{type:"string",group:"",defaultValue:null}},aggregations:{"groups":{type:"sap.ui.core.Control",multiple:true,singularName:"group"}},events:{"afterRendering":{}}}});sap.ushell.ui.launchpad.DashboardGroupsContainer.M_EVENTS={'afterRendering':'afterRendering'};(function(){"use strict";sap.ushell.ui.launchpad.DashboardGroupsContainer.prototype.updateGroups=sap.ushell.override.updateAggregatesFactory("groups");sap.ushell.ui.launchpad.DashboardGroupsContainer.prototype.onAfterRendering=function(){this.fireAfterRendering();};sap.ushell.ui.launchpad.DashboardGroupsContainer.prototype.getGroupControlByGroupId=function(g){try{var a=this.getGroups();for(var i=0;i<a.length;i++){if(a[i].getGroupId()==g){return a[i];}}}catch(e){}return null;}}());
