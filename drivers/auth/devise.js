module.exports = {
    tokens: ['Token-Type', 'Access-Token', 'Client', 'Uid', 'Expiry',
        'token-type', 'access-token', 'client', 'uid', 'expiry'],

    request: function (req, token) {
        var headers = {},
            tokens = token.split(';');

        var auth =  this.options.deviseAuth || this.options.auth;
        auth.tokens.forEach(function (tokenName, index) {
            if (tokens[index]) {
                headers[tokenName] = tokens[index];
            }
        });
        
        this.options.http._setHeaders.call(this, req, headers);
    },
    
    response: function (res) {
        var token = [],
            headers = this.options.http._getHeaders.call(this, res);
        
        if (headers['access-token'] || headers['Access-Token']) {
            var auth =  this.options.deviseAuth || this.options.auth;
            auth.tokens.forEach(function (tokenName) {
                if (headers[tokenName]) {
                    token.push(headers[tokenName]);
                }
            });
            
            // Check if access-token more recent than last one
            if (!this.token() || parseInt(token[4], 10) >= parseInt(this.token().split(';')[4], 10)) {
                return token.join(';');
            }
        }
    }
};
