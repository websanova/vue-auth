import Auth from './auth.js';

function plugin(Vue, options) {
    Vue.auth = new Auth(Vue, options);

    Object.defineProperties(Vue.prototype, {
        $auth: {
            get: function () {
                return Vue.auth;
            }
        }
    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export default plugin;