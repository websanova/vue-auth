<template>
    <div>
        <h1>Account</h1>

        <b>Username:</b> {{ $auth.user().username }}

        <hr/>

        <h3>Test User</h3>

        <ul>
            <li><a v-on:click="fetch()" href="javascript:void(0);">Test fetch user</a></li>
            <li><a v-on:click="fetchIgnore()" href="javascript:void(0);">Test fetch user ignore</a></li>
            <li><a v-on:click="refresh()" href="javascript:void(0);">Test refresh token</a></li>
            <li v-if="$auth.impersonating()"><a v-on:click="getUsers()" href="javascript:void(0);">Test fetching users (as user via user)</a></li>
            <li v-if="$auth.impersonating()"><a v-on:click="getUsers(false)" href="javascript:void(0);">Test fetching users (as user via admin)</a></li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                context: 'account context'
            };
        },

        methods: {
            fetch() {
                this.$auth.fetch({
                    success() {
                        console.log('success ' + this.context);
                    },
                    error() {
                        console.log('error ' + this.context);
                    }
                });
            },

            fetchIgnore() {
                this.$auth.fetch({
                    ignoreVueAuth: true,
                    error() {
                        console.log('error ' + this.context);
                    }
                });
            },

            refresh() {
                this.$auth.refresh({
                    success() {
                        console.log('success ' + this.context);
                    },
                    error() {
                        console.log('error ' + this.context);
                    }
                });
            },

            getUsers(impersonating) {
                this.$http({
                    url: 'users',
                    method: 'GET',
                    impersonating: impersonating
                })
                .then((res) => {
                    console.log('success ' + this.context);
                }, (res) => {
                    console.log('error ' + this.context);
                });
            }
        }
    }
</script>
