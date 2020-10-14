// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'ant-design-vue/dist/antd.css';
import './icons'
import store from './store'
import '@/styles/index.scss' //全局样式
import axios from 'axios'
import '@/permission' // permission control

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
    window.addEventListener('unload', e => this.unloadHandler(e));
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e));
    window.removeEventListener('unload', e => this.unloadHandler(e));
  },
  methods: {
    beforeunloadHandler(){
      this._beforeUnload_time = new Date().getTime();
    },
    async unloadHandler(e){
      this._gap_time = new Date().getTime() - this._beforeUnload_time;
      //判断是窗口关闭还是刷新
      if(this._gap_time <= 5){
        //如果是登录状态，关闭窗口前，移除用户
        await this.$http({
          method: 'post',
          url: '/api/d/logOff'
        });
      }
    },
  }
})
