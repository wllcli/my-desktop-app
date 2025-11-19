import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Components from '../views/Components.vue'
import ClassManage from '../views/ClassManage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        transitionName: 'scale'
      }
    },
    {
      path: '/components',
      name: 'Components',
      component: Components,
      meta: {
        transitionName: 'slide-left'
      }
    },
    {
      path: '/class-manage',
      name: 'ClassManage',
      component: ClassManage,
      meta: {
        transitionName: 'slide-left'
      }
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {
        transitionName: 'scale'
      }
    }
  ]
})

export default router