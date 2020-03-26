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

        login(ctx, data) {
            return new Promise((resolve, reject) => {
                Vue.auth.login({
                    url: 'auth/login',
                    body: data.body,
                })
                .then((res) => {
                    Vue.router.push({
                        name: ctx.getters.user.type + '-landing'
                    });

                    resolve(res);
                }, reject);
            });
        },

        register() {

        },

        impersonate(ctx, data) {
            var props = this.getters['properties/data'];

            Vue.auth.impersonate({
                url: 'auth/' + data.id + '/impersonate',
                redirect: props.auth.impersonateRedirect
            });
        },

        unimpersonate(ctx) {
            Vue.auth.unimpersonate({
                redirect: props.auth.unimpersonateRedirect
            });
        },    

        admin(ctx) {
            Vue.router.push({
                name: Vue.auth.user().type + '-landing'
            });
        },

        logout(ctx) {
            Vue.auth.logout();
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