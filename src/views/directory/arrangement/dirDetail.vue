<template>
  <div class="app-container">
    <el-page-header @back="goBack" :content="platform.name + '(目录详情)'">
    </el-page-header>
    <el-card class="operate-container" shadow="never">
      <el-select v-model="value" clearable placeholder="请选择" @change="selectChange()">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
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
        <el-table-column label="目录名称" align="cdenter">
          <template slot-scope="scope">{{scope.row.dirName }}</template>
        </el-table-column>d
        <el-table-column label="操作" width="200"c align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.$index, scope.row)" type="primary">查看详情</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" v-show="scope.row.status===1" type="danger">删除平台</el-button>
            <el-button size="mini" @click="handleChange(scope.$index, scope.row)" v-show="scope.row.status===0" type="primary">编辑目录</el-button>
          </template>
        </el-table-column>
      </el-table>
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
              let z = 1;
              this.selectList= [];
              for(i = 0; i < j; i++)
              {
                if(this.dirList[i].resourceType === this.value)
                {
                  this.selectList.push({
                    id: z,
                    resourceType: this.dirList[i].resourceType,
                    dirName: this.dirList[i].dirName,
                    status: this.dirList[i].status
                  });
                  z = z + 1;
                }
              }
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
          handleDetail() {

          },
          goBack() {
            this.$router.push('/directory/arrange');
          }
        }
    }
</script>

<style scoped>

</style>
