<template>
  <div style="padding: 20px">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>日志搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="medium" label-width="90px">
          <el-form-item label="登录IP：">
            <el-input v-model="listQuery.ip" placeholder="登录ip地址"></el-input>
          </el-form-item>
          <el-form-item label="用户：">
            <el-input v-model="listQuery.userName" placeholder="用户昵称"></el-input>
          </el-form-item>
          <el-form-item label="日期：">
            <el-date-picker
              v-model="listQuery.createTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-button style="margin-left: 30px" type="primary" @click="search()" size="medium">查 询</el-button>
          <el-button style="margin-left: 10px" @click="reForm" size="medium">重 置</el-button>
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
        <el-table-column label="用户昵称" width="200" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="平台名称" width="200" align="center">
          <template slot-scope="scope">{{scope.row.platformName}}</template>
        </el-table-column>
        <el-table-column label="操作地址" width="200" align="center">
          <template slot-scope="scope">{{scope.row.ip }}</template>
        </el-table-column>
        <el-table-column label="时间" width="240" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作类型" width="200" align="center">
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
    ip: '',
    userName: '',
    createTime: ''
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
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 1);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 3);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    created() {
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

      //查询按钮和重置按钮
      search() {
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/auditclient/audit/selectByListQuery?ip=' + that.listQuery.ip + '&userName=' + that.listQuery.userName
            + '&createTime=' + that.listQuery.createTime,
        })
          .then(function (res) {
            that.allList = res.data;
            that.changeList();
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      reForm() {
        this.listQuery.ip = '';
        this.listQuery.userName = '';
        this.listQuery.createTime = '';
        this.get1();
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
