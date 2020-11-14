<template>
    <div>

        NOTE: Testing these requires browser refresh or close.

        <hr />

        <div class="media">
            <div class="media-middle">
                Cookie
                
                <span class="mx-1 text-primary">
                    {{ state.cookie || 'unset' }}
                </span>
            </div>

            <div class="media-tight ">
                <ul class="spacer">
                    <li>
                        <button @click="cookieTemp">
                            Temp
                        </button>
                    </li><li>
                        <button @click="cookiePerm">
                            Perm
                        </button>
                    </li><li>
                        <button @click="cookieRemove">
                            Remove
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <hr />
        
        <div class="media">
            <div class="media-middle">
                Storage
                
                <span class="mx-1 text-primary">
                    {{ state.storage || 'unset' }}
                </span>
            </div>

            <div class="media-tight ">
                <ul class="spacer">
                    <li>
                        <button @click="storageTemp">
                            Temp
                        </button>
                    </li><li>
                        <button @click="storagePerm">
                            Perm
                        </button>
                    </li><li>
                        <button @click="storageRemove">
                            Remove
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <hr />

        <div class="media">
            <div class="media-middle">
                Token
                
                <span class="mx-1 text-primary">
                    {{ state.token || 'unset' }}
                </span>
            </div>

            <div class="media-tight ">
                <ul class="spacer">
                    <li>
                        <button @click="tokenStorage">
                            Storage
                        </button>
                    </li><li>
                        <button @click="tokenCookie">
                            Cookie
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <hr />

        <div class="media">
            <div class="media-middle">
                Remember
                
                <span class="mx-1 text-primary">
                    {{ state.remember || 'unset' }}
                </span>
            </div>

            <div class="media-tight ">
                <ul class="spacer">
                    <li>
                        <button @click="rememberSet">
                            Set
                        </button>
                    </li><li>
                        <button @click="rememberRemove">
                            Remove
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <hr />
    </div>
</template>

<script>
    import {reactive  } from 'vue';
    import {onMounted } from 'vue';
    import {useAuth   } from '@websanova/vue-auth/src/v3.js';
    import * as cookie  from '@websanova/vue-auth/src/lib/cookie.js';
    import * as storage from '@websanova/vue-auth/src/lib/storage.js';
    import * as token   from '@websanova/vue-auth/src/lib/token.js';

    export default {
        setup() {
            const auth  = useAuth();

            const state = reactive({
                token: null,
                cookie: null,
                storage: null,
                remember: null,
            });

            onMounted(() => {
                var remember = auth.remember();

                state.token = token.get.call(auth, 'test');
                state.cookie = cookie.get.call(auth, 'test');
                state.storage = storage.get.call(auth, 'test');
                state.remember = remember ? JSON.parse(remember) : null;
            });

            function cookieTemp() {
                cookie.set.call(auth, 'test', '-cookie-token-', true);

                state.cookie = cookie.get.call(auth, 'test');
                state.token = token.get.call(auth, 'test');
            }

            function cookiePerm() {
                cookie.set.call(auth, 'test', '-cookie-token-', false);

                state.cookie = cookie.get.call(auth, 'test');
                state.token = token.get.call(auth, 'test');
            }

            function cookieRemove() {
                cookie.remove.call(auth, 'test');

                state.cookie = cookie.get.call(auth, 'test');
                state.token = token.get.call(auth, 'test');
            }

            function storageTemp() {
                storage.set.call(auth, 'test', '-storage-token-', true);

                state.storage = storage.get.call(auth, 'test');
                state.token = token.get.call(auth, 'test');
            }

            function storagePerm() {
                storage.set.call(auth, 'test', '-storage-token-', false);

                state.storage = storage.get.call(auth, 'test');
                state.token = token.get.call(auth, 'test');
            }

            function storageRemove() {
                storage.remove.call(auth, 'test');

                state.storage = storage.get.call(auth, 'test');
                state.token = token.get.call(auth, 'test');
            }

            function tokenStorage() {
                auth.options.tokenStore = ['storage', 'cookie'];

                state.token = token.get.call(auth, 'test');
            }

            function tokenCookie() {
                auth.options.tokenStore = ['cookie', 'storage'];

                state.token = token.get.call(auth, 'test');
            }

            function rememberSet() {
                state.remember = {name: 'Nova'};

                auth.remember(JSON.stringify(state.remember));
            }

            function rememberRemove() {
                state.remember = null;

                auth.unremember();
            }

            return {
                state,
                cookieTemp,
                cookiePerm,
                cookieRemove,
                storageTemp,
                storagePerm,
                storageRemove,
                tokenStorage,
                tokenCookie,
                rememberSet,
                rememberRemove,
            };
        }
    }
</script>