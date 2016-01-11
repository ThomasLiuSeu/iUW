/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2015 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.InboxDataManager");
sap.uiext.inbox.InboxDataManager=function(){};
sap.uiext.inbox.InboxDataManager.setModel=function(m){this._oModel=m;if(this._oModel instanceof sap.ui.model.odata.ODataModel){this._sModelType="v1"}else if(this._oModel instanceof sap.ui.model.odata.v2.ODataModel){this._sModelType="v2"}};
sap.uiext.inbox.InboxDataManager.fireBatchRequest=function(p){if(this._sModelType=="v1"){this._oModel.clearBatch();this._addOperationsToBatchV1(p);this._oModel.submitBatch(function(d,r){if(p.fnSuccess){p.fnSuccess(d,r);}},function(E){if(p.fnError){p.fnError(E);}});}else if(this._sModelType=="v2"){this._oModel.setUseBatch(true);this._oModel.setDeferredBatchGroups([p.sBatchGroupId]);this._addOperationsToBatchV2(p);var s=jQuery.proxy(function(d,r){this._oModel.setUseBatch(false);if(p.fnSuccess){p.fnSuccess(d,r);}},this);var e=jQuery.proxy(function(E){this._oModel.setUseBatch(false);if(p.fnError){p.fnError(E);}},this);this._oModel.submitChanges({batchGroupId:p.sBatchGroupId,success:s,error:e});}};
sap.uiext.inbox.InboxDataManager._addOperationsToBatchV1=function(p){var P,b;for(var i=0;i<p.numberOfRequests;i++){if(p.sPath){P=p.sPath}else if(p.aPaths){P=p.aPaths[i]}if(p.aUrlParameters){P=this._createRequestUrl(P,p.aUrlParameters[i]);}if(p.aProperties){b=this._oModel.createBatchOperation(P,p.sMethod,p.aProperties[i]);}else{b=this._oModel.createBatchOperation(P,p.sMethod);}if(p.sMethod==="GET"){this._oModel.addBatchReadOperations([b]);}else if(p.sMethod==="POST"){this._oModel.addBatchChangeOperations([b]);}}};
sap.uiext.inbox.InboxDataManager._addOperationsToBatchV2=function(p){var P;var e={batchGroupId:p.sBatchGroupId};for(var i=0;i<p.numberOfRequests;i++){if(p.aUrlParameters){e.urlParameters=p.aUrlParameters[i];}if(p.aProperties){e.properties=p.aProperties[i];}if(p.sPath){P=p.sPath}else if(p.aPaths){P=p.aPaths[i]}if(!jQuery.sap.startsWith(P,"/")){P="/"+P;}if(p.sMethod=="GET"){this._oModel.read(P,e);}else if(p.sMethod=="POST"){e.changeSetId="changeSetId"+i;this._oModel.createEntry(P,e);}}};
sap.uiext.inbox.InboxDataManager.callFunctionImport=function(p,P,a){if(this._oModel instanceof sap.ui.model.odata.ODataModel){if(a!=undefined){P.async=a}}if(!jQuery.sap.startsWith(p,"/")){p="/"+p;}this._oModel.callFunction(p,P);};
sap.uiext.inbox.InboxDataManager.readData=function(p,P,a){if(this._oModel instanceof sap.ui.model.odata.ODataModel){if(a!=undefined){P.async=a}}if(!jQuery.sap.startsWith(p,"/")){p="/"+p;}this._oModel.read(p,P);};
sap.uiext.inbox.InboxDataManager._createRequestUrl=function(p,u){var U=[];var s=p;jQuery.each(u,function(n,v){U.push(n+"="+v);});if(U&&U.length>0){s+="?"+U.join("&");}return s;};
sap.uiext.inbox.InboxDataManager.removeData=function(p,P,a){if(this._oModel instanceof sap.ui.model.odata.ODataModel){if(a!=undefined){P.async=a}}if(!jQuery.sap.startsWith(p,"/")){p="/"+p;}this._oModel.remove(p,P);};
