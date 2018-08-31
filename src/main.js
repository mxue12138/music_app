// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'muse-ui/lib/styles/base.less'
import {
    Grid,
    Button,
    TextField,
    slider,
    Icon,
    Radio,
    LoadMore,
    Divider,
    List
} from 'muse-ui'
import 'muse-ui/lib/styles/theme.less'

// 引入全局js
import './assets/tools/common.js'

Vue.config.productionTip = false

Vue.use(Grid)
Vue.use(Button)
Vue.use(TextField)
Vue.use(slider)
Vue.use(Icon)
Vue.use(Radio)
Vue.use(LoadMore)
Vue.use(Divider)
Vue.use(List)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
