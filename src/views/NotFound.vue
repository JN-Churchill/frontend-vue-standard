<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404</h1>
      <p>Page Not Found</p>
      <el-button type="primary" @click="goHome">Back to Home</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;

  .not-found-content {
    text-align: center;

    h1 {
      font-size: 120px;
      margin: 0;
      color: #409eff;
    }

    p {
      font-size: 24px;
      margin: 20px 0 40px;
      color: #666;
    }
  }
}
</style>
