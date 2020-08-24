<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-zoom-in"></i>
      <el-select v-model="value" placeholder="请选择" @change="selectChange()">
        <el-option
          v-for="item in options"
          :key="item.index"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.time}}</template>
        </el-table-column>
        <el-table-column label="用户名" width="180" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="原平台" width="180" align="center">
          <template slot-scope="scope">{{scope.row.originalPlatform}}</template>
        </el-table-column>
        <el-table-column label="目的平台" width="180" align="center">
          <template slot-scope="scope">{{scope.row.destinationPlatform}}</template>
        </el-table-column>
        <el-table-column label="资源类型" width="180" align="center">
          <template slot-scope="scope">{{scope.row.resourceType}}</template>
        </el-table-column>
        <el-table-column label="目录名称" align="center">
          <template slot-scope="scope">{{scope.row.dirName }}</template>
        </el-table-column>
        <el-table-column label="状态" width="180" align="center">
          <template slot-scope="scope">
            <i class="el-icon-error" v-show="scope.row.status===-1"></i>
            <i class="el-icon-question" v-show="scope.row.status===0"></i>
            <i class="el-icon-success" v-show="scope.row.status===1"></i>
            <el-tag size="medium" type="danger" v-show="scope.row.status===-1">处理失败</el-tag>
            <el-tag size="medium" type="warning" v-show="scope.row.status===0">正在处理</el-tag>
            <el-tag size="medium" type="success" v-show="scope.row.status===1">处理成功</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.$index, scope.row)" type="text">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="请求处理详情" :visible.sync="dialogTableVisible" align="center" width="800px">
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(flag, index) in flag"
            :key="index"
            :type="flag.type"
            :timestamp="flag.timestamp">
            {{flag.content}}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

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
            listQuery: Object.assign({}, defaultListQuery),
            request: [
              { time: "2020-8-20", userName: "用户a", originalPlatform: "物联网平台1", destinationPlatform: "物联网平台2",
                resourceType: "图片", dirName: "图片1", status: 0,
                data:[
                  { content: '请求符合权限', timestamp: '2020-8-20 18:00', type: 'success'},
                  { content: '请求成功发送至目的平台', timestamp: '2020-8-20 18:15', type: 'success' },
                  { content: '成功接收到目的平台的数据', timestamp: '2020-8-20 18:30', type: 'success' },
                  { content: '数据过滤成功', timestamp: '2020-8-20 18:40', type: 'success' },
                  { content: '发送失败，未能将数据发送到原平台', timestamp: '2018-8-20 18:46', type: 'danger' }
                ]
              },
              { time: "2020-8-20", userName: "用户c", originalPlatform: "物联网平台4", destinationPlatform: "物联网平台2",
                resourceType: "图片", dirName: "图片5", status: 1,
                data:[
                  { content: '请求符合权限', timestamp: '2020-8-20 20:00', type: 'success'},
                  { content: '请求成功发送至目的平台', timestamp: '2020-8-20 20:15', type: 'success' },
                  { content: '成功接收到目的平台的数据', timestamp: '2020-8-20 20:30', type: 'success' },
                  { content: '数据过滤成功', timestamp: '2020-8-20 20:40', type: 'success' },
                  { content: '成功发送数据到原平台', timestamp: '2020-8-20 20:50', type: 'success' }
                ]
              },
              { time: "2020-8-19", userName: "用户s", originalPlatform: "物联网平台3", destinationPlatform: "物联网平台1",
                resourceType: "视频", dirName: "视频3", status: -1,
                data:[
                  { content: '请求符合权限', timestamp: '2020-8-19 12:00', type: 'success'},
                  { content: '请求成功发送至目的平台', timestamp: '2020-8-19 12:15', type: 'success' },
                  { content: '成功接收到目的平台的数据', timestamp: '2020-8-19 12:30', type: 'success' },
                  { content: '数据过滤失败', timestamp: '2020-8-19 12:40', type: 'danger' }
                ]
              },
              { time: "2020-8-19", userName: "用户b", originalPlatform: "物联网平台2", destinationPlatform: "物联网平台3",
                resourceType: "文档", dirName: "文档2", status: -1,
                data:[
                  { content: '请求符合权限', timestamp: '2020-8-19 9:00', type: 'success'},
                  { content: '请求成功发送至目的平台', timestamp: '2020-8-19 9:15', type: 'success' },
                  { content: '成功接收到目的平台的数据', timestamp: '2020-8-19 9:20', type: 'success' },
                  { content: '数据过滤成功', timestamp: '2020-8-19 9:30', type: 'success' },
                  { content: '成功发送数据到原平台', timestamp: '2020-8-19 9:45', type: 'success' }
                ]
              },
            ],
            allList: [],
            selectList: [],
            list: [],
            pageTotal: 0,

            //对应的时间筛选框
            options: [ "今日", "三日内", "一周内", "一周外", "全部" ],
            value: '今日',

            //对应详情查看的dialog
            dialogTableVisible: false,
            flag: [
              { content: '', timestamp: '', type: '' },
              { content: '', timestamp: '', type: '' },
              { content: '', timestamp: '', type: '' },
              { content: '', timestamp: '', type: '' },
              { content: '', timestamp: '', type: '' }
            ],
            active: 0,
          }
        },
        created() {
          this.allList = this.request;
          this.selectList = this.allList;
          this.selectChange();
          this.initFlag();
        },
        methods: {
          getList() {
            this.pageTotal = this.selectList.length;
            this.list = this.selectList.slice(this.listQuery.pageSize*(this.listQuery.pageNum-1),this.listQuery.pageSize*this.listQuery.pageNum);
          },
          handleSizeChange(val) {            //改变当前页需要展示的目录信息条数后的目录信息的变化
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getList();
          },
          handleCurrentChange() {            //改变当前页码后需要展示的目录信息的变化
            this.getList();
          },

          //时间筛选（贼麻烦，可能需要优化）
          selectChange() {
            let logindate;
            let i = 0;
            let j = this.allList.length;
            this.selectList= [];
            if(this.value === "今日")
            {
              let start;
              const date = new Date();
              start = new Date(date.getFullYear(), parseInt(date.getMonth()),date.getDate());
              for(i = 0; i < j; i++)
              {
                let ars = [];
                ars = this.allList[i].time.split('-');
                let loginDate = new Date(ars[0], parseInt(ars[1] - 1), ars[2]);
                if(loginDate.getTime() === start.getTime())
                {
                  this.selectList.push({
                    time: this.allList[i].time,
                    userName: this.allList[i].userName,
                    originalPlatform: this.allList[i].originalPlatform,
                    destinationPlatform: this.allList[i].destinationPlatform,
                    resourceType: this.allList[i].resourceType,
                    dirName: this.allList[i].dirName,
                    type: this.allList[i].type,
                    status: this.allList[i].status,
                    data: this.allList[i].data
                  });
                }
              }
              this.listQuery.pageNum = 1;
              this.getList();
            } else if (this.value === "三日内") {
              let start, end;
              const date = new Date();
              start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2);
              end = new Date(date.getFullYear(), parseInt(date.getMonth()), date.getDate());
              for (i = 0; i < j; i++) {
                let ars = [];
                ars = this.allList[i].time.split('-');
                logindate = new Date(ars[0], parseInt(ars[1] - 1), ars[2]);
                if (start <= logindate && logindate < end) {
                  this.selectList.push({
                    time: this.allList[i].time,
                    userName: this.allList[i].userName,
                    originalPlatform: this.allList[i].originalPlatform,
                    destinationPlatform: this.allList[i].destinationPlatform,
                    resourceType: this.allList[i].resourceType,
                    dirName: this.allList[i].dirName,
                    type: this.allList[i].type,
                    status: this.allList[i].status,
                    data: this.allList[i].data
                  });
                }
                this.listQuery.pageNum = 1;
                this.getList();
              }
            } else if (this.value === "一周内")
            {
              let start,end;
              const date = new Date();
              start = new Date(date.getFullYear(), date.getMonth(),date.getDate()-6);
              end = new Date(date.getFullYear(), parseInt(date.getMonth()),date.getDate()-2);
              for(i = 0; i < j; i++)
              {
                let ars = [];
                ars = this.allList[i].time.split('-');
                logindate = new Date(ars[0], parseInt(ars[1] - 1), ars[2]);
                if( start <= logindate && logindate < end)
                {
                  this.selectList.push({
                    time: this.allList[i].time,
                    userName: this.allList[i].userName,
                    originalPlatform: this.allList[i].originalPlatform,
                    destinationPlatform: this.allList[i].destinationPlatform,
                    resourceType: this.allList[i].resourceType,
                    dirName: this.allList[i].dirName,
                    type: this.allList[i].type,
                    status: this.allList[i].status,
                    data: this.allList[i].data
                  });
                }
                this.listQuery.pageNum = 1;
                this.getList();
              }
            } else if (this.value === "一周外")
            {
              let end;
              const date = new Date();
              end = new Date(date.getFullYear(), parseInt(date.getMonth()),date.getDate()-6);
              for(i = 0; i < j; i++)
              {
                let ars = [];
                ars = this.allList[i].time.split('-');
                logindate = new Date(ars[0], parseInt(ars[1] - 1), ars[2]);
                if( logindate < end )
                {
                  this.selectList.push({
                    time: this.allList[i].time,
                    userName: this.allList[i].userName,
                    originalPlatform: this.allList[i].originalPlatform,
                    destinationPlatform: this.allList[i].destinationPlatform,
                    resourceType: this.allList[i].resourceType,
                    dirName: this.allList[i].dirName,
                    type: this.allList[i].type,
                    status: this.allList[i].status,
                    data: this.allList[i].data
                  });
                }
                this.listQuery.pageNum = 1;
                this.getList();
              }
            } else if (this.value === "全部")
            {
              this.selectList = this.allList;
              this.listQuery.pageNum = 1;
              this.getList();
            }
          },

          //请求处理的详情查看
          initFlag() {
            for (let i = 0; i < 5; i++)
            {
              this.flag[i].content = '';
              this.flag[i].timestamp = '';
              this.flag[i].type = '';
            }
          },
          handleDetail(index, row){
            this.dialogTableVisible = true;
            this.initFlag();
            for (let i = 0; i < row.data.length; i++)
            {
              this.flag[i].content = row.data[i].content;
              this.flag[i].timestamp = row.data[i].timestamp;
              this.flag[i].type = row.data[i].type;
            }
            this.active = row.data.length;
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
