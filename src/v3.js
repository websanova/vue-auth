import {reactive} from 'vue';
import Auth     from './auth.js';

// NOTE: Create pseudo Vue object for Vue 2 backwards compatibility.

function Vue (obj) {
    var i,
        data = obj.data();

    for (i in data) {
        this[i] = reactive(Object.assign({}, data[i]));
    }
}

Vue.set = function (obj, name, val) {
    obj[name] = reactive(val);
}

Auth.prototype.install = function (app) {
    this.Vue = Vue;
    this.ctx = app;

    app.auth = this;

    app.config.globalProperties.$auth = this;
}

//

export function createAuth(options) {
    return new Auth(Vue, options);
}