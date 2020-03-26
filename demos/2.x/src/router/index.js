import Vue       from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function loadView(view) {
    return () => import(`../pages/${view}.vue`);
}

Vue.router = new VueRouter({
    hashbang: false,
    mode: 'history',
    base: __dirname,
    routes: [{
        path: '/',
        name: 'site-home',
        component: loadView('site/Home'),
        meta: {
            auth: false
        }
    }, {
        path: '/login',
        name: 'auth-login',
        component: loadView('auth/Login')
    }, {
        path: '/register',
        name: 'auth-register',
        component: loadView('auth/Register')
    }, {
        path: '/account',
        name: 'user-account',
        component: loadView('user/Account')
    }, {
        path: '/404',
        name: 'error-404',
        component: loadView('error/404')
    }]
});

export default Vue.router;