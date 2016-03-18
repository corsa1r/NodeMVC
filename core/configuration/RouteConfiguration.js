"use strict";

var Configuration = require('./Configuration');
var RoutePath = require('../router/RoutePath');

class RouteConfiguration extends Configuration {

    constructor() {
        super();
        
        this.$$notFoundRedirectTo = null;
    }

    get(path, controllerPattern) {
        this.$$register('GET', path, controllerPattern);
    }

    post(path, controllerPattern) {
        this.$$register('POST', path, controllerPattern);
    }

    put(path, controllerPattern) {
        this.$$register('PUT', path, controllerPattern);
    }

    delete(path, controllerPattern) {
        this.$$register('DELETE', path, controllerPattern);
    }
    
    notFoundRedirectTo(path) {
        this.$$notFoundRedirectTo = path;
    }
    
    find(method) {
        if(super.get(method)) {
            return super.get(method);
        }
        
        return new Configuration();//empty
    }

    $$register(method, path, controllerPattern) {
        if (!super.get(method)) {
            super.set(method, new Set());
        }

        super.get(method).add(new RoutePath(path, controllerPattern));
    }
}

module.exports = RouteConfiguration;