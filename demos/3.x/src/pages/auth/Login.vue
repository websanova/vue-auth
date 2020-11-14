<template>
    <div class="container container-sm">
        <div class="input-group">
            <input
                v-model="state.form.body.email"
                placeholder="Email"
                type="text"
            />

            <div>{{ state.form.errors.email }}</div>
        </div>

        <div class="input-group">
            <input
                v-model="state.form.body.password"
                placeholder="Password"
                type="password"
            />

            <div>{{ state.form.errors.password }}</div>
        </div>

        <div class="input-group">
            <input
                v-model="state.form.remember"
                type="checkbox"
            />

            Remember Me

            <div />
        </div>

        <div class="input-group">
            <input
                v-model="state.form.staySignedIn"
                type="checkbox"
            />

            Stay Signed In

            <div />
        </div>
        
        <div class="input-group">
            <input
                v-model="state.form.fetchUser"
                type="checkbox"
            />

            Fetch User

            <div />
        </div>

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
                <button @click="loginVuex">
                    Vuex
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
    import {reactive          } from 'vue';
    import {onMounted         } from 'vue';
    import {getCurrentInstance} from 'vue';

    export default {
        setup() {
            const ctx = getCurrentInstance().ctx;

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
                console.log(ctx.$auth.redirect());
            });

            function loginDefault() {
                ctx.$auth
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
                ctx.$auth
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
                ctx.$auth
                    .login({
                        data: state.form.body,
                        redirect: null,
                        fetchUser: state.form.fetchUser,
                        staySignedIn: state.form.staySignedIn,
                    })
                    .then((res) => {
                        if (state.form.remember) {
                            ctx.$auth.remember(JSON.stringify({
                                name: ctx.$auth.user().first_name
                            }));
                        }

                        ctx.$router.push({name: 'user-account'});
                    }, (res) => {
                        errors(res.response);
                    })
            }

            function loginVuex() {
                ctx.$store
                    .dispatch('auth/login', {
                        data: state.form.body,
                        remember: state.form.remember,
                        fetchUser: state.form.fetchUser,
                        staySignedIn: state.form.staySignedIn,
                    })
                    .then(null, (res) => {
                        errors(res.response);
                    });
            }

            function loginManual() {
                ctx.$auth.token(null, 'manual', false);

                ctx.$auth
                    .user({
                        id: 1,
                        first_name: 'Manual',
                        email: 'test@manual.com',
                        type: 'user',
                    });

                if (state.form.remember) {
                    ctx.$auth
                        .remember(JSON.stringify({
                            name: ctx.$auth.user().first_name
                        }));
                }
                else {
                    ctx.$auth.unremember();
                }

                ctx.$router
                    .push({
                        name: 'user-landing'
                    });
            }

            return {
                state,
                loginThen,
                loginVuex,
                loginManual,
                loginDefault,
                loginRedirect,
            }
        }
    }
</script>