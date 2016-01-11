/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2015 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.navigationTarget");(function(){'use strict';sap.apf.modeler.core.NavigationTarget=function(n,d){var s,a;if(d){s=d.semObject;a=d.actn;}this.getId=function(){return n;};this.setSemanticObject=function(b){s=b;};this.getSemanticObject=function(){return s;};this.setAction=function(b){a=b;};this.getAction=function(){return a;};this.copy=function(b){var c={semObject:s,actn:a};var d=sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(c);return new sap.apf.modeler.core.NavigationTarget((b||this.getId()),d);};};}());
