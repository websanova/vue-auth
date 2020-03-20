module.exports = (function () {

    function setCookie (name, value, timeOffset) {
        var domain = this.options.cookieDomain(),
            sameSiteRule = this.options.cookieSameSiteRule,
            expires = (new Date((new Date()).getTime() + (timeOffset * 60000))).toUTCString(),
            cookie = name + '=' + value + '; Expires=' + expires + ';';

        if (domain !== 'localhost') {
            cookie += ' Path=/; Domain=' + domain + ';';
        }

        if (null !== sameSiteRule) {
            cookie += 'SameSite=' + sameSiteRule + ';';
        }

        if (location.protocol === 'https:') {
            cookie += 'secure';
        }

        document.cookie = cookie;
    }

    return {
        remember: function(rememberMe) {
            setCookie.call(this,
                this.options.rememberMeCookieName,
                rememberMe === true ? 'true' : 'false',
                rememberMe === true ? this.options.cookieExpireOffset : undefined
            );
        },

        set: function(name, value, expires) {
            if (value) {
                setCookie.call(this, name, value, this.options.cookieExpireOffset);
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
            return document.cookie.match(name);
        },

        remove: function(name) {
            setCookie.call(this, name, '', -this.options.cookieExpireOffset);
        }
    };

})();
