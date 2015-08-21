'use strict';

var p = {

    init: function(numeral, translationsService) {
        this.numeral = numeral;
        this.translationsService = translationsService;
    },

    setObject: function(object) {
        this.currentObject = object;
    },

    getDatum: function(definition) {

        var datum;

        if (!!definition.datum) {
            datum = this.getDatumFromObject(definition.datum, this.currentObject);
        }

        if (!!datum && !!definition.numberFormat) {
            datum = this.formatDatum(datum, definition.format);
        }

        if (!!datum && !!definition.condition) {
            datum = this.getConditionDatum(datum, definition.condition);
        }

        if (!!datum && !!definition.compare) {
            datum = this.getCompareDatum(datum, definition.compare);
        }

        if (!!datum && !!definition.symbol) {
            datum = this.getSymbolDatum(datum, definition.symbol);
        }

        if (this.isEmpty(datum) && !!definition.empty) {
            datum = this.getEmptyDatum(definition.empty);
        }

        return datum;
    },

    getDatumFromObject: function(path, object) {

        var fragments = path.split('.');

        _.each(fragments, function(fragment) {

            if (!!object) {

                var arraySyntax = this.findArraySyntax(fragment);

                if (arraySyntax) {

                    var _fragment = arraySyntax[0];

                    if (object.hasOwnProperty(_fragment)) {
                        object = object[_fragment];

                        object = _.find(object, function(_object){
                            if (_object.hasOwnProperty(arraySyntax[1])) {
                                return (_object[arraySyntax[1]] == arraySyntax[2]);
                            }
                        });

                    } else {
                        object = null;
                    }

                } else {

                    if (object.hasOwnProperty(fragment)) {
                        object = object[fragment];
                    } else {
                        object = null;
                    }

                }

            }

        }, this);

        return object;

    },

    findArraySyntax: function(fragment) {

        var regex = /(\w+)\[(\w+)=(\w+)]/;

        var matches = fragment.match(regex);

        return matches ? _.rest(matches) : matches;

    },

    formatDatum: function(datum, format) {
        if (this.isNotEmpty(number)) {
            return this.numeral(number).format(format);
        }
        return 0;
    },

    getConditionDatum: function(datum, conditionDefinition) {

        var otherProperty = null;

        if (!!conditionDefinition.otherProperty) {

            otherProperty = this.getDatumFromObject(conditionDefinition.otherProperty, this.currentObject);

            if (conditionDefinition.expectedEmpty == this.isEmpty(otherProperty)) {

                datum = this.getDatumFromObject(conditionDefinition.thenProperty, this.currentObject);

            }

        }

        return datum;

    },

    getCompareDatum: function(datum, compareDefinition) {

        var otherProperty = null;

        if (!!compareDefinition.otherProperty) {

            otherProperty = this.getDatumFromObject(compareDefinition.otherProperty, this.currentObject);

            if (datum == otherProperty) {

                datum = this.getDatumFromObject(compareDefinition.thenProperty, this.currentObject);

            }

        }

        return datum;

    },

    getSymbolDatum: function(datum, symbolDefinition) {

        if (!!symbolDefinition.before) {

            var symbol = null;

            if (symbolDefinition.before.symbol) {
                symbol = symbolDefinition.before.symbol;
            }

            if (!symbol && symbolDefinition.before.symbolLang) {
                symbol = this.translationsService.lang(symbolDefinition.before.symbolLang);
            }

            datum = symbol + datum;
        }

        if (!!symbolDefinition.after) {

            var symbol = null;

            if (symbolDefinition.after.symbol) {
                symbol = symbolDefinition.after.symbol;
            }

            if (!symbol && symbolDefinition.after.symbolLang) {
                symbol = this.translationsService.lang(symbolDefinition.after.symbolLang);
            }

            datum = datum + symbol;
        }

        return datum;

    },

    getEmptyDatum: function(emptyDefinition) {

        var emptyDatum = null;

        if (!!emptyDefinition.emptyValue) {
            emptyDatum = emptyDefinition.emptyValue;
        }

        if (!!emptyDefinition.emptyLang) {
            emptyDatum = this.translationsService.lang(emptyDefinition.emptyLang);
        }

        return emptyDatum;
    },

    isEmpty: function (v, param) {
        var param = param || null;
        var v = $.trim(v);
        switch (param) {
            case 'zero':
                return v == null || v == "N/A" || v == "" || v == "No" || v == "undefined" || v == "NaN" || v == "NA" || v == " " || v == "n/a" || v == "false" || v == "FALSE" || v == "NULL" || v == "null";
                break;
            default:
                return v == null || v == "N/A" || v == "" || v == "No" || v == 0 || v == "0" || v == "undefined" || v == "NaN" || v == "NA" || v == " " || v == "n/a" || v == "false" || v == "FALSE" || v == "NULL" || v == "null";
        }

    }


};

function DataService(widget, translationsService){
    this.widget = widget;
    this.translationsService = translationsService;

    this.init();
}

DataService.prototype = {

    init: function() {
        p.init(this.widget.numeral, this.translationsService);
    },

    getDatum: function(definition, object) {
        p.setObject(object);
        return p.getDatum(definition);
    },

    getDatumFromObject: function(datum, object) {
        return p.getDatumFromObject(datum, object)
    }

}

module.exports = DataService;
