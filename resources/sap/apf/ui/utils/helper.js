/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.helper');
sap.apf.ui.utils.Helper=function(c){"use strict";this.oCoreApi=c;this.getRepresentationSortInfo=function(r){var s=this;var C=r.parameter.dimensions.concat(r.parameter.measures);var S=r.parameter.orderby;var a=S.map(function(o){var b;C.forEach(function(d){if(o.property===d.fieldName&&s.oCoreApi.getTextNotHtmlEncoded(d.fieldDesc)){b=s.oCoreApi.getTextNotHtmlEncoded(d.fieldDesc);return;}});if(!b){s.oCoreApi.getMetadataFacade().getProperty(o.property,function(m){if(m.label){b=m.label?m.label:(m.name?m.name:"");}});}return b;});return a.join(",");};};
