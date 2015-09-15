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

            // DON'T DELETE
            // x' = f(x - o) + o
            // x' = x * f + -fo + o
            zoom: function(direction) {

                //this.info.layers.grid.setMatrix(this.matrix);
                //this.info.layers.omega.setMatrix(this.matrix);

                this.info.interaction.origin = this.calculateNewOrigin(direction);

                this.info.layers.grid.refresh();
                this.info.layers.omega.refresh();

            },

            updateMatrix: function(direction) {

                var f = this.info.config.zoom.factor[direction];

                this.matrix = [
                    f,
                    0,
                    0,
                    f,
                    -f*this.info.interaction.move.x + this.info.interaction.move.x,
                    -f*this.info.interaction.move.y + this.info.interaction.move.y
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
                    x: Math.round(this.info.config.zoom.factor[direction] * (this.info.interaction.origin.x - this.info.interaction.move.x) + this.info.interaction.move.x),
                    y: Math.round(this.info.config.zoom.factor[direction] * (this.info.interaction.origin.y - this.info.interaction.move.y) + this.info.interaction.move.y)
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

                var pointCoordinates = {
                    x: (this.info.interaction.move.x - this.info.interaction.origin.x) * zoomSizeUnitFactor,
                    y: (this.info.interaction.move.y - this.info.interaction.origin.y) * zoomSizeUnitFactor
                };

                console.log(pointCoordinates);

                return pointCoordinates;

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
