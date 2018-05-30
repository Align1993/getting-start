<template>
  <h1>检测中。。。</h1>  
</template>
<script>
const ipcRenderer = require('electron').ipcRenderer
export default {
  name: 'checking-page',
  data () {
    return {
      msg: '更新检测中...'
    }
  }
}
</script>
