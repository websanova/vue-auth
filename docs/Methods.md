# Methods

These are all methods available in the vue app via `$auth`.

* All `success` and `error` functions will receive proper context from currently called component.

### ready

* Get binded ready property to know when user is fully loaded and checked.
* Can also set a single callback which will fire once (on refresh or entry).

```html
<div v-if="$auth.ready()">
    <vue-router></vue-router>
</div>
<div v-if="!$auth.ready()">
    Site loading...
</div>
```

```js
created() {
    this.$auth.ready(function () {
        console.log(this); // Will be proper context.
    });
}
```



### redirect

* Returns either an object if a redirect occurred or `null`.
* The object is in the form `{type: <string>, from: <object>, to: <object>}` Where `type` is one of `401`, `403`, `404` and the `from` and `to` objects are just copies of the route transitions.

```javascript
var redirect = this.$auth.redirect();

this.$auth.login({
    redirect: {name: redirect ? redirect.from.name : 'account'},
});
```

### user

* Returns the currently stored users data.
* Update the current user by passing in an object.

```html
<div>
    {{ $auth.user().email }}
</div>
```

```javascript
this.$auth.user(userObject);
```


### check

* Check to see if the user is logged in.
* It also accepts arguments to check for a specific role or set of roles.
* Accepts optional `key` parameter to use instead of the default `rolesVar`.

```html
<a v-if="!$auth.check()" v-link="'/login'">login</a>
<a v-if="$auth.check('admin')">admin</a>
<a v-if="$auth.check('reports-post', 'perms')">reports</a>
<a v-if="$auth.check(['admin', 'manager'])">manage</a>
<a v-if="$auth.check()" v-on:click="$auth.logout()">logout</a>
```

### impersonating

* Checks if secondary user is logged in.

```html
<a v-if="$auth.impersonating()" v-on:click="$auth.unimpersonate()">logout Imposter</a>
```


### token

* Returns the currently activated token if none are specified.
* Can also specify a specific token, but only `impersonate` and `default` will actually return anything unless setting your own token.
* Can set a token with optional second argument, set null to use default naming conventions.

```javascript
var token = this.$auth.token();
var token = this.$auth.token('impersonate_auth_token');
var token = this.$auth.token('default_auth_token');

this.$auth.token(null, token);
this.$auth.token('test', token);

var token = this.$auth.token('test');
```


### fetch

* Fetch the user (again) allowing the users data to be reset (from the api).
* Data object is passed directly to http method.

```javascript
this.$auth.fetch({
    params: {},
    success: function () {},
    error: function () {},
    // etc...
});
```

### refresh

* Manually refresh the token.
* The refresh will always fire on boot, to disable this override the `tokenExpired` option method.
* Can be used in conjunction with `tokenExpired` and `token` to write custom refreshes.
* If any custom expiration custom logic needs to be done (for instance decoding and checking expiration date in jwt token) override the `tokenExpired` method and return `boolean`.
* Data object is passed directly to http method.

```javascript
this.$auth.refresh({
    params: {}, // data: {} in Axios
    success: function () {},
    error: function () {},
    // etc...
});
```

### register

* Convenience method for registration.
* Data object is passed directly to http method.
* Accepts `autoLogin` parameter to attempt login directly after register.
* Accepts `rememberMe` parameter when used in conjunction with `autoLogin` equal to `true`.
* Accepts `redirect` parameter which is passed directly to router.

```javascript
this.$auth.register({
    params: {}, // data: {} in Axios
    success: function () {},
    error: function () {},
    autoLogin: true,
    rememberMe: true,
    redirect: {name: 'account'},
    // etc...
});
```

### login

* Data object is passed directly to http method.
* Accepts `rememberMe` parameter.
* Accepts `redirect` parameter which is passed directly to router.
* Accepts `fetchUser` param which allows disabling fetching user after login.

```javascript
this.$auth.login({
    params: {}, // data: {} in Axios
    success: function () {},
    error: function () {},
    rememberMe: true,
    redirect: '/account',
    fetchUser: true,
    // etc...
});
```

### logout

* Data object is passed directly to http method.
* Accepts `redirect` parameter which is passed directly to router.
* Accepts `makeRequest` parameter which must be set to `true` to send request to api. Otherwise the logout just happens locally by deleting tokens.

```javascript
this.$auth.logout({
    makeRequest: true,
    params: {}, // data: {} in axios
    success: function () {},
    error: function () {},
    redirect: '/login',
    // etc...
});
```

### impersonate

* Data object is passed directly to http method.
* Accepts `redirect` parameter which is passed directly to router.

```javascript
this.$auth.impersonate({
    params: {}, // data: {} in axios
    success: function () {},
    error: function () {},
    redirect: {name: 'account'},
    // etc...
});
```

### unimpersonate

* Data object is passed directly to http method.
* Accepts `redirect` parameter which is passed directly to router.
* Also accepts `makeRequest` parameter same as `logout` method.

```javascript
this.$auth.unimpersonate({
    makeRequest: true,
    params: {}, // data: {} in axios
    success: function () {},
    error: function () {},
    redirect: {path: '/admin'},
    // etc...
});
```

### disableImpersonate

* Disables impersonating user using the default token until it is re-enabled (or logged out).
* This allows you to login is as "another" user but still perform requests as an admin.

```javascript
this.$auth.disableImpersonate();

this.$http.get('users'); // Will run as default token (admin).

this.$auth.enableImpersonate();
```

### enableImpersonate

* See disableImpersonate.


### oauth2

* Convenience method for OAuth2.
* Initial request is to third party.
* Second call is to api server.
* Accepts `code` parameter which should be set to `true` when the code is set.
* Accepts `provider` parameter which hooks into data for third party.
* Third party data should follow format such as `facebookData`, `facebookOath2Data`. Check options section for more info.
* Accepts `redirect` parameter which is passed directly to router.

```javascript
if (this.$route.query.code) {
    this.$auth.oauth2({
        code: true,
        provider: 'facebook',
        params: { // data: {} in axios
            code: this.code
        },
        success: function(res) {},
        error: function (res) {},
        redirect: {path: '/account'},
        // etc
    });
}
else {
    this.$auth.oauth2({
        provider: 'facebook',
        rememberMe: true,
        params: {
            // Any key/value pairs will be appended to url.
        }
    });
}
```
