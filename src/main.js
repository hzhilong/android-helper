const { require } = window.require

import Vue from "vue"
import App from "./App.vue"
import router from "./router"

import "./global/global-import"
import "./global/global-init"

new Vue({
  router,
  render: h => h(App),
}).$mount("#app")
