import Vue from "vue";
import QA from "./qa/QA.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(QA),
}).$mount("#app");