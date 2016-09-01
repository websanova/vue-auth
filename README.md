# vue-jwt-auth

Jwt Auth library for Vue.js.

**NOTE:** You must load the `vue-resource` and `vue-router` modules before the `vue-auth` module due to dependencies.


## Usage

Directly:

~~~
import Auth from './plugins/vue-jwt-auth.js';
Vue.use(Auth, options);
~~~

Via npm:

~~~
Vue.use(require('vue-jwt-auth'), {
    rolesVar: 'type'
});
~~~

**NOTE:** If you do not set your router as `Vue.router = new VueRouter()` then you will need to feed the `router` in directly as an optional third argument.

~~~
var router = new VueRouter();
Vue.use(Auth, options, router);
~~~


## Loading

The `ready()` method can then be used to check when the user is first loaded.

~~~
<template>
    <div v-if="$auth.ready()">
        <ul>
            <li v-if="$auth.check()">Account</li>
            <li v-if="!$auth.check()">Login</li>
        </ul>

        <router-view></router-view>
    </div>

    <div v-if="!$auth.ready()">
        Site is loading...
    </div>
</template>
~~~

**NOTE:** This pre-fetch of the user would only occur once on the initial load of the site.

**NOTE:** This will all happen automatically once the package is included. Only the end points for the API will need to be changed which are described in the `options` section below.


## Privileges

The `vue-jwt-auth` plugin works with the `vue-router` plugin. Setting an `auth` field in the router mapping section will set access to that route.

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
    '/login': {
        auth: false,
        component: require('./Login')
    },
    '/contact': {
        component: require('./Contact')
    }
});
~~~


## Routes

**`true`**

User must be authenticated (no roles are checked).

**`false`**

If the user is logged in then this route will be unavailable. Useful for login/register type pages to be unaccessible once the user is logged in.

**`undefined`**

Public, no checks required.

**`Array`** or **`String`**

The user must be logged in. Additionally the string or array will be checked against the users roles.

Note that the users `roles` variable can be set in the options.


## Methods

**`ready()`**

When the app boots the `vue-jwt-auth` plugin will fire off a check for a token and subsequent user fetch. In the first instance of this the app will be set to "ready".

This will only occur once when the browser is loaded or refreshed.

**`check()`**

Check if the user is logged in. It can also be used to check if the user has a specific role.

~~~
$auth.check();
$auth.check('admin');
$auth.check(['admin', 'sub-admin']);
~~~


**`user()`**

Fetch the user object stored in the `$auth` instance.


**`login()`**

Login the user which accepts four parameters.

~~~
this.$auth.login(data, rememberMe, redirectURL, {
    success: function () {
        console.log('success');
    },
    error: function () {
        console.log('error');
    }
});
~~~

* **data** - Any data to pass on for logging in.
* **rememberMe** - Should remember the user or not.
* **redirectUrl** - Which route to redirect to after successful login.
* **options** - The `success` and `error` callbacks can be set.

**`facebook()`** **`google()`**

Deprecated, use `oauth2()` method.


**`oauth2()`**

These follows the same format as the `$auth.login()` method.

However the data for these works a bit differently. All the options for social authentication can be set in the `options` however they can also be set directly here in the `data` variable.

* **appId** - Set the social appId.
* **scope** - Scope of permissions required.
* **redirect** - Set the redirect url.
* **state** - Any additional state fields which will be passed back to the app.
* **code** - Pass the code in to verify with the api. This will automatically fire when the code field is detected.

~~~
var data = {
    appId: '11111111111111111',
    scope: 'email'
};

this.auth.oauth2('facebook', data, true, '/account');
~~~

~~~
var data = {
    code: this.$route.query.code
};

var callbacks = {
    success: function () {},
    error: function () {}
};

this.auth.oauth2('facebook', data, null, null, callbacks);
~~~

**`logout()`**

Log the user out.

Also accepts a `redirect` option and `force` redirect option.

