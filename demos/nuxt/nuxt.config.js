module.exports = {
    vendor: ['@websanova/vue-auth'],

    plugins: ['~plugins/vue-auth'],

    router: {
        middleware: 'auth'
    }
}