function setCookie (key, value, params) {
    var i,
        cookie = key + '=' + value + ';';

    for (i in params) {

        // Just skip if unset or false.
        if (params[i] === false || params[i] === undefined) {
            continue;
        }

        // If null and an option method exists such ex: "getCookieDomain".
        else if (params[i] === null) {
            if (this.options['getCookie' + i]) {
                cookie += ' ' + i + '=' + this.options['getCookie' + i]() + ';';
            }
        }

        // If true just set the flag as in "Secure;".
        else if (params[i] === true) {
            cookie += ' ' + i + ';';
        }

        // Default key/val.
        else {
            cookie += ' ' + i + '=' + params[i] + ';';
        }
    }

    document.cookie = cookie;
}

function getDate(val) {
    if (typeof val === 'string') {
        return val;
    }
    else if (val !== null && val !== undefined) {
        return (new Date((new Date()).getTime() + val)).toUTCString();
    }

    return val;
}

function set(key, value, expires) {
    var params = this.options.cookie;

    params.Expires = expires === true ? '' : getDate(params.Expires);

    setCookie.call(this, key, value, params);
}

function get(key) {
    var i, ii,
        cookie = document.cookie;

     cookie = cookie
        .replace(/;\s+/g, ';')
        .split(';')
        .map(function(s) {
            return s.replace(/\s+=\s+/g, '=').split('=');
         });

    for (i = 0, ii = cookie.length; i < ii; i++) {
        if (cookie[i][0] && cookie[i][0] === key) {
            return cookie[i][1];
        }
    }

    return null;
}

function remove(key) {
    var params = Object.assign({}, this.options.cookie);

    params.Expires = getDate(-12096e5);

    setCookie.call(this, key, '', params);
}

export {
    get,
    set,
    remove
};
