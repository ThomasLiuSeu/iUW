/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
//jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
/**
* @class category
* @memberOf sap.apf.modeler.ui.controller
* @name category
* @description controller for view.category
*/
sap.ui.controller("sap.apf.modeler.ui.controller.navigationTarget", {
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.navigationTarget#onInit
	* @description Called on initialization of the view.
	* 			Sets the static texts for all controls in UI.
	* 			Adds style classes to all UI controls.
	* 			Prepares dependencies.
	*  			Sets dynamic text for input controls
	* */
	onInit : function() {
		this.getView().addStyleClass("sapUiSizeCompact");//For non touch devices- compact style class increases the information density on the screen by reducing control dimensions
		this.oViewData = this.getView().getViewData();
		this.oConfigurationHandler = this.oViewData.oConfigurationHandler;
		this.oConfigurationEditor = this.oViewData.oConfigurationEditor;
		this.getText = this.oViewData.getText;
		this.params = this.oViewData.oParams;
		this.createMessageObject = this.oViewData.createMessageObject;
		this.putMessage = this.oViewData.putMessage;
		this.updateTitleAndBreadCrumb = this.oViewData.updateTitleAndBreadCrumb;
		this.getAllAvailableSemanticObjects = this.oViewData.getAllAvailableSemanticObjects;
		this.getSemanticActions = this.oViewData.getSemanticActions;
		var self = this;
		if (!this.oConfigurationEditor) {
			this.oConfigurationHandler.loadConfiguration(this.params.arguments.configId, function(configurationEditor) {
				self.oConfigurationEditor = configurationEditor;
			});
		}
		this._setDisplayText();
		//Set Mandatory Fields
		var mandatoryFields = [];
		mandatoryFields.push(this.byId("idSemanticObjectField"));
		mandatoryFields.push(this.byId("idActionField"));
		this._setMandatoryFields(mandatoryFields);
		//API Callback return an array of semantic objects of with each object having an id and text
		this.getAllAvailableSemanticObjects(function(semanticObjects, messageObject) {
			if (messageObject === undefined) {
				self._populateSemanticObjectModel(semanticObjects);
				self.setDetailData();
			} else {
				var oMessageObject = self.createMessageObject({
					code : "12004"
				});
				oMessageObject.setPrevious(messageObject);
				self.putMessage(oMessageObject);
			}
		});
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.navigationTarget#_populateSemanticObjectModel
	* @description Prepares the model for semantic object field and sets it
	* @param {Array} Array of semantic objects from getAllAvailableSemanticObjects API
	* */
	_populateSemanticObjectModel : function(aAllSemObj) {
		var aAllSemanticObjectsModel;
		var aAllSemanticObjects = [];
		aAllSemObj.forEach(function(oSemanticObject) {
			var oSemOb = {};
			oSemOb.semanticObjectKey = oSemanticObject.id;
			oSemOb.semanticObjectName = oSemanticObject.id;
			aAllSemanticObjects.push(oSemOb);
		});
		var oSemObjData = {
			aAllSemanticObjects : aAllSemanticObjects
		};
		aAllSemanticObjectsModel = new sap.ui.model.json.JSONModel();
		aAllSemanticObjectsModel.setSizeLimit(500);
		aAllSemanticObjectsModel.setData(oSemObjData);
		this.byId("idSemanticObjectField").setModel(aAllSemanticObjectsModel);
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.navigationTarget#_setDisplayText
	* @description Sets static texts in UI
	* */
	_setDisplayText : function() {
		this.byId("idSemanticObjectLabel").setText("* " + this.getText("semanticObject") + ": ");
		this.byId("idActionLabel").setText("* " + this.getText("action") + ": ");
		this.byId("idDescriptionLabel").setText(this.getText("description") + ": ");
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.navigationTarget#setDetailData
	* @description Sets dynamic texts for controls
	* */
	setDetailData : function() {
		var aSemanticObjects = this.byId("idSemanticObjectField").getModel().getData().aAllSemanticObjects;
		if (this.params && this.params.arguments && this.params.arguments.navTargetId) {
			this.oNavTarget = this.oConfigurationEditor.getNavigationTarget(this.params.arguments.navTargetId);
		}
		if (this.oNavTarget) {
			var sSemanticObjectKey;
			var sSemanticObject = this.oNavTarget.getSemanticObject();
			//Loop through semantic objects model to find if the existing navigation target's semantic object is present in the model
			for( var index = 0; index < aSemanticObjects.length; index++) {
				if (sSemanticObject === aSemanticObjects[index].semanticObjectKey) {
					sSemanticObjectKey = true;//If semantic object present in list, set as true
					break;
				}
			}
			this.byId("idSemanticObjectField").setValue(sSemanticObject);
			var semanticObjectInfo = {
				changeSemanticObject : false,
				semanticObjectInList : sSemanticObjectKey ? true : false//If semantic object part of the list then set true; else if semantic object is through user input set false
			};
			this._populateActions(sSemanticObject, semanticObjectInfo);
		} else {
			var navigationTargetId = this.oConfigurationEditor.createNavigationTarget();
			this.oNavTarget = this.oConfigurationEditor.getNavigationTarget(navigationTargetId);
			//Adds the empty string key to the semantic object model in case of a new navigation target
			aSemanticObjects.splice(0, 0, {
				semanticObjectKey : "",
				semanticObjectName : ""
			});
			var oSemObjData = {
				aAllSemanticObjects : aSemanticObjects
			};
			this.byId("idSemanticObjectField").getModel().setData(oSemObjData);
			this.byId("idSemanticObjectField").setSelectedKey("");
			var oModelAction = new sap.ui.model.json.JSONModel();
			var oData = {
				aActions : [ {
					id : "",
					text : ""
				} ]
			};
			oModelAction.setData(oData);
			this.byId("idActionField").setModel(oModelAction);
			this.byId("idActionField").setSelectedKey("");
			var oActionInfo = {
				id : navigationTargetId
			};
			this.oViewData.updateSelectedNode(oActionInfo);
		}
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.navigationTarget#handleChangeSemanticObjectValue
	* @description Handler for change event on Semantic Object drop down
	* */
	handleChangeSemanticObjectValue : function(oEvent) {
		var aSemanticObjects = this.byId("idSemanticObjectField").getModel().getData().aAllSemanticObjects;
		if (aSemanticObjects[0].semanticObjectKey === "") {
			aSemanticObjects.splice(0, 1);//Removes the empty string key from the semantic object model after a semantic object is set
			var oSemObjData = {
				aAllSemanticObjects : aSemanticObjects
			};
			this.byId("idSemanticObjectField").getModel().setData(oSemObjData);
		}
		var sSemanticObject = oEvent.getParameter("value");
		var sSemanticObjectKey = this.byId("idSemanticObjectField").getSelectedKey();
		var semanticObjectInfo = {
			changeSemanticObject : true,
			semanticObjectInList : sSemanticObject === sSemanticObjectKey ? true : false
		};
		if (sSemanticObject !== "" && sSemanticObject !== null) {
			this.oConfigurationEditor.setIsUnsaved();
			this.oNavTarget.setSemanticObject(sSemanticObject);
			this._populateActions(sSemanticObject, semanticObjectInfo);
		}
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.navigationTarget#_getActionText
	* @description Matches the selected Navigation target action with the model to find the description of the action
	* @returns {String} The description of the selected action is returned 
	* */
	_getActionText : function() {
		var sTitle;
		var aSemanticActions = this.byId("idActionField").getModel().getData().aActions;
		for( var i = 0; i < aSemanticActions.length; i++) {
			if (aSemanticActions[i].id === this.oNavTarget.getAction()) {
				sTitle = aSemanticActions[i].text;
				break;
			}
		}
		return sTitle;
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.navigationTarget#handleChangeofAction
	* @description Handler for change event on Actions drop down
	* */
	handleChangeofAction : function(oEvent) {
		var sTitle;
		var sAction = oEvent.getParameter("value");
		if (sAction !== "" && sAction !== null) {
			this.oNavTarget.setAction(sAction);
		}
		this.oConfigurationEditor.setIsUnsaved();
		sTitle = this._getActionText();
		if (sTitle === undefined) {//Handle user input of action
			sTitle = this.oNavTarget.getSemanticObject();//If action does not have description(user input case) use the semantic object for title and description
		}
		var oActionInfo = {
			name : sTitle
		};
		this.byId("idDescription").setValue(sTitle);
		this.oViewData.updateSelectedNode(oActionInfo);
		sTitle = this.getText("navigationTarget") + ": " + sTitle;
		this.updateTitleAndBreadCrumb(sTitle);
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.navigationTarget#_updateDescriptionAndTitle
	* @param {Object} - {boolean} whether semantic object is part of the list of semantic objects or user input
	* 				  - {boolean} whether change triggered from handleChangeSemanticObjectValue or onInit of navigation target
	* 		 {String} - Title and bread crumb; Also set on description
	* @description Sets the title, bread crumb, description and updates tree node
	* */	
	_updateDescriptionAndTitle : function(semanticObjectInfo, sTitle) {
		if (semanticObjectInfo.changeSemanticObject) { //If change is triggered from handleChangeSemanticObjectValue
			if (sTitle === undefined) {//Handle user input of semantic object and action
				sTitle = this.oNavTarget.getSemanticObject();//If action does not have description(user input case) use the semantic object for title and description
			}
			var oActionInfo = {
				name : sTitle
			};
			this.byId("idDescription").setValue(sTitle);
			this.oViewData.updateSelectedNode(oActionInfo);
			sTitle = this.getText("navigationTarget") + ": " + sTitle;
			this.updateTitleAndBreadCrumb(sTitle);
		}
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.navigationTarget#_populateActions
	* @description Accepts a semantic object and populates the action drop down with the list of actions for the semantic object.
	* Also accepts a boolean changeSemanticObject to differentiate between the call from change of semantic object or at initial load for an existing navigation target.
	* If boolean is true, call is from handleChangeSemanticObjectValue
	* If boolean is false, the call is from on initial load so only certain details like description is updated.
	* Accepts boolean semanticObjectInList to check if the semantic object is part of the semantic object list or an user input. If the boolean is true it is part of the semantic object list else it is an user input
	* The title, bread crumb, tree node and description are updated with the description of the action if semantic object is part of the list else updated with the semantic object
	* @param {String} Semantic object; 
	* 		 {Object} - {boolean} whether semantic object is part of the list of semantic objects or user input
	* 				  - {boolean} whether change triggered from handleChangeSemanticObjectValue or onInit of navigation target
	* */
	_populateActions : function(semanticObject, semanticObjectInfo) {
		var self = this;
		var sTitle;
		if (semanticObjectInfo && semanticObjectInfo.semanticObjectInList) {//Semantic object present in the list of semantic objects
			var oPromise = this.getSemanticActions(semanticObject);//Promise based call to get the list of actions for the given semantic object
			oPromise.then(function(aSemanticActions) {//Once promise is done populate action model
				var oActionsData = {
					aActions : aSemanticActions.semanticActions
				};
				var oActionModel = new sap.ui.model.json.JSONModel();
				oActionModel.setData(oActionsData);
				self.byId("idActionField").setModel(oActionModel);
				if (self.oNavTarget.getAction() && semanticObjectInfo && semanticObjectInfo.changeSemanticObject === false) {//If change is triggered from on load of existing navigation target
					self.byId("idActionField").setValue(self.oNavTarget.getAction());
					var sText = self._getActionText() ? self._getActionText() : self.oNavTarget.getSemanticObject(); //If action is from list of actions, get action's description; If action is from user input use semantic object as description
					self.byId("idDescription").setValue(sText);
				} else if (oActionModel.getData().aActions.length > 0) {//If change is triggered from handleChangeSemanticObjectValue
					self.byId("idActionField").setSelectedKey(oActionModel.getData().aActions[0].id);//Set the first action on the list as selected by default
					self.oNavTarget.setAction(oActionModel.getData().aActions[0].id);
					sTitle = oActionModel.getData().aActions[0].text;
				}
				self._updateDescriptionAndTitle(semanticObjectInfo, sTitle);
			}, function(messageObject) {//If promise fails display a message
				var oMessageObject = self.createMessageObject({
					code : "12005"
				});
				oMessageObject.setPrevious(messageObject);
				self.putMessage(oMessageObject);
			});
		} else {//If the semantic object is an user input
			var oModelAction = new sap.ui.model.json.JSONModel();
			var oData = {
				aActions : []
			};
			oModelAction.setData(oData);//Set the action model as empty for user input of semantic object
			this.byId("idActionField").setModel(oModelAction);
			if (this.oNavTarget.getAction() && semanticObjectInfo && semanticObjectInfo.changeSemanticObject === false) { //If change is triggered from on load of existing navigation target and an action is available
				this.byId("idActionField").setValue(this.oNavTarget.getAction());
				var sText = self.oNavTarget.getSemanticObject();
				self.byId("idDescription").setValue(sText);//For user input semantic objects, set description as semantic object
			} else {
				this.byId("idActionField").setValue("");//If change is triggered from handleChangeSemanticObjectValue and action is not available
			}
			this._updateDescriptionAndTitle(semanticObjectInfo, sTitle);//For user input semantic objects, set title, bread crumb and description as semantic object
		}
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.controller.navigationTarget#_getMandatoryFields
	 * @param {Object} oEvent - Event instance of the form field 
	 * @description getter for mandatory fields
	 * */
	_getMandatoryFields : function() {
		return this.mandatoryFields;
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.controller.navigationTarget#_setMandatoryFields
	 * @param {Array} fields - Array of form fields
	 * @description Set mandatory fields on the instance level  
	 * */
	_setMandatoryFields : function(fields) {
		this.mandatoryFields = this.mandatoryFields || [];
		for( var i = 0; i < fields.length; i++) {
			fields[i].isMandatory = true;
			this.mandatoryFields.push(fields[i]);
		}
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.controller.navigationTarget#_setValidationState
	 * @param {Object} oEvent - Event instance of the form field 
	 * @description Set validation state of sub view
	 * */
	_setValidationState : function() {
		var mandatoryFields = this._getMandatoryFields();
		if (mandatoryFields.length !== 0) {
			for( var i = 0; i < mandatoryFields.length; i++) {
				if (mandatoryFields[i].isMandatory === true) {
					this.isValidState = (mandatoryFields[i].getValue() !== "") ? true : false;
					if (this.isValidState === false) {
						break;
					}
				}
			}
		}
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.controller.navigationTarget#getValidationState
	 * @description Getter for getting the current validation state of sub view
	 * */
	getValidationState : function() {
		this._setValidationState(); //Set the validation state of view
		var isValidState = (this.isValidState !== undefined) ? this.isValidState : true;
		return isValidState;
	}
});