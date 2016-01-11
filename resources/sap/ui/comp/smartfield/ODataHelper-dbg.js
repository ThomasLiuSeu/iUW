/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

/**
 * Utility class to access OData Meta Data.
 * 
 * @public
 * @name sap.ui.comp.smartfield.ODataHelper
 * @author SAP SE
 * @version 1.28.1
 * @since 1.28.0
 * @param {jquery.sap.global} jQuery a reference to the jQuery implementation.
 * @param {sap.ui.comp.odata.MetadataAnalyser} MData a reference to the meta data analyzer implementation.
 * @returns {sap.ui.comp.smartfield.ODataHelper} the new instance.
 */
sap.ui.define([	"jquery.sap.global", "sap/ui/comp/odata/MetadataAnalyser" ], function(jQuery, MData) { // EXC_JSHINT_002
	"use strict";

	/**
	 * @public
	 * @constructor
	 * @param {sap.ui.model.odata.ODataModel} oModel the OData model currently used.
	 */
	var ODataHelper = function(oModel) { // EXC_JSLINT_021
		if (oModel) {
			this._oMeta = oModel.getMetaModel();
			this.oAnalyzer = new MData(oModel);
		}
	};

	/**
	 * Checks whether the current path contains a sequence of navigation properties and corrects the current meta data accordingly.
	 * 
	 * @param {object} oMetaData the meta data used to create the control.
	 * @param {object} oMetaData.entitySet the OData entity set definition.
	 * @param {object} oMetaData.entityType the OData entity type definition.
	 * @param {object} oMetaData.typecount the index of the entity type in the meta model.
	 * @param {object} oMetaData.property the OData property definition.
	 * @param {string} oMetaData.path the binding path.
	 * @param {object} oObjectBinding an optional object binding.
	 * @returns {boolean} <code>true</code>, if a sequence of navigation properties has been identified, <code>false</code> otherwise.
	 * @public
	 */
	ODataHelper.prototype.checkNavigationProperty = function(oMetaData, oObjectBinding) {
		var aPath, oNavi, len, aNavi = [];

		if (oMetaData) {
			// check for an "explicit" object binding ("binding" attribute in XML).
			if (oObjectBinding && oObjectBinding.sPath) {
				oNavi = this.getNavigationProperty(oObjectBinding.sPath, oMetaData.typecount);

				if (oNavi) {
					this._updateNavigationProperty(oMetaData, oNavi);
				}
			}

			// now check the binding path itself.
			aPath = oMetaData.path.split("/");
			len = aPath.length;

			// only check, if there is a complex path.
			if (len > 1) {
				while (len--) {
					oNavi = this.getNavigationProperty(aPath[0], oMetaData.typecount);

					if (oNavi) {
						this._updateNavigationProperty(oMetaData, oNavi);
					} else {
						this._getProperty(oMetaData, aPath, aNavi);
						return true;
					}

					aNavi.push(aPath.shift());
				}
			}
		}

		return false;
	};

	/**
	 * Updates the current meta data, if a simple property has been identified.
	 * 
	 * @param {object} oMetaData the meta data used to create the control.
	 * @param {object} oMetaData.entitySet the OData entity set definition.
	 * @param {object} oMetaData.entityType the OData entity type definition.
	 * @param {object} oMetaData.typecount the index of the entity type in the meta model.
	 * @param {object} oMetaData.property the OData property definition.
	 * @param {string} oMetaData.path the binding path.
	 * @param {array} aPath the array of all paths.
	 * @param {array} aNavi the navigation paths.
	 * @private
	 */
	ODataHelper.prototype._getProperty = function(oMetaData, aPath, aNavi) {
		oMetaData.property = this.getProperty(aPath.join("/"), oMetaData.namespace, oMetaData.typecount);

		if (aNavi.length > 0) {
			oMetaData.navigationPath = aNavi.join("/") + "/";
		}
	};

	/**
	 * Updates the current meta data, if a navigation property has been identified.
	 * 
	 * @param {object} oMetaData the meta data used to create the control.
	 * @param {object} oMetaData.entitySet the OData entity set definition.
	 * @param {object} oMetaData.entityType the OData entity type definition.
	 * @param {object} oMetaData.typecount the index of the entity type in the meta model.
	 * @param {object} oMetaData.property the OData property definition.
	 * @param {string} oMetaData.path the binding path.
	 * @param {object} oNavigation the navigation property.
	 * @private
	 */
	ODataHelper.prototype._updateNavigationProperty = function(oMetaData, oNavigation) {
		var oAssoc, sTarget, oType;

		// get the entity set name.
		oAssoc = this.getAssociation(oNavigation.relationship);
		sTarget = this.getAssociationTarget(oAssoc, oNavigation);

		// get entity set and entity type.
		oMetaData.entitySet = this.getEntitySet(sTarget);
		oType = this.getEntityType(oMetaData.entitySet.entityType.replace(oMetaData.namespace + ".", ""));

		// correct the current data.
		oMetaData.entityType = oType.type;
		oMetaData.typecount = oType.count;
	};

	/**
	 * Returns the definition of an OData property of a given entity.
	 * 
	 * @param {string} sName the name of the OData property.
	 * @param {integer} iTypePos the position of the OData entity type.
	 * @returns {object} OData property, if it exists, otherwise <code>null</code> is returned.
	 * @private
	 */
	ODataHelper.prototype.getNavigationProperty = function(sName, iTypePos) {
		if (sName) {
			return this._getTypeProperty(sName, "/navigationProperty", iTypePos);
		}

		return null;
	};

	/**
	 * Returns the definition of a property of an entity type.
	 * 
	 * @param {string} sPath the path of the OData property.
	 * @param {string} sNameSpace the name space of the OData property.
	 * @param {integer} iTypePos the position of the OData entity type.
	 * @returns {object} OData property, if it exists, otherwise <code>null</code> is returned.
	 * @public
	 */
	ODataHelper.prototype.getProperty = function(sPath, sNameSpace, iTypePos) {
		var len, aProp, oProp;

		if (sPath && sNameSpace) {
			aProp = sPath.split("/");
			len = aProp.length;

			if (len > 1) {
				oProp = this._getTypeProperty(aProp[0], "/property", iTypePos);
				return this._getComplex(oProp, sNameSpace, aProp, len);
			}

			oProp = this._getTypeProperty(sPath, "/property", iTypePos);
			return {
				property: oProp,
				typePath: sPath,
				extensions: this._toMap(oProp, "extensions")
			};
		}

		return null;
	};

	/**
	 * Converts an <code>array</code> of attributes into a <code>map</code>.
	 * 
	 * @param {object} oProperty the property definition.
	 * @param {string} sArray the name of the <code>array</code> of attributes.
	 * @returns {map} conversion result.
	 * @private
	 */
	ODataHelper.prototype._toMap = function(oProperty, sArray) {
		var aArray, oObj, oOut = {}, length, sPrefix, mNs = {
			"http://www.sap.com/Protocols/SAPData": "sap:"
		};

		if (oProperty && oProperty[sArray]) {
			aArray = oProperty[sArray];
		}

		if (aArray && aArray.length) {
			length = aArray.length;
		} else {
			return oOut;
		}

		while (length--) {
			oObj = aArray[length];
			sPrefix = mNs[oObj.namespace];

			if (sPrefix) {
				oOut[sPrefix + oObj.name] = oObj.value;
			} else {
				oOut[oObj.name] = oObj.value;
			}
		}

		return oOut;
	};

	/**
	 * Returns a complex property.
	 * 
	 * @param {object} oProperty the object.
	 * @param {string} sNameSpace the current name space.
	 * @param {array} aProp the path to the OData property.
	 * @param {integer} iLen the length of the path to the OData property.
	 * @returns {object} the complex property.
	 * @private
	 */
	ODataHelper.prototype._getComplex = function(oProperty, sNameSpace, aProp, iLen) {
		var oObject = oProperty, sTypePath;

		while (iLen--) {
			if (oObject) {
				if (iLen === 0) {
					oObject = this._getNamedProperty(aProp[0], "property", oObject);

					return {
						typePath: sTypePath + "/" + aProp[0],
						property: oObject,
						complex: true,
						extensions: this._toMap(oObject, "extensions")
					};
				}

				oObject = this.getComplexType(oObject.type.replace(sNameSpace + ".", ""));
				sTypePath = this._getComplexPath(sTypePath, oObject);
			}

			aProp.shift();
		}
	};

	/**
	 * Returns an updated path of types.
	 * 
	 * @param {string} sTypePath the current path of data types.
	 * @param {object} oObject the current object.
	 * @returns {string} the updated path of types.
	 * @private
	 */
	ODataHelper.prototype._getComplexPath = function(sTypePath, oObject) {
		if (sTypePath) {
			return sTypePath + "/" + oObject.name;
		}

		return oObject.name;
	};

	/**
	 * Returns a named property.
	 * 
	 * @param {string} sName the name.
	 * @param {string} sArray the name of the array to scan for the property.
	 * @param {object} oProperty the object.
	 * @returns {object} the named property, can be <code>null</code>.
	 * @private
	 */
	ODataHelper.prototype._getNamedProperty = function(sName, sArray, oProperty) {
		var oResult;

		jQuery.each(oProperty[sArray], function(i, oEntity) {
			if (oEntity.name === sName) {
				oResult = oEntity;
				return false;
			}
		});

		return oResult;
	};

	/**
	 * Returns the definition of an OData property of a given entity type.
	 * 
	 * @param {string} sName the name of the OData property.
	 * @param {string} sCategory the category of the OData property.
	 * @param {integer} iTypePos the position of the OData entity type.
	 * @returns {object} OData property, if it exists, otherwise <code>null</code> is returned.
	 * @private
	 */
	ODataHelper.prototype._getTypeProperty = function(sName, sCategory, iTypePos) {
		var oProperty, aObject;

		aObject = this._oMeta.getObject("/dataServices/schema/0/entityType/" + iTypePos + sCategory);

		if (aObject) {
			jQuery.each(aObject, function(i, oEntity) {
				if (oEntity.name === sName) {
					oProperty = oEntity;
					return false;
				}
			});
		}

		return oProperty;
	};

	/**
	 * Returns an OData entity type.
	 * 
	 * @param {object} sName the name of the OData entity set.
	 * @returns {object} OData entity type, if it exists, otherwise <code>null</code> is returned, and position counter.
	 * @public
	 */
	ODataHelper.prototype.getEntityType = function(sName) {
		var iCount, aObject, oType = null;

		if (sName) {
			aObject = this._oMeta.getObject("/dataServices/schema/0/entityType");

			if (aObject) {
				jQuery.each(aObject, function(i, oEntity) {
					if (oEntity.name === sName) {
						oType = oEntity;
						iCount = i;
						return false;
					}
				});
			}
		}

		return {
			count: iCount,
			type: oType
		};
	};

	/**
	 * Returns the definition of an OData complex type.
	 * 
	 * @param {string} sName the name of the complex type.
	 * @returns {object} the definition of an OData complex type.
	 * @public
	 */
	ODataHelper.prototype.getComplexType = function(sName) {
		var oType;

		if (sName) {
			jQuery.each(this._oMeta.getObject("/dataServices/schema/0/complexType"), function(i, oEntity) {
				if (oEntity.name === sName) {
					oType = oEntity;
					return false;
				}
			});
		}

		return oType;
	};

	/**
	 * Returns an OData entity set.
	 * 
	 * @param {object} sName the name of the OData entity set.
	 * @returns {object} OData entity set, if it exists, otherwise <code>null</code> is returned.
	 * @public
	 */
	ODataHelper.prototype.getEntitySet = function(sName) {
		var oSet = null;

		if (sName) {
			jQuery.each(this._oMeta.getObject("/dataServices/schema/0/entityContainer/0/entitySet"), function(i, oEntity) {
				if (oEntity.name === sName) {
					oSet = oEntity;
					return false;
				}
			});
		}

		return oSet;
	};

	/**
	 * Returns an OData association.
	 * 
	 * @param {object} sName the name of the OData entity set.
	 * @returns {object} OData association, if it exists, otherwise <code>null</code> is returned.
	 * @public
	 */
	ODataHelper.prototype.getAssociation = function(sName) {
		var oAssoc = null;

		if (sName) {
			jQuery.each(this._oMeta.getObject("/dataServices/schema/0/entityContainer/0/associationSet"), function(i, oEntity) {
				if (oEntity.association === sName) {
					oAssoc = oEntity;
					return false;
				}
			});
		}

		return oAssoc;
	};

	/**
	 * Returns an OData association target, the entity set and association points to.
	 * 
	 * @param {object} oAssociation the given association set.
	 * @param {object} oNavigation the given navigation property.
	 * @returns {string} an OData association target, <code>null</code>, if it cannot be calculated.
	 * @public
	 */
	ODataHelper.prototype.getAssociationTarget = function(oAssociation, oNavigation) {
		var len, oEnd;

		if (oAssociation && oNavigation) {
			len = oAssociation.end.length;

			while (len--) {
				oEnd = oAssociation.end[len];

				if (oEnd.role === oNavigation.toRole) {
					return oEnd.entitySet;
				}
			}
		}

		return null;
	};

	/**
	 * Returns the name space of an OData model.
	 * 
	 * @returns {string} the name space of an OData model.
	 * @public
	 */
	ODataHelper.prototype.getNameSpace = function() {
		return this._oMeta.getObject("/dataServices/schema/0/namespace");
	};

	/**
	 * Checks whether an OData property represents semantically a unit of measure, e.g. a currency, and returns its definition, if the property
	 * represents a unit of measure.
	 * 
	 * @param {object} oProperty the definition of a property of an OData entity.
	 * @param {string} sPropertyPath the path identifying the OData property.
	 * @param {string} sNameSpace the name space of the OData property.
	 * @param {integer} iTypePos the position of the OData entity type.
	 * @returns {object} an object with a property <code>unit</code> containing the OData property representing the unit and an optional property
	 *          <code>text</code> containing the OData property representing the unit text. If no unit of measure is encountered, <code>null</code>
	 *          is returned.
	 * @public
	 */
	ODataHelper.prototype.getUnitOfMeasure = function(oProperty, sPropertyPath, sNameSpace, iTypePos) {
		var oUnit, oCurrency, oSemantics;

		if (oProperty && sPropertyPath && sNameSpace) {
			oUnit = oProperty.extensions["sap:unit"]; // EXC_JSHINT_018

			if (oUnit) {
				oCurrency = this.getProperty(sPropertyPath.replace(oProperty.property.name, oUnit), sNameSpace, iTypePos);
				oSemantics = oCurrency.extensions["sap:semantics"]; // EXC_JSHINT_018

				if (oSemantics === "currency-code" || oSemantics === "unit-of-measure") {
					return {
						unit: oUnit,
						text: oCurrency.extensions["currency-text"] ? oCurrency.extensions["currency-text"] : null,
						semantics: oSemantics,
						property: oCurrency
					};
				}
			}
		}

		return null;
	};

	/**
	 * Checks whether an OData property has a <code>text</code> property and returns it.
	 * 
	 * @param {object} oProperty the definition of a property of an OData entity.
	 * @param {string} sPropertyPath the path identifying the OData property.
	 * @param {string} sNameSpace the name space of the OData property.
	 * @param {integer} iTypePos the position of the OData entity type.
	 * @returns {object} an OData property that is referenced with the <code>text</code> attribute.
	 * @public
	 */
	ODataHelper.prototype.getTextProperty = function(oProperty, sPropertyPath, sNameSpace, iTypePos) {
		var oText;

		if (oProperty && sPropertyPath && sNameSpace) {
			oText = oProperty.extensions["sap:text"]; // EXC_JSHINT_018

			if (oText) {
				return this.getProperty(sPropertyPath.replace(oProperty.property.name, oText), sNameSpace, iTypePos);
			}
		}

		return null;
	};

	/**
	 * Calculates the value list annotation for the given property.
	 * 
	 * @param {string} sNameSpace the name space.
	 * @param {object} oEntityType the OData entity.
	 * @param {object} oProperty the definition of a property of an OData entity.
	 * @param {string} sPropertyPath the path identifying the property.
	 * @returns {object} the value list annotation or <code>null</code>.
	 * @public
	 */
	ODataHelper.prototype.getValueListAnnotation = function(sNameSpace, oEntityType, oProperty, sPropertyPath) {
		var sPath;

		if (oProperty.complex) {
			sPath = sNameSpace + "." + oProperty.typePath;
		} else {
			sPath = sNameSpace + "." + oEntityType.name + "/" + sPropertyPath;
		}

		if (this.oAnalyzer) {
			return this.oAnalyzer.getValueListAnnotation(sPath);
		}

		return null;
	};

	/**
	 * Calculates the value list annotation for the given property, if it represents a unit of measure, and adds it to the meta data as
	 * <code>valuelistuom</code> in the annotations.
	 * 
	 * @param {object} oMetaData the meta data used to initialize the factory.
	 * @param {object} oMetaData.namespace the current name space.
	 * @param {object} oMetaData.entitySet the name of the OData entity set.
	 * @param {object} oMetaData.entityType the name of the OData entity type.
	 * @param {object} oMetaData.property the name of the OData property.
	 * @param {object} oMetaData.model the name of the model.
	 * @param {object} oMetaData.path the path identifying the OData property.
	 * @param {object} oMetaData.annotations the current annotations.
	 * @public
	 */
	ODataHelper.prototype.getUOMValueListAnnotation = function(oMetaData) {
		var sPath;

		if (oMetaData.annotations.uom) {
			if (oMetaData.property.complex) {
				sPath = oMetaData.namespace + "." + oMetaData.property.typePath;
				sPath = sPath.replace(oMetaData.property.property.name, oMetaData.annotations.uom.property.property.name);
			} else {
				sPath = oMetaData.namespace + "." + oMetaData.entityType.name + "/" + oMetaData.annotations.uom.property.property.name;
			}
		}

		if (this.oAnalyzer && sPath) {
			oMetaData.annotations.valuelistuom = this.oAnalyzer.getValueListAnnotation(sPath);
		}
	};

	/**
	 * Returns the requested attributes from the given object and subordinate data structure, which has to be an <code>array</code>.
	 * 
	 * @param {object} oObject the object to be analyzed.
	 * @param {string} sArray the name of the <code>array</code> to be analyzed.
	 * @param {map} mParams the requested attributes.
	 * @returns {map} the requested attributes.
	 * @public
	 */
	ODataHelper.prototype.getAttributes = function(oObject, sArray, mParams) {
		var oResult = {}, n, count = 0, len, oAttr, oParam;

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
				oParam = mParams[oAttr.name];

				if (oAttr && oParam && oAttr.namespace === oParam) {
					oResult[oAttr.name] = oAttr.value;
					count--;
				}
			}
		}

		return oResult;
	};

	/**
	 * Calculates the entity set a value list annotation for the given property points to and adds it to the meta data as
	 * <code>valuelistentityset</code> in the annotations.
	 * 
	 * @param {object} oMetaData the meta data used to initialize the factory.
	 * @param {object} oMetaData.namespace the current name space.
	 * @param {object} oMetaData.entitySet the name of the OData entity set.
	 * @param {object} oMetaData.entityType the name of the OData entity type.
	 * @param {object} oMetaData.property the name of the OData property.
	 * @param {object} oMetaData.model the name of the model.
	 * @param {object} oMetaData.path the path identifying the OData property.
	 * @param {object} oMetaData.annotations the current annotations.
	 * @public
	 */
	ODataHelper.prototype.geValueListEntitySet = function(oMetaData) {
		if (oMetaData && oMetaData.annotations && oMetaData.annotations.valuelist) {
			if (oMetaData.annotations.valuelist.primaryValueListAnnotation && oMetaData.annotations.valuelist.primaryValueListAnnotation.valueListEntitySetName) {
				oMetaData.annotations.valuelistentityset = this.getEntitySet(oMetaData.annotations.valuelist.primaryValueListAnnotation.valueListEntitySetName);
			}
		}
	};

	/**
	 * Returns the value list annotation for the given meta data.
	 * 
	 * @param {object} oMetaData the meta data used to create the control.
	 * @param {string} oMetaData.namespace the name space.
	 * @param {object} oMetaData.property the OData property definition.
	 * @param {string} oMetaData.path the binding path.
	 * @param {object} oEntityType the OData entity type definition.
	 * @param {object} oTextProperty the text property, can be <code>null</code>.
	 * @returns {object} the value list annotation and a flag indicating whether it is taken from a possibly existing text annotation.
	 */
