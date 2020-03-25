# Upgrade Guide

## 2.x to 3.x

For the most part the plugin should be fully backwards compatible with a few exceptions.


### No more success/error callbacks

These have been completely removed and now return a Promise.

Note this will now correctly apply in situations such as with a login and fetch request. This would properly resolve after both requests are finished first.


### The `$auth.ready()` function no longer accepts a callback.

The ready function now simply returns true/false.

Use `$auth.load()` instead for this which returns a Promise.


### New `$auth.load()` function.

This replaces the `$auth.ready()` callback.

Note that these can be used multiple times.

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


### Calling `$auth.login()` will set user if fetchUser is disabled.

If the user data is already returned on a successful login the user can be loaded right away withouth doing a fetch.

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


### Update to ES6 imports

The source files now use ES6 import / export syntax.