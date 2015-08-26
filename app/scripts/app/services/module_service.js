'use strict';

var modules = require('./../config/modules.json').modules;

var p = {

    builtModules: {},

    init: function(app, appTemplates, appViews) {

        this.app = app;
        this.appTemplates = appTemplates.templates;
        this.appViews = appViews;
        this.modulesDefinitions = modules;

    },

    setModule: function(moduleName, region) {

        var module = this.getModule(moduleName);

        this.setModuleToRegion(module, region);

    },

    getModule: function (moduleName) {

        var moduleDefinition = this.getModuleDefinition(moduleName);

        var builtModule = this.buildModule(moduleDefinition);

        this.saveModule(moduleName, builtModule);

        return builtModule;

    },

    getModuleDefinition: function(moduleName) {

        var moduleDefinition = this.modulesDefinitions[moduleName];

        return moduleDefinition;

    },

    buildModule: function(moduleDefinition) {

        var view = this.getModuleView(moduleDefinition);

        var controller = this.getModuleController(moduleDefinition);

        var module = this.prepareModule(controller, view);

        return {
            view: view
        };

    },

    getModuleView: function(moduleDefinition) {

        var viewCollection = this.app.container.get(moduleDefinition.view.collection);

        var self = this;

        var view = viewCollection[moduleDefinition.view.view].extend({
            template: self.appTemplates[moduleDefinition.template]
        });

        var viewInstance = new view();

        return viewInstance;

    },

    getModuleController: function(moduleDefinition) {

        var controller = this.app.container.get(moduleDefinition.controller, true);

        return controller;

    },

    prepareModule: function(controller, view) {

        controller.setView(view);

        view.setController(view);

    },

    saveModule: function(moduleName, builtModule) {

        this.builtModules[moduleName] = builtModule;

    },

    setModuleToRegion: function(module, region) {

        region.show(module.view);

    }

};

function ModuleService(app, appTemplates, appViews) {

    this.app = app;
    this.appTemplates = appTemplates;
    this.appViews = appViews;
    this.init();

}

ModuleService.prototype = {

    init: function() {
        p.init(this.app, this.appTemplates, this.appViews);
    },

    setModule: function(moduleName, region) {
        p.setModule(moduleName, region);
    }

};

module.exports = ModuleService;
