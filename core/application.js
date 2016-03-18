"use strict";

var DependencyInjector = require('./di/DependencyInjector');
var express = require('express');
var serverConfiguration = require('../app/config/server');
var databaseConfiguration = require('../app/config/database');
var Request = require('./modules/http/Request');
var Response = require('./modules/http/Response');
var RouteParser = require('./router/RouteParser');
var Params = require('./modules/http/Params');
var routes = require('../app/config/routes');
var View = require('./modules/renderers/view/View');
var moment = require('moment');
var mongoose = require('mongoose');
var Model = require('./modules/model/Model');
var Wait = require('./modules/wait/Wait');
var Get = require('./modules/http/get/Get');
var Post = require('./modules/http/post/Post');
var bodyParser = require('body-parser');


class Application {

    constructor() {
        this.modules = new Map();
        this.environments = new Map();
        this.environments.set('ENVIRONMENT', Application.ENVIRONMENT_DEFAULT);
        this.environments.set('DEBUG', true);

        this.expressApp = null;
    }

    /**
     * This method allows you to define application module,
     * which can be injected as dependency in any controler or module
     * 
     * @param {String} moduleName - this is the name of the module
     * @param [{Function}] moduleConstructor - this is the constructor of the module
     *  @see if moduleConstructor is not passed seach will be attempted
     * 
     * @return instance of defined/searched module
     */
    module(moduleName, moduleConstructor) {
        if (!moduleConstructor) {
            return this.modules.get(moduleName);
        }

        var injector = new DependencyInjector();
        var dependencies = injector.inject(moduleConstructor, this.modules);
        var wrapper = function(f, args, scope) {
            return function() {
                f.apply(scope, args);
            };
        };


        var instance = null;

        if (this.isClass(moduleConstructor)) {
            instance = new moduleConstructor();
            instance.$injected = {};
            for (let index in dependencies) {
                instance.$injected[dependencies[index].$$moduleName] = dependencies[index];
            }
        } else {
            instance = new (wrapper(moduleConstructor, dependencies, moduleConstructor));
        }

        instance.$$moduleName = moduleName;
        this.modules.set(moduleName, instance);
        return instance;
    }

    /**
     * This method check if given parameter is a ES6 class
     * 
     * @param {*} value
     * @return Boolean true if is a class false otherwise
     */
    isClass(value) {
        return this.isFunction(value) && /^\s*class\s+/.test(value.toString());
    }

    /**
     * This method check if given parameter is a valid callable function
     * 
     * @param {*} value
     * @return Boolean true if is a function false otherwise
     */
    isFunction(value) {
        return typeof value === 'function';
    }

    /**
     * This method boots the express server and attach request handler
     */
    boot() {
        this.expressApp = express();
        this.expressApp.listen(serverConfiguration.get('port'));
        
        this.expressApp.use(bodyParser.json()); // for parsing application/json
        this.expressApp.use(bodyParser.urlencoded({ extended: true })); // for parsing
        
        this.expressApp.all('*', (req, res) => { this.handleRequest(req, res) });
        this.expressApp.locals.moment = moment;
        this.expressApp.set('views', 'app/views/');
        this.expressApp.engine('jade', require('jade').__express);
        this.expressApp.set('view engine', 'jade');

        mongoose.connect('mongodb://' + databaseConfiguration.get('uri'));
    }

    /**
     * This method handles the request and parse the routes
     * 
     * @param {Request} req - this is node http request
     * @param {Response} res - this is node http response
     * 
     * If the controller method doesn't sends response headers, this method will send the result from the method.
     * If result isn't returned from the method, empty object as json will be send
     */
    handleRequest(req, res) {
        var routeParser = new RouteParser(req, res, routes);
        var result = routeParser.result();

        if (!result) {
            if (routes.$$notFoundRedirectTo) {
                res.redirect(routes.$$notFoundRedirectTo);
            } else {
                res.sendStatus(404);
            }

            return false;
        } else {
            this.module('$routeParams', Params).insert(result.params);
            this.module('$request', Request).setOrigin(req);
            this.module('$response', Response).setOrigin(res);
            this.module('$view', View);
            this.module('$model', Model);
            this.module('$wait', Wait);
            this.module('$get', Get).parse();
            this.module('$post', Post).parse();

            var injector = new DependencyInjector();
            var controller = require('../app/controllers/' + result.controller);
            var controllerInstance = new controller();

            if (!this.isFunction(controllerInstance[result.controllerMethod])) {
                throw new Error(`Cannot call method result.controllerMethod of undefined in ${result.controller}.`);
            }

            var dependencies = injector.inject(controllerInstance[result.controllerMethod], this.modules);
            var methodResult = controllerInstance[result.controllerMethod].apply(controllerInstance, dependencies);

            this.response(res, methodResult);
        }
    }

    response(res, methodResult, nested) {
        if (!res.headersSent) {
            if (methodResult instanceof View) {
                res.send(methodResult.parse());
                return;
            }

            if (methodResult instanceof Wait) {
                methodResult.start().then((waitResponse) => {
                    this.response(res, waitResponse, true);
                });
                return;
            }
        }
    }
}

/**
 * @static
 */
Application.ENVIRONMENT_DEVELOPMENT = 'development';
Application.ENVIRONMENT_PRODUCTION = 'production';
Application.ENVIRONMENT_TEST = 'test';

Application.ENVIRONMENT_DEFAULT = Application.ENVIRONMENT_DEFAULT;

/**
 * The application is singleton
 */
module.exports = new Application;
