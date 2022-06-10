/*!
 * @websanova/vue-auth v4.1.13
 * https://websanova.com/docs/vue-auth
 * Released under the MIT License.
 */

var vueResource_1_x = {
  init: function () {
    if (!this.plugins.http) {
      return 'drivers/http/vue-resource.1.x.js: http plugin has not been set.';
    }
  },
  interceptor: function (req, res) {
    var _this = this;

    this.plugins.http.interceptors.push(function (request, next) {
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
    return this.plugins.http(data);
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

export default vueResource_1_x;
