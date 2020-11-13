<template>
    <div class="container">
        <h1 class="header text-center">
            <a href="https://websanova.com">
                <img src="/img/logo-dark-text.png" />
            </a>
        </h1>

        <h1 class="text-center">
            {{ title }}
        </h1>

        <hr/>
        
        <ul class="text-center text-bold spacer spacer-pipe">
            <li><a :href="'https://websanova.com/docs/' + package">Docs</a></li>
            <li><a :href="'https://github.com/websanova/' + package">GitHub</a></li>
            <li><a href="https://patreon.com/websanova">Patreon</a></li>
        </ul>
        
        <hr/>

        <ul class="text-center spacer spacer-pipe">
            <li v-for="link in links"><router-link :to="link.to">{{ link.text }}</router-link></li>
        </ul>

        <hr/>

        <div>
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            links: Array,
            title: String,
            package: String,
        }
    }
</script>

<style>
    @import '../styles/nova.css';
</style>