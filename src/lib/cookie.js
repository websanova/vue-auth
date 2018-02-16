module.exports = (function () {

    function setCookie (name, value, timeOffset) {
        var domain = this.options.cookieDomain(),
            expires = (new Date((new Date()).getTime() + timeOffset)).toUTCString(),
            cookie = name + '=' + value + '; Expires=' + expires + ';';
        
        if (domain !== 'localhost') {
            cookie += ' Path=/; Domain=' + domain + ';';
        }

        document.cookie = cookie;
    }

    return {
        remember: function(rememberMe) {
            setCookie.call(this,
                'rememberMe',
                rememberMe === true ? 'true' : 'false',
                rememberMe === true ? 12096e5 : undefined
            );
        },

        set: function(name, value, expires) {
            if (value) {
                setCookie.call(this, name, value, 12096e5);
            }
        },

        get: function(name) {
            var i, ii,
                cookie = document.cookie;

             cookie = cookie.replace(/;\s+/g, ';')
                            .split(';')
                            .map(function(s) {
                                return s.replace(/\s+\=\s+/g, '=').split('=');
                             });

            for (i = 0, ii = cookie.length; i < ii; i++) {
                if (cookie[i][0] && cookie[i][0] === name) {
                    return cookie[i][1];
                }
            }

            return null;
        },

        exists: function(name) {
            return document.cookie.match(/rememberMe/);
        },

        remove: function(name) {
            setCookie.call(this, name, '', -12096e5);
        }
    };

})();