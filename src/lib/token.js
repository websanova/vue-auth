import * as __utils   from './utils.js';
import * as __cookie  from './cookie.js';
import * as __storage from './storage.js';

function getTokenName(key) {
    key = key || this.currentToken;
    
    if (key) {
        return key;
    }

    if (this.impersonating()) {
        return this.options.tokenImpersonateName;
    }

    return this.options.tokenDefaultName;
}

function processToken(action, key, token, expires) {
    var i   = 0,
        ts  = this.options.tokenStore,
        ii  = ts.length,
        args = [getTokenName.call(this, key)];

    if (action === 'set') {
        args.push(token);
        args.push(expires === true ? true : false);
    }

    for (; i < ii; i++) {
        if (
            ts[i] === 'storage' &&
            __utils.isLocalStorage() &&
            __utils.isSessionStorage()
        ) {
            return __storage[action].apply(this, args);
        }

        if (
            ts[i] === 'cookie' &&
            __utils.isCookieStorage()
        ) {
            return __cookie[action].apply(this, args);
        }
    }
}

function get(key) {
    return processToken.call(this, 'get', key);
}

function set(key, token, expires) {
    return processToken.call(this, 'set', key, token, expires);
}

function remove(key) {
    return processToken.call(this, 'remove', key);
}

export {
    get,
    set,
    remove
};