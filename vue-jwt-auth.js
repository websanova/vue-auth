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
            loginAsUrl        : options.loginAsUrl        || '/auth/login-as',

            authRedirect      : options.authRedirect      || '/login',
            loginRedirect     : options.loginRedirect     || '/account',
            logoutRedirect    : options.logoutRedirect    || '/',
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
            googleRedirect    : options.googleRedirect    || _getUrl() + '/login/google',

            // twitterUrl       : options.twitterUrl       || '/auth/twitter',
            // twitterAppId     : options.twitterAppId     || '',
            // twitterClientId  : options.twitterClientId  || '',
            // twitterScope     : options.twitterScope     || 'email',
            // twitterRedirect  : options.twitterRedirect  || _getUrl() + '/login/twitter',
        };
    }

    function _beforeEach(transition) {
        var roles,
            auth = _toArray(transition.to.auth);

        if (auth && (auth === true || auth.constructor === Array)) {
            if ( ! this.check()) {
                _ctx.$router.replace(this.options.authRedirect);
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
        return localStorage.getItem( (this.other() ? 'login-as-' : '') + this.options.tokenName);
    }

    function _setToken(token) {
        if (token) {
            localStorage.setItem( (this.other() ? 'login-as-' : '') + this.options.tokenName, token);
        }
    }

    function _removeToken() {
        localStorage.removeItem( (this.other() ? 'login-as-' : '') + this.options.tokenName);
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

    function _login(path, data, rememberMe, options) {
        var _this = this;

        options = options || {};

        _ctx.$http.post(path, data, function(resp) {
            _setRememberMeCookie.call(_this, rememberMe);

            _setToken.call(_this, resp[_this.options.tokenVar]);

            _this.authenticated = null;
            
            if (options.success) {
                options.success.call(_ctx, resp);
            }

            _this.fetch(function () {
                if (_this.options.loginRedirect && _this.check()) {
                    _ctx.$router.go(_this.options.loginRedirect);
                }
            });
        }, {
            error: function (resp) {
                if (options.error) {
                    options.error.call(_ctx, resp);
                }
            }
        });
    }

    function _fetch(cb) {
        var _this = this;

        cb = cb || function () {};

        _ctx.$http.get(this.options.fetchUrl, function(resp) {
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

    function _refreshToken() {
        if (_getToken.call(this)) {
            _ctx.$http.get(this.options.tokenUrl);
        }
    }

    function _social(type, data, rememberMe, options) {
        var _this  = this,
            state,
            params = '';

        data = data || {};

        if (data.code) {
            state = JSON.parse(_ctx.$route.query.state);

            _login.call(this, this.options[type + 'Url'], data, state.rememberMe, state.redirect, options);
        }
        else {
            data.state = data.state || {};
            data.state.rememberMe = rememberMe === true ? true : false;
            data.state.redirect = this.options.loginRedirect || '';

            data.appId = data.appId || this.options[type + 'AppId'];
            data.clientId = data.clientId || this.options[type + 'ClientId'];
            data.scope = data.scope || this.options[type + 'Scope'];
            data.redirect = data.redirect || this.options[type + 'Redirect'];

            params = '?client_id=' + data.appId + '&redirect_uri=' + data.redirect + '&scope=' + data.scope + '&response_type=code&state=' + JSON.stringify(data.state);

            if (type === 'facebook') {
                window.location = 'https://www.facebook.com/v2.5/dialog/oauth' + params;
            }
            else if (type === 'google') {
                window.location = 'https://accounts.google.com/o/oauth2/auth' + params;
            }
            // else if (type === 'twitter') {
            //     window.location = 'https://oauth.twitter.com/2/authorize?oauth_callback_url=' + data.redirect + '&oauth_mode=flow_web_client&oauth_client_identifier=' + data.appId + '&redirect_uri=' + data.redirect + '&response_type=token&client_id=' + data.clientId;
            // }
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
        cb = cb || function () {};

        if ( ! this.loaded) {
            _refreshToken.call(this);
        }

        if (this.authenticated === null && _getToken.call(this)) {
            if ( ! document.cookie.match(/rememberMe/)) {
                _removeToken.call(this);
                this.loaded = true;
                
                return cb();
            }

            this.authenticated = false;
            
            _fetch.call(this, cb);
        }
        else {
            this.loaded = true;

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

    Auth.prototype.login = function(data, rememberMe, options) {
        _login.call(this, this.options.loginUrl, data, rememberMe, options);
    };

    Auth.prototype.facebook = function(data, rememberMe, options) {
        _social.call(this, 'facebook', data, rememberMe, options);
    };

    Auth.prototype.google = function(data, rememberMe, options) {
        _social.call(this, 'google', data, rememberMe, options);
    };

    // Auth.prototype.twitter = function(data, rememberMe, url, options) {
    //     _social.call(this, 'twitter', data, rememberMe, url, options);
    // };

    Auth.prototype.logout = function() {
        _removeRememberMeCookie.call(this);
        
        // Need to call twice to remove both tokens.
        _removeToken.call(this);
        _removeToken.call(this);

        this.authenticated = false;
        this.data = null;

        if (_ctx.$route.auth && this.options.logoutRedirect) {
            _ctx.$router.go(this.options.logoutRedirect);
        }
    };

    Auth.prototype.loginAs = function(data, options) {
         var _this = this;

        options = options || {};

        _ctx.$http.post(this.options.loginAsUrl, data, function(resp) {
            localStorage.setItem('login-as-' + _this.options.tokenName, resp[_this.options.tokenVar]);
            
            if (options.success) {
                options.success.call(_ctx, resp);
            }

            _fetch.call(_this, function () {
                if (_this.options.loginRedirect && _this.check()) {
                    _ctx.$router.go(_this.options.loginRedirect);
                }
            });
        }, {
            error: function (resp) {
                if (options.error) {
                    options.error.call(_ctx, resp);
                }
            }
        });
    };

    Auth.prototype.logoutAs = function(options) {
        var _this = this;

        localStorage.removeItem('login-as-' + this.options.tokenName);
        
        _fetch.call(this, function () {
            if (_ctx.$route.auth && _this.options.logoutRedirect) {
                _ctx.$router.go(_this.options.logoutRedirect);
            }
        });
    };

    Auth.prototype.other = function() {
        this.data; // Weird but need this to trigger a state change check here. NO idea why.

        return localStorage.getItem('login-as-' + this.options.tokenName);
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