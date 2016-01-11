/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */
/*global Promise */

sap.ui.define([
	"jquery.sap.global", "sap/ui/thirdparty/URI", "sap/ui/fl/Utils", "sap/ui/fl/LrepConnector"
], function(jQuery, uri, FlexUtils, LrepConnector) {
	"use strict";
	var lrepConnector = Object.create(LrepConnector.prototype);
	var instance;

	/**
	 * Please use the @link {FakeLrepConnector#enableFakeConnector} function
	 * to enable the FakeLrepConnector.
	 *
	 * Provides a fake implementation for the sap.ui.fl.LrepConnector
	 * @param {String} sInitialComponentJsonPath - the relative path to a test-component-changes.json file
	 *
	 * @constructor
	 * @alias sap.ui.fl.FakeLrepConnector
	 * @experimental Since 1.27.0
	 * @author SAP SE
	 * @version 1.28.1
	 */
	function FakeLrepConnector(sInitialComponentJsonPath){
		this.sInitialComponentJsonPath = sInitialComponentJsonPath;
	}

	for (var prop in lrepConnector){
		if (typeof lrepConnector[prop] === 'function'){
			/*eslint-disable noinspection, no-loop-func */
			FakeLrepConnector.prototype[prop] = (function(prop){
				return function() {
					throw new Error('Method ' + prop + '() is not implemented in FakeLrepConnector.');
				};
			}(prop));
			/*eslint-enable noinspection, no-loop-func */
		}
	}

	FakeLrepConnector.prototype.loadChanges = function(sComponentClassName){
		var initialComponentJsonPath = this.sInitialComponentJsonPath;

		return new Promise(function(resolve, reject){
			jQuery.getJSON(initialComponentJsonPath).done(function(oResponse){
				oResponse.changes = lrepConnector._condense(oResponse.changes);

				var result = {
					changes: oResponse,
					componentClassName: sComponentClassName
				};

				resolve(result);
			}).fail(function(error){
				reject(error);
			});
		});
	};

	FakeLrepConnector.prototype.create = function(){
		return Promise.resolve();
	};

	FakeLrepConnector.prototype.deleteChange = function(){
		return Promise.resolve();
	};

	/**
	 * Hooks into the @link {sap.ui.fl.LrepConnector.createConnector} factory
	 * function to enable the fake lrep connector.
	 *
	 * @param sInitialComponentJsonPath - the relative path to a test-component-changes.json file
	 */
	FakeLrepConnector.enableFakeConnector = function(sInitialComponentJsonPath){
		FakeLrepConnector.enableFakeConnector.original = LrepConnector.createConnector;

		LrepConnector.createConnector = function(){
			if (!instance) {
				instance = new FakeLrepConnector(sInitialComponentJsonPath);
			}

			return instance;
		};
	};

	/**
	 * Restore the original @link {sap.ui.fl.LrepConnector.createConnector} factory
	 * function.
	 */
	FakeLrepConnector.disableFakeConnector = function(){
		if (FakeLrepConnector.enableFakeConnector.original){
			LrepConnector.createConnector = FakeLrepConnector.enableFakeConnector.original;
		}
	};

	return FakeLrepConnector;

}, true);