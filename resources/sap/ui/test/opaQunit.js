/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
opaTest=function(t,e,c,a){"use strict";var b=sap.ui.test.Opa.config;if(!QUnit.config.testTimeout){QUnit.config.testTimeout=90000;}if(arguments.length===2){c=e;e=null;}var d=function(){b.testName=t;c.call(this,b.arrangements,b.actions,b.assertions);var p=sap.ui.test.Opa.emptyQueue();p.done(function(){start();});p.fail(function(o){ok(false,o.errorMessage);start();});};return asyncTest(t,e,d,a);};window.opaTest=opaTest;
