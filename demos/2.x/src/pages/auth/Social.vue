<template>
    <div class="text-center">
        <br/>

        <div v-if="form.code">
            <span class="spin">↻</span>

            Loading social...
        </div>

        <div v-else>
            <div class="input-group">
                <input
                    v-model="form.params.state.remember"
                    type="checkbox"
                />

                Remember Me

                <div />
            </div>

            <br/>

            <div class="input-group">
                <input
                    v-model="form.params.state.staySignedIn"
                    type="checkbox"
                />

                Stay Signed In

                <div />
            </div>

            <br/>
            
            <div class="input-group">
                <input
                    v-model="form.params.state.fetchUser"
                    type="checkbox"
                />

                Fetch User

                <div />
            </div>
            
            <br/>

            <button @click="oauth2Default('google')">
                Google
            </button>

            <button @click="oauth2Default('facebook')">
                Facebook
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    body: {},
                    code: false,
                    params: {
                        state: {
                            remember: false,
                            staySignedIn: true,
                            fetchUser: true,
                        }
                    }
                }
            }
        },

        watch: {
            '$route.params.type'() {
                this.reset();
            }
        },

        mounted() {
            this.reset();

            if (this.form.code) {
                this.oauth2Default(this.$route.params.type);
            }
        },

        methods: {
            reset() {
                var code  = this.$route.query.code;
                var type  = this.$route.params.type;
                var state = this.$route.query.state;

                delete this.form.url;
                delete this.form.state;

                this.form.body = {};
                this.form.code = code ? true : false;

                if (this.form.code) {
                    this.form.url        = 'auth/' + type;
                    this.form.state      = state
                    this.form.body.code  = code;
                }
            },  

            oauth2Default(type) {
                this.$auth.oauth2(type, this.form);
            }
        }
    }
</script>