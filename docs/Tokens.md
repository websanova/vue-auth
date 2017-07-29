# Tokens

Dealing with the token refresh is the tricker part in the authentication auth flow. It helps to review what is actually happening here first.

* A user logs in and gets a token. this token is valid for a certain period of time.
* Let's say the user gets a token that is always valid. This presents some security issues in case a device is lost or compromised.
* We can therefore limit access to the app by setting the tokens expiration to something like one or two weeks.
* Now there is an expiration so if the users device is compromised we are at least limiting the potential damage.
* However as long as the user keeps using the app we should keep them logged in by continually re-issuing new tokens.

This is where the issue lies with JWT and token based authentication. The question is what kind of refresh strategy do we want to employ?

Currently, there doesn't seem to be any official way to do this. With only a few "best practices" which are personal opinions at best.

A few notes:

**NOTE:** We need to make sure our old token lives slightly longer pass the expiration. Since multiple calls to the server at the same time would then be using expired tokens depending on which request expired the token first.

**NOTE:** The plugin will automatically pick up the token wherever it's set based on the driver used.

A few strategies:

**> Set a new token with each request (with old tokens living slightly longer in case of async requests).**

It would depend on the app, but this one can be a bit overkill.

**> Set a timer or counter for a token refresh request.**

This is actually not a bad strategy. But again might be a bit overkill.

**> Check the tokens expiration date before or after each request.**

This was actually previously implemented in the plugin. It was removed because of the overhead since it requires a base64 encode/decode. It would be best suited as a separate custom authentication driver.

**> Set the user token and refresh token time to same time length and call refresh with each reload of the app.**

This relies on the token being set once at login and then a separate refresh on each page reload.

* This is the default behavior of the plugin.
* The tokens are the same time length so there is no worry about a mismatch on timing.
* They would also both expire at the same time if the app is unused.
* There is also the benefit of no timer overlaps so async requests don't needed extended life on expired tokens.

Because different apps have different strategies and requirements an option has been added to disable fresh.

~~~
refreshData: {
    enabled: false // true by default.
}
~~~

The refresh request could done be done manually via the `refresh` method.

~~~
this.$auth.refresh();
~~~