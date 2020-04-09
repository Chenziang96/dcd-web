<template>
  <div class="background">
    <div class="login">
      <h1 class="h1">Login</h1>
      <div>
        <input type="text" placeholder="Username" class="usn">
      </div>
      <div >
        <input type="password" placeholder="Password" class="psd">
      </div>
      <button class="btn" @click="submit()">login</button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Login",
        methods:{
          submit(){
            this.$router.push('/home');
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
    text-shadow: 2px 2px 2px #c1beb2;    /*字体添加阴影效果*/
    border: 2px solid black;
    border-radius: 35px;
    letter-spacing: 5px;
    text-align: center;
    margin: 20px auto;
    padding: 10px 40px;
    font-size: 25px;
    transition: 0.25s;
  }

  .btn:hover {
    font-size: 35px;
    background-image: linear-gradient(to right,#b8cbb8 0%,#b8cbb8 0%,#b465da 0%,#cf6cc9 33%,#ee689c 66%,#ee689c 100%);
  }

</style>
