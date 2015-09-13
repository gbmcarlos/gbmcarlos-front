'use strict';

var p = {

    init: function() {
        this.setBaseLayer();
    },

    setBaseLayer: function() {

        var info = this.root.info;

        this.baseLayer = {

            emptyLayer: function() {

                while (this.element.firstChild.hasChildNodes()) {
                    this.element.firstChild.removeChild(this.element.firstChild.lastChild);
                }

            },

            showElement: function(element) {
                this.element.firstChild.appendChild(element);
            },

            setTranslate: function(translate) {

                if (!translate) {
                    translate = {
                        x: - info.rootSvg.width,
                        y: - info.rootSvg.height
                    };
                }

                this.element.setAttribute('x', translate.x);
                this.element.setAttribute('y', translate.y);

            },

            setTranslateBy: function(translateBy) {

                var translate = {
                    x: - info.rootSvg.width + translateBy.x,
                    y: - info.rootSvg.height + translateBy.y
                };

                this.setTranslate(translate);

            },

            setMatrix: function(matrix) {

                var transform = (!!matrix) ? 'matrix(' + matrix.join(',') + ')' : '';

                this.element.firstChild.setAttribute('transform', transform);

            },

            refresh: function() {

                this.setTranslate(null);

                this.setMatrix(null);

                this.emptyLayer();

                if (!!this.refreshCallback) {
                    this.refreshCallback();
                }

            }

        };

    },

    newLayer: function(id, refreshCallback) {

        var newLayerElement = this.getNewLayerElement(id);

        var newLayer = _.extend(_.clone(this.baseLayer), {
            id: id,
            element: newLayerElement,
            refreshCallback: refreshCallback
        });

        this.root.showElement('root_svg', newLayer.element);

        return newLayer;

    },

    getNewLayerElement: function(id) {

        var layerSvg = this.createElement('svg', id + '_svg');
        var layerG = this.createElement('g', id + '_g');

        layerSvg.setAttribute('width', this.root.info.rootSvg.width * 3);
        layerSvg.setAttribute('height', this.root.info.rootSvg.height * 3);
        layerSvg.setAttribute('x', - this.root.info.rootSvg.width);
        layerSvg.setAttribute('y', - this.root.info.rootSvg.height);

        layerSvg.appendChild(layerG);

        return layerSvg;

    },

    createElement: function(tag, id) {

        var element = document.createElementNS('http://www.w3.org/2000/svg', tag);

        if (!!id) {
            element.setAttribute('id', id);
        }

        return element;
    }

};

function SvgLayer() {}

SvgLayer.prototype = {

    init: function() {
        p.init();
    },

    setRoot: function(root) {
        p.root = root;
    },

    newLayer: function(id, refreshCallback) {
        return p.newLayer(id, refreshCallback);
    }
};

module.exports = SvgLayer;
