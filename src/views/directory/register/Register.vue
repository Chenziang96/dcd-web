<template>
    <div class="size">
      <el-form ref="IoT" :rules="rules" :model="IoT" label-width="120px" class="demo-ruleForm">
        <el-form-item label="提交人：" prop="person">
          <el-input v-model="IoT.person"></el-input>
        </el-form-item>
        <el-form-item label="物联网ip：" prop="ip">
          <el-input v-model="IoT.ip"></el-input>
        </el-form-item>
        <el-form-item label="物联网名称：" prop="name">
          <el-input v-model="IoT.name"></el-input>
        </el-form-item>
        <el-form :inline="true" ref="dir" :model="dir" label-width="120px" class="demo-ruleForm">
          <el-form-item label="物联网目录：" prop="dir_0" :rules="[ { required: true, message: '添加目录不能为空', trigger: 'blur'} ]">
            <el-input v-model="dir.dir_0"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addDomain('dir')">添加目录</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="IoT.dir" class="demo-form-inline" label-width="120px">
          <el-form-item
            v-for="(dir, index) in IoT.dir"
            :label="'目录' + index + '：'"
            :key="dir.key">
            <el-form-item>
              <el-input :value="dir.value"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click.prevent="removeDomain(dir)">删除</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
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
              person: '',
              ip: '',
              name: '',
              dir: [],
              time: ''
            },
            directory: [],
            rules: {
              person: [
                { required: true, message: '请输入提交人', trigger: 'change' }
              ],
              ip: [
                { required: true, message: '请输入物联网ip', trigger: 'change'}
              ],
              name: [
                { required: true, message: '请输入物联网名称', trigger: 'change'}
              ]
            }
          }
        },
        methods: {
          onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                const date = new Date();
                this.IoT.time = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
                let i = 0;
                this.directory = [];
                for(i=0;i<this.index;i++)
                {
                  this.directory.push({
                    person: this.IoT.person,
                    ip: this.IoT.ip,
                    name: this.IoT.name,
                    dir: this.IoT.dir[i].value,
                    time: this.IoT.time
                  })
                }
                const str = window.JSON.stringify(this.directory);     //把需要存储的对象IoT数据变成字符串（因为localstorage只能存储字符串数据）
                localStorage.setItem('IoTInfo', str);            //把数据存入localstorage中，名字为IoTInfo
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          removeDomain(item) {
            const index = this.IoT.dir.indexOf(item);
            if (index !== -1) {
              this.IoT.dir.splice(index, 1)
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
              } else
              {
                console.log('error submit!!');
                return false;
              }
            });
          }
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
