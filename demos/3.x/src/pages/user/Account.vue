<template>
    <div>
        <div class="media">
            <div class="media-middle">
                Fetch
            </div>

            <div class="media-tight">
                <ul class="spacer">
                    <li>
                        <button @click="fetchManual">
                            <span v-if="state.form.status ==='loading'" class="spinner" />
                            <span v-else>Manual</span>
                        </button>
                    </li><li>
                        <button @click="fetchDefault">
                            <span v-if="state.form.status ==='loading'" class="spinner" />
                            <span v-else>Default</span>
                        </button>
                    </li><li>
                        <button @click="fetchVuex">
                            <span v-if="state.form.status ==='loading'" class="spinner" />
                            <span v-else>Vuex</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <hr />

        <div class="media">
            <div class="media-middle">
                Refresh
            </div>

            <div class="media-tight">
                <ul class="spacer">
                    <li>
                        <button @click="refreshDefault">
                            <span v-if="state.form.status ==='loading'" class="spinner" />
                            <span v-else>Default</span>
                        </button>
                    </li><li>
                        <button @click="refreshVuex">
                            <span v-if="state.form.status ==='loading'" class="spinner" />
                            <span v-else>Vuex</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <hr/>

        <div class="media">
            <div>
                <b>$auth.check() Tests</b>
            </div>
        </div>

        <div class="media">
            <div>
                $auth.check('poo')
            </div>

            <div class="media-tight">
                {{ $auth.check('poo') }}
            </div>
        </div>

        <div class="media">
            <div>
                $auth.check(['poo', 'admin'])
            </div>

            <div class="media-tight">
                {{ $auth.check(['poo', 'admin']) }}
            </div>
        </div>

        <div class="media">
            <div>
                $auth.check({role: 'admin'}, 'role_test_one')
            </div>

            <div class="media-tight">
                {{ $auth.check({role: 'admin'}, 'role_test_one') }}
            </div>
        </div>

        <div class="media">
            <div>
                $auth.check([{role: 'admin'}], 'role_test_one')
            </div>

            <div class="media-tight">
                {{ $auth.check([{role: 'admin'}], 'role_test_one') }}
            </div>
        </div>

        <div class="media">
            <div>
                $auth.check({role: 'admin'}, 'role_test_two')
            </div>

            <div class="media-tight">
                {{ $auth.check({role: 'admin'}, 'role_test_two') }}
            </div>
        </div>

        <div class="media">
            <div>
                $auth.check('admin', 'role_test_three')
            </div>

            <div class="media-tight">
                {{ $auth.check('admin', 'role_test_three') }}
            </div>
        </div>

        <div class="media">
            <div>
                $auth.check({role: 'admin'}, 'role_test_four.nes.ted')
            </div>

            <div class="media-tight">
                {{ $auth.user().role_test_four ? $auth.check({role: 'admin'}, 'role_test_four.nes.ted') : 'null' }}
            </div>
        </div>

        <div class="media">
            <div>
                $auth.check('admin', 'role_test_four.nes.ted.role')
            </div>

            <div class="media-tight">
                {{ $auth.user().role_test_four ? $auth.check('admin', 'role_test_four.nes.ted.role') : 'null' }}
            </div>
        </div>

        <div class="media">
            <div>
                $auth.check(['poo', 'admin'], 'role_test_four.nes.ted.role')
            </div>

            <div class="media-tight">
                {{ $auth.user().role_test_four ? $auth.check(['poo', 'admin'], 'role_test_four.nes.ted.role') : 'null' }}
            </div>
        </div>

        <hr/>
    </div>
</template>

<script>
    import {reactive     } from 'vue';
    import {onBeforeMount} from 'vue';
    import {useStore     } from 'vuex';
    import axios           from 'axios';
    import {useAuth      } from '@websanova/vue-auth/src/v3.js';

    export default {
        setup() {
            const auth  = useAuth();
            const store = useStore();

            const state = reactive({
                form: {
                    status: null
                }
            });

            onBeforeMount(() => {
                var user = auth.user();

                // one

                user.role_test_one = [
                    {role: 'admin'},
                    {role: 'super-admin'}
                ];

                // two

                user.role_test_two = {role: 'admin'};

                // three

                user.role_test_three = ['super-admin', 'admin'];

                // four

                user.role_test_four = {nes: {ted: {role: 'admin'}}};

                //

                auth.user(user);
            });

            function loading() {
                state.form.status = 'loading';
            }

            function complete() {
                state.form.status = 'complete';
            }

            function error() {
                state.form.status = 'error';
            }

            function fetchManual() {
                loading();

                axios({
                    url: 'auth/user'
                })
                .then((res) => {
                    var user = res.data.data;

                    user.first_name = 'Yay!';

                    $auth.user(user);

                    complete();
                }, error);
            }

            function fetchDefault() {
                loading();

                auth
                .fetch()
                .then(complete, error);
            }

            function fetchVuex() {
                loading();
                
                store
                .dispatch('auth/fetch')
                .then(complete, error);
            }

            function refreshDefault() {
                loading();

                auth
                .refresh()
                .then(complete, error);
            }

            function refreshVuex() {
                loading();
                
                store
                .dispatch('auth/refresh')
                .then(complete, error);
            }

            return {
                state,
                fetchVuex,
                fetchManual,
                fetchDefault,
                refreshVuex,
                refreshDefault,
            };
        },

        created() {
            
        },

        methods: {
            
        }
    }
</script>