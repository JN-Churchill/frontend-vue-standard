import { RouteRecordRaw } from 'vue-router'
import Layout from '@/components/Layout/Layout.vue'

/**
 * System management module routes
 */
const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'Setting',
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          requiresAuth: true,
        },
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'UserFilled',
          requiresAuth: true,
        },
      },
      {
        path: 'permission',
        name: 'SystemPermission',
        component: () => import('@/views/system/permission/index.vue'),
        meta: {
          title: '权限管理',
          icon: 'Lock',
          requiresAuth: true,
        },
      },
      {
        path: 'job',
        name: 'SystemJob',
        component: () => import('@/views/system/job/index.vue'),
        meta: {
          title: '定时任务',
          icon: 'Timer',
          requiresAuth: true,
        },
      },
    ],
  },
]

export default systemRoutes
