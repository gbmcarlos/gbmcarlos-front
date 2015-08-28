'use strict';

var p = {

    init: function(app) {
        this.app = app;
    },

    setConfig: function(config) {
        this.config = config;
    },

    setView: function(baseView) {
        this.baseView = baseView;
    },

    start: function() {

        //this.layout = new this.baseView.appLayout();
        //this.loader = new this.baseView.loaderView();
        //
        //this.widget.content.show(this.layout);
        //
        //this.layout.getRegion('loaderRegion').show(this.loader);
        //
        //this.loader.show();

    },

    hideLoader: function() {
        this.loader.hide();
    },

    showLoader: function() {
        this.loader.show();
    },

    error: function() {

        this.hideLoader();
        widget.resultsRegion.show(new this.baseView.error());

    }

};

BaseModule.prototype = {

    init: function () {

        p.init(this.app);

        this.app.on('products:error', function() {
            this.error();
        }, this);

    },

    setController: function () {
        p.init();
    },

    start: function () {
        p.start();
    },

    hideLoader: function() {
        p.hideLoader();
    },

    showLoader: function() {
        p.showLoader();
    },

    triggerLibrisDependencies: function() {
        p.triggerLibrisDependencies();
    },

    error: function() {
        p.error();
    },

    getLayout: function() {
        return p.layout;
    },

    setView: function(view) {
        this.view = view;
        p.setView(view);
    }

};

function BaseModule(app) {

    this.app = app;

    this.init();

}

module.exports = BaseModule;
