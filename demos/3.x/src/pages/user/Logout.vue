<template>
    <div class="container container-sm">
        <ul class="spacer">
            <li>
                <button @click="logoutRedirect">
                    Redirect
                </button>
            </li><li>
                <button @click="logoutThen">
                    Then
                </button>
            </li><li>
                <button @click="logoutRequest">
                    Request
                </button>
            </li><li>
                <button @click="logoutDefault">
                    Default
                </button>
            </li><li>
                <button @click="logoutVuex">
                    Vuex
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
    import {useStore } from 'vuex';
    import {useRouter} from 'vue-router';
    import {useAuth  } from '@websanova/vue-auth/src/v3.js';

    export default {
        setup() {
            const auth   = useAuth();
            const store  = useStore();
            const router = useRouter();

            function logoutDefault() {
                auth.logout();
            }

            function logoutRedirect() {
                auth
                    .logout({
                        redirect: {name: 'auth-login'}
                    });
            }

            function logoutThen() {
                auth
                    .logout({
                        redirect: null
                    })
                    .then(() => {
                        router.push({name: 'auth-login'});
                    });
            }

            function logoutVuex() {
                store.dispatch('auth/logout');
            }
            
            function logoutRequest() {
                auth
                    .logout({
                        makeRequest: true
                    });
            }

            return {
                logoutDefault,
                logoutRedirect,
                logoutThen,
                logoutVuex,
                logoutRequest,
            }
        }
    }
</script>