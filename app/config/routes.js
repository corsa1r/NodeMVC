var RouteConfiguration = require('../../core/configuration/RouteConfiguration');
var Router = new RouteConfiguration();

/**
 * start
 */

Router.get('/', 'HomeController@index');

Router.get('/user/{id}', 'HomeController@user');
Router.get('/users', 'HomeController@users');

Router.post('/user/new', 'HomeController@store');
Router.post('/user/{id}', 'HomeController@delete');

//Router.notFoundRedirectTo('/');

/**
 * end
 */
module.exports = Router;