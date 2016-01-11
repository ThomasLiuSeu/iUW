/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.ProcessFlowConnectionRenderer");sap.suite.ui.commons.ProcessFlowConnectionRenderer={};
sap.suite.ui.commons.ProcessFlowConnectionRenderer.render=function(r,c){var a=c._traverseConnectionData();var z=c.getZoomLevel();r.write("<div id = \""+c.getId()+"\">");if(a.hasOwnProperty("left")&&a.left.draw&&a.hasOwnProperty("right")&&a.right.draw&&a.hasOwnProperty("top")&&!a.top.draw&&a.hasOwnProperty("bottom")&&!a.bottom.draw){r.write("<div");r.addClass("boxWideWidth");switch(z){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:r.addClass("boxTopZoom1Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:r.addClass("boxTopZoom3Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:r.addClass("boxTopZoom4Height");break;default:r.addClass("boxTopZoom2Height");}r.writeClasses();r.write(">");r.write("</div>");r.write("<div");if(a.arrow){r.addClass("parentPosition");switch(z){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:r.addClass("boxWideArrowZoom1Width");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:r.addClass("boxWideArrowZoom3Width");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:r.addClass("boxWideArrowZoom4Width");break;default:r.addClass("boxWideArrowZoom2Width");}}else{r.addClass("boxWideWidth");}r.addClass("boxMiddleBorderHeight");r.addClass("borderBottom");if(a.right.state==="Planned"){r.addClass("borderBottomStatePlanned");}else{r.addClass("borderBottomStateCreated");}if(a.right.display==="Highlighted"){r.addClass("borderBottomDisplayHighlighted");r.addClass("displayHighlighted");}else if(a.right.display==="Dimmed"){r.addClass("borderBottomDisplayDimmed");r.addClass("displayDimmed");}else{r.addClass("borderBottomDisplayRegular");r.addClass("displayRegular");}r.writeClasses();r.write(">");if(a.arrow){r.write("<div");r.addClass("arrowRight");if(a.right.display==="Highlighted"){r.addClass("borderLeftDisplayHighlighted");}else if(a.right.display==="Dimmed"){r.addClass("borderLeftDisplayDimmed");}else{r.addClass("borderLeftDisplayRegular");}r.writeClasses();r.write(">");r.write("</div>");}r.write("</div>");}else if(a.hasOwnProperty("left")&&!a.left.draw&&a.hasOwnProperty("right")&&!a.right.draw&&a.hasOwnProperty("top")&&a.top.draw&&a.hasOwnProperty("bottom")&&a.bottom.draw){r.write("<div");r.addClass("floatLeft");switch(z){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:r.addClass("boxZoom1Width");r.addClass("boxWideZoom1Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:r.addClass("boxZoom3Width");r.addClass("boxWideZoom3Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:r.addClass("boxZoom4Width");r.addClass("boxWideZoom4Height");break;default:r.addClass("boxZoom2Width");r.addClass("boxWideZoom2Height");}r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("floatLeft");r.addClass("boxMiddleBorderWidth");switch(z){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:r.addClass("boxWideZoom1Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:r.addClass("boxWideZoom3Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:r.addClass("boxWideZoom4Height");break;default:r.addClass("boxWideZoom2Height");}r.addClass("borderLeft");if(a.top.state==="Planned"){r.addClass("borderLeftStatePlanned");}else{r.addClass("borderLeftStateCreated");}if(a.top.display==="Highlighted"){r.addClass("borderLeftDisplayHighlighted");r.addClass("displayHighlighted");}else if(a.top.display==="Dimmed"){r.addClass("borderLeftDisplayDimmed");r.addClass("displayDimmed");}else{r.addClass("borderLeftDisplayRegular");r.addClass("displayRegular");}r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("floatClear");r.writeClasses();r.write(">");r.write("</div>");}else{r.write("<div");r.addClass("floatLeft");switch(z){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:r.addClass("boxZoom1Width");r.addClass("boxTopZoom1Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:r.addClass("boxZoom3Width");r.addClass("boxTopZoom3Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:r.addClass("boxZoom4Width");r.addClass("boxTopZoom4Height");break;default:r.addClass("boxZoom2Width");r.addClass("boxTopZoom2Height");}r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("floatLeft");switch(z){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:r.addClass("boxTopZoom1Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:r.addClass("boxTopZoom3Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:r.addClass("boxTopZoom4Height");break;default:r.addClass("boxTopZoom2Height");}if(a.hasOwnProperty("top")&&a.top.draw){r.addClass("boxMiddleBorderWidth");r.addClass("borderLeft");if(a.top.state==="Planned"){r.addClass("borderLeftStatePlanned");}else{r.addClass("borderLeftStateCreated");}if(a.top.display==="Highlighted"){r.addClass("borderLeftDisplayHighlighted");r.addClass("displayHighlighted");}else if(a.top.display==="Dimmed"){r.addClass("borderLeftDisplayDimmed");r.addClass("displayDimmed");}else{r.addClass("borderLeftDisplayRegular");r.addClass("displayRegular");}}else{r.addClass("boxMiddleWidth");}r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("floatClear");r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("floatLeft");switch(z){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:r.addClass("boxZoom1Width");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:r.addClass("boxZoom3Width");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:r.addClass("boxZoom4Width");break;default:r.addClass("boxZoom2Width");}if(a.hasOwnProperty("left")&&a.left.draw){r.addClass("boxMiddleBorderHeight");r.addClass("borderBottom");if(a.left.state==="Planned"){r.addClass("borderBottomStatePlanned");}else{r.addClass("borderBottomStateCreated");}if(a.left.display==="Highlighted"){r.addClass("borderBottomDisplayHighlighted");r.addClass("displayHighlighted");}else if(a.left.display==="Dimmed"){r.addClass("borderBottomDisplayDimmed");r.addClass("displayDimmed");}else{r.addClass("borderBottomDisplayRegular");r.addClass("displayRegular");}}else{r.addClass("boxMiddleHeight");}r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("floatLeft");r.addClass("boxMiddleWidth");r.addClass("boxMiddleBorderHeight");if((a.hasOwnProperty("left")&&a.left.draw)||(a.hasOwnProperty("right")&&a.right.draw)||(a.hasOwnProperty("top")&&a.top.draw)||(a.hasOwnProperty("bottom")&&a.bottom.draw)){r.addClass("borderBottom");r.addClass("borderBottomStateCreated");if(a.right.display==="Highlighted"||a.top.display==="Highlighted"||a.left.display==="Highlighted"||a.bottom.display==="Highlighted"){r.addClass("borderBottomDisplayHighlighted");r.addClass("displayHighlighted");}else if(a.right.display==="Dimmed"||a.top.display==="Dimmed"||a.left.display==="Dimmed"||a.bottom.display==="Dimmed"){r.addClass("borderBottomDisplayDimmed");r.addClass("displayDimmed");}else{r.addClass("borderBottomDisplayRegular");r.addClass("displayRegular");}}r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("floatLeft");if(a.arrow){r.addClass("parentPosition");switch(z){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:r.addClass("boxArrowZoom1Width");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:r.addClass("boxArrowZoom3Width");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:r.addClass("boxArrowZoom4Width");break;default:r.addClass("boxArrowZoom2Width");}}else{switch(z){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:r.addClass("boxZoom1Width");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:r.addClass("boxZoom3Width");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:r.addClass("boxZoom4Width");break;default:r.addClass("boxZoom2Width");}}if(a.hasOwnProperty("right")&&a.right.draw){r.addClass("boxMiddleBorderHeight");r.addClass("borderBottom");if(a.right.state==="Planned"){r.addClass("borderBottomStatePlanned");}else{r.addClass("borderBottomStateCreated");}if(a.right.display==="Highlighted"){r.addClass("borderBottomDisplayHighlighted");r.addClass("displayHighlighted");}else if(a.right.display==="Dimmed"){r.addClass("borderBottomDisplayDimmed");r.addClass("displayDimmed");}else{r.addClass("borderBottomDisplayRegular");r.addClass("displayRegular");}}else{r.addClass("boxMiddleHeight");}r.writeClasses();r.write(">");if(a.arrow){r.write("<div");r.addClass("arrowRight");if(a.hasOwnProperty("right")){if(a.right.display==="Highlighted"){r.addClass("borderLeftDisplayHighlighted");}else if(a.right.display==="Dimmed"){r.addClass("borderLeftDisplayDimmed");}else{r.addClass("borderLeftDisplayRegular");}}r.writeClasses();r.write(">");r.write("</div>");}r.write("</div>");r.write("<div");r.addClass("floatClear");r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("floatLeft");switch(z){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:r.addClass("boxZoom1Width");r.addClass("boxBottomZoom1Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:r.addClass("boxZoom3Width");r.addClass("boxBottomZoom3Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:r.addClass("boxZoom4Width");r.addClass("boxBottomZoom4Height");break;default:r.addClass("boxZoom2Width");r.addClass("boxBottomZoom2Height");}r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("floatLeft");switch(z){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:r.addClass("boxBottomZoom1Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:r.addClass("boxBottomZoom3Height");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:r.addClass("boxBottomZoom4Height");break;default:r.addClass("boxBottomZoom2Height");}if(a.hasOwnProperty("bottom")&&a.bottom.draw){r.addClass("boxMiddleBorderWidth");r.addClass("borderLeft");if(a.bottom.state==="Planned"){r.addClass("borderLeftStatePlanned");}else{r.addClass("borderLeftStateCreated");}if(a.bottom.display==="Highlighted"){r.addClass("borderLeftDisplayHighlighted");r.addClass("displayHighlighted");}else if(a.bottom.display==="Dimmed"){r.addClass("borderLeftDisplayDimmed");r.addClass("displayDimmed");}else{r.addClass("borderLeftDisplayRegular");r.addClass("displayRegular");}}else{r.addClass("boxMiddleWidth");}r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("floatClear");r.writeClasses();r.write(">");r.write("</div>");}r.write("</div>");};
