/* eslint-disable strict */

/*
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides Controller
sap.ui.define([
	'jquery.sap.global', 'sap/ui/base/ManagedObject', './ColumnsController', './FilterController', './GroupController', './SortController', './Util'
], function(jQuery, ManagedObject, ColumnsController, FilterController, GroupController, SortController, Util) {
	"use strict";

	/**
	 * Constructor for a new controller of P13nDialog.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The personalization Controller provides capabilities in order to orchestrate the P13nDialog.
	 * @extends sap.ui.base.ManagedObject
	 * @author SAP SE
	 * @version 1.28.1
	 * @constructor
	 * @experimental This module is only for internal/experimental use!
	 * @private
	 * @since 1.26.0
	 * @alias sap.ui.comp.personalization.Controller
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Controller = ManagedObject.extend("sap.ui.comp.personalization.Controller", /** @lends sap.ui.comp.personalization.Controller */
	{
		constructor: function(sId, mSettings) {
			ManagedObject.apply(this, arguments);
		},
		metadata: {
			publicMethods: [
				"setPersonalizationData"
			],
			properties: {

				/**
				 * For each panel 'visible' and 'payload' attributes can be regulated.
				 */
				setting: {
					type: "object",
					defaultValue: null
				},
				/**
				 * The current state can be set back either to the state of initial table (ResetFull) or to the specific state of the table
				 * (ResetPartial) which has been set via setPersonalizationData method
				 */
				resetToInitialTableState: {
					type: "boolean",
					defaultValue: true
				}
			},
			associations: {
				/**
				 * Table on which the personalization will be performed
				 */
				table: {
					type: "sap.ui.core.Control",
					multiple: false
				}
			},
			events: {
				/**
				 * When table is manipulated directly like e.g. column move, column resize etc. this event is raised before the action has been
				 * finished. There is no guarantee that table is really changed. E.g. touched column could be moved to a new position or could also be
				 * dropped at the old position.
				 */
				beforePotentialTableChange: {},
				/**
				 * When table is manipulated directly like e.g. column move, column resize etc. this event is raised after the action has been
				 * finished. There is no guarantee that table is really changed. E.g. touched column could be moved to a new position or could also be
				 * dropped at the old position.
				 */
				afterPotentialTableChange: {},

				/**
				 * Event is fired when the personalization model data are changed
				 */
				afterP13nModelDataChange: {
					parameters: {
						/**
						 * Reason for change
						 */
						changeReason: {
							type: "sap.ui.comp.personalization.Controller.ChangeReason"
						},
						/**
						 * Fragment of model data in JSON format which is relevant for persistence.
						 */
						persistentData: {
							type: "object"
						},
						/**
						 * Fragment of model data in JSON format which has been changed since last 'afterP13nModelDataChange' event was raised.
						 * Consumer of personalization dialog has to react on it in order to 'sort' or 'filter' the table.
						 */
						changeData: {
							type: "object"
						},
						/**
						 * Information about what has been changed since last 'afterP13nModelDataChange' event was raised. Consumer of personalization
						 * dialog has to react on it in order to 'sort' or 'filter' the table.
						 */
						changeType: {
							type: "sap.ui.comp.personalization.Controller.ChangeType"
						},
						/**
						 * Information about what has been changed since last variant was set. Consumer of personalization dialog has to react on it
						 * in order to show dirty flag.
						 */
						changeTypeVariant: {
							type: "sap.ui.comp.personalization.Controller.ChangeType"
						}
					}
				}
			},
			library: "sap.ui.comp"
		}

	});

	/**
	 * Setter for 'setting' property. With 'setting' for each panel can be defined whether a panel should be considered. If no setting for a panel is
	 * defined the default panel will be taking over. Once controller setting is set, the personalization dialog will show defined number of panels
	 * according to the settingObject.
	 * 
	 * @overwrite
	 * @function
	 * @sap.ui.comp.personalization.Controller.prototype.setSetting
	 * @param {object} oSetting contains panel settings, like: visibility
	 * @returns {object} actual controller instance: this
	 */
	Controller.prototype.setSetting = function(oSetting) {
		oSetting = this.validateProperty("setting", oSetting);
		this.setProperty("setting", oSetting, true); // no rerendering
		if (!oSetting) {
			return this;
		}

		this._checkIfGroupingAllowed();

		this._oSettingCurrent = Util.copy(this._oSettingOriginal);

		for ( var type in oSetting) {
			if (oSetting[type].visible === false) {
				delete this._oSettingCurrent[type];
				continue;
			}
			if (oSetting[type].visible && this._oSettingCurrent[type] && this._oSettingCurrent[type].visible) {
				this._oSettingCurrent[type].controller = oSetting[type].controller ? oSetting[type].controller : this._oSettingCurrent[type].controller;
				if (oSetting[type].payload) {
					this._oSettingCurrent[type].payload = oSetting[type].payload;
				}
			}
		}

		this._masterSync(Controller.SyncReason.NewSetting, null);
		return this;
	};

	/**
	 * @overwrite
	 * @function
	 * @sap.ui.comp.personalization.Controller.prototype.setTable
	 * @param {object} oTable contains the table instance for that personalization is done
	 * @returns {object} actual controller instance: this
	 */
	Controller.prototype.setTable = function(oTable) {
		this.setAssociation("table", oTable);
		if (!oTable) {
			return this;
		}

		this._checkIfGroupingAllowed();

		var aColumns = this.getTable().getColumns();

		if (!Util.isConsistent(aColumns)) {
			throw "The table instance provided contain some columns for which a columnKey is provided, some for which a columnKey is not provided. This is not allowed ! ";
		}

		this._masterSync(Controller.SyncReason.NewTable, null);
		return this;
	};

	Controller.prototype.getTable = function() {
		var oTable = this.getAssociation("table");
		if (typeof oTable === "string") {
			oTable = sap.ui.getCore().byId(oTable);
		}
		return oTable;
	};

	Controller.prototype.getModel = function() {
		return this._oModel;
	};

	/**
	 * Initializes the personalization Controller instance after creation.
	 * 
	 * @protected
	 */
	Controller.prototype.init = function() {
		var that = this;
		this._oDialog = null;
		this._oPayload = null;
		this._oPersistentDataRestore = null;
		this._oPersistentDataCurrentVariant = null;
		this._oPersistentDataAlreadyKnown = null;
		this._oPersistentDataBeforeOpen = null;
		this._oModel = null;

		// default: all panels are set to visible

		// NOTE: instantiating the sub-Controllers only when opening the dialog is
		// too late since personalization data could be set before this and we expect
		// sub-Controllers to handle these data
		this._oSettingOriginal = {
			columns: {
				controller: new ColumnsController({
					afterColumnsModelDataChange: function(oEvent) {
						that._fireChangeEvent();
					},
					beforePotentialTableChange: function(oEvent) {
						that.fireBeforePotentialTableChange();
					},
					afterPotentialTableChange: function(oEvent) {
						that.fireAfterPotentialTableChange();
					}
				}),
				visible: true
			},
			sort: {
				controller: new SortController({
					afterSortModelDataChange: function(oEvent) {
						that._fireChangeEvent();
					},
					beforePotentialTableChange: function(oEvent) {
						that.fireBeforePotentialTableChange();
					},
					afterPotentialTableChange: function(oEvent) {
						that.fireAfterPotentialTableChange();
					}
				}),
				visible: true
			},
			filter: {
				controller: new FilterController({
					afterFilterModelDataChange: function(oEvent) {
						that._fireChangeEvent();
					},
					beforePotentialTableChange: function(oEvent) {
						that.fireBeforePotentialTableChange();
					},
					afterPotentialTableChange: function(oEvent) {
						that.fireAfterPotentialTableChange();
					}
				}),
				visible: true
			},
			group: {
				controller: new GroupController({
					afterGroupModelDataChange: function(oEvent) {
						that._fireChangeEvent();
					},
					beforePotentialTableChange: function(oEvent) {
						that.fireBeforePotentialTableChange();
					},
					afterPotentialTableChange: function(oEvent) {
						that.fireAfterPotentialTableChange();
					}
				}),
				visible: true
			}
		};

		this._oSettingCurrent = Util.copy(this._oSettingOriginal);
		this._oInitialVisiblePanelType = this._getInitialVisiblePanelType();
	};

	/**
	 * Special case for tables of type sap.ui.table.Table (with exception of AnalyticalTable) Currently sap.ui.table.Table does not support grouping
	 * feature as expected!
	 */
	Controller.prototype._checkIfGroupingAllowed = function() {
		var oTable = this.getTable();
		if (oTable && oTable instanceof sap.ui.table.Table && !(oTable instanceof sap.ui.table.AnalyticalTable)) {
			delete this._oSettingCurrent.group;
		}
	};

	/**
	 * Opens the personalization dialog
	 * 
	 * @param {object} oSettingsForOpen contains additional settings information for opening the dialog with its panels
	 */
	Controller.prototype.openDialog = function(oSettingsForOpen) {

		this._oDialog = new sap.m.P13nDialog({
			stretch: sap.ui.Device.system.phone,
			showReset: true,
			initialVisiblePanelType: this._oInitialVisiblePanelType
		});

		// Set compact style class if the table is compact too
		this._oDialog.toggleStyleClass("sapUiSizeCompact", !!jQuery(this.getTable().getDomRef()).closest(".sapUiSizeCompact").length);

		var oSettingForOpen = this._mixSetting(this._oSettingCurrent, oSettingsForOpen);

		var oPanels = this._callControllers(oSettingForOpen, "getPanel");
		for ( var type in oSettingForOpen) {
			if (oPanels[type]) {
				this._oDialog.addPanel(oPanels[type]);
			}
		}

		this._oPersistentDataBeforeOpen = this._getPersistentDataCopy();

		this._oDialog.attachOk(this._handleDialogOk, this);
		this._oDialog.attachCancel(this._handleDialogCancel, this);
		this._oDialog.attachReset(this._handleDialogReset, this);
		this._oDialog.attachAfterClose(this._handleDialogAfterClose, this);

		this._oDialog.open();
	};

	Controller.prototype._mixSetting = function(oSettingGlobal, oSetting) {
		if (!oSetting) {
			return oSettingGlobal;
		}
		for ( var type in oSetting) {
			if (oSetting[type].visible && oSettingGlobal[type] && oSettingGlobal[type].visible) {
				oSetting[type].controller = oSettingGlobal[type].controller;
				// Payload on oSetting has higher priority then payload on oSettingGlobal
				if (!oSetting[type].payload) {
					oSetting[type].payload = oSettingGlobal[type].payload;
				}
			}
		}
		return oSetting;
	};

	sap.ui.comp.personalization.Controller.prototype._getSettingOfVisiblePanels = function() {
		if (!this._oDialog) {
			return;
		}
		var oSetting = {};
		this._oDialog.getPanels().forEach(function(oPanel) {
			var sType = oPanel.getType();
			oSetting[sType] = {
				controller: this._oSettingCurrent[sType].controller,
				visible: oPanel.getVisible()
			};
		}, this);
		return oSetting;
	};

	Controller.prototype._getPersistentDataCopy = function() {
		var oPersistentData = {};
		if (this.getModel() && this.getModel().getData().persistentData) {
			oPersistentData = Util.copy(this.getModel().getData().persistentData);
		}
		return oPersistentData;
	};

	/**
	 * Setter for personalization model
	 * 
	 * @param{object} oNewPersistentData contains personalization data that is taken over into the model
	 */
	Controller.prototype.setPersonalizationData = function(oNewPersistentData) {
		if (!this._sanityCheck(oNewPersistentData)) {
			return;
		}

		var oCurrentPersistentData = this._callControllers(this._oSettingCurrent, "getUnionData", Util.copy(this._oPersistentDataRestore), Util.copy(oNewPersistentData));

		this._masterSync(Controller.SyncReason.NewModelData, oCurrentPersistentData);

		if (this.getTable() && this.getTable().setFixedColumnCount) {
			this.getTable().setFixedColumnCount(0);
		}

		this._fireChangeEvent();

		// Note: this._oPersistentDataAlreadyKnown is already set up to date in _fireChangeEvent()
	};

	/**
	 * Handle the dialog "reset" event
	 * 
	 * @param {object} oEvent is of type sap.ui.base.Event and contains information about source object where event was raised
	 */
	Controller.prototype._handleDialogReset = function(oEvent) {
		if (this.getResetToInitialTableState()) {
			this._masterSync(Controller.SyncReason.ResetModelData, null);
		} else {
			this._masterSync(Controller.SyncReason.ResetModelDataVariant, null);
		}

		this._callControllers(this._getSettingOfVisiblePanels(), "onAfterReset", oEvent.getParameter("payload"));

		// Note: do not fire event since triggering reset does not mean that this reset will be actually submitted. Could even consider to hold back
		// _masterSync (?)

	};

	/**
	 * Handle the dialog "close" event
	 * 
	 * @param {object} oEvent is of type sap.ui.base.Event and contains information about source object where event was raised
	 */
	Controller.prototype._handleDialogCancel = function(oEvent) {

		this._oDialog.detachCancel(this._handleDialogCancel, this);

		this._oInitialVisiblePanelType = this._oDialog.getVisiblePanel() ? this._oDialog.getVisiblePanel().getType() : this._getInitialVisiblePanelType();

		this._oDialog.close();
	};

	/**
	 * Handle the dialog "ok" event
	 * 
	 * @param {object} oEvent is of type sap.ui.base.Event and contains information about source object where event was raised
	 */
	Controller.prototype._handleDialogOk = function(oEvent) {

		this._oDialog.detachOk(this._handleDialogOk, this);

		// TODO: consider to improve this ! Perhaps better to transport payload as custom data on dialog though then we must potentially take more
		// care about life cycle of the dialog
		this._oPayload = {
			trigger: "ok",
			payload: oEvent.getParameter("payload")
		};

		// Store the latest open panel
		this._oInitialVisiblePanelType = this._oDialog.getVisiblePanel() ? this._oDialog.getVisiblePanel().getType() : this._getInitialVisiblePanelType();

		this._oDialog.close();
	};

	/**
	 * Get first property of current setting object
	 * 
	 * @returns {string} that represents the panel type
	 */
	Controller.prototype._getInitialVisiblePanelType = function() {
		for ( var type in this._oSettingCurrent) {
			return type;
		}
	};

	Controller.prototype._handleDialogAfterClose = function() {
		var that = this;
		var _oPayload = this._oPayload;

		if (_oPayload && _oPayload.trigger === "ok") {
			setTimeout(function() {
				var oSettingOfVisiblePanels = that._getSettingOfVisiblePanels();
				if (that._oDialog) {
					that._oDialog.destroy();
					that._oDialog = null;
				}

				that._callControllers(oSettingOfVisiblePanels, "onAfterSubmit", that._oPayload.payload);
				that._oPayload = null;
				that._fireChangeEvent();
				that._oPersistentDataBeforeOpen = null;
			}, 0);

		} else {
			setTimeout(function() {
				if (that._oDialog) {
					that._oDialog.destroy();
					that._oDialog = null;
				}
				// call _masterSync only after dialog has been closed and destroyed, otherwise changing the model will update the
				// dialog's bindings which causes performance issues
				that._masterSync(Controller.SyncReason.NewModelData, that._oPersistentDataBeforeOpen);
				that._oPersistentDataBeforeOpen = null;
			}, 0);

		}

	};

	/**
	 * setSetting might be called after setTable() is called. So we should avoid to communicate with MiniControllers before the MiniControllers are
	 * not finally defined!
	 * 
	 * @param {string} sUseCase for execution of masterSync
	 * @param {object} oNewPersistentData
	 */
	Controller.prototype._masterSync = function(sUseCase, oNewPersistentData) {
		var type = null, oJson = null;
		
		switch (sUseCase) {
			case Controller.SyncReason.NewTable:

				this.initializeModel();
				// e.g. set up event handlers based on table instance
				this._callControllers(this._oSettingCurrent, "setTable", this.getTable());

				// take snapshot of table so that we can restore this state later
				this._callControllers(this._oSettingCurrent, "createTableRestoreJson");

				// Set model binding size dependent of column length in model data.
				// This is necessary as otherwise the table does show maximum 100 items.
				// We assume that filter with more than 1000 conditions is unrealistic
				this.getModel().setSizeLimit(this.getTable().getColumns().length + 1000);

				// no new persistent data was provided from outside - in this case the table instance represent the correct
				// state of persistent data which is why we update the persistent data from the table. There are limitations though,
				// since we cannot ask the table for filter and sort info e.g.
				this._callControllers(this._oSettingCurrent, "syncTable2PersistentModel");

				// re-build transient data to reflect 'final' state of table (TODO: lazy optimization possible, i.e. move to
				// getPanel e.g.)
				this._callControllers(this._oSettingCurrent, "syncTable2TransientModel");

				// Copy the current table state in order to put back in case that it is needed (aka standard variant).
				oJson = this._callControllers(this._oSettingCurrent, "getTableRestoreJson");
				this._oPersistentDataRestore = Util.copy(oJson);

				this._oPersistentDataCurrentVariant = this._getPersistentDataCopy();
				// ??ER this._oPersistentDataCurrentVariant = Util.copy(this._oPersistentDataRestore); <---- couldn't this be wrong if we have a
				// different variant already active ???

				// Notice that _getPersistentDataCopy() is equal to <subController>._getTable2Json
				this._oPersistentDataAlreadyKnown = Util.copy(this._oPersistentDataRestore);
				break;

			case Controller.SyncReason.NewSetting:

				this.initializeModel();
				// e.g. set up event handlers based on table instance
				if (this.getTable()) {
					this._callControllers(this._oSettingCurrent, "setTable", this.getTable());
					this.getModel().setSizeLimit(this.getTable().getColumns().length + 1000);
				}

				// take snapshot of table so that we can restore this state later
				this._callControllers(this._oSettingCurrent, "createTableRestoreJson");

				// no new persistent data was provided from outside - in this case the table instance represent the correct
				// state of persistent data which is why we update the persistent data from the table. There are limitations though,
				// since we cannot ask the table for filter and sort info e.g.
				this._callControllers(this._oSettingCurrent, "syncTable2PersistentModel");

				// re-build transient data to reflect 'final' state of table (TODO: lazy optimization possible, i.e. move to
				// getPanel e.g.)
				this._callControllers(this._oSettingCurrent, "syncTable2TransientModel");

				// Copy the current table state in order to put back in case that it is needed (aka standard variant).
				oJson = this._callControllers(this._oSettingCurrent, "getTableRestoreJson");
				this._oPersistentDataRestore = Util.copy(oJson);

				this._oPersistentDataCurrentVariant = this._getPersistentDataCopy();
				// ??ER this._oPersistentDataCurrentVariant = Util.copy(this._oPersistentDataRestore); <---- couldn't this be wrong if we have a
				// different variant already active ???

				// Notice that _getPersistentDataCopy() is equal to <subController>._getTable2Json
				this._oPersistentDataAlreadyKnown = Util.copy(this._oPersistentDataRestore);

				// Reduce data to current setting in case that setSetting() is called after setTable()
				for ( type in this._oPersistentDataRestore) {
					if (!this._oSettingCurrent[type]) {
						delete this._oPersistentDataRestore[type];
					}
				}
				// Reduce data to current setting in case that setSetting() is called after setTable()
				for ( type in this._oPersistentDataAlreadyKnown) {
					if (!this._oSettingCurrent[type]) {
						delete this._oPersistentDataAlreadyKnown[type];
					}
				}
				// Reduce data to current setting in case that setSetting() is called after setTable()
				for ( type in this._oPersistentDataCurrentVariant) {
					if (!this._oSettingCurrent[type]) {
						delete this._oPersistentDataCurrentVariant[type];
					}
				}
				break;

			case Controller.SyncReason.NewModelData:

				this.initializeModel(oNewPersistentData);

				// Note: when calling syncJsonModel2Table we need to ensure that we enrich oNewPersistentData with the
				// _oPersistentDataRestore (think of the example in which oNewPersistentData is empty then the table wouldn't be changed)
				var oPersistentDataTotal = this._callControllers(this._oSettingCurrent, "getUnionData", Util.copy(this._oPersistentDataRestore), Util.copy(oNewPersistentData));
				this._callControllers(this._oSettingCurrent, "syncJsonModel2Table", oPersistentDataTotal);
				// old: this._callControllers(this._oSettingCurrent, "syncJsonModel2Table", this.getModel().getData().persistentData);

				this._callControllers(this._oSettingCurrent, "reducePersistentModel");

				// re-build transient data to reflect 'final' state of table (TODO: lazy optimization possible, i.e. move to
				// getPanel e.g.)
				this._callControllers(this._oSettingCurrent, "syncTable2TransientModel");

				this._oPersistentDataCurrentVariant = this._getPersistentDataCopy();
				// ??ER this._oPersistentDataCurrentVariant = Util.copy(oNewPersistentData); <---- should be the same as above ...

				// Note: since the consumer in this case also wants the change events, we do *not* update the
				// _oPersistentDataAlreadyKnown here
				// this._oPersistentDataAlreadyKnown = this._getPersistentDataCopy();
				break;

			case Controller.SyncReason.ResetModelData:

				this.initializeModel(this._oPersistentDataRestore);

				// Note: persistentData to table is not enough since we must first revert table back to restore version - remember
				// oNewPersistentData is restore!
				this._callControllers(this._oSettingCurrent, "syncJsonModel2Table", Util.copy(this._oPersistentDataRestore));

				this._callControllers(this._oSettingCurrent, "reducePersistentModel");

				// re-build transient data to reflect 'final' state of table (TODO: lazy optimization possible, i.e. move to
				// getPanel e.g.)
				this._callControllers(this._oSettingCurrent, "syncTable2TransientModel");

				this._oPersistentDataCurrentVariant = this._getPersistentDataCopy(); // ($)
				// ??ER this._oPersistentDataCurrentVariant = Util.copy(this._oPersistentDataRestore); <---- would not be correct if we have already
				// called setPersonalizationData and also set resetToInitialTableState to true (could not happen with SmartTable) because then our
				// variant info would get lost - also the coding ($) might not be OK (?)

				// Note: since the consumer in this case also want the change events, we do *not* update the
				// _oPersistentDataAlreadyKnown here
				// this._oPersistentDataAlreadyKnown = this._getPersistentDataCopy();
				break;

			case Controller.SyncReason.ResetModelDataVariant:

				this.initializeModel(this._oPersistentDataCurrentVariant);

				// Note: when calling syncJsonModel2Table we need to ensure that we enrich _oPersistentDataCurrentVariant with the
				// _oPersistentDataRestore (think of the example in which _oPersistentDataCurrentVariant is empty then the table wouldn't be
				// changed). This comment is similar to the one for "case Controller.SyncReason.ResetModelData:".
				var oPersistentDataCurrentVariantTotal = this._callControllers(this._oSettingCurrent, "getUnionData", Util.copy(this._oPersistentDataRestore), Util.copy(this._oPersistentDataCurrentVariant));
				this._callControllers(this._oSettingCurrent, "syncJsonModel2Table", oPersistentDataCurrentVariantTotal);
				// this._callControllers(this._oSettingCurrent, "syncJsonModel2Table", Util.copy(this._oPersistentDataCurrentVariant));

				this._callControllers(this._oSettingCurrent, "reducePersistentModel");

				this._callControllers(this._oSettingCurrent, "syncTable2TransientModel");

				// Note: since the consumer in this case also want the change events, we do *not* update the
				// _oPersistentDataAlreadyKnown here
				// this._oPersistentDataAlreadyKnown = this._getPersistentDataCopy();

				break;
		}
		this.getModel().refresh();
	};

	/**
	 * @param {object} oNewPersistentData for initializing the model
	 */
	Controller.prototype.initializeModel = function(oNewPersistentData) {
		if (!this.getModel()) {
			this._oModel = new sap.ui.model.json.JSONModel();
			this._oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		}

		var oNewPersistentDataCopy = null;
		if (oNewPersistentData) {
			oNewPersistentDataCopy = Util.copy(oNewPersistentData);
		}

		var oCurrentPersistentData = oNewPersistentDataCopy || ((this.getModel().getData() && this.getModel().getData().persistentData) ? this.getModel().getData().persistentData : {});

		// Reduce persistent data to current setting
		for ( var type in oCurrentPersistentData) {
			if (!this._oSettingCurrent[type]) {
				delete oCurrentPersistentData[type];
			}
		}

		this.getModel().setData({
			transientData: {},
			persistentData: oCurrentPersistentData
		});

		this._callControllers(this._oSettingCurrent, "initializeModel", this.getModel());
	};

	/**
	 * Fire 'afterP13nModelDataChange' event with model data and change information.
	 * 
	 * @param {object} oChangeReason contains the reason why/what was changed, see: sap.ui.comp.personalization.Controller.ChangeReason
	 */
	Controller.prototype._fireChangeEvent = function(oChangeReason) {
		var oChangeInformation = {};
		// relevant change for consumer, delta : (restore + persistent) - oPersistentDataAlreadyKnown

		// oPersistentDataTotal : = restore + persistent, i.e. delta = oPersistentDataTotal - oPersistentDataAlreadyKnown
		var oPersistentDataTotal = this._callControllers(this._oSettingCurrent, "getUnionData", Util.copy(this._oPersistentDataRestore), this._getPersistentDataCopy());

		var oChangeType = this._callControllers(this._oSettingCurrent, "getChangeType", oPersistentDataTotal, Util.copy(this._oPersistentDataAlreadyKnown));
		if (!Util.hasChangedType(oChangeType)) {
			return;
		}

		if (oChangeReason === Controller.ChangeReason.ResetFull || oChangeReason === Controller.ChangeReason.ResetPartial) { // ||
			// oChangeReason
			// ===
			// sap.ui.comp.personalization.Controller.ChangeReason.SetPersonalizationDataCalled)
			// {
			oChangeInformation.changeReason = oChangeReason;
		}

		var oPersistentDataAlreadyKnownCopy = Util.copy(this._oPersistentDataAlreadyKnown);
		oChangeInformation.changeType = this._callControllers(this._oSettingCurrent, "getChangeType", oPersistentDataTotal, oPersistentDataAlreadyKnownCopy);
		oChangeInformation.changeData = this._callControllers(this._oSettingCurrent, "getChangeData", oPersistentDataTotal, oPersistentDataAlreadyKnownCopy);

		var oPersistentDataCurrentVariantTotal = this._callControllers(this._oSettingCurrent, "getUnionData", Util.copy(this._oPersistentDataRestore), Util.copy(this._oPersistentDataCurrentVariant));

		oChangeInformation.changeTypeVariant = this._callControllers(this._oSettingCurrent, "getChangeType", oPersistentDataTotal, oPersistentDataCurrentVariantTotal);

		var oPersistentDataRestoreCopy = Util.copy(this._oPersistentDataRestore);
		oChangeInformation.persistentData = this._callControllers(this._oSettingCurrent, "getChangeData", oPersistentDataTotal, oPersistentDataRestoreCopy);

		this.fireAfterP13nModelDataChange(oChangeInformation);

		// calculate new version of 'AlreadyKnown' by adding above calculated 'small' delta to 'AlreadyKnown'
		this._oPersistentDataAlreadyKnown = this._callControllers(this._oSettingCurrent, "getUnionData", Util.copy(this._oPersistentDataAlreadyKnown), Util.copy(oChangeInformation.changeData));
	};

	/**
	 * In case of 'null' or undefined the state of the table is put back to the state at the time of the last setTable() call.
	 */
	Controller.prototype.resetPersonalization = function() {

		// TODO: compare with _handleDialogReset: make common method and parameter 'silent' 'isOpen'

		if (this.getResetToInitialTableState()) {
			this._masterSync(Controller.SyncReason.ResetModelData, null);
			this._fireChangeEvent(sap.ui.comp.personalization.Controller.ChangeReason.ResetFull);
		} else {
			this._masterSync(Controller.SyncReason.ResetModelDataVariant, null);
			this._fireChangeEvent(sap.ui.comp.personalization.Controller.ChangeReason.ResetPartial);
		}

/*
 * original coding: this._masterSync(Controller.SyncReason.ResetModelData, null); this._fireChangeEvent(Controller.ChangeReason.ResetFull); //
 * this._oPersistentDataAlreadyKnown is already set up to date in _fireChangeEvent()
 */

	};

	/**
	 * Get arguments of corresponding type
	 * 
	 * @param {array} aArgs contains all arguments wherein the search for type shall happen
	 * @param {string} sType is the type for that in arguments shall be searched
	 * @returns {array} aResult contains the identified arguments
	 */
	Controller.prototype._getArgumentsByType = function(aArgs, sType) {
		var aResult = [], oObject = null;

		if (aArgs && aArgs.length && sType) {
			aArgs.forEach(function(oArg) {
				if (oArg && oArg[sType] && typeof oArg[sType] !== "function") {
					oObject = {};
					oObject[sType] = oArg[sType];
					aResult.push(oObject);
				} else {
					aResult.push(oArg);
				}
			});
		}

		return aResult;
	};

	/**
	 * Call a method "sMethodName" of all controllers in generic way
	 * 
	 * @param {string} oSettings contains additional setting for execution of mini-controller methods
	 * @param {string} sMethodName that shall be executed in the mini-controller
	 * @returns {object} oResult contains the result of the called mini-controller method
	 */
	Controller.prototype._callControllers = function(oSettings, sMethodName) {
		var type = null, oSetting = null, oController = null, aArgsPartially = null;
		var oResults = {}, aArgs = Array.prototype.slice.call(arguments, 2);

		for (type in oSettings) {
			oSetting = oController = aArgsPartially = null;

			oSetting = oSettings[type];
			oController = oSetting.controller;
			if (!oController || !oSetting.visible || !oController[sMethodName]) {
				continue;
			}
			aArgsPartially = this._getArgumentsByType(aArgs, type);
			if (sMethodName === "getPanel") {
				aArgsPartially.push(oSetting.payload);
			}
			var oResult = oController[sMethodName].apply(oController, aArgsPartially);
			if (oResult !== null && oResult !== undefined) {
				if (oResult[type] !== undefined) {
					oResults[type] = oResult[type];
				} else {
					oResults[type] = oResult;
				}
			}
		}
		return oResults;
	};

	Controller.prototype._sanityCheck = function(oNewPersistentData) {
		// TODO: sanity check
		// Only allow the right format e.g. "sort.sortItems" but not "sort"
		if (!oNewPersistentData) {
			return false;
		}
		return true;
	};

	/**
	 * Cleans up before destruction.
	 */
	Controller.prototype.exit = function() {
		var type;

		// destroy dialog
		if (this._oDialog) {
			this._oDialog.destroy();
			this._oDialog = null;
		}

		// destroy controller
		this._callControllers(this._oSettingCurrent, "destroy");
		for (type in this._oSettingCurrent) {
			this._oSettingCurrent[type] = null;
		}
		this._oSettingCurrent = null;
		for (type in this._oSettingOriginal) {
			this._oSettingOriginal[type] = null;
		}
		this._oSettingOriginal = null;

		// destroy model and its data
		if (this.getModel()) {
			this.getModel().destroy();
			this._oModel = null;
		}
		this._oPersistentDataRestore = null;
		this._oPersistentDataCurrentVariant = null;
		this._oPersistentDataAlreadyKnown = null;
		this._oPersistentDataBeforeOpen = null;
		this._oPayload = null;
	};

	Controller.ChangeType = {
		// Not changed
		Unchanged: 0,
		// Change is applied to model but not applied to table
		ModelChanged: 1,
		// Change is applied to model and to table
		TableChanged: 2
	};

	Controller.SyncReason = {
		//
		NewTable: 0,
		// 
		NewSetting: 1,
		// 
		NewModelData: 2,
		//
		ResetModelData: 3,
		//
		ResetModelDataVariant: 4
	};

// Controller.ResetType = {
// // a reset back to Restore (i.e. the version of the table with which the controller was instantiated or via setter
// // updated) was triggered (either via API or via reset button)
// ResetFull: 0,
// // a reset back to the CurrentVariant was triggered (yet to be defined how this is triggered)
// ResetPartial: 1
// };

	Controller.ChangeReason = {
		// a reset back to Restore (i.e. the version of the table with which the controller was instantiated or via setter
		// updated) was triggered (either via API or via reset button)
		ResetFull: 0,
		// a reset back to the CurrentVariant was triggered (yet to be defined how this is triggered)
		ResetPartial: 1
	// // a new "variant" was set from outside, i.e. a call to setPersonalizationData was done
	// SetPersonalizationDataCalled: 2
	};

	/* eslint-enable strict */

	return Controller;

}, /* bExport= */true);
