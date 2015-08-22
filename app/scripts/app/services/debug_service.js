'use strict';

var p = {

    timings: {},

    init: function(config, persistService) {
        this.persistService = persistService;
    },

    setEnv: function(env) {
        this.env = env;
    },

    log: function() {

        if (this.env != 'prod' && !!console && !!console.log) {
            var _arguments = _.toArray(arguments);

            if ((typeof _arguments[0] == 'string')) {
                _arguments = [_arguments];
            }

            console.log.apply(console, _arguments[0]);
        }

    },

    table: function(table, output) {

        if (this.env != 'prod' && !!console && !!console.table) {
            console.table(table, output);
        }

    },

    error: function() {

        if (this.env != 'prod' && !!console && !!console.error) {
            var _arguments = _.toArray(arguments);

            if ((typeof _arguments[0] == 'string')) {
                _arguments = [_arguments];
            }

            console.error.apply(console, _arguments[0]);
        }

    },

    warn: function() {

        if (this.env != 'prod' && !!console && !!console.warn) {
            var _arguments = _.toArray(arguments);

            if ((typeof _arguments[0] == 'string')) {
                _arguments = [_arguments];
            }

            console.warn.apply(console, _arguments[0]);
        }

    },

    addStart: function(name, time) {
        this.timings[name] = {startTime: time};
    },

    start: function(name, override) {

        if (!this.timings[name] || (!!this.timings[name] && !!override)) {

            var startTime = new Date().getTime();

            this.timings[name] = {startTime: startTime};

        } else {
            this.warn('The timing name \'' + name + '\' already exists, while trying to start a timing.');
        }

    },

    end: function(name, override) {

        if (!!this.timings[name]) {

            if (!this.timings[name].endTime || (!!this.timings[name].endTime && !!override)) {
                this.timings[name].endTime = new Date().getTime();
                this.timings[name].time = this.calculateTiming(this.timings[name].startTime, this.timings[name].endTime);
            } else {
                this.warn('The timing name \'' + name + '\' is already finished, while trying to end a timing.');
            }

        } else {
            this.warn('The timing name \'' + name + '\' does not exists, while trying to end a timing.');
        }

    },

    getTiming: function(name) {

        if (!this.timings[name]) {
            this.warn('The timing name \'' + name + '\' does not exists, while trying to retrieve a timing.');
        } else {

            if (!this.timings[name].end) {
                this.end(name);
            }

            return this.timings[name].time;

        }

    },

    calculateTiming: function(start, end) {

        return end - start;

    },

    getTimings: function() {
        return this.timings;
    },

    persists: function() {

        var _arguments = _.toArray(arguments);

        if (!!this.persistService) {

            if (!!this.persistService.persists) {
                this.persistService.persist(_arguments);
            }

        }
    }

};

function DebugService(persistService) {

    this.persistService = persistService;

    this.init();
}

DebugService.prototype = {

    init: function() {
        p.init(this.persistService);
    },

    setEnv: function(env) {
        p.setEnv(env);
    },

    log: function() {
        return p.log(arguments);
    },

    table: function(table, output) {
        return p.table(table, output);
    },

    error: function() {
        return p.error(arguments);
    },

    warn: function() {
        return p.warn(arguments);
    },

    addStart: function(name, time) {
        p.addStart(name, time);
    },

    start: function(name, override) {
        p.start(name, override);
    },

    end: function(name, override) {
        p.end(name, override);
    },

    getTiming: function(name) {
        return p.getTiming(name);
    },

    getTimings: function() {
        return p.getTimings();
    },

    persist: function() {
        return p.persist(arguments);
    }

};

module.exports = DebugService;
