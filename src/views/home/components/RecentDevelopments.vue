<template>
  <a-card title="近期动态" class="card-recent-developments" shadow="always">
    <a slot="extra" @click="toUser">用户</a>
    <a slot="extra"> / </a>
    <a slot="extra" @click="toPlatform">平台</a>
    <a-list v-if="userOrPlatform" :pagination="pagination" :data-source="userActivities">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta>
          <a-avatar slot="avatar" :src="item.user.avatar"/>
          <div slot="title">
            <span>{{ userName }}</span>&nbsp;
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
            <span>{{ platformName }}</span>&nbsp;
            请求了&nbsp;<a href="#" style="color: green">{{ item.project.srcPlatformName }}</a>&nbsp;
            的&nbsp;<a href="#" style="color: green">{{ item.project.content }}</a>&nbsp;
            资源&nbsp;
          </div>
          <div slot="description">{{ item.time }}</div>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
export default {
  name: "RecentDevelopments",
  props: {
    userName: {
      type: String
    },
    platformName: {
      type: String
    }
  },
  data() {
    return {
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
      userActivities: [
        { user: { avatar: require('@/assets/images/link.jpg') }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:14" },
        { user: { avatar: require('@/assets/images/link.jpg') }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:13" },
        { user: { avatar: require('@/assets/images/link.jpg') }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },
        { user: { avatar: require('@/assets/images/link.jpg') }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },
        { user: { avatar: require('@/assets/images/link.jpg') }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },
        { user: { avatar: require('@/assets/images/link.jpg') }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },
        { user: { avatar: require('@/assets/images/link.jpg') }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },
        { user: { avatar: require('@/assets/images/link.jpg') }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },
        { user: { avatar: require('@/assets/images/link.jpg') }, project: { platformName: "物联网平台1", content: "目录" }, time: "2020-11-12 15:12" },

      ],
      platformActivities: [
        { platform: { avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", platformName: "物联网平台1" }, project: { srcPlatformName: "物联网平台2", content: "蜘蛛侠1" }, time: "2020-11-12 15:14" },
        { platform: { avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", platformName: "物联网平台1" }, project: { srcPlatformName: "物联网平台3", content: "蜘蛛侠2" }, time: "2020-11-12 13:13" },
        { platform: { avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", platformName: "物联网平台1" }, project: { srcPlatformName: "物联网平台4", content: "蜘蛛侠3" }, time: "2020-11-12 11:12" },
      ],
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
.card-recent-developments {
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  height: 400px;
}
</style>
