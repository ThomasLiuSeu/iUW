/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Pies.
jQuery.sap.declare("sap.ui.vbm.Pies");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.vbm.VoAggregation");


/**
 * Constructor for a new Pies.
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
 * <li>{@link #getItems items} <strong>(default aggregation)</strong> : sap.ui.vbm.Pie[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.Pies#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Pies#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Pies#event:drop drop} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
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
 * Pies aggregation container
 * @extends sap.ui.vbm.VoAggregation
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Pies
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.vbm.VoAggregation.extend("sap.ui.vbm.Pies", { metadata : {

	library : "sap.ui.vbm",
	defaultAggregation : "items",
	aggregations : {
		"items" : {type : "sap.ui.vbm.Pie", multiple : true, singularName : "item"}
	},
	events : {
		"click" : {}, 
		"contextMenu" : {}, 
		"drop" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.Pies with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Pies.extend
 * @function
 */

sap.ui.vbm.Pies.M_EVENTS = {'click':'click','contextMenu':'contextMenu','drop':'drop'};


/**
 * Getter for aggregation <code>items</code>.<br/>
 * Pie object aggregation
 * 
 * <strong>Note</strong>: this is the default aggregation for Pies.
 * @return {sap.ui.vbm.Pie[]}
 * @public
 * @name sap.ui.vbm.Pies#getItems
 * @function
 */


/**
 * Inserts a item into the aggregation named <code>items</code>.
 *
 * @param {sap.ui.vbm.Pie}
 *          oItem the item to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the item should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the item is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the item is inserted at 
 *             the last position        
 * @return {sap.ui.vbm.Pies} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pies#insertItem
 * @function
 */

/**
 * Adds some item <code>oItem</code> 
 * to the aggregation named <code>items</code>.
 *
 * @param {sap.ui.vbm.Pie}
 *            oItem the item to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.Pies} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pies#addItem
 * @function
 */

/**
 * Removes an item from the aggregation named <code>items</code>.
 *
 * @param {int | string | sap.ui.vbm.Pie} vItem the item to remove or its index or id
 * @return {sap.ui.vbm.Pie} the removed item or null
 * @public
 * @name sap.ui.vbm.Pies#removeItem
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>items</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.Pie[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.Pies#removeAllItems
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.vbm.Pie</code> in the aggregation named <code>items</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.vbm.Pie}
 *            oItem the item whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ui.vbm.Pies#indexOfItem
 * @function
 */
	

/**
 * Destroys all the items in the aggregation 
 * named <code>items</code>.
 * @return {sap.ui.vbm.Pies} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pies#destroyItems
 * @function
 */


/**
 * The event is raised when there is a click action on a Pie.
 *
 * @name sap.ui.vbm.Pies#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.Pies</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Pies</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on a Pie.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Pies</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Pies} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pies#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.Pies</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Pies} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pies#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Pies} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Pies#fireClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on a Pie.
 *
 * @name sap.ui.vbm.Pies#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.Pies</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Pies</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on a Pie.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Pies</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Pies} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pies#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.Pies</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Pies} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pies#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Pies} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Pies#fireContextMenu
 * @function
 */


/**
 * The event is raised when something is dropped on a Pie.
 *
 * @name sap.ui.vbm.Pies#drop
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'drop' event of this <code>sap.ui.vbm.Pies</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Pies</code>.<br/> itself. 
 *  
 * The event is raised when something is dropped on a Pie.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Pies</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Pies} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pies#attachDrop
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'drop' event of this <code>sap.ui.vbm.Pies</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Pies} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Pies#detachDrop
 * @function
 */

/**
 * Fire event drop to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Pies} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Pies#fireDrop
 * @function
 */

// Start of sap/ui/vbm/Pies.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.Pies.prototype.init = function(){
//   // do something for initialization...
//};


//...........................................................................//
// model creators...........................................................//

sap.ui.vbm.Pies.prototype.getTemplateObject = function()
{
   var id = this.getId();

   return   {
      "type": "{00100000-2012-0004-B001-383477EA1DEB}",
      "pos.bind": id + ".P",                             // P is the position
      "tooltip.bind": id + ".TT",                        // TT is the tooltip
      "scale.bind": id + ".S",                           // S is the scale
      
      // the series values...................................................//
      "series.bind": id + ".Series",                     // bind to the series for all pie instances      
      "text.bind":   id + ".Series.T",                   // T is the text
      "value.bind":  id + ".Series.V"                    // V is the value
   };
};


