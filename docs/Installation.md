# Installation


## Install 2.x

```shell
> npm install @websanova/vue-auth
```

The `router` and `http` drivers MUST be set. The drivers are quite small so can be replaced or overridden as necessary.

**Note that the version in the driver file should denote the version it is compatible with. So `router.2.x.` means it's for router 2.x.**

```javascript
Vue.http.options.root = 'https://api-demo.websanova.com/api/v1';

Vue.router = new VueRouter({
    ...
});

Vue.use(require('@websanova/vue-auth'), {
    auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
    http: require('@websanova/vue-auth/drivers/http/vue-resource.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
    ...
    rolesVar: 'type'
    ...
});
```

### Install with Vue-Axios

```javascript
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'

Vue.use(VueAxios, axios)
Vue.use(VueAuth, {
    auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
    http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js')
    ...
});

// access axios with Vue or use the 'this' reference in components
Vue.axios.post(...).then(res => {
    console.log('RES', res);
});
```

## Install 1.x

```javascript
> npm install @websanova/vue-auth
```

```javascript
Vue.http.options.root = 'https://api-demo.websanova.com/api/v1';

Vue.router = new VueRouter({
    ...
});

Vue.use(require('@websanova/vue-auth'), {
    rolesVar: 'type'
});
```

**NOTE:** If you do not set your router as `Vue.router = new VueRouter()` then you will need to feed the `router` in directly through the options. Also true for `http`.

```javascript
var router = new VueRouter();
Vue.use(Auth, {
    router: router,
    http: http
});
```
