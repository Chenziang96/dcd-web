<template>
    <div class="size">
      <el-form ref="IoT" :rules="rules" :model="IoT" label-width="120px" class="demo-ruleForm">
<!--        <el-form-item label="提交人：" prop="person">-->
<!--          <el-input v-model="IoT.person"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="物联网ip：" prop="platformIp">
          <el-input v-model="IoT.platformIp"></el-input>
        </el-form-item>
        <el-form-item label="物联网名称：" prop="platformName">
          <el-input v-model="IoT.platformName"></el-input>
        </el-form-item>
        <el-form-item label="操作系统类型：" prop="os">
          <el-input v-model="IoT.os"></el-input>
        </el-form-item>
<!--        <el-form :inline="true" ref="dir" :model="dir" label-width="120px" class="demo-ruleForm">-->
<!--          <el-form-item label="物联网目录：" prop="dir_0" :rules="[ { required: true, message: '添加目录不能为空', trigger: 'blur'} ]">-->
<!--            <el-input v-model="dir.dir_0"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button type="primary" @click="addDomain('dir')">添加目录</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--        <el-form :inline="true" :model="IoT.dir" class="demo-form-inline" label-width="120px">-->
<!--          <el-form-item-->
<!--            v-for="(dir, index) in IoT.dir"-->
<!--            :label="'目录' + index + '：'"-->
<!--            :key="dir.key">-->
<!--            <el-form-item>-->
<!--              <el-input :value="dir.value"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--              <el-button @click.prevent="removeDomain(dir)">删除</el-button>-->
<!--            </el-form-item>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
        <el-form-item>
          <el-button type="primary" @click="onSubmit('IoT')">立即创建</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
    export default {
        name: "Register",
        data() {
          return {
            index: 0,
            dir: {
              dir_0: ''
            },
            IoT: {
             platformIp:'',
             platformName:'',
             os:'',
            },
            directory: [],
            rules: {
              os: [
                { required: true, message: '请输入系统类型', trigger: 'change' }
              ],
              platformIp: [
                { required: true, message: '请输入物联网ip', trigger: 'change'}
              ],
              platformName: [
                { required: true, message: '请输入物联网名称', trigger: 'change'}
              ]
            }
          }
        },
        methods: {
          submit(){
            let that = this;
            this.$http({
              method: 'post',
              url: 'api/requestfilter/device/insertDevice',
              data: this.IoT,
            })
              .then((res)=> {
                console.log(res);
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              })
              .catch(function (error) {
                console.log(error);
                that.$message.error('上传失败，请检查网络');
              })
          },
          onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                // const date = new Date();
                // this.IoT.time = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
                // let i = 0;
                // this.directory = [];
                // for(i=0;i<this.index;i++)
                // {
                //   this.directory.push({
                //     person: this.IoT.person,
                //     ip: this.IoT.ip,
                //     name: this.IoT.name,
                //     dir: this.IoT.dir[i].value,
                //     time: this.IoT.time
                //   })
                // }
                // const str = window.JSON.stringify(this.directory);     //把需要存储的对象IoT数据变成字符串（因为localstorage只能存储字符串数据）
                // localStorage.setItem('IoTInfo', str);            //把数据存入localstorage中，名字为IoTInfo
                this.submit();
              } else {
                return false;
              }
            });
          },
          /*removeDomain(item) {
            const index = this.IoT.dir.indexOf(item);
            if (index !== -1) {
              this.IoT.dir.splice(index, 1);
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
          },
          addDomain(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.IoT.dir.push({
                  value: this.dir.dir_0
                });
                this.dir.dir_0 = '';
                this.index = this.index + 1;
                console.log('submit!!');
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              } else
              {
                console.log('error submit!!');
                this.$message.error('添加失败，请检查输入');
                return false;
              }
            });
          }*/
        }
    }
</script>

<style scoped>
    .size {
      width: 500px;
      height: 500px;
      margin-top: 3%;
      margin-left: 32%;
    }
</style>
