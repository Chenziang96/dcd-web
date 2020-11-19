<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" label-width="100px">
          <el-form-item label="平台名称：">
            <el-input v-model="listQuery.platformName" class="input-width" placeholder="平台名称"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker
              v-model="listQuery.createTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 30px" type="primary" @click="search">查询搜索</el-button>
            <el-button style="margin-left: 15px" @click="reForm">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>平台列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="平台名称" width="240" align="center">
          <template slot-scope="scope">{{scope.row.platformName}}</template>
        </el-table-column>
        <el-table-column label="平台IP" width="240" align="center">
          <template slot-scope="scope">{{scope.row.platformIp }}</template>
        </el-table-column>
        <el-table-column label="系统类型" width="240" align="center">
          <template slot-scope="scope">{{scope.row.os}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.registerTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-view" size="small" @click="handleDetail(scope.$index, scope.row)" type="success">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange()"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    platformName: '',
    createTime: '',
  };
  export default {
    name: "index",
    components:{},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: false,
        pageTotal: 0,          //总条数
        allList: [],     //获取的所有的目录信息数组
        list: [],
      }
    },
    created() {
      this.get1();   //联调时打开
    },
    methods:{
      get1() {               //获取后端提供的所有目录信息
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/hibernate/device/findAll'
        })
        .then(function (res) {
          that.allList = res.data;               //第二个data是后端传递的数组名，可能需要修改
          that.changeList();
        })
        .catch(function (error) {
          console.log(error);
        })
      },
      changeList() {               //截取需要展示在当前页的目录信息
        this.pageTotal = this.allList.length;
        this.list = this.allList.slice(this.listQuery.pageSize*(this.listQuery.pageNum-1),this.listQuery.pageSize*this.listQuery.pageNum);
        console.log(this.list);
      },
      handleSizeChange(val) {            //改变当前页需要展示的目录信息条数后的目录信息的变化
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.changeList();
      },
      handleCurrentChange() {            //改变当前页码后需要展示的目录信息的变化
        this.changeList();
      },
      handleDetail(index, row){
        this.$router.push({path:'/directory/dirDetail',query: row})
      },

      //查询按钮和重置按钮
      search() {
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/hibernate/device/selectByListQuery?platformName=' + that.listQuery.platformName,
        })
          .then(function (res) {
            that.allList = res.data;
            that.changeList();
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      reForm(){
        this.listQuery.createTime='';
        this.listQuery.platformName='';
        this.get1();
      },

      test() {
        this.$http({
          method: 'get',
          url: '/api/userclient/checkPerms'
        }).then((res)=> {
          console.log(res);
          // storage.setItem('JESSIONID',)
        })
          .catch(function (error) {
            console.log(error);
          })
      }
    }
  }
</script>

<style scoped>

</style>
