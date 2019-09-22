function Auth() {

}


export default {

    // The install method will be called with the Vue constructor as the first argument, along with possible options
    install (Vue, options) {
        
        var auth = new Auth();

        // var ready = auth.ready;
        // var login = auth.login;
        // var fetch = auth.fetch;
        // var logout = auth.logout;
        // var oauth2 = auth.oauth2;
        // var refresh = auth.refresh;
        // var register = auth.register;
        // var impersonate = auth.impersonate;
        // var unimpersonate = auth.unimpersonate;

        Vue.auth = auth;

        Object.defineProperties(Vue.prototype, {
            $auth: {
                get: function () {
                    // auth.ready = ready.bind(this);
                    // auth.login = login.bind(this);
                    // auth.fetch = fetch.bind(this);
                    // auth.logout = logout.bind(this);
                    // auth.oauth2 = oauth2.bind(this);
                    // auth.refresh = refresh.bind(this);
                    // auth.register = register.bind(this);
                    // auth.impersonate = impersonate.bind(this);
                    // auth.unimpersonate = unimpersonate.bind(this);

                    return auth;
                }
            }
        });

        // ES6 way of const job = options.job
        // const { job } = options

        // // Add $plugin instance method directly to Vue components
        // Vue.prototype.$myInfo = (name, age) => info(name, age, job)

        // // Add $surname instance property directly to Vue components
        // Vue.prototype.$surname = 'Smith'
    }
};