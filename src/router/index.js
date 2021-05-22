import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Panel from '../views/Panel.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/panel',
      name: 'Panel',
      component: Panel
    },
    {
      path: '*',
      name: 'Home',
      component: Home
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
