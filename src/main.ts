import Vue from 'vue';
import './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import axios from 'axios'
Vue.prototype.$axios = axios
Vue.prototype.$API = "https://b4dd6ae9.ngrok.io/api/v1/"
Vue.prototype.$STRIPE_API = "https://be707bee.ngrok.io/api/v1/"
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
