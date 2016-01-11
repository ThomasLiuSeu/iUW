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
    
    sap.ui.jsview("tiles.indicatorcontribution.ContributionTile", {
        getControllerName: function () {
            return "tiles.indicatorcontribution.ContributionTile";
        },
        createContent: function (oController) {
            this.setHeight('100%');
            this.setWidth('100%');

            var view= this;
            view.tileData;          

            view.oGenericTileData = {
//                    subheader : "Lorem Ipsum SubHeader",
//                    header : "Lorem Ipsum Header",
//                    value: 8888,
//                    size: sap.suite.ui.commons.InfoTileSize.Auto,
//                    frameType:"OneByOne",
//                    state: sap.suite.ui.commons.LoadState.Loading,
//                    valueColor:sap.suite.ui.commons.InfoTileValueColor.Error,
//                    indicator: sap.suite.ui.commons.DeviationIndicator.None,
//                    title : "US Profit Margin",
//                    footer : "Current Quarter",
//                    description: "Maximum deviation",
//                    data: [
//                           { title: "Americas", value: 10, color: "Neutral" },
//                           { title: "EMEA", value: 50, color: "Neutral" },
//                           { title: "APAC", value: -20, color: "Neutral" }
//                           ],
            };


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
                unit : "{/unit}",
                size : "{/size}",
                footer : "{/footerComp}",
                content : view.oCmprsChrtTmpl,
            });


            view.oGenericTile = new sap.suite.ui.commons.GenericTile({
                subheader : "{/subheader}",
                frameType : "{/frameType}",
                size : "{/size}",
                header : "{/header}",
                tileContent : [view.oComparisonTile]
            });


            view.oGenericTileModel = new sap.ui.model.json.JSONModel();
            view.oGenericTileModel.setData(view.oGenericTileData);
            view.oGenericTile.setModel(view.oGenericTileModel);

            return view.oGenericTile;


        }
    });
}());