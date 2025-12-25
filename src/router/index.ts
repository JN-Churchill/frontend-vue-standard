import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { logger } from '@/utils/logger'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Import route modules
import demoRoutes from './modules/demo'

/**
 * Constant routes that don't require authentication
 */
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: 'Login',
      requiresAuth: false,
    },
  },
  {
    path: '/',
    redirect: '/demo',
  },
]

/**
 * Dynamic routes that require authentication
 */
const asyncRoutes: RouteRecordRaw[] = [
  ...demoRoutes,
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '404',
      requiresAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

/**
 * Create router instance
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...asyncRoutes],
  scrollBehavior() {
    return { top: 0 }
  },
})

/**
 * Route guard - Before each route navigation
 */
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  // Set page title
  document.title = (to.meta.title as string) || 'Vue 3 Enterprise Standard'

  const userStore = useUserStore()
  const isAuthenticated = !!userStore.token

  // Check if route requires authentication
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !isAuthenticated) {
    // Not authenticated, redirect to login
    logger.warn(`Access denied to ${to.path}, redirecting to login`)
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  } else if (to.path === '/login' && isAuthenticated) {
    // Already authenticated, redirect to home
    next({ path: '/' })
  } else if (requiresAuth && to.meta.roles) {
    // Check role permissions
    const roles = to.meta.roles as string[]
    if (userStore.hasAnyRole(roles)) {
      next()
    } else {
      logger.warn(`Access denied to ${to.path}, insufficient permissions`)
      next({ path: '/403' })
    }
  } else {
    // Allow navigation
    next()
  }
})

/**
 * Route guard - After each route navigation
 */
router.afterEach((to, from) => {
  NProgress.done()
  logger.info(`Navigated from ${from.path} to ${to.path}`)
})

/**
 * Route error handler
 */
router.onError((error) => {
  logger.error('Router error:', error)
  NProgress.done()
})

export default router
