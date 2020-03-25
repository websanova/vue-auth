import * as __cookie from './cookie.js';

function tokenName(name) {
    name = name || this.currentToken;
    
    if (name) {
        return name;
    }

    if (this.impersonating.call(this)) {
        return this.options.tokenImpersonateName;
    }

    return this.options.tokenDefaultName;
}

function isLocalStorageSupported() {
    try {
        if (!window.localStorage || !window.sessionStorage) {
            throw 'exception';
        }

        localStorage.setItem('storage_test', 1);
        localStorage.removeItem('storage_test');
        
        return true;
    } catch (e) {
        return false;
    }
}

function isSessionStorageSupported() {
    try {
        if (!window.localStorage || !window.sessionStorage) {
            throw 'exception';
        }

        sessionStorage.setItem('storage_test', 1);
        sessionStorage.removeItem('storage_test');

        return true;
    } catch (e) {
        return false;
    }
}

function isCookieSupported() {
    return true;
}

function processToken(action, name, token) {
    var i, ii,
        args = [tokenName.call(this, name)];

    if (token) {
        args.push(token);
    }

    for (i = 0, ii = this.options.tokenStore.length; i < ii; i++) {
        if (this.options.tokenStore[i] === 'localStorage' && isLocalStorageSupported()) {
            return localStorage[action + 'Item'](args[0], args[1]);
        }

        if (this.options.tokenStore[i] === 'sessionStorage' && isSessionStorageSupported()) {
            return sessionStorage[action + 'Item'](args[0], args[1]);
        }

        else if (this.options.tokenStore[i] === 'cookie' && isCookieSupported()) {
            return __cookie[action].apply(this, args);
        }
    }
}

function get(name) {
    return processToken.call(this, 'get', name);
}

function set(name, token) {
    return processToken.call(this, 'set', name, token);
}

function remove(name) {
    return processToken.call(this, 'remove', name);
}

function expiring() {
    return false;
}

export {
    get,
    set,
    remove,
    expiring
}