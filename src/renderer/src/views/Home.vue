<template>
  <div class="home">
    <a-row justify="center" style="margin-bottom: 48px">
      <a-col>
        <h1 class="title">欢迎来到我的应用</h1>
        <p class="description">这是一个基于 Electron + Vue 3 + TypeScript 的桌面应用</p>
      </a-col>
    </a-row>

    <a-row :gutter="24" style="margin-bottom: 48px">
      <a-col :xs="24" :md="8" v-for="(feature, index) in features" :key="index">
        <a-card
          class="feature-card"
          :hoverable="true"
          :bordered="false"
          style="margin-bottom: 24px"
        >
          <template #cover>
            <div class="feature-icon">
              <component :is="feature.icon" />
            </div>
          </template>
          <a-card-meta :title="feature.title" :description="feature.description" />
        </a-card>
      </a-col>
    </a-row>

    <a-row justify="center">
      <a-space size="large">
        <a-button type="primary" size="large" @click="$router.push('/about')">
          了解更多
        </a-button>
        <a-button size="large" @click="$router.push('/components')">
          查看组件
        </a-button>
      </a-space>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import {
  ThunderboltOutlined,
  DashboardOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons-vue'

const features = [
  {
    icon: ThunderboltOutlined,
    title: '⚡ 快速开发',
    description: '使用 Vite 构建工具，享受极速的开发体验'
  },
  {
    icon: DashboardOutlined,
    title: '🎨 现代化界面',
    description: '基于 Vue 3 Composition API，构建响应式用户界面'
  },
  {
    icon: SafetyCertificateOutlined,
    title: '🔒 类型安全',
    description: '完整的 TypeScript 支持，提供更好的代码提示和错误检查'
  }
]
</script>

<style scoped>
.home {
  padding: 48px 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
}

.title {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  text-align: center;
}

.description {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 0;
  text-align: center;
  line-height: 1.6;
}

.feature-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  font-size: 48px;
  color: #1890ff;
}

.feature-card {
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  border: 1px solid #e8e8e8;
  transition: all 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(24, 144, 255, 0.15);
}

.feature-card :deep(.ant-card) {
  background: #ffffff;
  border: 1px solid #e8e8e8;
}

.feature-card :deep(.ant-card-body) {
  background: #ffffff;
}

.feature-card :deep(.ant-card-meta-title) {
  font-size: 16px;
  font-weight: 600;
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.feature-card :deep(.ant-card-meta-description) {
  font-size: 14px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
}
</style>