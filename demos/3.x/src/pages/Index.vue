<template>
    <el-layout
        title="Vue Auth 3.x Demo"
        package="vue-auth"
        :links="[]"
    >
        <router-view />
    </el-layout>
</template>

<script>
    import elLayout from '../elements/Layout.vue';

    export default {
        components: {
            elLayout,
        }
    }
</script>
