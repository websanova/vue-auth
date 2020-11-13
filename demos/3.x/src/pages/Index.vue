<template>
    <el-layout
        title="Vue Auth 3.x Demo"
        package="vue-auth"
        :links="state.links"
    >
        <router-view />
    </el-layout>
</template>

<script>
    import elLayout from '../elements/Layout.vue';

    import {reactive          } from 'vue';
    import {computed          } from 'vue';
    import {onMounted         } from 'vue';
    import {onBeforeUnmount   } from 'vue';
    import {getCurrentInstance} from 'vue';

    export default {
        setup() {
            const ctx = getCurrentInstance().ctx;

            const state = reactive({
                readyOne: false,
                
                readyTwo: false,
                
                artificialLoad: false,
                
                user: computed(() => {
                    return ctx.$auth.user() || {};
                }),
                
                loaded: computed(() => {
                    return ctx.$auth.ready() && ctx.artificialLoad;
                }),
                
                links: computed(() => {
                    var links = [];

                    links.push({to: {name: 'site-home'}, text: 'home'});

                    if (ctx.$auth.check()) {
                        // links.push({to: {name: 'auth-login'}, text: 'login'});
                        // links.push({to: {name: 'auth-register'}, text: 'register'});
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

            return {
                state
            };
        },

        components: {
            elLayout,
        }
    }
</script>
