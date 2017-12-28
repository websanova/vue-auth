# Guide

* [Note on Usage](https://github.com/websanova/vue-auth/blob/master/docs/Guide.md#note-on-usage)
* [Installation](https://github.com/websanova/vue-auth/blob/master/docs/Guide.md#installation)
* [Demos](https://github.com/websanova/vue-auth/blob/master/docs/Guide.md#demos)
* [Authentication & Drivers](https://github.com/websanova/vue-auth/blob/master/docs/Guide.md#authentication-and-drivers)
* [Privileges & Redirects](https://github.com/websanova/vue-auth/blob/master/docs/Guide.md#privileges-and-redirects)
* [User](https://github.com/websanova/vue-auth/blob/master/docs/Guide.md#user)
* [Static Pages](https://github.com/websanova/vue-auth/blob/master/docs/Guide.md#static-pages)
* [SSR](https://github.com/websanova/vue-auth/blob/master/docs/Guide.md#ssr)

## Note on Usage

**ONE IMPORTANT THING TO NOTE**

Realize that all the data is being directly passed into whatever "http" or "router" plugin is being used.

A lot of confusion seems to come from this as the plugin adds some additional properties for internal use such as `rememberMe`. These are in fact also passed to the `http` plugin as the object is passed directly straight through.

The reason for this is so that any additional properties that need to be added to the underlying http plugin call can be set directly through any `vue-auth` method.

So making a call like (with `vue-resource`):

```
$auth.login({
    body: {email: 'email@example.com', password: 'abcd1234'}
});
```

Is actually just forwarding to this:

```
$http({
    method: 'get',
    url: 'auth/login',
    body: {email: 'email@example.com', password: 'abcd1234'}
});
```

The object will also return. So if the `http` plugin supports promises it will be returned.

```
$auth.login().then().then()...;
```


## Installation

It's best to start with the [Step by Step](https://github.com/websanova/vue-auth/blob/master/docs/StepByStepGuide.md) or [Installation](https://github.com/websanova/vue-auth/blob/master/docs/Installation.md) guide.


## Demos

There are a few demos available, the most stable/current being the `2.x demo`.

For installation check the [Demos Guide](https://github.com/websanova/vue-auth/blob/master/docs/Demos.md).

**NOTE: You will need to run an `npm install` in both the root an demo folder since the auth files contain relative links.**

There are some demos in progress for `ssr` and `nuxt` but currently not really maintained (no time).


## Authentication & Drivers

The authentication is fundamentally straight forward.

* Each request to the api should add some kind of token (if set).
* Each response from the api should parse some kind of token (if set).

There are many approaches to this, some more standard than others. The [Authentication Guide](https://github.com/websanova/vue-auth/blob/master/docs/Authentication.md) goes into some more detail about how to use the current available drivers and also how to write a custom one.

But the best way to understand this is to simply look at a couple of the available auth drivers:

* [Basic](https://github.com/websanova/vue-auth/blob/master/drivers/auth/basic.js)
* [Bearer](https://github.com/websanova/vue-auth/blob/master/drivers/auth/bearer.js)


## Privileges and Redirects

Privileges and redirects have a default setup but can also be specified at the route level.

The [Privileges Guide](https://github.com/websanova/vue-auth/blob/master/docs/Privileges.md) covers both these topics in detail.


## User

A common gotcha is getting the `$auth.user()` data properly. The plugin is designed to expect the user object to be in the `data` parameter of the response.

This will vary depending on the plugin and version being used.

For instance with `vue-resource` the response data itself will come from either `res.json()` or `res.data`. Note that the data here is not the response data.

**Sample response.**

```javascript
{
    "status": "success",
    "data": {
        "id": 1,
        "name": "Websanova",
        ...
    }    
}
```

The plugin has a function for parsing this user data when it receives it called `_parseUserData`. The `data` variable there is the `res.json()` or `res.data` object.

```javascript
function _parseUserData(data) {
    return data.data;
}
```

If a different format is needed simply override this function in the options.

```javascript
Vue.use(require('vue-auth'), {
    parseUserData: function (data) {
        return data.whatever;
    }
});
```


## Multiple Async Calls with Token Expired

A common issue that comes up is with a token expiring during of many calls already made to a server api.

There are a couple ways to handle it, but this is not really Vue / Auth issue.

1) We can add an intercept to repeat the request. However this is a bit messy as even the repeat could potentially fail. It would also require reimplementation if we are building multiple apps for browser and mobile.

2) Add a grace period to expired tokens on the server. Typically token based authentication like JWT will be setup to have expired tokens still be valid for a minute or two after being invalidated.


## Static Pages

There is a case where pages are fully pre-rendered in a traditional way. For instance using Laravel that delivers a rendered html page.

In this case there is some manual intervention that would need to be taken to manually set the `vue-auth` user and loaded states.

```javascript
this.$auth.watch.data = {}; // user object
this.$auth.watch.loaded = true;
this.$auth.watch.authenticated = true;
```


## SSR

Integrating with SSR solution has been a challenge.

It's important to note that For SSR commonly we are trying to solve two solutions.

* A fully integrated vue solution from back to front end with likely node and express.js
* SEO for an app.

With the first if we are building a fullstack solution then it's likely the authentication can be handled directly through the server. Since the calls are no login api calls at this point.

For SEO we don't need authentication.
