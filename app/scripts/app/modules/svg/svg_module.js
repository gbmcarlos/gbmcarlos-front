'use strict';

var p = {

    init: function(app, svgService) {
        this.app = app;
        this.svgService = svgService;

    },

    setConfig: function(config) {
        this.config = config;
    },

    setView: function(viewName, view) {
        this[viewName] = view;
    },

    start: function() {
        var svgContainer = this.getSvgContainer();
        this.svgService.start(svgContainer, this.prefs);
    },

    getSvgContainer: function() {
        return this.baseView.getSvgContainer();
    }

};

SvgModule.prototype = {

    init: function () {

        p.init(this.app, this.svgService);

    },

    start: function() {
        p.start();
    },

    setView: function(viewName, view) {
        this[viewName] = view;
        p.setView(viewName, view);
    }
};

function SvgModule(app, svgService) {

    this.app = app;
    this.svgService = svgService;

    this.init();

}

module.exports = SvgModule;
