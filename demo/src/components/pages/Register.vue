<template>
    <div>
        <h1>Register</h1>

        <b>NOTE:</b> Please use only dummy data here as it is running off a demo server.

        <hr/>

        <form v-on:submit.prevent="register()">
            <table><tr>
                <td>Username:</td>
                <td><input v-model="data.body.username" /></td>
            </tr><tr>
                <td>Password:</td>
                <td><input v-model="data.body.password" type="password" /></td>
            </tr><tr>
                <td></td>
                <td><label><input v-model="data.autoLogin" type="checkbox" /> Auto Login</label></td>
            </tr><tr>
                <td></td>
                <td><label><input v-model="data.rememberMe" type="checkbox" /> Remember Me</label></td>
            </tr><tr>
                <td></td>
                <td><button type="submit">Register</button></td>
            </tr></table>

            <hr/>

            <div v-show="error" style="color:red; word-wrap:break-word;">{{ error | json }}</div>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                context: 'register context',
                
                data: {
                    body: {
                        username: '',
                        password: ''
                    },
                    autoLogin: false,
                    rememberMe: false
                },

                error: null
            };
        },

        ready() {
            console.log('ready');
        },

        methods: {
            register() {
                this.$auth.register({
                    body: this.data.body,
                    autoLogin: this.data.autoLogin,
                    rememberMe: this.data.rememberMe,
                    success: function () {
                        console.log('success ' + this.context);
                    },
                    error: function (res) {
                        console.log('error ' + this.context);

                        this.error = res.data;
                    }
                });
            }
        }
    }
</script>