<template>
  <div class="flex_cont">
    <div class="left flex_item">
      会话联系人
    </div>
    <div class="center flex_item">
      <div class="center_body">我是聊天上下文</div>
      <div class="center_foot">
        我是消息输入域
      </div>
    </div> 
    <div class="right flex_item">右侧工具条</div>
  </div>
</template>
<script>
   export default {
     name: 'index-page'
   }
</script>
<style lang='less'>
 @import "../assets/common/base.less";
 .flex_cont{
   display: flex;
   .flex_item {
     flex: 1;
     height: 500px;
     border: 1px solid #ddd;
   }
   .left, .right{
     min-width: 300px;
     background: url('../assets/bg.png') no-repeat
   }
   .center {
     min-width: 400px;
     .center_body{
       height: 350px;
       line-height: 350px;
       border: 1px solid;
     }
   }
 }

</style>


