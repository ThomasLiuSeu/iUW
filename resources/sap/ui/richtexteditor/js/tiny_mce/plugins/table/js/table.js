tinyMCEPopup.requireLangPack();var action,orgTableWidth,orgTableHeight,dom=tinyMCEPopup.editor.dom;
function insertTable(){var f=document.forms[0];var i=tinyMCEPopup.editor,d=i.dom;var c=2,r=2,b=0,a=-1,e=-1,g,w,h,j,k,l,m;var o='',p,q;var s,t,u;tinyMCEPopup.restoreSelection();if(!AutoValidator.validate(f)){tinyMCEPopup.alert(AutoValidator.getErrorMessages(f).join('. ')+'.');return false;}q=d.getParent(i.selection.getNode(),'table');c=f.elements['cols'].value;r=f.elements['rows'].value;b=f.elements['border'].value!=""?f.elements['border'].value:0;a=f.elements['cellpadding'].value!=""?f.elements['cellpadding'].value:"";e=f.elements['cellspacing'].value!=""?f.elements['cellspacing'].value:"";g=getSelectValue(f,"align");l=getSelectValue(f,"tframe");m=getSelectValue(f,"rules");w=f.elements['width'].value;h=f.elements['height'].value;bordercolor=f.elements['bordercolor'].value;bgcolor=f.elements['bgcolor'].value;j=getSelectValue(f,"class");id=f.elements['id'].value;summary=f.elements['summary'].value;style=f.elements['style'].value;dir=f.elements['dir'].value;lang=f.elements['lang'].value;background=f.elements['backgroundimage'].value;k=f.elements['caption'].checked;s=tinyMCEPopup.getParam('table_cell_limit',false);t=tinyMCEPopup.getParam('table_row_limit',false);u=tinyMCEPopup.getParam('table_col_limit',false);if(u&&c>u){tinyMCEPopup.alert(i.getLang('table_dlg.col_limit').replace(/\{\$cols\}/g,u));return false;}else if(t&&r>t){tinyMCEPopup.alert(i.getLang('table_dlg.row_limit').replace(/\{\$rows\}/g,t));return false;}else if(s&&c*r>s){tinyMCEPopup.alert(i.getLang('table_dlg.cell_limit').replace(/\{\$cells\}/g,s));return false;}if(action=="update"){d.setAttrib(q,'cellPadding',a,true);d.setAttrib(q,'cellSpacing',e,true);if(!isCssSize(b)){d.setAttrib(q,'border',b);}else{d.setAttrib(q,'border','');}if(b==''){d.setStyle(q,'border-width','');d.setStyle(q,'border','');d.setAttrib(q,'border','');}d.setAttrib(q,'align',g);d.setAttrib(q,'frame',l);d.setAttrib(q,'rules',m);d.setAttrib(q,'class',j);d.setAttrib(q,'style',style);d.setAttrib(q,'id',id);d.setAttrib(q,'summary',summary);d.setAttrib(q,'dir',dir);d.setAttrib(q,'lang',lang);p=i.dom.select('caption',q)[0];if(p&&!k)p.parentNode.removeChild(p);if(!p&&k){p=q.ownerDocument.createElement('caption');if(!tinymce.isIE||tinymce.isIE11)p.innerHTML='<br data-mce-bogus="1"/>';q.insertBefore(p,q.firstChild);}if(w&&i.settings.inline_styles){d.setStyle(q,'width',w);d.setAttrib(q,'width','');}else{d.setAttrib(q,'width',w,true);d.setStyle(q,'width','');}d.setAttrib(q,'borderColor','');d.setAttrib(q,'bgColor','');d.setAttrib(q,'background','');if(h&&i.settings.inline_styles){d.setStyle(q,'height',h);d.setAttrib(q,'height','');}else{d.setAttrib(q,'height',h,true);d.setStyle(q,'height','');}if(background!='')q.style.backgroundImage="url('"+background+"')";else q.style.backgroundImage='';if(bordercolor!=""){q.style.borderColor=bordercolor;q.style.borderStyle=q.style.borderStyle==""?"solid":q.style.borderStyle;q.style.borderWidth=cssSize(b);}else q.style.borderColor='';q.style.backgroundColor=bgcolor;q.style.height=getCSSSize(h);i.addVisual();i.nodeChanged();i.execCommand('mceEndUndoLevel',false,{},{skip_undo:true});if(f.width.value!=orgTableWidth||f.height.value!=orgTableHeight)i.execCommand('mceRepaint');tinyMCEPopup.close();return true;}o+='<table';o+=makeAttrib('id',id);if(!isCssSize(b)){o+=makeAttrib('border',b);}o+=makeAttrib('cellpadding',a);o+=makeAttrib('cellspacing',e);o+=makeAttrib('data-mce-new','1');if(w&&i.settings.inline_styles){if(style)style+='; ';if(/^[0-9\.]+$/.test(w))w+='px';style+='width: '+w;}else o+=makeAttrib('width',w);o+=makeAttrib('align',g);o+=makeAttrib('frame',l);o+=makeAttrib('rules',m);o+=makeAttrib('class',j);o+=makeAttrib('style',style);o+=makeAttrib('summary',summary);o+=makeAttrib('dir',dir);o+=makeAttrib('lang',lang);o+='>';if(k){if(!tinymce.isIE||tinymce.isIE11)o+='<caption><br data-mce-bogus="1"/></caption>';else o+='<caption></caption>';}for(var y=0;y<r;y++){o+="<tr>";for(var x=0;x<c;x++){if(!tinymce.isIE||tinymce.isIE11)o+='<td><br data-mce-bogus="1"/></td>';else o+='<td></td>';}o+="</tr>";}o+="</table>";if(i.settings.fix_table_elements){var v='';i.focus();i.selection.setContent('<br class="_mce_marker" />');tinymce.each('h1,h2,h3,h4,h5,h6,p'.split(','),function(n){if(v)v+=',';v+=n+' ._mce_marker';});tinymce.each(i.dom.select(v),function(n){i.dom.split(i.dom.getParent(n,'h1,h2,h3,h4,h5,h6,p'),n);});d.setOuterHTML(d.select('br._mce_marker')[0],o);}else i.execCommand('mceInsertContent',false,o);tinymce.each(d.select('table[data-mce-new]'),function(n){var z=d.select('td,th',n);if(tinymce.isIE&&!tinymce.isIE11&&n.nextSibling==null){if(i.settings.forced_root_block)d.insertAfter(d.create(i.settings.forced_root_block),n);else d.insertAfter(d.create('br',{'data-mce-bogus':'1'}),n);}try{i.selection.setCursorLocation(z[0],0);}catch(A){}d.setAttrib(n,'data-mce-new','');});i.addVisual();i.execCommand('mceEndUndoLevel',false,{},{skip_undo:true});tinyMCEPopup.close();}
function makeAttrib(a,v){var f=document.forms[0];var b=f.elements[a];if(typeof(v)=="undefined"||v==null){v="";if(b)v=b.value;}if(v=="")return"";v=v.replace(/&/g,'&amp;');v=v.replace(/\"/g,'&quot;');v=v.replace(/</g,'&lt;');v=v.replace(/>/g,'&gt;');return' '+a+'="'+v+'"';}
function init(){tinyMCEPopup.resizeToInnerSize();document.getElementById('backgroundimagebrowsercontainer').innerHTML=getBrowserHTML('backgroundimagebrowser','backgroundimage','image','table');document.getElementById('backgroundimagebrowsercontainer').innerHTML=getBrowserHTML('backgroundimagebrowser','backgroundimage','image','table');document.getElementById('bordercolor_pickcontainer').innerHTML=getColorPickerHTML('bordercolor_pick','bordercolor');document.getElementById('bgcolor_pickcontainer').innerHTML=getColorPickerHTML('bgcolor_pick','bgcolor');var c=2,r=2,b=tinyMCEPopup.getParam('table_default_border','0'),a=tinyMCEPopup.getParam('table_default_cellpadding',''),d=tinyMCEPopup.getParam('table_default_cellspacing','');var e="",w="",h="",f="",g="",j="";var k="",s="",l="",m="",n="",o="",g="",f="",p="",q="";var t=tinyMCEPopup.editor,u=t.dom;var v=document.forms[0];var x=u.getParent(t.selection.getNode(),"table");tinymce.each("summary id rules dir style frame".split(" "),function(z){var A=tinyMCEPopup.dom.getParent(z,"tr")||tinyMCEPopup.dom.getParent("t"+z,"tr");if(A&&!tinyMCEPopup.editor.schema.isValid("table",z)){A.style.display='none';}});action=tinyMCEPopup.getWindowArg('action');if(!action)action=x?"update":"insert";if(x&&action!="insert"){var y=x.rows;var c=0;for(var i=0;i<y.length;i++)if(y[i].cells.length>c)c=y[i].cells.length;c=c;r=y.length;st=u.parseStyle(u.getAttrib(x,"style"));b=trimSize(getStyle(x,'border','borderWidth'));a=u.getAttrib(x,'cellpadding',"");d=u.getAttrib(x,'cellspacing',"");w=trimSize(getStyle(x,'width','width'));h=trimSize(getStyle(x,'height','height'));f=convertRGBToHex(getStyle(x,'bordercolor','borderLeftColor'));g=convertRGBToHex(getStyle(x,'bgcolor','backgroundColor'));e=u.getAttrib(x,'align',e);q=u.getAttrib(x,'frame');p=u.getAttrib(x,'rules');j=tinymce.trim(u.getAttrib(x,'class').replace(/mceItem.+/g,''));k=u.getAttrib(x,'id');s=u.getAttrib(x,'summary');l=u.serializeStyle(st);m=u.getAttrib(x,'dir');n=u.getAttrib(x,'lang');o=getStyle(x,'background','backgroundImage').replace(new RegExp("url\\(['\"]?([^'\"]*)['\"]?\\)",'gi'),"$1");v.caption.checked=x.getElementsByTagName('caption').length>0;orgTableWidth=w;orgTableHeight=h;action="update";v.insert.value=t.getLang('update');}addClassesToList('class',"table_styles");TinyMCE_EditableSelects.init();selectByValue(v,'align',e);selectByValue(v,'tframe',q);selectByValue(v,'rules',p);selectByValue(v,'class',j,true,true);v.cols.value=c;v.rows.value=r;v.border.value=b;v.cellpadding.value=a;v.cellspacing.value=d;v.width.value=w;v.height.value=h;v.bordercolor.value=f;v.bgcolor.value=g;v.id.value=k;v.summary.value=s;v.style.value=l;v.dir.value=m;v.lang.value=n;v.backgroundimage.value=o;updateColor('bordercolor_pick','bordercolor');updateColor('bgcolor_pick','bgcolor');if(isVisible('backgroundimagebrowser'))document.getElementById('backgroundimage').style.width='180px';if(action=="update"){v.cols.disabled=true;v.rows.disabled=true;}}
function changedSize(){var f=document.forms[0];var s=dom.parseStyle(f.style.value);var h=f.height.value;if(h!="")s['height']=getCSSSize(h);else s['height']="";f.style.value=dom.serializeStyle(s);}
function isCssSize(v){return/^[0-9.]+(%|in|cm|mm|em|ex|pt|pc|px)$/.test(v);}
function cssSize(v,d){v=tinymce.trim(v||d);if(!isCssSize(v)){return parseInt(v,10)+'px';}return v;}
function changedBackgroundImage(){var f=document.forms[0];var s=dom.parseStyle(f.style.value);s['background-image']="url('"+f.backgroundimage.value+"')";f.style.value=dom.serializeStyle(s);}
function changedBorder(){var f=document.forms[0];var s=dom.parseStyle(f.style.value);if(f.border.value!=""&&(isCssSize(f.border.value)||f.bordercolor.value!=""))s['border-width']=cssSize(f.border.value);else{if(!f.border.value){s['border']='';s['border-width']='';}}f.style.value=dom.serializeStyle(s);}
function changedColor(){var f=document.forms[0];var s=dom.parseStyle(f.style.value);s['background-color']=f.bgcolor.value;if(f.bordercolor.value!=""){s['border-color']=f.bordercolor.value;if(!s['border-width'])s['border-width']=cssSize(f.border.value,1);}f.style.value=dom.serializeStyle(s);}
function changedStyle(){var f=document.forms[0];var s=dom.parseStyle(f.style.value);if(s['background-image'])f.backgroundimage.value=s['background-image'].replace(new RegExp("url\\(['\"]?([^'\"]*)['\"]?\\)",'gi'),"$1");else f.backgroundimage.value='';if(s['width'])f.width.value=trimSize(s['width']);if(s['height'])f.height.value=trimSize(s['height']);if(s['background-color']){f.bgcolor.value=s['background-color'];updateColor('bgcolor_pick','bgcolor');}if(s['border-color']){f.bordercolor.value=s['border-color'];updateColor('bordercolor_pick','bordercolor');}}
tinyMCEPopup.onInit.add(init);
