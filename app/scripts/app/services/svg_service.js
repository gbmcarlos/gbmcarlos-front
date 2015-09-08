'use strict';

var p = {

    info: {
        rootSvg: {},

        interaction: {
            origin: {},
            click: {
                start: {},
                end: {}
            },
            move: {
            },
            zoom: {
                factor: 0.0001,
                level: 4
            }
        },

        state: {
            origin: {},
            activeTool: 'move'
        },

        styles: {
            axisStyle: {
                stroke: 'black',
                strokeWidth: 2
            },
            gridAuxiliaryStyle: {
                stroke: 'black',
                strokeWidth: 0.5
            }
        },

        config: {
            gridSize: 50,
            zoom: {
                factor: 0.1,
                levels: 8
            }
        }
    },

    init: function(svgModels, svgTools) {
        this.svgModels = svgModels;
        this.svgTools = svgTools;
    },

    start: function(svgContainer) {

        this.setRootSvg(svgContainer);
        this.setRootSvgDimensions();
        this.setGridLayer();
        this.startRootSvg();
        this.startTools();
    },

    setRootSvg: function(svgContainer) {

        var rootSvg = this.createElement('svg');
        rootSvg.setAttribute('id', 'root_svg');
        rootSvg.setAttribute('width', '1500px');
        this.showElement(svgContainer.attr('id'), rootSvg);

    },

    setGridLayer: function() {
        this.setLayer('grid', 'root_svg');

    },

    setLayer: function(name, base) {

        var svg = this.createElement('svg');
        svg.setAttribute('id', name + '_svg');
        var g = this.createElement('g');
        g.setAttribute('id', name + '_g');

        svg.setAttribute('width', this.info.rootSvg.width * 3);
        svg.setAttribute('height', this.info.rootSvg.height * 3);
        svg.setAttribute('x', - this.info.rootSvg.width);
        svg.setAttribute('y', - this.info.rootSvg.height);

        svg.appendChild(g);

        this.showElement(base, svg);

    },

    setRootSvgDimensions: function() {
        this.info.rootSvg.element = $('#root_svg');
        this.info.rootSvg.top = this.info.rootSvg.element.offset().top;
        this.info.rootSvg.left = this.info.rootSvg.element.offset().left;
        this.info.rootSvg.height = this.info.rootSvg.element.outerHeight();
        this.info.rootSvg.width = this.info.rootSvg.element.outerWidth();
        this.info.rootSvg.bottom = this.info.rootSvg.top + this.info.rootSvg.height;
        this.info.rootSvg.right = this.info.rootSvg.left + this.info.rootSvg.width;
        this.info.interaction.origin.x = this.info.rootSvg.width / 2;
        this.info.interaction.origin.y = this.info.rootSvg.height / 2;
        this.info.interaction.move.x = this.info.rootSvg.width / 2;
        this.info.interaction.move.y = this.info.rootSvg.height / 2;

    },

    startRootSvg: function() {
        this.setGrid();
        this.setSvgElementListeners();
    },

    setGrid: function() {

        while (document.getElementById('grid_g').hasChildNodes()) {
            document.getElementById('grid_g').removeChild(document.getElementById('grid_g').lastChild);
        }

        document.getElementById('grid_g').setAttribute('transform', '');

        var xAxis = this.getXAxis();
        var yAxis = this.getYAxis();

        this.showElement('grid_g', xAxis);
        this.showElement('grid_g', yAxis);

        this.setGridHorizontalAuxiliaries();
        this.setGridVerticalAuxiliaries();

    },

    getXAxis: function() {

        var axisCoordinates = {
            x1: 0,
            y1: this.info.rootSvg.height + this.info.interaction.origin.y,
            x2: this.info.rootSvg.width * 3,
            y2: this.info.rootSvg.height + this.info.interaction.origin.y
        };

        var axis = this.svgModels.getLine(axisCoordinates, this.info.styles.axisStyle, 'xAxis');

        return axis;

    },

    getYAxis: function() {

        var axisCoordinates = {
            x1: this.info.rootSvg.width + this.info.interaction.origin.x,
            y1: 0,
            x2: this.info.rootSvg.width + this.info.interaction.origin.x,
            y2: this.info.rootSvg.height * 3
        };

        var axis = this.svgModels.getLine(axisCoordinates, this.info.styles.axisStyle, 'yAxis');

        return axis;


    },

    setGridHorizontalAuxiliaries: function() {

        var auxiliariesNumber = Math.ceil(this.info.rootSvg.height / this.info.config.gridSize) * 3;

        var auxiliariesStart = ((this.info.interaction.origin.y + this.info.rootSvg.height) % this.info.config.gridSize);

        for (var i = 0;i < auxiliariesNumber; i++) {

            var auxiliaryCoordinates = {
                x1: 0,
                y1: auxiliariesStart + (this.info.config.gridSize * i),
                x2: this.info.rootSvg.width * 3,
                y2: auxiliariesStart + (this.info.config.gridSize * i)
            };

            var auxiliary = this.svgModels.getLine(auxiliaryCoordinates, this.info.styles.gridAuxiliaryStyle, 'grid_h_auxiliary_' + i);

            this.showElement('grid_g', auxiliary);

        }

    },

    setGridVerticalAuxiliaries: function() {

        var auxiliariesNumber = Math.ceil(this.info.rootSvg.width / this.info.config.gridSize) * 3;

        var auxiliariesStart = ((this.info.interaction.origin.x + this.info.rootSvg.width) % this.info.config.gridSize);

        for (var i = 0;i < auxiliariesNumber; i++) {

            var auxiliaryCoordinates = {
                x1: auxiliariesStart + (this.info.config.gridSize * i),
                y1: 0,
                x2: auxiliariesStart + (this.info.config.gridSize * i),
                y2: this.info.rootSvg.height * 3
            };

            var auxiliary = this.svgModels.getLine(auxiliaryCoordinates, this.info.styles.gridAuxiliaryStyle, 'grid_v_auxiliary_' + i);

            this.showElement('grid_g', auxiliary);

        }

    },

    createElement: function(tag) {

        var element = document.createElementNS('http://www.w3.org/2000/svg', tag);

        return element;
    },

    showElement: function(root, element) {

        document.getElementById(root).appendChild(element);

    },

    getElement: function(id) {
        return document.getElementById(id);
    },

    setSvgElementListeners: function() {
        this.info.rootSvg.element.mousedown(_.bind(this.captureMouseDown, this));
        this.info.rootSvg.element.mouseup(_.bind(this.captureMouseUp, this));
        this.info.rootSvg.element.mousemove(_.bind(this.captureMouseMove, this));
        this.info.rootSvg.element.bind('mousewheel', _.bind(this.captureMouseWheel, this));
    },

    getEventCoordinates: function(event) {
        return {
            x: event.pageX - this.info.rootSvg.left,
            y: event.pageY - this.info.rootSvg.top
        };
    },

    captureMouseDown: function(event) {

        var mouseDownCoordinates = this.getEventCoordinates(event);

        this.info.interaction.click.start.x = mouseDownCoordinates.x;
        this.info.interaction.click.start.y = mouseDownCoordinates.y;
        this.display();

        this.mover.mouseDown();
    },

    captureMouseUp: function(event) {

        var mouseUpCoordinates = this.getEventCoordinates(event);

        this.info.interaction.click.end.x = mouseUpCoordinates.x;
        this.info.interaction.click.end.y = mouseUpCoordinates.y;
        this.display();
        this.mover.mouseUp();
    },

    captureMouseMove: function(event) {

        var mouseOverCoordinates = this.getEventCoordinates(event);

        this.info.interaction.move.x = mouseOverCoordinates.x;
        this.info.interaction.move.y = mouseOverCoordinates.y;
        this.display();

        this.mover.mouseMove();
    },

    captureMouseWheel: function(event) {

        if (event.originalEvent.wheelDeltaY > 0) {
            this.captureMouseWheelDown();
        } else {
            this.captureMouseWheelUp();
        }
        this.display();

    },

    captureMouseWheelDown: function() {

        this.zoomer.wheelDown();

    },

    captureMouseWheelUp: function() {

        this.zoomer.wheelUp();

    },

    startTools: function() {
        this.mover = this.svgTools.getTool('mover', this);
        this.zoomer = this.svgTools.getTool('zoomer', this);
    },

    toOrigin: function() {

        this.info.interaction.origin.x = this.info.rootSvg.width / 2;
        this.info.interaction.origin.y = this.info.rootSvg.height / 2;
        this.info.interaction.zoom.level = 4;
        this.info.interaction.zoom.factor = 0.0001;

        this.setGrid();
        this.display();

    },

    display: function() {
        $('#svg_top').html('top: ' + this.info.rootSvg.top);
        $('#svg_left').html('left: ' + this.info.rootSvg.left);
        $('#svg_bottom').html('bottom: ' + this.info.rootSvg.bottom);
        $('#svg_right').html('right: ' + this.info.rootSvg.right);
        $('#svg_move_x').html('x: ' + this.info.interaction.move.x);
        $('#svg_move_y').html('y: ' + this.info.interaction.move.y);
        $('#svg_click_start_x').html('x: ' + this.info.interaction.click.start.x);
        $('#svg_click_start_y').html('y: ' + this.info.interaction.click.start.y);
        $('#svg_click_end_x').html('x: ' + this.info.interaction.click.end.x);
        $('#svg_click_end_y').html('y: ' + this.info.interaction.click.end.y);
        $('#svg_origin_x').html('x: ' + this.info.interaction.origin.x);
        $('#svg_origin_y').html('y: ' + this.info.interaction.origin.y);
        $('#svg_zoom_level').html('level: ' + this.info.interaction.zoom.level);
        $('#svg_zoom_factor').html('factor: ' + this.info.interaction.zoom.factor);
    }

};

function SvgService(svgModels, svgTools) {

    this.svgModels = svgModels;
    this.svgTools = svgTools;

    this.init();

}

SvgService.prototype = {

    init: function () {
        p.init(this.svgModels, this.svgTools);
    },

    start: function(svgContainer, prefs) {
        p.start(svgContainer, prefs);
    },

    toOrigin: function() {
        p.toOrigin();
    }

};

module.exports = SvgService;
