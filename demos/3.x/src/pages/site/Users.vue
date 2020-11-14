<template>
    <div>
        Test 401 users access
    </div>
</template>

<script>
    import {onMounted} from 'vue';
    import axios       from 'axios';

    export default {
        setup() {
            onMounted(() => {
                axios({
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
            })
        }
    }
</script>