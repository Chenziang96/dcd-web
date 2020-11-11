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
        <el-table-column label="用户名" width="200" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="所在用户组" width="200" align="center">
          <template slot-scope="scope">{{scope.row.groupName}}</template>
        </el-table-column>
        <el-table-column label="平台名称" width="230" align="center">
          <template slot-scope="scope">{{scope.row.platformName}}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="230" align="center">
          <template slot-scope="scope">{{scope.row.registerTime}}</template>
        </el-table-column>
        <el-table-column label="在线状态" align="center">
          <template slot-scope="scope">
            <i class="el-icon-error" v-show="scope.row.onLine === false"></i>
            <i class="el-icon-success" v-show="scope.row.onLine === true"></i>
            <el-tag v-show="scope.row.onLine === true" type="success">在线</el-tag>
            <el-tag v-show="scope.row.onLine === false" type="info">离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320" align="center">
          <template slot-scope="scope">
            <el-button :disabled="!btnPermission[0]" size="mini" icon="el-icon-thumb" @click="handleGroup(scope.$index, scope.row)" type="warning">用户组</el-button>
            <el-button :disabled="!btnPermission[1]" size="mini" icon="el-icon-view" @click="handlePermission(scope.$index, scope.row)" type="success">权限</el-button>
            <el-button :disabled="!btnPermission[2]" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" type="danger">删除</el-button>
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

        //获取按钮权限
        btnPermission: [],

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
      async get1(){
        let that = this;
        await this.$http({
          method: 'get',
          url: '/api/userclient/checkPermsMatch?parentId=8'
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
          url: '/api/hibernate/user/list'
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
        this.initUserGroupChange();
        this.userGroupChange.userName = row.userName;
        if(row.groupName === null) {
          this.addOrChange = false;
        } else {
          this.addOrChange = true;
          this.userGroupChange.groupName = row.groupName;
        }
      },
      getGroupList() {
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/authoritymanage/group/findAllGroupName'
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
          }).then(async () => {
            await this.$http({
              method: 'post',
              url: '/api/authoritymanage/userGroup/insertUserNameAndGroupName?userName='+this.userGroupChange.userName+'&groupName='+this.userGroupChange.groupName,
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
            that.get1();
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
          }).then(async () => {
            await this.$http({
              method: 'post',
              url: '/api/authoritymanage/userGroup/updateUserNameAndGroupName?userName='+this.userGroupChange.userName+'&groupName='+this.userGroupChange.groupName,
            }).then(function (res) {
              if (res.data.status) {
                that.$message({
                  message: res.data.msg,
                  type: "success"
                });
              } else {
                that.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
              })
              .catch(function (error) {
                console.log(error);
              })
            that.get1();
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
          url: '/api/authoritymanage/userPermission/getUserPermissionNameByUserName?userName='+row.userName,
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
      async permissionDistribution() {
        let that = this;
        await this.$http({
          method: 'get',
          url: '/api/authoritymanage/userPermission/getAllPermissionByUserName?userName=' + this.userPermissionChangeName,
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
        }).then(async () => {
          let temp = this.permissionDetailData;
          console.log(temp);
          await this.$http({
            method: 'post',
            url: '/api/authoritymanage/userPermission/insertUserNameAndPermissionNameList?userName='+this.userPermissionChangeName+'&permissionNameList='+this.permissionChangeData,
          })
            .then(function (res) {
              if (res.data.status) {
                that.$message({
                  message: res.data.msg,
                  type: "success"
                });
              } else {
                that.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            })
          that.innerVisible = false;
          that.permissionDetailData = [];
          for (let i = 0; i < that.permissionChangeData.length; i++) {
            that.permissionDetailData[i] = that.permissionChangeData[i];
          }
        })
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
        }).then(async () => {
          await this.$http({
            method: 'post',
            url: '/api/userclient/delete?userName=' + row.userName,
          })
            .then(function (res) {
              if (res.data.status) {
                that.$message({
                  message: res.data.msg,
                  type: "success"
                });
              } else {
                that.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            })
          that.get1();
        });
      },

    }
  }
</script>
<style scoped>
  .dialog-title {
    text-align: center;
  }
</style>
