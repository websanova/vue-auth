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

The router" driver requires that `Vue.router` is set.

```javascript
import router from './router'
Vue.router = router
```

The plugin can then be installed.

```javascript
Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js')
})
```


## Select an Authentication Method

Currently there are three authentication methods supported out of the box: [basic](https://github.com/websanova/vue-auth/blob/master/drivers/auth/basic.js), [bearer](https://github.com/websanova/vue-auth/blob/master/drivers/auth/bearer.js) and [devise](https://github.com/websanova/vue-auth/blob/master/drivers/auth/devise.js).

Likely the most common is `bearer` but it's not too difficult to write a new one by following the existing format.


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


## Using Vue Auth

At this point the plugin should be fully working.

An important not to realize is that when making requests Vue Auth is heavily relying on the `http` driver.

This means that when a request like `login` is made.

```javascript
$auth.login({
    body: {email: 'test@example.com', password: 'secret'},
    rememberMe: true 
});
```

**NOTE:** The field `body` would be `data` if using Axios.

Even though there are some extra parameters like `rememberMe`, this object will still get passed directly into the auth driver.

Essentially the plugin acts as an interceptor to do some work for us like setting a `rememberMe` cookie. But otherwise the request for the login would like this (if using Vue Resource).

```javascript
$http({
    method: 'post',
    url: : 'auth/login',
    body: {email: 'test@example.com', password: 'secret'},
    rememberMe: true 
});
```

This also means any response will be directly the response that comes from the `auth` driver that is being used.


## Common Gotchas

A common issue is the Axios error response. When doing `console.log(error)` it will output the error string.

**NOTE:** To get the response in the error `console.log(error.response)` must be used.


