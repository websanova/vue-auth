# Vue Auth

Vue.js token based authentication plugin. Supports simple token based and JSON Web Tokens (JWT) authentication.

Note this is the new name for the formerly named `vue-jwt-auth`. Since it's likely this package will expand with potentially more authentication options.

* [Install](#install)
* [Demo](#demo)
* [Auth Flow](#auth-flow)
* [Token Refresh](#token-refresh)
* [User Data](#user-data)
* [Authentication](#authentication)
* [Privileges](#privileges)
* [Routes](#routes)
* [Methods](#methods)
* [Options](#options)
* [Drivers](#drivers)
* [Change Log](#change-log)



### Tested with

* vue 1.0.26, vue-resource 1.0.2, vue-router 0.7.13
* vue 2.0.1, vue-resource 1.0.2, vue-router 2.0.0

Early support for Vue 2.0 is now available also but may still be a bit unstable due to many changes in the api. Please let me know of any issues you may find.



## Notes

* The new 2.x branch features a driver centric model. This means the `router` and `http` options must **ALWAYS** set the driver to use. Please read the [Change Log](https://github.com/websanova/vue-auth#change-log) for more info. 



## Install 2.x

~~~
> npm install @websanova/vue-auth
~~~    

The `router` and `http` drivers MUST be set. The drivers are quite small so can be replaced or overridden as necessary.

**Note that the version in the driver file should denote the version it is compatible with. So `router.2x.` means it's for router 2.x.**

~~~
Vue.http.options.root = 'https://api-demo.websanova.com/api/v1';

Vue.router = new VueRouter({
    ...
});

Vue.use(require('@websanova/vue-auth'), {
    auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
    http: require('@websanova/vue-auth/drivers/http/vue-resource.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
    ...
    rolesVar: 'type'
    ...
});
~~~

### Install with Vue-Axios

~~~
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'

Vue.use(VueAxios, axios)
Vue.use(VueAuth, {
    auth: AuthBearer,
    http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js')
    ...
});

// access axios with Vue or use the 'this' reference in components
Vue.axios.post(...).then(res => {
    console.log('RES', res);
});
~~~



## Install 1.x

~~~
> npm install @websanova/vue-auth
~~~    

~~~
Vue.http.options.root = 'https://api-demo.websanova.com/api/v1';

Vue.router = new VueRouter({
    ...
});

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
> npm install
> npm run 1.x.demo
> npm run 2.x.demo
~~~

Note: For Vue 2 demo there is a separate package.json. Unfortunately there is no really great way to run both at the same time.


If a different path is required it must be set in the `demo/app.js` file.

To run the build:

~~~
> webpack
~~~



## Auth Flow

The best way to see the code in action is to see the code samples in the `1.x.demo` and `2.x.demo` folders. However it still helps to understand what exactly the workflow is.

* The plugin has two sets of interceptors. One for routing and one for http requests.

### Routing

* From the front end we can't really do any "real" authentication. It's simply a check to see it users role and the routes roles match up. From there we can allow the route to process or we can redirect accordingly.
* This is done by intercepting each route and checking if the user is already logged in. This is done by simply checking if a token exists.
* If a token exists a few things can happen. For one we would attempt to fetch the users data. The second part deals with refreshing the token which has a few strategies and is discussed in the next section.
* Typically a user will be fetched each time to make sure we have the latest user data.
* After the user is fetched the plugin will process into a "loaded" state. This should be checked via the "$auth.ready()" method. At this point we will know if we have a valid token and user.
* From here we can use the `$auth.check()` function to show hide various parts of our interface.

### HTTP

* The http part is much simpler. Essentially the plugin will automatically parse some authentication data (based on driver) into each request the app makes.
* This parsing will be done on each `request` and `response` of your http (ajax) calls.
* For the request it will simply append the auth data in the header or body (depending on your auth driver).
* For the response it will parse the auth data from the header or response data (depending on your auth driver).



## Token Refresh

Dealing with the token refresh is the tricker part in the authentication auth flow. It helps to review what is actually happening here first.

* A user logs in and gets a token. this token is valid for a certain period of time.
* Let's say the user gets a token that is always valid. This presents some security issues in case a device is lost or compromised.
* We can therefore limit access to the app by setting the tokens expiration to something like one or two weeks.
* Now there is an expiration so if the users device is compromised we are at least limiting the potential damage.
* However as long as the user keeps using the app we should keep them logged in by continually re-issuing new tokens.

This is where the issue lies with JWT and token based authentication. The question is what kind of refresh strategy do we want to employ?

Currently, there doesn't seem to be any official way to do this. With only a few "best practices" which are personal opinions at best.

A few notes:

**NOTE:** We need to make sure our old token lives slightly longer pass the expiration. Since multiple calls to the server at the same time would then be using expired tokens depending on which request expired the token first.

**NOTE:** The plugin will automatically pick up the token wherever it's set based on the driver used.

A few strategies:

**> Set a new token with each request (with old tokens living slightly longer in case of async requests).**

It would depend on the app, but this one can be a bit overkill.

**> Set a timer or counter for a token refresh request.**

This is actually not a bad strategy. But again might be a bit overkill.

**> Check the tokens expiration date before or after each request.**

This was actually previously implemented in the plugin. It was removed because of the overhead since it requires a base64 encode/decode. It would be best suited as a separate custom authentication driver.

**> Set the user token and refresh token time to same time length and call refresh with each reload of the app.**

This relies on the token being set once at login and then a separate refresh on each page reload.

* This is the default behavior of the plugin.
* The tokens are the same time length so there is no worry about a mismatch on timing.
* They would also both expire at the same time if the app is unused.
* There is also the benefit of no timer overlaps so async requests don't needed extended life on expired tokens.

Because different apps have different strategies and requirements an option has been added to disable fresh.

~~~
refreshData: {
    enabled: false // true by default.
}
~~~

The refresh request could done be done manually via the `refresh` method.

~~~
this.$auth.refresh();
~~~




## User Data

A common gotcha is getting the `$auth.user()` data properly. The plugin is designed to expect the user object to be in the `data` parameter of the response.

Depending on what version of the `vue-resource` plugin you are using the response data itself will come from either `res.json()` or `res.data`. Note that the data here is not the response data.

Sample response.

~~~
{
    "status": "success",
    "data": {
        "id": 1,
        "name": "Websanova",
        ...
    }    
}
~~~

The plugin has a function for parsing this user data when it receives it called `_parseUserData`. The `data` variable there is the `res.json()` or `res.data` object.

~~~
function _parseUserData(data) {
    return data.data;
}
~~~

If a different format is needed simply override this function in the options.

~~~
Vue.use(require('vue-auth'), {
    parseUserData: function (data) {
        return data.whatever;
    }
});
~~~



## Authentication

Because there are so many different authentication schemes with tokens Vue Auth uses a simple model so that it can easily be extended for custom scenarios.

Each request and response that is made to the server is intercepted internally by the plugin.

* The internal request method will fetch the current token (internally) and pass it to the auth `request` driver method where it can be processed for delivery to the server.
* The internal response method will behave in a similar fashion however it should deliver a token to the internal response intercept where that token will get stored.

The current `bearer` driver is quite simple and looks like this:

~~~
bearerAuth: {
    request: function (req, token) {
        this.options.http._setHeaders.call(this, req, {Authorization: 'Bearer ' + token});
    },
    response: function (res) {
        var token = this.options.http._getHeaders.call(this, res).Authorization;

        if (token) {
            token = token.split('Bearer ');
            
            return token[token.length > 1 ? 1 : 0];
        }
    }
},
~~~

The driver `request` method receives the `req` and `token` arguments. From there we use an internal `_setHeaders` method. However with the `req` object pretty much anything can be assembled.

The driver `response` method receives the `res` argument and should parse out the token from the response and return a token which will get stored internally by the plugin.

To setup a custom driver we simply need to set the `authType` option and the naming convention will follow.

**Example 1: Token in sub object of body** 

Maybe the token is returned in a non standard way such as `{data: {token: 'abcd1234'}}`.

~~~
authType: 'custom1',

custom1Auth: {
    request: function (req, token) {
        req.headers.set('SomeHeader', token);
    },
    response: function (res) {
        return (res.data.data || {}).token;
    }
}
~~~

**Example 2: Token with multiple parts** 

Another common scenario may be a token with multiple data points that all need to be returned to the server.

~~~
authType: 'custom2',

custom2Auth: {
    request: function (req, token) {
        token = token.split(';');

        this.options.http._setHeaders.call(this, req {
            header1: token[0],
            header2: token[1],
            header3: token[2],
            header4: token[3]
        });
    },
    response: function (res) {
        var headers = this.options.http._getHeaders.call(this, res);

        if (headers.header1 && headers.header2 && headers.header3 && headers.header4) {
            return headers.header1 + ';' + headers.header2 + ';' + headers.header3 + ';' + headers.header4;
        }
    }
}
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

### redirect

* Returns either an object if a redirect occurred or `null`.
* The object is in the form `{type: <string>, from: <object>, to: <object>}` Where `type` is one of `401`, `403`, `404` and the `from` and `to` objects are just copies of the route transitions.

~~~
var redirect = this.$auth.redirect();

this.$auth.login({
    redirect: {name: redirect ? redirect.from.name : 'account'},
});
~~~

### user

* Returns the currently stored users data.
* Update the current user by passing in an object.

~~~
<div>
    {{ $auth.user().email }}
</div>
~~~

~~~
this.$auth.user(userObject);
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
* Can also specify a specific token, but only `other` and `default` will actually return anything unless setting your own token.
* Can set a token with optional second argument, set null to use default naming conventions.

~~~
var token = this.$auth.token();
var token = this.$auth.token('other');
var token = this.$auth.token('default');

this.$auth.token(null, token);
this.$auth.token('test', token);

var token = this.$auth.token('test');
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
* Accepts `fetchUser` param which allows disabling fetching user after login.

~~~
this.$auth.login({
    params: {},
    success: function () {},
    error: function () {},
    rememberMe: true,
    redirect: '/account',
    fetchUser: true
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

### tokenName: `'auth_token'`

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

### loginData: `{url: 'auth/login', method: 'POST', redirect: '/', fetchUser: true}`

* Default login request data and redirect.
* To disable user fetching on login set the `fetchUser` to `false`.

### logoutData: `{url: 'auth/logout', method: 'POST', redirect: '/', makeRequest: false}`

* Default logout request data and redirect.
* This request is only made if `makeRequest` is set to true.

### oauth1Data: `{url: 'auth/login', method: 'POST'}`

* Default oauth1 request data and redirect.

### fetchData: `{url: 'auth/user', method: 'GET', enabled: true}`

* Default user fetch request data and redirect.

### refreshData: `{url: 'auth/refresh', method: 'GET', enabled: true, interval: 30}`

* Default refresh request data and redirect.
* Can set interval for auto refresh (in minutes). Default is `30`, set to `0` for none.

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

### parseOauthState: `_parseOauthState`

* Set how the oauth state data from the returned url will get parsed.

### tokenExpired: `_tokenExpired`

* Hook for checking if a token refresh should occur or not. Set this to return `false` when creating a custom solution.

### check: `_check`

* Function used during `check` method. 



## Drivers

In the 2.x version the plugin now features a driver centric model.

**NOTE: Some drivers may have dependencies such as `Vue.router` being set.**

~~~
Vue.use(require('@websanova/vue-auth'), {
    auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
    http: require('@websanova/vue-auth/drivers/http/vue-resource.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
    ...
});
~~~

If you are creating a driver a method named `_init` which will receive the current auth scope can be used to check for any dependencies.



## Change Log

### v2.11.x-beta

* Update so support fall back for token to be stored in cookie if `localStorage` is not supported. Note that the cookie is used as a dud and not meant to be used by server or back-end as part of authentication scheme.
* Update token name to underscores `auth_token` instead of `auth-token`.
* Fix issue with invalid token on refresh not firing off `_invalidToken` token call.

### v2.10.x-beta

* Update devise auth to support latest (backward compatible).
* Fix issues with refresh not authenticating when globally setting `fetchData.enabled` to `false`.

### v2.9.x-beta

* Fix using `loginData.fetchUser` to still authenticate without user.
* Fix refresh / user fetch on app reload (browser refresh). It will now run sequentially in case the token is expired forcing a refresh first.
* Add refresh `refreshData.interval` property for automatic refresh fetches. Default to 30s. Set to 0 for none.

### v2.8.x-beta

* Fix for `loginData.fetchUser` when set to `false`.
* Removed `transition` method, replaced with `redirect`.
* Added `redirect` method for easy access to check for redirects from auth.

### v2.7.x-beta

* Added  axios driver.
* Addded `parseOauthState` option.

### v2.6.x-beta

* Add check for missing token when authenticated (should auto logout).
* Add enabled option for `fetchData` useful in case we need a preset before auth. For instance when fetching properties from server.

### v2.5.x-beta

* Update default webpack setup to use Vue 2.x.

### v2.4.x-beta

* Add transition tracking (useful for url redirects on login).

### v2.3.x-beta

* Fix for checking that a user is authenticated when checking invalid token function (401).
* Fix for 401 auth auto redirect when invalid token.
* An option for `refreshData.enabled` has been added to disable refresh.
* Updated docs.
* Updated 2.x demo to use latest Vue version.

### v2.2.x-beta

Vue has been in such a volatile state, especially between versions and 1 and 2. There have been many breaking changes as well as [removing vue-resource as the officially recommended package](https://medium.com/the-vue-point/retiring-vue-resource-871a82880af4) for Vue.

Because of all these changes and potential breaking changes the package has been changed to a much more driver centric model for "router", "resource" and "authentication" . Due to the nature of Vue and the current eco-system with Webpack, to avoid bloat **this means the drivers will need to be passed in manually**. Check the install section for more info.

We will see some ugly `require` code when including the plugin. But as a trade off it will reduce bloat and allow the plugin to much better support different versions of Vue as well as different "router", "resource" and "authentication" modules.

**To ease confusion for this driver centric model the plugin has been bumped to a 2.x version. This will also keep it in line with the current Vue 2.x version.**

* Stability for extend functionality.
* Driver centric model for "router", "resource" and "authentication".
* The options for `router`, `http` and `auth` must be set now and will not auto bind (this is because webpack would pre load all drivers with dynamic variable).
* Added `loginData.fetchUser` option to allow disabling of user fetch on login (which will also be disabled on refreshes).
* Make "authorization" header case insensitive for bearer and basic auth.
* Bearer auth "bearer" text is now case insensitive and will accept with and without colon after "bearer" text.


### v1.5.x-beta

* Added auth driver for "devise".
* Updated docs to include info about parsing user data from server.

### v1.4.x-beta

* Simplified support for auth drivers.


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
