# Startup Guide

Authentication is going be to be one of the first things an application requires.

The vue-auth plugin attempts to simplify the front end application part of the puzzle. However it's important to understand that the plugin doesn't simply work on it's own. It is only one of the pieces in the puzzle and some prior knowledge and api setup will be required.

If you are new to single page app development it's a good idea to take a look at the [Primer Guide] first.


## Install

 - basic install
 - plugin install...



## Drivers

The drivers for the most part should work out of the box. However the more commonly required customization will come with the "auth" driver. It's best to check the [Drivers Guide]() guide for more info if that's needed.


 - for now we can just stick with the default router
   - the default vue-resource or axios
   - the default bearer or basic


## Auth Meta

The first thing after installing the plugin will be to setup some routes and auth meta for those routes.

For now we'll just do a simple example make a user route require a login

 - show example meta.auth = false example

- example of login / user areas... etc

With those routes and pages setup we can go ahead and try to go to /user/profile page, it should redirect us to the login.

There is also a lot more detailed [Auth Meta Guide]() guide which covers this in a lot more detail.





## 