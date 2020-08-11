<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>角色列表</span>
      <el-button type="danger" class="pull-right" @click="handleAdd">新增角色</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="角色名称" width="300" align="center">
          <template slot-scope="scope">{{scope.row.roleName}}</template>
        </el-table-column>
        <el-table-column label="角色描述" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleChange(scope.$index, scope.row)" type="text">编辑</el-button>
            <el-button size="small" @click="permissionDetail(scope.$index, scope.row)" type="text">权限详情</el-button>
            <el-button size="small" @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--编辑角色-->
    <el-dialog :title="'修改角色信息：编号' + roleChange.id" :visible.sync="changeDialogFormVisible" class="dialog-title" width="600px">
      <el-form :model="roleChange" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="roleChange.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleChange.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteModify">取 消</el-button>
        <el-button type="danger" @click="confirmModify">确 定</el-button>
      </div>
    </el-dialog>

    <!--查看角色权限详情dialog-->
    <el-dialog title="权限详情" :visible.sync="permissionDetailVisible" center width="500px">
      <el-dialog title="分配权限" :visible.sync="innerVisible" append-to-body center width="500px">
        <div style="margin: 20px 100px;">
          <el-checkbox style="zoom: 120%" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="permissionChangeData" @change="handleCheckedCitiesChange">
            <el-checkbox style="zoom: 120%;margin-bottom: 8px;" v-for="permission in permissions" :label="permission" :key="permission">{{permission}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="deleteDistribution">取 消</el-button>
          <el-button type="danger" @click="confirmDistribution">确 定</el-button>
        </div>
      </el-dialog>
      <div class="table-container">
        <el-table ref="orderTable" :data="permissionDetailData" style="width: 100%;" border max-height="500">
          <el-table-column label="权限名称" align="center">
            <template slot-scope="scope">{{scope.row}}</template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="permissionDistribution">分配权限</el-button>
      </div>
    </el-dialog>

    <!--新增角色-->
    <el-dialog title="新增角色" :visible.sync="addDialogFormVisible" class="dialog-title" width="600px">
      <el-form :model="roleAdd" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="roleAdd.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleAdd.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteAdd">取 消</el-button>
        <el-button type="danger" @click="confirmAdd">确 定</el-button>
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
  const permissionData = [
    "查看所有平台目录",
    "新增自身平台目录",
    "更新自身平台目录",
    "删除自身平台目录",
    "请求其他平台资源",
    "RBAC分配",
    "其他",
    "查看共享互通策略",
    "新增共享互通策略",
    "更新共享互通策略",
    "删除共享互通策略"
  ];
  export default {
    name: "index",
    components:{},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        permissionDetailVisible: false,
        innerVisible: false,
        pageTotal: 0,          //总条数
        allList: [],          //截取的当前要展示的目录信息数组
        list: [],
        roleList: [
          { id: 1, roleName: "超级管理员", description: "超级管理员" },
          { id: 2, roleName: "管理员", description: "管理员" },
          { id: 3, roleName: "高级用户", description: "高级用户" },
          { id: 4, roleName: "普通用户", description: "普通用户" },
          { id: 5, roleName: "基本用户", description: "基本用户" }
        ],
        roleChange: { id: null, roleName: null, description: null },
        changeDialogFormVisible: false,
        permissionDetailData: [
          "查看所有平台目录",
          "新增自身平台目录",
          "更新自身平台目录",
          "删除自身平台目录",
          "请求其他平台资源",
          "RBAC分配",
          "其他",
          "查看共享互通策略",
          "新增共享互通策略",
          "更新共享互通策略",
          "删除共享互通策略"
        ],
        permissionChangeData: [],
        isIndeterminate: null,
        permissions: permissionData,
        checkAll: null,
        addDialogFormVisible: false,
        roleAdd: {}
      }
    },
    created() {
      this.get1();
    },
    methods:{
      get1(){
        this.allList = this.roleList;
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
      userDetail(index, row) {
        this.$router.push({path:'/authority/detail',query: row})
      },
      permissionDetail(index, row) {
        this.permissionDetailVisible = true;
      },
      handleAdd() {
        this.addDialogFormVisible = true;
      },
      deleteAdd() {
        this.addDialogFormVisible = false;
        this.roleAdd.roleName = null;
        this.roleAdd.description = null;
      },
      confirmAdd() {
        this.$confirm('是否要进行该编辑操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.roleList.push({
            id: this.roleList.length + 1,
            roleName: this.roleAdd.roleName,
            description: this.roleAdd.description
          });
          this.roleAdd.roleName = null;
          this.roleAdd.description = null;
          this.addDialogFormVisible = false;
          this.changeList();
        });
      },
      handleChange(index, row){
        this.changeDialogFormVisible = true;
        this.roleChange.id = row.id;
        this.roleChange.roleName = row.roleName;
        this.roleChange.description = row.description;
      },
      deleteModify() {
        this.changeDialogFormVisible = false;
        this.roleChange.id = null;
        this.roleChange.roleName = null;
        this.roleChange.description = null;
      },
      confirmModify() {
        this.$confirm('是否要进行该编辑操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let j = 0; j < this.roleList.length; j++) {
            if(this.roleList[j].id === this.roleChange.id)
            {
              this.roleList[j].roleName = this.roleChange.roleName;
              this.roleList[j].description = this.roleChange.description;
            }
          }
          this.changeDialogFormVisible = false;
        })
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.roleList.splice(this.listQuery.pageSize*(this.listQuery.pageNum-1)+index,1);
          if(this.roleList.length/this.listQuery.pageSize === this.listQuery.pageNum-1)
          {
            this.listQuery.pageNum = this.listQuery.pageNum-1;
          }
          this.changeList();
        });
      },
      permissionDistribution() {
        this.permissionChangeData = [];
        for (let i = 0; i < this.permissionDetailData.length; i++) {
          this.permissionChangeData[i] = this.permissionDetailData[i];
        }
        this.innerVisible = true;
        let checkedCount = this.permissionChangeData.length;
        this.checkAll = checkedCount === this.permissions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.permissions.length;
      },
      confirmDistribution() {
        this.innerVisible = false;
        this.permissionDetailData = [];
        for (let i = 0; i < this.permissionChangeData.length; i++) {
          this.permissionDetailData[i] = this.permissionChangeData[i];
        }
      },
      deleteDistribution() {
        this.innerVisible = false;
      },
      handleCheckAllChange(val) {
        this.permissionChangeData = val ? permissionData : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.permissions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.permissions.length;
      }
    }
  }
</script>
<style scoped>
  .pull-right {
    float: right;
    margin-bottom: 20px;
  }
</style>

