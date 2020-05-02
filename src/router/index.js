import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/Login'
import layout from '../views/layout/Layout'
import Register from '@/views/directory/register/Register'
import ArrangeIndex from '@/views/directory/arrangement/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      component: layout,
      redirect: 'home',
      children: [{
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: {title: '首页', icon: 'home'}
      }]
    },
    {
      path: '/directory',
      component: layout,
      redirect: '/directory/register',
      name: 'index',
      meta: {title: '目录管理', icon: 'register'},
      children: [
        {
          path: 'register',
          name: 'register',
          component: Register,
          meta: {title: '平台注册', icon: 'IoT_register'}
        },
        {
          path: 'arrange',
          name: 'arrange',
          component: ArrangeIndex,
          meta: {title: '目录信息', icon: 'IoT_arrangement'}
        }
      ]
    },
  ]
})
