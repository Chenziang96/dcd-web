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
  export default {
    name: "index",
    components:{},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        pageTotal: 0,          //总条数
        allList: [],          //截取的当前要展示的目录信息数组
        list: [],

        //编辑角色
        changeDialogFormVisible: false,
        roleChange: { id: null, roleName: null, description: null },

        //权限详情查看
        permissionDetailVisible: false,
        permissionDetailData: [],
        //权限分配
        innerVisible: false,
        checkAll: null,
        isIndeterminate: null,
        permissions: [],
        permissionChangeData: [],
        rolePermissionChangeName: null,

        //新增角色
        addDialogFormVisible: false,
        roleAdd: {},
      }
    },
    created() {
      this.get1();
    },
    methods:{
      get1(){
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/b/role/findAll'
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

      //新增角色
      handleAdd() {
        this.addDialogFormVisible = true;
      },
      deleteAdd() {
        this.addDialogFormVisible = false;
        this.roleAdd.roleName = null;
        this.roleAdd.description = null;
      },
      confirmAdd() {
        let that = this;
        this.$confirm('是否要进行该新增操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let temp = this.roleAdd;
          console.log(temp);
          this.$http({
            method: 'post',
            url: '/api/b/role/insert',
            data: temp
          })
            .then(function (res) {
              that.$message({
                message: res.data.info,
                type: res.data.status
              });
              that.roleAdd.roleName = null;
              that.roleAdd.description = null;
            })
            .catch(function (error) {
              console.log(error);
            })
          that.sleep(500).then(() => {
            that.get1();
          })
        });
        that.addDialogFormVisible = false;
      },

      //编辑
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
        let that = this;
        this.$confirm('是否要进行该编辑操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$http({
            method: 'post',
            url: '/api/b/role/updateById?id='+this.roleChange.id+'&roleName='+this.roleChange.roleName+'&description='+this.roleChange.description,
          })
            .then(function (res) {
              that.$message({
                message: res.data.info,
                type: res.data.status
              });
            })
            .catch(function (error) {
              console.log(error);
            })
          that.changeDialogFormVisible = false;
          that.sleep(500).then(() => {
            that.get1();
          })
        })
      },

      //删除角色
      handleDelete(index,row) {
        let that = this;
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$http({
            method: 'post',
            url: '/api/b/role/deleteByRoleName?roleName='+row.roleName,
          })
            .then(function (res) {
              that.$message({
                message: res.data.info,
                type: res.data.status
              });
            })
            .catch(function (error) {
              console.log(error);
            })
          that.sleep(500).then(() => {
            that.get1();
          })
        });
      },

      //权限详情
      permissionDetail(index,row) {
        this.permissionDetailVisible = true;
        this.rolePermissionChangeName = row.roleName;
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/b/rolePermission/findPermissionNameByRoleName?roleName='+row.roleName,
        })
          .then(function (res) {
            console.log(res);
            that.permissionDetailData = res.data;
            that.changeList();
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      //权限分配
      permissionDistribution() {
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/b/permission/getAllPermissionName',
        })
          .then(function (res) {
            console.log(res);
            that.permissions = res.data;
          })
          .catch(function (error) {
            console.log(error);
          })
        that.permissionChangeData = [];
        for (let i = 0; i < that.permissionDetailData.length; i++) {
          that.permissionChangeData[i] = that.permissionDetailData[i];
        }
        that.innerVisible = true;
        let checkedCount = that.permissionChangeData.length;
        that.checkAll = checkedCount === that.permissions.length;
        that.isIndeterminate = checkedCount > 0 && checkedCount < that.permissions.length;
      },
      confirmDistribution() {
        let that = this;
        this.$confirm('是否要进行该权限分配操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let temp = this.permissionDetailData;
          console.log(temp);
          this.$http({
            method: 'post',
            url: '/api/b/rolePermission/insertRoleNameAndPermissionNameList?roleName='+this.rolePermissionChangeName+'&permissionNameList='+this.permissionChangeData,
          })
            .then(function (res) {
              that.$message({
                message: res.data.info,
                type: res.data.status
              });
            })
            .catch(function (error) {
              console.log(error);
            })
        })
        that.innerVisible = false;
        that.permissionDetailData = [];
        for (let i = 0; i < that.permissionChangeData.length; i++) {
          that.permissionDetailData[i] = that.permissionChangeData[i];
        }
      },
      deleteDistribution() {
        this.innerVisible = false;
      },
      handleCheckAllChange(val) {
        this.permissionChangeData = val ? this.permissions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.permissions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.permissions.length;
      },

      //延迟时间
      sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
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

