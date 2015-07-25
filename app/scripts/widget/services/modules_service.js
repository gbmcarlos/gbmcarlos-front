'use strict';

var p = {

    config: require('./../config/modules.json'),

    generateConfig: function () {

        this.layout = this.getLayout();

        console.log(this.layout);

    },

    getLayout: function () {

        var layout = _.findWhere(this.config.layouts, {enabled: true});

        var layout = this.generateLayout(layout);

        return layout;

    },

    generateLayout: function (layoutDefinition) {

        var layout = {
            name: layoutDefinition.name
        };

        layout.class = (!!layoutDefinition.expand) ? 'container-fluid' : 'container';

        layout.rows = [];

        _.each(layoutDefinition.structure.rows, function (rowDefinition) {

            var row = this.generateRow(rowDefinition);

            layout.rows.push(row);

        }, this);

        return layout;

    },

    generateRow: function (rowDefinition) {

        var row = {
            name: rowDefinition.name,
            cellsUsed: 0,
            subRows: [[]]
        };

        row.columns = [];

        _.each(rowDefinition.columns, function (columnDefinition) {

            var column = this.generateColumn(columnDefinition, row);

            this.addRowColumn(row, column);

        }, this);

        return row;

    },

    addRowColumn: function(row, column) {

        var currentSubRow = row.subRows ? row.subRows.length - 1 : 0;

        if ((row.cellsUsed + column.offset + column.width) <= 12 ) {
            row.subRows[currentSubRow].push(column);
        } else {
            row.subRows.push([column]);
            row.cellsUsed = 0;
        }

        row.columns.push(column);

        row.cellsUsed += column.offset + column.width;

    },

    updateRowCellsUsed: function(row, column) {

        var newCellsUsed = column.offset + column.width;

        row.cellsUsed += newCellsUsed;

        return row;

    },

    generateColumn: function (columnDefinition, row) {

        var column = {
            name: columnDefinition.name,
            offset: 0
        };

        column.width = this.getColumnWidth(columnDefinition.width, row);
        column.widthCclass = this.getColumnWidthClass(column.width);

        column.offset = this.getColumnOffset(column, columnDefinition, row);
        column.offsetClass = this.getColumnOffsetClass(column.offset);

        return column;


    },

    getColumnWidth: function (widthDefinition, row) {

        var columnWidth;

        if (widthDefinition.type == 'percentatge') {
            columnWidth = this.getColumnWidthPercentatge(widthDefinition.value);
        }

        if (widthDefinition.type == 'cell') {
            columnWidth = this.getColumnWidthCell(widthDefinition.value);
        }

        if (widthDefinition.type == 'offset') {
            columnWidth = this.getColumnWidthOffset(row);
        }

        return columnWidth;

    },

    getColumnWidthPercentatge: function (percentatgeValue) {

        var columnWidth;

        var width = (percentatgeValue * 12 / 100);

        if (width % 1 == 0) {
            columnWidth = width;
        }

        return columnWidth;

    },

    getColumnWidthCell: function (cellValue) {

        var columnWidth;

        columnWidth = parseInt(cellValue);

        return columnWidth;

    },

    getColumnWidthOffset: function (row) {

        var columnWidth;

        columnWidth = 12 - (row.cellsUsed % 12);

        return columnWidth;

    },

    getColumnWidthClass: function (width) {

        return 'col-md-' + width;

    },

    getColumnOffset: function(column, columnDefinition, row) {

        var columnOffset = 0;

        if (!!columnDefinition.align && columnDefinition.align == 'right') {
            columnOffset = this.getColumnOffsetAlignRight(column.width, row);
        }

        if (!!columnDefinition.align && columnDefinition.align == 'center') {
            columnOffset = this.getColumnOffsetAlignCenter(column.width, row);
        }

        return columnOffset;

    },

    getColumnOffsetAlignRight: function(columnWidth, row) {

        var offsetAlignRight = 12 - (row.cellsUsed + columnWidth);

        return offsetAlignRight;

    },

    getColumnOffsetAlignCenter: function(columnWidth, row) {

        var offsetAlignCenter = 0;

        if (row.cellsUsed < 6) {
            offsetAlignCenter = 6 - row.cellsUsed;
        }

        return offsetAlignCenter;

    },


    getColumnOffsetClass: function(offset) {

        return offset ? 'col-md-offset-' + offset : '';

    }

};

function ModulesService() {
}

ModulesService.prototype = {

    generateConfig: function () {
        return p.generateConfig();
    }

};

module.exports = ModulesService;