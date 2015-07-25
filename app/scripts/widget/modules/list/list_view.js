var swiper = require('./../../../../../app/components/swiper/dist/idangerous.swiper.js');

module.exports = function (widget) {
    "use strict";

    widget.module("List", function (List, widget) {

        var config = widget.container.get('ConfigService').getConfig();

        List.Controller.View = {};

        List.Controller.View.product = widget.Marionette.LayoutView.extend({
            template: require('./templates/product-layout.hbs'),
            model: widget.Entities.Product,

            visible: false,

            regions: {
                featured: '.featured-region',
                company: '.company-region',
                columns: '.columns-region',
                actions: '.actions-region',
                apply: '.apply-region',
                moreInfo: '.more-info-region'
            },

            events: {
                'click .more_info_sh': function () {

                    this.moreInfoToogle(!this.visible);
                    this.visible = !this.visible;

                }
            },

            moreInfoToogle: function (show) {

                var translationsService = widget.container.get('TranslationsService');

                if (show) {
                    this.moreInfoRegion.show();
                    this.moreInfoText.html(translationsService.lang('more_hide'));
                    this.moreInfoIcon.removeClass('m-icon--arrow-down').addClass('m-icon--arrow-up');
                } else {
                    this.moreInfoRegion.hide();
                    this.moreInfoText.html(translationsService.lang('more_show'));
                    this.moreInfoIcon.removeClass('m-icon--arrow-up').addClass('m-icon--arrow-down');
                }

            },

            serializeData: function () {
                return this.model.toJSON();
            },

            onRender: function () {

                this.showRegion('featuredRegion', 'featured', List.Controller.View.featuredRegion);
                this.showRegion('companyRegion', 'company', List.Controller.View.companyRegion);
                this.showRegion('columnsRegion', 'columns', List.Controller.View.columnsRegion);
                this.showRegion('actionsRegion', 'actions', List.Controller.View.actionsRegion);
                this.showRegion('applyRegion', 'apply', List.Controller.View.applyRegion);
                this.showRegion('moreInfoRegion', 'moreInfo', List.Controller.View.moreInfoRegion);

                this.getInteractiveElements();

                this.$el.find('[data-toggle]').tooltip();
            },

            getInteractiveElements: function() {
                this.moreInfoText = this.$el.find('.list__action-text');
                this.moreInfoIcon = this.$el.find('.list__action-item .m-icon');
            },

            showRegion: function (regionName, regionArea, view) {
                this[regionName] = new view();
                this[regionName].model = this.model;
                this.getRegion(regionArea).show(this[regionName]);
            }

        });

        List.Controller.View.columnsRegion = widget.Marionette.ItemView.extend({
            template: require('./templates/product-columns.hbs'),
            model: widget.Entities.Product,

            serializeData: function () {

                var columnMapping = widget.container.get('MappingService').getColumnMapping(this.model.attributes);

                return _.extend(columnMapping, this.model.toJSON());
            }

        });

        List.Controller.View.moreInfoRegion = widget.Marionette.ItemView.extend({
            template: require('./templates/product-more-info.hbs'),
            model: widget.Entities.Product,

            events: {
                'click a': function (ev) {

                    var el = $(ev.currentTarget),
                        name = el.parent().attr('name');

                    var activeBody = this.$el.find('.tab-pane.active');
                    activeBody.removeClass('active');

                    var bodyToActive = this.$el.find('.tab-pane[name="' + name + '"]');
                    bodyToActive.addClass('active');

                    var activeHeader = this.$el.find('.nav-tabs li.active');
                    activeHeader.removeClass('active');

                    var headerToActive = this.$el.find('.nav-tabs li[name="' + name + '"]');
                    headerToActive.addClass('active');

                }
            },

            show: function () {
                this.$el.children().slideDown();
            },

            hide: function () {
                this.$el.children().slideUp();
            },

            serializeData: function () {

                var showMoreInfo = config.features.moreInfo;

                var moreInfoMapping = widget.container.get('MappingService').getMoreInfoMapping(this.model.attributes);

                return _.extend({showMoreInfo: showMoreInfo}, moreInfoMapping, this.model.toJSON());
            }

        });

        List.Controller.View.featuredRegion = widget.Marionette.ItemView.extend({
            template: require('./templates/product-featured.hbs'),

            serializeData: function () {
                return this.model.toJSON();
            }

        });

        List.Controller.View.companyRegion = widget.Marionette.ItemView.extend({
            template: require('./templates/product-company.hbs'),

            serializeData: function () {
                return this.model.toJSON();
            }

        });

        List.Controller.View.actionsRegion = widget.Marionette.ItemView.extend({
            template: require('./templates/product-actions.hbs'),

            onRender: function () {
                this.getInteractiveElements();
                this.model.on('change:compareCheck', this.checkProduct, this);
            },

            events: {
                'click .form-radcheck__elem': function (ev) {
                    var el = $(ev.currentTarget),
                        id = el.attr('id').replace(/[^0-9]+/, '');

                    if (el.is(':checked')) {
                        if (this.canBeChecked(el)) {
                            this.model.set('compareCheck', true);
                            List.addCart(this.model);
                        } else {
                            ev.stopPropagation();
                            return false;
                        }
                    } else {
                        this.model.set('compareCheck', false);
                        List.removeCart(this.model);
                    }
                }
            },

            canBeChecked: function (el) {
                return List.getCartProducts().length < widget.container.get('ConfigService').getPrefs().cartLimit;
            },

            checkProduct: function () {

                var checked = this.model.get('compareCheck');

                this.checkButton.prop('checked', checked);
            },


            getInteractiveElements: function() {
                this.checkButton = this.$el.find('.form-radcheck__elem');
            },

            serializeData: function () {
                return _.extend({
                    showCompare: config.features.compareCart,
                }, this.model.toJSON());
            }

        });

        List.Controller.View.applyRegion = widget.Marionette.ItemView.extend({
            template: require('./templates/product-apply.hbs'),

            events: {

                'click .goto_site': function (ev) {

                    var target = $(ev.currentTarget),
                        link = target.attr('data-link'),
                        company = this.model.get('company').name,
                        name = this.model.get('name');

                    this.goToSiteLogic(target, link, company, name);

                }
            },

            goToSiteLogic: function(target, link, company, name) {
                if (target.hasClass('result-cta__visit')) {

                    this.track('visit', company, name);

                } else {

                    if (target.hasClass('more-result__info')) {

                        this.track('promoApply', company, name);

                    } else {

                        this.track('apply', company, name);

                    }

                    if (!this.model.get('hasOverlay')) {

                        this.lead({
                            company: company,
                            name: name
                        });

                    }
                }

                if (!!this.model.get('hasOverlay')) {

                    this.showOverlay();

                } else if (!!link){

                    this.redirect(link);

                }
            },

            redirect: function(link) {
                url = config.siteConfig.urls.redir + encodeURIComponent(link);
                window.open(url, '_blank');
            },

            showOverlay: function() {

            },

            lead: function(data) {
                widget.container.get('LeadsService').lead(data);
            },

            track: function(event, company, name) {
                widget.container.get('AnalyticsService').track('event', {
                    category: widget.container.get('RequestService').getCategory(),
                    company: company,
                    name: name
                });
            },

            serializeData: function () {
                return this.model.toJSON();
            }

        });


        List.Controller.View.noResults = widget.Marionette.ItemView.extend({
            template: require('./templates/products-no-results.hbs'),
            className: "hdr2 text-center no_more_deal"
        });

        List.Controller.View.products = widget.Marionette.CompositeView.extend({
            template: require('./templates/results-layout.hbs'),
            emptyView: List.Controller.View.noResults,
            childView: List.Controller.View.product,
            childViewContainer: ".cgg-comparison-widget-results-list",

            events: {
                'click .load-more': function () {

                    this.showNextLoading();

                    List.next();
                }
            },

            onRender: function() {
                this.getInteractiveElements();
            },

            getInteractiveElements: function() {
                this.loadMore = this.$el.find('.load-more');
                this.loadMoreLoader = this.$el.find('.loading-container-load-more');
            },

            showNextLoading: function () {

                this.loadMoreLoader.fadeTo("fast", 1).css({display: 'block'});
                this.loadMore.hide();

            },

            initialize: function () {
                this.collection = this.options.collection;

            },

            serializeData: function () {
                return {
                    moreResultsLength: this.options.moreResultsLength
                };
            }
        });

        List.Controller.View.group = widget.Marionette.CompositeView.extend({
            template: require('./templates/product-group.hbs'),
            childView: List.Controller.View.product,
            childViewContainer: ".cgg-comparison-widget-results-group",


            initialize: function () {
                this.collection = this.model.collection;
            }

        });

        List.Controller.View.grouping = List.Controller.View.products.extend({
            childView: List.Controller.View.group
        });

    });

    return widget.List.View;
};
