module.exports = {
  _init: function () {
      if ( ! this.options.Vue.frisbee) {
          return 'firsbee.js : Vue.frisbee must be set.'
      }
  },

  _interceptor: function (req, res) {
      this.options.Vue.frisbee.interceptors.register({
          request: function (path, options) {
              req.call(_this, options);
              return [path, options];
          },
          requestError: err => {
              req.call(_this, error.request);
              return Promise.reject(err);
          },
          response: response => {
              res.call(_this, response);
              return response;
          },
          responseError: err => {
              res.call(_this, error.response);
              return Promise.reject(err);
          }
      });
  },

  _invalidToken: res => {
    if (res.status === 401) {
      return true;
    }
  },

  _httpData: res => {
    return res.body || {};
  },

  _http: data => {
    const http = this.options.Vue.frisbee(data);

    http.then(data.success, data.error);

    return http;
  },

  _getHeaders: res => {
    return res.headers;
  },

  _setHeaders: (req, headers) => {
    req.headers = Object.assign({}, req.headers, headers);
  }
}
