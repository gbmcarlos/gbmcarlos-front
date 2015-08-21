var SiteDependencies = require('./site_dependencies.js'),
    AppService = require('./app_service.js'),
    LayoutParser = require('./layout_parser.js'),
    TranslationsService = require('./translations_service.js'),
    HandlebarsHelpers = require('./handlebars_helpers.js'),
    RequestService = require('./request_service.js'),
    DataService = require('./data_service.js'),
    DebugService = require('./debug_service.js');

module.exports = function (widget) {

    widget.container.register('SiteDependencies', SiteDependencies);
    widget.container.register('LayoutParser', LayoutParser);
    widget.container.register('TranslationsService', TranslationsService);
    widget.container.register('HandlebarsHelpers', HandlebarsHelpers, ['TranslationsService']);
    widget.container.register('RequestService', RequestService);
    widget.container.register('AppService', AppService, ['App', 'DataService', 'LayoutParser']);
    widget.container.register('DebugService', DebugService);
    widget.container.register('DataService', DataService, ['TranslationsService']);

};
