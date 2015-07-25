module.exports = function (widget) {
    "use strict";

    widget.module("Entities", function (Entities, widget) {

        Entities.Sort = widget.Backbone.Model.extend({

        });

        Entities.SortCollection = widget.Backbone.Collection.extend({
            model: Entities.Sort
        });

    });

    return widget;
};
