var $ = require('jquery'),
    jQuery = require('jquery'),
    _ = require('underscore'),
    numeral = require('numeral'),
    Handlebars = require("hbsfy/runtime"),
    Backbone = require('backbone'),
    LocalStorage = require('backbone.localstorage');
    Backbone.$ = require('jquery');
var Marionette = require('backbone.marionette');

var p = {

    setDependencies: function(App) {
        global.$ = $;
        global._ = _;
        App.numeral = numeral;
        App.Backbone = Backbone;
        App.Handlebars = Handlebars;
        App.Marionette = Marionette;
        App.LocalStorage = LocalStorage;
    }
};

function SiteDependencies(){
}

SiteDependencies.prototype = {
    setDependencies: function(App){
        return p.setDependencies(App);
    }
};

module.exports = SiteDependencies;
