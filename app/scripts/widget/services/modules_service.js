'use strict';

var p = {

    config: require('./../config/modules.json'),

    generateConfig: function() {

    }

};

function ModulesService(){
}

ModulesService.prototype = {

    generateConfig: function() {
        return p.generateConfig();
    }

};

module.exports = ModulesService;