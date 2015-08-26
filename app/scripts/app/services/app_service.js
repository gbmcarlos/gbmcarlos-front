'use strict';

var root = require('./../config/root.json').root,
    layouts = require('./../config/layouts.json').layouts;

var p = {

    init: function(app, appTemplates, appViews, debugService, dataService, layoutService, moduleService) {
        this.app = app;
        this.appTemplates = appTemplates.templates;
        this.appViews = appViews;
        this.debugService = debugService;
        this.dataService = dataService;
        this.layoutService = layoutService;
        this.moduleService = moduleService;
    },

    setConfig: function() {

        this.rootDefinition = root;

        this.layoutsDefinitions = layouts;

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

    },

    getLayoutDefinition: function(definitionName) {

        if (!definitionName) {

            this.debugService.error('Must especify a layout definition');

            return;
        }

        var layoutDefinition = this.layoutsDefinitions[definitionName];

        if (!layoutDefinition) {

            this.debugService.error('There is no layout definition for \'' + definitionName + '\'');

            return;
        }

        return layoutDefinition;

    },

    getLayoutParsed: function(layoutDefinition) {

        if (!!layoutDefinition) {

            var layoutParsed = this.layoutService.parseLayout(layoutDefinition);

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

        if (!!locateDefinition.type && locateDefinition.type == 'module') {
            this.setLocateContentModule(locateDefinition, layoutView);
        } else if (!!locateDefinition.type && locateDefinition.type == 'layout') {
            this.setLocateContentLayout(locateDefinition, layoutView);
        }

    },

    setLocateContentLayout: function(locateLayoutDefinition, layoutView) {

        this.setLayout(locateLayoutDefinition.layout, layoutView.getRegion(locateLayoutDefinition.region));

    },

    setLocateContentModule: function(locateModuleDefinition, layoutView) {

        this.moduleService.setModule(locateModuleDefinition.module.name, layoutView.getRegion(locateModuleDefinition.region));

    }

};

function AppService(app, appTemplates, appViews, debugService, dataService, layoutService, moduleService) {

    this.app = app;
    this.appTemplates = appTemplates;
    this.appViews = appViews;
    this.debugService = debugService;
    this.dataService = dataService;
    this.layoutService = layoutService;
    this.moduleService = moduleService;

    this.init();

}

AppService.prototype = {

    init: function() {

        p.init(this.app, this.appTemplates, this.appViews, this.debugService, this.dataService, this.layoutService, this.moduleService);
        p.setConfig();
        p.setBases();
        p.setRootRegion();
    },

    start: function() {
        p.start();
    }

};

module.exports = AppService;
