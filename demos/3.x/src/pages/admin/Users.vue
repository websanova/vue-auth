<template>
    <div>
        <div
            v-show="state.form.status !== 'success'"
            class="spinner"
        >
            Loading users...
        </div>

        <div
            v-if="state.form.status === 'success'"
        >
            <div
                v-for="user in state.form.data.items"
                class="media"
            >

                <div class="media-middle">
                    <span class="text-muted">
                        ({{ user.role }})
                    </span>

                    <span class="mx-1">
                        {{ user.first_name }}
                    </span>
                </div>

                <div class="media-tight media-middle">
                    <ul class="spacer">
                        <li>
                            <button
                                @click="impersonateDefault(user)"
                            >
                                Default
                            </button>
                        </li><li>
                            <button
                                @click="impersonateComp(user)"
                            >
                                Comp
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {reactive } from 'vue';
    import {onMounted} from 'vue';
    import {useStore } from 'vuex';
    import axios       from 'axios';
    import {useAuth  } from '@websanova/vue-auth/src/v3.js';
    import useAuthComp from '../../../src/composables/useAuthComp.js';

    export default {
        setup() {
            const auth     = useAuth();
            const store    = useStore();
            const authComp = useAuthComp();

            const state = reactive({
                form: {
                    status: null,
                    data: null
                }
            });

            onMounted(() => {
                getUsers();
            });

            function getUsers() {
                state.form.status = 'loading';

                axios({
                    url: 'users/list'
                })
                .then((res) => {
                    state.form.data = res.data.data;

                    state.form.status = 'success';
                });
            }

            function impersonateDefault(user) {
                auth
                .impersonate({
                    url: 'auth/' + user.id + '/impersonate',
                    redirect: {name: 'user-account'},
                });
            }

            function impersonateComp(user) {
                authComp.impersonate({user: user});
            }

            return {
                state,
                impersonateComp,
                impersonateDefault,
            }
        }
    }
</script>