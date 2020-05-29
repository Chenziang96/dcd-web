<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>用户列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
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
        <template slot-scope="scope">{{scope.row.isOnline}}</template>
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
  </div>
</template>

<script>
  import eventBus from '@/assets/bus.js';
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
        allList: [            //获取的所有的目录信息数组
          { id: '1', userName: '管理员账号1', platformIp: '192.168.1.1', registerTime:'2019-06-10', roleName:'超级管理员',isOnline:'1'},
          { id: '2', userName: '管理员账号2', platformIp: '192.168.1.2', registerTime:'2019-06-10', roleName:'管理员',isOnline:'0'},
          { id: '3', userName: '管理员账号3', platformIp: '192.168.1.3', registerTime:'2019-06-10', roleName:'管理员',isOnline:'1'},
          { id: '4', userName: '管理员账号4', platformIp: '192.168.1.4', registerTime:'2019-06-10', roleName:'理员',isOnline:'0'},
          { id: '5', userName: '管理员账号5', platformIp: '192.168.1.51', registerTime:'2019-06-10', roleName:'理员',isOnline:'0'},
          { id: '6', userName: '管理员账号6', platformIp: '192.168.1.6', registerTime:'2019-06-10', roleName:'理员',isOnline:'0'},
          { id: '7', userName: '管理员账号7', platformIp: '192.168.1.223', registerTime:'2019-06-10', roleName:'用户',isOnline:'1'},

        ],          //截取的当前要展示的目录信息数组
        list: [],
        changeData: {},
        changeVisible:false,
        changeTempData:[],
        initialData: {},
        operateType: null,
        multipleSelection: [],
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
            value:'用户',
            label:'用户'
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
      // this.getAllList();   //联调时打开
      // this.getSearchList(); //联调时打开
      this.changeList();
    },
    destroyed() {
      console.log('destroyed')
    },
    beforeDestroy() {
      console.log('beforeDestroy')
      eventBus.$emit('auDetail',this.list[this.index]);
    },
    methods:{
      getAllList() {               //获取后端提供的所有目录信息
        this.$http({
          method: 'get',
          url: ''
        })
          .then(function (res) {
            console.log(res);
            this.allList = res.data.data;               //第二个data是后端传递的数组名，可能需要修改
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      getSearchList() {                    //获取满足搜索条件的目录信息的数组
        let i=0;
        for( i=0; i<this.rows; i++ )
        {

        }
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
        this.tempRole = row.userLevel;
        this.index = index;
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
      submitChange(){
        this.changeData[this.index] = this.changeTempData;
        this.changeVisible =false;
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
        eventBus.$emit('auDetail',this.list[index]);
        this.index = index;
        this.$router.push({path:'/authority/detail',query:this.list[index]});

      },
      deleteModify() {
        this.dialogFormVisible = false;
        this.changeData = this.initialData;
      },
      reForm(){
        this.listQuery.createTime='';
        this.listQuery.orderIp='';
        this.listQuery.orderPerson='';
      },
      changeRole(){
        console.log(this.list[this.index]);
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
