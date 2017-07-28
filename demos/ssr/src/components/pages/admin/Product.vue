<template>
    <div>
        <router-link :to="{name: 'admin-product-info', params: {product_id: $route.params.product_id}}">info</router-link> | 
        <router-link :to="{name: 'admin-product-media', params: {product_id: $route.params.product_id}}">media</router-link>

        <hr/>

        <router-view></router-view>
    </div>
</template>
