var vow = require('vow');

var logger = require('./logger').getLogger('core'),
    templates = require('./templates');

var Core = function() {

};

Core.prototype.init = function() {
    var self = this;

    return new vow.Promise(function(resolve, reject) {
        vow.all([
            templates.init()
        ]).done(function(result) {
            logger.info('Core Modules initialized.')
        }, function(err) {
            logger.error('Failed to init base modules: ', err);
            reject(err);
        });
    });
};

module.exports = (new Core()).init();
