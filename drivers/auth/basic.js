module.exports = {
    
    request: function (req, token) {
        this.options.http._setHeaders.call(this, req, {Authorization: token});
    },
    
    response: function (res) {
        var token = this.options.http._getHeaders.call(this, res).Authorization;
        
        return token;
    }
};