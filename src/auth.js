var __utils  = require('./lib/utils.js'),
    __token  = require('./lib/token.js'),
    __cookie = require('./lib/cookie.js')

module.exports = function () {

    // Private (used double underscore __).

    function __duckPunch(methodName, data) {
        var _this = this,
            success = data.success;
        
        data = __utils.extend(this.options[methodName + 'Data'], [data]);
        
        data.success = function (res) {
            data.success = success;

            _this.options[methodName + 'Process'].call(_this, res, data);
        };

        this.options._http.call(this, data);
    }

    function __bindContext(methodName, data) {
        var _auth = this.$auth;

        _auth.options[methodName + 'Perform'].call(_auth, _auth.options._bindData.call(_auth, data, this));
    }
    
    // Overrideable

    function _routerBeforeEach(cb) {

        if (this.options.tokenExpired.call(this)) {
            this.options.refreshPerform.call(this, {});
        }

        if (this.watch.authenticated === null && __token.get.call(this)) {
            if ( ! __cookie.exists.call(this)) {
                this.options.logoutProcess.call(this, null, {});

                this.watch.loaded = true

                return cb.call(this);
            }

            this.watch.authenticated = false
            this.options.fetchPerform.call(this, {success: cb, error: cb});
        } else {
            this.watch.loaded = true;
            return cb.call(this);
        }
    }

    function _transitionEach(routeAuth, next) {
        routeAuth = __utils.toArray(routeAuth);

        if (routeAuth && (routeAuth === true || routeAuth.constructor === Array)) {
            if ( ! this.check()) {
                this.options._routerReplace.call(this, this.options.authRedirect);
            }
            else if (routeAuth.constructor === Array && ! __utils.compare(routeAuth, this.watch.data[this.options.rolesVar])) {
                this.options._routerReplace.call(this, this.options.forbiddenRedirect);
            }
            else {
                return next();
            }
        }
        else if (routeAuth === false && this.check()) {
            this.options._routerReplace.call(this, this.options.notFoundRedirect);
        }
        else {
            return next();
        }
    }

    function _requestIntercept(req) {
        var token = __token.get.call(this);

        if (token) {
            if (this.options.authType === 'bearer') {
                this.options._setHeaders.call(this, req, {
                    authorization: 'Bearer: ' + token
                });
            }
            else if (this.options.authType === 'basic') {
                this.options._setHeaders.call(this, req, {
                    authorization: token
                });
            }
        }

        return req;
    }
    
    function _responseIntercept(res) {
        var token = '';

        token = this.options._getHeaders.call(this, res).authorization;

        if (token) {
            token = token.split('Bearer ');

            __token.set.call(this, null, token[token.length > 1 ? 1 : 0]);
        }

        token = this.options._httpData.call(this, res)[this.options.tokenVar];

        if (token) {
            token = token.split('Bearer ');

            __token.set.call(this, null, token[token.length > 1 ? 1 : 0]);
        }   

        if (this.options._invalidToken) {
            this.options._invalidToken.call(this, res);
        }
    }

    function _parseUserData(data) {
        return data.data;
    }

    function _check(role) {
        if (this.watch.data !== null) {
            if (role) {
                return __utils.compare(role, this.watch.data[this.options.rolesVar]);
            }

            return true;
        }

        return false;
    }

    function _tokenExpired () {
        return ! this.watch.loaded && __token.get.call(this);
    }

    function _cookieDomain () {
        return window.location.hostname;
    }

    function _getUrl () {
        var port = window.location.port

        return window.location.protocol + '//' + window.location.hostname + (port ? ':' + port : '')
    }

    function _fetchPerform(data) {
        var _this = this,
            error = data.error;

        data.error = function (res) {
            _this.watch.loaded = true;

            if (error) { error.call(_this, res); }
        };

        __duckPunch.call(this, 'fetch', data);
    }

    function _fetchProcess(res, data) {
        this.watch.authenticated = true;
        this.watch.data = this.options.parseUserData.call(this, this.options._httpData.call(this, res));
        this.watch.loaded = true;

        if (data.success) { data.success.call(this, res); }
    }

    function _refreshPerform(data) {
        __duckPunch.call(this, 'refresh', data);
    }

    function _refreshProcess(res, data) {
        if (data.success) { data.success.call(this, res); }
    }

    function _registerPerform(data) {
        __duckPunch.call(this, 'register', data);
    }

    function _registerProcess(res, data) {
        if (data.autoLogin === true) {
            data = __utils.extend(data, [this.options.loginData]);

            this.options.loginPerform.call(this, data);
        }
        else {
            if (data.success) { data.success.call(this, res); }

            if (data.redirect) {
                this.options._routerGo.call(this, data.redirect);
            }
        }
    }

    function _loginPerform(data) {
        __duckPunch.call(this, 'login', data);
    }

    function _loginProcess(res, data) {
        var _this = this;

        __cookie.set.call(this, data.rememberMe);

        this.authenticated = null;

        this.options.fetchPerform.call(this, {
            success: function () {
                if (data.success) { data.success.call(this, res); }

                if (data.redirect && _this.options.check.call(_this)) {
                    _this.options._routerGo.call(_this, data.redirect);
                }
            }
        });
    }

    function _logoutPerform(data) {
        data = __utils.extend(this.options.logoutData, [data || {}]);
        
        if (data.makeRequest) {
            __duckPunch.call(this, 'logout', data);
        }
        else {
            this.options.logoutProcess.call(this, null, data);
        }
    }

    function _logoutProcess(res, data) {
        __cookie.delete.call(this);

        __token.delete.call(this, 'other');
        __token.delete.call(this, 'default');

        this.authenticated = false;
        this.watch.data = null;

        if (data.success) { data.success.call(this, res, data); }

        if (data.redirect) {
            this.options._routerGo.call(this, data.redirect);
        }
    }

    function _loginOtherPerform(data) {
        var success,
            token = this.token.call(this); // (admin) token

        data = data || {};

        success = data.success;

        data.success = function () {

            // Reshuffle tokens here...
            __token.set.call(this, 'other', this.token.call(this));
            __token.set.call(this, 'default', token);

            if (success) { success.call(this); }
        };

        __duckPunch.call(this, 'loginOther', data);
    }

    function _loginOtherProcess(res, data) {
        var _this = this;

        this.options.fetchPerform.call(this, {
            success: function () {
                if (data.success) { data.success.call(this, res); }

                if (data.redirect && _this.options.check.call(_this)) {
                    _this.options._routerGo.call(_this, data.redirect);
                }
            }
        });
    }

    function _logoutOtherPerform(data) {
        data = __utils.extend(this.options.logoutOtherData, [data || {}]);
        
        if (data.makeRequest) {
            __duckPunch.call(this, 'logoutOther', data);
        }
        else {
            this.options.logoutOtherProcess.call(this, null, data);
        }
    }

    function _logoutOtherProcess(res, data) {
        __token.delete.call(this, 'other');

        this.options.fetchPerform.call(this, {
            success: function () {
                if (data.success) { data.success.call(this, res, data); }

                if (data.redirect) {
                    this.options._routerGo.call(this, data.redirect);
                }
            }
        });
    }

    function _oauth2Perform(data) {
        var state = {},
            params = '',
            query = {};
        
        // console.log(data);

        if (data.code === true) {
            data = __utils.extend(this.options[data.provider + 'Data'], [data]);

            try {
                if (data.query.state) {
                    state = JSON.parse(decodeURIComponent(data.query.state));
                }
            }
            catch (e) {
                console.error('vue-auth:error There was an issue retrieving the state data.');
                state = {};
            }

            data.rememberMe = state.rememberMe === true;
            data.state = state;

            this.options.loginPerform.call(this, data);
        } else {
            data = __utils.extend(this.options[data.provider + 'Oauth2Data'], [data]);

            // console.log(data);

            data.redirect = data.redirect.call(this);

            data.state = data.state || {};
            data.state.rememberMe = data.rememberMe === true;

            params = '?client_id=' + data.clientId + '&redirect_uri=' + data.redirect + '&scope=' + data.scope + '&response_type=code&state=' + encodeURIComponent(JSON.stringify(data.state));

            window.location = data.url + params;
        }
    }

    function _oauth2Process() {

    }

    var defaultOptions = {

        // Variables

        tokenVar:          'token',
        tokenName:         'auth-token',
        tokenHeader:       'Authorization',

        authType:          'bearer',
        rolesVar:          'roles',

        // Objects

        authRedirect:       {path: '/login'},
        forbiddenRedirect:  {path: '/403'},
        notFoundRedirect:   {path: '/404'},

        registerData:       {url: 'auth/register',     method: 'POST', redirect: '/login'},
        loginData:          {url: 'auth/login',        method: 'POST', redirect: '/'},
        logoutData:         {url: 'auth/logout',       method: 'POST', redirect: '/', makeRequest: false},
        oauth1Data:         {url: 'auth/login',        method: 'POST'},
        fetchData:          {url: 'auth/user',         method: 'GET'},
        refreshData:        {url: 'auth/refresh',      method: 'GET'},
        loginOtherData:     {url: 'auth/login-other',  method: 'POST', redirect: '/'},
        logoutOtherData:    {url: 'auth/logout-other', method: 'POST', redirect: '/admin', makeRequest: false},

        facebookData:       {url: 'auth/facebook',     method: 'POST', redirect: '/'},
        googleData:         {url: 'auth/google',       method: 'POST', redirect: '/'},
        
        facebookOauth2Data: {
            url: 'https://www.facebook.com/v2.5/dialog/oauth',
            redirect: function () { return this.options.getUrl() + '/login/facebook'; },
            clientId: '',
            scope: 'email'
        },
        googleOauth2Data: {
            url: 'https://accounts.google.com/o/oauth2/auth',
            redirect: function () { return this.options.getUrl() + '/login/google'; },
            clientId: '',
            scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
        },

        // Internal

        getUrl:             _getUrl,
        cookieDomain:       _cookieDomain,
        parseUserData:      _parseUserData,
        tokenExpired:       _tokenExpired,
        check:              _check,
        
        transitionEach:     _transitionEach,
        routerBeforeEach:   _routerBeforeEach,
        requestIntercept:   _requestIntercept,
        responseIntercept:  _responseIntercept,

        // Contextual

        registerPerform:    _registerPerform,
        registerProcess:    _registerProcess,

        loginPerform:       _loginPerform,
        loginProcess:       _loginProcess,

        logoutPerform:      _logoutPerform,
        logoutProcess:      _logoutProcess,
        
        fetchPerform:       _fetchPerform,
        fetchProcess:       _fetchProcess,

        refreshPerform:     _refreshPerform,
        refreshProcess:     _refreshProcess,

        loginOtherPerform:  _loginOtherPerform,
        loginOtherProcess:  _loginOtherProcess,
        
        logoutOtherPerform: _logoutOtherPerform,
        logoutOtherProcess: _logoutOtherProcess,

        oauth2Perform:      _oauth2Perform,
        oauth2Process:      _oauth2Process,
    };

    function Auth(options, driver) {
 
        this.currentToken = null;

        this.options = __utils.extend(defaultOptions, [driver || {}, options || {}]);

        this.watch = this.options._watch.call(this, {
            data: null,
            loaded: false,
            authenticated: null
        });

        driver._init.call(this);
    }

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

    return Auth;
};