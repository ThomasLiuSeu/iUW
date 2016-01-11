/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Legend.
jQuery.sap.declare("sap.ui.vbm.Legend");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.core.Element");


/**
 * Constructor for a new Legend.
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
 * <li>{@link #getCaption caption} : string (default: 'Legend')</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getItems items} <strong>(default aggregation)</strong> : sap.ui.vbm.LegendItem[]</li></ul>
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
 * In addition, all settings applicable to the base type {@link sap.ui.core.Element#constructor sap.ui.core.Element}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * The Legend is a window in the GeoMap or AnalyticMap control wich can be used to display color/icon-text pairs on a map.
 * @extends sap.ui.core.Element
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Legend
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Element.extend("sap.ui.vbm.Legend", { metadata : {

	library : "sap.ui.vbm",
	properties : {
		"caption" : {type : "string", group : "Misc", defaultValue : 'Legend'}
	},
	defaultAggregation : "items",
	aggregations : {
		"items" : {type : "sap.ui.vbm.LegendItem", multiple : true, singularName : "item"}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.Legend with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Legend.extend
 * @function
 */


/**
 * Getter for property <code>caption</code>.
 * The caption of the legend.
 *
 * Default value is <code>Legend</code>
 *
 * @return {string} the value of property <code>caption</code>
 * @public
 * @name sap.ui.vbm.Legend#getCaption
 * @function
 */

/**
 * Setter for property <code>caption</code>.
 *
 * Default value is <code>Legend</code> 
 *
 * @param {string} sCaption  new value for property <code>caption</code>
 * @return {sap.ui.vbm.Legend} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Legend#setCaption
 * @function
 */


/**
 * Getter for aggregation <code>items</code>.<br/>
 * LegendItem object aggregation
 * 
 * <strong>Note</strong>: this is the default aggregation for Legend.
 * @return {sap.ui.vbm.LegendItem[]}
 * @public
 * @name sap.ui.vbm.Legend#getItems
 * @function
 */


/**
 * Inserts a item into the aggregation named <code>items</code>.
 *
 * @param {sap.ui.vbm.LegendItem}
 *          oItem the item to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the item should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the item is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the item is inserted at 
 *             the last position        
 * @return {sap.ui.vbm.Legend} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Legend#insertItem
 * @function
 */

/**
 * Adds some item <code>oItem</code> 
 * to the aggregation named <code>items</code>.
 *
 * @param {sap.ui.vbm.LegendItem}
 *            oItem the item to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.Legend} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Legend#addItem
 * @function
 */

/**
 * Removes an item from the aggregation named <code>items</code>.
 *
 * @param {int | string | sap.ui.vbm.LegendItem} vItem the item to remove or its index or id
 * @return {sap.ui.vbm.LegendItem} the removed item or null
 * @public
 * @name sap.ui.vbm.Legend#removeItem
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>items</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.LegendItem[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.Legend#removeAllItems
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.vbm.LegendItem</code> in the aggregation named <code>items</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.vbm.LegendItem}
 *            oItem the item whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ui.vbm.Legend#indexOfItem
 * @function
 */
	

/**
 * Destroys all the items in the aggregation 
 * named <code>items</code>.
 * @return {sap.ui.vbm.Legend} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Legend#destroyItems
 * @function
 */

// Start of sap/ui/vbm/Legend.js
///**
// * This file defines behavior for the control,
// */



sap.ui.vbm.Legend.prototype.init = function()
{
   // set legend flags.......................................................//
   // this.m_bLegendRendered = false;
};


//...........................................................................//
// model creators............................................................//


sap.ui.vbm.Legend.prototype.getTemplateObject = function()
{
   var id = this.getId();
   var oWindowsTemplate = {};
   
   if (!this.oParent.getLegendVisible() )

     oWindowsTemplate = {  "Remove": [ { "name": id } ] };
    
   else { 
   
     oWindowsTemplate = {
     "Set": [ {
    	"name": id, 
        "Window": {
              "id": id,
              "type": "legend",
              "caption" : this.getCaption(),
              "type": "legend",
              "refParent": "Main",
              "refScene": "",
              "modal": "true",
              "datasource": id,
              "colors.bind": id + ".C",
              "images.bind": id + ".I",
              "texts.bind": id + ".T",
              "tooltips.bind": id + "TT"
           }
        }
     ] };
   
   }
   
   return oWindowsTemplate;   
};

sap.ui.vbm.Legend.prototype.getDataObject = function()
{
   // collect the data table from the objects aggregation 

   var aItem = this.getItems();

   // process visual objects.................................................//
   var saE = [];     // elements array consisting of the attributes..........//
 
   for( var nJ = 0, len = aItem.length; nJ < len; ++nJ )
   {
      // get the control.....................................................//
      var oInstance = aItem[nJ];

      // add the control object description..................................// 
      var oElement = 
      {
         "C" : oInstance.getColor(),
         "I" : oInstance.getImage(),
         "T" : oInstance.getText(),
         "TT" : oInstance.getTooltip()
      };
      saE.push( oElement );
   }

   return {
      "name": this.getId(),
      "E": saE
   };
};

sap.ui.vbm.Legend.prototype.getTypeObject = function()
{
   return {
      "A": [
                {
                   "name": "C",              // color
                   "alias": "C",
                   "type": "color"
                },
                {
                   "name": "I",              // image
                   "alias": "I",
                   "type": "string"
                },
                {
                   "name": "T",              // text
                   "alias": "T",
                   "type": "string"
                },
                {
                   "name": "TT",             // tooltip
                   "alias": "TT",
                   "type": "string"
                }             
            ]
    };
};




