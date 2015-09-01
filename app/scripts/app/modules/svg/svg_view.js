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
            getSvgElement: function() {
                return this.$el.find('#root_svg');
            }
        });

    }
};

function SvgView(app) {

    this.app = app;
    this.init();

}

module.exports = SvgView;
