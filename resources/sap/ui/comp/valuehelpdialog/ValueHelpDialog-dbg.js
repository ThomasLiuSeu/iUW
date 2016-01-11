/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.valuehelpdialog.ValueHelpDialog.
sap.ui.define(['jquery.sap.global', 'sap/m/Dialog', 'sap/m/MessageBox', 'sap/m/MultiInput', 'sap/m/Token', 'sap/ui/comp/library', './ItemsCollection', 'sap/ui/core/Control', 'sap/ui/core/format/DateFormat', 'sap/ui/core/format/NumberFormat', 'sap/ui/table/Table'],
	function(jQuery, Dialog, MessageBox, MultiInput, Token, library, ItemsCollection, Control, DateFormat, NumberFormat, Table) {
	"use strict";


	
	/**
	 * Constructor for a new valuehelpdialog/ValueHelpDialog.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The ValueHelpDialog Control can be used to implement an F4 value help for a multi-input field.
	 * @extends sap.m.Dialog
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.valuehelpdialog.ValueHelpDialog
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ValueHelpDialog = Dialog.extend("sap.ui.comp.valuehelpdialog.ValueHelpDialog", /** @lends sap.ui.comp.valuehelpdialog.ValueHelpDialog.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		properties : {
	
			/**
			 * This property defines the value for the basic search field.
			 * @since 1.24
			 */
			basicSearchText : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * This property enables multi-selection in a table.
			 * @since 1.24
			 */
			supportMultiselect : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * This property enables the Ranges button on the dialog.
			 * @since 1.24
			 */
			supportRanges : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * This property defines the column/key name used for the token text.
			 * @since 1.24
			 */
			descriptionKey : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * This is the key property of the OData service for handling in the table and tokens
			 * @since 1.24
			 */
			key : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * When this property is set to true, the value help dialog only shows range tokens.
			 * @since 1.24
			 */
			supportRangesOnly : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * defines the max number of include ranges.
			 * @since 1.24
			 */
			maxIncludeRanges : {type : "string", group : "Misc", defaultValue : '-1'},
	
			/**
			 * defines the max number of exclude ranges
			 * @since 1.24
			 */
			maxExcludeRanges : {type : "string", group : "Misc", defaultValue : '-1'},
	
			/**
			 * This represents the displayFormat of the Range Values. With the value "UpperCase" the entered value of the Range will be converted to upperCase.
			 * @since 1.24
			 */
			displayFormat : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * This represents how the item token text should be displayed on the ValueHelpDialog.
			 * Use one of the valid sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR const values.
			 * 
			 * @since 1.24
			 */
			tokenDisplayBehaviour : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * set the dialog into a FilterDialog mode, which only shows ranges and hide the tokens.
			 * @since 1.24
			 */
			filterMode : {type : "boolean", group : "Misc", defaultValue : false}
		},
		aggregations : {
	
			/**
			 * This allows a SmartFilterBar to be added to the ValueHelp dialog.
			 */
			filterBar : {type : "sap.ui.core.Control", multiple : false}
		},
		events : {
	
			/**
			 * This event will be fired when the user clicks the OK button on the dialog.
			 * @since 1.24
			 */
			ok : {}, 
	
			/**
			 * This event will be fired when the user clicks the Cancel button on the dialog.
			 * @since 1.24
			 */
			cancel : {}
		}
	}});
	
	
	/**
	 * This method allows you to specify the KeyFields for the ranges. You can set an array of object with Key and Label properties to define the keyfields.
	 *
	 * @name sap.ui.comp.valuehelpdialog.ValueHelpDialog#setRangeKeyFields
	 * @function
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * This method must be used to assign a list of tokens to the value help dialog.
	 *
	 * @name sap.ui.comp.valuehelpdialog.ValueHelpDialog#setTokens
	 * @function
	 * @param {sap.m.Token[]} aATokens
	 *         array of Token controls.
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	// EXC_ALL_CLOSURE_003
	
	/**
	 * sets the support for multiselection.
	 * 
	 * @public
	 * @since 1.24
	 * @param {boolean} bEnabled enabled or disabled multiselection
	 */
	ValueHelpDialog.prototype.setSupportMultiselect = function(bEnabled) {
		this.setProperty("supportMultiselect", bEnabled);
	
		this.theTable.setSelectionMode(bEnabled ? sap.ui.table.SelectionMode.MultiToggle : sap.ui.table.SelectionMode.Single);
		if (!bEnabled) {
			this._oTokenizerGrid.addStyleClass("displayNone");
		} else {
			this._oTokenizerGrid.removeStyleClass("displayNone");
		}
		this.getBeginButton().setVisible(this.getSupportMultiselect());
		return this;
	};
	
	/**
	 * sets the support for ranges. When you disable ranges the dialog does not provide a "Define Condition" link in the header which opens the ranges UI
	 * in the value help dialog.
	 * 
	 * @public
	 * @since 1.24
	 * @param {boolean} bEnabled enabled or disabled ranges support
	 */
	ValueHelpDialog.prototype.setSupportRanges = function(bEnabled) {
		this.setProperty("supportRanges", bEnabled);
	
		if (bEnabled && !this.getSupportRangesOnly()) {
			if (!this._oRangeButton) {
				this._oRangeButton = new sap.m.Button({
					type: sap.m.ButtonType.Transparent,
					text: this._oRb.getText("VALUEHELPDLG_RANGES"),
					press: this._onRangesPressed()
				}).addStyleClass("compVHRangesLink");
				
				this._oHeaderBar.addContentRight(this._oRangeButton);
			} else {
				this._oRangeButton.setVisible(true);
			}
		}
		if (!bEnabled && !this.getSupportRangesOnly() && this._oRangeButton) {
			this._oRangeButton.setVisible(false);
		}
		
		return this;
	};
	
	/**
	 * press handler for the "Define Condition" (ranges) button
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._onRangesPressed = function() {
		var that = this;
	
		return function() {
			if (that.getSupportRanges()) {
				that.bCollectiveSearchActive = that.oSelectionButton.getVisible();
				that._fillRanges(true);
			}
		};
	};
	
	/**
	 * called when the dialog will be opened to make only the ranges accessible/visible and to hide e.g. the back button
	 * 
	 * @private
	 * @param {boolean} bIsBackSupport makes Back button visible
	 */
	ValueHelpDialog.prototype._fillRanges = function(bIsBackSupport) {
		this._showRanges();
	
		if (this._oRangeButton) {
			this._oRangeButton.setVisible(false);
		}
		if (this.oSelectionTitle) {
			this.oSelectionTitle.setVisible(false);
		}
		if (this.oSelectionButton) {
			this.oSelectionButton.setVisible(false);
		}
	
		this._oBackButton.setVisible(bIsBackSupport);
	
		this.getBeginButton().setVisible(this.getSupportRangesOnly() || this.getSupportMultiselect());
	
		this._oTitle.setText(this.getFilterMode() ? this.getTitle() : this._oRb.getText("VALUEHELPDLG_RANGESTITLE", this.getTitle()));
	};
	
	/**
	 * press handler for the "Back" (to main list) button
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._onBackPressed = function() {
		var that = this;
	
		return function() {
			var fnCallback = function() {
				that._showNormalTable();
	
				if (that._oRangeButton) {
					that._oRangeButton.setVisible(true);
				}
				if (that.oSelectionTitle) {
					that.oSelectionTitle.setVisible(that.bCollectiveSearchActive);
				}
				if (that.oSelectionButton) {
					that.oSelectionButton.setVisible(that.bCollectiveSearchActive);
				}
	
				that._oBackButton.setVisible(false);
	
				that._oTitle.setText(that._oRb.getText("VALUEHELPDLG_TITLE", that.getTitle()));
			};
	
			that._validateRanges(fnCallback);
		};
	};
	
	/**
	 * press handler for the "Selected Items" link
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._onSelectedItemsPressed = function() {
		var that = this;
	
		return function() {
			var fnCallback = function() {
				that.bCollectiveSearchActive = that.oSelectionButton.getVisible();
	
				that._showSelectedItems();
	
				if (that._oRangeButton) {
					that._oRangeButton.setVisible(false);
				}
				if (that.oSelectionTitle) {
					that.oSelectionTitle.setVisible(false);
				}
				if (that.oSelectionButton) {
					that.oSelectionButton.setVisible(false);
				}
	
				that._oBackButton.setVisible(true);
	
				that._oTitle.setText(that._oRb.getText("VALUEHELPDLG_SELECTEDITEMSTITLE", that.getTitle()));
			};
	
			that._validateRanges(fnCallback);
		};
	};
	
	/**
	 * sets the Title of the dialog. The value will be used for the different titles which we display on the dialog. The dialog title changes depending on
	 * the content. Select: {sTitle} Define Conditions: {sTitle} Selected Items: {sTitle}
	 * 
	 * @public
	 * @since 1.24
	 * @param {string} sTitle
	 */
	ValueHelpDialog.prototype.setTitle = function(sTitle) {
		this.setProperty("title", sTitle);
	
		if (this._oTitle) {
			this._oTitle.setText(this._oRb.getText("VALUEHELPDLG_TITLE", sTitle));
		}
	};
	
	/**
	 * sets the FilterBar into the Value Help dialog.
	 * 
	 * @public
	 * @since 1.24
	 * @param {FilterBar/SmartFilterBar} oControl
	 */
	ValueHelpDialog.prototype.setFilterBar = function(oCtrl) {
		this.setAggregation("filterBar", oCtrl);
	
		if (this._oMainGrid && oCtrl) {
			if (this._oFilterBar) {
				this._oMainGrid.removeContent(this._oFilterBar);
			}
			this._oFilterBar = oCtrl;
			// insert the filterbar into the main grid
			this._oMainGrid.insertContent(oCtrl, 0);
	
			// try to fill the basic search text into the SmartFilterBar and set the initial Focus.
			if (this._oFilterBar.getBasicSearchControl && this._oFilterBar.getBasicSearchControl()) {
				var oBasicSearchField = this._oFilterBar.getBasicSearchControl();
				oBasicSearchField.setValue(this.getBasicSearchText());
	
				this.setInitialFocus(oBasicSearchField);
			}
		}
	};
	
	/**
	 * return current FilterBar of Value Help dialog.
	 * 
	 * @public
	 * @since 1.24
	 * @returns {FilterBar/SmartFilterBar} the current FilterBar instance
	 */
	ValueHelpDialog.prototype.getFilterBar = function() {
		return this._oFilterBar;
	};
	
	/**
	 * sets the Basic search text. The value will be set into the basic search field of the Filterbar
	 * 
	 * @public
	 * @since 1.24
	 * @param {string} sText the text for the basic search field
	 */
	ValueHelpDialog.prototype.setBasicSearchText = function(sText) {
		this.setProperty("basicSearchText", sText);
	
		if (this._oFilterBar && this._oFilterBar.getBasicSearchControl && this._oFilterBar.getBasicSearchControl()) {
			this._oFilterBar.getBasicSearchControl().setValue(sText);
		}
	};
	
	/**
	 * sets the array of tokens. The sap.mTokens will be added into the Dialog Tokenizer "Selected Items" or "Excluded Items". normal Tokens will added
	 * into the Selected Items Tokenizer and selected in the table new sap.m.Token({key: "0001", text:"SAP A.G. (0001)"}); Tokens with the extra data
	 * "range" will be handled as Range tokens or exclude Range tokens. new sap.m.Token({key: "i1", text: "ID: a..z"}).data("range", { "exclude": false,
	 * "operation": sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.BT, "keyField": "CompanyCode", "value1": "a", "value2": "z"}); You the the
	 * Selected or Range tokens back via the Ok event in the parameters
	 * 
	 * @public
	 * @since 1.24
	 * @param {array} aTokens the complete list of tokens
	 */
	ValueHelpDialog.prototype.setTokens = function(aTokens) {
		if (aTokens.length) {
			var n = 0, sKey;
			for (var i = 0; i < aTokens.length; i++) {
				var token = aTokens[i];
				if (token.data("range")) {
					var range = token.data("range");
					sKey = token.getKey();
					if (!sKey) {
						sKey = "range_" + n;
						n++;
					}
					var theTokenText = this._getFormatedRangeTokenText(range.operation, range.value1, range.value2, range.exclude, range.keyField);
					this._addToken2Tokenizer(sKey, theTokenText, range.exclude ? this._oExcludedTokens : this._oSelectedTokens);
	
					this._oSelectedRanges[sKey] = range;
				} else {
					sKey = token.getKey();
					var sText = token.getText();
					var sLongKey = token.data("longKey");
					var oRowData = token.data("row");
					if (!sLongKey) {
						sLongKey = sKey;
					}
					this._oSelectedItems.add(sLongKey, oRowData ? oRowData : token.getText());
	
					this._oSelectedTokens.addToken(new Token({
						key: sLongKey,
						text: sText,
						tooltip: sText
					}));
				}
			}
		} else {
			this._oSelectedItems.removeAll();
			this._oSelectedRanges = {};
		}
	};
	
	/**
	 * opens the dialog when SupportRangesOnly is set to True we directly show the Ranges part
	 * 
	 * @public
	 * @since 1.24
	*/
	ValueHelpDialog.prototype.open = function() {
		if (this.getSupportRangesOnly() || this.getFilterMode()) {
			this._fillRanges(false);
		}
		this.setContentWidth(this._getDefaultContentWidth());
	
		Dialog.prototype.open.apply(this);
	};
	
	/**
	 * gives access to the internal table instance
	 * 
	 * @public
	 * @since 1.28
	 */
	ValueHelpDialog.prototype.getTable = function() {
		return this.theTable;
	};
	
	/**
	 * return the default ContentWidth for the dialog
	 * 
	 * @private
	 * @returns the width in px as string
	 */
	ValueHelpDialog.prototype._getDefaultContentWidth = function() {
		var nColumns = 0;
		if (this.theTable) {
			nColumns = this.theTable.getColumns().length;
		}
		var nWidth = Math.max(1080, nColumns * 130);
		return nWidth + "px";
	};
	
	/**
	 * Reset the table binding and change the table NoDataText to "Please press Search Button"
	 * 
	 * @public
	 * @since 1.24
	*/
	ValueHelpDialog.prototype.resetTableState = function() {
		if (this.theTable) {
			this.theTable.unbindRows();
			this.theTable.setNoDataText(this._oRb.getText("VALUEHELPDLG_TABLE_PRESSSEARCH"));
		}
	};
	
	/**
	 * Change the table NoDataText to "Please press Search Button"
	 * 
	 * @public
	 * @since 1.24
	 */
	ValueHelpDialog.prototype.TableStateSearchData = function() {
		if (this.theTable) {
			this.theTable.setNoDataText(this._oRb.getText("VALUEHELPDLG_TABLE_PRESSSEARCH"));
		}
	};
	
	/**
	 * Change the table NoDataText to "No Data found!"
	 * 
	 * @public
	 * @since 1.24
	 */
	ValueHelpDialog.prototype.TableStateDataFilled = function() {
		if (this.theTable) {
			this.theTable.setNoDataText(this._oRb.getText("VALUEHELPDLG_TABLE_NODATA"));
		}
	};
	
	/**
	 * Change the table NoDataText to "Searching..."
	 * 
	 * @public
	 * @since 1.28
	 */
	ValueHelpDialog.prototype.TableStateDataSearching = function() {
		if (this.theTable) {
			this.theTable.setNoDataText(this._oRb.getText("VALUEHELPDLG_TABLE_SEARCHING"));
		}
	};
	
	/**
	 * Initialize the control
	 * 
	 * @public
	 */
	ValueHelpDialog.prototype.init = function() {
		Dialog.prototype.init.apply(this);
	
		// init the Dialog itself
		this.addStyleClass("compValueHelpDialog");
		this.setHorizontalScrolling(false);
		this.setVerticalScrolling(true);
	
		// init some resources
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
		this._sTableTitle1 = this._oRb.getText("VALUEHELPDLG_TABLETITLE1");
		this._sTableTitle2 = this._oRb.getText("VALUEHELPDLG_TABLETITLE2");
		this._sTableTitleNoCount = this._oRb.getText("VALUEHELPDLG_TABLETITLENOCOUNT");
		this._sSelectedItemsTitle = this._oRb.getText("VALUEHELPDLG_SELECTEDITEMS");
		this._sNoneSelectedItemsTitle = this._oRb.getText("VALUEHELPDLG_NONESELECTEDITEMS");
	
		if (!this._aIncludeRangeOperations) {
			this.setIncludeRangeOperations([
				sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.Contains, sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EQ, sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.BT, sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.StartsWith, sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EndsWith, sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.LT, sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.LE, sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.GT, sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.GE
			]);
		}
	
		if (!this._aExcludeRangeOperations) {
			this.setExcludeRangeOperations([
				sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EQ
			]);
		}
	
		this._oSelectedItems = new ItemsCollection();
		this._oSelectedRanges = {};
	
		this._createHeaderBar();
	
		this._createTable();
	
		this._createTokenizer();
		this._updateTokenizer();
	
		this._oInnerGrid = new sap.ui.layout.Grid({
			width: "100%",
			defaultSpan: "L12 M12 S12",
			vSpacing: 0,
			hSpacing: 0,
			content: [
				this._oFilterBar, this.theTable
			]
		}).addStyleClass("compVHPadding");
	
		this._oMainGrid = new sap.ui.layout.Grid({
			width: "100%",
			defaultSpan: "L12 M12 S12",
			vSpacing: 0,
			hSpacing: 0,
			content: [
				this._oInnerGrid, this._oTokenizerGrid
			]
		});
	
		this.addContent(this._oMainGrid);
	
		this._fillFooter();
	};
	
	/**
	 * select or deselect the row in the table with the given key
	 * 
	 * @private
	 * @param {string} sKey the key of the row
	 * @param {boolean} bSelect specifies if the row should be selected or deselected.
	 */
	ValueHelpDialog.prototype._changeTableRowSelectionForKey = function(sKey, bSelect) {
		var i;
		var rows = this.theTable.getBinding("rows");
	
		if (rows.aKeys) {
			for (i = 0; i < rows.aKeys.length; i++) {
				if (rows.aKeys[i] === sKey) {
					if (bSelect) {
						this.theTable.addSelectionInterval(i, i);
					} else {
						this.theTable.removeSelectionInterval(i, i);
					}
					return;
				}
			}
		} else {
			this.oRows = this.theTable.getBinding("rows");
			for (i = 0; i < this.oRows.aIndices.length; i++) {
				var oContext = this.theTable.getContextByIndex(i);
				if (oContext) {
					var obj = oContext.getObject();
					if (obj[this.getKey()] === sKey) {
						if (bSelect) {
							this.theTable.addSelectionInterval(i, i);
						} else {
							this.theTable.removeSelectionInterval(i, i);
						}
						return;
					}
				}
			}
		}
	
	};
	
	/**
	 * updates the selection of rows in the table. should be called after a binding update of the table.
	 * 
	 * @public
	 * @since 1.24
	*/
	ValueHelpDialog.prototype.update = function() {
		var i, j, obj, oContext;
		this.oRows = this.theTable.getBinding("rows");
	
		this.ignoreSelectionChange = true;
		this.theTable.clearSelection();
	
		var aItems = this._oSelectedItems.getItems();
		var sRowKeyPartPrefix = this.getKeys() && this.getKeys().length > 1 ? this.getKey() + "=" : "";
	
		if (this.oRows.aKeys) {
			// in case of a ODataModel binding the aKeys exist and the row will be found via the keys.
			for (j = 0; j < aItems.length; j++) {
				var sKey = aItems[j];
				var sRowKeyPart = sRowKeyPartPrefix + "'" + sKey + "'";
	
				for (i = 0; i < this.oRows.aKeys.length; i++) {
					var sRowKey = this.oRows.aKeys[i];
					var bIsRow = sRowKey === sKey;
					if (bIsRow || // either the rowKey is equal the token key or we search if the main key with the value is part of the rowKey 
						sRowKey.indexOf(sRowKeyPart) >= 0) {
	
						if (!bIsRow) { // in this case we will update the old key and use the longKey from the rows
							this._oSelectedItems.remove(sKey); // remove the old  key
							// and update the Token key
							var token = this._getTokenByKey(sKey, this._oSelectedTokens);
							if (token) {
								token.setKey(sRowKey);
							}
						}
						
						// update the row data in the selectedItems List
						oContext = this.theTable.getContextByIndex(i);
						if (oContext) {
							obj = oContext.getObject();
							this._oSelectedItems.add(sRowKey, obj);
						}
	
						// make the row selected
						this.theTable.addSelectionInterval(i, i);
						break;
					}
				}
			}
		} else {
			for (j = 0; j < aItems.length; j++) {
				var key = aItems[j];
	
				for (i = 0; i < this.oRows.aIndices.length; i++) {
					oContext = this.theTable.getContextByIndex(i);
					if (oContext) {
						obj = oContext.getObject();
						if (obj[this.getKey()] === key) {
							this._oSelectedItems.add(obj[this.getKey()], obj);
							this.theTable.addSelectionInterval(i, i);
							break;
						}
					}
				}
			}
		}
	
		this.ignoreSelectionChange = false;
	
		this._updateTitles();
	};
	
	/**
	 * create the header bar, the controls for the header and adds it into the CustomHeader
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._createHeaderBar = function() {
		this._oBackButton = new sap.m.Button({
			type: sap.m.ButtonType.Transparent,
			icon: "sap-icon://nav-back",
			text: this._oRb.getText("VALUEHELPDLG_BACK"),
			press: this._onBackPressed(),
			visible: false
		});
	
		this._oTitle = new sap.m.Text({
			text: this._oRb.getText("VALUEHELPDLG_TITLE", this.getTitle()),
			wrapping: false
		}).addStyleClass("titleText").unbindText(); // Text is not set via binding, but by calling setText
	
		// !!! this is a workaround to support the "collective Search" in the Value Help dialog.
		// the oSelectionText and oSelectionButton are accessed outside the dialog!!!
		this.oSelectionTitle = new sap.m.Text({
			visible: false,
			wrapping: false
		}).addStyleClass("titleText");
	
		this.oSelectionButton = new sap.m.Button({
			icon: "sap-icon://navigation-down-arrow",
			visible: false
		});
		// !!!--------------!!!
	
		this._oHeaderBar = new sap.m.Bar({
			contentLeft: [
				this._oBackButton
			],
			contentMiddle: [
				this._oTitle, this.oSelectionTitle, this.oSelectionButton
			]
		});
		this.setCustomHeader(this._oHeaderBar);
	};
	
	/**
	 * create the footer buttons
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._fillFooter = function() {
		var that = this;
	
		this.setBeginButton(new sap.m.Button({
			text: that._oRb.getText("VALUEHELPDLG_OK"),
			press: that._onCloseAndTakeOverValues(),
			visible: this.getSupportMultiselect()
		}));
	
		this.setEndButton(new sap.m.Button({
			text: that._oRb.getText("VALUEHELPDLG_CANCEL"),
			press: that._onCancel()
		}));
	};
	
	/**
	 * create the Tokenizer part of the dialog
	 * 
	 * @private
	 * @returns grid with all elements
	 */
	ValueHelpDialog.prototype._createTokenizer = function() {
		var that = this;
	
		if (this._oTokenizerGrid) {
			return this._oTokenizerGrid;
		}
	
		this._oSelectedTokenTitle = new sap.m.Text().addStyleClass("compVHSelectedItemsText");
	
		this._oSelectedTokens = new sap.m.Tokenizer({
			tokenChange: function(oControlEvent) {
				if (that._ignoreRemoveToken) {
					return;
				}
	
				if (oControlEvent.getParameter("type") === MultiInput.TokenChangeType.Removed) {
					var sKey = oControlEvent.getParameter("token").getKey();
					if (that._oSelectedRanges && that._oSelectedRanges[sKey]) {
						// remove range
						that._removeRangeByKey(sKey, false);
						that._updateTitles();
					} else {
						// remove single selected item
						that._oSelectedItems.remove(sKey);
						that._removeTokenFromTokenizer(sKey, that._oSelectedTokens);
						that._updateTitles();
	
						that.ignoreSelectionChange = true;
						that._changeTableRowSelectionForKey(sKey, false);
						that.ignoreSelectionChange = false;
					}
	
					// reset focus to other token
					setTimeout(function() {
						var i = that._oSelectedTokens.getTokens().length - 1;
						if (i >= 0) {
							that._oSelectedTokens.getTokens()[i].focus();
						}
					});
				}
			}
		}).addStyleClass("compVHTokensDiv");
	
		// this "remove all" button is a workaround and should be part of the Tokenizer itself
		this._oRemoveAllSelectedItemsBtn = new sap.m.Button({
			type: sap.m.ButtonType.Transparent,
			icon: sap.ui.core.IconPool.getIconURI("sys-cancel"),
			press: function() {
				that._oSelectedTokens.removeAllTokens();
	
				for ( var sKey in that._oSelectedRanges) {
					that._removeRangeByKey(sKey, false);
				}
	
				that._oSelectedItems.removeAll();
				that.ignoreSelectionChange = true;
				that.theTable.clearSelection();
				that.ignoreSelectionChange = false;
	
				that._updateTitles();
			}
		}).addStyleClass("compVHRemoveAllBtn");
	
		var oHContainer1 = new sap.ui.layout.HorizontalLayout({
			content: [
				this._oSelectedTokens, this._oRemoveAllSelectedItemsBtn
			]
		}).addStyleClass("compVHTokenizerHLayout");
	
		this._oIncludeTokenGrid = new sap.ui.layout.Grid({
			width: "100%",
			defaultSpan: "L12 M12 S12",
			hSpacing: 0,
			vSpacing: 0,
			content: [
				this._oSelectedTokenTitle, oHContainer1
			]
		});
	
		this._oExcludedTokenTitle = new sap.m.Text().addStyleClass("compVHSelectedItemsText");
	
		this._oExcludedTokens = new sap.m.Tokenizer({
			tokenChange: function(oControlEvent) {
				if (that._ignoreRemoveToken) {
					return;
				}
	
				if (oControlEvent.getParameter("type") === MultiInput.TokenChangeType.Removed) {
					var sKey = oControlEvent.getParameter("token").getKey();
					that._removeRangeByKey(sKey, true);
					that._updateTitles();
				}
			}
		}).addStyleClass("compVHTokensDiv");
	
		// this "remove all" button is a workaround and should be part of the Tokenizer itself
		this._oRemoveAllExcludeItemsBtn = new sap.m.Button({
			type: sap.m.ButtonType.Transparent,
			icon: sap.ui.core.IconPool.getIconURI("sys-cancel"),
			press: function() {
				that._oExcludedTokens.removeAllTokens();
	
				for ( var sKey in that._oSelectedRanges) {
					that._removeRangeByKey(sKey, true);
				}
				that._updateTitles();
			}
		}).addStyleClass("compVHRemoveAllBtn");
	
		var oHContainer2 = new sap.ui.layout.HorizontalLayout({
			content: [
				this._oExcludedTokens, this._oRemoveAllExcludeItemsBtn
			]
		}).addStyleClass("compVHTokenizerHLayout");
	
		this._oExcludeTokenGrid = new sap.ui.layout.Grid({
			width: "100%",
			defaultSpan: "L12 M12 S12",
			hSpacing: 0,
			vSpacing: 0,
			content: [
				this._oExcludedTokenTitle, oHContainer2
			]
		});
	
		this._oShowAllLink = new sap.m.Button({
			type: sap.m.ButtonType.Transparent,
			text: this._oRb.getText("VALUEHELPDLG_SHOWALL"),
			press: this._onSelectedItemsPressed(),
			visible: (this.fSingleRowCallback !== undefined) && (!this.getSupportRangesOnly())
		}).addStyleClass("compVHShowAllLink");
	
		this._oTokenizerGrid = new sap.ui.layout.Grid({
			width: "100%",
			defaultSpan: "L12 M12 S12",
			hSpacing: 0,
			vSpacing: 0,
			content: [
				this._oIncludeTokenGrid, this._oExcludeTokenGrid, this._oShowAllLink
			]
		}).addStyleClass("compVHDarkBackground");
	
		if (!this.getSupportMultiselect()) {
			this._oTokenizerGrid.addStyleClass("displayNone");
		}
	
		return this._oTokenizerGrid;
	};
	
	/**
	 * adds/modify a token in a tokenizer control.
	 * 
	 * @private
	 * @param {string} sKey of the token
	 * @param {string} sText the token text
	 * @param {sap.m.Tokenizer} oTokenizer the Tokenizer which contain the token
	 */
	ValueHelpDialog.prototype._addToken2Tokenizer = function(sKey, sText, oTokenizer) {
		var token = this._getTokenByKey(sKey, oTokenizer);
		if (token) {
			// update existing token
			token.setText(sText);
			token.setTooltip(sText);
		} else {
			// create a new token
			oTokenizer.addToken(new Token({
				key: sKey,
				text: sText,
				tooltip: sText
			}));
			this._updateTokenizer();
		}
	};
	
	/**
	 * search a token by key in the given tokenizer
	 * 
	 * @private
	 * @param {string} sKey of the token
	 * @param {sap.m.Tokenizer} oTokenizer the Tokenizer which contain the token
	 * @returns {sap.m.Token} the found token instance or null
	 */
	ValueHelpDialog.prototype._getTokenByKey = function(sKey, oTokenizer) {
		var aTokens = oTokenizer.getTokens();
		for (var i = 0; i < aTokens.length; i++) {
			var token = aTokens[i];
			if (token.getKey() === sKey) {
				return token;
			}
		}
		return null;
	};
	
	/**
	 * removes a token from the selected or excluded tokenizer
	 * 
	 * @private
	 * @param {string} sKey of the token
	 */
	ValueHelpDialog.prototype._removeToken = function(sKey) {
		if (!this._removeTokenFromTokenizer(sKey, this._oSelectedTokens)) {
			this._removeTokenFromTokenizer(sKey, this._oExcludedTokens);
		}
	};
	
	/**
	 * removes a token from a tokenizer
	 * 
	 * @private
	 * @param {string} sKey of the token
	 * @param {sap.m.Tokenizer} oTokenizer the Tokenizer which contain the token
	 * @returns {boolean} true when the token hase been foudna removed, else false
	 */
	ValueHelpDialog.prototype._removeTokenFromTokenizer = function(sKey, oTokenizer) {
		var token = this._getTokenByKey(sKey, oTokenizer);
		if (token) {
			this._ignoreRemoveToken = true;
			oTokenizer.removeToken(token);
			this._ignoreRemoveToken = false;
			this._updateTokenizer();
			return true;
		}
		return false;
	};
	
	/**
	 * updating the tokenizer title, RemoveAll button and ShowAll link
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._updateTokenizer = function() {
		var n1 = this._oSelectedTokens.getTokens().length;
		var sText = this._sSelectedItemsTitle.replace("{0}", n1.toString());
		this._oSelectedTokenTitle.setText(n1 === 0 ? this._sNoneSelectedItemsTitle : sText);
		this._oRemoveAllSelectedItemsBtn.setEnabled(n1 !== 0);
	
		var n2 = this._oExcludedTokens.getTokens().length;
		this._oExcludedTokenTitle.setText(this._oRb.getText("VALUEHELPDLG_EXCLUDEDITEMS", n2.toString()));
	
		if (n2 === 0) {
			this._oExcludeTokenGrid.addStyleClass("displayNone");
		} else {
			this._oExcludeTokenGrid.removeStyleClass("displayNone");
		}
	
		this._oShowAllLink.setVisible(!this.getSupportRangesOnly() && this.fSingleRowCallback !== undefined && (n1 + n2 > 0));
	
		this._onMyResize();
	};
	
	/**
	 * remove a single range from the UI and the internal selectedRanges list.
	 * 
	 * @private
	 * @param {string} sKey the key of the range
	 * @param {boolean} isExclude specifies if the removed range must be an included or excluded range
	 */
	ValueHelpDialog.prototype._removeRangeByKey = function(sKey, isExclude) {
		var range = this._oSelectedRanges[sKey];
		if (range.exclude === isExclude) {
			if (!range._oGrid) {
				delete this._oSelectedRanges[sKey];
				
				if (this._oFilterPanel) {
					if (range.exclude) {
						this._oFilterPanel._oExcludeFilterPanel.removeCondition(sKey);
					} else {
						this._oFilterPanel._oIncludeFilterPanel.removeCondition(sKey);
					}
				}
			}
		}
	};
	
	/**
	 * makes the main view (Filterbar and result Table) visible in the dialog.
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._showNormalTable = function() {
		this.removeAllContent();
		this.setVerticalScrolling(true);
		this.setContentHeight("");
		this.setContentWidth(this._getDefaultContentWidth());
	
		this._oMainGrid.addContent(this._oTokenizerGrid);
		this.addContent(this._oMainGrid);
	
		this._updateTitles();
	};
	
	// ################################################################################
	// Start Ranges handling
	// ################################################################################
	
	/**
	 * makes the ranges view (included and excluded range fields) visible in the dialog.
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._showRanges = function() {
		this.removeAllContent();
		this.setVerticalScrolling(false);
	
		if (!this.getSupportRangesOnly() && !this.getFilterMode()) {
			// to avoid a dialog resize when we add or remove ranges the dialog get a fixed size
			this.setContentHeight(this._iResizeDomHeight + "px");
			this._onMyResize();
		}
	
		this.addContent(this._getRanges());
		if (this.getMaxIncludeRanges() === "-1" && this.getMaxExcludeRanges() !== "0" && !this.getFilterMode()) {
			this._oRanges.addContent(this._oTokenizerGrid);
		}
	};
	
	/**
	 * create and returns the Ranges grid
	 * 
	 * @private
	 * @returns the ranges grid
	 */
	ValueHelpDialog.prototype._getRanges = function() {
		if (!this._oRanges) {
			this._oRanges = this._createRanges();
		}
		return this._oRanges;
	};
	
	/**
	 * create a new instance of ranges grid with all inner controls
	 * 
	 * @private
	 * @returns the ranges grid
	 */
	ValueHelpDialog.prototype._createRanges = function() {
	
		jQuery.sap.require("sap.m.P13nConditionPanel");
		jQuery.sap.require("sap.m.P13nFilterPanel");
	
		this._oFilterPanel = new sap.m.P13nFilterPanel({
			maxIncludes: this.getMaxIncludeRanges(),
			maxExcludes: this.getMaxExcludeRanges(),
			containerQuery: true,
			addFilterItem: jQuery.proxy(function(oEvent) {
				// sap.m.MessageToast.show("AddFilterItem");
	
				var params = oEvent.mParameters;
				var oRange = {
					exclude: params.filterItemData.exclude,
					keyField: params.filterItemData.columnKey,
					operation: params.filterItemData.operation,
					value1: params.filterItemData.value1,
					value2: params.filterItemData.value2
				};
				this._oSelectedRanges[params.key] = oRange;
	
				var sTokenText = this._getFormatedRangeTokenText(oRange.operation, oRange.value1, oRange.value2, oRange.exclude, oRange.keyField);
				this._addToken2Tokenizer(params.key, sTokenText, oRange.exclude ? this._oExcludedTokens : this._oSelectedTokens);
				this._updateTokenizer();
			}, this),
			removeFilterItem: jQuery.proxy(function(oEvent) {
				// sap.m.MessageToast.show("RemoveFilterItem");
	
				var params = oEvent.mParameters;
				delete this._oSelectedRanges[params.key];
				this._removeToken(params.key);
				this._updateTokenizer();
			}, this),
			updateFilterItem: jQuery.proxy(function(oEvent) {
				// sap.m.MessageToast.show("UpdateFilterItem");
	
				var params = oEvent.mParameters;
				var oRange = this._oSelectedRanges[params.key];
				oRange.exclude = params.filterItemData.exclude;
				oRange.keyField = params.filterItemData.columnKey;
				oRange.operation = params.filterItemData.operation;
				oRange.value1 = params.filterItemData.value1;
				oRange.value2 = params.filterItemData.value2;
				
				var sTokenText = this._getFormatedRangeTokenText(oRange.operation, oRange.value1, oRange.value2, oRange.exclude, oRange.keyField);
				this._addToken2Tokenizer(params.key, sTokenText, oRange.exclude ? this._oExcludedTokens : this._oSelectedTokens);
				this._updateTokenizer();
			}, this)
		});
	
		this._oFilterPanel.setIncludeOperations(this._aIncludeRangeOperations);
		this._oFilterPanel.setExcludeOperations(this._aExcludeRangeOperations);
	
		// this._oFilterPanel.setKeyFields([{key: "KeyField1", text: "Field1"}, {key: "KeyField2", text: "Field2", type : "date", isDefault: true}]);
		if (this._aRangeKeyFields) {
			this._aRangeKeyFields.forEach(function(item) {
				item["text"] = item.label;
			});
			this._oFilterPanel.setKeyFields(this._aRangeKeyFields);
		}
		
	// var oCondition1= { "key": "i1", "text": "CompanyCode: a..z" , "exclude": false, "operation": sap.m.P13nConditionOperation.BT, "keyField":
	// "CompanyCode", "value1": "a", "value2": "z"};
	// var oCondition2= { "key": "i2", "text": "CompanyCode: =foo" , "exclude": false, "operation": sap.m.P13nConditionOperation.EQ, "keyField":
	// "CompanyCode", "value1": "foo", "value2": ""};
	// var oCondition3= { "key": "e1", "text": "CompanyCode: !(=foo)", "exclude": true , "operation": sap.m.P13nConditionOperation.EQ, "keyField":
	// "CompanyCode", "value1": "foo", "value2": ""};
	// var aConditions= [oCondition1, oCondition2, oCondition3];
	
		var aConditions = [];
		if (this._oSelectedRanges) {
			for ( var rangeId in this._oSelectedRanges) {
				var rangeData = this._oSelectedRanges[rangeId];
				aConditions.push({
					key: rangeId,
					exclude: rangeData.exclude,
					keyField: rangeData.keyField,
					operation: rangeData.operation,
					value1: rangeData.value1,
					value2: rangeData.value2
				});
			}
		}
	
		this._oFilterPanel.setConditions(aConditions);
	
		this._oRangeScrollContainer = new sap.m.ScrollContainer({
			vertical: true,
			horizontal: false,
			width: "100%",
			height: "300px",
			content: [
				this._oFilterPanel
			]
		});
	
		var oRangeFieldsGrid = new sap.ui.layout.Grid({
			width: "100%",
			defaultSpan: "L12 M12 S12",
			vSpacing: 0,
			hSpacing: 0,
			content: [
				this._oRangeScrollContainer
			]
		});
	
		this._sValidationDialogTitle = this._oRb.getText("VALUEHELPVALDLG_TITLE");
		this._sValidationDialogMessage = this._oRb.getText("VALUEHELPVALDLG_MESSAGE");
		this._sValidationDialogFieldMessage = this._oRb.getText("VALUEHELPVALDLG_FIELDMESSAGE");
	
		return oRangeFieldsGrid;
	};
	
	/**
	 * check if the entered/modified ranges are correct, marks invalid fields yellow (Warning state) and opens a popup message dialog to give the user the
	 * feedback that some values are wrong or missing.
	 * 
	 * @private
	 * @params {function} fnCallback which we call when all ranges are valid or the user ignores the wrong/missing fields by pressing Yes on a message
	 *         dialog.
	 */
	ValueHelpDialog.prototype._validateRanges = function(fnCallback) {
		if (this._oRanges && this.getContent()[0] === this._getRanges()) { // we only check the ranges when the range part is visible
	
			// show warnings on invalid fields.
			var bIsIncludeRangesValid = this._oFilterPanel.validateConditions();
	
			if (!bIsIncludeRangesValid) {
				// open a simple confirm box
				MessageBox.show(this._sValidationDialogMessage, {
					icon: MessageBox.Icon.WARNING,
					title: this._sValidationDialogTitle,
					actions: [
						MessageBox.Action.OK, MessageBox.Action.CANCEL
					],
					styleClass: !!this.$().closest(".sapUiSizeCompact").length ? "sapUiSizeCompact" : "",
					onClose: function(sResult) {
						if (sResult === MessageBox.Action.OK && fnCallback) {
							fnCallback();
						}
					}
				});
				return;
			}
	
		}
	
		fnCallback();
	};
	
	// ################################################################################
	// Start Selected Items handling
	// ################################################################################
	
	/**
	 * makes the Selected Items table visible in the dialog.
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._showSelectedItems = function() {
		this.removeAllContent();
		this.setVerticalScrolling(true);
		this.setContentHeight("");
		this.setContentWidth(this._getDefaultContentWidth());
	
		this.addContent(this._getSelectedItemsTable());
	
		var table = this._oSelectedItemsTable;
	
		var oModel = table.getModel();
		var aModelData = this._oSelectedItems.getModelData();
		this._updateMissingRows(aModelData);
		oModel.setData(aModelData);
	
		this.ignoreSelectionChange = true;
		table.clearSelection();
		table.addSelectionInterval(0, this._oSelectedItems.getItems().length - 1);
		this.ignoreSelectionChange = false;
	
		var n = table.getSelectedIndices() ? table.getSelectedIndices().length : 0;
		table.setTitle(this._oRb.getText("VALUEHELPDLG_SELECTEDITEMS", n.toString()));
	};
	
	/**
	 * callback handling to fetch missing rows for the selectedItems Table
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._updateMissingRows = function(aModelData) {
		if (this.fSingleRowCallback && this.getContent()[0] === this._getSelectedItemsTable()) {
			var i = this._getMissingRowIndex(aModelData);
			if (i >= 0) {
				var that = this;
	
				this.fSingleRowCallback(aModelData[i].missing, function(oData) {
					delete aModelData[i].missing;
					aModelData[i] = oData;
					that._oSelectedItems.add(oData[that.getKey()], oData);
	
					that._updateMissingRows(aModelData);
					that.invalidate();
				});
			}
		}
	};
	
	/**
	 * setter for the singleRowCallback function
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype.setUpdateSingleRowCallback = function(fSingleRowCallback) {
		this.fSingleRowCallback = fSingleRowCallback;
	
		if (this._oShowAllLink) {
			// hide the ShowAll link when there is not Callback set
			this._oShowAllLink.setVisible(this.fSingleRowCallback !== undefined);
		}
	};
	
	/**
	 * search the next missing row index in the givven array of model data
	 * 
	 * @private
	 * @returns {int} row index of missing data else -1
	 */
	ValueHelpDialog.prototype._getMissingRowIndex = function(aModelData) {
		for (var i = 0; i < aModelData.length; i++) {
			if (aModelData[i].missing) {
				return i;
			}
		}
		return -1;
	};
	
	/**
	 * create and return the SelectedItems table
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._getSelectedItemsTable = function() {
		if (!this._oSelectedItemsTable) {
			this._oSelectedItemsTable = this._createSelectedItemsTable();
		}
		return this._oSelectedItemsTable;
	};
	
	/**
	 * create the SelectedItems table
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._createSelectedItemsTable = function() {
		var that = this;
	
		var oTable = new Table({
			title: this._oRb.getText("VALUEHELPDLG_SELECTEDITEMS"),
			selectionBehavior: sap.ui.table.SelectionBehavior.Row,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			noDataText: this._oRb.getText("VALUEHELPDLG_SELECTEDITEMSTABLE_NODATA"),
			rowHeight: 32,
	
			rowSelectionChange: function(oControlEvent) {
				if (that.ignoreSelectionChange) {
					return;
				}
	
				// collect all the new selected or removed items
				var table = oControlEvent.getSource();
	
				var aIndices = oControlEvent.getParameter("rowIndices");
				var i, n = aIndices.length;
				for (i = 0; i < n; i++) {
					var index = aIndices[i];
					var oContext = table.getContextByIndex(index);
					var oRow = oContext ? oContext.getObject() : null;
	
					if (oRow) {
						var sKey = oRow[that.getKey()];
	
						that.ignoreSelectionChange = true;
						if (table.isIndexSelected(index)) {
							that._oSelectedItems.add(sKey, oRow);
							that._addToken2Tokenizer(sKey, that._getFormatedTokenText(sKey), that._oSelectedTokens);
							that._changeTableRowSelectionForKey(sKey, true);
						} else {
							that._oSelectedItems.remove(sKey);
							that._removeTokenFromTokenizer(sKey, that._oSelectedTokens);
							that._changeTableRowSelectionForKey(sKey, false);
						}
						that.ignoreSelectionChange = false;
					}
				}
	
				n = table.getSelectedIndices() ? table.getSelectedIndices().length : 0;
				table.setTitle(that._oRb.getText("VALUEHELPDLG_SELECTEDITEMS", n.toString()));
			}
		}).addStyleClass("compVHSelectedItemsTable");
	
		oTable.bindAggregation("columns", "columns>/cols", function(sId, oContext) {
			return new sap.ui.table.Column(sId, {
				label: "{columns>label}",
				template: new sap.m.Text({
					wrapping: false
				}).bindText(oContext.getProperty("template")),
				width: "{columns>width}"
			});
		});
	
		oTable.bindRows("/");
	
		var oModel = new sap.ui.model.json.JSONModel();
		oTable.setModel(oModel);
	
		return oTable;
	};
	
	// ################################################################################
	// Start main Table handling
	// ################################################################################
	
	/**
	 * create the main table
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._createTable = function() {
		var that = this;
	
		var oTable = new Table({
			title: "Items",
			selectionBehavior: sap.ui.table.SelectionBehavior.Row,
			selectionMode: this.getSupportMultiselect() ? sap.ui.table.SelectionMode.MultiToggle : sap.ui.table.SelectionMode.Single,
			noDataText: this._oRb.getText("VALUEHELPDLG_TABLE_PRESSSEARCH"),
			rowHeight: 32,
			// visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
	
			rowSelectionChange: function(oControlEvent) {
				if (that.ignoreSelectionChange) {
					return;
				}
	
				// collect all the new selected or removed items
				var table = oControlEvent.getSource();
				var aIndices = oControlEvent.getParameter("rowIndices");
				var i, n = aIndices.length;
				var index;
				var oContext;
				var oRow;
	
				for (i = 0; i < n; i++) {
					index = aIndices[i];
					oContext = table.getContextByIndex(index);
					oRow = oContext ? oContext.getObject() : null;
	
					if (!oRow) {
						MessageBox.show(that._oRb.getText("VALUEHELPDLG_SELECTIONFAILED"), {
							icon: MessageBox.Icon.ERROR,
							title: that._oRb.getText("VALUEHELPDLG_SELECTIONFAILEDTITLE"),
							actions: [
								MessageBox.Action.OK
							],
							styleClass: !!this.$().closest(".sapUiSizeCompact").length ? "sapUiSizeCompact" : ""
						});
						return;
					}
				}
	
				var bUsePath = false;
				if (that.theTable.getBinding("rows").aKeys) {
					bUsePath = true;
				}
	
				for (i = 0; i < n; i++) {
					index = aIndices[i];
					oContext = table.getContextByIndex(index);
					oRow = oContext ? oContext.getObject() : null;
	
					if (oRow) {
						var sKey;
						if (bUsePath) {
							sKey = oContext.sPath.substring(1);
						} else {
							sKey = oRow[that.getKey()];
						}
	
						if (table.isIndexSelected(index)) {
							that._oSelectedItems.add(sKey, oRow);
							that._addToken2Tokenizer(sKey, that._getFormatedTokenText(sKey), that._oSelectedTokens);
						} else {
							that._oSelectedItems.remove(sKey);
							that._removeTokenFromTokenizer(sKey, that._oSelectedTokens);
						}
					}
				}
	
				that._updateTitles();
	
				if (!that.getSupportMultiselect()) {
					// in case of single select we fireOk
					that._onCloseAndTakeOverValues()();
				}
			}
		}).addStyleClass("compVHMainTable");
	
		oTable.bindAggregation("columns", "columns>/cols", function(sId, oContext) {
			var ctrl, oTooltip;
	
			// Tooltip is only possible for certain (string) fields
			// ignore it for all types other than string!
			if (oContext.getProperty("type") === "string") {
				oTooltip = {
					path: oContext.getProperty("template")
				};
			}
	
			if (oContext.getProperty("type") === "boolean") {
				ctrl = new sap.m.CheckBox({
					enabled: false,
					selected: {
						path: oContext.getProperty("template")
					}
				});
			} else {
				ctrl = new sap.m.Text({
					wrapping: false,
					text: {
						path: oContext.getProperty("template"),
						type: oContext.getProperty("oType")
					},
					tooltip: oTooltip
				});
			}
	
			return new sap.ui.table.Column(sId, {
				label: "{columns>label}",
				tooltip: "{columns>label}",
				template: ctrl,
				width: "{columns>width}",
				hAlign: ctrl instanceof sap.m.CheckBox ? sap.ui.core.HorizontalAlign.Center : sap.ui.core.HorizontalAlign.Begin,
				// sorting is remove at the moment
				// sortProperty: oContext.getProperty("sort"),
				// sorted: oContext.getProperty("sorted"),
				filterProperty: oContext.getProperty("filter")
			});
		});
	
		this.theTable = oTable;
	};
	
	/**
	 * handler for the Ok close handling. The function prepares the list of all selected items and token and fire the Ok event.
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._onCloseAndTakeOverValues = function() {
		var that = this;
	
		return function(oEvent) {
	
			var fnCallback = function() {
				var range;
				var aTokens = that._oSelectedItems.getSelectedItemsTokenArray(that.getKey(), that.getDescriptionKey(), that.getTokenDisplayBehaviour());
	
				if (that._oSelectedRanges) {
					var i = 0;
					// if the user has changed the ranges we return the new ranges from the selectedRanges
					for ( var rangeId in that._oSelectedRanges) {
						range = that._oSelectedRanges[rangeId];
						var sTokenValue = range.tokenValue;
						if (!sTokenValue) {
							sTokenValue = that._getFormatedRangeTokenText(range.operation, range.value1, range.value2, range.exclude, range.keyField);
						}
	
						if (!range._oGrid || range._oGrid.select.getSelected()) {
							aTokens.push(new Token({
								key: "range_" + i,
								text: sTokenValue,
								tooltip: sTokenValue
							}).data("range", {
								"exclude": range.exclude,
								"operation": range.operation,
								"keyField": range.keyField,
								"value1": range.value1,
								"value2": range.value2
							}));
	
							i++;
						}
					}
				}
	
				that.fireOk({
					"tokens": aTokens
				});
			};
	
			that._validateRanges(fnCallback);
		};
	};
	
	/**
	 * handler for the cancel button. the function fire the Cancel event
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._onCancel = function() {
		var that = this;
	
		return function(oEvent) {
			that.fireCancel();
		};
	};
	
	/**
	 * update all titles (table and tokenizer) of the main view
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._updateTitles = function() {
		this._updateTableTitle();
		this._updateTokenizer();
	};
	
	/**
	 * update title of the main table
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._updateTableTitle = function() {
		var length = 0;
		this.oRows = this.theTable.getBinding("rows");
		var bSupportCount = false; // at the moment we do not support the Items Count in the table header
		if (bSupportCount && this.getModel() && this.getModel().isCountSupported) {
			bSupportCount = this.getModel().isCountSupported();
		}
	
		if (bSupportCount) {
			if (this.oRows) {
				length = this.oRows.getLength();
			}
			this.theTable.setTitle(this._sTableTitle1.replace("{0}", length));
		} else {
			this.theTable.setTitle(this._sTableTitleNoCount);
		}
	};
	
	ValueHelpDialog.prototype.onBeforeRendering = function() {
		Dialog.prototype.onBeforeRendering.apply(this);
	
		this._deregisterMyResizeHandler();
	};
	
	ValueHelpDialog.prototype.onAfterRendering = function() {
		Dialog.prototype.onAfterRendering.apply(this);
	
		if (this.theTable) {
			this._registerMyResizeHandler();
			this._updateTitles();
		}
	};
	
	ValueHelpDialog.prototype.fireAfterOpen = function(p) {
		Dialog.prototype.fireAfterOpen.apply(this);
	
		if (this.theTable) {
			// we have to rerender the table on the value help dialog when we open the dialog to avoid some table render layout problems.
			this.theTable.invalidate();
		}
	
		if (this.getSupportRangesOnly() || this.getFilterMode()) {
			this.setContentHeight(this._iResizeDomHeight + "px");
			this.setContentWidth(this._iResizeDomWidth + "px");
			this._onMyResize();
		}
	};
	
	ValueHelpDialog.prototype.exit = function() {
		this._deregisterMyResizeHandler();
	
		var destroyHelper = function(o) {
			if (o && o.destroy) {
				o.destroy();
			}
			return null;
		};
	
		this._oTokenizerGrid = destroyHelper(this._oTokenizerGrid);
		this._oRanges = destroyHelper(this._oRanges);
		this._oFilterPanel = destroyHelper(this._oFilterPanel);
		this._oSelectedItemsTable = destroyHelper(this._oSelectedItemsTable);
		this.theTable = destroyHelper(this.theTable);
	
		this._aKeys = destroyHelper(this._aKeys);
		this._aRangeKeyFields = destroyHelper(this._aRangeKeyFields);
		this._aIncludeRangeOperations = destroyHelper(this._aIncludeRangeOperations);
		this._aExcludeRangeOperations = destroyHelper(this._aExcludeRangeOperations);
	
		this._oFilterBar = destroyHelper(this._oFilterBar);
	
		this._oRb = destroyHelper(this._oRb);
		this._sTableTitle1 = destroyHelper(this._sTableTitle1);
		this._sTableTitle2 = destroyHelper(this._sTableTitle2);
		this._sTableTitleNoCount = destroyHelper(this._sTableTitleNoCount);
		this._sSelectedItemsTitle = destroyHelper(this._sSelectedItemsTitle);
		this._sNoneSelectedItemsTitle = destroyHelper(this._sNoneSelectedItemsTitle);
	
		this._sValidationDialogTitle = destroyHelper(this._sValidationDialogTitle);
		this._sValidationDialogMessage = destroyHelper(this._sValidationDialogMessage);
		this._sValidationDialogFieldMessage = destroyHelper(this._sValidationDialogFieldMessage);
	
		this._oSelectedItems = destroyHelper(this._oSelectedItems);
		this._oSelectedRanges = destroyHelper(this._oSelectedRanges);
	};
	
	/**
	 * setter for a keys array
	 * 
	 * @public
	 * @since 1.24
	 * @param {array} array of strings with the keys
	 */
	ValueHelpDialog.prototype.setKeys = function(aKeys) {
		this._aKeys = aKeys;
	};
	
	ValueHelpDialog.prototype.getKeys = function() {
		return this._aKeys;
	};
	
	/**
	 * setter for a RangeKeyFields array
	 * 
	 * @public
	 * @since 1.24
	 * @param {array} array of Range KeyFields [{key: "CompanyCode", label: "ID"}, {key:"CompanyName", label : "Name"}]
	 */
	ValueHelpDialog.prototype.setRangeKeyFields = function(aRangeKeyFields) {
		this._aRangeKeyFields = aRangeKeyFields;
	};
	
	ValueHelpDialog.prototype.getRangeKeyFields = function() {
		return this._aRangeKeyFields;
	};
	
	/**
	 * setter for the supported Include range operations array
	 * 
	 * @public
	 * @since 1.24
	 * @param {array} array of Range operations [sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.BT,
	 *        sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EQ]
	 */
	ValueHelpDialog.prototype.setIncludeRangeOperations = function(aOperation) {
		this._aIncludeRangeOperations = aOperation;
	
		if (this._oFilterPanel) {
			this._oFilterPanel.setIncludeOperations(this._aIncludeRangeOperations);
		}
	};
	
	/**
	 * setter for the supported Exclude range operations array
	 * 
	 * @public
	 * @since 1.24
	 * @param {array} array of Range operations [sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.BT,
	 *        sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EQ]
	 */
	ValueHelpDialog.prototype.setExcludeRangeOperations = function(aOperation) {
		this._aExcludeRangeOperations = aOperation;
	
		if (this._oFilterPanel) {
			this._oFilterPanel.setExcludeOperations(this._aExcludeRangeOperations);
		}
	};
	
	/**
	 * creating a key for the table row
	 * 
	 * @internal
	 * @param {string} sKey is the key of the row in the table
	 * @returns {string} with the row key of the element in the table
	 */
	ValueHelpDialog.prototype._createRowKey = function(sKey) {
		var path = this.oRows.sPath;
		var sParams = "";
		var aKeys = this.getKeys();
		var i, n = aKeys.length;
	
		if (path[0] === "/") {
			path = path.substr(1);
		}
		for (i = 0; i < n; i++) {
			if (i > 0) {
				sParams += ",";
			}
			if (n > 1) {
				sParams += aKeys[i] + "=";
			}
			sParams += "'" + ((aKeys[i] === this.getKey()) ? sKey : ".*") + "'";
		}
	
		return path + "\\(" + sParams + "\\)";
	};
	
	/**
	 * creates and returns the Token text for the selected item
	 * 
	 * @private
	 * @param {string} sKey the key of the selectedItems item
	 * @returns {string} the token text for the selected items with the sKey
	 */
	ValueHelpDialog.prototype._getFormatedTokenText = function(sKey) {
		var oItem = this._oSelectedItems.getItem(sKey);
		var sTokenText = oItem[this.getDescriptionKey()];
		var sDisplayKey = oItem[this.getKey()];
		if (sTokenText === undefined) {
			if (typeof oItem === "string") {
				sTokenText = oItem;
			} else {
				sTokenText = sKey;
			}
		} else {
			if (sTokenText === "") {
				sTokenText = sKey;
			} else {
				// We call the require here since external applications using the ValueHelpDialog shouldn't need to require anything else.
				// TODO: Remove this once we move this logic to an Util
				jQuery.sap.require("sap.ui.comp.smartfilterbar.FilterProvider");
				sTokenText = sap.ui.comp.smartfilterbar.FilterProvider.getFormattedExpressionFromDisplayBehaviour(this.getTokenDisplayBehaviour() ? this.getTokenDisplayBehaviour() : sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.descriptionAndId, sDisplayKey, sTokenText);
			}
		}
	
		return sTokenText;
	};
	
	/**
	 * creates and returns the Token text for a range
	 * 
	 * @private
	 * @param {string} sOperation the operation type sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation
	 * @param {string} sValue1 text of the first range field
	 * @param {string} sValue2 text of the seoncd range field
	 * @param {boolean} bExclude indicates if the range is a Exclude range
	 * @param {string} sKeyField id
	 * @returns {string} the range token text
	 */
	ValueHelpDialog.prototype._getFormatedRangeTokenText = function(sOperation, sValue1, sValue2, bExclude, sKeyField) {
		var sTokenText = "";
		var oCurrentKeyField;
		var oFormatter;
		
		if (this._aRangeKeyFields && this._aRangeKeyFields.length > 1) {
			// search the current KeyField 
			for (var i = 0; i < this._aRangeKeyFields.length; i++) {
				oCurrentKeyField = this._aRangeKeyFields[i];
				if (typeof oCurrentKeyField !== "string") {
					if (oCurrentKeyField.key === sKeyField) {
						break;
					}
				}
			}
		}
	
		if (oCurrentKeyField) {
			switch (oCurrentKeyField.type) {
				case "numeric":
					var oFloatFormatOptions;
					if (oCurrentKeyField.precision || oCurrentKeyField.scale) {
						oFloatFormatOptions = {};
						if (oCurrentKeyField.precision) {
							oFloatFormatOptions["maxIntegerDigits"] = parseInt(oCurrentKeyField.precision, 10);
						}
						if (oCurrentKeyField.scale) {
							oFloatFormatOptions["maxFractionDigits"] = parseInt(oCurrentKeyField.scale, 10);
						}
					}
					oFormatter = NumberFormat.getFloatInstance(oFloatFormatOptions);
					break;
				case "date":
					oFormatter = DateFormat.getDateInstance();
					break;
			}
			
			if (oFormatter) {
				if (sValue1) {
					sValue1 = oFormatter.format(sValue1);
				}
				if (sValue2) {
					sValue2 = oFormatter.format(sValue2);
				}
			}
		}
		
		if (sValue1 !== "") {
			switch (sOperation) {
				case sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.Initial:
					sTokenText = "=''";
					break;
				case sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EQ:
					sTokenText = "=" + sValue1;
					break;
				case sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.GT:
					sTokenText = ">" + sValue1;
					break;
				case sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.GE:
					sTokenText = ">=" + sValue1;
					break;
	
				case sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.LT:
					sTokenText = "<" + sValue1;
					break;
	
				case sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.LE:
					sTokenText = "<=" + sValue1;
					break;
	
				case sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.Contains:
					sTokenText = "*" + sValue1 + "*";
					break;
	
				case sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.StartsWith:
					sTokenText = sValue1 + "*";
					break;
	
				case sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EndsWith:
					sTokenText = "*" + sValue1;
					break;
	
				case sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.BT:
					if (sValue2 !== "") {
						sTokenText = sValue1 + "..." + sValue2;
						break;
					}
			}
	
		}
	
		if (bExclude && sTokenText !== "") {
			sTokenText = "!(" + sTokenText + ")";
		}
	
		if (oCurrentKeyField && oCurrentKeyField.label && sTokenText !== "") {
			sTokenText = oCurrentKeyField.label + ": " + sTokenText;
		}
	
		return sTokenText;
	};
	
	ValueHelpDialog.prototype._onMyResize = function() {
		if (!this.getDomRef("scroll")) {
			return;
		}
	
		if (this._oRangeScrollContainer) {
			var iTokensHeight = this._oTokenizerGrid.getDomRef() ? this._oTokenizerGrid.getDomRef().offsetHeight : 0;
			var iScrollHeight = this.getDomRef("scroll").offsetHeight;
			this._oRangeScrollContainer.$().css("height", (iScrollHeight - iTokensHeight) + "px");
		}
	
	};
	
	ValueHelpDialog.prototype._reposition = function() {
		Dialog.prototype._reposition.apply(this);
	
		this._onMyResize();
	};
	
	Dialog.prototype._deregisterMyResizeHandler = function() {
		if (this._sResizeListenerId2) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId2);
			this._sResizeListenerId2 = null;
		}
	};
	
	ValueHelpDialog.prototype._registerMyResizeHandler = function() {
		if (!this._fnMyContentResize) {
			this._fnMyContentResize = jQuery.proxy(this._onMyResize, this);
		}
	
		if (!this._sResizeListenerId2 && this.getDomRef()) {
			var oResizeDomRef = this.getDomRef("scroll");
			this._sResizeListenerId2 = sap.ui.core.ResizeHandler.register(oResizeDomRef, this._fnMyContentResize);
		}
	};
	
	sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation = {
		BT: "BT",
		EQ: "EQ",
		Contains: "Contains",
		StartsWith: "StartsWith",
		EndsWith: "EndsWith",
		LT: "LT",
		LE: "LE",
		GT: "GT",
		GE: "GE",
		Initial: "Initial"
	};
	

	return ValueHelpDialog;

}, /* bExport= */ true);
