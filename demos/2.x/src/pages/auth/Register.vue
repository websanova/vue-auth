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
                v-model="form.body.tos_pp"
                type="checkbox"
            />

            Accept terms of service.

            <div>{{ form.errors.tos_pp }}</div>
        </div>

        <br/>

        <div class="input-group">
            <input
                v-model="form.remember"
                type="checkbox"
            />

            Remember Me

            <div />
        </div>

        <br/>

        <div class="input-group">
            <input
                v-model="form.staySignedIn"
                type="checkbox"
            />

            Stay Signed In

            <div />
        </div>

        <br/>

        <div class="input-group">
            <input
                v-model="form.fetchUser"
                type="checkbox"
            />

            Fetch User

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

        <button @click="registerThen">
            Then
        </button>

        <button @click="registerRedirect">
            Redirect
        </button>

        <button @click="registerDefault">
            Default
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
                        tos_pp: false,
                    },

                    errors: {},
                    remember: false,
                    fetchUser: true,
                    autoLogin: true,
                    staySignedIn: false,
                }
            }
        },

        methods: {
            errors(res) {
                this.form.errors = Object.fromEntries(res.data.errors.map(item => [item.field, item.msg]));                
            },

            registerDefault() {
                this.$auth
                    .register({
                        body: this.form.body, // VueResource
                        data: this.form.body, // Axios
                        remember: this.form.remember ? '{"name": "Default"}' : null,
                        fetchUser: this.form.fetchUser,
                        autoLogin: this.form.autoLogin,
                        staySignedIn: this.form.staySignedIn,
                    })
                    .then(null, (res) => {
                        this.errors(
                            res.response || // Axios
                            res             // VueResource
                        );
                    });
            },

            registerRedirect() {
                this.$auth
                    .register({
                        body: this.form.body, // VueResource
                        data: this.form.body, // Axios
                        redirect: {name: 'user-account'},
                        remember: this.form.remember ? '{"name": "Redirect"}' : null,
                        fetchUser: this.form.fetchUser,
                        autoLogin: this.form.autoLogin,
                        staySignedIn: this.form.staySignedIn,
                    })
                    .then(null, (res) => {
                        this.errors(
                            res.response || // Axios
                            res             // VueResource
                        );
                    });
            },

            registerThen() {
                this.$auth
                    .register({
                        body: this.form.body, // VueResource
                        data: this.form.body, // Axios
                        fetchUser: this.form.fetchUser,
                        autoLogin: this.form.autoLogin,
                        staySignedIn: this.form.staySignedIn,
                    })
                    .then(() => {
                        if (this.form.remember) {
                            this.$auth.remember(JSON.stringify({
                                name: this.$auth.user().first_name
                            }));
                        }

                        this.$router.push({name: 'user-account'});
                    }, (res) => {
                        this.errors(
                            res.response || // Axios
                            res             // VueResource
                        );
                    });
            },

            registerVuex() {
                this.$store
                    .dispatch('auth/register', {
                        body: this.form.body, // VueResource
                        data: this.form.body, // Axios
                        remember: this.form.remember,
                        fetchUser: this.form.fetchUser,
                        autoLogin: this.form.autoLogin,
                        staySignedIn: this.form.staySignedIn,
                    })
                    .then(null, (res) => {
                        this.errors(
                            res.response || // Axios
                            res             // VueResource
                        );
                    });
            }
        }
    }
</script>