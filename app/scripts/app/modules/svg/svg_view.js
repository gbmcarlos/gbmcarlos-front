'use strict';
SvgView.prototype = {

    init: function() {

        this.setViews();

    },

    setViews: function() {
        this.setBaseView();
    },

    setBaseView: function() {

        this.baseView = this.app.Marionette.ItemView.extend({
            getSvgContainer: function() {
                return this.$el.find('#svg_container');
            }
        });

    }
};

function SvgView(app) {

    this.app = app;
    this.init();

}

module.exports = SvgView;
