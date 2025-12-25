import { RouteRecordRaw } from 'vue-router'
import Layout from '@/components/Layout/Layout.vue'

/**
 * Demo module routes
 */
const demoRoutes: RouteRecordRaw[] = [
  {
    path: '/demo',
    component: Layout,
    redirect: '/demo/list',
    meta: {
      title: 'Demo',
      icon: 'Document',
    },
    children: [
      {
        path: 'list',
        name: 'DemoList',
        component: () => import('@/views/demo/DemoList.vue'),
        meta: {
          title: 'Demo List',
          icon: 'List',
          requiresAuth: true,
        },
      },
      {
        path: 'form/:id?',
        name: 'DemoForm',
        component: () => import('@/views/demo/DemoForm.vue'),
        meta: {
          title: 'Demo Form',
          icon: 'Edit',
          requiresAuth: true,
          hidden: true, // Hide from menu
        },
      },
    ],
  },
]

export default demoRoutes
