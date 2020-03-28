module.exports = {
    lintOnSave: false,

    devServer: {
        port: process.env.DEV_PORT || 8080,

        https: process.env.DEV_HTTPS === 'false' ? false : true,
        
        disableHostCheck: true,

        host: process.env.DEV_HOST || '0.0.0.0',

        public: (process.env.DEV_HOST || '0.0.0.0') || + (process.env.DEV_PORT || 8080)
    },

    chainWebpack: (config) => {
        config
            .resolve
            .alias
            .set('@websanova/vue-auth', __dirname + '/../../');
    }
}