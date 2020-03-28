<template>
    <div>
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

        {{ documentCookie }}
    </div>
</template>

<script>
    import * as cookie  from '../../../../../src/lib/cookie.js';
    import * as storage from '../../../../../src/lib/storage.js';
    import * as token   from '../../../../../src/lib/token.js';

    export default {
        data() {
            return {
                cookie: null,
                storage: null,
                documentCookie: null
            }
        },

        mounted() {
            this.cookie = cookie.get.call(this.$auth, 'test');
            this.storage = storage.get.call(this.$auth, 'test');
            this.documentCookie = document.cookie;
        },

        methods: {
            cookieTemp() {
                cookie.set.call(this.$auth, 'test', 'cookie', true);

                this.cookie = cookie.get.call(this.$auth, 'test');
                this.documentCookie = document.cookie;
            },

            cookiePerm() {
                cookie.set.call(this.$auth, 'test', 'cookie', false);

                this.cookie = cookie.get.call(this.$auth, 'test');
                this.documentCookie = document.cookie;
            },

            cookieRemove() {
                cookie.remove.call(this.$auth, 'test');

                this.cookie = cookie.get.call(this.$auth, 'test');
                this.documentCookie = document.cookie;
            },

            storageTemp() {
                storage.set.call(this.$auth, 'test', 'storage', true);

                this.storage = storage.get.call(this.$auth, 'test');
            },

            storagePerm() {
                storage.set.call(this.$auth, 'test', 'storage', false);

                this.storage = storage.get.call(this.$auth, 'test');
            },

            storageRemove() {
                storage.remove.call(this.$auth, 'test');

                this.storage = storage.get.call(this.$auth, 'test');
            }
        }
    }
</script>