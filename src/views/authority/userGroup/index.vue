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
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="用户组名称" width="300" align="center">
          <template slot-scope="scope">{{scope.row.groupName}}</template>
        </el-table-column>
        <el-table-column label="用户组描述" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleChange(scope.$index, scope.row)" type="text">编辑</el-button>
            <el-button size="small" @click="roleDetail(scope.$index, scope.row)" type="text">角色详情</el-button>
            <el-button size="small" @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--查看角色详情dialog-->
    <el-dialog title="角色详情" :visible.sync="roleDetailDialogVisible" class="dialog-title" width="600px">
      <el-form :model="groupRoleChange.roleName" label-width="100px">
        <el-form-item label="角色名称：">
          <el-select v-model="groupRoleChange.roleName" placeholder="请选择">
            <el-option
              v-for="item in roleListOptions"
              :key="item.index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDistribution">取 消</el-button>
        <el-button type="danger" @click="confirmDistribution">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑用户组-->
    <el-dialog :title="'修改用户组信息：编号' + userGroupChange.id" :visible.sync="changeDialogFormVisible" class="dialog-title" width="600px">
      <el-form :model="userGroupChange" label-width="100px">
        <el-form-item label="用户组名称：" >
          <el-input v-model="userGroupChange.groupName"></el-input>
        </el-form-item>
        <el-form-item label="用户组描述：">
          <el-input v-model="userGroupChange.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteModify">取 消</el-button>
        <el-button type="danger" @click="confirmModify">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增用户组-->
    <el-dialog title="新增用户组" :visible.sync="addDialogFormVisible" class="dialog-title" width="600px">
      <el-form :model="userGroupAdd" label-width="100px">
        <el-form-item label="用户组名称：">
          <el-input v-model="userGroupAdd.groupName"></el-input>
        </el-form-item>
        <el-form-item label="用户组描述：">
          <el-input v-model="userGroupAdd.description"></el-input>
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

        //角色详情和分配
        roleDetailDialogVisible: false,
        groupRoleChange: { groupName: null, roleName: null },
        roleListOptions: [],

        //编辑用户组
        changeDialogFormVisible: false,
        userGroupChange: { id: null, groupName: null, description: null },

        //新增用户组
        addDialogFormVisible: false,
        userGroupAdd: { groupName: null, description: null },

        //发送请求得辅助参数
        groupRoleData: [],
        addOrChange: null,
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
          url: '/api/b/group/findAll'
        })
          .then(function (res) {
            console.log(res.data);
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

      //新增用户组
      handleAdd() {
        this.addDialogFormVisible = true;
      },
      deleteAdd() {
        this.addDialogFormVisible = false;
        this.userGroupAdd.groupName = null;
        this.userGroupAdd.description = null;
      },
      confirmAdd() {
        let that = this;
        this.$confirm('是否要进行该新增操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let temp = this.userGroupAdd;
          console.log(temp);
          this.$http({
            method: 'post',
            url: '/api/b/group/insert',
            data: temp
          })
            .then(function (res) {
              that.$message({
                message: res.data.info,
                type: res.data.status
              });
              that.userGroupAdd.groupName = null;
              that.userGroupAdd.description = null;
            })
            .catch(function (error) {
              console.log(error);
            })
          that.sleep(500).then(() => {
            that.get1();
          })
          that.addDialogFormVisible = false;
        });
      },

      //编辑用户组
      handleChange(index, row){
        this.changeDialogFormVisible = true;
        this.userGroupChange.id = row.id;
        this.userGroupChange.groupName = row.groupName;
        this.userGroupChange.description = row.description;
      },
      deleteModify() {
        this.changeDialogFormVisible = false;
        this.userGroupChange.id = null;
        this.userGroupChange.groupName = null;
        this.userGroupChange.description = null;
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
            url: '/api/b/group/updateById?id='+this.userGroupChange.id+'&groupName='+this.userGroupChange.groupName+'&description='+this.userGroupChange.description,
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
          that.changeDialogFormVisible = false;
        })
      },

      //删除用户组
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
            url: '/api/b/group/deleteByGroupName?groupName='+row.groupName,
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

      //查看角色信息
      initGroupRoleChange() {
        this.groupRoleChange.roleName = null;
        this.groupRoleChange.groupName = null;
      },
      getRoleName(index, row) {
        let that = this;
        that.initGroupRoleChange();
        that.groupRoleChange.groupName = row.groupName;
        this.$http({
          method: 'get',
          url: '/api/b/groupRole/findRoleNameByGroupName?groupName='+row.groupName
        })
          .then(function (res) {
            console.log(res.data);
            that.groupRoleData = res.data;
            if(that.groupRoleData === "")
            {
              that.addOrChange = false;
            }
            else
            {
              that.addOrChange = true;
              that.groupRoleChange.roleName = that.groupRoleData;
            }
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      getRoleList() {
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/b/role/findAllRoleName'
        })
          .then(function (res) {
            console.log(res.data);
            that.roleListOptions = res.data;
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      roleDetail(index, row){
        this.getRoleName(index, row);
        this.getRoleList();
        this.roleDetailDialogVisible = true;
      },
      //分配角色
      confirmDistribution() {
        if(this.addOrChange === false)
        {
          this.$confirm('是否要进行该角色分配操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$http({
              method: 'post',
              url: '/api/b/groupRole/insertGroupNameAndRoleName?groupName='+this.groupRoleChange.groupName+'&roleName='+this.groupRoleChange.roleName,
            })
              .then(function (res) {
                console.log(res);
              })
              .catch(function (error) {
                console.log(error);
              })
          })
        }
        else
        {
          let that = this;
          this.$confirm('是否要进行该角色分配操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$http({
              method: 'post',
              url: '/api/b/groupRole/updateByGroupName?groupName='+this.groupRoleChange.groupName+'&roleName='+this.groupRoleChange.roleName,
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
        }
        this.roleDetailDialogVisible = false;
      },
      deleteDistribution() {
        this.roleDetailDialogVisible = false;
        this.addOrChange = null;
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
