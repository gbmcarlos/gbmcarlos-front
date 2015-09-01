'use strict';

var p = {

    omega: {},

    svgElement: {},

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

    start: function(svgElement) {

        this.setSvgElement(svgElement);
        this.startSvg();
    },

    setSvgElement: function(svgElement) {
        this.svgElement.element = svgElement;
        this.svgElement.top = svgElement.offset().top;
        this.svgElement.left = svgElement.offset().left;
        this.svgElement.height = svgElement.outerHeight();
        this.svgElement.width = svgElement.outerWidth();
        this.svgElement.bottom = this.svgElement.top + this.svgElement.height;
        this.svgElement.right = this.svgElement.left + this.svgElement.width;
    },

    startSvg: function() {
        this.startSvgElement();
        this.startGrid();
    },

    startSvgElement: function() {
        this.setSvgElementListeners();
    },

    setSvgElementListeners: function() {
        this.svgElement.element.mousemove(_.bind(this.setMouseOverCoordinates, this));
        this.svgElement.element.mousedown(_.bind(this.setMouseDownCoordinates, this));
        this.svgElement.element.mouseup(_.bind(this.setMouseUpCoordinates, this));
    },

    getEventCoordinates: function(event) {
        return {
            x: event.pageX - this.svgElement.left,
            y: event.pageY - this.svgElement.top
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
        this.startGridContainer();
        this.startGridContent();
    },

    startGridContainer: function() {

        var gridSvg = document.createElement('svg');
        var gridG = document.createElement('g');
        gridG.setAttribute('id', 'grid_g');
        gridSvg.setAttribute('id', 'grid_svg');
        gridSvg.appendChild(gridG);

        this.showElement('root_svg', gridSvg);

    },

    startGridContent: function() {

        var xAxis = this.getXAxis();
        var yAxis = this.getYAxis();

        this.showElement('grid_g', xAxis);
        this.showElement('grid_g', yAxis);

    },

    getXAxis: function() {

        var axisCoordinates = {
            x1: this.svgElement.width / 2,
            y1: 0,
            x2: this.svgElement.width / 2,
            y2: this.svgElement.height
        };

        var axis = this.svgModels.getLine(axisCoordinates, this.styles.axisStyle);

        return axis;

    },

    getYAxis: function() {

        var axisCoordinates = {
            x1: 0,
            y1: this.svgElement.height / 2,
            x2: this.svgElement.width,
            y2: this.svgElement.height / 2
        };

        var axis = this.svgModels.getLine(axisCoordinates, this.styles.axisStyle);

        return axis;


    },

    showElement: function(root, element) {

        document.getElementById(root).appendChild(element);

    },

    display: function() {
        $('#svg_top').html('top: ' + this.svgElement.top);
        $('#svg_left').html('left: ' + this.svgElement.left);
        $('#svg_bottom').html('bottom: ' + this.svgElement.bottom);
        $('#svg_right').html('right: ' + this.svgElement.right);
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

    start: function(svgElement, prefs) {
        p.start(svgElement, prefs);
    }

};

module.exports = SvgService;
