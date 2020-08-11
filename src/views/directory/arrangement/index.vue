<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="" size="small">查询搜索</el-button>
        <el-button style="float:right;margin-right: 15px" @click="reForm" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="I P搜索：">
            <el-input v-model="listQuery.orderIp" class="input-width" placeholder="平台IP地址"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker class="input-width" v-model="listQuery.createTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="作者搜索：">
            <el-input v-model="listQuery.orderPerson" class="input-width" placeholder="作者姓名"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column type="selection" width="60" align="center">
        </el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="平台名称" width="180" align="center">
          <template slot-scope="scope">{{scope.row.platformName}}</template>
        </el-table-column>
        <el-table-column label="平台IP" width="180" align="center">
          <template slot-scope="scope">{{scope.row.platformIp }}</template>
        </el-table-column>
        <el-table-column label="系统类型" width="180" align="center">
          <template slot-scope="scope">{{scope.row.os}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.registerTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.$index, scope.row)" type="text">查看详情</el-button>
            <el-button size="mini" @click="handleChange(scope.$index, scope.row)" v-show="1" type="text">编辑平台</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" v-show="1" type="text">删除平台</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="修改信息" :visible.sync="dialogFormVisible" class="dialog-title" width="600px">
        <el-form :model="changeData" label-width="80px">
          <el-form-item label="平台名称">
            <el-input v-model="changeData.platformName"></el-input>
          </el-form-item>
          <el-form-item label="平台ip">
            <el-input v-model="changeData.platformIp"></el-input>
          </el-form-item>
          <el-form-item label="系统类型">
            <el-input v-model="changeData.os"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="deleteModify">取 消</el-button>
          <el-button type="danger" @click="confirmModify">确 定</el-button>
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
    components:{},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: false,
        selectProductCateValue: null,
        dialogFormVisible: false,
        pageTotal: 0,          //总条数
        searchList: [],       //执行查询操作后，满足查询条件的所有的目录信息的数组
        allList: [],     //获取的所有的目录信息数组
        list: [],
        changeData: {
          platformName: '',
          platformIp: '',
          os: ''
        },
        operateType: null,
        multipleSelection: [],
        closeOrder:{
          dialogVisible:false,
          content:null,
          orderIds:[]
        },
      }
    },
    mounted() {
      this.getAllList();   //联调时打开
      // this.getSearchList(); //联调时打开
    },
    methods:{
      getAllList() {               //获取后端提供的所有目录信息
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/requestfilter/device/getDeviceAll?userName=seu'
        })
        .then(function (res) {
          console.log(res);
          that.allList = res.data;               //第二个data是后端传递的数组名，可能需要修改
          that.changeList();
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
        console.log(this.list);
      },
      handleSizeChange(val) {            //改变当前页需要展示的目录信息条数后的目录信息的变化
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.changeList();
      },
      handleCurrentChange() {            //改变当前页码后需要展示的目录信息的变化
        this.changeList();
      },
      handleDetail(index, row){
        this.$router.push({path:'/directory/dirDetail',query: row})
      },
      handleDelete(index, row){
        console.log(row.platformIp);
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/requestfilter/device/deleteDevice?platformIp='+row.platformIp,
        })
          .then(function (res) {
            console.log(res);
            that.$delete(that.list,index);
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      deleteDir(ids){
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.deleteSubmit();
        })
      },
      deleteSubmit(){

      },
      handleChange(index, row){
        this.dialogFormVisible = true;
        this.changeData.os = row.os;
        this.changeData.platformIp = row.platformIp;
        this.changeData.platformName = row.platformName;
      },
      deleteModify() {
        this.dialogFormVisible = false;
        this.changeData.os = '';
        this.changeData.platformIp = '';
        this.changeData.platformName = '';
      },
      confirmModify() {
        let temp  = this.changeData;
        console.log(temp);
        this.$confirm('是否要进行该编辑操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'post',
            url: '/api/requestfilter/device/updateDevice',
            data: temp,
          })
            .then(function (res) {
              console.log(res);
            })
            .catch(function (error) {
              console.log(error);
            })
        })
      },
      changeForm(){

      },
      reForm(){
        this.listQuery.createTime='';
        this.listQuery.orderIp='';
        this.listQuery.orderPerson='';
      }
    }
  }
</script>
<style scoped>
  .dialog-title {
    text-align: center;
  }


</style>
