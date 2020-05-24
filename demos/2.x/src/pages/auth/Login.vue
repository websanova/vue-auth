<template>
    <div class="text-center">
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

        <button @click="loginManual">
            Manual
        </button>

        <button @click="loginThen">
            Then
        </button>

        <button @click="loginRedirect">
            Redirect
        </button>

        <button @click="loginDefault">
            Default
        </button>

        <button @click="loginVuex">
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
                        email: 'super@starter.com',
                        password: 'testtest',
                    },
                    remember: false,
                    fetchUser: true,
                    staySignedIn: false,
                    errors: {}
                }
            }
        },

        mounted() {
            console.log(this.$auth.redirect());
        },

        methods: {
            errors(res) {
                this.form.errors = Object.fromEntries(res.data.errors.map(item => [item.field, item.msg]));                
            },

            loginDefault() {
                this.$auth
                    .login({
                        body: this.form.body, // VueResource
                        data: this.form.body, // Axios
                        remember: this.form.remember ? '{"name": "Default"}' : null,
                        fetchUser: this.form.fetchUser,
                        staySignedIn: this.form.staySignedIn,
                    })
                    .then(null, (res) => {
                        this.errors(
                            res.response || // Axios
                            res             // VueResource
                        );
                    });
            },

            loginRedirect() {
                this.$auth
                    .login({
                        body: this.form.body, // VueResource
                        data: this.form.body, // Axios
                        redirect: {name: 'user-account'},
                        remember: this.form.remember ? '{"name": "Redirect"}' : null,
                        fetchUser: this.form.fetchUser,
                        staySignedIn: this.form.staySignedIn,
                    })
                    .then(null, (res) => {
                        this.errors(
                            res.response || // Axios
                            res             // VueResource
                        );
                    });
            },

            loginThen() {
                this.$auth
                    .login({
                        body: this.form.body, // VueResource
                        data: this.form.body, // Axios
                        redirect: null,
                        fetchUser: this.form.fetchUser,
                        staySignedIn: this.form.staySignedIn,
                    })
                    .then((res) => {
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
                    })
            },

            loginVuex() {
                this.$store
                    .dispatch('auth/login', {
                        body: this.form.body, // VueResource
                        data: this.form.body, // Axios
                        remember: this.form.remember,
                        fetchUser: this.form.fetchUser,
                        staySignedIn: this.form.staySignedIn,
                    })
                    .then(null, (res) => {
                        this.errors(
                            res.response || // Axios
                            res             // VueResource
                        );
                    });
            },

            loginManual() {
                this.$auth.token(null, 'manual', false);

                this.$auth
                    .user({
                        id: 1,
                        first_name: 'Manual',
                        email: 'test@manual.com',
                        type: 'user',
                    });

                if (this.form.remember) {
                    this.$auth
                        .remember(JSON.stringify({
                            name: this.$auth.user().first_name
                        }));
                }
                else {
                    this.$auth.unremember();
                }

                this.$router
                    .push({
                        name: 'user-landing'
                    });
            }
        }
    }
</script>