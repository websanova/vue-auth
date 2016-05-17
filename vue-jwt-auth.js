/*
    https://github.com/websanova/vue-jwt-auth
    rob@websanova.com
    Version 0.2.0
 */

module.exports = (function () {

    var _ctx = null;

    function Auth(options) {
        this.authenticated = null;
        this.loaded = false;
        this.data = null;
        this.set = false;

        this.options = {
            authType          : options.authType          || 'bearer',

            fetchUrl          : options.fetchUrl          || '/auth/user',
            tokenUrl          : options.tokenUrl          || '/auth/token',
            loginUrl          : options.loginUrl          || '/auth/login',
            // registerUrl       : options.registerUrl       || '/auth/register',

            loginRedirect     : options.loginRedirect     || '/login',
            notFoundRedirect  : options.notFoundRedirect  || '/404',
            forbiddenRedirect : options.forbiddenRedirect || '/403',

            rolesVar          : options.rolesVar          || 'roles',
            tokenVar          : options.tokenVar          || 'token',
            tokenName         : options.tokenName         || 'jwt-auth-token',
            
            cookieDomain      : options.cookieDomain      || _cookieDomain,
            userData          : options.userData          || _userData,
            beforeEach        : options.beforeEach        || _beforeEach,
            
            facebookUrl       : options.facebookUrl       || '/auth/facebook',
            facebookAppId     : options.facebookAppId     || '',
            facebookScope     : options.facebookScope     || 'email',
            facebookRedirect  : options.facebookRedirect  || _getUrl() + '/login/facebook',
            
            googleUrl         : options.googleUrl         || '/auth/google',
            googleAppId       : options.googleAppId       || '',
            googleScope       : options.googleScope       || 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read',
            googleRedirect    : options.googleRedirect    || _getUrl() + '/login/google'
        };
    }

    function _beforeEach(transition) {
        var roles,
            auth = _toArray(transition.to.auth);

        if (auth && (auth === true || auth.constructor === Array)) {
            if ( ! this.check()) {
                _ctx.$router.replace(this.options.loginRedirect);
            }
            else if (auth.constructor === Array && ! _compare(auth, _toArray(this.user()[this.options.rolesVar]))) {
                _ctx.$router.replace(this.options.forbiddenRedirect);
            }
            else {
                return transition.next();
            }
        }
        else if (auth === false && this.check()) {
            _ctx.$router.replace(this.options.notFoundRedirect);
        }
        else {
            return transition.next();
        }
    }

    function _userData(resp) {
        return resp.data;
    }

    function _cookieDomain() {
        return window.location.hostname;
    }

    function _getToken() {
        return localStorage.getItem(this.options.tokenName);
    }

    function _setToken(token) {
        if (token) {
            localStorage.setItem(this.options.tokenName, token);
        }
    }

    function _removeToken() {
        localStorage.removeItem(this.options.tokenName);
    }

    function _setRememberMeCookie(rememberMe) {
        _setCookie.call(this,
            'rememberMe',
            rememberMe === true ? 'true' : 'false',
            rememberMe === true ? 12096e5 : undefined
        );
    }

    function _removeRememberMeCookie() {
        _setCookie.call(this, 'rememberMe', 'false', -12096e5);
    }

    function _login(path, data, rememberMe, redirectUrl, options) {
        var _this = this;

        options = options || {};

        _ctx.$http.post(path, data, function(resp) {
            _setRememberMeCookie.call(_this, rememberMe);

            _setToken.call(_this, resp[_this.options.tokenVar]);

            _this.authenticated = null;
            
            if (options.success) {
                options.success.call(_ctx);
            }

            _this.fetch(function () {
                if (redirectUrl && _this.check()) {
                    _ctx.$router.go(redirectUrl);
                }
            });
        }, {
            error: function () {
                if (options.error) {
                    options.error.call(_ctx);
                }
            }
        });
    }

    function _refreshToken() {
        if (_getToken.call(this)) {
            _ctx.$http.get(this.options.tokenUrl);
        }
    }

    function _social(type, data, rememberMe, redirectUrl, options) {
        var _this  = this,
            state,
            params = '';

        if (data.code) {
            state = JSON.parse(_ctx.$route.query.state);

            _login.call(this, this.options[type + 'Url'], data, state.rememberMe, state.redirect, options);
        }
        else {
            data.state = data.state || {};
            data.state.rememberMe = rememberMe === true ? true : false;
            data.state.redirect = redirectUrl ? redirectUrl : '';

            data.appId = data.appId || this.options[type + 'AppId'];
            data.scope = data.scope || this.options[type + 'Scope'];
            data.redirect = data.redirect || this.options[type + 'Redirect'];

            params = '?client_id=' + data.appId + '&redirect_uri=' + data.redirect + '&scope=' + data.scope + '&response_type=code&state=' + JSON.stringify(data.state);

            if (type === 'facebook') {
                window.location = 'https://www.facebook.com/v2.5/dialog/oauth' + params;
            }
            else if (type === 'google') {
                window.location = 'https://accounts.google.com/o/oauth2/auth' + params;
            }
        }
    }

    function _getUrl() {
        var port = window.location.port;

        return window.location.protocol + '//' + window.location.hostname + (port ? ':' + port : '');
    }

    function _setCookie(name, value, timeOffset) {
        var domain  = this.options.cookieDomain.call(this),
            expires = (new Date((new Date).getTime() + timeOffset)).toUTCString();

        document.cookie = (name + '=' + value + '; domain=' + domain + '; path=/;' + (timeOffset ? ' expires=' + expires + ';' : '') );
    }

    function _compare(one, two) {
        var i, ii;

        one = _toArray(one);
        two = _toArray(two);

        if (one.constructor !== Array || two.constructor !== Array) {
            return false;
        }

        for (i = 0, ii = one.length; i < ii; i++) {
            if (two.indexOf(one[i]) >= 0) {
                return true;
            }
        }

        return false;
    }

    function _toArray(val) {
        return (typeof val) === 'string' ? [val] : val;
    }

    Auth.prototype.fetch = function(cb) {
        var _this = this;

        cb = cb || function () {};

        if ( ! this.loaded) {
            _refreshToken.call(this);
        }

        if (this.authenticated === null && _getToken.call(this)) {
            if ( ! document.cookie.match(/rememberMe/)) {
                _removeToken.call(this);
                _this.loaded = true;
                
                return cb();
            }

            this.authenticated = false;
            
            _ctx.$http.get('/auth/user', function(resp) {
                _this.authenticated = true;
                _this.data = _this.options.userData.call(_this, resp);
                _this.loaded = true;

                return cb();
            }, {
                error: function() {
                    _this.loaded = true;

                    return cb();
                }
            });
        }
        else {
            _this.loaded = true;

            return cb();
        }        
    };

    Auth.prototype.context = function(ctx) {
        if (ctx) {
            if ( ! this.set) {
                ctx[ctx.set ? 'set' : '$set']('__auth', this);
                this.set = true;
            }

            _ctx = ctx;
        }

        return _ctx;
    };

    Auth.prototype.token = function (token) {
        if (token) { _setToken.call(this, token); }

        return _getToken.call(this);
    };

    Auth.prototype.ready = function() {
        return this.loaded;
    };

    Auth.prototype.check = function(role) {
        if (this.data !== null) {
            if (role) {
                return _compare(role, this.data[this.options.rolesVar]);
            }

            return true;
        }

        return false;
    };

    Auth.prototype.user = function() {
        return this.data;
    };

    Auth.prototype.login = function(data, rememberMe, redirectUrl, options) {
        _login.call(this, this.options.loginUrl, data, rememberMe, redirectUrl, options);
    };

    Auth.prototype.facebook = function(data, rememberMe, url, options) {
        _social.call(this, 'facebook', data, rememberMe, url, options);
    };

    Auth.prototype.google = function(data, rememberMe, url, options) {
        _social.call(this, 'google', data, rememberMe, url, options);
    };

    Auth.prototype.logout = function(url) {
        _removeRememberMeCookie.call(this);
        _removeToken.call(this);

        this.authenticated = false;
        this.data = null;

        if (!this.check()) {
            _ctx.$router.go(url || '/');
        }
    };

    return function install(Vue, options) {
        var auth = new Auth(options || {});

        Vue.auth = Auth;

        Object.defineProperties(Vue.prototype, {
            $auth: {
                get: function () {
                    auth.context(this);

                    return auth;
                }
            }
        });

        // Setup before each route change check.
        Vue.router.beforeEach(function (transition) {

            // Make sure to use $auth.fetch so context is loaded.
            transition.to.router.app.$auth.fetch(function () {
                auth.options.beforeEach.bind(auth)(transition);
            });
        });

        Vue.http.interceptors.push({

            // Send auth token on each request.
            request: function (req) {
                var token = auth.token();

                if (token) {
                    if (auth.options.authType === 'bearer') {
                        req.headers.Authorization = 'Bearer: ' + token;
                    }
                }

                return req;
            },

            // Reset auth token if provided in response.
            response: function (res) {
                var authorization = res.headers('authorization');

                if (authorization) {
                    authorization = authorization.split(' ');

                    if (authorization[1]) {
                        _setToken.call(auth, authorization[1]);
                    }
                }

                return res;
            }
        });
    }
})();