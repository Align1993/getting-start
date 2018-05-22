<template>
  <div id="app">
    <update-btn></update-btn>
    <router-view></router-view>
  </div>
</template>

<script>
  import UpdateBtn from '@/components/public/UpdateBtn'
  export default {
    name: 'getting-start',
    components: {UpdateBtn}
  }
</script>

<style>
  /* CSS */
</style>
