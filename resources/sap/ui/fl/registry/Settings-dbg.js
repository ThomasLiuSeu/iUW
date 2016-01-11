/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */
/*global Error */

sap.ui.define([
	"jquery.sap.global", "sap/ui/fl/LrepConnector", "sap/ui/fl/Cache", "sap/ui/fl/Utils", "sap/ui/base/EventProvider"
], function(jQuery, LrepConnector, Cache, Utils, EventProvider) {
	"use strict";

	/**
	 * FlexSettings access
	 * @param {object} oSettings settings as JSON object
	 * @constructor
	 * @alias sap.ui.fl.registry.Settings
	 * @author SAP SE
	 * @experimental Since 1.27.0
	 * @private
	 */
	var Settings = function(oSettings) {
		EventProvider.apply(this);
		if (!oSettings) {
			throw new Error("no flex settings provided");
		}
		if (!oSettings.features) {
			//hardcoded list of flex features (change types) and their valid "writable layer"
			oSettings.features = {
				"addField": [
					"CUSTOMER", "VENDOR"
				],
				"addGroup": [
					"CUSTOMER", "VENDOR"
				],
				"removeField": [
					"CUSTOMER", "VENDOR"
				],
				"removeGroup": [
					"CUSTOMER", "VENDOR"
				],
				"hideControl": [
					"CUSTOMER", "VENDOR"
				],
				"unhideControl": [
					"CUSTOMER", "VENDOR"
				],
				"renameField": [
					"CUSTOMER", "VENDOR"
				],
				"renameGroup": [
					"CUSTOMER", "VENDOR"
				],
				"moveFields": [
					"CUSTOMER", "VENDOR"
				],
				"moveGroups": [
					"CUSTOMER", "VENDOR"
				]
			};
		}
		this._oSettings = oSettings;
		this._bFlexChangeMode = true;
	};
	
	Settings.prototype = jQuery.sap.newObject(EventProvider.prototype);
	
	Settings.events = {
	   changeModeUpdated: "changeModeUpdated"
	};

	Settings._instances = {};

	/**
	 * Returns a settings instance after reading the settings from the backend if not already done.
	 * There is only one instance of settings during a session.
	 * @param {string} sComponentName current UI5 component name
	 * @returns {Promise} with parameter <code>oInstance</code> of type {sap.ui.fl.registry.Settings}
	 * @public
	 */
	Settings.getInstance = function(sComponentName) {
		return Cache.getChangesFillingCache(LrepConnector.createConnector(), sComponentName).then(function(oFileContent) {
			var oSettings;
			if (Settings._instances[sComponentName]) {
				//if instance exists the backend settings are coming from the cache as well and can be ignored
				oSettings = Settings._instances[sComponentName];
			} else if (oFileContent.changes && oFileContent.changes.settings) {
				oSettings = new Settings(oFileContent.changes.settings);
				Settings._instances[sComponentName] = oSettings;
			} else {
				oSettings = new Settings({});
				Settings._instances[sComponentName] = oSettings;
			}
			return oSettings;
		});
	};

	/**
	 * Returns a settings instance from the local instance cache.
	 * There is only one instance of settings during a session.
	 * If no instance has been created before, undefined will be returned.
	 * @param {string} sComponentName current UI5 component name
	 * @returns {sap.ui.fl.registry.Settings} instance or undefined if no instance has been created so far.
	 * @public
	 */
	Settings.getInstanceOrUndef = function(sComponentName) {
		var oSettings;
		if (Settings._instances[sComponentName]) {
			oSettings = Settings._instances[sComponentName];
		}
		return oSettings;
	};

	/**
	 * Returns the key user status of the current user.
	 * @returns {boolean} true if the user is a flexibility key user, false if not supported.
	 * @public
	 */
	Settings.prototype.isKeyUser = function() {
		var bIsKeyUser = false;
		if (this._oSettings.isKeyUser) {
			bIsKeyUser = this._oSettings.isKeyUser;
		}
		return bIsKeyUser;
	};
	
	/**
	 * Returns true if backend is ModelS backend.
	 * @returns {boolean} true if ATO coding exists in backend.
	 * @public
	 */
	Settings.prototype.isModelS = function() {
		var bIsModelS = false;
		if (this._oSettings.isAtoAvailable) {
			bIsModelS = this._oSettings.isAtoAvailable;
		}
		return bIsModelS;
	};	
	
	/**
	 * Returns true if ATO is enabled in the backend.
	 * @returns {boolean} true if ATO is enabled.
	 * @public
	 */
	Settings.prototype.isAtoEnabled = function() {
		var bIsAtoEnabled = false;
		if (this._oSettings.isAtoEnabled) {
			bIsAtoEnabled = this._oSettings.isAtoEnabled;
		}
		return bIsAtoEnabled;
	};	

	/**
	 * Checks if a change type is enabled for the current writable layer
	 * @param {string} sChangeType change type to be checked
	 * @param {string} sActiveLayer active layer name; if not provided "USER" is the default.
	 * @returns {boolean} true if the change type is enabled, false if not supported.
	 * @public
	 */
	Settings.prototype.isChangeTypeEnabled = function(sChangeType, sActiveLayer) {
		if (!sActiveLayer) {
			sActiveLayer = 'USER';
		}
		var bIsEnabled = false;
		if (!this._oSettings.features[sChangeType]) {
			//if the change type is not in the feature list, the change type is not check relevant and therefore always enabled.
			//if a change type should be disabled for all layers, an entry in the feature map has to exist with an empty array.
			bIsEnabled = true;
		} else {
			var iArrayPos = jQuery.inArray(sActiveLayer, this._oSettings.features[sChangeType]);
			if (iArrayPos < 0) {
				bIsEnabled = false;
			} else {
				bIsEnabled = true;
			}
		}
		return bIsEnabled;
	};

	/**
	 * Checks if the flexibility change mode is enabled.
	 * @returns {boolean} true if the flexibility change mode is enabled
	 * @public
	 */
	Settings.prototype.isFlexChangeMode = function() {
		var bFlexChangeMode = false;
		var bFlexChangeModeUrl = this._isFlexChangeModeFromUrl();
		if (bFlexChangeModeUrl === undefined) {
			bFlexChangeMode = this._bFlexChangeMode;
		} else {
			bFlexChangeMode = bFlexChangeModeUrl;
		}
		return bFlexChangeMode;
		//return this._bFlexChangeMode;
	};

	/**
	 * Checks if the flexibility change mode is enabled via URL query parameter
	 * @returns {boolean} true if the flexibility change mode is enabled, false if not enabled, undefined if not set via url.
	 * @public
	 */
	Settings.prototype._isFlexChangeModeFromUrl = function() {
		var bFlexChangeMode;
		var oUriParams = jQuery.sap.getUriParameters();
		if (oUriParams && oUriParams.mParams && oUriParams.mParams['sap-ui-fl-changeMode'] && oUriParams.mParams['sap-ui-fl-changeMode'][0]) {
			if (oUriParams.mParams['sap-ui-fl-changeMode'][0] === 'true') {
				bFlexChangeMode = true;
			} else if (oUriParams.mParams['sap-ui-fl-changeMode'][0] === 'false') {
				bFlexChangeMode = false;
			}
		}
		return bFlexChangeMode;
	};

	/**
	 * Activates the flexibility change mode.
	 * @public
	 */
	Settings.prototype.activateFlexChangeMode = function() {
		this._bFlexChangeMode = true;
		var mParameter = {
		     bFlexChangeMode: true
		};
		this.fireEvent(Settings.events.changeModeUpdated, mParameter);
	};

	/**
	 * Deactivates / leaves the flexibility change mode.
	 * @public
	 */
	Settings.prototype.leaveFlexChangeMode = function() {
		this._bFlexChangeMode = false;
		var mParameter = {
		    bFlexChangeMode: false
		};
		this.fireEvent(Settings.events.changeModeUpdated, mParameter);
	};
	
	/**
	 * Is current back end system defined as productive system which can also transport changes
	 * @public
	 * @returns	{boolean}	true if system is productive system 
	 */
	Settings.prototype.isProductiveSystem = function(){
		var bIsProductiveSystem = false;
		if (this._oSettings.isProductiveSystem) {
			bIsProductiveSystem = this._oSettings.isProductiveSystem;
		}
		return bIsProductiveSystem;			
	};

	return Settings;
}, /* bExport= */true);
