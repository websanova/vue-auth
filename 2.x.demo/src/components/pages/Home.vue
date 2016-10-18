<template>
    <div>
        <h1>Vue Auth Plugin Demo</h1>

        <hr/>

        <h3>Test Redirects</h3>

        <ul>
            <li><router-link :to="{name: 'account'}">Test account access</router-link></li>
            <li><router-link :to="{name: 'admin'}">Test admin access</router-link></li>
            <li><router-link :to="{name: 'login'}">Test login page access</router-link></li>
        </ul>

        <hr/>

        <h3>Test Tokens</h3>

        <div style="word-wrap:break-word;">{{ token === '' ? 'select token' : (token ? token : 'no token set') }}</div>

        <ul>
            <li><a v-on:click="setToken()" href="javascript:void(0);">Test default token</a></li>
            <li><a v-on:click="setToken('other')" href="javascript:void(0);">Test other token</a></li>
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
