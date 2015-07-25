var CartView = require('./cart_view.js');

module.exports = function (widget) {
    "use strict";

    widget.module("Cart", function (Cart, widget) {
        Cart.Controller = {

            init: function (config) {
                this.setConfig(config);
                this.setView();
                this.setCollection();
            },

            setView: function () {
                CartView(widget);
            },

            setConfig: function (config) {
                this.config = config;
            },

            setCollection: function () {
                this.products = new widget.Entities.CartCollection();
            },

            start: function () {

                this.modalView = new this.View.modal({collection: this.products});
                widget.Base.Controller.layout.modalRegion.show(this.modalView);

                this.cartView = new this.View.cart({collection: this.products});
                widget.Base.Controller.layout.cartRegion.show(this.cartView);

                this.setComparisonBehavior();

                this.getProducts();

            },

            setComparisonBehavior: function () {

                this.products.on('add', function () {

                    this.showCart();

                    if (this.products.getProducts().length > 1) {
                        this.enableCompare();
                    } else {
                        this.disableCompare();
                    }

                }, this);

                this.products.on('remove', function () {

                    if (this.products.getProducts().length < 2) {
                        this.disableCompare();
                    }

                    if (this.products.getProducts().length < 1) {
                        this.hideCart();
                    }

                }, this);

            },

            enableCompare: function () {
                this.cartView.enableCompare();
            },

            disableCompare: function () {
                this.cartView.disableCompare();
            },

            resetCart: function () {

                this.products.each(function(product) {
                    if (product.get('name')) {
                        widget.List.uncheckProduct(product.get('id'));
                    }
                });

                this.products.reset();
                this.hideCart();
            },

            compareProducts: function () {

                this.modalView.show();
            },

            addProduct: function (product) {

                if (this.products.getProducts().length < widget.container.get('ConfigService').getPrefs().cartLimit) {

                    product = new widget.Entities.Cart(new widget.Entities.Product(product.attributes).attributes);

                    this.products.add(product);
                    this.cartView.render();
                }

            },

            removeProduct: function (product) {

                this.products.remove(product.get('id'));
                this.cartView.render();
            },

            getProducts: function () {

                var storedProducts = this.products.localStorage.findAll();

                var cartProducts = [];

                _.each(storedProducts, function (p) {
                    cartProducts.push(new widget.Entities.Cart(new widget.Entities.Product(p).attributes));
                });

                this.products.add(cartProducts);

            },

            showCart: function () {
                this.cartView.show();
            },

            hideCart: function () {
                this.cartView.hide();
            },

            showModal: function () {
                this.modalView.show();
            },

            hideModal: function () {
                this.modalView.hide();
            }
        };
    });

    return widget.Cart.Controller;

};
