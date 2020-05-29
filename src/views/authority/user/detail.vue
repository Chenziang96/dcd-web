<template>
  <div class="app-container">
    <el-page-header @back="goBack" :content="platform.userName+'(权限详情)'">
    </el-page-header>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 80%;margin: 0px auto" @selection-change="" border>
        <el-table-column label="子用户名" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.registerTime}}</template>
        </el-table-column>
        <el-table-column label="权限分配" align="center">
          <template slot-scope="scope">{{scope.row.roleName}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleAdmin(scope.$index, scope.row)" type="text">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="'分配角色'" :visible.sync="adminVisible" class="dialog-title" width="700px">
        <div  class="dialog-body" style="overflow: hidden">
          <el-select v-model="tempRole" style="width: 60%;" :placeholder="tempRole">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="adminVisible = false" >取 消</el-button>
          <el-button type="primary" @click="changeRole">确 定</el-button>
        </div>
      </el-dialog>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange()"
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          :page-sizes="[5,10,15]"
          :total="pageTotal"
          style="position: relative;right: 40%">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    orderPerson: null,
    orderIp: null,
    orderDir: null,
    createTime: null,
  };

  export default {
    name: "dirDetail",
    data() {
      return {
        platform: {},
        obj: {},
        list: [],
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: false,
        selectProductCateValue: null,
        dialogFormVisible: false,
        pageTotal: 0,          //总条数
        searchList: [],
        windowWidth:0,
        adminVisible:false,
        tempRole:'',
        allList: [
          {userName: '子账户1', registerTime: '2019-06-04', roleName: '用户'},
          {userName: '子账户3', registerTime: '2019-06-04', roleName: '用户'},
          {userName: '子账户4', registerTime: '2019-06-04', roleName: '用户'},
          {userName: '子账户2', registerTime: '2019-06-04', roleName: '管理员'},
        ],
        roleOptions:[
          {
            value:'超级管理员',
            label:'超级管理员'
          },
          {
            value:'管理员',
            label:'管理员'
          },
          {
            value:'用户',
            label:'用户'
          },
        ],
      }
    },
    created() {
      this.platform = this.$route.query;
      this.changeList();
      this.handleMargin();
      console.log(this.platform)
    },
    methods: {
      goBack() {
        this.$router.back(-1);
      },
      getList(){

      },
      changeList() {               //截取需要展示在当前页的目录信息
        this.pageTotal = this.allList.length;
        this.list = this.allList.slice(this.listQuery.pageSize * (this.listQuery.pageNum - 1), this.listQuery.pageSize * this.listQuery.pageNum);
      },
      handleSizeChange(val) {            //改变当前页需要展示的目录信息条数后的目录信息的变化
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.changeList();
      },
      handleDetail() {

      },
      handleCurrentChange() {            //改变当前页码后需要展示的目录信息的变化
        this.changeList();
      },
      handleMargin() {
        let width = window.innerWidth;
        console.log(width);
      },
      handleAdmin(){
        this.adminVisible =true;
      },
      changeRole(){
        //修改子账户角色信息
        this.adminVisible = false;
      }
    }
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

  .pull-right {
    float: right;
  }
</style>
