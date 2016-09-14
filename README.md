# Vue Auth

Vue.js token based authentication plugin. Supports simple token based and JSON Web Tokens (JWT) authentication.

Note this is the new name for the formerly named `vue-jwt-auth`. Since it's likely this package will expand with potentially more authentication options.

### Tested with

* vue >= 1.0.0
* vue-resource >= 0.8.0
* vue-router >= 0.7.0



## Notes

* There is a ton of changes in the `v1.0.0-dev` version, check the change log below.
* Because the changes are quite different a `v1.0.0` version has been started, however it is still very much in dev mode.
* The changes are mostly non breaking but there will be potentially a few (check change log).



## Install

~~~
> sudo npm install @websanova/vue-auth
~~~    

~~~
Vue.use(require('@websanova/vue-auth'), {
    rolesVar: 'type'
});
~~~

**NOTE:** If you do not set your router as `Vue.router = new VueRouter()` then you will need to feed the `router` in directly as an optional third argument.

~~~
var router = new VueRouter();
Vue.use(Auth, options, router);
~~~



## Demo

To run the front end part of the demo just install and run.

~~~
> sudo npm install
> sudo npm run demo
~~~

There is a demo server already available in the demo. If a different path is required it must be set in the `demo/app.js` file.

To run the build:

~~~
> sudo webpack
~~~



## Privileges

The `vue-auth` plugin works with the `vue-router` plugin. Setting an `auth` field in the router mapping section will set access to that route.

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

### auth: ```true```

* User must be authenticated (no roles are checked).

### auth: ```false```

* If the user is logged in then this route will be unavailable. Useful for login/register type pages to be unaccessible once the user is logged in.

### auth: ```undefined```

    * Public, no checks required.

### auth: ```Array``` ```String```

    * The user must be logged in. Additionally the string or array will be checked against the users roles.

    * Note that the users `roles` variable can be set in the options.



## Methods

Auth.prototype.ready = function () {
        return this.watch.loaded;
    };
    
    Auth.prototype.user = function (data) {
        if (data) {
            this.watch.data = data;
        }

        return this.watch.data;
    };

    Auth.prototype.check = function (role) {
        return this.options.check.call(this, role);
    };

    Auth.prototype.other = function () {
        this.watch.data; // To fire watch

        return __token.get.call(this, 'other') ? true : false;
    };

    Auth.prototype.enableOther = function (data) {
        if (this.other()) {
            this.currentToken = null;
        }
    };

    Auth.prototype.disableOther = function (data) {
        if (this.other()) {
            this.currentToken = 'default';
        }
    };

    Auth.prototype.token = function (name) {
        return __token.get.call(this, name);
    };

    Auth.prototype.fetch = function (data) {
        __bindContext.call(this, 'fetch', data);
    };

    Auth.prototype.refresh = function (data) {
        __bindContext.call(this, 'refresh', data);
    };

    Auth.prototype.register = function (data) {
        __bindContext.call(this, 'register', data);
    };

    Auth.prototype.login = function (data) {
        __bindContext.call(this, 'login', data);
    };

    Auth.prototype.logout = function (data) {
        __bindContext.call(this, 'logout', data);
    };

    Auth.prototype.loginOther = function (data) {
        __bindContext.call(this, 'loginOther', data);
    };

    Auth.prototype.logoutOther = function (data) {
        __bindContext.call(this, 'logoutOther', data);  
    };

    Auth.prototype.oauth2 = function (data) {
        __bindContext.call(this, 'oauth2', data);  
    }





## Options

Pretty much all methods are overrideable now in case there any specific issues with a particular version of Vue.

### tokenVar: `'token'`

    * The name of the token to check for in the response.

### tokenName: `'auth-token'`

    * The name of the token stored in local storage.

### tokenHeader: `'Authorization'`

    * Name of authorization token header to look for in the response.

### authType: `'bearer'` `'basic'`

    * Authentication type to use.

### rolesVar: `'roles'`

    * Name of roles var in user object.

### authRedirect: `{path: '/login'}`

    * Redirect if authentication is required in a route.

### forbiddenRedirect:  {path: '/403'}

### notFoundRedirect:   {path: '/404'}

### registerData:       {url: 'auth/register',     method: 'POST', redirect: '/login'}

### loginData:          {url: 'auth/login',        method: 'POST', redirect: '/'}

### logoutData:         {url: 'auth/logout',       method: 'POST', redirect: '/', makeRequest: false}

### oauth1Data:         {url: 'auth/login',        method: 'POST'}

### fetchData:          {url: 'auth/user',         method: 'GET'}

