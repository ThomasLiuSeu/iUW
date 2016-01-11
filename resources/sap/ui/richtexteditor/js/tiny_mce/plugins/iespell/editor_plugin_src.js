/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create('tinymce.plugins.IESpell',{init:function(a,u){var t=this,b;if(!tinymce.isIE)return;t.editor=a;a.addCommand('mceIESpell',function(){try{b=new ActiveXObject("ieSpell.ieSpellExtension");b.CheckDocumentNode(a.getDoc().documentElement);}catch(e){if(e.number==-2146827859){a.windowManager.confirm(a.getLang("iespell.download"),function(s){if(s)window.open('http://www.iespell.com/download.php','ieSpellDownload','');});}else a.windowManager.alert("Error Loading ieSpell: Exception "+e.number);}});a.addButton('iespell',{title:'iespell.iespell_desc',cmd:'mceIESpell'});},getInfo:function(){return{longname:'IESpell (IE Only)',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/iespell',version:tinymce.majorVersion+"."+tinymce.minorVersion};}});tinymce.PluginManager.add('iespell',tinymce.plugins.IESpell);})();