/*
 * ODataHelper.prototype.getValueListDescriptor = function(oMetaData, oEntityType, oTextProperty) { var oAnnotation, bFromText = false; // get value
 * list annotation for the property the text annotation is pointing to. if (oTextProperty) { sPath =
 * oMetaData.path.replace(oMetaData.property.typePath, oTextProperty.property.name); oAnnotation = this._getValueListAnnotation(oMetaData.namespace,
 * oEntityType, oTextProperty, sPath); if (oAnnotation && oAnnotation.primaryValueListAnnotation) { return { annotation: oAnnotation, fromText: true }; } } //
 * get the value list annotation from the original property. oAnnotation = this.getValueListAnnotation(oMetaData.namespace, oEntityType,
 * oMetaData.property, oMetaData.property.typePath); if (oAnnotation) { if (oTextProperty && oAnnotation.primaryValueListAnnotation) { bFromText =
 * true; } return { annotation: oAnnotation, fromText: bFromText }; } return null; };
 */

	/**
	 * Returns the line item annotation for a type.
	 * 
	 * @param {object} oType the definition of an OData complex type.
	 * @returns {object} the line item annotation.
	 */
/*
 * ODataHelper.prototype.getLineItemAnnotation = function(oType) { var oResult, aAnnotation, oAnnotation, len; if (oType) { aAnnotation =
 * oType["com.sap.vocabularies.UI.v1.LineItem"]; if (aAnnotation) { oResult = { term: "com.sap.vocabularies.UI.v1.LineItem", labels: {}, fields: [] };
 * len = aAnnotation.length; while (len--) { oAnnotation = aAnnotation[len]; if (oAnnotation.RecordType !== "com.sap.vocabularies.UI.v1.DataField") {
 * continue; } if (oAnnotation.Value && oAnnotation.Value.Path) { oResult.fields.push(oAnnotation.Value.Path); } if (oAnnotation.Label &&
 * oAnnotation.Label.String) { oResult.labels[oAnnotation.Value.Path] = oAnnotation.Label.String; } } return oResult; } } return null; };
 */
	/**
	 * Returns the semantic object annotation for a given target.
	 * 
	 * @param {string} sTarget the path identifying the target, usually the complete path to a property including name space.
	 * @returns {object} the semantic object annotation.
	 */
