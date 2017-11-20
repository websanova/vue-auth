# Step By Step Guide

A quick guide on Vue Auth.


## Install an AJAX Library.

First setup the `http` driver. The two that come supported out of the box are Axios and Vue Resource.

**Axios:**

```javascript
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = 'https://api-demo.websanova.com/api/v1';

```

**Vue Resource:**

```javascript
import VueResource from 'vue-resource';
Vue.use(VueResource);

Vue.http.options.root = 'https://api-demo.websanova.com/api/v1';
```

**NOTE:** Don't forget to set the `baseURL` or `root` to whatever API end point you are using.


## Install the Router

Currently only support for the default Vue router exists.

The router driver requires that `Vue.router` is set.

```javascript
import router from './router'
Vue.router = router
```


## Install the Plugin

The plugin can then be installed.

```javascript
Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js')
})
```

**NOTE:** It could help to look at the 2.x demo [app.js](https://github.com/websanova/vue-auth/blob/master/demos/2.x/src/app.js) file.


## Select an Authentication Method

Currently there are three authentication methods supported out of the box: [basic](https://github.com/websanova/vue-auth/blob/master/drivers/auth/basic.js), [bearer](https://github.com/websanova/vue-auth/blob/master/drivers/auth/bearer.js) and [devise](https://github.com/websanova/vue-auth/blob/master/drivers/auth/devise.js).

Likely the most common is `bearer` but it's not too difficult to write a new one by following the existing format from the current three supported drivers.

* [basic](https://github.com/websanova/vue-auth/blob/master/drivers/auth/basic.js)
* [bearer](https://github.com/websanova/vue-auth/blob/master/drivers/auth/bearer.js)
* [devise](https://github.com/websanova/vue-auth/blob/master/drivers/auth/devise.js)


## Checking for The "ready" State

Before using `$auth` the app should make sure it has been properly loaded first by using `$auth.ready()`.

This is to ensure that if the app is fetching a user or doing any refresh in the background it's all done first. If this is not done than things like calling `$auth.user()` may return empty.

In the main Vue component this should be checked.

```html
<template>
    <div>
        <div v-if="$auth.ready()">
            <router-view></router-view>
        </div>

        <div v-if="!$auth.ready()">
            Loading ...
        </div>
    </div>
</template>
```

**NOTE:** It could help to look at the 2.x demo [App.vue](https://github.com/websanova/vue-auth/blob/master/demos/2.x/src/components/App.vue) file.


## Using Vue Auth

At this point the plugin should be fully working.

An important note to realize is that when making requests Vue Auth is heavily relying on the `http` driver.

This means that when a request like `login` is made.

```javascript
$auth.login({
    body: {email: 'test@example.com', password: 'secret'},
    rememberMe: true 
});
```

**NOTE:** The field `body` would be `data` if using Axios.

Even though there are some extra parameters like `rememberMe`, this object will still get passed directly into the auth driver.

Essentially the plugin acts as an interceptor to do some work for us like setting a `rememberMe` cookie. But otherwise the request for the login would look like this (if using Vue Resource).

```javascript
$http({
    method: 'post',
    url: : 'auth/login',
    body: {email: 'test@example.com', password: 'secret'},
    rememberMe: true 
});
```

This also means any response will be directly the response that comes from the `http` driver that is being used.


## Handling Errors

There is not really any standard default way to handle an error as a simple status code like `401` can mean different things depending on usage. It would typically need to be accompanied by some internal code.

For this reason the implementation of errors should be handled separately by the app. It's likely there will be some global handler for this anyway.

```javascript
Vue.http.interceptors.push(function(request, next) {
    next(function (res) {

        // Unauthorized Access
        
        if (
            res.status === 401 &&
            ['UnauthorizedAccess', 'InvalidToken'].indexOf(res.data.code) > -1
        ) {
            Vue.auth.logout({
                redirect: {name: 'auth-login'}
            });
        }
        
        // System Error

        else if (res.status === 500) {
            Vue.router.push({name: 'error-500'});
        }
    });
});
```