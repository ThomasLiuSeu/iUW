// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";function P(p,t,u){this.parameter=p;this.template=t;this.semiConvertedUrl=u;this.message=" is a missing key parameter for constructing the entity url";this.toString=function(){return this.parameter+this.message};}jQuery.sap.declare("sap.ushell.components.factsheet.tools.ODataUrlTemplating");sap.ushell.components.factsheet.tools.ODataUrlTemplating={ParameterException:P,resolve:function(t,d){var e,v,p,i,b=t.match(/{\s*[\w\.]+\s*}/g);e=t;for(i=b.length-1;i>=0;i-=1){p=b[i];v=d[p.replace(/[{}]/g,"")];if(v!==undefined){if(typeof v!=="string"){v=v[0];}v=encodeURIComponent(decodeURIComponent(v));e=e.replace(p,v);}}if(p=e.match(/{\s*[\w\.]+\s*}/g)){jQuery.sap.log.error(" "+e);throw new this.ParameterException(p,t,e);}return e;}}})();
