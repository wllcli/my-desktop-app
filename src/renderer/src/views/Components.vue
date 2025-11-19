<template>
  <div class="components-page">
    <a-page-header title="组件演示" sub-title="Ant Design Vue 组件库展示" />

    <div class="content">
      <!-- 按钮组件 -->
      <a-card title="按钮组件" class="demo-card">
        <a-space wrap>
          <a-button type="primary">主要按钮</a-button>
          <a-button>默认按钮</a-button>
          <a-button type="dashed">虚线按钮</a-button>
          <a-button type="link">链接按钮</a-button>
          <a-button type="text">文本按钮</a-button>
        </a-space>
      </a-card>

      <!-- 表单组件 -->
      <a-card title="表单组件" class="demo-card">
        <a-form :model="formData" layout="inline">
          <a-form-item label="输入框">
            <a-input v-model:value="formData.input" placeholder="请输入内容" />
          </a-form-item>
          <a-form-item label="选择器">
            <a-select
              v-model:value="formData.select"
              style="width: 120px"
              placeholder="选择"
            >
              <a-select-option value="option1">选项1</a-select-option>
              <a-select-option value="option2">选项2</a-select-option>
              <a-select-option value="option3">选项3</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="日期选择">
            <a-date-picker v-model:value="formData.date" />
          </a-form-item>
        </a-form>
      </a-card>

      <!-- 消息提示 -->
      <a-card title="消息提示" class="demo-card">
        <a-space wrap>
          <a-button @click="showSuccess">成功</a-button>
          <a-button @click="showError">错误</a-button>
          <a-button @click="showWarning">警告</a-button>
          <a-button @click="showInfo">信息</a-button>
        </a-space>
      </a-card>

      <!-- 表格组件 -->
      <a-card title="表格组件" class="demo-card">
        <a-table
          :columns="columns"
          :data-source="tableData"
          :pagination="{ pageSize: 5 }"
          size="middle"
        />
      </a-card>

      <!-- 标签页 -->
      <a-card title="标签页组件" class="demo-card">
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="标签1">
            <p>这是第一个标签页的内容</p>
          </a-tab-pane>
          <a-tab-pane key="2" tab="标签2">
            <p>这是第二个标签页的内容</p>
          </a-tab-pane>
          <a-tab-pane key="3" tab="标签3">
            <p>这是第三个标签页的内容</p>
          </a-tab-pane>
        </a-tabs>
      </a-card>

      <!-- 统计卡片 -->
      <a-card title="统计卡片" class="demo-card">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-statistic title="总访问量" :value="1128" style="margin-right: 50px" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="活跃用户" :value="93" suffix="人" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="完成率" :value="93.3" suffix="%" :precision="1" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="响应时间" :value="2.5" suffix="秒" :precision="1" />
          </a-col>
        </a-row>
      </a-card>

      <!-- 进度条 -->
      <a-card title="进度条组件" class="demo-card">
        <a-space direction="vertical" style="width: 100%">
          <div>
            <span>下载进度：</span>
            <a-progress :percent="75" status="active" />
          </div>
          <div>
            <span>处理进度：</span>
            <a-progress :percent="45" :stroke-color="gradient" />
          </div>
          <div>
            <span>完成状态：</span>
            <a-progress :percent="100" status="success" />
          </div>
        </a-space>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'

// 表单数据
const formData = reactive({
  input: '',
  select: undefined,
  date: undefined
})

// 标签页状态
const activeTab = ref('1')

// 表格配置
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  }
]

const tableData = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区',
    status: '在线'
  },
  {
    key: '2',
    name: '李四',
    age: 28,
    address: '上海市浦东新区',
    status: '离线'
  },
  {
    key: '3',
    name: '王五',
    age: 35,
    address: '广州市天河区',
    status: '在线'
  },
  {
    key: '4',
    name: '赵六',
    age: 25,
    address: '深圳市南山区',
    status: '忙碌'
  },
  {
    key: '5',
    name: '钱七',
    age: 30,
    address: '杭州市西湖区',
    status: '在线'
  }
]

// 进度条渐变色
const gradient = {
  '0%': '#108ee9',
  '100%': '#87d068'
}

// 消息提示方法
const showSuccess = () => {
  message.success('操作成功！')
}

const showError = () => {
  message.error('操作失败，请重试！')
}

const showWarning = () => {
  message.warning('请注意相关操作！')
}

const showInfo = () => {
  message.info('这是一条信息提示！')
}
</script>

<style scoped>
.components-page {
  padding: 24px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-card {
  margin-bottom: 24px;
}

.demo-card :deep(.ant-card-head) {
  border-bottom: 2px solid #f0f0f0;
}
</style>