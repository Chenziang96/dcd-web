import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/Login'
import layout from '../views/layout/Layout'
import Register from '@/views/directory/register/Register'
import ArrangeIndex from '@/views/directory/arrangement/index'
import DirDetail from '@/views/directory/arrangement/dirDetail'
import Current from '@/views/request/current/index'
import Past from '@/views/request/past/index'



Vue.use(Router);

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
      path: '/request',
      component: layout,
      redirect: '/request/current',
      name: 'request',
      meta: {title: '数据传输', icon: 'send'},
      children: [
        {
          path: 'current',
          name: 'current',
          component: Current,
          meta: {title: '正在处理', icon: 'request_current'}
        },
        {
          path: 'past',
          name: 'past',
          component: Past,
          meta: {title: '历史记录', icon: 'request_past'}
        },
      ]
    },
    {
      path: '/authority',
      component: layout,
      redirect: '/authority/userGroup',
      name: 'authority',
      meta: {title: '权限管理', icon: 'authority'},
      children: [
        {
          path: 'userGroup',
          name: 'userGroup',
          component: () => import('@/views/authority/userGroup/index'),
          meta: {title: '用户组列表', icon: 'userGroup'},
        },
        {
          path: 'detail',
          name: 'detail',
          component: () => import('@/views/authority/userGroup/detail'),
          hidden: true,
        },
        {
          path: 'role',
          name: 'role',
          component: () => import('@/views/authority/role/index'),
          meta: {title: '角色列表', icon: 'role'},
        },
        {
          path: 'permission',
          name: 'permission',
          component: () => import('@/views/authority/permission/index'),
          meta: {title: '权限列表', icon: 'permission'},
        },
      ]
    },
    {
      path: '/audit',
      component: layout,
      redirect: '/audit/index',
      name: 'audit',
      meta: {title: '审计管理', icon: 'audit'},
      children: [
        {
          path: 'index',
          name: 'index',
          component: ()=> import('@/views/audit/index'),
          meta: {title: '审计管理', icon: 'IoT_register'},
        },

      ]
    }
  ]
})
