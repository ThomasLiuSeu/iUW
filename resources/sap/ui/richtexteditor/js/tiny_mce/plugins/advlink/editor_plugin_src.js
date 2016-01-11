/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create('tinymce.plugins.AdvancedLinkPlugin',{init:function(e,u){this.editor=e;e.addCommand('mceAdvLink',function(){var s=e.selection;if(s.isCollapsed()&&!e.dom.getParent(s.getNode(),'A'))return;e.windowManager.open({file:u+'/link.htm',width:480+parseInt(e.getLang('advlink.delta_width',0)),height:400+parseInt(e.getLang('advlink.delta_height',0)),inline:1},{plugin_url:u});});e.addButton('link',{title:'advlink.link_desc',cmd:'mceAdvLink'});e.addShortcut('ctrl+k','advlink.advlink_desc','mceAdvLink');e.onNodeChange.add(function(e,c,n,a){c.setDisabled('link',a&&n.nodeName!='A');c.setActive('link',n.nodeName=='A'&&!n.name);});},getInfo:function(){return{longname:'Advanced link',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/advlink',version:tinymce.majorVersion+"."+tinymce.minorVersion};}});tinymce.PluginManager.add('advlink',tinymce.plugins.AdvancedLinkPlugin);})();
