var _ = require('underscore');

module.exports = function (App) {

    var p = {

        builtServices: [],

        buildingServices: [],

        registeredServices: [],

        globalVars: {App: App},

        registerService: function (name, service, dependencies) {
            this.registeredServices.push(
                {
                    name: name,
                    service: service,
                    dependencies: dependencies
                }
            );
        },

        getService: function (name, copy) {

            var service = this.getServiceBuilt(name);

            if (typeof service == 'undefined' || !!copy) {
                service = this.buildService(name, copy);
            }
            return service;

        },

        getServiceBuilt: function (name, copy) {

            var service = _.find(this.builtServices, {name: name});

            if (_.isObject(service) && service.hasOwnProperty('service')) {
                service = service.service;
            }

            return service;
        },

        buildService: function (name) {
            var serviceConfig = this.getServiceConfig(name),
                args = [],
                service;

            if (!serviceConfig) {
                throw new Error("don't find the service " + name);
            }

            if (!!serviceConfig.dependencies && !!serviceConfig.dependencies.length) {
                for (var i in serviceConfig.dependencies) {

                    if (this.globalVars.hasOwnProperty(serviceConfig.dependencies[i])) {
                        args.push(this.globalVars[serviceConfig.dependencies[i]]);
                    } else {
                        args.push(this.getService(serviceConfig.dependencies[i]));
                    }

                }
            }

            return this.requireService(args, serviceConfig.service, name);
        },

        getServiceConfig: function (name) {
            return _.find(this.registeredServices, {name: name});
        },


        requireService: function (args, serviceInit, name) {

            var service = {};

            // see this line in IE 8 ( < ECMAScript 5 )
            //service = Object.create( serviceCode.prototype );
            service.__proto__ = serviceInit.prototype;
            serviceInit.apply(service, args);


            delete this.buildingServices[_.indexOf(this.buildingServices, name)];
            this.builtServices.push({service: service, name: name});

            return service;
        },

        listServices: function () {
            return _.pluck(this.registeredServices, 'name')
        },

        serviceExists: function(name){
            var service = _.find(this.registeredServices, {name: name});

            return (typeof service !== 'undefined');
        }

    };

    var container = {
        get: function (name, copy) {
            return p.getService(name, copy);
        },

        register: function (name, service, dependencies) {
            return p.registerService(name, service, dependencies);
        },

        list: function () {
            return p.listServices();
        },

        exists: function (name) {
            return p.serviceExists(name);
        }
    };


    App.container = container;
};
