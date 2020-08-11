
<!--????????-->
<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>权限列表</span>
      <el-button type="danger" class="pull-right" @click="handleAdd">新增权限</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="权限名称" width="300" align="center">
          <template slot-scope="scope">{{scope.row.permissionName}}</template>
        </el-table-column>
        <el-table-column label="权限描述" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleChange(scope.$index, scope.row)" type="text">编辑</el-button>
            <el-button size="small" @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--编辑权限-->
    <el-dialog :title="'修改权限信息：编号' + permissionChange.id" :visible.sync="changeDialogFormVisible" class="dialog-title" width="600px">
      <el-form :model="permissionChange" label-width="80px">
        <el-form-item label="权限名称">
          <el-input v-model="permissionChange.permissionName"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="permissionChange.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteModify">取 消</el-button>
        <el-button type="danger" @click="confirmModify">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增权限-->
    <el-dialog title="新增权限" :visible.sync="addDialogFormVisible" class="dialog-title" width="600px">
      <el-form :model="permissionAdd" label-width="80px">
        <el-form-item label="权限名称">
          <el-input v-model="permissionAdd.permissionName"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="permissionAdd.description"></el-input>
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
        permissionList: [
          { id: 1, permissionName: "查看所有平台目录", description: "查看所有平台目录" },
          { id: 2, permissionName: "新增自身平台目录", description: "新增自身平台目录" },
          { id: 3, permissionName: "更新自身平台目录", description: "更新自身平台目录" },
          { id: 4, permissionName: "删除自身平台目录", description: "删除自身平台目录" },
          { id: 5, permissionName: "请求其他平台资源", description: "请求其他平台资源" },
          { id: 6, permissionName: "RBAC分配", description: "RBAC分配" },
          { id: 7, permissionName: "其他", description: "其他" },
          { id: 8, permissionName: "查看共享互通策略", description: "查看共享互通策略" },
          { id: 9, permissionName: "新增共享互通策略", description: "新增共享互通策略" },
          { id: 10, permissionName: "更新共享互通策略", description: "更新共享互通策略" },
          { id: 11, permissionName: "删除共享互通策略", description: "删除共享互通策略" }
        ],
        permissionChange: { id: null, permissionName: null, description: null },
        changeDialogFormVisible: false,
        permissionAdd: { permissionName: null, description: null },
        addDialogFormVisible: false
      }
    },
    created() {
      this.get1();
    },
    methods:{
      get1(){
        this.allList = this.permissionList;
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
      handleChange(index, row){
        this.changeDialogFormVisible = true;
        this.permissionChange.id = row.id;
        this.permissionChange.permissionName = row.permissionName;
        this.permissionChange.description = row.description;
      },
      deleteModify() {
        this.changeDialogFormVisible = false;
        this.permissionChange.id = null;
        this.permissionChange.permissionName = null;
        this.permissionChange.description = null;
      },
      confirmModify() {
        this.$confirm('是否要进行该编辑操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let j = 0; j < this.permissionList.length; j++) {
            if(this.permissionList[j].id === this.permissionChange.id)
            {
              this.permissionList[j].permissionName = this.permissionChange.permissionName;
              this.permissionList[j].description = this.permissionChange.description;
            }
          }
          this.changeDialogFormVisible = false;
        })
      },
      handleAdd() {
        this.addDialogFormVisible = true;
      },
      deleteAdd() {
        this.addDialogFormVisible = false;
        this.permissionAdd.permissionName = null;
        this.permissionAdd.description = null;
      },
      confirmAdd() {
        this.$confirm('是否要进行该编辑操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.permissionList.push({
            id: this.permissionList.length + 1,
            permissionName: this.permissionAdd.permissionName,
            description: this.permissionAdd.description
          });
          this.permissionAdd.permissionName = null;
          this.permissionAdd.description = null;
          this.addDialogFormVisible = false;
          this.changeList();
        });
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.permissionList.splice(this.listQuery.pageSize*(this.listQuery.pageNum-1)+index,1);
          if(this.permissionList.length/this.listQuery.pageSize === this.listQuery.pageNum-1)
          {
            this.listQuery.pageNum = this.listQuery.pageNum-1;
          }
          this.changeList();
        });
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

