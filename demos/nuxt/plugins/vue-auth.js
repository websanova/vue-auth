import Vue from 'vue';
import VueAuth from '@websanova/vue-auth';

import axios from 'axios';
import VueAxios from 'vue-axios';

export default (ctx) => {
  Vue.use(VueAxios, axios);
  Vue.axios.defaults.baseURL = 'https://api-demo.websanova.com/api/v1';
  Vue.router = ctx.app.router;

  if (process.server) {
    if (!Vue.prototype.$auth) {
      let auth = {};
      Object.defineProperties(Vue.prototype, {
        $auth: {
            get: function () {
                auth.ready = () => true;
                auth.login = () => null;
                auth.fetch = () => null;
                auth.logout = () => null;
                auth.oauth2 = () => null;
                auth.refresh = () => null;
                auth.register = () => null;
                auth.impersonate = () => null;
                auth.unimpersonate = () => null;

                return auth;
            }
        }
      });
    }

    return;
  }

  Vue.use(VueAuth, {
    auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
    // http: require('@websanova/vue-auth/drivers/http/vue-resource.1.x.js'),
    http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
    rolesVar: 'role',
    facebookOauth2Data: {
      clientId: '196729390739201'
    },
    googleOauth2Data: {
      clientId: '337636458732-tatve7q4qo4gnpfcenbv3i47id4offbg.apps.googleusercontent.com'
    }
  });
}