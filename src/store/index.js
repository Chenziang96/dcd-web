import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    navigation: [true, true, true, true, true],
    directory: [],
    transmission: [],
    permissionManage: [],
    permissions: [],
    roles: [],
    users: [],
    userGroups: [],
    ruler: [],
    audit: [],
    systemLog: [],
    operationLog: []
  },
  modules: {
    app,
    user
  },
  getters,
})



export default store
