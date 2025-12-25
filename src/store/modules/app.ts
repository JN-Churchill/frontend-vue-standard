import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * App store for global application state
 */
export const useAppStore = defineStore(
  'app',
  () => {
    // State
    const loading = ref(false)
    const loadingText = ref('Loading...')
    const collapsed = ref(false)
    const locale = ref('zh-CN')
    const theme = ref('light')

    /**
     * Set global loading state
     */
    const setLoading = (isLoading: boolean, text = 'Loading...') => {
      loading.value = isLoading
      loadingText.value = text
    }

    /**
     * Toggle sidebar collapsed state
     */
    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value
    }

    /**
     * Set sidebar collapsed state
     */
    const setCollapsed = (isCollapsed: boolean) => {
      collapsed.value = isCollapsed
    }

    /**
     * Set locale
     */
    const setLocale = (newLocale: string) => {
      locale.value = newLocale
    }

    /**
     * Set theme
     */
    const setTheme = (newTheme: string) => {
      theme.value = newTheme
      // Apply theme class to document
      document.documentElement.className = newTheme
    }

    return {
      // State
      loading,
      loadingText,
      collapsed,
      locale,
      theme,
      
      // Actions
      setLoading,
      toggleCollapsed,
      setCollapsed,
      setLocale,
      setTheme,
    }
  },
  {
    persist: {
      key: 'app',
      storage: localStorage,
      paths: ['collapsed', 'locale', 'theme'],
    },
  }
)
