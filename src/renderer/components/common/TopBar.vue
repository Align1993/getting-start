<template>
  <div>
    <section id="tool-bar">
      <div id="minimize" @click="winApi('minimize')"></div> 
      <div id="close" @click="winApi('close')"></div>
    </section>
  </div>
</template>
<script>
const ipcR = require('electron').ipcRenderer
export default {
  name: 'top-bar',
  methods: {
    winApi (api) {
      ipcR.send(api)
    }
  }
}
</script>
<style lang="less">
  #tool-bar{
    display: flex;
    justify-content: flex-end;
    height: 32px;
    div {
      flex: 1;
      max-width: 32px;
      cursor: pointer;
    }
    #minimize {
      background: url('../../assets/image/window-minimize.png');
      margin-right: 10px;
    }
    #close {
      background: url('../../assets/image/close.png')
    }
  }
</style>





