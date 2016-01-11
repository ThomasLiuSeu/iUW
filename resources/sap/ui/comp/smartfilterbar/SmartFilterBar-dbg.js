/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartfilterbar.SmartFilterBar.
sap.ui.define([
	'jquery.sap.global', 'sap/m/MessageBox', 'sap/ui/comp/filterbar/FilterBar', 'sap/ui/comp/filterbar/FilterGroupItem', 'sap/ui/comp/filterbar/FilterItem', 'sap/ui/comp/library', './AdditionalConfigurationHelper', './ControlConfiguration', './FilterProvider', './GroupConfiguration', 'sap/ui/comp/smartvariants/PersonalizableInfo', 'sap/ui/comp/smartvariants/SmartVariantManagement'
], function(jQuery, MessageBox, FilterBar, FilterGroupItem, FilterItem, library, AdditionalConfigurationHelper, ControlConfiguration, FilterProvider, GroupConfiguration, PersonalizableInfo, SmartVariantManagement) {
	"use strict";

	/**
	 * Constructor for a new smartfilterbar/SmartFilterBar.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The SmartFilterBar uses the OData metadata of an entity type in order to create a FilterBar. It is automatically determined which fields
	 *        will be used for the filter bar, if the fields support TypeAhead etc. Using control configurations and group configurations it is
	 *        possible to configure the filter bar and adapt it according to your needs.
	 * @extends sap.ui.comp.filterbar.FilterBar
	 * @author Pavan Nayak, Thomas Biesemann
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartfilterbar.SmartFilterBar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SmartFilterBar = FilterBar.extend("sap.ui.comp.smartfilterbar.SmartFilterBar", /** @lends sap.ui.comp.smartfilterbar.SmartFilterBar.prototype */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * The OData entity type whose metadata shall be used to create the SmartFilterBar. Note: Changing this value after the SmartFilter is
				 * initialised (initialise event was fired) shall have no effect.
				 */
				entityType: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Optional. The OData service URL. If it is not specified, the service URL from the OData model (this.getModel()) will be used. Note:
				 * Changing this value after the SmartFilter is initialised (initialise event was fired) shall have no effect.
				 */
				resourceUri: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Name of the field used for the basic search. The OData value list annotation should contain sap:searchable="true" to enable basic
				 * search.
				 */
				basicSearchFieldName: {
					type: "string",
					group: "Misc",
					defaultValue: null
				}
			},
			aggregations: {

				/**
				 * Using control configurations you can add additional configuration to filter fields, for example set custom labels, change the order
				 * of fields, or change the filter field control type. Note: Changing the values here after the SmartFilter is initialised (initialise
				 * event was fired) shall have no effect.
				 */
				controlConfiguration: {
					type: "sap.ui.comp.smartfilterbar.ControlConfiguration",
					multiple: true,
					singularName: "controlConfiguration"
				},

				/**
				 * Provides the possibility to add additional configuration to groups. Groups are used to show fields in the advanced area of the
				 * SmartFilterBar. With additional configuration, you can for example set custom labels or change the order of groups. Note: Changing
				 * the values here after the SmartFilter is initialised (initialise event was fired) shall have no effect.
				 */
				groupConfiguration: {
					type: "sap.ui.comp.smartfilterbar.GroupConfiguration",
					multiple: true,
					singularName: "groupConfiguration"
				}
			}
		}
	});

	/**
	 * Retrieves the currently visible filters and the values for storing them as variants. The result will be passed on as a JSON object to the
	 * callee smart variant control.
	 * 
	 * @name sap.ui.comp.smartfilterbar.SmartFilterBar#fetchVariant
	 * @function
	 * @type object
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */

	/**
	 * Applies the current variant as opposed to fetchVariant. The variant is retrieved via the flex layer.
	 * 
	 * @name sap.ui.comp.smartfilterbar.SmartFilterBar#applyVariant
	 * @function
	 * @param {object} oOVariant The variant that must be applied. oVariant must contain a valid JSON object.
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */

	/**
	 * Init
	 * 
	 * @private
	 */
	SmartFilterBar.prototype.init = function() {
		this._aFilterBarViewMetadata = null;
		this.isRunningInValueHelpDialog = false;
		FilterBar.prototype.init.apply(this); // Call base class
	};

	/**
	 * Initialises the OData metadata necessary to create the filter bar
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._initializeMetadata = function() {
		if (!this.isInitialised) {
			this._createFilterProvider();
			if (this._oFilterProvider) {
				this._aFilterBarViewMetadata = this._oFilterProvider.getFilterBarViewMetadata();
				if (this._aFilterBarViewMetadata) {
					// Set the Smart filter to use simplified mode if it is not on the F4 dialog
					// if (!this.isRunningInValueHelpDialog) {
					// this.setSimplifiedMode(true);
					// }
					this._attachAdditionalConfigurationChanged();
					// Indicates the control is initialised and can be used in the initialise event/otherwise!
					this.isInitialised = true;
					this.setModel(this._oFilterProvider.oModel, this._oFilterProvider.sFilterModelName);
					this._createFilterBar();

					// required for the new UI-Design
					this.registerGetFiltersWithValues(jQuery.proxy(this.getFiltersWithValues, this));

					// Variant Handling - Registrations
					this.registerFetchData(jQuery.proxy(this.getFilterDataAsString, this, true));
					this.registerApplyData(jQuery.proxy(function(sJson) {
						this.setFilterDataAsString(sJson, true);
					}, this));

					this._initializeVariantManagement();
				}
			}
		}
	};

	/**
	 * Get the filterable fields
	 * 
	 * @returns {Array}
	 * @public
	 */
	SmartFilterBar.prototype.getFilterBarViewMetadata = function() {
		return this._aFilterBarViewMetadata;
	};

	/**
	 * Creates an instance of the filter provider
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._createFilterProvider = function() {
		var sResourceUri, oModel, sEntityTypeName, sBasicSearchFieldName, oAdditionalConfiguration;

		sBasicSearchFieldName = this.getBasicSearchFieldName();
		sResourceUri = this.getResourceUri();
		sEntityTypeName = this.getEntityType();
		oAdditionalConfiguration = this.getAdditionalConfiguration();
		oModel = this.getModel();
		// Check if metadata has to be loaded asynchronously on the ODataModel
		// If so, delay the creation of FilterProvider until metadata is loaded!
		if (oModel && oModel.bLoadMetadataAsync && !oModel.oMetadata.isLoaded()) {
			// Attach to metadataLoaded if no event was already attached
			if (!this._bMetadataLoadAttached) {
				oModel.attachMetadataLoaded(jQuery.proxy(this._initializeMetadata, this));
				this._bMetadataLoadAttached = true;
			}
			return;
		}
		if ((oModel || sResourceUri) && sEntityTypeName) {
			this._oFilterProvider = new sap.ui.comp.smartfilterbar.FilterProvider({ // FIXME workaround for failing tests after AMD migration
				basicSearchFieldName: sBasicSearchFieldName,
				entityType: sEntityTypeName,
				serviceUrl: sResourceUri,
				isRunningInValueHelpDialog: this.isRunningInValueHelpDialog,
				model: oModel,
				additionalConfiguration: oAdditionalConfiguration,
				defaultDropDownDisplayBehaviour: this.data("defaultDropDownDisplayBehaviour"),
				defaultTokenDisplayBehaviour: this.data("defaultTokenDisplayBehaviour"),
				dateFormatSettings: this.data("dateFormatSettings"),
				smartFilter: this
			});
		}
	};

	/**
	 * Attaches to events from the control configuration. For example the visiblity of a filter field can be changed dynamically
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._attachAdditionalConfigurationChanged = function() {
		var aControlConfiguration, aGroupConfiguration, i, length;

		// Group Configuration
		aGroupConfiguration = this.getGroupConfiguration();
		length = aGroupConfiguration.length;
		for (i = 0; i < length; i++) {
			aGroupConfiguration[i].attachChange(this._handleGroupConfigurationChanged.bind(this));
		}

		// Control Configuration
		aControlConfiguration = this.getControlConfiguration();
		length = aControlConfiguration.length;
		for (i = 0; i < length; i++) {
			aControlConfiguration[i].attachChange(this._handleControlConfigurationChanged.bind(this));
		}
	};

	/**
	 * Event Handler for changed events from control configuration
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._handleControlConfigurationChanged = function(oEvent) {
		var sPropertyName, oControlConfiguration, oFilterItem, sKey, sValue;

		sPropertyName = oEvent.getParameter("propertyName");
		oControlConfiguration = oEvent.oSource;

		if (!oControlConfiguration) {
			return;
		}

		sKey = oControlConfiguration.getKey();
		oFilterItem = this._getFilterItemByName(sKey);
		if (!oFilterItem) {
			return;
		}

		if (sPropertyName === "visible") {
			sValue = oControlConfiguration.getVisible();
			oFilterItem.setVisible(sValue);
		} else if (sPropertyName === "label") {
			sValue = oControlConfiguration.getLabel();
			oFilterItem.setLabel(sValue);
		} else if (sPropertyName === "visibleInAdvancedArea") {
			sValue = oControlConfiguration.getVisibleInAdvancedArea();
			if (oFilterItem.setVisibleInAdvancedArea) {
				oFilterItem.setVisibleInAdvancedArea(sValue);
			}
		}
	};

	/**
	 * Event Handler for changed events from control configuration
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._handleGroupConfigurationChanged = function(oEvent) {
		var sPropertyName, oGroupConfiguration;

		sPropertyName = oEvent.getParameter("propertyName");
		oGroupConfiguration = oEvent.oSource;
		if (sPropertyName === "label") {
			this._handleGroupConfigurationLabelChanged(oGroupConfiguration);
		}
	};

	/**
	 * Handle the event of a changed label of a group configuration. Find the corresponding FilterGroupItem and sets its label accordingly.
	 * 
	 * @private
	 * @param {object} oGroupConfiguration - GroupConfiguration where the label as changed
	 */
	SmartFilterBar.prototype._handleGroupConfigurationLabelChanged = function(oGroupConfiguration) {
		var oFilterGroupItem, sKey, sLabel;

		if (!oGroupConfiguration) {
			return;
		}

		sLabel = oGroupConfiguration.getLabel();
		sKey = oGroupConfiguration.getKey();
		oFilterGroupItem = this._getFilterGroupItemByGroupName(sKey);
		if (oFilterGroupItem) {
			oFilterGroupItem.setGroupTitle(sLabel);
		}
	};

	/**
	 * Returns a filter item or filter group item having the specified name. Returns undefined if there are no filter items or filter group items
	 * having the specified name.
	 * 
	 * @private
	 * @param {string} sName
	 * @returns {object}
	 */
	SmartFilterBar.prototype._getFilterItemByName = function(sName) {
		var aFilterItem, length, i;
		aFilterItem = this.getFilterItems();
		aFilterItem.push.apply(aFilterItem, this.getFilterGroupItems());

		length = aFilterItem.length;
		for (i = 0; i < length; i++) {
			if (aFilterItem[i].getName() === sName) {
				return aFilterItem[i];
			}
		}
	};

	/**
	 * Returns a filter group item having the specified group name. Returns undefined if there is no filter group items having the specified name.
	 * 
	 * @private
	 * @param {string} sName
	 * @returns {object}
	 */
	SmartFilterBar.prototype._getFilterGroupItemByGroupName = function(sName) {
		var aFilterItem, length, i;
		aFilterItem = this.getFilterGroupItems();

		length = aFilterItem.length;
		for (i = 0; i < length; i++) {
			if (aFilterItem[i].getGroupName() === sName) {
				return aFilterItem[i];
			}
		}
	};

	/**
	 * returns an JS Object containing all information from the additional configuration (controlConfiguration, groupConfiguration)
	 * 
	 * @returns {object}
	 * @public
	 */
	SmartFilterBar.prototype.getAdditionalConfiguration = function() {
		return new AdditionalConfigurationHelper(this.getControlConfiguration(), this.getGroupConfiguration());
	};

	/**
	 * The entity type name from OData metadata, for which the filter bar shall be created
	 * 
	 * @param {string} sEntityTypeName
	 * @public
	 */
	SmartFilterBar.prototype.setEntityType = function(sEntityTypeName) {
		this.setProperty("entityType", sEntityTypeName);
		this._initializeMetadata();
	};

	/**
	 * Uses the provided resource URI to fetch the OData metadata instead of using the default ODataModel (getModel()). You should only set this if
	 * you intend to get the metadata for the filter bar from elsewhere!
	 * 
	 * @param {string} sResourceUri - The URI of the oData service from which the metadata would be read
	 * @public
	 */
	SmartFilterBar.prototype.setResourceUri = function(sResourceUri) {
		this.setProperty("resourceUri", sResourceUri);
		this._initializeMetadata();
	};

	/**
	 * It could happen that the entity type information is set already in the view, but there is no model attached yet. This method is called once the
	 * model is set on the parent and can be used to initialise the metadata, from the model, and finally create the filter controls.
	 * 
	 * @private
	 */
	SmartFilterBar.prototype.updateBindingContext = function() {
		FilterBar.prototype.updateBindingContext.apply(this, arguments);
		this._initializeMetadata();
	};

	/**
	 * Creates a filter bar based only on the metadata
	 * 
	 * @returns {Object} The smart filter bar instance
	 * @private
	 */
	SmartFilterBar.prototype._createFilterBar = function() {
		var oFilterGroup, i, j, iLen = 0, iFieldLen = 0, aFilterFields, oField;
		if (!this._aFilterBarViewMetadata) {
			return this;
		}

		iLen = this._aFilterBarViewMetadata.length;
		for (i = 0; i < iLen; i++) {
			oFilterGroup = this._aFilterBarViewMetadata[i];
			aFilterFields = oFilterGroup.fields;
			iFieldLen = aFilterFields.length;
			for (j = 0; j < iFieldLen; j++) {
				oField = aFilterFields[j];
				if (oFilterGroup.groupName === FilterProvider.BASIC_FILTER_AREA_ID) {
					this._createFieldInBasicArea(oField);
				} else {
					this._createFieldInAdvancedArea(oFilterGroup.groupName, oFilterGroup.groupLabel, oField);
				}
				if (oField.name !== FilterProvider.BASIC_SEARCH_FIELD_ID) {
					this._handleEnter(oField.control);
					this._handleChange(oField.control);
					this._handleError(oField.control);
				} else {
					this._attachToBasicSearch(oField.control);
				}
			}
		}
		return this;
	};

	/**
	 * Listen to the change event to set the search button state and raise an event
	 * 
	 * @param {object} oControl - the control on which change would be triggered
	 * @private
	 */
	SmartFilterBar.prototype._handleError = function(oControl) {
		if (oControl) {
			var fOnError = jQuery.proxy(function() {
				this._bInError = false;
				if (oControl && oControl.getValueState && oControl.getValueState() === sap.ui.core.ValueState.Error) {
					this._bInError = true;
				}
				this.setSearchEnabled(!this._bInError);
			}, this);
			oControl.attachParseError(fOnError);
			oControl.attachFormatError(fOnError);
			oControl.attachValidationError(fOnError);
			oControl.attachValidationSuccess(jQuery.proxy(function() {
				this._bInError = false;
				this.setSearchEnabled(true);
			}, this));
		}
	};

	/**
	 * Handling of change and search for Basic Search field (used in value helps)
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._attachToBasicSearch = function(oBasicSearchControl) {
		if (oBasicSearchControl) {
			oBasicSearchControl.attachSearch(jQuery.proxy(function() {
				this.search();
			}, this));
			// Basic search doesn't have a change event, so we attach to live change instead!
			oBasicSearchControl.attachLiveChange(jQuery.proxy(this._onChange, this));
		}
	};

	/**
	 * Called when change need to be triggered on the Smart Filter
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._onChange = function(oEvent) {
		var oControl = oEvent.getSource();
		// If the token is being validated do not trigger the change event!
		if (!this._bInError && (!oControl || (oControl && !oControl.__bValidatingToken))) {
			this.setSearchEnabled(true);
			this.fireFilterChange(oEvent);
		}
	};

	/**
	 * Listen to the change event to set the search button state and raise an event
	 * 
	 * @param {object} oControl - the control on which change would be triggered
	 * @private
	 */
	SmartFilterBar.prototype._handleChange = function(oControl) {
		if (oControl) {
			if (oControl.attachChange) {
				oControl.attachChange(jQuery.proxy(this._onChange, this));
			}
		}
	};

	/**
	 * Handles the enter event on the control to trigger Search
	 * 
	 * @param {object} oControl - the control on which enter has to be handled
	 * @private
	 */
	SmartFilterBar.prototype._handleEnter = function(oControl) {
		/*
		 * @Hack: Search should not be triggered while a suggest is in progress (i.e. user presses enter key on the SuggestionList popup). Since the
		 * SuggestionPopup is always closed before the keyup event is raised and we cannot use the keydown event alone, we now listen to both key up
		 * and keydown events and set flags on the control to overcome the issue. Perhaps if sapUI5 provides a new event/does not propagate the keyUp
		 * event/sets a flag we can remove this hack TODO: Clarify this with sapUI5 colleagues.
		 */
		oControl.attachBrowserEvent("keydown", function(e) {
			if (e.which === 13) {
				oControl.__bSuggestInProgress = (oControl._oSuggestionPopup && oControl._oSuggestionPopup.isOpen());
			}
		});
		oControl.attachBrowserEvent("keyup", jQuery.proxy(function(e) {
			if (!this._bInError && (e.which === 13 && !oControl.__bSuggestInProgress && !oControl.__bValidatingToken)) {
				this.search();
			}
		}, this));
	};

	/**
	 * Creates a new field and adds it to the filter bar Basic Area, based on the metadata provided by the FilterProvider
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._createFieldInBasicArea = function(oField) {
		var oFilterItem;
		oFilterItem = new FilterItem({
			labelTooltip: oField.quickInfo,
			label: oField.label,
			name: oField.fieldName,
			control: oField.control,
			mandatory: oField.isMandatory,
			visible: oField.isVisible
		});
		if (oField.isCustomFilterField) {
			oFilterItem.data("isCustomField", true);
		}
		this.addFilterItem(oFilterItem);
	};

	/**
	 * Creates a new field and adds it to the filter bar into the AdvancedSearchArea, based on the metadata provided by the FilterProvider
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._createFieldInAdvancedArea = function(sGroupName, sGroupLabel, oField) {
		var oFilterGroupItem;
		oFilterGroupItem = new FilterGroupItem({
			labelTooltip: oField.quickInfo,
			label: oField.label,
			name: oField.fieldName,
			groupName: sGroupName,
			groupTitle: sGroupLabel,
			mandatory: oField.isMandatory,
			visible: oField.isVisible,
			visibleInAdvancedArea: oField.visibleInAdvancedArea,
			control: oField.control
		});
		if (oField.isCustomFilterField) {
			oFilterGroupItem.data("isCustomField", true);
		}
		this.addFilterGroupItem(oFilterGroupItem);
	};

	/**
	 * Returns an array of filters that can be used to restrict the query result from OData - Returns the results for visible fields only
	 * 
	 * @returns {Array} array of filters
	 * @public
	 */
	SmartFilterBar.prototype.getFilters = function() {
		var aFieldNames = this._getVisibleFieldNames();
		return this._oFilterProvider ? this._oFilterProvider.getFilters(aFieldNames) : [];
	};

	/**
	 * Returns a parameter object that can be used to restrict the query result from OData in case of basic search
	 * 
	 * @returns {object} parameter object containing OData query parameters
	 * @public
	 */
	SmartFilterBar.prototype.getParameters = function() {
		return this._oFilterProvider ? this._oFilterProvider.getParameters() : {};
	};

	/**
	 * Returns the control (if any) with the specified key. (Property name in OData entity)
	 * 
	 * @param {string} sKey - the key as present in the OData property name/control configuration. Use just the property name as the key when getting
	 *        a control from the basic area. Ex: "CompanyCode" & Use "EntityName/GroupName.FieldName" format to get controls from groups.
	 *        Ex:"Account.CompanyCode"
	 * @returns {object|sap.ui.Control} the control in the filter bar, if any
	 * @public
	 */
	SmartFilterBar.prototype.getControlByKey = function(sKey) {
		var oFilterItem;
		oFilterItem = this._getFilterItemByName(sKey);
		if (oFilterItem) {
			return this.determineControlByFilterItem(oFilterItem);
		}
	};

	/**
	 * Returns an array of visible field names
	 * 
	 * @private
	 * @returns {Array} aFieldNames - array of field names
	 */
	SmartFilterBar.prototype._getVisibleFieldNames = function() {
		var aFieldNames = [], aVisibleFilterItems = this.getAllFilterItems(true), iLen = aVisibleFilterItems.length, oItem;
		iLen = aVisibleFilterItems.length;
		// loop through all the visible filter items and get their names
		while (iLen--) {
			oItem = aVisibleFilterItems[iLen];
			if (oItem) {
				aFieldNames.push(oItem.getName());
			}
		}
		return aFieldNames;
	};

	/**
	 * Returns the data currently set in the filter data model
	 * 
	 * @param {boolean} bAllFilterData - Also include empty/invisible fields filter data
	 * @returns {object} the json data in the filter bar
	 * @public
	 */
	SmartFilterBar.prototype.getFilterData = function(bAllFilterData) {
		var oData = null;
		if (this._oFilterProvider) {
			if (bAllFilterData) {
				oData = this._oFilterProvider.getFilterData();
			} else {
				oData = this._oFilterProvider.getFilledFilterData(this._getVisibleFieldNames());
			}
		}
		return oData;
	};

	/**
	 * checks the value of the custom data
	 * 
	 * @private
	 * @param {Object} oCustomData custom data
	 * @returns {boolean} has value/or not
	 */
	SmartFilterBar.prototype._checkHasValueData = function(oCustomData) {
		if (oCustomData) {
			if (typeof oCustomData === "boolean") {
				return oCustomData;
			} else if (typeof oCustomData === "string") {
				if (oCustomData.toLowerCase() === "true") {
					return true;
				}
			}
		}

		return false;
	};

	/**
	 * checks if the current filter has a value
	 * 
	 * @param {Object} oData data as returned by the oData-service
	 * @param {sap.ui.comp.filterbar.FilterItem} oFilterItem representing the filter
	 * @param {sap.ui.core.Control} oControl the control as described by the oFilterItem
	 * @returns {boolean} true if the filter item has a value
	 * @private
	 */
	SmartFilterBar.prototype._checkForValues = function(oData, oFilterItem, oControl) {
		var sValue = null;
		if (oData && oFilterItem && oControl) {
			if (!oFilterItem.data("isCustomField")) {
				// Check if Data exists in the filter model for internal fields
				sValue = oData[oFilterItem.getName()];
			} else {

				var oCustomData = oControl.data("hasValue");
				if ((oCustomData !== undefined) && (oCustomData != null)) {
					return this._checkHasValueData(oCustomData);
				} else {
					if (oControl.getValue) {
						// Check if getValue is present and filled
						sValue = oControl.getValue();
					} else if (oControl.getSelectedKey) { // new mechanism with 1.25. Has to be provided by the custom field
						// Check if getSelectedKey is set
						sValue = oControl.getSelectedKey();
					}
				}
			}
		}

		return sValue ? true : false;
	};

	/**
	 * Returns all filter items containing a value
	 * 
	 * @returns {array} filter items containing a value
	 * @private
	 */
	SmartFilterBar.prototype.getFiltersWithValues = function() {
		var aFilterItemsWithValue = [];

		// logic from check _validateMandatoryFields
		var aFilterItems = this.getAllFilterItems(), oFilterItem, oData = this.getFilterData(), iLen = 0, oControl;
		if (aFilterItems && oData) {
			iLen = aFilterItems.length;
			// Loop through the mandatory field names
			while (iLen--) {
				oFilterItem = aFilterItems[iLen];
				// Get the control from filter item name
				oControl = this.determineControlByFilterItem(oFilterItem);
				if (this._checkForValues(oData, oFilterItem, oControl)) {
					aFilterItemsWithValue.push(oFilterItem);
				}
			}
		}

		return aFilterItemsWithValue;
	};

	/**
	 * Returns the data currently set in the filter data model as string
	 * 
	 * @param {boolean} bAllFilterData - Also include empty/invisible fields filter data
	 * @returns {string} the string json data in the filter bar
	 * @public
	 */
	SmartFilterBar.prototype.getFilterDataAsString = function(bAllFilterData) {
		var oData = null;
		if (this._oFilterProvider) {
			if (bAllFilterData) {
				oData = this._oFilterProvider.getFilterDataAsString();
			} else {
				oData = this._oFilterProvider.getFilledFilterDataAsString(this._getVisibleFieldNames());
			}
		}
		return oData;
	};

	/**
	 * Sets the data in the filter data model
	 * 
	 * @param {object} oJson - the json data in the filter bar *
	 * @param {boolean} bReplace - Replace existing filter data
	 * @public
	 */
	SmartFilterBar.prototype.setFilterData = function(oJson, bReplace) {
		if (this._oFilterProvider) {
			this._oFilterProvider.setFilterData(oJson, bReplace);
		}
	};

	/**
	 * Sets the data in the filter data model as string
	 * 
	 * @param {string} sJson - the json data in the filter bar *
	 * @param {boolean} bReplace - Replace existing filter data
	 * @public
	 */
	SmartFilterBar.prototype.setFilterDataAsString = function(sJson, bReplace) {
		if (this._oFilterProvider) {
			this._oFilterProvider.setFilterDataAsString(sJson, bReplace);
		}
	};

	/**
	 * Overwrites method from base class. Called when user clicks the reset button of the FilterBar. Clears all filter fields and fires reset event.
	 * 
	 * @private
	 */
	SmartFilterBar.prototype.fireClear = function() {
		this._clearFilterFields();
		this.fireEvent("clear", arguments);
	};

	/**
	 * Clears the values of all filter fields. Applies default values if applicable.
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._clearFilterFields = function() {
		if (this._oFilterProvider) {
			this._oFilterProvider.clear();
		}
	};

	/**
	 * Overwrites method from base class. Called when user clicks the reset button of the FilterBar. Clears all filter fields and fires reset event.
	 * 
	 * @private
	 */
	SmartFilterBar.prototype.fireReset = function() {
		this._resetFilterFields();
		this.fireEvent("reset", arguments);
	};

	/**
	 * Clears the values of all filter fields. Applies default values if applicable.
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._resetFilterFields = function() {
		if (this._oFilterProvider) {
			this._oFilterProvider.reset();
		}
	};

	/**
	 * Overwrites method from base class. Called when user clicks the search button of the FilterBar. Does a mandatory check before triggering Search
	 * 
	 * @private
	 * @returns {boolean} true indicated, that there are no validation problems
	 */
	SmartFilterBar.prototype.search = function() {

		var parameter = [];
		var oObj = {};
		oObj.selectionSet = this._retrieveCurrentSelectionSet();
		parameter.push(oObj);

		var bContinue = this._validateMandatoryFields();
		if (bContinue) {
			oObj.selectionSet = this._retrieveCurrentSelectionSet();
			parameter.push(oObj);
			this.fireSearch(parameter);
		} else {
			if (!this._oResourceBundle) {
				this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
			}
			if (!this._sMandatoryErrorMessage) {
				this._sMandatoryErrorMessage = this._oResourceBundle.getText("EMPTY_MANDATORY_MESSAGE");
				this._sMandatoryTitle = this._oResourceBundle.getText("EMPTY_MANDATORY_CHECK_TITLE");
			}
			MessageBox.show(this._sMandatoryErrorMessage, {
				icon: MessageBox.Icon.ERROR,
				title: this._sMandatoryTitle,
				styleClass: !!(this.$() && this.$().closest(".sapUiSizeCompact").length) ? "sapUiSizeCompact" : ""
			});
			// Opens the more area if error message is shown and if empty mandatory fields are present in the advanced filter area!
			if (this._bExpandAdvancedFilterArea && this.rerenderFilters) {
				this.rerenderFilters(true);
			}
		}

		return bContinue;
	};

	/**
	 * Checks if the values of all mandatory filter fields are filled and returns true if they are; else returns false. If no fields and data exist
	 * true is returned! ErrorMessage/ErrorState is set on the fields accordingly.
	 * 
	 * @private
	 * @returns {boolean}
	 */
	SmartFilterBar.prototype._validateMandatoryFields = function() {
		var bFilled = true, aFilterItems = this.determineMandatoryFilterItems(), oFilterItem, oData = this.getFilterData(), iLen = 0, oControl;
		this._bExpandAdvancedFilterArea = false;
		if (aFilterItems && oData) {
			iLen = aFilterItems.length;
			// Loop through the mandatory field names
			while (iLen--) {
				oFilterItem = aFilterItems[iLen];

				// sField = oFilterItem.getName();
				// Get the control from filter item name
				oControl = this.determineControlByFilterItem(oFilterItem);
				if (oControl && oControl.setValueState) {

					if (this._checkForValues(oData, oFilterItem, oControl)) {
						// Clear error state
						oControl.setValueState(sap.ui.core.ValueState.None);
					} else {
						bFilled = false;
						// If field has a value property and it is empty --> show error
						oControl.setValueState(sap.ui.core.ValueState.Error);
						// GroupName method exists only on FilterGroupItem --> part of advanced filter area
						if (oFilterItem.getGroupName) {
							this._bExpandAdvancedFilterArea = true; // !!!! TODO: expand the filter area
						}
					}
				}
			}
		}
		return bFilled;
	};

	/**
	 * creates the smart variant-management control
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._createVariantManagement = function() {

		this._oSmartVariantManagement = null;

		if (this.getAdvancedMode()) {
			return FilterBar.prototype._createVariantManagement.apply(this);
		}

		this._oSmartVariantManagement = new SmartVariantManagement({
			showExecuteOnSelection: true,
			showShare: false
		});

		return this._oSmartVariantManagement;
	};

	/**
	 * initializes the variant management, when the prerequisites are full filled. In this case the initialise-event will be triggered lated, after
	 * the variant management initialization. Triggers the initialise-event immediately, in case the pre-requisits are not full filled
	 * 
	 * @private
	 */
	SmartFilterBar.prototype._initializeVariantManagement = function() {
		// initialise SmartVariant stuff only if it is necessary! (Ex: has a persistencyKey)
		if (!this.isRunningInValueHelpDialog && this._oSmartVariantManagement && this.getPersistencyKey()) {
			var oPersInfo = new PersonalizableInfo({
				type: "filterBar",
				keyName: "persistencyKey",
				dataSource: this.getEntityType()
			});
			oPersInfo.setControl(this);

			this._oSmartVariantManagement.addPersonalizableControl(oPersInfo);

			var bValue = this._checkHasValueData(this.data("executeStandardVariantOnSelect"));
			if (bValue) {
				this._oSmartVariantManagement._executeOnSelectForStandardVariant(bValue);
			}

			FilterBar.prototype._initializeVariantManagement.apply(this, arguments);

		} else {

			this.fireInitialise();
		}
	};

	/**
	 * Returns an instance of the control for the basic search.
	 * 
	 * @returns {object} basic search control
	 * @public
	 */
	SmartFilterBar.prototype.getBasicSearchControl = function() {
		return this.getControlByKey(FilterProvider.BASIC_SEARCH_FIELD_ID);
	};

	/**
	 * Search for the filter field having the specified OData key and adds this filter field to the advanced area. If there is no corresponding field
	 * in the OData metadata, this method has no effect.
	 * 
	 * @param {string} sKey - the key like specified in the OData metadata
	 * @public
	 */
	SmartFilterBar.prototype.addFieldToAdvancedArea = function(sKey) {
		var oFilterItem;
		oFilterItem = this._getFilterItemByName(sKey);
		if (oFilterItem && oFilterItem.setVisibleInAdvancedArea) {
			oFilterItem.setVisibleInAdvancedArea(true);
		}
	};

	/**
	 * Destroys the control
	 * 
	 * @public
	 */
	SmartFilterBar.prototype.destroy = function() {

		FilterBar.prototype.destroy.apply(this, arguments);
		if (this._oFilterProvider && this._oFilterProvider.destroy) {
			this._oFilterProvider.destroy();
		}
		this._oFilterProvider = null;
		this._aFilterBarViewMetadata = null;
		this._bExpandAdvancedFilterArea = null;
		this._oResourceBundle = null;
		this._sMandatoryErrorMessage = null;
		this._sMandatoryTitle = null;

		this._oSmartVariantManagement = null;
	};

	return SmartFilterBar;

}, /* bExport= */true);
