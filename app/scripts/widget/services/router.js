module.exports = function (widget) {
    "use strict";

    widget.module("Router", function(Router, widget) {

        Router = widget.Marionette.AppRouter.extend({
            controller: widget.Tab.Controller,
            appRoutes: {
                ":category": "category"
            }
        });

        if(widget.Backbone.history && !widget.Backbone.History.started) {
            widget.Backbone.history.start({ pushState: true });
        }
    });

    return widget;
};
