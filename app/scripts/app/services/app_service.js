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

    setLayout: function(layoutImplementation, region) {

        var layoutDefinition = this.getLayoutDefinition(layoutImplementation.definition);

        var layoutParsed = this.getLayoutParsed(layoutDefinition);

        var layoutView = this.getLayoutView(layoutParsed, layoutImplementation.config || {});

        if (!!layoutView) {

            region.show(layoutView);

            layoutView.addRegions(layoutParsed.regions);

            this.fillLayout(layoutImplementation.locate, layoutView);

        }

        return layoutView;

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

        return;

    },

    getLayoutView: function(layoutParsed, layoutConfig) {

        if (!!layoutParsed) {

            layoutConfig.template = layoutConfig.template || this.baseLayoutTemplate;

            layoutConfig.view = layoutConfig.view || this.baseLayoutView;

            if (!this.appTemplates[layoutConfig.template]) {

                this.debugService.error('There is no \'' + layoutConfig.template + '\' layout template');

                return;
            }

            if (!this.appViews[layoutConfig.view]) {

                this.debugService.error('There is no \'' + layoutConfig.view + '\' layout view');

                return;
            }

            var self = this;

            var View = this.appViews[layoutConfig.view].extend({
                template: self.appTemplates[layoutConfig.template],

                serializeData: function () {
                    return layoutParsed;
                }

            });

            return new View();
        }

    },

    fillLayout: function(layoutLocate, layoutView) {

        _.each(layoutLocate, function(locateDefinition) {

            if (!!locateDefinition.region && !!layoutView.getRegion(locateDefinition.region)) {

                this.setLocateContent(locateDefinition, layoutView);

            }

        }, this);

    },

    setLocateContent: function(locateDefinition, layoutView) {

        if (!!locateDefinition.content && locateDefinition.content == 'module') {

            this.setModule(locateDefinition.module.name, layoutView.getRegion(locateDefinition.region));

        } else if (!!locateDefinition.content && locateDefinition.content == 'layout') {

            this.setLayout(locateDefinition.layout, layoutView.getRegion(locateDefinition.region));

        } else if (!!locateDefinition.content && locateDefinition.content == 'view') {

            this.setView(locateDefinition.view, layoutView.getRegion(locateDefinition.region));

        }

    },

    setView: function(viewDefinition, region) {

        var viewCollection = this.app.container.get(viewDefinition.collection);

        var self = this;

        var view = viewCollection[viewDefinition.view].extend({
            template: self.appTemplates[viewDefinition.template]
        });

        var viewInstance = new view();

        region.show(viewInstance);

        return viewInstance;
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

        var view = this.getModuleView(moduleDefinition.view, region);

        var controller = this.getModuleController(moduleDefinition);

        this.prepareModule(controller, view);

    },

    getModuleView: function(viewDefinition, region) {

        var view;

        if (viewDefinition.type == 'view') {

            var temporaryLayout = this.buildTemporaryLayout(viewDefinition.view);

            view = this.setLayout(temporaryLayout, region);

        } else if (viewDefinition.type == 'layout') {

            view = this.setLayout(viewDefinition.layout, region);

        }

        return view;

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

    getModuleController: function(moduleDefinition) {

        var controller = this.app.container.get(moduleDefinition.controller, true);

        return controller;

    },

    prepareModule: function(controller, views) {

        _.each(views, function(view) {

            //view.view.setController(controller);
            //
            //controller[view.name] = view.view;

        });

    },

    saveModule: function(moduleName, builtModule) {

        this.builtModules[moduleName] = builtModule;

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
