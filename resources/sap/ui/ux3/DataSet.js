/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/core/ResizeHandler','./library'],function(q,C,R,l){"use strict";var D=C.extend("sap.ui.ux3.DataSet",{metadata:{library:"sap.ui.ux3",properties:{showToolbar:{type:"boolean",group:"Misc",defaultValue:true},showFilter:{type:"boolean",group:"Misc",defaultValue:true},showSearchField:{type:"boolean",group:"Misc",defaultValue:true},multiSelect:{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{items:{type:"sap.ui.ux3.DataSetItem",multiple:true,singularName:"item",bindable:"bindable"},views:{type:"sap.ui.ux3.DataSetView",multiple:true,singularName:"view"},filter:{type:"sap.ui.core.Control",multiple:true,singularName:"filter"},_viewSwitches:{type:"sap.ui.core.Control",multiple:true,singularName:"_viewSwitch",visibility:"hidden"},_toolbar:{type:"sap.ui.commons.Toolbar",multiple:false,visibility:"hidden"}},associations:{selectedView:{type:"sap.ui.ux3.DataSetView",multiple:false}},events:{selectionChanged:{parameters:{oldLeadSelectedIndex:{type:"int"},newLeadSelectedIndex:{type:"int"}}},search:{parameters:{query:{type:"string"}}}}}});D.prototype.init=function(){var t=this,T;q.sap.require("sap.ui.model.SelectionModel");this.selectionModel=new sap.ui.model.SelectionModel(sap.ui.model.SelectionModel.SINGLE_SELECTION);this._oSegBut=new sap.ui.commons.SegmentedButton();this._oSegBut.attachSelect(function(e){t.press(e);},t);this._oSegBut.show=false;this._oSearchField=new sap.ui.commons.SearchField(this.getId()+"-searchValue");this._oSearchField.setShowListExpander(false);this._oSearchField.setEnableListSuggest(false);this._oSearchField.setEnableFilterMode(true);this._oSearchField.setEnableClear(true);this._oSearchField.show=false;t=this;this._oSearchField.attachSearch(function(e){t.fireSearch(e.getParameters());});this.selectionModel.attachSelectionChanged(function(e){var o,n;var p=e.getParameters();if(p){n=p.leadIndex;o=p.oldIndex;}t.fireSelectionChanged({oldLeadSelectedIndex:o,newLeadSelectedIndex:n});q.sap.log.debug("Selection Change fired");});T=new sap.ui.commons.Toolbar();this._setToolbar(T);this._iShiftStart=null;};D.prototype.exit=function(){this._oSegBut.destroy();this._oSearchField.destroy();this.destroyAggregation("_toolbar");};D.prototype._prepareToolbar=function(){var v=this.getViews().length,t=this._getToolbar();if(v>1&&this._oSegBut.show==false){t.insertItem(this._oSegBut,0);this._oSegBut.show=true;}else if(v<=1&&this._oSegBut.show){t.removeItem(this._oSegBut);this._oSegBut.show=false;}if(this.getShowSearchField()&&this._oSearchField.show==false){t.insertRightItem(this._oSearchField,t.getRightItems().length);this._oSearchField.show=true;}else if(!this.getShowSearchField()&&this._oSearchField.show==true){t.removeRightItem(this._oSearchField);this._oSearchField.show=false;}};D.prototype.press=function(e,s){var b=e.getParameters().selectedButtonId,v=b.substring(b.lastIndexOf('-')+1),o=sap.ui.getCore().byId(this.getSelectedView());o.exitView(this.getItems());this.setSelectedView(v);};D.prototype.filter=function(){this.fireFilter({filterValue:this.getFilterValue()});};D.prototype.sort=function(){this.fireSort();};D.prototype.addSelectionInterval=function(i,I){this.selectionModel.addSelectionInterval(i,I);return this;};D.prototype.setSelectionInterval=function(i,I){this.selectionModel.setSelectionInterval(i,I);return this;};D.prototype.removeSelectionInterval=function(i,I){this.selectionModel.removeSelectionInterval(i,I);return this;};D.prototype.getSelectedIndex=function(){return this.selectionModel.getLeadSelectedIndex();};D.prototype.getSelectedIndices=function(){return this.selectionModel.getSelectedIndices()||[];};D.prototype.clearSelection=function(){this.selectionModel.clearSelection();return this;};D.prototype.selectItem=function(e){var p=e.getParameters(),i=e.getParameters().itemId,I=sap.ui.getCore().byId(i),a=this.getItems(),b=q.inArray(I,a),o=this.getLeadSelection();if(!this.getMultiSelect()){if(o==b&&!p.shift){this.setLeadSelection(-1);}else{this.setLeadSelection(b);}this._iShiftStart=null;}else{if(p.ctrl){if(!this.isSelectedIndex(b)){this.addSelectionInterval(b,b);}else{this.removeSelectionInterval(b,b);}if(this._iShiftStart>=0){this._iShiftStart=b;}}if(p.shift){if(!this._iShiftStart&&this._iShiftStart!==0){this._iShiftStart=o;}if(this._iShiftStart>=0&&p.ctrl){this.addSelectionInterval(this._iShiftStart,b);}else if(this._iShiftStart>=0&!p.ctrl){this.setSelectionInterval(this._iShiftStart,b);}else{this.setLeadSelection(b);this._iShiftStart=b;}}if(!p.shift&&!p.ctrl){if(o==b&&b!=this._iShiftStart){this.setLeadSelection(-1);}else{this.setLeadSelection(b);}this._iShiftStart=null;}}};D.prototype.prepareRendering=function(){var v,V=this.getViews().length;if(V==0){return;}this._prepareToolbar();if(this._bDirty){v=sap.ui.getCore().byId(this.getSelectedView());if(v.exitView){v.exitView(this.getItems());}if(v.initView){v.initView(this.getItems());}this._bDirty=false;}};D.prototype.getLeadSelection=function(){return this.selectionModel.getLeadSelectedIndex();};D.prototype.setLeadSelection=function(i){this.selectionModel.setLeadSelectedIndex(i);};D.prototype.isSelectedIndex=function(i){return(this.selectionModel.isSelectedIndex(i));};D.prototype.getSelectedItemId=function(i){return this.getItems()[i].getId();};D.prototype.createViewSwitch=function(v,i){var V;if(v.getIcon()){V=new sap.ui.commons.Button({id:this.getId()+"-view-"+v.getId(),lite:true,icon:v.getIcon(),iconHovered:v.getIconHovered(),iconSelected:v.getIconSelected()});}else if(v.getName()){V=new sap.ui.commons.Button({id:this.getId()+"-view-"+v.getId(),text:v.getName(),lite:true});}else{V=new sap.ui.commons.Button({id:this.getId()+"-view-"+v.getId(),text:v.getId(),lite:true});}V._viewIndex=i;return V;};D.prototype._rerenderToolbar=function(){var $=this.$("toolbar");this._prepareToolbar();if($.length>0){var r=sap.ui.getCore().createRenderManager();sap.ui.ux3.DataSetRenderer.renderToolbar(r,this);r.flush($[0]);r.destroy();}};D.prototype._rerenderFilter=function(){var $=this.$("filter");if($.length>0){var r=sap.ui.getCore().createRenderManager();sap.ui.ux3.DataSetRenderer.renderFilterArea(r,this);r.flush($[0]);if(this.getShowFilter()){$.removeClass("noPadding");}else{$.addClass("noPadding");}r.destroy();}};D.prototype.setMultiSelect=function(m){this.clearSelection();if(!m){this.setProperty("multiSelect",false);if(!!this.selectionModel){this.selectionModel.setSelectionMode(sap.ui.model.SelectionModel.SINGLE_SELECTION);}}else{this.setProperty("multiSelect",true);if(!!this.selectionModel){this.selectionModel.setSelectionMode(sap.ui.model.SelectionModel.MULTI_SELECTION);}}return this;};D.prototype.removeItem=function(i){var r=this.removeAggregation("items",i,true);if(r){r.detachSelected(this.selectItem,this);r.destroyAggregation("_template",true);this._bDirty=true;}return r;};D.prototype.removeAllItems=function(){var I=this.getItems(),r;q.each(I,function(i,o){o.destroyAggregation("_template",true);o.detachSelected(this.selectItem,this);});r=this.removeAllAggregation("items");this._bDirty=true;return r;};D.prototype.destroyItems=function(){var r=this.destroyAggregation("items");this._bDirty=true;return r;};D.prototype.addItem=function(i){this.addAggregation("items",i,true);i.attachSelected(this.selectItem,this);this._bDirty=true;return this;};D.prototype.insertItem=function(i,I){this.insertAggregation("items",i,I,true);i.attachSelected(this.selectItem,this);this._bDirty=true;return this;};D.prototype.setFilterValue=function(f){this.setProperty("filterValue",f,true);return this;};D.prototype.getFilterValue=function(){return this.getProperty("filterValue");};D.prototype.insertView=function(v,i){var V=this.createViewSwitch(v,i,true);if(!this.getSelectedView()){this.setSelectedView(v);}this.insertAggregation("views",v,i);this._oSegBut.insertButton(V,i);this._rerenderToolbar();return this;};D.prototype.addView=function(v){var i=this.getViews().length,V=this.createViewSwitch(v,i);if(!this.getSelectedView()){this.setSelectedView(v);}this.addAggregation("views",v,true);this._oSegBut.addButton(V);this._rerenderToolbar();return this;};D.prototype.removeView=function(v){var r=this.removeAggregation("views",v,true);if(r){if(this.getSelectedView()==r.getId()){this.setSelectedView(this.getViews()[0]);this._bDirty=true;r.invalidate();}else{this._rerenderToolbar();}this._oSegBut.removeButton(this.getId()+"-view-"+r.getId()).destroy();}return r;};D.prototype.destroyViews=function(){this._oSegBut.destroyButtons();this.destroyAggregation("views");return this;};D.prototype.removeAllViews=function(){var r=this.removeAllAggregation("views");this._oSegBut.destroyButtons();return r;};D.prototype.setEnableSorting=function(e){this.setProperty("enableSorting",e,true);this._rerenderToolbar();return this;};D.prototype.setEnableFiltering=function(e){this.setProperty("enableFiltering",e,true);this._rerenderToolbar();return this;};D.prototype.setSelectedView=function(v){var o=this.getSelectedView();this.setAssociation("selectedView",v);if(o!=this.getSelectedView()){this._bDirty=true;}if(this.getId()+"-view-"+this.getSelectedView()!==this._oSegBut.getSelectedButton()){this._oSegBut.setSelectedButton(this.getId()+"-view-"+this.getSelectedView());}return this;};D.prototype.addToolbarItem=function(t){this._getToolbar().addItem(t);this._rerenderToolbar();};D.prototype.removeToolbarItem=function(t){this._getToolbar().removeItem(t);this._rerenderToolbar();};D.prototype.setShowToolbar=function(s){this.setProperty("showToolbar",s,true);this._rerenderToolbar();};D.prototype.setShowFilter=function(s){this.setProperty("showFilter",s,true);this._rerenderFilter();};D.prototype.setShowSearchField=function(s){this.setProperty("showSearchField",s,true);this._rerenderToolbar();};D.prototype._setToolbar=function(t){this.setAggregation("_toolbar",t,true);this._rerenderToolbar();};D.prototype._getToolbar=function(){return this.getAggregation("_toolbar");};D.prototype.refreshItems=function(){var b=this.getBinding("items"),s=sap.ui.getCore().byId(this.getSelectedView());b.bUseExtendedChangeDetection=true;if(s&&s.getItemCount&&s.getItemCount()){var i=Math.max(s.getItemCount(),this.getItems().length);if(i){b.getContexts(0,i);}else{b.getContexts();}}else{b.getContexts();}};D.prototype.updateItems=function(c){var b=this.mBindingInfos["items"],a=this.getMetadata().getAggregation("items"),s=sap.ui.getCore().byId(this.getSelectedView()),B=b.binding,f=b.factory,o,I,d,e,t=this,g=[];B.bUseExtendedChangeDetection=true;if(s&&s.getItemCount&&s.getItemCount()){var h=Math.max(s.getItemCount(),this.getItems().length);if(h){g=B.getContexts(0,h);}else{g=B.getContexts();}}else{g=B.getContexts();}if(g.diff&&c){var j=g.diff;for(var i=0;i<j.length;i++){I=this.getItems();e=j[i].index;if(j[i].type==="delete"){d=I[e];j[i].item=d;this.removeItem(d);}else if(g.diff[i].type==="insert"){d=f("",g[e]);d.setBindingContext(g[e],b.model);j[i].item=d;this.insertItem(d,e);}}if(s&&s.updateView){s.updateView(j);}}else{this[a._sDestructor]();q.each(g,function(e,k){var m=t.getId()+"-"+e;o=f(m,k);o.setBindingContext(k,b.model);t[a._sMutator](o);});}};return D;},true);
