# Getting Started

For more details visit the [Beginners Guide]()

## FAQ

 * [I'm getting an error that `router` is not found?](https://github.com/websanova/vue-auth/blob/master/docs/Faq.md#im-getting-an-error-that-router-is-not-found)
 * [I've logged in successfully but it's not working after?](https://github.com/websanova/vue-auth/blob/master/docs/Faq.md#ive-logged-in-successfully-but-its-not-working-after)
 * [Why is the token not being set?](https://github.com/websanova/vue-auth/blob/master/docs/Faq.md#why-is-the-token-not-being-set)
 * [How can I authenticate without using the `Authorization` header?](https://github.com/websanova/vue-auth/blob/master/docs/Faq.md#how-can-i-authenticate-without-using-the-authorization-header)
 * [My app has 2 or more fields required for authentication?](https://github.com/websanova/vue-auth/blob/master/docs/Faq.md#my-app-has-2-or-more-fields-required-for-authentication)
 * [I only see `Error: Request failed with status code 400...` text when I print out the error?](https://github.com/websanova/vue-auth/blob/master/docs/Faq.md#i-only-see-error-request-failed-with-status-code-400-text-when-i-print-out-the-error)
 * [Why is the body param not sending my data?](https://github.com/websanova/vue-auth/blob/master/docs/Faq.md#why-is-the-body-param-not-sending-my-data)


## Note on Usage

**ONE IMPORTANT THING TO NOTE**

Realize that all the data is being directly passed into whatever "http" plugin is being used.

A lot of confusion seems to come from this as the plugin adds some additional properties for internal use such as `rememberMe`. These are in fact also passed to the `http` plugin as the object is passed directly straight through.

The reason for this is so that any additional properties that need to be added to the underlying http plugin call can be set directly through any `vue-auth` method.


## Installation

The first step is to [install the plugin](https://github.com/websanova/vue-auth/blob/master/docs/Installation.md).

Common issues here are just between using different drivers. Usually between `axios` or `vue-resource`. Refer to FAQ for common issues.


## Login / Register

The simplest login example will likely send an email and password.

```javascript
$auth.login({
   body: {email: 'email@example.com', password: 'abcd1234'}
});
```

For `axios` it would be a data parameter.

```javascript
$auth.register({
   data: {email: 'email@example.com', password: 'abcd1234'}
});
```


## Privileges

To restrict or allow access to routes the meta property can be set on the route.

Currently `vue-auth` only uses `vue-router` so all the examples will be assuming this.

Check the [Privileges reference](https://github.com/websanova/vue-auth/blob/master/docs/Privileges.md) for more details on how to set access to routes.


## Default Redirects

There are three main global redirects in the plugin.

### authRedirect: `{path: '/login'}`

* Redirect to use if authentication is required on a route.

### forbiddenRedirect: `{path: '/403'}`

* Redirect to use if route is forbidden.

### notFoundRedirect: `{path: '/404'}`

* Redirect to use if route is not found (set to `false`).
