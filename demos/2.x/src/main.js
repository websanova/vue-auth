import Vue    from 'vue';

import http   from './http'
import store  from './store'
import router from './router'
import config from './config'

import App from './pages/Index.vue';

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    http: http,
    store: store,
    router: router,
    config: config,
    render: h => h(App)
});