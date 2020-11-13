import {reactive} from 'vue';
import Auth     from './auth.js';

// NOTE: Create pseudo Vue object for Vue 2 backwards compatibility.

function Vue (obj) {
    var data = obj.data();

    this.state = reactive(data.state);
}

Auth.prototype.install = function (app) {
    app.auth = this;

    app.config.globalProperties.$auth = this;
}

//

var auth;

//

export function createAuth(options) {
    if (!auth) {
        auth = new Auth(Vue, options);
    }

    return auth
}

export function useAuth() {
    return auth;
}