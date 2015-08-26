var SiteDependencies = require('./site_dependencies.js'),
    TranslationsService = require('./translations_service.js'),
    HandlebarsHelpers = require('./handlebars_helpers.js'),
    RequestService = require('./request_service.js'),
    DataService = require('./data_service.js'),
    DebugService = require('./debug_service.js'),
    AppService = require('./app_service.js'),
    LayoutService = require('./layout_service.js'),
    ModuleService = require('./module_service.js'),
    AppTemplates = require('./../config/templates.js'),
    AppViews = require('./../resources/app/views/app_views.js');


var BaseModule = require('./../modules/base/base_module.js'),
    BaseView = require('./../modules/base/base_view.js');

module.exports = function (widget) {

    widget.container.register('SiteDependencies', SiteDependencies);
    widget.container.register('TranslationsService', TranslationsService);
    widget.container.register('HandlebarsHelpers', HandlebarsHelpers, ['TranslationsService']);
    widget.container.register('RequestService', RequestService);
    widget.container.register('DebugService', DebugService);
    widget.container.register('DataService', DataService, ['App',  'TranslationsService']);
    widget.container.register('AppTemplates', AppTemplates);
    widget.container.register('AppViews', AppViews, ['App']);
    widget.container.register('LayoutService', LayoutService);
    widget.container.register('ModuleService', ModuleService, ['App', 'AppTemplates', 'AppViews']);
    widget.container.register('AppService', AppService, ['App', 'AppTemplates', 'AppViews', 'DebugService', 'DataService', 'LayoutService', 'ModuleService']);

    widget.container.register('BaseModule', BaseModule, ['App']);
    //widget.container.register('BaseView', BaseView, ['App']);

};
