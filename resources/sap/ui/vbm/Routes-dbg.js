/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Routes.
jQuery.sap.declare("sap.ui.vbm.Routes");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.vbm.VoAggregation");


/**
 * Constructor for a new Routes.
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
 * <ul></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getItems items} <strong>(default aggregation)</strong> : sap.ui.vbm.Route[]</li>
 * <li>{@link #getDragSource dragSource} : sap.ui.vbm.DragSource[]</li>
 * <li>{@link #getDropTarget dropTarget} : sap.ui.vbm.DropTarget[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.Routes#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Routes#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Routes#event:drop drop} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.ui.vbm.VoAggregation#constructor sap.ui.vbm.VoAggregation}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Routes aggregation container
 * @extends sap.ui.vbm.VoAggregation
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Routes
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.vbm.VoAggregation.extend("sap.ui.vbm.Routes", { metadata : {

	library : "sap.ui.vbm",
	defaultAggregation : "items",
	aggregations : {
		"items" : {type : "sap.ui.vbm.Route", multiple : true, singularName : "item"}, 
		"dragSource" : {type : "sap.ui.vbm.DragSource", multiple : true, singularName : "dragSource"}, 
		"dropTarget" : {type : "sap.ui.vbm.DropTarget", multiple : true, singularName : "dropTarget"}
	},
	events : {
		"click" : {}, 
		"contextMenu" : {}, 
		"drop" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.Routes with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Routes.extend
 * @function
 */

sap.ui.vbm.Routes.M_EVENTS = {'click':'click','contextMenu':'contextMenu','drop':'drop'};


/**
 * Getter for aggregation <code>items</code>.<br/>
 * route object aggregation
 * 
 * <strong>Note</strong>: this is the default aggregation for Routes.
 * @return {sap.ui.vbm.Route[]}
 * @public
 * @name sap.ui.vbm.Routes#getItems
 * @function
 */


/**
 * Inserts a item into the aggregation named <code>items</code>.
 *
 * @param {sap.ui.vbm.Route}
 *          oItem the item to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the item should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the item is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the item is inserted at 
 *             the last position        
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#insertItem
 * @function
 */

/**
 * Adds some item <code>oItem</code> 
 * to the aggregation named <code>items</code>.
 *
 * @param {sap.ui.vbm.Route}
 *            oItem the item to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#addItem
 * @function
 */

/**
 * Removes an item from the aggregation named <code>items</code>.
 *
 * @param {int | string | sap.ui.vbm.Route} vItem the item to remove or its index or id
 * @return {sap.ui.vbm.Route} the removed item or null
 * @public
 * @name sap.ui.vbm.Routes#removeItem
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>items</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.Route[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.Routes#removeAllItems
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.vbm.Route</code> in the aggregation named <code>items</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.vbm.Route}
 *            oItem the item whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ui.vbm.Routes#indexOfItem
 * @function
 */
	

/**
 * Destroys all the items in the aggregation 
 * named <code>items</code>.
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#destroyItems
 * @function
 */


/**
 * Getter for aggregation <code>dragSource</code>.<br/>
 * DragSource aggregation
 * 
 * @return {sap.ui.vbm.DragSource[]}
 * @public
 * @name sap.ui.vbm.Routes#getDragSource
 * @function
 */


/**
 * Inserts a dragSource into the aggregation named <code>dragSource</code>.
 *
 * @param {sap.ui.vbm.DragSource}
 *          oDragSource the dragSource to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the dragSource should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the dragSource is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the dragSource is inserted at 
 *             the last position        
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#insertDragSource
 * @function
 */

/**
 * Adds some dragSource <code>oDragSource</code> 
 * to the aggregation named <code>dragSource</code>.
 *
 * @param {sap.ui.vbm.DragSource}
 *            oDragSource the dragSource to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#addDragSource
 * @function
 */

