import App from './components/App.vue';

// Router
Vue.router = new VueRouter({
    hashbang: false,
    linkActiveClass: 'active',
    mode: 'history',
    base: __dirname,
    routes: [{
        path: '/',
        name: 'default',
        component: require('./components/pages/Home.vue')
    }, {
        path: '/login',
        name: 'login',
        component: require('./components/pages/Login.vue'),
        meta: {auth: false}
    }, {
        path: '/login/:type',
        name: 'oauth2-type',
        component: require('./components/pages/Oauth2.vue')
    }, {
        path: '/register',
        name: 'register',
        component: require('./components/pages/Register.vue'),
        meta: {auth: false}
    }, {
        path: '/oauth1',
        name: 'oauth1',
        component: require('./components/pages/Oauth1.vue')
    }, {
        path: '/oauth2',
        name: 'oauth2',
        component: require('./components/pages/Oauth2.vue')
    }, {
        path: '/account',
        name: 'account',
        component: require('./components/pages/Account.vue'),
        meta: {auth: true}
    }, {
        path: '/async',
        name: 'async',
        component: function(resolve) { require(['./components/pages/Async.vue'], resolve); }
    }, {
        path: '/admin',
        name: 'admin',
        component: require('./components/pages/Admin.vue'),
        meta: {auth: {roles: 'admin', redirect: {name: 'default'}, forbiddenRedirect: '/403'}},
        children: [{
            path: 'products',
            name: 'admin-products',
            component: require('./components/pages/admin/Products.vue'),
            children: [{
                path: ':product_id',
                name: 'admin-product',
                component: require('./components/pages/admin/Product.vue'),
                children: [{
                    path: 'info',
                    name: 'admin-product-info',
                    component: require('./components/pages/admin/ProductInfo.vue'),
                    meta: {auth: undefined}
                }, {
                    path: 'media',
                    name: 'admin-product-media',
                    component: require('./components/pages/admin/ProductMedia.vue')
                }]
            }]
        }]
    }, {
        path: '/users',
        name: 'users',
        component: require('./components/pages/Users.vue'),
        meta: {auth: ['admin']}
    }, {
        path: '/404',
        name: 'error-404',
        component: require('./components/pages/404.vue')
    }, {
        path: '/403',
        name: 'error-403',
        component: require('./components/pages/403.vue')
    }, {
        path: '/502',
        name: 'error-502',
        component: require('./components/pages/502.vue')
    }]
});

// import axios from 'axios';
// import VueAxios from 'vue-axios';
// Vue.use(VueAxios, axios);
// Vue.axios.defaults.baseURL = 'https://api-demo.websanova.com/api/v1';

// Http 
Vue.http.options.root = 'https://api-demo.websanova.com/api/v1';

// Vue Auth
Vue.use(require('../../../src/index.js'), {
    auth: require('../../../drivers/auth/bearer.js'),
    http: require('../../../drivers/http/vue-resource.1.x.js'),
    // http: require('../../../drivers/http/axios.1.x.js'),
    router: require('../../../drivers/router/vue-router.2.x.js'),
    rolesVar: 'role',
    facebookOauth2Data: {
        clientId: '196729390739201'
    },
    googleOauth2Data: {
        clientId: '547886745924-4vrbhl09fr3t771drtupacct6f788566.apps.googleusercontent.com'
    }
});

// Start
var component = require('./components/App.vue');

component.router = Vue.router;

new Vue(component).$mount('#app');