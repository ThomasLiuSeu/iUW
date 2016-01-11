/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.designtime.evaluation.view.thresholdAndTargetBar");jQuery.sap.includeStyleSheet("../../resources/sap/suite/ui/smartbusiness/designtime/evaluation/view/thresholdAndTargetBar.css");sap.ui.core.Control.extend("sap.suite.ui.smartbusiness.designtime.evaluation.view.thresholdAndTargetBar",{metadata:{properties:{criticalLow:"int",warningLow:"int",target:"int",criticalHigh:"int",warningHigh:"int",goalType:"string"},},renderer:function(r,c){r.write("<div");r.writeControlData(c);r.addClass("thresholdAndTargetBar");r.writeClasses();r.write(">");switch(c.getGoalType()){case"MA":{c.getMaximizingThresholdBar(r,c);break;}case"MI":{c.getMinimizingThresholdBar(r,c);break;}case"RA":{c.getRangeThresholdBar(r,c);break;}}r.write("</div>");},generateBlock:function(r,c,a,w){r.write("<div");r.addClass("block");r.writeClasses();r.addStyle("width",w+"%");r.addStyle("background-color",a);r.writeStyles();r.write("></div>");},generateBar:function(r,c,a){r.write("<div");r.addClass("thresholdBar");r.addStyle("background-color",a);r.writeStyles();r.writeClasses();r.write("></div>");},generateThresholdDiv:function(r,c){r.write("<div");r.addClass("thresholdDiv");r.writeClasses();r.write(">");},generateEmptyDiv:function(r,c,w){r.write("<div");r.addStyle("width",w+"%");r.writeStyles();r.write("></div>");},generateNumbers:function(r,c,n){r.write("<div");r.write(">");r.writeEscaped(n);r.write("</div>");},getMaximizingThresholdBar:function(r,c){var t=c.getTarget();var a=c.getCriticalLow();var w=c.getWarningLow();var o=10;criticalLowSection=(a/t)*100;warningLowSection=((w-a)/t)*100;targetSection=100-(criticalLowSection+warningLowSection);c.generateThresholdDiv(r,c);c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')),criticalLowSection);c.generateBar(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')));c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')),warningLowSection);c.generateBar(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')));c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')),targetSection);c.generateBar(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')));c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')),o);r.write("</div>");c.generateThresholdDiv(r,c);c.generateEmptyDiv(r,c,criticalLowSection);c.generateNumbers(r,c,"1");c.generateEmptyDiv(r,c,warningLowSection);c.generateNumbers(r,c,"2");c.generateEmptyDiv(r,c,targetSection);c.generateNumbers(r,c,"3");c.generateEmptyDiv(r,c,o);r.write("</div>");},getMinimizingThresholdBar:function(r,c){var t=c.getTarget();var w=c.getWarningHigh();var a=c.getCriticalHigh();var o=10;targetSection=(t/a)*100;warningHighSection=((w-t)/a)*100;criticalHighSection=((a-w)/a)*100;c.generateThresholdDiv(r,c);c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')),o);c.generateBar(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')));c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')),targetSection);c.generateBar(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')));c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')),warningHighSection);c.generateBar(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')));c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')),criticalHighSection);r.write("</div>");c.generateThresholdDiv(r,c);c.generateEmptyDiv(r,c,o);c.generateNumbers(r,c,"1");c.generateEmptyDiv(r,c,targetSection);c.generateNumbers(r,c,"2");c.generateEmptyDiv(r,c,warningHighSection);c.generateNumbers(r,c,"3");c.generateEmptyDiv(r,c,criticalHighSection);r.write("</div>");},getRangeThresholdBar:function(r,c){var t=c.getTarget();var a=c.getCriticalLow();var w=c.getWarningLow();var b=c.getWarningHigh();var d=c.getCriticalHigh();var o=10;criticalLowSection=(a/d)*100;warningLowSection=((w-a)/d)*100;targetSection=(((t-w)/d)*100)/2;warningHighSection=((b-t)/d)*100;criticalHighSection=((d-b)/d)*100;c.generateThresholdDiv(r,c);c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')),criticalLowSection);c.generateBar(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')));c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')),warningLowSection);c.generateBar(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')));c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')),targetSection);c.generateBar(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')));c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')),targetSection);c.generateBar(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')));c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')),warningHighSection);c.generateBar(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')));c.generateBlock(r,c,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')),criticalHighSection);r.write("</div>");c.generateThresholdDiv(r,c);c.generateEmptyDiv(r,c,criticalLowSection);c.generateNumbers(r,c,"1");c.generateEmptyDiv(r,c,warningLowSection);c.generateNumbers(r,c,"2");c.generateEmptyDiv(r,c,targetSection);c.generateNumbers(r,c,"3");c.generateEmptyDiv(r,c,targetSection);c.generateNumbers(r,c,"4");c.generateEmptyDiv(r,c,warningHighSection);c.generateNumbers(r,c,"5");c.generateEmptyDiv(r,c,criticalHighSection);r.write("</div>");}});
