<template>
  <div>
    <el-steps :active="active" finish-status="success" style="margin-top: 260px;" align-center>
      <el-step title="数据过滤"></el-step>
      <el-step title="通道建立"></el-step>
      <el-step title="确定发送"></el-step>
    </el-steps>
    <div align="center">
      <el-button style="margin-top: 40px;" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "dataSend",
        data() {
          return {
            active: 0
          }
        },
        methods: {
          next() {
            if (this.active++ > 2) this.active = 0;
          }
        }
    }
</script>

<style scoped>

</style>
