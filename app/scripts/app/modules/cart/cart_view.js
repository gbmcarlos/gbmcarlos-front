module.exports = function (widget) {
    "use strict";

    var config = widget.container.get('ConfigService').getConfig();

    widget.module("Cart", function (Cart, widget) {

        Cart.Controller.View = {};

        Cart.Controller.View.cartItem = widget.Marionette.ItemView.extend({
            template: require('./templates/cart_item.hbs'),
            tagName: 'li',
            className: 'shortlisted',

            events: {
                'click .modal-compare__close-card': function (ev) {
                    var target = $(ev.currentTarget),
                        productId = target.attr('data-slID');

                    Cart.removeProduct(this.model);
                    widget.List.uncheckProduct(productId);

                    return false;

                }
            },

            serializeData: function () {
                return this.model.toJSON();
            }
        });

        Cart.Controller.View.cart = widget.Marionette.CompositeView.extend({
            template: require('./templates/cart.hbs'),
            childView: Cart.Controller.View.cartItem,
            childViewContainer: ".sc-block__cards ul",
            className: 'shortlist-cards',
            compareDisabled: false,
            events: {
                'click .sc-block__href': function (ev) {
                    Cart.resetCart();
                },

                'click .btn-compare-cards': function (ev) {
                    Cart.compareProducts();
                }
            },

            initialize: function(){
            },

            enableCompare: function() {
                this.compareDisabled = false;
            },

            disableCompare: function() {
                this.compareDisabled = true;
            },

            show: function () {
                this.$el.show();
            },

            hide: function () {
                this.$el.hide();
            },

            serializeData: function() {
                return {
                    count: Cart.Controller.products.getProducts().length,
                    compareDisabled: this.compareDisabled
                };
            }
        });

        Cart.Controller.View.modal = widget.Marionette.LayoutView.extend({
            template: require('./templates/cart_modal.hbs'),
            className: 'modal fade modal--cag hidden-xs',
            model: widget.Entities.Cart,
            attributes: {
                "id": 'myModal',
                "data-modal-compare": null,
                "role": 'dialog',
                "tabindex": '-1',
                "aria-labelledby": 'myModalLabel',
                "aria-hidden": 'false'
            },

            regions: {
                overviews: '.modal-compare-card',
                blocks: '.blocks'
            },

            onRender: function () {

                this.showBlocks();

                this.$el.find('[data-toggle]').tooltip();
            },

            show: function() {
                this.$el.modal();
            },

            hide: function() {
                this.$el.modal('hide');
            },

            serializeData: function () {
				this.options.name = config.name;
                this.options.logo = config.urls.assets + '/images/logo/' + config.locale.toLowerCase() + '.png';
                return this.options;
            },

            showBlocks: function () {
                this.blocksView = new Cart.Controller.View.blocks();
                this.blocksView.collection = Cart.Controller.products;

                this.getRegion('blocks').show(this.blocksView);
            }
        });

        Cart.Controller.View.blocks = widget.Marionette.ItemView.extend({
            template: require('./templates/cart_blocks.hbs'),

            serializeData: function() {

                var cartMapping = widget.container.get('MappingService').getCartMapping(this.collection);

                return cartMapping;
            }
        });

        // Collection of cards
        Cart.Controller.View.modalOverviews = widget.Marionette.CollectionView.extend({
            className: '',

            getChildView: function (item) {
                if (!!item.get('name')) {
                    return View.modalOverview;
                } else {
                    return View.modalOverviewEmpty;
                }
            },

            initialize: function () {
                var self = this;
                self.options.collection = widget.cart;

                this.listenTo(widget, 'cart:remove', function (id) {
                    $('#cgg-comparison-widget-product-'+id).attr('checked', false);

                    //disable compare button if there's only 1 product
                    if (self.options.collection.realValues().length === 1) {
                        $('.btn-compare-cards').attr('disabled', 'disabled');
                    }

                    if (self.options.collection.realValues().length === 0) {
                        $('#myModal').modal('hide');
                    }
                });
            }
        });

        // Each individual card in overview collection
        Cart.Controller.View.modalOverview = widget.Marionette.ItemView.extend({
            template: require('./templates/cart_overview.hbs'),
            className: 'col-sm-4 modal-compare__cols',

            events: {
                'click .modal-compare__close-card': function (ev) {
                    var target = $(ev.currentTarget),
                    id = target.attr('data-slID');

                    widget.trigger('cart:remove', id);

                    //jnpl
                    $('.modal-compare__cols').each(function () {
                        var height = $(this).parents('.modal-compare__inner-row').height();
                        $(this).css('min-height', height);
                    });
                    return false;
                },

                'click [data-link]': function (ev) {
                    var target = $(ev.currentTarget),
                        link = target.attr('data-link'),
                        record = this.options.model.toJSON(),
                        overlay = record.hasOverlay,
                        url = '';

                    widget.tracker.track('apply', {
                        category: ((widget.dataCache.query.conditions.filter) || 'all').toLowerCase(),
                        company: record.company.name,
                        name: record.name
                    });

                    if(!overlay) {
                        widget.leads.send({
                            company: record.company.name,
                            name: record.name
                        });
                    }
                    if(!!overlay) {
                        if (!!global.cagHelper && !!global.cagHelper.showLeadsOverlay) {
                            global.cagHelper.showLeadsOverlay('creditcard', record);
                        }
                    } else {
                        if (!!link) {
                            url = config.siteConfig.urls.redir + encodeURIComponent(link);
                            window.open(url, "_blank");
                        }
                    }

                    ev.preventDefault();
                }
            },

            serializeData: function () {
                var data = this.options.model.toJSON();
                console.log('modal product data', data);
                return data;
            }
        });

        // If the card is a blank card then show an empty template (with options to choose)
        Cart.Controller.View.modalOverviewEmpty = widget.Marionette.ItemView.extend({
            template: require('./templates/cart_overview_empty.hbs'),
            className: 'col-sm-4 modal-compare__cols',

            'events': {
                'change .modal-compare__select--bank': function (ev) {
                    var target = $(ev.currentTarget),
                        val = target.val(),
                        products = widget.request('company:products', val),
                        productsSelect = this.$el.find('.modal-compare__select--card'),
                        productsSelectHtml = '<option value="">' + cagHelper.lang('cart_modal_form_select_card') + '</option>',
                        optionsTpl = '<option value="id">name</option>',
                        optionsHtml = [];

                    _.forEach(products, function (rec) {
                        var html = optionsTpl;
                        html = html.replace(new RegExp('id', 'g'), rec.id);
                        html = html.replace(new RegExp('name', 'g'), rec.name);
                        optionsHtml.push(html);
                    });

                    productsSelect.html(productsSelectHtml).append(optionsHtml.join(''));
                },

                'change .modal-compare__select--card': function (ev) {
                    var target = $(ev.currentTarget),
                        val = target.val();
                },

                'click .btn-shortlist-add': function (ev) {
                    var target = $(ev.currentTarget), product = this.$el.find('.modal-compare__select--card').val();

                    widget.trigger('cart:add', product);

                    //jnpl
                    $('.modal-compare__cols').each(function () {
                        var height = $(this).parents('.modal-compare__inner-row').height();
                        $(this).css('min-height', height);
                    });
                }
            },

            serializeData: function () {
                var contents = this.options.model.toJSON();

                contents.companies = widget.request('companies:list');
                contents.products = [];

                contents.staticassets = config.urls.assets;

                console.log('modal product data', contents);
                return contents;
            }
        });

    });

    return widget.Cart.View;
};
