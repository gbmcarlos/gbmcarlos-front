module.exports = function (widget) {
    "use strict";

    var config = widget.container.get('ConfigService').getConfig();
    var prefs = widget.container.get('ConfigService').getPrefs();

    widget.module("Tab", function (Tab, widget) {

        Tab.Controller.View = {};

        Tab.Controller.View.tab = widget.Marionette.ItemView.extend({
            tagName: 'li',
            template: require('./templates/tab.hbs'),

            className: function () {
                var value = this.model.get('value'),
                    classNames = ['tab-menu__item'];

                var requestService = widget.container.get('RequestService');

                if(requestService.getFilter() == value) {
                    classNames.push('active');
                }

                return classNames.join(' ');
            },

            events: {
                'click a': function () {
                    var category = this.model.get('value').toUpperCase();
                    Tab.changeCategory(category);
                    return false;
                }               
            },

            serializeData: function () {
                return this.options.model.toJSON();
            }

        });

        Tab.Controller.View.tabs = widget.Marionette.CompositeView.extend({
            template: require('./templates/tabs.hbs'),
            childView: Tab.Controller.View.tab,
            childViewContainer: "ul",

            initialize: function() {

                var translationsService = widget.container.get('TranslationsService');
                var currentTab = widget.container.get('RequestService').getFilter();

                this.options = {
                    'showHero': prefs.showHero,
                    'heroUrl': config.urls.assets + '/images/hero.png',
                    'heading': translationsService.lang('masterhead-heading_' +currentTab),
                    'subheading': translationsService.lang('masterhead-subheading_' + currentTab)
                };
            },

            events: {
            	'click .tab-menu__toggle': function (ev) {
                	var target = $(ev.currentTarget),
                        parent = target.parents('.container-fluid');
                	
                	target.find('.tab-menu-mobile-label').toggleClass( 'hide' );
		            target.find(".m-icon.arrow-icon").toggleClass('m-icon--arrow-down m-icon--arrow-right');             	

                    parent.find('.tab-menu__list').collapse('toggle');

                    ev.stopPropagation();
                }
            },

            serializeData: function () {
                return this.options;
            },

            resultsLength: function(length) {
                this.options.resultsLength = length;
                this.render();
            }
        });

    });

    return widget.Tab.View;
};
