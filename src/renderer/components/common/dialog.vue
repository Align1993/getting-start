<template>
  <div v-show="show" class="mask-bg-fade">
        <div class="mask-bg"></div>
        <div class="content">{{msg}}</div>
 </div>
</template>
<script>
export default {
  name: 'v-dialog',
  props: ['show', 'msg']
}
</script>
<style>
  .mask-bg {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #333;
    opacity: 0.5;
  }
  .content {
    position: absolute;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 300px;
    height: 300px;
    line-height: 200px;
    border-radius: 6px;
    opacity: 1;
    background-color: #fff;
    box-shadow: 0 1px 1px 1px #333  
  }
  .content {
    text-align: center;
  }
</style>
