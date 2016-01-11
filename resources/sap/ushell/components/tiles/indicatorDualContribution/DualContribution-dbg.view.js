// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

//Comparison Tile
(function () {
    "use strict";
    /*global jQuery, sap */
    /*jslint nomen: true */

    jQuery.sap.require("sap.ushell.components.tiles.indicatorTileUtils.smartBusinessUtil");
    jQuery.sap.require("sap.ui.model.analytics.odata4analytics");
    jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
    sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
    
    sap.ui.jsview("tiles.indicatorDualContribution.DualContribution", {
        getControllerName: function () {
            return "tiles.indicatorDualContribution.DualContribution";
        },
        createContent: function (oController) {
            this.setHeight('100%');
            this.setWidth('100%');

            var view= this;
            view.tileData;          

            view.oGenericTileData = {
            };

            view.oNumericContent = new sap.suite.ui.commons.NumericContent({
                value: "{/value}",
                scale: "{/scale}",
                indicator: "{/indicator}",
                size: "{/size}",
                formatterValue: true,
                truncateValueTo: "{/truncateValueTo}",
                valueColor: "{/valueColor}"
            });

            view.oNumericTile = new sap.suite.ui.commons.TileContent({
                unit: "{/unitNumeric}",
                size: "{/size}",
                footer: "{/footerNum}",
                content: view.oNumericContent,
            });

            view.oCmprsDataTmpl = new sap.suite.ui.commons.ComparisonData({
                title : "{title}",
                value : "{value}",
                color : "{color}",
                displayValue : "{displayValue}"
            });

            view.oCmprsChrtTmpl = new sap.suite.ui.commons.ComparisonChart(
                    {
                        size : "{/size}",
                        scale : "{/scale}",
                        data : {
                            template : view.oCmprsDataTmpl,
                            path : "/data"
                        },
                    });

            view.oComparisonTile = new sap.suite.ui.commons.TileContent({
                unit : "{/unitContribution}",
                size : "{/size}",
                footer : "{/footerComp}",
                content : view.oCmprsChrtTmpl,
            });


            view.oGenericTile = new sap.suite.ui.commons.GenericTile({
                subheader : "{/subheader}",
                frameType : "{/frameType}",
                size : "{/size}",
                header : "{/header}",
                tileContent : [view.oNumericTile, view.oComparisonTile]//view.oComparisonTile]
            });


            view.oGenericTileModel = new sap.ui.model.json.JSONModel();
            view.oGenericTileModel.setData(view.oGenericTileData);
            view.oGenericTile.setModel(view.oGenericTileModel);

            return view.oGenericTile;


        }
    });
}());