/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create('tinymce.plugins.AdvancedHRPlugin',{init:function(a,u){a.addCommand('mceAdvancedHr',function(){a.windowManager.open({file:u+'/rule.htm',width:250+parseInt(a.getLang('advhr.delta_width',0)),height:160+parseInt(a.getLang('advhr.delta_height',0)),inline:1},{plugin_url:u});});a.addButton('advhr',{title:'advhr.advhr_desc',cmd:'mceAdvancedHr'});a.onNodeChange.add(function(a,c,n){c.setActive('advhr',n.nodeName=='HR');});a.onClick.add(function(a,e){e=e.target;if(e.nodeName==='HR')a.selection.select(e);});},getInfo:function(){return{longname:'Advanced HR',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/advhr',version:tinymce.majorVersion+"."+tinymce.minorVersion};}});tinymce.PluginManager.add('advhr',tinymce.plugins.AdvancedHRPlugin);})();