### refreshData:        {url: 'auth/refresh',      method: 'GET', atInit: true}

### loginOtherData:     {url: 'auth/login-other',  method: 'POST', redirect: '/'}

### logoutOtherData:    {url: 'auth/logout-other', method: 'POST', redirect: '/admin', makeRequest: false}

### facebookData:       {url: 'auth/facebook',     method: 'POST', redirect: '/'}

### googleData:         {url: 'auth/google',       method: 'POST', redirect: '/'}

### facebookOauth2Data: {

    url: 'https://www.facebook.com/v2.5/dialog/oauth',
    redirect: function () { return this.options.getUrl() + '/login/facebook'; },
    clientId: '',
    scope: 'email'
}

### googleOauth2Data: {
    url: 'https://accounts.google.com/o/oauth2/auth',
    redirect: function () { return this.options.getUrl() + '/login/google'; },
    clientId: '',
    scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
}

### getUrl:             _getUrl

### cookieDomain:       _cookieDomain

### parseUserData:      _parseUserData

### tokenExpired:       _tokenExpired

### check:              _check

### transitionEach:     _transitionEach

### routerBeforeEach:   _routerBeforeEach

### requestIntercept:   _requestIntercept

### responseIntercept:  _responseIntercept

### registerPerform:    _registerPerform

### registerProcess:    _registerProcess

### loginPerform:       _loginPerform

### loginProcess:       _loginProcess

### logoutPerform:      _logoutPerform

### logoutProcess:      _logoutProcess

### fetchPerform:       _fetchPerform

### fetchProcess:       _fetchProcess

### refreshPerform:     _refreshPerform

### refreshProcess:     _refreshProcess

### loginOtherPerform:  _loginOtherPerform

### loginOtherProcess:  _loginOtherProcess

### logoutOtherPerform: _logoutOtherPerform

### logoutOtherProcess: _logoutOtherProcess

### oauth2Perform:      _oauth2Perform

### oauth2Process:      _oauth2Process




## Driver Options

_init: function () {
        this.options._bind.call(this);

        this.options._beforeEach.call(this, this.options.routerBeforeEach, this.options.transitionEach);
        this.options._interceptor.call(this, this.options.requestIntercept, this.options.responseIntercept);
    },

    _bind: function () {
        this.options.http = this.options.http || this.options.Vue.http;
        this.options.router = this.options.router || this.options.Vue.router;
    },

    _watch: function (data) {
        return new this.options.Vue({
            data: function () {
                return data;
            }
        });
    },

    _getHeaders: function (res) {
        return {
            authorization: res.headers[this.options.tokenHeader]
        };
    },

    _setHeaders: function (req, headers) {
        if (headers.authorization) {
            req.headers[this.options.tokenHeader] = headers.authorization;
        }
    },

    _bindData: function (data, ctx) {
        var error, success;

        data = data || {};

        error = data.error;
        success = data.success;

        data.query = ctx.$route.query || {};

        if (data.success) { data.success = function (res) { success.call(ctx, res); } }
        if (data.error) { data.error = function (res) { error.call(ctx, res); } }

        return data;
    },

    _interceptor: function (req, res) {
        var _this = this;

        this.options.http.interceptors.push(function (request, next) {
            if (req) { req.call(_this, request); }
            
            next(function (response) {
                if (res) { res.call(_this, response); }
            });
        });
    },

    _beforeEach: function (routerBeforeEach, transitionEach) {
        var _this = this;

        this.options.router.beforeEach(function (transition) {
            routerBeforeEach.call(_this, function () {
                transitionEach.call(_this, transition.to.auth, function () { transition.next(); });
            });
        })
    },

    _invalidToken: function (res) {
        if (res.status === 401) {
            this.logout();
        }
    },

    _routerReplace: function (data) {
        this.options.router.replace(data);
    },

    _routerGo: function (data) {
        this.options.router.go(data);
    },

    _httpData: function (res) {
        return res.json() || {};
    },

    _http: function (data) {
        this.options.http(data).then(data.success, data.error);
    }





## Change Log

### v1.0.1-dev



