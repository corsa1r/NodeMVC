"use strict";

var q = require('q');

class Wait {
    
    constructor() {
        this.callback = null;
        this.deferred = null;
    }
    
    start() {
        this.deferred = q.defer();
        return this.deferred.promise;
    }
    
    stop(response) {
        this.deferred.resolve(response);
    }
}

module.exports = Wait;