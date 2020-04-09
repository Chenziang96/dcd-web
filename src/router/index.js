
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/Login'
import layout from '../views/layout/Layout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '',
      component: layout,
      redirect: 'home',
      children: [{
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: {title:'首页', icon:'home'}
      }]
    },
  ]
})
