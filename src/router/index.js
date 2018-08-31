import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import play from '@/components/play'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: 'play',
          name: 'play',
          component: play
        }
      ]
    }
  ]
})
