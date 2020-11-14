<template>
    <div class="container container-sm">
        <div class="input-group">
            <input
                v-model="state.form.body.first_name"
                placeholder="First Name"
                type="text"
            />

            <div class="text-danger text-sm">{{ state.form.errors.first_name }}</div>
        </div>

        <div class="input-group">
            <input
                v-model="state.form.body.email"
                placeholder="Email"
                type="text"
            />

            <div class="text-danger text-sm">{{ state.form.errors.email }}</div>
        </div>

        <div class="input-group">
            <input
                v-model="state.form.body.password"
                placeholder="Password"
                type="password"
            />

            <div class="text-danger text-sm">{{ state.form.errors.password }}</div>
        </div>

        <div class="input-group">
            <input
                v-model="state.form.body.tos_pp"
                type="checkbox"
            />

            Accept terms of service.

            <div class="text-danger text-sm">{{ state.form.errors.tos_pp }}</div>
        </div>

        <div class="input-group">
            <input
                v-model="state.form.remember"
                type="checkbox"
            />

            Remember Me
        </div>

        <div class="input-group">
            <input
                v-model="state.form.staySignedIn"
                type="checkbox"
            />

            Stay Signed In
        </div>

        <div class="input-group">
            <input
                v-model="state.form.fetchUser"
                type="checkbox"
            />

            Fetch User
        </div>

        <div class="input-group">
            <input
                v-model="state.form.autoLogin"
                type="checkbox"
            />

            Auto Login
        </div>

        <br/>

        <ul class="spacer">
            <li>
                <button @click="registerThen">
                    Then
                </button>
            </li><li>
                <button @click="registerRedirect">
                    Redirect
                </button>
            </li><li>
                <button @click="registerDefault">
                    Default
                </button>
            </li><li>
                <button @click="registerComp">
                    Comp
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
    import {reactive } from 'vue';
    import {useStore } from 'vuex';
    import {useRouter} from 'vue-router';
    import {useAuth  } from '@websanova/vue-auth/src/v3.js';
    import useAuthComp from '../../../src/composables/useAuthComp.js';

    export default {
        setup() {
            const auth     = useAuth();
            const store    = useStore();
            const router   = useRouter();
            const authComp = useAuthComp();

            const state = reactive({
                form: {
                    body: {
                        email: '',
                        password: '',
                        tos_pp: false,
                    },

                    errors: {},
                    remember: false,
                    fetchUser: true,
                    autoLogin: true,
                    staySignedIn: false,
                }
            });

            function errors(res) {
                state.form.errors = Object.fromEntries(res.data.errors.map(item => [item.field, item.msg]));
            }

            function registerDefault() {
                auth
                .register({
                    data: state.form.body,
                    remember: state.form.remember ? '{"name": "Default"}' : null,
                    fetchUser: state.form.fetchUser,
                    autoLogin: state.form.autoLogin,
                    staySignedIn: state.form.staySignedIn,
                })
                .then(null, (res) => {
                    errors(res.response);
                });
            }

            function registerRedirect() {
                auth
                .register({
                    data: state.form.body,
                    redirect: {name: 'user-account'},
                    remember: state.form.remember ? '{"name": "Redirect"}' : null,
                    fetchUser: state.form.fetchUser,
                    autoLogin: state.form.autoLogin,
                    staySignedIn: state.form.staySignedIn,
                })
                .then(null, (res) => {
                    errors(res.response);
                });
            }

            function registerThen() {
                auth
                .register({
                    data: state.form.body,
                    fetchUser: state.form.fetchUser,
                    autoLogin: state.form.autoLogin,
                    staySignedIn: state.form.staySignedIn,
                })
                .then(() => {
                    if (state.form.remember) {
                        auth.remember(JSON.stringify({
                            name: auth.user().first_name
                        }));
                    }

                    router.push({name: 'user-account'});
                }, (res) => {
                    errors(res.response);
                });
            }

            function registerComp() {
                authComp
                .register({
                    body: state.form.body,
                    remember: state.form.remember,
                    fetchUser: state.form.fetchUser,
                    autoLogin: state.form.autoLogin,
                    staySignedIn: state.form.staySignedIn,
                })
                .then(null, (res) => {
                    errors(res.response);
                });
            }

            return {
                state,
                registerThen,
                registerComp,
                registerDefault,
                registerRedirect,
            };
        }
    }
</script>