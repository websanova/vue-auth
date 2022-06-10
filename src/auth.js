import * as __utils  from './lib/utils.js';
import * as __token  from './lib/token.js';
import * as __cookie from './lib/cookie.js';

var __auth = null;

var __defaultOptions = {

    // Variables

    rolesKey:            'roles',
    rememberKey:         'auth_remember',
    staySignedInKey:     'auth_stay_signed_in',
    tokenDefaultKey:     'auth_token_default',
    tokenImpersonateKey: 'auth_token_impersonate',
    stores:              ['storage', 'cookie'],

    cookie: {
        Path:     '/',
        Domain:   null,
        Secure:   true,
        Expires:  12096e5,
        SameSite: 'None',
    },

    // Redirects

    authRedirect:       {path: '/login'},
    forbiddenRedirect:  {path: '/403'},
    notFoundRedirect:   {path: '/404'},

    // Http

    registerData:       {url: 'auth/register',      method: 'POST', redirect: '/login',                  autoLogin: false           },
    loginData:          {url: 'auth/login',         method: 'POST', redirect: '/',      fetchUser: true, staySignedIn: true         },
    logoutData:         {url: 'auth/logout',        method: 'POST', redirect: '/',                       makeRequest: false         },
    fetchData:          {url: 'auth/user',          method: 'GET',                                       enabled: true              },
    refreshData:        {url: 'auth/refresh',       method: 'GET',                                       enabled: true, interval: 30},
    impersonateData:    {url: 'auth/impersonate',   method: 'POST', redirect: '/',      fetchUser: true                             },
    unimpersonateData:  {url: 'auth/unimpersonate', method: 'POST', redirect: '/admin', fetchUser: true, makeRequest: false         },
    oauth2Data:         {url: 'auth/social',        method: 'POST', redirect: '/',      fetchUser:true                              },

    // External

    getUrl: _getUrl,
    getCookieDomain: _getCookieDomain,
    parseUserData: _parseUserData
};

function _isAccess(role, key) {
    if (__auth.$vm.state.authenticated === true) {
        if (role) {
            return __utils.compare(role, __utils.getProperty((__auth.$vm.state.data || {}), (key || __auth.options.rolesKey)));
        }

        return true;
    }

    return false;
}

function _isTokenExpired() {
    return ! __token.get.call(__auth);
}

function _getAuthMeta(transition) {
    var auth,
        authRoutes;

    if (transition.to) {
        auth = transition.to.auth;
    } else {
        authRoutes = transition.matched.filter(function (route) {
            return Object.prototype.hasOwnProperty.call(route.meta, 'auth');
        });

        // matches the nested route, the last one in the list
        if (authRoutes.length) {
            auth = authRoutes[authRoutes.length - 1].meta.auth;
        }
    }

    return auth;
}

function _getCookieDomain() {
    return window.location.hostname;
}

function _getUrl() {
    var port = window.location.port

    return window.location.protocol + '//' + window.location.hostname + (port ? ':' + port : '');
}

function _getRemember() {
    return __token.get.call(__auth, __auth.options.rememberKey);
}

function _setUser(data) {
    __auth.$vm.state.data = data;
}

function _setLoaded(loaded) {
    __auth.$vm.state.loaded = loaded;
}

function _setAuthenticated(authenticated) {
    __auth.$vm.state.loaded = true;
    __auth.$vm.state.authenticated = authenticated;
}

function _setStaySignedIn(staySignedIn) {
    if (staySignedIn === true) {
        __token.set.call(__auth, __auth.options.staySignedInKey, 'true', false);
    }
    else {
        __token.remove.call(__auth, __auth.options.staySignedInKey);
    }
}

function _setRemember(val) {
    if (val) {
        __token.set.call(__auth, __auth.options.rememberKey, val, false);
        __auth.$vm.state.remember = val;
    }
    else {
        __token.remove.call(__auth, __auth.options.rememberKey);
        __auth.$vm.state.remember = null;
    }
}

