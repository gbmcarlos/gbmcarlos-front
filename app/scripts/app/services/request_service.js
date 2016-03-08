'use strict';

var p = {

    connections: [],

    setConfig: function (config) {
        this.config = config;
    },

    setPrefs: function (prefs) {
        this.prefs = prefs;
    },

    getProducts: function(request) {
        if (this.isConnected()) {
            this.deleteConnections();
        }

        return this.createConnection(request);
    },

    createConnection: function (request) {

        var deferred = $.Deferred();

        var connection = $.ajax({
            url: this.config.urls.api + '/' + this.config.version + '/' + this.config.endpoint,
            type: 'GET',
            dataType: 'json',
            data: request,
            timeout: this.prefs.timeout
        }).done(_.bind(function (results, textStatus) {

            this.deleteConnections();
            deferred.resolve(results, textStatus);

        }, this)).fail(function(jqXHR, textStatus, errorThrown) {

            deferred.resolve(jqXHR, textStatus, errorThrown);

        });

        this.addConnection(connection);

        return deferred.promise();

    },

    addConnection: function(promise) {
        this.connections.push(promise);
    },

    deleteConnections: function() {
        _.each(this.connections, function(connection) {
            connection.abort();
        });

        this.connections = [];
    },

    isConnected: function() {
        return this.connections.length > 0;
    }

};

function RequestService(configService) {

    this.request = {
        locale: 'id-ID',
        env: 'dev',
        quantity: 15,
        page: 1

    };

    this.sort = {
        sortby: 3,
        direction: -1
    };

    this.configService = configService;
;
    this.setConfig();
    this.init();

}

RequestService.prototype = {

    setLocale: function(locale) {
        if (!!locale) {
            this.request.locale = locale;
        }
    },
    
    setSort: function(sort) {
        this.sort = sort;
        this.request.sortby = sort.sortby;

        if (!!sort.direction) {
            this.request.direction = sort.direction;
        }
    },

    getSortBy: function() {
        return this.sort.sortby;
    },

    getFilter: function() {
        return this.request.filter || 'ALL';
    },

    getCategory: function() {

        var self = this;

        var category = _.findKey(this.config.siteConfig.categories, function(_category) {
            return _category == self.getCategoryDefinition();
        });

        return category;
    },

    getCategoryDefinition: function() {

        var self = this;

        var categoryDefinition = _.findWhere(this.config.siteConfig.categories, {filter: self.getFilter()});

        return categoryDefinition;
    },

    setPage: function (page) {
        if (!!page) {
            this.request.page = page;
        }

        return this;
    },

    getPage: function() {
        return this.request.page;
    },

    setFilter: function (filter) {
        if (!!filter) {
            if (filter == 'ALL') {
                delete this.request.filter;
            } else {
                this.request.filter = filter;
            }
        }

        return this;
    },

    setCompany: function (company) {
        if (!!company) {
            this.request.company = company;
        }

        return this;
    },

    setConfig: function () {
        this.config = this.configService.getConfig();
        this.prefs = this.configService.getPrefs();
    },

    init: function () {
        p.setConfig(this.config);
        p.setPrefs(this.prefs);
    },

    getProducts: function () {

        p.getProducts(this.request).done(_.bind(this.triggerEvents, this));

    },

    triggerEvents: function(results, textStatus) {

        if (textStatus == 'success') {
            App.trigger('products:loaded', results);
        } else if (textStatus != 'abort') {
            App.trigger('products:error');
        }
    }

};

module.exports = RequestService;