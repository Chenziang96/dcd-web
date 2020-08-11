<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>用户组列表</span>
      <el-button type="danger" class="pull-right" @click="handleAdd">新增用户组</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="用户组名称" width="250" align="center">
          <template slot-scope="scope">{{scope.row.groupName}}</template>
        </el-table-column>
        <el-table-column label="角色名称" width="250" align="center">
          <template slot-scope="scope">{{scope.row.roleName}}</template>
        </el-table-column>
        <el-table-column label="用户组描述" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleChange(scope.$index, scope.row)" type="text">编辑</el-button>
            <el-button size="small" @click="userDetail(scope.$index, scope.row)" type="text">用户详情</el-button>
            <el-button size="small" @click="permissionDetail(scope.$index, scope.row)" type="text">权限详情</el-button>
            <el-button size="small" @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--查看用户组-角色权限详情dialog-->
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
        userGroupList: [
          {
            id: 1,
            groupName: "超级管理员组",
            roleName: "超级管理员",
            description: "超级管理员",
            userData: [
              {
                userName: "用户A",
                platformIp: "192.168.0.1",
                registerTime: "2020-7-16",
                onLine: "在线"
              },
              {
                userName: "用户B",
                platformIp: "192.168.0.2",
                registerTime: "2020-7-15",
                onLine: "在线"
              },
              {
                userName: "用户C",
                platformIp: "192.168.0.3",
                registerTime: "2020-7-14",
                onLine: "离线"
              }
            ]
          },
          { id: 2, groupName: "管理员组", roleName: "管理员", description: "管理员" },
          { id: 3, groupName: "高级用户组", roleName: "高级用户", description: "高级用户" },
          { id: 4, groupName: "普通用户组", roleName: "普通用户", description: "普通用户" },
          { id: 5, groupName: "基本用户组", roleName: "基本用户", description: "基本用户" }
        ],
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
      this.get1();
    },
    methods:{
      get1(){
        this.allList = this.userGroupList;
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
      userDetail(index, row){
        this.$router.push({path:'/authority/detail',query: row})
      },
      permissionDetail(index, row){
        this.permissionDetailVisible = true;
      },
    }
  }
</script>
<style scoped>
  .pull-right {
    float: right;
    margin-bottom: 20px;
  }
</style>
