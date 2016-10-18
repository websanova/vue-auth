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
        path: '/admin',
        name: 'admin',
        component: require('./components/pages/Admin.vue'),
        meta: {auth: 'admin'}
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
    }]
});

// Http 
Vue.http.options.root = 'https://api-demo.websanova.com/api/v1';

// Vue Auth
Vue.use(require('../../src/index.js'), {
    rolesVar: 'role',
    facebookOauth2Data: {
        clientId: '196729390739201'
    },
    googleOauth2Data: {
        clientId: '337636458732-tatve7q4qo4gnpfcenbv3i47id4offbg.apps.googleusercontent.com'
    }
});

// Start
var component = require('./components/App.vue');

component.router = Vue.router;

new Vue(component).$mount('#app');