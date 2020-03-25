module.exports = {
    devServer: {
        port: process.env.DEV_PORT || 8080,

        https: process.env.DEV_HTTPS === 'true' ? true : false,
        
        disableHostCheck: true,

        host: process.env.DEV_HOST || '0.0.0.0',
    },

    chainWebpack: (config) => {
        // config
        //     .resolve
        //     .alias
        //     .set('APP', __dirname + '/src/app')
        //     .set('LIB', __dirname + '/src/lib')
        //     .set('ROOT', __dirname + '/')
        // ;
    }
}