/**
 * Removes an dragSource from the aggregation named <code>dragSource</code>.
 *
 * @param {int | string | sap.ui.vbm.DragSource} vDragSource the dragSource to remove or its index or id
 * @return {sap.ui.vbm.DragSource} the removed dragSource or null
 * @public
 * @name sap.ui.vbm.Routes#removeDragSource
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>dragSource</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.DragSource[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.Routes#removeAllDragSource
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.vbm.DragSource</code> in the aggregation named <code>dragSource</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.vbm.DragSource}
 *            oDragSource the dragSource whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ui.vbm.Routes#indexOfDragSource
 * @function
 */
	

/**
 * Destroys all the dragSource in the aggregation 
 * named <code>dragSource</code>.
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#destroyDragSource
 * @function
 */


/**
 * Getter for aggregation <code>dropTarget</code>.<br/>
 * DropTarget aggregation
 * 
 * @return {sap.ui.vbm.DropTarget[]}
 * @public
 * @name sap.ui.vbm.Routes#getDropTarget
 * @function
 */


/**
 * Inserts a dropTarget into the aggregation named <code>dropTarget</code>.
 *
 * @param {sap.ui.vbm.DropTarget}
 *          oDropTarget the dropTarget to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the dropTarget should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the dropTarget is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the dropTarget is inserted at 
 *             the last position        
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#insertDropTarget
 * @function
 */

/**
 * Adds some dropTarget <code>oDropTarget</code> 
 * to the aggregation named <code>dropTarget</code>.
 *
 * @param {sap.ui.vbm.DropTarget}
 *            oDropTarget the dropTarget to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#addDropTarget
 * @function
 */

/**
 * Removes an dropTarget from the aggregation named <code>dropTarget</code>.
 *
 * @param {int | string | sap.ui.vbm.DropTarget} vDropTarget the dropTarget to remove or its index or id
 * @return {sap.ui.vbm.DropTarget} the removed dropTarget or null
 * @public
 * @name sap.ui.vbm.Routes#removeDropTarget
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>dropTarget</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.DropTarget[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.Routes#removeAllDropTarget
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.vbm.DropTarget</code> in the aggregation named <code>dropTarget</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.vbm.DropTarget}
 *            oDropTarget the dropTarget whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ui.vbm.Routes#indexOfDropTarget
 * @function
 */
	

/**
 * Destroys all the dropTarget in the aggregation 
 * named <code>dropTarget</code>.
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#destroyDropTarget
 * @function
 */


/**
 * The event is raised when there is a click action on a Route.
 *
 * @name sap.ui.vbm.Routes#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.Routes</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Routes</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on a Route.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Routes</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.Routes</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Routes#fireClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on a Route.
 *
 * @name sap.ui.vbm.Routes#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.Routes</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Routes</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on a Route.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Routes</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.Routes</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Routes#fireContextMenu
 * @function
 */


/**
 * The event is raised when something is dropped on a Route.
 *
 * @name sap.ui.vbm.Routes#drop
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'drop' event of this <code>sap.ui.vbm.Routes</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Routes</code>.<br/> itself. 
 *  
 * The event is raised when something is dropped on a Route.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Routes</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#attachDrop
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'drop' event of this <code>sap.ui.vbm.Routes</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Routes#detachDrop
 * @function
 */

/**
 * Fire event drop to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Routes} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Routes#fireDrop
 * @function
 */

// Start of sap/ui/vbm/Routes.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.Routes.prototype.init = function(){
//   // do something for initialization...
//};


//...........................................................................//
// model creators...........................................................//

