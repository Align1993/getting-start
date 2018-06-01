<template>
  <div>
    <h1>{{version}}</h1>
    <p>{{ msg }}</p>
  </div>
</template>
<script>
let msg
const ipcRenderer = require('electron').ipcRenderer
export default {
  name: 'checking-page',
  data () {
    return {
      version: '检测中...',
      msg: ''
    }
  },
  mounted () {
    var _this = this
    setTimeout(function () {
      _this.getVersion()
      ipcRenderer.send('checkVersion')
    }, 5000)
    ipcRenderer.on('message', function (event, text) {
      _this.msg = text
    })
  },
  beforeDestroy () {
    ipcRenderer.removeAllListeners()
  },
  methods: {
    getVersion () {
      var _this = this
      ipcRenderer.send('get-app-version')
      ipcRenderer.on('got-app-version', function (event, version) {
        _this.version = `Current version: ${version}`
      })
    }
  }
}
</script>