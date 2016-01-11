/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.Containers.
jQuery.sap.declare("sap.ui.vbm.Containers");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.vbm.VoAggregation");


/**
 * Constructor for a new Containers.
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
 * <li>{@link #getItems items} <strong>(default aggregation)</strong> : sap.ui.vbm.Container[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.Containers#event:click click} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.Containers#event:contextMenu contextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
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
 * Containers aggregation container
 * @extends sap.ui.vbm.VoAggregation
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.Containers
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.vbm.VoAggregation.extend("sap.ui.vbm.Containers", { metadata : {

	library : "sap.ui.vbm",
	defaultAggregation : "items",
	aggregations : {
		"items" : {type : "sap.ui.vbm.Container", multiple : true, singularName : "item"}
	},
	events : {
		"click" : {}, 
		"contextMenu" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.Containers with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.Containers.extend
 * @function
 */

sap.ui.vbm.Containers.M_EVENTS = {'click':'click','contextMenu':'contextMenu'};


/**
 * Getter for aggregation <code>items</code>.<br/>
 * Container object aggregation
 * 
 * <strong>Note</strong>: this is the default aggregation for Containers.
 * @return {sap.ui.vbm.Container[]}
 * @public
 * @name sap.ui.vbm.Containers#getItems
 * @function
 */


/**
 * Inserts a item into the aggregation named <code>items</code>.
 *
 * @param {sap.ui.vbm.Container}
 *          oItem the item to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the item should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the item is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the item is inserted at 
 *             the last position        
 * @return {sap.ui.vbm.Containers} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Containers#insertItem
 * @function
 */

/**
 * Adds some item <code>oItem</code> 
 * to the aggregation named <code>items</code>.
 *
 * @param {sap.ui.vbm.Container}
 *            oItem the item to add; if empty, nothing is inserted
 * @return {sap.ui.vbm.Containers} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Containers#addItem
 * @function
 */

/**
 * Removes an item from the aggregation named <code>items</code>.
 *
 * @param {int | string | sap.ui.vbm.Container} vItem the item to remove or its index or id
 * @return {sap.ui.vbm.Container} the removed item or null
 * @public
 * @name sap.ui.vbm.Containers#removeItem
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>items</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.vbm.Container[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ui.vbm.Containers#removeAllItems
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.vbm.Container</code> in the aggregation named <code>items</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.vbm.Container}
 *            oItem the item whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ui.vbm.Containers#indexOfItem
 * @function
 */
	

/**
 * Destroys all the items in the aggregation 
 * named <code>items</code>.
 * @return {sap.ui.vbm.Containers} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Containers#destroyItems
 * @function
 */


/**
 * The event is raised when there is a click action on a Container.
 *
 * @name sap.ui.vbm.Containers#click
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'click' event of this <code>sap.ui.vbm.Containers</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Containers</code>.<br/> itself. 
 *  
 * The event is raised when there is a click action on a Container.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Containers</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Containers} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Containers#attachClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'click' event of this <code>sap.ui.vbm.Containers</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Containers} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Containers#detachClick
 * @function
 */

/**
 * Fire event click to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Containers} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Containers#fireClick
 * @function
 */


/**
 * The event is raised when there is a right click or a tap and hold action on a Container.
 *
 * @name sap.ui.vbm.Containers#contextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'contextMenu' event of this <code>sap.ui.vbm.Containers</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.Containers</code>.<br/> itself. 
 *  
 * The event is raised when there is a right click or a tap and hold action on a Container.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.Containers</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.Containers} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Containers#attachContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'contextMenu' event of this <code>sap.ui.vbm.Containers</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.Containers} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.Containers#detachContextMenu
 * @function
 */

/**
 * Fire event contextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.Containers} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.Containers#fireContextMenu
 * @function
 */

// Start of sap/ui/vbm/Containers.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.Containers.prototype.init = function(){
//   // do something for initialization...
//};


//...........................................................................//
// model creators............................................................//

