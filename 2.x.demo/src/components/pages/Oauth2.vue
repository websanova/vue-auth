<template>
    <div>
        <h1>Oauth2</h1>

        <div v-show="!code || !type">
            <b>NOTE:</b> Absolutely <b>NO</b> data is actually stored on the demo server. Nor is there a request being made to any third party service (Facebook, Google, etc). The demo server will simply send back a token based on a hard coded user with credentials (social / secret).
            
            <hr/>

            <button v-on:click="social('facebook')">Facebook</button>
            <button v-on:click="social('google')">Google</button>

            <hr/>
            
            <b>NOTE:</b> Google will not work since it's domain set is very restricted but the code is setup as a sample (in the end they all work the same).
        </div>

        <div v-show="code && type">
            Verifying {{ type }} code...
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                context: 'oauth2 context',
                code: this.$route.query.code,
                type: this.$route.params.type
            };
        },
        mounted() {

            if (this.code) {
                this.$auth.oauth2({
                    code: true,
                    provider: this.type,
                    params: {
                        code: this.code,
                    },
                    success: function(res) {
                        console.log('success ' + this.context);
                    },
                    error: function (res) {
                        console.log('error ' + this.context);
                    }
                });
            }
        },

        methods: {
            social(type) {
                this.$auth.oauth2({
                    provider: type || this.type
                });
            }
        }
    }
</script>