export default {

    init: function () {
        if ( ! this.plugins.http) {
            return 'drivers/http/firsbee.js: http plugin has not been set.'
        }
    },

    interceptor: function (req, res) {
        var _this = this;

        this.plugins.http.interceptors.register({
            request: function (path, options) {
                req.call(_this, options);
                
                return [path, options];
            },
            requestError: err => {
                req.call(_this, error.request);
                
                return Promise.reject(err);
            },
            response: response => {
                res.call(_this, response);
    
                return response;
            },
            responseError: err => {
                res.call(_this, error.response);
                
                return Promise.reject(err);
            }
        });
    },

    invalidToken: res => {
        if (res.status === 401) {
            return true;
        }
    },

    httpData: res => {
        return res.body || {};
    },

    http: data => {
        return this.plugins.http(data);
    },

    getHeaders: res => {
        return res.headers;
    },

    setHeaders: (req, headers) => {
        req.headers = Object.assign({}, req.headers, headers);
    }
}