import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Components from '../views/Components.vue'
import ClassManage from '../views/ClassManage.vue'
import StudentManage from '../views/StudentManage.vue'
import CourseManage from '../views/CourseManage.vue'
import ScoreManage from '../views/ScoreManage.vue'

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
      path: '/student-manage',
      name: 'StudentManage',
      component: StudentManage,
      meta: {
        transitionName: 'slide-left'
      }
    },
    {
      path: '/course-manage',
      name: 'CourseManage',
      component: CourseManage,
      meta: {
        transitionName: 'slide-left'
      }
    },
    {
      path: '/score-manage',
      name: 'ScoreManage',
      component: ScoreManage,
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