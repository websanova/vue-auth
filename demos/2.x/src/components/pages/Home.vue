<template>
    <div>
        <h1>Vue Auth Plugin Demo</h1>

        <hr/>

        <h3>Test Redirects</h3>

        <ul>
            <li><router-link :to="{name: 'account'}">Test account access</router-link></li>
            <li><router-link :to="{name: 'admin'}">Test admin access</router-link></li>
            <li><router-link :to="{name: 'admin-products'}">Test admin products access</router-link></li>
            <li><router-link :to="{name: 'admin-product-info', params: {product_id: 1}}">Test admin product 1 info access (should work)</router-link></li>
            <li><router-link :to="{name: 'login'}">Test login page access</router-link></li>
        </ul>

        <hr/>

        <h3>Test Tokens</h3>

        <div style="word-wrap:break-word;">{{ token === '' ? 'select token' : (token ? token : 'no token set') }}</div>

        <ul>
            <li><a v-on:click="setToken()" href="javascript:void(0);">Test default token</a></li>
            <li><a v-on:click="setToken('other')" href="javascript:void(0);">Test other token</a></li>
            <li><a v-on:click="setToken('default')" href="javascript:void(0);">Test admin token</a></li>
            <li><a v-on:click="clearToken()" href="javascript:void(0);">Test cache clear</a></li>
            <li><a v-on:click="setDudToken()" href="javascript:void(0);">Test dud</a></li>
            <li><a v-on:click="networkDrop('other')" href="javascript:void(0);">Test network drop</a></li>
        </ul>
    </div>
</template>

<script>
    import cookie from '../../../../../src/lib/cookie.js'

    export default {
        data() {
            return {
                token: ''
            };
        },

        methods: {
            setToken(name) {
                this.token = this.$auth.token(name);
            },

            clearToken() {
                localStorage.removeItem('other_auth_token');
                localStorage.removeItem('default_auth_token');
                cookie.delete.call(this.$auth, 'other_auth_token');
                cookie.delete.call(this.$auth, 'default_auth_token');

                console.log('Tokens removed');
            },

            setDudToken() {
                localStorage.setItem('other_auth_token', 'nil');
                localStorage.setItem('default_auth_token', 'nil');
                cookie.set.call(this.$auth, 'other_auth_token', 'nil');
                cookie.set.call(this.$auth, 'default_auth_token', 'nil');
            },

            networkDrop() {
                Vue.http.options.root = 'https://does.not.exist.com//api/v1';

                console.log('http.options.root changed to https://does.not.exist.com/api/v1');
            }
        }
    }
</script>
