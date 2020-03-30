<template>
    <div>
        <table>
            <tr>
                <td>Unimpersonate</td>

                <td class="text-right">
                    <button @click="unimpersonateRedirect">
                        Redirect
                    </button>

                    <button @click="unimpersonateThen">
                        Then
                    </button>

                    <button @click="unimpersonateRequest">
                        Request
                    </button>

                    <button @click="unimpersonateDefault">
                        Default
                    </button>

                    <button @click="unimpersonateVuex">
                        Vuex
                    </button>
                </td>
            </tr>
        </table>

        <hr />
    </div>
</template>

<script>
    export default {
        methods: {
            unimpersonateDefault() {
                this.$auth.unimpersonate();
            },

            unimpersonateRedirect() {
                this.$auth
                    .unimpersonate({
                        redirect: {name: 'admin-users'}
                    });
            },

            unimpersonateThen() {
                this.$auth
                    .unimpersonate({
                        redirect: null
                    })
                    .then(() => {
                        this.$router.push({name: 'admin-users'});
                    });
            },

            unimpersonateVuex() {
                this.$store.dispatch('auth/unimpersonate');
            },
            
            unimpersonateRequest() {
                this.$auth
                    .unimpersonate({
                        makeRequest: true
                    });
            }
        }
    }
</script>