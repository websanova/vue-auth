<template>
    <div>
        <div
            v-show="form.status !== 'success'"
        >
            Loading users...
        </div>

        <div
            v-if="form.status === 'success'"
        >
            <template v-for="user in form.data.items">
                <div>
                    {{ user.first_name }}

                    <span class="pull-right">
                        <button
                            @click="impersonateDefault(user)"
                        >
                            Default
                        </button>

                        <button
                            @click="impersonateVuex(user)"
                        >
                            Vuex
                        </button>
                    </span>
                </div>

                <span class="text-muted">
                    ({{ user.role }})
                </span>

                <hr/>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    status: null,
                    data: null
                }
            }
        },

        mounted() {
            this.getUsers();
        },

        methods: {
            getUsers() {
                this.form.status = 'loading';

                this.$http({
                    url: 'users/list'
                })
                .then((res) => {
                    this.form.data = res.data.data;

                    this.form.status = 'success';
                });
            },

            impersonateDefault(user) {
                this.$auth
                    .impersonate({
                        url: 'auth/' + user.id + '/impersonate',
                        redirect: {name: 'user-account'},
                    });
            },

            impersonateVuex(user) {
                this.$store.dispatch('auth/impersonate', {
                    user: user
                });
            }
        }
    }
</script>