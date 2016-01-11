/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/thirdparty/URI","sap/ui/fl/Utils"],function(q,u,F){"use strict";var C=function(p){this._initClientParam();this._initLanguageParam();if(p){this._sXsrfToken=p.XsrfToken;}};C.createConnector=function(p){return new C(p);};C.prototype.DEFAULT_CONTENT_TYPE="application/json";C.prototype._sClient=undefined;C.prototype._sLanguage=undefined;C.prototype._initClientParam=function(){var c=F.getClient();if(c){this._sClient=c;}};C.prototype._initLanguageParam=function(){var l;l=this._getUrlParameter('sap-language')||this._getUrlParameter('sap-ui-language');if(l){this._sLanguage=l;}};C.prototype._getAllUrlParameters=function(){return window.location.search.substring(1);};C.prototype._getUrlParameter=function(p){var U,s,i,c;s=this._getAllUrlParameters();U=s.split('&');for(i=0;i<U.length;i++){c=U[i].split('=');if(c[0]===p){return c[1];}}};C.prototype._resolveUrl=function(r){if(!q.sap.startsWith(r,"/")){r="/"+r;}var U=u(r).absoluteTo("");return U.toString();};C.prototype._getDefaultHeader=function(){var h={headers:{"X-CSRF-Token":this._sXsrfToken||"fetch"}};return h;};C.prototype._getDefaultOptions=function(m,c,d){var o;if(!c){c=this.DEFAULT_CONTENT_TYPE;}o=q.extend(true,this._getDefaultHeader(),{type:m,async:true,contentType:c,data:JSON.stringify(d),dataType:'json',processData:false,xhrFields:{withCredentials:true},headers:{"Content-Type":c}});if(m==='DELETE'){delete o.data;delete o.contentType;}return o;};C.prototype.send=function(U,m,d,o){m=m||"GET";m=m.toUpperCase();o=o||{};U=this._resolveUrl(U);if(o.success||o.error){var e="Success and error handler are not allowed in mOptions";throw new Error(e);}o=q.extend(true,this._getDefaultOptions(m,this.DEFAULT_CONTENT_TYPE,d),o);return this._sendAjaxRequest(U,o);};C.prototype._getMessagesFromXHR=function(x){var a,m,l,i;m=[];try{a=JSON.parse(x.responseText);if(a&&a.messages&&a.messages.length>0){l=a.messages.length;for(i=0;i<l;i++){m.push({severity:a.messages[i].severity,text:a.messages[i].text});}}}catch(e){}return m;};C.prototype._sendAjaxRequest=function(U,o){var t=this;var f="/sap/bc/lrep/actions/getcsrftoken/";var m={headers:{'X-CSRF-Token':'fetch'},type:"HEAD"};if(this._sClient){m.headers['sap-client']=this._sClient;}return new Promise(function(r,a){function h(R,s,x){var n=x.getResponseHeader("X-CSRF-Token");t._sXsrfToken=n||t._sXsrfToken;var d={status:s,response:R};r(d);}function b(R,s,x){t._sXsrfToken=x.getResponseHeader("X-CSRF-Token");o.headers=o.headers||{};o.headers["X-CSRF-Token"]=t._sXsrfToken;q.ajax(U,o).done(h).fail(function(x,s,e){var E=new Error(e);E.status="error";E.messages=t._getMessagesFromXHR(x);a(E);});}function c(x,s,e){if(x.status===403){q.ajax(f,m).done(b).fail(function(x,s,e){a({status:"error"});});}else{if(o&&o.type==="DELETE"&&x.status===404){r();}else{var d;d={status:"error"};d.messages=t._getMessagesFromXHR(x);a(d);}}}if(!t._sXsrfToken||t._sXsrfToken==="fetch"){q.ajax(f,m).done(b).fail(function(x,s,e){a({status:"error"});});}else{q.ajax(U,o).done(h).fail(c);}});};C.prototype.loadChanges=function(c){var r,p;var t=this;try{r=q.sap.getResourceName(c,"-changes.json");}catch(e){return Promise.reject(e);}p={async:true,dataType:"json",failOnError:true,headers:{"X-UI5-Component":c}};if(this._sClient){p.headers["sap-client"]=this._sClient;}return q.sap.loadResource(r,p).then(function(R){var a=t._condense(R.changes);R.changes=a;var b={changes:R,componentClassName:c};return b;});};C.prototype._condense=function(c){return c.reduce(function(r,e,a,b){for(var i=0;i<r.length;i++){if((e.changeType===r[i].changeType)&&(e.component===r[i].component)&&(e.fileType===r[i].fileType)&&(JSON.stringify(e.selector)===JSON.stringify(r[i].selector))&&(JSON.stringify(e.texts)===JSON.stringify(r[i].texts))&&(JSON.stringify(e.content)===JSON.stringify(r[i].content))){return r;}}r.push(e);return r;},[]);};C.prototype._buildParams=function(p){if(!p){p=[];}if(this._sClient){p.push({name:"sap-client",value:this._sClient});}if(this._sLanguage){p.push({name:"sap-language",value:this._sLanguage});}var r="";var l=p.length;for(var i=0;i<l;i++){if(i===0){r+="?";}else if(i>0&&i<l){r+="&";}r+=p[i].name+"="+p[i].value;}return r;};C.prototype._getUrlPrefix=function(i){if(i){return"/sap/bc/lrep/variants/";}return"/sap/bc/lrep/changes/";};C.prototype.create=function(p,c,i){var r=this._getUrlPrefix(i);var P=[];if(c){P.push({name:"changelist",value:c});}r+=this._buildParams(P);return this.send(r,"POST",p,null);};C.prototype.update=function(p,c,s,i){var r=this._getUrlPrefix(i);r+=c;var P=[];if(s){P.push({name:"changelist",value:s});}r+=this._buildParams(P);return this.send(r,"PUT",p,null);};C.prototype.deleteChange=function(p,i){var r=this._getUrlPrefix(i);r+=p.sChangeName;var P=[];if(p.sLayer){P.push({name:"layer",value:p.sLayer});}if(p.sNamespace){P.push({name:"namespace",value:p.sNamespace});}if(p.sChangelist){P.push({name:"changelist",value:p.sChangelist});}r+=this._buildParams(P);return this.send(r,"DELETE",{},null);};C.prototype.getStaticResource=function(n,N,t,i){var a="/sap/bc/lrep/content/";var r=a;r+=n+"/"+N+"."+t;var p=[];if(i===true){p.push({name:"rt",value:"true"});}r+=this._buildParams(p);return this.send(r,"GET",{},null);};C.prototype.getFileAttributes=function(n,N,t,l){var a="/sap/bc/lrep/content/";var r=a;r+=n+"/"+N+"."+t;var p=[];p.push({name:"metadata",value:"true"});if(l){p.push({name:"layer",value:l});}r+=this._buildParams(p);return this.send(r,"GET",{},null);};C.prototype.upsert=function(n,N,t,l,c){var a=this;return Promise.resolve(a._fileAction("PUT",n,N,t,l,c));};C.prototype.deleteFile=function(n,N,t,l,c){return this._fileAction("DELETE",n,N,t,l,c);};C.prototype._fileAction=function(m,n,N,t,l,c){var a="/sap/bc/lrep/content/";var r=a;r+=n+"/"+N+"."+t;var p=[];p.push({name:"layer",value:l});if(c){p.push({name:"changelist",value:c});}r+=this._buildParams(p);return this.send(r,m.toUpperCase(),{},null);};C.prototype.publish=function(o,n,t,O,T,s,c){var a="/sap/bc/lrep/actions/publish/";var r=a;r+=o+"/"+n+"."+t;var p=[];if(O){p.push({name:"layer",value:O});}if(T){p.push({name:"target-layer",value:T});}if(s){p.push({name:"target-namespace",value:s});}if(c){p.push({name:"changelist",value:c});}r+=this._buildParams(p);return this.send(r,"POST",{},null);};C.prototype.listContent=function(n,l){var r="/sap/bc/lrep/content/";r+=n;var p=[];if(l){p.push({name:"layer",value:l});}r+=this._buildParams(p);return this.send(r,"GET",{},null);};return C;},true);
