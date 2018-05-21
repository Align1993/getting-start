<template>
  <div id="app">
    <router-view></router-view>
     <button id="ready" onClick="ipcRenderer.send('quitAndInstall')">no updates ready</button>
  </div>
</template>

<script>
  const ipcRenderer = require('electron').ipcRenderer
  // wait for an updateReady message
  ipcRenderer.on('updateReady', function (event, text) {
    // changes the text of the button
    var container = document.getElementById('ready')
    container.innerHTML = 'new version ready!'
  })
  export default {
    name: 'getting-start'
  }
</script>

<style>
  /* CSS */
</style>
