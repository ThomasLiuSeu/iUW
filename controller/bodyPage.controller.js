jQuery.sap.require("iUWDemo.js.three");
jQuery.sap.require("iUWDemo.js.UCSCharacter");
jQuery.sap.require('iUWDemo.js.datagui');
jQuery.sap.require("iUWDemo.js.orbit");

sap.ui.controller("iUWDemo.controller.bodyPage", {

    premium: "63",

    onInit: function() {
        sap.ui.core.UIComponent.getRouterFor(this).attachRoutePatternMatched(
            this.onRouteMatched, this);

    },

    onRouteMatched: function(oEvent) {

        if (oEvent.getParameter("name") !== "bodyPage") {
            return;
        }
        this.submissionId = oEvent.getParameter("arguments").submissionId;
        var swithBtn = sap.ui.getCore().byId(this.createId("swithBtn"));
        swithBtn.setState(false);

        this.renderHeartBeatChart();
    },
    renderHeartBeatChart: function() {
        var chartContainer = this.getView().byId("chartContainer");
        chartContainer.destroyContent();
        var select = new sap.m.Select("modelSelect", {
            items: [new sap.ui.core.Item({
                key: "1",
                text: "Line Chart"
            }), new sap.ui.core.Item({
                key: "2",
                text: "Column Chart"
            })]
        });
        var that = this;
        select.attachChange(function() {
            var oVizFrame = sap.ui.getCore().byId("idVizFrameLine");
            var key = parseInt(select.getSelectedKey());
            switch (key) {
                case 1:
                    oVizFrame.setVizType('line');
                    break;
                case 2:
                    oVizFrame.setVizType('column');
                    break;
                case 3:
                    oVizFrame.setVizType('scatter');
                    break;
                case 4:
                    oVizFrame.setVizType('bubble');
                    break;
            }
        });
        chartContainer.addContent(select);
        var oVizFrame = new sap.viz.ui5.controls.VizFrame("idVizFrameLine");
        sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
        var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
            icon: "sap-icon://horizontal-bar-chart",
            title: "asdfasdf1231234234234",
            content: [oVizFrame]
        });
        var oChartContainer = new sap.suite.ui.commons.ChartContainer({
            content: [oChartContainerContent]
        });
        oChartContainer.setShowFullScreen(true);
        //oChartContainer.setAutoAdjustHeight(true);
        chartContainer.addContent(oChartContainer);

        oVizFrame.setVizType('line');
        /*oVizFrame.setUiConfig({
            "applicationSet": "fiori"
        });*/

        var FIORI_LABEL_SHORTFORMAT_10 = "__UI5__ShortIntegerMaxFraction10";
        var FIORI_LABEL_SHORTFORMAT_2 = "__UI5__ShortIntegerMaxFraction2";

        var oModel = new sap.ui.model.json.JSONModel({
            "milk": [{
                "Store Name": "1/4/2016",
                "HeartBeat": 90,
                "Cost": 94383.52,
                "Consumption": 76855.15368
            }, {
                "Store Name": "1/5/2016",
                "HeartBeat": 93,
                "Cost": 274735.17,
                "Consumption": 310292.22
            }, {
                "Store Name": "1/6/2016",
                "HeartBeat": 96,
                "Cost": 233160.58,
                "Consumption": 143432.18
            }, {
                "Store Name": "1/7/2016",
                "HeartBeat": 99,
                "Cost": 235072.19,
                "Consumption": 487910.26
            }, {
                "Store Name": "1/8/2016",
                "HeartBeat": 101,
                "Cost": 582543.16,
                "Consumption": 267185.27
            }, {
                "Store Name": "1/9/2016",
                "HeartBeat": 110,
                "Cost": 397952.77,
                "Consumption": 304964.8856125
            }, {
                "Store Name": "1/10/2016",
                "HeartBeat": 130,
                "Cost": 343427.25,
                "Consumption": 291191.83
            }, {
                "Store Name": "1/11/2016",
                "HeartBeat": 110,
                "Cost": 115844.26,
                "Consumption": 98268.9597904
            }, {
                "Store Name": "1/12/2016",
                "HeartBeat": 101,
                "Cost": 263180.86,
                "Consumption": 176502.5521223
            }, {
                "Store Name": "1/13/2016",
                "HeartBeat": 99,
                "Cost": 611658.59,
                "Consumption": 538515.47632832
            }, {
                "Store Name": "1/14/2016",
                "HeartBeat": 96,
                "Cost": 611658.59,
                "Consumption": 538515.47632832
            }, {
                "Store Name": "1/15/2016",
                "HeartBeat": 93,
                "Cost": 611658.59,
                "Consumption": 538515.47632832
            }, {
                "Store Name": "1/16/2016",
                "HeartBeat": 90,
                "Cost": 611658.59,
                "Consumption": 538515.47632832
            }]
        });

        var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [{
                name: 'Time',
                value: "{Store Name}"
            }],
            measures: [{
                name: 'Heart Beat',
                value: '{HeartBeat}'
            }, {
                name: 'Cost',
                value: '{Cost}'
            }],
            data: {
                path: "/milk"
            }
        });

        oVizFrame.setDataset(oDataset);
        oVizFrame.setModel(oModel);

        oVizFrame.setVizProperties({
            /*general: {
                layout: {
                    padding: 0.04
                }
            },
            valueAxis: {
                label: {
                    formatString: FIORI_LABEL_SHORTFORMAT_10
                },
                title: {
                    visible: true
                }
            },
            categoryAxis: {
                title: {
                    visible: true
                }
            },*/
            plotArea: {
                dataLabel: {
                    visible: true,
                    //formatString: FIORI_LABEL_SHORTFORMAT_2
                },
            },
            legend: {
                title: {
                    visible: true
                }
            },
            title: {
                visible: true,
                text: 'Heart Beat'
            }
        });

        var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Heart Beat"]
            }),
            feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Time"]
            });
        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);

        // Add description.
        var form1 = new sap.ui.layout.form.Form("form", {
            title: "Summary",
            formContainers: [new sap.ui.layout.form.FormContainer("formContainer", {
                formElements: [new sap.ui.layout.form.FormElement({
                    label: new sap.m.Label({text: "Highest Heart Beat ",
                        layoutData : new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})
                    }),
                    fields: [new sap.m.Text({text: "130",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6"})
                    })]
                }), new sap.ui.layout.form.FormElement({
                    label: new sap.m.Label({text: "Lowest Heart Beat ",
                        layoutData : new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})
                    }),
                    fields: [new sap.m.Text({text: "90",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6"})
                    })]
                }), new sap.ui.layout.form.FormElement({
                    label: new sap.m.Label({text: "Normal Heart Beat ",
                        layoutData : new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})
                    }),
                    fields: [new sap.m.Text({text: "80 - 120",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6"})
                    })]
                }), new sap.ui.layout.form.FormElement({
                    label: new sap.m.Label({text: "Exception Day ",
                        layoutData : new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})
                    }),
                    fields: [new sap.m.Text({text: "5",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6"})
                    })]
                }), new sap.ui.layout.form.FormElement({
                    label: new sap.m.Label({text: "Duration",
                        layoutData : new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})
                    }),
                    fields: [new sap.m.Text({text: "2 weeks",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6"})
                    })]
                })],
            })],
            layout: new sap.ui.layout.form.ResponsiveGridLayout({
                layout: "ResponsiveGridLayout"
            }),
        });
        
        var form2 = new sap.ui.layout.form.Form("form2", {
            title: "UW Tips",
            formContainers: [new sap.ui.layout.form.FormContainer({
                formElements: [new sap.ui.layout.form.FormElement({
                    fields: [new sap.m.Label({text: "High risk of heart attack.", layoutData: new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})}),
                             new sap.m.Label({text: "Not regular beat rate.", layoutData: new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})})]
                })],
                layoutData : new sap.ui.layout.GridData({span: "L12 M12"})
            })],
            layout: new sap.ui.layout.form.ResponsiveGridLayout({
                layout: "ResponsiveGridLayout"
            }),
        });
        chartContainer.addContent(form1);
        chartContainer.addContent(form2);
    },

    renderBodyTemperatureChart: function() {
        var chartContainer = this.getView().byId("chartContainer");
        chartContainer.destroyContent();
        var select = new sap.m.Select("modelSelect", {
            items: [new sap.ui.core.Item({
                key: "1",
                text: "Line Chart"
            }), new sap.ui.core.Item({
                key: "2",
                text: "Column Chart"
            })]
        });
        var that = this;
        select.attachChange(function() {
            var oVizFrame = sap.ui.getCore().byId("idVizFrameBodyTemperatureLine");
            var key = parseInt(select.getSelectedKey());
            switch (key) {
                case 1:
                    oVizFrame.setVizType('line');
                    break;
                case 2:
                    oVizFrame.setVizType('column');
                    break;
                case 3:
                    oVizFrame.setVizType('scatter');
                    break;
                case 4:
                    oVizFrame.setVizType('bubble');
                    break;
            }
        });
        chartContainer.addContent(select);
        var oVizFrame = new sap.viz.ui5.controls.VizFrame("idVizFrameBodyTemperatureLine");
        sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
        var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
            id: "chartContainerContent1",
            icon: "sap-icon://horizontal-bar-chart",
            title: "vizFrame Bar Chart Sample",
            content: [oVizFrame]
        });
        var oChartContainer = new sap.suite.ui.commons.ChartContainer({
            id: "chartContainer1",
            content: [oChartContainerContent]
        });
        oChartContainer.setShowFullScreen(true);
        //oChartContainer.setAutoAdjustHeight(true);
        chartContainer.addContent(oChartContainer);

        oVizFrame.setVizType('line');


        var oModel = new sap.ui.model.json.JSONModel({
            "temperature": [{
                "Store Name": "1/4/2016",
                "temperatureValue": 34.5,
                "Cost": 37,
                "Consumption": 76855.15368
            }, {
                "Store Name": "1/5/2016",
                "temperatureValue": 34.9,
                "Cost": 37,
                "Consumption": 310292.22
            }, {
                "Store Name": "1/6/2016",
                "temperatureValue": 34.8,
                "Cost": 37,
                "Consumption": 143432.18
            }, {
                "Store Name": "1/7/2016",
                "temperatureValue": 35.8,
                "Cost": 37,
                "Consumption": 487910.26
            }, {
                "Store Name": "1/8/2016",
                "temperatureValue": 36.5,
                "Cost": 37,
                "Consumption": 267185.27
            }, {
                "Store Name": "1/9/2016",
                "temperatureValue": 36.8,
                "Cost": 37,
                "Consumption": 304964.8856125
            }, {
                "Store Name": "1/10/2016",
                "temperatureValue": 36.9,
                "Cost": 37,
                "Consumption": 291191.83
            }, {
                "Store Name": "1/11/2016",
                "temperatureValue": 36.5,
                "Cost": 37,
                "Consumption": 98268.9597904
            }, {
                "Store Name": "1/12/2016",
                "temperatureValue": 38.0,
                "Cost": 37,
                "Consumption": 176502.5521223
            }, {
                "Store Name": "1/13/2016",
                "temperatureValue": 38.0,
                "Cost": 37,
                "Consumption": 538515.47632832
            }, {
                "Store Name": "1/14/2016",
                "temperatureValue": 36.8,
                "Cost": 37,
                "Consumption": 538515.47632832
            }, {
                "Store Name": "1/15/2016",
                "temperatureValue": 36.3,
                "Cost": 37,
                "Consumption": 538515.47632832
            }, {
                "Store Name": "1/16/2016",
                "temperatureValue": 35.5,
                "Cost": 37,
                "Consumption": 538515.47632832
            }]
        });

        var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [{
                name: 'Time',
                value: "{Store Name}"
            }],
            measures: [{
                name: 'Temperature Value',
                value: '{temperatureValue}'
            }, {
                name: 'Normal',
                value: '{Cost}'
            }],
            data: {
                path: "/temperature"
            }
        });

        oVizFrame.setDataset(oDataset);
        oVizFrame.setModel(oModel);

        oVizFrame.setVizProperties({
            categoryAxis: {
                title: {
                    visible: true
                },
                text: "1223"
            },
            plotArea: {
                dataLabel: {
                    visible: false,
                },
            },
            legend: {
                title: {
                    visible: true
                }
            },
            title: {
                visible: true,
                text: 'Body Temperature'
            }
        });

        var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Temperature Value", "Normal"]
            }),
            feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Time"]
            });
        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        // Add description.
        var form1 = new sap.ui.layout.form.Form("form", {
            title: "Summary",
            formContainers: [new sap.ui.layout.form.FormContainer("formContainer", {
                formElements: [new sap.ui.layout.form.FormElement({
                    label: new sap.m.Label({text: "Highest Temperature",
                        layoutData : new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})
                    }),
                    fields: [new sap.m.Text({text: "38℃",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6"})
                    })]
                }), new sap.ui.layout.form.FormElement({
                    label: new sap.m.Label({text: "Lowest Temperature",
                        layoutData : new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})
                    }),
                    fields: [new sap.m.Text({text: "34.5℃",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6"})
                    })]
                }), new sap.ui.layout.form.FormElement({
                    label: new sap.m.Label({text: "Normal Temperature",
                        layoutData : new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})
                    }),
                    fields: [new sap.m.Text({text: "37℃",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6"})
                    })]
                }), new sap.ui.layout.form.FormElement({
                    label: new sap.m.Label({text: "Exception Day ",
                        layoutData : new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})
                    }),
                    fields: [new sap.m.Text({text: "12",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6"})
                    })]
                }), new sap.ui.layout.form.FormElement({
                    label: new sap.m.Label({text: "Duration",
                        layoutData : new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})
                    }),
                    fields: [new sap.m.Text({text: "2 weeks",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6"})
                    })]
                })],
            })],
            layout: new sap.ui.layout.form.ResponsiveGridLayout({
                layout: "ResponsiveGridLayout"
            }),
        });
        
        var form2 = new sap.ui.layout.form.Form("form2", {
            title: "UW Tips",
            formContainers: [new sap.ui.layout.form.FormContainer({
                formElements: [new sap.ui.layout.form.FormElement({
                    fields: [new sap.m.Label({text: "Low fever risk", layoutData: new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})})]
                })],
                layoutData : new sap.ui.layout.GridData({span: "L12 M12"})
            })],
            layout: new sap.ui.layout.form.ResponsiveGridLayout({
                layout: "ResponsiveGridLayout"
            }),
        });
        chartContainer.addContent(form1);
        chartContainer.addContent(form2);
    },

    onAfterRendering: function() {
        this.renderBody(this);
    },

    renderBody: function(that) {
        var SCREEN_WIDTH = window.innerWidth / 3;
        var SCREEN_HEIGHT = window.innerHeight - 48;
        var container;
        var camera, scene;
        var renderer;
        var mesh;
        var mouseX = 0,
            mouseY = 0;
        var windowHalfX = SCREEN_WIDTH / 2;
        var windowHalfY = SCREEN_HEIGHT / 2;
        var clock = new THREE.Clock();
        var gui, skinConfig, morphConfig;
        init(that);
        animate();
        function init(that) {
            container = document.getElementById(that.getView().createId(
                "pageBody"));
            camera = new THREE.PerspectiveCamera(30, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000);
            camera.position.set(-9.50, 3028.228, 3324.432);
            scene = new THREE.Scene();
            // LIGHTS
            var light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, -1, 0);
            light.position.set(13, 5, 0);
            scene.add(light);
            // RENDERER
            renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
            renderer.setClearColor(0x6fa8dc);
            container.appendChild(renderer.domElement);
            // CHARACTER
            character = new THREE.prototype();
            //        character.onLoadComplete = function() {
            //          console.log( "Load Complete" );
            //          console.log( character.numSkins + " skins and " + character.numMorphs + " morphtargets loaded." );
            //          gui = new dat.GUI();
            //          // setupMorphsGUI();
            //          gui.width = 300;
            //          gui.open();
            //
            //        }
            var loader = new THREE.XHRLoader();
            loader.load("models/skinned/testconfig.json", function(text) {
                var config = JSON.parse(text);
                character.loadParts(config);
                scene.add(character.root);
            });
            window.addEventListener('resize', onWindowResize, false);
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.center.set(0, 3000, 0);
            controls.autoRotate = true;
            controls.addEventListener('change', render);
        }
        function setupMorphsGUI() {
            var morphGui = gui.addFolder("Morphs");
            morphConfig = {};
            var morphCallback = function(index) {
                return function() {
                    character.updateMorphs(morphConfig);
                }
            }
            for (var i = 0; i < character.numMorphs; i++) {
                var morphName = character.morphs[i];
                morphConfig[morphName] = character.morphslimit[i];
            }
            for (var i = 0; i < character.numMorphs; i++) {
                morphGui.add(morphConfig, character.morphs[i]).min(
                        character.morphslowlimit[i]).max(
                        character.morphshighlimit[i])
                    .onChange(morphCallback(i));
            }
            morphGui.open();
        }
        function onWindowResize() {
            windowHalfX = SCREEN_WIDTH / 2;
            windowHalfY = SCREEN_HEIGHT / 2;
            camera.aspect = SCREEN_WIDTH / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        }
        //
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            render();
        }
        function render() {
            renderer.render(scene, camera);
        }
    },
    stateChange: function() {
        var that = this;
        sap.ui.core.UIComponent.getRouterFor(this).navTo("masterDetail", {
            submissionId: this.submissionId,
            premium: that.premium
        }, true);
    },

    navBack: function(oEvent) {
        sap.ui.core.UIComponent.getRouterFor(this).navTo("submission", null,
            true);
    },

    navIconPress: function(oEvent) {
        var iconId = oEvent.getSource().getId();
        var iconIdArr = ["heartBeatIcon", "bodyTemperatureIcon", "sleepTimeIcon", "bloodPressureIcon", "healthStatusIcon"];
        for (var i = 0; i < iconIdArr.length; i++) {
            if (iconId.indexOf(iconIdArr[i]) >= 0) {
                // set icon color.
                var selectedIcon = this.getView().byId(iconIdArr[i]);
                selectedIcon.setBackgroundColor("#FFFFFF");
                for (var j = 0; j < iconIdArr.length; j++) {
                    if (j === i) {
                        continue;
                    }
                    var selectedIcon = this.getView().byId(iconIdArr[j]);
                    selectedIcon.setBackgroundColor("#dddddd");
                }
                switch (iconIdArr[i]) {
                    case "heartBeatIcon":
                        this.renderHeartBeatChart();
                        break;
                    case "bodyTemperatureIcon":
                        this.renderBodyTemperatureChart();
                        break;
                    case "sleepTimeIcon":
                        this.renderHeartBeatChart();
                        break;
                    case "bloodPressureIcon":
                        this.renderBodyTemperatureChart();
                        break;
                    case "healthStatusIcon":
                        this.renderSummary();
                        break;
                }
            }
        }
    },

    renderSummary: function() {
        var chartContainer = this.getView().byId("chartContainer");
        chartContainer.destroyContent();
        // Add description.
        var form1 = new sap.ui.layout.form.Form("form", {
            title: "Health Status Summary",
            formContainers: [new sap.ui.layout.form.FormContainer("formContainer", {
                formElements: [new sap.ui.layout.form.FormElement({
                    fields: [new sap.m.Label({text: "High risk of heart attack.",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6", linebreak :true})
                    }), new sap.m.Label({text: "Not regular beat rate.",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6", linebreak :true})
                    }), new sap.m.Label({text: "Low fever risk.",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6", linebreak :true})
                    }), new sap.m.Label({text: "High blood pressure.",
                            layoutData : new sap.ui.layout.GridData({span: "L6 M6", linebreak :true})
                    })]
                })],
            })],
            layout: new sap.ui.layout.form.ResponsiveGridLayout({
                layout: "ResponsiveGridLayout"
            }),
        });
        
        var form2 = new sap.ui.layout.form.Form("form2", {
            title: "UW Tips",
            formContainers: [new sap.ui.layout.form.FormContainer({
                formElements: [new sap.ui.layout.form.FormElement({
                    fields: [new sap.m.Label({text: "Risk rate :  30% (Compared to standard)", layoutData: new sap.ui.layout.GridData({span: "L3 M3", linebreak :true})})]
                })],
                layoutData : new sap.ui.layout.GridData({span: "L12 M12"})
            })],
            layout: new sap.ui.layout.form.ResponsiveGridLayout({
                layout: "ResponsiveGridLayout"
            }),
        });
        form2.addStyleClass("form-height");
        chartContainer.addContent(form1);
        chartContainer.addContent(form2);

    },

    onRecalculationBtn: function(oEvent) {
        var pageBody = sap.ui.getCore().byId(this.createId("pageBody"));
        pageBody.setTitle("Standard Premium (55.00 RMB)");
        sap.m.MessageToast.show("The premium has been recalculated");
        this.premium = "55";
    }
})
