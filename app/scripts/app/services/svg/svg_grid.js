var p = {

    init: function(layer) {
        this.layer = layer;
    },

    emptyGrid: function() {
        this.layer.emptyLayer();
    },

    displayGrid: function(gridConfig) {

        if (this.root.info.config.gridDisplayLevel > 2) {
            this.setGridHorizontalSubAuxiliaries();
            this.setGridVerticalSubAuxiliaries();

        }

        if (this.root.info.config.gridDisplayLevel > 1) {
            this.setGridHorizontalAuxiliaries();
            this.setGridVerticalAuxiliaries();
        }

        if (this.root.info.config.gridDisplayLevel > 0) {
            this.setXAxis();
            this.setYAxis();
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

    /*
     Creates and sets the x auxiliaries
     */
    setGridHorizontalAuxiliaries: function() {

        var auxiliariesNumber = Math.ceil(this.root.info.rootSvg.height / this.root.info.config.gridSize) * 3;

        var auxiliariesStart = (this.root.info.interaction.origin.y) % this.root.info.config.gridSize;

        for (var i = 0;i < auxiliariesNumber; i++) {

            var auxiliaryCoordinates = {
                x1: 0,
                y1: auxiliariesStart + (this.root.info.config.gridSize * i),
                x2: this.root.info.rootSvg.width * 3,
                y2: auxiliariesStart + (this.root.info.config.gridSize * i)
            };

            var auxiliary = this.root.svgModels.getLine(auxiliaryCoordinates, this.root.info.styles.gridAuxiliaryStyle, 'grid_h_auxiliary_' + i);

            var auxiliaryLabel = this.root.svgModels.getText(
                {
                    x: this.root.info.interaction.origin.x,
                    y: auxiliariesStart + (this.root.info.config.gridSize * i),
                },
                (this.root.info.interaction.origin.y - (auxiliariesStart + (this.root.info.config.gridSize * i))) / this.root.info.config.gridSize
            );

            this.root.info.layers.grid.showElement(auxiliaryLabel);
            this.root.info.layers.grid.showElement(auxiliary);

        }

    },

    /*
     Creates and sets the x auxiliaries
     */
    setGridVerticalAuxiliaries: function() {

        var auxiliariesNumber = Math.ceil(this.root.info.rootSvg.width / this.root.info.config.gridSize) * 3;

        var auxiliariesStart = (this.root.info.interaction.origin.x) % this.root.info.config.gridSize;

        for (var i = 0;i < auxiliariesNumber; i++) {

            var auxiliaryCoordinates = {
                x1: auxiliariesStart + (this.root.info.config.gridSize * i),
                y1: 0,
                x2: auxiliariesStart + (this.root.info.config.gridSize * i),
                y2: this.root.info.rootSvg.height * 3
            };

            var auxiliary = this.root.svgModels.getLine(auxiliaryCoordinates, this.root.info.styles.gridAuxiliaryStyle, 'grid_v_auxiliary_' + i);

            var auxiliaryLabel = this.root.svgModels.getText(
                {
                    x: auxiliariesStart + (this.root.info.config.gridSize * i),
                    y: this.root.info.interaction.origin.y
                },
                (this.root.info.interaction.origin.x - (auxiliariesStart + (this.root.info.config.gridSize * i))) / this.root.info.config.gridSize
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
    }

};

module.exports = SvgGrid;