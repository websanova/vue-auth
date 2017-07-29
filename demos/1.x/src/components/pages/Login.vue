<template>
    <div>
        <h1>Login</h1>

        <b>Test users:</b> (admin / secret) &bull; (test / secret)

        <hr/>

        <form v-on:submit.prevent="login()">
            <table><tr>
                <td>Username:</td>
                <td><input v-model="data.body.username" /></td>
            </tr><tr>
                <td>Password:</td>
                <td><input v-model="data.body.password" type="password" /></td>
            </tr><tr>
                <td></td>
                <td><label><input v-model="data.rememberMe" type="checkbox" /> Remember Me</label></td>
            </tr><tr>
                <td></td>
                <td><button type="submit">Login</button></td>
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
                context: 'login context',

                data: {
                    body: {
                        username: 'admin',
                        password: 'secret'
                    },
                    rememberMe: false
                },

                error: null
            };
        },

        methods: {
            login() {
                this.$auth.login({
                    body: this.data.body,
                    rememberMe: this.data.rememberMe,
                    redirect: {name: 'account'},
                    success() {
                        console.log('success ' + this.context);
                    },
                    error(res) {
                        console.log('error ' + this.context);

                        this.error = res.data;
                    }
                });
            }
        }
    }
</script>