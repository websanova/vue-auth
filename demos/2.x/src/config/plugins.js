import Vue from 'vue'

// Vue-Auth
import auth            from '@websanova/vue-auth';
import authBearer      from '@websanova/vue-auth/drivers/auth/bearer.js';
import httpVueResource from '@websanova/vue-auth/drivers/http/vue-resource.1.x.js';
import routerVueRouter from '@websanova/vue-auth/drivers/router/vue-router.2.x.js';

Vue.use(auth, {
    auth: authBearer,
    http: httpVueResource,
    router: routerVueRouter,
    rolesVar: 'type',
    // facebookOauth2Data: {
    //     clientId: process.env.VUE_APP_FACEBOOK_CLIENT_ID
    // },
    // googleOauth2Data: {
    //     clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID
    // }
});