/*!
 * @websanova/vue-auth v4.1.13
 * https://websanova.com/docs/vue-auth
 * Released under the MIT License.
 */

var facebook = {
  url: 'https://www.facebook.com/v2.5/dialog/oauth',
  params: {
    client_id: '',
    redirect_uri: 'login/facebook',
    response_type: 'code',
    scope: 'email',
    state: {}
  }
};

export default facebook;
