<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'getting-start'
  }
</script>

<style>
  /* CSS */
  html, body {
    padding: 0;
    margin: 0;
    height: 100%;
  }
  #app {
    height: 100%;
    overflow: hidden;
  }
  /* .div-flex1 {
    flex: 1
  }
  .demo-button {
    line-height: 30px;
    height: 30px;
  }
  .section {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    color: var(--color-accent);
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    transform: translateX(-20px);
    transition: visibility 0s .12s linear , opacity .12s ease-in, transform .12s ease-in;
  }
  .is-shown {
    pointer-events: auto; 
    visibility: visible;
    opacity: 1;
    transform: translateX(0);
    transition: visibility 0s 0s linear , opacity .36s ease-out, transform .36s ease-out;
  } */
</style>
