'use strict';

var p = {

    isNotEmpty: function (v, param) {
        var param = param || null;
        var v = $.trim(v);
        switch (param) {
            case 'zero':
                return v != null && v != "N/A" && v != "" && v != "No" && v != "undefined" && v != "NaN" && v != "NA" && v != " " && v != "n/a" && v != "false" && v != "FALSE" && v != "NULL" && v != "null";
                break;
            default:
                return v != null && v != "N/A" && v != "" && v != "No" && v != 0 && v != "undefined" && v != "NaN" && v != "NA" && v != " " && v != "n/a" && v != "false" && v != "FALSE" && v != "NULL" && v != "null";
        }
    },

    isEmpty: function (v, param) {
        var param = param || null;
        var v = $.trim(v);
        switch (param) {
            case 'zero':
                return v == null || v == "N/A" || v == "" || v == "No" || v == "undefined" || v == "NaN" || v == "NA" || v == " " || v == "n/a" || v == "false" || v == "FALSE" || v == "NULL" || v == "null";
                break;
            default:
                return v == null || v == "N/A" || v == "" || v == "No" || v == 0 || v == "undefined" || v == "NaN" || v == "NA" || v == " " || v == "n/a" || v == "false" || v == "FALSE" || v == "NULL" || v == "null";
        }

    }

};

function cagHelper() {
}

cagHelper.prototype = {

    isNotEmpty: function(value, zero) {
        return p.isNotEmpty(value, zero);
    },

    isEmpty: function(value, zero) {
        return p.isEmpty(value, zero);
    }

};

module.exports = cagHelper;