Only redirects if on an auth required page.

~~~
this.$auth.logout('/home');
~~~

Always redirects.

~~~
this.$auth.logout('/home/', true);
~~~

**`loginAs(data, redirectUrl, options)`**

Login as another user.

**`logoutAs(redirectUrl)`**

Logout or other user. Will revert to previously logged in user.

**`other()`**

Check if we are currently logged in as another user.

**`getAuthHeader()`**

Returns the auth header. Useful when integration third part libraries.

**`version()`**

Returns current version.

**`token(<name>)`**

Fetch the main users tokens.

To fetch the "logged in as" token use `token('login-as')`.

**`useToken(<name>)`**

Set `null` for auto. Set `default` to always use the main token. Otherwise used a named one.

Useful when performing admin actions when using "other" user.

```
this.$auth.useToken('default'); // Set the request to use the "admin" token.
this.$http... // do stuff
this.$auth.useToken(null); // Set it back.
```


## Options

**NOTE:** All the ur's here are relative. It is assumed the vue app will have some scheme for auto pre-pending the full path to the routes.

**`authType`**

**default:** 'bearer'

**`tokenType`**

**default:** 'jwt'

If set to 'jwt' will check expiry time for refreshes, otherwise no other implementation exists and it will just send the token directly.

**`fetchUrl`**

**default:** '/auth/user'

The url for fetching the user from the api.

**`tokenUrl`**

**default:** '/auth/token'

The url for fetching a new token from the api.

**`loginUrl`**

**default:** '/auth/login'

The url for logging in.

**`loginMethod`**

**default:** 'post'

The method used for logging in.

**`loginAsUrl`**

**default:** '/auth/login-as'

The url for logging in "as".

**`loginAsMethod`**

**default:** 'post'

The method used for logging in "as".

**`registerUrl`**

**default:** '/auth/register'

Url method for registering a user.

**`authRedirect`**

**default:** '/login'

Redirect to this url if the user does not have authorization to the route.

**`notFoundRedirect`**

**default:** '/404'

Redirect to this url if the route is not accessible (this is in the case of setting a route to `false`). It will not handle 404 redirects for the entire app.

**`forbiddenRedirect`**

**default:** '/403'

Redirect to this url if the user does not have access to the route.

**`rolesVar`**

**default:** 'roles'

The name of the field that contains the roles in the user object returned from the api.

**`tokenVar`**

**default:** 'token'

The name of the field that contains the token returned from the api.

**`tokenName`**

**default:** 'jwt-auth-token'

The name of the token stored in local storage.

**`tokenTimeoutOffset`**

**default:** 5000

Offset for token timeout (for some buffer).

**`cookieDomain`**

**default:** _cookieDomain

The domain to use for the cookie. This method can be overridden.

**`userData`**

**default:** _userData

Locally this will simply return `data` on the response object. The local method can be overridden.

**`beforeEach`**

**default:** _beforeEach

This method runs before each request and handles the logic for permissions to a route. If another scheme is needed it can be overridden.

**`invalidToken`**

**default:** _invalidToken

Method to run if a `401` is hit during an API request. By default will run logout.

**`facebookUrl`**

**default:** '/auth/facebook'

The url for processing the Facebook token code in the api.

**`facebookAppId`**

**default:** ''

Set the Facebook client app id.

**`facebookScope`**

**default:** 'email'

Set the permissions scope required for the app from Facebook.

**`facebookRedirect`**

**default:** _getUrl() + '/login/facebook'

Set the redirect url to return to your app after oauth.

**`googleUrl`**

**default:** '/auth/google'

The url for processing the Google token code in the api.

**`googleAppId`**

**default:** ''

Set the Google client app id.

**`googleScope`**

**default:** 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'

Set the permissions scope required for the app from Google.

**`googleRedirect`**

**default:** _getUrl() + '/login/google'

Set the redirect url to return to your app after oauth.
