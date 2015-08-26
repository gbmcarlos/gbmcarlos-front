'use strict';
BaseView.prototype = {

    init: function() {

        this.setConfig();
        this.setAppLayout();
        this.setBrandView();
        this.setLoaderView();
        this.setError();

    },


    setAppLayout: function() {

        var self = this;

        this.appLayout = this.widget.Marionette.LayoutView.extend({
            template: require('./templates/layout.hbs'),
            className: function () {
                var classNames = ['cgg-comparison-widget'];

                return classNames.join(' ');
            }
        });
    },

    setBrandView: function() {

        this.brandView = this.widget.Marionette.ItemView.extend({
            template: require('./templates/brand.hbs'),

            model: new this.widget.Backbone.Model({
                total: 0
            }),

            modelEvents: {
                'change': 'totalChanged'
            },

            totalChanged: function () {
                this.render();
            },

            onRender: function () {
                this.$el = this.$el.children();
                this.$el.unwrap();
                this.setElement(this.$el);
            }
        });

    },

    setLoaderView: function() {

        this.loaderView = this.widget.Marionette.ItemView.extend({
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

    },

    setError: function() {

        this.error = this.widget.Marionette.ItemView.extend({
            template: require('./templates/error.hbs')
        });

    }

};

function BaseView(widget, ConfigService) {

    this.widget = widget;
    this.configService = ConfigService;
    this.init();

}

module.exports = BaseView;
