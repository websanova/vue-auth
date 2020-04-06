import Vue         from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

Vue.http.options.root = process.env.VUE_APP_API_URL;

export default {
    root: process.env.VUE_APP_API_URL
};