<template>
    <div><button id="title" @click="sendProcess()">{{ version }}</button>
    <button id="title" @click="checkUpdate">checkUpdate</button></div>
</template>
<script>

const ipcRenderer = require('electron').ipcRenderer
export default {
  name: 'updateBtn',
  data () {
    return {
      version: 'no updates ready'
    }
  },
  mounted: function () {
    // alert(0)
    // wait for an updateReady message
    this.$nextTick(function () {
      // this.txt = 'yyyy'
      alert(this.version)
      ipcRenderer.on('updateReady', function (event, version) {
        this.version = `current version: ${version}`
      })
    })
  },
  methods: {
    checkUpdate () {
      // autoUpdater.checkForUpdates()
    },
    sendProcess () {
      // ipcRenderer.send('quitAndInstall')
    }
  }
}
</script>
<style>
</style>