sap.ui.vbm.Routes.prototype.getTemplateObject = function()
{
   var id = this.getId();
   
   //DragSource of aggregation
   var aDS = this.getDragSource();
   var sDS=[];
   for(var nJ=0,len =aDS.length; nJ < len; ++nJ)
   {
	   var oDS = aDS[nJ];
	   var oEntry =
	   {
		  "type": oDS.getType()
	   };
	   sDS.push( oEntry );
   }
   sDS.push({
        "datasource": id + ".DS",
        "type.bind": id + ".DS.DGT",
	});
      
   //DropTarget of aggregation
   var aDT = this.getDropTarget();
   var sDT=[];
   for(var nJ=0,len =aDT.length; nJ < len; ++nJ)
   {
	   var oDT = aDT[nJ];
	   var oEntry =
	   {
		  "type": oDT.getType()
	   };
	   sDT.push( oEntry );
   }  
   sDT.push({
        "datasource": id + ".DT",
        "type.bind": id + ".DT.DPT"
	});

   return   {
      "type": "{00100000-2012-0004-B001-C46BD7336A1A}",
      "posarray.bind": id + ".P",                                 // P is the position array
      "color.bind": id + ".C",                                    // C is the color
      "start.bind": id + ".ST",                                   // ST is the start style
      "end.bind": id + ".ED",                                     // ED is the end style
      "linewidth.bind": id + ".LW",                               // LW is the linewidth
      "dotcolor.bind": id + ".DC",                                // DC is the dotcolor
      "dotbordercolor.bind": id + ".DBC",                         // DBC is the dotborder color
      "dotwidth.bind" : id + ".DW",                               // DW is the dot width
      "dragdata.bind": id + ".DD",                       	      // DD is the dragData
      
      //DragSource
      "DragSource": {
			"DragItem": sDS
		},
		
	  //DropTarget
	  "DropTarget": {
			"DropItem": sDT
		}      
   };
};


sap.ui.vbm.Routes.prototype.getDataObject = function()
{
   // collect the data table from the objects aggregation 

   var aVO = this.getItems();

   // process visual objects.................................................//
   var saE = [];     // elements array consisting of the attributes..........//
   var sDD = [];	 // array consisting of Drag and Drop attributes
   var oElement, oDS, oDT;
 
   for( var nJ = 0, len = aVO.length; nJ < len; ++nJ )
   {
      // get the control.....................................................//
      var oInstance = aVO[nJ];
      
      sDD = [];		//reinitialize DnD attributes for each instance
      
      //DragSource of VO instance
      var sDS=[];	// array consisting of Drag attributes
      var nDS=0;	//counter to set the index
      
      var aDragSource = oInstance.getDragSource();
      
      //iterate over each DragSource      
      for(  var nK = 0, lenDS=aDragSource.length ; nK < lenDS; ++nK )
      {
         var oInstDS = aDragSource[nK];
         var oEntryDS = 
         {
        	"VB:ix": nDS++,				//index
            "A":  oInstDS.getType()		//type
         };         
         sDS.push( oEntryDS );
      }
      if(sDS.length>0){
       	  oDS = {
    	     "name" : "DS",
    	     "E": sDS
      	  };      
       	  sDD.push(oDS);
      }
      
      //DropTarget of VO instance
      var sDT=[];   // array consisting of Drop attributes
      var nDT=0;	//counter to set the index
      
      var aDropTarget = oInstance.getDropTarget(); 
       
      //iterate over each DropTarget         
      for( var nK = 0, lenDT=aDropTarget.length ; nK < lenDT; ++nK )
      {
         var oInstDT = aDropTarget[nK];
         var oEntryDT = 
         {
        	"VB:ix": nDT++,				//index
            "A":  oInstDT.getType()		//type
         };         
         sDT.push( oEntryDT );
      }
      if(sDT.length>0){
    	  oDT = {
    	     "name" : "DT",
    	     "E": sDT
      	  };       
    	  sDD.push(oDT); 
      }  

      // add the control object description..................................// 
      oElement = 
      {
            "P" :    oInstance.getPosition(),
            "C" :    oInstance.getColor(),
            "ST" :   oInstance.getStart(),
            "ED" :   oInstance.getEnd(),
            "LW" :   oInstance.getLinewidth(),
            "DC" :   oInstance.getDotcolor(),
            "DBC" :  oInstance.getDotbordercolor(),
            "DW" :   oInstance.getDotwidth(),
            "DD" :  oInstance.getDragData(),
            "N"  :  sDD
      };
      saE.push( oElement );
   }

   return {
            "name": this.getId(),
            "E": saE
      };
};


