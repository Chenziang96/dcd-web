<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>规则列表</span>
      <el-button type="danger" class="pull-right" @click="handleAdd">新增规则</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="原平台IP" align="center">
          <template slot-scope="scope">{{scope.row.originalPlatform}}</template>
        </el-table-column>
        <el-table-column label="目的平台IP" align="center">
          <template slot-scope="scope">{{scope.row.destinationPlatform}}</template>
        </el-table-column>
        <el-table-column label="安全级别" align="center">
          <template slot-scope="scope">{{scope.row.safetyLevel}}</template>
        </el-table-column>
        <el-table-column label="启用状态" align="center">
          <template slot-scope="scope">{{scope.row.status}}</template>
        </el-table-column>
        <el-table-column label="动作" align="center">
          <template slot-scope="scope">{{scope.row.action}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleChange(scope.$index, scope.row)" type="text">编辑</el-button>
            <el-button size="small" @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--新增规则-->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="700px">
      <div class="size">
        <el-container style="height: 400px; border: 1px solid #eee">
          <el-aside width="140px">
            <el-menu :default-active="index" class="el-menu-vertical-demo">
              <el-menu-item index="1" style="margin-top: 30px">
                <i class="el-icon-menu"></i>
                <span slot="title">平台配置</span>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-document"></i>
                <span slot="title">安全级别</span>
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-setting"></i>
                <span slot="title">动作配置</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <!--容器内具体内容部分-->
          <el-container>
            <!--main部分-->
            <el-main>
              <!--平台配置-->
              <el-form v-show="index === '1'">
                <div style="margin: 30px 0;font-weight: 900;font-size: 15px;">请先选择一个平台作为原平台!</div>
                <el-form-item style="font-weight: 700;" label="原平台：" prop="region" label-width="100px">
                  <el-select v-model="rulesAddData.originalPlatform" placeholder="请选择" style="width: 280px">
                    <el-option
                      v-for="item in options"
                      :key="item.index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div style="margin: 30px 0;font-weight: 900;font-size: 15px;">请再选择一个平台作为目的平台!</div>
                <el-form-item style="font-weight: 700;" label="目的平台：" prop="region" label-width="100px">
                  <el-select v-model="rulesAddData.destinationPlatform" placeholder="请选择" style="width: 280px">
                    <el-option
                      v-for="item in options"
                      :key="item.index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <!--安全级别选择-->
              <el-form v-show="index === '2'">
                <div style="margin: 30px 0;font-weight: 900;font-size: 15px;">请确定该规则的安全级别！</div>
                <el-form-item style="font-weight: 700;" label="安全级别：" prop="region" label-width="100px">
                  <el-select v-model="rulesAddData.originalPlatform" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                  <div style="font-weight: 500;margin-top: 10px;line-height: 20px;">
                    安全级别共分为5个级别，从1级到5级，1级的安全级别最低，5级的安全级别最高。
                  </div>
                </el-form-item>
              </el-form>
              <!--动作配置-->
              <el-form v-show="index === '3'">
                <div style="margin: 30px 0;font-weight: 900;font-size: 15px;">请确定该规则对应的动作！</div>
                <el-form-item label-width="40px">
                  <el-row>
                    <el-radio style="font-weight: 700;" v-model="rulesAddData.action" label="1">接受</el-radio>
                    <div style="line-height: 20px;">允许执行传输和转发的操作，包括请求和数据的传输和转发。</div>
                  </el-row>
                  <el-row>
                    <el-radio style="font-weight: 700;" v-model="rulesAddData.action" label="2">拒绝</el-radio>
                    <div style="line-height: 20px;">拒绝执行请求和数据的传输和转发的操作。</div>
                  </el-row>
                </el-form-item>
              </el-form>
            </el-main>

            <!--footer部分-->
            <el-footer>
              <div class="dialog-button-style">
                <el-button v-show="index!=='1'" @click="lastStep">{{ buttonName[0] }}</el-button>
                <el-button type="danger" @click="nextStep">{{ buttonName[1] }}</el-button>
              </div>
            </el-footer>
          </el-container>
        </el-container>
      </div>
    </el-dialog>

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
      allList: [],
      list: [],
      pageTotal: 0,
      rulesList: [
        { id: 1, originalPlatform: "192.168.0.1", destinationPlatform: "192.168.0.2", safetyLevel: 2, status: "已启用", action: "接受" },
        { id: 2, originalPlatform: "192.168.0.2", destinationPlatform: "192.168.0.3", safetyLevel: 4, status: "已禁用", action: "拒绝" }
      ],

      //新增规则
      addDialogVisible: false,
      index: "1",
      rulesAddData: { originalPlatform: null, destinationPlatform: null, safetyLevel: null, status: null, action: null },
      buttonName: ["上一步", "下一步"],
    }
  },
  created() {
    this.allList = this.rulesList;
    this.getList();
  },
  methods: {
    getList() {
      this.pageTotal = this.allList.length;
      this.list = this.allList.slice(this.listQuery.pageSize*(this.listQuery.pageNum-1),this.listQuery.pageSize*this.listQuery.pageNum);
    },
    handleSizeChange(val) {            //改变当前页需要展示的目录信息条数后的目录信息的变化
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange() {            //改变当前页码后需要展示的目录信息的变化
      this.getList();
    },

    //新增规则
    handleAdd() {
      this.addDialogVisible = true;
      this.index = "1";
      this.buttonName[1] = "下一步";
    },
    nextStep() {
      this.index = (parseInt(this.index) + 1).toString();
      if(this.index === "3") {
        this.buttonName[1] = "确定";
      }
    },
    lastStep() {
      this.index = (parseInt(this.index) - 1).toString();
      if(this.index !== "3") {
        this.buttonName[1] = "下一步";
      }
    },
    //编辑规则
    handleChange() {

    },

    //删除规则
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  }
}
</script>

<style scoped>
  .pull-right {
    float: right;
    margin-bottom: 20px;
  }

  .size {
    height: 450px;
  }

  .dialog-button-style {
    margin-left: 30%;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 140px;
    min-height: 398px;
  }
</style>
