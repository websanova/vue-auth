<template>
    <el-layout
        title="Vue Auth 3.x Demo"
        package="vue-auth"
        :links="state.links"
    >
        <div class="media text-danger">
            <div class="media-tight media-middle px-2">
                NOTE:
            </div>
            <div>
                This demo uses a public API to simulate realistic flow, don't put any real info in there when testing :-)
            </div>
        </div>

        <hr />

        <div
            class="media"
        >
            <div>
                {{ (state.loaded && state.readyOne && state.readyTwo) ? 'Online ' : 'Loading...' }}
            </div>

            <div
                class="media-tight"
            >
                <span
                    v-bind:style="{
                        color: state.readyOne ? 'lime' : 'red'
                    }"
                >
                    &#11044;
                </span>
                
                <span
                    v-bind:style="{
                        color: state.loaded ? 'lime' : 'red'
                    }"
                >
                    &#11044;
                </span>

                <span
                    v-bind:style="{
                        color: state.readyTwo ? 'lime' : 'red'
                    }"
                >
                    &#11044;
                </span>
            </div>
        </div>

        <hr/>
            
        <span
            v-if="!state.readyOne || !state.readyTwo"
            class="spinner"
        >
            Loading...
        </span>

        <div
            v-else
            class="media"
        >
            <div>
                {{ state.path }}
            </div>

            <div class="media-tight">
                <span v-if="state.check">
                    {{ state.user.first_name }}
                </span>

                <span v-else-if="state.remember">
                    Welcome back, {{ state.remember.name }}
                </span>
            </div>
        </div>

        <hr />

        <div
            v-if="state.loaded && state.readyOne && state.readyTwo"
        >
            <router-view />
        </div>
    </el-layout>
</template>

<script>
    import elLayout from '../elements/Layout.vue';

    import {reactive       } from 'vue';
    import {computed       } from 'vue';
    import {onMounted      } from 'vue';
    import {onBeforeUnmount} from 'vue';
    import {useRoute       } from 'vue-router';
    import {useAuth        } from '@websanova/vue-auth/src/v3.js';

    export default {
        setup() {
            const auth  = useAuth();
            const route = useRoute();

            const state = reactive({
                readyOne: false,
                
                readyTwo: false,
                
                artificialLoad: false,
                
                user: computed(() => {
                    return auth.user() || {};
                }),
                
                loaded: computed(() => {
                    return auth.ready() && state.artificialLoad;
                }),

                path: computed(() => {
                    return (route.name || '').split('-').join(' / ')
                }),

                remember: computed(() => {
                    var remember = auth.remember();

                    if (remember) {
                        remember = JSON.parse(remember);
                    }

                    return remember;
                }),

                check: computed(() => {
                    return auth.check();
                }),

                meta: computed(() => {
                    return route.meta;
                }),
                
                links: computed(() => {
                    var links = [];

                    links.push({to: {name: 'site-home'}, text: 'home'});

                    if (state.loaded) {
                        if (!auth.check()) {
                            links.push({to: {name: 'auth-login'}, text: 'login'});
                            links.push({to: {name: 'auth-register'}, text: 'register'});
                            links.push({to: {name: 'auth-social'}, text: 'social'});
                            links.push({to: {name: 'site-users'}, text: 'users'});
                        }

                        if (auth.check('user')) {
                            links.push({to: {name: 'user-users'}, text: 'users'});
                        }

                        if (auth.check('admin')) {
                            links.push({to: {name: 'admin-landing'}, text: 'admin'});
                        }

                        if (auth.impersonating()) {
                            links.push({to: {name: 'user-unimpersonate'}, text: 'unimpersonate'});
                        }

                        if (auth.check()) {
                            links.push({to: {name: 'user-account'}, text: 'account'});
                            links.push({to: {name: 'user-logout'}, text: 'logout'});
                        }
                    }

                    return links;
                }),
            });

            onMounted(() => {
                auth
                    .load()
                    .then(() => {
                        state.readyOne = true;
                    });

                auth
                    .load()
                    .then(() => {
                        setTimeout(() => {
                            state.readyTwo = true;
                        }, 2000);
                    });

                setTimeout(() => {
                    state.artificialLoad = true;
                }, 1000);

            });

            function unimpersonate() {
                this.$auth.unimpersonate({
                    success() {
                        console.log('success ' + this.context);
                    },
                    error() {
                        console.log('error ' + this.context);
                    }
                });
            }

            return {
                state,
                unimpersonate,
            };
        },

        components: {
            elLayout,
        }
    }
</script>
