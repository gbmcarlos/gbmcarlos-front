'use strict';

var p = {

    init: function(widget, dataService, layoutParser) {
        this.widget = widget;
        this.dataService = dataService;
        this.layoutParser = layoutParser;
    },

    setConfig: function() {

        this.rootDefinition = require('./../config/root.json').root;

        this.layoutsDefinitions = require('./../config/layouts.json');

    },

    start: function() {

        var rootLayoutName = this.rootDefinition.layout.name;

        var rootLayout = this.getLayout(rootLayoutName);

        this.setLayout(rootLayout, this.widget);

    },

    getLayout: function(layoutName) {

        var layoutDefinition = this.dataService.getDatumFromObject('layouts.' + layoutName, this.layoutsDefinitions);

        var layout = this.layoutParser.getLayout(layoutDefinition);

        return layout;

    },

    setLayout: function(layout, base) {

        base.addRegions(layout.regions);

    }

};

function AppService(widget, dataService, layoutParser) {

    this.widget = widget;
    this.dataService = dataService;
    this.layoutParser = layoutParser;

}

AppService.prototype = {

    start: function() {
        p.init(this.widget, this.dataService, this.layoutParser);
        p.setConfig();
        p.start();
    }

};

module.exports = AppService;
