'use strict';

var p = {

    tools: {

    },

    setTools: function() {

        this.setToolInterface();
        this.setPointCreator();
        this.setExplorer();

    },

    setToolInterface: function() {

        this.toolInterface = {

            setRoot: function(root) {

                this.root = root;
                this.info = root.info;

                return this;

            },

            mouseDown: function() {},
            mouseUp: function() {},
            mouseMove: function() {},
            wheelDown: function() {},
            wheelUp: function() {}

        };

    },

    setExplorer: function() {
        this.createTool('explorer', {

            state: 'none',

            setRoot: function(root) {

                this.root = root;
                this.info = root.info;

                return this;
            },

            mouseDown: function() {
                if (this.state == 'none') {
                    this.state = 'moving';
                    this.startMoving();
                }
            },

            mouseUp: function() {
                if (this.state == 'moving') {
                    this.state = 'none';
                    this.stopMoving();
                }
            },

            mouseMove: function() {
                if (this.state == 'moving') {
                    this.move();
                }
            },

            mouseOut: function() {
                if (this.state == 'moving') {
                    this.state = 'none';
                    this.stopMoving();
                }
            },

            wheelDown: function() {

                if ((this.info.interaction.zoom.level + 1) <= this.info.config.zoom.levels) {
                    this.info.interaction.zoom.level += 1;
                    this.zoom('in');
                }

            },

            wheelUp: function() {

                if ((this.info.interaction.zoom.level - 1) >= 0 ) {
                    this.info.interaction.zoom.level -= 1;
                    this.zoom('out');
                }
            },

            startMoving: function() {

                this.originalOrigin = _.clone(this.info.interaction.origin);
                this.clickStart = _.clone(this.info.interaction.move);

            },

            move: function() {

                var end = this.info.interaction.move;

                var translate = {
                    x: end.x - this.clickStart.x,
                    y: end.y - this.clickStart.y
                };

                this.info.interaction.origin.x = this.originalOrigin.x + translate.x;
                this.info.interaction.origin.y = this.originalOrigin.y + translate.y;

                this.info.layers.grid.setTranslateBy(translate);
                this.info.layers.omega.setTranslateBy(translate);

            },

            stopMoving: function() {

                this.info.layers.grid.refresh();
                this.info.layers.omega.refresh();

            },

            zoom: function(direction) {

                this.zoomGrid(direction);
                //this.zoomOmega(direction);

            },

            zoomOmega: function(direction) {

                this.updateMatrix(direction);

                this.info.layers.grid.setMatrix(this.matrix);

            },

            zoomGrid: function(direction) {

                this.updateMatrix(direction);

                this.info.layers.grid.setMatrix(this.matrix);

                this.info.interaction.origin = this.calculateNewOrigin(direction);

                this.info.layers.grid.refresh();
                this.info.layers.grid.emptyLayer();

                this.root.setGrid();

            },

            updateMatrix: function(direction) {

                this.matrix = [
                    this.info.config.zoom.factor[direction],
                    0,
                    0,
                    this.info.config.zoom.factor[direction],
                    this.info.interaction.move.x,
                    this.info.interaction.move.y
                ];

            },

            zoomAllowed: function(newZoom) {

                return (
                    newZoom >= 0 &&
                    newZoom <= this.info.config.zoom.levels
                );

            },

            calculateNewOrigin: function(direction) {
                return {
                    x: Math.round(this.info.interaction.origin.x * this.info.config.zoom.factor[direction]) + this.info.interaction.move.x,
                    y: Math.round(this.info.interaction.origin.y * this.info.config.zoom.factor[direction]) + this.info.interaction.move.y
                };
            }
        });
    },

    setPointCreator: function() {

        this.createTool('pointCreator', {

            mouseUp: function() {
                this.newPoint();
            },

            newPoint: function() {

                var pointElement = this.createPointElement();
                var pointCoordinates = this.getPointCoordinates();

                var point = {
                    element: pointElement,
                    coordinates: pointCoordinates
                };

                this.info.layers.omega.showElement(point.element);
                this.info.omega.elements.push(point);

            },

            getPointCoordinates: function() {

                return {
                    x: this.info.interaction.move.x - this.info.interaction.origin.x,
                    y: this.info.interaction.move.y - this.info.interaction.origin.y
                };

            },

            createPointElement: function() {

                var pointElement = this.root.svgModels.getPoint(this.info.interaction.move, this.info.styles.point, 'd');

                return pointElement;

            }

        });
    },

    createTool: function(toolName, tool) {

        this.tools[toolName] = _.extend(_.clone(this.toolInterface), tool).setRoot(this.root);

    }

};

function SvgTools() {}

SvgTools.prototype = {

    setRoot: function(root) {
        p.root = root;
    },

    setTools: function() {
        p.setTools();
    },

    getTool: function(tool) {
        return p.tools[tool];
    }

};

module.exports = SvgTools;
