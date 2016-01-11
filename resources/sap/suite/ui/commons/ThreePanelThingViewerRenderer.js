/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.ThreePanelThingViewerRenderer");jQuery.sap.require("sap.ui.ux3.ThingViewerRenderer");jQuery.sap.require("sap.ui.core.Renderer");sap.suite.ui.commons.ThreePanelThingViewerRenderer=sap.ui.core.Renderer.extend(sap.ui.ux3.ThingViewerRenderer);
sap.suite.ui.commons.ThreePanelThingViewerRenderer.renderContent=function(r,c){r.write("<div");r.addClass("sapSuiteTvMinHeight");r.writeClasses();r.write(">");r.write("<header");r.writeAttribute("id",c.getId()+"-header");r.addClass("sapSuiteTvTitle");r.writeClasses();r.addStyle("width",c.getSidebarWidth());r.writeStyles();r.write(">");this.renderHeader(r,c);r.write("</header>");r.write("<nav");r.writeAttribute("id",c.getId()+"-navigation");r.addClass("sapSuiteTvNav");if(!c.getLogo()){r.addClass("sapSuiteTvNavNoLogo");}r.writeClasses();r.addStyle("width",c.getSidebarWidth());r.writeStyles();r.write(">");r.renderControl(c._getNavBar());r.write("</nav>");r.write("<aside");r.writeAttribute("id",c.getId()+"-headerContent");r.addClass("sapSuiteTvHeader");r.writeClasses();r.write(">");this.renderHeaderContent(r,c);r.write("</aside>");r.write("<div");r.writeAttribute("id",c.getId()+"-facetContent");r.addClass("sapSuiteTvFacet");r.writeClasses();r.write(">");this.renderFacetContent(r,c);r.write("</div>");if(c.getLogo()){r.write("<footer");r.writeAttribute("id",c.getId()+"-footer");r.addClass("sapSuiteTvLogo");r.writeClasses();r.addStyle("width",c.getSidebarWidth());r.writeStyles();r.write(">");r.write("<img");r.writeAttribute("id",c.getId()+"-logo");r.writeAttribute("role","presentation");r.writeAttributeEscaped("src",c.getLogo());r.addClass("sapSuiteTvLogoIcon");r.writeClasses();r.write("/>");r.write("</footer>");}r.write("</div>");};
sap.suite.ui.commons.ThreePanelThingViewerRenderer.renderHeader=function(r,c){var m=c.getMenuContent().length;r.write("<div");r.addClass("sapSuiteTvTitleBar");r.writeClasses();r.write(">");if(c.getIcon()){r.write("<img");r.writeAttribute("id",c.getId()+"-swatch");r.writeAttribute("role","presentation");r.writeAttributeEscaped("src",c.getIcon());r.addClass("sapSuiteTvTitleIcon");r.writeClasses();r.write("/>");}if(m>0){r.renderControl(c._oMenuButton);}r.write("<div");r.writeAttribute("role","heading");r.writeAttribute("aria-level",1);r.writeAttributeEscaped("title",c.getType());r.addClass("sapSuiteTvTitleType");r.addClass("sapSuiteTvTextCrop");r.writeClasses();r.write(">");r.writeEscaped(c.getType());r.write("</div>");r.write("<div");r.writeAttribute("role","heading");r.writeAttribute("aria-level",2);r.writeAttributeEscaped("title",c.getTitle());r.addClass("sapSuiteTvTitleFirst");r.writeClasses();r.write(">");r.writeEscaped(c.getTitle());r.write("</div>");r.write("<div");r.writeAttribute("role","heading");r.writeAttribute("aria-level",3);r.writeAttributeEscaped("title",c.getSubtitle());r.addClass("sapSuiteTvTitleSecond");r.addClass("sapSuiteTvTextCrop");r.writeClasses();r.write(">");r.writeEscaped(c.getSubtitle());r.write("</div>");r.write("</div>");this.renderFlyOutMenu(r,c);};
sap.suite.ui.commons.ThreePanelThingViewerRenderer.renderFacetContent=function(r,c){var f=c.getFacetContent();for(var i=0;i<f.length;i++){var g=f[i];r.write("<div");r.writeAttribute("role","form");if(g.getColspan()){r.addClass("sapUiUx3TVFacetThingGroupSpan");}else{r.addClass("sapUiUx3TVFacetThingGroup");}r.writeClasses();r.write(">");r.write("<div");r.writeAttributeEscaped("title",g.getTitle());r.addClass("sapUiUx3TVFacetThingGroupContentTitle");r.writeClasses();r.write(">");r.write("<span>");r.writeEscaped(g.getTitle());r.write("</span>");r.write("</div>");r.write("<div");r.addClass("sapUiUx3TVFacetThingGroupContent");r.writeClasses();r.write(">");var G=g.getContent();for(var j=0;j<G.length;j++){r.renderControl(G[j]);}r.write("</div>");r.write("</div>");}};
sap.suite.ui.commons.ThreePanelThingViewerRenderer.renderFlyOutMenu=function(r,c){r.write("<div");r.writeAttribute("id",c.getId()+"-menu-popup");r.writeAttribute("role","menu");r.addClass("sapSuiteTvPopupMenu");r.writeClasses();r.write(">");var m=c.getMenuContent();for(var i=0;i<m.length;i++){var M=m[i];M.addStyleClass("sapSuiteTvPopupMenuLink");r.renderControl(M);}r.write("</div>");};
