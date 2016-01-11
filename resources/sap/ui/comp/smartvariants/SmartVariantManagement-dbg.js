/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartvariants.SmartVariantManagement.
sap.ui.define(['jquery.sap.global', 'sap/ui/comp/library', './PersonalizableInfo', 'sap/ui/comp/variants/VariantItem', 'sap/ui/comp/variants/VariantManagement', 'sap/ui/core/ValueState', 'sap/ui/fl/Change', 'sap/ui/fl/Persistence', 'sap/ui/fl/registry/Settings', 'sap/m/MessageBox'],
	function(jQuery, library, PersonalizableInfo, VariantItem, VariantManagement, ValueState, Change, Persistence, Settings, MessageBox) {
	"use strict";


	
	/**
	 * Constructor for a new smartvariants/SmartVariantManagement.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * SmartVariantManagement is a specialization of the VariantManagementControl and communicates with the flexibility layer to manage the variants.
	 * @extends sap.ui.comp.variants.VariantManagement
	 *
	 * @author Franz Müller, Jan Heiler
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartvariants.SmartVariantManagement
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SmartVariantManagement = VariantManagement.extend("sap.ui.comp.smartvariants.SmartVariantManagement", /** @lends sap.ui.comp.smartvariants.SmartVariantManagement.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		aggregations : {
	
			/**
			 * All controls that are interested and rely on variant handling have to be registered by this aggregation
			 */
			personalizableControls : {type : "sap.ui.comp.smartvariants.PersonalizableInfo", multiple : true, singularName : "personalizableControl"}
		},
		events : {
	
			/**
			 * Once the the SmartVariantControl has been initialized, and especially after retrieving the variants from the backend system, the registered consumers receive the information that this phase has been completed
			 */
			initialise : {}, 
	
			/**
			 * Fired after a variant is saved. This event can be used to retrieve the id of the saved variant.
			 */
			afterSave : {}
		}
	}});
	
	
	/**
	 * set the current Variant. In case STANDARD-variant is the current one, and empty string will be returned.
	 *
	 * @name sap.ui.comp.smartvariants.SmartVariantManagement#setCurrentVariantId
	 * @function
	 * @param {string} sSVariantKey
	 *         the variant key
	 * @param {boolean} bBDoNotApplyVariant
	 *         if set to true the applyVariant method will not be executed yet. Relevant during navigation, where the pers-controller sets the variant id, but the initialise - sequence triggers the applyVariant method
	 * @type void
	 * @public
	 * @since 1.28.1
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * retrieve the current Variant. In case STANDARD-variant is the current one, and empty string will be returned.
	 *
	 * @name sap.ui.comp.smartvariants.SmartVariantManagement#getCurrentVariantId
	 * @function
	 * @type string
	 * @public
	 * @since 1.28.1
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	
	
	SmartVariantManagement._mComponentReadError = {};
	
	/**
	 * control initialization
	 * 
	 * @public
	 * @since 1.26.1
	 */
	SmartVariantManagement.prototype.init = function() {
		VariantManagement.prototype.init.apply(this); // Call base class
	
		this._mStandardVariants = {};
		this._mControlPersistence = {};
		this._mControlComponent = {};
		
		this._aPersonalizableControls = null;
		
		this._bIsInitialized = false;
	
		if (this.setLifecycleSupport) {
			this.setLifecycleSupport(true);
		}
		this._setBackwardCompatibility(false);
	};
	
	/**
	 * all controls interested and relying on variant handling have to be registered by this association
	 * 
	 * @public
	 * @param {sap.ui.comp/smartvariants/PersonalizableInfo} oCurrentControlInfo control providing the required aggregation for flex-layer
	 */
	SmartVariantManagement.prototype.addPersonalizableControl = function(oCurrentControlInfo) {
		this.addAggregation("personalizableControls", oCurrentControlInfo, true);
	
		var sControlId = oCurrentControlInfo.getControl();
	
		if (sControlId) {
			var oControl = sap.ui.getCore().getControl(sControlId);
			this._mControlPersistence[oControl] = new Persistence(oControl, oCurrentControlInfo.getKeyName());
	
			this._mControlComponent[oControl] = sap.ui.fl.Utils.getComponentClassName(oControl);
		}
	};
	
	/**
	 * all controls interested and relying on variant handling have to be registered by this association
	 * 
	 * @public
	 * @param {sap.ui.core.Control} oControl current control
	 * @param {string} sKey the variant key
	 * @returns {object} json object representing the content of the variant
	 */
	SmartVariantManagement.prototype.getVariantContent = function(oControl, sKey) {
		var oContent = null;
	
		if (sKey === this.STANDARDVARIANTKEY) {
			oContent = this._getStandardVariant(oControl);
	
		} else {
	
			var oVariant = this._getVariant(oControl, sKey);
			if (oVariant) {
				oContent = oVariant.getContent();
			}
		}
	
		return oContent;
	};
	
	/**
	 * retrieves and returns the variant with the requested id
	 * 
	 * @private
	 * @param {sap.ui.core.Control} oCurrentControl current control
	 * @param {string} id the variant key
	 * @returns {sap.ui.fl.Change} object representing the variant
	 */
	SmartVariantManagement.prototype._getVariant = function(oCurrentControl, id) {
	
		var oChange = null;
	
		if (oCurrentControl) {
	
			var oPersistence = this._mControlPersistence[oCurrentControl];
			if (oPersistence) {
				oChange = oPersistence.getChange(id);
			}
		}
	
		return oChange;
	};
	
	/**
	 * returns all registered controls 'currentVariant' - providers
	 * 
	 * @private
	 * @returns {array} a list of all registered controls
	 */
	SmartVariantManagement.prototype._getAllPersonalizableControls = function() {
		var i;
		var oControl = null;

		if (!this._aPersonalizableControls) {

			this._aPersonalizableControls = [];

			var aPersInfos = this.getPersonalizableControls();
			if (aPersInfos) {
				for (i = 0; i < aPersInfos.length; i++) {
					oControl = sap.ui.getCore().getControl(aPersInfos[i].getControl());
					if (oControl) {
						this._aPersonalizableControls.push({
							control: oControl,
							type: aPersInfos[i].getType(),
							dataSource: aPersInfos[i].getDataSource(),
							persistence: this._mControlPersistence[oControl],
							keyName: aPersInfos[i].getKeyName()
						});
					}
				}
			}
		}

		return this._aPersonalizableControls;
	};
	
	/**
	 * create entries into the variant management control, based on the list of variants
	 * 
	 * @private
	 * @param {map} mVariants list of variants, as determined by the flex layer
	 * @param {object} oCurrentControlInfo describes the personalizable control
	 * @returns {array} containing all variant keys
	 */
	SmartVariantManagement.prototype._createVariantEntries = function(mVariants, oCurrentControlInfo) {
	
		var n = null;
		var sVariantKey;
		var oVariant, oVariantItem;
		var aVariantKeys = [];
	
		this.removeAllItems();
	
		if (mVariants) {
			for (n in mVariants) {
				if (n) {
					oVariant = mVariants[n];
					if (oVariant.isVariant()) {
						oVariantItem = new VariantItem({
							key: oVariant.getId(),
							text: oVariant.getText("variantName"),
							global: !oVariant.isUserDependent(),
							executeOnSelection: this._getExecuteOnSelection(oVariant),
							lifecycleTransportId: oVariant.getRequest(),
							lifecyclePackage: oVariant.getPackage(),
							namespace: oVariant.getNamespace(),
							readOnly: oVariant.isReadOnly(),
							labelReadOnly: oVariant.isLabelReadOnly()
						});
						this.addVariantItem(oVariantItem);
	
						aVariantKeys.push(oVariant.getId());
					}
				}
			}
		}
	
		if (oCurrentControlInfo) {
			sVariantKey = this._getDefaultVariantKey(oCurrentControlInfo);
			if (sVariantKey) {
				this.setInitialSelectionKey(sVariantKey); // set the current selected variant
			}
		}
	
		if (this._isVariantDownport(oCurrentControlInfo)) {
			this._enableManualVariantKey(true);
		}
	
		return aVariantKeys;
	};
	
	/**
	 * retrieve the list of known variants via access to VM
	 * 
	 * @public
	 * @param {Function} fCallBack will be called once the promise is full filled
	 */
	SmartVariantManagement.prototype.getVariantsInfo = function(fCallBack) {
	
		if (!fCallBack) {
			jQuery.sap.log.error("'getVariantsInfo' failed . Expecting callBack not passed.");
			return;
		}
	
		var n = null;
		var oVariant;
		var aVariants = [];
		var aCurrentControls;
		var that = this;
	
		try {
	
			aCurrentControls = this._getAllPersonalizableControls();
			if (aCurrentControls && (aCurrentControls.length === 1) && aCurrentControls[0].persistence && aCurrentControls[0].control) {
	
				aCurrentControls[0].persistence.getChanges().then(function(mVariants) {
					if (mVariants) {
						for (n in mVariants) {
							if (n) {
								oVariant = mVariants[n];
								if (oVariant.isVariant()) {
									aVariants.push({
										key: oVariant.getId(),
										text: oVariant.getText("variantName")
									});
								}
							}
						}
					}
	
					fCallBack(aVariants);
				}, function(args) {
					var sError = "'getChanges' failed:";
					if (args && args[0] && args[0].messages && args[0].messages[0]) {
						sError += (' ' + args[0].messages[0]);
					}
					that._setErrorValueState(that.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"), sError, aCurrentControls[0].control);
	
					fCallBack(aVariants);
				});
			}
	
		} catch (ex) {
			this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"), "'getChanges' throws an exception", null);
		}
	};
	
	/**
	 * returns the id of the currently selected variant. In case STANDARD is set, an empty string will be returned. An empty string will also be returned,
	 * when the initialize was not yet called.
	 * 
	 * @public
	 * @since 1.28.1
	 * @returns {string} id of the currently selected variant
	 */
	SmartVariantManagement.prototype.getCurrentVariantId = function() {
		var sKey = "";
		var oItem = this._getSelectedItem();
		if (oItem) {
			sKey = oItem.getKey();
			if (sKey === this.STANDARDVARIANTKEY) {
				sKey = "";
			}
		}
	
		return sKey;
	};
	
	/**
	 * Set the current variant according to the sVariantId. In case an empty string or null or undefined was passed the STANDARD will be set. STANDARD
	 * will also be set, in case the passed sVariantId could not be found. In case neither a flexibility variant, nor the content for the standard variant
	 * could not be obtained, nor the personalizable control obtained nothing will be executed/changed
	 * 
	 * @public
	 * @since 1.28.1
	 * @param {string} sVariantId id of the currently selected variant
	 * @param {boolean} bDoNotApplyVariant if set to true the applyVariant method will not be executed yet. Use-full if used during navigation, where the
	 *        pers-controller sets the variant id, but the initialise - sequence triggers the applyVariant method
	 */
	SmartVariantManagement.prototype.setCurrentVariantId = function(sVariantId, bDoNotApplyVariant) {
		var oContent;
	
		var sId = sVariantId;
		if (!sId) {
			sId = this.STANDARDVARIANTKEY;
		} else {
	
			/* eslint-disable no-lonely-if */
			if (!this.getItemByKey(sId)) {
				sId = this.STANDARDVARIANTKEY;
			}
			/* eslint-enable no-lonely-if */
		}
				
		var aCurrentControls = this._getAllPersonalizableControls();
		if (aCurrentControls && (aCurrentControls.length === 1) && aCurrentControls[0].persistence && aCurrentControls[0].control) {

			if (!this._bIsInitialized) {
				aCurrentControls[0].currentVariantId = sVariantId;
			} else {
				oContent = this.getVariantContent(aCurrentControls[0].control, sId);
				if (oContent) {
					this._setSelectionByKey(sId); // set the current selected variant
					if (bDoNotApplyVariant !== true) {
						this._applyVariant(aCurrentControls[0].control, oContent);
					}
				}
			}
		}		
		
	};
	
	/**
	 * first function to be called. will initialize the flex layer, by retrieving the list of variants Once the initialization is completed the control
	 * for personalization will be informed via the event "initialise"
	 * 
	 * @public
	 */
	SmartVariantManagement.prototype.initialise = function() {
		var that = this;
		var aCurrentControls;
		var oContent = null, oVariant;
		var parameter = {
			variantKeys: []
		};
		var bSuiteApplied = false;
		var sKey;
	
		try {
	
			aCurrentControls = this._getAllPersonalizableControls();
			if (aCurrentControls && (aCurrentControls.length === 1) && aCurrentControls[0].persistence && aCurrentControls[0].control) {
	
				aCurrentControls[0].persistence.getChanges().then(function(mVariants) {

					var sComponentName = aCurrentControls[0].persistence.getComponentName();
					sap.ui.fl.registry.Settings.getInstance(sComponentName).then(function(oSettings) {
						if (oSettings) {
							that.setShowShare(oSettings.isKeyUser());
						}

						parameter.variantKeys = that._createVariantEntries(mVariants, aCurrentControls[0]);
												
						var sDefaultKey = that._getDefaultVariantKey(aCurrentControls[0]);
						if (sDefaultKey) {
							oVariant = that._getVariant(aCurrentControls[0].control, sDefaultKey);
							if (oVariant) {
								that.setDefaultVariantKey(sDefaultKey); // set the default variant
								that.setInitialSelectionKey(sDefaultKey); // set the current selected variant
							}
						}

						that.fireEvent("initialise", parameter);
						that._bIsInitialized = true;						
						
						that._setStandardVariant(aCurrentControls[0].control);

						// navigation to FilterBar: initialize leads to VM.clearVariantSelection --> ignore an eventual defaultVariant						
						if (aCurrentControls[0].currentVariantId) {
							that.setInitialSelectionKey(aCurrentControls[0].currentVariantId);							
							aCurrentControls[0].currentVariantId = undefined;
						} 
							
						sKey = that.getSelectionKey();														
						if (sKey && (sKey !== that.STANDARDVARIANTKEY)) {
							oVariant = that._getVariant(aCurrentControls[0].control, sKey);
							if (oVariant) {
								oContent = oVariant.getContent();
							}
						}

						if (oContent) {
							that._applyVariant(aCurrentControls[0].control, oContent, bSuiteApplied);
						} else {
							/* eslint-disable no-lonely-if */
							if ((sKey === that.STANDARDVARIANTKEY) && that.bExecuteOnSelectForStandard) {
								if (aCurrentControls[0].control.search) {
									that.setInitialSelectionKey(sKey);										
									aCurrentControls[0].control.search();
								}
							}
							/* eslint-enable no-lonely-if */
						}
					}, function(args) {
						var sError = "'getInstance' failed:";
						if (args && args[0] && args[0].messages && args[0].messages[0]) {
							sError += (' ' + args[0].messages[0]);
						}
						that._setErrorValueState(that.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"), sError, aCurrentControls[0].control);
		
						that.fireEvent("initialise", parameter);
						that._setStandardVariant(aCurrentControls[0].control);
					});

	
				}, function(args) {
					var sError = "'getChanges' failed:";
					if (args && args[0] && args[0].messages && args[0].messages[0]) {
						sError += (' ' + args[0].messages[0]);
					}
					that._setErrorValueState(that.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"), sError, aCurrentControls[0].control);
	
					that.fireEvent("initialise", parameter);
					that._setStandardVariant(aCurrentControls[0].control);
				});
	
			} else {
				this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"), "'initialise' no personalizable component available", null);
	
				this.fireEvent("initialise", parameter);
				if (aCurrentControls && (aCurrentControls.length === 1) && aCurrentControls[0].control) {
					this._setStandardVariant(aCurrentControls[0].control);
				}
			}
	
		} catch (ex) {
			this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"), "'getChanges' throws an exception", null);
	
			this.fireEvent("initialise", parameter);
			if (aCurrentControls && (aCurrentControls.length === 1) && aCurrentControls[0].control) {
				this._setStandardVariant(aCurrentControls[0].control);
			}
		}
	};
	
	SmartVariantManagement.prototype._updateVariant = function(oVariantInfo, oCurrentControlInfo) {
	
		if (oVariantInfo.key !== this.STANDARDVARIANTKEY) {
	
			if (oVariantInfo && oCurrentControlInfo && oCurrentControlInfo.control && oCurrentControlInfo.control.fetchVariant) {
				var oVariant = this._getVariant(oCurrentControlInfo.control, oVariantInfo.key);
				if (oVariant) {
					try {
	
						if ((oVariantInfo.lifecycleTransportId !== null) && (oVariantInfo.lifecycleTransportId !== undefined)) {
							oVariant.setRequest(oVariantInfo.lifecycleTransportId);
						}
	
						var oContent = oCurrentControlInfo.control.fetchVariant();
						if (oContent) {
							
							var oItem = this.getItemByKey(oVariantInfo.key);
							if (oItem) {
								oContent.executeOnSelection = oItem.getExecuteOnSelection();
							}
							
							oVariant.setContent(oContent);												
						}
	
					} catch (ex) {
						jQuery.sap.log.error("'_updateVariant' throws an exception");
					}
				}
			}
		}
	};
	
	SmartVariantManagement.prototype._newVariant = function(oVariantInfo, oCurrentControlInfo) {
	
		var sId;
	
		if (oVariantInfo && oCurrentControlInfo && oCurrentControlInfo.control && oCurrentControlInfo.control.fetchVariant && oCurrentControlInfo.persistence) {
	
			var sType = oCurrentControlInfo.type;
			var sDataService = oCurrentControlInfo.dataSource;
	
			var bUserDependent = !oVariantInfo.global;
	
			var sPackage = "";
			if ((oVariantInfo.lifecyclePackage !== null) && (oVariantInfo.lifecyclePackage !== undefined)) {
				sPackage = oVariantInfo.lifecyclePackage;
			}
	
			var sTransportId = "";
			if ((oVariantInfo.lifecycleTransportId !== null) && (oVariantInfo.lifecycleTransportId !== undefined)) {
				sTransportId = oVariantInfo.lifecycleTransportId;
			}
	
			var oContent = oCurrentControlInfo.control.fetchVariant();
			if (oContent) {
	
				var sContent = JSON.stringify(oContent);
				oContent = JSON.parse(sContent);
	
				if (oVariantInfo.exe) {
					oContent.executeOnSelection = oVariantInfo.exe;
				}
				if (oVariantInfo.tile) {
					oContent.tile = oVariantInfo.tile;
				}
	
			}
	
			sId = this._isVariantDownport(oCurrentControlInfo) ? oVariantInfo.key : null;
	
			var mParams = {
				type: sType,
				ODataService: sDataService,
				texts: {
					variantName: oVariantInfo.name
				},
				content: oContent,
				isVariant: true,
				packageName: sPackage,
				isUserDependent: bUserDependent,
				id: sId
			};
	
			sId = oCurrentControlInfo.persistence.addChange(mParams);
			this.replaceKey(oVariantInfo.key, sId);
			this.setInitialSelectionKey(sId);
	
			var oVariant = this._getVariant(oCurrentControlInfo.control, sId);
			if (oVariant) {
				oVariant.setRequest(sTransportId);
	
				var oItem = this.getItemByKey(sId);
				if (oItem) {
					oItem.setNamespace(oVariant.getNamespace());
				}
			}
	
			if (oVariantInfo.def === true) {
				this._setDefaultVariantKey(oCurrentControlInfo, sId);
			}
		}
	};
	
	SmartVariantManagement.prototype._appendLifecycleInformation = function(oVariant, sId) {
	
		var sTransportId;
	
		var oItem = this.getItemByKey(sId);
	
		if (oItem) {
			// sPackage = oItem.getLifecyclePackage();
			// if (sPackage === null || sPackage === undefined) {
			// sPackage = "";
			// }
	
			sTransportId = oItem.getLifecycleTransportId();
			if (sTransportId === null || sTransportId === undefined) {
				sTransportId = "";
			}
	
			if (oVariant) {
				oVariant.setRequest(sTransportId);
			}
		}
	
	};
	
	SmartVariantManagement.prototype._renameVariant = function(oVariantInfo, oCurrentControlInfo) {
	
		if (oVariantInfo.key !== this.STANDARDVARIANTKEY) {
			if (oVariantInfo && oCurrentControlInfo && oCurrentControlInfo.control) {
				var oVariant = this._getVariant(oCurrentControlInfo.control, oVariantInfo.key);
				if (oVariant) {
					oVariant.setText("variantName", oVariantInfo.name);
					this._appendLifecycleInformation(oVariant, oVariantInfo.key);
				}
			}
		}
	};
	
	SmartVariantManagement.prototype._deleteVariants = function(aVariantInfo, oCurrentControlInfo) {
		var i;
		if (aVariantInfo && aVariantInfo.length && oCurrentControlInfo && oCurrentControlInfo.control) {
	
			var sVariantKey = this._getDefaultVariantKey(oCurrentControlInfo);
	
			for (i = 0; i < aVariantInfo.length; i++) {
	
				if (aVariantInfo[i] === this.STANDARDVARIANTKEY) {
					continue;
				}
	
				var oVariant = this._getVariant(oCurrentControlInfo.control, aVariantInfo[i]);
				if (oVariant) {
					oVariant.markForDeletion();
					if (sVariantKey && sVariantKey === aVariantInfo[i]) {
						this._setDefaultVariantKey(oCurrentControlInfo, "");
					}
	
					this._appendLifecycleInformation(oVariant, aVariantInfo[i]);
				}
			}
		}
	};
	
	SmartVariantManagement.prototype._getDefaultVariantKey = function(oCurrentControlInfo) {
	
		var sDefaultVariantKey = "";
		if (oCurrentControlInfo && oCurrentControlInfo.persistence) {
			sDefaultVariantKey = oCurrentControlInfo.persistence.getDefaultVariantIdSync();
		}
	
		return sDefaultVariantKey;
	};
	
	SmartVariantManagement.prototype._setDefaultVariantKey = function(oCurrentControlInfo, sVariantKey) {
	
		// if (sVariantKey !== this.STANDARDVARIANTKEY) {
		if (oCurrentControlInfo && oCurrentControlInfo.persistence) {
			oCurrentControlInfo.persistence.setDefaultVariantIdSync(sVariantKey);
		}
		// }
	};
	
	SmartVariantManagement.prototype._isVariantDownport = function(oCurrentControlInfo) {
	
		var bDownport = false;
		if (oCurrentControlInfo && oCurrentControlInfo.persistence) {
			bDownport = oCurrentControlInfo.persistence.isVariantDownport();
		}
	
		return bDownport;
	};
	
	SmartVariantManagement.prototype._getExecuteOnSelection = function(oVariant) {
	
		var oJson;
	
		if (oVariant) {
			oJson = oVariant.getContent();
			if (oJson && (oJson.executeOnSelection !== undefined)) {
				return oJson.executeOnSelection;
			}
		}
	
		return false;
	};
	
	SmartVariantManagement.prototype._setExecuteOnSelections = function(aVariantInfo, oCurrentControlInfo) {
	
		var i;
		if (aVariantInfo && aVariantInfo.length && oCurrentControlInfo && oCurrentControlInfo.control) {
	
			for (i = 0; i < aVariantInfo.length; i++) {
	
				if (aVariantInfo[i].key === this.STANDARDVARIANTKEY) {
					continue;
				}
	
				var oVariant = this._getVariant(oCurrentControlInfo.control, aVariantInfo[i].key);
				if (oVariant) {
					var oJson = oVariant.getContent();
					if (oJson) {
						oJson.executeOnSelection = aVariantInfo[i].exe;
						oVariant.setContent(oJson);
					}
	
					this._appendLifecycleInformation(oVariant, aVariantInfo[i].key);
				}
			}
		}
	};
	
	/**
	 * save all variants
	 * 
	 * @private
	 * @param {sap.ui.comp.smartvariants.PersonalizableInfo} oCurrentControlInfo information about the control to be personalized
	 */
	SmartVariantManagement.prototype._save = function(oCurrentControlInfo) {
	
		var that = this;
	
		if (oCurrentControlInfo && oCurrentControlInfo.persistence) {
			try {
				oCurrentControlInfo.persistence.saveAll().then(function() {
					that.fireEvent("afterSave");
				}, function(args) {
					var sError = "'_save' failed:";
					if (args && args[0] && args[0].messages && args[0].messages[0]) {
						sError += (' ' + args[0].messages[0]);
					}
					that._setErrorValueState(that.oResourceBundle.getText("VARIANT_MANAGEMENT_SAVE_FAILED"), sError, oCurrentControlInfo.control);
				});
			} catch (ex) {
				this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_SAVE_FAILED"), "'_save' throws an exception", oCurrentControlInfo.control);
			}
		}
	};
	
	/**
	 * is called by the variant management control, when saving a variant
	 * 
	 * @public
	 * @param {object} oVariantInfo describes the variant to be saved
	 */
	SmartVariantManagement.prototype.fireSave = function(oVariantInfo) {
	
		var bSave = false;
	
		var aCurrentControls = this._getAllPersonalizableControls();
		if (aCurrentControls && (aCurrentControls.length === 1)) {
	
			if (oVariantInfo) {
				if (oVariantInfo.overwrite) {
					if (oVariantInfo.key !== this.STANDARDVARIANTKEY) { // Prohibit save on standard variant
	
						this.fireEvent("save");
						this._updateVariant(oVariantInfo, aCurrentControls[0]);
						bSave = true;
					}
				} else {
	
					this.fireEvent("save");
					this._newVariant(oVariantInfo, aCurrentControls[0]);
					bSave = true;
				}
	
				if (bSave) {
					this._save(aCurrentControls[0]);
				}
			}
		}
	};
	
	/**
	 * is called by the variant management control, when managing the variants
	 * 
	 * @public
	 * @param {object} oVariantInfo describes the variants, which will be deleted/renamed
	 */
	SmartVariantManagement.prototype.fireManage = function(oVariantInfo) {
	
		var i;
		var aCurrentControlsInfo = this._getAllPersonalizableControls();
		if (aCurrentControlsInfo && (aCurrentControlsInfo.length === 1)) {
	
			if (oVariantInfo) {
	
				if (oVariantInfo.renamed) {
	
					for (i = 0; i < oVariantInfo.renamed.length; i++) {
						this._renameVariant(oVariantInfo.renamed[i], aCurrentControlsInfo[0]);
					}
				}
	
				if (oVariantInfo.deleted) {
					this._deleteVariants(oVariantInfo.deleted, aCurrentControlsInfo[0]);
				}
	
				if (oVariantInfo.exe) {
					this._setExecuteOnSelections(oVariantInfo.exe, aCurrentControlsInfo[0]);
				}
	
				if (oVariantInfo.def) {
	
					var sDefaultVariantKey = this._getDefaultVariantKey(aCurrentControlsInfo[0]);
					if (sDefaultVariantKey !== oVariantInfo.def) {
						this._setDefaultVariantKey(aCurrentControlsInfo[0], oVariantInfo.def);
					}
				}
	
				if ((oVariantInfo.deleted && oVariantInfo.deleted.length > 0) || (oVariantInfo.renamed && oVariantInfo.renamed.length > 0) || (oVariantInfo.exe && oVariantInfo.exe.length > 0) || oVariantInfo.def) {
					this._save(aCurrentControlsInfo[0]);
				}
			}
		}
	};
	
	/**
	 * is called by the variant management control, when a variant was selected
	 * 
	 * @public
	 * @param {object} oVariantInfo describes the selected variant
	 */
	SmartVariantManagement.prototype.fireSelect = function(oVariantInfo) {
	
		var oContent = null;
	
		var aCurrentControls = this._getAllPersonalizableControls();
		if (aCurrentControls && (aCurrentControls.length === 1)) {
			if (oVariantInfo && oVariantInfo.key) {
	
				oContent = this.getVariantContent(aCurrentControls[0].control, oVariantInfo.key);
	
				if (oContent) {
					var sContent = JSON.stringify(oContent);
					oContent = JSON.parse(sContent);
	
					if ((oVariantInfo.key === this.STANDARDVARIANTKEY) && this.bExecuteOnSelectForStandard) {
						oContent.executeOnSelection = this.bExecuteOnSelectForStandard;
					}
	
					this._applyVariant(aCurrentControls[0].control, oContent);
				}
			}
		}
	};
	
	/**
	 * the standard variant will be retrieved from the ui.control
	 * 
	 * @private
	 * @param {sap.ui.core.Control} oCurrentControl ui-control providing the 'currentVariant' aggregation
	 */
	SmartVariantManagement.prototype._setStandardVariant = function(oCurrentControl) {
	
		if (oCurrentControl && oCurrentControl.fetchVariant) {
	
			var oStandardVariant = oCurrentControl.fetchVariant();
	
			this._mStandardVariants[oCurrentControl] = oStandardVariant;
		}
	};
	
	/**
	 * the standard variant will be obtained
	 * 
	 * @private
	 * @param {sap.ui.core.Control} oCurrentControl control to be personalized
	 * @returns {object} json object representing the variant data
	 */
	SmartVariantManagement.prototype._getStandardVariant = function(oCurrentControl) {
		var oContent = null;
	
		if (this._mStandardVariants && this._mStandardVariants[oCurrentControl]) {
	
			oContent = this._mStandardVariants[oCurrentControl];
		}
	
		return oContent;
	};
	
	/**
	 * the standard variant will be applied
	 * 
	 * @private
	 * @param {sap.ui.core.Control} oCurrentControl control to be personalized
	 * @param {object} oContent json object representing the variant data
	 */
	SmartVariantManagement.prototype._applyVariant = function(oCurrentControl, oContent) {
	
		if (oCurrentControl && oCurrentControl.applyVariant) {
			oCurrentControl.applyVariant(oContent);
		}
	};
	
	/**
	 * set an error state on the variant management control
	 * 
	 * @private
	 * @param {string} sText describing the error reason
	 * @param {string} sLogText describing the error reason for logging
	 * @param {object} oControl to obtain the correspondinf component name; may be null
	 */
	SmartVariantManagement.prototype._setErrorValueState = function(sText, sLogText, oControl) {
		this.setEnabled(false);
	
		if (sLogText) {
			jQuery.sap.log.error(sLogText);
		}
	
		var sComponentName = oControl ? this._mControlComponent[oControl] : null;
	
		SmartVariantManagement._displayError(this, sComponentName, sText);
	};
	
	/**
	 * workaround for having multiple smartVM controls on the page. Only one message - the first - should be raised
	 * 
	 * @private
	 * @param {sap.ui.comp.smartvariants.SmartVariantManagement} oSmartVariant instance of the smartVM
	 * @param {string} sComponentName name of the component; may be null
	 * @param {string} sText error text
	 */
	SmartVariantManagement._displayError = function(oSmartVariant, sComponentName, sText) {
	
		if (oSmartVariant) {
			if (sComponentName) {
				if (!SmartVariantManagement._mComponentReadError[sComponentName]) {
					SmartVariantManagement._mComponentReadError[sComponentName] = sComponentName;
	
					oSmartVariant._displayError(sText);
				}
			} else {
				oSmartVariant._displayError(sText);
			}
		}
	};
	
	SmartVariantManagement.prototype._displayError = function(sText) {

		MessageBox.show(sText, {
			icon: MessageBox.Icon.ERROR,
			title: this.oResourceBundle.getText("VARIANT_MANAGEMENT_ERROR_TITLE"),
			styleClass: (this.$() && this.$().closest(".sapUiSizeCompact").length > 0) ? "sapUiSizeCompact" : ""
		});
	};
	
	/**
	 * Destroys the control
	 * 
	 * @public
	 */
	SmartVariantManagement.prototype.exit = function() {
		VariantManagement.prototype.exit.apply(this, arguments);
	
		this._mStandardVariants = null;
		this._mControlPersistence = null;
		
		this._aPersonalizableControls = null;		
	
		var n, sComponentName;
		for (n in this._mControlComponent) {
			if (n) {
				sComponentName = this._mControlComponent[n];
				if (sComponentName) {
					delete SmartVariantManagement._mComponentReadError[sComponentName];
				}
			}
		}
	
		this._mControlComponent = null;
	};
	

	return SmartVariantManagement;

}, /* bExport= */ true);
