/*!
 * @websanova/vue-auth v3.3.8
 * https://websanova.com/docs/vue-auth
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.VueAuth = factory());
}(this, (function () { 'use strict';

    var bearer = {
      request: function (req, token) {
        this.http.setHeaders.call(this, req, {
          Authorization: 'Bearer ' + token
        });
      },
      response: function (res) {
        var headers = this.http.getHeaders.call(this, res),
            token = headers.Authorization || headers.authorization;

        if (token) {
          token = token.split(/Bearer:?\s?/i);
          return token[token.length > 1 ? 1 : 0].trim();
        }
      }
    };

    return bearer;

})));
