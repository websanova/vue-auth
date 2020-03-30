# Drivers Guide


The plugin is made to re-use and integrate with existing vue plugins as much as possible.

For this reason it ships with a driver model



## Driver Types

### Auth Drivers

The token that is passed between server and app will follow a very specific format.

Typicall a user logs in with an email/password and gets back a token.

That token is then used on future requests to authenticate that user to the api.


The thing to realize is that not all tokens are the same, there are many many foramts. Hence why we have drivers to parse incoming tokens for storage and then rebuild them for future requests.


For instance the bearer.js driver will send an `authentication` header in the format


`
Authenticaiton: Bearer some-long-token-string-here
`

But some other drivers may just store 





### HTTP Drivers



### Router Drivers



## Custom Drivers

If a custom driver is needed it's best to look at one of the existing drivers and follow it's format.

Typically an "auth" custom driver will be required. These are simple to write and require only a `request` and `response` function.

**drivers/auth/bearer.js**

```
export default {
    request: function (req, token) {
        this.http.setHeaders.call(this, req, {
            Authorization: 'Bearer ' + token
        });
    },

    response: function (res) {
        var headers = this.http.getHeaders.call(this, res),
            token   = headers.Authorization || headers.authorization;

        if (token) {
            token = token.split(/Bearer:?\s?/i);

            return token[token.length > 1 ? 1 : 0].trim();
        }
    }
}
```

The driver above parses out the "Bearer" part of the response and only stores the token. Likewise on requests it will prepend the "Bearer" text.