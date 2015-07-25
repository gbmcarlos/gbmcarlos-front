module.exports = function (widget) {
    "use strict";

    widget.module("Entities", function (Entities, widget) {

        var config = widget.container.get('ConfigService').getConfig();

        Entities.Cart = Entities.Product.extend({

            defaults: {
                placeholder: true,
                logo: 'http://staticassets.compareglobal.net/creditcard/images/blank-cc.png'
            },

            initialize: function(model) {
                if (!model.name) {
                    this.set('empty', true);
                }
            }
        });

        Entities.CartCollection = widget.Backbone.Collection.extend({
            localStorage: new widget.Backbone.LocalStorage('cart_creditcard_' + config.locale),
            model: Entities.Cart,
            comparator: 'detail',
            limit: widget.container.get('ConfigService').getPrefs().cartLimit,

            initialize: function (item) {

                this.on('add', function (item) {
                    if (!item.get('empty')) {
                        item.save();
                        this.populate();
                    }

                });

                this.on('remove', function (item) {
                    item.destroy();
                    this.populate();
                });

                this.on('reset', function () {
                    this.localStorage._clear();
                    this.populate();
                });
            },

            getProducts: function() {
                return _.filter(this.models, function (product) {
                    return !product.get('empty');
                });
            },

            populate: function () {

                this.models = this.getProducts();

                var delta = this.limit - this.getProducts().length;

                for (var i = 0;i < delta;i++) {
                    this.models.push(new Entities.Cart(new widget.Entities.Product()));
                }
            }

        });

    });
    
    return widget;
};