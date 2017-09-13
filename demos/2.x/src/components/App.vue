<template>
    <div>
        <div v-if="$auth.ready() && loaded">
            <div style="text-align:center;">
                <router-link :to="{name: 'default'}">home</router-link> &bull;
                
                <router-link :to="{name: 'async'}">async</router-link> &bull;

                <span v-show="!$auth.check()">
                    <router-link :to="{name: 'login'}">login</router-link> &bull;
                    <router-link :to="{name: 'register'}">register</router-link> &bull;
                    <router-link :to="{name: 'oauth1'}">oauth1</router-link> &bull;
                    <router-link :to="{name: 'oauth2'}">oauth2</router-link>
                </span>
                
                <span v-show="$auth.check('admin')">
                    <router-link :to="{name: 'admin'}">admin</router-link> &bull;
                    <router-link :to="{name: 'users'}">users</router-link> &bull;
                </span>
                
                <span v-show="$auth.check()">
                    <router-link :to="{name: 'account'}">account</router-link> &bull;
                    <a v-on:click="logout()" href="javascript:void(0);">logout</a>
                </span>

                <span v-show="$auth.impersonating()">
                    &bull;
                    <a v-on:click="unimpersonate()" href="javascript:void(0);">(logout {{ $auth.user().username }})</a>
                </span>
            </div>

            <hr/>
            
            <div style="max-width:400px; margin:0 auto 50px auto;">
                <router-view></router-view>
            </div>

            <hr/>

            <div style="text-align:center; font-size:12px;">
                Websanova <a href="https://github.com/websanova/laravel-api-demo">demo server</a> available on GitHub
            </div>
        </div>

        <div v-if="!$auth.ready() || !loaded">
            <div style="text-align:center; padding-top:50px;">
                Loading site...
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                context: 'app context',
                loaded: false
            };
        },

        mounted() {
            var _this = this;

            // Set up $auth.ready with other arbitrary loaders (ex: language file).
            setTimeout(function () {
                _this.loaded = true;
            }, 500);
        },

        created() {
            var _this = this;

            this.$auth.ready(function () {
                console.log('ready ' + this.context);
            });

            // Vue.http.interceptors.push(function (req, next) {
            //     next(function (res) {
            //         if ( ! res.ok) {
            //             _this.$router.push({name: 'error-502'})
            //         }
            //     });
            // });
        },

        methods: {
            logout() {
                this.$auth.logout({
                    makeRequest: true,
                    success() {
                        console.log('success ' + this.context);
                    },
                    error() {
                        console.log('error ' + this.context);
                    }
                });
            },

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