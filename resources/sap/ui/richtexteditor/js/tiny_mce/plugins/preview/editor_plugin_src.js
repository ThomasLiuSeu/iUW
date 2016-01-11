/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create('tinymce.plugins.Preview',{init:function(e,a){var t=this,c=tinymce.explode(e.settings.content_css);t.editor=e;tinymce.each(c,function(u,k){c[k]=e.documentBaseURI.toAbsolute(u);});e.addCommand('mcePreview',function(){e.windowManager.open({file:e.getParam("plugin_preview_pageurl",a+"/preview.html"),width:parseInt(e.getParam("plugin_preview_width","550")),height:parseInt(e.getParam("plugin_preview_height","600")),resizable:"yes",scrollbars:"yes",popup_css:c?c.join(','):e.baseURI.toAbsolute("themes/"+e.settings.theme+"/skins/"+e.settings.skin+"/content.css"),inline:e.getParam("plugin_preview_inline",1)},{base:e.documentBaseURI.getURI()});});e.addButton('preview',{title:'preview.preview_desc',cmd:'mcePreview'});},getInfo:function(){return{longname:'Preview',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/preview',version:tinymce.majorVersion+"."+tinymce.minorVersion};}});tinymce.PluginManager.add('preview',tinymce.plugins.Preview);})();
