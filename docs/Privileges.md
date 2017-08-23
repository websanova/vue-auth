# Privileges

The `vue-auth` plugin works with the `vue-router` plugin. Setting an `auth` field in the router mapping section will set access to that route.


## Routing

### auth: `true`

* User must be authenticated (no roles are checked).

### auth: `false`

* If the user is logged in then this route will be unavailable. Useful for login/register type pages to be unaccessible once the user is logged in.

### auth: `undefined`

* Public, no checks required.

### auth: `Array` `String`

* The user must be logged in. Additionally the string or array will be checked against the users roles.
* Note that the users `roles` variable can be set in the options.

### auth: `Object`

* The user must be logged in and the object will be checked against the users roles.
* Note for this to work both the auth and user roles must both be objects.
* An object must also be used when using `$auth.check({some: 'name'})` where the value can be a `String` or `Array`.


## Examples

**Vue 1.x**

```javascript
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
```

**Vue 2.x**

```javascript
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
```