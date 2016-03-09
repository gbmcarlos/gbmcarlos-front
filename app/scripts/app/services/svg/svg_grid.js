var p = {

    init: function(layer) {
        this.layer = layer;
    },

    emptyGrid: function() {
        this.layer.emptyLayer();
    },

    displayGrid: function(gridConfig) {

        if (this.root.info.config.grid.gridDisplayLevel > 2) {
            this.setGridHorizontalSubAuxiliaries();
            this.setGridVerticalSubAuxiliaries();

        }

        if (this.root.info.config.grid.gridDisplayLevel > 1) {
            this.setGridHorizontalAuxiliaries();
            this.setGridVerticalAuxiliaries();
        }

        if (this.root.info.config.grid.gridDisplayLevel > 0) {
            this.setXAxis();
            this.setYAxis();
        }

    },

    zoomGrid: function(out) {

        var interaction = this.root.info.interaction;

        if (out) {
            interaction.grid.divisionsSize -= this.root.info.config.grid.gridInitialDivisionSize/20;
            interaction.grid.divisionsLevel--;

            if (interaction.grid.divisionsLevel == 0) {
                interaction.grid.divisionsLevel = 9;
                interaction.grid.divisionsSize = 150;

                if (interaction.grid.divisionsStep == 1) {
                    interaction.grid.divisionsStep = 5;
                    interaction.grid.zoom /= 10;
                } else if (interaction.grid.divisionsStep == 2) {
                    interaction.grid.divisionsStep = 1;
                } else if (interaction.grid.divisionsStep == 5) {
                    interaction.grid.divisionsStep = 2;
                }
            }
        } else {
            interaction.grid.divisionsSize += this.root.info.config.grid.gridInitialDivisionSize/20;
            interaction.grid.divisionsLevel++;

            if (interaction.grid.divisionsLevel == 11) {
                interaction.grid.divisionsLevel = 1;
                interaction.grid.divisionsSize = 100;

                if (interaction.grid.divisionsStep == 1) {
                    interaction.grid.divisionsStep = 2;
                } else if (interaction.grid.divisionsStep == 2) {
                    interaction.grid.divisionsStep = 5;
                } else if (interaction.grid.divisionsStep == 5) {
                    interaction.grid.divisionsStep = 1;
                    interaction.grid.zoom *= 10;
                }
            }
        }

    },

    /*
     Creates the grid x axis
     */
    setXAxis: function() {

        var axisCoordinates = {
            x1: 0,
            y1: this.root.info.interaction.origin.y,
            x2: this.root.info.rootSvg.width * 3,
            y2: this.root.info.interaction.origin.y
        };

        var axis = this.root.svgModels.getLine(axisCoordinates, this.root.info.styles.axisStyle, 'xAxis');

        this.root.info.layers.grid.showElement(axis);

    },

    /*
     Creates the grid y axis
     */
    setYAxis: function() {

        var axisCoordinates = {
            x1: this.root.info.interaction.origin.x,
            y1: 0,
            x2: this.root.info.interaction.origin.x,
            y2: this.root.info.rootSvg.height * 3
        };

        var axis = this.root.svgModels.getLine(axisCoordinates, this.root.info.styles.axisStyle, 'yAxis');

        this.root.info.layers.grid.showElement(axis);

    },

    getAuxiliaryLabel: function(i, axis) {

        var auxiliariesStart = (this.root.info.interaction.origin[axis]) % this.root.info.interaction.grid.divisionsSize;

        var originAuxiliaryNumber = (this.root.info.interaction.origin[axis] - auxiliariesStart) / this.root.info.interaction.grid.divisionsSize;

        var auxiliaryNumber = originAuxiliaryNumber - i;

        var auxiliaryValue = auxiliaryNumber * this.root.info.interaction.grid.divisionsStep * this.root.info.interaction.grid.zoom;

        return this.roundAuxiliaryLabel(auxiliaryValue);

    },

    roundAuxiliaryLabel: function(value) {
        return Math.round(value * (1/this.root.info.interaction.grid.zoom)) / (1/this.root.info.interaction.grid.zoom);
    },

    /*
     Creates and sets the x auxiliaries
     */
    setGridHorizontalAuxiliaries: function() {

        var auxiliariesNumber = Math.ceil(this.root.info.rootSvg.height / this.root.info.interaction.grid.divisionsSize) * 3;

        var auxiliariesStart = (this.root.info.interaction.origin.y) % this.root.info.interaction.grid.divisionsSize;

        for (var i = 0;i < auxiliariesNumber; i++) {

            var auxiliaryCoordinates = {
                x1: 0,
                y1: auxiliariesStart + (this.root.info.interaction.grid.divisionsSize * i),
                x2: this.root.info.rootSvg.width * 3,
                y2: auxiliariesStart + (this.root.info.interaction.grid.divisionsSize * i)
            };

            var auxiliary = this.root.svgModels.getLine(auxiliaryCoordinates, this.root.info.styles.gridAuxiliaryStyle, 'grid_h_auxiliary_' + i);

            var auxiliaryLabel = this.root.svgModels.getText(
                {
                    x: this.root.info.interaction.origin.x,
                    y: auxiliariesStart + (this.root.info.interaction.grid.divisionsSize * i),
                },
                this.getAuxiliaryLabel(i, 'y'),
                this.root.info.styles.gridAuxiliaryLabelStyle
            );

            this.root.info.layers.grid.showElement(auxiliaryLabel);
            this.root.info.layers.grid.showElement(auxiliary);

        }

    },

    /*
     Creates and sets the x auxiliaries
     */
    setGridVerticalAuxiliaries: function() {

        var auxiliariesNumber = Math.ceil(this.root.info.rootSvg.width / this.root.info.interaction.grid.divisionsSize) * 3;

        var auxiliariesStart = (this.root.info.interaction.origin.x) % this.root.info.interaction.grid.divisionsSize;

        for (var i = 0;i < auxiliariesNumber; i++) {

            var auxiliaryCoordinates = {
                x1: auxiliariesStart + (this.root.info.interaction.grid.divisionsSize * i),
                y1: 0,
                x2: auxiliariesStart + (this.root.info.interaction.grid.divisionsSize * i),
                y2: this.root.info.rootSvg.height * 3
            };

            var auxiliary = this.root.svgModels.getLine(auxiliaryCoordinates, this.root.info.styles.gridAuxiliaryStyle, 'grid_v_auxiliary_' + i);

            var auxiliaryLabel = this.root.svgModels.getText(
                {
                    x: auxiliariesStart + (this.root.info.interaction.grid.divisionsSize * i),
                    y: this.root.info.interaction.origin.y
                },
                this.getAuxiliaryLabel(i, 'x'),
                this.root.info.styles.gridAuxiliaryLabelStyle
            );

            this.root.info.layers.grid.showElement(auxiliaryLabel);
            this.root.info.layers.grid.showElement(auxiliary);

        }

    },


    /*
     Creates and sets the x sub auxiliaries
     */
    setGridHorizontalSubAuxiliaries: function() {

        var auxiliariesNumber = Math.ceil(this.root.info.rootSvg.height / this.root.info.config.gridSubSize) * 3;

        var auxiliariesStart = (this.root.info.interaction.origin.y) % this.root.info.config.gridSubSize;

        for (var i = 0;i < auxiliariesNumber; i++) {

            var auxiliaryCoordinates = {
                x1: 0,
                y1: auxiliariesStart + (this.root.info.config.gridSubSize * i),
                x2: this.root.info.rootSvg.width * 3,
                y2: auxiliariesStart + (this.root.info.config.gridSubSize * i)
            };

            var auxiliary = this.root.svgModels.getLine(auxiliaryCoordinates, this.root.info.styles.gridSubAuxiliaryStyle, 'grid_h_subauxiliary_' + i);

            this.root.info.layers.grid.showElement(auxiliary);

        }

    },

    /*
     Creates and sets the y sub auxiliaries
     */
    setGridVerticalSubAuxiliaries: function() {

        var auxiliariesNumber = Math.ceil(this.root.info.rootSvg.width / this.root.info.config.gridSubSize) * 3;

        var auxiliariesStart = (this.root.info.interaction.origin.x) % this.root.info.config.gridSubSize;

        for (var i = 0;i < auxiliariesNumber; i++) {

            var auxiliaryCoordinates = {
                x1: auxiliariesStart + (this.root.info.config.gridSubSize * i),
                y1: 0,
                x2: auxiliariesStart + (this.root.info.config.gridSubSize * i),
                y2: this.root.info.rootSvg.height * 3
            };

            var auxiliary = this.root.svgModels.getLine(auxiliaryCoordinates, this.root.info.styles.gridSubAuxiliaryStyle, 'grid_v_subauxiliary_' + i);

            this.root.info.layers.grid.showElement(auxiliary);

        }

    }


};

function SvgGrid() {

}

SvgGrid.prototype = {

    setRoot: function(root) {
        p.root = root;
    },

    init: function(layer) {
        p.init(layer);
    },

    emptyGrid: function() {
        p.emptyGrid();
    },

    displayGrid: function(gridConfig) {
        p.displayGrid(gridConfig);
    },

    zoomGrid: function(out) {
        p.zoomGrid(out);
    }

};

module.exports = SvgGrid;