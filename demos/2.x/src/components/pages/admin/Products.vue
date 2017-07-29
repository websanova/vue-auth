<template>
    <div>
        <ul>
            <li v-for="i in 9">
                Product {{ i }} <router-link :to="{name: 'admin-product-info', params: {product_id: i}}">info</router-link> | <router-link :to="{name: 'admin-product-media', params: {product_id: i}}">media</router-link>
            </li>
        </ul>
    </div>
</template>
