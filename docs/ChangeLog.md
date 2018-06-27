# Change Log

### v2.21.x-beta
 
 * Add optional key prameter for `$auth.check(data, key)`.
 * Add localhost check for cookies (IE Fix).
 * Add frisbee driver.
 * Fix bug with object compare for roles vars.
 * Allow `params` attribute for oauth 2 url parameters (with full backwards compatibility).
 * Fix proper promise return for Axios driver.

### v2.20.x-beta

 * Updated / consolidated documentation.
 * Restore auto refresh interval.
 * Add support for promises.

### v2.19.x-beta

 * Update to handle failed token redirects internally (rather than requiring additional interceptors).

### v2.18.x-beta
 
 * Fix compile issue when using `function` shorthand.
 * Update 2.x demo to include 401 redirect.
 * Add ability to set `response_type` for oauth2.
 * Add ability to set callback function using `$auth.ready(callback)`.
 * Restore enable/disable other as `disableImpersonate` and `enableImpersonate`.

### v2.17.x-beta

* Change "other" to "impersonate" keyword (and all accompanying functions).
* Add `ignoreVueAuth` field that can be set on requests to prevent setting headers or tokens on requests.
* Add `impersonating` field that can be set to `false` to run that request with "default" token (not impersonating).

### v2.16.x-beta

* Removed `_invalidToken` check on `http` drivers. The method still exists but is empty.
* Token names can be fully set, no behind the scenes pre-pending.
* Fixed running demos
* Updated docs.

### v2.15.x-beta

* Update so that tokens can be fully named in options. Without additional appended parameters.
* Add `tokenStore` array for setting storage preferences `(['localStorage', 'cookie'])`.
* Fix removing `rememberMe` cookie on logout.
* Fix register redirect to completely ignore login redirect.

### v2.14.x-beta

* Update demos to standalone installs.
* Separate docs.
* Add Vue.auth object (with no context, for use in interceptors).

### v2.13.x-beta

* Fix to check if error contains response in Axios driver.
* Fix for redirect being ignored when using autoLogin on register.
* Add ability to manually set tokens (for static/dynamic pages).

### v2.12.x-beta

* Fix invalidToken logout call for Axios driver (to match vue-resource driver update).

### v2.11.x-beta

* Fix Axios driver error response intercept.
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

* Update default Webpack setup to use Vue 2.x.

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
* All functions are overridable now.
* There is a driver file for vue which supports the binding between the plugin and framework. This allows multiple drivers and overrides for any issues between versions in the future and allows full backward compatibility.
* Reverted from using Vue in the base code and just went back to regular JavaScript (was not really a good idea).
* Any functions, fields parameters that involve logging in a secondary user are called `other` now.
* Actions can now be performed as "admin" user when logged in as "other" user by using `disabledOther` and `enableOther`.
* The `login`, `oauth2`, etc all have their own default parameters now.
* Removed `google` and `facebook` functions just use `oauth2` method now.
* The `logout` method can now perform an api request if `makdeRequest` is set to true.
* Switch to Vanilla Javascript (for development). Had some issues with using fancy ES6 syntax.
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
