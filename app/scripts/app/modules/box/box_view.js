'use strict';
BoxView.prototype = {

    init: function() {

        this.setViews();

    },

    setViews: function() {
        this.setHeaderView();
        this.setBodyView();
    },

    setHeaderView: function() {

        this.headerView = this.app.Marionette.ItemView;

    },

    setBodyView: function() {

        this.bodyView = this.app.Marionette.ItemView;

    }
};

function BoxView(app) {

    this.app = app;
    this.init();

}

module.exports = BoxView;
