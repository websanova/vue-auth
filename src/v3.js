import {inject  } from 'vue'
import {reactive} from 'vue';
import Auth       from './auth.js';

const authKey = 'auth';

// NOTE: Create pseudo Vue object for Vue 2 backwards compatibility.

function Vue (obj) {
    var data = obj.data();

    this.state = reactive(data.state);
}

Auth.prototype.install = function (app, key) {
    app.provide(key || authKey, this);

    app.config.globalProperties.$auth = this;
}

//

export function createAuth(options) {
    return new Auth(Vue, options);
}

export function useAuth(key) {
    return inject(key ? key : authKey);
}