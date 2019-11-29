import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: {
      ready: false,
      error: false,
      message: 'Loading',
    },
  },
  mutations: {
    loadingStart(state, payload = {}) {
      state.loading.ready = false;
      state.loading.error = false;
      state.loading.message = payload.message || '';
    },
    loadingMessage(state, payload) {
      state.loading.message = payload.message;
    },
    loadingFinish(state, payload = {}) {
      if (!payload.status) {
        state.loading.error = true;
        state.loading.message = payload.message || 'Error loading data';
      }
      state.loading.ready = true;
    },
  },
  actions: {
  },
  modules: {
  },
});
