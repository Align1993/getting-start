import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/menu',
      name: 'menu-slider',
      component: require('@/components/MenuSlider').default
    },
    {
      path: '/about',
      name: 'about-info',
      component: require('@/components/modal/about').default
    },
    {
      path: '/updateSetup',
      name: 'update-setup',
      component: require('@/components/modal/UpdateOptions').default
    },
    {
      path: '/checking',
      name: 'checking-page',
      component: require('@/components/CheckingUpdate').default
    },
    {
      path: '/index',
      name: 'index-page',
      component: require('@/components/IndexPage').default
    },
    {
      path: '/',
      name: 'check-update',
      component: require('@/components/CheckVersion').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
