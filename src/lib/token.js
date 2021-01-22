import * as __utils   from './utils.js';
import * as __cookie  from './cookie.js';
import * as __storage from './storage.js';

function getTokenKey(key) {
    key = key || this.currentToken;

    if (key) {
        return key;
    }

    if (this.impersonating()) {
        return this.options.tokenImpersonateKey;
    }

    return this.options.tokenDefaultKey;
}

function processToken(action, key, token, expires) {
    var i   = 0,
        ts  = this.options.stores,
        ii  = ts.length,
        args = [getTokenKey.call(this, key)];

    if (action === 'set') {
        args.push(token);
        args.push(expires === true ? true : false);
    }

    for (; i < ii; i++) {
        if (typeof(ts[i][action]) === 'function') {
            return ts[i][action].apply(this, args);
        }
        
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
