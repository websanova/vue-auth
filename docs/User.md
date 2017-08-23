# User

A common gotcha is getting the `$auth.user()` data properly. The plugin is designed to expect the user object to be in the `data` parameter of the response.

Depending on what version of the `vue-resource` plugin you are using the response data itself will come from either `res.json()` or `res.data`. Note that the data here is not the response data.

Sample response.

```javascript
{
    "status": "success",
    "data": {
        "id": 1,
        "name": "Websanova",
        ...
    }    
}
```

The plugin has a function for parsing this user data when it receives it called `_parseUserData`. The `data` variable there is the `res.json()` or `res.data` object.

```javascript
function _parseUserData(data) {
    return data.data;
}
```

If a different format is needed simply override this function in the options.

```javascript
Vue.use(require('vue-auth'), {
    parseUserData: function (data) {
        return data.whatever;
    }
});
```