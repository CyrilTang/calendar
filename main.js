
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import myRequest from './utils/request.js'

Vue.config.productionTip = false



// 将请求方法挂载到 Vue 原型上
Vue.prototype.$get = myRequest.get;
Vue.prototype.$post = myRequest.post;


// 导入并挂载全局的分享方法
import share from './utils/share.js'
Vue.mixin(share)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif