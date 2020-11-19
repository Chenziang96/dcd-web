<template>
  <div class="background">
    <personal-center :userName="userName" :platformName="platformName" />
    <div>
      <a-row>
        <a-col :span="12">
          <platform-introduction />
          <recent-developments :userName="userName" :platformName="platformName"/>
        </a-col>
        <a-col :span="12">
          <bar-chart />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Antd from "ant-design-vue";
import BarChart from './components/BarChart'
import PersonalCenter from "./components/PersonalCenter";
import PlatformIntroduction from "./components/PlatformIntroduction";
import RecentDevelopments from "./components/RecentDevelopments";

Vue.use(Antd);
export default {
  name: "index",
  components: {
    BarChart,
    PersonalCenter,
    PlatformIntroduction,
    RecentDevelopments
  },
  data() {
    return {
      userName: null,
      platformName: null
    }
  },
  created() {
    this.getUserName();
    this.getPlatformName();
  },
  methods: {
    //获取用户名
    async getUserName() {
      let that = this;
      await this.$http({
        method: 'get',
        url: '/api/userclient/getUserNameByRequest'
      })
        .then(function (res) {
          that.userName = res.data;
        })
        .catch(function (error) {
          console.log(error);
        })
    },

    //获取用户所在平台名
    async getPlatformName() {
      let that = this;
      await this.$http({
        method: 'get',
        url: '/api/userclient/getPlatformNameByRequest'
      })
        .then(function (res) {
          that.platformName = res.data;
          console.log("执行乐乐乐乐乐");
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }
}
</script>

<style scoped>
.background {
  background-color: #d3dce6;
  padding-top: 1px;
}

</style>
