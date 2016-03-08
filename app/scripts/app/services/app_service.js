'use strict';

var root = require('./../config/root.json').root,
    layouts = require('./../config/layouts.json').layouts,
    modules = require('./../config/modules.json').modules;

var p = {

    init: function(app, appTemplates, appViews, debugService, dataService, layoutParser) {
        this.app = app;
        this.appTemplates = appTemplates.templates;
        this.appViews = appViews;
        this.debugService = debugService;
        this.dataService = dataService;
        this.layoutParser = layoutParser;
    },

    setConfig: function() {

        this.rootDefinition = root;
        this.layoutsDefinitions = layouts;
        this.modulesDefinitions = modules;

    },

    setBases: function() {

        this.baseLayoutTemplate = 'baseLayoutTemplate';
        this.baseLayoutView = 'baseLayoutView';

    },

    setRootRegion: function() {

        var rootRegion = this.app.Marionette.Region.extend({
            el: 'body'
        });

        this.app.addRegions({
            root: rootRegion
        });

    },

    start: function() {

        var rootLayoutImplementation = this.rootDefinition.layout;

        this.setLayout(rootLayoutImplementation, this.app.root);

    },

    setLayout: function(layoutImplementation, region, controller, controllerToLayout) {

        var layoutDefinition = this.getLayoutDefinition(layoutImplementation.definition);

        var layoutParsed = this.getLayoutParsed(layoutDefinition);

        var layoutView = this.getLayoutView(
            layoutParsed, layoutImplementation,
            (!!controllerToLayout ? controller : null));

        if (!!layoutView) {

            region.show(layoutView);

            layoutView.addRegions(layoutParsed.regions);

            this.fillLayout(layoutImplementation.locate, layoutView, controller);

        }

    },

    getLayoutDefinition: function(definitionName) {


        if (!definitionName) {

            this.debugService.error('Must especify a layout definition');

            return;
        }

        var layoutDefinition;

        if (_.isObject(definitionName)) {

            layoutDefinition = definitionName;

        } else {

            layoutDefinition = this.layoutsDefinitions[definitionName];

        }

        if (!layoutDefinition) {

            this.debugService.error('There is no layout definition for \'' + definitionName + '\'');

            return;
        }

        return layoutDefinition;

    },

    getLayoutParsed: function(layoutDefinition) {

        if (!!layoutDefinition) {

            var layoutParsed = this.layoutParser.parseLayout(layoutDefinition);

            if (!layoutParsed) {

                this.debugService.error('Couln\'t parse the layout definition');

                return;

            }

            return layoutParsed;

        }

    },

    getLayoutView: function(layoutParsed, layoutImplementation, controller) {

        if (!!layoutParsed) {

            layoutImplementation.config = layoutImplementation.config || {};
            layoutImplementation.config.template = layoutImplementation.config.template || this.baseLayoutTemplate;
            layoutImplementation.config.view = layoutImplementation.config.view || this.baseLayoutView;

            if (!this.appTemplates[layoutImplementation.config.template]) {

                this.debugService.error('There is no \'' + layoutImplementation.config.template + '\' layout template');

                return;
            }

            if (!this.appViews[layoutImplementation.config.view]) {

                this.debugService.error('There is no \'' + layoutImplementation.config.view + '\' layout view');

                return;
            }

            var self = this;

            var view = this.appViews[layoutImplementation.config.view].extend({
                template: self.appTemplates[layoutImplementation.config.template],
                controller: controller,

                serializeData: function () {
                    return layoutParsed;
                }

            });

            var viewInstance = new view();

            if (!!controller) {

                controller.setView(layoutImplementation.view, viewInstance);

            }

            return viewInstance;
        }

    },

    fillLayout: function(layoutLocate, layoutView, controller) {

        _.each(layoutLocate, function(locateDefinition) {

            if (!!locateDefinition.region && !!layoutView.getRegion(locateDefinition.region)) {

                this.setLocateContent(locateDefinition, layoutView, controller);

            }

        }, this);

    },

    setLocateContent: function(locateDefinition, layoutView, controller) {

        if (!!locateDefinition.content && locateDefinition.content == 'module') {

            this.setModule(locateDefinition.module.name, layoutView.getRegion(locateDefinition.region));

        } else if (!!locateDefinition.content && locateDefinition.content == 'layout') {

            this.setLayout(locateDefinition.layout, layoutView.getRegion(locateDefinition.region));

        } else if (!!locateDefinition.content && locateDefinition.content == 'view') {

            this.setView(locateDefinition.view, layoutView.getRegion(locateDefinition.region), controller);

        }

    },

    setView: function(viewDefinition, region, controller) {

        var viewCollection = this.app.container.get(viewDefinition.collection);

        var self = this;

        var view = viewCollection[viewDefinition.view].extend({
            template: self.appTemplates[viewDefinition.template],
            controller: controller
        });

        var viewInstance = new view();

        if (!!controller) {

            controller.setView(viewDefinition.view, viewInstance);

        }

        region.show(viewInstance);

    },

    setModule: function(moduleName, region) {

        var moduleDefinition = this.getModuleDefinition(moduleName);

        this.buildModule(moduleDefinition, region);

    },

    getModuleDefinition: function(moduleName) {

        var moduleDefinition = this.modulesDefinitions[moduleName];

        return moduleDefinition;

    },

    buildModule: function(moduleDefinition, region) {

        var controller = this.getModuleController(moduleDefinition);

        this.setModuleView(moduleDefinition.view, region, controller);

    },

    getModuleController: function(moduleDefinition) {

        var controller = this.app.container.get(moduleDefinition.controller, true);

        return controller;

    },

    setModuleView: function(viewDefinition, region, controller) {

        if (viewDefinition.type == 'view') {

            var temporaryLayout = this.buildTemporaryLayout(viewDefinition.view);

            this.setLayout(temporaryLayout, region, controller);

        } else if (viewDefinition.type == 'layout') {

            this.setLayout(viewDefinition.layout, region, controller, true);

        }

    },

    buildTemporaryLayout: function(viewsDefinitions) {

        var temporaryLayoutDefinition = {
                expand: true,
                structure: {
                    rows: []
                }
            },
            temporaryLayoutLocate = [];

        _.each(viewsDefinitions, function(viewDefinition, index) {

            temporaryLayoutDefinition.structure.rows.push({
                name: 'viewRow_' + index,
                columns: [
                    {
                        name: 'viewRegion_' + index,
                        width: {
                            type: "percentatge",
                            value: "100"
                        }
                    }
                ]
            });

            temporaryLayoutLocate.push({
                region: 'viewRegion_' + index,
                content: 'view',
                view: viewDefinition
            });

        }, this);

        return {
            definition: temporaryLayoutDefinition,
            locate: temporaryLayoutLocate
        };

    },

    setModuleToRegion: function(module, region) {

        region.show(module.view);

    }

};

function AppService(app, appTemplates, appViews, debugService, dataService, layoutParser) {

    this.app = app;
    this.appTemplates = appTemplates;
    this.appViews = appViews;
    this.debugService = debugService;
    this.dataService = dataService;
    this.layoutParser = layoutParser;

    this.init();

}

AppService.prototype = {

    init: function() {

        p.init(this.app, this.appTemplates, this.appViews, this.debugService, this.dataService, this.layoutParser);
        p.setConfig();
        p.setBases();
        p.setRootRegion();
    },

    start: function() {
        p.start();
    }

};

module.exports = AppService;
