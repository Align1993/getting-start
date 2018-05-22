<template>
    <div><button @click="sendProcess()">{{ txt }}</button></div>
</template>
<script>
export default {
  name: 'updateBtn',
  data () {
    return {
      ipcRenderer: require('electron').ipcRenderer,
      txt: 'no updates ready'
    }
  },
  mounted: function () {
    // alert(0)
    // wait for an updateReady message
    // this.$nextTick(function () {
    //   // this.txt = 'yyyy'
    //   var _this = this
    //   _this.ipcRenderer.on('updateReady', function (event, text) {
    //     _this.txt = 'new version ready!'
    //   })
    // })
  },
  methods: {
    sendProcess () {
      this.ipcRenderer.send('quitAndInstall')
    }
  }
}
</script>
<style>
</style>


