<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <h2>My App</h2>
      </div>
      <div class="nav-links">
        <RouterLink to="/" class="nav-link">首页</RouterLink>
        <RouterLink to="/about" class="nav-link">关于</RouterLink>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--ev-c-bg-soft);
  border-bottom: 1px solid var(--ev-c-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-brand h2 {
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--ev-c-text-1);
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: var(--ev-c-bg-mute);
  color: var(--ev-c-brand);
}

.nav-link.router-link-active {
  background: var(--ev-c-brand);
  color: white;
}

.main-content {
  flex: 1;
  padding: 0;
  background: var(--ev-c-bg);
}
</style>
