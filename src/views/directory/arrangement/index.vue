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
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.$index, scope.row)" type="primary">查看详情</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" v-show="scope.row.status==='0'" type="danger">删除平台</el-button>
            <el-button size="mini" @click="handleChange(scope.$index, scope.row)" v-show="scope.row.status==='1'" type="primary">编辑平台</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="'目录编号' + changeData.id" :visible.sync="dialogFormVisible" class="dialog-title" width="600px">
        <el-form :model="changeData" label-width="80px">
          <el-form-item label="平台名称">
            <el-input v-model="changeData.name"></el-input>
          </el-form-item>
          <el-form-item label="平台ip">
            <el-input v-model="changeData.ip"></el-input>
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
        allList: [            //获取的所有的目录信息数组
          {
          id:'1',
          name:'物联网平台1',
          ip:'192.168.1.1',
          time:'2019-11-12',
          dir: [
            { id: '1', resourceType: '视频', dirName: '蜘蛛侠1.mp4', status: '0' },
            { id: '2', resourceType: '视频', dirName: '蜘蛛侠2.mp4', status: '0' },
            { id: '3', resourceType: '视频', dirName: '蜘蛛侠3.mp4', status: '1' },
            { id: '4', resourceType: '音频', dirName: '稻香.mp3', status: '1' },
            { id: '5', resourceType: '音频', dirName: '告白气球.mp3', status: '1' },
            { id: '6', resourceType: '音频', dirName: '晴天.mp3', status: '0' },
            { id: '7', resourceType: '音频', dirName: '一路向北.mp3', status: '0' },
            { id: '8', resourceType: '文档', dirName: '作业.txt', status: '0' },
            { id: '9', resourceType: '文档', dirName: '书籍.txt', status: '0'},
            { id: '10', resourceType: '文档', dirName: '说明书.txt', status: '0' },
            { id: '11', resourceType: '图片', dirName: '图片1.jpg', status: '0' },
            { id: '12', resourceType: '图片', dirName: '图片2.jpg', status: '0' },
            { id: '13', resourceType: '图片', dirName: '图片3.jpg', status: '0' },
          ],
          status: '1'
          },
          {
            id:'2',
            name:'物联网平台2',
            ip:'192.168.1.2',
            time:'2019-11-12',
            dir: [
              { id: '1', resourceType: '视频', dirName: '美国队长1.mp4', status: '0' },
              { id: '2', resourceType: '视频', dirName: '美国队长2.mp4', status: '0' },
              { id: '3', resourceType: '视频', dirName: '美国队长3.mp4', status: '1' },
              { id: '4', resourceType: '音频', dirName: '稻香.mp3', status: '0' },
              { id: '5', resourceType: '音频', dirName: '告白气球.mp3', status: '0' },
              { id: '6', resourceType: '音频', dirName: '晴天.mp3', status: '0' },
              { id: '7', resourceType: '音频', dirName: '一路向北.mp3', status: '0' },
              { id: '8', resourceType: '文档', dirName: '作业.txt', status: '0' },
              { id: '9', resourceType: '文档', dirName: '书籍.txt', status: '0' },
              { id: '10', resourceType: '文档', dirName: '说明书.txt', status: '1' },
              { id: '11', resourceType: '图片', dirName: '图片1.jpg', status: '1' },
              { id: '12', resourceType: '图片', dirName: '图片2.jpg', status: '0' },
              { id: '13', resourceType: '图片', dirName: '图片3.jpg', status: '0' },
            ],
            status: '0'
          },
          {
            id:'3',
            name:'物联网平台3',
            ip:'192.168.1.3',
            time:'2019-11-13',
            dir: [
              { id: '1', resourceType: '视频', dirName: '雷神1.mp4', status: '0' },
              { id: '2', resourceType: '视频', dirName: '雷神2.mp4', status: '0' },
              { id: '3', resourceType: '视频', dirName: '雷神3.mp4', status: '0' },
              { id: '4', resourceType: '音频', dirName: '稻香.mp3', status: '1' },
              { id: '5', resourceType: '音频', dirName: '告白气球.mp3', status: '0' },
              { id: '6', resourceType: '音频', dirName: '晴天.mp3', status: '0' },
              { id: '7', resourceType: '音频', dirName: '一路向北.mp3', status: '0' },
              { id: '8', resourceType: '文档', dirName: '作业.txt', status: '1' },
              { id: '9', resourceType: '文档', dirName: '书籍.txt', status: '0' },
              { id: '10', resourceType: '文档', dirName: '说明书.txt', status: '1' },
              { id: '11', resourceType: '图片', dirName: '图片1.jpg', status: '0' },
              { id: '12', resourceType: '图片', dirName: '图片2.jpg', status: '0' },
              { id: '13', resourceType: '图片', dirName: '图片3.jpg', status: '1' },
            ],
            status: '0'
          },
          {
            id:'4',
            name:'物联网平台4',
            ip:'192.168.1.4',
            time:'2019-11-13',
            dir: [
              { id: '1', resourceType: '视频', dirName: '复仇者联盟1.mp4', status: '0' },
              { id: '2', resourceType: '视频', dirName: '复仇者联盟2.mp4', status: '1' },
              { id: '3', resourceType: '视频', dirName: '复仇者联盟3.mp4', status: '1' },
              { id: '4', resourceType: '音频', dirName: '稻香.mp3', status: '0' },
              { id: '5', resourceType: '音频', dirName: '告白气球.mp3', status: '0' },
              { id: '6', resourceType: '音频', dirName: '晴天.mp3', status: '0' },
              { id: '7', resourceType: '音频', dirName: '一路向北.mp3', status: '0' },
              { id: '8', resourceType: '文档', dirName: '作业.txt', status: '0' },
              { id: '9', resourceType: '文档', dirName: '书籍.txt', status: '1' },
              { id: '10', resourceType: '文档', dirName: '说明书.txt', status: '0' },
              { id: '11', resourceType: '图片', dirName: '图片1.jpg', status: '0' },
              { id: '12', resourceType: '图片', dirName: '图片2.jpg', status: '0' },
              { id: '13', resourceType: '图片', dirName: '图片3.jpg' ,status: '0' },
              { id: '14', resourceType: '视频', dirName: '复仇者联盟4.mp4', status: '0' },
            ],
            status: '1'
          }
        ],          //截取的当前要展示的目录信息数组
        list: [],
        changeData: {
          id: '',
          ip: '',
          name: ''
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
      handleDetail(index, row){
        this.$router.push({path:'/directory/dirDetail',query: row})
      },
      handleDelete(index, row){
        let ids=[];
        ids.push(row.id);
        this.deleteDir(ids);
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
        this.dialogFormVisible = true;
        this.changeData.id = row.id;
        this.changeData.ip = row.ip;
        this.changeData.name = row.name;
      },
      deleteModify() {
        this.dialogFormVisible = false;
        this.changeData.id = '';
        this.changeData.name = '';
        this.changeData.ip = '';
      },
      confirmModify() {
        this.$confirm('是否要进行该编辑操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dialogFormVisible = false;
          let i = 0;
          for(i=0;i<this.allList.length;i++)
          {
            if(this.allList[i].id === this.changeData.id)
            {
              this.allList[i].name = this.changeData.name;
              this.allList[i].ip = this.changeData.ip;
            }
          }
          this.changeData.id = '';
          this.changeData.name = '';
          this.changeData.ip = '';
        })
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
