import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/Login'
import layout from '../views/layout/Layout'
import Register from '@/views/directory/register/Register'
import ArrangeIndex from '@/views/directory/arrangement/index'
import DirDetail from '@/views/directory/arrangement/dirDetail'
import Authority from '@/views/authority/user/index'
import Send from '@/views/transmit/send/index'
import DataSend from '@/views/transmit/send/dataSend'
import Request from '@/views/transmit/receive/index'


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
          hidden:true
        }
      ]
    },
    {
      path: '/transmit',
      component: layout,
      redirect: '/transmit/send',
      name: 'transmit',
      meta: {title: '数据传输', icon: 'send'},
      children: [
        {
          path: 'request',
          name: 'request',
          component: Request,
          meta: {title: '请求发送', icon: 'request_send'}
        },
        {
          path: 'send',
          name: 'send',
          component: Send,
          meta: {title: '数据发送', icon: 'data_send'}
        },
        {
          path: 'dataSend',
          name: 'dataSend',
          component: DataSend,
          meta: {title: '目录数据发送'},
          hidden:true
        },

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
          meta: {title: '用户列表', icon: 'IoT_register'}
        },
        {
          path: 'role',
          name: 'role',
          component: ()=> import('@/views/authority/role/index'),
          meta: {title: '权限列表', icon: 'IoT_register'}
        },
      ]
    },
  ]
})
