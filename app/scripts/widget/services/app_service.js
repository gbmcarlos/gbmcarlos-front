'use strict';

var p = {

    init: function(widget, debugService, dataService, layoutParser) {
        this.widget = widget;
        this.debugService = debugService;
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

        if (rootLayout) {
            this.setLayout(rootLayout, this.widget);
        }

    },

    getLayout: function(layoutName) {

        var layoutDefinition = this.dataService.getDatumFromObject('layouts.' + layoutName, this.layoutsDefinitions);

        if (!layoutDefinition) {
            this.debugService.error();
        }

        var layout = this.layoutParser.getLayout(layoutDefinition);

        return layout;

    },

    setLayout: function(layout, base) {

        base.addRegions(layout.regions);

    }

};

function AppService(widget, debugService, dataService, layoutParser) {

    this.widget = widget;
    this.debugService = debugService;
    this.dataService = dataService;
    this.layoutParser = layoutParser;

}

AppService.prototype = {

    start: function() {
        p.init(this.widget, this.debugService, this.dataService, this.layoutParser);
        p.setConfig();
        p.start();
    }

};

module.exports = AppService;
