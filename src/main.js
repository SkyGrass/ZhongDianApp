// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/storage'
// import './permission'
import { title } from './mixins/title'
Vue.mixin(title)

// 设置 js中可以访问 $cdn
import { $cdn } from '@/config'
Vue.prototype.$cdn = $cdn

// 全局引入按需引入UI库 vant
import '@/plugins/vant'
// 引入全局样式
import '@/assets/css/index.scss'
// 移动端适配
import 'lib-flexible/flexible.js'

// filters
import './filters'
Vue.config.productionTip = false

Vue.directive('focus', {
  inserted: function (el, { modifiers: { noKeyboard } }) {
    try {
      const tagName = el.tagName
      if (tagName !== 'INPUT') {
        let child = el.children[0]
        if (child && child.tagName === 'INPUT') {
          el = child
        }
      }
      el.focus()
      // 不弹起软键盘
      if (noKeyboard) {
        el.setAttribute('readonly', 'readonly')
        var timer = null
        timer = setTimeout(() => {
          el.removeAttribute('readonly')
          clearTimeout(timer)
        }, 100)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
