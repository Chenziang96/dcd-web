<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>用户列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="账号名称" width="180" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="平台名称" width="180" align="center">
          <template slot-scope="scope">{{scope.row.platformIp }}</template>
        </el-table-column>
        <el-table-column label="提交时间" align="center">
          <template slot-scope="scope">{{scope.row.registerTime}}</template>
        </el-table-column>
        <el-table-column label="账户角色" align="center">
          <template slot-scope="scope">{{scope.row.roleName}}</template>
        </el-table-column>
        <el-table-column label="是否在线" align="center">
          <template slot-scope="scope">{{scope.row.onLine}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleAdmin(scope.$index, scope.row)" type="text">分配角色</el-button>
            <el-button size="mini" @click="handleChange(scope.$index, scope.row)" type="text">权限详情</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="'分配角色'" :visible.sync="adminVisible" class="dialog-title" width="700px">
        <div  class="dialog-body" style="overflow: hidden">
          <el-select v-model="tempRole" style="width: 60%;" :placeholder="tempRole">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="adminVisible = false" >取 消</el-button>
          <el-button type="primary" @click="changeRole">确 定</el-button>
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
    <el-dialog title="权限详情" :visible.sync="detailVisible">
      <el-table ref="orderTable" :data="gridData" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="权限名称" align="center">
          <template slot-scope="scope">{{scope.row.permissionName}}</template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="detailVisible = false">确定</el-button>
      </div>
    </el-dialog>
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
        selectProductCateValue: null,
        adminVisible: false,
        pageTotal: 0,          //总条数
        searchList: [],       //执行查询操作后，满足查询条件的所有的目录信息的数组
        allList: [],          //截取的当前要展示的目录信息数组
        list: [],
        changeData: {},
        gridData: [],
        detailVisible: false,
        changeVisible:false,
        changeTempData:[],
        initialData: {},
        operateType: null,
        multipleSelection: [],
        row:[],
        tempRole:'', //暂存权限
        index:0, //表单中用到的数组目录
        roleOptions:[
          {
            value:'超级管理员',
            label:'超级管理员'
          },
          {
            value:'管理员',
            label:'管理员'
          },
          {
            value:'普通用户',
            label:'普通用户'
          },
        ],
        closeOrder:{
          dialogVisible:false,
          content:null,
          orderIds:[]
        },
        index : 0,
      }
    },
    created() {
      this.get1();
    },
    beforeDestroy() {
      eventBus.$emit('auDetail',this.list[this.index]);
    },
    methods:{
      get1(){
        this.$http({
          method: 'get',
          url: 'api/user/list',
        })
          .then((res)=> {
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
      handleAdmin(index, row){
        this.adminVisible = true;
        this.row = row;
      },
      handleDelete(index, row){
        this.$confirm('是否要删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
      },
      deleteDir(ids){
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids",ids);
          deleteDir(params).then(response=>{
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            });
            this.changeList();
          });
        })
      },
      handleChange(index, row){
        this.index = index;
        // this.$router.push({path:'/authority/detail',query:this.list[index]});
        this.detailVisible=true;
        this.name = row.roleName || this.name;
        console.log('row', this.name);
        this.$http({
          method: 'get',
          url: 'api/hibernate/role/findPermissionNameByRoleName?roleName=' + row.roleName,
        })
          .then((res) => {
            console.log(res, 'res');
            this.gridData = res.data;
            this.detailVisible = true;
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      changeRole(){
        this.$http({
          method: 'post',
          url: 'api/user/insertUserNameAndRoleName?userName='+this.row.userName+'&roleName='+this.tempRole,
          //后缀：userName=  告诉a后端是哪个用户   roleName=  告诉后端角色分配的修改后的结果
        })
          .then((res)=> {
            console.log(res);
            this.get1();
          })
          .catch(function (error) {
            console.log(error);
          });
        this.list[this.index].userLevel = this.tempRole;
        this.adminVisible = false;
      }
    }
  }
</script>
<style scoped>
  .dialog-title {
    text-align: center;
  }
</style>
