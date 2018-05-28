<template>
  <div>
    <label for="">自动更新<input type="radio" name="updateOptions" value="0" v-modal="updateOptions" checked></label>
    <label for="">手动更新<input type="radio" name="updateOptions" value="1" v-modal="updateOptions"></label>
    <button @click="save">保存</button>
   </div>  
</template>
<script>
const { ipcRenderer } = require('electron')
export default {
  name: 'update-setup',
  data  () {
    return {
      updateOptions: 0
    }
  },
  methods: {
    save () {
      var _this = this
      localStorage.setItem('updateOptions', _this.updateOptions)
      ipcRenderer.send('close-update-setup')
    }
  }
}
</script>
