/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create('tinymce.plugins.Save',{init:function(e,u){var t=this;t.editor=e;e.addCommand('mceSave',t._save,t);e.addCommand('mceCancel',t._cancel,t);e.addButton('save',{title:'save.save_desc',cmd:'mceSave'});e.addButton('cancel',{title:'save.cancel_desc',cmd:'mceCancel'});e.onNodeChange.add(t._nodeChange,t);e.addShortcut('ctrl+s',e.getLang('save.save_desc'),'mceSave');},getInfo:function(){return{longname:'Save',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/save',version:tinymce.majorVersion+"."+tinymce.minorVersion};},_nodeChange:function(e,c,n){var e=this.editor;if(e.getParam('save_enablewhendirty')){c.setDisabled('save',!e.isDirty());c.setDisabled('cancel',!e.isDirty());}},_save:function(){var e=this.editor,f,o,i,a;f=tinymce.DOM.get(e.id).form||tinymce.DOM.getParent(e.id,'form');if(e.getParam("save_enablewhendirty")&&!e.isDirty())return;tinyMCE.triggerSave();if(o=e.getParam("save_onsavecallback")){if(e.execCallback('save_onsavecallback',e)){e.startContent=tinymce.trim(e.getContent({format:'raw'}));e.nodeChanged();}return;}if(f){e.isNotDirty=true;if(f.onsubmit==null||f.onsubmit()!=false)f.submit();e.nodeChanged();}else e.windowManager.alert("Error: No form element found.");},_cancel:function(){var e=this.editor,o,h=tinymce.trim(e.startContent);if(o=e.getParam("save_oncancelcallback")){e.execCallback('save_oncancelcallback',e);return;}e.setContent(h);e.undoManager.clear();e.nodeChanged();}});tinymce.PluginManager.add('save',tinymce.plugins.Save);})();
