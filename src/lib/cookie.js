function setCookie (name, value, timeOffset) {
    var domain = this.options.getDomain(),
        expires = (new Date((new Date()).getTime() + timeOffset)).toUTCString(),
        cookie = name + '=' + value + '; Expires=' + expires + ';';
    
    if (domain !== 'localhost') {
        cookie += ' Path=/; Domain=' + domain + ';';
    }
    
    if (location.protocol === 'https:') {
        cookie += 'secure';
    }

    document.cookie = cookie;
}

function remember(rememberMe) {
    setCookie.call(this,
        'rememberMe',
        rememberMe === true ? 'true' : 'false',
        rememberMe === true ? 12096e5 : undefined
    );
}

function set(name, value, expires) {
    if (value) {
        setCookie.call(this, name, value, 12096e5);
    }
}

function get(name) {
    var i, ii,
        cookie = document.cookie;

     cookie = cookie.replace(/;\s+/g, ';')
                    .split(';')
                    .map(function(s) {
                        return s.replace(/\s+=\s+/g, '=').split('=');
                     });

    for (i = 0, ii = cookie.length; i < ii; i++) {
        if (cookie[i][0] && cookie[i][0] === name) {
            return cookie[i][1];
        }
    }

    return null;
}

function exists(name) {
    return document.cookie.match(/rememberMe/);
}

function remove(name) {
    setCookie.call(this, name, '', -12096e5);
}

export {
    set,
    get,
    remove,
    exists,
    remember
}