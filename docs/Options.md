# Options

Pretty much all methods are overridable now in case there any specific issues with a particular version of Vue.

### token: `[{request: 'Authorization', response: 'Authorization', authType: 'bearer', foundIn: 'header'}, {request: 'token', response: 'token', authType: 'bearer', foundIn: 'response'}]`

* Set of method for fetching the token from the response. It will attempt each until a token is found and stop there.
* For sending requests it will by default use the method in the first position.

### tokenImpersonateName: `'impersonate_auth_token'`

* The name of the impersonating token stored in local storage.

### tokenDefaultName: `'default_auth_token'`

* The name of the default token stored in local storage.

### tokenStore: `['localStorage', 'cookie']`

* Set storage method in order of importance and usage based on availability (from left to right).

### rolesVar: `'roles'`

* Name of roles var in user object.

### authRedirect: `{path: '/login'}`

* Redirect to use if authentication is required on a route.

### forbiddenRedirect: `{path: '/403'}`

* Redirect to use if route is forbidden.

### notFoundRedirect: `{path: '/404'}`

* Redirect to use if route is not found (set to `false`).

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

### impersonateData: `{url: 'auth/impersonate', method: 'POST', redirect: '/'}`

* Default impersonate request data and redirect.

### unimpersonateData: `{url: 'auth/unimpersonate', method: 'POST', redirect: '/admin', makeRequest: false}`

* Default unimpersonate request data and redirect.

### facebookData: `{url: 'auth/facebook', method: 'POST', redirect: '/'}`

* Default  request data and redirect.

### googleData: `{url: 'auth/google', method: 'POST', redirect: '/'}`

* Default  request data and redirect.

### facebookOauth2Data: `{url: 'https://www.facebook.com/v2.5/dialog/oauth', params: {redirect_uri: function () { return this.options.getUrl() + '/login/facebook'; }, client_id: '', scope: 'email'}}`

* Default Oauth2 data that ships with plugin.
* These can be overridden when calling `oauth2()` method or in the plugin options on init.

### googleOauth2Data: `{url: 'https://accounts.google.com/o/oauth2/auth', params: {redirect_uri: function () { return this.options.getUrl() + '/login/google'; }, client_id: '', scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'}}`

* Same as facebookOauth2Data.

### getUrl: `_getUrl`

* Returns the current sites url for use in Oauth2 redirects back to the site.

### cookieDomain: `_cookieDomain`

* Set the cookie domain used for `rememberMe` option.

### parseUserData: `_parseUserData`

* Set what data is stored from the user from the response data.

### parseOauthState: `_parseOauthState`

* Set how the Oauth state data from the returned url will get parsed.

### tokenExpired: `_tokenExpired`

* Hook for checking if a token refresh should occur or not. Set this to return `false` when creating a custom solution.

### check: `_check`

* Function used during `check` method. 