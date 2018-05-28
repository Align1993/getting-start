<template>
  <div>
    <button class="demo-button" @click="getVersionInfo">{{ electronVersion }}</button>
    <button class="demo-button" @click="getAppInfo">{{ appInfo }}</button>
    <button class="demo-button" @click="getAppVersion">{{ appVersion }}</button>
    <button id="shortcuts-demo-toggle" class="js-container-target demo-toggle-button">Register a global keyboard shortcut(CommandOrControl+Alt+K)</button>
  </div>
</template>
<script type="text/javascript">
const ipcR = require('electron').ipcRenderer
export default {
  name: 'version-info',
  data () {
    return {
      electronVersion: 'getVersionInfo',
      appInfo: 'appInfo',
      appVersion: 'appVersion'
    }
  },
  mounted () {
    this.addListener()
  },
  methods: {
    addListener () {
      var _this = this
      ipcR.on('got-app-path', function (event, path) {
        _this.appInfo = `This app is located at: ${path}`
      })
      ipcR.on('got-app-version', function (event, version) {
        _this.appVersion = `current version: ${version}`
      })
    },
    getVersionInfo () {
      this.electronVersion = process.versions.electron
    },
    getAppInfo () {
      ipcR.send('get-app-path')
    },
    getAppVersion () {
      ipcR.send('get-app-version')
    }
  }
}
</script>
<style>
</style>