/*
 * ODataHelper.prototype.getSemanticObjectAnnotation = function(sTarget) { var oAnnotation, oResult = {}, oExtension, len, i; if (sTarget) {
 * oAnnotation = this._getAnnotation(sTarget, "com.sap.vocabularies.Common.v1.SemanticObject"); if (oAnnotation) { len =
 * oAnnotation.extensions.length; for (i = 0; i < len; i++) { oExtension = oAnnotation.extensions[i]; if (oExtension.name === "String") {
 * oResult.semanticObject = oExtension.value; break; } } oResult.term = oAnnotation.term; oResult.extensions = oAnnotation.extensions; return oResult; } }
 * return null; };
 */
	/**
	 * Returns the value list annotation for a given target.
	 * 
	 * @param {string} sNameSpace the name space.
	 * @param {string} sPropertyPath the path identifying the property.
	 * @returns {object} the value list annotation.
	 */
/*
 * ODataHelper.prototype.getValueListAnnotation = function(sNameSpace, sPath) { var oAnnotation, oResult = {}; if (sNameSpace && sPath) { oAnnotation =
 * this._getAnnotation(sNameSpace + "." + sPath, "com.sap.vocabularies.Common.v1.ValueList"); if (oAnnotation) { oResult.term = oAnnotation.term;
 * return oResult; } } return null; };
 */
	/**
	 * Returns an annotation depending on target and term attributes.
	 * 
	 * @param {string} sTarget the path identifying the target.
	 * @param {string} sTerm the term.
	 * @returns {object} the annotation, which can be <code>null</code>.
	 * @private
	 */
/*
 * ODataHelper.prototype._getAnnotation = function(sTarget, sTerm) { var oAnnotation;
 * jQuery.each(this._oMeta.getObject("/dataServices/schema/0/annotations"), function(i, oEntity) { var oAnno; if (oEntity.target === sTarget &&
 * oEntity.annotation.length > 0) { oAnno = oEntity.annotation[0]; if (oAnno.term === sTerm) { oAnnotation = oAnno; return false; } } }); return
 * oAnnotation; };
 */
	/**
	 * Frees all resources claimed during the life-time of this instance.
	 * 
	 * @public
	 */
	ODataHelper.prototype.destroy = function() { // EXC_JSLINT_021
		if (this.oAnalyzer) {
			this.oAnalyzer.destroy();
		}

		this._oMeta = null;
		this._oAnalyzer = null;
	};

	return ODataHelper;
}, true);
