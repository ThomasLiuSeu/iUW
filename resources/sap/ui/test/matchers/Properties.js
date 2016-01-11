/*!
 * @copyright@
 */
sap.ui.define([],function(){return function(p){return function(c){var i=true;jQuery.each(p,function(P,o){var f=c["get"+jQuery.sap.charToUpperCase(P,0)];if(!f){i=false;jQuery.sap.log.error("Control "+c.sId+" does not have a property called: "+P);return false;}var C=f.call(c);if(o instanceof RegExp){i=o.test(C);}else{i=C===o;}if(!i){return false;}});return i;};};},true);