function _setTransitions (transition) {
    __auth.transitionPrev = __auth.transitionThis;
    __auth.transitionThis = transition;
}

function _parseUserData(data) {
    return data.data || {};
}

function _parseUserResponseData(res) {
    return __auth.options.parseUserData(__auth.drivers.http.httpData(res));
}

function _parseRedirectUri(uri) {
    uri = uri || '';

    if (/^https?:\/\//.test(uri)) {
        return uri;
    }

    return _getUrl() + '/' + uri.replace(/^\/|\/$/g, '');
}

function _parseRequestIntercept(req) {
    var token,
        tokenName;

    if (req && req.ignoreVueAuth) {
        return req;
    }

    if (
        req.impersonating === false &&
        __auth.impersonating()
    ) {
        tokenName = __auth.options.tokenDefaultKey;
    }

    token = __token.get.call(__auth, tokenName);

    if (token) {
        __auth.drivers.auth.request.call(__auth, req, token);
    }

    return req;
}

function _parseResponseIntercept(res, req) {
    var token;

    if (req && req.ignoreVueAuth) {
        return;
    }

    _processInvalidToken(res, __auth.transitionThis);

    token = __auth.drivers.auth.response.call(__auth, res);

    if (token) {
        __token.set.call(__auth, null, token, (__token.get.call(__auth, __auth.options.staySignedInKey) ? false : true));
    }
}

function _processInvalidToken(res, transition) {
    var auth,
        redirect;

    if (
        !__auth.drivers.http.invalidToken ||
        !__auth.drivers.http.invalidToken.call(__auth, res)
    ) {
        return;
    }

    if (transition) {
        auth = _getAuthMeta(transition);
    }

    if (auth) {
        redirect = auth.redirect || __auth.options.authRedirect;
    }

    _processLogout(redirect);
}

function _processRouterBeforeEach(cb) {
    var isTokenExpired = _isTokenExpired();

    if (
        isTokenExpired &&
        __auth.$vm.state.authenticated
    ) {
        _processLogout();
    }

    if (
        !isTokenExpired &&
        !__auth.$vm.state.loaded &&
        __auth.options.refreshData.enabled
    ) {
        __auth
            .refresh()
            .then(function() {
                _processAuthenticated(cb);
            }, function() {
                _processAuthenticated(cb);
            });

        return;
    }

    _processAuthenticated(cb);
}

function _processAuthenticated(cb) {
    if (
        __auth.$vm.state.authenticated === null &&
        __token.get.call(__auth)
    ) {
        if (__auth.options.fetchData.enabled) {
            __auth.fetch().then(cb, cb);
        }
        else {
            _processFetch({});

            return cb.call(__auth);
        }
    } else {
        _setLoaded(true);

        return cb.call(__auth);
    }
}

