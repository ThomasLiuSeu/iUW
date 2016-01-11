/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartvariants.SmartVariantManagementUi2.
sap.ui.define(['jquery.sap.global', 'sap/ui/comp/library', './PersonalizableInfo', 'sap/ui/comp/variants/VariantItem', 'sap/ui/comp/variants/VariantManagement', 'sap/m/MessageBox'],
	function(jQuery, library, PersonalizableInfo, VariantItem, VariantManagement, MessageBox) {
	"use strict";


	
	/**
	 * Constructor for a new smartvariants/SmartVariantManagementUi2.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * SmartVariantManagement is a specialization of the VariantManagementControl and communicates with the Ui2 personalization layer to manage the variants.
	 * @extends sap.ui.comp.variants.VariantManagement
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartvariants.SmartVariantManagementUi2
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SmartVariantManagementUi2 = VariantManagement.extend("sap.ui.comp.smartvariants.SmartVariantManagementUi2", /** @lends sap.ui.comp.smartvariants.SmartVariantManagementUi2.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		properties : {
	
			/**
			 * retrieve/set the current Variant. In case STANDARD-variant is the current one, and empty string will be returned.
			 */
			currentVariantId : {type : "string", group : "Behavior", defaultValue : null}
		},
		aggregations : {
	
			/**
			 * The control that is interested and rely on variant handling have to be registered by this aggregation. Only currently known consumer is the FilterBar control.
			 */
			personalizableControl : {type : "sap.ui.comp.smartvariants.PersonalizableInfo", multiple : false}
		},
		events : {
	
			/**
			 * Once the the SmartVariant control has been initialized, and especially after retrieving the variants via the UI2 personalization service, the registered consumer will be notified that this phase has completed
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
	 * @name sap.ui.comp.smartvariants.SmartVariantManagementUi2#setCurrentVariantId
	 * @function
	 * @param {string} sSVariantId
	 *         retrieve the current Variant. In case STANDARD-variant is the current one, and empty string will be returned.
	 * @param {boolean} bBDoNotApplyVariant
	 *         if set to true the applyVariant method will not be executed yet. Relevant during navigation, where the pers-controller sets the variant id, but the initialise - sequence triggers the applyVariant method
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * retrieve the current Variant. In case STANDARD-variant is the current one, and empty string will be returned.
	 *
	 * @name sap.ui.comp.smartvariants.SmartVariantManagementUi2#getCurrentVariantId
	 * @function
	 * @type string
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * control initialization
	 * 
	 * @public
	 * @since 1.28.0
	 */
	SmartVariantManagementUi2.prototype.init = function() {
		VariantManagement.prototype.init.apply(this); // Call base class
	
		this._oStandardVariant = null;
		this._oPersController = null;
		this._sKeyName = null;
	
		this._oContainer = null;
		this._oVariantSet = null;
	
		if (this.setLifecycleSupport) {
			this.setLifecycleSupport(true);
		}
		this._setBackwardCompatibility(false);
	};
	
	/**
	 * all controls interested and relying on variant handling have to be registered by this association
	 * 
	 * @public
	 * @param {sap.ui.core.Control} oControl current control
	 * @param {string} sKey the variant key
	 * @returns {object} json object representing the content of the variant
	 */
	SmartVariantManagementUi2.prototype.getVariantContent = function(oControl, sKey) {
		var oContent = null;
	
		if (sKey === this.STANDARDVARIANTKEY) {
			oContent = this._getStandardVariant();
	
		} else {
	
			/* eslint-disable no-lonely-if */
			if (this._oVariantSet) {
				var oVariant = this._oVariantSet.getVariant(sKey);
				if (oVariant) {
					oContent = this._getContent(oVariant);
				}
			}
			/* eslint-enable no-lonely-if */
		}
	
		return oContent;
	};
	
	/**
	 * returns the id of the currently selected variant. In case STANDARD is set, an empty string will be returned. An empty string will also be returned,
	 * when the initialize was not yet called.
	 * 
	 * @public
	 * @returns {string} id of the currently selected variant
	 */
	SmartVariantManagementUi2.prototype.getCurrentVariantId = function() {
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
	 * could not be obtained, nor the personalisable control obtained nothing will be executed/changed
	 * 
	 * @public
	 * @param {string} sVariantId id of the currently selected variant
	 * @param {boolean} bDoNotApplyVariant if set to true the applyVariant method will not be executed yet. Use-full if used during navigation, where the
	 *        pers-controller sets the variant id, but the initialise - sequence triggers the applyVariant method
	 */
	SmartVariantManagementUi2.prototype.setCurrentVariantId = function(sVariantId, bDoNotApplyVariant) {
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
	
		if (this._oVariantSet) {
	
			oContent = this.getVariantContent(this._oPersController, sId);
			if (oContent) {
				this._setSelectionByKey(sId); // set the current selected variant
				if (bDoNotApplyVariant !== true) {
					this._applyVariantContent(oContent);
				}
			}
		}
	};
	
	/**
	 * all controls interested and relying on variant handling have to be registered by this association
	 * 
	 * @public
	 * @param {sap.ui.comp/smartvariants/PersonalizableInfo} oCurrentControlInfo control providing the required aggregation for flex-layer
	 */
	SmartVariantManagementUi2.prototype.addPersonalizableControl = function(oCurrentControlInfo) {
		this.setAggregation("personalizableControl", oCurrentControlInfo, true);
	
		if (oCurrentControlInfo.getControl()) {
			this._oPersController = sap.ui.getCore().getControl(oCurrentControlInfo.getControl());
		}
	
		this._sKeyName = oCurrentControlInfo.getKeyName();
	};
	
	/**
	 * retrieve the personalization container. "initialize" has to be triggered in each potential exit-branch
	 * 
	 * @private
	 */
	SmartVariantManagementUi2.prototype.initialise = function() {
	
		var sContainerKey = this._getPersistencyKey();
	
		if (!sContainerKey) {
			jQuery.sap.log.warning("PersistencyKey not set");
			this.fireEvent("initialise");
	
			return;
		}
	
		if (sap.ushell && sap.ushell.Container) {
	
			var that = this;
			sap.ushell.Container.getService("Personalization").getContainer(sContainerKey, {
				validity: Infinity
			}).fail(function() {
				jQuery.sap.log.error("Loading personalization container failed");
				that._setErrorValueState(that.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"));
	
				that.fireEvent("initialise");
			}).done(function(oContainer) {
				that._readPersonalization(oContainer);
				that.fireEvent("initialise");
	
				that._setStandardVariant();
	
				that._setSelectedVariant();
			});
	
			return;
		}
	
		jQuery.sap.log.error("Could not obtain the personalization container");
		this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"));
	
		this.fireEvent("initialise");
	};
	
	/**
	 * obtains from the variant management the current selected entry ands applies the corresponding variant. In case nothing was selected variant
	 * management returns null -> no variant will be applied
	 * 
	 * @private
	 */
	SmartVariantManagementUi2.prototype._setSelectedVariant = function() {
		var oVariant = null;
	
		if (this._oVariantSet) { // in case a variant is currently selected, re-apply this variant
			var sKey = this.getSelectionKey();
			if (sKey) {
				oVariant = this._oVariantSet.getVariant(sKey);
	
				if (oVariant) {
					this._applyVariant(oVariant);
				}
			}
		}
	};
	
	/**
	 * read the variant container and create the variant items
	 * 
	 * @private
	 */
	SmartVariantManagementUi2.prototype._reCreateVariantEntries = function() {
	
		var n = null;
		var sVariantKey = null;
		var oVariant, oVariantItem;
	
		this.removeAllItems();
	
		if (this._oVariantSet) {
			var mVariantList = this._oVariantSet.getVariantNamesAndKeys();
			if (mVariantList) {
				for (n in mVariantList) {
					if (n) {
	
						oVariantItem = new VariantItem({
							text: n,
							key: mVariantList[n]
						});
						this.addVariantItem(oVariantItem);
					}
				}
	
				sVariantKey = this._oVariantSet.getCurrentVariantKey();
				oVariant = this._oVariantSet.getVariant(sVariantKey);
				if (oVariant) {
					this.setDefaultVariantKey(sVariantKey); // set the default variant
					this.setInitialSelectionKey(sVariantKey); // set the current selected variant
				}
			}
		}
	};
	
	/**
	 * read the variant container and create the variant items
	 * 
	 * @private
	 * @returns {object} the variant set adapter
	 */
	SmartVariantManagementUi2.prototype._getVariantSetAdapter = function() {
	
		var oVariantSetAdapter = null;
	
		if (this._oContainer) {
			// jQuery.sap.require("sap.ushell.services.Personalization.VariantSetAdapter");
			oVariantSetAdapter = new sap.ushell.services.Personalization.VariantSetAdapter(this._oContainer);
		}
	
		return oVariantSetAdapter;
	};
	
	/**
	 * read the variant container and create the variant items
	 * 
	 * @private
	 */
	SmartVariantManagementUi2.prototype._createVariantEntries = function() {
	
		var oVariantSetAdapter = this._getVariantSetAdapter();
		if (oVariantSetAdapter) {
			this._oVariantSet = oVariantSetAdapter.getVariantSet("filterBarVariantSet");
			if (this._oVariantSet) {
				this._reCreateVariantEntries();
			} else {
				this._oVariantSet = oVariantSetAdapter.addVariantSet("filterBarVariantSet");
			}
		}
	
	};
	
	/**
	 * read the personalization and re-act to the information
	 * 
	 * @private
	 * @param {object} oContainer personalization conmteiner
	 */
	SmartVariantManagementUi2.prototype._readPersonalization = function(oContainer) {
	
		this._oContainer = oContainer;
	
		if (this._oContainer) {
			this._createVariantEntries();
		}
	};
	
	/**
	 * handling the save for the personalization container for variants
	 * 
	 * @private
	 */
	SmartVariantManagementUi2.prototype._savePersonalizationContainer = function() {
	
		var that = this;
	
		if (this._oContainer) {
	
			this._oContainer.save() // save the whole container!
			.fail(function() {
				jQuery.sap.log.error("Saving personalization data failed");
				that._setErrorValueState(that.oResourceBundle.getText("VARIANT_MANAGEMENT_SAVE_FAILED"));
	
			}).done(function() {
				// Before the next save is triggered the last one has to be finished.
				// Could be done by disabling the save button during the save.
				jQuery.sap.log.info("Saving personalization data succeeded");
				that.fireEvent("afterSave");
			});
		}
	};
	
	/**
	 * reaction to Save-event from variant management
	 * 
	 * @private
	 * @param {object} oVariantInfo containing variant information
	 */
	SmartVariantManagementUi2.prototype.fireSave = function(oVariantInfo) {
	
		var oVariant = null, oNewVariant = null;
		var sVariantKey;
	
		if (!this._oVariantSet) {
			return;
		}
	
		if (oVariantInfo) {
	
			if (oVariantInfo.overwrite) {
				if (oVariantInfo.key) {
					oVariant = this._oVariantSet.getVariant(oVariantInfo.key);
				}
			} else {
				/* eslint-disable no-lonely-if */
				if (oVariantInfo.name) {
					oVariant = this._oVariantSet.addVariant(oVariantInfo.name);
					oNewVariant = oVariant; // indicates that we have to adapt the variant management key
	
					sVariantKey = oNewVariant.getVariantKey();
					this.replaceKey(oVariantInfo.key, sVariantKey);
	
					this.setInitialSelectionKey(sVariantKey);
				}
				/* eslint-enable no-lonely-if */
			}
	
			if (oVariant) {
	
				this.fireEvent("save", oVariantInfo);
				var oVariantContent = this._fetchVariant();
				if (oVariantContent) {
	
					oVariant.setItemValue("filterBarVariant", oVariantContent.filterBarVariant);
					oVariant.setItemValue("filterbar", oVariantContent.filterbar);
	
					sVariantKey = oVariant.getVariantKey();
					if (oVariantInfo.def) {
						if (sVariantKey) {
							this._oVariantSet.setCurrentVariantKey(sVariantKey);
						}
					} else {
						var sDefaultVariantKey = this._oVariantSet.getCurrentVariantKey();
						if (sVariantKey === sDefaultVariantKey) {
							this._oVariantSet.setCurrentVariantKey(null);
						}
					}
				}
	
				this._savePersonalizationContainer();
	// if (oNewVariant) {
	// sVariantKey = oNewVariant.getVariantKey();
	// this.replaceKey(oVariantInfo.key, sVariantKey);
	//
	// this.setInitialSelectionKey(sVariantKey);
	// }
			}
		}
	
	};
	
	/**
	 * obtain and store the standard variant. Only relevant for the UI2 personalization-service
	 * 
	 * @private
	 */
	SmartVariantManagementUi2.prototype._setStandardVariant = function() {
		this._oStandardVariant = this._fetchVariant();
	};
	
	/**
	 * returns a previously stored representation of the standard variant. Only relevant for the UI2 personalization-service
	 * 
	 * @private
	 * @returns {object} json compatible object representing the standard variant
	 */
	SmartVariantManagementUi2.prototype._getStandardVariant = function() {
		return this._oStandardVariant;
	};
	
	/**
	 * workaround for missing Variant feature 'setVariantName' with U2 < 1.24.0
	 * 
	 * @private
	 * @param {object} oVariant the original variant
	 * @param {string} sVariantKey the key of the original variant
	 * @param {string} sNewName the new name of the original variant
	 */
	SmartVariantManagementUi2.prototype._setVariantName = function(oVariant, sVariantKey, sNewName) {
	
		var sKey;
		var aFieldsAndValues, aFields;
	
		if (this._oVariantSet) {
			var oNewVariant = this._oVariantSet.addVariant(sNewName);
	
			aFieldsAndValues = oVariant.getItemValue("filterBarVariant");
			oNewVariant.setItemValue("filterBarVariant", aFieldsAndValues);
	
			aFields = oVariant.getItemValue("filterbar");
			oNewVariant.setItemValue("filterbar", aFields);
	
			sKey = this._oVariantSet.getCurrentVariantKey();
			if (sKey === sVariantKey) {
				this._oVariantSet.setCurrentVariantKey(oNewVariant.getVariantKey());
			}
			this._oVariantSet.delVariant(sVariantKey);
	
			sKey = oNewVariant.getVariantKey();
			this.replaceKey(sVariantKey, sKey);
	
			this.setInitialSelectionKey(sKey);
	
		}
	
	};
	
	/**
	 * reaction to Manage-event from variant management
	 * 
	 * @private
	 * @param {object} oVariantInfo containing variant information
	 */
	SmartVariantManagementUi2.prototype.fireManage = function(oVariantInfo) {
	
		var i;
		var renamed = null, deleted = null;
		var oVariant;
	
		if (!this._oVariantSet) {
			return;
		}
	
		if (oVariantInfo) {
			renamed = oVariantInfo.renamed;
			deleted = oVariantInfo.deleted;
	
			if (renamed) {
				for (i = 0; i < renamed.length; i++) {
					oVariant = this._oVariantSet.getVariant(renamed[i].key);
					if (oVariant) {
						if (oVariant.setVariantName) { // available with 1.24.0
							oVariant.setVariantName(renamed[i].name);
						} else {
							this._setVariantName(oVariant, renamed[i].key, renamed[i].name); // workaround for missing variant feature 'setVariantName'
						}
					}
				}
			}
	
			if (deleted) {
				var sVariantKey = this._oVariantSet.getCurrentVariantKey();
				for (i = 0; i < deleted.length; i++) {
					oVariant = this._oVariantSet.getVariant(deleted[i]);
					if (oVariant) {
						if (sVariantKey && sVariantKey === oVariant.getVariantKey()) {
							this._oVariantSet.setCurrentVariantKey(null);
						}
	
						this._oVariantSet.delVariant(deleted[i]);
					}
				}
			}
	
			if (oVariantInfo.def) {
				oVariant = this._oVariantSet.getVariant(oVariantInfo.def);
				if (oVariant || (oVariantInfo.def === this.STANDARDVARIANTKEY)) {
					this._oVariantSet.setCurrentVariantKey(oVariantInfo.def);
				}
			}
	
			if ((deleted && deleted.length > 0) || (renamed && renamed.length > 0) || (oVariantInfo.def)) {
				this._savePersonalizationContainer();
			}
		}
	
	};
	
	/**
	 * reaction to Select-event from variant management
	 * 
	 * @private
	 * @param {object} oVariantInfo containing variant information
	 */
	SmartVariantManagementUi2.prototype.fireSelect = function(oVariantInfo) {
	
		var oVariant = null;
	
		if (oVariantInfo && oVariantInfo.key) {
	
			if (this._oVariantSet) {
	
				if (oVariantInfo.key === this.STANDARDVARIANTKEY) {
					oVariant = this._getStandardVariant();
				} else {
					oVariant = this._oVariantSet.getVariant(oVariantInfo.key);
				}
			}
		}
	
		if (oVariant) {
			this._applyVariant(oVariant);
		}
	};
	
	/**
	 * apply a variant content
	 * 
	 * @private
	 * @param {object} oVariant json object representing the variant data
	 * @returns {object} the variant content
	 */
	SmartVariantManagementUi2.prototype._getContent = function(oVariant) {
		var oContent = null;
	
		if (oVariant) {
			if (oVariant.getItemValue) {
				oContent = {
					filterbar: oVariant.getItemValue("filterbar"),
					filterBarVariant: oVariant.getItemValue("filterBarVariant")
				};
			} else {
				oContent = oVariant; // STANDARD variant
			}
		}
	
		return oContent;
	
	};
	
	/**
	 * apply a variant content
	 * 
	 * @private
	 * @param {object} oVariant json object representing the variant data
	 */
	SmartVariantManagementUi2.prototype._applyVariant = function(oVariant) {
	
		var oContent = this._getContent(oVariant);
	
		this._applyVariantContent(oContent);
	};
	
	/**
	 * apply a variant content
	 * 
	 * @private
	 * @param {object} oContent json object representing the variant data
	 */
	SmartVariantManagementUi2.prototype._applyVariantContent = function(oContent) {
	
		if (oContent && this._oPersController && this._oPersController.applyVariant) {
			this._oPersController.applyVariant(oContent);
		}
	};
	
	/**
	 * fetch a variant content
	 * 
	 * @private
	 * @returns {object} json object representing the content of a variant
	 */
	SmartVariantManagementUi2.prototype._fetchVariant = function() {
	
		if (this._oPersController && this._oPersController.fetchVariant) {
			return this._oPersController.fetchVariant();
		}
	
		return null;
	};
	
	/**
	 * read the persistency key
	 * 
	 * @private
	 * @returns {string} persistency key value
	 */
	SmartVariantManagementUi2.prototype._getPersistencyKey = function() {
	
		if (this._oPersController && this._sKeyName) {
			return this._oPersController.getProperty(this._sKeyName);
		}
	
		return null;
	};
	
	/**
	 * set an error state on the variant management control
	 * 
	 * @private
	 * @param {string} sText describing the error reason
	 */
	SmartVariantManagementUi2.prototype._setErrorValueState = function(sText) {
		this.setEnabled(false);
	
		this._displayError(sText);
	};
	
	SmartVariantManagementUi2.prototype._displayError = function(sText) {

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
	SmartVariantManagementUi2.prototype.exit = function() {
		VariantManagement.prototype.exit.apply(this, arguments);
	
		this._oStandardVariant = null;
		this._oPersController = null;
		this._sKeyName = null;
	
		this._oContainer = null;
		this._oVariantSet = null;
	};
	

	return SmartVariantManagementUi2;

}, /* bExport= */ true);
