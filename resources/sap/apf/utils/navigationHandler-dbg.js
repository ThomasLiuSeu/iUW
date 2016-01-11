/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap, apf, modeler, jQuery*/

(function() {
	'use strict';

	jQuery.sap.declare("sap.apf.utils.navigationHandler");
	jQuery.sap.require("sap.apf.utils.navContainer");
	jQuery.sap.require("sap.ui.core.routing.HashChanger"); //FIXME Necessary due to lazy loading bug in UI5 library.js in 1.28.0. Can be deleted after 1.28.1 fix is tested
	
	/**
	 * @class This class manages the navigation to a target and the navigation from another target into this class;
	 * @param {sap.apf.core.MessageHandler} oInject.instances.messageHandler
	 * @param {function} oInject.functions.getCumulativeFilterUpToActiveStep 
	 */
	sap.apf.utils.NavigationHandler = function(oInject) {

		var navTargets, navTargetsWithText;
		var messageHandler = oInject.instances.messageHandler;

		/**
		 * returns the filter from a selection variant in callback
		 * @param {string} selectionVariantId id of the selection variant
		 * @param {function} callback with parameters {sap.apf.utils.Filter} and {sap.apf.core.MessageObject}. The message object is undefined, if no errors occurred
		 */
		this.getFilterFromSelectionVariant = function(selectionVariantId, callback) {
			
			function extractFilterAndReturn(selectionVariant, messageObject) {
				var filter;
				if (messageObject) {
					callback(undefined, messageObject);
				} else {
					filter = sap.apf.utils.Filter.createFilterFromSapUi5FilterJSON(messageHandler, selectionVariant.Filter);
					callback(filter);
				}
			}
			sap.apf.utils.navContainer.fetchContent(selectionVariantId, 'sap.apf.selectionVariant', messageHandler, extractFilterAndReturn);
		};
		/**
		 * returns all possible navigation targets
		 * @returns [object] array of navigation targets with properties id, semanticObject, action. The id is
		 * used in the navigateToApp function
		 */
		this.getNavigationTargets = function() {
			if (!navTargets) {
				initNavigationTargets();
			}
			return jQuery.extend(true, [], navTargets);
		};

		/**
		 * returns all possible navigation targets with text (from intent
		 * @returns promise with [object] array of navigation targets with properties id, semanticObject, action and text. The id is
		 * used in the navigateToApp function
		 */
		this.getNavigationTargetsWithText = function() {
			var deferred;
			var navigationService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
    		var semanticObjects = [];
    		
			function addText(semanticObject, action, text ) {
				navTargetsWithText.forEach(function(navTarget) {
					if (semanticObject === navTarget.semanticObject && action === navTarget.action) {
						navTarget.text = text;
					}
				});
			}
			
		    function collectIntentTexts(semanticObjectCounter) {
		    	 var deferred = jQuery.Deferred();
		    	
		    	 var finalNavTargets = [];
		    	 if (semanticObjectCounter === semanticObjects.length) {
		    		 deferred = jQuery.Deferred();
		    		 navTargetsWithText.forEach(function(navTargetWithText) {
		    			 if (navTargetWithText.text !== "") {
		    				 finalNavTargets.push(navTargetWithText);
		    			 }
		    		 })
		    		 navTargetsWithText = finalNavTargets;
		    		 deferred.resolve(navTargetsWithText);
		    		 return deferred.promise();
		    	 } 
		    	 var semanticObject = semanticObjects[semanticObjectCounter];
		    	 
		    	 navigationService.getSemanticObjectLinks(semanticObject, undefined, false, oInject.instances.component, undefined)
	     		 	.done(	function(aIntents) { 
	     		 		aIntents.forEach(function(intentDefinition){
	     		 					var actionWithParameters = intentDefinition.intent.split("-");
	     		 					var action = actionWithParameters[1].split("?");
	     		 					action = action[0].split("~");
	     		 					addText(semanticObject, action[0], intentDefinition.text);
	     		 					
	     		 				});
	     		 		collectIntentTexts(semanticObjectCounter + 1).done(function() {
	     		 			deferred.resolve(navTargetsWithText);
	     		 		});
	     		 	}).fail(function() { 
	     		 		return collectIntentTexts(semanticObjectCounter + 1);
	     		 	});
		    	 
		    	 return deferred.promise();
		     }
			
			
		    if (navTargetsWithText) {
				deferred = jQuery.Deferred();
				deferred.resolve(navTargetsWithText);
				return deferred.promise();
			}
		    
			if (!navTargets) {
				initNavigationTargets();
			}

			navTargetsWithText = jQuery.extend(true, [], navTargets);
			
			//set default
			navTargetsWithText.forEach(function(navTarget) {
					navTarget.text = "";
			});
			 
			navTargets.forEach(function(navTarget) {
			   if ($.inArray(navTarget.semanticObject, semanticObjects) === -1) {
				   semanticObjects.push(navTarget.semanticObject);
				}
			});
					   
			deferred = jQuery.Deferred();
			collectIntentTexts(0).done(function() {
				deferred.resolve(navTargetsWithText);
			}).fail(function() {
				deferred.resolve(navTargetsWithText);
			});
			
			return deferred.promise();
			
		};
		/**
		 * receives an id of a navigation target and starts the navigation
		 * @param {string} navigationId navigation target id
		 * @returns undefined
		 */
		this.navigateToApp = function(navigationId) {
			
			if (!navTargets) {
				initNavigationTargets();
			}
			var i;
			var len = navTargets.length;
			var selectionVariant, parameters, appState, serializableState;
			var hashChanger = sap.ui.core.routing.HashChanger && sap.ui.core.routing.HashChanger.getInstance();

			serializableState = {
			        sapApfState : oInject.functions.serializePath()
			};
			serializableState.sapApfState.pathContextHandler = oInject.functions.serializeContext();
			serializableState.sapApfCumulativeFilter = oInject.functions.getCumulativeFilterUpToActiveStep().mapToSapUI5FilterExpression();

			for(i = 0; i < len; i++) {
				if (navTargets[i].id === navigationId) {

					selectionVariant = buildSelectionVariant(navigationId);
					sap.apf.utils.navContainer.pushContent(JSON.stringify(selectionVariant), 'sap.apf.selectionVariant', messageHandler, function(containerId, messageObject) {

						if (messageObject) {
							messageHandler.putMessage(messageObject);
						} else {
							jQuery.sap.log.info("navigation with containerId " + containerId);
						}

						var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
						
						if (oCrossAppNavigator) {
							parameters = {
									'sap-apf-selection-variant-id' : containerId
							};
		                    
				            appState = oCrossAppNavigator.createEmptyAppState(oInject.instances.component);
				            appState.setData(serializableState);
				            appState.save();
							if(hashChanger) {
							    hashChanger.replaceHash("sap-iapp-state=" + appState.getKey());
							}
							
							oCrossAppNavigator.toExternal({
								target : {
									semanticObject : navTargets[i].semanticObject,
									action : navTargets[i].action
								},
								params : parameters,
								appStateKey : appState.getKey()
							});
						}

					});
					return;
				}
			}
		};
        this.checkMode = function() {
        	var deferred = jQuery.Deferred();
        	
        	var hashChanger = sap.ui.core.routing.HashChanger && sap.ui.core.routing.HashChanger.getInstance && sap.ui.core.routing.HashChanger.getInstance();
        	var iappStateKeyMatcher = /(?:sap-iapp-state=)([^&=]+)/;
        	var xappStateKeyMatcher = /(?:sap-xapp-state=)([^&=]+)/;
        	var innerAppStateKey, crossAppStateKey, iappMatch, xappMatch, containerData;
        	
        	if(hashChanger){
        		iappMatch = iappStateKeyMatcher.exec(hashChanger.getHash());
        		if(iappMatch){
        			innerAppStateKey = iappMatch[1];
        		}
        	}
        	//TODO: Find proper way to read hash for xapp state, UI5 HashChanger cannot be used. 
        	xappMatch = xappStateKeyMatcher.exec(window.location.hash);
    		if(xappMatch){
    			crossAppStateKey = xappMatch[1];
    		}
        	
        	if(innerAppStateKey){
	        	sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(oInject.instances.component, innerAppStateKey).done(function (appContainer) {
        			containerData = appContainer.getData();
	        		if(containerData.sapApfState){
	        			oInject.functions.deserializeContext(containerData.sapApfState.pathContextHandler);
	        			oInject.functions.deserializePath(containerData.sapApfState);
	        			deferred.resolve({navigationMode : "backward"});
	        		}
	            });
        	}else if(crossAppStateKey){
        		sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(oInject.instances.component, crossAppStateKey).done(function (appContainer) {
        			containerData = appContainer.getData();
	        		if(containerData && containerData.sapApfCumulativeFilter){
	        			deferred.resolve({navigationMode : "forward", sapApfCumulativeFilter : containerData.sapApfCumulativeFilter});
	        		}else{
	        			deferred.resolve({navigationMode : "forward"});
	        		}
	            });
        	}else{
        		deferred.resolve({navigationMode : "forward"});
        	}
        	return deferred.promise();
        };
		// proper format see \\dwdf213\CFP\70_FND\20_Product_Teams\10_Analytics\New Analytics\Architecture\AnalysisPathFramework\APF-Cloud
		function buildSelectionVariant(selectionVariantId) {
			var date = new Date();
			var filter = oInject.functions.getCumulativeFilterUpToActiveStep();
			var filterExpr = filter.mapToSapUI5FilterExpression();
			return {
				"SelectionVariantID" : selectionVariantId,
				"Text" : "Temporary Selection Variant Producer = APF, " + date.toUTCString(),
				"Filter" : filterExpr
			};
		}
		function initNavigationTargets() {
			navTargets = oInject.functions.getNavigationTargets();
		}

	};

}());
