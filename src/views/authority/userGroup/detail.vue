<template> 
  <div class="app-container">
    <el-page-header @back="goBack" :content="userGroup.groupName + '(用户列表)'">
    </el-page-header>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>用户列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="账号名称" width="270" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="平台名称" width="270" align="center">
          <template slot-scope="scope">{{scope.row.platformIp }}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="270" align="center">
          <template slot-scope="scope">{{scope.row.registerTime}}</template>
        </el-table-column>
        <el-table-column label="是否在线" align="center">
          <template slot-scope="scope">{{scope.row.onLine}}</template>
        </el-table-column>
        <el-table-column label="操作" width="270" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleAdmin(scope.$index, scope.row)" type="text">分配用户组</el-button>
            <el-button size="small" @click="permissionDetail(scope.$index, scope.row)" type="text">权限详情</el-button>
            <el-button size="small" @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--查看用户权限详情dialog-->
    <el-dialog title="权限详情" :visible.sync="permissionDetailVisible" center width="700px">
      <div class="table-container" style="margin-bottom: 50px;">
        <el-table ref="orderTable" :data="permissionDetailData" style="width: 100%;" border max-height="500">
          <el-table-column label="权限id" width="150" align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="权限名称" align="center">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
        </el-table>
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
        :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import eventBus from '@/assets/bus.js';
  import { getAllList } from '@/api/authority.js'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    orderPerson: null,
    orderIp: null,
    orderDir: null,
    createTime: null,
  };
  export default {
    name: "index",
    components:{},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        permissionDetailVisible: false,
        pageTotal: 0,          //总条数
        allList: [],          //截取的当前要展示的目录信息数组
        list: [],
        userGroup: {},
        permissionDetailData: [
          { id: 1, name: "查看所有平台目录"},
          { id: 2, name: "新增自身平台目录"},
          { id: 3, name: "更新自身平台目录"},
          { id: 4, name: "删除自身平台目录"},
          { id: 5, name: "请求其他平台资源"},
          { id: 6, name: "RBAC分配"},
          { id: 7, name: "其他"},
          { id: 8, name: "查看共享互通策略"},
          { id: 9, name: "新增共享互通策略"},
          { id: 10, name: "更新共享互通策略"},
          { id: 11, name: "删除共享互通策略"},
        ],
      }
    },
    created() {
      this.userGroup = this.$route.query;
      this.get1();
    },
    methods:{
      get1(){
        this.allList = this.userGroup.userData;
        this.changeList();
      },
      changeList() {               //截取需要展示在当前页的目录信息
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
      permissionDetail(index, row){
        this.permissionDetailVisible = true;
      },
      goBack() {
        this.$router.push('/authority/userGroup');
      }
    }
  }
</script>
<style scoped>
  .dialog-title {
    text-align: center;
  }
</style>
