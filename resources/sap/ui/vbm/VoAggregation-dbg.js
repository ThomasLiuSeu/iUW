/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ui.vbm.VoAggregation.
jQuery.sap.declare("sap.ui.vbm.VoAggregation");
jQuery.sap.require("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.core.Element");


/**
 * Constructor for a new VoAggregation.
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
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ui.vbm.VoAggregation#event:handleMoved handleMoved} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.VoAggregation#event:handleContextMenu handleContextMenu} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ui.vbm.VoAggregation#event:handleClick handleClick} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
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
 * Abstract VO aggregation container
 * @extends sap.ui.core.Element
 * @version 1.28.0
 *
 * @constructor
 * @public
 * @name sap.ui.vbm.VoAggregation
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Element.extend("sap.ui.vbm.VoAggregation", { metadata : {

	library : "sap.ui.vbm",
	events : {
		"handleMoved" : {}, 
		"handleContextMenu" : {}, 
		"handleClick" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ui.vbm.VoAggregation with name <code>sClassName</code> 
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
 * @name sap.ui.vbm.VoAggregation.extend
 * @function
 */

sap.ui.vbm.VoAggregation.M_EVENTS = {'handleMoved':'handleMoved','handleContextMenu':'handleContextMenu','handleClick':'handleClick'};


/**
 * This event is raised when the design handle of a changable Area is moved.
 *
 * @name sap.ui.vbm.VoAggregation#handleMoved
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'handleMoved' event of this <code>sap.ui.vbm.VoAggregation</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VoAggregation</code>.<br/> itself. 
 *  
 * This event is raised when the design handle of a changable Area is moved.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VoAggregation</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VoAggregation} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoAggregation#attachHandleMoved
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'handleMoved' event of this <code>sap.ui.vbm.VoAggregation</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VoAggregation} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoAggregation#detachHandleMoved
 * @function
 */

/**
 * Fire event handleMoved to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VoAggregation} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VoAggregation#fireHandleMoved
 * @function
 */


/**
 * This event is raised when the design handle of a changable Area is right clicked.
 *
 * @name sap.ui.vbm.VoAggregation#handleContextMenu
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'handleContextMenu' event of this <code>sap.ui.vbm.VoAggregation</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VoAggregation</code>.<br/> itself. 
 *  
 * This event is raised when the design handle of a changable Area is right clicked.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VoAggregation</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VoAggregation} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoAggregation#attachHandleContextMenu
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'handleContextMenu' event of this <code>sap.ui.vbm.VoAggregation</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VoAggregation} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoAggregation#detachHandleContextMenu
 * @function
 */

/**
 * Fire event handleContextMenu to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VoAggregation} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VoAggregation#fireHandleContextMenu
 * @function
 */


/**
 * This event is raised when the design handle of a changable Area is clicked.
 *
 * @name sap.ui.vbm.VoAggregation#handleClick
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'handleClick' event of this <code>sap.ui.vbm.VoAggregation</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ui.vbm.VoAggregation</code>.<br/> itself. 
 *  
 * This event is raised when the design handle of a changable Area is clicked.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.vbm.VoAggregation</code>.<br/> itself.
 *
 * @return {sap.ui.vbm.VoAggregation} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoAggregation#attachHandleClick
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'handleClick' event of this <code>sap.ui.vbm.VoAggregation</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ui.vbm.VoAggregation} <code>this</code> to allow method chaining
 * @public
 * @name sap.ui.vbm.VoAggregation#detachHandleClick
 * @function
 */

/**
 * Fire event handleClick to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ui.vbm.VoAggregation} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ui.vbm.VoAggregation#fireHandleClick
 * @function
 */

// Start of sap/ui/vbm/VoAggregation.js
///**
// * This file defines behavior for the control,
// */
//sap.ui.vbm.VoAggregation.prototype.init = function(){
//   // do something for initialization...
//};

sap.ui.vbm.VoAggregation.prototype.IsEventRegistered = function( name )
{
   var aVO = this.getItems();
   if( !aVO ) return false;
   
   for( var nJ = 0, len = aVO.length; nJ < len; ++nJ )
   {
      // get the control.....................................................//
      var oInstance = aVO[nJ];

      // if one registers for an event we can return........................// 
      if( oInstance.mEventRegistry[ name ] )
         return true;
   }

   return false;
};

sap.ui.vbm.VoAggregation.prototype.FindInstance = function( name )
{
   var aVO = this.getItems();
   if( !aVO ) return false;
   
   var key =  name.split(".")[1];
   for( var nJ = 0, len = aVO.length; nJ < len; ++nJ )
   {
      // get the control.....................................................//
      if( aVO[nJ].sId == key )
         return aVO[nJ]; 
   }

   return null;
};

sap.ui.vbm.VoAggregation.prototype.getActionArray = function( aActions )
{
   var id = this.getId();

   if( this.mEventRegistry[ "handleMoved" ] || this.IsEventRegistered( "handleMoved" ) )
	   aActions.push(  { "id": id + "4", "name": "handleMoved", "refScene": "MainScene", "refVO": id, "refEvent": "HandleMoved" });
   if( this.mEventRegistry[ "handleContextMenu" ] || this.IsEventRegistered( "handleContextMenu" ) )
	   aActions.push(  { "id": id + "5", "name": "handleContextMenu", "refScene": "MainScene", "refVO": id, "refEvent": "HandleContextMenu" });
   if( this.mEventRegistry[ "handleClick" ] || this.IsEventRegistered( "handleClick" ) )
	   aActions.push(  { "id": id + "6", "name": "handleClick", "refScene": "MainScene", "refVO": id, "refEvent": "HandleClick" });	   
   
   return aActions;
};