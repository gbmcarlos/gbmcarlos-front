'use strict';

function Templates() {
    this.templates = {
        baseLayoutTemplate: require('./../resources/app/templates/layout.hbs'),
        boxHeaderTemplate: require('./../modules/box/templates/box_header.hbs'),
        boxBodyTemplate: require('./../modules/box/templates/box_body.hbs')
    };
}


module.exports = Templates;
