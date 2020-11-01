<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>权限列表</span>
      <el-button :disabled="!btnPermission[0]" icon="el-icon-folder-add" type="primary" class="pull-right" @click="handleAdd">新增权限</el-button>
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
            <el-button :disabled="!btnPermission[1]" size="small" icon="el-icon-edit" @click="handleChange(scope.$index, scope.row)" type="warning">编辑</el-button>
            <el-button :disabled="!btnPermission[2]" size="small" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" type="danger">删除</el-button>
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
      <el-form :model="permissionAdd" label-width="100px">
        <el-form-item label="权限名称：">
          <el-input v-model="permissionAdd.permissionName"></el-input>
        </el-form-item>
        <el-form-item label="权限描述：">
          <el-input v-model="permissionAdd.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteAdd">取 消</el-button>
        <el-button :plain="true" type="danger" @click="confirmAdd">确 定</el-button>
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
        pageTotal: 0,          //总条数
        allList: [],          //截取的当前要展示的目录信息数组
        list: [],

        //获取按钮权限
        btnPermission: [],

        //对应的编辑权限功能
        permissionChange: { id: null, permissionName: null, description: null },
        changeDialogFormVisible: false,

        //对应的新增权限功能
        permissionAdd: { permissionName: null, description: null },
        addDialogFormVisible: false,
      }
    },
    created() {
      this.get1();
      this.aaa = this.$store.state.permissions;
    },
    methods:{
      async get1(){
        let that = this;
        await this.$http({
          method: 'get',
          url: '/api/d/checkPermsMatch?parentId=6'
        })
          .then(function (res) {
            that.btnPermission = res.data;
            console.log("执行乐乐乐乐乐");
          })
          .catch(function (error) {
            console.log(error);
          })
        this.$http({
          method: 'get',
          url: '/api/b/permission/findAll'
        })
          .then(function (res) {
            console.log(res);
            that.allList = res.data;              //第二个data是后端传递的数组名，可能需要修改
            that.changeList();
          })
          .catch(function (error) {
            console.log(error);
          })
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

      //对应的编辑权限功能
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
        let that = this;
        this.$confirm('是否要进行该编辑操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () => {
          await this.$http({
            method: 'post',
            url: '/api/b/permission/updateById?id='+this.permissionChange.id+'&permissionName='+this.permissionChange.permissionName+'&description='+this.permissionChange.description,
          }).then(function (res) {
              that.$message({
                message: res.data.info,
                type: res.data.status
              });
            })
            .catch(function (error) {
              console.log(error);
            })
          that.changeDialogFormVisible = false;
          that.get1();
        })
      },

      //对应的新增权限功能
      handleAdd() {
        this.addDialogFormVisible = true;
      },
      deleteAdd() {
        this.addDialogFormVisible = false;
        this.permissionAdd.permissionName = null;
        this.permissionAdd.description = null;
      },
      confirmAdd() {
        let that = this;
        this.$confirm('是否要进行该新增操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () => {
          let temp = this.permissionAdd;
          console.log(temp);
          await this.$http({
            method: 'post',
            url: '/api/b/permission/insert',
            data: temp
          }).then(function (res) {
              that.$message({
                message: res.data.info,
                type: res.data.status
              });
              that.permissionAdd.permissionName = null;
              that.permissionAdd.description = null;
            })
            .catch(function (error) {
              console.log(error);
            })
          that.get1();
          that.addDialogFormVisible = false;
        });
      },

      //对应的删除权限功能
      handleDelete(index, row) {
        let that = this;
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () => {
          await this.$http({
            method: 'post',
            url: '/api/b/permission/deleteByPermissionName?permissionName='+row.permissionName,
          })
            .then(function (res) {
              that.$message({
                message: res.data.info,
                type: res.data.status
              });
            })
            .catch(function (error) {

            })
          that.get1();
        });
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
