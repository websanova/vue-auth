# Vue Auth

Vue.js token based authentication plugin. Supports simple token based and JSON Web Tokens (JWT) authentication.

Note this is the new name for the formerly named `vue-jwt-auth`. Since it's likely this package will expand with potentially more authentication options.

* [Install](https://github.com/websanova/vue-auth#install)
* [Demo](https://github.com/websanova/vue-auth#demo)
* [Privileges](https://github.com/websanova/vue-auth#privileges)
* [Routes](https://github.com/websanova/vue-auth#routes)
* [Methods](https://github.com/websanova/vue-auth#methods)
* [Options](https://github.com/websanova/vue-auth#options)
* [Driver Options](https://github.com/websanova/vue-auth#driver-options)
* [Change Log](https://github.com/websanova/vue-auth#change-log)



### Tested with


* vue 1.0.26
* vue-resource 1.0.2
* vue-router 0.7.13

Early support for Vue 2.0 is now available also but may still be a bit unstable due to many changes in the api. Please let me know of any issues you may find.


## Notes

* There is a ton of changes in the `v1.0.0-dev` version, check the change log below.
* Because the changes are quite different a `v1.0.0` version has been started, however it is still very much in dev mode.
* The changes are mostly non breaking but there will be potentially a few (check change log).



## Install

~~~
> sudo npm install @websanova/vue-auth
~~~    

~~~
Vue.use(require('@websanova/vue-auth'), {
    rolesVar: 'type'
});
~~~

**NOTE:** If you do not set your router as `Vue.router = new VueRouter()` then you will need to feed the `router` in directly through the options. Also true for `http`.

~~~
var router = new VueRouter();
Vue.use(Auth, {
    router: router,
    http: http
});
~~~



## Demo

To run the front end part of the demo just install and run. The demo runs on a publicly available server so just the front end needs run.

* Demo server available publicly at https://api-demo.websanova.com
* Demo server on GitHub https://github.com/websanova/laravel-api-demo
* Change the http options root in the `app.js` demo file to a different server for personal testing.

~~~
> sudo npm install
> sudo npm run 1.x.demo
> sudo npm run 2.x.demo
~~~

Note: For Vue 2 demo there is a separate package.json. Unfortunately there is no really great way to run both at the same time.


If a different path is required it must be set in the `demo/app.js` file.

To run the build:

~~~
> sudo webpack
~~~



## Privileges

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

**Vue 1.x**

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


## Routes

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




## Methods

These are all methods available in the vue app via `$auth`.

* All `success` and `error` functions will receive proper context from currently called component.

### ready

* Fires once on the initial app load to pre-load users (if set).

~~~
<div v-if="$auth.ready()">
    <vue-router></vue-router>
</div>
<div v-if="!$auth.ready()">
    Site loading...
</div>
~~~

### user

* Returns the currently stored users data.

~~~
<div>
    {{ $auth.user().email }}
</div>
~~~

### check

* Check to see if the user is logged in.
* It also accepts arguments to check for a specific role or set of roles.

~~~
<a v-if="!$auth.check()" v-link="'/login'">login</a>
<a v-if="$auth.check('admin')">admin</a>
<a v-if="$auth.check(['admin', 'manager')]">manage</a>
<a v-if="$auth.check()" v-on:click="$auth.logout()">logout</a>
~~~

### other

* Checks if secondary "other" user is logged in.

~~~
<a v-if="$auth.other()" v-on:click="logoutOther()">logout other</a>
~~~

### disableOther

* Disables other using the default token until it is re-enabled (or logged out).
* This allows you to login is as "another" user but still perform requests as an admin.

~~~
this.$auth.disableOther();

this.$http.get('users'); // Will run as admin.

this.$auth.enableOther();
~~~

### enableOther

* See disableOther.

### token

* Returns the currently activated token if none are specified.
* Can also specify a specific token, but only `other` and `default` will actually return anything.

~~~
var token = this.$auth.token();
var token = this.$auth.token('other');
var token = this.$auth.token('default');
~~~

### fetch

* Fetch the user (again) allowing the users data to be reset (from the api).
* Data object is passed directly to http method.

~~~
this.$auth.fetch({
    params: {},
    success: function () {},
    error: function () {},
    // etc...
});
~~~

### refresh

* Manually refresh the token.
* The refresh will always fire on boot, to disable this override the `expiredToken` option method.
* Can be used in conjunction with `expiredToken` and `token` to write custom refreshes.
* If any custom expiration custom logic needs to be done (for instance decoding and checking expiration date in jwt token) override the `expiredToken` method and return `boolean`.
* Data object is passed directly to http method.

~~~
this.$auth.refresh({
    params: {},
    success: function () {},
    error: function () {},
    // etc...
});
~~~

### register

* Convenience method for registration.
* Data object is passed directly to http method.
* Accepts `autoLogin` parameter to attempt login directly after register.
* Accepts `rememberMe` parameter when used in conjunction with `autoLogin` equal to `true`.
* Accepts `redirect` parameter which is passed directly to router.

~~~
this.$auth.register({
    params: {},
    success: function () {},
    error: function () {},
    autoLogin: true,
    rememberMe: true,
    redirect: {name: 'account'},
    // etc...
});
~~~

### login

* Data object is passed directly to http method.
* Accepts `rememberMe` parameter.
* Accepts `redirect` parameter which is passed directly to router.

~~~
this.$auth.login({
    params: {},
    success: function () {},
    error: function () {},
    rememberMe: true,
    redirect: '/account',
    // etc...
});
~~~

### logout

* Data object is passed directly to http method.
* Accepts `redirect` parameter which is passed directly to router.
* Accepts `makeRequest` parameter which must be set to `true` to send request to api. Otherwise the logout just happens locally by deleting tokens.

~~~
this.$auth.logout({
    makeRequest: true,
    params: {},
    success: function () {},
    error: function () {},
    redirect: '/login',
    // etc...
});
~~~

### loginOther

* Data object is passed directly to http method.
* Accepts `redirect` parameter which is passed directly to router.

~~~
this.$auth.loginOther({
    params: {},
    success: function () {},
    error: function () {},
    redirect: {name: 'account'},
    // etc...
});
~~~

### logoutOther

* Data object is passed directly to http method.
* Accepts `redirect` parameter which is passed directly to router.
* Also accepts `makeRequest` parameter same as `logout` method.

~~~
this.$auth.logoutOther({
    makeRequest: true,
    params: {},
    success: function () {},
    error: function () {},
    redirect: {path: '/admin'},
    // etc...
});
~~~

### oauth2

* Convenience method for OAuth2.
* Initial request is to third party.
* Second call is to api server.
* Accepts `code` parameter which should be set to `true` when the code is set.
* Accepts `provider` parameter which hooks into data for third party.
* Third party data should follow format such as `facebookData`, `facebookOath2Data`. Check options section for more info.
* Accepts `redirect` parameter which is passed directly to router.

~~~
if (this.$route.query.code) {
    this.$auth.oauth2({
        code: true,
        provider: 'facebook',
        params: {
            code: this.code
        },
        success: function(res) {},
        error: function (res) {}
        redirect: {path: '/account'},
        // etc
    });
}
else {
    this.$auth.oauth2({
        provider: 'facebook'
    });
}
~~~



## Options

Pretty much all methods are overrideable now in case there any specific issues with a particular version of Vue.

### token: `[{request: 'Authorization', response: 'Authorization', authType: 'bearer', foundIn: 'header'}, {request: 'token', response: 'token', authType: 'bearer', foundIn: 'response'}]`

* Set of method for fetching the token from the response. It will attempt each until a token is found and stop there.
* For sending requests it will by default use the method in the first position.

### tokenName: `'auth-token'`

* The name of the token stored in local storage.

### rolesVar: `'roles'`

* Name of roles var in user object.

### authRedirect: `{path: '/login'}`

* Redirect to use if authentication is required on a route.

### forbiddenRedirect: `{path: '/403'}`

* Redirect to use if route is forbidden.

### notFoundRedirect: `{path: '/404'}`

* Redirect to use if route is not found (set the `false`).

### registerData: `{url: 'auth/register', method: 'POST', redirect: '/login'}`

* Default register request data and redirect.

### loginData: `{url: 'auth/login', method: 'POST', redirect: '/'}`

* Default login request data and redirect.

### logoutData: `{url: 'auth/logout', method: 'POST', redirect: '/', makeRequest: false}`

* Default logout request data and redirect.
* This request is only made if `makeRequest` is set to true.

### oauth1Data: `{url: 'auth/login', method: 'POST'}`

* Default oauth1 request data and redirect.

### fetchData: `{url: 'auth/user', method: 'GET'}`

* Default user fetch request data and redirect.

### refreshData: `{url: 'auth/refresh', method: 'GET', atInit: true}`

* Default refresh request data and redirect.

### loginOtherData: `{url: 'auth/login-other', method: 'POST', redirect: '/'}`

* Default login as "other" request data and redirect.

### logoutOtherData: `{url: 'auth/logout-other', method: 'POST', redirect: '/admin', makeRequest: false}`

* Default logout as "other" request data and redirect.

### facebookData: `{url: 'auth/facebook', method: 'POST', redirect: '/'}`

* Default  request data and redirect.

### googleData: `{url: 'auth/google', method: 'POST', redirect: '/'}`

* Default  request data and redirect.

### facebookOauth2Data: `{url: 'https://www.facebook.com/v2.5/dialog/oauth', redirect: function () { return this.options.getUrl() + '/login/facebook'; }, clientId: '', scope: 'email'}`

* Default oauth2 data that ships with plugin.
* These can be overridden when calling `oauth2()` method or in the plugin options on init.

### googleOauth2Data: `{url: 'https://accounts.google.com/o/oauth2/auth', redirect: function () { return this.options.getUrl() + '/login/google'; }, clientId: '', scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'}`

* Same as facebookOauth2Data.

### getUrl: `_getUrl`

* Returns the current sites url for use in oauth2 redirects back to the site.

### cookieDomain: `_cookieDomain`

* Set the cookie domain used for `rememberMe` option.

### parseUserData: `_parseUserData`

* Set what data is stored from the user from the response data.

### tokenExpired: `_tokenExpired`

* Hook for checking if a token refresh should occur or not. Set this to return `false` when creating a custom solution.

### check: `_check`

* Function used during `check` method. 



## Driver Options

These are all function related directly to Vue that sort of acts like a driver. It makes it easier to deal with incompatibilities between Vue versions.

* `_init`
* `_bind`
* `_watch`
* `_getHeaders`
* `_setHeaders`
* `_bindData`
* `_interceptor`
* `_beforeEach`
* `_invalidToken`
* `_routerReplace`
* `_routerGo`
* `_httpData`
* `_http`



## Change Log

### v1.3.x-beta

* Add support for sub route `auth` matching via parent in Vue 2.


### v1.2.x-beta

* Token parameters now accept `request` and `response` params instead of `name`.
* Support for Vue 2 `auth` in `meta` of route.


### v1.0.x-dev

* Module renamed to `vue-auth` from `vue-jwt-auth`.
* Package name is scoped through `@websanova/vue-auth` now.
* Added demo with lots of sample code.
* Added demo server (https://api-demo.websanova.com) available on GitHub (https://github.com/websanova/laravel-api-demo).
* Any default data for a request is an object now that goes directly into the `http` method. So it can be called with whatever parameters the method supports.
* All `success` and `error` functions will contain proper context from Vue component.
* Redirects can be objects now, so you can do a redirect as a `/path` or `{name: 'object'}` etc.
* There is now a new `register` call with the option to auto login on success.
* The `auth` parameter in routes and the `check()` method now support objects for checking more complicated roles.
* Better handling for invalid tokens.
* All functions are overrideable now.
* There is a driver file for vue which supports the binding between the plugin and framework. This allows multiple drivers and overrides for any issues between versions in the future and allows full backward compatability.
* Reverted from using Vue in the base code and just went back to regular JavaScript (was not really a good idea).
* Any functions, fields parameters that involve logging in a secondary user are called `other` now.
* Actions can now be performed as "admin" user when logged in as "other" user by using `disabledOther` and `enableOther`.
* The `login`, `oauth2`, etc all have their own default parameters now.
* Removed `google` and `facebook` functions just use `oauth2` method now.
* The `logout` method can now perform an api request if `makdeRequest` is set to true.
* Switch to Vanilla JavaScriipt (for development). Had some issues with using fancy es6 syntax.
* Support for drivers allowing more flexibility between different versions (this is still in development).
* Two auth drivers which are named `bearer` and `basic`.
* A fetch call has been added allowing the user to be reset.
* Now supports a "loose" driver based model for authentication allowing for some customization of request/response intercepts for requests.
* The token function will return current function or called with `other` or `default` will return the appropriate token.
* Checking token expiration (base64 decode) has been removed. Since a refresh will not occur often for SPA it was a bit too much extra code. Will need to do it custom if it's really necessary.
* Reduced file size.
* Simpler consistent code base.
* Properly packaged and minified distribution.
* General bug fixes and improvements.
