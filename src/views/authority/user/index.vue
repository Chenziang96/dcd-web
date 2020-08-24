<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>用户列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="用户名" width="265" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="用户密码" width="265" align="center">
          <template slot-scope="scope">{{scope.row.pwd}}</template>
        </el-table-column>
        <el-table-column label="平台IP" width="265" align="center">
          <template slot-scope="scope">{{scope.row.platformIp }}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="265" align="center">
          <template slot-scope="scope">{{scope.row.registerTime}}</template>
        </el-table-column>
        <el-table-column label="在线状态" align="center">
          <template slot-scope="scope">{{scope.row.onLine}}</template>
        </el-table-column>
        <el-table-column label="操作" width="265" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleGroup(scope.$index, scope.row)" type="text">分配用户组</el-button>
            <el-button size="mini" @click="handlePermission(scope.$index, scope.row)" type="text">权限详情</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分配用户组dialog-->
    <el-dialog :title="'分配用户组'" :visible.sync="groupSelectVisible" class="dialog-title" width="550px">
      <el-form :model="userGroupChange.groupName" label-width="100px">
        <el-form-item label="角色名称：">
          <el-select v-model="userGroupChange.groupName" placeholder="请选择" style="width: 280px">
            <el-option
              v-for="item in groupOptions"
              :key="item.index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteSelect" >取 消</el-button>
        <el-button type="danger" @click="confirmSelect">确 定</el-button>
      </div>
    </el-dialog>

    <!--查看用户权限详情dialog-->
    <el-dialog :title="'权限详情'" :visible.sync="permissionDetailVisible" class="dialog-title" width="600px">
      <el-dialog title="分配权限" :visible.sync="innerVisible" append-to-body center width="500px">
        <div style="margin: 20px 100px;">
          <el-checkbox style="zoom: 120%" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="permissionChangeData" @change="handleCheckedCitiesChange">
            <el-checkbox
              style="zoom: 120%;margin-bottom: 8px;"
              v-for="permission in permissions"
              :label="permission"
              :key="permission">
              {{permission}}
            </el-checkbox>
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
        listLoading: false,
        pageTotal: 0,          //总条数
        allList: [],          //截取的当前要展示的目录信息数组
        list: [],

        //对应的分配用户组的功能
        groupSelectVisible: false,
        groupOptions: [],
        userGroupChange: { userName: null, groupName: null },

        //对应的权限详情查询功能
        permissionDetailVisible: false,
        permissionDetailData: [],
        //对应的权限分配的功能
        innerVisible: false,
        isIndeterminate: null,
        checkAll: null,
        permissionChangeData: [],
        permissions: [],
        userPermissionChangeName: null,

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
        let port = 9035;
        this.$http({
          method: 'get',
          url: '/api/a/user/list'
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

      //处理 分配用户组功能
      initUserGroupChange() {
        this.userGroupChange.userName = null;
        this.userGroupChange.groupName = null;
      },
      getGroupName(index,row) {
        let that = this;
        that.initUserGroupChange();
        that.userGroupChange.userName = row.userName;
        this.$http({
          method: 'get',
          url: '/api/b/userGroup/findGroupNameByUserName?userName='+that.userGroupChange.userName
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
              that.userGroupChange.groupName = that.groupRoleData;
            }
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      getGroupList() {
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/b/group/findAllGroupName'
        })
          .then(function (res) {
            console.log(res.data);
            that.groupOptions = res.data;
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      handleGroup(index, row) {
        this.getGroupName(index, row);
        this.getGroupList();
        this.groupSelectVisible = true;
      },
      deleteSelect() {
        this.groupSelectVisible = false;
      },
      confirmSelect() {
        if(this.addOrChange === false)
        {
          let that = this;
          this.$confirm('是否要进行该用户组分配操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$http({
              method: 'post',
              url: '/api/b/userGroup/insertUserNameAndGroupName?userName='+this.userGroupChange.userName+'&groupName='+this.userGroupChange.groupName,
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
            that.groupSelectVisible = false;
          })
        }
        else
        {
          let that = this;
          this.$confirm('是否要进行该用户组分配操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$http({
              method: 'post',
              url: '/api/b/userGroup/updateUserNameAndGroupName?userName='+this.userGroupChange.userName+'&groupName='+this.userGroupChange.groupName,
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
            that.groupSelectVisible = false;
          })
        }
      },

      //处理 权限查询功能
      handlePermission(index, row) {
        this.permissionDetailVisible = true;
        this.userPermissionChangeName = row.userName;
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/b/userPermission/getUserPermissionNameByUserName?userName='+row.userName,
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
      //处理 权限分配功能
      permissionDistribution() {
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/b/userPermission/getAllPermissionByUserName?userName=' + this.userPermissionChangeName,
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
            url: '/api/b/userPermission/insertUserNameAndPermissionNameList?userName='+this.userPermissionChangeName+'&permissionNameList='+this.permissionChangeData,
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

      //删除用户
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
            url: '/api/c/delete?userName='+row.userName,
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

      //延迟时间
      sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }
    }
  }
</script>
<style scoped>
  .dialog-title {
    text-align: center;
  }
</style>
