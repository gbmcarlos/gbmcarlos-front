var ListController = require('./list_controller.js');

module.exports = function (widget) {
    "use strict";

    widget.module('List', function(List) {

        widget.on('products:loaded', function(results) {
            List.start(results);
        });

        List.init = function (config) {
            this.setConfig(config);
            this.setController();
        };

        List.setController = function () {
            ListController(widget);
            this.Controller.init(this.config);
        };

        List.setConfig = function (config) {
            this.config = config;
        };

        List.start = function (results) {
            this.Controller.start(results);
        };

        List.getCartProducts = function() {
            return widget.Cart.getCartProducts();
        };

        List.addCart = function(product) {
            widget.Cart.addProduct(product);
        };

        List.removeCart = function(product) {
            widget.Cart.removeProduct(product);
        };

        List.uncheckProduct = function(productId) {
            this.Controller.uncheckProduct(productId);
        };

        List.next = function() {
            this.Controller.next();
        };

        List.error = function() {
            this.Controller.error();
        };

    });

    return widget;
};
