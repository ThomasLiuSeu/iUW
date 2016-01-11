/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.messageObject");
sap.apf.core.MessageObject=function(c){var C=c.code;var p=c.aParameters||[];var o=c.oCallingObject;var m="";var s="";var P;var d=new Date();var r=c.rawText;this.type="messageObject";this.getCode=function(){return C;};this.setCode=function(a){C=a;};this.hasRawText=function(){return(r!==undefined);};this.getRawText=function(){return r;};this.getMessage=function(){return m;};this.setMessage=function(t){m=t;};this.setSeverity=function(a){s=a;};this.getSeverity=function(){return s;};this.setPrevious=function(a){P=a;};this.getPrevious=function(){return P;};this.getCallingObject=function(){return o;};this.getParameters=function(){return p;};this.getStack=function(){if(this.stack){return this.stack;}return"";};this.getTimestamp=function(){return d.getTime();};this.getTimestampAsdateObject=function(){return d;};this.getJQueryVersion=function(){return jQuery().jquery;};this.getSapUi5Version=function(){return sap.ui.version;};};
sap.apf.core.MessageObject.prototype=new Error();sap.apf.core.MessageObject.prototype.constructor=sap.apf.core.MessageObject;
