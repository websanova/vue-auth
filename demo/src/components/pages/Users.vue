<template>
    <div>
        <h1>Users</h1>

        <hr/>

        <div v-for="user in users" style="margin-bottom: 5px;">
            {{ user.username }}
            
            <span style="float:right;">
                <a v-on:click="loginOther(user)" href="javascript:void(0);">login as</a>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                context: 'users context',
                users: null
            };
        },

        ready() {
            this.getUsers();
        },

        methods: {
            getUsers() {
                this.$http({
                    url: 'users',
                    method: 'GET'
                })
                .then((res) => {
                    this.users = res.json().data.items;
                    
                    console.log('success ' + this.context);
                }, (res) => {
                    console.log('error ' + this.context);
                });
            },

            loginOther(user) {
                this.$auth.loginOther({
                    params: {
                        id: user.id
                    },
                    success() {
                        console.log('success ' + this.context);
                    },
                    error() {
                        console.log('error ' + this.context);
                    },
                    redirect: '/account'
                });
            }
        }
    }
</script>
