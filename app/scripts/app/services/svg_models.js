'use strict';

var p = {

    init: function() {
        this.setModels();
    },

    setModels: function() {
        this.setPointModel();

    },

    setPointModel: function() {

        this.pointModel = {
            x: 0,
            y: 0
        };

    },

    getLine: function(coordinates, style) {

        var line = document.createElement('line');

        line.setAttribute('x1', coordinates.x1);
        line.setAttribute('y1', coordinates.y1);
        line.setAttribute('x2', coordinates.x2);
        line.setAttribute('y2', coordinates.y2);

        if (style.stroke) {
            line.setAttribute('stroke', style.stroke);
        }

        if (style.strokeWidth) {
            line.setAttribute('stroke-width', style.strokeWidth);
        }

        return line;

    }

};

function SvgModels() {

    this.init();

}

SvgModels.prototype = {

    init: function() {
        p.init();
    },

    getLine: function(coordinates, style) {
        return p.getLine(coordinates, style);
    }

};

module.exports = SvgModels;