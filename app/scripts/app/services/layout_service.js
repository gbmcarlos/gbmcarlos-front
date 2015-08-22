'use strict';

var p = {

    setLayoutDefinition: function (layoutDefinition) {

        this.definition = layoutDefinition;

    },

    parseLayout: function() {

        if (this.layout) {

            return this.layout;

        } else if(this.definition){

            return this.generateLayout();

        }

    },

    generateLayout: function () {

        var layout = {
            layoutClass: this.definition.class,
            rows: [],
            regions: {}
        };

        layout.containerClass = (!!this.definition.expand) ? 'container-fluid' : 'container';

        layout.class = this.concatClasses(layout.layoutClass, layout.containerClass);

        _.each(this.definition.structure.rows, function (rowDefinition) {

            var row = this.generateRow(rowDefinition, layout);

            layout.rows.push(row);

        }, this);

        return layout;

    },

    generateRow: function (rowDefinition, layout) {

        var row = {
            name: rowDefinition.name,
            rowClass: rowDefinition.class,
            cellsUsed: 0,
            columns: [],
            subRows: [[]]
        };

        row.class = row.rowClass;

        _.each(rowDefinition.columns, function (columnDefinition) {

            var column = this.generateColumn(columnDefinition, row);

            this.addRowColumn(layout, row, column);

        }, this);

        return row;

    },

    generateColumn: function (columnDefinition, row) {

        var column = {
            name: columnDefinition.name,
            columnClass: columnDefinition.class,
            offset: 0
        };


        column.width = this.getColumnWidth(columnDefinition.width, row);
        column.widthClass = this.getColumnWidthClass(column.width);

        column.offset = this.getColumnOffset(column, columnDefinition, row);
        column.offsetClass = this.getColumnOffsetClass(column.offset);

        column.class = this.concatClasses(column.columnClass, column.widthClass, column.offsetClass);
        return column;


    },

    addRowColumn: function (layout, row, column) {

        var currentSubRow = row.subRows ? row.subRows.length - 1 : 0;

        if ((row.cellsUsed + column.offset + column.width) <= 12) {
            row.subRows[currentSubRow].push(column);
        } else {
            row.subRows.push([column]);
            row.cellsUsed = 0;
        }

        row.columns.push(column);

        row.cellsUsed += column.offset + column.width;

        layout.regions[column.name] = '#' + column.name;

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

    getColumnOffset: function (column, columnDefinition, row) {

        var columnOffset = 0;


        if (columnDefinition.width.type != 'offset') {


            if (!!columnDefinition.align && columnDefinition.align == 'right') {
                columnOffset = this.getColumnOffsetAlignRight(column.width, row);
            }

            if (!!columnDefinition.align && columnDefinition.align == 'center') {
                columnOffset = this.getColumnOffsetAlignCenter(column.width, row);
            }

        }
        return columnOffset;

    },

    getColumnOffsetAlignRight: function (columnWidth, row) {

        var offsetAlignRight = 12 - (row.cellsUsed + columnWidth);

        return offsetAlignRight;

    },

    getColumnOffsetAlignCenter: function (columnWidth, row) {

        var offsetAlignCenter = 0;

        if (row.cellsUsed < 6) {
            offsetAlignCenter = 6 - row.cellsUsed;
        }

        return offsetAlignCenter;

    },


    getColumnOffsetClass: function (offset) {

        return offset ? 'col-md-offset-' + offset : '';

    },

    concatClasses: function() {

        var args = Array.prototype.slice.call(arguments);

        return args.join(' ');
    }

};

function LayoutService() {
}

LayoutService.prototype = {

    parseLayout: function(layoutDefinition) {
        p.setLayoutDefinition(layoutDefinition);
        return p.parseLayout();
    }

};

module.exports = LayoutService;
