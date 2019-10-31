import Vue from 'vue';
import MpvueRouterPatch from 'mpvue-router-patch';
import App from './App';
import store from './store';
Vue.use(MpvueRouterPatch);
Vue.config.productionTip = false;

const app = new Vue({
  store,
  ...App
});
app.$mount();
