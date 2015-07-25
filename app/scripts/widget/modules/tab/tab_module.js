var TabController = require('./tab_controller.js');

module.exports = function (widget) {
    "use strict";

    widget.module('Tab', function(Tab) {

        widget.on('products:loaded', this.showResultsLength, this);

        Tab.init = function (config) {
            this.setConfig(config);
            this.setController();
            Tab.start();
        };

        Tab.setController = function () {
            TabController(widget);
            this.Controller.init(this.config);
        };

        Tab.setConfig = function (config) {
            this.config = config;
        };

        Tab.start = function () {
            this.Controller.start(this.config);
        };

        Tab.changeCategory = function(category) {

            this.hideResultsLength();

            widget.Base.showLoader();

            widget.container.get('RequestService').setFilter(category);
            widget.container.get('RequestService').setPage(1);
            widget.container.get('RequestService').getProducts();

            this.start();

        };

        Tab.showResultsLength = function(products) {
            this.Controller.showResultsLength(products);
        };

        Tab.hideResultsLength = function() {
            this.Controller.hideResultsLength();
        };

    });

    return widget;

};
