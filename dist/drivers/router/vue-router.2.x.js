/*!
 * @websanova/vue-auth v3.2.0-beta
 * https://websanova.com/docs/vue-auth
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.VueAuth = factory());
}(this, (function () { 'use strict';

    var vueRouter_2_x = {
      init: function () {
        if (!this.Vue.router) {
          return 'vue-router.2.x.js : Vue.router must be set.';
        }
      },
      // bindData: function (data, ctx) {
      //     var error, success;
      //     data = data || {};
      //     error = data.error;
      //     success = data.success;
      //     data.query = ctx.$route.query || {};
      //     if (data.success) { data.success = function (res) { success.call(ctx, res); } }
      //     if (data.error) { data.error = function (res) { error.call(ctx, res); } }
      //     return data;
      // },
      beforeEach: function (routerBeforeEach, transitionEach, setTransitions, getAuthMeta) {
        var _this = this;

        this.Vue.router.beforeEach(function (transition, location, next) {
          setTransitions(transition);
          routerBeforeEach.call(_this, function () {
            var auth = getAuthMeta(transition);
            transitionEach.call(_this, transition, auth, function (redirect) {
              if (!redirect) {
                (next || transition.next)();
                return;
              } // router v2.x


              if (next) {
                next(redirect);
              } else {
                this.router._routerReplace.call(this, redirect);
              }
            });
          });
        });
      },
      routerReplace: function (data) {
        var router = this.Vue.router;
        router.replace.call(router, data);
      },
      routerGo: function (data) {
        var router = this.Vue.router;
        (router.push || router.go).call(router, data).catch(function (err) {});
      }
    };

    return vueRouter_2_x;

})));
