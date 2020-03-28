<template>
    <div class="text-center">
        <br/>

        <div class="input-group">
            <input
                v-model="form.body.first_name"
                placeholder="First Name"
                type="text"
            />

            <div>{{ form.errors.first_name }}</div>
        </div>

        <br/>

        <div class="input-group">
            <input
                v-model="form.body.email"
                placeholder="Email"
                type="text"
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

        <div class="input-group">
            <input
                v-model="form.autoLogin"
                type="checkbox"
            />

            Auto Login

            <div />
        </div>

        <br/>

        <button @click="registerDefault">
            Default
        </button>

        <button @click="registerRedirect">
            Redirect
        </button>

        <button @click="registerThen">
            Then
        </button>

        <button @click="registerVuex">
            Vuex
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

                    autoLogin: false,

                    errors: {}
                }
            }
        },

        methods: {
            errors(res) {
                this.form.errors = Object.fromEntries(res.data.errors.map(item => [item.field, item.msg]));                
            },

            registerDefault() {
                this.$auth
                    .reg({
                        body: this.form.body,
                        autoLogin: this.form.autoLogin
                    })
                    .then(null, this.errors);
            },

            registerRedirect() {
                this.$auth
                    .register({
                        body: this.form.body,
                        redirect: {name: 'user-account'},
                        autoLogin: this.form.autoLogin
                    })
                    .then(null, this.errors);
            },

            registerThen() {
                this.$auth
                    .register({
                        body: this.form.body,
                        autoLogin: this.form.autoLogin
                    })
                    .then(() => {
                        this.$router.push({name: 'user-account'});
                    }, this.errors);
            },

            registerVuex() {
                this.$store.dispatch('auth/register', {
                    body: this.form.body,
                    autoLogin: this.form.autoLogin
                })
                .then(null, this.errors);
            }
        }
    }
</script>