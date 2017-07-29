<template>
    <div>
        <h1>Admin</h1>

        <a v-link="{name: 'admin-products'}">products</a>

        <hr/>

        <router-view></router-view>
    </div>
</template>