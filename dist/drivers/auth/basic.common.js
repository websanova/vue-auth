/*!
 * @websanova/vue-auth v4.1.13
 * https://websanova.com/docs/vue-auth
 * Released under the MIT License.
 */

'use strict';

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

module.exports = basic;