-changes
    -package name is scoped now - it's a bit annoying have to worry about package names being take so they are now scped throught `@websanova` and will be consistently named with the GitHub repo.

    - because this plugin is still in a lot of development, this has been made as incremental change even though it's been overhauled quite a bit.
        -i will not be maintaining any backward compatability. However this is also released as an rc and will go into version one soon once bugs have been ironed out so it's a bit safer to use.

    -added demo
        -sudo npm run demo (you will need to hook up back-end php file for full demo).
    -the library has been renamed to vue-auth (allows to support more types of login methods in the future).
    -options for paths are now objects where you can specify any default data you want to pass into your calls.
        -this goes for any routing params also, but now gives the option of using a string path, or an object with name or path and params.
    -there is now a new register call with the option to auto login on success.
    -there is now no fetch call if the auth call returns a token.
        -because there are different ways that this can be implemented
        -the default is to just refresh the token on each app init.
        -however some users may want to set this token one the user is requested (since that typically happens once or few times) and save a hit to the server.
        -to solve this a hook has been created to automatically sniff out and set a `token` var in each response. This means you can set it pretty much anywhere and it will automatically update the token.
        -the fetch call will be on by default, if you want it disabled (because you are sending the token already somewhere else) just init the app options with { refreshData: { atInit: false }}
        -you can also just call the `refresh` method manually if that suits you better also and provide a `success` callback.
        -can set as header or as var in your data which is always checked at each response so you can insert it wherever you like.
    -better handling for invalid tokens
        -there were some inconsitincies here before
        -this will now automatically logout the user and redirect them (if an invalid token is detected).
    -all functions are overrideable now
    -there is a driver file for vue which supports the binding between the plugin and framework. This allows multiple drivers and overrides for any issues between versions in the future and allows full backward compatability.
    -reverted from using Vue in the base code and just went back to regular JavaScript (not a good idea).
    -all the redirects area also objects now, so you can do a redirect as a `/path` or `{name: 'object'}`.
    -any functions, fields params that involve logging in a secondary user are called `other` now.
    -you can still perform actions as the "admin" user when logged in as other by using `useToken('default')` and switching back to `useToken('other')`.
        -actually this is now enabledOther() and disableOther - not the same as logging out which kills the token for other...
    -you can now specify separate path data for login and oauth1 and oauth2, etc.
    -login, oauth, etc functions now just use one data object to pass in. Specify any options, paths or redirect values in there.
        -these objects act as a base and any values you pass in will override them in that request. This allows a lot more flexibility for any specific setup you may have or hooking up with existing api's that can't be changed.
    -removed function google, and facebook, just use oauth2('facebook', data), etc...
    -the plugin comes preloaded with oauth2 info for google and facebook but you can easily add your own in the options...
        -use provider parameter 'provider'
        -state parameter (pass any info along here)
        -rememberMe (automatically passed through state for you)
        -provide example...
    -there is a logout request that can be made if options.logoutData.url is set (by default it's null).
        -either way the logout will follow consistent format and a `success` callback can be set in.
        -the success method will contain the proper context.
    -login, oauth1, oauth2, register will now have the proper context from calling component (you don't need to use _this kind of stuff).
        -without circular bindings
    -switch to "safe" javascript.
    -support for drivers (this allows more flexibility between different versions)
    -auth drivers (these are not fully extendable yet) for now it supports "bearer" and "plain" (both set the Authorization header in the request).
    -fetch call (I've found sometimes we need to refetch the user data) this has been provided
        -perhaps we update some field but some other processing takes place on the server that changes the users fields
        -we can do it manually by calling user(data) which will set it
        -or you can perform a fetch request also if that's not possible.
    -token function...
    -simpler consitent code base
        -properly pakaged and minified distribution
    -bse64 token stuff removed there really is no readon for this
        -if you need to check this on your own intervals there is a `token` function and it can be put into a timeout on your own using `token` and `refresh` calls..
    -if you don't like the refresh call on boot
        -you can override the tokenExpired routine and check for whatever you like there, you can use `token` call to get the existing token.
        -you can also just override it and return false if you want to do it on your own and use `refresh` call manually.


    -overall file size ????? (compare this).

    *oauth2 support coming.



    **removed expiration check - actually this is just bloat and doesn't really need to be done on front end - let the server determine if it's expired.
        -since this would only fail once every ten or 14 days since most tokens are alive that long it seemed a bit excessive.
        -this also doesn't affect situations where the server would invalidate a token anyway (so it can still fail).
        -for those who REALLY need to check this and save that call - there is the `token` method this can be done on your own with 
            -maybe provide some callback or hook for this....

    -----


-all http methods just pass in directly into $http(data).then(success, error);
-this means you can load up the data with whatever works for you, (body, params, url, method, etc).
    -appropriate defaults are set for you already such as url, method and redirect
    -these can be overridden on in the initial options or on a per request basis.

registerData
    -autoLogin can set this to perform a register and automatically login
    -you can also set the rememberMe option as you would with login. Of course in this case it's only used with the auto login option.
    -redirect: can be string or object

loginData
    -redirect:
    -rememberMe:

