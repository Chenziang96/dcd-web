<template>
  <a-card title="平台简介" class="card-platform-introduction" shadow="always">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: 15px">数据跨域交换中间件提供了一种多物联网平台数据跨域的实现方案。
              由于不同的物联网平台间的数据并不共享，使得大量的需要多平台数据联合实现的功能和业务无法开展。
              然而进行物联网数据的跨域传输涉及到了多物联网平台的权限问题和各平台中包含的隐私数据的问题也是一个难题。
              数据跨域交换中间件便是为解决这些问题提供了一种可行的解决方案。</span>
  </a-card>
</template>

<script>
export default {
  name: "PlatformIntroduction"
}
</script>

<style scoped>
.card-platform-introduction {
  margin-top: 10px;
  margin-left: 10px;
  height: 190px;
}
</style>
