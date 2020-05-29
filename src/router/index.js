import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/Login'
import layout from '../views/layout/Layout'
import Register from '@/views/directory/register/Register'
import ArrangeIndex from '@/views/directory/arrangement/index'
import DirDetail from '@/views/directory/arrangement/dirDetail'
import Authority from '@/views/authority/user/index'

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
      name: 'directory',
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
          meta: {title: '平台信息', icon: 'IoT_arrangement'}
        },
        {
          path: 'dirDetail',
          name: 'dirDetail',
          component: DirDetail,
          meta: {title: '平台目录详情'},
          hidden: true
        }
      ]
    },
    {
      path: '/authority',
      component: layout,
      redirect: '/authority/user',
      name: 'authority',
      meta: {title: '权限管理', icon: 'authority'},
      children: [
        {
          path: 'user',
          name: 'user',
          component: Authority,
          meta: {title: '用户列表', icon: 'IoT_register'},
        },
        {
          path: 'detail',
          name: 'detail',
          component: () => import('@/views/authority/user/detail'),
          hidden: true,
        },
        {
          path: 'role',
          name: 'role',
          component: () => import('@/views/authority/role/index'),
          meta: {title: '角色列表', icon: 'IoT_register'},
        },
      ]
    },
  ]
})
