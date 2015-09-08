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
        this.setExplorer();
        this.setPointCreator();

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
        this.tools.explorer = _.extend(this.toolInterface, {

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

                var newZoom = this.info.interaction.zoom.level + 1;

                var zoomAllowed = this.zoomAllowed(newZoom);

                if (zoomAllowed) {

                    this.info.interaction.zoom.factor /= this.info.config.zoom.factor;
                    this.info.interaction.zoom.level += 1;

                    this.zoom();

                }

            },

            wheelUp: function() {

                var newZoom = this.info.interaction.zoom.level - 1;

                var zoomAllowed = this.zoomAllowed(newZoom);

                if (zoomAllowed) {

                    this.info.interaction.zoom.factor *= this.info.config.zoom.factor;
                    this.info.interaction.zoom.level -= 1;

                    this.zoom();

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
                document.getElementById('grid_svg').setAttribute('y', - this.info.rootSvg.height + translateY);

            },

            stopMoving: function() {

                document.getElementById('grid_svg').setAttribute('x', - this.info.rootSvg.width);
                document.getElementById('grid_svg').setAttribute('y', - this.info.rootSvg.height);

                this.root.setGrid();

            },

            zoom: function() {

                this.zoomGrid();

            },

            zoomGrid: function() {

                this.updateMatrix();

                document.getElementById('grid_g').setAttribute('transform', 'matrix(' + this.matrix.join(' ') + ')');

                var newOrigin = this.calculateNewOrigin(this.matrix);

                this.info.interaction.origin = newOrigin;

                this.root.setGrid();

            },

            updateMatrix: function() {

                this.matrix = [
                    this.info.config.zoom.factor,
                    0,
                    0,
                    this.info.config.zoom.factor,
                    ((this.info.interaction.move.x || 0) + this.info.rootSvg.width),
                    ((this.info.interaction.move.y || 0) + this.info.rootSvg.height)
                ];

            },

            zoomAllowed: function(newZoom) {

                return (
                    newZoom >= 0 &&
                    newZoom <= this.info.config.zoom.levels
                );

            },

            calculateNewOrigin: function() {
                return {
                    x: Math.round(this.info.interaction.origin.x * this.info.interaction.zoom.factor) + this.info.interaction.move.x,
                    y: Math.round(this.info.interaction.origin.y * this.info.interaction.zoom.factor) + this.info.interaction.move.y
                };
            }
        });
    },

    setPointCreator: function() {
        this.tools.pointCreator = _.extend(this.toolInterface, {


            
        });
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
