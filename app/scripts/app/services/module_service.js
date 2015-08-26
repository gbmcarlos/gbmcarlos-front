'use strict';

var modules = require('./../config/modules.js').modules;

var p = {

    builtModules: {},

    init: function(widget, appControllers, appViews, appTemplates) {

        this.widget = widget;
        this.appViews = appViews;
        this.appTemplates = appTemplates;
        this.modulesDefinitions = modules;

    },

    setModule: function(moduleName, region) {

        var module = this.getModule(moduleName);

        this.setModuleToRegion(region);

    },

    getModule: function(moduleName) {

        var module = (!!this.builtModules[moduleName]) ?
            this.builtModules[moduleName] :
            this.generateModule(moduleName);

        return module;

    },

    generateModule: function (moduleName) {

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

        var views = this.getModuleViews(moduleDefinition);

        var controller = this.getModuleController(moduleDefinition);

        var module = this.prepareModule(controller, views);

        return module;

    },

    getModuleViews: function(moduleDefinition) {

        var views = [];

        _.each(moduleDefinition.views, function(viewName) {

            var view = this.getView(viewName);

            views.push(view);

        }, this);

        return views;

    },

    getView: function(viewName) {

        var viewDefinition = this.getViewDefinition(viewName);

        var builtView = this.buildView(viewDefinition);

        return builtView;

    },

    getViewDefinition: function(viewName) {

    },

    buildView: function(viewDefinition) {

    },

    getModuleController: function(moduleDefinition) {

    },

    prepareModule: function(moduleController, moduleViews) {

    },

    saveModule: function(moduleName, builtModule) {

        this.builtModules[moduleName] = builtModule;

    }

};

function ModuleService(widget, appControllers, appViews, appTemplates) {

    this.widget = widget;
    this.appControllers = appControllers;
    this.appViews = appViews;
    this.appTemplates = appTemplates;
    this.init();

}

ModuleService.prototype = {

    init: function() {
        p.init(this.widget, this.appControllers, this.appViews, this.appTemplates);
    },

    setModule: function(moduleName, region) {
        //return p.setModule(moduleName);
    }

};

module.exports = ModuleService;
