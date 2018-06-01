<template>
  <div id="wrapper">
    <vue-dialog :show="true" :msg="text"></vue-dialog>
    <div class="login">
    <div class="login_2">
      <div class="input">
        <span class="icon_user"></span>
        <input type="text" v-model="username" placeholder="请输入账号">
      </div>
      <div class="input">
        <span class="icon_pwd"></span>
        <input type="password" v-model="password" placeholder="请输入密码" pattern="[0-9]*">
      </div>     
      <div class="button" @click="submit">
        登 录
      </div>    
    </div>
    <div class="login_bg"></div>
  </div>
  </div>
</template>

<script type="text/ecmascript-6">
   import VueDialog from '@/components/common/dialog'
   const ipcRenderer = require('electron').ipcRenderer
   export default {
     name: 'logining-page',
     components: {VueDialog},
     data () {
       return {
         version: '',
         text: '',
         username: '',
         password: ''
       }
     },
     mounted () {
       var _this = this
       ipcRenderer.send('checkVersion')
       ipcRenderer.on('message', function (event, text) {
         if (text === 'startChecking') {
           _this.text = '检测中...'
         } else if (text.version) {
           console.log(text.version)
         } else {
           console.log(text)
           _this.text = text
         }
       })
     },
     methods: {
       submit () {
         if (!this.check()) return false
         location.href = '#/index'
       },
       check () {
         if (this.username === '') {
           return false
         }
         if (this.password === '') {
           return false
         }
         return true
       }
     }
   }
 </script>

<style lang="less" >
  .login{
    width:100%;
    height:100%;  
    font-weight: 400;
    overflow: hidden;
    .login_bg{
      bottom:0;
      position: absolute;
      background: url('../assets/bg.png') no-repeat;
      background-size: 100%; 
      height: 270px;
      width: 100%;
      z-index: -1;
    }
    .flex{
      display: flex;
      display: -webkit-flex;
      justify-content:space-around;
      -webkit-justify-content:space-between;
    }     
    .login_2{
      padding: 0 90px;
      background: #fff;
      .input{
        border-bottom:1px solid #e6e6e6;
        padding: 40px 0;
        width: 100%;
        span{
          width: 36px;
          height: 36px;
          display: inline-block;
          margin-right: 60px;
          &.icon_user{
            background: url(../assets/icon_5.png) no-repeat;
            background-size: 100%;  
          } 
          &.icon_pwd{
            background: url(../assets/icon_6.png) no-repeat;
            background-size: 100%;  
          }                   
        }
        input{
          height: 36px;
          line-height: 36px;
          font-size: 34px;
          width: 300px;
        }         
      }
    }    
    .flex{
      display: flex;
      justify-content:space-around;
      -webkit-justify-content:space-between;
    } 
    .button{
      color:#fff;
      text-align: center;
      background:-webkit-gradient(linear, 0 0, right 0, from(#12befa), to(#0191fa)); 
      height: 94px;
      line-height: 94px;
      border-radius: 8px;
      font-size: 36px;
      margin-top: 80px;
    }
  }
</style>