sap.ui.vbm.Pies.prototype.getDataObject = function()
{
   // collect the data table from the objects aggregation 

   var aVO = this.getItems();

   // process visual objects.................................................//
   var saE = [];     // elements array consisting of the attributes..........//
 
   for( var nJ = 0, len = aVO.length; nJ < len; ++nJ )
   {
      // get the control.....................................................//
      var oInstance = aVO[nJ];

      // determine the series elements.......................................//
      var sSE = []; 
      
      var aPieItems = oInstance.getItems();
      for( var nK = 0, lenItems = aPieItems.length; nK < lenItems; ++nK )
      {
         var oInstItem = aPieItems[nK];
         var oEntry = 
         {
            "T":  oInstItem.getName(),
            "V": oInstItem.getValue()
         };
         
         // push the entry...................................................//
         sSE.push( oEntry );
      }

      // add the control object description..................................//
      var oElement = 
      {
            "P" :  oInstance.getPosition(),
            "TT" : oInstance.getTooltip(),
            "S" : oInstance.getScale(),
            "N" : {  "name" : "Series",
                     "E" :  sSE
                  }
      };
      
      saE.push( oElement );
   }

   return {
            "name": this.getId(),
            "E": saE
      };
};


sap.ui.vbm.Pies.prototype.getTypeObject = function()
{
   return {
      "A": [
             {
                "changeable": "true",
                "name": "P",              // position
                "alias": "P",
                "type": "vector"
             },
             {
                "name": "TT",             // tooltip
                "alias": "TT",
                "type": "string"
             },
             {
                "changeable": "true",
                "name": "S",              // scale
                "alias": "S",
                "type": "string"
             }
           ],
      "N": {
                "name": "Series",
                "A": [
                        {
                           "name": "V",      // value
                           "alias": "V",
                           "type": "float"
                        },
                        {
                           "name": "T",      // text
                           "alias": "T",
                           "type": "string"
                        }
                 ]
            }
          
    };
};


//..........................................................................//
// helper functions.........................................................//

sap.ui.vbm.Pies.prototype.HandleEvent = function( event )
{
   var s = event.Action.name;   

   var funcname = "fire" +  s[0].toUpperCase() + s.slice( 1 );

   // first we try to get the event on a Pies instance......................//
   var Pie;
   if( Pie = this.FindInstance( event.Action.instance ) )
   {
      if( Pie.mEventRegistry[ s ] )
      { 
         if( s =="contextMenu" )
         {
            Pie.mClickPos = [event.Action.Params.Param[0]['#'], event.Action.Params.Param[1]['#']];
            // create an empty menu
            jQuery.sap.require("sap.ui.unified.Menu");    

            if( this.oParent.m_VBIContext.m_Menus )
               this.oParent.m_VBIContext.m_Menus.deleteMenu( "DynContextMenu" );
            
            
            var oMenuObject = new sap.ui.unified.Menu();
            oMenuObject.vbi_data = {};
            oMenuObject.vbi_data.menuRef  = "CTM";
            oMenuObject.vbi_data.VBIName  = "DynContextMenu";

            // fire the contextMenu..................................................//
            Pie.fireContextMenu( { data: event, menu: oMenuObject});
         } 
         else         
            Pie[ funcname ]( { data: event } );
      }
   }
   this[ funcname ]( { data: event } );
};

sap.ui.vbm.Pies.prototype.openDetailWindow = function( inst, params ){
   this.oParent.m_bUseClickPos = false;
   this.oParent.m_DTOpen = true;
   this.oParent.m_DTSrc = inst;
   this.oParent.m_DTParams = params;
   this.oParent.m_bWindowsDirty = true;
   this.oParent.invalidate(this);
};

sap.ui.vbm.Pies.prototype.getActionArray = function( aActions )
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

sap.ui.vbm.Pies.prototype.openContextMenu = function( inst, menu )
{
   this.oParent.openContextMenu( "Pie", inst, menu );
};
