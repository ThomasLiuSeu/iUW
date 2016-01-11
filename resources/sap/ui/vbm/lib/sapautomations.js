
VBI.Automations=function(){var a={};a.m_automations=[];a.clear=function(){for(var n=0;n<a.m_automations.length;++n){a.m_automations[n].clear();}a.m_automations=[];};a.load=function(d,c){if(d.Call){if(jQuery.type(d.Call)=='object'){var b=new VBI.Automations.Automation();b.load(d.Call,c);a.m_automations.push(b);}else if(jQuery.type(d.Call)=='array'){for(var n=0;n<d.Call.length;++n){var b=new VBI.Automations.Automation();b.load(d.Call[n],c);a.m_automations.push(b);}}}};VBI.Automations.Automation=function(){var b={};b.m_additionalProperties=[];b.clear=function(){b.m_addProperties=null;};b.createHandler=function(d,h){switch(h){case"CONTEXTMENUHANDLER":return new VBI.ContextMenuHandler(d);case"FLYTOHANDLER":return new VBI.FlyToHandler(d);case"OBJECTCREATIONHANDLER":return new VBI.ObjectCreationHandler(d);case"LOOPBACKHANDLER":return new VBI.LoopBackHandler(d);default:return undefined;}};b.getMainScene=function(c){if(c.m_SceneManager.m_SceneArray.length==1)return c.m_SceneManager.m_SceneArray[0].m_ID;return undefined;};b.load=function(d,c){b.m_handlerName=d.handler;b.m_handler=b.createHandler(d.Param,d.handler);if(!b.m_handler)return;b.m_handler.m_Ctx=c;b.m_name=d.name;if(b.m_handler.m_scene==undefined)b.m_handler.m_scene=(d.scene==undefined?b.getMainScene(c):d.scene);b.m_delay=(d.delay==undefined?1:d.delay);b.m_earliest=(d.earliest==undefined?1:d.earliest);b.m_retryAfterMS=(d.retryAfterMS==undefined?0:d.retryAfterMS);b.m_reattempts=(d.reattempts==undefined?-1:d.reattempts);b.m_handler.m_refID=(d.refID==undefined?"":d.refID);b.m_handler.m_refObj=(d.object==undefined?"":d.object);b.m_handler.m_refInstance=(d.object==undefined?"":d.instance);b.m_handler.m_Name=d.name;b.m_nAttempts=0;var n=new Date();var r=n.getTime()-c.m_StartupTime;var e=b.m_delay;if(r<b.m_earliest)e=Math.max(e,b.m_earliest-r);b.m_AnimZoomTimer=window.setInterval(b.startAutomation,e);};b.startAutomation=function(){window.clearInterval(b.m_AnimZoomTimer);if(!b.m_handler.start()&&b.m_retryAfterMS){b.m_nAttempts++;if((b.m_reattempts==-1)||(b.m_nAttempts<b.m_reattempts)){b.m_AnimZoomTimer=window.setInterval(b.startAutomation,b.m_retryAfterMS);}}};return b;};return a;};
VBI.FlyToHandler=function(d){var f={};f.cnt=0;for(var i=0;i<d.length;++i){if(d[i].name==="x")f.m_x=d[i]["#"];if(d[i].name==="y")f.m_y=d[i]["#"];if(d[i].name==="lod")f.m_lod=d[i]["#"];if(d[i].name==="mode")f.m_mode=d[i]["#"];if(d[i].name==="velocity")f.m_velocity=d[i]["#"];if(d[i].name==="basetime")f.m_basetime=d[i]["#"];if(d[i].name==="scene")f.m_scene=d[i]["#"];}f.start=function(){VBI.m_bTrace&&VBI.Trace("FlyTo triggered to "+f.m_x+","+f.m_y+","+f.m_lod+" on scene "+f.m_scene);if(f.m_scene==undefined||f.m_x==undefined||f.m_y==undefined||f.m_lod==undefined)return true;var l=VBI.MathLib.DegToRad([parseFloat(f.m_x),parseFloat(f.m_y)]);var s=f.m_Ctx.m_SceneManager.GetSceneByName(f.m_scene);if(s){var a=f.m_lod;s.ZoomToGeoPosition(l,a);if(a!=Math.floor(a)){setTimeout(function(){s.AnimateZoomToGeo(l,Math.floor(a),40);},600);}}return true;};return f;};
VBI.ContextMenuHandler=function(d){var c={};c.cnt=0;for(var i=0;i<d.length;++i){if(d[i].name==="x")c.m_x=parseInt(d[i]["#"]);if(d[i].name==="y")c.m_y=parseInt(d[i]["#"]);if(d[i].name==="scene")c.m_scene=d[i]["#"];}c.start=function(){var s=c.m_Ctx.m_SceneManager.GetSceneByName(c.m_scene);var m=c.m_Ctx.m_Menus.findMenuByID(c.m_refID);if(!s)return true;m.vbi_data.scene=c.m_scene;m.vbi_data.object=c.m_refObj;m.vbi_data.instance=c.m_refInstance;m.open(true,0,"begin top","begin top",s.m_Div,""+c.m_x+" "+c.m_y+"","fit");};return c;};
VBI.ObjectCreationHandler=function(d){var h={};h.cnt=0;h.m_Ctx=null;h.m_Name=null;if(jQuery.type(d)=='object'){if(d.name==="data")h.m_data=d["#"];}else if(jQuery.type(d)=='array'){for(var i=0,l=d.length;i<l;++i)if(d[i].name==="data")h.m_data=d[i]["#"];}h.start=function(){var s=null;if(s=h.m_Ctx.m_SceneManager.GetSceneByName(h.m_scene)){if(h.m_Name=="CreateObject"){var a=null,b=s.m_Ctx.m_Actions;if(b)a=s.m_Ctx.m_Actions.findAction("CreateComplete",s,"General");var f=null;if(a){f=function(c){var p={data:c};s.m_Ctx.FireAction(a,s,"General",null,p);};}else{f=s.m_Ctx.m_Control.load.bind(s.m_Ctx.m_Control);}s.DesignCreateObject(h.m_data,null,f);}}};return h;};
VBI.LoopBackHandler=function(d){var h={};h.cnt=0;h.m_Ctx=null;h.m_Name=null;if(jQuery.type(d)=='object'){if(d.name==="ActionID")h.m_ActionID=d["#"];}else if(jQuery.type(d)=='array'){for(var i=0,l=d.length;i<l;++i)if(d[i].name==="ActionID")h.m_ActionID=d[i]["#"];}h.start=function(){if(h.m_Name=="TriggerAction"){var a;if(a=h.m_Ctx.m_Actions){var b;if(b=a.findAction(null,null,null,h.m_ActionID)){var s;if(s=h.m_Ctx.m_SceneManager.GetSceneByName(b.m_refScene)){var v=s.BaseGetVO(b.m_refVO);h.m_Ctx.FireAction(b,s,v?v:b.m_refVO,null,null);}}}}};return h;};
