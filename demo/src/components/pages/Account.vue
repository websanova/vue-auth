<template>
    <h1>Account</h1>

    <b>Username:</b> {{ $auth.user().username }}

    <hr/>

    <h3>Test User</h3>

    <ul>
        <li><a v-on:click="fetch()" href="javascript:void(0);">Test fetch user</a></li>
        <li><a v-on:click="refresh()" href="javascript:void(0);">Test refresh token</a></li>
        <li v-if="$auth.other()"><a v-on:click="getUsers()" href="javascript:void(0);">Test fetching users (as user via user)</a></li>
        <li v-if="$auth.other()"><a v-on:click="getUsers(true)" href="javascript:void(0);">Test fetching users (as user via admin)</a></li>
    </ul>

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

            getUsers(asAdmin) {

                if (asAdmin === true) {
                    this.$auth.disableOther();
                }

                this.$http({
                    url: 'users',
                    method: 'GET'
                })
                .then((res) => {
                    console.log('success ' + this.context);
                }, (res) => {
                    console.log('error ' + this.context);
                });

                this.$auth.enableOther();
            }
        }
    }
</script>