sap.ui.vbm.Containers.prototype.getTemplateObject = function()
{
   var id = this.getId();

   return   {
      "type": "{00100000-2012-0004-B001-2297943F0CE6}",
      "pos.bind": id + ".P",                        	 // P is the position
      "key.bind": id + ".IK",                        	 // K is the key
      "alignment.bind": id + ".AL",                          // K is the key   
   };
};

sap.ui.vbm.Containers.prototype.getDataObject = function()
{
   // collect the data table from the objects aggregation 

   var aVO = this.getItems();

   // process visual objects.................................................//
   var saE = [];     // elements array consisting of the attributes..........//
 
   for( var nJ = 0, len = aVO.length; nJ < len; ++nJ )
   {
      // get the control.....................................................//
      var oInstance = aVO[nJ];

      // add the control object description..................................// 
      var oElement = 
      {
         "P" :  oInstance.getPosition(),
         "IK" : oInstance.getId(),
         "AL" : oInstance.getAlignment(),
      };
      saE.push( oElement );
   }

   return {
            "name": this.getId(),
            "E": saE
      };
};


sap.ui.vbm.Containers.prototype.getTypeObject = function()
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
                "name": "IK",              // key
                "alias": "IK",
                "type": "key"
             },
             {
                "name": "AL",              // alignment
                "alias": "AL",
                "type": "string"
             }
             
             ]
    };
};


//...........................................................................//
// helper functions..........................................................//

sap.ui.vbm.Containers.prototype.HandleEvent = function( event )
{
   var s = event.Action.name;   

   var funcname = "fire" +  s[0].toUpperCase() + s.slice( 1 );

   // first we try to get the event on a Containers instance.................//
   var Container;
   if( Container = this.FindInstance( event.Action.instance ) )
      if( Container.mEventRegistry[ s ] ) Container[ funcname ]( { data: event } );
      
   this[ funcname ]( { data: event } );
};

sap.ui.vbm.Containers.prototype.HandleOpenWindow = function( event )
{
	// get the right container aggregation
	var cont = this.FindInstance( event.mParameters.id );

	// get the control 
	var oItem = cont.getItem();	
	if( oItem )
	{
		// determine the id of the div to place the ui area
        var id = event.getParameter( "contentarea" ).id;
        
        // todo: find a proper solution for control containment when container is an element
		var oCore = sap.ui.getCore();
	    var oContainer = oCore.createUIArea( id ); 
	    //propagate all models - even the named ones!
	    cont.propagateModels( oContainer );
        oContainer.addContent( oItem );     
        oItem.setBindingContext( cont.getBindingContext() );
	}	
};

sap.ui.vbm.Containers.prototype.HandleCloseWindow = function( event )
{
	var inst = this.FindInstance( event.mParameters.id );

	// todo: destroy the control
};

sap.ui.vbm.Containers.prototype.FindInstance = function( key )
{
   var aVO = this.getItems();
   if( !aVO ) return false;
   
   for( var nJ = 0, len = aVO.length; nJ < len; ++nJ )
   {
      // get the control.....................................................//
      if( aVO[nJ].sId == key )
         return aVO[nJ]; 
   }

   return null;
};

sap.ui.vbm.Containers.prototype.getActionArray = function( aActions )
{
	var id = this.getId();
	
	// check if the different vo events are registered..............................//
    if( this.mEventRegistry[ "click" ] || this.IsEventRegistered( "click" )  )
       aActions.push(  { "id": id + "1", "name": "click", "refScene": "MainScene", "refVO": id, "refEvent": "Click", "AddActionProperty": [{"name": "pos"}]} );
    if( this.mEventRegistry[ "contextMenu" ] || this.IsEventRegistered( "contextMenu" ) )
       aActions.push(  { "id": id + "2", "name": "contextMenu", "refScene": "MainScene", "refVO": id, "refEvent": "ContextMenu" } );

    aActions = sap.ui.vbm.VoAggregation.prototype.getActionArray.apply(this, arguments);
       	   
    return aActions;
};