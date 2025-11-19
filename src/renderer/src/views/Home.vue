<template>
  <div class="home">
    <h1 class="title">欢迎来到我的应用</h1>
    <p class="description">这是一个基于 Electron + Vue 3 + TypeScript 的桌面应用</p>

    <div class="features">
      <div class="feature-card">
        <h3>⚡ 快速开发</h3>
        <p>使用 Vite 构建工具，享受极速的开发体验</p>
      </div>
      <div class="feature-card">
        <h3>🎨 现代化界面</h3>
        <p>基于 Vue 3 Composition API，构建响应式用户界面</p>
      </div>
      <div class="feature-card">
        <h3>🔒 类型安全</h3>
        <p>完整的 TypeScript 支持，提供更好的代码提示和错误检查</p>
      </div>
    </div>

    <div class="actions">
      <button @click="$router.push('/about')" class="btn btn-primary">
        了解更多
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 首页逻辑可以在这里添加
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.description {
  font-size: 1.2rem;
  color: var(--ev-c-text-2);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: var(--ev-c-bg-soft);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--ev-c-border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--ev-c-text-1);
}

.feature-card p {
  color: var(--ev-c-text-2);
  line-height: 1.5;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}
</style>