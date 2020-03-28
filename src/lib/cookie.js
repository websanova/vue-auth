function setCookie (key, value, timeOffset) {
    var domain  = this.options.getDomain(),
        cookie  = key + '=' + value + '; SameSite=None;',
        expires = '';

    if (timeOffset) {
        expires = (new Date((new Date()).getTime() + timeOffset)).toUTCString();
    }

    cookie += ' Expires=' + expires + ';';

    if (domain !== 'localhost') {
        cookie += ' Path=/; Domain=' + domain + ';';
    }
    
    if (location.protocol === 'https:') {
        cookie += ' Secure;';
    }

    document.cookie = cookie;
}

function set(key, value, expires) {
    setCookie.call(this, key, value, (expires ? 0 : 1) * 12096e5);
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
    setCookie.call(this, key, '', -12096e5);
}

export {
    get,
    set,
    remove
};