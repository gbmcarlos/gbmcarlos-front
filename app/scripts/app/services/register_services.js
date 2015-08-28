var SiteDependencies = require('./site_dependencies.js'),
    TranslationsService = require('./translations_service.js'),
    HandlebarsHelpers = require('./handlebars_helpers.js'),
    RequestService = require('./request_service.js'),
    DataService = require('./data_service.js'),
    DebugService = require('./debug_service.js'),
    AppService = require('./app_service.js'),
    LayoutParser = require('./layout_parser.js'),
    AppTemplates = require('./../config/templates.js'),
    AppViews = require('./../resources/app/views/app_views.js');


var BoxModule = require('./../modules/box/box_module.js'),
    BoxView = require('./../modules/box/box_view.js');

module.exports = function (App) {

    App.container.register('SiteDependencies', SiteDependencies);
    App.container.register('TranslationsService', TranslationsService);
    App.container.register('HandlebarsHelpers', HandlebarsHelpers, ['TranslationsService']);
    App.container.register('RequestService', RequestService);
    App.container.register('DebugService', DebugService);
    App.container.register('DataService', DataService, ['App',  'TranslationsService']);
    App.container.register('AppTemplates', AppTemplates);
    App.container.register('AppViews', AppViews, ['App']);
    App.container.register('LayoutParser', LayoutParser);
    App.container.register('AppService', AppService, ['App', 'AppTemplates', 'AppViews', 'DebugService', 'DataService', 'LayoutParser']);

    App.container.register('BoxModule', BoxModule, ['App']);
    App.container.register('BoxView', BoxView, ['App']);

};
