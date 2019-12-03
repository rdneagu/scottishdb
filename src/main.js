import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';
import { MediaQueries } from 'vue-media-queries';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.component('apexchart', VueApexCharts);

const mediaQueries = new MediaQueries();
Vue.use(mediaQueries);

new Vue({
  router,
  store,
  mediaQueries,
  render: h => h(App),
}).$mount('#app');
