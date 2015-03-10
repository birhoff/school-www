var path = require('path'),
    extend = require('extend'),
    fs = require('fs');

var config = {},
    baseConfig = {
        path: {
            APP: path.resolve(__dirname, '../'),
            USER: path.resolve(__dirname, '../configs/current')
        }
    },
    userConfig = {};

var userConfigPath = path.join(baseConfig.path.USER, 'config.js');

if (fs.existsSync(userConfigPath)) {
    userConfig = require(userConfigPath);
}

extend(config, baseConfig, userConfig);

module.exports = config;