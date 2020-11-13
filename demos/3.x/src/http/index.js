import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default (app) => {
    app.axios = axios;
    app.$http = axios;

    app.config.globalProperties.axios = axios;
    app.config.globalProperties.$http = axios;
}