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
        path: '/users',
        name: 'site-users',
        component: loadView('site/Users'),
        meta: {
            auth: false
        }
    }, {
        path: '/login',
        name: 'auth-login',
        component: loadView('auth/Login'),
        meta: {
            auth: false
        }
    }, {
        path: '/social',
        name: 'auth-social',
        component: loadView('auth/Social'),
    }, {
        path: '/login/:type',
        name: 'auth-login-social',
        component: loadView('auth/Social'),
    }, {
        path: '/register',
        name: 'auth-register',
        component: loadView('auth/Register'),
        meta: {
            auth: false
        }
    }, {
        path: '/user',
        component: loadView('user/Index'),
        meta: {
            auth: {
                roles: ['user', 'admin'],
                rolesKey: 'type'
            }
        },
        children: [{
            path: '',
            name: 'user-landing',
            redirect: {
                name: 'user-account'
            }
        }, {
            path: 'account',
            name: 'user-account',
            component: loadView('user/Account')
        }, {
            path: 'unimpersonate',
            name: 'user-unimpersonate',
            component: loadView('user/Unimpersonate')
        }, {
            path: 'users',
            name: 'user-users',
            component: loadView('user/Users')
        }, {
            path: 'logout',
            name: 'user-logout',
            component: loadView('user/Logout')
        }]
    }, {
        path: '/admin',
        component: loadView('admin/Index'),
        meta: {
            auth: 'admin'
        },
        children: [{
            path: '/',
            name: 'admin-landing',
            redirect: {
                name: 'admin-users'
            }
        }, {
            path: 'users',
            name: 'admin-users',
            component: loadView('admin/Users')
        }]
    }, {
        path: '/',
        component: loadView('error/Index'),
        children: [{
            path: '403',
            name: 'error-403',
            component: loadView('error/403'),
        }, {
            path: '*',
            name: 'error-404',
            component: loadView('error/404'),
        }]
    }]
});

export default Vue.router;