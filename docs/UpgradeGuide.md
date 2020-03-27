# Upgrade Guide

## 2.x to 3.x

For the most part the plugin should be fully backwards compatible with a few exceptions.

There are a couple breaking changes which are outlined here first. The rest are just addons and internal updates.

Upgrade time: Should not be more than a few minutes.


### No more success/error callbacks.

These have been completely removed and now return a Promise.

NOTE: Requests will now correctly chain in situations such as with a login and subsequent fetch request.

Instead of:

```
this.$auth
    .login({
        body: body,
        rememberMe: true,
        success() => {},
        error() => {}
    });
```

Use `then`:

```
this.$auth
    .login({
        body: data,
        rememberMe: true,
    })
    .then(() => {
        // success
    }, () => {
        // error
    });
```


### The `$auth.ready()` function no longer accepts a callback.

The ready function now simply returns true/false.

Use `$auth.load()` instead for this which returns a Promise.

NOTE: The `$auth.load().then()` can be called multiple times.

Instead of:

```
this.$auth
    .ready(() => {
        // do some stuff
    });
```

Use `load` and `then`:

```
this.$auth
    .load()
    .then(() => {
        // do some stuff
    });
```


### New `$auth.load()` function.

This replaces the `$auth.ready()` callback.

NOTE: that these can be used multiple times.

```
$auth
    .load()
    .then(() => {
        // Do something.
    });

$auth
    .load()
    .then(() => {
        // Do something again
    });
```


### Calling `$auth.login()` will attempt to set user if `fetchUser` is disabled.

If the user data is already returned on a successful login the user can be loaded right away withouth doing a fetch.

NOTE: This will use same parser as with the `fetch` call, by default if would set the user to `res.data.data`.

```
$auth
    .login({
        fetchUser: false
    })
    .then(() {
        // Do something.
    });
```


### No more underscore prefix on driver functions.

This applies to `http` and `router` drivers.

This was quite unnecessary so have removed it.


### Update to ES6 imports.

The source files now use ES6 import / export syntax.


### Internal function renaming.

Lots of functions have been renamed to follow a more consistent naming pattern.


### Removed internal function exposing.

A lot of internal functions were exposed via the `options`. This was intended to allow overriding various parts of the plugin.

This has been removed to keep things simpler.