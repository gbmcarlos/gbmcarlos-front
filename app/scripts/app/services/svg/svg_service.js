'use strict';

var p = {

    info: {

        layers: {},

        rootSvg: {},

        interaction: {
            origin: {},
            move: {
            },
            zoom: {
                level: 4
            }
        },

        styles: {
            axisStyle: {
                stroke: 'black',
                strokeWidth: 2
            },
            gridAuxiliaryStyle: {
                stroke: 'black',
                strokeWidth: 0.5
            },
            point: {
                stroke: 'black',
                strokeWidth: 0.5,
                fill: 'black',
                radius: 2.5
            }
        },

        config: {
            gridSize: 50,
            gridUnit: 10,
            zoom: {
                factor: {
                    in: 0.5,
                    out: 2
                },
                levels: 8
            }
        },

        omega: {
            elements: []
        }
    },

    init: function(svgModels, svgTools, svgLayer) {
        this.svgModels = svgModels;
        this.svgTools = svgTools;
        this.svgLayer = svgLayer;
    },

    start: function(svgContainer) {

        this.initSubServices();
        this.prepareSvgContainer(svgContainer);
        this.setRootSvgDimensions();
        this.setLayers();
        this.setGrid();
        this.setSvgElementListeners();
        this.startTools();
    },

    initSubServices: function() {

        this.svgTools.setRoot(this);
        this.svgTools.setTools();

        this.svgLayer.setRoot(this);
        this.svgLayer.init();

    },

    prepareSvgContainer: function(svgContainer) {

        var rootSvg = this.createElement('svg', 'root_svg');
        this.emptyElement(svgContainer.attr('id'));
        this.showElement(svgContainer.attr('id'), rootSvg);

    },

    setLayers: function() {

        var gridLayer = this.svgLayer.newLayer('grid', _.bind(this.setGrid, this));

        this.info.layers[gridLayer.id] = gridLayer;

        var omegaLayer = this.svgLayer.newLayer('omega', _.bind(this.setOmega, this));

        this.info.layers[omegaLayer.id] = omegaLayer;

    },

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

    },

    setGrid: function() {

        this.info.layers.grid.showElement(this.getXAxis());
        this.info.layers.grid.showElement(this.getYAxis());

        this.setGridHorizontalAuxiliaries();
        this.setGridVerticalAuxiliaries();

    },

    getXAxis: function() {

        var axisCoordinates = {
            x1: 0,
            y1: this.info.interaction.origin.y,
            x2: this.info.rootSvg.width * 3,
            y2: this.info.interaction.origin.y
        };

        var axis = this.svgModels.getLine(axisCoordinates, this.info.styles.axisStyle, 'xAxis');

        return axis;

    },

    getYAxis: function() {

        var axisCoordinates = {
            x1: this.info.interaction.origin.x,
            y1: 0,
            x2: this.info.interaction.origin.x,
            y2: this.info.rootSvg.height * 3
        };

        var axis = this.svgModels.getLine(axisCoordinates, this.info.styles.axisStyle, 'yAxis');

        return axis;


    },

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

    setOmega: function() {

        var self = this;

        var zoomSizeUnitFactor = Math.pow(
                (
                    (this.info.interaction.zoom.level > this.info.config.zoom.levels / 2) ?
                        this.info.config.zoom.factor['in'] :
                        this.info.config.zoom.factor['out']
                ),
                Math.abs(this.info.interaction.zoom.level - this.info.config.zoom.levels / 2)
            ) /
            this.info.config.gridSize *
            this.info.config.gridUnit;

        _.each(this.info.omega.elements, function(element) {

            element.element.setAttribute('cx', (self.info.interaction.origin.x + element.coordinates.x) / zoomSizeUnitFactor);
            element.element.setAttribute('cy', (self.info.interaction.origin.y + element.coordinates.y) / zoomSizeUnitFactor);

            self.info.layers.omega.showElement(element.element);

        });

    },

    setSvgElementListeners: function() {
        this.info.rootSvg.element.mousedown(_.bind(this.captureMouseDown, this));
        this.info.rootSvg.element.mouseup(_.bind(this.captureMouseUp, this));
        this.info.rootSvg.element.mousemove(_.bind(this.captureMouseMove, this));
        this.info.rootSvg.element.bind('mousewheel', _.bind(this.captureMouseWheel, this));
    },

    captureMouseDown: function(event) {

        this.display();

        this.activeTool.mouseDown();
    },

    captureMouseUp: function(event) {

        this.display();
        this.activeTool.mouseUp();
    },

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

    captureMouseWheel: function(event) {

        if (event.originalEvent.wheelDeltaY < 0) {
            this.captureMouseWheelDown();
        } else {
            this.captureMouseWheelUp();
        }
        this.display();

    },

    captureMouseWheelDown: function() {

        this.explorer.wheelDown();

    },

    captureMouseWheelUp: function() {

        this.explorer.wheelUp();

    },

    startTools: function() {

        this.explorer = this.svgTools.getTool('explorer', this);

        this.pointCreator = this.svgTools.getTool('pointCreator', this);

        this.activeTool = this.explorer;

    },

    setTool: function(tool) {

        this.activeTool = this[tool];

    },

    toOrigin: function() {

        this.info.interaction.origin.x = this.info.rootSvg.width * 1.5;
        this.info.interaction.origin.y = this.info.rootSvg.height * 1.5;
        this.info.interaction.zoom.level = 4;
        this.info.interaction.zoom.factor = 0.0001;

        this.info.layers.grid.refresh();
        this.info.layers.omega.refresh();
        this.display();

    },

    display: function() {
        $('#svg_move_x').html('x: ' + this.info.interaction.move.x);
        $('#svg_move_y').html('y: ' + this.info.interaction.move.y);
        $('#svg_origin_x').html('x: ' + this.info.interaction.origin.x);
        $('#svg_origin_y').html('y: ' + this.info.interaction.origin.y);
        $('#svg_zoom_level').html('level: ' + this.info.interaction.zoom.level);
    },

    createElement: function(tag, id) {

        var element = document.createElementNS('http://www.w3.org/2000/svg', tag);

        if (!!id) {
            element.setAttribute('id', id);
        }

        return element;
    },

    showElement: function(root, element) {

        document.getElementById(root).appendChild(element);

    },

    getElement: function(id) {
        return document.getElementById(id);
    },

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