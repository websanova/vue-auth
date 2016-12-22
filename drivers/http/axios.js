var axios = require('axios');

module.exports = {

  _interceptor: function (req, res) {
    let _this = this;

    if (req) {
      axios.interceptors.request.use((request) => {
        req.call(_this, request);
        return request;
      })
    }

    if (res) {
      axios.interceptors.response.use((response) => {
        res.call(_this, response);
        return response;
      })
    }
  },

  _invalidToken: function (res) {
    if (res.status === 401) {
      this.logout();
    }
  },

  _httpData: function (res) {
    return res.data || {};
  },

  _http: function (data) {
    axios(data).then(data.success, data.error);
  },

  _getHeaders: function (res) {
    return res.headers;
  },

  _setHeaders: function (req, headers) {
    req.headers.common = Object.assign(req.headers.common, headers);
  }
}
