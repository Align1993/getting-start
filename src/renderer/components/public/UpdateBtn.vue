<template>
    <div><button id="title" @click="sendProcess()">{{ version }}</button>
    <button id="title" @click="checkUpdate">{{ msg }} 点我检查更新</button></div>
</template>
<script>

const ipcRenderer = require('electron').ipcRenderer
export default {
  name: 'updateBtn',
  data () {
    return {
      version: 'no updates ready',
      msg: ''
    }
  },
  beforeMount () {
    this.getVersion()
  },
  mounted: function () {
  },
  methods: {
    getVersion () {
      var _this = this
      ipcRenderer.send('get-app-version')
      ipcRenderer.on('got-app-version', function (event, version) {
        _this.msg = `current version: ${version}`
      })
    },
    checkUpdate () {
      var _this = this
      ipcRenderer.send('checkForUpdates')
      ipcRenderer.on('updateReady', function (event, text) {
        alert('updateReady!')
        _this.msg = 'new version ready!'
        _this.version = '点我更新吧'
      })
    },
    sendProcess () {
      ipcRenderer.send('quitAndInstall')
    }
  }
}
</script>
<style>
</style>


