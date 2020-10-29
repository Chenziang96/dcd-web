import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/Login'
import layout from '../views/layout/Layout'
import Platform from '@/views/directory/index'
import DirDetail from '@/views/directory/dirDetail'
import Current from '@/views/request/current/index'
import Past from '@/views/request/past/index'
import Success from '@/views/request/current/requestDetail/success'
import Error from '@/views/request/current/requestDetail/error'
import Process from '@/views/request/current/requestDetail/process'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/home',
      component: layout,
      redirect: '/home/hello',
      children: [{
        path: 'hello',
        name: 'hello',
        component: () => import('@/views/home/index'),
        meta: {title: '首页', icon: 'home'}
      }]
    },
    {
      path: '/directory',
      component: layout,
      redirect: '/directory/platform',
      name: 'directory',
      meta: {title: '平台/目录信息', icon: 'arrange'},
      children: [
        {
          path: 'platform',
          name: 'platform',
          component: Platform,
          meta: {title: '平台/目录信息', icon: 'platform'}
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
      meta: {title: '请求详情', icon: 'send'},
      children: [
        {
          path: 'current',
          name: 'current',
          component: Current,
          meta: {title: '请求详情', icon: 'request_detail'}
        },
        {
          path: 'requestDetail/success',
          name: 'success',
          component: Success,
          meta: {title: '请求状态详情'},
          hidden: true
        },
        {
          path: 'requestDetail/error',
          name: 'error',
          component: Error,
          meta: {title: '请求状态详情'},
          hidden: true
        },
        {
          path: 'requestDetail/process',
          name: 'process',
          component: Process,
          meta: {title: '请求状态详情'},
          hidden: true
        },
      ]
    },
    {
      path: '/authority',
      component: layout,
      redirect: '/authority/permission',
      name: 'authority',
      meta: {title: '权限管理', icon: 'authority'},
      children: [
        {
          path: 'permission',
          name: 'permission',
          component: () => import('@/views/authority/permission/index'),
          meta: {title: '权限列表', icon: 'permission'},
        },
        {
          path: 'role',
          name: 'role',
          component: () => import('@/views/authority/role/index'),
          meta: {title: '角色列表', icon: 'role'},
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('@/views/authority/user/index'),
          meta: {title: '用户列表', icon: 'user'},
        },
        {
          path: 'userGroup',
          name: 'userGroup',
          component: () => import('@/views/authority/userGroup/index'),
          meta: {title: '用户组列表', icon: 'userGroup'},
        },
      ]
    },
    {
      path: '/rules',
      component: layout,
      redirect: '/rules/configuration',
      name: 'rules',
      meta: {title: '规则配置', icon: 'rules'},
      children: [
        {
          path: 'configuration',
          name: 'configuration',
          component: ()=> import('@/views/rules/index'),
          meta: {title: '规则配置', icon: 'rules'},
        },
      ]
    },
    {
      path: '/audit',
      component: layout,
      redirect: '/audit/systemLog',
      name: 'audit',
      meta: {title: '审计管理', icon: 'audit'},
      children: [
        {
          path: 'systemLog',
          name: 'systemLog',
          component: ()=> import('@/views/audit/systemLog/index'),
          meta: {title: '系统日志', icon: 'IoT_register'},
        },
        {
          path: 'operationLog',
          name: 'operationLog',
          component: ()=> import('@/views/audit/operationLog/index'),
          meta: {title: '操作日志', icon: 'IoT_register'},
        },
      ]
    },
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  ]
})
