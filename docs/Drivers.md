# Drivers

In the 2.x version the plugin now features a driver centric model.

**NOTE: Some drivers may have dependencies such as `Vue.router` being set.**

~~~
Vue.use(require('@websanova/vue-auth'), {
    auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
    http: require('@websanova/vue-auth/drivers/http/vue-resource.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
    ...
});
~~~

If you are creating a driver a method named `_init` which will receive the current auth scope can be used to check for any dependencies.
