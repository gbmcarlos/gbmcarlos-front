'use strict';

var SortView = require('./sort_view.js');

module.exports = function(widget) {

    widget.module("Sort", function(Sort, widget) {
        Sort.Controller = {
            init: function(config) {
                this.setConfig(config);
                this.setView();
            },

            setView: function() {
                SortView(widget);
            },

            setConfig: function(config) {
                this.config = config;
            },

            start: function(results) {

                this.createViews(results);

            },

            createViews: function(results) {

                var sorting = this.getSorting(results);

                var sorts = this.getSorts(sorting);

                var collection = new widget.Entities.SortCollection(sorts);

                this.sortsView = new this.View.sorts({collection: collection});

                widget.sortRegion.show(this.sortsView);

            },

            getSorting: function(results) {

                return {
                    direction: results.sort.direction,
                    sortby: widget.container.get('RequestService').getSortBy()
                };

            },

            getSorts: function(sorting) {

                var collection = [];

                var category = widget.container.get('RequestService').getCategoryDefinition();

                var sorts = category.sorts;

                _.each(sorts, function(sort, index) {

                    collection.push({
                        ordered: (sorting.sortby == index+1),
                        direction: sorting.direction,
                        name: sort,
                        index: index+1
                    });

                });

                return collection;

            },

            newSort: function(sort) {

                if (sort.get('ordered')) {
                    return  {
                        sortby: sort.get('index'),
                        direction: (sort.get('direction') == -1) ? 'asc' : 'desc'
                    };
                } else {
                    return  {
                        sortby: sort.get('index')
                    };
                }

            }

        };
    });

    return widget.Base.Controller;

};