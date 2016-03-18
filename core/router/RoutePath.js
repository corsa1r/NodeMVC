"use strict";

class RoutePath {

    constructor(path, controllerPattern) {
        this.path = null;
        this.controller = null;
        this.controllerMethod = null;

        this.setPath(path);
        this.setController(controllerPattern);
        this.setControllerMethod(controllerPattern);
    }

    setPath(path) {
        if (!path) {
            throw new Error('Invalid path for RoutePath class.');
        }

        this.path = path;
    }

    setController(controllerPattern) {
        this.controller = this.parsePattern(controllerPattern).shift();
    }

    setControllerMethod(controllerPattern) {
        this.controllerMethod = this.parsePattern(controllerPattern).pop();
    }

    parsePattern(controllerPattern) {
        var errorMessage = `Invalid controller pattern (${controllerPattern}). Expected example ControllerName@methodName`;
        
        if(!controllerPattern) {
            throw new Error(errorMessage);
        }
        
        var controllerPatternExp = controllerPattern.split('@');

        if (controllerPatternExp.length !== 2) {
            throw new Error(errorMessage);
        }

        return controllerPatternExp;
    }
}

module.exports = RoutePath;