module.exports = function (widget) {
    "use strict";

    var config = widget.container.get('ConfigService').getConfig();

    widget.module("Entities", function (Entities, widget) {

        Entities.Product = widget.Backbone.Model.extend({

            defaults: {
                compareCheck: false

            },

            initialize: function () {
                if (!!this.attributes.productInfo) {
                    this.formatData();
                }

            },

            formatData2: function() {
                var logo = (this.attributes.productInfo.productImage.indexOf('://') > -1) ? this.attributes.productInfo.productImage : config.mediaRoot + '/' + this.attributes.productInfo.productImage;
                this.set('logo', logo);
            },

            formatData: function () {
                var attrs = this.attributes,
                    logo,
                    hasPartlyWaived = false,
                    exclusiveImage = null,
                    promo = {
                        details: [],
                        welcomeGifts: []
                    }

                /**
                 * Format logo
                 **/
                logo = (attrs.productInfo.productImage.indexOf('://') > -1) ? attrs.productInfo.productImage : config.mediaRoot + '/' + attrs.productInfo.productImage;
                this.set('logo', logo);

                /**
                 * Format links
                 **/
                this.set('applyLink', attrs.displayView.applyLink);

                /**
                 * Format overlay
                 **/
                if (_.findWhere(attrs.filters, {'type': 'hasOverlay', 'value': 'true'})) {
                    this.set('hasOverlay', true);
                }


                /**
                 * Format benefits
                 **/
                if (!!attrs.displayView.benefits.goodPoints) {
                    this.set('benefitsProps', attrs.displayView.benefits.goodPoints);
                }
                /**
                 * End format benefits
                 **/

                /**
                 * Format negatives
                 **/
                if (!!attrs.displayView.benefits.negativePoints) {
                    this.set('negativesProps', attrs.displayView.benefits.negativePoints);
                }
                /**
                 * End format negatives
                 **/

                /**
                 * Format promotions
                 **/
                if (!!attrs.displayView.promotions) {


                    if (!!attrs.displayView.promotions.proHasOnlineCondition && !!attrs.displayView.promotions.proHasOnlineCondition.value) {
                        this.set('showOnlineApplicationOffer', true);
                    }

                    attrs.displayView.promotions.welcomeGifts = _.uniq(_.sortBy(_.filter(attrs.promotions, function (row) {
                        return (!!row.type && (row.type.indexOf('welcomeGiftDetails') > -1) && (!!row.condition || !!row.description));
                    }), 'type'), 'value');

                    if (!!attrs.displayView.promotions.welcomeGifts && (attrs.displayView.promotions.welcomeGifts.length > 0)) {
                        this.set('showWelcomeGift', true);
                    }

                    this.set('promo', attrs.displayView.promotions);
                    /**
                     * This dont work anywhere but ID, this has to be removed.
                     */
                    if(config.locale === "en-ID" || config.locale === "id-ID"){
                        attrs.displayView.promotions.welcomeGifts.exprityDate = _.filter(attrs.promotions, function(row) {
                            return  (!!row.type && row.type == 'welcomeGiftExpiry');
                        })[0].value;

                        this.set('promo', attrs.displayView.promotions);
                    }
                }
                /**
                 * End format promotions
                 **/

                /**
                 * Format promo tab
                 **/
                if (!!attrs.promotions) {
                    promo = _.first(_.sortBy(_.filter(attrs.promotions, function (row) {
                        return (!!row.type && (row.type === 'promoContent1') && (!!row.description));
                    }), 'type'));

                    this.set('promoTab', promo);
                }

                //console.log("PromoTab1",attrs.name,attrs.promoTab);

                /**Formating promo for SG */

                if(config.locale === "en-SG" && !!attrs.promoTab) {
                    var pTitle = attrs.promoTab.value;

                    var promoCon = _.first(_.sortBy(_.filter(attrs.promotions, function (row) {
                        return (!!row.type && (row.type === 'promoContent2') && (!!row.description));
                    }), 'type'));

                    var promoTg = _.first(_.sortBy(_.filter(attrs.promotions, function (row) {
                        return (!!row.type && (row.type === 'promoTag') && (!!row.description));
                    }), 'type'));

                    var pValue = promoCon.description;
                    var pCond = promoTg.description;

                    attrs.promoTab.title = pTitle;
                    //attrs.promoTab.value = pValue;
                    attrs.promoTab.description = pValue;
                    attrs.promoTab.condition = pCond;

                }

                /**
                 * End promo tab
                 **/

                /**
                 * Format cashBack
                 **/

                if (!!attrs.displayView.cashBack.cashbackRewardsBasic && attrs.displayView.cashBack.cashbackRewardsBasic.value == '0') {
                    attrs.displayView.cashBack.cashbackRewardsBasic.value = undefined;
                }

                if (!!attrs.displayView.cashBack) {
                    _.each(attrs.displayView.cashBack, function (item, i) {
                        if (!!item.value && (item.value > 0)) {
                            item.value = parseFloat(item.value);
                        }
                    });

                    this.set('cashBackProps', attrs.displayView.cashBack);
                }
                /**
                 * End format cashBack
                 **/

                /**
                 * Format airMiles
                 **/
                if (!!attrs.displayView.airMiles) {

                    this.set('airMilesProps', attrs.displayView.airMiles);
                }
                /**
                 * End format airMiles
                 **/

                /**
                 * Format hasPartlyWaived
                 */
                _.each(attrs.filters, function (item, i) {
                    if (!!item.type && item.type === "hasPartlyWaived" && item.value == "true") {
                        hasPartlyWaived = true;
                    }
                });
                attrs.displayView.fees.partlyWaivedYear.value = hasPartlyWaived;

                /**
                 * Format eligibility
                 **/
                if (!!attrs.displayView.fees) {
                    if (!!attrs.displayView.fees.annualFee && (attrs.displayView.fees.annualFee.value == 0)) {
                        attrs.displayView.fees.annualFee.value = attrs.displayView.fees.annualFee.description;
                    }

                    this.set('feesProps', attrs.displayView.fees);
                }

                /**
                 * End format fees
                 **/

                /**
                 * Format eligibility
                 **/
                if (!!attrs.displayView.eligibilities) {
                    this.set('eligibilityProps', attrs.displayView.eligibilities);
                }
                /**
                 * End format eligibility
                 **/


                /**
                 * Format Discount
                 **/
                if (!!attrs.displayView.discount) {
                    this.set('discountProps', attrs.displayView.discount);
                }

                /**
                 * End format discount
                 **/


                /**
                 * Format points
                 **/
                if (!!attrs.displayView.points) {
                    this.set('pointsProps', attrs.displayView.points);
                }

                /**
                 * End format points
                 **/


                /**
                 * Format rewards
                 **/
                if (!!attrs.displayView.rewards) {
                    this.set('rewardsProps', attrs.displayView.rewards);
                }

                /**
                 * End format rewards
                 **/


                /**
                 * Format best deals
                 */
                if (!!attrs.displayView.bestDeals) {

                    var bestDeals = _.pick(attrs.displayView.bestDeals, _.identity),
                        bestDealsData = [],
                        bestDealsRankingObj;

                    _.forIn(bestDeals, function (item, i) {
                        if (_.has(bestDeals, i + 'Rank')) {
                            bestDealsData.push({
                                name: i,
                                value: bestDeals[i + 'Rank']
                            });
                        }
                    });

                    this.set('bestDealsProps', bestDealsData);
                }
                /*
                 * End format best deals
                 **/


                /**
                 * Set flags for icon indicators (contactess payment, welcome gift etc.)
                 **/

                if (_.findWhere(attrs.filters, {'type': 'hasContactlessPayment', 'value': 'true'})) {
                    this.set('contactlessFlag', true);
                }

                if (!!attrs.displayView.promotions.welcomeGifts) {
                    var firstWelcomeGift = _.first(attrs.displayView.promotions.welcomeGifts);

                    if (!!firstWelcomeGift && firstWelcomeGift.description) {
                        this.set('welcomeGiftFlag', true);
                        this.set('welcomeGift', firstWelcomeGift);
                    }
                }
                /**
                 * End flag indicators
                 **/


                 if (attrs.isFeatured) {
                     this.set('isFeatured', true);
                     exclusiveImage = _.findWhere(attrs.images, {type: 'exclusiveOnlineOfferImage'});
                     this.set('exclusive', exclusiveImage);
                 }


                if (_.findWhere(attrs.filters, {'type': 'hasExclusiveOnlineOffer', 'value': 'true'})) {
                    exclusiveImage = _.findWhere(attrs.images, {type: 'exclusiveOnlineOfferImage'});

                    if (!!exclusiveImage) {
                        if (!!exclusiveImage.title && !!exclusiveImage.description) {
                            this.set('isExclusive', true);
                            this.set('isFeatured', false);
                            this.set('exclusive', exclusiveImage);
                        }
                    }
                }

            }
        });

        Entities.ProductCollection = widget.Backbone.Collection.extend({
            model: Entities.Product,
            comparator: null,

            uncheckProduct: function(productId) {
                var product = this.get(productId);

                if (!!product) {
                    product.set('compareCheck', false);
                }
            },

            checkProducts: function(products) {

                var self = this;

                _.each(products, function(product) {

                    product = self.get(new widget.Entities.Product(product.attributes));

                    if (!!product) {

                        product.set('compareCheck', true);

                    }

                });

            }

        });

        Entities.Group = widget.Backbone.Model.extend({

            uncheckProduct: function(productId) {
                var product = this.collection.get(productId);

                if (!!product) {
                    product.set('compareCheck', false);
                }
            },

            checkProducts: function(products) {
                var self = this;

                _.each(products, function(product) {

                    product = self.collection.get(new widget.Entities.Product(product.attributes));

                    if (!!product) {

                        product.set('compareCheck', true);

                    }

                });
            }

        });

        Entities.GroupCollection = widget.Backbone.Collection.extend({
            model: Entities.Group,

            uncheckProduct: function(product) {

                _.each(this.models, function(group) {
                    group.uncheckProduct(product);
                });

            },

            checkProducts: function(products) {
                _.each(this.models, function(group) {
                    group.checkProducts(products);
                });
            }
        });

    });

    return widget;
};
