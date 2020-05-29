<template>
  <div class="app-container">
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
      </el-row>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column type="selection" width="60" align="center">
        </el-table-column>
        <el-table-column label="信号类型" width="200" align="center">
          <template slot-scope="scope">{{scope.row.type }}</template>
        </el-table-column>
        <el-table-column label="时间" width="200" align="center">
          <template slot-scope="scope">{{scope.row.time}}</template>
        </el-table-column>
        <el-table-column label="原平台" width="200" align="center">
          <template slot-scope="scope">{{scope.row.originalPlatform}}</template>
        </el-table-column>
        <el-table-column label="目的平台" width="200" align="center">
          <template slot-scope="scope">{{scope.row.destinationPlatform}}</template>
        </el-table-column>
        <el-table-column label="资源类型" width="200" align="center">
          <template slot-scope="scope">{{scope.row.resourceType}}</template>
        </el-table-column>
        <el-table-column label="目录名称" align="center">
          <template slot-scope="scope">{{scope.row.dirName }}</template>
        </el-table-column>
        <el-table-column label="状态" width="200" align="center">
          <template slot-scope="scope">
            <el-tag size="medium" type="success" v-show="scope.row.status==='0'">已处理</el-tag>
            <el-tag size="medium" type="warning" v-show="scope.row.status==='1'">未处理</el-tag>
            <el-tag size="medium" type="danger" v-show="scope.row.status==='2'">拒绝受理</el-tag>
          </template>
        </el-table-column>
      </el-table>
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
        name: "index",
        data() {
          return {
            options: [{
              value: '数据请求',
              label: '数据请求'
            }, {
              value: '数据传输',
              label: '数据传输'
            }],
            value: '',
            listQuery: Object.assign({}, defaultListQuery),
            request: [
              { time: '2020-01-01', originalPlatform: '物联网平台1', destinationPlatform: '物联网平台2',
                resourceType: '视频', dirName: '美国队长1.mp4', type: '数据请求', status: '0' },
              { time: '2020-02-07', originalPlatform: '物联网平台1', destinationPlatform: '物联网平台3',
                resourceType: '视频', dirName: '雷神2.mp4', type: '数据请求', status: '0' },
              { time: '2020-03-29', originalPlatform: '物联网平台2', destinationPlatform: '物联网平台3',
                resourceType: '音频', dirName: '告白气球.mp3', type: '数据请求', status: '1' },
              { time: '2020-04-25', originalPlatform: '物联网平台2', destinationPlatform: '物联网平台4',
                resourceType: '图片', dirName: '图片1.jpg', type: '数据请求', status: '2' },
              { time: '2020-05-05', originalPlatform: '物联网平台3', destinationPlatform: '物联网平台4',
                resourceType: '图片', dirName: '图片2.jpg', type: '数据请求', status: '2' },
              { time: '2020-05-22', originalPlatform: '物联网平台4', destinationPlatform: '物联网平台1',
                resourceType: '文档', dirName: '作业.txt', type: '数据请求', status: '1' }
            ],
            allList: [],
            selectList: [],
            list: [],
            pageTotal: 0,
            dialogTableVisible: false,
            dirDetailData: {},
          }
        },
        created() {
          this.allList = this.request;
          this.selectList = this.allList;
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
              let j = this.allList.length;
              this.selectList= [];
              for(i = 0; i < j; i++)
              {
                if(this.allList[i].type === this.value)
                {
                  this.selectList.push({
                    time: this.allList[i].time,
                    originalPlatform: this.allList[i].originalPlatform,
                    destinationPlatform: this.allList[i].destinationPlatform,
                    resourceType: this.allList[i].resourceType,
                    dirName: this.allList[i].dirName,
                    type: this.allList[i].type,
                    status: this.allList[i].status
                  });
                }
              }
              this.listQuery.pageNum = 1;
            }else
            {
              this.selectList = this.allList;
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
