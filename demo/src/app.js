import App from './components/App.vue';

// Router
Vue.router = new VueRouter({
    hashbang: false,
    history: true,
    linkActiveClass: 'active',
    mode: 'html5'
});

Vue.router.map({
    '/': {
        name: 'default',
        component: require('./components/pages/Home.vue')
    },
    '/login': {
        auth: false,
        name: 'login',
        component: require('./components/pages/Login.vue')
    },
    '/login/:type': {
        name: 'oauth2-type',
        component: require('./components/pages/Oauth2.vue')
    },
    '/register': {
        auth: false,
        name: 'register',
        component: require('./components/pages/Register.vue')
    },
    '/oauth1': {
        name: 'oauth1',
        component: require('./components/pages/Oauth1.vue')
    },
    '/oauth2': {
        name: 'oauth2',
        component: require('./components/pages/Oauth2.vue')
    },
    '/account': {
        auth: true,
        name: 'account',
        component: require('./components/pages/Account.vue')
    },
    '/admin': {
        auth: 'admin',
        name: 'admin',
        component: require('./components/pages/Admin.vue')
    },
    '/users': {
        auth: ['admin'],
        name: 'users',
        component: require('./components/pages/Users.vue')
    },
    '/404': {
        name: 'error-404',
        component: require('./components/pages/404.vue')
    },
    '/403': {
        name: 'error-403',
        component: require('./components/pages/403.vue')
    }
});

// Http 
Vue.http.options.root = 'https://hs.plugins.api.laravel.com/api/v1';

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
Vue.router.start(App, '#app');