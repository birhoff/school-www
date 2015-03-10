var log4js = require('log4js');

var config = require('./config');

log4js.configure({
    appenders: [
        { type: config.logger.type, filename: config.logger.file, level: config.logger.level }
    ]
});

module.exports = log4js;
