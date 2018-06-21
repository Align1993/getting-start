<template>
    <div class="wrapper">
      <main v-if="state=== 'progress'" id="progress">
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
          <span>{{ updateInfo.percent }}%</span>
          <progress :value="updateInfo.percent" max="100"></progress>
        </div>
      </main>
      <section v-if="state !=='progress'" id="ready-section">
        <div class="flex logo-left "></div> 
        <div class="flex content-right">
          <div v-if="state === 'checking'" id="checking-view">
            检测中...
          </div>
          <div v-if="state === 'newVersion'" id="newVersion-view">
            <ul>
              <li>最新版本: v{{updateInfo.newVersion}}</li>
              <li>新版本大小: {{updateInfo.fileSize}} </li>
              <li class="grey-font">更新内容: {{updateInfo.detail}}</li>
            </ul>
            <div class="J_btn">
              <button @click="winApi('close')">取消</button>
              <button @click="checkVersion">确认更新</button>
            </div>
          </div>
          <div v-if="state === 'login'" class="login-wrapper">
            <top-bar></top-bar>
            <h3>账号密码登录</h3>
            <div class="login">
              <div class="login_2">
                <div class="input">
                  <span class="icon_user"></span>
                  <input type="text" v-model="username" @focus="dropDownState = false" placeholder="请输入账号">
                  <i class="drop_down" @click="dropDownState = !dropDownState"></i>
                  <ul class="userHistory" v-show="dropDownState">
                    <li v-for="item in userList"  @click="checkLogin(item.username)">{{item.username}}<i v-on:click.stop="removeUser(item.username)" class="icon_remove"></i></li>
                  </ul>
                </div>
                <div class="input">
                  <span class="icon_pwd"></span>
                  <input type="password" v-model="password" placeholder="请输入密码">
                </div>      
                <div>
                  <input type="checkbox" id="rememberPass" v-model="rememberPass"><label for="rememberPass">记住密码</label>
                  <input type="checkbox" id="autoLogin" v-model="autoLogin"><label for="autoLogin">自动登录</label>
                </div>
                <div class="fade-wrap">
                  <transition name="fade">
                    <div v-if="fadeIn"><i class="avator">登录中..</i></div>
                  </transition>
                </div>
                <div class="button" @click="submit">
                  {{btnTxt}}
                </div>    
              </div>
            </div> 
          </div>  
        </div> 
      </section>
    </div>
</template>

