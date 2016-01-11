/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 *
 * Adds auto-save capability to the TinyMCE text editor to rescue content
 * inadvertently lost. This plugin was originally developed by Speednet
 * and that project can be found here: http://code.google.com/p/tinyautosave/
 *
 * TECHNOLOGY DISCUSSION:
 * 
 * The plugin attempts to use the most advanced features available in the current browser to save
 * as much content as possible.  There are a total of four different methods used to autosave the
 * content.  In order of preference, they are:
 * 
 * 1. localStorage - A new feature of HTML 5, localStorage can store megabytes of data per domain
 * on the client computer. Data stored in the localStorage area has no expiration date, so we must
 * manage expiring the data ourselves.  localStorage is fully supported by IE8, and it is supposed
 * to be working in Firefox 3 and Safari 3.2, but in reality is is flaky in those browsers.  As
 * HTML 5 gets wider support, the AutoSave plugin will use it automatically. In Windows Vista/7,
 * localStorage is stored in the following folder:
 * C:\Users\[username]\AppData\Local\Microsoft\Internet Explorer\DOMStore\[tempFolder]
 * 
 * 2. sessionStorage - A new feature of HTML 5, sessionStorage works similarly to localStorage,
 * except it is designed to expire after a certain amount of time.  Because the specification
 * around expiration date/time is very loosely-described, it is preferrable to use locaStorage and
 * manage the expiration ourselves.  sessionStorage has similar storage characteristics to
 * localStorage, although it seems to have better support by Firefox 3 at the moment.  (That will
 * certainly change as Firefox continues getting better at HTML 5 adoption.)
 * 
 * 3. UserData - A very under-exploited feature of Microsoft Internet Explorer, UserData is a
 * way to store up to 128K of data per "document", or up to 1MB of data per domain, on the client
 * computer.  The feature is available for IE 5+, which makes it available for every version of IE
 * supported by TinyMCE.  The content is persistent across browser restarts and expires on the
 * date/time specified, just like a cookie.  However, the data is not cleared when the user clears
 * cookies on the browser, which makes it well-suited for rescuing autosaved content.  UserData,
 * like other Microsoft IE browser technologies, is implemented as a behavior attached to a
 * specific DOM object, so in this case we attach the behavior to the same DOM element that the
 * TinyMCE editor instance is attached to.
 */
(function(t){var P='autosave',R='restoredraft',T=true,u,a,D=t.util.Dispatcher;t.create('tinymce.plugins.AutoSave',{init:function(e,b){var s=this,c=e.settings;s.editor=e;function p(d){var m={s:1000,m:60000};d=/^(\d+)([ms]?)$/.exec(''+d);return(d[2]?m[d[2]]:1)*parseInt(d);};t.each({ask_before_unload:T,interval:'30s',retention:'20m',minlength:50},function(v,k){k=P+'_'+k;if(c[k]===u)c[k]=v;});c.autosave_interval=p(c.autosave_interval);c.autosave_retention=p(c.autosave_retention);e.addButton(R,{title:P+".restore_content",onclick:function(){if(e.getContent({draft:true}).replace(/\s|&nbsp;|<\/?p[^>]*>|<br[^>]*>/gi,"").length>0){e.windowManager.confirm(P+".warning_message",function(o){if(o)s.restoreDraft();});}else s.restoreDraft();}});e.onNodeChange.add(function(){var d=e.controlManager;if(d.get(R))d.setDisabled(R,!s.hasDraft());});e.onInit.add(function(){if(e.controlManager.get(R)){s.setupStorage(e);setInterval(function(){if(!e.removed){s.storeDraft();e.nodeChanged();}},c.autosave_interval);}});s.onStoreDraft=new D(s);s.onRestoreDraft=new D(s);s.onRemoveDraft=new D(s);if(!a){window.onbeforeunload=t.plugins.AutoSave._beforeUnloadHandler;a=T;}},getInfo:function(){return{longname:'Auto save',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/autosave',version:t.majorVersion+"."+t.minorVersion};},getExpDate:function(){return new Date(new Date().getTime()+this.editor.settings.autosave_retention).toUTCString();},setupStorage:function(b){var s=this,c=P+'_test',d="OK";s.key=P+b.id;t.each([function(){if(localStorage){localStorage.setItem(c,d);if(localStorage.getItem(c)===d){localStorage.removeItem(c);return localStorage;}}},function(){if(sessionStorage){sessionStorage.setItem(c,d);if(sessionStorage.getItem(c)===d){sessionStorage.removeItem(c);return sessionStorage;}}},function(){if(t.isIE){b.getElement().style.behavior="url('#default#userData')";return{autoExpires:T,setItem:function(k,v){var f=b.getElement();f.setAttribute(k,v);f.expires=s.getExpDate();try{f.save("TinyMCE");}catch(e){}},getItem:function(k){var f=b.getElement();try{f.load("TinyMCE");return f.getAttribute(k);}catch(e){return null;}},removeItem:function(k){b.getElement().removeAttribute(k);}};}},],function(f){try{s.storage=f();if(s.storage)return false;}catch(e){}});},storeDraft:function(){var s=this,b=s.storage,e=s.editor,c,d;if(b){if(!b.getItem(s.key)&&!e.isDirty())return;d=e.getContent({draft:true});if(d.length>e.settings.autosave_minlength){c=s.getExpDate();if(!s.storage.autoExpires)s.storage.setItem(s.key+"_expires",c);s.storage.setItem(s.key,d);s.onStoreDraft.dispatch(s,{expires:c,content:d});}}},restoreDraft:function(){var s=this,b=s.storage,c;if(b){c=b.getItem(s.key);if(c){s.editor.setContent(c);s.onRestoreDraft.dispatch(s,{content:c});}}},hasDraft:function(){var s=this,b=s.storage,e,c;if(b){c=!!b.getItem(s.key);if(c){if(!s.storage.autoExpires){e=new Date(b.getItem(s.key+"_expires"));if(new Date().getTime()<e.getTime())return T;s.removeDraft();}else return T;}}return false;},removeDraft:function(){var s=this,b=s.storage,k=s.key,c;if(b){c=b.getItem(k);b.removeItem(k);b.removeItem(k+"_expires");if(c){s.onRemoveDraft.dispatch(s,{content:c});}}},"static":{_beforeUnloadHandler:function(e){var m;t.each(tinyMCE.editors,function(b){if(b.plugins.autosave)b.plugins.autosave.storeDraft();if(b.getParam("fullscreen_is_enabled"))return;if(!m&&b.isDirty()&&b.getParam("autosave_ask_before_unload"))m=b.getLang("autosave.unload_msg");});return m;}}});t.PluginManager.add('autosave',t.plugins.AutoSave);})(tinymce);
