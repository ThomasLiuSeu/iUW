/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/m/Input','sap/ui/comp/library'],function(q,I,l){"use strict";var a=I.extend("sap.ui.comp.smartform.flexibility.Input",{metadata:{library:"sap.ui.comp",events:{selectedByKeyboard:{}}}});a.prototype.init=function(){I.prototype.init.call(this);};a.prototype.onAfterRendering=function(){var d;I.prototype.onAfterRendering.apply(this);d=this.getDomRef();if(d){d.tabIndex=0;}};a.prototype.onkeydown=function(e){var n;I.prototype.onkeydown.apply(this,arguments);n=e.keyCode;if(n===32){if(this.getEditable()===false){this.fireSelectedByKeyboard();}}};a.prototype.onsapescape=function(e){I.prototype.onsapescape.apply(this,arguments);e.stopPropagation();this.setEditable(false);};return a;},true);
