<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onErrorCaptured } from 'vue'
import { logger } from '@/utils/logger'

onMounted(() => {
  logger.info('Application mounted successfully')
})

// Global error handler
onErrorCaptured((err, instance, info) => {
  logger.error('Component error captured:', err, info)
  return false // Prevent error from propagating
})
</script>

<style lang="scss">
@import './styles/index.scss';
</style>
