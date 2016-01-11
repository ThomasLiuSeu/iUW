/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var T={};T.render=function(r,t){t._createRows();r.write("<div");if(t._bAccMode){var a=[];if(t.getToolbar()){a.push(t.getToolbar().getId());}a.push(t.getId()+"-table");r.writeAttribute("aria-owns",a.join(" "));r.writeAttribute("aria-readonly","true");if(t.getTitle()){r.writeAttribute("aria-labelledby",t.getTitle().getId());}if(t.getSelectionMode()===sap.ui.table.SelectionMode.Multi){r.writeAttribute("aria-multiselectable","true");}}r.writeControlData(t);r.addClass("sapUiTable");r.addClass("sapUiTableSelMode"+t.getSelectionMode());if(t.getColumnHeaderVisible()){r.addClass("sapUiTableCHdr");}if(t.getSelectionMode()!==sap.ui.table.SelectionMode.None&&t.getSelectionBehavior()!==sap.ui.table.SelectionBehavior.RowOnly){r.addClass("sapUiTableRSel");}r.addClass("sapUiTableSelMode"+t.getSelectionMode());if(t.getNavigationMode()===sap.ui.table.NavigationMode.Scrollbar){r.addClass("sapUiTableVScr");}if(t.getEditable()){r.addClass("sapUiTableEdt");}r.addClass("sapUiTableShNoDa");if(t.getShowNoData()&&t._getRowCount()===0){r.addClass("sapUiTableEmpty");}if(t.getEnableGrouping()){r.addClass("sapUiTableGrouping");}r.writeClasses();if(t.getWidth()){r.addStyle("width",t.getWidth());}r.writeStyles();r.write(">");if(t.getTitle()){this.renderHeader(r,t,t.getTitle());}if(t.getToolbar()){this.renderToolbar(r,t,t.getToolbar());}if(t.getExtension()&&t.getExtension().length>0){this.renderExtensions(r,t,t.getExtension());}r.write("<div");r.addClass("sapUiTableCnt");r.writeClasses();r.writeAttribute("data-sap-ui-fastnavgroup","true");if(t._bAccMode){r.writeAttribute("aria-describedby",t.getId()+"-ariacount");}r.write(">");this.renderColHdr(r,t);this.renderTable(r,t);if(t._bAccMode){r.write("<span");r.writeAttribute("id",t.getId()+"-ariadesc");r.addStyle("position","absolute");r.addStyle("top","-20000px");r.writeStyles();r.write(">");r.write(t._oResBundle.getText("TBL_TABLE"));r.write("</span>");r.write("<span");r.writeAttribute("id",t.getId()+"-ariacount");r.addStyle("position","absolute");r.addStyle("top","-20000px");r.writeStyles();r.write(">");r.write("</span>");r.write("<span");r.writeAttribute("id",t.getId()+"-toggleedit");r.addStyle("position","absolute");r.addStyle("top","-20000px");r.writeStyles();r.write(">");r.write(t._oResBundle.getText("TBL_TOGGLE_EDIT_KEY"));r.write("</span>");r.write("<span");r.writeAttribute("id",t.getId()+"-selectrow");r.addStyle("position","absolute");r.addStyle("top","-20000px");r.writeStyles();r.write(">");r.write(t._oResBundle.getText("TBL_ROW_SELECT_KEY"));r.write("</span>");r.write("<span");r.writeAttribute("id",t.getId()+"-selectrowmulti");r.addStyle("position","absolute");r.addStyle("top","-20000px");r.writeStyles();r.write(">");r.write(t._oResBundle.getText("TBL_ROW_SELECT_MULTI_KEY"));r.write("</span>");r.write("<span");r.writeAttribute("id",t.getId()+"-deselectrow");r.addStyle("position","absolute");r.addStyle("top","-20000px");r.writeStyles();r.write(">");r.write(t._oResBundle.getText("TBL_ROW_DESELECT_KEY"));r.write("</span>");r.write("<span");r.writeAttribute("id",t.getId()+"-deselectrowmulti");r.addStyle("position","absolute");r.addStyle("top","-20000px");r.writeStyles();r.write(">");r.write(t._oResBundle.getText("TBL_ROW_DESELECT_MULTI_KEY"));r.write("</span>");}r.write("</div>");if(t.getNavigationMode()===sap.ui.table.NavigationMode.Paginator){r.write("<div");r.addClass("sapUiTablePaginator");r.writeClasses();r.write(">");if(!t._oPaginator){q.sap.require("sap.ui.commons.Paginator");t._oPaginator=new sap.ui.commons.Paginator(t.getId()+"-paginator");t._oPaginator.attachPage(q.proxy(t.onvscroll,t));}r.renderControl(t._oPaginator);r.write("</div>");}if(t.getFooter()){this.renderFooter(r,t,t.getFooter());}if(t.getVisibleRowCountMode()==sap.ui.table.VisibleRowCountMode.Interactive){this.renderVariableHeight(r,t);}r.write("</div>");};T.renderHeader=function(r,t,o){r.write("<div");r.addClass("sapUiTableHdr");r.writeClasses();if(t._bAccMode){r.writeAttribute("role","heading");}r.write(">");r.renderControl(o);r.write("</div>");};T.renderToolbar=function(r,t,o){r.write("<div");r.addClass("sapUiTableTbr");if(typeof o.getStandalone!=="function"){r.addClass("sapUiTableMTbr");}r.writeClasses();r.write(">");if(typeof o.getStandalone==="function"&&o.getStandalone()){o.setStandalone(false);}r.renderControl(o);r.write("</div>");};T.renderExtensions=function(r,t,e){for(var i=0,l=e.length;i<l;i++){this.renderExtension(r,t,e[i]);}};T.renderExtension=function(r,t,e){r.write("<div");r.addClass("sapUiTableExt");r.writeClasses();r.write(">");r.renderControl(e);r.write("</div>");};T.renderTable=function(r,t){r.write("<div");r.addClass("sapUiTableCCnt");r.writeClasses();r.write(">");r.write("<div");r.addClass("sapUiTableCtrlBefore");r.writeClasses();r.writeAttribute("tabindex","0");r.write("></div>");this.renderRowHdr(r,t);this.renderTableCtrl(r,t);this.renderVSb(r,t);r.write("</div>");this.renderHSb(r,t);};T.renderFooter=function(r,t,f){r.write("<div");r.addClass("sapUiTableFtr");r.writeClasses();r.write(">");r.renderControl(f);r.write("</div>");};T.renderVariableHeight=function(r,t){r.write('<div id="'+t.getId()+'-sb" tabIndex="-1"');r.addClass("sapUiTableSplitterBar");r.addStyle("height","5px");r.writeClasses();r.writeStyles();r.write(">");r.write("</div>");};T.renderColHdr=function(r,t){r.write("<div");r.addClass("sapUiTableColHdrCnt");r.writeClasses();if(t.getColumnHeaderHeight()>0){r.addStyle("height",(t.getColumnHeaderHeight()*t._getHeaderRowCount())+"px");}if(t._bAccMode&&(t.getSelectionMode()===sap.ui.table.SelectionMode.None||t.getSelectionBehavior()===sap.ui.table.SelectionBehavior.RowOnly)){r.writeAttribute("role","row");}r.writeStyles();r.write(">");this.renderColRowHdr(r,t);var c=t.getColumns();if(t.getFixedColumnCount()>0){r.write("<div");r.addClass("sapUiTableColHdrFixed");r.writeClasses();r.write(">");for(var h=0;h<t._getHeaderRowCount();h++){r.write("<div");r.addClass("sapUiTableColHdr");r.writeClasses();r.addStyle("min-width",t._getColumnsWidth(0,t.getFixedColumnCount())+"px");r.writeStyles();r.write(">");var s=1;for(var i=0,l=t.getFixedColumnCount();i<l;i++){if(c[i]&&c[i].shouldRender()){if(s<=1){this.renderCol(r,t,c[i],i,h);var H=c[i].getHeaderSpan();if(q.isArray(H)){s=c[i].getHeaderSpan()[h]+1;}else{s=c[i].getHeaderSpan()+1;}}else{this.renderCol(r,t,c[i],i,h,true);}if(h==0){this.renderColRsz(r,t,c[i],i);}s--;}}r.write("<p style=\"clear: both;\"></p>");r.write("</div>");}r.write("</div>");}r.write("<div");r.addClass("sapUiTableColHdrScr");r.writeClasses();if(t.getFixedColumnCount()>0){if(t._bRtlMode){r.addStyle("margin-right","0");}else{r.addStyle("margin-left","0");}r.writeStyles();}r.write(">");for(var h=0;h<t._getHeaderRowCount();h++){r.write("<div");r.addClass("sapUiTableColHdr");r.writeClasses();r.addStyle("min-width",t._getColumnsWidth(t.getFixedColumnCount(),c.length)+"px");r.writeStyles();r.write(">");var s=1;for(var i=t.getFixedColumnCount(),l=c.length;i<l;i++){if(c[i].shouldRender()){if(s<=1){this.renderCol(r,t,c[i],i,h);var H=c[i].getHeaderSpan();if(q.isArray(H)){s=c[i].getHeaderSpan()[h]+1;}else{s=c[i].getHeaderSpan()+1;}}else{this.renderCol(r,t,c[i],i,h,true);}if(h==0){this.renderColRsz(r,t,c[i],i);}s--;}}r.write("<p style=\"clear: both;\"></p>");r.write("</div>");}r.write("</div>");r.write("</div>");};T.renderColRowHdr=function(r,t){r.write("<div");r.writeAttribute("id",t.getId()+"-selall");var s=t.getSelectionMode();if((s=="Multi"||s=="MultiToggle")&&t.getEnableSelectAll()){r.writeAttributeEscaped("title",t._oResBundle.getText("TBL_SELECT_ALL"));if(t._getSelectableRowCount()==0||t._getSelectableRowCount()!==t.getSelectedIndices().length){r.addClass("sapUiTableSelAll");}r.addClass("sapUiTableSelAllEnabled");}r.addClass("sapUiTableColRowHdr");r.writeClasses();if(t._bAccMode){r.writeAttribute("tabindex","-1");r.writeAttributeEscaped("aria-label",t._oResBundle.getText("TBL_SELECT_ALL_KEY"));}r.write(">");if(t.getSelectionMode()!==sap.ui.table.SelectionMode.Single){r.write("<div");r.addClass("sapUiTableColRowHdrIco");r.writeClasses();if(t.getColumnHeaderHeight()>0){r.addStyle("height",t.getColumnHeaderHeight()+"px");}r.write(">");r.write("</div>");}r.write("</div>");};T.renderCol=function(r,t,c,i,h,I){var l;if(c.getMultiLabels().length>0){l=c.getMultiLabels()[h];}else if(h==0){l=c.getLabel();}r.write("<div");if(h===0){r.writeElementData(c);}else{r.writeAttribute('id',c.getId()+"_"+h);}r.writeAttribute('data-sap-ui-colid',c.getId());r.writeAttribute("data-sap-ui-colindex",i);if(t._bAccMode){if(!!sap.ui.Device.browser.internet_explorer){r.writeAttribute("role","columnheader");}r.writeAttribute("aria-haspopup","true");r.writeAttribute("tabindex","-1");}r.addClass("sapUiTableCol");r.writeClasses();r.addStyle("width",c.getWidth());if(t.getColumnHeaderHeight()>0){r.addStyle("height",t.getColumnHeaderHeight()+"px");}if(I){r.addStyle("display","none");}r.writeStyles();var s=c.getTooltip_AsString();if(s){r.writeAttributeEscaped("title",s);}r.write("><div");r.addClass("sapUiTableColCell");r.writeClasses();var H=this.getHAlign(c.getHAlign(),t._bRtlMode);if(H){r.addStyle("text-align",H);}r.writeStyles();r.write(">");r.write("<div id=\""+c.getId()+"-icons\" class=\"sapUiTableColIcons\"></div>");if(l){r.renderControl(l);}r.write("</div></div>");};T.renderColRsz=function(r,t,c,i){if(c.getResizable()){r.write("<div");r.writeAttribute("id",c.getId()+"-rsz");r.writeAttribute("data-sap-ui-colindex",i);r.writeAttribute("tabindex","-1");r.addClass("sapUiTableColRsz");r.writeClasses();r.addStyle("left",t._bRtlMode?"99000px":"-99000px");r.writeStyles();r.write("></div>");}};T.renderRowHdr=function(r,t){r.write("<div");r.addClass("sapUiTableRowHdrScr");r.writeClasses();r.write(">");for(var a=0,c=t.getRows().length;a<c;a++){this.renderRowHdrRow(r,t,t.getRows()[a],a);}r.write("</div>");};T.renderRowHdrRow=function(r,t,R,i){r.write("<div");r.writeAttribute("id",t.getId()+"-rowsel"+i);r.writeAttribute("data-sap-ui-rowindex",i);r.addClass("sapUiTableRowHdr");if(R._bHidden){r.addClass("sapUiTableRowHidden");}r.writeClasses();if(t.getRowHeight()>0){r.addStyle("height",t.getRowHeight()+"px");}if(t._bAccMode){var c=[];q.each(R.getCells(),function(I,C){c.push(R.getId()+"-col"+I);});if(t.getSelectionMode()===sap.ui.table.SelectionMode.Multi){r.writeAttribute("aria-selected","false");}if(t.getSelectionMode()!==sap.ui.table.SelectionMode.None){r.writeAttributeEscaped("title",t._oResBundle.getText("TBL_ROW_SELECT"));if(t.getSelectionMode()===sap.ui.table.SelectionMode.Multi&&t._oSelection.getSelectedIndices().length>1){r.writeAttributeEscaped("aria-label",t._oResBundle.getText("TBL_ROW_SELECT_MULTI_KEY"));}else{r.writeAttributeEscaped("aria-label",t._oResBundle.getText("TBL_ROW_SELECT_KEY"));}}r.writeAttribute("tabindex","-1");}r.writeStyles();r.write("></div>");};T.renderTableCtrl=function(r,t){if(t.getFixedColumnCount()>0){r.write("<div");r.addClass("sapUiTableCtrlScrFixed");r.writeClasses();r.write(">");this.renderTableControl(r,t,true);r.write("</div>");}r.write("<div");r.addClass("sapUiTableCtrlScr");r.writeClasses();if(t.getFixedColumnCount()>0){if(t._bRtlMode){r.addStyle("margin-right","0");}else{r.addStyle("margin-left","0");}r.writeStyles();}r.write(">");r.write("<div");r.addClass("sapUiTableCtrlCnt");r.writeClasses();r.write(">");this.renderTableControl(r,t,false);r.write("</div>");r.write("<div");r.addClass("sapUiTableCtrlAfter");r.writeClasses();r.writeAttribute("tabindex","0");r.write("></div>");r.write("</div>");r.write("<div");r.addClass("sapUiTableCtrlEmpty");r.writeClasses();r.writeAttribute("tabindex","0");r.write(">");if(t.getNoData()&&t.getNoData()instanceof sap.ui.core.Control){r.renderControl(t.getNoData());}else{r.write("<span");r.addClass("sapUiTableCtrlEmptyMsg");r.writeClasses();r.write(">");if(typeof t.getNoData()==="string"||t.getNoData()instanceof String){r.writeEscaped(t.getNoData());}else if(t.getNoDataText()){r.writeEscaped(t.getNoDataText());}else{r.writeEscaped(t._oResBundle.getText("TBL_NO_DATA"));}r.write("</span>");}r.write("</div>");};T.renderTableControl=function(r,t,f){var s,e;if(f){s=0;e=t.getFixedColumnCount();}else{s=t.getFixedColumnCount();e=t.getColumns().length;}var F=t.getFixedRowCount();var i=t.getFixedBottomRowCount();var R=t.getRows();if(F>0){this.renderTableControlCnt(r,t,f,s,e,true,false,0,F);}this.renderTableControlCnt(r,t,f,s,e,false,false,F,R.length-i);if(i>0){this.renderTableControlCnt(r,t,f,s,e,false,true,R.length-i,R.length);}};T.renderTableControlCnt=function(r,t,f,s,e,F,b,S,E){r.write("<table");var i=t.getId()+"-table";if(f){i+="-fixed";r.addClass("sapUiTableCtrlFixed");}else{r.addClass("sapUiTableCtrlScroll");}if(F){i+="-fixrow";r.addClass("sapUiTableCtrlRowFixed");}else if(b){i+="-fixrow-bottom";r.addClass("sapUiTableCtrlRowFixedBottom");}else{r.addClass("sapUiTableCtrlRowScroll");}r.writeAttribute("id",i);if(t._bAccMode){r.writeAttribute("role","grid");}r.addClass("sapUiTableCtrl");r.writeClasses();r.addStyle("min-width",t._getColumnsWidth(s,e)+"px");if(f&&(!!sap.ui.Device.browser.firefox||!!sap.ui.Device.browser.chrome||!!sap.ui.Device.browser.safari)){r.addStyle("width",t._getColumnsWidth(s,e)+"px");}r.writeStyles();r.write(">");r.write("<thead>");r.write("<tr");r.addClass("sapUiTableCtrlCol");if(S==0){r.addClass("sapUiTableCtrlFirstCol");}r.writeClasses();r.write(">");var c=t.getColumns();if(t.getSelectionMode()!==sap.ui.table.SelectionMode.None&&t.getSelectionBehavior()!==sap.ui.table.SelectionBehavior.RowOnly){r.write("<th");r.addStyle("width","0px");r.writeStyles();if(t._bAccMode&&S==0){r.writeAttribute("role","columnheader");r.writeAttribute("scope","col");r.writeAttribute("id",t.getId()+"_colsel");}r.write("></th>");}else{if(c.length===0){r.write("<th></th>");}}for(var a=s,d=e;a<d;a++){var C=c[a];if(C&&C.shouldRender()){r.write("<th");r.addStyle("width",C.getWidth());r.writeStyles();if(S==0){if(t._bAccMode){r.writeAttribute("aria-owns",C.getId());r.writeAttribute("aria-labelledby",C.getId());r.writeAttribute("role","columnheader");r.writeAttribute("scope","col");r.writeAttribute("id",t.getId()+"_col"+a);}}r.writeAttribute("data-sap-ui-headcolindex",a);r.write(">");if(S==0){if(C.getMultiLabels().length>0){r.renderControl(C.getMultiLabels()[0]);}else{r.renderControl(C.getLabel());}}r.write("</th>");}}if(!f&&t._hasOnlyFixColumnWidths()&&c.length>0){r.write("<th></th>");}r.write("</tr>");r.write("</thead>");r.write("<tbody>");var R=t.getRows();for(var g=S,d=E;g<d;g++){this.renderTableRow(r,t,R[g],g,f,s,e,false);}r.write("</tbody>");r.write("</table>");};T.renderTableRow=function(r,t,R,i,f,s,e,F){r.write("<tr");r.addClass("sapUiTableTr");if(f){r.writeAttribute("id",R.getId()+"-fixed");}else{r.writeElementData(R);}if(R._bHidden){r.addClass("sapUiTableRowHidden");}if(i%2===0){r.addClass("sapUiTableRowEven");}else{r.addClass("sapUiTableRowOdd");}r.writeClasses();r.writeAttribute("data-sap-ui-rowindex",i);if(t.getRowHeight()>0){r.addStyle("height",t.getRowHeight()+"px");}r.writeStyles();if(t._bAccMode){r.writeAttribute("role","row");if(t.getSelectionMode()===sap.ui.table.SelectionMode.Multi){r.writeAttribute("aria-selected","false");}}r.write(">");var c=R.getCells();if(t.getSelectionMode()!==sap.ui.table.SelectionMode.None&&t.getSelectionBehavior()!==sap.ui.table.SelectionBehavior.RowOnly){r.write("<td");if(t._bAccMode){r.writeAttribute("role","gridcell");r.writeAttribute("headers",t.getId()+"_colsel");r.writeAttribute("aria-owns",t.getId()+"-rowsel"+i);if(t.getSelectionMode()===sap.ui.table.SelectionMode.Multi){r.writeAttribute("aria-selected","false");}}r.write(">");if(t._bAccMode){r.write("<div");r.addClass("sapUiTableAriaRowSel");r.writeClasses();r.write(">");r.write(t._oResBundle.getText("TBL_ROW_SELECT_KEY"));r.write("</div>");}r.write("</td>");}else{if(c.length===0){r.write("<td");if(t._bAccMode){r.writeAttribute("role","gridcell");r.writeAttribute("headers",t.getId()+"_colsel");r.writeAttribute("aria-owns",t.getId()+"-rowsel"+i);if(t.getSelectionMode()===sap.ui.table.SelectionMode.Multi){r.writeAttribute("aria-selected","false");}}r.write(">");if(t._bAccMode){r.write("<div");r.addClass("sapUiTableAriaRowSel");r.writeClasses();r.write(">");r.write(t._oResBundle.getText("TBL_ROW_SELECT_KEY"));r.write("</div>");}r.write("</td>");}}for(var a=0,b=c.length;a<b;a++){this.renderTableCell(r,t,R,c[a],a,f,s,e);}if(!f&&t._hasOnlyFixColumnWidths()&&c.length>0){r.write("<td></td>");}r.write("</tr>");};T.renderTableCell=function(r,t,R,c,C,f,s,e){var a=c.data("sap-ui-colindex");var o=t.getColumns()[a];if(o.shouldRender()&&s<=a&&e>a){r.write("<td");var I=R.getId()+"-col"+C;r.writeAttribute("id",I);r.writeAttribute("tabindex","-1");if(t._bAccMode){r.writeAttribute("headers",t.getId()+"_col"+a);r.writeAttribute("role","gridcell");var l=t.getId()+"-ariadesc "+o.getId();var m=o.getMultiLabels().length;if(m>1){for(var i=1;i<m;i++){l+=" "+o.getId()+"_"+i;}}l+=" "+c.getId();r.writeAttribute("aria-labelledby",l);r.writeAttribute("aria-describedby",t.getId()+"-toggleedit");r.writeAttribute("aria-activedescendant",c.getId());if(t.getSelectionMode()===sap.ui.table.SelectionMode.Multi){r.writeAttribute("aria-selected","false");}}var h=this.getHAlign(o.getHAlign(),t._bRtlMode);if(h){r.addStyle("text-align",h);}r.writeStyles();var v=t._getVisibleColumns();if(v.length>0&&v[0]===o){r.addClass("sapUiTableTdFirst");}if(o.getGrouped()){r.addClass("sapUiTableTdGroup");}r.writeClasses();r.write("><div");r.addClass("sapUiTableCell");r.writeClasses();if(t.getRowHeight()&&t.getVisibleRowCountMode()==sap.ui.table.VisibleRowCountMode.Auto){r.addStyle("max-height",t.getRowHeight()+"px");}r.writeStyles();r.write(">");this.renderTableCellControl(r,t,c,C);r.write("</div></td>");}};T.renderTableCellControl=function(r,t,c,C){r.renderControl(c);};T.renderVSb=function(r,t){r.write("<div");r.addClass("sapUiTableVSb");r.writeClasses();r.write(">");r.renderControl(t._oVSb);r.write("</div>");};T.renderHSb=function(r,t){r.write("<div");r.addClass("sapUiTableHSb");r.writeClasses();r.write(">");r.renderControl(t._oHSb);r.write("</div>");};T.getHAlign=function(h,r){switch(h){case sap.ui.core.HorizontalAlign.Center:return"center";case sap.ui.core.HorizontalAlign.End:case sap.ui.core.HorizontalAlign.Right:return r?"left":"right";}return r?"right":"left";};return T;},true);
