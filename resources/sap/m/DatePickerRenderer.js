/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','./InputBaseRenderer'],function(q,R,I){"use strict";var D=R.extend(I);D.addOuterClasses=function(r,d){r.addClass("sapMDP");if(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version<10){r.addClass("sapMInputIE9");}};D.writeInnerContent=function(r,d){if(d.getEnabled()&&d.getEditable()){var c=[];var a={};a["id"]=d.getId()+"-icon";a["tabindex"]="-1";r.writeIcon("sap-icon://appointment-2",c,a);}var b=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");var t=b.getText("DATEPICKER_KEYBOARD");var s=b.getText("DATEPICKER_DATE_TYPE");var T=sap.ui.core.ValueStateSupport.enrichTooltip(d,d.getTooltip_AsString());if(T){t=T+". "+t;}t=s+". "+t;r.write('<SPAN id="'+d.getId()+'-Descr" style="visibility: hidden; display: none;">');r.writeEscaped(t);r.write('</SPAN>');};D.writeInnerValue=function(r,d){r.writeAttributeEscaped("value",d._formatValue(d.getDateValue()));};D.writeInnerAttributes=function(r,d){if(sap.ui.Device.browser.mobile){r.writeAttribute("readonly","readonly");}};D.writeAccessibilityState=function(r,d){var p={role:"combobox",multiline:false,autocomplete:"none",haspopup:true,owns:d.getId()+"-cal",describedby:{value:d.getId()+"-Descr",append:true}};if(d.getValueState()==sap.ui.core.ValueState.Error){p["invalid"]=true;}r.writeAccessibilityState(d,p);};return D;},true);
