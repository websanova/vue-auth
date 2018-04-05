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

* Must be an array of strings. For this to work both the checks need to be this way.
* The user must be logged in. Additionally the string or array will be checked against the users roles.
* Note that the users `roles` variable can be set in the options.

### auth: `Object`

* The user must be logged in and the object will be checked against the users roles.
* Note for this to work both the auth and user roles must both be objects.
* An object must also be used when using `$auth.check({some: 'name'})` where the value can be a `String` or `Array`.


## Default Redirects

There are three main global redirects in the plugin.

The can all be overridden during the plugin initialization.

### authRedirect: `{path: '/login'}`

Redirect to use if authentication is required on a route.

Basically if auth is set to anything other than `undefined` or `false`.

### forbiddenRedirect: `{path: '/403'}`

Redirect to use if route is forbidden.

Will trigger if the user object's role property does not match up with the auth value.

### notFoundRedirect: `{path: '/404'}`

Redirect to use if route is not found (set to `false`).

Typically used to hide pages while logged in. For instance we don't want the user to access a login, register page while they are authenticated.

So accessing it will be as if it's not there, hence a `404 Not Found`.


## Route Redirects

Each individual route can also define it's own specific redirect.

**NOTE:** If not set the redirects will still default to the global `authRedirect`, `forbiddenRedirect` and `notFoundRedirect`.

To set the `redirect` field the format of the `auth` parameter in the routes must change to the form below.

```
auth: {roles: 'admin', redirect: '/login'}
```

In this case `roles` will follow the same rules as `auth` would regularly and `redirect` will follow same rules for route provider.

There is also a secondary `redirectForbidden` field that can be set for situations where a user is logged in but privilege check fails.

```
auth: {roles: 'admin', redirect: '/admin/login', forbiddenRedirect: '/admin/403'}
```


## Comparing Roles

The following user `role` to `$auth.check` or `meta.auth` combinations should work.

Note: An `Array` of `String` can be compared with a `String` and an `Object` with an `Object`. But not an `Array` of `Object`.

```
'user' => 'user'
'user' => ['user']
['user'] => 'user'
{role: 'user'} => {role: 'user'}
{role: 'user'} => {role: ['user']}
{role: ['user']} => {role: 'user'}
```


## Examples

**Vue 1.x**

```javascript
Vue.router.map({
    '/admin': {
        auth: {
            roles: 'admin',
            redirect: {name: 'admin'},
            forbiddenRedirect: '/admin/403'
        },
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
        auth: {"people": "administrator", "products": "superadmin"},
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
        meta: {
            auth: {
                roles: 'admin',
                redirect: {name: 'admin'},
                forbiddenRedirect: '/admin/403'
            }
        },
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
        meta: {auth: {"people": "administrator", "products": "superadmin"}},
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