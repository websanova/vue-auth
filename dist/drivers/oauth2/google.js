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

    var google = {
      url: 'https://accounts.google.com/o/oauth2/auth',
      params: {
        client_id: '',
        redirect_uri: 'login/google',
        response_type: 'code',
        scope: 'email',
        state: {}
      }
    };

    return google;

})));
