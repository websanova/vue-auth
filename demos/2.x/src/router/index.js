import Vue       from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

Vue.router = new VueRouter({
    hashbang: false,
    mode: 'history',
    base: __dirname,
    routes: []
});

export default Vue.router;