'use strict';

AppViews.prototype = {

    init: function() {

        this.setAppLayoutView();

    },


    setAppLayoutView: function() {

        this.baseLayoutView = this.app.Marionette.LayoutView.extend();
    }

};

function AppViews(app) {

    this.app = app;
    this.init();

}

module.exports = AppViews;