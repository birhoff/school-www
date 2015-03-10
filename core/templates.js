var vm = require('vm'),
    vow = require('vow'),
    path = require('path'),
    fs = require('vow-fs');

var config = require('./config'),
    logger = require('./logger').getLogger('core');

var BUNDLES_PATH = path.join(config.path.APP, config.static.bundles);

var Templates = function() {
    this._ready = false;

    this.bundles = {};
};

Templates.prototype.init = function() {
    var self = this;

    return new vow.Promise(function(resolve, reject) {
        fs.listDir(BUNDLES_PATH)
            .then(function(bundles) {
                vow.all(bundles.map(function(bundleName) {
                    return self._initBundle(bundleName);
                })).then(function() {
                    self._ready = true;
                    logger.debug('Templates initialized.');
                    resolve(self);
                }).fail(function(error) {
                    logger.error('Failed to init bundles., with err: ', error);
                    reject(error);
                })
            }).fail(function(error) {
                logger.error('Failed to read bundles at %s, with err: %s', BUNDLES_PATH, error);
                reject(error);
            })
    });
};

Templates.prototype._initBundle = function(name) {
    var self = this;

    return new vow.Promise(function(resolve, reject) {
        var bundlePath = path.join(BUNDLES_PATH, name),
            bemtreePath = path.join(bundlePath, name + '.bemtree.js'),
            bemhtmlPath = path.join(bundlePath, name + '.bemhtml.js');

        vow.all({
            bemtree: fs.read(bemtreePath, 'utf8'),
            bemhtml: fs.read(bemhtmlPath, 'utf8')
        }).then(function(templates) {
            // контекст для инициализации bemtree
            var bemtreeCtx = {
                Vow: vow,
                console: console
            };

            // контекст для инициализации bemhtml
            var bemhtmlCtx = vm.createContext({
                BEMHTML: '',
                console: console
            });

            self.bundles[name] = {};

            // инициализируем bemtree
            self.bundles[name].bemtree = self._runInContext(templates.bemtree, bemtreeCtx).BEMTREE;

            // инициализируем bemhtml
            self.bundles[name].bemhtml = self._runInContext(templates.bemhtml, bemhtmlCtx).BEMHTML;

            resolve(self.bundles[name]);
        }).fail(function(err) {
            logger.error('Failed to read template: %s', err);
            reject(err);
        });
    })
};

Templates.prototype._runInContext = function runInContext(src, ctx) {
    vm.runInNewContext(src, ctx);
    return ctx;
};

module.exports = new Templates();
