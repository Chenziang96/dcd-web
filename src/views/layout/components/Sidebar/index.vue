<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="routes" :data="data"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),

    data() {
      console.log(this.$store.state.navigation);
      console.log("zzzzz");
      return this.$store.state;
    },
    routes() {
      console.log("执行");
      return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
