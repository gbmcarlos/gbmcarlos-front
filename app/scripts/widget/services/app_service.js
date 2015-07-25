'use strict';

var p = {

    init: function (modulesService) {
        this.layout = modulesService.getLayout();
    },

    setRegions: function (App) {

        App.addRegions(this.layout.regions);
    },

    includeModules: function (App) {

        App = require('./../modules/base/base_module.js')(App);

        //App = require('./../modules/list/list_module.js')(App);
        //
        //App = this.includeFeatureModules(App);

        return App;

    },

    includeFeatureModules: function (App) {

        if (!!App.container.get('ConfigService').getPrefs().showTabs) {
            App = require('./../modules/tab/tab_module.js')(App);
        }

        if (!!App.container.get('ConfigService').getPrefs().showSorts) {
            App = require('./../modules/sort/sort_module.js')(App);
        }

        if (!!App.container.get('ConfigService').getConfig().features.compareCart) {
            App = require('./../modules/cart/cart_module.js')(App);
        }

        return App;
    },

    includeEntities: function (App) {

        App = require('./../entities/tab.js')(App);
        App = require('./../entities/product.js')(App);
        App = require('./../entities/cart.js')(App);
        App = require('./../entities/sort.js')(App);

        return App;
    },

    initModules: function (App) {

        App.Base.init();
        App.List.init();

        this.initFeatureModules(App);

    },

    initFeatureModules: function (App) {

        if (!!App.container.get('ConfigService').getPrefs().showTabs) {
            App.Tab.init(App.container.get('ConfigService').getConfig().siteConfig.categories);
        }

        if (!!App.container.get('ConfigService').getPrefs().showSorts) {
            App.Sort.init(App.container.get('ConfigService').getConfig().siteConfig.categories);
        }

        if (!!App.container.get('ConfigService').getConfig().features.compareCart) {
            App.Cart.init();
        }


    }

};

function AppService(ModulesService) {

    this.modulesService = ModulesService;
    this.init();

}

AppService.prototype = {

    init: function () {
        p.init(this.modulesService);
    },

    setRegions: function (App) {
        p.setRegions(App);
    },

    includeModules: function (App) {
        return p.includeModules(App);
    },

    includeEntities: function (App) {
        return p.includeEntities(App);

    },

    initModules: function (App) {
        p.initModules(App);
    }
};

module.exports = AppService;