<template>
  <div class="background">
    <div :class="className">
      <div id="signIn">
        <h1 class="h1" style="padding-top: 50px">Login</h1>
        <div style="padding-left: 120px;padding-right: 120px;margin-top: 70px" >
          <label>
            <input style="margin: 40px auto;" type="text" placeholder="Username" v-model="user.userName" class="usn">
          </label>
          <label>
            <input style="margin: 40px auto;" type="password" placeholder="Password" v-model="user.pwd" class="psd">
          </label>
        </div>
        <div>
          <button class="btn" @click="login()">Sign in</button>
        </div>
        <span id="toRegister" @click="toSignUp" style="margin-top: 60px" class="toSign">to Sign up</span>
      </div>
      <div id="signUp">
        <h1 class="h1" style="padding-top: 50px">Register</h1>
        <div style="padding-left: 120px;padding-right: 120px;" >
          <label>
            <input style="margin: 20px auto;" type="text" placeholder="Username" v-model="userRegister.userName" class="usn">
          </label>
          <label>
            <input style="margin: 20px auto;" type="password" placeholder="Password" v-model="userRegister.pwd" class="psd">
          </label>
          <label>
            <input style="margin: 20px auto;" type="text" placeholder="PlatformIp" v-model="userRegister.platformIp" class="usn">
          </label>
        </div>
        <button class="btn" @click="register()">Sign up</button>
        <span id="toLogin" @click="toSignIn" style="padding-top: 35px;" class="toSign">to Sign in</span>
      </div>
    </div>
  </div>
</template>
<script>
  // import user from '../../store'
  import getters from "../../store/getters";
  import Cookies from 'js-cookie'
  export default {
    name: "Login",
    data() {
      return {
        user: {
          userName: '',
          pwd: '',
          platformIp:'',
          registerTime:'',
          isOnline:'',
        },
        userRegister: {
          userName: '',
          pwd: '',
          platformIp: ''
        },
        s: [],
        className: 'login'
      }
    },
    methods: {
      async login2(){
        let that = this;
        // console.log(getters.token());
        await this.$http({
          method: 'get',
          url: '/api/userclient/doLogin?userName='+that.user.userName+'&pwd='+that.user.pwd,
        })
          .then((res)=> {
            console.log(res);
            // storage.setItem('JESSIONID',)
            console.log(res.data);
            if (res.data === "登录成功！") {
              that.changeData1();
            } else {
              this.$message({
                message: res.data,
                type: "error"
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      //登录
      async login(){
        let that = this;
        let temp = that.user;
        // console.log(getters.token());
        await this.$http({
          method: 'post',
          url: '/api/userclient/login',
          data: temp,
        })
          .then((res)=> {
            console.log(res);
            if (res.data.result === "登录成功!") {
              that.changeData1();
            } else {
              this.$message({
                message: res.data,
                type: "error"
              });
            }
            // storage.setItem('JESSIONID',)
          })
          .catch(function (error) {
            console.log(error);
          })
      },

      async changeData1() {
        let that = this;
        await this.$http({
          method: 'get',
          url: '/api/userclient/checkPermsMatch?parentId=0'
        })
          .then(function (res) {
            that.s = res.data;
            console.log("执行乐乐乐乐乐");
          })
          .catch(function (error) {
            console.log(error);
          })
        this.$store.state.navigation = that.s;
        await this.$router.push('/home');
      },

      //注册
      register() {
        let that = this;
        this.$http({
          method: 'post',
          url: '/api/userclient/insert?userName='+that.userRegister.userName+'&pwd='+that.userRegister.pwd+'&platformIp='+that.userRegister.platformIp,
        })
          .then((res)=> {
            console.log(res);
            // storage.setItem('JESSIONID',)
          })
          .catch(function (error) {
            console.log(error);
          })
      },

      toSignUp() {
        this.className = 'register';
        this.userRegister.userName = null;
        this.userRegister.pwd = null;
        this.userRegister.platformIp = null;
      },

      toSignIn() {
        this.className = 'login';
        this.user.userName = null;
        this.user.pwd = null;
      }
    }
  }
</script>

<style scoped>
  .background {
    background: url("../../assets/background.jpg") no-repeat;
    background-size: 100% auto;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .login {
    width: 30%;
    height: 62%;
    margin: 10% auto auto;
    text-align: center;
    background-color: #00000090;
    /*padding: 100px;*/
    border-radius: 30px;
  }

  .register {
    width: 30%;
    height: 62%;
    margin: 10% auto auto;
    text-align: center;
    background-color: #00000090;
    /*padding: 100px;*/
    border-radius: 30px;
  }

  .h1 {
    color: #FFFFFF;
    font-size: 40px;
    text-shadow: 1px 1px 2px #d6d19d;
    letter-spacing: 15px;
    margin-bottom: 50px;
  }

  .usn {
    display: block;
    text-align: center;
    border: 2px solid #FFFFFF;
    padding: 12px;
    width: 200px;
    outline: none;
    color: #FFFFFF;
    background: #FFFFFF00;
    border-radius: 35px;
    font-size: 25px;
    transition: 0.25s;
  }

  .usn:focus {
    width: 300px;
    border-color: #2ecc71;
  }

  .psd {
    display: block;
    text-align: center;
    border: 2px solid #FFFFFF;
    padding: 12px;
    width: 200px;
    outline: none;
    color: #FFFFFF;
    background: #FFFFFF00;
    border-radius: 35px;
    font-size: 25px;
    transition: 0.25s;
  }

  .psd:focus {
    width: 300px;
    border-color: #2ecc71;
  }

  .btn {
    display: block;
    outline: none;
    text-shadow: 2px 2px 2px #c1beb2; /*字体添加阴影效果*/
    border: 1px solid #2c0027;
    border-radius: 35px;
    letter-spacing: 5px;
    text-align: center;
    margin: 20px auto;
    padding: 8px 25px;
    font-size: 18px;
    color: black;
    transition: 0.25s;
  }

  .toSign {
    font-size: 25px;
    float: right;
    padding-right: 40px;
    color: #ffe2db;
  }

  .toSign:hover {
    color: rgb(255, 154, 254);
    cursor: pointer;
  }

  .btn:hover {
    cursor: pointer;
    background-image: linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee689c 66%, #ee689c 100%);
  }

  .login #signUp {
    display: none;
  }

  .register #signIn {
    display: none;
  }
</style>
