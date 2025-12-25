import type { App } from 'vue'

/**
 * Register global directives
 */
export function setupDirectives(app: App) {
  // Permission directive
  app.directive('permission', {
    mounted(el, binding) {
      const { value } = binding
      const userPermissions = [] // Get from store
      
      if (value && !userPermissions.includes(value)) {
        el.parentNode?.removeChild(el)
      }
    },
  })

  // Loading directive
  app.directive('loading', {
    mounted(el, binding) {
      if (binding.value) {
        el.style.opacity = '0.5'
        el.style.pointerEvents = 'none'
      }
    },
    updated(el, binding) {
      if (binding.value) {
        el.style.opacity = '0.5'
        el.style.pointerEvents = 'none'
      } else {
        el.style.opacity = '1'
        el.style.pointerEvents = 'auto'
      }
    },
  })
}
