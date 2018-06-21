import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import request from './assets/common/js/request'
import db from './assets/common/js/datastore'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.request = request
Vue.prototype.db = db
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
