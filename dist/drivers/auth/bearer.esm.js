/*!
 * @websanova/vue-auth v3.1.5-beta
 * https://websanova.com/docs/vue-auth
 * Released under the MIT License.
 */

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

export default bearer;
