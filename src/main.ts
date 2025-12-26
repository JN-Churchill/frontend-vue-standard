import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import { setupElementPlus } from './plugins/element-plus'
import { setupI18n } from './plugins/i18n'
import { setupValidation } from './utils/validation'
import { setupPermissionDirective } from './directives/permission'
import { logger } from './utils/logger'

/**
 * Create Vue application instance
 */
const app = createApp(App)

/**
 * Setup plugins
 */
setupElementPlus(app)
setupI18n(app)
setupValidation()
setupPermissionDirective(app)

/**
 * Use router and store
 */
app.use(router)
app.use(pinia)

/**
 * Global error handler
 */
app.config.errorHandler = (err, instance, info) => {
  logger.error('Global error handler:', err, info)
  // Here you can integrate with error tracking services like Sentry
}

/**
 * Mount application
 */
app.mount('#app')

logger.info('Application initialized')
