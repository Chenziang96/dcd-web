<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-zoom-in"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="medium" label-width="90px">
          <el-form-item label="日期：">
            <el-select v-model="value" placeholder="请选择" @change="selectChange()">
              <el-option
                v-for="item in options"
                :key="item.index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原平台：">
            <el-input v-model="listQuery.srcPlatform" placeholder="原平台名称"></el-input>
          </el-form-item>
          <el-form-item label="目的平台：">
            <el-input v-model="listQuery.dstPlatform" placeholder="目的平台名称"></el-input>
          </el-form-item>
          <el-button style="margin-left: 30px" type="primary" @click="search" size="medium">查 询</el-button>
          <el-button style="margin-left: 10px" @click="reForm" size="medium">重 置</el-button>
        </el-form>
      </div>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>请求列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="原平台" width="220" align="center">
          <template slot-scope="scope">{{scope.row.srcPlatform}}</template>
        </el-table-column>
        <el-table-column label="时间" width="220" align="center">
          <template slot-scope="scope">{{scope.row.requestTime}}</template>
        </el-table-column>
        <el-table-column label="目的平台" width="220" align="center">
          <template slot-scope="scope">{{scope.row.dstPlatform}}</template>
        </el-table-column>
        <el-table-column label="资源类型" width="220" align="center">
          <template slot-scope="scope">{{scope.row.resourceType}}</template>
        </el-table-column>
        <el-table-column label="目录名称" align="center">
          <template slot-scope="scope">{{scope.row.resourceName }}</template>
        </el-table-column>
        <el-table-column label="状态" width="220" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.requestStatus===0">
              <i class="el-icon-question"></i>
              <el-tag size="medium" type="warning">正在处理</el-tag>
            </div>
            <div v-show="scope.row.requestStatus===1">
              <i class="el-icon-success"></i>
              <el-tag size="medium" type="success">处理成功</el-tag>
            </div>
            <div v-show="scope.row.requestStatus===2">
              <i class="el-icon-error"></i>
              <el-tag size="medium" type="danger">处理失败</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-view" size="small" @click="handleRouter(scope.$index, scope.row)" type="success">查看详情</el-button>
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
      srcPlatform: '',
      dstPlatform: ''
    };
    export default {
        name: "index",
        data() {
          return {
            listQuery: Object.assign({}, defaultListQuery),
            allList: [],
            selectList: [],
            list: [],
            pageTotal: 0,

            //对应的时间筛选框
            options: [ "今日", "三日内", "一周内", "一周外", "全部" ],
            value: '全部',
          }
        },
        created() {
          this.get1();
          this.selectList = this.allList;
          this.selectChange();
        },
        methods: {
          get1() {
            let that = this;
            this.$http({
              method: 'get',
              url: '/api/hibernate/requestInfo/findAll',

            })
              .then(function (res) {
                that.allList = res.data;
                that.selectChange();
              })
              .catch(function (error) {
              })
          },
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
            let loginDate;
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
                let arsTest = [];
                arsTest = this.allList[i].requestTime.split(' ');
                ars = arsTest[0].split('-');
                loginDate = new Date(ars[0], parseInt(ars[1] - 1), ars[2]);
                if(loginDate.getTime() === start.getTime())
                {
                  this.selectList.push({
                    uuId: this.allList[i].uuId,
                    requestTime: this.allList[i].requestTime,
                    userName: this.allList[i].userName,
                    srcPlatform: this.allList[i].srcPlatform,
                    dstPlatform: this.allList[i].dstPlatform,
                    resourceType: this.allList[i].resourceType,
                    resourceName: this.allList[i].resourceName,
                    requestStatus: this.allList[i].requestStatus,
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
                let arsTest = [];
                arsTest = this.allList[i].requestTime.split(' ');
                ars = arsTest[0].split('-');
                loginDate = new Date(ars[0], parseInt(ars[1] - 1), ars[2]);
                if (start <= loginDate && loginDate < end) {
                  this.selectList.push({
                    uuId: this.allList[i].uuId,
                    requestTime: this.allList[i].requestTime,
                    userName: this.allList[i].userName,
                    srcPlatform: this.allList[i].srcPlatform,
                    dstPlatform: this.allList[i].dstPlatform,
                    resourceType: this.allList[i].resourceType,
                    resourceName: this.allList[i].resourceName,
                    requestStatus: this.allList[i].requestStatus,
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
                let arsTest = [];
                arsTest = this.allList[i].requestTime.split(' ');
                ars = arsTest[0].split('-');
                loginDate = new Date(ars[0], parseInt(ars[1] - 1), ars[2]);
                if( start <= loginDate && loginDate < end)
                {
                  this.selectList.push({
                    uuId: this.allList[i].uuId,
                    requestTime: this.allList[i].requestTime,
                    userName: this.allList[i].userName,
                    srcPlatform: this.allList[i].srcPlatform,
                    dstPlatform: this.allList[i].dstPlatform,
                    resourceType: this.allList[i].resourceType,
                    resourceName: this.allList[i].resourceName,
                    requestStatus: this.allList[i].requestStatus,
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
                let arsTest = [];
                arsTest = this.allList[i].requestTime.split(' ');
                ars = arsTest[0].split('-');
                loginDate = new Date(ars[0], parseInt(ars[1] - 1), ars[2]);
                if( loginDate < end )
                {
                  this.selectList.push({
                    uuId: this.allList[i].uuId,
                    requestTime: this.allList[i].requestTime,
                    userName: this.allList[i].userName,
                    srcPlatform: this.allList[i].srcPlatform,
                    dstPlatform: this.allList[i].dstPlatform,
                    resourceType: this.allList[i].resourceType,
                    resourceName: this.allList[i].resourceName,
                    requestStatus: this.allList[i].requestStatus,
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
          handleRouter(index, row){
            if (row.requestStatus === 0) {
              this.$router.push({path:'/request/requestDetail/process',query: row});
            }
            if (row.requestStatus === 1) {
              this.$router.push({path:'/request/requestDetail/success',query: row});
            }
            if (row.requestStatus === 2) {
              this.$router.push({path:'/request/requestDetail/error',query: row});
            }
          },

          //搜索按钮和重置按钮
          search() {
            let that = this;
            this.$http({
              method: 'get',
              url: '/api/hibernate/requestInfo/selectByListQuery?srcPlatform=' + that.listQuery.srcPlatform + '&dstPlatform=' + that.listQuery.dstPlatform,
            })
              .then(function (res) {
                that.allList = res.data;
                that.selectChange();
              })
              .catch(function (error) {
                console.log(error);
              })
          },
          reForm() {
            this.listQuery.srcPlatform = '';
            this.listQuery.dstPlatform = '';
            this.get1();
          }
        }
    }
</script>

<style scoped>

</style>
