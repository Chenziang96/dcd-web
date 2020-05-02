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
          <el-form-item label="目录搜索：">
            <el-input v-model="listQuery.orderDir" class="input-width" placeholder="目录名称"></el-input>
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
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="平台名称" width="180" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="平台IP" width="180" align="center">
          <template slot-scope="scope">{{scope.row.ip }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.time}}</template>
        </el-table-column>
        <el-table-column label="目录信息" width="120" align="center">
          <template slot-scope="scope">{{scope.row.dir}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.$index, scope.row)" type="primary">查看详情</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" v-show="scope.row.status===0" type="danger">删除平台</el-button>
            <el-button size="mini" @click="handleChange(scope.$index, scope.row)" v-show="scope.row.status===1" type="primary">编辑目录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange()"
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
        rows: '',               //总目录信息条数，执行getAllList函数的时候后端会传进来
        pageTotal: 0,          //总页数，执行getAllList函数的时候后端会传进来
        searchList: [],       //执行查询操作后，满足查询条件的所有的目录信息的数组
        allList: [            //获取的所有的目录信息数组
          {
          id:'123',
          name:'物联网平台1',
          ip:'192.168.1.1',
          time:'2019-11-12',
          dir:'123',
          status:1
          },
          {
            id:'124',
            name:'物联网平台2',
            ip:'192.168.1.1',
            time:'2019-11-12',
            dir:'123',
            status:0
          },
          {
            id:'125',
            name:'物联网平台3',
            ip:'192.168.1.1',
            time:'2019-11-12',
            dir:'123',
            status:0
          },
          {
            id:'125',
            name:'物联网平台4',
            ip:'192.168.1.1',
            time:'2019-11-12',
            dir:'123',
            status:1
          },
          {
            id:'123',
            name:'物联网平台5',
            ip:'192.168.1.1',
            time:'2019-11-12',
            dir:'123',
            status:1
          },
          {
            id:'123',
            name:'物联网平台6',
            ip:'192.168.1.1',
            time:'2019-11-12',
            dir:'123',
            status:1
          },
          {
            id:'123',
            name:'物联网平台7',
            ip:'192.168.1.1',
            time:'2019-11-12',
            dir:'123',
            status:1
          },{
            id:'123',
            name:'物联网平台8',
            ip:'192.168.1.1',
            time:'2019-11-12',
            dir:'123',
            status:1
          },{
            id:'123',
            name:'物联网平台9',
            ip:'192.168.1.1',
            time:'2019-11-12',
            dir:'123',
            status:1
          },{
            id:'123',
            name:'物联网平台10',
            ip:'192.168.1.1',
            time:'2019-11-12',
            dir:'123',
            status:1
          },{
            id:'123',
            name:'物联网平台11',
            ip:'192.168.1.1',
            time:'2019-11-12',
            dir:'123',
            status:1
          },{
            id:'123',
            name:'物联网平台12',
            ip:'192.168.1.1',
            time:'2019-11-12',
            dir:'123',
            status:1
          }
          ],          //截取的当前要展示的目录信息数组
        list: [],
        operateType: null,
        multipleSelection: [],
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
          this.rows = res.data.rows;                  //后面的rows是后端传递的总目录信息条数，可能需要修改
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
      handleSizeChange() {            //改变当前页需要展示的目录信息条数后的目录信息的变化
        this.listQuery.pageNum = 1;
        this.changeList();
      },
      handleCurrentChange() {            //改变当前页码后需要展示的目录信息的变化
        this.changeList();
      },
      handleDetail(){

      },
      handleDelete(){

      },
      handleChange(){

      },
      reForm(){
        this.listQuery.createTime='';
        this.listQuery.orderIp='';
        this.listQuery.orderDir='';
        this.listQuery.orderPerson='';
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>
