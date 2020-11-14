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
                <button @click="logoutComp">
                    Comp
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
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

            function logoutComp() {
                authComp.logout();
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
                logoutComp,
                logoutRequest,
            }
        }
    }
</script>