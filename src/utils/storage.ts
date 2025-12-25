/**
 * Local Storage and Session Storage utility wrapper
 * Provides type-safe storage with JSON serialization
 */

interface StorageOptions {
  expire?: number // Expiration time in milliseconds
}

interface StorageData<T> {
  value: T
  expire?: number
}

/**
 * Set item to storage
 * @param key Storage key
 * @param value Value to store
 * @param options Storage options
 * @param isSession Use sessionStorage instead of localStorage
 */
export function setStorage<T>(
  key: string,
  value: T,
  options?: StorageOptions,
  isSession = false
): void {
  const storage = isSession ? sessionStorage : localStorage
  const data: StorageData<T> = {
    value,
    expire: options?.expire ? Date.now() + options.expire : undefined,
  }
  storage.setItem(key, JSON.stringify(data))
}

/**
 * Get item from storage
 * @param key Storage key
 * @param isSession Use sessionStorage instead of localStorage
 * @returns Stored value or null if not found or expired
 */
export function getStorage<T>(key: string, isSession = false): T | null {
  const storage = isSession ? sessionStorage : localStorage
  const item = storage.getItem(key)
  if (!item) return null

  try {
    const data: StorageData<T> = JSON.parse(item)
    
    // Check if expired
    if (data.expire && Date.now() > data.expire) {
      removeStorage(key, isSession)
      return null
    }
    
    return data.value
  } catch (error) {
    console.error('Error parsing storage data:', error)
    return null
  }
}

/**
 * Remove item from storage
 * @param key Storage key
 * @param isSession Use sessionStorage instead of localStorage
 */
export function removeStorage(key: string, isSession = false): void {
  const storage = isSession ? sessionStorage : localStorage
  storage.removeItem(key)
}

/**
 * Clear all items from storage
 * @param isSession Use sessionStorage instead of localStorage
 */
export function clearStorage(isSession = false): void {
  const storage = isSession ? sessionStorage : localStorage
  storage.clear()
}

/**
 * Get all keys from storage
 * @param isSession Use sessionStorage instead of localStorage
 */
export function getStorageKeys(isSession = false): string[] {
  const storage = isSession ? sessionStorage : localStorage
  return Object.keys(storage)
}