function _processTransitionEach(transition, routeAuth, cb) {
    var authRedirect = (routeAuth || '').redirect || __auth.options.authRedirect,
        forbiddenRedirect = (routeAuth || '').forbiddenRedirect || (routeAuth || '').redirect || __auth.options.forbiddenRedirect,
        notFoundRedirect = (routeAuth || '').notFoundRedirect || (routeAuth || '').redirect || __auth.options.notFoundRedirect,
        rolesKey = (routeAuth || '').rolesKey || __auth.options.rolesKey;

    routeAuth = __utils.toArray((routeAuth || '').roles !== undefined ? routeAuth.roles : routeAuth);

    if (routeAuth && (routeAuth === true || routeAuth.constructor === Array || __utils.isObject(routeAuth))) {
        if ( ! __auth.check()) {
            __auth.transitionRedirectType = 401;

            if (typeof authRedirect === 'function') {
                authRedirect = authRedirect(transition);
            }

            cb.call(__auth, authRedirect);
        }
        else if ((routeAuth.constructor === Array || __utils.isObject(routeAuth)) && ! __utils.compare(routeAuth, __utils.getProperty((__auth.$vm.state.data || {}), rolesKey))) {
            __auth.transitionRedirectType = 403;

            if (typeof forbiddenRedirect === 'function') {
                forbiddenRedirect = forbiddenRedirect(transition);
            }

            cb.call(__auth, forbiddenRedirect);
        }
        else {
            if ((__auth.transitionPrev || {}).path !== __auth.transitionThis.path) {
                __auth.$vm.state.redirect = __auth.transitionRedirectType ? {type: __auth.transitionRedirectType, from: __auth.transitionPrev, to: __auth.transitionThis} : null;
                __auth.transitionRedirectType = null;
            }

            return cb();
        }
    }
    else if (routeAuth === false && __auth.check()) {
        __auth.transitionRedirectType = 404;

        if (typeof notFoundRedirect === 'function') {
            notFoundRedirect = notFoundRedirect(transition);
        }

        cb.call(__auth, notFoundRedirect);
    }
    else {
        if ((__auth.transitionPrev || {}).path !== __auth.transitionThis.path) {
            __auth.$vm.state.redirect = __auth.transitionRedirectType ? {type: __auth.transitionRedirectType, from: __auth.transitionPrev, to: __auth.transitionThis} : null;
            __auth.transitionRedirectType = null;
        }

        return cb();
    }
}

function _processFetch(data, redirect) {
    _setUser(data);

    _setAuthenticated(true);

    _processRedirect(redirect);
}

function _processLogout(redirect) {
    __cookie.remove.call(__auth, __auth.options.tokenImpersonateKey);
    __cookie.remove.call(__auth, __auth.options.tokenDefaultKey);

    __token.remove.call(__auth, __auth.options.tokenImpersonateKey);
    __token.remove.call(__auth, __auth.options.tokenDefaultKey);

    __token.remove.call(__auth, __auth.options.staySignedInKey);

    __auth.$vm.state.loaded = true;
    __auth.$vm.state.authenticated = false;
    __auth.$vm.state.data = null;

    _processRedirect(redirect);
}

function _processImpersonate(defaultToken, redirect) {
    __token.set.call(__auth, __auth.options.tokenImpersonateKey, __auth.token(), __token.get.call(__auth, __auth.options.staySignedInKey) ? false : true);
    __token.set.call(__auth, __auth.options.tokenDefaultKey, defaultToken, __token.get.call(__auth, __auth.options.staySignedInKey) ? false : true);
    __auth.$vm.state.impersonating = true;

    _processRedirect(redirect);
}

function _processUnimpersonate(redirect) {
    __token.remove.call(__auth, __auth.options.tokenImpersonateKey);
    __auth.$vm.state.impersonating = false;

    _processRedirect(redirect);
}

function _processRedirect(redirect) {
    if (redirect) {
        __auth.drivers.router.routerGo.call(__auth, redirect);
    }
}

function _initVm(Vue) {
    __auth.$vm = new Vue({
        data: function () {
            return {
                state: {
                    data: null,
                    loaded: false,
                    redirect: null,
                    authenticated: null, // TODO: false ?
                    impersonating: undefined,
                    remember: undefined,
                }
            };
        }
    });
}

function _initDriverCheck() {
    var msg;
    var i, ii;
    var drivers = ['auth', 'http', 'router'];

    for (i = 0, ii = drivers.length; i < ii; i++) {
        if ( ! __auth.drivers[drivers[i]]) {
            console.error('Error (@websanova/vue-auth): "' + drivers[i] + '" driver must be set.');

            return false;
        }

        if (__auth.drivers[drivers[i]].init) {
            msg = __auth.drivers[drivers[i]].init.call(__auth);

            if (msg) {
                console.error('Error (@websanova/vue-auth): ' + msg);

                return false;
            }
        }
    }
}

function _initRefreshInterval() {
    if (
        __auth.options.refreshData.enabled &&
        __auth.options.refreshData.interval > 0
    ) {
        setInterval(function () {
            if (
                __auth.options.refreshData.enabled &&
                !_isTokenExpired()
            ) {
                __auth.refresh();
            }
        }, __auth.options.refreshData.interval * 1000 * 60); // In minutes.
    }
}

