var Auth = require('./auth.js')();

module.exports = (function () {

    return function install(Vue, options) {
        // var auth,
        //     driver = require('./drivers/vue.1.0.0.js')

        //     driver.Vue = Vue;

        // auth = new Auth(options, driver);
        
        // options = options || {};

        // console.log(options.Vue);

        var auth = new Auth(Vue, options);

        var login = auth.login;
        var fetch = auth.fetch;
        var logout = auth.logout;
        var oauth2 = auth.oauth2;
        var refresh = auth.refresh;
        var register = auth.register;
        var loginOther = auth.loginOther;
        var logoutOther = auth.logoutOther;

        Object.defineProperties(Vue.prototype, {
            $auth: {
                get: function () {
                    auth.login = login.bind(this);
                    auth.fetch = fetch.bind(this);
                    auth.logout = logout.bind(this);
                    auth.oauth2 = oauth2.bind(this);
                    auth.refresh = refresh.bind(this);
                    auth.register = register.bind(this);
                    auth.loginOther = loginOther.bind(this);
                    auth.logoutOther = logoutOther.bind(this);

                    return auth;
                }
            }
        });
    }
})();