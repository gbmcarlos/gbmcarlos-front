'use strict';

var p = {

    languages: {
        'en-FI': require('./../resources/lang/en-FI.json'),
        'fi-FI': require('./../resources/lang/fi-FI.json'),
        'en-ID': require('./../resources/lang/en-ID.json'),
        'id-ID': require('./../resources/lang/id-ID.json'),
        'en-HK': require('./../resources/lang/en-HK.json'),
        'zh-HK': require('./../resources/lang/zh-HK.json'),
        'pt-PT': require('./../resources/lang/pt-PT.json'),
        'en-SG': require('./../resources/lang/en-SG.json')
    },

    cache: [],

    setLang: function(locale) {

        locale = locale || _.keys(this.languages)[0];

        this.language = this.languages[locale];

    },

    getTranslationFromCache: function(key) {

        return this.cache[key] || null;

    },

    getTranslationFromDefinitions: function(key) {

        var translation =_.find(this.language, {term: key});

        return translation ? translation.definition : null;

    },

    setTranslationCache: function(key, translation) {
        this.cache[key] = translation;
    },

    lang: function(key) {

        var translation;

        translation = this.getTranslationFromCache(key);

        if (!translation) {
            translation = this.getTranslationFromDefinitions(key);
        }

        if (!translation) {
            if (this.config.env == 'dev') {
                translation = key;
            } else {
                translation = '';
            }
        } else {
            this.setTranslationCache(key, translation);
        }

        return translation;

    }

};

function TranslationsService(){
}

TranslationsService.prototype = {

    setLang: function(locale) {
        p.setLang(locale);
    },

    lang: function(key) {
        return p.lang(key);
    }

}

module.exports = TranslationsService;