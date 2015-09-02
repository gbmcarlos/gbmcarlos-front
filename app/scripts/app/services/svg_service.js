'use strict';

var p = {

    omega: {},

    rootSvg: {},

    interaction: {
        click: {
            start: {

            },
            end: {

            }
        }
    },

    styles: {
        axisStyle: {
            stroke: 'black',
            strokeWidth: 2
        }
    },

    init: function(svgModels, prefs) {
        this.svgModels = svgModels;
        this.prefs = prefs;
    },

    start: function(svgContainer) {

        this.setSvgStruct(svgContainer);
        this.setRootSvgDimensions();
        this.startRootSvg();
    },

    setSvgStruct: function(svgContainer) {

        var rootSvg = document.createElement('svg');
        rootSvg.setAttribute('id', 'root_svg');

        var gridSvg = document.createElement('svg');
        gridSvg.setAttribute('id', 'grid_svg');
        var gridG = document.createElement('g');
        gridG.setAttribute('id', 'grid_g');
        gridSvg.appendChild(gridG);

        rootSvg.appendChild(gridSvg);

        this.showElement(svgContainer.attr('id'), rootSvg);

        return rootSvg;

    },

    setRootSvgDimensions: function() {
        this.rootSvg.element = $('#root_svg');
        this.rootSvg.top = this.rootSvg.element.offset().top;
        this.rootSvg.left = this.rootSvg.element.offset().left;
        this.rootSvg.height = this.rootSvg.element.outerHeight();
        this.rootSvg.width = this.rootSvg.element.outerWidth();
        this.rootSvg.bottom = this.rootSvg.top + this.rootSvg.height;
        this.rootSvg.right = this.rootSvg.left + this.rootSvg.width;
    },

    startRootSvg: function() {
        this.setSvgElementListeners();
        this.startGrid();
    },

    setSvgElementListeners: function() {
        this.rootSvg.element.mousemove(_.bind(this.setMouseOverCoordinates, this));
        this.rootSvg.element.mousedown(_.bind(this.setMouseDownCoordinates, this));
        this.rootSvg.element.mouseup(_.bind(this.setMouseUpCoordinates, this));
    },

    getEventCoordinates: function(event) {
        return {
            x: event.pageX - this.rootSvg.left,
            y: event.pageY - this.rootSvg.top
        };
    },

    setMouseOverCoordinates: function(event) {

        var mouseOverCoordinates = this.getEventCoordinates(event);

        this.interaction.x = mouseOverCoordinates.x;
        this.interaction.y = mouseOverCoordinates.y;
        this.display();
    },

    setMouseDownCoordinates: function(event) {

        var mouseDownCoordinates = this.getEventCoordinates(event);

        this.interaction.click.start.x = mouseDownCoordinates.x;
        this.interaction.click.start.y = mouseDownCoordinates.y;
        this.display();
    },

    setMouseUpCoordinates: function(event) {

        var mouseUpCoordinates = this.getEventCoordinates(event);

        this.interaction.click.end.x = mouseUpCoordinates.x;
        this.interaction.click.end.y = mouseUpCoordinates.y;
        this.display();
    },

    startGrid: function() {
        this.startGridContent();
    },
    
    startGridContent: function() {

        var xAxis = this.getXAxis();
        var yAxis = this.getYAxis();

        this.showElement('grid_g', xAxis);
        this.showElement('grid_g', yAxis);

    },

    getXAxis: function() {

        var axisCoordinates = {
            x1: this.rootSvg.width / 2,
            y1: 0,
            x2: this.rootSvg.width / 2,
            y2: this.rootSvg.height
        };

        var axis = this.svgModels.getLine(axisCoordinates, this.styles.axisStyle);

        return axis;

    },

    getYAxis: function() {

        var axisCoordinates = {
            x1: 0,
            y1: this.rootSvg.height / 2,
            x2: this.rootSvg.width,
            y2: this.rootSvg.height / 2
        };

        var axis = this.svgModels.getLine(axisCoordinates, this.styles.axisStyle);

        return axis;


    },

    showElement: function(root, element) {

        document.getElementById(root).appendChild(element);

    },

    display: function() {
        $('#svg_top').html('top: ' + this.rootSvg.top);
        $('#svg_left').html('left: ' + this.rootSvg.left);
        $('#svg_bottom').html('bottom: ' + this.rootSvg.bottom);
        $('#svg_right').html('right: ' + this.rootSvg.right);
        $('#svg_move_x').html('x: ' + this.interaction.x);
        $('#svg_move_y').html('y: ' + this.interaction.y);
        $('#svg_click_start_x').html('x: ' + this.interaction.click.start.x);
        $('#svg_click_start_y').html('y: ' + this.interaction.click.start.y);
        $('#svg_click_end_x').html('x: ' + this.interaction.click.end.x);
        $('#svg_click_end_y').html('y: ' + this.interaction.click.end.y);
    }

};

function SvgService(svgModels) {

    this.svgModels = svgModels;

    this.init();

}

SvgService.prototype = {

    init: function () {
        p.init(this.svgModels);
    },

    start: function(svgContainer, prefs) {
        p.start(svgContainer, prefs);
    }

};

module.exports = SvgService;
