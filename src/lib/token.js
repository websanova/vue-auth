var __cookie = require('./cookie.js');

module.exports = (function () {

    function tokenName(name) {
        name = name || this.currentToken;

        if ( ! name && this.other.call(this)) { name = 'other'; }
        else if ( ! name || name === 'default') { name = 'default'; }

        return name + '_' + this.options.tokenName;
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

    return {
        get: function (name) {
            name = tokenName.call(this, name);

            if (isLocalStorageSupported()) {
                return localStorage.getItem(name);
            }
            else {
                return __cookie.get.call(this, name);
            }
        },

        set: function (name, token) {
            name = tokenName.call(this, name);

            if (token) {
                if (isLocalStorageSupported()) {
                    localStorage.setItem(name, token);
                }
                else {
                    __cookie.set.call(this, name, token);
                }
            }
        },

        delete: function (name) {
            name = tokenName.call(this, name);

            if (isLocalStorageSupported()) {
                localStorage.removeItem(name);
            }
            else {
                __cookie.delete.call(this, name);
            }
        },

        expiring: function () {
            return false;
        }
    }

})();