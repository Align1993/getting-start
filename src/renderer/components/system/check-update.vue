<template>
    <div class="wrapper">
      <main v-if="state=== 'progress'" class="progress-page">
        <div class="carousel-wrap" id="carousel">
          <transition-group tag="ul" class="slide-ul" name="list">
            <li v-for="(list, index) in slideList" :key="index" v-show="index===currentIndex" @mouseenter="stop" @mouseleave="go">
              <a :href="list.clickUrl">
                <img :src="list.image" :alt="list.desc">
              </a>
            </li>
          </transition-group>
          <div class="carousel-items">
            <span v-for="(item, index) in slideList.length" :key="index" :class="{'active': index === currentIndex}" @mouseover="change(index)"></span>
          </div>
        </div>
        <div class="border-wrap">
          <span>{{ percent }}%</span>
          <progress :value="percent" max="100"></progress>
        </div>
      </main>
      <section v-if="state !=='progress'" id="ready-section">
        <div class="flex logo-left "></div> 
        <div class="flex content-right">
          <div v-if="state === 'checking'" style="line-height: 400px;text-align: center;">
            检测中...
          </div>
          <div v-if="state === 'newVersion'">
            <h1>发现新版本</h1>
            <dl>
              <dt>最新版本: {{newVersion}}</dt>
              <dt>新版本大小:</dt>
              <dt>更新内容: {{detail}}</dt>
            </dl>
          </div>
          <div v-if="state === 'login'" class="login-wrapper">
            <h3>账号密码登录</h3>
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
            </div> 
          </div>  
        </div> 
      </section>
    </div>
</template>

<script>
    const ipcR = require('electron').ipcRenderer
    export default {
      name: 'check-update',
      data () {
        return {
          detail: '',
          newVersion: '',
          username: '',
          password: '',
          percent: 0,
          state: 'newVersion',
          slideList: [
            {clickUrl: '#', desc: 'title', image: 'http://dummyimage.com/1745x492/f1d65b'},
            {clickUrl: '#', desc: 'title', image: 'http://dummyimage.com/1745x492/40b7ea'},
            {clickUrl: '#', desc: 'title', image: 'http://dummyimage.com/1745x492/e3c933'}
          ],
          currentIndex: 0,
          timer: ''
        }
      },
      mounted () {
        var _this = this
        ipcR.send('checkVersion')
        ipcR.on('message', function (event, state, text) {
          console.log(state)
          console.log(text)
          if (state === 3) {
            console.log()
            _this.state = 'progress'
            _this.percent = text
          } else if (state === 2) {
            _this.state = 'login'
          } else if (state === 1) {
            console.log()
            _this.state = 'newVersion'
            _this.newVersion = text
          }
        })
      },
      create () {
        this.$nextTick(() => {
          this.timer = setInterval(() => {
            this.autoPlay()
          }, 4000)
        })
      },
      methods: {
        bytesToSize (bytes) {
          if (bytes === 0) return '0 B'
          var i
          var k = 1024
          var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
          i = Math.floor(Math.log(bytes) / Math.log(k))
          return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
        },
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
        },
        go () {
          this.timer = setInterval(() => {
            this.autoPlay()
          }, 4000)
        },
        stop () {
          clearInterval(this.timer)
          this.timer = null
        },
        change (index) {
          this.currentIndex = index
        },
        autoPlay () {
          this.currentIndex++
          if (this.currentIndex > this.slideList.length - 1) {
            this.currentIndex = 0
          }
        }
      }
    }
</script>

<style scoped lang="less">
  .wrapper {
    width: 600px;
    height: 460px;
    overflow: hidden;
    #ready-section {
      height: 100%;
      display: flex;
      .flex {
        flex: 1
      }
      .logo-left {
        min-width: 220px;
        background: #1e8efe;
      }
      .content-right {
        min-width: 350px;
        padding-left: 30px;
        h3 {
          margin-top: 30px;
          text-align: center;
          line-height: 40px;
        }
        .login-wrapper {
          width: 320px;
          .login{
          width:100%;
          font-weight: 400;
          overflow: hidden;
          .login_bg{
            bottom:0;
            position: absolute;
            background: url('../../assets/bg.png') no-repeat;
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
            background: #fff;
            .input{
              border-bottom:1px solid #e6e6e6;
              padding: 16px 0;
              width: 100%;
                span{
                  width: 36px;
                  height: 36px;
                  display: inline-block;
                  margin-right: 30px;
                  &.icon_user{
                    background: url(../../assets/icon_5.png) no-repeat;
                    background-size: 100%;  
                  } 
                  &.icon_pwd{
                    background: url(../../assets/icon_6.png) no-repeat;
                    background-size: 100%;  
                  }                   
                }
                input{
                  height: 36px;
                  line-height: 36px;
                  font-size: 16px;
                  width: 240px;
                  border: none;
                  outline: none
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
              height: 44px;
              line-height: 44px;
              border-radius: 8px;
              font-size: 26px;
              margin-top: 40px;
            }
          }
        }
      }
    }
    .progress-page {
      .carousel-wrap {
        position: relative;
        height: 440px;
        width: 100%;
        overflow: hidden;
        background: #fff;
        .list-enter-to {
          transition: all 1s ease;
          transform: translateX(0);
        }
        .list-leave-active {
          transition: all 1s ease;
          transform: translateX(-100%)
        }

        .list-enter {
          transform: translateX(100%)
        }

        .list-leave {
          transform: translateX(0)
        }
        .slide-ul {
          width: 100%;
          height: 100%;
          li {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .carousel-items {
          position: absolute;
          z-index: 10;
          bottom: 30px;
          width: 100%;
          margin: 0 auto;
          text-align: center;
          font-size: 0;
          span {
            display: inline-block;
            height: 6px;
            width: 30px;
            background-color: #b2b2b2;
            cursor: pointer;
          }
          .active {
            background-color: orange
          }
        }
      }
      .border-wrap {
        position: relative;
        span {
          position: absolute;
          width: 100%;
          top: 1px;
          display: inline-block;
          color: #fff;
          text-align: center;
        }
        progress {
          width: 100%;
          background: #fff
        }
        progress::-webkit-progress-bar { 
          background: #fff;
        }  
        progress::-webkit-progress-value {
          background: #465f88;
        }
        progress::-webkit-progress-inner-element { 
          border-radius: 6px;
        }
        progress::-webkit-progress-value {
          border-radius: 6px;
        }
        progress::-webkit-progress-bar {
          border-radius: 6px;
        }
      }
    }
  }
  
  
  
</style>

