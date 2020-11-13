import {createStore} from 'vuex';

import auth from './auth.js';

const debug = process.env.NODE_ENV !== 'production';

const store = createStore({
    modules: {
        auth
    },
  
    strict: debug
});

export default store;