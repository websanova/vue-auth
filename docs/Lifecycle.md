# Lifecycle

The best way to see the code in action is to see the code samples in the `1.x.demo` and `2.x.demo` folders. However it still helps to understand what exactly the workflow is.

* The plugin has two sets of interceptors. One for routing and one for http requests.

### Routing

* From the front end we can't really do any "real" authentication. It's simply a check to see it users role and the routes roles match up. From there we can allow the route to process or we can redirect accordingly.
* This is done by intercepting each route and checking if the user is already logged in. This is done by simply checking if a token exists.
* If a token exists a few things can happen. For one we would attempt to fetch the users data. The second part deals with refreshing the token which has a few strategies and is discussed in the next section.
* Typically a user will be fetched each time to make sure we have the latest user data.
* After the user is fetched the plugin will process into a "loaded" state. This should be checked via the "$auth.ready()" method. At this point we will know if we have a valid token and user.
* From here we can use the `$auth.check()` function to show hide various parts of our interface.

### HTTP

* The http part is much simpler. Essentially the plugin will automatically parse some authentication data (based on driver) into each request the app makes.
* This parsing will be done on each `request` and `response` of your http (ajax) calls.
* For the request it will simply append the auth data in the header or body (depending on your auth driver).
* For the response it will parse the auth data from the header or response data (depending on your auth driver).