<script>
    // import db from '../../assets/common/js/datastore'
    import TopBar from '@/components/common/TopBar'
    const ipcR = require('electron').ipcRenderer
    export default {
      name: 'check-update',
      components: {TopBar},
      data () {
        return {
          fadeIn: false,
          updateInfo: {
            detail: '',
            newVersion: '',
            fileSize: '',
            percent: 0
          },
          isActive: false,
          btnTxt: '登录',
          dropDownState: false,
          userList: this.db.get('posts').value() || [],
          innerVersion: this.db.get('appInfo.innerVersion').value(),
          updateWay: '',
          username: this.db.get('posts[0].username').value() || '',
          rememberPass: this.db.get('posts[0].rememberPass').value() || false,
          autoLogin: this.db.get('posts[0].autoLogin').value() || false,
          password: this.db.get('posts[0].password').value() || '',
          state: 'checking',
          slideList: [
            {clickUrl: '#', desc: 'title', image: 'http://dummyimage.com/1745x492/f1d65b'},
            {clickUrl: '#', desc: 'title', image: 'http://dummyimage.com/1745x492/40b7ea'},
            {clickUrl: '#', desc: 'title', image: 'http://dummyimage.com/1745x492/e3c933'}
          ],
          currentIndex: 0,
          timer: ''
        }
      },
      watch: {
        autoLogin: function (val) {
          if (val) {
            this.rememberPass = val
          }
        },
        username: function (val) {
          var _this = this
          var list = this.userList
          var currentValue
          _this.password = ''
          _this.rememberPass = _this.autoLogin = false
          if (val === '') {
            return false
          }
          for (let i = 0; i < list.length; i++) {
            currentValue = list[i]
            console.log(currentValue)
            if (currentValue.username === val) {
              _this.password = currentValue.password
              _this.rememberPass = currentValue.rememberPass
              _this.autoLogin = currentValue.autoLogin
              if (_this.autoLogin) {
                _this.justLogin()
              }
            }
          }
        }
      },
      mounted () {
        this.$nextTick(() => {
          // this.db.set('posts', []).write()
          var _this = this
          var arr
          // ipcR.send('getStorePath')
          // ipcR.on('gotStorePath', function (event, text) {
          //   alert(text)
          // })
          if (this.autoLogin) {
            setTimeout(() => {
              _this.justLogin()
            }, 3000)
          }
          var info = this.updateInfo
          this.getUpdateApi(info, this)
          ipcR.send('put-in-tray')
          ipcR.on('message', function (event, state, text) {
            if (state === 3) {
              arr = text.split(',')
              // _this.state = 'progress'
              // _this.state = 'login'
              _this.updateInfo.percent = arr[0]
            } else if (state === 2) {
              alert(text)
              _this.state = 'login'
            } else if (state === 5) {
              alert(text)
              _this.state = 'login'
            } else if (state === 4) {
              alert(0)
              _this.db.set('appInfo.innerVersion', _this.innerVersion).write()
            }
          })
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
        removeUser (username) {
          var _this = this
          var currentValue
          var list = _this.db.get('posts').value()
          if (_this.username === username) {
            _this.username = ''
          }
          for (let i = 0; i < list.length; i++) {
            currentValue = list[i]
            if (currentValue.username === username) {
              alert(0)
              _this.db.get('posts').value().splice(i, 1)
            }
          }
        },
        justLogin (autoLogin) {
          if (autoLogin) {
            this.updateUserList()
            this.fadeIn = !this.fadeIn
            this.btnTxt = '取消'
            setTimeout(() => {
              if (this.fadeIn) {
                location.href = '#/index'
              }
            }, 5000)
          }
        },
        checkLogin (username) {
          this.username = username
          this.dropDownState = false
        },
        updateUserList () {
          var _this = this
          var password = (this.rememberPass || this.autoLogin) ? this.password : ''
          this.db.get('posts').value().map(function (currentValue, index) {
            console.log(currentValue.username)
            if (currentValue.username === _this.username) {
              _this.db.get('posts').value().splice(index, 1)
            }
          })
          _this.db.get('posts').unshift({
            username: _this.username,
            password: password,
            rememberPass: _this.rememberPass,
            autoLogin: _this.autoLogin
          }).write()
          if (_this.db.get('posts').size().value() > 5) {
            _this.db.get('posts').pop().write()
          }
        },
        winApi (api) {
          ipcR.send(api)
        },
        checkVersion () {
          if (this.updateWay === 'auto') {
            ipcR.send('checkVersion')
            this.state = 'progress'
          }
        },
        getUpdateApi (info, self) {
          // self.state = 'login'
          var data
          var innerVersionDB = this.db.get('appInfo.innerVersion').value()
          console.log(innerVersionDB)
          // var url = './static/api/update.json'
          var url = 'http://testone.free.ngrok.cc/update.json'
          var proxyurl = '/api/update.json'
          this.request(proxyurl, {method: 'get'}, (json) => {
            data = json.data
            if (data.license && data.innerVersion > innerVersionDB) {
              info.detail = data.detail
              info.newVersion = data.versionOuter
              info.fileSize = data.size
              self.state = 'newVersion'
              self.updateWay = data.updateWay
              self.innerVersion = data.innerVersion
            }
          })
        },
        bytesToSize (bytes) {
          if (bytes === 0) return '0 B'
          var i
          var k = 1024
          var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
          i = Math.floor(Math.log(bytes) / Math.log(k))
          return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
        },
        submit (event) {
          var handler = event.target.innerText
          var _this = this
          if (handler === '登录') {
            this.updateUserList()
            if (!this.check()) return false
            location.href = '#/index'
          } else {
            _this.fadeIn = false
            _this.btnTxt = '登录'
          }
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
        background: url(../../assets/image/left-logo.jpg) no-repeat;
      }
      .content-right {
        min-width: 380px;
        #checking-view {
          width: 342px;
          line-height: 422px;
          background: url(../../assets/image/search.png) no-repeat center 120px;
          text-align: center;

        }
        #checking-view, #newVersion-view {
          height: 422px;
          border: 19px solid #b2b2b2;
        }
        #newVersion-view {
          background: url(../../assets/image/newVersion-bg.png) no-repeat;
          ul {
            margin-top: 188px;
          }
          ul li {
            list-style: none;
            line-height: 30px;
          }
          ul .grey-font {
            color: grey
          }
          p {
            text-align: center;
            margin-top: 88px;
            color: grey;
          }
          .J_btn {
            text-align: center;
            button {
              margin-top: 10px;
            }
          }
        }
        h3 {
          margin-top: 30px;
          text-align: center;
          line-height: 40px;
        }
        .login-wrapper {
          .login{
            width: 320px;
            margin: 0 auto;
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
            position: relative;
            background: #fff;
            .input{
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
                .drop_down{
                  position: absolute;
                  top: 22px;
                  right: 30px;
                  height: 36px;
                  width: 48px;
                  background: url(../../assets/drop_down.png) no-repeat;
                }
                .userHistory {
                  position: absolute;
                  right: 7px;
                  top: 66px;
                  background: #fff;
                  width: 240px;
                  min-height: 142px;
                  padding: 0;
                  list-style: none;
                  border: 1px solid #0191fa;
                }
                .userHistory li {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding-left: 10px;
                  height: 30px;
                  line-height: 30px;
                  .icon_remove {
                    flex: 1;
                    height: 22px;
                    max-width: 22px;
                    background: url(../../assets/remove.png) no-repeat;
                    background-size: cover;
                  }
                }
                .userHistory li:hover {
                  background: #465f88
                }
                input{
                  height: 36px;
                  line-height: 36px;
                  font-size: 16px;
                  width: 230px;
                  padding: 0 5px;
                  border: 1px solid #ccc;
                  outline: none
                }       
              }
              .input:hover {
                input {
                  border-color: #0191fa;
                }
              }
              .fade-wrap {
                .fade-enter-active, .fade-leave-active {
                  transition: opacity .5s
                }
                .fade-enter, .fade-leave-active {
                  opacity: 0
                }
              }
              .fade-wrap div {
                position: absolute;
                top: 0;
                width: 100%;
                background: #ccc;
                height: 200px;
                line-height: 200px;
                text-align: center;
                .avator {
                  display: inline-block;
                  vertical-align: middle;
                  line-height: 60px;
                  width: 60px;
                  height: 60px;
                  border-radius: 50%;
                  border: 1px solid;
                  font-style: normal
                }
              }
            }    
            .flex{
              display: flex;
              justify-content:space-around;
              -webkit-justify-content:space-between;
            } 
            .button{
              cursor: pointer;
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
    #progress {
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
            top: 0;
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
          color: #333;
          text-align: center;
          z-index: 12;
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

