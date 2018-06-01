<template>
  <div>
    {{ msg }}
  </div>  
</template>
<script>
const ipcRenderer = require('electron').ipcRenderer
export default {
  name: 'about-info',
  data () {
    return {
      msg: '下载中...'
    }
  },
  mounted () {
    var _this = this
    ipcRenderer.on('message', function (event, text) {
      if (text === 'downloaded') {
        _this.msg = '下载完成准备安装...'
      }
    })
  }
}
</script>