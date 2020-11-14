<template>
    <div class="container container-sm">
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

        <br/>

        <ul class="spacer">
            <li>
                <button @click="loginManual">
                    Manual
                </button>
            </li><li>
                <button @click="loginThen">
                    Then
                </button>
            </li><li>
                <button @click="loginRedirect">
                    Redirect
                </button>
            </li><li>
                <button @click="loginDefault">
                    Default
                </button>
            </li><li>
                <button @click="loginComp">
                    Comp
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
    import {reactive } from 'vue';
    import {onMounted} from 'vue';
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
                        email: 'super@starter.com',
                        password: 'testtest',
                    },
                    remember: false,
                    fetchUser: true,
                    staySignedIn: false,
                    errors: {}
                }
            });

            onMounted(() => {
                console.log(auth.redirect());
            });

            function errors(res) {
                state.form.errors = Object.fromEntries(res.data.errors.map(item => [item.field, item.msg]));
            }

            function loginDefault() {
                auth
                .login({
                    data: state.form.body,
                    remember: state.form.remember ? '{"name": "Default"}' : null,
                    fetchUser: state.form.fetchUser,
                    staySignedIn: state.form.staySignedIn,
                    redirect: '/'
                })
                .then(null, (res) => {
                    errors(res.response);
                });
            }

            function loginRedirect() {
                auth
                .login({
                    data: state.form.body,
                    redirect: {name: 'user-account'},
                    remember: state.form.remember ? '{"name": "Redirect"}' : null,
                    fetchUser: state.form.fetchUser,
                    staySignedIn: state.form.staySignedIn,
                })
                .then(null, (res) => {
                    errors(res.response);
                });
            }

            function loginThen() {
                auth
                .login({
                    data: state.form.body,
                    redirect: null,
                    fetchUser: state.form.fetchUser,
                    staySignedIn: state.form.staySignedIn,
                })
                .then((res) => {
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

            function loginComp() {
                authComp.login({
                    body: state.form.body,
                    remember: state.form.remember,
                    fetchUser: state.form.fetchUser,
                    staySignedIn: state.form.staySignedIn,
                })
                .then(null, (res) => {
                    errors(res.response);
                });
            }

            function loginManual() {
                auth.token(null, 'manual', false);

                auth
                .user({
                    id: 1,
                    first_name: 'Manual',
                    email: 'test@manual.com',
                    type: 'user',
                });

                if (state.form.remember) {
                    auth
                    .remember(JSON.stringify({
                        name: auth.user().first_name
                    }));
                }
                else {
                    auth.unremember();
                }

                router.push({name: 'user-landing'});
            }

            return {
                state,
                loginThen,
                loginComp,
                loginManual,
                loginDefault,
                loginRedirect,
            }
        }
    }
</script>