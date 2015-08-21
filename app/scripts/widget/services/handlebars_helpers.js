"use strict";

var p = {

    _isEmpty: function (v, param) {
        var param = param || null;
        var v = $.trim(v);
        switch (param) {
            case 'zero':
                return v == null || v == "N/A" || v == "" || v == "No" || v == "undefined" || v == "NaN" || v == "NA" || v == " " || v == "n/a" || v == "false" || v == "FALSE" || v == "NULL" || v == "null";
                break;
            default:
                return v == null || v == "N/A" || v == "" || v == "No" || v == 0 || v == "0" || v == "undefined" || v == "NaN" || v == "NA" || v == " " || v == "n/a" || v == "false" || v == "FALSE" || v == "NULL" || v == "null";
        }
    },

    comp: function (self, v1, v2, options) {
        if (v1 == v2) {
            return self.fn();
        } else {
            return self.inverse();
        }
    },

    isNotEmpty: function (self, val, options) {
        if (!this.cagService.isEmpty(val)) {
            return options.fn(self);
        } else {
            return options.inverse(self);
        }
    },

    lang: function (self, key) {
        return this.translationsService.lang(key);
    },

    init: function (TranslationsService) {
        this.translationsService = TranslationsService;
    }

};

function HandlebarsHelpers(TranslationsService) {
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
