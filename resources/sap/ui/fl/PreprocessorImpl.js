/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Component','sap/ui/fl/FlexControllerFactory','sap/ui/fl/Utils'],function(q,C,F,U){'use strict';var a=function(){};a._getOwnerId=function(m){var o;if(m){o=C.getOwnerIdFor(m);if(!o&&m.getParent){o=a._getOwnerId(m.getParent());}}return o;};a.process=function(v){return Promise.resolve().then(function(){var o=a._getOwnerId(v);if(!o){var e="no owner ID found for "+v.getId();q.sap.log.error(e);throw new Error(e);}var c=sap.ui.getCore().getComponent(o).getMetadata().getName();if(c.indexOf(".Component")<0){c+='.Component';}var f=F.create(c);return f.processView(v);}).then(function(){q.sap.log.debug("flex processing view "+v.getId()+" finished");return v;})["catch"](function(e){var E="flex error processing view "+v.getId()+": "+e;q.sap.log.error(E);return v;});};return a;},true);
