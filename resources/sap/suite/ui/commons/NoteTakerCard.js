/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.NoteTakerCard");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.NoteTakerCard",{metadata:{library:"sap.suite.ui.commons",properties:{"header":{type:"string",group:"Misc",defaultValue:null},"body":{type:"string",group:"Misc",defaultValue:null},"timestamp":{type:"object",group:"Misc",defaultValue:new Date()},"tags":{type:"object",group:"Misc",defaultValue:[]},"viewAllTrigger":{type:"int",group:"Misc",defaultValue:1800},"uid":{type:"string",group:"Misc",defaultValue:null},"isFiltered":{type:"boolean",group:"Misc",defaultValue:false},"thumbUp":{type:"boolean",group:"Misc",defaultValue:null},"thumbDown":{type:"boolean",group:"Misc",defaultValue:null},"allTags":{type:"object",group:"Misc",defaultValue:[]},"attachmentFilename":{type:"string",group:"Misc",defaultValue:null},"attachmentUrl":{type:"string",group:"Misc",defaultValue:null}},events:{"editNote":{},"deleteNote":{},"attachmentClick":{}}}});sap.suite.ui.commons.NoteTakerCard.M_EVENTS={'editNote':'editNote','deleteNote':'deleteNote','attachmentClick':'attachmentClick'};jQuery.sap.require("sap.ui.core.Locale");jQuery.sap.require("sap.ui.core.format.DateFormat");jQuery.sap.require("sap.ui.ux3.OverlayContainer");jQuery.sap.require("sap.ui.commons.Link");jQuery.sap.require("sap.ui.commons.MessageBox");
sap.suite.ui.commons.NoteTakerCard.prototype.init=function(){this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");var t=this;this._oEditButton=new sap.ui.commons.Button({id:this.getId()+"-edit-button",press:function(e){t._handleEdit();},tooltip:this._rb.getText("NOTETAKERCARD_BUTTON_OPEN_EDIT_TOOLTIP")});this._oEditButton.addStyleClass("sapSuiteUiCommonsNoteTakerCardEditButton");this._oDeleteButton=new sap.ui.commons.Button({id:this.getId()+"-delete-button",tooltip:this._rb.getText("NOTETAKERCARD_BUTTON_DELETE_TOOLTIP"),press:function(){t._handleDelete();}});this._oDeleteButton.addStyleClass("sapSuiteUiCommonsNoteTakerCardDeleteButton");this._oViewAllLink=new sap.ui.commons.Link({id:this.getId()+"-viewAll-link",text:this._rb.getText("NOTETAKERCARD_LINK_VIEW_ALL_TEXT"),tooltip:this._rb.getText("NOTETAKERCARD_LINK_VIEW_ALL_TOOLTIP"),press:function(){t._openOverlay();}});this._oOverlayCard=new sap.ui.ux3.OverlayContainer(this.getId()+"-overlay",{openButtonVisible:false,close:function(e){t._handleOverlayCloseEvent(e.getSource());e.preventDefault();}});this._oOverlayCard.addDelegate({onAfterRendering:function(){var o=jQuery.sap.byId(t.getId()+"-overlayTimestamp");if(o){o.html(t.getFormattedTimestamp());}}});this._oOverlayCard._superOnsapselect=this._oOverlayCard.onsapselect;this._oOverlayCard.onsapselect=function(e){var c=e.srcControl.getId();if(c.indexOf("-overlayBody")<0&&c.indexOf("-inputTag")<0&&c.indexOf("-overlayCardTitle")<0){e.stopPropagation();e.preventDefault();}setTimeout(function(){t._oOverlayCard._superOnsapselect(e);},10);};this._oOverlayCard.addStyleClass("sapSuiteCommonsNoteTakerCardOverlayWindow");this._oOverlayCard._tagControls={};};
sap.suite.ui.commons.NoteTakerCard.prototype.exit=function(){this._oDeleteButton.destroy();this._oDeleteButton=null;this._oEditButton.destroy();this._oEditButton=null;this._oViewAllLink.destroy();this._oViewAllLink=null;this._oOverlayCard.destroy();this._oOverlayCard=null;};
sap.suite.ui.commons.NoteTakerCard.prototype.getFormattedTimestamp=function(){var l=sap.ui.getCore().getConfiguration().getLocale();var d=sap.ui.core.format.DateFormat.getDateTimeInstance({style:"medium"},l);return d.format(this.getTimestamp());};
sap.suite.ui.commons.NoteTakerCard.prototype._handleOverlayCloseEvent=function(c){if(c.bEditMode){var t=this;sap.ui.commons.MessageBox.show(this._rb.getText("NOTETAKERCARD_CONFIRMATION_CANCEL_EDIT_MESSAGE"),sap.ui.commons.MessageBox.Icon.QUESTION,this._rb.getText("NOTETAKERCARD_CONFIRMATION_CANCEL_EDIT_TITLE"),[sap.ui.commons.MessageBox.Action.YES,sap.ui.commons.MessageBox.Action.NO],function(r){if(r==sap.ui.commons.MessageBox.Action.YES){t._closeOverlay();t._oEditButton.focus();}else{jQuery.sap.focus(jQuery.sap.domById(t.getId()+"-overlayBody"));}},sap.ui.commons.MessageBox.Action.NO);}else{this._closeOverlay();}};
sap.suite.ui.commons.NoteTakerCard.prototype._closeOverlay=function(){this._oOverlayCard.close();this._destroyTagControls();this._oOverlayCard.bEditMode=false;this._oOverlayCard.destroyContent();};
sap.suite.ui.commons.NoteTakerCard.prototype._openOverlay=function(e){var i;if(!this._oOverlayCard.isOpen()){this._oOverlayCard.bThumbUp=this.getThumbUp();this._oOverlayCard.bThumbDown=this.getThumbDown();this._prepareOverlayLayouts();this._prepareOverlayToolbar(e);this._prepareOverlayHeaderBtns(e);this._prepareOverlayBody();this._prepareOverlayButtons(e);if(e){i=this.getId()+"-overlayBody";}else{i=this.getId()+"-overlay-close";}this._oOverlayCard.open(i);jQuery.sap.byId(this.getId()+"-overlay-thumb-down-button").attr("aria-pressed",this.getThumbDown());jQuery.sap.byId(this.getId()+"-overlay-thumb-up-button").attr("aria-pressed",this.getThumbUp());}};
sap.suite.ui.commons.NoteTakerCard.prototype._getFormattedBody=function(){var b=[];var t=this.getBody();do{var p=t.search(/[\s<>]/);var s="",w="";if(p<0){w=t;}else{w=t.slice(0,p);s=t.slice(p,p+1);t=t.slice(p+1);}switch(true){case(this._isFullUrl(w)):this.wrapFullUrl(b,w,s);break;case(this._isShortUrl(w)):this._wrapShortUrl(b,w,s);break;case(this._isEmail(w)):this._wrapEmail(b,w,s);break;default:b.push(jQuery.sap.encodeHTML(w+s));}}while(p>=0);return b.join("");};
sap.suite.ui.commons.NoteTakerCard.prototype._isFullUrl=function(w){return/^(https?|ftp):\/\//i.test(w)&&jQuery.sap.validateUrl(w);};
sap.suite.ui.commons.NoteTakerCard.prototype._isShortUrl=function(w){return/^(www\.)/i.test(w)&&jQuery.sap.validateUrl("http://"+w);};
sap.suite.ui.commons.NoteTakerCard.prototype._isEmail=function(w){return/^[\w\.=-]+@[\w\.-]+\.[\w]{2,5}$/.test(w);};
sap.suite.ui.commons.NoteTakerCard.prototype.wrapFullUrl=function(b,w,s){b.push('<a class="sapUiLnk" ');b.push('href = '+'"'+jQuery.sap.encodeHTML(w)+'"');b.push(' target = "_blank"');b.push('>');b.push(jQuery.sap.encodeHTML(w));b.push('</a>'+s);};
sap.suite.ui.commons.NoteTakerCard.prototype._wrapShortUrl=function(b,w,s){b.push('<a class="sapUiLnk" ');b.push('href = '+'"'+jQuery.sap.encodeHTML("http://"+w)+'"');b.push(' target = "_blank"');b.push('>');b.push(jQuery.sap.encodeHTML(w));b.push('</a>'+s);};
sap.suite.ui.commons.NoteTakerCard.prototype._wrapEmail=function(b,w,s){b.push('<a class="sapUiLnk" ');b.push('href = "mailto:'+jQuery.sap.encodeHTML(w)+'"');b.push('>');b.push(jQuery.sap.encodeHTML(w));b.push('</a>'+s);};
sap.suite.ui.commons.NoteTakerCard.prototype._wrapBodyToDiv=function(t){return"<div class='sapSuiteUiCommonsNoteTakerCardBody'>"+t+"</div>";};
sap.suite.ui.commons.NoteTakerCard.prototype._wrapTagPanelToDiv=function(t,e){if(e){return"<div class='suiteUiNtcOverlayTagPanelEditMode'>"+t+"</div>";}else{return"<div class='suiteUiNtcOverlayTagPanelViewMode'>"+t+"</div>";}};
sap.suite.ui.commons.NoteTakerCard.prototype._handleEdit=function(){this._openOverlay(true);};
sap.suite.ui.commons.NoteTakerCard.prototype._getFormattedTags=function(){var b=[];var t;if(this._oOverlayCard.isOpen()){t=this._oOverlayCard._selectedTags;}else{t=this.getTags();}b.push("<div id='"+this.getId()+"-tag-list' class='sapSuiteUiCommonsNoteTakerCardTagList'>");if(t.length==0){b.push(this._rb.getText("NOTETAKERCARD_LABEL_TAGS_EMPTY"));}else{b.push(this._rb.getText("NOTETAKERCARD_LABEL_TAGS_FULL")+": ");var T=jQuery.sap.encodeHTML(t.sort().join(" "));b.push("<span title='"+T+"'>");b.push(T);b.push("</span>");}b.push("</div>");return b.join("");};
sap.suite.ui.commons.NoteTakerCard.prototype._handleDelete=function(c){var t=this;sap.ui.commons.MessageBox.show(this._rb.getText("NOTETAKERCARD_CONFIRMATION_DELETE_MESSAGE"),sap.ui.commons.MessageBox.Icon.QUESTION,this._rb.getText("NOTETAKERCARD_CONFIRMATION_DELETE_TITLE"),[sap.ui.commons.MessageBox.Action.YES,sap.ui.commons.MessageBox.Action.NO],function(r){if(r==sap.ui.commons.MessageBox.Action.YES){if(c){t._closeOverlay();}t._handleDeleteClick();}},sap.ui.commons.MessageBox.Action.NO);};
sap.suite.ui.commons.NoteTakerCard.prototype._handleDeleteClick=function(){var e={};e.uid=this.getUid();e.cardId=this.getId();e.title=this.getHeader();e.timestamp=this.getTimestamp();e.body=this.getBody();e.thumbUp=this.getThumbUp();e.thumbDown=this.getThumbDown();this.fireDeleteNote(e);};
sap.suite.ui.commons.NoteTakerCard.prototype.setUid=function(u){this.setProperty("uid",u,true);return this;};
sap.suite.ui.commons.NoteTakerCard.prototype._wrapThumbToDiv=function(i){var c=null;var t=null;if(this.getThumbUp()&&!this.getThumbDown()){c="sapSuiteUiCommonsNoteTakerCardThumbUp";t=this._rb.getText("NOTETAKERCARD_ICON_THUMB_UP_TOOLTIP");this._oOverlayCard.removeStyleClass("suiteUiNtcNegativeCard");this._oOverlayCard.addStyleClass("suiteUiNtcPositiveCard");}else if(!this.getThumbUp()&&this.getThumbDown()){c="sapSuiteUiCommonsNoteTakerCardThumbDown";t=this._rb.getText("NOTETAKERCARD_ICON_THUMB_DOWN_TOOLTIP");this._oOverlayCard.removeStyleClass("suiteUiNtcPositiveCard");this._oOverlayCard.addStyleClass("suiteUiNtcNegativeCard");}else{this._oOverlayCard.removeStyleClass("suiteUiNtcPositiveCard");this._oOverlayCard.removeStyleClass("suiteUiNtcNegativeCard");}var b=[];b.push("<div");if(i){b.push(" id='");b.push(i);b.push("'");}if(c){b.push(" class='");b.push(c);b.push("'");b.push(" title='");b.push(t);b.push("'");}b.push("></div>");return b.join("");};
sap.suite.ui.commons.NoteTakerCard.prototype._handleAddTag=function(t){this._oOverlayCard._selectedTags=[];var n=t.split(new RegExp("\\s+"));var T={};for(var i=0;i<n.length;i++){if(n[i].length!=0){T[n[i]]=0;}}for(var f in T){this._oOverlayCard._selectedTags.push(f);}var o=sap.ui.getCore().byId(this.getId()+'-overlayTagPanel');o.setContent(this._wrapTagPanelToDiv(this._getFormattedTags(),true));this._adjustTagButton();};
sap.suite.ui.commons.NoteTakerCard.prototype._adjustTagButton=function(){var t=this._oOverlayCard._tagControls.tagButton;if(this._oOverlayCard._selectedTags.length){t.addStyleClass("sapSuiteUiCommonsNoteTakerFeederButtonSelected");}else{t.removeStyleClass("sapSuiteUiCommonsNoteTakerFeederButtonSelected");}};
sap.suite.ui.commons.NoteTakerCard.prototype._toggleTagPopup=function(){var s=this._oOverlayCard._selectedTags;if(this._bTagPopupOpen){jQuery.sap.byId(this.getId()+"-selectTag-panel").slideToggle();this._focusDefaultControl();this._bTagPopupOpen=false;}else{this._addTagsToListBox(this.getAllTags());jQuery.sap.byId(this.getId()+"-selectTag-panel").slideToggle();jQuery.sap.byId(this.getId()+"-inputTag").val(s.length==0?"":s.join(" ")+" ");this._oOverlayCard._tagControls.tagInput.focus();this._bTagPopupOpen=true;}};
sap.suite.ui.commons.NoteTakerCard.prototype._focusDefaultControl=function(){this._oOverlayCard._tagControls.tagButton.focus();};
sap.suite.ui.commons.NoteTakerCard.prototype._handleTagInputLive=function(e){var l=e.getParameter("liveValue");var n=l.split(" ");var c=n[n.length-1];this._filterListBox(c);};
sap.suite.ui.commons.NoteTakerCard.prototype._filterListBox=function(i){if(i.length==0){this._addTagsToListBox(this.getAllTags());return;}var f=jQuery.grep(this.getAllTags(),function(a){if(a.indexOf(i)>=0){return true;}});this._addTagsToListBox(f);};
sap.suite.ui.commons.NoteTakerCard.prototype._addTagsToListBox=function(t){var l=jQuery.map(t,function(v,i){return new sap.ui.core.ListItem({text:v});});this._oOverlayCard._tagControls.tagList.setItems(l,true);this._oOverlayCard._tagControls.tagList.rerender();};
sap.suite.ui.commons.NoteTakerCard.prototype._handleListSelect=function(e){var s=e.getParameter("selectedItem").getText();var t=this._oOverlayCard._tagControls.tagInput;var T=t.getValue();var n=T.split(" ");n.pop();if(n.length==0){t.setValue(s+" ");}else{t.setValue(n.join(" ")+" "+s+" ");}this._oOverlayCard._tagControls.tagList.setSelectedIndex(-1);t.focus();};
sap.suite.ui.commons.NoteTakerCard.prototype._destroyTagControls=function(){var t=this._oOverlayCard._tagControls;for(var c in t){t[c].destroy();}this._oOverlayCard._tagControls={};};
sap.suite.ui.commons.NoteTakerCard.prototype._createTagSelectorControl=function(){var t=this._oOverlayCard._tagControls;var T=new sap.ui.commons.layout.VerticalLayout({id:this.getId()+"-selectTag-panel"});T.addStyleClass("sapSuiteUiCommonsNoteTakerFeederSelectTagPanel");T.addStyleClass("sapUiShd");t.tagSelectorLayout=T;T.addContent(new sap.ui.core.HTML(this.getId()+"-selectTag-arrow",{content:"<div class='sapSuiteUiCommonsNoteTakerFeederSelectTagArrow' ></div>"}));T.addContent(new sap.ui.core.HTML(this.getId()+"-selectTag-header",{content:["<div class='sapSuiteUiCommonsNoteTakerFeederSelectTagHeader' >",this._rb.getText("NOTETAKERFEEDER_TOOLPOPUP_TITLE"),"</div>"].join("")}));T.addContent(t.tagInput);T.addContent(t.tagList);var o=new sap.ui.commons.layout.HorizontalLayout();o.addStyleClass("sapSuiteUiCommonsNoteTakerFeederSelectTagButtons");o.addContent(t.tagApplyBtn);o.addContent(t.tagCancelBtn);T.addContent(o);return T;};
sap.suite.ui.commons.NoteTakerCard.prototype._prepareAttachmentPanel=function(i){var I=i?"-overlay":"";var c=i?"Overlay":"";var s=[this.getId(),I,"-attachmentPanel"].join("");var C=sap.ui.getCore().byId(s);if(C){C.destroy();}var a=new sap.ui.commons.layout.HorizontalLayout(s);a.addStyleClass(["suiteUiNtc",c,"AttachmentPanel"].join(""));a.addContent(new sap.ui.core.HTML({content:"<div class='suiteUiNtcAttachmentIcon'></div>"}));var A=new sap.ui.commons.Link({id:[this.getId(),I,"-attachmentLink"].join(""),text:this.getAttachmentFilename(),tooltip:this._rb.getText("NOTETAKERCARD_LINK_ATTACHMENT_TOOLTIP"),press:this._handleAttachmentDownload,href:this.getAttachmentUrl()});A._ntc=this;a.addContent(A);return a;};
sap.suite.ui.commons.NoteTakerCard.prototype._prepareOverlayLayouts=function(){var t=new sap.ui.commons.layout.VerticalLayout();var h=new sap.ui.commons.layout.VerticalLayout();h.addStyleClass("sapSuiteUiCommonsNtcOverlayTitle");var H=new sap.ui.commons.layout.HorizontalLayout();H.addStyleClass("sapSuiteUiCommonsNtcHeaderButtons");var o=new sap.ui.commons.layout.HorizontalLayout(this.getId()+'-overlayHeader',{content:[h,H]});o.addStyleClass("sapSuiteUiCommonsNtcOverlayHeader");t.addContent(o);var T=new sap.ui.commons.layout.HorizontalLayout(this.getId()+'-overlayToolbar');T.addStyleClass("suiteUiNtcToolbar");var a=new sap.ui.commons.layout.HorizontalLayout();a.addStyleClass("suiteUiNtcOverlayToolbarLeftPanel");var b=new sap.ui.commons.layout.HorizontalLayout();b.addStyleClass("suiteUiNtcOverlayToolbarRightPanel");T.addContent(a);T.addContent(b);t.addContent(T);this._oOverlayCard.addContent(t);var B=new sap.ui.commons.layout.VerticalLayout();B.addStyleClass("sapSuiteUiCommonsNoteTakerCardContent");var c=new sap.ui.commons.layout.HorizontalLayout(this.getId()+"-buttons");c.addStyleClass("sapSuiteUiCommonsNoteTakerCardOverlayButtonPanel");this._oOverlayCard.layouts={topSection:t,headerLeft:h,headerRight:H,toolbar:T,toolbarLeft:a,toolbarRight:b,body:B,buttons:c};};
sap.suite.ui.commons.NoteTakerCard.prototype._prepareOverlayHeaderBtns=function(e){var t=this;var E=new sap.ui.commons.Button(this.getId()+"-editButton",{tooltip:this._rb.getText("NOTETAKERCARD_BUTTON_EDIT_TOOLTIP"),press:function(){t._fnEdit();}});t._oOverlayCard.layouts.headerRight.addContent(E,0);if(e){E.setEnabled(false);E.addStyleClass("sapSuiteUiCommonsNoteTakerCardEditButtonDsbl");}else{E.setEnabled(true);E.addStyleClass("sapSuiteUiCommonsNoteTakerCardEditButton");}var d=new sap.ui.commons.Button(this.getId()+"-deleteButton",{tooltip:this._rb.getText("NOTETAKERCARD_BUTTON_DELETE_TOOLTIP"),press:function(){t._handleDelete(true);}});d.addStyleClass("sapSuiteUiCommonsNoteTakerCardDeleteButton");t._oOverlayCard.layouts.headerRight.addContent(d,1);var T=new sap.ui.commons.Label(this.getId()+"-overlayTimestamp",{text:t.getFormattedTimestamp()});T.addStyleClass("sapSuiteUiCommonsNoteTakerCardTimestamp");t._oOverlayCard.layouts.headerLeft.addContent(T,1);};
sap.suite.ui.commons.NoteTakerCard.prototype._prepareOverlayToolbar=function(e){this._oOverlayCard._selectedTags=this.getTags();if(this.getAttachmentFilename()!==""){var a=this._prepareAttachmentPanel(true);this._oOverlayCard.layouts.topSection.addContent(a);this._oOverlayCard.layouts.body.addStyleClass("suiteUiNtcOverlayWithAttachment");}else{this._oOverlayCard.layouts.body.addStyleClass("suiteUiNtcOverlayWithoutAttachment");}};
sap.suite.ui.commons.NoteTakerCard.prototype._prepareOverlayBody=function(){this._oOverlayCard.addContent(this._oOverlayCard.layouts.body);};
sap.suite.ui.commons.NoteTakerCard.prototype._prepareOverlayButtons=function(e){var t=this;var c=new sap.ui.commons.Button(this.getId()+"-closeButton",{text:this._rb.getText("NOTETAKERCARD_BUTTON_CLOSE_OVERLAY"),tooltip:this._rb.getText("NOTETAKERCARD_BUTTON_CLOSE_OVERLAY_TOOLTIP"),press:function(){t._handleOverlayCloseEvent(t._oOverlayCard);}});c.addStyleClass("sapSuiteUiCommonsNoteTakerCardOverlayButtonClose");var s=new sap.ui.commons.Button(this.getId()+"-saveButton",{text:this._rb.getText("NOTETAKERCARD_BUTTON_SAVE_TEXT"),tooltip:this._rb.getText("NOTETAKERCARD_BUTTON_SAVE_TOOLTIP"),press:function(){t._fnSave();}});s.addStyleClass("sapSuiteUiCommonsNoteTakerCardOverlayButtonSave");t._oOverlayCard.layouts.buttons.addContent(c,0);t._oOverlayCard.layouts.buttons.addContent(s,1);if(e){s.setEnabled(true);this._fnCreateInEditMode();}else{s.setEnabled(false);this._fnCreateInViewMode();}this._oOverlayCard.addContent(this._oOverlayCard.layouts.buttons);};
sap.suite.ui.commons.NoteTakerCard.prototype._fnCreateInViewMode=function(){var t=this;t._oOverlayCard.bEditMode=false;var c=new sap.ui.commons.Label(t.getId()+"-overlayCardHeader",{text:t.getHeader()});c.addStyleClass("sapSuiteUiCommonsNoteTakerCardTitle");t._oOverlayCard.layouts.headerLeft.insertContent(c,0);var T=new sap.ui.core.HTML(t.getId()+'-overlayTagPanel');T.setContent(t._wrapTagPanelToDiv(t._getFormattedTags(),t._oOverlayCard.bEditMode));t._oOverlayCard.layouts.toolbarLeft.addContent(T);var o=new sap.ui.core.HTML({id:t.getId()+"-overlay-thumb",content:t._wrapThumbToDiv()});t._oOverlayCard.layouts.toolbarRight.addContent(o);var C=new sap.ui.core.HTML(t.getId()+"-overlayBody");C.setContent(t._wrapBodyToDiv(t._getFormattedBody()));C.addStyleClass("sapSuiteUiCommonsNoteTakerCardBody");t._oOverlayCard.layouts.body.addContent(C);var s=t._oOverlayCard.layouts.buttons.getContent()[1];s.setEnabled(false);var e=t._oOverlayCard.layouts.headerRight.getContent()[0];e.setEnabled(true);e.removeStyleClass("sapSuiteUiCommonsNoteTakerCardEditButtonDsbl");e.addStyleClass("sapSuiteUiCommonsNoteTakerCardEditButton");};
sap.suite.ui.commons.NoteTakerCard.prototype._fnCreateInEditMode=function(){var t=this;t._oOverlayCard.bEditMode=true;var c=new sap.ui.commons.TextField(t.getId()+"-overlayCardTitle",{maxLength:50});c.setValue(t.getHeader());c.addStyleClass("sapSuiteUiCommonsNoteTakerCardTitle");var T=new sap.ui.commons.InPlaceEdit(t.getId()+"-overlayCardTitleEdit",{content:c,tooltip:t._rb.getText("NOTETAKERCARD_EDITFIELD_TITLE_TOOLTIP"),design:sap.ui.commons.TextViewDesign.H2,undoEnabled:false});T.addStyleClass("sapSuiteUiCommonsNtcdTitleEdit");t._oOverlayCard.layouts.headerLeft.insertContent(T,0);var o=new sap.ui.core.HTML(t.getId()+'-overlayTagPanel');o.setContent(t._wrapTagPanelToDiv(t._getFormattedTags(),t._oOverlayCard.bEditMode));t._oOverlayCard.layouts.toolbarLeft.addContent(o);var a=new sap.ui.commons.Button({id:t.getId()+"-tag-button",tooltip:t._rb.getText("NOTETAKERCARD_BUTTON_TAG_TOOLTIP"),press:function(){t._toggleTagPopup();}});a.addStyleClass("sapSuiteUiCommonsNoteTakerFeederTagButton");var b=new sap.ui.commons.ListBox({id:t.getId()+"-tagListBox",visibleItems:10,width:"100%",height:"194px",select:function(e){t._handleListSelect(e);}});var d=new sap.ui.commons.TextField({id:t.getId()+"-inputTag",liveChange:function(e){t._handleTagInputLive(e);}});d.onsapdown=function(e){e.preventDefault();e.stopPropagation();jQuery("#"+t.getId()+"-tagListBox li:eq(0)").focus();};var C=new sap.ui.commons.Button({id:t.getId()+"-cancel-tags-button",text:t._rb.getText("NOTETAKERFEEDER_BUTTON_CANCEL_TAGS"),tooltip:t._rb.getText("NOTETAKERFEEDER_BUTTON_CANCEL_TAGS_TOOLTIP"),press:function(){t._toggleTagPopup();}});C.addStyleClass("sapSuiteUiCommonsNoteTakerFeederCancelTagButton");var A=new sap.ui.commons.Button({id:t.getId()+"-add-tags-button",text:t._rb.getText("NOTETAKERFEEDER_BUTTON_ADD_TAGS"),tooltip:t._rb.getText("NOTETAKERFEEDER_BUTTON_ADD_TAGS_TOOLTIP"),press:function(){t._handleAddTag(d.getValue());a.rerender();t._toggleTagPopup();}});t._oOverlayCard._tagControls={tagButton:a,tagList:b,tagInput:d,tagCancelBtn:C,tagApplyBtn:A};t._oOverlayCard.addContent(t._createTagSelectorControl());var f=new sap.ui.commons.Button({id:t.getId()+"-overlay-thumb-up-button",press:function(e){t._oOverlayCard.bThumbUp=!t._oOverlayCard.bThumbUp;if(t._oOverlayCard.bThumbUp){t._oOverlayCard.bThumbDown=false;}s();},tooltip:t._rb.getText("NOTETAKERFEEDER_BUTTON_THUMB_UP_TOOLTIP")});f.addStyleClass("sapSuiteUiCommonsNoteTakerThumbUpBtn");var g=new sap.ui.commons.Button({id:t.getId()+"-overlay-thumb-down-button",press:function(e){t._oOverlayCard.bThumbDown=!t._oOverlayCard.bThumbDown;if(t._oOverlayCard.bThumbDown){t._oOverlayCard.bThumbUp=false;}s();},tooltip:t._rb.getText("NOTETAKERFEEDER_BUTTON_THUMB_DOWN_TOOLTIP")});g.addStyleClass("sapSuiteUiCommonsNoteTakerThumbDownBtn");var s=function(){if(t._oOverlayCard.bThumbUp){f.addStyleClass("sapSuiteUiCommonsNoteTakerCardSelectedBtn");t._oOverlayCard.addStyleClass("suiteUiNtcPositiveCard");}else{f.removeStyleClass("sapSuiteUiCommonsNoteTakerCardSelectedBtn");t._oOverlayCard.removeStyleClass("suiteUiNtcPositiveCard");}if(t._oOverlayCard.bThumbDown){g.addStyleClass("sapSuiteUiCommonsNoteTakerCardSelectedBtn");t._oOverlayCard.addStyleClass("suiteUiNtcNegativeCard");}else{g.removeStyleClass("sapSuiteUiCommonsNoteTakerCardSelectedBtn");t._oOverlayCard.removeStyleClass("suiteUiNtcNegativeCard");}jQuery.sap.byId(f.getId()).attr("aria-pressed",t._oOverlayCard.bThumbUp);jQuery.sap.byId(g.getId()).attr("aria-pressed",t._oOverlayCard.bThumbDown);};s();t._oOverlayCard.layouts.toolbarLeft.insertContent(a,0);t._oOverlayCard.layouts.toolbarRight.addContent(f);t._oOverlayCard.layouts.toolbarRight.addContent(g);var S=t._oOverlayCard.layouts.buttons.getContent()[1];S.setEnabled(true);var h=new sap.ui.commons.TextArea(t.getId()+"-overlayBody",{liveChange:function(e){var i=e.getParameter("liveValue");var j=(i!=null)&&!/^\s*$/.test(i);if(j!==S.getEnabled()){S.setEnabled(j);}}});h.setValue(t.getBody());h.addStyleClass("sapSuiteUiCommonsNoteTakerCardBody");t._oOverlayCard.layouts.body.addContent(h);var E=t._oOverlayCard.layouts.headerRight.getContent()[0];E.setEnabled(false);E.removeStyleClass("sapSuiteUiCommonsNoteTakerCardEditButton");E.addStyleClass("sapSuiteUiCommonsNoteTakerCardEditButtonDsbl");};
sap.suite.ui.commons.NoteTakerCard.prototype._fnSave=function(){var t=this;var T=t._oOverlayCard.layouts.headerLeft.getContent()[0];var c=T.getContent();var C=t._oOverlayCard.layouts.body.getContent()[0];if(C.getValue()){if(!this.getBinding("body")){t.setHeader(c.getValue());t.setBody(C.getValue());t.setTimestamp(new Date());t.setThumbUp(t._oOverlayCard.bThumbUp);t.setThumbDown(t._oOverlayCard.bThumbDown);t.setTags(t._oOverlayCard._selectedTags);}var e={};e.uid=t.getUid();e.title=c.getValue();e.body=C.getValue();e.timestamp=new Date();e.thumbUp=t._oOverlayCard.bThumbUp;e.thumbDown=t._oOverlayCard.bThumbDown;e.tags=t._oOverlayCard._selectedTags;t.fireEditNote(e);t._oOverlayCard.layouts.headerLeft.removeContent(T);T.destroy();c.destroy();t._oOverlayCard.layouts.body.removeContent(C);C.destroy();t._destroyTagControls();t._oOverlayCard.layouts.toolbarLeft.destroyContent();t._oOverlayCard.layouts.toolbarRight.destroyContent();t._fnCreateInViewMode();jQuery.sap.byId(t.getId()+"-overlayTimestamp").html(t.getFormattedTimestamp());jQuery.sap.byId(t.getId()+"-overlay-close").focus();}else{}};
sap.suite.ui.commons.NoteTakerCard.prototype._fnEdit=function(){var t=this;var c=t._oOverlayCard.layouts.headerLeft.getContent()[0];var C=t._oOverlayCard.layouts.body.getContent()[0];t._oOverlayCard.layouts.topSection.removeContent(c);c.destroy();t._oOverlayCard.layouts.body.removeContent(C);C.destroy();t._oOverlayCard.layouts.toolbarLeft.destroyContent();t._oOverlayCard.layouts.toolbarRight.destroyContent();t._fnCreateInEditMode();t._oOverlayCard.layouts.topSection.rerender();t._oOverlayCard.layouts.body.rerender();jQuery.sap.focus(jQuery.sap.domById(t.getId()+"-overlayBody"));};
sap.suite.ui.commons.NoteTakerCard.prototype._handleAttachmentDownload=function(){var t=this._ntc;var e={};e.uid=t.getUid();e.url=t.getAttachmentUrl();e.filename=t.getAttachmentFilename();t.fireAttachmentClick(e);};
