import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/**
 * Create Pinia instance with persistence plugin
 */
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
