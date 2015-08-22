var $ = require('jquery'),
    _ = require('underscore'),
    Bootstrap = require('bootstrap'),
    Backbone = require('backbone');
    Backbone.$ = $;

var Marionette = require('backbone.marionette');

var dependencyInjection = require('./services/dependency_injection.js'),
    registerServices = require('./services/register_services.js');

global.Bootstrapping = function (params) {
    "use strict";

    var App = new Marionette.Application();

    global.App = App;

    App.bootstrapping = {

        initContainer: function() {
            dependencyInjection(App);
            registerServices(App);
            App.container.get('SiteDependencies').setDependencies(App);
        },

        initServices: function() {
            App.container.get('TranslationsService').setLang(params);
            App.container.get('HandlebarsHelpers').registerHelpers();
        },

        initApplication: function() {
            App.container.get('AppService').start();
        }

    };

    App.bootstrapping.initContainer();

    App.bootstrapping.initServices();

    App.bootstrapping.initApplication();

};
