/*!
 * @websanova/vue-auth v3.3.5
 * https://websanova.com/docs/vue-auth
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.VueAuth = factory());
}(this, (function () { 'use strict';

    var vueResource_1_x = {
      init: function () {
        if (!this.Vue.http) {
          return 'vue-resource.1.x.js : Vue.http must be set.';
        }
      },
      interceptor: function (req, res) {
        var _this = this;

        this.Vue.http.interceptors.push(function (request, next) {
          if (req) {
            req.call(_this, request);
          }

          next(function (response) {
            if (res) {
              res.call(_this, response, request);
            }
          });
        });
      },
      invalidToken: function (res) {
        if (res.status === 401) {
          return true;
        }
      },
      httpData: function (res) {
        return res.data || {};
      },
      http: function (data) {
        return this.Vue.http(data);
      },
      getHeaders: function (res) {
        var i,
            data = {},
            headers = res.headers.map;

        for (i in headers) {
          data[i] = headers[i][0];
        }

        return data;
      },
      setHeaders: function (req, headers) {
        var i;

        for (i in headers) {
          req.headers.set(i, headers[i]);
        }
      }
    };

    return vueResource_1_x;

})));
