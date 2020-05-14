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
          <template slot-scope="scope">{{scope.row.countName}}</template>
        </el-table-column>
        <el-table-column label="平台名称" width="180" align="center">
          <template slot-scope="scope">{{scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="提交时间" align="center">
          <template slot-scope="scope">{{scope.row.time}}</template>
        </el-table-column>
        <el-table-column label="权限等级" align="center">
          <template slot-scope="scope">{{scope.row.authorityLevel}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleAdmin(scope.$index, scope.row)" type="text">分配权限</el-button>
            <el-button size="mini" @click="handleChange(scope.$index, scope.row)" type="text">编辑</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="'分配角色'" :visible.sync="adminVisible" >
        <div  class="dialog-body" style="overflow: hidden">
          <el-select v-model="tempRole" style="float: left;width: 60%;" :placeholder="tempRole">
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
    <el-dialog title="编辑用户" :visible.sync="changeVisible" >
      <div>
      <el-form :model="changeTempData" ref="adminForm" label-width="150px" size="small" >
        <el-form-item label="帐号名称:">
          <el-input v-model="changeTempData.countName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="平台名称:">
          <el-input v-model="changeTempData.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="提交时间:">
          <el-input v-model="changeTempData.time" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="权限等级:">
          <el-input v-model="changeTempData.authorityLevel"  style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitChange()" size="small">确 定</el-button>
      </span>
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
          { id: '1', countName: '管理员账号1', name: '无平台', time:'2019-06-10', authorityLevel:'超级管理员'},
          { id: '2', countName: '管理员账号2', name: '无平台', time:'2019-07-10', authorityLevel:'管理员'},
          { id: '3', countName: '物联网平台1', name: '智慧交通平台', time:'2019-08-10', authorityLevel:'用户'},
          { id: '4', countName: '管理员账号2', name: '智慧医疗平台', time:'2019-09-10', authorityLevel:'用户'},
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
      }
    },
    created() {
      // this.getAllList();   //联调时打开
      // this.getSearchList(); //联调时打开
      this.changeList();
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
        this.tempRole = row.authorityLevel;
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
        this.changeVisible = true;
        this.index = index;
        this.changeTempData = row;
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
        this.list[this.index].authorityLevel = this.tempRole;
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
