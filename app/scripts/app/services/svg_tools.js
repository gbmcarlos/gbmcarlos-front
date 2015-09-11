'use strict';

var p = {

    tools: {

    },

    init: function(svgModels) {
        this.svgModels = svgModels;
        this.setTools();
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

                this.matrix = [
                    0,
                    0,
                    0,
                    0,
                    this.info.interaction.move.x,
                    this.info.interaction.move.y
                ];

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

            },

            move: function() {

                var start = this.info.interaction.click.start;
                var end = this.info.interaction.move;

                var translateX = end.x - start.x;
                var translateY = end.y - start.y;

                this.info.interaction.origin.x = this.originalOrigin.x + translateX;
                this.info.interaction.origin.y = this.originalOrigin.y + translateY;

                document.getElementById('grid_svg').setAttribute('x', - this.info.rootSvg.width + translateX);
                document.getElementById('grid_svg').setAttribute('y', - this.info.rootSvg.width + translateY);

            },

            stopMoving: function() {

                document.getElementById('grid_svg').setAttribute('x', - this.info.rootSvg.width);
                document.getElementById('grid_svg').setAttribute('y', - this.info.rootSvg.height);

                this.root.setGrid();

            },

            zoom: function(direction) {

                this.zoomGrid(direction);

            },

            zoomGrid: function(direction) {

                this.updateMatrix(direction);

                console.log(this.matrix);

                document.getElementById('grid_g').setAttribute('transform', 'matrix(' + this.matrix.join(' ') + ')');

                var newOrigin = this.calculateNewOrigin(direction);

                this.info.interaction.origin = newOrigin;

                this.root.setGrid();

            },

            updateMatrix: function(direction) {

                this.matrix[0] = this.matrix[3] = this.info.config.zoom.factor[direction];

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



        });
    },

    createTool: function(toolName, tool) {

        this.tools[toolName] = _.extend(_.clone(this.toolInterface), tool);

    }

};

function SvgTools(svgModels) {

    this.svgModels = svgModels;
    this.init();

}

SvgTools.prototype = {

    init: function() {
        p.init(this.svgModels);
    },

    setRoot: function(root) {
        p.root = root;
    },

    getTool: function(tool, root) {
        return p.tools[tool].setRoot(root);
    }

};

module.exports = SvgTools;
