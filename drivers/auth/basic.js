export default {
    
    request: function (req, token) {
        this.http.setHeaders.call(this, req, {
            Authorization: token
        });
    },
    
    response: function (res) {
        var headers = this.http.getHeaders.call(this, res),
            token   = headers.Authorization || headers.authorization;
        
        return token;
    }
};