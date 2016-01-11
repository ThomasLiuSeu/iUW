/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/m/LinkRenderer'],function(q,L){"use strict";var S={};S.render=function(r,c){if(c.getIgnoreLinkRendering()){var R=c._getInnerControl();r.write("<div ");r.writeControlData(c);r.writeClasses();r.write(">");r.renderControl(R);r.write("</div>");}else{L.render.call("",r,c);}};return S;},true);
