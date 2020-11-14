import {createStore} from 'vuex';

const debug = process.env.NODE_ENV !== 'production';

const store = createStore({
    modules: {},
  
    strict: debug
});

export default store;