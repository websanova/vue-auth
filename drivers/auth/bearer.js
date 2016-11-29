module.exports = {
    
    request: function (req, token) {
        this.options.http._setHeaders.call(this, req, {Authorization: 'Bearer ' + token});
    },
    
    response: function (res) {
        var token = this.options.http._getHeaders.call(this, res).Authorization;

        if (token) {
            token = token.split('Bearer ');
            
            return token[token.length > 1 ? 1 : 0];
        }
    }
};