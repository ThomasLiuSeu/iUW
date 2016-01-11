
/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

/**
 * Field Control Implementation for SmartField Control. The implementation operates on OData meta data, so an instance of
 * <code>sap.ui.model.odata.ODataModel</code>.
 * 
 * @public
 * @name sap.ui.comp.smartfield.FieldControl
 * @author SAP SE
 * @version 1.28.1
 * @since 1.28.0
 * @param {jquery.sap.global} jQuery a reference to the jQuery implementation.
 * @param {sap.ui.comp.smartfield.BindingUtil} BindingUtil a reference to the binding utility implementation.
 * @param {sap.ui.model.ParseException} ParseException a reference to the parse exception implementation.
 * @returns {sap.ui.comp.smartfield.FieldControl} the field control class.
 */
sap.ui.define([	"jquery.sap.global", "sap/ui/comp/smartfield/BindingUtil", "sap/ui/model/ParseException" ], function(jQuery, BindingUtil, ParseException) { // EXC_JSHINT_002 //EXC_JSHINT_034 //EXC_JSHINT_037
	"use strict";

	/**
	 * @public
	 * @constructor
	 * @param {sap.ui.core.Control} oParent the parent control.
	 */
	var FieldControl = function(oParent) {
		this._oBinding = new BindingUtil();
		this._oParent = oParent;
	};

	/**
	 * Returns formatter functions for the given control properties. The formatters use the given control property and its subordinate attributes.
	 * Each formatter consists of two function, one to calculate a binding path, which is optional, and the formatter function itself.
	 * 
	 * @param {object} oMetaData the meta data used to create the control.
	 * @param {object} oMetaData.entitySet the OData entity set definition.
	 * @param {object} oMetaData.property the OData property definition.
	 * @param {string} oMetaData.path the binding path.
	 * @param {map} mBindings the names of the properties to be bound, e.g. "enabled", "mandatory" and "visible".
	 * @returns {map} formatter functions for the given control properties.
	 * @public
	 */
	FieldControl.prototype.getControlProperties = function(oMetaData, mBindings) {
		var sMethod, n, oResult = {};

		if (oMetaData && mBindings) {
			for (n in mBindings) { // EXC_JSHINT_041
				sMethod = "_get" + n.substring(0, 1).toUpperCase() + n.substring(1);

				if (this[sMethod]) {
					oResult[n] = this[sMethod](oMetaData, this._oParent.getBindingInfo(n));
				}
			}
		}

		return oResult;
	};

	/**
	 * Returns formatter functions for the <code>enabled</code> property of a control. The formatters use the given OData property and its
	 * subordinate attributes.
	 * 
	 * @param {object} oMetaData the meta data used to create the control.
	 * @param {object} oMetaData.entitySet the OData entity set definition.
	 * @param {object} oMetaData.property the OData property definition.
	 * @param {string} oMetaData.path the binding path.
	 * @param {object} oBindingInfo the current binding of the property.
	 * @returns {object} formatter function for the given control attribute.
	 * @private
	 */
	FieldControl.prototype._getEnabled = function(oMetaData, oBindingInfo) {
		var bParent, len = 0, iPropertyPos = -1, iEntitySetPos = -1, iBindingPos = -1, oProperties, that = this;
		
		//get entity set properties.
		oProperties = this._getAttributes(oMetaData.entitySet, "extensions", {
			"updatable": true,
			"updatable-path": true
		});
		
		//if the field is not bound, use the initial value from the parent control.
		if (!oBindingInfo) {
			bParent = this._oParent.getEnabled();
		}
		
		return {
			path: function() {
				var aPaths = [];
				
				//if field-control is statically disabled, return an empty path array.
				if (!that._getEnabledStatic(oProperties, oMetaData)) {
					return aPaths;
				}
				
				//check for field-control on property level and set position.
				if (oMetaData.property.extensions["sap:field-control"]) {
					aPaths.push(that._toPath(oMetaData, oMetaData.property.extensions["sap:field-control"]));
					iPropertyPos = len;
					len++;
				}

				//check for field-control on entity set level and set position, 
				if (oProperties["updatable-path"]) {
					aPaths.push(oProperties["updatable-path"]);
					iEntitySetPos = len;
					len++;
				}

				//check for binding info and set position.
				if (oBindingInfo) {
					aPaths.push(that._oBinding.toBindingPath(oBindingInfo));
					iBindingPos = len;
					len++;
				}

				return aPaths;
			},
			formatter: function(p1, p2, p3) { // EXC_JSHINT_002
				var aArgs = [];
				
				//check the static values.
				if (!that._getEnabledStatic(oProperties, oMetaData)) {
					return false;
				}
				
				//get the values to compare.
				if (iPropertyPos > -1) {
					aArgs.push(arguments[iPropertyPos] !== 1);
				}
				
				if (iEntitySetPos > -1) {
					aArgs.push(!!arguments[iEntitySetPos]);
				}
				
				// check for binding, in case of no binding, use value from parent
				if (iBindingPos > -1) {
					aArgs.push(!!arguments[iBindingPos]);
				} else {
					aArgs.push(bParent);
				}
				
				return that._compare(aArgs, false, true);
			}
		};
	};

	/**
	 * Returns static value for the <code>enabled</code> property of a control. The formatters use the given OData property and its
	 * subordinate attributes.
	 * 
	 * @param {object} oProperties the meta data from the entity set.
	 * @param {object} oMetaData the meta data used to create the control.
	 * @param {object} oMetaData.entitySet the OData entity set definition.
	 * @param {object} oMetaData.property the OData property definition.
	 * @param {string} oMetaData.path the binding path.
	 * @returns {boolean} static value for the <code>enabled</code> property of a control.
	 * @private
	 */
	FieldControl.prototype._getEnabledStatic = function(oProperties, oMetaData) {
		if (oProperties.updatable === "false") {
			return false;
		}

		if (oMetaData.property.extensions["sap:updatable"] === "false") {
			return false;
		}	
		
		return true;		
	};
	
	/**
	 * Compares the boolean values from field control evaluation. First the values are compared to <code>bPessimist</code>.
	 * If this comparison does not evaluate to <code>true</code>, <code>bDefault</code> is returned.
	 * 
	 * @param {array} aArgs values to be compared.
	 * @param {boolean} bPessimist first operand.
	 * @param {boolean} bDefault second operand.
	 * @returns {boolean} comparison result.
	 * @private
	 */
	FieldControl.prototype._compare = function(aArgs, bPessimist, bDefault) {
		var i, len = aArgs.length;
		
		for (i = 0; i < len; i++) {
			if (aArgs[i] === bPessimist) {
				return bPessimist;
			}
		}
		
		return bDefault;
	};
	
	/**
	 * Returns formatter functions for the <code>visible</code> property of a control. The formatters use the given OData property and its
	 * subordinate attributes.
	 * 
	 * @param {object} oMetaData the meta data used to create the control.
	 * @param {object} oMetaData.entitySet the OData entity set definition.
	 * @param {object} oMetaData.property the OData property definition.
	 * @param {string} oMetaData.path the binding path.
	 * @param {object} oBindingInfo the current binding of the property.
	 * @returns {object} formatter function for the given control attribute.
	 * @private
	 */
	FieldControl.prototype._getVisible = function(oMetaData, oBindingInfo) {
		var bParent, len = 0, iBindingPos = -1, iPropertyPos = -1, that = this;
		
		//if the field is not bound, use the initial value from the parent control.
		if (!oBindingInfo) {
			bParent = this._oParent.getVisible();
		}
		
		return {
			path: function() {
				var aPaths = [];
				
				//check for field-control on entity set level and set position.
				if (oMetaData.property.extensions["sap:field-control"]) {
					aPaths.push(that._toPath(oMetaData, oMetaData.property.extensions["sap:field-control"]));
					iPropertyPos = len;
					len++;
				}

				//check for binding info and set position.
				if (oBindingInfo) {
					aPaths.push(that._oBinding.toBindingPath(oBindingInfo));
					iBindingPos = len;
					len++;
				}
				
				if (len > 0) {
					return aPaths;
				}
				
				return [ "" ];
			}, 
			formatter: function(p1, p2) { // EXC_JSHINT_002
				var aArgs = [];
				
				// check for at least one binding path.
				if (len > 0) {
					//check for field-control being switched on.
					if (iPropertyPos > -1) {
						aArgs.push(arguments[iPropertyPos] !== 0);
					}
						
					// check for binding, in case of no binding, use value from parent
					if (iBindingPos > -1) {
						aArgs.push(!!arguments[iBindingPos]);
					} else {
						aArgs.push(bParent);
					}
						
					return that._compare(aArgs, false, true);
				}
				
				//no field control, so check for visible on property.
				if (oMetaData.property.extensions["sap:visible"]) {
					return (oMetaData.property.extensions["sap:visible"] === "true");
				}

				return true;		
			}
		};
	};

	/**
	 * Returns formatter functions for the <code>mandatory</code> property of a control. The formatters use the given OData property and its
	 * subordinate attributes.
	 * 
	 * @param {object} oMetaData the meta data used to create the control.
	 * @param {object} oMetaData.entitySet the OData entity set definition.
	 * @param {object} oMetaData.property the OData property definition.
	 * @param {string} oMetaData.path the binding path.
	 * @param {object} oBindingInfo the current binding of the property.
	 * @returns {object} formatter function for the given control attribute.
	 * @private
	 */
	FieldControl.prototype._getMandatory = function(oMetaData, oBindingInfo) {
		var bParent, len = 0, iBindingPos = -1, iPropertyPos = -1, that = this;
		
		//if the field is not bound, use the initial value from the parent control.
		if (!oBindingInfo) {
			bParent = this._oParent.getMandatory();
		}
		
		return {
			path: function() {
				var aPaths = [];
				
				//check for field-control on entity set level and set position.
				if (oMetaData.property.extensions["sap:field-control"]) {
					aPaths.push(that._toPath(oMetaData, oMetaData.property.extensions["sap:field-control"]));
					iPropertyPos = len;
					len++;
				}

				//check for binding info and set position.
				if (oBindingInfo) {
					aPaths.push(that._oBinding.toBindingPath(oBindingInfo));
					iBindingPos = len;
					len++;
				}
				
				if (len > 0) {
					return aPaths;
				}
				
				return [ "" ];
			},
			formatter: function(p1, p2) {  // EXC_JSHINT_002				
				var aArgs = [];
				
				// check for at least one binding path,
				// in that case field-control is active;
				// otherwise use nullable.
				if (len > 0) {
					if (iPropertyPos > -1) {
						aArgs.push(arguments[iPropertyPos] === 7);
					}
						
					// check for binding, in case of no binding, use value from parent
					if (iBindingPos > -1) {
						aArgs.push(!!arguments[iBindingPos]);
					} else {
						aArgs.push(bParent);
					}
						
					return that._compare(aArgs, true, false);
				}
				
				// no field control, so check for nullable.
				// default for nullable is true, so it has to be set to false to make a property mandatory.
				if (oMetaData.property.property.nullable && oMetaData.property.property.nullable === "false") {
					return true;
				}
				
				// default is false
				return false;
			}
		};
	};

	/**
	 * Constructs a binding path for a formatter from the <code>value</code> attribute of a JSON property.
	 * 
	 * @param {object} oMetaData the meta data used to create the control.
	 * @param {object} oMetaData.entitySet the OData entity set definition.
	 * @param {object} oMetaData.property the OData property definition.
	 * @param {string} oMetaData.path the binding path.
	 * @param {object} oProperty the property.
	 * @returns {string} binding path for an attribute.
	 * @private
	 */
	FieldControl.prototype._toPath = function(oMetaData, oProperty) {
		if (oMetaData.property.complex) {
			return oMetaData.path.replace(oMetaData.property.property.name, oProperty);
		}
		
		return oProperty;
	};
	
	/**
	 * Returns the requested attributes from the given object and subordinate data structure, which has to be an <code>array</code>.
	 * 
	 * @param {object} oObject the object to be analyzed.
	 * @param {string} sArray the name of the <code>array</code> to be analyzed.
	 * @param {map} mParams the requested attributes.
	 * @returns {map} the requested attributes.
	 * @private
	 */
	FieldControl.prototype._getAttributes = function(oObject, sArray, mParams) {
		var oResult = {}, n, count = 0, len, oAttr;

		if (oObject && sArray && mParams) {
			len = oObject[sArray].length;

			for (n in mParams) {
				if (mParams[n]) {
					count++;
				}
			}

			while (len--) {
				if (count === 0) {
					return oResult;
				}

				oAttr = oObject[sArray][len];

				if (mParams[oAttr.name]) {
					oResult[oAttr.name] = oAttr.value;
					count--;
				}
			}
		}

		return oResult;
	};

	/**
	 * Returns a function to check whether a field is a mandatory field.
	 * 
	 * @param {object} oProperty the meta data to execute the check.
	 * @returns {object} the check function, can be <code>null</code>.
	 * @public
	 */
	FieldControl.prototype.getMandatoryCheck = function(oProperty) {
		var fReturn, that = this;
		
		if (oProperty) {
			switch (oProperty.property.type) {
				case "Edm.DateTimeOffset":
				case "Edm.DateTime":
				case "Edm.String":
					fReturn = function(sValue) {
						if (that._oParent.getMandatory() && !sValue) {
							throw new ParseException(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("VALUEHELPVALDLG_FIELDMESSAGE"));
						}
					};
					break;
				case "Edm.Decimal":
				case "Edm.Double":
				case "Edm.Float":
				case "Edm.Single":
				case "Edm.Int16":
				case "Edm.Int32":
				case "Edm.Int64":
				case "Edm.Byte":
				case "Edm.SByte":
					fReturn = function(sValue) {
						if (that._oParent.getMandatory() && (sValue === null || sValue === undefined)) {
							throw new ParseException(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("VALUEHELPVALDLG_FIELDMESSAGE"));
						}
					};
					break;
				default:
					break;
			}
		}
		
		return fReturn;
	};
	
	/**
	 * Frees all resources claimed during the life-time of this instance.
	 * 
	 * @public
	 */
	FieldControl.prototype.destroy = function() {
		if (this._oBinding) {
			this._oBinding.destroy();
		}
		
		this._oBinding = null;
		this._oParent = null;
	};

	return FieldControl;
}, true);
