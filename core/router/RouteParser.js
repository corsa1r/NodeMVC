"use strict";

class RouteParser {

    constructor(req, res, routes) {
        this.req = req;
        this.res = res;
        this.routes = routes;
        this.params = new Map();
        this.parsedResult = null;
        this.parse();
    }

    parse() {
        var path = this.req.originalUrl.split('?').shift();
        var found = false;

        this.routes.find(this.req.method).forEach((route) => {
            if (this.len(path) === this.len(route.path) && !found) {
                if (this.compare(this.format(path), this.format(route.path))) {
                    found = true;
                    this.parsedResult = route;
                }
            }
        });

        if (found) {
            this.parsedResult.params = this.params
        }
    }

    format(pattern) {
        return pattern.split('/');
    }

    len(pattern) {
        return this.format(pattern).length;
    }

    compare(path, route) {
        var matches = 0;

        for (let x = 0, len = path.length; x < len; x++) {
            if (route[x].substr(0, 1) === '{' && route[x].substr(-1, 1) === '}') {
                if (path[x]) {
                    this.params[route[x].substring(1, route[x].length - 1)] = path[x];
                }
                matches++;
            } else if (path[x] === route[x]) {
                matches++;
            }
        }

        return matches === path.length;
    }

    result() {
        return this.parsedResult;
    }
}

module.exports = RouteParser;