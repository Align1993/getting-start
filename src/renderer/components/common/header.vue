<template>
   <div class="index-header-bar flex">
     <a href="javascript:" @click="createMenu">menu
     </a>
     <a href="javascript:" @click="closeWindow()">{{ msg }}</a>
     <ul class="menu" v-show="activeMenu">
       <li class="menu_item" v-for="item in memus" :id="item.id" @click="contextMenu">{{item.txt}}
         <ul>
           <li v-for="item in item.options" @click="handler(item.handler)">{{ item.txt }}</li>
         </ul>
       </li>
     </ul>
   </div> 
</template>
<script>
const { remote, BrowserWindow, ipcRenderer } = require('electron')
const { Menu, MenuItem } = remote
const menu = new Menu()
menu.append(new MenuItem({label: 'MenuItem1'}))
menu.append(new MenuItem({type: 'separator'}))
menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}))
export default {
  name: 'header-bar',
  data () {
    return {
      msg: 'close',
      memus: [
        {txt: '文件', options: [{txt: '退出', handler: 'quit'}, {txt: '检查更新', handler: 'checkUpdate'}]},
        {txt: '编辑'},
        {txt: '视图'},
        {txt: '功能'},
        {txt: '历史'},
        {txt: '设置', options: [{txt: '版本', handler: 'versionControl'}]}
      ],
      activeMenu: false
    }
  },
  mounted () {
    alert(0)
    if (localStorage.getItem('updateOptions') === '0') {
      ipcRenderer.send('checkForUpdates')
      ipcRenderer.on('updateReady', function (event, text) {
        alert('updateReady!')
      })
    }
  },
  methods: {
    createMenu () {
      this.activeMenu = !(this.activeMenu)
      // menu.popup({window: remote.getCurrentWindow()})
    },
    quit () {
      ipcRenderer.send('close')
    },
    contextMenu (e) {
      if (e.target.id === 'files') {
        menu.popup({window: remote.getCurrentWindow()})
      }
    },
    checkForUpdate () {
      // ipcRenderer.send('about')
      console.log(localStorage.getItem('updateOptions'))
      if (localStorage.getItem('updateOptions') === '1') {
        alert('updateReady1')
        ipcRenderer.send('checkForUpdates')
        ipcRenderer.on('updateReady', function (event, text) {
          alert('updateReady!')
        // _this.msg = 'new version ready!'
        // _this.version = '点我更新吧'
        })
      }
    },
    versionControl () {
      ipcRenderer.send('setup-update')
    },
    handler (arg) {
      if (arg === 'quit') {
        this.quit()
      }
      if (arg === 'checkUpdate') {
        this.checkForUpdate()
      }
      if (arg === 'versionControl') {
        this.versionControl()
      }
    }
  }
}
</script>
<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body {
    width: 100%
  }
  #app {
    display: flex;
    width: 100%;  
  }
  #app div.flex {
    flex: 1
  }
  .index-header-bar {
    height: 30px;
    background-color: pink
  }
  .index-header-bar a {
    display: inline-block;
    color: #333;
    margin: 0 20px;
    width: 30px;
    text-decoration: none;
    line-height: 30px;
    font-size: 20px;
    font-weight: bold   
  }
  .index-header-bar .menu {
    text-align: center;
    width: 60px;
    border: 1px solid #ccc;
  }
  .index-header-bar .menu li:hover ul {
    visibility: visible;
  }
  .menu_item {
    position: relative;
  }
  .menu_item ul {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 58px;
    width: 80px;
    border: 1px solid #ccc;
  }
  .index-header-bar ul li {
    list-style: none;
    height: 24px;
    line-height: 24px;
  }
  .index-header-bar ul li:hover {
    background-color: #ddd
  }
</style>
