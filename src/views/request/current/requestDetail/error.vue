<template>
  <a-card :bordered="false">
    <a-result :sub-title="description" :title="title">
      <template #icon>
        <a-icon type="frown" theme="twoTone" two-tone-color="#F56C6C" />
      </template>
      <template #extra>
        <el-button type="primary" @click="returnToRequest">返回列表</el-button>
      </template>
      <div class="content">
        <div style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 500; margin-bottom: 20px;">请求信息：</div>
        <a-row style="margin-bottom: 16px">
          <a-col :xl="4">
            <span style="color: rgba(0, 0, 0, 0.85)">发起人：</span>
            {{ requestData.userName }}
          </a-col>
          <a-col :xl="4">
            <span style="color: rgba(0, 0, 0, 0.85)">原平台：</span>
            {{ requestData.srcPlatform }}
          </a-col>
          <a-col :xl="4">
            <span style="color: rgba(0, 0, 0, 0.85)">目的平台：</span>
            {{ requestData.dstPlatform }}
          </a-col>
          <a-col :xl="4">
            <span style="color: rgba(0, 0, 0, 0.85)">发起时间：</span>
            {{ requestData.requestTime }}
          </a-col>
        </a-row>
        <div>
          <el-steps :active="active" process-status="error" finish-status="success">
            <el-step
              v-for="(value, index) in requestStatus"
              :key="index"
              :class="active === index + 1 ? 'stepOne' : ''"
              :title="value.title"
            >
              <template slot="description">
                <div style="fontSize: 14px; color: rgba(0, 0, 0, 0.60); position: relative;text-align: left;" slot="description" >
                  <div style="margin: 8px 0 4px">
                    {{ value.info }}
                    <a-icon style="margin-left: 8px;color: #00A0E9" type="dingding-o" />
                  </div>
                  <div>{{ value.stepTime }}</div>
                </div>
              </template>
            </el-step>
          </el-steps>
        </div>
      </div>
    </a-result>
  </a-card>
</template>

<script>
import Vue from "vue";
import Antd from "ant-design-vue";

Vue.use(Antd);

export default {
  name: 'error',
  data () {
    return {
      title: '处理失败',
      description: '提交结果页用于反馈一系列操作任务的处理结果，\n' +
        ' 如果仅是简单操作，使用 Message 全局提示反馈即可。\n' +
        ' 本文字区域可以展示简单的补充说明，如果有类似展示\n' +
        ' “单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。',
      requestData: [],
      requestStatus:[
        { title: "请求匹配", info: null, stepTime: null },
        { title: "请求转发", info: null, stepTime: null },
        { title: "数据接收", info: null, stepTime: null },
        { title: "数据过滤", info: null, stepTime: null },
        { title: "数据转发", info: null, stepTime: null },
      ],
      requestDetail: [],
      active: null,
      //stepActive: 'stepActive',
    }
  },
  created() {
    this.requestData = this.$route.query;
    this.get1();
  },
  methods: {
    get1() {
      let that = this;
      this.$http({
        method: 'get',
        url: '/api/hibernate/requestDetail/findByUuId?uuId=' + this.requestData.uuId,
      })
        .then(function (res) {
          console.log(res);
          that.requestDetail = res.data;
          for (let i = 0; i < that.requestDetail.length; i++)
          {
            that.requestStatus[i].info = that.requestDetail[i].info;
            that.requestStatus[i].stepTime = that.requestDetail[i].stepTime;
          }
          that.active = that.requestDetail.length - 1;
        })
        .catch(function (error) {
          console.log(error);
        })
    },

    //返回数据列表
    returnToRequest() {
      this.$router.push({path:'/request/current'});
    }
  }
}
</script>

<style lang="scss">
.stepOne {
  /deep/.el-step__line{
    margin-left: 20px;
    background: transparent;
    border-top: 2.2px solid #F56C6C;
    .el-step__line-inner{
      border-width: 0 !important;
    }
  }
}

.stepTwo {
  /deep/.el-step__icon.is-text{
    background: #409eff;
    color:#fff;
  }
}

</style>
