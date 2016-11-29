module.exports = {
    tokens: ['Token-Type', 'Access-Token', 'Client', 'Uid', 'Expiry'],

    request: function (req, token) {
        var headers = {},
            tokens = token.split(';');

        this.options.deviseAuth.tokens.forEach(function (tokenName, index) {
            if (tokens[index]) {
                headers[tokenName] = tokens[index];
            }
        });
        
        this.options.http._setHeaders.call(this, req, headers);
    },
    
    response: function (res) {
        var token = [],
            headers = this.options.http._getHeaders.call(this, res);
        
        if (headers['Access-Token']) {
            this.options.deviseAuth.tokens.forEach(function (tokenName) {
                if (headers[tokenName]) {
                    token.push(headers[tokenName]);
                }
            });
            
            return token.join(';');
        }
    }
};