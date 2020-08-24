<template>
  <div class="background">
    <div class="login">
      <h1 class="h1">Login</h1>
      <div>
        <label>
          <input type="text" placeholder="Username" v-model="user.userName" class="usn">
        </label>
      </div>
      <div>
        <label>
          <input type="password" placeholder="Password" v-model="user.pwd" class="psd">
        </label>
      </div>
      <button class="btn" @click="login()">sign in</button>
<!--      <el-alert v-if="false" title="用户名和密码正确，登录成功！" type="success"></el-alert>-->
<!--      <el-alert v-else-if="true" title="用户名或密码错误，登录失败！" type="error"></el-alert>-->
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
        }
      }
    },
    methods: {
      login(){
        let temp = this.user;
        // console.log(getters.token());
        let storage = window.localStorage;
        console.log('1',Cookies.get());
        this.$http.post('log/login',temp)
          .then((res)=> {
            console.log(res);
            // storage.setItem('JESSIONID',)
            this.$router.push('/home');
          })
          .catch(function (error) {
            console.log(error);
          })
      },
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
    width: 20%;
    height: 40%;
    margin: 10% auto auto;
    text-align: center;
    background-color: #00000090;
    padding: 100px;
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
    margin: 15px auto;
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
    margin: 20px auto;
    text-align: center;
    border: 2px solid #FFFFFF;
    padding: 14px;
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
    font-size: 25px;
    color: black;
    transition: 0.25s;
  }

  .btn:hover {
    font-size: 35px;
    background-image: linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee689c 66%, #ee689c 100%);
  }
</style>
