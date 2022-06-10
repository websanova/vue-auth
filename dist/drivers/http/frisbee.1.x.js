/*!
 * @websanova/vue-auth v4.1.13
 * https://websanova.com/docs/vue-auth
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.VueAuth = factory());
}(this, (function () { 'use strict';

    var frisbee_1_x = {
      init: function () {
        if (!this.plugins.http) {
          return 'drivers/http/frisbee.js: http plugin has not been set.';
        }
      },
      interceptor: function (req, res) {
        var _this = this;

        this.plugins.http.interceptor.register({
          request: function (path, options) {
            req.call(_this, options);
            return [path, options];
          },
          requestError: err => {
            req.call(_this, err.request);
            return Promise.reject(err);
          },
          response: response => {
            res.call(_this, response);
            return response;
          },
          responseError: err => {
            res.call(_this, err.response);
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
      http: function (data) {
        return this.plugins.http[data.method.toLowerCase()](data.url, data);
      },
      getHeaders: res => {
        return res.headers;
      },
      setHeaders: (req, headers) => {
        req.headers = Object.assign({}, req.headers, headers);
      }
    };

    return frisbee_1_x;

})));
