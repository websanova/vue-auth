<template>
    <div>
        <div
            style="max-width:400px; margin:0 auto 50px auto;"
        >
            <h1 class="text-center">
                Vue Auth Plugin Demo
            </h1>

            <div>
                {{ (_loaded && readyOne && readyTwo) ? 'Online ' : 'Loading...' }}

                <span
                    class="pull-right"
                    style="font-weight:bold; font-size:30px; line-height:20px;"
                >
                    <span
                        v-bind:style="{
                            color: readyOne ? 'lime' : 'red'
                        }"
                    >
                        &bull;
                    </span>
                    
                    <span
                        v-bind:style="{
                            color: _loaded ? 'lime' : 'red'
                        }"
                    >
                        &bull;
                    </span>

                    <span
                        v-bind:style="{
                            color: readyTwo ? 'lime' : 'red'
                        }"
                    >
                        &bull;
                    </span>
                </span>
            </div>

            <hr/>

            <div
                v-if="_loaded"
            >
                <div>
                    <router-link
                        :to="{name: 'site-home'}"
                    >
                        home
                    </router-link>

                    <span
                        style="float:right;"
                    >
                        <span
                            v-show="!$auth.check()"
                        >
                            <router-link :to="{name: 'auth-login'}">login</router-link> |
                            <router-link :to="{name: 'auth-register'}">register</router-link>
                        </span>

                        <span
                            v-show="$auth.check()"
                        >
                            <span v-show="$auth.check('admin')">
                                <router-link :to="{name: 'admin-landing'}">admin</router-link> |
                            </span>
                            
                            <router-link :to="{name: 'user-account'}">account</router-link> |
                            <router-link :to="{name: 'user-logout'}">logout</router-link>
                        </span>
                    </span>
                </div>

                <hr/>
                
                <span
                    v-if="!readyOne || !readyTwo"
                    class="spin"
                >
                    ↻
                </span>

                <router-view
                    v-else
                />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                readyOne: false,
                readyTwo: false,
                artificialLoad: false,
            }
        },

        computed: {
            _loaded() {
                return this.$auth.ready() && this.artificialLoad;
            }
        },

        mounted() {
            this.$auth
                .load()
                .then(() => {
                    this.readyOne = true;
                });

            this.$auth
                .load()
                .then(() => {
                    setTimeout(() => {
                        this.readyTwo = true;
                    }, 2000);
                });

            setTimeout(() => {
                this.artificialLoad = true;
            }, 1000);
        },

        methods: {
            unimpersonate() {
                this.$auth.unimpersonate({
                    success() {
                        console.log('success ' + this.context);
                    },
                    error() {
                        console.log('error ' + this.context);
                    }
                });
            }
        }
    }
</script>

<style>
    a {
        text-decoration: none;
        color: #6699ff;
    }

    .spin {
        display: inline-block;
        animation-name: spin;
        animation-duration: 500ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear; 
    }

    @keyframes spin {
        from { transform:rotate(0deg); }
        to { transform:rotate(360deg); }
    }

    input {
        padding: 5px;
        margin-bottom: 10px;
    }

    button {
        margin: 3px;
        padding: 5px 7px;
        cursor: pointer;
    }

    .text-center {
        text-align: center;
    }

    .pull-right {
        float: right;
    }

    .input-group {
        display: inline-block;
        text-align: left;
    }

    .input-group > input {
        margin-bottom: 0px;
    }

    .input-group > div {
        color: red;
        padding: 2px 0 0 2px;
        margin-bottom: 10px;
        font-size: 0.8em;
    }
</style>