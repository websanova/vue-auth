# Advanced Guide



## Dealing with Static Pages

There is a case where pages are fully pre-rendered in a traditional way. For instance using Laravel that delivers a rendered html page.

In this case there is some manual intervention that would need to be taken to manually set the `vue-auth` user and loaded states.

this.$auth.watch.data = {}; // user object
this.$auth.watch.loaded = true;
this.$auth.watch.authenticated = true;



## Dealing with SSR

Integrating with SSR solution has been a challenge.

It's important to note that For SSR commonly we are trying to solve two solutions.

* A fully integrated vue solution from back to front end with likely node and express.js
* SEO for an app.

With the first if we are building a fullstack solution then it's likely the authentication can be handled directly through the server. Since the calls are no login api calls at this point.

For SEO we don't need authentication.