<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="medium">
          <el-form-item  style="margin-left: 100px" label="原平台搜索：">
            <el-select clearable v-model="listQuery.srcPlatform" placeholder="请选择" @change="selectChange()">
              <el-option
                v-for="item in platformOptions"
                :key="item.index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 30px" label="目的平台搜索：">
            <el-select clearable v-model="listQuery.dstPlatform" placeholder="请选择" @change="selectChange()">
              <el-option
                v-for="item in platformOptions"
                :key="item.index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 30px">
            <el-button class="pan-btn pink-btn" icon="el-icon-refresh" type="primary" @click="resetListQuery">重 置</el-button>
          </el-form-item>
          <el-button v-waves icon="el-icon-folder-add" type="primary" class="pull-right" @click="handleAdd">新增规则</el-button>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>规则列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="原平台名称" align="center">
          <template slot-scope="scope">{{scope.row.srcPlatform}}</template>
        </el-table-column>
        <el-table-column label="目的平台名称" align="center">
          <template slot-scope="scope">{{scope.row.dstPlatform}}</template>
        </el-table-column>
        <el-table-column label="安全级别" align="center">
          <template slot-scope="scope">{{scope.row.safetyLevel}}</template>
        </el-table-column>
        <el-table-column label="关系运算符" align="center">
          <template slot-scope="scope">{{scope.row.levelOperator}}</template>
        </el-table-column>
        <el-table-column style="background-color: #08ff25" label="启用状态" align="center">
          <template slot-scope="scope">
            <el-switch
              style="display: block"
              v-model="scope.row.ruleStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用"
              @change="filterStatusChange(scope.$index, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="动作" align="center">
          <template slot-scope="scope">{{scope.row.ruleAction}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-waves type="warning" icon="el-icon-edit" size="small" @click="handleChange(scope.$index, scope.row)">编辑</el-button>
            <el-button v-waves type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
              <el-form :model="rulesAddData" ref="rulesAddData1" v-show="index === '1'" class="demo-dynamic">
                <div style="margin: 30px 0;font-weight: 900;font-size: 15px;">请先选择一个平台作为原平台!</div>
                <el-form-item
                  :rules="{ required: true, message: '原平台不能为空', trigger: 'change'} "
                  style="font-weight: 700;"
                  label="原平台："
                  prop="srcPlatform"
                  label-width="100px">
                  <el-select v-model="rulesAddData.srcPlatform" placeholder="请选择" style="width: 280px">
                    <el-option
                      v-for="item in platformOptions"
                      :key="item.index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div style="margin: 30px 0;font-weight: 900;font-size: 15px;">请再选择一个平台作为目的平台!</div>
                <el-form-item
                  :rules="{ required: true, message: '目的平台不能为空', trigger: 'change'} "
                  style="font-weight: 700;"
                  label="目的平台："
                  prop="dstPlatform"
                  label-width="100px">
                  <el-select v-model="rulesAddData.dstPlatform" placeholder="请选择" style="width: 280px">
                    <el-option
                      v-for="item in platformOptions"
                      :key="item.index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <!--安全级别选择-->
              <el-form :model="rulesAddData" ref="rulesAddData2" v-show="index === '2'" class="demo-dynamic">
                <div style="margin: 20px 0;font-weight: 900;font-size: 15px;">请确定该规则的安全级别！</div>
                <el-form-item
                  :rules="{ required: true, message: '安全级别不能为空！', trigger: 'change'} "
                  style="font-weight: 700;"
                  label="安全级别："
                  prop="safetyLevel"
                  label-width="120px">
                  <el-select v-model="rulesAddData.safetyLevel" placeholder="请选择">
                    <el-option
                      v-for="item in safetyLevelOptions"
                      :key="item.index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div style="margin: 20px 0;font-weight: 900;font-size: 15px;">请确定该规则的运算关系符！</div>
                <el-form-item
                  :rules="{ required: true, message: '关系运算符不能为空！', trigger: 'change'} "
                  style="font-weight: 700;"
                  label="关系运算符："
                  prop="levelOperator"
                  label-width="120px">
                  <el-select v-model="rulesAddData.levelOperator" placeholder="请选择">
                    <el-option
                      v-for="item in levelOperatorOptions"
                      :key="item.index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="120px">
                  <div  style="font-weight: 500;margin-top: 0px;line-height: 20px;">
                    安全级别共分为5个级别，从1级到5级，1级的安全级别最低，5级的安全级别最高。关系运算符决定了规则的匹配条件。
                  </div>
                </el-form-item>
              </el-form>
              <!--动作配置-->
              <el-form v-show="index === '3'">
                <div style="margin: 30px 0;font-weight: 900;font-size: 15px;">请确定该规则对应的动作！</div>
                <el-form-item label-width="40px">
                  <el-row>
                    <el-radio style="font-weight: 700;" v-model="rulesAddData.ruleAction" label="accept">接 受</el-radio>
                    <div style="line-height: 20px;">允许执行传输和转发的操作，包括请求和数据的传输和转发。</div>
                  </el-row>
                  <el-row>
                    <el-radio style="font-weight: 700;" v-model="rulesAddData.ruleAction" label="deny">拒 绝</el-radio>
                    <div style="line-height: 20px;">拒绝执行请求和数据的传输和转发的操作。</div>
                  </el-row>
                </el-form-item>
              </el-form>
            </el-main>
            <!--footer部分-->
            <el-footer>
              <div align="center">
                <el-button v-waves type="danger" @click="deleteAdd">取 消</el-button>
                <el-button v-waves v-show="index!=='1'" type="warning" @click="lastStep">上一步</el-button>
                <el-button v-waves v-show="index==='1' || index==='2'" type="primary" @click="nextStep(formName)">下一步</el-button>
                <el-button v-waves v-show="index==='3'" type="primary" @click="confirmAdd">确 定</el-button>
              </div>
            </el-footer>
          </el-container>
        </el-container>
      </div>
    </el-dialog>

    <!--编辑规则-->
    <el-dialog title="规则编辑" :visible.sync="changeDialogVisible" width="900px">
      <el-row :gutter="12">
        <!--规则属性配置-->
        <el-col :span="12">
          <el-card class="box-card" style="height: 300px">
            <div slot="header" class="clearfix">
              <span>规则属性配置</span>
            </div>
            <el-form label-position="left" :model="rulesChangeData" class="demo-dynamic">
              <el-form-item
                style="font-weight: 700;margin-top: 10px;margin-bottom: 30px;"
                label="原平台："
                label-width="100px">
                <el-select v-model="rulesChangeData.srcPlatform" placeholder="请选择">
                  <el-option
                    v-for="item in platformOptions"
                    :key="item.index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                style="font-weight: 700;margin: 30px 0;"
                label="目的平台："
                label-width="100px">
                <el-select v-model="rulesChangeData.dstPlatform" placeholder="请选择">
                  <el-option
                    v-for="item in platformOptions"
                    :key="item.index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                style="font-weight: 700;"
                label="安全级别："
                label-width="100px">
                <el-select v-model="rulesChangeData.safetyLevel" placeholder="请选择">
                  <el-option
                    v-for="item in safetyLevelOptions"
                    :key="item.index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <!--规则匹配条件选择-->
        <el-col :span="12">
          <el-card class="box-card" style="height: 140px">
            <div slot="header" class="clearfix">
              <span>规则匹配条件选择</span>
            </div>
            <el-form label-position="left" :model="rulesChangeData" class="demo-dynamic">
              <el-form-item
                style="font-weight: 700;"
                label="关系运算符："
                label-width="120px">
                <el-select v-model="rulesChangeData.levelOperator" placeholder="请选择">
                  <el-option
                    v-for="item in levelOperatorOptions"
                    :key="item.index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12" style="margin-top: 20px">
          <el-card class="box-card" style="height: 140px">
            <div slot="header" class="clearfix">
              <span>规则动作配置</span>
            </div>
            <el-radio style="margin-top: 10px;margin-left: 10px;margin-right: 30px" v-model="rulesChangeData.ruleAction" label="accept">接受转发</el-radio>
            <el-radio style="margin-left: 10px;margin-right: 30px" v-model="rulesChangeData.ruleAction" label="deny">拒绝转发</el-radio>
          </el-card>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="deleteChange">取 消</el-button>
        <el-button v-waves type="primary" @click="confirmChange">确 定</el-button>
      </span>
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

import waves from '@/directive/waves' // 水波纹指令

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  srcPlatform: "",
  dstPlatform: ""
};
export default {
  name: "index",
  directives: {
    waves
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      allList: [],
      selectList: [],
      list: [],
      pageTotal: 0,

      //新增规则
      addDialogVisible: false,
      index: "1",
      rulesAddData: { srcPlatform: null, dstPlatform: null, safetyLevel: null, levelOperator: null, ruleStatus: true, ruleAction: 'accept' },
      formName: "rulesAddData1",
      platformOptions: [],
      safetyLevelOptions: [1,2,3,4,5],
      levelOperatorOptions: [">", "<", "=", "!="],

      //编辑规则
      changeDialogVisible: false,
      rulesChangeData: {uuId: null, srcPlatform: null, dstPlatform: null, safetyLevel: null, levelOperator: null, ruleStatus: null, ruleAction: null},

    }
  },
  created() {
    this.get1();
    this.getPlatformOptions();
  },
  methods: {
    get1(){
      let that = this;
      this.$http({
        method: 'get',
        url: '/api/c/rule/findAll'
      })
        .then(function (res) {
          console.log(res);
          that.allList = res.data;
          that.selectChange();
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    changeList() {
      this.pageTotal = this.selectList.length;
      this.list = this.selectList.slice(this.listQuery.pageSize*(this.listQuery.pageNum-1),this.listQuery.pageSize*this.listQuery.pageNum);
    },
    handleSizeChange(val) {            //改变当前页需要展示的目录信息条数后的目录信息的变化
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.changeList();
    },
    handleCurrentChange() {            //改变当前页码后需要展示的目录信息的变化
      this.changeList();
    },

    //筛选
    resetListQuery() {
      this.listQuery.srcPlatform = "";
      this.listQuery.dstPlatform = "";
      this.selectChange();
    },
    selectChange() {
      this.selectList = [];
      let length = this.allList.length;
      if (this.listQuery.srcPlatform !== "" && (this.listQuery.dstPlatform === "" || this.listQuery.dstPlatform === "any")) {
        for (let i = 0; i < length; i++) {
          if (this.allList[i].srcPlatform === this.listQuery.srcPlatform) {
            this.selectList.push({
              uuId: this.allList[i].uuId,
              srcPlatform: this.allList[i].srcPlatform,
              dstPlatform: this.allList[i].dstPlatform,
              safetyLevel: this.allList[i].safetyLevel,
              levelOperator: this.allList[i].levelOperator,
              ruleStatus: this.allList[i].ruleStatus,
              ruleAction: this.allList[i].ruleAction
            });
          }
        }
      }
      if ((this.listQuery.srcPlatform === "" || this.listQuery.srcPlatform === "any") && this.listQuery.dstPlatform !== "") {
        for (let i = 0; i < length; i++) {
          if (this.allList[i].dstPlatform === this.listQuery.dstPlatform) {
            this.selectList.push({
              uuId: this.allList[i].uuId,
              srcPlatform: this.allList[i].srcPlatform,
              dstPlatform: this.allList[i].dstPlatform,
              safetyLevel: this.allList[i].safetyLevel,
              levelOperator: this.allList[i].levelOperator,
              ruleStatus: this.allList[i].ruleStatus,
              ruleAction: this.allList[i].ruleAction
            });
          }
        }
      }
      if (this.listQuery.srcPlatform !== "" && this.listQuery.dstPlatform !== "") {
        for (let i = 0; i < length; i++) {
          if (this.allList[i].srcPlatform === this.listQuery.srcPlatform && this.allList[i].dstPlatform === this.listQuery.dstPlatform) {
            this.selectList.push({
              uuId: this.allList[i].uuId,
              srcPlatform: this.allList[i].srcPlatform,
              dstPlatform: this.allList[i].dstPlatform,
              safetyLevel: this.allList[i].safetyLevel,
              levelOperator: this.allList[i].levelOperator,
              ruleStatus: this.allList[i].ruleStatus,
              ruleAction: this.allList[i].ruleAction
            });
          }
        }
      }
      if ((this.listQuery.srcPlatform === "" || this.listQuery.srcPlatform === "any") && (this.listQuery.dstPlatform === "" || this.listQuery.dstPlatform === "any")) {
        this.selectList = this.allList;
      }
      this.changeList();
    },

    //新增规则
    initAddData() {                    //初始化新增规则需要的参数
      this.rulesAddData.srcPlatform = null;
      this.rulesAddData.dstPlatform = null;
      this.rulesAddData.safetyLevel = null;
      this.rulesAddData.levelOperator = null;
      this.rulesAddData.ruleStatus = true;
      this.rulesAddData.ruleAction = 'accept';
      this.index = "1";
      this.formName = "rulesAddData1";     //rulesAddData1控制平台配置的表单验证，rulesAddData2控制安全级别选择的表单验证
    },
    getPlatformOptions() {
      let that = this;
      this.$http({
        method: 'get',
        url: '/api/a/device/findAllPlatformNameRule'
      })
        .then(function (res) {
          console.log(res.data);
          that.platformOptions = res.data;
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    handleAdd() {
      this.addDialogVisible = true;
      this.initAddData();
      this.getPlatformOptions();
      this.$refs['rulesAddData1'].resetFields();
      this.$refs['rulesAddData2'].resetFields();    //重置两个表单的验证结果，避免在二次使用新增规则功能时，出现上次表单验证的结果显示
    },
    nextStep(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.rulesAddData.srcPlatform === this.rulesAddData.dstPlatform) {
            this.$message({
              message: "目的平台不能与原平台相同!",
              type: "error",
              offset: 180
            })
          } else {
            this.index = (parseInt(this.index) + 1).toString();
            if(this.index === "2") {
              this.formName = "rulesAddData2";
            }
          }
        } else {
          return false;
        }
      });
    },
    lastStep() {
      this.index = (parseInt(this.index) - 1).toString();
      if(this.index === '1') {
        this.formName = "rulesAddData1";
      }
    },
    deleteAdd() {
      this.addDialogVisible = false;
    },
    confirmAdd() {
      let that = this;
      this.$confirm('是否要进行该新增操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        let temp = this.rulesAddData;
        console.log(temp);
        await this.$http({
          method: 'post',
          url: '/api/c/rule/insert',
          data: temp
        })
          .then(function (res) {
            that.$message({
              message: res.data.info,
              type: res.data.status
            });
          })
          .catch(function (error) {
            console.log(error);
          })
        that.get1();
      });
      that.addDialogVisible = false;
    },

    //启用状态变化
    async filterStatusChange(index, row) {
      let that = this;
      await this.$http({
        method: 'post',
        url: '/api/c/rule/updateRuleStatusByUuId?uuId='+row.uuId+'&ruleStatus='+row.ruleStatus,
      }).then(function (res) {
          that.$message({
            message: res.data.info,
            type: res.data.status
          });
        })
        .catch(function (error) {
          console.log(error);
        })
      that.changeDialogVisible = false;
      that.get1();
    },

    //编辑规则
    handleChange(index, row) {
      this.changeDialogVisible = true;
      this.rulesChangeData.srcPlatform = row.srcPlatform;
      this.rulesChangeData.dstPlatform = row.dstPlatform;
      this.rulesChangeData.safetyLevel = row.safetyLevel;
      this.rulesChangeData.levelOperator = row.levelOperator;
      this.rulesChangeData.ruleAction = row.ruleAction;
      this.rulesChangeData.uuId = row.uuId;
      this.getPlatformOptions();
    },
    deleteChange() {
      this.changeDialogVisible = false;
    },
    confirmChange() {
      if(this.rulesChangeData.dstPlatform === this.rulesChangeData.srcPlatform) {
        this.$message({
          message: "目的平台不能与原平台相同!",
          type: "error",
          offset: 180
        })
      } else {
        let that = this;
        this.$confirm('是否要进行该编辑操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () => {
          await this.$http({
            method: 'post',
            url: '/api/c/rule/updateByUuId?uuId='+that.rulesChangeData.uuId+'&srcPlatform='+that.rulesChangeData.srcPlatform
            +'&dstPlatform='+that.rulesChangeData.dstPlatform+'&levelOperator='+that.rulesChangeData.levelOperator+'&safetyLevel='+that.rulesChangeData.safetyLevel+'&ruleAction='+
            that.rulesChangeData.ruleAction,
          })
            .then(function (res) {
              that.$message({
                message: res.data.info,
                type: res.data.status
              });
            })
            .catch(function (error) {
              console.log(error);
            })
          that.changeDialogFormVisible = false;
          that.get1();
        })
        this.changeDialogVisible = false;
      }
    },

    //删除规则
    handleDelete(index, row) {
      let that = this;
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        await this.$http({
          method: 'post',
          url: '/api/c/rule/deleteByUuId?uuId='+row.uuId,
        })
          .then(function (res) {
            that.$message({
              message: res.data.info,
              type: res.data.status
            });
          })
          .catch(function (error) {

          })
        that.get1();
      });
    },

  }
}
</script>

<style scoped>
  .pull-right {
    float: right;
    margin-right: 50px;
    margin-bottom: 20px;
  }

  .size {
    height: 450px;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 140px;
    min-height: 398px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
