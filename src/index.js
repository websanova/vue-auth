import Auth from './auth.js';

function plugin(Vue, options) {
    var auth          = new Auth(Vue, options);
    
    var ready         = auth.ready,
        login         = auth.login,
        fetch         = auth.fetch,
        logout        = auth.logout,
        oauth2        = auth.oauth2,
        refresh       = auth.refresh,
        register      = auth.register,
        impersonate   = auth.impersonate,
        unimpersonate = auth.unimpersonate;

    Vue.auth = auth;

    Object.defineProperties(Vue.prototype, {
        $auth: {
            get: function () {
                auth.ready         = ready.bind(this);
                auth.login         = login.bind(this);
                // auth.fetch         = fetch.bind(this);
                // auth.logout        = logout.bind(this);
                // auth.oauth2        = oauth2.bind(this);
                // auth.refresh       = refresh.bind(this);
                // auth.register      = register.bind(this);
                // auth.impersonate   = impersonate.bind(this);
                // auth.unimpersonate = unimpersonate.bind(this);

                return auth;
            }
        }
    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export default plugin;














// var Auth = require('./auth.js')();

// module.exports = (function () {

//     return function install(Vue, options) {
        
//         var auth = new Auth(Vue, options);

//         var ready = auth.ready;
//         var login = auth.login;
//         var fetch = auth.fetch;
//         var logout = auth.logout;
//         var oauth2 = auth.oauth2;
//         var refresh = auth.refresh;
//         var register = auth.register;
//         var impersonate = auth.impersonate;
//         var unimpersonate = auth.unimpersonate;

//         Vue.auth = auth;

//         Object.defineProperties(Vue.prototype, {
//             $auth: {
//                 get: function () {
//                     auth.ready = ready.bind(this);
//                     auth.login = login.bind(this);
//                     auth.fetch = fetch.bind(this);
//                     auth.logout = logout.bind(this);
//                     auth.oauth2 = oauth2.bind(this);
//                     auth.refresh = refresh.bind(this);
//                     auth.register = register.bind(this);
//                     auth.impersonate = impersonate.bind(this);
//                     auth.unimpersonate = unimpersonate.bind(this);

//                     return auth;
//                 }
//             }
//         });
//     }
// })();