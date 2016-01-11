/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
/**
* @class facetFilter
* @memberOf sap.apf.modeler.ui.controller
* @name facetFilter
* @description controller for view.facetFilter
*/
sap.ui.controller("sap.apf.modeler.ui.controller.facetFilter", {
	/**
	* @public
	* @function
	* @name sap.apf.modeler.ui.controller.facetFilter#onInit
	* @description Called on initialization of the view.
	* Sets the static texts for all controls in UI.
	* Sets the scroll height for the container.
	* Adds style classes to all UI controls.
	* Prepares dependecies.
	* Sets dynamic text for input controls
	* */
	onInit : function() {
		this.getView().addStyleClass("sapUiSizeCompact");//For non touch devices- compact style class increases the information density on the screen by reducing control dimensions
		this.oViewData = this.getView().getViewData();
		this.getText = this.oViewData.getText;
		this.params = this.oViewData.oParams;
		this.oConfigurationHandler = this.oViewData.oConfigurationHandler;
		this.oConfigurationEditor = this.oViewData.oConfigurationEditor;
		var self = this;
		if (!this.oConfigurationEditor) {
			this.oConfigurationHandler.loadConfiguration(this.params.arguments.configId, function(configurationEditor) {
				self.oConfigurationEditor = configurationEditor;
			});
		}
		this.oTextPool = this.oConfigurationHandler.getTextPool();
		//this._getDependencies(); //get dependencies from router
		this._addConfigStyleClass();
		this._setDisplayText();
		this.setDetailData();
		//Set Mandatory Fields
		var mandatoryFields = [];
		mandatoryFields.push(this.byId("idffProperty"));
		mandatoryFields.push(this.byId("idLabel"));
		mandatoryFields.push(this.byId("idVHDefaultValues"));
		mandatoryFields.push(this.byId("idVHfunction"));
		mandatoryFields.push(this.byId("idVHEntity"));
		mandatoryFields.push(this.byId("idVHSelectProperties"));
		mandatoryFields.push(this.byId("idFREntity"));
		mandatoryFields.push(this.byId("idFRSelectProperties"));
		this._setMandatoryFields(mandatoryFields);
	},
	onAfterRendering : function() {
		this._setMandatoryFieldsVHD();
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.facetFilter#_addConfigStyleClass
	* @description Adds style classes to the UI controls
	* */
	_addConfigStyleClass : function() {
		this.byId("idValueHelpTitle").addStyleClass("formTextTitle");
		this.byId("idFilterResolutionTitle").addStyleClass("formTextTitle");
		this.byId("idScrollContent").addStyleClass("scrollContentLayout");
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.facetFilter#_addAutoCompleteFeatureOnInputs
	* @description Adds 'Auto Complete Feature' to the input fields in the view
	* using sap.apf.modeler.ui.utils.TextPoolHelper.
	* */
	_addAutoCompleteFeatureOnInputs : function() {
		if (this.oConfigurationHandler) {
			var oTextPoolHelper = new sap.apf.modeler.ui.utils.TextPoolHelper(this.oTextPool);
			var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.FACETFILTER_LABEL;
			var oDependenciesForText = {
				oTranslationFormat : oTranslationFormat,
				type : "text"
			};
			var oFacetFilterLabel = this.byId("idLabel");
			oTextPoolHelper.setAutoCompleteOn(oFacetFilterLabel, oDependenciesForText);
			//autocomplete for source
			var oDependenciesForService = {
				oConfigurationEditor : this.oConfigurationEditor,
				type : "service"
			};
			var oFacetFilterValueHelpSource = this.byId("idVHSource");
			oTextPoolHelper.setAutoCompleteOn(oFacetFilterValueHelpSource, oDependenciesForService);
			var oFacetFilterFilterResolutionSource = this.byId("idFRSource");
			oTextPoolHelper.setAutoCompleteOn(oFacetFilterFilterResolutionSource, oDependenciesForService);
		}
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.facetFilte#_setDisplayText
	* @description Sets static texts in UI
	* */
	_setDisplayText : function() {
		this.byId("idLabel").setPlaceholder(this.getText("facetFilterName"));
		this.byId("idValueHelpTitle").setText(this.getText("valueHelp"));
		this.byId("idFilterResolutionTitle").setText(this.getText("filterResolution"));
		//this.byId("idFacetFilterLabel").setText(this.getText("facetFilter"));
		this.byId("idFfPropertyLabel").setText("*" + this.getText("ffProperty") + ": ");
		this.byId("idFfLabel").setText("*" + this.getText("ffLabel") + ": ");
		this.byId("idFfAliasLabel").setText(this.getText("ffAlias") + ": ");
		this.byId("idSelectionModeLabel").setText(this.getText("ffSelectionMode") + ": ");
		this.byId("idVhSourceLabel").setText(this.getText("vhSource") + ": ");
		this.byId("idVhEntityLabel").setText(this.getText("vhEntity") + ": ");
		this.byId("idVhSelectPropertiesLabel").setText(this.getText("vhSelectProperties") + ": ");
		this.byId("idVhDefaultValueModeLabel").setText(this.getText("vhDefaultValueMode") + ": ");
		this.byId("idVhDefaultValuesLabel").setText(this.getText("vhDefaultValues") + ": ");
		this.byId("idVhFunctionLabel").setText(this.getText("function") + ": ");//Default Function
		this.byId("idVhSourceLabel1").setText(this.getText("vhSource") + ": ");
		this.byId("idVhEntityLabel1").setText(this.getText("vhEntity") + ": ");
		this.byId("idVhSelectPropertiesLabel1").setText(this.getText("vhSelectProperties") + ": ");
		this.byId("single").setText(this.getText("singleSelection"));
		this.byId("multi").setText(this.getText("multipleSelection"));
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.facetFilte#setDetailData
	* @description Sets dynamic texts for controls
	* */
	setDetailData : function() {
		var aPropertiesForControl = [];
		this._addAutoCompleteFeatureOnInputs();
		var aAllKnowProperties = this.oConfigurationEditor.getAllKnownProperties();
		aAllKnowProperties.forEach(function(property) {
			var oProp = {};
			oProp.propertyKey = property;
			oProp.propertyName = property;
			aPropertiesForControl.push(oProp);
		});
		var oDataForProperties = {
			Properties : aPropertiesForControl
		};
		var oModelForFFProp = new sap.ui.model.json.JSONModel();
		oModelForFFProp.setSizeLimit(500);
		oModelForFFProp.setData(oDataForProperties);
		this.byId("idffProperty").setModel(oModelForFFProp);
		var oModelForFFAlias = new sap.ui.model.json.JSONModel();
		oModelForFFAlias.setSizeLimit(500);
		oModelForFFAlias.setData(oDataForProperties);
		this.byId("idAlias").setModel(oModelForFFAlias);
		var DVModes = [ {
			dvKey : this.getText("fixedValues"),
			dvName : this.getText("fixedValues")
		}, {
			dvKey : this.getText("function"),
			dvName : this.getText("function")
		} ];
		var oDataForDVMode = {
			DVModes : DVModes
		};
		var oModelForDVMode = new sap.ui.model.json.JSONModel();
		oModelForDVMode.setSizeLimit(500);
		oModelForDVMode.setData(oDataForDVMode);
		this.byId("idVHDefaultValueMode").setModel(oModelForDVMode);
		if (this.params && this.params.arguments && this.params.arguments.facetFilterId) {
			this.facetFilter = this.oConfigurationEditor.getFacetFilter(this.params.arguments.facetFilterId);
		}
		if (this.facetFilter) {
			if (this.params && this.params.arguments && this.params.arguments.facetFilterId) {
				this.facetFilter = this.oConfigurationEditor.getFacetFilter(this.params.arguments.facetFilterId);
			}
			if (this.facetFilter.getProperty() !== undefined && this.facetFilter.getProperty() !== null) {
				this.byId("idffProperty").setValue(this.facetFilter.getProperty());
			}
			if (this.facetFilter.getLabelKey() !== undefined && this.facetFilter.getLabelKey() !== null && this.oTextPool.get(this.facetFilter.getLabelKey())) {
				this.byId("idLabel").setValue(this.oTextPool.get(this.facetFilter.getLabelKey()).TextElementDescription);
			} else {
				this.byId("idLabel").setValue(this.params.arguments.facetFilterId);
			}
			if (this.facetFilter.getAlias() !== undefined) {
				this.byId("idAlias").setValue(this.facetFilter.getAlias());
			}
			if (this.facetFilter.isMultiSelection() !== undefined) {
				this.byId("multi").setSelected(this.facetFilter.isMultiSelection());
				this.byId("single").setSelected(!this.facetFilter.isMultiSelection());
			}
			if (this.facetFilter.getServiceOfValueHelp() !== undefined) {
				this.byId("idVHSource").setValue(this.facetFilter.getServiceOfValueHelp());
				var sSource = this.facetFilter.getServiceOfValueHelp();
				var aAllEntitySets = [];
				var aAllEntitySetsForControll = [];
				aAllEntitySets = this.oConfigurationEditor.getAllEntitySetsOfService(sSource);
				aAllEntitySets.forEach(function(entiset) {
					var oEntitySet = {};
					oEntitySet.entityKey = entiset;
					oEntitySet.entityName = entiset;
					aAllEntitySetsForControll.push(oEntitySet);
				});
				var oDataForEntitySets = {
					Entities : aAllEntitySetsForControll
				};
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setSizeLimit(500);
				oModel.setData(oDataForEntitySets);
				this.byId("idVHEntity").setModel(oModel);
				this.byId("idVhEntityLabel").setText("*" + this.getText("vhEntity") + ": ");
				this.byId("idVhSelectPropertiesLabel").setText("*" + this.getText("vhSelectProperties") + ": ");
			}
			if (this.facetFilter.getEntitySetOfValueHelp() !== undefined) {
				this.byId("idVHEntity").setSelectedKey(this.facetFilter.getEntitySetOfValueHelp());
				var sEntity = this.facetFilter.getEntitySetOfValueHelp();
				var sServiceRoot = this.facetFilter.getServiceOfValueHelp();
				var aProperties = [];
				aPropertiesForControl = [];
				aProperties = this.oConfigurationEditor.getAllPropertiesOfEntitySet(sServiceRoot, sEntity);
				var sDefaltSelectedProperty = aProperties[0];
				aProperties.forEach(function(property) {
					var oProp = {};
					oProp.propertyKey = property;
					oProp.propertyName = property;
					aPropertiesForControl.push(oProp);
				});
				var oDataForSelProperties = {
					Properties : aPropertiesForControl
				};
				var oModelForSelProp = new sap.ui.model.json.JSONModel();
				oModelForSelProp.setSizeLimit(500);
				oModelForSelProp.setData(oDataForSelProperties);
				this.byId("idVHSelectProperties").setModel(oModelForSelProp);
			}
			if (this.facetFilter.getSelectPropertiesOfValueHelp() && this.facetFilter.getSelectPropertiesOfValueHelp().length > 0) {
				this.byId("idVHSelectProperties").setSelectedKeys(this.facetFilter.getSelectPropertiesOfValueHelp());
			}
			if (!this.facetFilter.isMultiSelection()) {
				this.byId("idVhDefaultValuesLabel").setText("*" + this.getText("vhDefaultValues") + ": ");
				this.byId("idVhFunctionLabel").setText("*" + this.getText("function") + ": ");//Default Function
			}
			if (this.facetFilter.getPreselectionFunction()) {
				this.byId("idVhDefaultValuesLabelLayout").setVisible(false);
				this.byId("idVhFunctionLabelLayout").setVisible(true);
				this.byId("idVHDefaultValueMode").setSelectedKey(this.getText("function"));
				this.byId("idVHfunction").setValue(this.facetFilter.getPreselectionFunction());
				if (!this.facetFilter.isMultiSelection()) {
					this.byId("idVHfunction").isMandatory = true;
				}
			} else {
				this.byId("idVhDefaultValuesLabelLayout").setVisible(true);
				this.byId("idVhFunctionLabelLayout").setVisible(false);
				this.byId("idVHDefaultValueMode").setSelectedKey(this.getText("fixedValues"));
				if (this.facetFilter.getPreselectionDefaults().length > 0) {
					var sPreselectionDefaults;
					if (this.facetFilter.isMultiSelection()) {
						sPreselectionDefaults = this.facetFilter.getPreselectionDefaults().join(',');
					} else {
						sPreselectionDefaults = this.facetFilter.getPreselectionDefaults()[0];
						this.byId("idVHDefaultValueMode").isMandatory = true;
					}
					this.byId("idVHDefaultValues").setValue(sPreselectionDefaults);
				}
			}
			if (this.facetFilter.getServiceOfFilterResolution() !== undefined && this.facetFilter.getServiceOfFilterResolution() !== "" && this.facetFilter.getServiceOfFilterResolution() !== null) {
				sSource = this.facetFilter.getServiceOfFilterResolution();
				this.byId("idFRSource").setValue(sSource);
				aAllEntitySets = [];
				aAllEntitySetsForControll = [];
				aAllEntitySets = this.oConfigurationEditor.getAllEntitySetsOfService(sSource);
				aAllEntitySets.forEach(function(entiset) {
					var oEntitySet = {};
					oEntitySet.entityKey = entiset;
					oEntitySet.entityName = entiset;
					aAllEntitySetsForControll.push(oEntitySet);
				});
				var oDataForEntityFRSets = {
					Entities : aAllEntitySetsForControll
				};
				var oModelForFREntity = new sap.ui.model.json.JSONModel();
				oModelForFREntity.setSizeLimit(500);
				oModelForFREntity.setData(oDataForEntityFRSets);
				this.byId("idFREntity").setModel(oModelForFREntity);
				this.byId("idVhEntityLabel1").setText("*" + this.getText("vhEntity") + ": ");
				this.byId("idVhSelectPropertiesLabel1").setText("*" + this.getText("vhSelectProperties") + ": ");
			}
			if (this.facetFilter.getEntitySetOfFilterResolution() !== undefined && this.facetFilter.getEntitySetOfFilterResolution() !== null && this.facetFilter.getEntitySetOfFilterResolution() !== "") {
				sEntity = this.facetFilter.getEntitySetOfFilterResolution();
				sServiceRoot = this.facetFilter.getServiceOfFilterResolution();
				this.byId("idFREntity").setSelectedKey(this.facetFilter.getEntitySetOfFilterResolution());
				aProperties = [];
				aPropertiesForControl = [];
				aProperties = this.oConfigurationEditor.getAllPropertiesOfEntitySet(sServiceRoot, sEntity);
				sDefaltSelectedProperty = aProperties[0];
				aProperties.forEach(function(property) {
					var oProp = {};
					oProp.propertyKey = property;
					oProp.propertyName = property;
					aPropertiesForControl.push(oProp);
				});
				var oDataForFRSelProperties = {
					Properties : aPropertiesForControl
				};
				var oModelForFRSelProp = new sap.ui.model.json.JSONModel();
				oModelForFRSelProp.setSizeLimit(500);
				oModelForFRSelProp.setData(oDataForFRSelProperties);
				this.byId("idFRSelectProperties").setModel(oModelForFRSelProp);
			}
			if (this.facetFilter.getSelectPropertiesOfFilterResolution() !== undefined && this.facetFilter.getSelectPropertiesOfFilterResolution().length > 0) {
				this.byId("idFRSelectProperties").setSelectedKeys(this.facetFilter.getSelectPropertiesOfFilterResolution());
			}
		} else {
			var sFacetFilterId = this.oConfigurationEditor.createFacetFilter();
			this.facetFilter = this.oConfigurationEditor.getFacetFilter(sFacetFilterId);
			this.facetFilter.setMultiSelection(true);
			this.byId("multi").setSelected(true);
			var facetFilterInfo = {
				id : sFacetFilterId
			};
			this.oViewData.updateSelectedNode(facetFilterInfo);
		}
	},
	handleChangeForProperty : function(oEvent) {
		this.oConfigurationEditor.setIsUnsaved();
		var sProperty = this.byId("idffProperty").getValue().trim();
		if (sProperty !== "" && sProperty !== null) {
			this.facetFilter.setProperty(sProperty);
		}
	},
	handleChangeForLabel : function(oEvent) {
		this.oConfigurationEditor.setIsUnsaved();
		var self = this;
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.FACETFILTER_LABEL;
		var sFacetFilterLabel = this.byId("idLabel").getValue().trim();
		var sFacetFilterLabelId = self.oTextPool.setText(sFacetFilterLabel, oTranslationFormat);
		if (sFacetFilterLabel !== "" && sFacetFilterLabel !== null) {
			this.facetFilter.setLabelKey(sFacetFilterLabelId);
		}
		var facetFilterInfo = {};
		facetFilterInfo.name = sFacetFilterLabel;
		facetFilterInfo.id = this.facetFilter.getId();
		if (sFacetFilterLabel !== "" && sFacetFilterLabel !== null) {
			this.oViewData.updateSelectedNode(facetFilterInfo, this.bIsNew);
		}
		var sTitle = this.getText("facetFilter") + ": " + sFacetFilterLabel;
		this.oViewData.updateTitleAndBreadCrumb(sTitle);
	},
	handleChangeForAlias : function() {
		this.oConfigurationEditor.setIsUnsaved();
		var sAlias = this.byId("idAlias").getValue().trim();
		this.facetFilter.setAlias(sAlias);
	},
	_changeInSelectionMode : function() {
		if (!this.facetFilter.isMultiSelection()) {
			var aPSDafaults = this.facetFilter.getPreselectionDefaults();
			if (aPSDafaults && aPSDafaults.length > 0) {
				this.facetFilter.setPreselectionDefaults([ aPSDafaults[0] ]);
				if (this.byId("idVHDefaultValues")) {
					this.byId("idVHDefaultValues").setValue(aPSDafaults[0]);
				}
			}
		}
	},
	handleChangeForSelectionModeSingle : function() {
		this.byId("idVhDefaultValuesLabel").setText("*" + this.getText("vhDefaultValues") + ": ");
		this.byId("idVhFunctionLabel").setText("*" + this.getText("function") + ": ");//Default Function
		this.oConfigurationEditor.setIsUnsaved();
		this.facetFilter.setMultiSelection(false);
		if (jQuery(this.byId("idVHfunction").getDomRef()).length >= 1) {
			this.byId("idVHfunction").isMandatory = true;
			this.byId("idVHDefaultValues").isMandatory = false;
		} else {
			this.byId("idVHfunction").isMandatory = false;
			this.byId("idVHDefaultValues").isMandatory = true;
		}
		this._changeInSelectionMode();
	},
	handleChangeForSelectionModeMulti : function() {
		this.byId("idVhDefaultValuesLabel").setText(this.getText("vhDefaultValues") + ": ");
		this.byId("idVhFunctionLabel").setText(this.getText("function") + ": ");//Default Function
		this.oConfigurationEditor.setIsUnsaved();
		this.facetFilter.setMultiSelection(true);
		if (jQuery(this.byId("idVHfunction").getDomRef()).length >= 1) {
			this.byId("idVHfunction").isMandatory = false;
		} else {
			this.byId("idVHDefaultValues").isMandatory = false;
		}
	},
	_checkValidationStateForService : function(bVHService, param) {
		var self = this;
		var sSource, aOldSelProp, oValidVHService = {
			source : undefined,
			entitySet : undefined,
			selectProperty : undefined
		};
		if (bVHService) {
			sSource = this.byId("idVHSource").getValue().trim();
		} else {
			sSource = this.byId("idFRSource").getValue().trim();
		}
		var bServiceRegistered = this.oConfigurationEditor.registerService(sSource);
		var aAllEntitySets = [];
		var aAllEntitySetsForControll = [];
		if (bServiceRegistered) {
			oValidVHService.source = sSource;
			aAllEntitySets = this.oConfigurationEditor.getAllEntitySetsOfService(sSource);
			var sSelectedEntity;
			if (param === "entitySet" || param === "selectProperties") {
				if (bVHService) {
					sSelectedEntity = this.byId("idVHEntity").getSelectedKey();
				} else {
					sSelectedEntity = this.byId("idFREntity").getSelectedKey();
				}
			} else {
				if (bVHService) {
					sSelectedEntity = this.facetFilter.getEntitySetOfValueHelp();
				} else {
					sSelectedEntity = this.facetFilter.getEntitySetOfFilterResolution();
				}
			}
			if (sSelectedEntity) {
				aAllEntitySets.forEach(function(entitySet) {
					if (sSelectedEntity === entitySet) {
						oValidVHService.entitySet = sSelectedEntity;
						if (param === "source") {
							if (bVHService) {
								self.byId("idVHEntity").setSelectedKey(sSelectedEntity);
							} else {
								self.byId("idFREntity").setSelectedKey(sSelectedEntity);
							}
						}
					}
				});
				var aSelectProperties, aCommonProperty = [];
				if (param === "selectProperties") {
					if (bVHService) {
						aSelectProperties = this.byId("idVHSelectProperties").getSelectedKeys();
					} else {
						aSelectProperties = this.byId("idFRSelectProperties").getSelectedKeys();
					}
				} else {
					if (bVHService) {
						aSelectProperties = this.facetFilter.getSelectPropertiesOfValueHelp();
					} else {
						aSelectProperties = this.facetFilter.getSelectPropertiesOfFilterResolution();
					}
				}
				var aProperties = this.oConfigurationEditor.getAllPropertiesOfEntitySet(sSource, sSelectedEntity);
				aProperties.forEach(function(propertyFromEntity) {
					aSelectProperties.forEach(function(propertyFromControl) {
						if (propertyFromControl === propertyFromEntity) {
							aCommonProperty.push(propertyFromControl);
						}
					});
				});
				if (aCommonProperty.length > 0) {
					oValidVHService.selectProperty = aCommonProperty;
					if (param !== "selectProperties") {
						if (bVHService) {
							this.byId("idVHSelectProperties").setSelectedKeys(aCommonProperty);
						} else {
							this.byId("idFRSelectProperties").setSelectedKeys(aCommonProperty);
						}
					}
				}
			}
		}
		if (oValidVHService.selectProperty && oValidVHService.entitySet && oValidVHService.source) {
			if (bVHService) {
				this.facetFilter.setServiceOfValueHelp(oValidVHService.source);
				this.facetFilter.setEntitySetOfValueHelp(oValidVHService.entitySet);
				aOldSelProp = this.facetFilter.getSelectPropertiesOfValueHelp();
				aOldSelProp.forEach(function(property) {
					self.facetFilter.removeSelectPropertyOfValueHelp(property);
				});
				oValidVHService.selectProperty.forEach(function(property) {
					self.facetFilter.addSelectPropertyOfValueHelp(property);
				});
			} else {
				this.facetFilter.setServiceOfFilterResolution(oValidVHService.source);
				this.facetFilter.setEntitySetOfFilterResolution(oValidVHService.entitySet);
				aOldSelProp = this.facetFilter.getSelectPropertiesOfFilterResolution();
				aOldSelProp.forEach(function(property) {
					self.facetFilter.removeSelectPropertyOfFilterResolution(property);
				});
				oValidVHService.selectProperty.forEach(function(property) {
					self.facetFilter.addSelectPropertyOfFilterResolution(property);
				});
			}
		}
	},
	handleChangeForVHSource : function() {
		var self = this;
		this.oConfigurationEditor.setIsUnsaved();
		var sSource = this.byId("idVHSource").getValue().trim();
		var bServiceRegistered;
		if (sSource) {
			bServiceRegistered = this.oConfigurationEditor.registerService(sSource);
			if (bServiceRegistered) {
				this.byId("idVhEntityLabel").setText("*" + this.getText("vhEntity") + ": ");
				this.byId("idVhSelectPropertiesLabel").setText("*" + this.getText("vhSelectProperties") + ": ");
			}
		} else {
			this.facetFilter.setServiceOfValueHelp(sSource);
			this.facetFilter.setEntitySetOfValueHelp(undefined);
			var aOldSelProp = this.facetFilter.getSelectPropertiesOfValueHelp();
			aOldSelProp.forEach(function(property) {
				self.facetFilter.removeSelectPropertyOfValueHelp(property);
			});
			this.byId("idVhEntityLabel").setText(this.getText("vhEntity") + ": ");
			this.byId("idVhSelectPropertiesLabel").setText(this.getText("vhSelectProperties") + ": ");
		}
		var sDefaultEntitySetKey, aAllEntitySets = [], aAllEntitySetsForControll = [];
		aAllEntitySets = this.oConfigurationEditor.getAllEntitySetsOfService(sSource);
		aAllEntitySets.forEach(function(entiset) {
			var oEntitySet = {};
			oEntitySet.entityKey = entiset;
			oEntitySet.entityName = entiset;
			aAllEntitySetsForControll.push(oEntitySet);
		});
		var oDataForEntitySets = {
			Entities : aAllEntitySetsForControll
		};
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setSizeLimit(500);
		oModel.setData(oDataForEntitySets);
		this.byId("idVHEntity").setModel(oModel);
		var aProperties = [], aPropertiesForControl = [];
		if (aAllEntitySets.length >= 1) {
			this.byId("idVHEntity").setSelectedKey(aAllEntitySets[0]);
			this.facetFilter.setEntitySetOfValueHelp(aAllEntitySets[0]);
			aProperties = this.oConfigurationEditor.getAllPropertiesOfEntitySet(sSource, aAllEntitySets[0]);
			aProperties.forEach(function(property) {
				var oProp = {};
				oProp.propertyKey = property;
				oProp.propertyName = property;
				aPropertiesForControl.push(oProp);
			});
		}
		//set model for select properties
		var oDataForProperties = {
			Properties : aPropertiesForControl
		};
		var oModelForSelProp = new sap.ui.model.json.JSONModel();
		oModelForSelProp.setSizeLimit(500);
		oModelForSelProp.setData(oDataForProperties);
		this.byId("idVHSelectProperties").setModel(oModelForSelProp);
		this._checkValidationStateForService(true, "source");
	},
	handleChangeForVHEntity : function() {
		var self = this;
		this.oConfigurationEditor.setIsUnsaved();
		var sEntity = this.byId("idVHEntity").getSelectedKey();
		var sServiceRoot = this.byId("idVHSource").getValue().trim();
		var aProperties = [], aPropertiesForControl = [];
		if (sServiceRoot && sServiceRoot !== null && sServiceRoot !== "") {
			aProperties = this.oConfigurationEditor.getAllPropertiesOfEntitySet(sServiceRoot, sEntity);
			aProperties.forEach(function(property) {
				var oProp = {};
				oProp.propertyKey = property;
				oProp.propertyName = property;
				aPropertiesForControl.push(oProp);
			});
			var oDataForProperties = {
				Properties : aPropertiesForControl
			};
			var oModelForSelProp = new sap.ui.model.json.JSONModel();
			oModelForSelProp.setSizeLimit(500);
			oModelForSelProp.setData(oDataForProperties);
			this.byId("idVHSelectProperties").setModel(oModelForSelProp);
			this._checkValidationStateForService(true, "entitySet");
		}
	},
	handleChangeForVHSelectProperties : function() {
		this.oConfigurationEditor.setIsUnsaved();
		this._checkValidationStateForService(true, "selectProperties");
	},
	_setMandatoryFieldsVHD : function() {
		if (!this.facetFilter.isMultiSelection()) {
			if (jQuery(this.byId("idVHfunction").getDomRef()).length >= 1) {
				this.byId("idVHfunction").isMandatory = true;
				this.byId("idVHDefaultValues").isMandatory = false;
			} else {
				this.byId("idVHfunction").isMandatory = false;
				this.byId("idVHDefaultValues").isMandatory = true;
			}
		} else {
			this.byId("idVHfunction").isMandatory = false;
			this.byId("idVHDefaultValues").isMandatory = false;
		}
	},
	handleChangeForDVMode : function() {
		var sDVMode = this.byId("idVHDefaultValueMode").getSelectedKey();
		if (sDVMode === this.getText("fixedValues")) {
			this.byId("idVhDefaultValuesLabelLayout").setVisible(true);
			this.byId("idVhFunctionLabelLayout").setVisible(false);
			this.facetFilter.removePreselectionFunction();
			this.byId("idVHfunction").setValue("");
		} else {
			this.byId("idVhDefaultValuesLabelLayout").setVisible(false);
			this.byId("idVhFunctionLabelLayout").setVisible(true);
			this.facetFilter.removePreselectionDefaults();
			this.byId("idVHDefaultValues").setValue("");
		}
		this._setMandatoryFieldsVHD();
	},
	handleChangeForVHdefaultValues : function(oEvent) {
		this.oConfigurationEditor.setIsUnsaved();
		var sPreselectionDefaults = this.byId("idVHDefaultValues").getValue().trim();
		var aPreselectionDefaults = sPreselectionDefaults.split(',');
		var aValidPreselectionDefaults = [];
		aPreselectionDefaults.forEach(function(defaultValue) {
			var sValidString = defaultValue.trim();
			if (sValidString) {
				aValidPreselectionDefaults.push(sValidString);
			}
		});
		if (this.facetFilter.isMultiSelection()) {
			this.byId("idVHDefaultValues").isMandatory = false;
			this.facetFilter.setPreselectionDefaults(aValidPreselectionDefaults);
		} else {
			this.byId("idVHDefaultValues").isMandatory = true;
			if (aValidPreselectionDefaults.length > 0) {
				this.facetFilter.setPreselectionDefaults([ aValidPreselectionDefaults[0] ]);//for single selection only first value is sent
			}
		}
	},
	handleChangeForPreselectionFunction : function(oEvent) {
		this.oConfigurationEditor.setIsUnsaved();
		var sPreselectionFunction = this.byId("idVHfunction").getValue().trim();
		if (this.facetFilter.isMultiSelection()) {
			this.byId("idVHfunction").isMandatory = false;
			if (sPreselectionFunction) {
				this.facetFilter.setPreselectionFunction(sPreselectionFunction);
			}
		} else {
			this.byId("idVHfunction").isMandatory = true;
			if (sPreselectionFunction) {
				this.facetFilter.setPreselectionFunction(sPreselectionFunction);
			}
		}
	},
	handleChangeForFRSource : function() {
		var self = this;
		this.oConfigurationEditor.setIsUnsaved();
		var sSource = this.byId("idFRSource").getValue().trim();
		var bServiceRegistered;
		var aAllEntitySets = [];
		var aAllEntitySetsForControll = [];
		if (sSource) {
			bServiceRegistered = this.oConfigurationEditor.registerService(sSource);
			if (bServiceRegistered) {
				this.byId("idVhEntityLabel1").setText("*" + this.getText("vhEntity") + ": ");
				this.byId("idVhSelectPropertiesLabel1").setText("*" + this.getText("vhSelectProperties") + ": ");
			}
		} else {
			this.facetFilter.setServiceOfFilterResolution(sSource);
			this.facetFilter.setEntitySetOfFilterResolution(undefined);
			var aOldSelProp = this.facetFilter.getSelectPropertiesOfFilterResolution();
			aOldSelProp.forEach(function(property) {
				self.facetFilter.removeSelectPropertyOfFilterResolution(property);
			});
			this.byId("idVhEntityLabel1").setText(this.getText("vhEntity") + ": ");
			this.byId("idVhSelectPropertiesLabel1").setText(this.getText("vhSelectProperties") + ": ");
		}
		aAllEntitySets = this.oConfigurationEditor.getAllEntitySetsOfService(sSource);
		aAllEntitySets.forEach(function(entiset) {
			var oEntitySet = {};
			oEntitySet.entityKey = entiset;
			oEntitySet.entityName = entiset;
			aAllEntitySetsForControll.push(oEntitySet);
		});
		var oDataForEntitySets = {
			Entities : aAllEntitySetsForControll
		};
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setSizeLimit(500);
		oModel.setData(oDataForEntitySets);
		this.byId("idFREntity").setModel(oModel);
		var aProperties = [], aPropertiesForControl = [];
		if (aAllEntitySets.length >= 1) {
			this.byId("idFREntity").setSelectedKey(aAllEntitySets[0]);
			this.facetFilter.setEntitySetOfFilterResolution(aAllEntitySets[0]);
			aProperties = this.oConfigurationEditor.getAllPropertiesOfEntitySet(sSource, aAllEntitySets[0]);
			aProperties.forEach(function(property) {
				var oProp = {};
				oProp.propertyKey = property;
				oProp.propertyName = property;
				aPropertiesForControl.push(oProp);
			});
		}
		var oDataForProperties = {
			Properties : aPropertiesForControl
		};
		var oModelForSelProp = new sap.ui.model.json.JSONModel();
		oModelForSelProp.setSizeLimit(500);
		oModelForSelProp.setData(oDataForProperties);
		this.byId("idFRSelectProperties").setModel(oModelForSelProp);
		this._checkValidationStateForService(false, "source");
	},
	handleChangeForFREntity : function() {
		var self = this;
		this.oConfigurationEditor.setIsUnsaved();
		var sEntity = this.byId("idFREntity").getSelectedKey();
		var sServiceRoot = this.byId("idFRSource").getValue().trim();
		var aProperties = [], aPropertiesForControl = [];
		if (sServiceRoot && sServiceRoot !== null && sServiceRoot !== "") {
			aProperties = this.oConfigurationEditor.getAllPropertiesOfEntitySet(sServiceRoot, sEntity);
			var sDefaltSelectedProperty = aProperties[0];
			aProperties.forEach(function(property) {
				var oProp = {};
				oProp.propertyKey = property;
				oProp.propertyName = property;
				aPropertiesForControl.push(oProp);
			});
			var oDataForProperties = {
				Properties : aPropertiesForControl
			};
			var oModelForSelProp = new sap.ui.model.json.JSONModel();
			oModelForSelProp.setSizeLimit(500);
			oModelForSelProp.setData(oDataForProperties);
			this.byId("idFRSelectProperties").setModel(oModelForSelProp);
			this._checkValidationStateForService(false, "entitySet");
		}
	},
	handleChangeForFRSelectProperties : function() {
		this.oConfigurationEditor.setIsUnsaved();
		this._checkValidationStateForService(false, "selectProperties");
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.category#_setSourceValidationState
	* @description set mandatory fields boolean for source
	* */
	_setSourceValidationState : function() {
		var sSource = this.byId("idVHSource").getValue().trim();
		var sFRSource = this.byId("idFRSource").getValue().trim();
		var bServiceRegistered;
		var bFRServiceRegistered;
		if (sSource !== "") {
			bServiceRegistered = this.oConfigurationEditor.registerService(sSource);
			if (bServiceRegistered) {
				this.byId("idVHEntity").isMandatory = true;
				this.byId("idVHSelectProperties").isMandatory = true;
			} else {
				this.byId("idVHEntity").isMandatory = false;
				this.byId("idVHSelectProperties").isMandatory = false;
			}
		} else {
			this.byId("idVHEntity").isMandatory = false;
			this.byId("idVHSelectProperties").isMandatory = false;
		}
		if (sFRSource) {
			bFRServiceRegistered = this.oConfigurationEditor.registerService(sSource);
			if (bFRServiceRegistered) {
				this.byId("idFREntity").isMandatory = true;
				this.byId("idFRSelectProperties").isMandatory = true;
			} else {
				this.byId("idFREntity").isMandatory = false;
				this.byId("idFRSelectProperties").isMandatory = false;
			}
		} else {
			this.byId("idFREntity").isMandatory = false;
			this.byId("idFRSelectProperties").isMandatory = false;
		}
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.category#_setMandatoryFieldss
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
	* @name sap.apf.modeler.ui.controller.category#_getMandatoryFields
	* @param {Object} oEvent - Event instance of the form field 
	 * @description getter for mandatory fields
	* */
	_getMandatoryFields : function() {
		return this.mandatoryFields;
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.category#_setValidationState
	* @param {Object} oEvent - Event instance of the form field 
	 * @description Set validation state of sub view
	* */
	_setValidationState : function() {
		var mandatoryFields = this._getMandatoryFields();
		for( var i = 0; i < mandatoryFields.length; i++) {
			if (mandatoryFields[i].isMandatory === true) {
				if (typeof mandatoryFields[i].getSelectedKeys === "function") {
					this.isValidState = (mandatoryFields[i].getSelectedKeys().length >= 1) ? true : false;
				} else if (typeof mandatoryFields[i].getValue === "function") {
					this.isValidState = (mandatoryFields[i].getValue() !== "") ? true : false;
				} else {
					this.isValidState = (mandatoryFields[i].getSelectedKey().length >= 1) ? true : false;
				}
				if (this.isValidState === false) {
					break;
				}
			}
		}
	},
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.controller.category#getValidationState
	* @description Getter for getting the current validation state of sub view
	* */
	getValidationState : function() {
		this._setSourceValidationState(); //Set mandatory state for source
		this._setValidationState(); //Set the validation state of view
		var isValidState = (this.isValidState !== undefined) ? this.isValidState : true;
		return isValidState;
	}
});
