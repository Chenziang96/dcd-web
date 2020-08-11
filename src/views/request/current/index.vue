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
            <el-tag size="medium" type="success" v-show="scope.row.status==='0'">已处理</el-tag>
            <el-tag size="medium" type="danger" v-show="scope.row.status==='1'">处理失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.$index, scope.row)" type="text">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


<!--    <el-dialog title="请求处理详情" :visible.sync="dialogTableVisible" align="center" width="800px">-->
<!--      <div>-->
<!--        <el-steps space="400px" :active="active" finish-status="success" style="margin-top: 100px; margin-bottom: 100px" align-center>-->
<!--          <el-step :title="flag[0].title" :status="flag[0].status"></el-step>-->
<!--          <el-step :title="flag[1].title" :status="flag[1].status"></el-step>-->
<!--          <el-step :title="flag[2].title" :status="flag[2].status"></el-step>-->
<!--          <el-step :title="flag[3].title" :status="flag[3].status"></el-step>-->
<!--          <el-step :title="flag[4].title" :status="flag[4].status"></el-step>-->
<!--        </el-steps>-->
<!--      </div>-->
<!--    </el-dialog>-->

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
            options: [{
              value: '今日',
              label: '今日'
            }, {
              value: '三日内',
              label: '三日内'
            }, {
              value: '一周内',
              label: '一周内'
            }, {
              value: '一周外',
              label: '一周外'
            }, {
              value: '全部',
              label: '全部'
            }],
            value: '今日',
            listQuery: Object.assign({}, defaultListQuery),
            // request: [
            //   { time: "2020-7-7", userName: "用户a", originalPlatform: "物联网平台1", destinationPlatform: "物联网平台2",
            //     resourceType: "图片", dirName: "图片1", status: "1",
            //     data:[
            //       { status: "success", text: "第一步处理成功" },
            //       { status: "success", text: "第二步处理成功" },
            //       { status: "error", text: "第三步处理失败" },
            //     ]
            //   },
            //   { time: "2020-6-2", userName: "用户c", originalPlatform: "物联网平台4", destinationPlatform: "物联网平台2",
            //     resourceType: "图片", dirName: "图片5", status: "0",
            //     data:[
            //       { status: "success", text: "第一步处理成功" },
            //       { status: "success", text: "第二步处理成功" },
            //       { status: "success", text: "第三步处理成功" },
            //       { status: "success", text: "第四步处理成功" },
            //       { status: "success", text: "第五步处理成功" }
            //     ]
            //   },
            //   { time: "2020-7-8", userName: "用户b", originalPlatform: "物联网平台2", destinationPlatform: "物联网平台3",
            //     resourceType: "文档", dirName: "文档2", status: "0",
            //     data:[
            //       { status: "success", text: "第一步处理成功" },
            //       { status: "success", text: "第二步处理成功" },
            //       { status: "success", text: "第三步处理成功" },
            //       { status: "success", text: "第四步处理成功" },
            //       { status: "success", text: "第五步处理成功" }
            //     ]
            //   },
            // ],
            request: [
              { time: "2020-7-7", userName: "用户a", originalPlatform: "物联网平台1", destinationPlatform: "物联网平台2",
                resourceType: "图片", dirName: "图片1", status: "1",
                data:[
                  { content: '请求符合权限', timestamp: '2020-7-7 18:00', type: 'success'},
                  { content: '请求成功发送至目的平台', timestamp: '2020-7-7 18:15', type: 'success' },
                  { content: '成功接收到目的平台的数据', timestamp: '2020-7-7 18:30', type: 'success' },
                  { content: '数据过滤成功', timestamp: '2020-7-7 18:40', type: 'success' },
                  { content: '发送失败，未能将数据发送到原平台', timestamp: '2018-7-7 18:46', type: 'danger' }
                ]
              },
              { time: "2020-6-2", userName: "用户c", originalPlatform: "物联网平台4", destinationPlatform: "物联网平台2",
                resourceType: "图片", dirName: "图片5", status: "0",
                data:[
                  { content: '请求符合权限', timestamp: '2020-6-2 20:00', type: 'success'},
                  { content: '请求成功发送至目的平台', timestamp: '2020-6-2 20:15', type: 'success' },
                  { content: '成功接收到目的平台的数据', timestamp: '2020-6-2 20:30', type: 'success' },
                  { content: '数据过滤成功', timestamp: '2020-6-2 20:40', type: 'success' },
                  { content: '成功发送数据到原平台', timestamp: '2020-6-2 20:50', type: 'success' }
                ]
              },
              { time: "2020-7-3", userName: "用户s", originalPlatform: "物联网平台3", destinationPlatform: "物联网平台1",
                resourceType: "视频", dirName: "视频3", status: "1",
                data:[
                  { content: '请求符合权限', timestamp: '2020-7-3 12:00', type: 'success'},
                  { content: '请求成功发送至目的平台', timestamp: '2020-7-3 12:15', type: 'success' },
                  { content: '成功接收到目的平台的数据', timestamp: '2020-7-3 12:30', type: 'success' },
                  { content: '数据过滤失败', timestamp: '2020-7-3 12:40', type: 'danger' }
                ]
              },
              { time: "2020-7-9", userName: "用户b", originalPlatform: "物联网平台2", destinationPlatform: "物联网平台3",
                resourceType: "文档", dirName: "文档2", status: "0",
                data:[
                  { content: '请求符合权限', timestamp: '2020-7-9 9:00', type: 'success'},
                  { content: '请求成功发送至目的平台', timestamp: '2020-7-9 9:15', type: 'success' },
                  { content: '成功接收到目的平台的数据', timestamp: '2020-7-9 9:20', type: 'success' },
                  { content: '数据过滤成功', timestamp: '2020-7-9 9:30', type: 'success' },
                  { content: '成功发送数据到原平台', timestamp: '2020-7-9 9:45', type: 'success' }
                ]
              },
            ],
            allList: [],
            selectList: [],
            list: [],
            pageTotal: 0,
            dialogTableVisible: false,
            dialogTableVisible2: false,
            dirDetailData: {},
            active: 0,
            // flag: [
            //   { status: "wait", title: "第一步" },
            //   { status: "wait", title: "第二步" },
            //   { status: "wait", title: "第三步" },
            //   { status: "wait", title: "第四步" },
            //   { status: "wait", title: "第五步" },
            // ],
            flag: [
              { content: '', timestamp: '', type: '' },
              { content: '', timestamp: '', type: '' },
              { content: '', timestamp: '', type: '' },
              { content: '', timestamp: '', type: '' },
              { content: '', timestamp: '', type: '' }
            ]
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
          initFlag() {
            for (let i = 0; i < 5; i++)
            {
              // this.flag[i].title = "第"+ i +"步";
              // this.flag[i].status = "wait"
              this.flag[i].content = '';
              this.flag[i].timestamp = '';
              this.flag[i].type = '';
            }
          },
          selectChange() {
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
                let arys = new Array();
                arys = this.allList[i].time.split('-');
                let loginDate = new Date(arys[0], parseInt(arys[1] - 1), arys[2]);
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
                let arys = new Array();
                arys = this.allList[i].time.split('-');
                var logindate = new Date(arys[0], parseInt(arys[1] - 1), arys[2]);
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
                let arys = new Array();
                arys = this.allList[i].time.split('-');
                var logindate = new Date(arys[0], parseInt(arys[1] - 1), arys[2]);
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
                let arys = new Array();
                arys = this.allList[i].time.split('-');
                var logindate = new Date(arys[0], parseInt(arys[1] - 1), arys[2]);
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
          handleSizeChange(val) {            //改变当前页需要展示的目录信息条数后的目录信息的变化
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getList();
          },
          handleCurrentChange() {            //改变当前页码后需要展示的目录信息的变化
            this.getList();
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
