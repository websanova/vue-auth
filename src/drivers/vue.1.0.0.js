module.exports = {

    // NOTE: Use underscore to denote a driver function (all are overrideable also).

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
        var i,
            data = {},
            headers = res.headers.map;

        for (i in headers) {
            data[i] = headers[i][0];
        }

        return data;
    },

    _setHeaders: function (req, headers) {
        var i;

        for (i in headers) {
            req.headers.set(i, headers[i]);
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

        this.options.router.beforeEach(function (transition, location, next) {
            routerBeforeEach.call(_this, function () {
                var auth;

                if (transition.to) {
                    auth = transition.to.auth;
                } else {
                    var authRoutes = transition.matched.filter(function (route) {
                        return route.meta.hasOwnProperty('auth');
                    });

                    // matches the nested route, the last one in the list
                    if (authRoutes.length) {
                        auth = authRoutes[authRoutes.length - 1].meta.auth;
                    }
                }

                transitionEach.call(_this, auth, function (redirect) {
                    if (!redirect) {
                        (next || transition.next)();
                        return;
                    }

                    // router v2.x
                    if (next) {
                        next(redirect);
                    } else {
                        this.options._routerReplace.call(this, redirect);
                    }
                });
            });
        })
    },

    _invalidToken: function (res) {
        if (res.status === 401) {
            this.logout();
        }
    },

    _routerReplace: function (data) {
        var router = this.options.router;

        router.replace.call(router, data);
    },

    _routerGo: function (data) {
        var router = this.options.router;

        (router.push || router.go).call(router, data);
    },

    _httpData: function (res) {
        return res.data || {};
    },

    _http: function (data) {
        this.options.http(data).then(data.success, data.error);
    }

};