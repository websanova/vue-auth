<template>
    <div class="container container-sm">
        <ul class="spacer">
            <li>
                <button @click="unimpersonateRedirect">
                    Redirect
                </button>
            </li><li>
                <button @click="unimpersonateThen">
                    Then
                </button>
            </li><li>
                <button @click="unimpersonateRequest">
                    Request
                </button>
            </li><li>
                <button @click="unimpersonateDefault">
                    Default
                </button>
            </li><li>
                <button @click="unimpersonateComp">
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

            function unimpersonateDefault() {
                auth.unimpersonate();
            }

            function unimpersonateRedirect() {
                auth
                .unimpersonate({
                    redirect: {name: 'admin-users'}
                });
            }

            function unimpersonateThen() {
                auth
                .unimpersonate({
                    redirect: null
                })
                .then(() => {
                    router.push({name: 'admin-users'});
                });
            }

            function unimpersonateComp() {
                authComp.unimpersonate();
            }
            
            function unimpersonateRequest() {
                auth
                .unimpersonate({
                    makeRequest: true
                });
            }

            return {
                unimpersonateThen,
                unimpersonateComp,
                unimpersonateRequest,
                unimpersonateDefault,
                unimpersonateRedirect,
            };
        }
    }
</script>