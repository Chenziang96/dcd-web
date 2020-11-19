<template>
  <div class="app-container">
    <el-page-header @back="goBack" :content="'目录详情(平台Ip：'+platform.platformName + ')'">
    </el-page-header>
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true">
          <el-form-item label="资源类型选择：" label-width="120px" style="margin-left: 30px">
            <el-select style="margin-left: 5px; width: 240px;"  v-model="value" clearable placeholder="请选择" @change="selectChange()">
              <el-option
                v-for="item in options"
                :key="item.index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 30px" icon="el-icon-refresh" type="primary" @click="resetSelect">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>目录列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" border>
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="目录名称" width="240" align="center">
          <template slot-scope="scope">{{scope.row.resourceName }}</template>
        </el-table-column>
        <el-table-column label="资源类型" width="240" align="center">
          <template slot-scope="scope">{{scope.row.resourceType}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="240" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="安全等级" align="center">
          <template slot-scope="scope">{{scope.row.safetyLevel }}</template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-view" size="small" @click="handleDetail(scope.$index, scope.row)" type="success">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--查看目录详情dialog-->
    <el-dialog title="目录详情" :visible.sync="dialogTableVisible" align="center" width="800px">
      <!--使用v-if，实现父组件动态向子组件传递参数。重新渲染界面，会重新传递参数-->
      <directory-details v-if="dialogTableVisible" :dirDetailData="dirDetailData" />
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

import DirectoryDetails from "./dirComponents/DirectoryDetails";

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10
  };
  export default {
    name: "dirDetail",
    components:{
      DirectoryDetails
    },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        platform: {},
        selectList: [],
        list: [],
        pageTotal: 0,          //总条数

        //目录详情查看
        dialogTableVisible: false,
        dirDetailData: {},

        //资源类型选择框
        options: [],
        value: '',
      }
    },
    created() {
      this.platform = this.$route.query;
      this.get1();
      this.getResourceTypeList();
    },
    methods: {
      get1() {               //获取后端提供的所有目录信息
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/hibernate/directory/findByPlatformName?platformName=' + that.platform.platformName,
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
      handleSizeChange(val) {            //改变当前页需要展示的目录信息条数后的目录信息的变化
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange() {            //改变当前页码后需要展示的目录信息的变化
        this.getList();
      },

      //重置搜索
      resetSelect() {
        this.value = '';
        this.selectChange();
      },

      //资源类型选择框
      getResourceTypeList() {
        let that = this;
        this.$http({
          method: 'get',
          url: '/api/hibernate/directory/findAllResourceType'
        })
          .then(function (res) {
            console.log(res.data);
            that.options = res.data;
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      selectChange() {
        if(this.value === '') {
          this.get1();
        } else {
          let that = this;
          this.$http({
            method: 'get',
            url: '/api/hibernate/directory/findByPlatformNameAndResourceType?platformName='+this.platform.platformName+'&resourceType='+this.value,
          })
            .then(function (res) {
              console.log(res);
              that.selectList = res.data;               //第二个data是后端传递的数组名，可能需要修改
              that.getList();
            })
            .catch(function (error) {
              console.log(error);
            })
        }
      },

      //目录详情查看
      handleDetail(index, row) {
        this.dialogTableVisible = true;
        this.dirDetailData.id = index + 1;
        this.dirDetailData.platformName = this.platform.platformName;
        this.dirDetailData.platformIp = this.platform.platformIp;
        this.dirDetailData.resourceType = row.resourceType;
        this.dirDetailData.resourceName = row.resourceName;
        this.dirDetailData.safetyLevel = row.safetyLevel;
      },

      //返回到平台信息展示界面
      goBack() {
        this.$router.push('/directory/platform');
      }
    }
  }
</script>

<style scoped>

</style>
