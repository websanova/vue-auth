# Authentication

Because there are so many different authentication schemes with tokens Vue Auth uses a simple model so that it can easily be extended for custom scenarios.

Each request and response that is made to the server is intercepted internally by the plugin.

* The internal request method will fetch the current token (internally) and pass it to the auth `request` driver method where it can be processed for delivery to the server.
* The internal response method will behave in a similar fashion however it should deliver a token to the internal response intercept where that token will get stored.

The current `bearer` driver is quite simple and looks like this:

```javascript
bearerAuth: {
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
},
```

The driver `request` method receives the `req` and `token` arguments. From there we use an internal `_setHeaders` method. However with the `req` object pretty much anything can be assembled.

The driver `response` method receives the `res` argument and should parse out the token from the response and return a token which will get stored internally by the plugin.

To setup a custom driver we simply need to set the `authType` option and the naming convention will follow.

**Example 1: Token in sub object of body** 

Maybe the token is returned in a non standard way such as `{data: {token: 'abcd1234'}}`.

```javascript
authType: 'custom1',

custom1Auth: {
    request: function (req, token) {
        req.headers.set('SomeHeader', token);
    },
    response: function (res) {
        return (res.data.data || {}).token;
    }
}
```

**Example 2: Token with multiple parts** 

Another common scenario may be a token with multiple data points that all need to be returned to the server.

```javascript
authType: 'custom2',

custom2Auth: {
    request: function (req, token) {
        token = token.split(';');

        this.options.http._setHeaders.call(this, req {
            header1: token[0],
            header2: token[1],
            header3: token[2],
            header4: token[3]
        });
    },
    response: function (res) {
        var headers = this.options.http._getHeaders.call(this, res);

        if (headers.header1 && headers.header2 && headers.header3 && headers.header4) {
            return headers.header1 + ';' + headers.header2 + ';' + headers.header3 + ';' + headers.header4;
        }
    }
}
```