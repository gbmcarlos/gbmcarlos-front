var ListView = require('./list_view.js');

module.exports = function (widget) {
    "use strict";


    widget.module('List', function(List, widget) {
        List.Controller = {

            init: function() {
                this.setRequestService();
                this.setConfig();
                this.setView();
            },

            setRequestService: function() {
                this.requestService = widget.container.get('RequestService');
            },

            setConfig: function() {
                this.config = widget.container.get('ConfigService').getConfig();
            },

            setView: function() {
                ListView(widget);
            },

            start: function(results) {

                widget.Base.hideLoader();

                if (this.requestService.getPage() == 1) {
                    this.createViews(results);
                } else {
                    this.appendView(results);
                }


            },

            createViews: function(results) {

                var view = this.View.products;

                this.collection = this.getCollection(results.data);

                if (this.getGrouping()) {
                    view = this.View.grouping;
                }

                var moreResultsLength = this.getMoreResultsLength(results);

                this.productsView = new view({
                    collection: this.collection,
                    moreResultsLength: moreResultsLength
                });

                widget.resultsRegion.show(this.productsView);

                if (this.config.features.showCompare) {
                    this.collection.checkProducts(widget.Cart.getCartProducts());
                }

            },

            getCollection: function(results) {

                var collection = new widget.Entities.ProductCollection(results);

                var grouping = this.getGrouping();

                if (grouping) {

                    collection = this.fillGroups(grouping, collection);

                }

                return collection;
            },

            getGrouping: function() {

                var category = widget.container.get('RequestService').getCategoryDefinition();

                var grouping = category.grouping;

                return grouping;

            },

            fillGroups: function(_groups, _products) {

                var dataService = widget.container.get('DataService');

                var groups = new widget.Entities.GroupCollection();

                _.each(_groups, function(_group) {

                    var products = [];

                    _products.each(function(_product) {

                        var value = dataService.getDatum(_group.condition, _product.attributes);

                        if (value && products.length < 3) {
                            products.push(_product);
                        }

                    });

                    var group = new widget.Entities.Group({
                        name: _group.name,
                        titleKey: _group.titleKey,
                        icon: _group.icon
                    });

                    group.collection = new widget.Backbone.Collection(products);

                    groups.add(group);

                });

                return groups;

            },

            getMoreResultsLength: function(results) {

                var moreResultsLength = null;

                if (!this.getGrouping()) {

                    moreResultsLength = results.total - this.collection.length;
                    moreResultsLength = (moreResultsLength > 0) ? moreResultsLength : null;

                }

                return moreResultsLength;

            },

            uncheckProduct: function(productId) {
                if (!!this.collection) {
                    this.collection.uncheckProduct(productId);
                }
            },

            next: function() {

                this.requestService.setPage(this.requestService.getPage() + 1);

                this.requestService.getProducts();

            },

            appendView: function(results) {

                this.collection.add(results.data);

                var moreResultsLength = this.getMoreResultsLength(results);

                this.productsView.options.moreResultsLength = moreResultsLength;

                this.productsView.render();
            }

        };
    });


    return widget.List.Controller;
};