<template>
    <div>

        NOTE: Testing these requires browser refresh or close.

        <hr />

        <table>
            <tr>
                <td>Cookie</td>

                <td class="text-right">
                    {{ cookie || 'unset' }}

                    <button @click="cookieTemp">
                        Temp
                    </button>

                    <button @click="cookiePerm">
                        Perm
                    </button>

                    <button @click="cookieRemove">
                        Remove
                    </button>
                </td>
            </tr>
        </table>

        <hr />
        
        <table>
            <tr>
                <td>Storage</td>

                <td class="text-right">
                    {{ storage || 'unset' }}

                    <button @click="storageTemp">
                        Temp
                    </button>

                    <button @click="storagePerm">
                        Perm
                    </button>

                    <button @click="storageRemove">
                        Remove
                    </button>
                </td>
            </tr>
        </table>

        <hr />

        <table>
            <tr>
                <td>Token</td>

                <td class="text-right">
                    {{ token || 'unset' }}

                    <button @click="tokenStorage">
                        Storage
                    </button>

                    <button @click="tokenCookie">
                        Cookie
                    </button>
                </td>
            </tr>
        </table>

        <hr />

        <table>
            <tr>
                <td>Remember</td>

                <td class="text-right">
                    {{ remember || 'unset' }}

                    <button @click="rememberSet">
                        Set
                    </button>

                    <button @click="rememberRemove">
                        Remove
                    </button>
                </td>
            </tr>
        </table>

        <hr />
    </div>
</template>

<script>
    import * as cookie  from '../../../../../src/lib/cookie.js';
    import * as storage from '../../../../../src/lib/storage.js';
    import * as token   from '../../../../../src/lib/token.js';

    export default {
        data() {
            return {
                token: null,
                cookie: null,
                storage: null,
                remember: null,
            }
        },

        mounted() {
            var remember = this.$auth.remember();

            this.token = token.get.call(this.$auth, 'test');
            this.cookie = cookie.get.call(this.$auth, 'test');
            this.storage = storage.get.call(this.$auth, 'test');
            this.remember = remember ? JSON.parse(remember) : null;
        },

        methods: {
            cookieTemp() {
                cookie.set.call(this.$auth, 'test', '-cookie-token-', true);

                this.cookie = cookie.get.call(this.$auth, 'test');
                this.token = token.get.call(this.$auth, 'test');
            },

            cookiePerm() {
                cookie.set.call(this.$auth, 'test', '-cookie-token-', false);

                this.cookie = cookie.get.call(this.$auth, 'test');
                this.token = token.get.call(this.$auth, 'test');
            },

            cookieRemove() {
                cookie.remove.call(this.$auth, 'test');

                this.cookie = cookie.get.call(this.$auth, 'test');
                this.token = token.get.call(this.$auth, 'test');
            },

            storageTemp() {
                storage.set.call(this.$auth, 'test', '-storage-token-', true);

                this.storage = storage.get.call(this.$auth, 'test');
                this.token = token.get.call(this.$auth, 'test');
            },

            storagePerm() {
                storage.set.call(this.$auth, 'test', '-storage-token-', false);

                this.storage = storage.get.call(this.$auth, 'test');
                this.token = token.get.call(this.$auth, 'test');
            },

            storageRemove() {
                storage.remove.call(this.$auth, 'test');

                this.storage = storage.get.call(this.$auth, 'test');
                this.token = token.get.call(this.$auth, 'test');
            },

            tokenStorage() {
                this.$auth.options.tokenStore = ['storage', 'cookie'];

                this.token = token.get.call(this.$auth, 'test');
            },

            tokenCookie() {
                this.$auth.options.tokenStore = ['cookie', 'storage'];

                this.token = token.get.call(this.$auth, 'test');
            },

            rememberSet() {
                this.remember = {name: 'Nova'};

                this.$auth.remember(JSON.stringify(this.remember));
            },

            rememberRemove() {
                this.remember = null;

                this.$auth.unremember();
            },
        }
    }
</script>