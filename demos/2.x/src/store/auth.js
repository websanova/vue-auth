import Vue from 'vue';

export default {
    namespaced: true,

    state() {
        return {
            
        };
    },

    actions: {
        fetch(data) {
            return Vue.auth.fetch(data);
        },

        refresh(data) {
            return Vue.auth.refresh(data);
        },

        login(ctx, data) {
            data = data || {};

            return new Promise((resolve, reject) => {
                Vue.auth.login({
                    url: 'auth/login',
                    data: data.body,
                    remember: data.remember,
                    staySignedIn: data.staySignedIn,
                })
                .then((res) => {
                    if (data.remember) {
                        Vue.auth.remember(JSON.stringify({
                            name: ctx.getters.user.first_name
                        }));
                    }

                    Vue.router.push({
                        name: ctx.getters.user.type + '-landing'
                    });

                    resolve(res);
                }, reject);
            });
        },

        register(ctx, data) {
            data = data || {};

            return new Promise((resolve, reject) => {
                Vue.auth.register({
                    url: 'auth/register',
                    data: data.body,
                    autoLogin: false,
                })
                .then((res) => {
                    if (data.autoLogin) {
                        ctx.dispatch('login', data).then(resolve, reject);
                    }
                }, reject);
            });
        },

        impersonate(ctx, data) {
            var props = this.getters['properties/data'];

            Vue.auth.impersonate({
                url: 'auth/' + data.user.id + '/impersonate',
                redirect: 'user-account'
            });
        },

        unimpersonate(ctx) {
            Vue.auth.unimpersonate({
                redirect: 'admin-users'
            });
        },    

        logout(ctx) {
            return Vue.auth.logout();
        },
    },

    getters: {
        user() {
            return Vue.auth.user();
        },

        impersonating() {
            return Vue.auth.impersonating();
        }
    }
}