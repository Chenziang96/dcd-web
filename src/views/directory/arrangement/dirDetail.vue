<template>
  <div class="app-container">
    <el-page-header @back="goBack" :content="platform.platformName + '(目录详情)'">
    </el-page-header>
    <el-card class="operate-container" shadow="never">
      <el-row>
        <el-col :span="22">
          <el-select v-model="value" clearable placeholder="请选择" @change="selectChange()">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" class="pull-right" @click="handleAdd">新增目录</el-button>
        </el-col>
      </el-row>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column type="selection" width="60" align="center">
        </el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="资源类型" width="180" align="center">
          <template slot-scope="scope">{{scope.row.resourceType}}</template>
        </el-table-column>
        <el-table-column label="安全等级" width="180" align="center">
          <template slot-scope="scope">{{scope.row.safetyLevel }}</template>
        </el-table-column>
        <el-table-column label="目录名称" align="center">
          <template slot-scope="scope">{{scope.row.resourceName }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.$index, scope.row)" type="text">查看详情</el-button>
            <el-button size="mini" @click="handleChange(scope.$index, scope.row)" v-show="1" type="text">编辑目录</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" v-show="1" type="text">删除目录</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--查看目录详情dialog-->
      <el-dialog title="目录详情" :visible.sync="dialogTableVisible" align="center" width="800px">
        <div class="form-container-border">
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-medium">平台编号</el-col>
            <el-col class="form-border font-medium" :span="18">{{dirDetailData.id}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-medium">平台名称</el-col>
            <el-col class="form-border font-medium" :span="18">{{dirDetailData.platformName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-medium">平台ip</el-col>
            <el-col class="form-border font-medium" :span="18">{{dirDetailData.platformIp}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-medium">资源类型</el-col>
            <el-col class="form-border font-medium" :span="18">{{dirDetailData.resourceType}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-medium">目录名称</el-col>
            <el-col class="form-border font-medium" :span="18">{{dirDetailData.resourceName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-medium">权限等级</el-col>
            <el-col class="form-border font-medium" :span="18">{{dirDetailData.safetyLevel}}</el-col>
          </el-row>
        </div>
      </el-dialog>

      <!--编辑目录dialog-->
      <el-dialog title="编辑目录" :visible.sync="dialogFormVisible" class="dialog-title" width="600px">
        <el-form :model="dirChangeData" label-width="80px">
          <el-form-item label="资源类型">
            <el-input v-model="dirChangeData.resourceType"></el-input>
          </el-form-item>
          <el-form-item label="目录名称">
            <el-input v-model="dirChangeData.resourceName"></el-input>
          </el-form-item>
          <el-form-item label="安全等级">
            <el-input v-model="dirChangeData.safetyLevel"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dirDeleteModify">取 消</el-button>
          <el-button type="danger" @click="dirConfirmModify">确 定</el-button>
        </div>
      </el-dialog>

      <!--新增目录dialog-->
      <el-dialog title="新增目录" class="dialog-title" width="600px" :visible.sync="dialogFormVisible2">
        <el-form :model="dirAddData" label-width="80px">
          <el-form-item label="资源类型">
            <el-select v-model="dirAddData.resourceType" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目录名称">
            <el-input v-model="dirAddData.resourceName"></el-input>
          </el-form-item>
          <el-form-item label="安全等级">
            <el-input v-model="dirAddData.safetyLevel"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dirDeleteAdd">取 消</el-button>
          <el-button type="danger" @click="dirConfirmAdd">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--分页-->
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
    name: "dirDetail",
    data() {
      return {
        options: [{
          value: '视频',
          label: '视频'
        }, {
          value: '音频',
          label: '音频'
        }, {
          value: '文档',
          label: '文档'
        }, {
          value: '图片',
          label: '图片'
        }],
        value: '',
        index: 0,
        listQuery: Object.assign({}, defaultListQuery),
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dirDetailData: {},
        dirChangeData: {
          platformName: '',
          platformIp: '',
          resourceType: '',
          resourceName: '',
          safetyLevel: '',
        },
        dirAddData: {
          platformName: '',
          platformIp: '',
          resourceType: '',
          resourceName: '',
          safetyLevel: '',
        },
        platform: {},
        dirList: [],
        selectList: [],
        list: [],
        pageTotal: 0,          //总条数
      }
    },
    created() {
      this.platform = this.$route.query;
      this.dirList = this.platform.dir;
      this.selectList = this.dirList;
      this.getAllList();
    },
    methods: {
      getAllList() {               //获取后端提供的所有目录信息
        let that = this;
        console.log(this.platform.platformIp)
        this.$http({
          method: 'get',
          url: '/api/requestfilter/directory/findByPlatformIp?dstIp=' + this.platform.platformIp + '&userName=seu',
        })
          .then(function (res) {
            console.log(res);
            that.selectList = res.data;               //第二个data是后端传递的数组名，可能需要修改
            that.getList();
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      getList() {
        this.pageTotal = this.selectList.length;
        this.list = this.selectList.slice(this.listQuery.pageSize * (this.listQuery.pageNum - 1), this.listQuery.pageSize * this.listQuery.pageNum);
      },
      selectChange() {
        if (this.value !== '') {
          let i = 0;
          let j = this.dirList.length;
          this.selectList = [];
          for (i = 0; i < j; i++) {
            if (this.dirList[i].resourceType === this.value) {
              this.selectList.push({
                id: this.dirList[i].id,
                resourceType: this.dirList[i].resourceType,
                dirName: this.dirList[i].dirName,
                status: this.dirList[i].status
              });
            }
          }
          this.listQuery.pageNum = 1;
        } else {
          this.selectList = this.dirList;
        }
        this.getList();
      },
      handleSizeChange(val) {            //改变当前页需要展示的目录信息条数后的目录信息的变化
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange() {            //改变当前页码后需要展示的目录信息的变化
        this.getList();
      },
      handleAdd() {
        this.dialogFormVisible2 = true;
        this.dirAddData.platformIp = this.platform.platformIp;
        this.dirAddData.platformName = this.platform.platformName;
        this.index = this.selectList.length;
      },
      dirDeleteAdd() {
        this.dialogFormVisible2 = false;
        this.dirAddData={};
      },
      dirConfirmAdd() {
        this.$confirm('是否要进行该编辑操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleAddSubmit();
          this.dialogFormVisible2 = false;
        });
      },
      handleAddSubmit(){
        let temp = this.dirAddData;
        let that =  this;
        console.log(temp)
        this.$http({
          method: 'post',
          url: '/api/requestfilter/directory/insertDirectory?userName=seu',
          data: temp
        })
          .then(function (res) {
            console.log(res);
            that.$set(that.list,that.index,temp);
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      handleDetail(index, row) {
        this.dialogTableVisible = true;
        this.dirDetailData.id = index + 1;
        this.dirDetailData.platformName = this.platform.platformName;
        this.dirDetailData.platformIp = this.platform.platformIp;
        this.dirDetailData.resourceType = row.resourceType;
        this.dirDetailData.resourceName = row.resourceName;
        this.dirDetailData.safetyLevel = row.safetyLevel;
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleDeleteSubmit(index);
        });
      },
      handleDeleteSubmit(index){
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/requestfilter/directory/deleteByPlatformIpAndResourceName?userName=seu&dstIp='+this.list[index].platformIp+'&resourceName='+this.list[index].resourceName,
        })
          .then(function (res) {
            console.log(res);
            that.$delete(that.list,index);
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      handleChange(index, row) {
        this.index = index;
        this.dialogFormVisible = true;
        this.dirChangeData.id = row.id;
        this.dirChangeData.platformName = this.platform.platformName;
        this.dirChangeData.platformIp = this.platform.platformIp;
        this.dirChangeData.resourceType = row.resourceType;
        this.dirChangeData.resourceName = row.resourceName;
        this.dirChangeData.safetyLevel = row.safetyLevel;
      },
      dirDeleteModify() {
        this.dialogFormVisible = false;
        this.dirChangeData = {};
      },
      dirConfirmModify() {
        this.$confirm('是否要进行该编辑操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleChangeSubmit();


        });
      },
      handleChangeSubmit() {
        let temp = this.dirChangeData;
        console.log(temp);
        let that = this;
        this.$http({
          method: 'post',
          //这里的url是写死的状态，后面的userName=seu，最后需要修改成动态的获取userName=  ***
          url: '/api/requestfilter/directory/updateDirectory?userName=seu',
          data: temp,
        })
          .then(function (res) {
            console.log(res);
            that.dialogFormVisible = false;
            that.$router.go(0);
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      goBack() {
        this.$router.push('/directory/arrange');
      }
    }
  }
</script>

<style scoped>
  .form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    height: 40px;
  }

  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
    margin-top: 15px;
    text-align: center;
  }

  .form-left-bg {
    background: #F2F6FC;
  }

  .pull-right {
    float: right;
  }
</style>