sap.ui.vbm.Routes.prototype.getTypeObject = function()
{
   return {
      "A": [
             {
                "changeable": "true",
                "name": "P",              // position array
                "alias": "P",
                "type": "vector"
             },
             {
                "name": "C",              // color
                "alias": "C",
                "type": "color"
             },
             {
                "name": "ST",              // start type
                "alias": "ST",
                "type": "long"
             },
             {
                "name": "ED",              // end type
                "alias": "ED",
                "type": "long"
             },             
             {
                "name": "LW",              // linewidth
                "alias": "LW",
                "type": "float"
             },
             {
                "name": "DC",              // dotcolor
                "alias": "DC",
                "type": "color"
             },
             {
                "name": "DBC",              // dotbordercolor
                "alias": "DBC",
                "type": "color"
             },
             {
                "name": "DW",              // dot diameter
                "alias": "DW",
                "type": "float"
             },
             {
                 "name": "DD",              // dragdata
                 "alias": "DD",
                 "type": "string"
              }
           ],
	"N": [
			{
				"name": "DS",			//DragSource
				"A": 
				{
					"name": "DGT",		//DragType
					"alias": "A",
					"type": "string"
				}
			},
			{
				"name": "DT",			//DropTarget
				"A": 
				{
					"name": "DPT",		//DropType
					"alias": "A",
					"type": "string"
				}
			}
		]
    };
};


//..........................................................................//
// helper functions.........................................................//

sap.ui.vbm.Routes.prototype.HandleEvent = function( event )
{
   var s = event.Action.name;   

   var funcname = "fire" +  s[0].toUpperCase() + s.slice( 1 );

   // first we try to get the event on a spots instance......................//
   var route;
   if( route = this.FindInstance( event.Action.instance ) )
   {
      if( route.mEventRegistry[ s ] )
      { 
         if( s =="contextMenu" )
         {
            route.mClickPos = [event.Action.Params.Param[0]['#'], event.Action.Params.Param[1]['#']];
            // create an empty menu
            jQuery.sap.require("sap.ui.unified.Menu");    

            if( this.oParent.m_VBIContext.m_Menus )
               this.oParent.m_VBIContext.m_Menus.deleteMenu( "DynContextMenu" );
            
            
            var oMenuObject = new sap.ui.unified.Menu();
            oMenuObject.vbi_data = {};
            oMenuObject.vbi_data.menuRef  = "CTM";
            oMenuObject.vbi_data.VBIName  = "DynContextMenu";

            // fire the contextMenu..................................................//
            route.fireContextMenu( { data: event, menu: oMenuObject});
         } 
         else         
            route[ funcname ]( { data: event } );
      }
   }
   this[ funcname ]( { data: event } );
};


sap.ui.vbm.Routes.prototype.openContextMenu = function( inst, menu )
{
   this.oParent.openContextMenu( "Route", inst, menu );
};

sap.ui.vbm.Routes.prototype.openDetailWindow = function( inst, params ){
   this.oParent.m_bUseClickPos = false;
   this.oParent.m_DTOpen = true;
   this.oParent.m_DTSrc = inst;
   this.oParent.m_DTParams = params;
   this.oParent.m_bWindowsDirty = true;
   this.oParent.invalidate(this);
};

sap.ui.vbm.Routes.prototype.getActionArray = function( aActions )
{
	var id = this.getId();
	
	// check if the different vo events are registered..............................//
    if( this.mEventRegistry[ "click" ] || this.IsEventRegistered( "click" )  )
       aActions.push(  { "id": id + "1", "name": "click", "refScene": "MainScene", "refVO": id, "refEvent": "Click", "AddActionProperty": [{"name": "pos"}]} );
    if( this.mEventRegistry[ "contextMenu" ] || this.IsEventRegistered( "contextMenu" ) )
       aActions.push(  { "id": id + "2", "name": "contextMenu", "refScene": "MainScene", "refVO": id, "refEvent": "ContextMenu" } );
    if( this.mEventRegistry[ "drop" ] || this.IsEventRegistered( "drop" ) )
	   aActions.push(  { "id": id + "3", "name": "drop", "refScene": "MainScene", "refVO": id, "refEvent": "Drop" } );

    aActions = sap.ui.vbm.VoAggregation.prototype.getActionArray.apply(this, arguments);
       	   
    return aActions;
};
