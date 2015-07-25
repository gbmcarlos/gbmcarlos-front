"use strict";

var p = {

    comp: function (self, v1, v2, options) {
        if (v1 == v2) {
            return self.fn();
        } else {
            return self.inverse();
        }
    },

    isNotEmpty: function (self, val, options) {
        if (this.cagService.isNotEmpty(val)) {
            return options.fn(self);
        } else {
            return options.inverse(self);
        }
    },

    lang: function (self, key) {
        return this.translationsService.lang(key);
    },

    init: function (cagService, TranslationsService) {
        this.cagService = cagService;
        this.translationsService = TranslationsService;
    }

};

function HandlebarsHelpers(CagService, TranslationsService) {
    this.cagService = CagService;
    this.translationsService = TranslationsService;
    this.init();
}

HandlebarsHelpers.prototype = {

    registerHelpers: function () {

        var helpers = [
            {name: 'comp', helper: p.comp},
            {name: 'isNotEmpty', helper: p.isNotEmpty},
            {name: 'lang', helper: p.lang}
        ];

        this._registerHelpers(helpers);

    },

    registerHelper: function (name, helper) {
        App.Handlebars.registerHelper(name, helper);
    },

    _registerHelpers: function (helpers) {


        _.each(helpers, function (helper) {
            if (!!helper.name && !!helper.helper) {
                this.registerHelper(helper.name, function () {
                    var _arguments = [_.last(arguments)];
                    _arguments = _arguments.concat(_.initial(arguments));
                    return helper.helper.apply(p, _arguments);
                });
            }
        }.bind(this));
    },

    init: function () {
        p.init(this.cagService, this.translationsService);
    }

};

module.exports = HandlebarsHelpers;