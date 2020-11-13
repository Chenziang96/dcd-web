<template>
  <div style="padding: 20px">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>日志查询</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="medium" label-width="140px">
          <el-form-item label="用户搜索：">
            <el-input v-model="listQuery.userName" class="input-width" placeholder="用户昵称"></el-input>
          </el-form-item>
          <el-form-item label="日期搜索：">
            <el-date-picker class="input-width" v-model="listQuery.time" value-format="yyyy-MM-dd" type="date" placeholder="请选择日期"></el-date-picker>
          </el-form-item>
          <el-button style="margin-left: 30px" type="primary" @click="search()" size="medium">查 询</el-button>
          <el-button style="margin-left: 30px" @click="reForm" size="medium">重 置</el-button>
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
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="用户昵称" width="240" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="操作地址" width="240" align="center">
          <template slot-scope="scope">{{scope.row.ip }}</template>
        </el-table-column>
        <el-table-column label="时间" width="280" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作类型" width="240" align="center">
          <template slot-scope="scope">{{scope.row.operation}}</template>
        </el-table-column>
        <el-table-column label="请求地址" align="center">
          <template slot-scope="scope">{{scope.row.requestUrl}}</template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange()"
        layout="total, sizes, prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="pageTotal">
      </el-pagination>
    </div>
<!--    <div class="content-body" id="content-body">-->
<!--      <div class="content" id="content"></div>-->
<!--    </div>-->
  </div>
</template>

<script>
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    userName: null,
    time: null
  };
  export default {
    name: "index",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        pageTotal: 0,          //总条数
        allList: [],     //获取的所有的目录信息数组
        selectList: [],
        list: [],
      }
    },
    created() {
      // this.search();
      this.get1();
    },
    methods: {
      get1(){
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/auditclient/audit/findAll'
        })
          .then(function (res) {
            that.allList = res.data;
            that.changeList();
            console.log("执行乐乐乐乐乐");

          })
          .catch(function (error) {
            console.log(error);
          })
      },
      changeList() {
        this.pageTotal = this.allList.length;
        this.list = this.allList.slice(this.listQuery.pageSize*(this.listQuery.pageNum-1),this.listQuery.pageSize*this.listQuery.pageNum);
      },
      handleSizeChange(val) {            //改变当前页需要展示的目录信息条数后的目录信息的变化
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.changeList();
      },
      handleCurrentChange() {            //改变当前页码后需要展示的目录信息的变化
        this.changeList();
      },
      search() {
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/audit/getDirectoryAudit?userName=' + this.listQuery.userName,
          responseType:'blob'   //对象内容不可修改
        })
          .then(function (res) {
            console.log(res);
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      reForm() {
        this.listQuery.userName = null;
        this.listQuery.time = null;
      },
//       selectFile(e) {
//         // var fileObj = e.target.files[0]; // js 获取文件对象
//         // console.log(fileObj, 'fileObj')
//         // var name = fileObj.name;//读取选中文件的文件名
//         // var size = fileObj.size;//读取选中文件的大小
//         // console.log("wenjianming:" + name + "daxiao:" + size);//wenjianming:testfile.txtdaxiao:20
//         var reader = new FileReader();//这是核心！！读取操作都是由它完成的
//         reader.readAsText(e);
//         console.log('1111');
// //readAsText(file,[encoding]):将文件读取为文本，encoding缺省为UTF-8   readAsText(selectedFile,'UTF-8')
//         reader.onload = function (oFREvent) {   //读取完毕从中取值
//           var pointsTxt = oFREvent.target.result;
//           console.log(pointsTxt);
//           let divBody = document.getElementById('content');
//           divBody.innerText = pointsTxt;
//         }
//       }
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
