/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create('tinymce.plugins.VisualChars',{init:function(e,u){var t=this;t.editor=e;e.addCommand('mceVisualChars',t._toggleVisualChars,t);e.addButton('visualchars',{title:'visualchars.desc',cmd:'mceVisualChars'});e.onBeforeGetContent.add(function(e,o){if(t.state&&o.format!='raw'&&!o.draft){t.state=true;t._toggleVisualChars(false);}});},getInfo:function(){return{longname:'Visual characters',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/visualchars',version:tinymce.majorVersion+"."+tinymce.minorVersion};},_toggleVisualChars:function(a){var t=this,e=t.editor,c,i,h,d=e.getDoc(),b=e.getBody(),f,s=e.selection,g,j,k;t.state=!t.state;e.controlManager.setActive('visualchars',t.state);if(a)k=s.getBookmark();if(t.state){c=[];tinymce.walk(b,function(n){if(n.nodeType==3&&n.nodeValue&&n.nodeValue.indexOf('\u00a0')!=-1)c.push(n);},'childNodes');for(i=0;i<c.length;i++){f=c[i].nodeValue;f=f.replace(/(\u00a0)/g,'<span data-mce-bogus="1" class="mceItemHidden mceItemNbsp">$1</span>');j=e.dom.create('div',null,f);while(node=j.lastChild)e.dom.insertAfter(node,c[i]);e.dom.remove(c[i]);}}else{c=e.dom.select('span.mceItemNbsp',b);for(i=c.length-1;i>=0;i--)e.dom.remove(c[i],1);}s.moveToBookmark(k);}});tinymce.PluginManager.add('visualchars',tinymce.plugins.VisualChars);})();
