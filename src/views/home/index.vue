<template>
  <div class="page-header-content">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <span>个人中心</span>
      </div>
      <div class="avatar">
        <el-avatar :size="100" :src="link"></el-avatar>
      </div>
<!--      <div class="content">-->
<!--        <div class="content-title">-->
<!--          {{ timeFix }}，{{ user.name }}<span class="welcome-text">，{{ welcome }}</span>-->
<!--        </div>-->
<!--        <div>前端工程师 | 蚂蚁金服 - 某某某事业群 - VUE平台</div>-->
<!--      </div>-->
    </el-card>
  </div>
</template>

<script>
export default {
  name: "index",
  data () {
    return {
      link: require('../../assets/images/link.jpg'),
    }
  }
}
</script>

<style scoped>
.box-card {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

</style>
