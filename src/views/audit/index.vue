<template>
  <div style="padding: 20px">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>日志查询</span>
        <el-button style="float:right" type="primary" @click="search()" size="small">查询搜索</el-button>
        <el-button style="float:right;margin-right: 15px" @click="reForm" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="账户搜索：">
            <el-input v-model="listQuery.userName" class="input-width" placeholder="账户名称"></el-input>
          </el-form-item>
<!--          <el-form-item label="本地文件：">-->
<!--            <input type="file" @change="selectFile($event)" id="file"></input>-->
<!--          </el-form-item>-->
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>日志内容</span>
    </el-card>
    <div class="content-body" id="content-body">
      <div class="content" id="content"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        listQuery: {
          userName:''
        },
      }
    },
    mounted() {
      this.search();
    },
    methods: {
      search() {
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/audit/getDirectoryAudit?userName='+this.listQuery.userName,
          responseType:'blob'
        })
          .then(function (res) {
            console.log(res);
            that.selectFile(res.data)
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      reForm() {

      },
      selectFile(e) {
        // var fileObj = e.target.files[0]; // js 获取文件对象
        // console.log(fileObj, 'fileObj')
        // var name = fileObj.name;//读取选中文件的文件名
        // var size = fileObj.size;//读取选中文件的大小
        // console.log("wenjianming:" + name + "daxiao:" + size);//wenjianming:testfile.txtdaxiao:20
        var reader = new FileReader();//这是核心！！读取操作都是由它完成的
        reader.readAsText(e);
        console.log('1111')
//readAsText(file,[encoding]):将文件读取为文本，encoding缺省为UTF-8   readAsText(selectedFile,'UTF-8')
        reader.onload = function (oFREvent) {//读取完毕从中取值
          var pointsTxt = oFREvent.target.result;
          console.log(pointsTxt);
          let divBody = document.getElementById('content');
          divBody.innerText = pointsTxt;
        }
      }
    }
  }
</script>

<style scoped>
  .content-body {
    position: relative;
    margin: 20px 0px auto;
    width: 100%;
    height: 700px;
    border: 1px solid #ebeef5;
    border-radius: 5px;
    overflow: auto;
    word-break:break-all;
    word-wrap:break-word;
    padding: 10px;
  }
</style>
