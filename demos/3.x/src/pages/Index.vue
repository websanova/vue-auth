<template>
    <el-layout
        title="Vue Auth 3.x Demo"
        package="vue-auth"
        :links="state.links"
    >

        <div class="text-danger">
            NOTE: This demo uses a public API to simulate realistic flow. The database is reset every 30 minutes and otherwise reveals no sensitive data such as emails or last names.

            <br/>

            NOTE: Would be nice to get some generic node (or deno?) service up for better/safer local testing. If you anyone can contribute, would be greatly appreciated :-) 

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

        <router-view />
    </el-layout>
</template>

<script>
    import elLayout from '../elements/Layout.vue';

    import {reactive       } from 'vue';
    import {computed       } from 'vue';
    import {onMounted      } from 'vue';
    import {onBeforeUnmount} from 'vue';
    import {useAuth        } from '@websanova/vue-auth/src/v3.js';
    import {useRoute       } from 'vue-router';

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

                    if (state.loaded && !auth.check()) {
                        links.push({to: {name: 'auth-login'}, text: 'login'});
                        links.push({to: {name: 'auth-register'}, text: 'register'});
                        // links.push({to: {name: 'auth-social'}, text: 'social'});
                        // links.push({to: {name: 'site-users'}, text: 'users'});
                    }


                    return links;

                    // <router-link
                    //     :to="{name: 'site-home'}"
                    // >
                    //     home
                    // </router-link>

                    // <span
                    //     style="float:right;"
                    // >
                    //     <span
                    //         v-show="!$auth.check()"
                    //     >
                    //         <router-link :to="{name: 'auth-login'}">login</router-link> |
                    //         <router-link :to="{name: 'auth-register'}">register</router-link> |
                    //         <router-link :to="{name: 'auth-social'}">social</router-link> |
                    //         <router-link :to="{name: 'site-users'}">users</router-link>
                    //     </span>

                    //     <span
                    //         v-show="$auth.check()"
                    //     >
                    //         <span v-show="$auth.check('user')">
                    //             <router-link :to="{name: 'user-users'}">users</router-link> |
                    //         </span>

                    //         <span v-show="$auth.check('admin')">
                    //             <router-link :to="{name: 'admin-landing'}">admin</router-link> |
                    //         </span>

                    //         <span v-show="$auth.impersonating()">
                    //             <router-link :to="{name: 'user-unimpersonate'}">unimpersonate</router-link> |
                    //         </span>
                            
                    //         <router-link :to="{name: 'user-account'}">account</router-link> |
                    //         <router-link :to="{name: 'user-logout'}">logout</router-link>
                    //     </span>
                    // </span>
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
