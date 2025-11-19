<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import {
  HomeOutlined,
  InfoCircleOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue'
</script>

<template>
  <a-layout id="app">
    <a-layout-header class="navbar">
      <div class="nav-brand">
        <h2>My App</h2>
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
        <RouterLink to="/about" class="nav-link">
          <InfoCircleOutlined />
          关于
        </RouterLink>
      </div>
    </a-layout-header>

    <a-layout-content class="main-content">
      <RouterView />
    </a-layout-content>
  </a-layout>
</template>

<style>
#app {
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: #fff;
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
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.85);
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 14px;
}

.nav-link:hover {
  background: #f5f5f5;
  color: #1890ff;
}

.nav-link.router-link-active {
  background: #1890ff;
  color: white;
}

.main-content {
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
}
</style>
