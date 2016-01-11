/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2015 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.Datatransform_dataSampling_grid.
jQuery.sap.declare("sap.viz.ui5.types.Datatransform_dataSampling_grid");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/Datatransform_dataSampling_grid.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul>
 * <li>{@link #getRow row} : int (default: 3)</li>
 * <li>{@link #getColumn column} : int (default: 3)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.viz.ui5.core.BaseStructuredType#constructor sap.viz.ui5.core.BaseStructuredType}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Structured Type ui5/types/Datatransform_dataSampling_grid
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.28.1
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.Datatransform_dataSampling_grid
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Datatransform_dataSampling_grid", { metadata : {

	library : "sap.viz",
	properties : {
		"row" : {type : "int", group : "", defaultValue : 3},
		"column" : {type : "int", group : "", defaultValue : 3}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.Datatransform_dataSampling_grid with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.viz.ui5.types.Datatransform_dataSampling_grid.extend
 * @function
 */


/**
 * Getter for property <code>row</code>.
 * Set the number of rows in the grid.
 *
 * Default value is <code>3</code>
 *
 * @return {int} the value of property <code>row</code>
 * @public
 * @name sap.viz.ui5.types.Datatransform_dataSampling_grid#getRow
 * @function
 */

/**
 * Setter for property <code>row</code>.
 *
 * Default value is <code>3</code> 
 *
 * @param {int} iRow  new value for property <code>row</code>
 * @return {sap.viz.ui5.types.Datatransform_dataSampling_grid} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Datatransform_dataSampling_grid#setRow
 * @function
 */


/**
 * Getter for property <code>column</code>.
 * Set the number of columns in the grid.
 *
 * Default value is <code>3</code>
 *
 * @return {int} the value of property <code>column</code>
 * @public
 * @name sap.viz.ui5.types.Datatransform_dataSampling_grid#getColumn
 * @function
 */

/**
 * Setter for property <code>column</code>.
 *
 * Default value is <code>3</code> 
 *
 * @param {int} iColumn  new value for property <code>column</code>
 * @return {sap.viz.ui5.types.Datatransform_dataSampling_grid} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Datatransform_dataSampling_grid#setColumn
 * @function
 */

// Start of sap/viz/ui5/types/Datatransform_dataSampling_grid.js
