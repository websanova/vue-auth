# FAQ

### I'm getting an error that `router` is not found.

This is a particular issue of using `vue-resource` that requires `Vue.router` to be set before the plugin is initialized.



### I've logged in successfully but it's not working after.

Likely related to token issues with a valid token not being sent back. First steps are to fully verify that the token is indeed being sent back.



### Why is the token not being set?

By default the plugin will look for a token in `Authorization` header. This is controlled by one of the [auth](https://github.com/websanova/vue-auth/tree/master/drivers/auth) drivers. These are simple drivers that simple set and get a token. It's best to start debugging here if there are issues with tokens.



### How can I authenticate without using the `Authorization` header.

The token can be supplied anywhere in your app response. The provided [auth](https://github.com/websanova/vue-auth/tree/master/drivers/auth) drivers are common methods for authenticating users in single page apps. Simply view any of the [auth]https://github.com/websanova/vue-auth/tree/master/drivers/auth) drivers as a guide to write your own custom driver.



### My app has 2 or more fields required for authentication.

In this case write a custom [auth](https://github.com/websanova/vue-auth/tree/master/drivers/auth) and simply append the fields together using some kind of separator such as a pipe (`|`), semicolon (`;`), etc.
