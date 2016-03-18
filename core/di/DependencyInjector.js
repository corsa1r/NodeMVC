"use strict";

var application = require('../application');
var DependencyAnalizator = require('./DependencyAnalizator');

class DependencyInjector {

    inject(methodConstructor, modules) {
        var analizator = new DependencyAnalizator();
        var deps = analizator.analize(methodConstructor);
        var instances = [];

        for (let index = 0, len = deps.length; index < len; index++) {
            if (modules.has(deps[index])) {
                instances.push(modules.get(deps[index]));
            } else {
                var message = `Cannot find module with name ${deps[index]}.`;
                throw new Error(message);
            }
        }

        return instances;
    }
}

module.exports = DependencyInjector;