<template>
    <div>
        <div v-if="$auth.ready() && loaded">
            <div style="text-align:center;">
                <a v-link="{name: 'default'}">home</a> &bull;

                <span>
                    <a v-link="{name: 'async'}">async</a> &bull;
                </span>

                <span v-show="!$auth.check()">
                    <a v-link="{name: 'login'}">login</a> &bull;
                    <a v-link="{name: 'register'}">register</a> &bull;
                    <a v-link="{name: 'oauth1'}">oauth1</a> &bull;
                    <a v-link="{name: 'oauth2'}">oauth2</a>
                </span>
                
                <span v-show="$auth.check('admin')">
                    <a v-link="{name: 'admin'}">admin</a> &bull;
                    <a v-link="{name: 'users'}">users</a> &bull;
                </span>
                
                <span v-show="$auth.check()">
                    <a v-link="{name: 'account'}">account</a> &bull;
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

        ready() {
            var _this = this;

            // Set up $auth.ready with other arbitrary loaders (ex: language file).
            setTimeout(function () {
                _this.loaded = true;
            }, 500);

            // Test manual refresh on boot (instead of via plugin).
            if (this.$auth.token()) {
                this.$auth.refresh();
            }
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