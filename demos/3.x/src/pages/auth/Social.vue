<template>
    <div class="container container-sm">
        <div
            v-if="state.form.code"
            class="spinner"
        >
            Loading social...
        </div>

        <div v-else>
            <div class="input-group">
                <input
                    v-model="state.form.params.state.remember"
                    type="checkbox"
                />

                Remember Me
            </div>

            <div class="input-group">
                <input
                    v-model="state.form.params.state.staySignedIn"
                    type="checkbox"
                />

                Stay Signed In
            </div>
            
            <div class="input-group">
                <input
                    v-model="state.form.params.state.fetchUser"
                    type="checkbox"
                />

                Fetch User
            </div>
            
            <br/>

            <ul class="spacer">
                <li>
                    <button @click="oauth2Default('google')">
                        Google
                    </button>
                </li><li>
                    <button @click="oauth2Default('facebook')">
                        Facebook
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {watch    } from 'vue';
    import {reactive } from 'vue';
    import {computed } from 'vue';
    import {onMounted} from 'vue';
    import {useRoute } from 'vue-router';
    import {useAuth  } from '@websanova/vue-auth/src/v3.js';

    export default {
        setup() {
            const auth  = useAuth();
            const route = useRoute();

            const state = reactive({
                form: {
                    body: {},
                    code: false,
                    params: {
                        state: {
                            remember: false,
                            staySignedIn: true,
                            fetchUser: true,
                        }
                    }
                }
            });

            watch(() => {return route.params.type}, reset);

            onMounted(() => {
                reset();

                if (state.form.code) {
                    oauth2Default(route.params.type);
                }
            });

            function reset() {
                delete state.form.url;
                delete state.form.state;

                state.form.body = {};
                state.form.code = route.query.code ? true : false;

                if (state.form.code) {
                    state.form.url       = 'auth/' + route.params.type;
                    state.form.state     = route.query.state
                    state.form.body.code = route.query.code;
                }
            }

            function oauth2Default(type) {
                auth.oauth2(type, state.form);
            }

            return {
                state,
                oauth2Default,
            };
        }
    }
</script>