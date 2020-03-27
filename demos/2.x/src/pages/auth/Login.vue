<template>
    <div class="text-center">
        <br/>

        <div class="input-group">
            <input
                v-model="form.body.email"
                placeholder="Email"
            />

            <div>{{ form.errors.email }}</div>
        </div>

        <br/>

        <div class="input-group">
            <input
                v-model="form.body.password"
                placeholder="Password"
                type="password"
            />

            <div>{{ form.errors.password }}</div>
        </div>

        <br/>

        <div class="input-group">
            <input
                v-model="form.rememberMe"
                type="checkbox"
            />

            Remember Me

            <div />
        </div>

        <br/>

        <button @click="loginDefault">
            Default
        </button>

        <button @click="loginRedirect">
            Redirect
        </button>

        <button @click="loginThen">
            Then
        </button>

        <button @click="loginVuex">
            Vuex
        </button>

        <button @click="loginManual">
            Manual
        </button>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                form: {
                    body: {
                        email: '',
                        password: '',
                    },

                    rememberMe: false,

                    errors: {}
                }
            }
        },

        methods: {
            errors(res) {
                this.form.errors = Object.fromEntries(res.data.errors.map(item => [item.field, item.msg]));                
            },

            loginDefault() {
                this.$auth
                    .login({
                        body: this.form.body,
                        rememberMe: this.form.rememberMe
                    })
                    .then(null, this.errors);
            },

            loginRedirect() {
                this.$auth
                    .login({
                        body: this.form.body,
                        redirect: {name: 'user-account'},
                        rememberMe: this.form.rememberMe
                    })
                    .then(null, this.errors);
            },

            loginThen() {
                this.$auth
                    .login({
                        body: this.form.body,
                        rememberMe: this.form.rememberMe
                    })
                    .then(() => {
                        this.$router.push({name: 'user-account'});
                    }, this.errors);
            },

            loginVuex() {
                this.$store.dispatch('auth/login', {
                    body: this.form.body,
                    rememberMe: this.form.rememberMe
                })
                .then(null, this.errors);
            },

            loginManual() {
                this.$auth.token(null, 'manual');

                this.$auth.user({
                    id: 1,
                    first_name: 'Manual',
                    email: 'test@manual.com',
                    type: 'user'
                });

                this.$router.push({
                    name: 'user-landing'
                });
            }
        }
    }
</script>