var TabView = require('./tab_view.js');

module.exports = function (widget) {
    "use strict";

    widget.module('Tab', function(Tab, widget) {
        Tab.Controller = {

            started: false,

            init: function(config) {
                this.setConfig(config);
                this.setView();
            },

            setView: function() {
                TabView(widget);
            },

            setConfig: function(config) {
                this.config = config;
            },

            start: function() {

                if (this.started) {
                    this.tabsView.render();
                } else {
                    this.createViews();
                }

            },

            createViews: function() {

                var tabs = this.getTabs();

                var collection = new widget.Entities.TabCollection(tabs);

                this.tabsView = new this.View.tabs({
                    collection: collection
                });

                widget.tabRegion.show(this.tabsView);

                this.started = true;
            },

            getTabs: function() {
                var tabs = [],
                    i = 0;

                _.each(this.config, function(tab, key) {
                    tabs.push({
                        'id': (i+1),
                        'name': (!!tab.lang) ? tab.lang : 'tabs_'+key.toUpperCase(),
                        'value': tab.filter.toUpperCase(),
                        'alias': key,
                        'icon': tab.icon
                    });
                    i += 1;
                });

                return tabs;
            },

            showResultsLength: function(products) {
                this.tabsView.resultsLength(products.length);
            },

            hideResultsLength: function() {
                this.tabsView.resultsLength(0);
            }

        };
    });

    return widget.Tab.Controller;

};
