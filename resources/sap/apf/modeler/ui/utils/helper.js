/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.utils.helper');sap.apf.modeler.ui.utils.helper={onResize:function(c){jQuery(window).resize(function(){c();});},applySize:function(w,h,c,o){var a,b;if(h!==undefined){b=((h.getDomRef!==undefined)?jQuery(h.getDomRef()).height():(jQuery.isNumeric(h)?h:jQuery(h).height()));}if(w!==undefined){a=((w.getDomRef!==undefined)?jQuery(w.getDomRef()).width():(jQuery.isNumeric(w)?w:jQuery(w).width()));}var d=(c.getDomRef!==undefined)?jQuery(c.getDomRef()):jQuery(c);var e=(o===undefined)?0:(o.offsetHeight||0);var f=(o===undefined)?0:(o.offsetWidth||0);d.css({height:(h===undefined)?"100%":b+e+"px",width:(w===undefined)?"100%":a+f+"px"});}};
