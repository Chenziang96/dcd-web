<template>
  <div class="app-container">
    <el-page-header @back="goBack" :content="platform.name + '(目录详情)'">
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
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="资源类型" width="180" align="center">
          <template slot-scope="scope">{{scope.row.resourceType}}</template>
        </el-table-column>
        <el-table-column label="目录名称" align="center">
          <template slot-scope="scope">{{scope.row.dirName }}</template>
        </el-table-column>d
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.$index, scope.row)" type="primary">查看详情</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" v-show="scope.row.status==='1'" type="danger">删除目录</el-button>
            <el-button size="mini" @click="handleChange(scope.$index, scope.row)" v-show="scope.row.status==='0'" type="primary">编辑目录</el-button>
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
            <el-col class="form-border font-medium" :span="18">{{dirDetailData.name}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-medium">平台ip</el-col>
            <el-col class="form-border font-medium" :span="18">{{dirDetailData.ip}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-medium">资源类型</el-col>
            <el-col class="form-border font-medium" :span="18">{{dirDetailData.resourceType}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-medium">目录名称</el-col>
            <el-col class="form-border font-medium" :span="18">{{dirDetailData.dirName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-medium">目录权限</el-col>
            <el-col class="form-border font-medium" :span="18">{{dirDetailData.status}}</el-col>
          </el-row>
        </div>
      </el-dialog>

      <!--编辑目录dialog-->
      <el-dialog :title="'目录编号' + dirChangeData.id" :visible.sync="dialogFormVisible" class="dialog-title" width="600px">
        <el-form :model="dirChangeData" label-width="80px">
          <el-form-item label="资源类型">
            <el-input v-model="dirChangeData.resourceType"></el-input>
          </el-form-item>
          <el-form-item label="目录名称">
            <el-input v-model="dirChangeData.dirName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dirDeleteModify">取 消</el-button>
          <el-button type="danger" @click="dirConfirmModify">确 定</el-button>
        </div>
      </el-dialog>

      <!--新增目录dialog-->
      <el-dialog :title="'新增目录' + dirAddData.id" :visible.sync="dialogFormVisible2" class="dialog-title" width="600px">
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
            <el-input v-model="dirAddData.dirName"></el-input>
          </el-form-item>
          <el-form-item label="操作权限">
            <el-input v-model="dirAddData.status"></el-input>
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
            listQuery: Object.assign({}, defaultListQuery),
            dialogTableVisible: false,
            dialogFormVisible: false,
            dialogFormVisible2: false,
            dirDetailData: {},
            dirChangeData: {
              id: '',
              resourceType: '',
              dirName: ''
            },
            dirAddData: {
              id: '',
              resourceType: '',
              dirName: '',
              status: ''
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
          this.getList();
        },
        methods: {
          getList() {
            this.pageTotal = this.selectList.length;
            this.list = this.selectList.slice(this.listQuery.pageSize*(this.listQuery.pageNum-1),this.listQuery.pageSize*this.listQuery.pageNum);
          },
          selectChange() {
            if(this.value !== '')
            {
              let i = 0;
              let j = this.dirList.length;
              this.selectList= [];
              for(i = 0; i < j; i++)
              {
                if(this.dirList[i].resourceType === this.value)
                {
                  this.selectList.push({
                    id: this.dirList[i].id,
                    resourceType: this.dirList[i].resourceType,
                    dirName: this.dirList[i].dirName,
                    status: this.dirList[i].status
                  });
                }
              }
              this.listQuery.pageNum = 1;
            }else
            {
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
            this.dirAddData.id = this.dirList.length + 1;
          },
          dirDeleteAdd() {
            this.dialogFormVisible2 = false;
            this.dirAddData.id = '';
            this.dirAddData.resourceType = '';
            this.dirAddData.dirName = '';
            this.dirAddData.status = '';
          },
          dirConfirmAdd() {
            this.dialogFormVisible2 = false;
            this.dirList.push({
              id: this.dirAddData.id,
              resourceType: this.dirAddData.resourceType,
              dirName: this.dirAddData.dirName,
              status: this.dirAddData.status
            });
            this.dirAddData.id = '';
            this.dirAddData.resourceType = '';
            this.dirAddData.dirName = '';
            this.dirAddData.status = '';
            this.selectChange();
            this.getList();
          },
          handleDetail(index, row) {
            this.dialogTableVisible = true;
            this.dirDetailData.id = this.platform.id;
            this.dirDetailData.name = this.platform.name;
            this.dirDetailData.ip = this.platform.ip;
            this.dirDetailData.resourceType = row.resourceType;
            this.dirDetailData.dirName = row.dirName;
            this.dirDetailData.status = row.status;
          },
          handleDelete(index,row) {
            const index1 = index+this.listQuery.pageSize*(this.listQuery.pageNum-1);
            if (index1 !== -1) {
              this.dirList.splice(index1, 1);
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              let i = 0;
              for(i=0;i<this.dirList.length;i++)
              {
                if(this.dirList[i].id>index1+1)
                {
                  this.dirList[i].id=this.dirList[i].id-1;
                }
              }
              this.selectChange();
              this.getList();
            }
          },
          handleChange(index, row) {
            this.dialogFormVisible = true;
            this.dirChangeData.id = row.id;
            this.dirChangeData.resourceType = row.resourceType;
            this.dirChangeData.dirName = row.dirName;
          },
          dirDeleteModify() {
            this.dialogFormVisible = false;
            this.dirChangeData.id = '';
            this.dirChangeData.resourceType = '';
            this.dirChangeData.dirName = '';
          },
          dirConfirmModify() {
            this.$confirm('是否要进行该编辑操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.dialogFormVisible = false;
              let i = 0;
              for(i=0;i<this.dirList.length;i++)
              {
                if(this.dirList[i].id === this.dirChangeData.id)
                {
                  this.dirList[i].resourceType = this.dirChangeData.resourceType;
                  this.dirList[i].dirName = this.dirChangeData.dirName;
                }
              }
              this.dirChangeData.id = '';
              this.dirChangeData.resourceType = '';
              this.dirChangeData.dirName = '';
              this.selectChange();
              this.getList();
            });
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
