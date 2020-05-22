"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  request: function request(req, token) {
    this.http.setHeaders.call(this, req, {
      Authorization: token
    });
  },
  response: function response(res) {
    var headers = this.http.getHeaders.call(this, res),
        token = headers.Authorization || headers.authorization;
    return token;
  }
};
exports["default"] = _default;