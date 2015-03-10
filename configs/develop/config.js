module.exports = {

    app: {
        env: 'development',

        debug: true,

        // новая версия при каждом перезапуске сервса в development режиме
        version: parseInt(Math.floor(Math.random() * 101))
    },

    static: {
        bundles: 'school-static/desktop.bundles'
    },

    logger: {
        type: 'console',
        file: '',
        level: 'DEBUG'
    }

};