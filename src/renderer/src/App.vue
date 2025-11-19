<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import {
  HomeOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'
</script>

<template>
  <a-layout id="app">
    <a-layout-header class="navbar">
      <div class="nav-brand">
        <h2>piupiu</h2>
      </div>
      <div class="nav-links">
        <RouterLink to="/" class="nav-link">
          <HomeOutlined />
          首页
        </RouterLink>
        <RouterLink to="/components" class="nav-link">
          <AppstoreOutlined />
          组件
        </RouterLink>
        <RouterLink to="/class-manage" class="nav-link">
          <TeamOutlined />
          班级
        </RouterLink>
        <RouterLink to="/about" class="nav-link">
          <InfoCircleOutlined />
          关于
        </RouterLink>
      </div>
    </a-layout-header>

    <a-layout-content class="main-content">
      <RouterView v-slot="{ Component, route }">
        <Transition
          :name="route.meta.transitionName || 'fade'"
          mode="out-in"
          appear
        >
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </a-layout-content>
  </a-layout>
</template>

<style>
#app {
  height: 100vh;
  background: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background: #ffffff !important;
  border-bottom: 1px solid #e8e8e8 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-brand h2 {
  margin: 0;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 20px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.65);
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 14px;
  background: transparent;
  box-sizing: border-box;
  white-space: nowrap;
  line-height: 1;
  height: 36px;
  min-width: fit-content;
  max-width: 120px;
}

.nav-link:hover {
  background: #f0f0f0;
  color: #1890ff;
}

.nav-link.router-link-active {
  background: #1890ff;
  color: white;
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.3);
  border: 1px solid rgba(24, 144, 255, 0.3);
  position: relative;
  z-index: 1;
}

.main-content {
  flex: 1;
  background: #ffffff;
  margin-top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
  overflow-x: hidden;
}

.main-content > * {
  min-height: calc(100vh - 64px);
}

/* Route transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}
</style>
