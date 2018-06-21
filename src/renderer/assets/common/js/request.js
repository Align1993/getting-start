/**
 * url http拦截
 */
import Vue from 'vue'
import axios from 'axios'
// import VueAxios from 'vue-axios'
// import md5 from './md5.js'
import qs from 'qs'
// Vue.prototype.$axios = axios;
// Vue.use(VueAxios, axios)
// Vue.use(axios)
// Vue.use(require('vue-cookie'))

Vue.prototype.$ajax = axios
const myRequest = function (url, params, success, fail) {
  var version = 0
  var time = Date.parse(new Date()) / 1000
  var headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'time': time,
    'version': version
  }
  headers['Content-Type'] = 'multipart / form - data;'
  var object = params.method === 'post' ? {
    url: url,
    method: 'post',
    headers: headers
  } : {
    url: url,
    method: 'get',
    params: params,
    headers: headers
  }
  axios(object).then((data) => {
    if (data.status === 200) {
      if (data.data.code === 0) {
        success && success(data.data)
      } else {
        fail && fail(data)
      }
    } else {
      console.log(data.status)
    }
  }, (data) => {
    fail && fail(data)
  })
}

export default myRequest