function _initInterceptors() {
    __auth.drivers.http.interceptor.call(__auth, _parseRequestIntercept, _parseResponseIntercept);

    __auth.drivers.router.beforeEach.call(__auth, _processRouterBeforeEach, _processTransitionEach, _setTransitions, _getAuthMeta);
}

function Auth(Vue, options) {
    __auth  = this;

    options = options || {};
    
    this.plugins = options.plugins;
    this.drivers = options.drivers;
    this.options = __utils.extend(__defaultOptions, options.options);

    delete options.plugins;
    delete options.drivers;
    delete options.options;

    // Init vars.

    this.currentToken           = null;
    this.transitionPrev         = null;
    this.transitionThis         = null;
    this.transitionRedirectType = null;

    _initDriverCheck();

    _initVm(Vue);

    _initRefreshInterval();

    _initInterceptors();
}

Auth.prototype.ready = function () {
    return __auth.$vm.state.loaded;
};

Auth.prototype.load = function () {
    return new Promise(function(resolve) {
        var timer = null;

        timer = setInterval(function() {
            if (__auth.$vm.state.loaded) {
                clearInterval(timer);

                resolve();
            }
        }, 50);
    });
};

Auth.prototype.redirect = function () {
    return __auth.$vm.state.redirect;
};

Auth.prototype.user = function (data) {
    if (data !== undefined) {
        _processFetch(data);
    }

    return __auth.$vm.state.data;
};

Auth.prototype.check = function (role, key) {
    return _isAccess(role, key);
};

Auth.prototype.impersonating = function () {
    var impersonating = __token.get.call(__auth, __auth.options.tokenImpersonateKey) ? true : false;

    if (__auth.$vm.state.impersonating === undefined) {
        __auth.$vm.state.impersonating = impersonating;
    }

    return __auth.$vm.state.impersonating;
};

Auth.prototype.token = function (name, token, expires) {
    if (token !== undefined) {
        if (token === null) {
            __token.remove.call(__auth, name);
        }
        else {
            expires = (expires === true || expires === false) ? expires : (__token.get.call(__auth, __auth.options.staySignedInKey) ? false : true);

            __token.set.call(__auth, name, token, expires);
        }
    }

    return __token.get.call(__auth, name);
};

Auth.prototype.fetch = function (data) {
    data = __utils.extend(__auth.options.fetchData, data);

    return new Promise(function(resolve, reject) {
        __auth.drivers.http.http
            .call(__auth, data)
            .then(function(res) {
                _processFetch(_parseUserResponseData(res), data.redirect);

                resolve(res);
            }, reject);
    });
};

Auth.prototype.refresh = function (data) {
    data = __utils.extend(__auth.options.refreshData, data);

    return __auth.drivers.http.http.call(__auth, data);
};

Auth.prototype.register = function (data) {
    var registerData = __utils.extend(__auth.options.registerData, data);

    if (registerData.autoLogin !== true) {
        _setRemember(registerData.remember);
        _setStaySignedIn(registerData.staySignedIn);
    }

    return new Promise(function(resolve, reject) {
        __auth.drivers.http.http
            .call(__auth, registerData)
            .then(function(res) {
                var loginData;

                if (registerData.autoLogin) {
                    loginData = __utils.extend(__auth.options.loginData, data);

                    __auth
                        .login(loginData)
                        .then(resolve, reject);
                }
                else {
                    resolve(res);

                    _processRedirect(registerData.redirect);
                }
            }, reject);
    });
};

