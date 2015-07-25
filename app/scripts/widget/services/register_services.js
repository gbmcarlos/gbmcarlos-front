var SiteDependencies = require('./site_dependencies.js'),
    ModulesService = require('./modules_service.js'),
    CagService = require('./cag_service.js'),
    TranslationsService = require('./translations_service.js'),
    HandlebarsHelpers = require('./handlebars_helpers.js'),
    RequestService = require('./request_service.js'),
    DataService = require('./data_service.js'),
    AppService = require('./app_service.js');

module.exports = function (widget) {

    widget.container.register('SiteDependencies', SiteDependencies);
    widget.container.register('ModulesService', ModulesService);
    widget.container.register('CagService', CagService);
    widget.container.register('TranslationsService', TranslationsService);
    widget.container.register('HandlebarsHelpers', HandlebarsHelpers, ['CagService','TranslationsService']);
    widget.container.register('RequestService', RequestService);
    widget.container.register('DataService', DataService, ['CagService', 'TranslationsService']);
    widget.container.register('AppService', AppService);

};
