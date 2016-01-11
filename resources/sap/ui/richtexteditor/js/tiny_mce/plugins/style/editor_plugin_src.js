/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create('tinymce.plugins.StylePlugin',{init:function(a,u){a.addCommand('mceStyleProps',function(){var b=false;var c=a.selection.getSelectedBlocks();var s=[];if(c.length===1){s.push(a.selection.getNode().style.cssText);}else{tinymce.each(c,function(d){s.push(a.dom.getAttrib(d,'style'));});b=true;}a.windowManager.open({file:u+'/props.htm',width:480+parseInt(a.getLang('style.delta_width',0)),height:340+parseInt(a.getLang('style.delta_height',0)),inline:1},{applyStyleToBlocks:b,plugin_url:u,styles:s});});a.addCommand('mceSetElementStyle',function(b,v){if(e=a.selection.getNode()){a.dom.setAttrib(e,'style',v);a.execCommand('mceRepaint');}});a.onNodeChange.add(function(a,c,n){c.setDisabled('styleprops',n.nodeName==='BODY');});a.addButton('styleprops',{title:'style.desc',cmd:'mceStyleProps'});},getInfo:function(){return{longname:'Style',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/style',version:tinymce.majorVersion+"."+tinymce.minorVersion};}});tinymce.PluginManager.add('style',tinymce.plugins.StylePlugin);})();
