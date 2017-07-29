# Privileges

The `vue-auth` plugin works with the `vue-router` plugin. Setting an `auth` field in the router mapping section will set access to that route.

**Vue 1.x**

~~~
Vue.router.map({
    '/admin': {
        auth: 'admin',
        component: require('./Admin')
    },
    '/manage': {
        auth: ['admin', 'manager'],
        component: require('./Manage')
    },
    '/account': {
        auth: true,
        component: require('./Account')
    },
    '/private': {
        auth: [{"people": "administrator", "people": "superadmin"}],
        component: require('./Account')
    },
    '/login': {
        auth: false,
        component: require('./Login')
    },
    '/contact': {
        component: require('./Contact')
    }
});
~~~

**Vue 2.x**

~~~
Vue.router = new VueRouter({
    routes: [{
        path: '/admin',
        meta: {auth: 'admin'},
        component: require('./Admin')
    }, {
        path: '/manage',
        meta: {auth: ['admin', 'manager']},
        component: require('./Manage')
    }, {
        path: '/account',
        meta: {auth: true},
        component: require('./Account')
    }, {
        path: '/private',
        meta: {auth: [{"people": "administrator", "people": "superadmin"}]},
        component: require('./Account')
    }, {
        path: '/login',
        meta: {auth: false},
        component: require('./Login')
    }, {
        path: '/contact',
        component: require('./Contact')
    }]
});
~~~