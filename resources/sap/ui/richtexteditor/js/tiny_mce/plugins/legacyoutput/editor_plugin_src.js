/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 *
 * This plugin will force TinyMCE to produce deprecated legacy output such as font elements, u elements, align
 * attributes and so forth. There are a few cases where these old items might be needed for example in email applications or with Flash
 *
 * However you should NOT use this plugin if you are building some system that produces web contents such as a CMS. All these elements are
 * not apart of the newer specifications for HTML and XHTML.
 */
(function(t){t.onAddEditor.addToTop(function(t,e){e.settings.inline_styles=false;});t.create('tinymce.plugins.LegacyOutput',{init:function(e){e.onInit.add(function(){var a='p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',f=t.explode(e.settings.font_size_style_values),s=e.schema;e.formatter.register({alignleft:{selector:a,attributes:{align:'left'}},aligncenter:{selector:a,attributes:{align:'center'}},alignright:{selector:a,attributes:{align:'right'}},alignfull:{selector:a,attributes:{align:'justify'}},bold:[{inline:'b',remove:'all'},{inline:'strong',remove:'all'},{inline:'span',styles:{fontWeight:'bold'}}],italic:[{inline:'i',remove:'all'},{inline:'em',remove:'all'},{inline:'span',styles:{fontStyle:'italic'}}],underline:[{inline:'u',remove:'all'},{inline:'span',styles:{textDecoration:'underline'},exact:true}],strikethrough:[{inline:'strike',remove:'all'},{inline:'span',styles:{textDecoration:'line-through'},exact:true}],fontname:{inline:'font',attributes:{face:'%value'}},fontsize:{inline:'font',attributes:{size:function(v){return t.inArray(f,v.value)+1;}}},forecolor:{inline:'font',attributes:{color:'%value'}},hilitecolor:{inline:'font',styles:{backgroundColor:'%value'}}});t.each('b,i,u,strike'.split(','),function(n){s.addValidElements(n+'[*]');});if(!s.getElementRule("font"))s.addValidElements("font[face|size|color|style]");t.each(a.split(','),function(n){var r=s.getElementRule(n),b;if(r){if(!r.attributes.align){r.attributes.align={};r.attributesOrder.push('align');}}});e.onNodeChange.add(function(e,c){var b,d,g,h;d=e.dom.getParent(e.selection.getNode(),'font');if(d){g=d.face;h=d.size;}if(b=c.get('fontselect')){b.select(function(v){return v==g;});}if(b=c.get('fontsizeselect')){b.select(function(v){var i=t.inArray(f,v.fontSize);return i+1==h;});}});});},getInfo:function(){return{longname:'LegacyOutput',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/legacyoutput',version:t.majorVersion+"."+t.minorVersion};}});t.PluginManager.add('legacyoutput',t.plugins.LegacyOutput);})(tinymce);
