'use strict';

var p = {

    info: {

        /*
         For savings layers: grid, omega, annotations, etc.
        */
        layers: {},

        /*
         Information about the root svg html element and its properties
         */
        rootSvg: {},

        /*
         Real time information about the user interaction
         */
        interaction: {
            origin: {},
            move: {

            },
            zoom: {}
        },

        /*
         Styles for the diferent svg elements: grid axis, points, curves, etc.
         */
        styles: {
            axisStyle: {
                stroke: 'black',
                strokeWidth: 2
            },
            gridAuxiliaryStyle: {
                stroke: 'black',
                strokeWidth: 0.5
            },
            gridSubAuxiliaryStyle: {
                stroke: 'black',
                strokeWidth: 0.1
            },
            point: {
                stroke: 'black',
                strokeWidth: 0.5,
                fill: 'black',
                radius: 2.5
            }
        },

        /*
         Basic modelator configuration
         */
        config: {
            gridDisplayLevel: 3,
            gridSize: 50,
            gridUnit: 10,
            zoom: {
                factor: 0.05,
                defaultScale: 1
            },
            precision: 3
        },

        omega: {
            elements: []
        }
    },

    /*
     Sets the dependencies: models, tools, and layer generator
     */
    init: function(svgModels, svgTools, svgLayer) {
        this.svgModels = svgModels;
        this.svgTools = svgTools;
        this.svgLayer = svgLayer;
    },

    /*
     Starts the app: starts services, gets the container ready, svg root html element dimension,
     starts grid and omega layers, sets the grid ready, sets listeners, and starts the tools
     */
    start: function(svgContainer) {

        this.initSubServices();
        this.prepareSvgContainer(svgContainer);
        this.setRootSvgDimensions();
        this.setLayers();
        this.setGrid();
        this.setSvgElementListeners();
        this.startTools();
    },

    /*
     Starts the tools and layers sub services
     */
    initSubServices: function() {

        this.svgTools.setRoot(this);
        this.svgTools.setTools();

        this.svgLayer.setRoot(this);
        this.svgLayer.init();

    },

    /*
     Creates the root svg html element and gets it ready
     */
    prepareSvgContainer: function(svgContainer) {

        var rootSvg = this.createElement('svg', 'root_svg');
        this.emptyElement(svgContainer.attr('id'));
        this.showElement(svgContainer.attr('id'), rootSvg);

    },

    /*
     Creates the two basic layers: grid and omega
     */
    setLayers: function() {

        var gridLayer = this.svgLayer.newLayer('grid', _.bind(this.setGrid, this));

        this.info.layers[gridLayer.id] = gridLayer;

        var omegaLayer = this.svgLayer.newLayer('omega', _.bind(this.setOmega, this));

        this.info.layers[omegaLayer.id] = omegaLayer;

    },

    /*
     Sets the initial needed data: root svg dimension, interaction initial values, etc.
     */
    setRootSvgDimensions: function() {
        this.info.rootSvg.element = $('#root_svg');
        this.info.rootSvg.top = this.info.rootSvg.element.offset().top;
        this.info.rootSvg.left = this.info.rootSvg.element.offset().left;
        this.info.rootSvg.height = this.info.rootSvg.element.outerHeight();
        this.info.rootSvg.width = this.info.rootSvg.element.outerWidth();
        this.info.interaction.origin.x = this.info.rootSvg.width * 1.5;
        this.info.interaction.origin.y = this.info.rootSvg.height * 1.5;
        this.info.interaction.move.x = this.info.rootSvg.width * 1.5;
        this.info.interaction.move.y = this.info.rootSvg.height * 1.5;
        this.info.interaction.zoom.scale = this.info.config.zoom.defaultScale;

    },

    /*
     Creates the grid axis and auxiliaries and shows them
     */
    setGrid: function() {

        if (this.info.config.gridDisplayLevel > 2) {
            this.setGridHorizontalSubAuxiliaries();
            this.setGridVerticalSubAuxiliaries();

        }

        if (this.info.config.gridDisplayLevel > 1) {
            this.setGridHorizontalAuxiliaries();
            this.setGridVerticalAuxiliaries();
        }

        if (this.info.config.gridDisplayLevel > 0) {
            this.setXAxis();
            this.setYAxis();
        }

    },

    /*
     Creates the grid x axis
     */
    setXAxis: function() {

        var axisCoordinates = {
            x1: 0,
            y1: this.info.interaction.origin.y,
            x2: this.info.rootSvg.width * 3,
            y2: this.info.interaction.origin.y
        };

        var axis = this.svgModels.getLine(axisCoordinates, this.info.styles.axisStyle, 'xAxis');

        this.info.layers.grid.showElement(axis);

    },

    /*
     Creates the grid y axis
     */
    setYAxis: function() {

        var axisCoordinates = {
            x1: this.info.interaction.origin.x,
            y1: 0,
            x2: this.info.interaction.origin.x,
            y2: this.info.rootSvg.height * 3
        };

        var axis = this.svgModels.getLine(axisCoordinates, this.info.styles.axisStyle, 'yAxis');

        this.info.layers.grid.showElement(axis);

    },

    /*
     Creates and sets the x auxiliaries
     */
    setGridHorizontalAuxiliaries: function() {

        var auxiliariesNumber = Math.ceil(this.info.rootSvg.height / this.info.config.gridSize) * 3;

        var auxiliariesStart = (this.info.interaction.origin.y) % this.info.config.gridSize;

        for (var i = 0;i < auxiliariesNumber; i++) {

            var auxiliaryCoordinates = {
                x1: 0,
                y1: auxiliariesStart + (this.info.config.gridSize * i),
                x2: this.info.rootSvg.width * 3,
                y2: auxiliariesStart + (this.info.config.gridSize * i)
            };

            var auxiliary = this.svgModels.getLine(auxiliaryCoordinates, this.info.styles.gridAuxiliaryStyle, 'grid_h_auxiliary_' + i);

            this.info.layers.grid.showElement(auxiliary);

        }

    },

    /*
     Creates and sets the x auxiliaries
     */
    setGridVerticalAuxiliaries: function() {

        var auxiliariesNumber = Math.ceil(this.info.rootSvg.width / this.info.config.gridSize) * 3;

        var auxiliariesStart = (this.info.interaction.origin.x) % this.info.config.gridSize;

        for (var i = 0;i < auxiliariesNumber; i++) {

            var auxiliaryCoordinates = {
                x1: auxiliariesStart + (this.info.config.gridSize * i),
                y1: 0,
                x2: auxiliariesStart + (this.info.config.gridSize * i),
                y2: this.info.rootSvg.height * 3
            };

            var auxiliary = this.svgModels.getLine(auxiliaryCoordinates, this.info.styles.gridAuxiliaryStyle, 'grid_v_auxiliary_' + i);

            this.info.layers.grid.showElement(auxiliary);

        }

    },


    /*
     Creates and sets the x auxiliaries
     */
    setGridHorizontalSubAuxiliaries: function() {
        //
        //var auxiliariesNumber = Math.ceil(this.info.rootSvg.width / this.info.config.gridSize) * 3;
        //
        //var auxiliariesStart = (this.info.interaction.origin.x) % this.info.config.gridSize;
        //
        //for (var i = 0;i < auxiliariesNumber; i++) {
        //
        //    var auxiliaryCoordinates = {
        //        x1: auxiliariesStart + (this.info.config.gridSize * i),
        //        y1: 0,
        //        x2: auxiliariesStart + (this.info.config.gridSize * i),
        //        y2: this.info.rootSvg.height * 3
        //    };
        //
        //    var auxiliary = this.svgModels.getLine(auxiliaryCoordinates, this.info.styles.gridAuxiliaryStyle, 'grid_v_auxiliary_' + i);
        //
        //    this.info.layers.grid.showElement(auxiliary);
        //
        //}

    },

    /*
     Creates and sets the y subauxiliaries
     */
    setGridVerticalSubAuxiliaries: function() {
        //
        //var auxiliariesNumber = Math.ceil(this.info.rootSvg.width / this.info.config.gridSize) * 3;
        //
        //var auxiliariesStart = (this.info.interaction.origin.x) % this.info.config.gridSize;
        //
        //for (var i = 0;i < auxiliariesNumber; i++) {
        //
        //    var auxiliaryCoordinates = {
        //        x1: auxiliariesStart + (this.info.config.gridSize * i),
        //        y1: 0,
        //        x2: auxiliariesStart + (this.info.config.gridSize * i),
        //        y2: this.info.rootSvg.height * 3
        //    };
        //
        //    var auxiliary = this.svgModels.getLine(auxiliaryCoordinates, this.info.styles.gridAuxiliaryStyle, 'grid_v_auxiliary_' + i);
        //
        //    this.info.layers.grid.showElement(auxiliary);
        //
        //}

    },

    /*
     Show every omega element
     */
    setOmega: function() {

        var self = this;

        _.each(this.info.omega.elements, function(element) {

            element.element.setAttribute('cx', self.getLayerCoordinates(element.coordinates).x);
            element.element.setAttribute('cy', self.getLayerCoordinates(element.coordinates).y);

            self.info.layers.omega.showElement(element.element);

        });

    },

    /*
     Sets listeners for user interaction
     */
    setSvgElementListeners: function() {
        this.info.rootSvg.element.mousedown(_.bind(this.captureMouseDown, this));
        this.info.rootSvg.element.mouseup(_.bind(this.captureMouseUp, this));
        this.info.rootSvg.element.mousemove(_.bind(this.captureMouseMove, this));
        this.info.rootSvg.element.bind('mousewheel', _.bind(this.captureMouseWheel, this));
    },

    /*
     Triggers the active tool function for mouse down action
     */
    captureMouseDown: function(event) {

        this.display();

        this.activeTool.mouseDown();
    },

    /*
     Triggers the active tool function for mouse up action
     */
    captureMouseUp: function(event) {

        this.display();
        this.activeTool.mouseUp();
    },

    /*
     Triggers the active tool function for mouse move action
     */
    captureMouseMove: function(event) {

        var moveCoordinates = {
            x: event.pageX - this.info.rootSvg.left,
            y: event.pageY - this.info.rootSvg.top
        };

        this.info.interaction.move.x = moveCoordinates.x + this.info.rootSvg.width;
        this.info.interaction.move.y = moveCoordinates.y + this.info.rootSvg.height;
        this.display();

        this.activeTool.mouseMove();
    },

    /*
     Triggers the active tool function for wheel action
     */
    captureMouseWheel: function(event) {

        if (event.originalEvent.wheelDeltaY < 0) {
            this.captureMouseWheelDown();
        } else {
            this.captureMouseWheelUp();
        }
        this.display();

    },

    /*
     Triggers the active tool function for wheel down action
     */
    captureMouseWheelDown: function() {

        this.explorer.wheelDown();

    },

    /*
     Triggers the active tool function for wheel down action
     */
    captureMouseWheelUp: function() {

        this.explorer.wheelUp();

    },

    /*
     Transforms layer coordinates to omega coordinates
     */
    getOmegaCoordinates: function(layerCoordinates) {

        var zoomSizeUnitFactor = Math.pow(
                (
                    (this.info.interaction.zoom.scale > this.info.config.zoom.defaultScale) ?
                    1 / this.info.config.zoom.factor :
                        this.info.config.zoom.factor
                ),
                Math.abs(this.info.interaction.zoom.scale - this.info.config.zoom.defaultScale)
            ) /
            this.info.config.gridSize *
            this.info.config.gridUnit;

        return {
            x: ((layerCoordinates.x - this.info.interaction.origin.x) * zoomSizeUnitFactor).toFixed(this.info.config.precision),
            y: (( - layerCoordinates.y + this.info.interaction.origin.y) * zoomSizeUnitFactor).toFixed(this.info.config.precision)
        };

    },

    /*
     Transforms omega coordinates to layer coordinates
     */
    getLayerCoordinates: function(omegaCoordinates) {

        var zoomSizeUnitFactor = Math.pow(
                (
                    (this.info.interaction.zoom.scale > this.info.config.zoom.defaultScale) ?
                    1 / this.info.config.zoom.factor :
                        this.info.config.zoom.factor
                ),
                Math.abs(this.info.interaction.zoom.scale - this.info.config.zoom.defaultScale)
            ) /
            this.info.config.gridSize *
            this.info.config.gridUnit;

        return {
            x: this.info.interaction.origin.x + (omegaCoordinates.x / zoomSizeUnitFactor),
            y: this.info.interaction.origin.y - (omegaCoordinates.y / zoomSizeUnitFactor)
        };

    },

    /*
     Starts the tools ans sets the initial one (explorer)
     */
    startTools: function() {

        this.explorer = this.svgTools.getTool('explorer', this);

        this.pointCreator = this.svgTools.getTool('pointCreator', this);

        this.activeTool = this.explorer;

    },

    /*
     Sets given tool
     */
    setTool: function(tool) {

        this.activeTool = this[tool];

    },

    /*
     Moves the origin the the center of the layer
     */
    toOrigin: function() {

        this.info.interaction.origin.x = this.info.rootSvg.width * 1.5;
        this.info.interaction.origin.y = this.info.rootSvg.height * 1.5;
        this.info.interaction.zoom.scale = 1;

        this.info.layers.grid.refresh();
        this.info.layers.omega.refresh();
        this.display();

    },

    /*
     Provisional
     Displays basic information
     */
    display: function() {
        $('#svg_move_x').html('x: ' + this.getOmegaCoordinates(this.info.interaction.move).x);
        $('#svg_move_y').html('y: ' + this.getOmegaCoordinates(this.info.interaction.move).y);
        $('#svg_origin_x').html('x: ' + this.info.interaction.origin.x);
        $('#svg_origin_y').html('y: ' + this.info.interaction.origin.y);
        $('#svg_zoom_scale').html('level: ' + this.info.interaction.zoom.scale);
    },

    /*
     Creates an svg element with its namespace
     */
    createElement: function(tag, id) {

        var element = document.createElementNS('http://www.w3.org/2000/svg', tag);

        if (!!id) {
            element.setAttribute('id', id);
        }

        return element;
    },

    /*
     Displays an element inside the given element
     */
    showElement: function(root, element) {

        document.getElementById(root).appendChild(element);

    },

    /*
     Shortcut for getElementById
     */
    getElement: function(id) {
        return document.getElementById(id);
    },

    /*
     Removes every element inside the given element (by id)
     */
    emptyElement: function(id) {

        while (document.getElementById(id).hasChildNodes()) {
            document.getElementById(id).removeChild(document.getElementById(id).lastChild);
        }

    }

};

function SvgService(svgModels, svgTools, svgLayer) {

    this.svgModels = svgModels;
    this.svgTools = svgTools;
    this.svgLayer = svgLayer;

    this.init();

}

SvgService.prototype = {

    init: function () {
        p.init(this.svgModels, this.svgTools, this.svgLayer);
    },

    start: function(svgContainer, prefs) {
        p.start(svgContainer, prefs);
    },

    toOrigin: function() {
        p.toOrigin();
    },

    setTool: function(tool) {
        p.setTool(tool);
    }

};

module.exports = SvgService;
