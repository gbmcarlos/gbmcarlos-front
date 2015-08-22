'use strict';

module.exports = function(widget) {

    widget.module('Base', function(Base) {

        var config = widget.container.get('ConfigService').getConfig();
        var prefs = widget.container.get('ConfigService').getPrefs();

        Base.Controller.View = {};

        Base.Controller.View.appLayout = widget.Marionette.LayoutView.extend({
            template: require('./templates/layout.hbs'),
            className: function () {
                var classNames = ['cgg-comparison-widget'];
                classNames.push('lang-' + config.siteConfig.code);
                classNames.push('locale-' + config.locale);

                return classNames.join(' ');
            },

            onRender: function () {
                if (!!prefs.subscriber) {
                    this.$el.addClass('subscriber-'+_.snakeCase(prefs.subscriber));
                }

                if (!!prefs.noSpacing && prefs.noSpacing) {
                    this.$el.addClass('cgg-comparison-widget-no-spacing');
                } else {
                    this.$el.addClass('cgg-comparison-widget-spacing');
                }

                if (!!prefs.showHero) {
                    // cast to boolean
                    prefs.showHero = JSON.parse(prefs.showHero);

                    if (!prefs.showHero) {
                        this.$el.addClass('cgg-comparison-widget-no-hero');
                    }
                }
            },

            regions: {
                brand: ".cgg-comparison-widget-brand",
                tabRegion: ".cgg-comparison-widget-tab_menu",
                sortRegion: ".cgg-comparison-widget-sort_menu",
                resultsRegion: ".cgg-comparison-widget-results",
                loaderRegion: ".cgg-comparison-widget-loader_container",
                cartRegion: '.cgg-comparison-widget-cart',
                modalRegion: ".cgg-comparison-widget-h2h"
            }
        });

        Base.Controller.View.brandView = widget.Marionette.ItemView.extend({
            template: require('./templates/brand.hbs'),

            model: new widget.Backbone.Model({
                total: 0
            }),

            modelEvents: {
                'change': 'totalChanged'
            },

            totalChanged: function() {
                this.render();
            },

            onRender: function () {
                this.$el = this.$el.children();
                this.$el.unwrap();
                this.setElement(this.$el);
            }
        });

        Base.Controller.View.loaderView = widget.Marionette.ItemView.extend({
            template: require('./templates/loading.hbs'),

            onRender: function() {
                this.getInteractiveElements();
            },

            getInteractiveElements: function() {
                this.loadingContainer = this.$el.find('.loading-container');
            },

            show: function () {

                this.loadingContainer.show();
            },

            hide: function () {
                this.loadingContainer.hide();
            }
        });


        Base.Controller.View.error = widget.Marionette.ItemView.extend({
            template: require('./templates/error.hbs')
        });

    });

    return widget;

};