import {createApp} from 'vue';
import App         from './pages/Index.vue';
import http        from './http';
import store       from './store';
import router      from './router';
import auth        from './plugins/auth.js';

const app = createApp(App);

app
.use(http)
.use(store)
.use(router)
.use(auth)
.mount('#app');