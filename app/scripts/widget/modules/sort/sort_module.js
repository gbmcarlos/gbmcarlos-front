'use strict';

var SortController = require('./sort_controller.js');

module.exports = function (widget) {

    widget.module('Sort', function (Sort, widget) {


        widget.on('products:loaded', function(results) {
            this.start(results);
        }, this);

        Sort.init = function (config) {
            this.setConfig(config);
            this.setController();
        };

        Sort.setController = function () {
            SortController(widget);
            this.Controller.init(this.config);
        };

        Sort.setConfig = function (config) {
            this.config = config;
        };

        Sort.start = function (results) {
            this.Controller.start(results);
        };

        Sort.sort = function(sort) {

            var newSort = this.Controller.newSort(sort);

            widget.container.get('RequestService').setSort(newSort);
            widget.container.get('RequestService').getProducts();
        }

    });

    return widget;

};