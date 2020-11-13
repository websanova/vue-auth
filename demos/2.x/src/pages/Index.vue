<template>
    <div
        style="max-width:500px; margin:0 auto 50px auto;"
    >
        <h1 class="text-center">
            <a href="https://websanova.com">
                <img src="/img/logo-dark-text.png" height="30" />
            </a>
        </h1>

        <h1 class="text-center">
            Vue Auth 2.x Demo
        </h1>

        <hr/>
        
        <div class="text-center">
            <a href="https://websanova.com/docs/vue-auth"><b>DOCS</b></a> |
            <a href="https://github.com/websanova/vue-auth"><b>GITHUB</b></a> |
            <a href="https://patreon.com/websanova"><b>PATREON</b></a>
        </div>
        
        <hr/>

        <div>
            {{ (_loaded && readyOne && readyTwo) ? 'Online ' : 'Loading...' }}

            <span
                class="pull-right"
                style="font-weight:bold;"
            >
                <span
                    v-bind:style="{
                        color: readyOne ? 'lime' : 'red'
                    }"
                >
                    &bull;
                </span>
                
                <span
                    v-bind:style="{
                        color: _loaded ? 'lime' : 'red'
                    }"
                >
                    &bull;
                </span>

                <span
                    v-bind:style="{
                        color: readyTwo ? 'lime' : 'red'
                    }"
                >
                    &bull;
                </span>
            </span>
        </div>

        <hr/>

        <div class="text-danger">
            NOTE: This demo uses a public API to simulate realistic flow. The database is reset every 30 minutes and otherwise reveals no sensitive data such as emails or last names.

            <br/>

            NOTE: Would be nice to get some generic node (or deno?) service up for better/safer local testing. If you anyone can contribute, would be greatly appreciated :-) 

        </div>

        <hr />

        <div
            v-if="_loaded"
        >
            <div>
                <router-link
                    :to="{name: 'site-home'}"
                >
                    home
                </router-link>

                <span
                    style="float:right;"
                >
                    <span
                        v-show="!$auth.check()"
                    >
                        <router-link :to="{name: 'auth-login'}">login</router-link> |
                        <router-link :to="{name: 'auth-register'}">register</router-link> |
                        <router-link :to="{name: 'auth-social'}">social</router-link> |
                        <router-link :to="{name: 'site-users'}">users</router-link>
                    </span>

                    <span
                        v-show="$auth.check()"
                    >
                        <span v-show="$auth.check('user')">
                            <router-link :to="{name: 'user-users'}">users</router-link> |
                        </span>

                        <span v-show="$auth.check('admin')">
                            <router-link :to="{name: 'admin-landing'}">admin</router-link> |
                        </span>

                        <span v-show="$auth.impersonating()">
                            <router-link :to="{name: 'user-unimpersonate'}">unimpersonate</router-link> |
                        </span>
                        
                        <router-link :to="{name: 'user-account'}">account</router-link> |
                        <router-link :to="{name: 'user-logout'}">logout</router-link>
                    </span>
                </span>
            </div>

            <hr/>
            
            <span
                v-if="!readyOne || !readyTwo"
                class="spin"
            >
                ↻
            </span>

            <div v-else>

                {{ $route.name.split('-').join(' / ') }}

                <span class="pull-right">
                    <span v-if="$auth.check()">
                        {{ _user.first_name }}
                    </span>

                    <span v-else-if="$auth.remember()">
                        Welcome back, {{ JSON.parse($auth.remember()).name }}
                    </span>
                </span>

                <hr />



                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
    import * as cookie from '../../../../src/lib/cookie.js';

    export default {
        data() {
            return {
                readyOne: false,
                readyTwo: false,
                artificialLoad: false,
            }
        },

        computed: {
            _user() {
                return this.$auth.user() || {};
            },

            _loaded() {
                return this.$auth.ready() && this.artificialLoad;
            }
        },

        mounted() {
            this.$auth
                .load()
                .then(() => {
                    this.readyOne = true;
                });

            this.$auth
                .load()
                .then(() => {
                    setTimeout(() => {
                        this.readyTwo = true;
                    }, 2000);
                });

            setTimeout(() => {
                this.artificialLoad = true;
            }, 1000);
        },

        methods: {
            unimpersonate() {
                this.$auth.unimpersonate({
                    success() {
                        console.log('success ' + this.context);
                    },
                    error() {
                        console.log('error ' + this.context);
                    }
                });
            }
        }
    }
</script>

<style>
    body {
        font-family: Verdana;
        font-size: 12px;
    }

    * {
        box-sizing: border-box;
    }

    a {
        text-decoration: none;
        color: #6699ff;
    }

    .spin {
        font-size: 0.8em;
        display: inline-block;
        animation-name: spin;
        animation-duration: 500ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear; 
    }

    @keyframes spin {
        from { transform:rotate(0deg); }
        to { transform:rotate(360deg); }
    }

    input {
        padding: 5px;
        margin-bottom: 10px;
    }

    button {
        margin: 3px;
        padding: 5px 7px;
        cursor: pointer;
    }

    table {
        width: 100%;
    }

    .text-center {
        text-align: center;
    }

    .text-right {
        text-align: right;
    }

    .pull-left {
        float: left;
    }

    .pull-right {
        float: right;
    }

    .text-muted {
        color: #aeaeae;
    }

    .text-danger {
        color: red;
    }

    .input-group {
        display: inline-block;
        text-align: left;
        width: 200px;
    }

    .input-group > input[type='text'],
    .input-group > input[type='password'] {
        width: 100%;
        margin-bottom: 0px;
    }

    .input-group > div {
        color: red;
        padding: 2px 0 0 2px;
        margin-bottom: 10px;
        font-size: 0.8em;
    }
</style>