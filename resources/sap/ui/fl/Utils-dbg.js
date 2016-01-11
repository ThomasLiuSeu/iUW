/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */

sap.ui.define([
	"jquery.sap.global", "sap/ui/core/Component"
], function(jQuery, Component) {
	"use strict";

	/**
	 * Provides utility functions for the flexibility library
	 *
	 * @namespace
	 * @alias sap.ui.fl.Utils
	 * @author SAP SE
	 * @version 1.28.1
	 * @experimental Since 1.25.0
	 */
	var Utils = {

		/**
		 * log object exposes available log functions
		 *
		 * @name sap.ui.fl.Utils.log
		 * @public
		 */
		log: {
			error: function(sMessage, sDetails, sComponent) {
				jQuery.sap.log.error(sMessage, sDetails, sComponent);
			},
			warning: function(sMessage, sDetails, sComponent) {
				jQuery.sap.log.warning(sMessage, sDetails, sComponent);
			}
		},

		/**
		 * Tries to retrieve the xsrf token from the controls OData Model. Returns empty string if retrieval failed.
		 *
		 * @param {sap.ui.core.Control} oControl - SAPUI5 control
		 * @returns {String} XSRF Token
		 * @public
		 * @function
		 * @name sap.ui.fl.Utils.getXSRFTokenFromControl
		 */
		getXSRFTokenFromControl: function(oControl) {
			var oModel;
			if (!oControl) {
				return "";
			}

			// Get Model
			if (oControl && typeof oControl.getModel === 'function') {
				oModel = oControl.getModel();
				return Utils._getXSRFTokenFromModel(oModel);
			}
			return "";
		},

		/**
		 * Returns XSRF Token from the Odata Model. Returns empty string if retrieval failed
		 *
		 * @param {sap.ui.model.odata.ODataModel} oModel - OData Model
		 * @returns {String} XSRF Token
		 * @private
		 */
		_getXSRFTokenFromModel: function(oModel) {
			var mHeaders;
			if (!oModel) {
				return "";
			}
			if (typeof oModel.getHeaders === 'function') {
				mHeaders = oModel.getHeaders();
				if (mHeaders) {
					return mHeaders['x-csrf-token'];
				}
			}
			return "";
		},

		/**
		 * Returns the class name of the component the given control belongs to.
		 *
		 * @param {sap.ui.core.Control} oControl - SAPUI5 control
		 * @returns {String} The component class name, ending with ".Component"
		 * @see sap.ui.base.Component.getOwnerIdFor
		 * @public
		 * @function
		 * @name sap.ui.fl.Utils.getComponentClassName
		 */
		getComponentClassName: function(oControl) {
			if (!oControl) {
				return "";
			}
			var sComponentId = Utils._getComponentIdForControl(oControl);
			if (!sComponentId) {
				return "";
			}
			return sap.ui.component(sComponentId).getMetadata().getName();
		},

		/**
		 * Returns ComponentId of the control. If the control has no component, it walks up the control tree in order to find a control having one
		 *
		 * @param {sap.ui.core.Control} oControl - SAPUI5 control
		 * @returns {String} The component id
		 * @see sap.ui.base.Component.getOwnerIdFor
		 * @private
		 */
		_getComponentIdForControl: function(oControl) {
			var sComponentId = "", i = 0;
			do {
				i++;
				sComponentId = Utils._getOwnerIdForControl(oControl);
				if (sComponentId) {
					return sComponentId;
				}
				if (oControl && typeof oControl.getParent === 'function') { // Walk up control tree
					oControl = oControl.getParent();
				} else {
					return "";
				}
			} while (oControl && i < 100);
			return "";
		},

		/**
		 * Returns the parent view of the control. If there are nested views, only the one closest to the control will be returned. If no view can be
		 * found, undefiend will be returned.
		 *
		 * @param {sap.ui.core.Control} oControl - SAPUI5 control
		 * @returns {sap.ui.core.mvc.View} The view
		 * @see sap.ui.base.Component.getOwnerIdFor
		 * @public
		 */
		getViewForControl: function(oControl) {
			return Utils.getFirstAncestorOfControlWithControlType(oControl, sap.ui.core.mvc.View);

		},

		getFirstAncestorOfControlWithControlType: function(oControl, controlType) {
			if (oControl instanceof controlType){
				return oControl;
			}

			if (oControl && typeof oControl.getParent === 'function') {
				oControl = oControl.getParent();
				return Utils.getFirstAncestorOfControlWithControlType(oControl, controlType);
			}
		},

		hasControlAncestorWithId: function(sControlId, sAncestorControlId){
			var oControl;

			if (sControlId === sAncestorControlId){
				return true;
			}

			oControl = sap.ui.getCore().byId(sControlId);
			while (oControl){

				if (oControl.getId() === sAncestorControlId){
					return true;
				}
				
				if (typeof oControl.getParent === 'function') {
					oControl = oControl.getParent();
				} else {
					return false;
				}
			}
			
			return false;
		},



		/**
		 * Checks whether the provided control is a view
		 *
		 * @param {sap.ui.core.Control} oControl - SAPUI5 control
		 * @returns {Boolean} Flag
		 * @see sap.ui.base.Component.getOwnerIdFor
		 * @private
		 */
		_isView: function(oControl) {
			return oControl instanceof sap.ui.core.mvc.View;
		},

		/**
		 * Returns OwnerId of the control
		 *
		 * @param {sap.ui.core.Control} oControl - SAPUI5 control
		 * @returns {String} The owner id
		 * @see sap.ui.base.Component.getOwnerIdFor
		 * @private
		 */
		_getOwnerIdForControl: function(oControl) {
			return Component.getOwnerIdFor(oControl);
		},

		/**
		 * Returns the current layer as defined by the url parameter. If the end user flag is set, it always returns "USER".
		 *
		 * @param {boolean} bIsEndUser - the end user flag
		 * @returns {string} the current layer
		 * @public
		 * @function
		 * @name sap.ui.fl.Utils.getCurrentLayer
		 */
		getCurrentLayer: function(bIsEndUser) {
			var oUriParams, layer;
			if (bIsEndUser) {
				return "USER";
			}

			oUriParams = this._getUriParameters();
			layer = oUriParams.mParams['sap-ui-layer'];
			if (layer && layer.length > 0) {
				return layer[0];
			}
			return "CUSTOMER";

		},

		/**
		 * Checks if a shared newly created variant requires an ABAP package
		 *
		 * @returns {boolean} - Indicates whether a new variant needs an ABAP package
		 * @public
		 * @function
		 * @name sap.ui.fl.Utils.doesSharedVariantRequirePackage
		 */
		doesSharedVariantRequirePackage: function() {
			var sCurrentLayer;
			sCurrentLayer = Utils.getCurrentLayer(false);
			if ((sCurrentLayer === 'VENDOR') || (sCurrentLayer === 'PARTNER')) {
				return true;
			}
			if (sCurrentLayer === 'USER') {
				return false;
			}
			if (sCurrentLayer === 'CUSTOMER') {
				return false; // Variants in CUSTOMER layer might either be transported or stored as local objects ($TMP) as they are client
								// dependent content. A variant which will be transported must not be assigned to a package.
			}

			return false;
		},

		/**
		 * Returns the tenant number for the communication with the ABAP backend.
		 *
		 * @public
		 * @function
		 * @returns {string} the current client
		 * @name sap.ui.fl.Utils.getClient
		 */
		getClient: function() {
			var oUriParams, client;
			oUriParams = this._getUriParameters();
			client = oUriParams.mParams['sap-client'];
			if (client && client.length > 0) {
				return client[0];
			}
			return undefined;
		},
		_getUriParameters: function() {
			return jQuery.sap.getUriParameters();
		},

		/**
		 * Returns whether the hot fix mode is active (url parameter hotfix=true)
		 *
		 * @public
		 * @returns {bool} is hotfix mode active, or not
		 */
		isHotfixMode: function() {
			var oUriParams, aIsHotfixMode, sIsHotfixMode;
			oUriParams = this._getUriParameters();
			aIsHotfixMode = oUriParams.mParams['hotfix'];
			if (aIsHotfixMode && aIsHotfixMode.length > 0) {
				sIsHotfixMode = aIsHotfixMode[0];
			}
			return (sIsHotfixMode === 'true');
		},

		/**
		 * Converts the browser language into a 2-character ISO 639-1 language. If the browser language is in format RFC4646, the first part will be
		 * used: For example en-us will be converted to EN. If the browser language already is in ISO 639-1, it will be returned after an upper case
		 * conversion: For example de will be converted to DE.
		 *
		 * @param {String} sBrowserLanguage - Language in RFC4646
		 * @returns {String} Language in ISO 639-1. Empty string if conversion was not successful
		 * @public
		 * @function
		 * @name sap.ui.fl.Utils.convertBrowserLanguageToISO639_1
		 */
		convertBrowserLanguageToISO639_1: function(sBrowserLanguage) {
			if (!sBrowserLanguage || typeof sBrowserLanguage !== 'string') {
				return "";
			}

			var nIndex = sBrowserLanguage.indexOf('-');
			if ((nIndex < 0) && (sBrowserLanguage.length <= 2)) {
				return sBrowserLanguage.toUpperCase();
			}
			if (nIndex > 0 && nIndex <= 2) {
				return sBrowserLanguage.substring(0, nIndex).toUpperCase();
			}

			return "";
		},

		/**
		 * Returns the current language in ISO 639-1 format.
		 *
		 * @returns {String} Language in ISO 639-1. Empty string if language cannot be determined
		 * @public
		 */
		getCurrentLanguage: function() {
			var sLanguage = sap.ui.getCore().getConfiguration().getLanguage();
			return Utils.convertBrowserLanguageToISO639_1(sLanguage);
		},

		/**
		 * Retrieves the controlType of the control
		 *
		 * @param {sap.ui.core.Control} oControl Control instance
		 * @returns {string} control type of the control - undefined if controlType cannot be determined
		 * @private
		 */
		getControlType: function(oControl) {
			var oMetadata;
			if (oControl && typeof oControl.getMetadata === 'function') {
				oMetadata = oControl.getMetadata();
				if (oMetadata && typeof oMetadata.getElementName === 'function') {
					return oMetadata.getElementName();
				}
			}
		},		
		
		/**
		 * Check if the control id is generated or maintained by the application
		 * @param {sap.ui.core.Control} oControl Control instance
		 * @returns {boolean} Returns true if the id is maintained by the application
		 *
		 */
		checkControlId: function(oControl) {
			var bIsGenerated = sap.ui.base.ManagedObjectMetadata.isGeneratedId(oControl.getId());
			// get the information if the control id was generated or not
			if (bIsGenerated === true) {
				jQuery.sap.log.error("Generated id attribute found", "to offer flexibility a stable control id is needed to assign the changes to, but for this control the id was generated by SAPUI5", oControl.getId());
			}
			return !bIsGenerated;
		}

	};
	return Utils;
}, true);
