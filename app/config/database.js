var Configuration = require('../../core/configuration/Configuration');
var database = new Configuration();

/**
 * Configuration starts here
 */

/**
 * This is the express server port
 */
database.set('uri', 'localhost/node_mvc_test');//same as mongodb://localhost/node_mvc_test

/**
 * Configuration ends here
 */

module.exports = database;
