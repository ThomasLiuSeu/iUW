/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.utils.Lessifier");jQuery.sap.require("sap.ui.core.theming.Parameters");sap.ca.ui.utils.Lessifier={};sap.ca.ui.utils.Lessifier.DEFAULT_COLOR="#fff";
sap.ca.ui.utils.Lessifier.lessifyCSS=function(m,c,t){if(t){jQuery.sap.require("sap.ui.thirdparty.less");}if(m==null||m.length==0||c==null||c.length==0){jQuery.sap.log.error("When trying to lessify a css make sure both the module name and the css file path are specified.");return;}var M=jQuery.sap.getModulePath(m);if(M==null){jQuery.sap.log.error("The module "+m+" has never been registered for a specific path.");return;}if(jQuery("#"+m+"-less-css").length!=0){jQuery.sap.log.warning("The css for module "+m+" has already been processed.");return;}var C=M+c;if(!jQuery.sap.startsWith(c,"/")&&!jQuery.sap.endsWith(M,"/")){C=M+"/"+c;}var r=jQuery.ajax({url:C,async:false});var s=(r.status<400)?r.responseText:"";if(s!=null&&s.length!=0){var p=["media","font-face","-webkit-keyframes","see","keyframes","import","charset","document","page","supports"];var l;if(t){l=s.replace(/@([a-zA-Z0-9\-_]*):/g,function(a,b){if(p.indexOf(b)<0){p.push(b);}return a;});}l=s.replace(/@([a-zA-Z0-9\-_]*)/g,function(a,b){var d=false;var e;if(p.indexOf(b)!=-1){d=true;return a;}if(!d){e=sap.ui.core.theming.Parameters.get(b);if(e==null){if(t){jQuery.sap.log.error("The parameter @"+b+" was replaced by a dummy value due to missing reference!");return sap.ca.ui.utils.Lessifier.DEFAULT_COLOR;}else{jQuery.sap.log.warning("The parameter @"+b+" was not found via API call!");return"@"+b;}}}return e;});var h=false;if(t){new(less.Parser)().parse(l,function(e,a){if(e!=null){h=true;jQuery.sap.log.error("The css for module "+m+" cannot be parsed by less.js : "+e.message);}else{l=a.toCSS({});}});}jQuery("head").append("<style id='"+m+"-less-css'>"+l+"</style>");jQuery.sap.log.info("The css for module "+m+" has been processed correctly.");}};
