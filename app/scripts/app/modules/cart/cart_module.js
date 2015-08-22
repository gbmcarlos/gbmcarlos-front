var CartController = require('./cart_controller.js');

module.exports = function (widget) {
    "use strict";

    widget.module('Cart', function (Cart) {

        Cart.init = function (config) {
            this.setConfig(config);
            this.setController();
            this.start();
        };

        Cart.setController = function () {
            CartController(widget);
            this.Controller.init(this.config);
        };

        Cart.setConfig = function (config) {
            this.config = config;
        };

        Cart.start = function () {
            this.Controller.start();
        };

        Cart.addProduct = function (product) {
            this.Controller.addProduct(product);
        };

        Cart.removeProduct = function (product) {
            this.Controller.removeProduct(product);
        };

        Cart.resetCart = function () {
            this.Controller.resetCart();
        };

        Cart.compareProducts = function () {
            this.Controller.compareProducts();
        };

        Cart.showModal = function () {
            this.Controller.showModal();
        };

        Cart.hideModal = function () {
            this.Controller.hideModal();
        };

        Cart.showCart = function () {
            this.Controller.showCart();
        };

        Cart.hideCart = function () {
            this.Controller.hideCart();
        };

        Cart.getCartProducts = function () {
            return this.Controller.products.getProducts();
        }

    });

    return widget;
};