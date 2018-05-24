<template>
  <button class="demo-button" @click="selectDirectory">{{ selectDirectoryInfo }}</button>   
</template>
<script>
const {ipcRenderer} = require('electron')
export default {
  name: 'select-directory',
  data () {
    return {
      selectDirectoryInfo: 'selectDirectory'
    }
  },
  mounted () {
    this.addListener()
  },
  methods: {
    addListener () {
      var _this = this
      ipcRenderer.on('selected-directory', function (event, path) {
        _this.selectDirectoryInfo = `you selected: ${path}`
      })
    },
    selectDirectory () {
      ipcRenderer.send('open-file-dialog')
    }
  }
}
</script>
<style></style>


