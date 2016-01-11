/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */

// Provides object sap.ui.fl.Processor
sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/mvc/Preprocessor', 'sap/ui/fl/PreprocessorImpl'
], function(jQuery, CorePreprocessor, PreprocessorImpl) {
	'use strict';

	/**
	 * UI5 Flexiblity Services Preprocessor implementation that can be hooked in the View life cycle.
	 * 
	 * @author D034127
	 * @name sap.ui.fl.Preprocessor
	 * @class
	 * @public
	 * @extends sap.ui.core.mvc.Preprocessor
	 */
	var FlexPreprocessor = CorePreprocessor.extend("sap.ui.fl.Preprocessor", {
	});
	
	/**
	 * Asynchronous processing method that should be implemented by the inheriting Preprocessor class.
	 * 
	 * @param {sap.ui.core.mvc.View} oView view to process
	 * @returns {jquery.sap.promise} result of the processing, promise if executed asynchronously
	 * 
	 * @public
	 */
	 FlexPreprocessor.process = function(oView){
		return PreprocessorImpl.process(oView);
	 };
	 
	 return FlexPreprocessor;

}, /* bExport= */true);