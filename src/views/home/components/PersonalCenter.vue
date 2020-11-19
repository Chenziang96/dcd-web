<template>
  <a-card title="个人中心" class="card-personal-center" shadow="always">
    <a slot="extra">刷新</a>
    <a-col :span="2">
      <div>
        <a-avatar :size="100" :src="link"></a-avatar>
      </div>
    </a-col>
    <a-col :span="7">
      <div class="welcome">
        <div style="font-size: 25px">{{ timeFix }}，{{ userName }}，{{ welcome }}！</div>
        <div style="margin-top: 5px">数据跨域交换中间件平台 | {{ platformName }}</div>
      </div>
    </a-col>
    <a-col :span="15">
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
</template>

<script>
export default {
  name: "PersonalCenter",
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
      link: require('@/assets/images/link.jpg'),
      timeFix: null,
      welcome: null,
    }
  },
  created() {
    this.getTimeFix();
    this.getWelcome();
  },
  methods: {
    getTimeFix() {
      const time = new Date()
      const hour = time.getHours()
      this.timeFix = hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 19 ? '下午好' : '晚上好';
    },
    getWelcome() {
      const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 LOL', '我猜你可能累了']
      const index = Math.floor(Math.random() * arr.length)
      this.welcome = arr[index];
    },
  }

}
</script>

<style scoped>

.card-personal-center {
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
</style>
