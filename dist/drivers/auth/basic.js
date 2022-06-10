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

    var basic = {
      request: function (req, token) {
        this.drivers.http.setHeaders.call(this, req, {
          Authorization: token
        });
      },
      response: function (res) {
        var headers = this.drivers.http.getHeaders.call(this, res),
            token = headers.Authorization || headers.authorization;
        return token;
      }
    };

    return basic;

})));