Auth.prototype.login = function (data) {
    data = __utils.extend(__auth.options.loginData, data);

    _setRemember(data.remember);
    _setStaySignedIn(data.staySignedIn);

    return new Promise(function(resolve, reject) {
        __auth.drivers.http.http
            .call(__auth, data)
            .then(function(res) {
                if (
                    data.fetchUser ||
                    (data.fetchUser === undefined && __auth.options.fetchData.enabled)
                ) {
                    __auth
                        .fetch({
                            redirect: data.redirect
                        })
                        .then(resolve, reject);
                }
                else {
                    _processFetch(_parseUserResponseData(res), data.redirect);

                    resolve(res);
                }
            }, function(res) {
                _setAuthenticated(false);

                reject(res);
            });
    });
};

Auth.prototype.remember = function (val) {
    if (val) {
        _setRemember(val);
    }

    var remember = _getRemember();

    if (__auth.$vm.state.remember === undefined) {
        __auth.$vm.state.remember = remember;
    }

    return __auth.$vm.state.remember;
}

Auth.prototype.unremember = function () {
    _setRemember(null);
}

Auth.prototype.logout = function (data) {
    data = __utils.extend(__auth.options.logoutData, data);

    return new Promise(function(resolve, reject) {
        if (data.makeRequest) {
            __auth.drivers.http.http
                .call(__auth, data)
                .then(function(res) {
                    _processLogout(data.redirect);

                    resolve(res)
                }, reject);
        }
        else {
            _processLogout(data.redirect);

            resolve();
        }
    });
};

Auth.prototype.impersonate = function (data) {
    data = __utils.extend(__auth.options.impersonateData, data);

    return new Promise(function(resolve, reject) {
        var token = __auth.token();

        __auth.drivers.http.http
            .call(__auth, data)
            .then(function(res) {
                _processImpersonate(token);

                if (
                    data.fetchUser ||
                    (data.fetchUser === undefined && __auth.options.fetchData.enabled)
                ) {
                    __auth
                        .fetch({
                            redirect: data.redirect
                        })
                        .then(resolve, reject);
                }
                else {
                    _processRedirect(data.redirect);

                    resolve(res);
                }
            }, reject);
    });
};

Auth.prototype.unimpersonate = function (data) {
    data = __utils.extend(__auth.options.unimpersonateData, data);

    return new Promise(function(resolve, reject) {
        if (data.makeRequest) {
            __auth.drivers.http.http
                .call(__auth, data)
                .then(resolve, reject);
        }
        else {
            resolve();
        }
    })
    .then(function() {
        return new Promise(function(resolve, reject) {
            _processUnimpersonate();

            if (
                data.fetchUser ||
                (data.fetchUser === undefined && __auth.options.fetchData.enabled)
            ) {
                __auth
                    .fetch({
                        redirect: data.redirect
                    })
                    .then(resolve, reject);
            }
            else {
                _processRedirect(data.redirect);

                resolve();
            }
        });
    });
};

Auth.prototype.oauth2 = function (type, data) {
    var key,
        params = [];

    if (data.code) {
        try {
            if (data.state) {
                data.state = JSON.parse(decodeURIComponent(data.state));
            }
        }
        catch (e) {
            console.error('vue-auth:error There was an issue retrieving the state data.');
            data.state = data.state || {};
        }

        data = __utils.extend(__auth.options.oauth2Data, [data.state, data]);

        delete data.code;
        delete data.state;
        delete data.params;

        return __auth.login(data);
    }

    data = __utils.extend(__auth.drivers.oauth2[type], data);

    data.params.state        = JSON.stringify(data.params.state || {});
    data.params.redirect_uri = _parseRedirectUri(data.params.redirect_uri);

    Object.keys(data.params).forEach((key) => {
        params.push(key + '=' + encodeURIComponent(data.params[key]));
    });

    window.open(
        data.url + '?' + params.join('&'),
        (data.window || {}).name || '_self',
        (data.window || {}).specs || {},
        (data.window || {}).replace !== false
    );
}

Auth.prototype.enableImpersonate = function () {
    if (__auth.impersonating()) {
        __auth.currentToken = null;
    }
};

Auth.prototype.disableImpersonate = function () {
    if (__auth.impersonating()) {
        __auth.currentToken = __auth.options.tokenDefaultKey;
    }
};

export default Auth;
