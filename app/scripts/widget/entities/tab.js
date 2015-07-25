module.exports = function(widget) {
    "use strict";

    widget.module("Entities", function(Entities, widget) {

        Entities.Tab = widget.Backbone.Model.extend({});

        Entities.TabCollection = widget.Backbone.Collection.extend({
            model: Entities.Tab
        });

    });

    return widget;
};
