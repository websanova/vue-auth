# Beginners Guide



## Installation

There are three drivers `vue-auth` will always be dependent on.

* The authentication driver, ex: Bearer or Basic.
* The routing driver, used for determining access to routes and setting interceptors.
* The http request driver for making request with the back-end server.


### Authentication Module

A small interceptor is required to check for a token and to send one with each request if the user is authenticated.

Perhaps the best way to understand this is to simply look at a couple of the auth drivers:

* [Basic](https://github.com/websanova/vue-auth/blob/master/drivers/auth/basic.js)
* [Bearer](https://github.com/websanova/vue-auth/blob/master/drivers/auth/bearer.js)

You will see it checks requests going out and adds the token with them if authenticated.

Likewise for each response coming in it tries to find a token.

It's quite simple to write a custom driver that doesn't follow a common scheme like `Basic` or `Bearer` by just using one of these drivers as a template.


### Routing Module

The routing module is another interceptor.

It intercepts each `route` change and checks whether the route is accessible based on [privileges](https://github.com/websanova/vue-auth/blob/master/docs/Privileges.md) set in the `meta` properties of the route.

There are not really issues coming out of this section. It's only important to realize that it it's just an interceptor that is being piggy backed off of.


### HTTP Driver

This module has the most issues as two main plugins are commonly used `axios` and `vue-router`.

It's vital to realize that the object being passed into any method like `login` or `register` is the object that will be directly passed into these plugins.

For example:

```javascript
$auth.login({
    rememberMe: true,
    body: {email: 'test@example.com', password: 'abcd1234'}
})
```

Is the same as calling:

```javascript
$http({
    rememberMe: true,
    body: {email: 'test@example.com', password: 'abcd1234'}
})
```

The only difference is that `vue-auth` adds some goodies by checking for properties such as `rememberMe` and perform some additional steps for us.


## Request Lifecycle

### Request

For ALL http requests:

* Every request goes through the `http` plugin. As mentioned, even calls such as `$auth.login()` just forward directly to the `http` module.
* The `auth` driver `request` intercept is called and will set the token accordingly if our user is in a logged in state.

If a request is made through a `vue-auth` method some additional steps may be carried out.

* For instance `rememebrMe` when login or register is called.
* Refer to each individual methods documentation for more properties that can be set.


### Response

For ALL response requests:

* It will check the `auth` driver `response` intercept. If it finds a token it will be set. This means any time a new token is found it will be updated.
* Only the login will actually go through additional steps to set the user to an `authenticated` state.
* Setting or updating a user manually using `$auth.user(<object>)` will not update their authenticated state.