<template>
    <div>
        <ul>
            <li v-for="i in 9">
                Product {{ i }} <a v-link="{name: 'admin-product-info', params: {product_id: i}}">info</a> | <a v-link="{name: 'admin-product-media', params: {product_id: i}}">media</a>
            </li>
        </ul>
    </div>
</template>
