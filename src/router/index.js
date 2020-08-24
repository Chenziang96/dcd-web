import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/Login'
import layout from '../views/layout/Layout'
import Platform from '@/views/directory/index'
import DirDetail from '@/views/directory/dirDetail'
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
      redirect: '/directory/platform',
      name: 'directory',
      meta: {title: '目录管理', icon: 'arrange'},
      children: [
        {
          path: 'platform',
          name: 'platform',
          component: Platform,
          meta: {title: '平台信息', icon: 'platform'}
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
          meta: {title: '请求详情', icon: 'request_detail'}
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
          path: 'user',
          name: 'user',
          component: () => import('@/views/authority/user/index'),
          meta: {title: '用户列表', icon: 'user'},
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
      path: '/rules',
      component: layout,
      redirect: '/rules/index',
      name: 'rules',
      meta: {title: '规则配置', icon: 'rules'},
      children: [
        {
          path: 'index',
          name: 'index',
          component: ()=> import('@/views/rules/index'),
          meta: {title: '规则配置', icon: 'rules'},
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
