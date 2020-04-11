import * as __utils  from './lib/utils.js'; 
import * as __token  from './lib/token.js'; 
import * as __cookie from './lib/cookie.js'; 

var __auth = null;

var __defaultOptions = {

    // Variables

    rolesKey:            'roles',
    rememberkey:         'auth_remember',
    staySignedInKey:     'auth_stay_signed_in',
    tokenDefaultKey:     'auth_token_default',
    tokenImpersonateKey: 'auth_token_impersonate',
    stores:              ['storage', 'cookie'],

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
    getDomain: _getDomain,
    parseUserData: _parseUserData
};

function _isAccess(role, key) {
    if (__auth.$vm.authenticated === true) {
        if (role) {
            return __utils.compare(role, (__auth.$vm.data || {})[key || __auth.options.rolesKey]);
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

function _getDomain() {
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
    __auth.$vm.data = data;
}

function _setLoaded(loaded) {
    __auth.$vm.loaded = loaded;
}

function _setAuthenticated(authenticated) {
    __auth.$vm.loaded = true;
    __auth.$vm.authenticated = authenticated;
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
        __auth.$vm.remember = val;
    }
    else {
        __token.remove.call(__auth, __auth.options.rememberKey);
        __auth.$vm.remember = null;
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
    return __auth.options.parseUserData(__auth.http.httpData(res));
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
        __auth.auth.request.call(__auth, req, token);
    }

    return req;
}

function _parseResponseIntercept(res, req) {
    var token;

    if (req && req.ignoreVueAuth) {
        return;
    }

    _processInvalidToken(res, __auth.transitionThis);

    token = this.auth.response.call(this, res);

    if (token) {
        __token.set.call(this, null, token, (__token.get.call(__auth, __auth.options.staySignedInKey) ? false : true));
    }
}

function _processInvalidToken(res, transition) {
    var i,
        auth,
        query = '',
        redirect = transition && transition.path;

    // Make sure we also attach any existing
    // query parameters on the path.
    if (redirect && transition.query) {
        for (i in transition.query) {
            if (transition.query[i]) {
                query += '&' + i + '=' + transition.query[i];
            }
        }

        redirect += '?' + query.substring(1);
    }

    if (
        !__auth.http.invalidToken ||
        !__auth.http.invalidToken.call(__auth, res)
    ) {
        return;
    }

    if (transition) {
        auth = _getAuthMeta(transition);
    }

    if (auth) {
        redirect = auth.redirect || __auth.authRedirect;
    }

    _processLogout({redirect: redirect});
}

function _processRouterBeforeEach(cb) {
    var isTokenExpired = _isTokenExpired();

    if (
        isTokenExpired &&
        __auth.$vm.authenticated
    ) {
        _processLogout();
    }

    if (
        !isTokenExpired &&
        !__auth.$vm.loaded &&
        __auth.options.refreshData.enabled
    ) {
        __auth
            .refresh()
            .then(() => {
                _processAuthenticated(cb);
            });

        return;
    }

    _processAuthenticated(cb);
}

function _processAuthenticated(cb) {
    if (
        __auth.$vm.authenticated === null &&
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
        notFoundRedirect = (routeAuth || '').redirect || __auth.options.notFoundRedirect;

    routeAuth = __utils.toArray((routeAuth || '').roles !== undefined ? routeAuth.roles : routeAuth);

    if (routeAuth && (routeAuth === true || routeAuth.constructor === Array || __utils.isObject(routeAuth))) {
        if ( ! __auth.check()) {
            __auth.$vm.transitionRedirectType = 401;
            cb.call(__auth, authRedirect);
        }
        else if ((routeAuth.constructor === Array || __utils.isObject(routeAuth)) && ! __utils.compare(routeAuth, __auth.$vm.data[__auth.options.rolesKey])) {
            __auth.$vm.transitionRedirectType = 403;
            cb.call(__auth, forbiddenRedirect);
        }
        else {
            __auth.$vm.redirect = __auth.$vm.transitionRedirectType ? {type: __auth.$vm.transitionRedirectType, from: __auth.$vm.transitionPrev, to: __auth.$vm.transitionThis} : null;
            __auth.$vm.transitionRedirectType = null;

            return cb();
        }
    }
    else if (routeAuth === false && __auth.check()) {
        __auth.$vm.transitionRedirectType = 404;
        cb.call(__auth, notFoundRedirect);
    }
    else {
        __auth.$vm.redirect = __auth.$vm.transitionRedirectType ? {type: __auth.$vm.transitionRedirectType, from: __auth.$vm.transitionPrev, to: __auth.$vm.transitionThis} : null;
        __auth.$vm.transitionRedirectType = null;

        return cb();
    }
}

function _processFetch(data, redirect) {
    _setUser(data);

    _setAuthenticated(true);

    _processRedirect(redirect);
}

function _processLogout(redirect) {
    // __cookie.remove.call(__auth, __auth.options.rememberKey);

    __cookie.remove.call(__auth, __auth.options.tokenImpersonateKey);
    __cookie.remove.call(__auth, __auth.options.tokenDefaultKey);

    __token.remove.call(__auth, __auth.options.tokenImpersonateKey);
    __token.remove.call(__auth, __auth.options.tokenDefaultKey);

    __auth.$vm.loaded = true;
    __auth.$vm.authenticated = false;
    __auth.$vm.data = null;

    _processRedirect(redirect);
}

function _processImpersonate(defaultToken, redirect) {
    __token.set.call(__auth, __auth.options.tokenImpersonateKey, __auth.token(), __token.get.call(__auth, __auth.options.staySignedInKey));
    __token.set.call(__auth, __auth.options.tokenDefaultKey, defaultToken, __token.get.call(__auth, __auth.options.staySignedInKey));
    __auth.$vm.impersonating = true;

    _processRedirect(redirect);
}

function _processUnimpersonate(redirect) {
    __token.remove.call(__auth, __auth.options.tokenImpersonateKey);
    __auth.$vm.impersonating = false;

    _processRedirect(redirect);
}

function _processRedirect(redirect) {
    if (redirect) {
        __auth.router.routerGo.call(__auth, redirect);
    }
}

function _initVm() {
    __auth.$vm = new __auth.Vue({
        data: function () {
            return {
                data: null,
                loaded: false,
                redirect: null,
                authenticated: null, // TODO: false ?
                impersonating: undefined,
                remember: undefined,
            };
        }
    });
}

function _initDriverCheck() {
    var i, ii;
    
    var drivers = ['auth', 'http', 'router'];

    for (i = 0, ii = drivers.length; i < ii; i++) {
        if ( ! __auth.options[drivers[i]]) {
            console.error('Error (@websanova/vue-auth): "' + drivers[i] + '" driver must be set.');
            
            return false;
        }

        if (__auth.options[drivers[i]]._init) {
            msg = __auth.options[drivers[i]]._init.call(__auth);

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
    __auth.http.interceptor.call(__auth, _parseRequestIntercept, _parseResponseIntercept);
    
    __auth.router.beforeEach.call(__auth, _processRouterBeforeEach, _processTransitionEach, _setTransitions, _getAuthMeta);
}

function Auth(Vue, options) {
    __auth  = this;
    
    options = options || {};

    this.Vue     = Vue;
    this.auth    = options.auth;
    this.http    = options.http;
    this.router  = options.router;
    this.options = __utils.extend(__defaultOptions, options);

    this.currentToken           = null;
    this.transitionPrev         = null;
    this.transitionThis         = null;
    this.transitionRedirectType = null;

    _initDriverCheck();

    _initVm();

    _initRefreshInterval();

    _initInterceptors();
}

Auth.prototype.ready = function () {
    return __auth.$vm.loaded;
};

Auth.prototype.load = function () {
    return new Promise((resolve) => {
        var timer = null;

        timer = setInterval(function() {
            if (__auth.$vm.loaded) {
                clearInterval(timer);

                resolve();
            }
        }, 50);
    });
};

Auth.prototype.redirect = function () {
    return __auth.$vm.redirect;
};

Auth.prototype.user = function (data) {
    if (data) {
        _processFetch(data);
    }

    return __auth.$vm.data;
};

Auth.prototype.check = function (role, key) {
    return _isAccess(role, key);
};

Auth.prototype.impersonating = function () {
    var impersonating = __token.get.call(__auth, __auth.options.tokenImpersonateKey) ? true : false;

    if (__auth.$vm.impersonating === undefined) {
        __auth.$vm.impersonating = impersonating;
    }

    return __auth.$vm.impersonating;
};

Auth.prototype.token = function (name, token, expires) {
    if (token) {
        expires = (expires === true || expires === false) ? expires : __token.get.call(__auth, __auth.options.staySignedInKey);

        __token.set.call(__auth, name, token, expires);
    }

    return __token.get.call(__auth, name);
};

Auth.prototype.fetch = function (data) {
    data = __utils.extend(__auth.options.fetchData, data);

    return new Promise((resolve, reject) => {
        __auth.http.http
            .call(__auth, data)
            .then((res) => {
                _processFetch(_parseUserResponseData(res), data.redirect);

                resolve(res);
            }, reject);
    });
};

Auth.prototype.refresh = function (data) {
    data = __utils.extend(__auth.options.refreshData, data);

    return __auth.http.http.call(__auth, data);
};

Auth.prototype.register = function (data) {
    data = __utils.extend(__auth.options.registerData, data);

    return new Promise((resolve, reject) => {
        __auth.http.http
            .call(__auth, data)
            .then((res) => {
                if (data.autoLogin) {
                    __auth
                        .login({
                            body: data.body,
                            redirect: data.redirect,
                            remember: data.remember,
                            fetchUser: data.fetchUser,
                            staySignedIn: data.staySignedIn
                        })
                        .then(resolve, reject);
                }
                else {
                    resolve(res);

                    _processRedirect(data.redirect);
                }
            }, reject);
    });
};

Auth.prototype.login = function (data) {
    data = __utils.extend(__auth.options.loginData, data);

    _setRemember(data.remember);
    _setStaySignedIn(data.staySignedIn);

    return new Promise((resolve, reject) => {
        __auth.http.http
            .call(__auth, data)
            .then((res) => {
                // _setAuthenticated(true);

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
            }, (res) => {
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

    if (__auth.$vm.remember === undefined) {
        __auth.$vm.remember = remember;
    }

    return __auth.$vm.remember;
}

Auth.prototype.unremember = function () {
    _setRemember(null);
}

Auth.prototype.logout = function (data) {
    data = __utils.extend(__auth.options.logoutData, data);

    return new Promise((resolve, reject) => {
        if (data.makeRequest) {
            __auth.http.http
                .call(__auth, data)
                .then((res) => {
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

    return new Promise((resolve, reject) => {
        var token = __auth.token();
        
        __auth.http.http
            .call(__auth, data)
            .then((res) => {
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

    return new Promise((resolve, reject) => {
        if (data.makeRequest) {
            __auth.http.http
                .call(__auth, data)
                .then(resolve, reject);
        }
        else {
            resolve();
        }
    })
    .then(() => {
        return new Promise((resolve, reject) => {
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
        params = '';

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

    data = __utils.extend(__auth.options.oauth2[type], data);
    
    data.params.state        = JSON.stringify(data.params.state || {});
    data.params.redirect_uri = _parseRedirectUri(data.params.redirect_uri);

    for (key in data.params) {
        params += '&' + key + '=' + encodeURIComponent(data.params[key]);
    }

    window.location = data.url + '?' + params.substring();
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