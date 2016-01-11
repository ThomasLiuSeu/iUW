/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require('sap.apf.ui.utils.helper');
/**
 *@class stepGallery
 *@name stepGallery
 *@memberOf sap.apf.ui.reuse.controller
 *@description controller for step Gallery 
 * 
 */
sap.ui.controller("sap.apf.ui.reuse.controller.stepGallery", {
	/**
	 *@this {sap.apf.ui.reuse.controller.stepGallery}
	 */
	/**
	*@memberOf sap.apf.ui.reuse.controller.stepGallery
	*@method getGalleryElementsData 
	*@description Returns array needed to draw step gallery content.
	*@returns   {object} jsonData
	*/
	getGalleryElementsData : function() {
		var self = this;
		var aGalleryElements = [];
		var aCategories = this.oCoreApi.getCategories();
		var label = this.oCoreApi.getTextNotHtmlEncoded("label");
		var steps = this.oCoreApi.getTextNotHtmlEncoded("steps");
		var category = this.oCoreApi.getTextNotHtmlEncoded("category");
		var oMessageObject;
		if (aCategories.length === 0) {
			oMessageObject = this.oCoreApi.createMessageObject({
				code : "6001",
				aParameters : [ "Categories" ]
			});
			this.oCoreApi.putMessage(oMessageObject);
		}
		var i;
		for(i = 0; i < aCategories.length; i++) {
			var oGalleryElement = {};
			var oCategory = aCategories[i];
			var oCategoryDetails = {};
			var categoryName;
			if (!oCategory.label) {
				oMessageObject = this.oCoreApi.createMessageObject({
					code : "6002",
					aParameters : [ label, category + ": " + categoryName ]
				});
				this.oCoreApi.putMessage(oMessageObject);
			} else {
				categoryName = this.oCoreApi.getTextNotHtmlEncoded(oCategory.label);
				oCategoryDetails.title = this.oCoreApi.getTextNotHtmlEncoded(oCategory.label);
			}
			oCategoryDetails.id = oCategory.id;
			oGalleryElement.categoryDetails = oCategoryDetails;
			oGalleryElement.stepTemplates = [];
			oCategory.stepTemplates.forEach(function(oStepTemplate){
				var oStepDetail = {};
				if (!oStepTemplate.title) {
					oMessageObject = self.oCoreApi.createMessageObject({
						code : "6003",
						aParameters : [ "Title" ]
					});
					self.oCoreApi.putMessage(oMessageObject);
				} else {
					oStepDetail.maintitle = self.oCoreApi.getTextNotHtmlEncoded(oStepTemplate.title);
				}
				oStepDetail.id = oStepTemplate.id;
				oStepDetail.representationtypes = oStepTemplate.getRepresentationInfo();
				oStepDetail.representationtypes.forEach(function(oRepresentation) {
					oRepresentation.title = self.oCoreApi.getTextNotHtmlEncoded(oRepresentation.label);
					if (oRepresentation.parameter && oRepresentation.parameter.orderby) { //if orderby has a value then only get the sort description
						var representationSortDetail = new sap.apf.ui.utils.Helper(self.oCoreApi).getRepresentationSortInfo(oRepresentation);
						oRepresentation.sortDescription = representationSortDetail;
					}
				});
				oStepDetail.defaultRepresentationType = oStepDetail.representationtypes[0];
				oGalleryElement.stepTemplates.push(oStepDetail);
			});
			aGalleryElements.push(oGalleryElement);
		}
		var aStepTemplates = this.oCoreApi.getStepTemplates();
		if (aStepTemplates.length === 0) {
			oMessageObject = this.oCoreApi.createMessageObject({
				code : "6002",
				aParameters : [ steps, category ]
			});
			this.oCoreApi.putMessage(oMessageObject);
		}
//		var j, k;
//		for(i = 0; i < aStepTemplates.length; i++) {
//			var oStepTemplate = aStepTemplates[i];
//			aCategories = oStepTemplate.categories;
//			for(j = 0; j < aCategories.length; j++) {
//				var Category = aCategories[j];
//				for(k = 0; k < aGalleryElements.length; k++) {
//					var galleryElement = aGalleryElements[k];
//					if (galleryElement.categoryDetails.id === Category.id) {
// (BEG MOVE UP)		
//						var oStepDetail = {};
//						if (!oStepTemplate.title) {
//							oMessageObject = this.oCoreApi.createMessageObject({
//								code : "6003",
//								aParameters : [ "Title" ]
//							});
//							this.oCoreApi.putMessage(oMessageObject);
//						} else {
//							oStepDetail.maintitle = this.oCoreApi.getTextNotHtmlEncoded(oStepTemplate.title);
//						}
//						oStepDetail.id = oStepTemplate.id;
//						oStepDetail.representationtypes = oStepTemplate.getRepresentationInfo();
//						oStepDetail.representationtypes.forEach(function(oRepresentation) {
//							oRepresentation.title = self.oCoreApi.getTextNotHtmlEncoded(oRepresentation.label);
//							if (oRepresentation.parameter && oRepresentation.parameter.orderby) { //if orderby has a value then only get the sort description
//								var representationSortDetail = new sap.apf.ui.utils.Helper(self.oCoreApi).getRepresentationSortInfo(oRepresentation);
//								oRepresentation.sortDescription = representationSortDetail;
//							}
//						});
//						oStepDetail.defaultRepresentationType = oStepDetail.representationtypes[0];
//						galleryElement.stepTemplates.push(oStepDetail);
// (END MOVE UP)								
//					}
//				}
//			}
//		}
		var jsonData = {
			GalleryElements : aGalleryElements
		};
		return jsonData;
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.stepGallery
	*@method onInit 
	*@description Bind gallery elements data to step gallery view.
	*/
	onInit : function() {
		this.oCoreApi = this.getView().getViewData().oCoreApi;
		this.oUiApi = this.getView().getViewData().uiApi;
		var aGalleryElements = this.getGalleryElementsData().GalleryElements;
		var oModel = new sap.ui.model.json.JSONModel({
			"GalleryElements" : aGalleryElements
		});
		this.getView().setModel(oModel, "json");
	},
	/**
	 *@memberOf sap.apf.ui.reuse.controller.stepGallery
	 *@method getStepDetails
	 *@param {string} index of the category in the binding of step gallery dialog
	 *@param {string} index of the step in the binding of step gallery dialog
	 *@return details of a step i.e. id,representationTypes etc
	 */
	getStepDetails : function(categoryIndex, stepIndex) {
		var aGalleryElements = this.getGalleryElementsData().GalleryElements;
		var stepDetails = aGalleryElements[categoryIndex].stepTemplates[stepIndex];
		return stepDetails;
	},
	openHierarchicalSelectDialog : function() {
		if (this.oHierchicalSelectDialog) {
			this.oHierchicalSelectDialog.destroy();
		}
		this.oHierchicalSelectDialog = new sap.ui.jsfragment("sap.apf.ui.reuse.fragment.stepGallery", this);
		this.oHierchicalSelectDialog.setModel(this.getView().getModel("json"), "json");
		this.oHierchicalSelectDialog.open();
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.stepGallery
	*@method onStepPress
	*@param {string} sId Id for step being added
	*@param {object} oRepresentationType Representation
	*@description creates new step.
	*/
	onStepPress : function(sId, oRepresentationType) {
		this.oHierchicalSelectDialog.close();
		this.oUiApi.getLayoutView().setBusy(true);
		this.oCoreApi.createStep(sId, this.oUiApi.getAnalysisPath().getController().callBackForUpdatePathAndSetLastStepAsActive.bind(this.oUiApi.getAnalysisPath().getController()), oRepresentationType);
		this.oUiApi.getLayoutView().setBusy(true);
		this.oUiApi.getAnalysisPath().getController().refresh(-1);
	}
});