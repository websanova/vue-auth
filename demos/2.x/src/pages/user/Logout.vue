<template>
    <div>
        <table>
            <tr>
                <td>Logout</td>

                <td class="text-right">
                    <button @click="logoutRedirect">
                        Redirect
                    </button>

                    <button @click="logoutThen">
                        Then
                    </button>

                    <button @click="logoutRequest">
                        Request
                    </button>

                    <button @click="logoutDefault">
                        Default
                    </button>

                    <button @click="logoutVuex">
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
            logoutDefault() {
                this.$auth.logout();
            },

            logoutRedirect() {
                this.$auth
                    .logout({
                        redirect: {name: 'auth-login'}
                    });
            },

            logoutThen() {
                this.$auth
                    .logout({
                        redirect: null
                    })
                    .then(() => {
                        this.$router.push({name: 'auth-login'});
                    });
            },

            logoutVuex() {
                this.$store.dispatch('auth/logout');
            },
            
            logoutRequest() {
                this.$auth
                    .logout({
                        makeRequest: true
                    });
            }
        }
    }
</script>