<template>
  <div id="container">
    <div class="nav div-flex1">
    <button class="nav-button" v-for="item in titles" :id="item.id" @click="loadContent" :data-section="item.section">{{ item.text }}</button>
    <dialog-item></dialog-item>
    <app-info></app-info>
    <update-btn></update-btn>
    <a class="loginLink" href='#/login'>login</a>
    </div>
    <div class="main div-flex1">
      <div v-for="item in arr" :id="item" class="js-section section">{{ item }}</div>
    </div>
  </div>
</template>
<script>
import AppInfo from '@/components/system/app-information'
import DialogItem from '@/components/native-ui/dialog'
import UpdateBtn from '@/components/public/UpdateBtn'
export default {
  name: 'menu-slider',
  components: {AppInfo, DialogItem, UpdateBtn},
  data () {
    return {
      activeSectionButtonId: '0',
      titles: [
        {section: 'window', text: 'WINDOWS', active: true, id: 0},
        {section: 'menus', text: 'MENUS', active: false, id: 1},
        {section: 'system', text: 'SYSTEM', active: false, id: 2}
      ],
      arr: ['window', 'menus', 'system']
    }
  },
  methods: {
    loadContent (event) {
      this.handleSectionTrigger(event)
    },
    handleSectionTrigger (arg) {
      const sections = document.querySelectorAll('.js-section.is-shown') // hideallsection
      Array.prototype.forEach.call(sections, (section) => {
        section.classList.remove('is-shown')
      })
      const buttons = document.querySelectorAll('.nav-button.is-selected') // gray button
      Array.prototype.forEach.call(buttons, (button) => {
        button.classList.remove('is-selected')
      })
      arg.target.classList.add('is-selected') // active highlight
      // Display the current section
      const sectionId = arg.target.dataset.section
      document.getElementById(sectionId).classList.add('is-shown')
    }
  }
}
</script>
<style>
   #container {
    display: flex;
    height: 100%
   }
  .main {
    position: relative;
  }
  .nav {
   height: 100%; 
   width: 340px;
   background-color: darkgrey;
   overflow-x: hidden;
   overflow-y: auto;
   /* visibility: hidden;
   opacity: 0; */
   border-right: 1px solid #ccc;

 }
 .nav.is-shown {
   visibility: visible;
   opacity: 1;
 }
 .loginLink {
   display: block;
   line-height: 30px;
   padding: 10px;
   background-color:pink;
   color: #fff
 }
 button {
   display: block;
   line-height: 30px;
   margin:20px
 }
 .is-selected {
   background-color: blueviolet;
   color: #fff;
 }
</style>
