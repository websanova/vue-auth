<template>
    <div>
        <a v-link="{name: 'admin-product-info', params: {product_id: $route.params.product_id}}">info</a> | 
        <a v-link="{name: 'admin-product-media', params: {product_id: $route.params.product_id}}">media</a>

        <hr/>

        <router-view></router-view>
    </div>
</template>
