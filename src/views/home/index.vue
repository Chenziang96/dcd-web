<template>
  <div class="background">
    <a-card title="个人中心" class="box-card" shadow="always">
      <a slot="extra" href="#">刷新</a>
      <a-col :span="2">
        <div>
          <a-avatar :size="100" :src="link"></a-avatar>
        </div>
      </a-col>
      <a-col :span="5">
        <div class="welcome">
          <div style="font-size: 25px">早上好，徐浩，休息一下吧！</div>
          <div style="margin-top: 5px">前端工程师 | 蚂蚁金服 - 某某某事业群 - VUE平台</div>
        </div>
      </a-col>
      <a-col :span="17">
        <div class="extra-content">
          <div class="stat-item">
            <a-statistic title="资源数" :value="56" />
            <div class="after"></div>
          </div>
          <div class="stat-item">
            <a-statistic title="团队内排名" :value="8" suffix="/ 24" />
            <div class="after"></div>
          </div>
          <div class="stat-item">
            <a-statistic title="资源访问" :value="2223" />
          </div>
        </div>
      </a-col>
    </a-card>
    <div style="margin-top: 15px;">
      <a-row :gutter="24">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card title="平台简介" class="box-card" shadow="always">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="font-size: 15px">数据跨域交换中间件提供了一种多物联网平台数据跨域的实现方案。
              由于不同的物联网平台间的数据并不共享，使得大量的需要多平台数据联合实现的功能和业务无法开展。
              然而进行物联网数据的跨域传输涉及到了多物联网平台的权限问题和各平台中包含的隐私数据的问题也是一个难题。
              数据跨域交换中间件便是为解决这些问题提供了一种可行的解决方案。</a>
          </a-card>
          <a-card title="近期动态" class="box-card" shadow="always">
            <a slot="extra" @click="toUser">用户</a>
            <a slot="extra"> / </a>
            <a slot="extra" @click="toPlatform">平台</a>
            <a-list v-if="userOrPlatform" :pagination="pagination" :data-source="userActivities">
              <a-list-item slot="renderItem" slot-scope="item, index">
                <a-list-item-meta>
                  <a-avatar slot="avatar" :src="item.user.avatar"/>
                  <div slot="title">
                    <span>{{ item.user.userName }}</span>&nbsp;
                    更新了&nbsp;<a href="#" style="color: green">{{ item.project.platformName }}</a>&nbsp;
                    的&nbsp;<a href="#" style="color: green">{{ item.project.content }}</a>
                  </div>
                  <div slot="description">{{ item.time }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
            <a-list v-else :pagination="pagination2" :data-source="platformActivities">
              <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
                <a-list-item-meta>
                  <a-avatar slot="avatar" :src="item.platform.avatar"/>
                  <div slot="title">
                    <span>{{ item.platform.platformName }}</span>&nbsp;
                    请求了&nbsp;<a href="#" style="color: green">{{ item.project.srcPlatformName }}</a>&nbsp;
                    的&nbsp;<a href="#" style="color: green">{{ item.project.content }}</a>&nbsp;
                    资源&nbsp;
                  </div>
                  <div slot="description">{{ item.time }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col style="padding: 0 12px" :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card title="近期访问/被访问" class="box-card" shadow="always">
            <div class="chart-wrapper">
              <bar-chart />
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Antd from "ant-design-vue";
import BarChart from './components/BarChart'

Vue.use(Antd);
export default {
  name: "index",
  components: {
    BarChart,
  },
  data () {
    return {
      link: require('../../assets/images/link.jpg'),
      loading: true,
      userActivities: [
        { user: { avatar: require('../../assets/images/link.jpg'), userName: "张三" }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:14" },
        { user: { avatar: require('../../assets/images/link.jpg'), userName: "张三" }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:13" },
        { user: { avatar: require('../../assets/images/link.jpg'), userName: "张三" }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },
        { user: { avatar: require('../../assets/images/link.jpg'), userName: "李四" }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },
        { user: { avatar: require('../../assets/images/link.jpg'), userName: "李四" }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },
        { user: { avatar: require('../../assets/images/link.jpg'), userName: "李四" }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },
        { user: { avatar: require('../../assets/images/link.jpg'), userName: "王五" }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },
        { user: { avatar: require('../../assets/images/link.jpg'), userName: "王五" }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },
        { user: { avatar: require('../../assets/images/link.jpg'), userName: "王五" }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },

      ],
      platformActivities: [
        { platform: { avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", platformName: "物联网平台1" }, project: { srcPlatformName: "物联网平台2", content: "蜘蛛侠1" }, time: "2020-11-12 15:14" },
        { platform: { avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", platformName: "物联网平台1" }, project: { srcPlatformName: "物联网平台3", content: "蜘蛛侠2" }, time: "2020-11-12 13:13" },
        { platform: { avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", platformName: "物联网平台1" }, project: { srcPlatformName: "物联网平台4", content: "蜘蛛侠3" }, time: "2020-11-12 11:12" },
      ],
      userOrPlatform: true,
      pagination: {
        onChange: page => {
          console.log(page);
        },
        pageSize: 3,
      },
      pagination2: {
        onChange: page => {
          console.log(page);
        },
        pageSize: 3,
      },
    }
  },
  methods: {
    toUser() {
      this.userOrPlatform = true;
    },
    toPlatform() {
      this.userOrPlatform = false;
    },

  }
}
</script>

<style scoped>
.background {

}

.box-card {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}

.welcome {
  margin-top: 18px;
}

.extra-content {
  margin-top: 25px;
  float: right;
  white-space: nowrap;
}

.stat-item {
  position: relative;
  display: inline-block;
  padding: 0 32px;
}

.after {
  position: absolute;
  top: 8px;
  right: 0;
  width: 2px;
  height: 40px;
  background-color: #d3dce6;
  content: '';
}

.chart-wrapper {
  margin-top: 46px;
  margin-bottom: 30px;
}

</style>
