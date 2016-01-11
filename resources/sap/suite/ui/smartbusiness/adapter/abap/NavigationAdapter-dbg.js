/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.adapter.abap.NavigationAdapter");
sap.suite.ui.smartbusiness.adapter.abap.NavigationAdapter = function() {
	var _cache={};
	function _getUriForFetchingLinks(so, arr, businessParamMap/*Key value Pair*/){
		var strSemanticObjectLink = "/GetLinksForSemanticObject?semanticObject='"+so+"'";
		var strBusinessParams="";
		if(businessParamMap && Object.keys(businessParamMap).length) {
		    //var strBusinessParams = "";
		    for(var key in businessParamMap) {
		        strBusinessParams += key+"="+businessParamMap[key]+"&";
		    }
		}
		if(arr && arr.length) {
            for(var i=0;i<arr.length;i++){
                strBusinessParams += arr[i]+"=1&";
            }   
		}
        strBusinessParams=encodeURIComponent(strBusinessParams.replace(/&$/g,""));
        strBusinessParams="&businessParams='"+strBusinessParams+"'";
		return strSemanticObjectLink + strBusinessParams;
	};
	this.getLinksBySemanticObject = function(oParam) {
    	var that=this;
        var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/UI2/INTEROP",true);
        oParam.businessParam=oParam.businessParam||{};
        oParam.businessParam["formFactor"]=sap.ui2.srvc.getFormFactor();
        var serviceUri = _getUriForFetchingLinks(oParam.semanticObject,oParam.dimensions, oParam.businessParam);
        var callReference = oDataModel.read(serviceUri,null, null, true, function(data) {
        	oParam.success.call(oParam.context || null, data.results);
        	/**
        	 * Array of 
        	 * {
        	 *     id   : so-action~asd
        	 *     text : '',
        	 *     applicationAlias : action,
        	 *     applicationType : "URL"
        	 * }
        	 */
        }, function() {
            jQuery.sap.log.error("Error fetching getLinksBySemanticObject : "+oParam.semanticObject);
            oParam.success.call(oParam.context || null, []);
        }, !!oParam.async);
        return callReference ;
	};
	this.getLinksByContext = function(oParam) {
	    var aODataCallReference = [];
	    if(oParam.viewId && _cache[oParam.viewId]) {
			oParam.success.call(oParam.context || null,_cache[oParam.viewId]);
		} else {	
    		var soArray=[oParam.semanticObject],links=[];
    		oParam.dimensions=oParam.dimensions||[];
    		soArray=soArray.concat(oParam.dimensions);
    		var semaphore=soArray.length;
    		if(semaphore){
    			for(var i=0;i<soArray.length;i++){
    				var callReference = this.getLinksBySemanticObject({
    				    async : true,
    				    semanticObject : soArray[i],
    				    dimensions : oParam.dimensions,
    				    success : function(data) {
        					links = links.concat(data);
        					if(--semaphore == 0){
        						_cache[oParam.viewId]=links;
        						oParam.success.call(oParam.context || null, links);
        					}
    				    },error:function() {
    				        if(--semaphore == 0){
    						_cache[oParam.viewId] = links;
    						oParam.success.call(oParam.context || null, links);
    				        }
    				    }
    				});
    				aODataCallReference.push(callReference);
    				
    			}
    		}else{
    			oParam.success.call(oParam.context || null,[]);
    		}
		}
	    return aODataCallReference;
	};
	this.reset =function() {
		_cache = {};
	}
};
