/*!
 * @websanova/vue-auth v3.2.1-beta
 * https://websanova.com/docs/vue-auth
 * Released under the MIT License.
 */

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

export default google;
