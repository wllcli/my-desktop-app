import type {RouteRecordRaw} from 'vue-router';


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/home',
    children: [
      {
      path: '/home',
      component: () => import('pages/IndexPage.vue'),
      meta: {title: '首页', icon: 'dashboard', isKeepAlive: true}
      },
      {
        path: '/tomato',
        component: () => import('pages/tomato-clock/index.vue'),
        meta: {title: '白噪音', icon: 'headphones', isKeepAlive: true}
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
