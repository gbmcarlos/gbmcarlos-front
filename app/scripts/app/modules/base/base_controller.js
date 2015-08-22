'use strict';

var BaseView = require('./base_view.js');

module.exports = function(widget) {

    widget.module("Base", function(Base, widget) {
        Base.Controller = {
            init: function(config) {
                this.setConfig(config);
                this.setView();
            },

            setView: function() {
                BaseView(widget);
            },

            setConfig: function(config) {
                this.config = config;
            },

            start: function() {

                this.layout = new this.View.appLayout();
                this.loader = new this.View.loaderView();

                widget.content.show(this.layout);

                this.layout.getRegion('loaderRegion').show(this.loader);
            },

            hideLoader: function() {
                this.loader.hide();
            },

            showLoader: function() {
                this.loader.show();
            },

            error: function() {

                widget.Base.hideLoader();
                widget.resultsRegion.show(new this.View.error());

            }
        };
    });

    return widget.Base.Controller;

};