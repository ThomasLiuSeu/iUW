/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.filterbar.FilterBar.
sap.ui.define(['jquery.sap.global', 'sap/m/ActionSheet', 'sap/m/Bar', 'sap/m/Button', 'sap/m/ButtonType', 'sap/m/CheckBox', 'sap/m/CustomListItem', 'sap/m/Dialog', 'sap/m/Label', 'sap/m/LabelDesign', 'sap/m/Link', 'sap/m/List', 'sap/m/ListSeparators', 'sap/m/ListType', 'sap/m/Panel', 'sap/m/PlacementType', 'sap/m/SearchField', 'sap/m/Text', 'sap/m/Toolbar', 'sap/m/ToolbarSpacer', 'sap/ui/Device', './VariantConverterFrom', './VariantConverterTo', 'sap/ui/comp/library', 'sap/ui/comp/smartvariants/PersonalizableInfo', 'sap/ui/comp/smartvariants/SmartVariantManagement', 'sap/ui/comp/smartvariants/SmartVariantManagementUi2', 'sap/ui/comp/variants/VariantManagement', 'sap/ui/core/Icon', 'sap/ui/core/TextAlign', 'sap/ui/core/Title', 'sap/ui/core/ValueState', 'sap/ui/layout/Grid', 'sap/ui/layout/GridData', 'sap/ui/layout/HorizontalLayout', 'sap/ui/layout/ResponsiveFlowLayout', 'sap/ui/layout/ResponsiveFlowLayoutData', 'sap/ui/layout/VerticalLayout', 'sap/ui/layout/form/Form', 'sap/ui/layout/form/FormContainer', 'sap/ui/layout/form/FormElement', 'sap/ui/layout/form/ResponsiveGridLayout'],
	function(jQuery, ActionSheet, Bar, Button, ButtonType, CheckBox, CustomListItem, Dialog, Label, LabelDesign, Link, List, ListSeparators, ListType, Panel, PlacementType, SearchField, Text, Toolbar, ToolbarSpacer, Device, VariantConverterFrom, VariantConverterTo, library, PersonalizableInfo, SmartVariantManagement, SmartVariantManagementUi2, VariantManagement, Icon, TextAlign, Title, ValueState, Grid, GridData, HorizontalLayout, ResponsiveFlowLayout, ResponsiveFlowLayoutData, VerticalLayout, Form, FormContainer, FormElement, ResponsiveGridLayout) {
	"use strict";


	
	/**
	 * Constructor for a new filterbar/FilterBar.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The FilterBar control displays filters in a user-friendly manner to populate values for a query. The FilterBar consists of a row containing the variant management control, the related buttons, and an area underneath displaying the filters.
	 * The filters are arranged in a logical row that is divided depending on the space available and the width of the filters.
	 * The area containing the filters can be hidden or shown using the HideFilterBar/ShowFilterBar button. The 'Go' button triggers the search event, and the 'Filters' button shows the filter dialog. In this dialog, the user has full control over the filter bar. The filters in this dialog are displayed in one column and organized in groups. The filter items of the filterItems aggregation are grouped in the 'Basic' group . Each filter can be marked as visible in the filter bar by selecting 'Add to Filter Bar'. In addition, the items in the 'filterGroupItems' aggregation can be marked as a part of the current variant.
	 * The variant management control will be displayed above the filters.
	 * The FilterBar also supports a different UI layout when used inside a value help dialog. In this case the FilterBar consists of two logical areas, one containing the general search button and in the s.c. 'Advanced Search' area.
	 * The 'Advanced Search' is a collapsible area displaying the advanced filters in two columns.
	 * @extends sap.ui.layout.Grid
	 *
	 * @author Franz Mueller
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.filterbar.FilterBar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FilterBar = Grid.extend("sap.ui.comp.filterbar.FilterBar", /** @lends sap.ui.comp.filterbar.FilterBar.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		properties : {
	
			/**
			 * The persistencyKey represents the key for storing the variant values and the fields belonging to the variants
			 */
			persistencyKey : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * The advance mode overwrites the standard behavior such that:
			 * - the text 'Dynamic Selection' is replaced by 'Advanced Search'
			 * - all filter fields are added to the advanced area
			 * - the Restore button is hidden
			 * - the advanced area is expanded
			 */
			advancedMode : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * describes whether the advanced area should be displayed collapsed or expanded
			 */
			expandAdvancedArea : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * enables/disables the search button
			 */
			searchEnabled : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * allow to display the FilterBar in expanded /collapsed mode
			 * @since 1.26.1
			 */
			filterBarExpanded : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * If this property is set, then the label for filters with a filter group title will be enhanced with the group title.
			 * @since 1.28.0
			 */
			considerGroupTitle : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * indicates if the 'Clear' button should be shown.
			 * Has to be set during filter bar initialization.
			 * @since 1.26.1
			 */
			showClearButton : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * indicates if the 'Restore' button should be shown.
			 * Has to be set during filter bar initialization.
			 * @since 1.26.1
			 */
			showRestoreButton : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * indicates if the 'Go' button should be shown in the filter bar.
			 * Has to be set during FilterBar initialization.
			 * @since 1.28.0
			 */
			showGoOnFB : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * indicates if the 'Restore' button should be shown in the filter bar.
			 * Has to be set during FilterBar initialization.
			 * @since 1.28.0
			 */
			showRestoreOnFB : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * indicates if the 'Clear' button should be shown in the filter bar.
			 * Has to be set during FilterBar initialization.
			 * @since 1.28.0
			 */
			showClearOnFB : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * indicates if the 'Go' button should be shown in the filter bar.
			 * Has to be set during FilterBar initialization.
			 * @since 1.26.1
			 * @deprecated Since version 1.28.0. 
			 * please use instead the property 'showGoOnFB'
			 */
			showGoButton : {type : "boolean", group : "Misc", defaultValue : null, deprecated: true}
		},
		aggregations : {
	
			/**
			 * is used to populate the basic area with selection fields
			 */
			filterItems : {type : "sap.ui.comp.filterbar.FilterItem", multiple : true, singularName : "filterItem"}, 
	
			/**
			 * is used for the population of the advanced area with filter fields
			 */
			filterGroupItems : {type : "sap.ui.comp.filterbar.FilterGroupItem", multiple : true, singularName : "filterGroupItem"}
		},
		events : {
	
			/**
			 * this event is fired if the button 'Reset' is executed
			 */
			reset : {}, 
	
			/**
			 * this event is fired if the button 'Search' is executed
			 */
			search : {}, 
	
			/**
			 * Fired before a variant is saved. This event can be used to adapt the model of the smart filter bar, which will be saved as variant later on.
			 */
			beforeVariantSave : {}, 
	
			/**
			 * Fired after a variant was loaded and applied to the SmartFilterBar. The event could be used to adapt custom control with data from the variant.
			 */
			afterVariantLoad : {}, 
	
			/**
			 * Event fired when the filter criteria has changed
			 */
			filterChange : {}, 
	
			/**
			 * Event fired if the Clear button is executed. The intention is to clear every filter.
			 */
			clear : {}, 
	
			/**
			 * Event fired when the filter bar is initialized and its controls are created and the variants are obtained
			 */
			initialise : {}, 
	
			/**
			 * Fired after a variant is saved. This event can be used to retrieve the id of the saved variant.
			 */
			afterVariantSave : {}
		}
	}});
	
	
	/**
	 * resets the aggregation FilterItems
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#removeAllFilterItems
	 * @function
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * resets the aggregation FilterGroupItem
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#removeAllFilterGroupItems
	 * @function
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * returns all items of the FilterBar, or depending on the flag, only all visible items
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#getAllFilterItems
	 * @function
	 * @type sap.ui.comp.filterbar.FilterItem[]
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * Relevant for variant handling. This fCallBack will be executed, if a variant save is triggered and has to provide, in Json notation, all relevant fields and values
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#registerFetchData
	 * @function
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * Relevant for variant handling. This fCallBack will be executed, if a variant has to be applied. The fCallBack will receive the corresponding data set, in Json notation, containing all relevant data as initialy provided by the fCallBack for fetchData
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#registerApplyData
	 * @function
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * returns the associated control for a filter item
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#determineControlByFilterItem
	 * @function
	 * @type sap.ui.core.Control
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * returns the associated control based on name and optional group name
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#determineControlByName
	 * @function
	 * @type sap.ui.core.Control
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * the variant management will be formed , via this api, to reset the current variant selection. Required for the navigation scenario.
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#clearVariantSelection
	 * @function
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * sets the type of the Search-button either to Emphasized or to Default. The state of the Search button will always be reset to Default, once the event search is executed
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#setSearchButtonEmphType
	 * @function
	 * @type void
	 * @public
	 * @deprecated Since version 1.26.0. 
	 * New design makes it obsolete
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * retrieve the list of controls for all mandatory fields
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#determineMandatoryFilterItems
	 * @function
	 * @type sap.ui.comp.filterbar.FilterItem[]
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * rerender the filter area
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#rerenderFilters
	 * @function
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * This function registers a callBack method to obtain the filters with values.
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#registerGetFiltersWithValues
	 * @function
	 * @type sap.ui.comp.filterbar.FilterItem[]
	 * @public
	 * @since 1.26.1
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * retrieve the current Variant. In case STANDARD-variant is the current one, and empty string will be returned.
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#getCurrentVariantId
	 * @function
	 * @type string
	 * @public
	 * @since 1.28.0
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * set the current Variant. In case STANDARD-variant is the current one, and empty string will be returned.
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#setCurrentVariantId
	 * @function
	 * @param {string} sSVariantId
	 *         the variant key
	 * @param {boolean} bBDoNotApplyVariant
	 *         if set to true the applyVariant method will not be executed yet. Relevant during navigation, where the pers-controller sets the variant id, but the initialise - sequence triggers the applyVariant method
	 * @type void
	 * @public
	 * @since 1.28.0
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * retrieve the filter bar data in suite format
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#getDataSuiteFormat
	 * @function
	 * @param {boolean} bBConsiderAllFilters
	 *         indicates if filters with visible=false should be considered
	 * @type string
	 * @public
	 * @since 1.28.0
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * set the suite data to filterbar
	 *
	 * @name sap.ui.comp.filterbar.FilterBar#setDataSuiteFormat
	 * @function
	 * @param {string} sSSuiteData
	 *         representing the suite data
	 * @param {boolean} bBReplace
	 *         indicates a clean-up before appliance
	 * @type void
	 * @public
	 * @since 1.28.0
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	
	
	
	
	
	
	
	
	FilterBar.INTERNAL_GROUP = "__$INTERNAL$";
	
	/**
	 * Initializes the FilterBar control
	 * 
	 * @private
	 */
	FilterBar.prototype.init = function() {
	
		this._oBasicAreaLayout = null;
		this._oAdvancedAreaForm = null;
		this._oAdvancedPanel = null;
		this._oVariantManagement = null;
	
		this._aBasicAreaSelection = null;
		this._mAdvancedAreaFilter = null;
	
		this._fRegisteredFetchData = null;
		this._fRegisteredApplyData = null;
		this._fRegisterGetFiltersWithValues = null;
		this._oHideShowButton = null;
		this._oSearchButton = null;
		this._oFiltersButton = null;
		this._oSearchButtonAdvanced = null;
		this._oClearButtonOnFB = null;
		this._oRestoreButtonOnFB = null;
	
		this._oDialog = null;
		this._oFilterDialog = null;
		this._oActionSheet = null;
		this._bInitialized = false;
	
		this._oVariant = {};
	
		this._nFirstElementWidth = 0;
	
		this._mChangedFilterItems = null;
	
		this._filterChangeSemaphore = true;
	
		this._fRegisteredFilterChangeHandlers = null;
		this._fInitialiseVariants = null;
	
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
	
		this.addStyleClass("sapUiCompFilterBar");
		if (this._isPhone()) {
			this.addStyleClass("sapUiCompFilterBarPhone");
		} else {
			this.addStyleClass("sapUiCompFilterBarNonPhone");
		}
	
		this.addStyleClass("sapUiCompFilterBarMarginBottom");
		this.addStyleClass("sapUiCompFilterBarPaddingPanel");
	
		this._oToolbar = this._createToolbar();
		this._oToolbar.setLayoutData(new GridData({
			span: "L12 M12 S12"
		}));
		this.addContent(this._oToolbar);
	
		// Basic
		this._oBasicAreaLayout = this._createBasicAreaLayout();
		this._oBasicAreaLayout.setLayoutData(new GridData({
			span: "L12 M12 S12"
		}));
		this.addContent(this._oBasicAreaLayout);
	
		// Advanced
		this._oAdvancedPanel = new Panel();
		this._oAdvancedPanel.setLayoutData(new GridData({
			span: "L12 M12 S12"
		}));
	
		this._oAdvancedPanel.setExpandable(false);
	
		this._oAdvancedPanel.setVisible(false);
		this._oAdvancedAreaForm = this._createAdvancedAreaForm();
		this._oAdvancedPanel.addContent(this._oAdvancedAreaForm);
	
		this.oAdvancedSearchArea = this._createBasicAreaLayout();
		this._oAdvancedPanel.addContent(this.oAdvancedSearchArea);
	
		this.addContent(this._oAdvancedPanel);
	
		// register event handler for resizing
		jQuery(window).on("resize.basicsearch", jQuery.proxy(this._fHandleResize, this));
	
		this.oModel = new sap.ui.model.json.JSONModel({});
		this.setModel(this.oModel, "FilterBar");
	
		this.setFilterBarExpanded(this._isTablet() ? false : this.getFilterBarExpanded());
	};
	
	/**
	 * set the visibility for the clear button on filterbar. Not supported on phone devices.
	 * 
	 * @public
	 * @since 1.28.0
	 * @param {boolean} bFlag state of visibility
	 */
	FilterBar.prototype.setShowClearOnFB = function(bFlag) {
	
		if (!this._isPhone()) {
			this.setProperty("showClearOnFB", bFlag);
			this._oClearButtonOnFB.setVisible(bFlag);
		}
	};
	
	/**
	 * set the visibility for the restore button on filterbar. Not supported on phone devices.
	 * 
	 * @public
	 * @since 1.28.0
	 * @param {boolean} bFlag state of visibility
	 */
	FilterBar.prototype.setShowRestoreOnFB = function(bFlag) {
	
		if (!this._isPhone()) {
			this.setProperty("showRestoreOnFB", bFlag);
			this._oRestoreButtonOnFB.setVisible(bFlag);
		}
	};
	
	/**
	 * set the visibility for the go button on filterbar
	 * 
	 * @public
	 * @since 1.28.0
	 * @param {boolean} bFlag state of visibility
	 */
	FilterBar.prototype.setShowGoOnFB = function(bFlag) {
	
		this.setProperty("showGoOnFB", bFlag);
	
		this._oSearchButton.setVisible(bFlag);
	};
	
	/**
	 * set the visibility for the go button on filterbar. This Property is deprecated. Please use instead the property 'showGoOnFB'.
	 * 
	 * @public
	 * @since 1.26.1
	 * @param {boolean} bFlag state of visibility
	 */
	FilterBar.prototype.setShowGoButton = function(bFlag) {

		this.setShowGoOnFB(bFlag);
	};
	/**
	 * get the visibility for the go button on filterbar. This Property is deprecated. Please use instead the property 'showGoOnFB'.
	 * 
	 * @public
	 * @since 1.26.1
	 * @returns {boolean} bFlag state of visibility
	 */
	FilterBar.prototype.getShowGoButton = function() {

		return this.getShowGoOnFB();
	};
	
	/**
	 * set the current variant id
	 * 
	 * @public
	 * @since 1.28.0
	 * @param {string} sVariantId id of the variant
	 * @param {boolean} bDoNotApplyVariant if set to true the applyVariant method will not be executed yet. Use-full if used during navigation, where the
	 *        pers-controller sets the variant id, but the initialise - sequence triggers the applyVariant method
	 */
	FilterBar.prototype.setCurrentVariantId = function(sVariantId, bDoNotApplyVariant) {

	
		if (this._oVariantManagement) {
			this._oVariantManagement.setCurrentVariantId(sVariantId, bDoNotApplyVariant);
		}
	};
	
	/**
	 * retrieves the current variant id
	 * 
	 * @public
	 * @since 1.28.0
	 * @returns {string} id of the current variant
	 */
	FilterBar.prototype.getCurrentVariantId = function() {

		var sKey = "";
	
		if (this._oVariantManagement) {
			sKey = this._oVariantManagement.getCurrentVariantId();
		}
	
		return sKey;
	};
	
	/**
	 * retrieves the current variant in a suite format
	 * 
	 * @public
	 * @since 1.28.0
	 * @param {boolean} bConsiderAllFilters indicates, if hidden filters should be considered
	 * @returns {string} JSON string representing the 'new' format; null otherwise
	 */
	FilterBar.prototype.getDataSuiteFormat = function(bConsiderAllFilters) {
	
		var sSuiteVariant = null;
		var sKey, sContent, aFiltersInfo;
	
		if (this._oVariantManagement) {
			sKey = this.getCurrentVariantId();
	
			if (this.getFilterDataAsString) {
				aFiltersInfo = this._determineVariantFiltersInfo(bConsiderAllFilters);
	
				sContent = this.getFilterDataAsString(bConsiderAllFilters);
				if (sContent) {
					var oConverter = new VariantConverterTo();
					sSuiteVariant = oConverter.convert(sKey, aFiltersInfo, sContent, this);
				}
			}
		}
	
		return sSuiteVariant;
	};
	FilterBar.prototype.getCurrentVariant = function(bConsiderAllFilters) {

		return this.getDataSuiteFormat(bConsiderAllFilters);
	};
	
	/**
	 * retrieves the current variant in a suite format
	 * 
	 * @public
	 * @since 1.28.0
	 * @param {string} sSuiteData representing the suite data
	 * @param {boolean} bReplace indicates a clean-up before appliance
	 */
	FilterBar.prototype.setDataSuiteFormat = function(sSuiteData, bReplace) {

		var sContent;
		
		if (sSuiteData) {
			
			var oConverter = new VariantConverterFrom();
			sContent = oConverter.convert(sSuiteData, this);
			
			if (sContent && this.setFilterDataAsString) {
				this._setConsiderFilterChanges(false);				
				this.setFilterDataAsString(sContent, bReplace);
				this._setConsiderFilterChanges(true);				
			}			
		}
	};
	FilterBar.prototype.setCurrentVariant = function(sSuiteData, bReplace) {

		this.setDataSuiteFormat(sSuiteData, bReplace);
	};
	
	/**
	 * set the persistency key for
	 * 
	 * @public
	 * @param {string} sPersistenceKey id for persistency
	 */
	FilterBar.prototype.setPersistencyKey = function(sPersistenceKey) {

		this.setProperty("persistencyKey", sPersistenceKey);
	
		this._oVariantManagement.setVisible(!this.getAdvancedMode());
	};
	
	/**
	 * When the filterBar is started via navigation, we need to inform the variant management to reset an eventual previous selection
	 * 
	 * @public
	 */
	FilterBar.prototype.clearVariantSelection = function() {

		if (this._oVariantManagement) {
			this._oVariantManagement.clearVariantSelection();
		}
	};
	
	/**
	 * sets the type of the Search-button to Emphasize. The state of the Search button will always be reset, once the event search is executed
	 * 
	 * @public
	 * @param {boolean} bSetEmphasize sets the Emphasized or Default - type
	 */
	FilterBar.prototype.setSearchButtonEmphType = function(bSetEmphasize) {

	};
	
	/**
	 * enables/disables the search button
	 * 
	 * @public
	 * @param {boolean} bValue sets/resets the enable state of the search button
	 */
	FilterBar.prototype.setSearchEnabled = function(bValue) {
	
		this.setProperty("searchEnabled", bValue);
	
		if (this._oSearchButton) {
			this._oSearchButton.setEnabled(bValue);
		}
	};
	
	/**
	 * NOT REQUIRED ANY LONGER The simplified mode is with beginning of 1.25 always implicitly used. The former setter-method method stays in place, so
	 * that the former usages do not have to be adapted. new layout set the new behavior: all fields (select and filters) are displayed in one ui region.
	 * The initial display occurs in one line. public
	 * 
	 * @param {boolean} bFlag sets/resets the simplified mode
	 */
	FilterBar.prototype.setSimplifiedMode = function(bFlag) {

		// the simplified mode is with beginning of 1.25 always implicitly used.
		// The former setter-method method stays in place, so that the former usages do not have to be adapted.
	};
	
	/**
	 * NOT REQUIRED ANY LONGER The simplified mode is with beginning of 1.25 always implicitly used. The former getter-method method stays in place, so
	 * that the former usages do not have to be adapted. new layout set the new behavior: all fields (select and filters) are displayed in one ui region.
	 * The initial display occurs in one line. public
	 * 
	 * @param {boolean} bFlag mode
	 * @returns {boolean} false if the current advanced mode is set, true otherwise
	 */
	FilterBar.prototype.getSimplifiedMode = function(bFlag) {
	
		if (this.getAdvancedMode()) {
			return false;
		}
	
		return true;
	};
	
	/**
	 * describes whether the advanced area should be displayed collapsed or expanded
	 * 
	 * @public
	 * @param {boolean} bFlag sets/resets the advanced area to expanded/collapsed
	 */
	FilterBar.prototype.setExpandAdvancedArea = function(bFlag) {
	
		this.setProperty("expandAdvancedArea", bFlag);
	
		if (this._oAdvancedPanel.getVisible()) {
			this._oAdvancedPanel.setExpanded(bFlag);
		}
	};
	
	/**
	 * describes whether the advanced area is currently displayed as collapsed or expanded
	 * 
	 * @public
	 * @returns {boolean} return the current state of the expand area
	 */
	FilterBar.prototype.getExpandAdvancedArea = function() {
	
		if (this._oAdvancedPanel.getVisible()) {
			return this._oAdvancedPanel.getExpanded();
		}
	
		return false;
	};
	
	/**
	 * handling the search button, based on the scenario
	 * 
	 * @private
	 * @param {boolean} bFlag indicates the scenario
	 */
	FilterBar.prototype._switchButtons = function(bFlag) {

		if (bFlag) {

			if (!this._oSearchButtonAdvanced) {
				this._oSearchButtonAdvanced = this._oSearchButton.clone();				
				this._oSearchButtonAdvanced.setText(this._oRb.getText("FILTER_BAR_SEARCH"));
				this._oSearchButtonAdvanced.setVisible(true);			
			}

			this._initializeSearchButtonsLocation();			

		} else {
			this._oBasicAreaLayout.removeContent(this._oSearchButtonAdvanced);
			this.oAdvancedSearchArea.removeContent(this._oSearchButtonAdvanced);			
		}

		this._oToolbar.setVisible(!bFlag);
	};
	
	FilterBar.prototype._initializeSearchButtonsLocation = function() {
		var aContent, idx = 0;
		
		if (this._oSearchButtonAdvanced) {
			this._oSearchButtonAdvanced.setVisible(true);	
			if (this._mAdvancedAreaFilter && this._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP] && this._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items && this._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items.length > 0) {
				aContent = this._oBasicAreaLayout.getContent();
				if (aContent.length > 0) {
					idx = aContent.length - 1;
				}				
				this._oBasicAreaLayout.insertContent(this._oSearchButtonAdvanced, idx);					
			} else {				
				this._oSearchButtonAdvanced.addStyleClass("sapUiCompFilterBarFloatRight");
				this.oAdvancedSearchArea.addContent(this._oSearchButtonAdvanced);		
				this.oAdvancedSearchArea.setVisible(true);					
			}			
		}
	};
	
	
	/**
	 * In advanced mode the text 'Dynamic Selection' is replaced by 'Advanced Search' all filter fields are added to the advanced area and the add/remove
	 * filter button and the variant management buttons are hidden
	 * 
	 * @public
	 * @param {boolean} bFlag - true or false / set-reset advanced mode
	 */
	FilterBar.prototype.setAdvancedMode = function(bFlag) {

		this.setProperty("advancedMode", bFlag);
	
		this.setFilterBarExpanded(bFlag);
	
		this._oFiltersButton.setVisible(!bFlag);
	
		this._switchButtons(bFlag);
	
		if (!bFlag) {
	
			if (this.getPersistencyKey()) {
				this._oVariantManagement.setVisible(true);
			}
	
			return;
		}
	
		var i, n = null;
		var oGroup;
	
		this._oVariantManagement.setVisible(false);
	
		for (n in this._mAdvancedAreaFilter) {
			if (n) {
				oGroup = this._mAdvancedAreaFilter[n];
				if (oGroup && oGroup.items) {
					for (i = 0; i < oGroup.items.length; i++) {
						oGroup.items[i].filterItem.setVisibleInFilterBar(true);
					}
				}
			}
		}
	
	};
	
	/**
	 * add an FilterItem element to the basic area
	 * 
	 * @public
	 * @param {sap.ui.comp.filterbar.FilterItem} oFilterItem filter item
	 */
	FilterBar.prototype.addFilterItem = function(oFilterItem) {

		var sName;
		var oControl;
	
		if (!oFilterItem) {
			throw new Error("sap.ui.comp.filterbar.FilterBar.prototype.addFilterItem()" + " Expected argument 'oFilterItem' may not be null nor empty");
		}
	
		sName = oFilterItem.getName();
		if (!sName) {
			throw new Error("sap.ui.comp.filterbar.FilterBar.prototype.addFilterItem()" + " Expected argument 'oFilterItem.name' may not be null nor empty");
		}
	
		oControl = oFilterItem.getControl();
		if (!oControl) {
			throw new Error("sap.ui.comp.filterbar.FilterBar.prototype.addFilterItem()" + " Expected argument 'oFilterItem.control' may not be null nor empty");
		}
	
		this.addAggregation("filterItems", oFilterItem, true);
	
		// has to be initialized before the call to the container creation
		if (!this._aBasicAreaSelection) {
			this._aBasicAreaSelection = [];
		}
	
		var oObj = {
			control: oFilterItem.getControl(),
			filterItem: oFilterItem
		};
		this._aBasicAreaSelection.push(oObj);
	
		if (this.getAdvancedMode()) {
	
			var oContainer = this._addControlToBasicAreaFormContainer(oFilterItem);
			if (oContainer) {
				oContainer.setVisible(oFilterItem.getVisible());
				oFilterItem.attachChange(this._filterItemChange.bind(this, oContainer));
				oObj.container = oContainer;
			}
	
		} else {
	
			var oFilterGroupItem = new sap.ui.comp.filterbar.FilterGroupItem({
				label: oFilterItem.getLabel(),
				labelTooltip: oFilterItem.getLabelTooltip(),
				name: oFilterItem.getName(),
				mandatory: oFilterItem.getMandatory(),
				visible: oFilterItem.getVisible(),
				visibleInFilterBar: oFilterItem.getVisibleInFilterBar(),
				partOfCurrentVariant: true,
				control: oFilterItem.getControl(),
				groupName: FilterBar.INTERNAL_GROUP,
				groupTitle: ""
			});
	
			if (oFilterItem.data('isCustomField')) {
				oFilterGroupItem.data('isCustomField', true);
			}
	
			oFilterItem.attachChange(this._filterItemChange.bind(this, null));
	
			this.addFilterGroupItem(oFilterGroupItem);
		}
	
	};
	
	/**
	 * add an FilterItem element to the advanced area
	 * 
	 * @public
	 * @param {sap.ui.comp.filterbar.FilterGroupItem} oFilterGroupItem group filter item
	 */
	FilterBar.prototype.addFilterGroupItem = function(oFilterGroupItem) {
	
		if (!oFilterGroupItem) {
			throw new Error("sap.ui.comp.filterbar.FilterBar.prototype.addFilterGroupItem()" + " Expected argument 'oFilterGroupItem' may not be null nor empty");
		}
	
		this.addAggregation("filterGroupItems", oFilterGroupItem, true);
	
		var sGroupName = oFilterGroupItem.getGroupName();
		if (!sGroupName) {
			throw new Error("sap.ui.comp.filterbar.FilterBar.prototype.addFilterGroupItems()" + " GroupName may not be null nor empty");
		}
	
		var sName = oFilterGroupItem.getName();
		if (!sName) {
			throw new Error("sap.ui.comp.filterbar.FilterBar.prototype.addFilterGroupItems()" + " Name may not be null nor empty");
		}
	
		if (!this._mAdvancedAreaFilter) {
			this._mAdvancedAreaFilter = {};
		}
		if (!this._mAdvancedAreaFilter[sGroupName]) {
			this._mAdvancedAreaFilter[sGroupName] = {};
			this._mAdvancedAreaFilter[sGroupName].filterItem = oFilterGroupItem;
			this._mAdvancedAreaFilter[sGroupName].items = [];
		}
	
		var oObj = {
			control: oFilterGroupItem.getControl(),
			filterItem: oFilterGroupItem
		};
	
		if (this.getAdvancedMode() || oFilterGroupItem.getVisibleInFilterBar()) {
			oFilterGroupItem.setVisibleInFilterBar(true);
		} else {
			oFilterGroupItem.setVisibleInFilterBar(false);
		}
	
		this._mAdvancedAreaFilter[sGroupName].items.push(oObj);
	
		if (this.getAdvancedMode()) {
			this._rerenderAA();
			oFilterGroupItem.attachChange(this._filterGroupItemChange.bind(this));
		} else {
			var oContainer = this._addControlToBasicAreaFormContainer(oFilterGroupItem);
			if (oContainer) {
				oObj.container = oContainer;
	
				oContainer.setVisible(oFilterGroupItem.getVisible() && oFilterGroupItem.getVisibleInFilterBar());
				if (oFilterGroupItem.getVisibleInFilterBar()) {
					oFilterGroupItem.setPartOfCurrentVariant(oFilterGroupItem.getVisibleInFilterBar());
				}
	
				oFilterGroupItem.attachChange(this._filterGroupItemChange.bind(this));
			}
		}
	};
	
	/**
	 * Event handler called when the property of a filter item has changed
	 * 
	 * @private
	 * @param {object} oContainer the container of the filter item's control and label
	 * @param {object} oEvent the event
	 */
	FilterBar.prototype._filterItemChange = function(oContainer, oEvent) {
	
		var oItem;
		var bFlag;
	
		if (oEvent && oEvent.oSource && (oEvent.oSource instanceof sap.ui.comp.filterbar.FilterItem)) {
	
			var sPropertyName = oEvent.getParameter("propertyName");
	
			if (this.getAdvancedMode() && (sPropertyName === "visible")) {
				oContainer.setVisible(bFlag);
				return;
			}
	
			if (sPropertyName === "visibleInFilterBar" || sPropertyName === "visible" || sPropertyName === "label" || sPropertyName === "mandatory") {
				oItem = this._determineItemByName(oEvent.oSource.getName(), FilterBar.INTERNAL_GROUP);
	
				if (oItem && oItem.filterItem) {
					if ((sPropertyName === "visible")) {
						bFlag = oEvent.oSource.getVisible();
						oItem.filterItem.setVisible(bFlag);
					} else if (sPropertyName === "visibleInFilterBar") {
						bFlag = oEvent.oSource.getVisibleInFilterBar();
						var bChangePossible = this._checkChangePossibleVisibleInFilterBar(oItem.filterItem, bFlag);
						if (bChangePossible) {
							oItem.filterItem.setVisibleInFilterBar(bFlag);
						} else {
							oEvent.oSource.setVisibleInFilterBar(true);
						}
	
					} else if (sPropertyName === "label") {
						oItem.filterItem.setLabel(oEvent.oSource.getLabel());
					} else if (sPropertyName === "mandatory") {
						bFlag = oEvent.oSource.getMandatory();
						oItem.filterItem.setMandatory(bFlag);
					}
				}
			}
		}
	};
	
	/**
	 * Event handler called when the property of a filter group item has changed
	 * 
	 * @private
	 * @param {object} oEvent the event
	 */
	FilterBar.prototype._filterGroupItemChange = function(oEvent) {
	
		var oItem;
		var sPropertyName;
	
		if (this.getAdvancedMode()) {
			this._rerenderAA();
			return;
		}
	
		if (oEvent && oEvent.oSource) {
			sPropertyName = oEvent.getParameter("propertyName");
			if (sPropertyName === "visibleInFilterBar" || sPropertyName === "visible") {
	
				oItem = this._determineItemByName(oEvent.oSource.getName(), oEvent.oSource.getGroupName());
				if (oItem) {
					if (sPropertyName === "visibleInFilterBar") {
						var bFlag = oEvent.oSource.getVisibleInFilterBar();
	
						var bChangePossible = this._checkChangePossibleVisibleInFilterBar(oEvent.oSource, bFlag);
						if (!bChangePossible) {
							oEvent.oSource.setVisibleInFilterBar(true);
							bFlag = true;
						}
	
						if (bFlag) {
							oEvent.oSource.setPartOfCurrentVariant(true);
						}
	
						this._rerenderItem(oItem);
						this._adaptLinkText(oEvent.oSource.getGroupName());
	
					} else if (sPropertyName === "visible") {
						this._updateToolbarText();
						this._rerenderGroup(oItem, oEvent.oSource.getGroupName());
					}
				}
			} else if (sPropertyName === "groupTitle") {
				if (this._mAdvancedAreaFilter && this._mAdvancedAreaFilter[oEvent.oSource.getGroupName()]) {
					if (this._mAdvancedAreaFilter[oEvent.oSource.getGroupName()].formcontainer) {
						this._mAdvancedAreaFilter[oEvent.oSource.getGroupName()].formcontainer.setTitle(oEvent.oSource.getGroupTitle());
					} else {
						this._adaptGroupTitle(oEvent.oSource.getGroupName());
					}
				}
			} else if (sPropertyName === "label") {
				if (!this._mAdvancedAreaFilter[oEvent.oSource.getGroupName()].formcontainer) { // do not adapt in case the advanced filters dialog is
					// active
					this._adaptGroupTitleForFilter(oEvent.oSource);
				}
			} else if (sPropertyName === "mandatory") {
				if (this._oFilterDialog) { // adapt only in case the advanced filters dialog is active
					this._adaptMandatoryForFilter(oEvent.oSource);
				}
			}
		}
	};
	
	/**
	 * visibleInFilterBar may not be changed to false, when the filter is mandatory and has no value
	 * 
	 * @private
	 * @param {sap.ui.comp.filterbar.FilterItem} oFilterItem in question
	 * @param {boolean} bFlag - represents the value of visibleInFilterBar
	 * @returns {boolean} allowed or not allowed change
	 */
	FilterBar.prototype._checkChangePossibleVisibleInFilterBar = function(oFilterItem, bFlag) {
	
		if (oFilterItem && oFilterItem.getMandatory() && !bFlag) {
			var bHasValue = this._hasFilterValue(oFilterItem);
			if (!bHasValue) {
				oFilterItem.setVisibleInFilterBar(true);
				return false;
			}
		}
	
		return true;
	};
	
	/**
	 * in case the visibility was changed, check if the link text has to be adapted
	 * 
	 * @private
	 * @param {string} sGroupName the group name
	 */
	FilterBar.prototype._adaptLinkText = function(sGroupName) {
	
		if (this._mAdvancedAreaFilter && this._mAdvancedAreaFilter[sGroupName] && this._mAdvancedAreaFilter[sGroupName].link) {
			this._setLinkText(sGroupName, this._mAdvancedAreaFilter[sGroupName].link);
		}
	};
	
	/**
	 * convenient function
	 * 
	 * @private
	 * @param {sap.ui.comp.filterbar.FilterItem} oFilterItem the filter
	 * @returns {boolean} returns if the passed filter has a value or not
	 */
	FilterBar.prototype._hasFilterValue = function(oFilterItem) {
	
		var aFilters = this._getFiltersWithValues();
		return this._checkFilterForValue(aFilters, oFilterItem);
	};
	
	/**
	 * handling dynamic change of the mandatory property
	 * 
	 * @private
	 * @param {sap.ui.comp.filterbar.FilterItem} oFilterItem the filter
	 */
	FilterBar.prototype._adaptMandatoryForFilter = function(oFilterItem) {
	
		var oItem;
		var sGroupName = oFilterItem.getGroupName();
	
		if (oFilterItem) {
			oItem = this._determineItemByName(oFilterItem.getName(), sGroupName);
			if (oItem && oItem.checkbox && oItem.checkbox.getVisible()) {
	
				var bEnabled = true;
				if (oFilterItem.getMandatory()) {
					var bHasValue = this._hasFilterValue(oFilterItem);
					if (!bHasValue) {
						bEnabled = false;
						oFilterItem.setVisibleInFilterBar(true);
					}
				}
	
				oItem.checkbox.setEnabled(bEnabled);
			}
		}
	};
	
	/**
	 * in case considerGroupTitle is set then all labels of filters of a specific group will post-fixed with the group title
	 * 
	 * @private
	 * @param {sap.ui.comp.filterbar.FilterGroupItem} oFilterItem the filter
	 */
	FilterBar.prototype._adaptGroupTitleForFilter = function(oFilterItem) {
	
		var sLabel;
		var oLabel;
	
		if (oFilterItem) {
			sLabel = oFilterItem.getLabel();
			oLabel = oFilterItem.getLabelControl();
			if (this.getConsiderGroupTitle()) {
				if (oLabel && oFilterItem.getGroupTitle()) {
					oLabel.setText(sLabel + " (" + oFilterItem.getGroupTitle() + ')');
				}
			} else {
				oLabel.setText(sLabel);
			}
		}
	};
	
	/**
	 * in case considerGroupTitle is set then all labels of filters of a specific group will post-fixed with the group title
	 * 
	 * @private
	 * @param {string} sGroupName filter group name
	 */
	FilterBar.prototype._adaptGroupTitle = function(sGroupName) {
	
		var i;
		var oItem;
	
		if (this._mAdvancedAreaFilter && this._mAdvancedAreaFilter[sGroupName] && this._mAdvancedAreaFilter[sGroupName].items) {
			for (i = 0; i < this._mAdvancedAreaFilter[sGroupName].items.length; i++) {
				oItem = this._mAdvancedAreaFilter[sGroupName].items[i];
				if (oItem && oItem) {
					this._adaptGroupTitleForFilter(oItem.filterItem);
				}
			}
		}
	};
	
	/**
	 * in case considerGroupTitle is set then all labels of all filters of all groups will be post-fixed with the group title
	 * 
	 * @private
	 * @param {string} sGroupName the group name
	 */
	FilterBar.prototype._adaptGroupsTitle = function() {
	
		var n = null;
	
		if (this._mAdvancedAreaFilter) {
			for (n in this._mAdvancedAreaFilter) {
				if (n && n !== FilterBar.INTERNAL_GROUP) {
					this._adaptGroupTitle(n);
				}
			}
		}
	
	};
	
	/**
	 * fCallBack for being able to participate in variant save handling. This fCallBack will be executed, whenever the variant save is triggered and has
	 * to provide, in Json notation, all relevant fields and values. This data blob will be saved along with the current variant
	 * 
	 * @public
	 * @since 1.26.1
	 * @param {function} fCallBack to be called, when a variant has to be applied
	 */
	FilterBar.prototype.registerGetFiltersWithValues = function(fCallBack) {

	
		this._fRegisterGetFiltersWithValues = fCallBack;
	};
	
	/**
	 * fCallBack for being able to participate in variant save handling. This fCallBack will be executed, whenever the variant save is triggered and has
	 * to provide, in Json notation, all relevant fields and values. This data blob will be saved along with the current variant
	 * 
	 * @public
	 * @param {function} fCallBack to be called, when a variant has to be applied
	 */
	FilterBar.prototype.registerFetchData = function(fCallBack) {

		this._fRegisteredFetchData = fCallBack;
	};
	
	/**
	 * fCallBack for being able to participate in variant handling. This fCallBack will be executed, when ever a variant has to be applied. The fCallBack
	 * will receive the corresponding data set, in Json notation, containing all relevant data as initially provided by the fCallBack for fetchData
	 * 
	 * @public
	 * @param {function} fCallBack to be called, when a variant has to be applied
	 */
	FilterBar.prototype.registerApplyData = function(fCallBack) {
	
		this._fRegisteredApplyData = fCallBack;
	};
	
	FilterBar.prototype._isTINAFScenario = function() {
	
		if (this._oVariantManagement && (this._oVariantManagement instanceof SmartVariantManagement)) {
			return true;
		}
	
		return false;
	};
	
	/**
	 * read the personalization, apply eventual variants and inform all registered parties about the initialization finish. In case a default variant
	 * exists, trigger search
	 * 
	 * @public
	 */
	FilterBar.prototype.fireInitialise = function() {

	
		if (this._isTINAFScenario()) {
			this._fireInitialiseEvent();
		} else {
			this._initializeVariantManagement();
		}
	};
	
	/**
	 * initializes the variant management, when the prerequisites are full filled. In this case the initialise-event will be triggered lated, after the
	 * variant management initialization. Triggers the initialise-event immediately, in case the pre-requisits are not full filled
	 * 
	 * @private
	 */
	FilterBar.prototype._initializeVariantManagement = function() {
	
		// initialise SmartVariant stuff only if it is necessary! (Ex: has a persistencyKey)
		if (this._oVariantManagement && this.getPersistencyKey()) {
	
			this._fInitialiseVariants = jQuery.proxy(this._initialiseVariants, this);
			this._oVariantManagement.attachInitialise(this._fInitialiseVariants);
	
			this._oVariantManagement.initialise();
	
		} else {
			this._fireInitialiseEvent();
		}
	};
	
	FilterBar.prototype._fireInitialiseEvent = function() {

	
		this.fireEvent("initialise");
	
		this._bInitialized = true;
	};
	
	/**
	 * is triggered, whenever the flex layer is initialized
	 * 
	 * @private
	 */
	FilterBar.prototype._initialiseVariants = function() {

		this._fireInitialiseEvent();
		if (this._oVariantManagement) { // mark any changes as irrelevant
			this._oVariantManagement.currentVariantSetModified(false);
		}
	};
	
	/**
	 * informs the user of the filter bar, that a new variant was applied
	 * 
	 * @privare
	 */
	FilterBar.prototype.fireAfterVariantLoad = function() {
	
		this._rerenderFilters();
	
		this._mChangedFilterItems = null;
	
		this.fireEvent("afterVariantLoad");
	};
	
	/**
	 * removes all entries in the aggregation FilterItems
	 * 
	 * @public
	 */
	FilterBar.prototype.removeAllFilterItems = function() {
	
		var i;
		var aFilters;
	
		this._aBasicAreaSelection = null;
	
		var aControls = this._oBasicAreaLayout.getContent();
		if (aControls) {
			for (i = 0; i < aControls.length; i++) { // 'variant management' ... 'plus', ' more-less', buttons container
				this._oBasicAreaLayout.removeContent(aControls[i]);
			}
		}
	
		aFilters = this.getFilterItems();
		if (this._mAdvancedAreaFilter) {
			if ((this._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP]) && (this._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items)) {
				for (i = 0; i < this._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items.length; i++) {
					if (this._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items[i].filterItem) {
						aFilters.push(this._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items[i].filterItem);
					}
				}
	
				delete this._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP];
			}
	
			if (Object.keys(this._mAdvancedAreaFilter).length === 0) {
				this._mAdvancedAreaFilter = null;
			}
		}
	
		// this.removeAggregation("filterItems");
	
		this._destroyItems(aFilters);
	};
	
	/**
	 * removes all entries in the aggregation GroupFilterItems
	 * 
	 * @public
	 */
	FilterBar.prototype.removeAllFilterGroupItems = function() {
	
		var n = null, i;
		var aFilters = [];
	
		this._oAdvancedPanel.setVisible(false);
		this._oAdvancedAreaForm.removeAllFormContainers();
	
		for (n in this._mAdvancedAreaFilter) {
			if (n) {
				if (this._mAdvancedAreaFilter[n] && this._mAdvancedAreaFilter[n].items) {
					for (i = 0; i < this._mAdvancedAreaFilter[n].items.length; i++) {
						if (this._mAdvancedAreaFilter[n].items[i].filterItem) {
							aFilters.push(this._mAdvancedAreaFilter[n].items[i].filterItem);
						}
					}
	
					delete this._mAdvancedAreaFilter[n];
				}
			}
	
			if (Object.keys(this._mAdvancedAreaFilter).length === 0) {
				this._mAdvancedAreaFilter = null;
			}
		}
	
		// this.removeAggregation("filterGroupItems");
		this._destroyItems(aFilters);
	};
	
	/**
	 * determine all known controls, regardless of their visibility
	 * 
	 * @public
	 * @param {boolean} bConsiderOnlyVisibleFields based on this flag either all or just the visible/partOfCurrentVariant items are returned
	 * @returns {array} array of all/only visible/partOfCurrentVariant items
	 */
	FilterBar.prototype.getAllFilterItems = function(bConsiderOnlyVisibleFields) {

		var i, n = null;
		var aFilters = [];
		var oElement, oItem;
	
		if (this.getAdvancedMode()) {
	
			if (this._aBasicAreaSelection) {
				for (i = 0; i < this._aBasicAreaSelection.length; i++) {
					oItem = this._aBasicAreaSelection[i];
					if (oItem && oItem.filterItem && oItem.filterItem.getVisible()) {
						aFilters.push(oItem.filterItem);
					}
				}
			}
		}
	
		if (this._mAdvancedAreaFilter) {
			for (n in this._mAdvancedAreaFilter) {
				if (n) {
					oElement = this._mAdvancedAreaFilter[n];
					if (oElement.items) {
						for (i = 0; i < oElement.items.length; i++) {
							oItem = oElement.items[i];
							if (oItem && oItem.filterItem && oItem.filterItem.getVisible()) {
								if (bConsiderOnlyVisibleFields) {
									if (oItem.filterItem.getVisibleInFilterBar() || oItem.filterItem.getPartOfCurrentVariant()) {
										aFilters.push(oItem.filterItem);
									}
								} else {
									aFilters.push(oItem.filterItem);
								}
							}
						}
					}
				}
			}
		}
	
		return aFilters;
	};
	
	/**
	 * clear an eventual error state on all filter
	 * 
	 * @private
	 */
	FilterBar.prototype._clearErrorState = function() {
	
		var i;
		var oControl;
	
		var aFilterItems = this.determineMandatoryFilterItems();
		if (aFilterItems) {
			for (i = 0; i < aFilterItems.length; i++) {
				oControl = this.determineControlByFilterItem(aFilterItems[i]);
				if (oControl && oControl.setValueState) {
					oControl.setValueState(ValueState.None);
				}
			}
		}
	};
	
	/**
	 * destroys the aggregation items
	 * 
	 * @private
	 * @param {array} aFilterItems items from the aggregations
	 */
	FilterBar.prototype._destroyItems = function(aFilterItems) {
	
		if (aFilterItems && aFilterItems.length) {
			for (var i = 0; i < aFilterItems.length; i++) {
				aFilterItems[i].destroy();
			}
		}
	};
	
	/**
	 * is called whenever a variant is applied. Persisted data is loaded and the visibility of the filter fields has to be adapted
	 * 
	 * @private
	 * @param {array} aPersData information about the filter fields
	 */
	FilterBar.prototype._reapplyVisibility = function(aPersData) {
	
		var i, n = null;
		var oItem;
	
		if (this._mAdvancedAreaFilter) {
			for (n in this._mAdvancedAreaFilter) {
				if (n) {
					var oGroup = this._mAdvancedAreaFilter[n];
					if (oGroup && oGroup.items) {
						for (i = 0; i < oGroup.items.length; i++) {
							oItem = oGroup.items[i];
							if (oItem && oItem.filterItem) {
								this._setPersVisibility(aPersData, oItem.filterItem);
							}
						}
	
						if (n !== FilterBar.INTERNAL_GROUP) {
							this._adaptLinkText(n);
						}
					}
				}
			}
		}
	};
	
	/**
	 * determines if the current filter is marks as visible via the personalization
	 * 
	 * @private
	 * @param {array} aPersData array of filters as obtain by the persistence layer
	 * @param {sap.ui.comp.filterBar.FilterItem} oFilterItem current filterItem
	 */
	FilterBar.prototype._setPersVisibility = function(aPersData, oFilterItem) {

		var sGroupName, sName;
		var oFilterInfo;
	
		if (oFilterItem) {
			sName = oFilterItem.getName();
			sGroupName = oFilterItem.getGroupName();
	
			oFilterInfo = this._checkForFilterInfo(aPersData, sName);
			if (this._isTINAFScenario()) {
				if (oFilterInfo) {
					oFilterItem.setVisibleInFilterBar((oFilterInfo.visibleInFilterBar));
					oFilterItem.setPartOfCurrentVariant((oFilterInfo.partOfCurrentVariant));
				}
			} else {
				/* eslint-disable no-lonely-if */
				if (oFilterInfo && (oFilterInfo.visibleInFilterBar !== undefined)) { // new format
					oFilterItem.setVisibleInFilterBar((oFilterInfo.visibleInFilterBar));
					oFilterItem.setPartOfCurrentVariant((oFilterInfo.partOfCurrentVariant));
				} else { // old format
					if ((sGroupName !== FilterBar.INTERNAL_GROUP) && oFilterInfo && (oFilterInfo.group === sGroupName)) {
	
						oFilterItem.setVisibleInFilterBar((oFilterInfo !== null));
					}
				}
				/* eslint-enable no-lonely-if */
			}
		}
	};
	
	/**
	 * determines the filter info from the persistence data for a specific filter
	 * 
	 * @private
	 * @param {array} aPersData array of filters as obtain by the persistence layer
	 * @param {string} sName name of the filter
	 * @returns {object} filter info object
	 */
	FilterBar.prototype._checkForFilterInfo = function(aPersData, sName) {
	
		var i;
		var oFilterInfo = null;
	
		if (aPersData && aPersData.length) {
			for (i = 0; i < aPersData.length; i++) {
				if (aPersData[i].name === sName) {
					oFilterInfo = aPersData[i];
					break;
				}
			}
		}
	
		return oFilterInfo;
	};
	
	/**
	 * creates the control for the variant-management
	 * 
	 * @private
	 * @returns {sap.ui.comp.smartvariants.SmartVariantManagementUi2} the instance of variant management
	 */
	FilterBar.prototype._createVariantManagement = function() {
	
		var oVarMgm = new SmartVariantManagementUi2({
		// showExecuteOnSelection: true,
		// showShare: true
		});
	
		var oPersInfo = new PersonalizableInfo({
			type: "filterBar",
			keyName: "persistencyKey"
		});
		oPersInfo.setControl(this);
	
		oVarMgm.addPersonalizableControl(oPersInfo);
	
		oVarMgm.addStyleClass("sapUiCompFilterBarMarginLeft");
		return oVarMgm;
	};
	
	/**
	 * retrieve all filters with values
	 * 
	 * @private
	 * @returns {array} of filters with values
	 */
	FilterBar.prototype._getFiltersWithValues = function() {
	
		if (this._fRegisterGetFiltersWithValues) {
			try {
				return this._fRegisterGetFiltersWithValues();
			} catch (ex) {
				jQuery.sap.log.error("callback for obtaining the filter count throws an exception");
			}
		}
	
		return null;
	};
	
	/**
	 * retrieve the count for visible filters with values
	 * 
	 * @private
	 * @returns {number} count of visible filters with values
	 */
	FilterBar.prototype._getFiltersWithValuesCount = function() {
	
		var i, n = 0;
	
		var aFilters = this._getFiltersWithValues();
		if (aFilters) {
			for (i = 0; i < aFilters.length; i++) {
				if (aFilters[i].getVisible() && (aFilters[i].getVisibleInFilterBar() || aFilters[i].getPartOfCurrentVariant())) {
					n++;
				}
			}
		}
	
		return n;
	};
	
	/**
	 * determines if at least one filter is visible
	 * 
	 * @private
	 * @param {array} aFilterItemsWithValues contains all filters with values
	 * @param {sap.ui.comp.filterbar.FilterItem} oFilterItem filter to check
	 * @returns {boolean} indicated whether at least one filter is visible
	 */
	FilterBar.prototype._checkFilterForValue = function(aFilterItemsWithValues, oFilterItem) {
	
		var i;
		if (aFilterItemsWithValues) {
			for (i = 0; i < aFilterItemsWithValues.length; i++) {
				if (aFilterItemsWithValues[i] === oFilterItem) {
					return true;
				}
			}
		}
	
		return false;
	};
	
	/**
	 * toggles the filter bar mode Hide/Show
	 * 
	 * @private
	 */
	FilterBar.prototype._toggleHideShow = function() {

	
		this.setFilterBarExpanded(!this.getFilterBarExpanded());
	};
	
	/**
	 * updates the filters-button text with the count of filters with values
	 * 
	 * @private
	 */
	FilterBar.prototype._updateToolbarText = function() {
	
		var nFilterCount = this._getFiltersWithValuesCount();
		var sText = nFilterCount ? (this._oRb.getText("FILTER_BAR_ACTIVE_FILTERS", [
			nFilterCount
		])) : (this._oRb.getText("FILTER_BAR_ACTIVE_FILTERS_ZERO"));
		this._oFiltersButton.setText(sText);
	};
	
	/**
	 * set filter bar in collapsed/expanded mode
	 * 
	 * @private
	 * @since 1.26.1
	 * @param {boolean} bShowExpanded mode
	 */
	FilterBar.prototype.setFilterBarExpanded = function(bShowExpanded) {

	
		var bExpanded = this._isPhone() ? false : bShowExpanded;
	
		this.setProperty("filterBarExpanded", bExpanded);
	
		if (this._isPhone()) {
			this._oHideShowButton.setVisible(false);
			this._oSearchButton.setVisible(this.getShowGoOnFB());
	
			if (this.getAdvancedMode()) {
				this._oBasicAreaLayout.setVisible(true); // contains the basic search field
			} else {
				this._oBasicAreaLayout.setVisible(false);
			}
	
		} else {
	
			if (bExpanded) {
				this._oHideShowButton.setText(this._oRb.getText("FILTER_BAR_HIDE"));
			} else {
				this._oHideShowButton.setText(this._oRb.getText("FILTER_BAR_SHOW"));
			}
			this._oHideShowButton.setVisible(true);
			this._oSearchButton.setVisible(this.getShowGoOnFB());
			this._oBasicAreaLayout.setVisible(bExpanded);
		}
	
		this._updateToolbarText();
	};
	
	/**
	 * event-handler whenever in the 'Advanced Dialog' a field was checked/unchecked and handles its visibility in the filter bar
	 * 
	 * @private
	 * @param {sap.m.Checkbox } oCheckBox on which the select-state was changed
	 * @param {sap.ui.comp.filterbar.FilterItem } oFilterItem manipulated by the checkbox
	 */
	FilterBar.prototype._selectionChangedInFilterDialog = function(oCheckBox, oFilterItem) {
	
		oFilterItem.setVisibleInFilterBar(oCheckBox.getSelected());
	
		if (this._getConsiderFilterChanges() && this._oVariantManagement && this._oVariantManagement.getEnabled()) {
			this._oVariantManagement.currentVariantSetModified(true);
		}
	};
	
	/**
	 * event-handler x-check mandatory filed values
	 * 
	 * @private
	 * @param {object } oEvent general event object
	 */
	FilterBar.prototype._mandatoryFilterChange = function(oEvent) {
	
		if (!oEvent) {
			return;
		}
	
		var params = oEvent.getParameters();
		if (!params || !params.oSource) {
			return;
		}
	
		var oItem = this._determineByControl(params.oSource);
		if (oItem && oItem.checkbox) {
	
			var oFilterItem = oItem.filterItem;
	
			if (!oFilterItem.getMandatory()) {
				return;
			}
	
			var bHasValue = this._hasFilterValue(oFilterItem);
			if (oFilterItem.getVisibleInFilterBar()) {
				if (bHasValue) {
					oItem.checkbox.setEnabled(true);
				} else {
					oItem.checkbox.setEnabled(false);
				}
			} else {
				/* eslint-disable no-lonely-if */
				if (!bHasValue) {
					oFilterItem.setVisibleInFilterBar(true);
					oItem.checkbox.setSelected(true);
					oItem.checkbox.setEnabled(false);
				}
				/* eslint-enable no-lonely-if */
			}
		}
	};
	
	/**
	 * called from filters-dialog and creates the form containing all filters
	 * 
	 * @private
	 * @returns {sap.ui.layout.form.Form} the filter form
	 */
	FilterBar.prototype._createFiltersAndAdaptBasicArea = function() {
	
		var oForm;
	
		this._setConsiderFilterChanges(false);
		this._recreateBasicAreaContainer(true);
	
		oForm = this._createFilters();
		this._setConsiderFilterChanges(true);
	
		return oForm;
	};
	
	/**
	 * determines how many filters of a specific group are yet not part of the current variant
	 * 
	 * @private
	 * @param {string} sGroupName name of the current group
	 * @returns {number} count of filters, for the current group, yet not part of the current variant
	 */
	FilterBar.prototype._determineNotAssignedFiltersCount = function(sGroupName) {

		var nCount = 0, i;
		var oFilterItem;
	
		if (this._mAdvancedAreaFilter[sGroupName] && this._mAdvancedAreaFilter[sGroupName].items) {
			for (i = 0; i < this._mAdvancedAreaFilter[sGroupName].items.length; i++) {
				oFilterItem = this._mAdvancedAreaFilter[sGroupName].items[i].filterItem;
				if (!oFilterItem.getVisible()) {
					continue;
				}
				if (!oFilterItem.getPartOfCurrentVariant() && !oFilterItem.getVisibleInFilterBar()) {
					nCount++;
				}
			}
		}
	
		return nCount;
	};
	
	/**
	 * handles the visibility of the passed oItem; adapt the more-link text;handles the visibility for the form-container
	 * 
	 * @private
	 * @param {object} oItem representing a filter
	 * @param {string} sGroupName name of the current group
	 */
	FilterBar.prototype._rerenderGroup = function(oItem, sGroupName) {
	
		var i;
		var oFilterItem;
	
		this._rerenderItem(oItem);
		this._adaptLinkText(sGroupName);
	
		if (oItem.formelement) {
	
			if (this._mAdvancedAreaFilter[sGroupName] && this._mAdvancedAreaFilter[sGroupName].items && this._mAdvancedAreaFilter[sGroupName].formcontainer) {
				for (i = 0; i < this._mAdvancedAreaFilter[sGroupName].items.length; i++) {
	
					oFilterItem = this._mAdvancedAreaFilter[sGroupName].items[i].filterItem;
					if (oFilterItem && oFilterItem.getVisible()) {
						this._mAdvancedAreaFilter[sGroupName].formcontainer.setVisible(true);
						return;
					}
				}
	
				this._mAdvancedAreaFilter[sGroupName].formcontainer.setVisible(false);
			}
		}
	};
	
	/**
	 * set for a group the link text containing the info about not yet assigned filters to the current group
	 * 
	 * @private
	 * @param {string} sGroupName name of the group
	 * @param {sap.m.Link } oLink control
	 * @param {number } nNotAssignedFilterCount count of not yet assigned filters
	 */
	FilterBar.prototype._setLinkTextAndCount = function(sGroupName, oLink, nNotAssignedFilterCount) {

		var sText;
	
		if (nNotAssignedFilterCount) {
			sText = this._oRb.getText("FILTER_BAR_SHOW_MORE_FILTERS", [
				nNotAssignedFilterCount
			]);
		} else {
			sText = this._oRb.getText("FILTER_BAR_SHOW_CHANGE_FILTERS");
		}
	
		oLink.setText(sText);
	};
	
	/**
	 * set for a group the link text containing the info about not yet assigned filters to the current group
	 * 
	 * @private
	 * @param {string} sGroupName name of the group
	 * @param {sap.m.Link } oLink control
	 */
	FilterBar.prototype._setLinkText = function(sGroupName, oLink) {

	
		var nNotAssignedFilterCount = this._determineNotAssignedFiltersCount(sGroupName);
	
		this._setLinkTextAndCount(sGroupName, oLink, nNotAssignedFilterCount);
	};
	
	/**
	 * create a link control for the current group. The link will open the 'Add/Remove Filters' dialog
	 * 
	 * @private
	 * @param {string} sGroupName name of the group
	 * @returns {sap.m.Link} link control
	 */
	FilterBar.prototype._createLink = function(sGroupName) {
	
		var that = this;
		var oLink = new Link();
		this._setLinkText(sGroupName, oLink);
	
		oLink.attachPress(function() {
			that._createAddRemoveFiltersDialog(sGroupName, oLink);
		});
	
		return oLink;
	};
	
	/**
	 * check if running under phone
	 * 
	 * @private
	 * @returns {boolean} true if phone, false other wise
	 */
	FilterBar.prototype._isPhone = function() {
	
		return (Device.system.phone) ? true : false;
	};
	
	/**
	 * check if running under tablet
	 * 
	 * @private
	 * @returns {boolean} true if phone, false other wise
	 */
	FilterBar.prototype._isTablet = function() {
	
		return (Device.system.tablet) ? true : false;
	};
	
	/**
	 * create the form containing all visible filters belonging to the current variant
	 * 
	 * @private
	 * @returns {sap.m.Form} form with all filters
	 */
	FilterBar.prototype._createFilters = function() {
	
		var that = this;
		var n = null, i;
		var sGroupName;
		var oFormContainer, oFormElement, aFormElements, oItem;
		var oTitle, oLink, oLabel;
		var oCheckBox = null;
		var bHasValue;
		var oAddToFilterBarLabel = null;
		var bFirstGroup = true;
		var nInvisibleCount;
	
		var oAdvancedLayout = new ResponsiveGridLayout();
		oAdvancedLayout.setColumnsL(1);
		oAdvancedLayout.setColumnsM(1);
	
		var oForm = new Form({
			editable: true,
			layout: oAdvancedLayout
		});
	
		oForm.addStyleClass("sapUiCompFilterBarDialogForm");
	
		if (this._oVariantManagement) {
			var idx = this._oToolbar.indexOfContent(this._oVariantManagement);
			if (idx >= 0) {
				var oClonedVM = this._oVariantManagement.clone();
				oClonedVM._setSelectionByKey(this._oVariantManagement.getSelectionKey());
				this._oToolbar.removeContent(this._oVariantManagement);
				this._oToolbar.insertContent(oClonedVM, idx);
	
				this._oVariant.key = this._oVariantManagement.getSelectionKey();
				this._oVariant.modified = this._oVariantManagement.currentVariantGetModified();
	
				oFormContainer = new FormContainer();
	
				this._oVariantManagement.setLayoutData(new GridData({
					span: "L10 M10 S12"
				}));
				oFormElement = new FormElement({
					fields: this._oVariantManagement
				});
	
				oFormContainer.addFormElement(oFormElement);
	
				if (!this._isPhone()) { // label 'Add To Filterbar'
	
					oAddToFilterBarLabel = new Label({
					// text: this._oRb.getText("FILTER_BAR_SHOW_IN_FILTERBAR")
					});
					// the text is set via the dialogOpen method, to minimize the replace-effect
	
					oAddToFilterBarLabel.setLayoutData(new GridData({
						span: "L2 M2 S2"
					}));
					oAddToFilterBarLabel.addStyleClass("sapUiCompFilterBarAddFilterLabel");
					this._oAddToFilterBarLabel = oAddToFilterBarLabel;
	
					oFormElement = new FormElement({
						label: oAddToFilterBarLabel
					});
	
					oFormContainer.addFormElement(oFormElement);
				}
	
				oForm.addFormContainer(oFormContainer);
			}
	
			oForm.addStyleClass("sapUiCompFilterBarGroupTitle");
		}
	
		var aFilters = this._getFiltersWithValues();
		this._fRegisteredFilterChangeHandlers = function(oEvent) {
			that._mandatoryFilterChange(oEvent);
		};
		this.attachFilterChange(this._fRegisteredFilterChangeHandlers);
	
		this._oVariant.content = this.fetchVariant();
	
		for (n in this._mAdvancedAreaFilter) {
			if (n && this._mAdvancedAreaFilter[n].items) {
	
				oTitle = new Title();
	
				if (n === FilterBar.INTERNAL_GROUP) {
					this._oTitle = oTitle;
					sGroupName = this._oRb.getText("FILTER_BAR_BASIC_GROUP");
				} else {
					sGroupName = this._mAdvancedAreaFilter[n].filterItem.getGroupTitle();
				}
	
				oTitle.setText(sGroupName);
	
				oFormContainer = new FormContainer({
					title: oTitle
				});
	
				if (bFirstGroup && sGroupName === "" && oAddToFilterBarLabel) {
					oAddToFilterBarLabel.removeStyleClass("sapUiCompFilterBarAddFilterLabel");
					oAddToFilterBarLabel.addStyleClass("sapUiCompFilterBarAddFilterLabelNoGroup");
				}
	
				bFirstGroup = false;
				nInvisibleCount = 0;
	
				this._mAdvancedAreaFilter[n].formcontainer = oFormContainer;
	
				for (i = 0; i < this._mAdvancedAreaFilter[n].items.length; i++) {
					oItem = this._mAdvancedAreaFilter[n].items[i];
	
					if (oItem.control.getWidth) {
						oItem.width = oItem.control.getWidth();
	
						if (oItem.control.setWidth) {
							oItem.control.setWidth("100%");
						}
					}
	
					oLabel = oItem.filterItem.getLabelControl();
	
					if (this.getConsiderGroupTitle()) {
						oLabel.setText(oItem.filterItem.getLabel());
					}
	
					oCheckBox = new CheckBox({
						tooltip: this._oRb.getText("FILTER_BAR_SHOW_IN_FILTERBAR")
					});
					oCheckBox.setSelected(oItem.filterItem.getVisibleInFilterBar());
					if (oItem.filterItem.getMandatory()) {
						bHasValue = this._checkFilterForValue(aFilters, oItem.filterItem);
						if (!bHasValue && oItem.filterItem.getVisibleInFilterBar()) {
							oCheckBox.setEnabled(false);
						}
					}
					oCheckBox.attachSelect(jQuery.proxy(this._selectionChangedInFilterDialog, this, oCheckBox, oItem.filterItem));
	
					if (this._isPhone()) {
						oLabel.setLayoutData(new GridData({
							span: "L3 M3 S12"
						}));
						oItem.control.setLayoutData(new GridData({
							span: "L8 M8 S12"
						}));
	
						oCheckBox.setVisible(false);
	
					} else {
						oLabel.setLayoutData(new GridData({
							span: "L3 M3 S12"
						}));
						oItem.control.setLayoutData(new GridData({
							span: "L8 M8 S11"
						}));
						oCheckBox.setLayoutData(new GridData({
							span: "L1 M1 S1"
						}));
					}
	
					oFormElement = new FormElement({
						label: oLabel,
						fields: [
							oItem.control, oCheckBox
						]
					});
					oFormElement.setVisible(oItem.filterItem.getVisible() && (oItem.filterItem.getVisibleInFilterBar() || oItem.filterItem.getPartOfCurrentVariant()));
					if (!oItem.filterItem.getVisible()) {
						nInvisibleCount++;
					}
	
					oItem.formelement = oFormElement;
					oItem.checkbox = oCheckBox;
	
					oFormContainer.addFormElement(oFormElement);
				}
	
				aFormElements = oFormContainer.getFormElements();
				if (aFormElements && aFormElements.length > 0) {
	
					if (n !== FilterBar.INTERNAL_GROUP) {
						oLink = this._createLink(n);
						if (oLink) {
	
							if (this._isPhone()) {
								oLink.setLayoutData(new GridData({
									span: "L8 M8 S12"
								}));
							} else {
								oLink.setLayoutData(new GridData({
									span: "L8 M8 S12",
									indent: "L3 M3 S0"
								}));
							}
	
							oFormElement = new FormElement({
								fields: [
									oLink
								]
							});
	
							this._mAdvancedAreaFilter[n].link = oLink;
	
							oFormContainer.addFormElement(oFormElement);
						}
	
						if (nInvisibleCount === aFormElements.length) {
							oFormContainer.setVisible(false);
						}
					}
	
					oForm.addFormContainer(oFormContainer);
				}
			}
		}
	
		return oForm;
	
	};
	
	/**
	 * create the content of the basic area, either by replacing the controls with their clones, or removing the clones and moving the original controls
	 * back to it.
	 * 
	 * @private
	 * @param {boolean} bUseClone indicates if clones or 'original' controls should be placed inside the basic area
	 */
	FilterBar.prototype._recreateBasicAreaContainer = function(bUseClone) {
	
		var n = null, i;
		var oControl, oLabel;
		var oFilterGroupItem, oContainer;
	
		if (this._oVariantManagement) {
			var aContent = this._oToolbar.getContent();
			this._oToolbar.removeContent(aContent[0]);
			this._oToolbar.insertContent(this._oVariantManagement, 0);
		}
	
		this._oBasicAreaLayout.removeAllContent();
	
		for (n in this._mAdvancedAreaFilter) {
			if (n && this._mAdvancedAreaFilter[n].items) {
	
				for (i = 0; i < this._mAdvancedAreaFilter[n].items.length; i++) {
					oFilterGroupItem = this._mAdvancedAreaFilter[n].items[i].filterItem;
	
					if (bUseClone) {
						if (!oFilterGroupItem.getVisible() || !oFilterGroupItem.getVisibleInFilterBar()) {
							continue; // handle only visible filters
						}
						oControl = this._mAdvancedAreaFilter[n].items[i].control.clone();
						oLabel = oFilterGroupItem.getLabelControl().clone();
	
						if (this.getConsiderGroupTitle()) {
							// in advanced filters dialog the label should not contain group title
							oFilterGroupItem.getLabelControl().setText(oFilterGroupItem.getLabel());
						}
					} else {
						oControl = this._mAdvancedAreaFilter[n].items[i].control;
						oLabel = oFilterGroupItem.getLabelControl();
	
						if (this._mAdvancedAreaFilter[n].items[i].width) {
							oControl.setWidth(this._mAdvancedAreaFilter[n].items[i].width);
						}
					}
	
					oContainer = this._addControlToBasicAreaContainer(oFilterGroupItem, oControl, oLabel);
					if (oContainer) {
						oContainer.setVisible(oFilterGroupItem.getVisible() && oFilterGroupItem.getVisibleInFilterBar());
						this._mAdvancedAreaFilter[n].items[i].container = oContainer;
					}
				}
			}
		}
	};
	
	/**
	 * search was executed. Check afterwards if any filer is in error state. Close dialog only in case non of the filters is in error state
	 * 
	 * @private
	 * @param {sap.ui.layout.form.Form} oForm representing the filters
	 */
	FilterBar.prototype._searchRequested = function(oForm) {
	
		if (this.search()) {
			this._oFilterDialog.close();		
		}
	};
	
	/**
	 * closed the 'Advanced Filters' dialog and restores the filter bar
	 * 
	 * @private
	 * @param {sap.ui.layout.form.Form} oForm representing the filters
	 */
	FilterBar.prototype._closeDialogAndRestoreFilterBar = function(oForm) {

		this._sSearchCriteriaInFiltersDialog = null;
	
		this._oVariant = {};
	
		oForm.removeAllFormContainers();
	
		if (this._oActionSheet) {
			this._oActionSheet.destroy();
			this._oActionSheet = null;
		}
		
		this._recreateBasicAreaContainer();
	
		this._deleteProperties();
		this._adaptGroupsTitle();
	
		if (this._fRegisteredFilterChangeHandlers) {
	
			this.detachFilterChange(this._fRegisteredFilterChangeHandlers);
			this._fRegisteredFilterChangeHandlers = null;
		}
	
		this._updateToolbarText();
			
	};
	
	FilterBar.prototype._variantSave = function(oEvent) {
	
		var sKey;
		this._oVariant = {};
	
		this.fireBeforeVariantSave();
	
		if (this._oVariantManagement && this._oFilterDialog) {
			sKey = this._oVariantManagement.getSelectionKey();
			this._oVariant.key = sKey;
			this._oVariant.modified = false;
			this._oVariant.content = this._oVariantManagement.getVariantContent(this, sKey);
		}
	};
	
	FilterBar.prototype._afterVariantSave = function(oEvent) {
	
		this.fireAfterVariantSave();
	};
	
	FilterBar.prototype._variantSavePressed = function(oEvent) {
	
		if (this._oVariantManagement) {
	
			var sKey = this._oVariantManagement.getSelectionKey();
			var oCurrentItem = this._oVariantManagement.getItemByKey(this._oVariantManagement.getSelectionKey());
	
			if ((sKey === this._oVariantManagement.STANDARDVARIANTKEY) || (oCurrentItem && oCurrentItem.getReadOnly && oCurrentItem.getReadOnly())) {
				this._oVariantManagement._openSaveAsDialog();
			} else {
				this._oVariantManagement._variantSavePressed();
			}
		}
	};
	
	FilterBar.prototype._dialogOpened = function() {

	
		if (this._oTitle && this._oAddToFilterBarLabel) {
	
			var oTitleElement = this._getDOMElement(this._oTitle.getId());
			if (oTitleElement) {
	
				var oTitlePosition = oTitleElement.offset();
				var oLabelElement = this._getDOMElement(this._oAddToFilterBarLabel.getId());
				if (oLabelElement) {
					var oLabelPosition = oLabelElement.offset();
					if (oLabelPosition && oTitlePosition) {
						oLabelPosition.top = oTitlePosition.top + 8;
						oLabelElement.offset(oLabelPosition);
					}
				}
			}
		}
	
		if (this._oAddToFilterBarLabel) {
			this._oAddToFilterBarLabel.setText(this._oRb.getText("FILTER_BAR_SHOW_IN_FILTERBAR"));
		}
	};
	
	FilterBar.prototype._cancelFilterDialog = function() {
	
		if (this._oVariant && this._oVariant.key && this._oVariant.content) {
			this.applyVariant(this._oVariant.content);
	
			if (this._oVariantManagement) {
				this._oVariantManagement._setSelectionByKey(this._oVariant.key);
				this._oVariantManagement.currentVariantSetModified(this._oVariant.modified);
			}
		}
	};
	
	/**
	 * dialog displaying the 'Advanced Filters'
	 * 
	 * @private
	 */
	FilterBar.prototype._showFilterDialog = function() {
	
		var that = this;
	
		this._oFilterDialog = new Dialog({
			stretch: Device.system.phone
		});
		this._oFilterDialog.setParent(this);
	
		this._oFilterDialog.addStyleClass("sapUiPopupWithPadding");
	
		if (this.$().closest(".sapUiSizeCompact").length > 0) {
			this._oFilterDialog.addStyleClass("sapUiSizeCompact");
		}
	
		this._oFilterDialog.addStyleClass("sapUiCompFilterBarDialog");
		if (!this._isPhone()) {
			this._oFilterDialog.addStyleClass("sapUiCompFilterBarDialogNonPhone");
		}
	
		// oDialog.afterClose
		this._oFilterDialog.setTitle(this._oRb.getText("FILTER_BAR_ADV_FILTERS_DIALOG"));
	
		this._oFilterDialog.addStyleClass("sapMH4FontSize");
		this._oFilterDialog.addStyleClass("sapMH4Style");
	
		this._oFilterDialog.setVerticalScrolling(true);
	
		var oSubHeader = new Bar();
		var oSearchField = new SearchField();
		oSearchField.attachSearch(function(oEvent) {
			if (that._oFilterDialog) {
				that._triggerSearchInFilterDialog(oEvent);
			}
		});
	
		oSubHeader.addContentRight(oSearchField);
		this._oFilterDialog.setSubHeader(oSubHeader);
	
		var oForm = this._createFiltersAndAdaptBasicArea();
		if (!oForm) {
			jQuery.sap.log.error("Content for Advanced Filters Dialog could not be created");
			return;
		}
		this._oFilterDialog.addContent(oForm);
	
		this._oFilterDialog.attachAfterOpen(function() {
			that._dialogOpened();
		});

		this._oFilterDialog.attachBeforeClose(function() {			
			that._closeDialogAndRestoreFilterBar(oForm);			
		});		

		this._oFilterDialog.attachAfterClose(function() {			
			that._oFilterDialog.destroy();
			that._oFilterDialog = null;				
		});				
		
		this._oFilterDialog.setInitialFocus(oSearchField);
	
		this._addFilterDialogButtons(oForm);
	
		if (!this._isPhone()) {
			this._oFilterDialog.setContentWidth("42rem");
		}
	
		var nHeight = jQuery(document).height() / 16;
		this._oFilterDialog.setContentHeight((nHeight - 17) + "rem");
	
		this._oFilterDialog.open();
	};
	
	FilterBar.prototype._addFilterDialogButtons = function(oForm) {
	
		var that = this;
		var oModel, aButtons = [];
		var oVariantSaveButton, oClearButton, oRestoreButton, oSearchButton, oCancelButton;
		var oActionsButton;
	
		// search button
		oSearchButton = new Button({
			id: this.getId() + "-btnSearchOnFiltersDialog",
			text: this._oRb.getText("FILTER_BAR_GO"),
			press: function() {
				that._searchRequested(oForm);
			},
			type: ButtonType.Emphasized
		});
	
		// aButtons.push(oSearchButton.clone());
		this._oFilterDialog.addButton(oSearchButton);
	
		// variant save button
		if (this._oVariantManagement && this._oVariantManagement.getVisible() && this._oVariantManagement.oVariantSave) {
			oVariantSaveButton = new Button({
				id: this.getId() + "-btnVariantSaveOnFiltersDialog",
				text: this._oRb.getText("VARIANT_MANAGEMENT_SAVE"),
				enabled: this._oVariantManagement.oVariantSave.getEnabled(),
				press: function() {
					that._variantSavePressed();
				}
			});
	
			oModel = this._oVariantManagement.getModel("save_enablement");
	
			oVariantSaveButton.setModel(oModel);
			oVariantSaveButton.bindProperty("enabled", "/enabled");
	
			aButtons.push(oVariantSaveButton.clone());
			oVariantSaveButton.addStyleClass("sapUiHideOnPhone");
			this._oFilterDialog.addButton(oVariantSaveButton);
		}
	
		// clear button
		oClearButton = new Button({
			id: this.getId() + "-btnClearOnFiltersDialog",			
			text: this._oRb.getText("FILTER_BAR_CLEAR"),
			visible: this.getShowClearButton(),
			press: function() {
				that.clear();
			}
		});
	
		if (oClearButton.getVisible()) {
			aButtons.push(oClearButton.clone());
		}
		oClearButton.addStyleClass("sapUiHideOnPhone");
		this._oFilterDialog.addButton(oClearButton);
	
		// restore button
		if (oModel) {
			oRestoreButton = new Button({
				id: this.getId() + "-btnRestoreOnFiltersDialog",
				text: this._oRb.getText("FILTER_BAR_RESTORE"),
				visible: this.getShowRestoreButton(),
				enabled: this._oVariantManagement.oVariantSave.getEnabled(),
				press: function() {
					that.reset();
					that._oVariantManagement.currentVariantSetModified(false);
				}
			});
			oRestoreButton.setModel(oModel);
			oRestoreButton.bindProperty("enabled", "/enabled");
	
			if (oRestoreButton.getVisible()) {
				aButtons.push(oRestoreButton.clone());
			}
			oRestoreButton.addStyleClass("sapUiHideOnPhone");
			this._oFilterDialog.addButton(oRestoreButton);
		}
	
		// Cancel button
		oCancelButton = new Button({
			id: this.getId() + "-btnCancelOnFiltersDialog",			
			text: this._oRb.getText("FILTER_BAR_CANCEL"),
			press: function() {
				that._cancelFilterDialog();
				that._oFilterDialog.close();		
			}
		});
	
		// aButtons.push(oCancelButton.clone());
		// oCancelButton.addStyleClass("sapUiHideOnPhone");
		this._oFilterDialog.addButton(oCancelButton);
	
		if (aButtons.length > 0) {

			// Actions
			this._oActionSheet = new ActionSheet({
				showCancelButton: true,
				buttons: aButtons,
				placement: PlacementType.Top
			});
			oActionsButton = new Button({
				id: this.getId() + "-btnActionsOnFiltersDialog",
				// text: this._oRb.getText("FILTER_BAR_ACTIONS"),
				icon: "sap-icon://overflow",
				press: function() {
					that._oActionSheet.openBy(this);
				},
				tooltip: this._oRb.getText("FILTER_BAR_ACTIONS")
			});			
			oActionsButton.addStyleClass("sapUiVisibleOnlyOnPhone");
			
			this._oFilterDialog.addButton(oActionsButton);
		}
	
	};
	
	/**
	 * creates the buttons for the basic area
	 * 
	 * @private
	 * @returns {sap.ui.layout.HorizontalLayout} buttons are placed in this layout
	 */
	FilterBar.prototype._createButtons = function() {
	
		var that = this;
	
		var oButtonsLayout = new HorizontalLayout();
	
		this._oHideShowButton = new Button({
			id: this.getId() + "-btnHideShowFilterBar",
			text: this._oRb.getText("FILTER_BAR_HIDE"),
			type: ButtonType.Transparent
		});
		this._oHideShowButton.addStyleClass("sapUiCompFilterBarPaddingRightBtn");
		this._oHideShowButton.attachPress(function() {
			that._toggleHideShow();
		});
		oButtonsLayout.addContent(this._oHideShowButton);
	
		// clear button
		this._oClearButtonOnFB = new Button({
			id: this.getId() + "-btnClearOnFilterBar",
			visible: this.getShowClearOnFB(),
			text: this._oRb.getText("FILTER_BAR_CLEAR"),
			type: ButtonType.Transparent
		});
		this._oClearButtonOnFB.attachPress(function() {
			that.clear();
		});
		oButtonsLayout.addContent(this._oClearButtonOnFB);
	
		// Reset
		if (this._oVariantManagement) {
			this._oRestoreButtonOnFB = new Button({
				id: this.getId() + "-btnRestoreOnFilterBar",
				visible: this.getShowRestoreOnFB(),
				text: this._oRb.getText("FILTER_BAR_RESTORE"),
				type: ButtonType.Transparent
			});
			this._oRestoreButtonOnFB.attachPress(function() {
				that.reset();
			});
			oButtonsLayout.addContent(this._oRestoreButtonOnFB);
		}
	
		this._oFiltersButton = new Button({
			id: this.getId() + "-btnFiltersOnFilterBar",
			text: this._oRb.getText("FILTER_BAR_ACTIVE_FILTERS_ZERO"),
			type: ButtonType.Transparent
		});
		this._oFiltersButton.addStyleClass("sapUiCompFilterBarPaddingRightBtn");
	
		this._oFiltersButton.attachPress(function() {
			that._showFilterDialog();
		});
		oButtonsLayout.addContent(this._oFiltersButton);
	
		this._oSearchButton = new Button({
			id: this.getId() + "-btnSearchOnFilterBar",
			visible: this.getShowGoOnFB(),
			text: this._oRb.getText("FILTER_BAR_GO"),
			type: ButtonType.Emphasized
		});
		this._oSearchButton.attachPress(function() {
			that.search();
		});
	
		this._oSearchButton.addStyleClass("sapUiCompFilterBarMargingRight");
		oButtonsLayout.addContent(this._oSearchButton);
	
		this._oButtonsLayout = oButtonsLayout;
	
		return oButtonsLayout;
	};
	
	/**
	 * creates the layout for the buttons
	 * 
	 * @private
	 * @returns {sap.ui.layout.VerticalLayout} layout for the buttons
	 */
	FilterBar.prototype._createButtonsLayout = function() {
	
		var oVLayout = new HorizontalLayout();
		var oButtons = this._createButtons();
		oVLayout.addContent(oButtons);
	
		oVLayout.addStyleClass("sapUiCompFilterBarButtonGroup");
	
		return oVLayout;
	};
	
	/**
	 * creates the variant management
	 * 
	 * @private
	 * @returns {sap.ui.comp.variants.VariantManagement} the VM control
	 */
	FilterBar.prototype._createVariantLayout = function() {
	
		this._oVariantManagement = this._createVariantManagement();
		this._oVariantManagement.setVisible(false);
	
		this._fSaveVariant = jQuery.proxy(this._variantSave, this);
		this._oVariantManagement.attachSave(this._fSaveVariant);
	
		this._fAfterSaveVariant = jQuery.proxy(this._afterVariantSave, this);
		this._oVariantManagement.attachAfterSave(this._fAfterSaveVariant);
	
		return this._oVariantManagement;
	};
	
	/**
	 * creates the layout for the basic area
	 * 
	 * @private
	 * @returns {sap.m.Toolbar} the toolbar
	 */
	FilterBar.prototype._createToolbar = function() {

	
		var oToolbar = new Toolbar();
	
		var oVariantLayout = this._createVariantLayout();
		oToolbar.addContent(oVariantLayout);
	
		oToolbar.addContent(this._oText);
	
		oToolbar.addContent(new ToolbarSpacer());
	
		this._oButtonLayout = this._createButtonsLayout();
		oToolbar.addContent(this._oButtonLayout);
	
		oToolbar.addStyleClass("sapUiCompFilterBarToolbar");
		oToolbar.addStyleClass("sapUiCompFilterBarToolbarMarker");
		return oToolbar;
	};
	
	/**
	 * creates the layout for the basic area
	 * 
	 * @private
	 * @returns {sap.ui.layout.HorizontalLayout} the layout for the selected fields
	 */
	FilterBar.prototype._createBasicAreaLayout = function() {

	
		// form for selection parameters
		var oBasicAreaLayout = new HorizontalLayout();
		oBasicAreaLayout.setAllowWrapping(true);
	
		oBasicAreaLayout.addStyleClass("sapUiCompFilterBarWidth100");
		oBasicAreaLayout.addStyleClass("sapUiCompFilterBarBasicArea");
		return oBasicAreaLayout;
	};
	
	/**
	 * creates the form for the advanced area, where all the filters will be placed
	 * 
	 * @private
	 * @returns {sap.ui.layout.form.Form} the form for the filter fields
	 */
	FilterBar.prototype._createAdvancedAreaForm = function() {

		var oAdvancedLayout = new ResponsiveGridLayout();
	
		oAdvancedLayout.addStyleClass("sapUiCompFilterBarPaddingForm");
	
		oAdvancedLayout.setColumnsL(3);
		oAdvancedLayout.setColumnsM(2);
		var oForm = new Form({
			editable: true
		});
		oForm.setLayout(oAdvancedLayout);
	
		return oForm;
	};
	
	/**
	 * add a selection field to a FormContainer and the FormContainer to the basic area form
	 * 
	 * @private
	 * @param {sap.ui.comp.filterbar.FilterBar} oFilterItem filter
	 * @returns {sap.ui.layout.VerticalLayout} the container
	 */
	FilterBar.prototype._addControlToBasicAreaFormContainer = function(oFilterItem) {
	
		var oControl = oFilterItem.getControl();
		if (!oControl) {
			jQuery.sap.log.error("no Control obtained");
			return null;
		}
	
		var oLabel = oFilterItem.getLabelControl();
		if (!oLabel) {
			jQuery.sap.log.error("no Label obtained");
			return null;
		}
	
		if (!this.getAdvancedMode()) {
			this._adaptGroupTitleForFilter(oFilterItem);
		} else {
			this._oAdvancedPanel.setExpandable(true);
			var sAdvancedSearchText = this._oRb.getText("ADVANCED_SEARCH_TEXT");
			this._oAdvancedPanel.setHeaderText(sAdvancedSearchText);
	
			this.oAdvancedSearchArea.setVisible(false);
			if (this._oSearchButtonAdvanced) {
				
				this._oSearchButtonAdvanced.removeStyleClass("sapUiCompFilterBarFloatRight");
				this._oBasicAreaLayout.insertContent(this._oSearchButtonAdvanced, 0);	
				this._oSearchButtonAdvanced.setVisible(true);
			}
	
		}
	
		return this._addControlToBasicAreaContainer(oFilterItem, oControl, oLabel);
	};
	
	/**
	 * add a selection field to a FormContainer and the FormContainer to the basic area form
	 * 
	 * @private
	 * @param {sap.ui.comp.filterbar.FilterBar} oFilterItem the filter item
	 * @param {sap.ui.core.Control} oControl the filter control
	 * @param {sap.m.Label} oLabel the label of the filter
	 * @returns {sap.ui.layout.VerticalLayout} the container
	 */
	FilterBar.prototype._addControlToBasicAreaContainer = function(oFilterItem, oControl, oLabel) {
	
		var oVLayout = new VerticalLayout();
		oVLayout.setLayoutData(new ResponsiveFlowLayoutData({
			margin: true
		}));
	
		// if no width is set, use default width
		if (oControl.getWidth) {
			// if ((oControl.getWidth() === "100%") || (oControl.getWidth() === "")) {
			oVLayout.setWidth("12rem");
			// }
		}
	
		if (!this.getAdvancedMode()) {
			if (oLabel) {
				oVLayout.addContent(oLabel);
				oLabel.setLabelFor(oControl);
			}
		}
	
		oVLayout.addContent(oControl);
	
		oVLayout.addStyleClass("sapUiCompFilterBarPaddingRight");
	
		if (this.getAdvancedMode()) {
			var aContent = this._oBasicAreaLayout.getContent();
			if (aContent.length > 0) {
				this._oBasicAreaLayout.insertContent(oVLayout, aContent.length - 1);
			} else {
				this._oBasicAreaLayout.addContent(oVLayout);
			}
		} else {
			oVLayout.addStyleClass("sapUiCompFilterBarPaddingTop");
			this._oBasicAreaLayout.addContent(oVLayout);
		}
	
		return oVLayout;
	};
	
	/**
	 * converts the map containing the advanced area filters to an array for simpler handling; only visible filter items are considered
	 * 
	 * @private
	 * @returns {array} oControl the visible filter fields
	 */
	FilterBar.prototype._flattenMap = function() {

		var n = null, i;
		var aControls = [];
		var bGroupIsAdded;
	
		if (this._mAdvancedAreaFilter) {
	
			for (n in this._mAdvancedAreaFilter) {
	
				if (n && this._mAdvancedAreaFilter[n].items) {
	
					bGroupIsAdded = false;
					for (i = 0; i < this._mAdvancedAreaFilter[n].items.length; i++) {
						var oItem = this._mAdvancedAreaFilter[n].items[i];
	
						if (oItem.filterItem && oItem.filterItem.getVisibleInFilterBar() && oItem.filterItem.getVisible()) {
	
							if (!bGroupIsAdded) {
								bGroupIsAdded = true;
	
								aControls.push({
									control: null,
									filterItem: this._mAdvancedAreaFilter[n].filterItem
								});
							}
	
							aControls.push({
								control: oItem.control,
								filterItem: oItem.filterItem
							});
						}
					}
				}
			}
		}
	
		return aControls;
	};
	
	/**
	 * re-render the advanced area
	 * 
	 * @private
	 */
	FilterBar.prototype._rerenderAA = function() {
	
		this._oAdvancedAreaForm.removeAllFormContainers();
	
		var aControls = this._flattenMap();
	
		if (aControls.length > 0) {
			this._oAdvancedPanel.setVisible(true);
	// if (this.getAdvancedMode()) {
	// this._oAdvancedPanel.setExpanded(this.getExpandAdvancedArea());
	// }
		} else {
			this._oAdvancedPanel.setVisible(false);
		}
	
		this._layOutAA(aControls);
	};
	
	/**
	 * react to search field selection. Hide all non matching list entries
	 * 
	 * @private
	 * @param {string} sValue the search string
	 */
	FilterBar.prototype._triggerSearchByValue = function(sValue) {
	
		var i, sText, sTooltip;
		var aCells;
		var bIsVisible;
	
		sValue = sValue.replace(/^\s+|\s+$/g, "").toLowerCase();
	
		if (this._aListItems) {
	
			var iSelectedItems = 0;
			for (i = this._aListItems.length - 1; i >= 0; i--) {
	
				aCells = this._aListItems[i].getContent();
				if (aCells.length === 2) {
					sText = aCells[1].getText();
					sTooltip = this._aListItems[i].data("quickinfo");
					// we want to show an item if it's either an item matching the search or if it's a group item with at least one item selected.
					if ((sText.toLowerCase().indexOf(sValue) >= 0 || (sTooltip && sTooltip.toLowerCase().indexOf(sValue) >= 0)) || (this._aListItems[i].hasStyleClass("sapUiCompFilterBarGroupListItem") && iSelectedItems > 0)) {
	
						bIsVisible = true;
						if (this._aListItems[i].hasStyleClass("sapUiCompFilterBarGroupListItem")) {
	
							if (!iSelectedItems) {
								bIsVisible = false; // matching text for group, but not hits in items
							}
	
						} else {
							iSelectedItems++; // a matching non-group item
						}
						this._aListItems[i].setVisible(bIsVisible);
					} else {
						this._aListItems[i].setVisible(false); // no hit
					}
				}
			}
		}
	};
	
	/**
	 * react to search field selection. Hide all non matching list entries
	 * 
	 * @private
	 * @param {object} oEvent containing the search string
	 */
	FilterBar.prototype._triggerSearch = function(oEvent) {

	
		if (!oEvent) {
			return;
		}
	
		var parameters = oEvent.getParameters();
		if (!parameters) {
			return;
		}
	
		var sValue = parameters.query ? parameters.query : "";
	
		this._triggerSearchByValue(sValue);
	};
	
	/**
	 * react to search field selection. Hide all non matching list entries
	 * 
	 * @private
	 * @param {string} sValue the search string
	 */
	FilterBar.prototype._triggerSearchByValueInFilterDialog = function(sValue) {
	
		var n = null, i;
		var sText, sTooltip;
		var oGroupElement, oFilterItem;
		var nCountInvisibleElements;
		var nCountNonPartOfCurrentVariant;
	
		sValue = sValue.replace(/^\s+|\s+$/g, "").toLowerCase();
	
		if (this._mAdvancedAreaFilter) {
			for (n in this._mAdvancedAreaFilter) {
				if (n) {
					oGroupElement = this._mAdvancedAreaFilter[n];
					if (oGroupElement && oGroupElement.items) {
	
						nCountInvisibleElements = 0;
						nCountNonPartOfCurrentVariant = 0;
	
						for (i = 0; i < oGroupElement.items.length; i++) {
							if (oGroupElement.items[i] && oGroupElement.items[i].filterItem && oGroupElement.items[i].formelement) {
	
								oFilterItem = oGroupElement.items[i].filterItem;
	
								if (oFilterItem.getVisible()) {
	
									if (sValue) {
	
										// if (oFilterItem.getPartOfCurrentVariant()) {
										sText = oFilterItem.getLabel();
										sTooltip = oFilterItem.getLabelTooltip();
	
										if ((sText.toLowerCase().indexOf(sValue) >= 0 || (sTooltip && sTooltip.toLowerCase().indexOf(sValue) >= 0))) {
											if (oFilterItem.getPartOfCurrentVariant()) {
												oGroupElement.items[i].formelement.setVisible(true);
											} else {
												++nCountNonPartOfCurrentVariant;
											}
										} else {
											++nCountInvisibleElements;
											oGroupElement.items[i].formelement.setVisible(false);
										}
	
									} else {
										// reset to a state without considering search
										oGroupElement.items[i].formelement.setVisible(oFilterItem.getVisibleInFilterBar() || oFilterItem.getPartOfCurrentVariant());
										if (oGroupElement.link && !oGroupElement.link.getVisible()) {
											oGroupElement.link.setVisible(true);
										}
									}
								} else {
									++nCountInvisibleElements;
								}
							}
						}
	
						if (oGroupElement && oGroupElement.formcontainer) {
							if (nCountInvisibleElements === oGroupElement.items.length) {
								oGroupElement.formcontainer.setVisible(false);
							} else {
								oGroupElement.formcontainer.setVisible(true);

								if (oGroupElement.link) {
									oGroupElement.link.setVisible((sValue && (nCountNonPartOfCurrentVariant === 0)) ? false : true);

									if (sValue && (nCountNonPartOfCurrentVariant > 0)) {
										this._setLinkTextAndCount(n, oGroupElement.link, nCountNonPartOfCurrentVariant);
									} else {
										this._setLinkText(n, oGroupElement.link);
									}
								}
							}
						}
					}
				}
			}
		}
	};
	
	/**
	 * react to search field selection. Hide all non matching list entries
	 * 
	 * @private
	 * @param {object} oEvent containing the search string
	 */
	FilterBar.prototype._triggerSearchInFilterDialog = function(oEvent) {
	
		if (!oEvent) {
			return;
		}
	
		var parameters = oEvent.getParameters();
		if (!parameters) {
			return;
		}
	
		var sValue = parameters.query ? parameters.query : "";
	
		this._sSearchCriteriaInFiltersDialog = sValue;
	
		this._triggerSearchByValueInFilterDialog(sValue);
	};
	
	/**
	 * generate a grouped list of all potential advanced area filters for the personalization dialog
	 * 
	 * @private
	 * @param {string} sGroupName filter group name
	 * @returns {array} the list of advanced area filter fields
	 */
	FilterBar.prototype._generateListItems = function(sGroupName) {
	
		var i;
		var oGroupListItem;
		var oListItem, aAdvacedElements;
		var aListItems = [];
		var oLabel, oCheckBox;
		var bCompactMode = false;
	
		if (this.$().closest(".sapUiSizeCompact").length > 0) {
			bCompactMode = true;
		}
	
		if (sGroupName && this._mAdvancedAreaFilter) {
	
			aAdvacedElements = this._mAdvancedAreaFilter[sGroupName];
	
			if (aAdvacedElements && aAdvacedElements.items) {
	
				oGroupListItem = new CustomListItem();
				oGroupListItem.addStyleClass("sapUiCompFilterBarGroupListItem");
	
				oLabel = new Label({
					text: aAdvacedElements.filterItem.getGroupTitle()
				});
	
				oGroupListItem.addContent(oLabel);
	
				for (i = 0; i < aAdvacedElements.items.length; i++) {
					var oItem = aAdvacedElements.items[i];
	
					if (oItem && oItem.filterItem) {
	
						if (!oItem.filterItem.getVisible()) {
							continue;
						}
	
						if (oGroupListItem) {
							aListItems.push(oGroupListItem); // show only group labels containing elements
							oGroupListItem = null;
						}
	
						oListItem = new CustomListItem(/* {type: sap.m.ListType.Navigation} */); // uncomment, one day, to achieve navigation to
						// see
	
						oListItem.setVisible(true);
	
						// details
						if (!bCompactMode) {
							oListItem.addStyleClass("sapUiCompFilterBarListItem");
						} else {
							oListItem.addStyleClass("sapUiCompFilterBarListItemCompact");
						}
						oListItem.data("quickinfo", oItem.filterItem.getLabelTooltip());
	
						oCheckBox = new CheckBox();
						oCheckBox.setSelected(oItem.filterItem.getPartOfCurrentVariant());
						if (((oItem.filterItem.getMandatory() && oItem.checkbox && !oItem.checkbox.getEnabled()) || oItem.filterItem.getVisibleInFilterBar())) {
							oCheckBox.setEnabled(false);
						}
	
						oItem.initialPartOfCurrentVariant = oItem.filterItem.getPartOfCurrentVariant();
	
						oCheckBox.attachSelect(jQuery.proxy(this._selectionChangedInAddFiltersDialog, this, oCheckBox, oItem));
	
						oListItem.addContent(oCheckBox);
	
						oLabel = new Label({
							text: oItem.filterItem.getLabel(),
							tooltip: oItem.filterItem.getLabelTooltip()
						});
						oListItem.addContent(oLabel);
						aListItems.push(oListItem);
					}
				}
			}
		}
	
		return aListItems;
	};
	
	/**
	 * adapt the visibility of the filter containers according to its property settings
	 * 
	 * @private
	 * @param {object} oItem representing the filter item
	 */
	FilterBar.prototype._rerenderItem = function(oItem) {
	
		if (oItem) {
			if (oItem.container) {
				oItem.container.setVisible(oItem.filterItem.getVisible() && oItem.filterItem.getVisibleInFilterBar());
			}
	
			if (oItem.formelement) {
				oItem.formelement.setVisible(oItem.filterItem.getVisible() && (oItem.filterItem.getVisibleInFilterBar() || oItem.filterItem.getPartOfCurrentVariant()));
				if (oItem.checkbox) {
					oItem.checkbox.setSelected(oItem.filterItem.getVisibleInFilterBar());
				}
			}
		}
	};
	
	/**
	 * adapt the visibility for all filter containers according to their property settings
	 * 
	 * @private
	 */
	FilterBar.prototype._rerenderFilters = function() {
	
		var i;
		var n = null;
		var oItem = null;
	
		if (this._mAdvancedAreaFilter) {
			for (n in this._mAdvancedAreaFilter) {
				if (n && this._mAdvancedAreaFilter[n] && this._mAdvancedAreaFilter[n].items) {
					for (i = 0; i < this._mAdvancedAreaFilter[n].items.length; i++) {
						oItem = this._mAdvancedAreaFilter[n].items[i];
						this._rerenderItem(oItem);
					}
				}
			}
		}
	
		this._updateToolbarText();
	};
	
	/**
	 * adapt the visibility for all filter containers according to their property settings
	 * 
	 * @public
	 */
	FilterBar.prototype.rerenderFilters = function() {

	
		this._rerenderFilters();
	};
	
	/**
	 * clean-up and closes the add/remove filters dialog
	 * 
	 * @private
	 * @param {string} sGroupName name of the group for which the filters will be displayed
	 * @param {sap.m.Link} oLink control from filters dialog
	 */
	FilterBar.prototype._closeAddRemoveFiltersDialog = function(sGroupName, oLink) {
	
		if (sGroupName && oLink) {
			if (this._sSearchCriteriaInFiltersDialog && this._oFilterDialog) {
				this._triggerSearchByValueInFilterDialog(this._sSearchCriteriaInFiltersDialog);
			} else {
				this._setLinkText(sGroupName, oLink);
			}
		}
	
		this._oDialog.close();
		this._oDialog.destroy();
		this._oDialog = null;
	};
	
	/**
	 * restores the initial partOfCurrentVariant information
	 * 
	 * @private
	 * @param {string} sGroupName name of the group for which the filters will be displayed
	 */
	FilterBar.prototype._cancelAddRemoveFiltersDialog = function(sGroupName) {

		var i;
		var oItem;
	
		if (sGroupName && this._mAdvancedAreaFilter && this._mAdvancedAreaFilter[sGroupName] && this._mAdvancedAreaFilter[sGroupName].items) {
			for (i = 0; i < this._mAdvancedAreaFilter[sGroupName].items.length; i++) {
				oItem = this._mAdvancedAreaFilter[sGroupName].items[i];
				if (oItem.initialPartOfCurrentVariant !== undefined && oItem.filterItem) {
					if (oItem.filterItem.getPartOfCurrentVariant() !== oItem.initialPartOfCurrentVariant) {
						oItem.filterItem.setPartOfCurrentVariant(oItem.initialPartOfCurrentVariant);
	
						this._rerenderItem(oItem);
	
						this._notifyAboutChangedFilters(oItem.initialPartOfCurrentVariant, oItem.control);
					}
				}
			}
		}
	
		if (this._oVariantManagement && (this._oVariant.modified2 !== undefined)) {
			this._oVariantManagement.currentVariantSetModified(this._oVariant.modified2);
		}
	};
	
	/**
	 * creates the add/remove filter dialog
	 * 
	 * @private
	 * @param {string} sGroupName filter group name
	 * @param {sap.m.Link} oLink more/clear filters link
	 */
	FilterBar.prototype._createAddRemoveFiltersDialog = function(sGroupName, oLink) {

		var i;
		var that = this;
	
		if (!sGroupName) {
			return;
		}
	
		this._oDialog = new Dialog({
			stretch: Device.system.phone
		});
		this._oDialog.addStyleClass("sapUiPopupWithPadding");
		this._oDialog.addStyleClass("sapUiCompAddRemoveFilterDialog");
	
		if (this.$().closest(".sapUiSizeCompact").length > 0) {
			this._oDialog.addStyleClass("sapUiSizeCompact");
		}
	
		this._oDialog.setTitle(this._oRb.getText("SELECT_FILTER_FIELDS"));
	
		this._oDialog.addStyleClass("sapMH4FontSize");
		this._oDialog.addStyleClass("sapMH4Style");
	
		this._oDialog.setVerticalScrolling(true);
	
		var oSubHeader = new Bar();
		var oSearchField = new SearchField();
		this._oSearchField = oSearchField;
		oSearchField.attachSearch(function(oEvent) {
			that._triggerSearch(oEvent);
		});
	
		oSubHeader.addContentRight(oSearchField);
		this._oDialog.setSubHeader(oSubHeader);
	
		var oList = new List();
		oList.setShowSeparators(ListSeparators.None);
		this._oDialog.addContent(oList);
	
		this._aListItems = this._generateListItems(sGroupName);
	
		for (i = 0; i < this._aListItems.length; i++) {
			oList.addItem(this._aListItems[i]);
		}
	
		if (this._oVariant && this._oVariantManagement) {
			this._oVariant.modified2 = this._oVariantManagement.currentVariantGetModified();
		}
	
		// close button
		var oCloseButton = new Button({
			id: this.getId() + "-btnCloseAddRemoveFiltersDialog",
			text: this._oRb.getText("FILTER_BAR_OK")
		});
		oCloseButton.attachPress(function() {			
			that._closeAddRemoveFiltersDialog(sGroupName, oLink);
		});
		this._oDialog.addAggregation("buttons", oCloseButton);
	
		this._oDialog.setInitialFocus(this._oSearchField);
	
		this._oDialog.setContentHeight("23.25rem"); // 30.25 - 2*2.5rem - 2rem
	
		if (this._sSearchCriteriaInFiltersDialog) {
			this._triggerSearchByValue(this._sSearchCriteriaInFiltersDialog);
		}
	
		// Cancel button
		var oCancelButton = new Button({
			id: this.getId() + "-btnCancelAddRemoveFiltersDialog",			
			text: this._oRb.getText("FILTER_BAR_CANCEL"),
			press: function() {
				that._cancelAddRemoveFiltersDialog(sGroupName);
				that._closeAddRemoveFiltersDialog(sGroupName, oLink);
			}
		});
		this._oDialog.addAggregation("buttons", oCancelButton);
	
		this._oDialog.open();
	};
	
	/**
	 * selection of the checkbox in the 'Add/Remove Filter Fileds' dialog was changed
	 * 
	 * @private
	 * @param {sap.m.Checkbox} oCheckBox representing visible in filter bar
	 * @param {object} oItem internal object associated with this checkbox
	 */
	FilterBar.prototype._selectionChangedInAddFiltersDialog = function(oCheckBox, oItem) {

		var bVisible = oCheckBox.getSelected();
	
		if (!bVisible && ((oItem.filterItem.getMandatory() && !oItem.checkbox.getEnabled()) || oItem.filterItem.getVisibleInFilterBar())) {
			oCheckBox.setSelected(true);
			return; // only enabled entries (mandatory with values) can be removed from the filters dialog
		}
	
		oItem.filterItem.setPartOfCurrentVariant(bVisible);
	
		this._rerenderItem(oItem);
	
		this._notifyAboutChangedFilters(bVisible, oItem.control);
	};
	
	/**
	 * semaphore handling for variant change
	 * 
	 * @private
	 * @param {boolean} bFlag setting the semaphore state
	 */
	FilterBar.prototype._setConsiderFilterChanges = function(bFlag) {
	
		this._filterChangeSemaphore = bFlag;
	};
	
	/**
	 * semaphore handling for variant change
	 * 
	 * @private
	 * @returns {boolean} the semaphore state
	 */
	FilterBar.prototype._getConsiderFilterChanges = function() {

		return this._filterChangeSemaphore;
	};
	
	/**
	 * filter is either added/removed or changed its value
	 * 
	 * @private
	 * @param {object} oEvent general event object
	 * @param {boolean} bDoNotPropagate if set do not raise the filterChange event
	 */
	FilterBar.prototype.fireFilterChange = function(oEvent) {

		this._updateToolbarText();
	
		if (this._getConsiderFilterChanges() && this._oVariantManagement && this._oVariantManagement.getEnabled()) {
			this._oVariantManagement.currentVariantSetModified(true);
		}
	
		if (this._oFilterDialog && !(this._oFilterDialog.isOpen())) {
			return;
		}
	
		this.fireEvent("filterChange", oEvent);
	};
	
	/**
	 * prepare event object and fire event
	 * 
	 * @private
	 * @param {boolean} bVisible indicated whether an filter was added or removed
	 * @param {sap.ui.core.Control} oControl which was either added or removed
	 */
	FilterBar.prototype._notifyAboutChangedFilters = function(bVisible, oControl) {
	
		var oObj;
	
		if (bVisible) {
			oObj = {
				"added": oControl
			};
		} else {
			oObj = {
				"deleted": oControl
			};
		}
	
		this.fireFilterChange(oObj);
	
	};
	/**
	 * returns the list of all added/removed filter items
	 * 
	 * @private
	 * @returns {array} the list of all added/removed filter items. May be null.
	 */
	FilterBar.prototype.getAllAddedRemovedFilterItems = function() {
	
		return this._mChangedFilterItems;
	};
	
	/**
	 * the layout for all visible filters in the advanced area will be recreated
	 * 
	 * @private
	 * @param {array} aControls list of visible advanced area filter elements
	 */
	FilterBar.prototype._layOutAA = function(aControls) {

		if (this._mAdvancedAreaFilter && Object.keys(this._mAdvancedAreaFilter).length > 1) {
			this._layOutAAMultipleGroup(aControls);
		} else {
			this._layOutAASingleGroup(aControls);
		}
	};
	
	/**
	 * the layout for all visible filters in the advanced area will be recreated. Each Group will be rendered in a FormContainer.
	 * 
	 * @private
	 * @param {array} aControls list of visible advanced area filter elements
	 */
	FilterBar.prototype._layOutAAMultipleGroup = function(aControls) {

		var i, j, nGroups = 0;
		var oFormContainer = null;
	
		for (i = 0; i < aControls.length; i++) {
			if (aControls[i].control === null) {
				nGroups++;
			}
		}
	
		var oAdvancedLayout = this._oAdvancedAreaForm.getLayout();
		if (oAdvancedLayout) {
			if (nGroups >= 3) {
				oAdvancedLayout.setLabelSpanL(5);
				oAdvancedLayout.setLabelSpanM(5);
				oAdvancedLayout.setColumnsL(3);
				oAdvancedLayout.setColumnsM(2);
			} else if (nGroups === 2) {
				oAdvancedLayout.setLabelSpanL(4);
				oAdvancedLayout.setLabelSpanM(5);
				oAdvancedLayout.setColumnsL(2);
				oAdvancedLayout.setColumnsM(2);
			} else if (nGroups === 1) {
	
				// + dummy group
				oAdvancedLayout.setLabelSpanL(4);
				oAdvancedLayout.setLabelSpanM(5);
				oAdvancedLayout.setColumnsL(2);
				oAdvancedLayout.setColumnsM(2);
	
				// oAdvancedLayout.setLabelSpanL(6); //will consider M
				// oAdvancedLayout.setLabelSpanM(3);
				// oAdvancedLayout.setColumnsL(1);
				// oAdvancedLayout.setColumnsM(1);
			}
		}
	
		for (i = 0; i < aControls.length; i++) {
			if (aControls[i].control === null) {
				oFormContainer = new FormContainer();
	
				if (Object.keys(this._mAdvancedAreaFilter).length > 1) { // hide group when only one group is present
					oFormContainer.setTitle(aControls[i].filterItem.getGroupTitle());
				}
				this._oAdvancedAreaForm.addFormContainer(oFormContainer);
	
				j = i + 1;
				while (j < aControls.length && (aControls[j].control)) {
					this._addControlToAdvancedArea(aControls[j].filterItem, aControls[j].control, oFormContainer);
					j++;
				}
	
				i = j - 1;
			}
		}
	
		if (nGroups === 1) {
			this._oAdvancedAreaForm.addFormContainer(new FormContainer()); // dummy
		}
	};
	
	/**
	 * if only one group with multiple filter fields is available, it will be layouted in two columns. a dummy group will be created containing ~ half of
	 * the fields
	 * 
	 * @private
	 * @param {array} aControls list of visible advanced area filter elements. First element is a group
	 */
	FilterBar.prototype._layOutAASingleGroup = function(aControls) { // adapt to LMS
	
		var i, idx, nCount, bMod;
		var nFields = aControls.length - 1;
		var nNewGroups = nFields > 2 ? 2 : 1;
	
		// if (nFields >= 7) { //does not work, because we do not have a news-paper layout
		// nNewGroups = 3;
		// } else if (nFields >= 4) {
		// nNewGroups = 2;
		// }
	
		if (nNewGroups > 1) {
			nCount = Math.floor(nFields / nNewGroups);
			bMod = ((nCount * nNewGroups) < nFields);
	
			for (i = 1; i < nNewGroups; i++) {
				idx = i * nCount;
				if (bMod) {
					++idx;
				}
	
				if ((idx + i) < aControls.length) {
					aControls.splice(idx + i, 0, aControls[0]); // add dummy group
				}
			}
		}
	
		this._layOutAAMultipleGroup(aControls);
	};
	
	/**
	 * write the current filter selection to the persistency
	 * 
	 * @private
	 * @param {boolean} bConsiderInvisibleFilters indicates if invisible filters should be considered
	 * @returns {array} of variant specific filter info
	 */
	FilterBar.prototype._determineVariantFiltersInfo = function(bConsiderInvisibleFilters) {
	
		var i;
		var n = null, oItem;
	
		var aFilters = null;
	
		if (this._mAdvancedAreaFilter) {
	
			for (n in this._mAdvancedAreaFilter) {
	
				if (n) {
					if (this._mAdvancedAreaFilter[n].items) {
	
						for (i = 0; i < this._mAdvancedAreaFilter[n].items.length; i++) {
							oItem = this._mAdvancedAreaFilter[n].items[i];
	
							if (bConsiderInvisibleFilters || oItem.filterItem.getVisible()) {
								if (!aFilters) {
									aFilters = [];
								}
								aFilters.push({
									group: oItem.filterItem.getGroupName(),
									name: oItem.filterItem.getName(),
									partOfCurrentVariant: oItem.filterItem.getPartOfCurrentVariant(),
									visibleInFilterBar: oItem.filterItem.getVisibleInFilterBar()
								});
							}
						}
					}
				}
			}
		}
	
		return aFilters;
	};
	
	/**
	 * add a filter to the FormContainer
	 * 
	 * @private
	 * @param {sap.ui.comp.filterbar.FilterItem} oFilterItem the corresponding filter item
	 * @param {sap.ui.core.Control} oControl the control itself
	 * @param {sap.ui.layout.form.FormContainer} oFormContainer in which the control will be added
	 */
	FilterBar.prototype._addControlToAdvancedArea = function(oFilterItem, oControl, oFormContainer) {
	
		var oFormElement = new FormElement({
			label: oFilterItem.getLabelControl(),
			fields: [
				(oControl !== null) ? oControl : new Text()
			]
		});
	
		oFormContainer.addFormElement(oFormElement);
	};
	
	/**
	 * determines if an item is relevant for the query
	 * 
	 * @private
	 * @param {sap.ui.comp.filterbar.FilterItem} oFilterItem which is beeing checked
	 * @returns {boolean} true for relevanr, false for not relevat
	 */
	FilterBar.prototype._determineVisibility = function(oFilterItem) {

		var bVisible = false;
	
		if (oFilterItem) {
			bVisible = oFilterItem.getVisible() && (oFilterItem.getVisibleInFilterBar() || oFilterItem.getPartOfCurrentVariant());
		}
	
		return bVisible;
	};
	
	/**
	 * returns an array of all visible basic items
	 * 
	 * @private
	 * @returns {array} all visible basic items
	 */
	FilterBar.prototype._retrieveVisibleBasicItems = function() {
	
		var i, aBasicItems = [];
	
		if (this.getAdvancedMode()) {
			if (this._aBasicAreaSelection) {
				for (i = 0; i < this._aBasicAreaSelection.length; i++) {
					if (this._aBasicAreaSelection[i].filterItem) {
						// if (this._aBasicAreaSelection[i].filterItem.getVisible() && (this._aBasicAreaSelection[i].filterItem.getVisibleInFilterBar)) {
						if (this._determineVisibility(this._aBasicAreaSelection[i].filterItem)) {
							aBasicItems.push(this._aBasicAreaSelection[i]);
						}
					}
				}
			}
		}
	
		return aBasicItems;
	};
	
	/**
	 * returns an array of all visible advanced items
	 * 
	 * @private
	 * @returns {array} all visible advanced items
	 */
	FilterBar.prototype._retrieveVisibleAdvancedItems = function() {
	
		var i, n = null, oItem;
		var aAdvancedItems = [];
	
		if (this._mAdvancedAreaFilter) {
			for (n in this._mAdvancedAreaFilter) {
				if (n) {
					if (n === FilterBar.INTERNAL_GROUP) {
						if (this.getAdvancedMode()) {
							continue;
						}
					}
	
					if (this._mAdvancedAreaFilter[n] && this._mAdvancedAreaFilter[n].items) {
						for (i = 0; i < this._mAdvancedAreaFilter[n].items.length; i++) {
							oItem = this._mAdvancedAreaFilter[n].items[i];
							if (oItem) {
								// if (oItem.filterItem.getVisibleInFilterBar() || oItem.filterItem.getPartOfCurrentVariant()) {
								if (this._determineVisibility(oItem.filterItem)) {
									aAdvancedItems.push(oItem);
								}
							}
						}
					}
				}
			}
		}
	
		return aAdvancedItems;
	};
	
	/**
	 * retrieves all selection from the basic area and all filters from the advanced area. Only visible fields are considered
	 * 
	 * @private
	 * @returns {array} all visible controls from the basic and advanced area area
	 */
	FilterBar.prototype._retrieveCurrentSelectionSet = function() {
	
		var i;
		var aControls = [];
	
		var aBasicItems = this._retrieveVisibleBasicItems();
	
		var aAdvancedItems = this._retrieveVisibleAdvancedItems();
	
		var aItems = aBasicItems.concat(aAdvancedItems);
	
		for (i = 0; i < aItems.length; i++) {
			if (aItems[i].control) {
				aControls.push(aItems[i].control);
			}
		}
	
		return aControls;
	};
	
	/**
	 * event will be executed, once the SEARCH-button was fired. All controls from basic area and all visible advanced area controls will be passed as
	 * event-parameters
	 * 
	 * @private
	 * @returns {boolean} indicates the validation result. true means no validation errors.
	 */
	FilterBar.prototype.search = function() {
	
		var parameter = {};
		parameter.selectionSet = this._retrieveCurrentSelectionSet();
	
		this.fireSearch(parameter);
	
		return true;
	};
	
	/**
	 * event will be executed, once the CLEAR-button was fired
	 * 
	 * @private
	 */
	FilterBar.prototype.clear = function() {
	
		var parameter = {};
		parameter.selectionSet = this._retrieveCurrentSelectionSet();
	
		this._clearErrorState();
	
		this.fireClear(parameter);
	};
	
	/**
	 * obtains from the variant management the current selected entry ands applies the corresponding variant. In case nothing was selected variant
	 * management returns null -> no variant will be applied
	 * 
	 * @private
	 */
	FilterBar.prototype._setSelectedVariant = function() {
	
		var oVariant = null;
	
		if (this._oVariantManagement) { // in case a variant is currently selected, re-apply this variant
			var sKey = this._oVariantManagement.getSelectionKey();
			if (sKey) {
	
				oVariant = this._oVariantManagement.getVariantContent(this, sKey);
	
				if (oVariant) {
					this._applyVariant(oVariant);
				}
			}
		}
	};
	
	/**
	 * event will be executed, once the RESET-button was fired
	 * 
	 * @private
	 */
	FilterBar.prototype.reset = function() {
	
		var parameter = {};
		parameter.selectionSet = this._retrieveCurrentSelectionSet();
	
		this.fireReset(parameter);
	
		this._setSelectedVariant();
	};
	
	/**
	 * retrieve the data for a specific variant and rearrange the advance area
	 * 
	 * @private
	 * @param {object} oVariant the variant
	 */
	FilterBar.prototype._applyVariant = function(oVariant) {
	
		var aPersFields = null;
		var aFieldsAndValues;
		var bExecuteOnSelection = false;
	
		if (oVariant) {
	
			this._setConsiderFilterChanges(false);
	
			aFieldsAndValues = oVariant.filterBarVariant;
			aPersFields = oVariant.filterbar;
	
			this._applyVariantFields(aFieldsAndValues);
			this._reapplyVisibility(aPersFields);
	
			this._setConsiderFilterChanges(true);
	
			this._updateToolbarText();
	
			this.fireAfterVariantLoad();
	
			if (oVariant.executeOnSelection) {
				bExecuteOnSelection = oVariant.executeOnSelection;
			}
	
			if (bExecuteOnSelection) {
				this.search();
			} else {
				this._clearErrorState();
			}
		}
	};
	
	/**
	 * Triggers the registered fCallBack for fetching the current variant data.
	 * 
	 * @private
	 * @returns {Object} the datat blob will be stored for the current variant and passed back, via fRegisteredApplyData at a later point in time
	 */
	FilterBar.prototype._fetchVariantFiltersData = function() {
	
		if (this._fRegisteredFetchData) {
			try {
				return this._fRegisteredFetchData();
			} catch (ex) {
				jQuery.sap.log.error("callback for fetching data throws an exception");
			}
		} else {
			jQuery.sap.log.warning("no callback for fetch data supplied");
		}
	
		return null;
	};
	
	/**
	 * Triggers the registered fCallBack for applying the variant data
	 * 
	 * @private
	 * @param {Object} oJson the data blob as initialy returned by the fRegisteredFetchData callback
	 * @returns {object} data to be stored as part of the variant content
	 */
	FilterBar.prototype._applyVariantFields = function(oJson) {
	
		if (this._fRegisteredApplyData) {
			try {
				return this._fRegisteredApplyData(oJson);
			} catch (ex) {
				jQuery.sap.log.error("callback for applying data throws an exception");
			}
		} else {
			jQuery.sap.log.warning("no callback for appy data supplied");
		}
	};
	
	/**
	 * Will be called from the smart variant control, as a request to determine the content of
	 * 
	 * @param {boolean} bConsiderInvisibleFilters indicates if invisible filters should be considered
	 * @returns {object} json object
	 * @public
	 */
	FilterBar.prototype.fetchVariant = function(bConsiderInvisibleFilters) {
	
		var aFiltersInfo;
		var oVariant = {};
		aFiltersInfo = this._determineVariantFiltersInfo(bConsiderInvisibleFilters);
	
		oVariant.filterbar = (!aFiltersInfo) ? [] : aFiltersInfo;
		oVariant.filterBarVariant = this._fetchVariantFiltersData();
	
		return oVariant;
	};
	
	/**
	 * Will be called from the smart variant control, as a request to apply the variant
	 * 
	 * @param {string} oVariant json object
	 * @public
	 */
	FilterBar.prototype.applyVariant = function(oVariant) {
	
		this._applyVariant(oVariant);
	};
	
	/**
	 * retrieve the mandatory filters
	 * 
	 * @public
	 * @returns {array} of visible mandatory filters
	 */
	FilterBar.prototype.determineMandatoryFilterItems = function() {
	
		var i;
		var aMandatoryFilters = [];
		var aBasicItems = this._retrieveVisibleBasicItems();
		var aAdvancedItems = this._retrieveVisibleAdvancedItems();
	
		var aItems = aBasicItems.concat(aAdvancedItems);
	
		for (i = 0; i < aItems.length; i++) {
			if (aItems[i].filterItem.getMandatory() === true) {
				if (aItems[i].control) {
					aMandatoryFilters.push(aItems[i].filterItem);
				}
			}
		}
	
		return aMandatoryFilters;
	};
	
	/**
	 * retrieve the control based on the filteBarItem
	 * 
	 * @public
	 * @param {sap.ui.comp.filterbar.Filter.FilterItem} oFilterItem from the aggregations
	 * @returns {sap.ui.core.Control} the corresponding control. If no match is found null will returned.
	 */
	FilterBar.prototype.determineControlByFilterItem = function(oFilterItem) {
	
		var i, n = null;
		var oItem, oGroupElement;
	
		if (this._aBasicAreaSelection) {
			for (i = 0; i < this._aBasicAreaSelection.length; i++) {
				oItem = this._aBasicAreaSelection[i];
				if (oFilterItem === oItem.filterItem) {
					return oItem.control;
				}
			}
		}
	
		if (this._mAdvancedAreaFilter) {
			for (n in this._mAdvancedAreaFilter) {
				if (n) {
					oGroupElement = this._mAdvancedAreaFilter[n];
					if (oGroupElement && oGroupElement.items) {
						for (i = 0; i < oGroupElement.items.length; i++) {
							oItem = oGroupElement.items[i];
							if (oFilterItem === oItem.filterItem) {
								return oItem.control;
							}
						}
					}
				}
			}
		}
	
		return null;
	};
	
	/**
	 * retrieve the control based on the name and group name
	 * 
	 * @public
	 * @param {string} sName the control's name
	 * @param {string} sGroupName is null for basic area
	 * @returns {sap.ui.core.Control} the corresponding control. If no match is found null will returned. For filters in the advanced area the
	 *          visibleInAdvancedArea flag is considered
	 */
	FilterBar.prototype.determineControlByName = function(sName, sGroupName) {

		var oItem = this._determineItemByName(sName, sGroupName);
		if (oItem) {
			return oItem.control;
		}
	
		return null;
	};
	
	/**
	 * retrieve the item based on the name and (optional) group name
	 * 
	 * @private
	 * @param {string} sName the control's name
	 * @param {string} sGrpName sGroupName is null for basic area
	 * @returns {object} the corresponding internal item. If no match is found null will returned.
	 */
	FilterBar.prototype._determineItemByName = function(sName, sGrpName) {

	
		var i;
		var oItem, oGroupElement;
		var sGroupName = sGrpName;
	
		if (!sName) {
			return null;
		}
	
		if (!sGroupName) {
			sGroupName = FilterBar.INTERNAL_GROUP;
		}
	
		if (this._mAdvancedAreaFilter) {
			// check the filter
			oGroupElement = this._mAdvancedAreaFilter[sGroupName];
			if (oGroupElement && oGroupElement.items) {
				for (i = 0; i < oGroupElement.items.length; i++) {
					oItem = oGroupElement.items[i];
					if (oItem && oItem.filterItem && (oItem.filterItem.getName() === sName)) {
						return oItem;
					}
				}
			}
		}
	
		return null;
	};
	
	/**
	 * retrieve the filter item based on the name
	 * 
	 * @private
	 * @param {string} sName the control's name
	 * @returns {sap.ui.comp.filterbar.FilterItem} the corresponding filter item. If no match is found null will returned.
	 */
	FilterBar.prototype.determineFilterItemByName = function(sName) {

	
		var n, oItem;
	
		if (this._mAdvancedAreaFilter) {
			for (n in this._mAdvancedAreaFilter) {
				oItem = this._determineItemByName(sName, n);
				if (oItem) {
					return oItem.filterItem;
				}
			}
		}
	
		return null;
	};
	
	/**
	 * retrieve the item from local map
	 * 
	 * @private
	 * @param {sap.ui.comp.filterbar.FilterGroupItem} oFilterGroupItem group filter item
	 * @returns {object} the corresponding internal representation. If no match is found null will returned.
	 */
	FilterBar.prototype._determineByFilterGroupItem = function(oFilterGroupItem) {

	
		var n = null, i;
	
		if (this._mAdvancedAreaFilter) {
			for (n in this._mAdvancedAreaFilter) {
				if (n) {
					var oGroupElement = this._mAdvancedAreaFilter[n];
					if (oGroupElement && oGroupElement.items) {
						for (i = 0; i < oGroupElement.items.length; i++) {
							if (oGroupElement.items[i] && oGroupElement.items[i].filterItem === oFilterGroupItem) {
								return oGroupElement.items[i];
							}
						}
					}
				}
			}
		}
	
		return null;
	};
	
	/**
	 * retrieve the item from local map
	 * 
	 * @private
	 * @param {sap.ui.core.Control} oControl for a filter
	 * @returns {object} the corresponding internal representation. If no match is found null will returned.
	 */
	FilterBar.prototype._determineByControl = function(oControl) {

	
		var n = null, i;
	
		if (this._mAdvancedAreaFilter) {
			for (n in this._mAdvancedAreaFilter) {
				if (n) {
					var oGroupElement = this._mAdvancedAreaFilter[n];
					if (oGroupElement && oGroupElement.items) {
						for (i = 0; i < oGroupElement.items.length; i++) {
							if (oGroupElement.items[i] && oGroupElement.items[i].control === oControl) {
								return oGroupElement.items[i];
							}
						}
					}
				}
			}
		}
	
		return null;
	};
	
	/**
	 * delete the property combobox
	 * 
	 * @private
	 */
	FilterBar.prototype._deleteProperties = function() {

	
		var n = null, i;
	
		if (this._mAdvancedAreaFilter) {
			for (n in this._mAdvancedAreaFilter) {
				if (n) {
					var oGroupElement = this._mAdvancedAreaFilter[n];
					if (oGroupElement && oGroupElement.items) {
	
						if (oGroupElement.formcontainer) {
							delete oGroupElement.formcontainer;
						}
	
						if (oGroupElement.link) {
							delete oGroupElement.link;
						}
	
						for (i = 0; i < oGroupElement.items.length; i++) {
							if (oGroupElement.items[i] && oGroupElement.items[i].checkbox) {
								delete oGroupElement.items[i].checkbox;
							}
							if (oGroupElement.items[i] && oGroupElement.items[i].formelement) {
								delete oGroupElement.items[i].formelement;
							}
						}
					}
				}
			}
		}
	
	};
	
	/**
	 * determines the corresponding DOM element
	 * 
	 * @private
	 * @param {string} sId of an element
	 * @returns {Object} the DOM element
	 */
	FilterBar.prototype._getDOMElement = function(sId) {

	
		return jQuery('#' + sId);
	};
	
	/**
	 * handle the resizing of the basic search field in the value dialog scenario
	 * 
	 * @private
	 */
	FilterBar.prototype._fHandleResize = function() {

	
		var nBasicSearchWidth, nHLayoutWidth, nButtonWidth, nAvailableSpace;
		var nDelta = 16, nMinWidth, nMaxWidth;
		var oSearchElement, oControl;
	
		if (this.getAdvancedMode()) {
	
			if (this._aBasicAreaSelection && this._aBasicAreaSelection.length === 1) {
				if (this._aBasicAreaSelection[0] && this._aBasicAreaSelection[0].control) {
	
					nMinWidth = nDelta * 2; // min size
	
					if (this._nFirstElementWidth) {
						nMaxWidth = this._nFirstElementWidth;
					} else {
						nMaxWidth = nDelta * 28; // basic search default field size
					}
	
					oControl = this._aBasicAreaSelection[0].control;
					oSearchElement = this._getDOMElement(oControl.getId()); // jQuery('#' + oControl.getId());
	
					nBasicSearchWidth = oSearchElement.width();
					nButtonWidth = this._getDOMElement(this._oSearchButtonAdvanced.getId()).width(); // jQuery('#' +
					// this._oSearchButton.getId()).width();
					nHLayoutWidth = this._getDOMElement(this._oBasicAreaLayout.getId()).width(); // jQuery('#' +
					// this._oBasicAreaLayout.getId()).width();
	
					nAvailableSpace = nHLayoutWidth - nButtonWidth - 3 / 2 * nDelta;
	
					if ((nBasicSearchWidth + nButtonWidth + 3 / 2 * nDelta) > nHLayoutWidth) {
	
						if (nAvailableSpace < nMinWidth) {
							nAvailableSpace = nMinWidth;
						}
	
					} else {
						/* eslint-disable no-lonely-if */
	
						if (nAvailableSpace > nMaxWidth) {
							nAvailableSpace = nMaxWidth;
						}
	
						/* eslint-enable no-lonely-if */
					}
	
					oSearchElement.width(nAvailableSpace);
				}
			}
		}
	};
	
	/**
	 * handle the initial determination of the basic field length and the initial resizing of the basic search field by calling the _fHandleResize
	 * 
	 * @private
	 */
	FilterBar.prototype.onAfterRendering = function() {
	
		if (this.getAdvancedMode()) {
			if (!this._nFirstElementWidth) {
				if (this._aBasicAreaSelection && this._aBasicAreaSelection.length === 1) {
					if (this._aBasicAreaSelection[0] && this._aBasicAreaSelection[0].control) {
						this._nFirstElementWidth = this._getDOMElement(this._aBasicAreaSelection[0].control.getId()).width();
						this._fHandleResize();
					}
				}
			}
		} else {
			/* eslint-disable no-lonely-if */
			if (this._oFilterDialog && this._mAdvancedAreaFilter) {
				this._dialogOpened();
			}
			/* eslint-enable no-lonely-if */
		}
	};
	
	/**
	 * destroys the current control and all inner controls
	 * 
	 * @public
	 */
	FilterBar.prototype.destroy = function() {

		// unregister eventhandler for resizing
		jQuery(window).off("resize.basicsearch");
	
		if (this._oVariantManagement) {
	
			if (this._fInitialiseVariants) {
				this._oVariantManagement.detachInitialise(this._fInitialiseVariants);
				this._fInitialiseVariants = null;
			}
	
			if (this._fSaveVariant) {
				this._oVariantManagement.detachSave(this._fSaveVariant);
				this._fSaveVariant = null;
			}
	
			if (this._fAfterSaveVariant) {
				this._oVariantManagement.detachSave(this._fAfterSaveVariant);
				this._fAfterSaveVariant = null;
			}
		}
	
		Grid.prototype.destroy.apply(this, arguments);
	
		if (this._oDialog) {
			this._oDialog.destroy();
			this._oDialog = null;
		}
		
		if (this._oActionSheet) {
			this._oActionSheet.destroy();
			this._oActionSheet = null;
		}	
		
		if (this._oFilterDialog) {
			this._oFilterDialog.destroy();
			this._oFilterDialog = null;
		}
			
		this._aBasicAreaSelection = null;
		this._mAdvancedAreaFilter = null;
		this._oBasicAreaLayout = null;
		this._oAdvancedAreaForm = null;
		this._oAdvancedPanel = null;
		this._oVariantManagement = null;
	
		this._oVariant = null;
	
		this._fRegisteredFetchData = null;
		this._fRegisteredApplyData = null;
		this._fRegisterGetFiltersWithValues = null;
	
		this._fRegisteredFilterChangeHandlers = null;
	
		this._oSearchButton = null;
		this._oSearchButtonAdvanced = null;
		this._oFiltersButton = null;
		this._oHideShowButton = null;
		this._oClearButtonOnFB = null;
		this._oRestoreButtonOnFB = null;
	
		this._mChangedFilterItems = null;
	
		this._oAddToFilterBarLabel = null;
		this._oTitle = null;
	};
	

	return FilterBar;

}, /* bExport= */ true);
