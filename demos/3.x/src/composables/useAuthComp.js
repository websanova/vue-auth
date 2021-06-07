import {useRouter} from 'vue-router';
import {useAuth  } from '@websanova/vue-auth/src/v3.js';

export default function useAuthComp() {
    const auth   = useAuth();
    const router = useRouter();
 
    function fetch(data) {       
        return auth.fetch(data);
    }

    function refresh(data) {
        return auth.refresh(data);
    }

    function login(data) {
        data = data || {};

        return new Promise((resolve, reject) => {
            auth.login({
                url: 'auth/login',
                data: data.body,
                remember: data.remember,
                staySignedIn: data.staySignedIn,
                fetchUser: data.fetchUser,
            })
            .then((res) => {
                if (data.remember) {
                    auth.remember(JSON.stringify({
                        name: res.response.data.user.first_name
                    }));
                }

                router.push({
                    name: res.data.data.type + '-landing'
                });

                resolve(res);
            }, reject);
        });
    };

    function register(data) {
        data = data || {};

        return new Promise((resolve, reject) => {
            auth.register({
                url: 'auth/register',
                data: data.body,
                autoLogin: false,
            })
            .then((res) => {
                if (data.autoLogin) {
                    login(data).then(resolve, reject);
                }
            }, reject);
        });
    }

    function impersonate(data) {
        return auth.impersonate({
            url: 'auth/' + data.user.id + '/impersonate',
            redirect: {
                name: 'user-account'
            }
        });
    }

    function unimpersonate() {
        return auth.unimpersonate({
            redirect: {
                name: 'admin-users'
            }
        });
    }    

    function logout() {
        return auth.logout();
    }

    function user() {
        return auth.user();
    }

    function impersonating() {
        return auth.impersonating();
    }

    return {
        fetch,
        refresh,
        login,
        register,
        impersonate,
        unimpersonate,
        logout,
        user,
        impersonating,
    }
}
