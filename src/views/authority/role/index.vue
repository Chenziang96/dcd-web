<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never" style="height: 70px">
      <i class="el-icon-tickets"></i>
      <span>角色列表</span>
      <el-button style="float: right" @click="addRole">新增角色</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="scope">{{scope.row.roleName}}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleAdmin(scope.row)" type="text">权限详情</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="'新增角色'" :visible.sync="roleVisible" width="700px">
        <el-form :model="form">
          <el-form-item label="角色名称" label-width="120px">
            <el-input v-model="form.name" autocomplete="off" width="40px"></el-input>
          </el-form-item>
          <el-form-item label="角色权限" label-width="120px">
            <el-checkbox-group v-model="authName">
              <el-checkbox v-for="auth in authNum" :label="auth" :key="auth">{{auth}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="roleVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeRole()">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="'新增权限'" :visible.sync="authVisible" width="700px">
        <div style="display: inline-block">
          <span>新的角色名:</span>
          <el-select v-model="select" multiple placeholder="请选择">
            <el-option
              v-for="item in authNum"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="authVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeAudt">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="权限详情" :visible.sync="detailVisible">
        <el-table ref="orderTable" :data="gridData" style="width: 100%;" @selection-change="" border>
          <el-table-column label="编号" width="80" align="center">
            <template slot-scope="scope">{{scope.$index+1}}</template>
          </el-table-column>
          <el-table-column label="权限名称" align="center">
            <template slot-scope="scope">{{scope.row.permissionName}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="deleteAuth(scope.$index, scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="authVisible = true">新增权限</el-button>
          <el-button type="danger" @click="detailVisible = false">确定</el-button>
        </div>
      </el-dialog>
    </div>
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
    components: {},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: false,
        selectProductCateValue: null,
        roleVisible: false,
        form: {}, //表单数据
        authName: [],
        nameInput: '',
        name:'',
        selectOptions:[{}],
        select:[],
        authVisible: false,
        authNum: ['查看所有平台目录', '新增自身平台目录', '更新自身平台目录', '删除自身平台目录', '请求其他平台资源'],
        adminVisible: false,
        detailVisible: false,
        pageTotal: 0,          //总条数
        searchList: [],       //执行查询操作后，满足查询条件的所有的目录信息的数组
        allList: [],          //截取的当前要展示的目录信息数组
        list: [],
        changeData: {},
        gridData: [],
        changeVisible: false,
        changeTempData: [],
        initialData: {},
        operateType: null,
        multipleSelection: [],
        row: [],
        tempRole: '', //暂存权限
        index: 0, //表单中用到的数组目录
        closeOrder: {
          dialogVisible: false,
          content: null,
          orderIds: []
        },
        index: 0,
      }
    },
    mounted() {
      this.get1();
    },
    beforeDestroy() {
    },
    methods: {
      changeAudt(){
        console.log(this.select);
        console.log(this.name);
        this.$http({
          method: 'post',
          url: 'api/hibernate/role/insertRoleNameAndPermissionNameList?roleName=' + this.name + '&permissionNameList=' + this.select,
        })
          .then((res) => {
            console.log(res);
            for(let i=0;i<this.select.length;i++){
              let temp = {'permissionName':this.select[i]}
              this.gridData.push(temp);
            }
            console.log(this.select)
            console.log(this.gridData)
            this.authVisible = false;
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      deleteAuth(index,row) {
        console.log(this.name);
        this.$confirm('是否要移除该权限?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'get',
            url: 'api/hibernate/role/deleteByRoleNameAndPermissionName?roleName='+this.name+'&permissionName='+row.permissionName,
          })
            .then((res) => {
              console.log(res);
              this.$delete(this.gridData,index);
              console.log(this.gridData)
            })
            .catch(function (error) {
              console.log(error);
            })
        });
      },
      refresh(name){
        this.$http({
          method: 'get',
          url: 'api/hibernate/role/findPermissionNameByRoleName?roleName=' + name,
        })
          .then((res) => {
            console.log(res, 'res')
            this.gridData.set()
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      addRole() {
        this.roleVisible = true;
      },
      get1() {
        this.$http({
          method: 'get',
          url: 'api/hibernate/role/findAllRole',
        })
          .then((res) => {
            console.log(res);
            this.allList = res.data;   //第二个data是后端传递的数组名，可能需要修改
            this.changeList();
          })
          .catch(function (error) {
            console.log(error);
          })
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
      handleCurrentChange() {            //改变当前页码后需要展示的目录信息的变化
        this.changeList();
      },
      handleAdmin(row) {
        this.name = row.roleName || this.name;
        console.log('row', this.name);
        this.$http({
          method: 'get',
          url: 'api/hibernate/role/findPermissionNameByRoleName?roleName=' + row.roleName,
        })
          .then((res) => {
            console.log(res, 'res')
            this.gridData = res.data;
            this.detailVisible = true;
          })
          .catch(function (error) {
            console.log(error);
          })

      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row.roleName)
          this.$http({
            method: 'post',
            url: 'api/hibernate/role/delete?roleName='+row.roleName,
          })
            .then((res) => {
              console.log(res);
              this.get1();
            })
            .catch(function (error) {
              console.log(error);
            })
        });
      },
      deleteDir(ids) {
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          deleteDir(params).then(response => {
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            });
            this.changeList();
          });
        })
      },
      handleChange(index, row) {
        this.index = index;
        this.$router.push({path: '/authority/detail', query: this.list[index]});
      },
      change1() {
        console.log(this.authName);
        this.$http({
          method: 'post',
          url: 'api/hibernate/role/insertRoleNameAndPermissionNameList?roleName=' + this.form.name + '&permissionNameList=' + this.authName,
        })
          .then((res) => {
            console.log(res);
            this.get1();
            this.roleVisible = false;
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      changeRole() {
        let postData = {'roleName': this.form.name, 'description': this.form.name};
        console.log(postData)
        this.$http({
          method: 'post',
          url: 'api/hibernate/role/insert',
          data: postData,
        })
          .then((res) => {
            console.log(res);
            this.change1();
          })
          .catch(function (error) {
            console.log(error);
          })
        // this.roleVisible = false;
      }
    }
  }
</script>
<style scoped>
  .dialog-title {
    text-align: center;
  }
</style>
