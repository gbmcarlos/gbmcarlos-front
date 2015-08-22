'use strict';

module.exports = function (widget) {

    widget.module("Sort", function (Sort, widget) {

        Sort.Controller.View = {};

        Sort.Controller.View.sort = widget.Marionette.ItemView.extend({
            template: require('./templates/sort.hbs'),
            className: 'col-xs-4 col-sm-4 sort-menu__item sorter',

            events: {
                'click' : function(ev) {

                    this.showLoader();
                    Sort.sort(this.model);

                }
            },

            showLoader: function() {
                this.$el.find('.sort-menu__arrow').css({width: "14px", height: "14px"}).html('<div class="spinner" style="right: 20px;"></div>');
            },

            serializeData: function () {
                return this.model.toJSON();
            }
        });

        Sort.Controller.View.sorts = widget.Marionette.CompositeView.extend({
            template: require('./templates/sorts.hbs'),
            childView: Sort.Controller.View.sort,
            childViewContainer: ".cgg-comparison-widget-sort_list"
        });

    });

    return widget.Sort.View;
};
