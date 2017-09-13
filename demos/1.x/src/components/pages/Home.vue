<template>
    <div>
        <h1>Vue Auth Plugin Demo</h1>

        <hr/>

        <h3>Test Redirects</h3>

        <ul>
            <li><a v-link="{name: 'account'}">Test account access</a></li>
            <li><a v-link="{name: 'admin'}">Test admin access</a></li>
            <li><a v-link="{name: 'admin-products'}">Test admin products access</a></li>
            <li><a v-link="{name: 'admin-product-info', params: {product_id: 1}}">Test admin product 1 info access (should work)</a></li>
            <li><a v-link="{name: 'login'}">Test login page access</a></li>
        </ul>

        <hr/>

        <h3>Test Tokens</h3>

        <div style="word-wrap:break-word;">{{ token === '' ? 'select token' : (token ? token : 'no token set') }}</div>

        <ul>
            <li><a v-on:click="setToken()" href="javascript:void(0);">Test default token</a></li>
            <li><a v-on:click="setToken('impersonate')" href="javascript:void(0);">Test impersonate token</a></li>
            <li><a v-on:click="setToken('default')" href="javascript:void(0);">Test admin token</a></li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                token: ''
            };
        },

        methods: {
            setToken(name) {
                this.token = this.$auth.token(name);
            }
        }
    }
</script>
