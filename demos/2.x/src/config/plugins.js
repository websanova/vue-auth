import Vue from 'vue'

import auth            from '@websanova/vue-auth/src/v2.js';
import authBearer      from '@websanova/vue-auth/src/drivers/auth/bearer.js';
import httpAxios       from '@websanova/vue-auth/src/drivers/http/axios.1.x.js';
// import httpVueResource from '@websanova/vue-auth/src/drivers/http/vue-resource.1.x.js';
import routerVueRouter from '@websanova/vue-auth/src/drivers/router/vue-router.2.x.js';
import oauth2Google    from '@websanova/vue-auth/src/drivers/oauth2/google.js';
import oauth2Facebook  from '@websanova/vue-auth/src/drivers/oauth2/facebook.js';

oauth2Google.params.client_id = '547886745924-4vrbhl09fr3t771drtupacct6f788566.apps.googleusercontent.com';
oauth2Facebook.params.client_id = '196729390739201';

Vue.use(auth, {
    plugins: {
        http: Vue.axios,
        router: Vue.router,
    },
    drivers: {
        auth: authBearer,
        http: httpAxios, // Axios
        // http: httpVueResource, // Vue Resource
        router: routerVueRouter,
    },
    rolesKey: 'type',
    notFoundRedirect: {name: 'user-account'},
    oauth2: {
        google: oauth2Google,
        facebook: oauth2Facebook,
    }
});