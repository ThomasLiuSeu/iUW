/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/ValueStateSupport','./MenuItemBase','./library'],function(q,V,M,l){"use strict";var a=M.extend("sap.ui.unified.MenuTextFieldItem",{metadata:{library:"sap.ui.unified",properties:{label:{type:"string",group:"Appearance",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},value:{type:"string",group:"Misc",defaultValue:null},valueState:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:sap.ui.core.ValueState.None}}}});(function(){a.prototype.render=function(r,i,m,I){var b=r,c=m.checkEnabled(i),d=i.getId();var C="sapUiMnuItm sapUiMnuTfItm";if(I.iItemNo==1){C+=" sapUiMnuItmFirst";}else if(I.iItemNo==I.iTotalItems){C+=" sapUiMnuItmLast";}if(!m.checkEnabled(i)){C+=" sapUiMnuItmDsbl";}if(i.getStartsSection()){C+=" sapUiMnuItmSepBefore";}b.write("<li ");b.writeAttribute("class",C);b.writeElementData(i);if(I.bAccessible){b.writeAttribute("role","menuitem");b.writeAttribute("aria-disabled",!c);b.writeAttribute("aria-posinset",I.iItemNo);b.writeAttribute("aria-setsize",I.iTotalItems);}b.write("><div class=\"sapUiMnuItmL\"></div>");b.write("<div class=\"sapUiMnuItmIco\">");if(i.getIcon()){b.writeIcon(i.getIcon());}b.write("</div>");b.write("<div id=\""+d+"-txt\" class=\"sapUiMnuItmTxt\">");b.write("<label id=\""+d+"-lbl\" class=\"sapUiMnuTfItemLbl\">");b.writeEscaped(i.getLabel()||"");b.write("</label>");b.write("<div id=\""+d+"-str\" class=\"sapUiMnuTfItmStretch\"></div>");b.write("<div class=\"sapUiMnuTfItemWrppr\">");b.write("<input id=\""+d+"-tf\" tabindex=\"-1\"");b.writeAttributeEscaped("value",i.getValue()||"");b.writeAttribute("class",c?"sapUiMnuTfItemTf sapUiMnuTfItemTfEnbl":"sapUiMnuTfItemTf sapUiMnuTfItemTfDsbl");if(!c){b.writeAttribute("disabled","disabled");}if(I.bAccessible){b.writeAccessibilityState(m,{role:"textbox",disabled:!c,multiline:false,autocomplete:"none",labelledby:{value:m.getId()+"-label "+d+"-lbl",append:true}});}b.write("></input></div></div>");b.write("<div class=\"sapUiMnuItmR\"></div>");b.write("</li>");};a.prototype.hover=function(h,m){this.$().toggleClass("sapUiMnuItmHov",h);var t=this;function f(){t.$("tf").focus();}if(h&&m.checkEnabled(this)){if(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version==8){setTimeout(f,0);}else{f();}}};a.prototype.onAfterRendering=function(){this._adaptSizes();this.setValueState(this.getValueState());};a.prototype.onsapup=function(e){this.getParent().focus();this.getParent().onsapprevious(e);};a.prototype.onsapdown=function(e){this.getParent().focus();this.getParent().onsapnext(e);};a.prototype.onsaphome=function(e){if(this._checkCursorPosForNav(false)){this.getParent().focus();this.getParent().onsaphome(e);}};a.prototype.onsapend=function(e){if(this._checkCursorPosForNav(true)){this.getParent().focus();this.getParent().onsapend(e);}};a.prototype.onsappageup=function(e){this.getParent().focus();this.getParent().onsappageup(e);};a.prototype.onsappagedown=function(e){this.getParent().focus();this.getParent().onsappagedown(e);};a.prototype.onsapescape=function(e){this.getParent().onsapescape(e);};a.prototype.onkeydown=function(e){e.stopPropagation();};a.prototype.onclick=function(e){if(!sap.ui.Device.system.desktop&&this.getParent().checkEnabled(this)){this.focus();}e.stopPropagation();};a.prototype.onsapenter=function(e){var v=this.$("tf").val();this.setValue(v);this.getParent().selectItem(this);e.preventDefault();e.stopPropagation();};a.prototype.setSubmenu=function(m){q.sap.log.warning("The aggregation 'submenu' is not supported for this type of menu item.","","sap.ui.unified.MenuTextFieldItem");return this;};a.prototype.setLabel=function(L){this.setProperty("label",L,true);this.$("lbl").text(L);this._adaptSizes();return this;};a.prototype.setValue=function(v){this.setProperty("value",v,true);this.$("tf").val(v);return this;};a.prototype.setValueState=function(v){this.setProperty("valueState",v,true);var $=this.$("tf");$.toggleClass("sapUiMnuTfItemTfErr",v==sap.ui.core.ValueState.Error);$.toggleClass("sapUiMnuTfItemTfWarn",v==sap.ui.core.ValueState.Warning);var t=V.enrichTooltip(this,this.getTooltip_AsString());this.$().attr("title",t?t:"");return this;};a.prototype.getFocusDomRef=function(){var f=this.$("tf");return f.length?f.get(0):null;};a.prototype._adaptSizes=function(){var $=this.$("tf");var b=this.$("lbl");var o=b.length?b.get(0).offsetLeft:0;if(sap.ui.getCore().getConfiguration().getRTL()){$.parent().css({"width":"auto","right":(this.$().outerWidth(true)-o+(b.outerWidth(true)-b.outerWidth()))+"px"});}else{$.parent().css({"width":"auto","left":(o+b.outerWidth(true))+"px"});}};a.prototype._checkCursorPosForNav=function(f){var r=sap.ui.getCore().getConfiguration().getRTL();var b=f?r:!r;var $=this.$("tf");var p=$.cursorPos();var L=$.val().length;if(r){p=L-p;}if((!b&&p!=L)||(b&&p!=0)){return false;}return true;};}());return a;},true);
