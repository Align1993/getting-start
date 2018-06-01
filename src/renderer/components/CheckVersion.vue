<template>
  <div>
    <div class="container">
      <div class="css_left"></div>
      <div class="css_right">
        <section>
          {{ content }}
        </section>
      </div>
    </div>
  </div>
</template>
<script>
const ipcRenderer = require('electron').ipcRenderer
export default {
  name: 'check-update',
  data () {
    return {
      content: ''
    }
  },
  mounted () {
    var _this = this
    ipcRenderer.send('checkVersion')
    ipcRenderer.on('message', function (event, text) {
      _this.content = text
      console.log(text)
    })
  }
}
</script>
<style lang='less'>
  @import "../assets/common/base.less";
  .container {
    display: flex;
    width: 600px;
    height: 460px;
    div {
      flex: 1;
      height: 460px;
      box-sizing: border-box
    }
    .css_left {
      max-width: 220px;
      background: blue
    }
    .css_right {
      border: 1px solid
    }
  }
</style>
