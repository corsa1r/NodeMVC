"use strict";

class Model {
    
    constructor() {
        this.modelsPath = '../../../app/models/';
        this.cache = new Map();
    }
    
    get(name) {
        if(this.cache.has(name)) {
            return this.cache.get(name);
        }
        
        var model = require(this.modelsPath + name);
        this.cache.set(name, model);
        
        return model;
    }
    
}

module.exports = Model;