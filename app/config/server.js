var Configuration = require('../../core/configuration/Configuration');
var serverConfiguration = new Configuration();

/**
 * Configuration starts here
 */

/**
 * This is the express server port
 */
serverConfiguration.set('port', 3000);

/**
 * Configuration ends here
 */

module.exports = serverConfiguration;
