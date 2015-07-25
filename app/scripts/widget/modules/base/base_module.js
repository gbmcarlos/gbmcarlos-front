'use strict';

var BaseController = require('./base_controller.js');

module.exports = function (widget) {

    widget.module('Base', function (Base, widget) {

        widget.on('products:error', function() {
            Base.error();
        });

        Base.init = function (config) {
            this.setConfig(config);
            this.setController();
            this.start();
        };

        Base.setController = function () {
            BaseController(widget);
            this.Controller.init();
        };

        Base.setConfig = function (config) {
            this.config = config;
        };

        Base.start = function () {
            this.Controller.start();
        };

        Base.hideLoader = function() {
            this.Controller.hideLoader();
        };

        Base.showLoader = function() {
            this.Controller.showLoader();
        };

        Base.error = function() {
            this.Controller.error();
        };

    });

    return widget;

};