<template>
  <div class="about">
    <h1 class="title">关于应用</h1>

    <div class="about-content">
      <div class="app-info">
        <h2>应用信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">应用名称:</span>
            <span class="value">my-app</span>
          </div>
          <div class="info-item">
            <span class="label">版本:</span>
            <span class="value">1.0.0</span>
          </div>
          <div class="info-item">
            <span class="label">框架:</span>
            <span class="value">Electron + Vue 3 + TypeScript</span>
          </div>
        </div>
      </div>

      <div class="tech-stack">
        <h2>技术栈</h2>
        <div class="tech-list">
          <div class="tech-item">
            <div class="tech-icon">⚡</div>
            <div class="tech-details">
              <h4>Electron</h4>
              <p>跨平台桌面应用框架</p>
            </div>
          </div>
          <div class="tech-item">
            <div class="tech-icon">💚</div>
            <div class="tech-details">
              <h4>Vue 3</h4>
              <p>渐进式 JavaScript 框架</p>
            </div>
          </div>
          <div class="tech-item">
            <div class="tech-icon">📘</div>
            <div class="tech-details">
              <h4>TypeScript</h4>
              <p>JavaScript 的超集，提供类型支持</p>
            </div>
          </div>
          <div class="tech-item">
            <div class="tech-icon">🔧</div>
            <div class="tech-details">
              <h4>Vite</h4>
              <p>现代化的前端构建工具</p>
            </div>
          </div>
        </div>
      </div>

      <div class="versions-section">
        <h2>运行时版本</h2>
        <Versions />
      </div>
    </div>

    <div class="actions">
      <button @click="$router.push('/')" class="btn btn-secondary">
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Versions from '../components/Versions.vue'
</script>

<style scoped>
.about {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-content {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

.app-info, .tech-stack, .versions-section {
  background: var(--ev-c-bg-soft);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--ev-c-border);
}

.app-info h2, .tech-stack h2, .versions-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--ev-c-text-1);
}

.info-grid {
  display: grid;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--ev-c-border);
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: var(--ev-c-text-2);
}

.value {
  color: var(--ev-c-text-1);
}

.tech-list {
  display: grid;
  gap: 1rem;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--ev-c-bg);
  border-radius: 8px;
}

.tech-icon {
  font-size: 2rem;
  width: 60px;
  text-align: center;
}

.tech-details h4 {
  margin: 0 0 0.25rem 0;
  color: var(--ev-c-text-1);
}

.tech-details p {
  margin: 0;
  color: var(--ev-c-text-2);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
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

.btn-secondary {
  background: var(--ev-c-bg-soft);
  color: var(--ev-c-text-1);
  border: 1px solid var(--ev-c-border);
}

.btn-secondary:hover {
  background: var(--ev-c-bg-mute);
  transform: translateY(-2px);
}
</style>