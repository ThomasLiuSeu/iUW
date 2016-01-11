/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.drilldown.lib.Hash");sap.suite.ui.smartbusiness.drilldown.lib.Hash=(function(){var o=null;var n=null;var b=null,c=null,d=null,e=null;var H=null;var f="|^",g=/\|\^/g;function r(){b=null,c=null,d=null,e=null;H=null;}function h(a){var s={};if(a){var B=a.split("/");for(var i=1;i<B.length;i++){var C=B[i];var D=C.split("=");if(s[D[0]]){}else{s[D[0]]=[];}if(D[1]||D[1]==''){var E=decodeURIComponent(D[1]).split(",");var F=s[D[0]];for(var j=0;j<E.length;j++){if(F.indexOf(E[j])==-1){E[j]=E[j].replace(g,",");F.push(E[j]);}}}}}return s;}function k(a){var j={};if(a){var s=a.split("&");for(var i=0;i<s.length;i++){var B=s[i];var C=B.split("=");if(j[C[0]]){}else{j[C[0]]=[];}var D=j[C[0]];var E=decodeURIComponent(C[1]);if(D.indexOf(E)==-1){D.push(E);}}}return j;}function p(n){n=n||window.location.hash;if(n){var a=/^(?:#|)([\S\s]*?)(&\/[\S\s]*)?$/;var i=a.exec(n);var j=i[1];var s=i[2];var B=/^([A-Za-z0-9_]+)-([A-Za-z0-9_]+)[\?]?(.*)/;if(j){var C=B.exec(j);b=C[1];c=C[2];d=k(C[3]);}e=h(s);}}function _(){};if(window.addEventListener){}function l(){var j="";if(b){j+=b;}if(c&&b){j+="-"+c;}if(d){j+="?";for(var B in d){var C=d[B];for(var i=0;i<C.length;i++){j+=B+"="+encodeURIComponent(C[i])+"&";}}j=j.substring(0,j.length-1);}if(e){var C="";for(var B in e){if(e[B]instanceof Array){e[B].forEach(function(s,i,a){a[i]=(s+"").replace(/,/g,f);});}C+=B+"="+encodeURIComponent(e[B])+"/";}if(C.length){C=C.substring(0,C.length-1);C="&/"+C;}j+=C;}return j;};function m(){return l();};function u(){var s=l();window.location.hash=s;H=s;p();}p();function q(O,U){if(typeof U=='undefined'){U=true;}U=!!U;b=O;if(U){u();}}function t(a,U){if(typeof U=='undefined'){U=true;}U=!!U;c=a;if(U){u();}}function v(a,U){if(typeof U=='undefined'){U=true;}U=!!U;d=a;if(U){u();}}function w(a,U){if(typeof U=='undefined'){U=true;}if(d&&d[a]){d[a]=null;delete d[a];}if(U){u();}}function x(a,U){if(typeof U=='undefined'){U=true;}U=!!U;e=a;if(U){u();}}function y(a,U){if(typeof U=='undefined'){U=true;}if(e&&e[a]){e[a]=null;delete e[a];}if(U){u();}}function z(a,U){if(typeof U=='undefined'){U=true;}U=!!U;if(!d){d=a;}else{for(var i in a){var s=a[i];if(!d[i]){d[i]=[];}var B=d[i];for(var j=0;j<s.length;j++){if(B.indexOf(s[j]+"")==-1){B.push(s[j]+"");}}}}if(U){u();}}function A(a,U){if(typeof U=='undefined'){U=true;}U=!!U;if(!e){e=a;}else{for(var i in a){var s=a[i];if(!jQuery.isArray(s)){s=[s];}if(!e[i]){e[i]=[];}var B=e[i];for(var j=0;j<s.length;j++){if(B.indexOf(s[j]+"")==-1){B.push(s[j]+"");}}}}if(U){u();}}return{getSemanticObject:function(){r();p(window.location.hash);return b;},getAction:function(){r();p(window.location.hash);return c;},getStartupParameters:function(){r();p(window.location.hash);return d;},getApplicationParameters:function(a){r();p(window.location.hash);if(a&&a.length){a.forEach(function(i){delete e[i];});}return e;},setSemanticObject:function(O,U){q(O,U);return this;},setAction:function(c,U){t(c,U);return this;},setStartupParameters:function(a,U){v(a,U);return this;},updateStartupParameters:function(a,U){z(a,U);return this;},removeStartupParameter:function(a,U){w(a,U);return this;},setApplicationParameters:function(a,U){x(a,U);return this;},updateApplicationParameters:function(a,U){A(a,U);return this;},removeApplicationParameter:function(a,U){y(a,U);return this;},getUrlParameters:function(){return jQuery.sap.getUriParameters();},updateHash:function(){u();},getHash:function(){return m();}};})();
