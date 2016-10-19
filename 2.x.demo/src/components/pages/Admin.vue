<template>
    <div>
        <h1>Admin</h1>

        <router-link :to="{name: 'admin-products'}">products</router-link>

        <hr/>

        <router-view></router-view>
    </div>
</template>
