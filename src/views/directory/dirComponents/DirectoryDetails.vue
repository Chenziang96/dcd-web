<template>
  <div class="form-container-border">
    <el-row>
      <el-col :span="6" class="form-border form-left-bg font-medium">平台编号</el-col>
      <el-col class="form-border font-medium" :span="18">{{dirDetailData.id}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="form-border form-left-bg font-medium">平台名称</el-col>
      <el-col class="form-border font-medium" :span="18">{{dirDetailData.platformName}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="form-border form-left-bg font-medium">平台ip</el-col>
      <el-col class="form-border font-medium" :span="18">{{dirDetailData.platformIp}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="form-border form-left-bg font-medium">资源类型</el-col>
      <el-col class="form-border font-medium" :span="18">{{dirDetailData.resourceType}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="form-border form-left-bg font-medium">目录名称</el-col>
      <el-col class="form-border font-medium" :span="18">{{dirDetailData.resourceName}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="form-border form-left-bg font-medium">权限等级</el-col>
      <el-col class="form-border font-medium" :span="18">{{dirDetailData.safetyLevel}}</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "DirectoryDetails",
  props: {
    dirDetailData: {
      type: Object
    }
  },
  watch: {
    dirDetailData: {
      handler(newValue, oldValue) {
        console.log(newValue);
        console.log(oldValue);
        this.dirDetailData = newValue;
      },
      deep: true
    }
  },
}
</script>

<style scoped>
.form-border {
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  padding: 10px;
  height: 40px;
}

.form-container-border {
  border-left: 1px solid #DCDFE6;
  border-top: 1px solid #DCDFE6;
  margin-top: 15px;
  text-align: center;
}

.form-left-bg {
  background: #F2F6FC;
}
</style>
