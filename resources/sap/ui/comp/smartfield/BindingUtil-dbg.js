/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

/**
 * Utility to access control binding for SmartFieldControl.
 * 
 * @public
 * @name sap.ui.comp.smartfield.MetaData
 * @author SAP SE
 * @version 1.28.1
 * @since 1.28.0
 * @returns {sap.ui.comp.smartfield.BindingUtil} the binding access class.
 */
sap.ui.define([], function() { // EXC_JSHINT_002 //EXC_JSHINT_034 //EXC_JSHINT_037
	"use strict";

	/**
	 * @public
	 * @constructor
	 */
	var BindingUtil = function() {  //EXC_JSLINT_021
		//nothing to do here.
	};

	/**
	 * Converts binding information for a control property to its original form.
	 * 
	 * @param {object} oInfo the binding information from the control.
	 * @returns {object} conversion result.
	 * @public
	 */
	BindingUtil.prototype.toBinding = function(oInfo) {
		var oOut = {}, n, oPart, i, len, mNames = {
			model: true,
			formatter: true,
			mode: true,
			path: true
		};

		if (oInfo) {
			if (oInfo.parts && oInfo.parts.length) {
				len = oInfo.parts.length;
				oOut.parts = [];
			}
			
			for (i = 0; i < len; i++) {
				oPart = oInfo.parts[i];
				oOut.parts.push(oPart);
			}
			
			for (n in mNames) {
				if (oInfo[n]) {
					oOut[n] = oInfo[n];
				}
			}

			return oOut;			
		}

		return null;
	};

	/**
	 * Converts binding information for a control property to its original form.
	 * 
	 * @param {object} oInfo the binding information from the control.
	 * @returns {string} conversion result.
	 * @public
	 */
	BindingUtil.prototype.toBindingPath = function(oInfo) {
		var oOut, sOut = "", oPart, i, len;

		oOut = this.toBinding(oInfo);

		if (oOut) {
			if (oOut.model) {
				sOut = oOut.model + ">";
			}

			if (oOut.path) {
				sOut = sOut + oOut.path;
			} else if (oOut.parts && oOut.parts.length > 0) {
				len = oOut.parts.length;
				
				for (i = 0; i < len; i++) {
					oPart = oOut.parts[i];
					
					if (oPart.model) {
						sOut = sOut + oPart.model + ">";
					}
					
					sOut = sOut + oPart.path;
				}
			}
		}

		return sOut;
	};

	/**
	 * Frees all resources claimed during the life-time of this instance.
	 * 
	 * @public
	 */
	BindingUtil.prototype.destroy = function() { //EXC_JSLINT_021
		//nothing to do here.
	};

	return BindingUtil;
}, true);
