/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.GenericTileRenderer");sap.suite.ui.commons.GenericTileRenderer={};
sap.suite.ui.commons.GenericTileRenderer.renderHeader=function(r,c){r.write("<div");r.addClass("sapSuiteGTHdrTxt");r.addClass(c.getSize());r.writeClasses();r.writeAttribute("id",c.getId()+"-hdr-text");r.write(">");r.renderControl(c._oTitle);r.write("</div>");};
sap.suite.ui.commons.GenericTileRenderer.renderSubheader=function(r,c){r.write("<div");r.addClass("sapSuiteGTSubHdrTxt");r.addClass(c.getSize());r.writeClasses();r.writeAttribute("id",c.getId()+"-subHdr-text");r.write(">");r.writeEscaped(c.getSubheader());r.write("</div>");};
sap.suite.ui.commons.GenericTileRenderer.renderContent=function(r,c){r.write("<div");r.addClass("sapSuiteGTContent");r.addClass(c.getSize());r.writeClasses();r.writeAttribute("id",c.getId()+"-content");r.write(">");this.renderInnerContent(r,c);r.write("</div>");};
sap.suite.ui.commons.GenericTileRenderer.render=function(r,c){var t=c.getTooltip_AsString();var h=c.getHeaderImage();r.write("<div");r.writeControlData(c);if(t){r.writeAttributeEscaped("title",t);}r.addClass("sapSuiteGT");r.addClass(c.getSize());r.addClass(c.getFrameType());r.writeAttribute("role","presentation");r.writeAttribute("aria-label",c.getAltText());if(c.hasListeners("press")&&c.getState()!="Disabled"){r.addClass("sapSuiteUiCommonsPointer");r.writeAttribute("tabindex","0");}r.writeClasses();if(c.getBackgroundImage()){r.write(" style='background-image:url(");r.writeEscaped(c.getBackgroundImage());r.write(");'");}r.write(">");var s=c.getState();if(s!=sap.suite.ui.commons.LoadState.Loaded){r.write("<div");r.addClass("sapSuiteGTOverlay");r.writeClasses();r.writeAttribute("id",c.getId()+"-overlay");r.write(">");switch(s){case sap.suite.ui.commons.LoadState.Disabled:case sap.suite.ui.commons.LoadState.Loading:c._oBusy.setBusy(s=="Loading");r.renderControl(c._oBusy);break;case sap.suite.ui.commons.LoadState.Failed:r.write("<div");r.writeAttribute("id",c.getId()+"-failed-ftr");r.addClass("sapSuiteGenericTileFtrFld");r.writeClasses();r.write(">");r.write("<div");r.writeAttribute("id",c.getId()+"-failed-icon");r.addClass("sapSuiteGenericTileFtrFldIcn");r.writeClasses();r.write(">");r.renderControl(c._oWarningIcon);r.write("</div>");r.write("<div");r.writeAttribute("id",c.getId()+"-failed-text");r.addClass("sapSuiteGenericTileFtrFldTxt");r.writeClasses();r.write(">");r.renderControl(c._oFailed);r.write("</div>");r.write("</div>");break;default:}r.write("</div>");}r.write("<div");r.addClass("sapSuiteGTHdrContent");r.addClass(c.getSize());r.addClass(c.getFrameType());r.writeAttributeEscaped("title",c.getHeaderAltText());r.writeClasses();r.write(">");if(h){r.renderControl(c._oImage);}this.renderHeader(r,c);this.renderSubheader(r,c);r.write("</div>");r.write("<div");r.addClass("sapSuiteGTContent");r.addClass(c.getSize());r.writeClasses();r.writeAttribute("id",c.getId()+"-content");r.write(">");var l=c.getTileContent().length;for(var i=0;i<l;i++){r.renderControl(c.getTileContent()[i]);}r.write("</div>");r.write("</div>");};
