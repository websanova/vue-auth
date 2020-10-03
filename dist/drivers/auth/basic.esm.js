/*!
 * @websanova/vue-auth v3.3.8
 * https://websanova.com/docs/vue-auth
 * Released under the MIT License.
 */

var basic = {
  request: function (req, token) {
    this.http.setHeaders.call(this, req, {
      Authorization: token
    });
  },
  response: function (res) {
    var headers = this.http.getHeaders.call(this, res),
        token = headers.Authorization || headers.authorization;
    return token;
  }
};

export default basic;
