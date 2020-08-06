<template>
    <div>
        Test 401 users access
    </div>
</template>

<script>
    export default {
        mounted() {
            this.$http({
                url: 'users/list'
            })
            .then(() => {
                console.log('success')
            }, () => {
                console.log('error')
            })
            .catch(() => {
                console.log('catch')
            });
        }
    }
</script>