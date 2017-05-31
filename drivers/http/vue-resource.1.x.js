module.exports = {

    _init: function () {
        if ( ! this.options.Vue.http) {
            return 'vue-resource.1.x.js : Vue.http must be set.';
        }
    },
    
    _interceptor: function (req, res) {
        var _this = this;

        this.options.Vue.http.interceptors.push(function (request, next) {
            if (req) { req.call(_this, request); }
            
            next(function (response) {
                if (res) { res.call(_this, response); }
            });
        });
    },

    _invalidToken: function (res) {
        if (res.status === 401) {
            this.options.logoutProcess.call(this, res, {redirect: this.options.authRedirect});
        }
    },

    _httpData: function (res) {
        return res.data || {};
    },

    _http: function (data) {
        if (data.error) {
            this.options.Vue.http(data).then(data.success, data.error);
        } else {
            this.options.Vue.http(data).then(data.success, this.options.defaultHttpErrorHandler);
        }
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
    }
};
