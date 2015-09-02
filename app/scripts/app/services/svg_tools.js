'use strict';

var p = {

    tools: {

    },

    init: function(svgModels) {
        this.svgModels = svgModels;
        this.setTools();
    },

    setTools: function() {
        this.setMover();
    },

    setMover: function() {
        this.tools.mover = {

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

            }
        }
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
