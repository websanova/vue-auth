var __utils  = require('./lib/utils.js'),
    __token  = require('./lib/token.js'),
    __cookie = require('./lib/cookie.js')

module.exports = function () {

    // Private (used double underscore __).

    var __transitionPrev = null,
        __transitionThis = null,
        __transitionRedirecType = null;

    function __duckPunch(methodName, data) {
        var _this = this,
            success = data.success;

        data = __utils.extend(this.options[methodName + 'Data'], [data]);

        data.success = function (res) {
            data.success = success;

            _this.options[methodName + 'Process'].call(_this, res, data);
        };

        this.options.http._http.call(this, data);
    }

    function __bindContext(methodName, data) {
        var _auth = this.$auth;

        _auth.options[methodName + 'Perform'].call(_auth, _auth.options.router._bindData.call(_auth, data, this));
    }

    // Overrideable

    function _checkAuthenticated(cb) {
        if (this.watch.authenticated === null && __token.get.call(this)) {
            if ( ! __cookie.exists.call(this)) {
                this.options.logoutProcess.call(this, null, {});

                this.watch.loaded = true;

                return cb.call(this);
            }

            this.watch.authenticated = false;

            if (this.options.fetchData.enabled) {
                this.options.fetchPerform.call(this, {
                    success: cb,
                    error: cb,
                    enabled: true
                });
            }
            else {
                this.options.fetchProcess.call(this, {}, {});
                return cb.call(this);
            }
        } else {
            this.watch.loaded = true;
            return cb.call(this);
        }
    }

    function _routerBeforeEach(cb) {
        var _this = this;

        if (this.watch.authenticated && !__token.get.call(this)) {
            this.options.logoutProcess.call(this, null, {});
        }

        if (this.options.refreshData.enabled && this.options.tokenExpired.call(this)) {
            this.options.refreshPerform.call(this, {
                success: function () {
                    this.options.checkAuthenticated.call(_this, cb);
                }
            });

            return;
        }

        _checkAuthenticated.call(this, cb);
    }

    function _transitionEach(transition, routeAuth, cb) {
        routeAuth = __utils.toArray(routeAuth);
        
        __transitionPrev = __transitionThis;
        __transitionThis = transition;
        
        if (routeAuth && (routeAuth === true || routeAuth.constructor === Array)) {
            if ( ! this.check()) {
                __transitionRedirecType = 401;
                cb.call(this, this.options.authRedirect);
            }
            else if (routeAuth.constructor === Array && ! __utils.compare(routeAuth, this.watch.data[this.options.rolesVar])) {
                __transitionRedirecType = 403;
                cb.call(this, this.options.forbiddenRedirect);
            }
            else {
                this.watch.redirect = __transitionRedirecType ? {type: __transitionRedirecType, from: __transitionPrev, to: __transitionThis} : null;
                __transitionRedirecType = null;

                return cb();
            }
        }
        else if (routeAuth === false && this.check()) {
            __transitionRedirecType = 404;
            cb.call(this, this.options.notFoundRedirect);
        }
        else {
            this.watch.redirect = __transitionRedirecType ? {type: __transitionRedirecType, from: __transitionPrev, to: __transitionThis} : null;
            __transitionRedirecType = null;

            return cb();
        }
    }

    function _requestIntercept(req) {
        var token = __token.get.call(this);

        if (token) {
            this.options.auth.request.call(this, req, token);
        }

        return req;
    }

    function _responseIntercept(res) {
        var token;

        if (this.options.http._invalidToken) {
            this.options.http._invalidToken.call(this, res);
        }

        token = this.options.auth.response.call(this, res);

        if (token) {
            __token.set.call(this, null, token);
        }
    }

    function _parseUserData(data) {
        return data.data || {};
    }

    function _parseOauthState(data) {
        return JSON.parse(decodeURIComponent(data));
    }

    function _check(role) {
        if (this.watch.authenticated === true) {
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

        if (this.watch.authenticated !== true && !data.enabled) {
            _fetchProcess.call(this, {}, data);
        }
        else {
            __duckPunch.call(this, 'fetch', data);
        }
    }

    function _fetchProcess(res, data) {
        this.watch.authenticated = true;
        this.watch.data = this.options.parseUserData.call(this, this.options.http._httpData.call(this, res));
        
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
            data = __utils.extend(data, [this.options.loginData, {redirect: data.redirect}]);

            this.options.loginPerform.call(this, data);
        }
        else {
            if (data.success) { data.success.call(this, res); }

            if (data.redirect) {
                this.options.router._routerGo.call(this, data.redirect);
            }
        }
    }

    function _loginPerform(data) {
        __duckPunch.call(this, 'login', data);
    }

    function _loginProcess(res, data) {
        var _this = this;

        __cookie.remember.call(this, data.rememberMe);

        this.authenticated = null;

        this.options.fetchPerform.call(this, {
            enabled: data.fetchUser,
            success: function () {
                if (data.success) { data.success.call(this, res); }

                if (data.redirect && _this.options.check.call(_this)) {
                    _this.options.router._routerGo.call(_this, data.redirect);
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
        __cookie.remove.call(this, 'rememberMe');

        __token.remove.call(this, this.options.tokenOtherName);
        __token.remove.call(this, this.options.tokenDefaultName);

        this.watch.authenticated = false;
        this.watch.data = null;

        if (data.success) { data.success.call(this, res, data); }

        if (data.redirect) {
            this.options.router._routerGo.call(this, data.redirect);
        }
    }

    function _loginOtherPerform(data) {
        var success,
            token = this.token.call(this); // (admin) token

        data = data || {};

        success = data.success;

        data.success = function () {

            // Reshuffle tokens here...
            __token.set.call(this, this.options.tokenOtherName, this.token.call(this));
            __token.set.call(this, this.options.tokenDefaultName, token);

            if (success) { success.call(this); }
        };

        __duckPunch.call(this, 'loginOther', data);
    }

    function _loginOtherProcess(res, data) {
        var _this = this;

        this.options.fetchPerform.call(this, {
            enabled: true,
            success: function () {
                if (data.success) { data.success.call(this, res); }

                if (data.redirect && _this.options.check.call(_this)) {
                    _this.options.router._routerGo.call(_this, data.redirect);
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
        __token.remove.call(this, this.options.tokenOtherName);

        this.options.fetchPerform.call(this, {
            enabled: true,
            success: function () {
                if (data.success) { data.success.call(this, res, data); }

                if (data.redirect) {
                    this.options.router._routerGo.call(this, data.redirect);
                }
            }
        });
    }

    function _oauth2Perform(data) {
        var state = {},
            params = '',
            query = {};

        if (data.code === true) {
            data = __utils.extend(this.options[data.provider + 'Data'], [data]);

            try {
                if (data.query.state) {
                    state = this.options.parseOauthState(data.query.state);
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

            data.redirect = data.redirect.call(this);

            data.state = data.state || {};
            data.state.rememberMe = data.rememberMe === true;

            params = '?client_id=' + data.clientId + '&redirect_uri=' + data.redirect + '&scope=' + data.scope + '&response_type=code&state=' + encodeURIComponent(JSON.stringify(data.state));

            window.location = data.url + params;
        }
    }

    var defaultOptions = {

        // Variables

        rolesVar:          'roles',
        tokenOtherName:    'other_auth_token',
        tokenDefaultName:  'default_auth_token',
        tokenStore:        ['localStorage', 'cookie'],

        // Objects

        authRedirect:       {path: '/login'},
        forbiddenRedirect:  {path: '/403'},
        notFoundRedirect:   {path: '/404'},

        registerData:       {url: 'auth/register',     method: 'POST', redirect: '/login'},
        loginData:          {url: 'auth/login',        method: 'POST', redirect: '/', fetchUser: true},
        logoutData:         {url: 'auth/logout',       method: 'POST', redirect: '/', makeRequest: false},
        oauth1Data:         {url: 'auth/login',        method: 'POST'},
        fetchData:          {url: 'auth/user',         method: 'GET', enabled: true},
        refreshData:        {url: 'auth/refresh',      method: 'GET', enabled: true, interval: 30, headers: {'Cache-Control': 'no-cache, no-store'}},
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
        parseOauthState:    _parseOauthState,
        tokenExpired:       _tokenExpired,
        check:              _check,
        checkAuthenticated: _checkAuthenticated,

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

        oauth2Perform:      _oauth2Perform
    };

    function Auth(Vue, options) {
        var i, ii, msg, drivers = ['auth', 'http', 'router'];
        
        this.currentToken = null;

        this.options = __utils.extend(defaultOptions, [options || {}]);
        this.options.Vue = Vue;

        this.watch = new this.options.Vue({
            data: function () {
                return {
                    data: null,
                    loaded: false,
                    redirect: null,
                    authenticated: null
                };
            }
        });

        // Check drivers.
        for (i = 0, ii = drivers.length; i < ii; i++) {
            if ( ! this.options[drivers[i]]) {
                console.error('Error (@websanova/vue-auth): "' + drivers[i] + '" driver must be set.');
                return;
            }

            if (this.options[drivers[i]]._init) {
                msg = this.options[drivers[i]]._init.call(this);

                if (msg) {
                    console.error('Error (@websanova/vue-auth): ' + msg);
                    return;
                }
            }
        }

        // Set refresh interval.
        if (this.options.refreshData.interval && this.options.refreshData.interval > 0) {
            setInterval(function () {
                if (this.options.refreshData.enabled && !this.options.tokenExpired.call(this)) {
                    this.options.refreshPerform.call(this, {});
                }
            }.bind(this), this.options.refreshData.interval * 1000 * 60); // In minutes.
        }

        // Init interceptors.
        this.options.router._beforeEach.call(this, this.options.routerBeforeEach, this.options.transitionEach);
        this.options.http._interceptor.call(this, this.options.requestIntercept, this.options.responseIntercept);
    }

    Auth.prototype.ready = function (cb) {
        return this.watch.loaded;
    };

    Auth.prototype.redirect = function () {
        return this.watch.redirect;
    };

    Auth.prototype.user = function (data) {
        if (data) {
            this.watch.data = data;
        }

        return this.watch.data || {};
    };

    Auth.prototype.check = function (role) {
        return this.options.check.call(this, role);
    };

    Auth.prototype.other = function () {
        this.watch.data; // To fire watch

        return __token.get.call(this, this.options.tokenOtherName) ? true : false;
    };

    Auth.prototype.enableOther = function (data) {
        if (this.other()) {
            this.currentToken = null;
        }
    };

    Auth.prototype.disableOther = function (data) {
        if (this.other()) {
            this.currentToken = this.options.tokenDefaultName;
        }
    };

    Auth.prototype.token = function (name, token) {
        if (token) {
            __token.set.call(this, name, token);
        }

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
