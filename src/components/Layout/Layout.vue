<template>
  <div class="layout-container">
    <el-container>
      <!-- Sidebar -->
      <el-aside :width="collapsed ? '64px' : '200px'" class="layout-aside">
        <div class="logo">
          <h1 v-if="!collapsed">Vue 3</h1>
          <h1 v-else>V3</h1>
        </div>
        <el-menu
          :default-active="activeMenu"
          :collapse="collapsed"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
        >
          <template v-for="route in menuRoutes" :key="route.path">
            <el-sub-menu v-if="route.children && route.children.length > 0" :index="route.path">
              <template #title>
                <el-icon v-if="route.meta?.icon">
                  <component :is="route.meta.icon" />
                </el-icon>
                <span>{{ route.meta?.title }}</span>
              </template>
              <el-menu-item
                v-for="child in route.children.filter(c => !c.meta?.hidden)"
                :key="child.path"
                :index="route.path + '/' + child.path"
              >
                <el-icon v-if="child.meta?.icon">
                  <component :is="child.meta.icon" />
                </el-icon>
                <span>{{ child.meta?.title }}</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="route.path">
              <el-icon v-if="route.meta?.icon">
                <component :is="route.meta.icon" />
              </el-icon>
              <span>{{ route.meta?.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>

      <!-- Main content -->
      <el-container>
        <!-- Header -->
        <el-header class="layout-header">
          <div class="header-left">
            <el-icon class="toggle-icon" @click="toggleCollapse">
              <Expand v-if="collapsed" />
              <Fold v-else />
            </el-icon>
          </div>
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-avatar :size="32" :src="userInfo?.avatar">
                  {{ userInfo?.nickname?.charAt(0) }}
                </el-avatar>
                <span class="username">{{ userInfo?.nickname || userInfo?.username }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="settings">设置</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- Main -->
        <el-main class="layout-main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { Expand, Fold } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

const collapsed = computed(() => appStore.collapsed)
const userInfo = computed(() => userStore.userInfo)
const activeMenu = computed(() => route.path)

// Filter routes for menu
const menuRoutes = computed(() => {
  return router.options.routes.filter(r => r.path !== '/' && r.path !== '/login' && !r.path.includes('*') && r.path !== '/404')
})

const toggleCollapse = () => {
  appStore.toggleCollapsed()
}

const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      await userStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  overflow: hidden;

  .el-container {
    height: 100%;
  }

  .layout-aside {
    background-color: #304156;
    transition: width 0.3s;

    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid #1f2d3d;

      h1 {
        margin: 0;
        font-size: 20px;
      }
    }

    .el-menu {
      border-right: none;
    }
  }

  .layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
    padding: 0 20px;

    .header-left {
      .toggle-icon {
        font-size: 24px;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #409eff;
        }
      }
    }

    .header-right {
      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;

        .username {
          font-size: 14px;
        }
      }
    }
  }

  .layout-main {
    background-color: #f0f2f5;
    padding: 20px;
    overflow-y: auto;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
