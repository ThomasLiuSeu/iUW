/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create('tinymce.plugins.PageBreakPlugin',{init:function(b,u){var p='<img src="'+b.theme.url+'/img/trans.gif" class="mcePageBreak mceItemNoResize" />',c='mcePageBreak',s=b.getParam('pagebreak_separator','<!-- pagebreak -->'),d;d=new RegExp(s.replace(/[\?\.\*\[\]\(\)\{\}\+\^\$\:]/g,function(a){return'\\'+a;}),'g');b.addCommand('mcePageBreak',function(){b.execCommand('mceInsertContent',0,p);});b.addButton('pagebreak',{title:'pagebreak.desc',cmd:c});b.onInit.add(function(){if(b.theme.onResolveName){b.theme.onResolveName.add(function(t,o){if(o.node.nodeName=='IMG'&&b.dom.hasClass(o.node,c))o.name='pagebreak';});}});b.onClick.add(function(b,e){e=e.target;if(e.nodeName==='IMG'&&b.dom.hasClass(e,c))b.selection.select(e);});b.onNodeChange.add(function(b,a,n){a.setActive('pagebreak',n.nodeName==='IMG'&&b.dom.hasClass(n,c));});b.onBeforeSetContent.add(function(b,o){o.content=o.content.replace(d,p);});b.onPostProcess.add(function(b,o){if(o.get)o.content=o.content.replace(/<img[^>]+>/g,function(i){if(i.indexOf('class="mcePageBreak')!==-1)i=s;return i;});});},getInfo:function(){return{longname:'PageBreak',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/pagebreak',version:tinymce.majorVersion+"."+tinymce.minorVersion};}});tinymce.PluginManager.add('pagebreak',tinymce.plugins.PageBreakPlugin);})();
