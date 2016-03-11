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
            move: {},
            grid: {},
            scale: {}
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
            gridAuxiliaryLabelStyle: {
                unselectable: true
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
            grid: {
                gridDisplayLevel: 2,
                gridInitialDivisionSize: 100,
                gridInitialDivisionStep: 1,
                gridScaleSteps: [
                    1,
                    2,
                    5
                ]
            },
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
    init: function(svgModels, svgTools, svgLayer, svgGrid) {
        this.svgModels = svgModels;
        this.svgTools = svgTools;
        this.svgLayer = svgLayer;
        this.svgGrid = svgGrid;
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
     Starts the sub services: tools, layers and grid
     */
    initSubServices: function() {

        this.svgTools.setRoot(this);
        this.svgTools.setTools();

        this.svgLayer.setRoot(this);
        this.svgLayer.init();

        this.svgGrid.setRoot(this);
        this.svgGrid.init();

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
        this.info.interaction.grid.divisionsStep = this.info.config.grid.gridInitialDivisionStep;
        this.info.interaction.grid.divisionsLevel = 5;
        this.info.interaction.grid.divisionsSize = this.info.config.grid.gridInitialDivisionSize;
        this.info.interaction.grid.zoom = 0;
        this.info.interaction.scale.layer = this.info.config.grid.gridInitialDivisionSize;
        this.info.interaction.scale.omega = this.info.config.grid.gridInitialDivisionStep;

    },

    /*
     Creates the two basic layers: grid and omega
     */
    setLayers: function() {

        var gridLayer = this.svgLayer.newLayer('grid', _.bind(this.setGrid, this));

        this.info.layers[gridLayer.id] = gridLayer;
        this.svgGrid.init(this.info.layers[gridLayer.id]);

        var omegaLayer = this.svgLayer.newLayer('omega', _.bind(this.setOmega, this));

        this.info.layers[omegaLayer.id] = omegaLayer;

    },

    /*
     Creates the grid axis and auxiliaries and shows them
     */
    setGrid: function() {

        this.svgGrid.emptyGrid();
        this.svgGrid.displayGrid(this.info.config.grid);

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

    fixCoordinatesDecimals: function(value) {

        var zoom = Number("1E" + this.info.interaction.grid.zoom);

        return Math.round(value * (1/zoom)) / (1/zoom);
    },

    formatCoordinates: function(value) {

        var zoom = Number("1E" + this.info.interaction.grid.zoom);

        if (value == 0) {
            return 0;
        } else if (zoom > 1000 || zoom < (1/10000)) {
            return this.fixCoordinatesDecimals(value).toExponential(0);
        } else {
            return this.fixCoordinatesDecimals(value);
        }

    },

    /*
     Transforms layer coordinates to omega coordinates
     */
    getOmegaCoordinates: function(layerCoordinates) {

        var x = Number(((layerCoordinates.x - this.info.interaction.origin.x) * this.info.interaction.scale.omega / this.info.interaction.scale.layer).toExponential(3));
        var y = Number(((this.info.interaction.origin.y - layerCoordinates.y) * this.info.interaction.scale.omega / this.info.interaction.scale.layer).toExponential(3));

        var zoom = this.info.interaction.grid.zoom;

        return {
            x: (zoom > 3 || zoom < -3) ? x.toExponential() : x,
            y: (zoom > 3 || zoom < -3) ? y.toExponential() : y
        };

    },

    /*
     Transforms omega coordinates to layer coordinates
     */
    getLayerCoordinates: function(omegaCoordinates) {

        return {
            x: omegaCoordinates.x * (this.info.interaction.origin.x - this.info.interaction.scale.layer) / this.info.interaction.scale.omega,
            y: omegaCoordinates.y * (this.info.interaction.origin.y - this.info.interaction.scale.layer) / this.info.interaction.scale.omega
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
        $('#svg_zoom_scale').html('scale: ' + this.info.interaction.scale.omega + ':' + this.info.interaction.scale.layer);
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

function SvgService(svgModels, svgTools, svgLayer, svgGrid) {

    this.svgModels = svgModels;
    this.svgTools = svgTools;
    this.svgLayer = svgLayer;
    this.svgGrid = svgGrid;

    this.init();

}

SvgService.prototype = {

    init: function () {
        p.init(this.svgModels, this.svgTools, this.svgLayer, this.svgGrid);
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
