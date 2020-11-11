<template>
  <div class="menu-wrapper">
    <template v-for="(item, xx) in routes" v-if="!item.hidden && item.children">
      <div :key="xx" v-if="xx===0 || xx >= 6 || data.navigation[xx - 1]">
        <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children && !item.alwaysShow" :to="item.path+'/'+item.children[0].path"
                     :key="item.children[0].name">
          <el-menu-item @click="getStore(item.children[0].meta.title)" :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
            <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
            <span v-if="item.children[0].meta && item.children[0].meta.title" slot="title" >{{item.children[0].meta.title}}</span>
          </el-menu-item>
        </router-link>

        <el-submenu v-else :index="item.name||item.path" :key="item.name">
<!--          <div @click="getStore(item.meta.title)">-->
            <template slot="title" >
              <div @click="getStore(item.meta.title)">
                <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
                <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
              </div>

            </template>
<!--          </div>-->


          <template v-for="(child, yy) in item.children" v-if="!child.hidden">
            <div :key="yy" v-if="(xx===3 && data.permissionManage[yy]) || (xx===5 && data.audit[yy])">
              <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

              <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
                <el-menu-item :index="item.path+'/'+child.path" @click="getStore(child.meta.title)">
                  <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                  <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
                </el-menu-item>
              </router-link>
            </div>

          </template>
        </el-submenu>
      </div>


    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    data: {
      type: Object
    },
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      return showingChildren.length === 1;
    },
    getStore(name) {
      console.log(name);
      if (name === "平台/目录信息") {
        console.log(name);
      }
      if (name === "数据传输") {
        console.log(name);
      }
      if (name === "权限管理") {
        this.setStore(3);
      }
      if (name === "审计管理") {
        this.setStore(5);
      }
      if (name === "系统日志") {

      }
      if (name === "操作日志") {

      }
    },
    async setStore(id) {
      let xx = [];
      await this.$http({
        method: 'get',
        url: '/api/userclient/checkPermsMatch?parentId=' + id
      })
        .then(function (res) {
          xx = res.data;
        })
        .catch(function (error) {
          console.log(error);
        })
      if (id === 3) {
        this.$store.state.permissionManage = xx;
      }
      if (id === 5) {
        this.$store.state.audit = xx;
      }
    }

  }
}
</script>
