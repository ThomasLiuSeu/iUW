/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create('tinymce.plugins.XHTMLXtrasPlugin',{init:function(e,u){e.addCommand('mceCite',function(){e.windowManager.open({file:u+'/cite.htm',width:350+parseInt(e.getLang('xhtmlxtras.cite_delta_width',0)),height:250+parseInt(e.getLang('xhtmlxtras.cite_delta_height',0)),inline:1},{plugin_url:u});});e.addCommand('mceAcronym',function(){e.windowManager.open({file:u+'/acronym.htm',width:350+parseInt(e.getLang('xhtmlxtras.acronym_delta_width',0)),height:250+parseInt(e.getLang('xhtmlxtras.acronym_delta_height',0)),inline:1},{plugin_url:u});});e.addCommand('mceAbbr',function(){e.windowManager.open({file:u+'/abbr.htm',width:350+parseInt(e.getLang('xhtmlxtras.abbr_delta_width',0)),height:250+parseInt(e.getLang('xhtmlxtras.abbr_delta_height',0)),inline:1},{plugin_url:u});});e.addCommand('mceDel',function(){e.windowManager.open({file:u+'/del.htm',width:340+parseInt(e.getLang('xhtmlxtras.del_delta_width',0)),height:310+parseInt(e.getLang('xhtmlxtras.del_delta_height',0)),inline:1},{plugin_url:u});});e.addCommand('mceIns',function(){e.windowManager.open({file:u+'/ins.htm',width:340+parseInt(e.getLang('xhtmlxtras.ins_delta_width',0)),height:310+parseInt(e.getLang('xhtmlxtras.ins_delta_height',0)),inline:1},{plugin_url:u});});e.addCommand('mceAttributes',function(){e.windowManager.open({file:u+'/attributes.htm',width:380+parseInt(e.getLang('xhtmlxtras.attr_delta_width',0)),height:370+parseInt(e.getLang('xhtmlxtras.attr_delta_height',0)),inline:1},{plugin_url:u});});e.addButton('cite',{title:'xhtmlxtras.cite_desc',cmd:'mceCite'});e.addButton('acronym',{title:'xhtmlxtras.acronym_desc',cmd:'mceAcronym'});e.addButton('abbr',{title:'xhtmlxtras.abbr_desc',cmd:'mceAbbr'});e.addButton('del',{title:'xhtmlxtras.del_desc',cmd:'mceDel'});e.addButton('ins',{title:'xhtmlxtras.ins_desc',cmd:'mceIns'});e.addButton('attribs',{title:'xhtmlxtras.attribs_desc',cmd:'mceAttributes'});e.onNodeChange.add(function(e,c,n,a){n=e.dom.getParent(n,'CITE,ACRONYM,ABBR,DEL,INS');c.setDisabled('cite',a);c.setDisabled('acronym',a);c.setDisabled('abbr',a);c.setDisabled('del',a);c.setDisabled('ins',a);c.setDisabled('attribs',n&&n.nodeName=='BODY');c.setActive('cite',0);c.setActive('acronym',0);c.setActive('abbr',0);c.setActive('del',0);c.setActive('ins',0);if(n){do{c.setDisabled(n.nodeName.toLowerCase(),0);c.setActive(n.nodeName.toLowerCase(),1);}while(n=n.parentNode);}});e.onPreInit.add(function(){e.dom.create('abbr');});},getInfo:function(){return{longname:'XHTML Xtras Plugin',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/xhtmlxtras',version:tinymce.majorVersion+"."+tinymce.minorVersion};}});tinymce.PluginManager.add('xhtmlxtras',tinymce.plugins.XHTMLXtrasPlugin);})();
