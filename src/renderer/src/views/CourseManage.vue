<template>
  <div class="course-manage">
    <a-page-header
      title="课程管理"
      sub-title="管理所有课程信息"
      style="background: #ffffff; border: 1px solid #e8e8e8; margin-bottom: 24px;"
    />

    <div class="content">
      <!-- 操作区域 -->
      <a-card class="action-card" style="background: #ffffff; border: 1px solid #e8e8e8; margin-bottom: 24px;">
        <a-row justify="space-between" align="middle">
          <a-col :span="12">
            <a-space>
              <a-input-search
                v-model:value="searchText"
                placeholder="搜索课程名称或代码"
                style="width: 300px"
                @search="handleSearch"
                allow-clear
              />
              <a-select
                v-model:value="filterStatus"
                placeholder="选择状态"
                style="width: 120px"
                allow-clear
                @change="handleFilter"
              >
                <a-select-option value="active">活跃</a-select-option>
                <a-select-option value="inactive">停用</a-select-option>
              </a-select>
              <a-button @click.stop.prevent="handleReset" style="pointer-events: auto; position: relative; z-index: 1;">
                <template #icon>
                  <ReloadOutlined />
                </template>
                重置
              </a-button>
            </a-space>
          </a-col>
          <a-col :span="12" style="text-align: right;">
            <a-button type="primary" @click.stop.prevent="showAddModal" style="pointer-events: auto;">
              <PlusOutlined />
              新增课程
            </a-button>
          </a-col>
        </a-row>
      </a-card>

      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px;">
        <a-col :span="8">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="总课程数" :value="filteredData.length" />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="活跃课程" :value="activeCoursesCount" />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="平均及格分" :value="averagePassingScore" />
          </a-card>
        </a-col>
      </a-row>

      <!-- 课程列表 -->
      <a-card
        title="课程列表"
        class="table-card"
        style="background: #ffffff; border: 1px solid #e8e8e8;"
      >
        <a-table
          :columns="columns"
          :data-source="filteredData"
          :pagination="pagination"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'passingScore'">
              <a-tag color="orange">{{ record.passingScore }}分</a-tag>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="link" size="small" @click="handleEdit(record)">
                  <EditOutlined />
                  编辑
                </a-button>
                <a-button type="link" size="small" @click="handleView(record)">
                  <EyeOutlined />
                  查看
                </a-button>
                <a-popconfirm
                  title="确定要删除这个课程吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDelete(record.id)"
                >
                  <a-button type="link" size="small" danger>
                    <DeleteOutlined />
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>

    <!-- 新增/编辑模态框 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      @ok="handleSubmit"
      @cancel="handleCancel"
      width="600px"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="课程名称" name="name">
              <a-input v-model:value="formData.name" placeholder="请输入课程名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="课程代码" name="code">
              <a-input v-model:value="formData.code" placeholder="请输入课程代码" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="及格分数" name="passingScore">
              <a-input-number
                v-model:value="formData.passingScore"
                :min="0"
                :max="100"
                style="width: 100%"
                placeholder="及格分数"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="课程状态" name="status">
              <a-select v-model:value="formData.status" placeholder="选择状态">
                <a-select-option value="active">活跃</a-select-option>
                <a-select-option value="inactive">停用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 详情模态框 -->
    <a-modal
      v-model:open="viewModalVisible"
      title="课程详情"
      :footer="null"
      width="600px"
    >
      <a-descriptions :column="2" bordered v-if="viewData">
        <a-descriptions-item label="课程名称">{{ viewData.name }}</a-descriptions-item>
        <a-descriptions-item label="课程代码">{{ viewData.code }}</a-descriptions-item>
        <a-descriptions-item label="及格分数">{{ viewData.passingScore }}分</a-descriptions-item>
        <a-descriptions-item label="课程状态">
          <a-tag :color="getStatusColor(viewData.status)">
            {{ getStatusText(viewData.status) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ viewData.createTime }}</a-descriptions-item>
        <a-descriptions-item label="更新时间">{{ viewData.updateTime || '无' }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'

// 使用全局的 CourseData 接口，在 env.d.ts 中定义

// 响应式数据
const searchText = ref('')
const filterStatus = ref('')
const modalVisible = ref(false)
const viewModalVisible = ref(false)
const modalTitle = ref('新增课程')
const editId = ref<number | null>(null)
const viewData = ref<CourseData | null>(null)
const formRef = ref()

// 表格列定义
const columns = [
  {
    title: '课程名称',
    dataIndex: 'name',
    key: 'name',
    width: 150
  },
  {
    title: '课程代码',
    dataIndex: 'code',
    key: 'code',
    width: 120
  },
  {
    title: '及格分数',
    dataIndex: 'passingScore',
    key: 'passingScore',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
]

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
  onChange: (page: number, pageSize: number) => {
    pagination.current = page
    pagination.pageSize = pageSize
  }
})

// 表单数据
const formData = reactive({
  name: '',
  code: '',
  passingScore: 60,
  status: 'active' as 'active' | 'inactive'
})

// 自定义验证规则
const validateCode = async (rule: any, value: string) => {
  if (!value) {
    return Promise.reject('请输入课程代码')
  }

  // 检查课程代码是否已存在
  const exists = await window.api.db.isCourseCodeExists(value, editId.value || undefined)
  if (exists) {
    return Promise.reject('课程代码已存在')
  }

  return Promise.resolve()
}

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入课程名称' }],
  code: [
    { required: true, message: '请输入课程代码' },
    { validator: validateCode, trigger: 'blur' }
  ],
  passingScore: [{ required: true, message: '请输入及格分数' }],
  status: [{ required: true, message: '请选择状态' }]
}

// 课程数据
const courseData = ref<CourseData[]>([])

// 加载课程数据
const loadCourses = async () => {
  try {
    courseData.value = await window.api.db.getAllCourses()
    pagination.total = courseData.value.length
  } catch (error) {
    console.error('加载课程数据失败:', error)
    message.error('加载数据失败')
  }
}

// 加载统计信息
const statistics = ref<{
  totalCourses: number
  activeCourses: number
  averagePassingScore: number
} | null>(null)

const loadStatistics = async () => {
  try {
    statistics.value = await window.api.db.getCourseStatistics()
  } catch (error) {
    console.error('加载统计信息失败:', error)
  }
}

// 计算属性
const filteredData = ref<CourseData[]>([])

const activeCoursesCount = computed(() => {
  return statistics.value?.activeCourses || 0
})

const averagePassingScore = computed(() => {
  return statistics.value?.averagePassingScore || 0
})

// 搜索函数
const performSearch = async () => {
  try {
    const searchQuery = searchText.value || undefined
    const statusQuery = filterStatus.value || undefined

    filteredData.value = await window.api.db.searchCourses(searchQuery, statusQuery)
    pagination.total = filteredData.value.length
  } catch (error) {
    console.error('搜索失败:', error)
    message.error('搜索失败')
    filteredData.value = courseData.value
    pagination.total = courseData.value.length
  }
}


const getStatusColor = (status: string) => {
  const colors = {
    active: 'green',
    inactive: 'red',
    completed: 'blue'
  }
  return colors[status as keyof typeof colors] || 'default'
}

const getStatusText = (status: string) => {
  const texts = {
    active: '活跃',
    inactive: '停用'
  }
  return texts[status as keyof typeof texts] || '未知'
}

// 方法
const handleSearch = async () => {
  pagination.current = 1
  await performSearch()
}

const handleFilter = async () => {
  pagination.current = 1
  await performSearch()
}

const handleReset = async () => {
  searchText.value = ''
  filterStatus.value = ''
  pagination.current = 1
  await performSearch()
}

const showAddModal = () => {
  modalTitle.value = '新增课程'
  editId.value = null
  resetForm()
  modalVisible.value = true
}

const handleEdit = (record: CourseData) => {
  modalTitle.value = '编辑课程'
  editId.value = record.id
  Object.assign(formData, record)
  modalVisible.value = true
}

const handleView = (record: CourseData) => {
  viewData.value = record
  viewModalVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    const success = await window.api.db.deleteCourse(id)
    if (success) {
      message.success('删除成功')
      await loadCourses()
      await loadStatistics()
      await performSearch()
    } else {
      message.error('删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    message.error('删除失败')
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()

    // 创建纯对象，避免 Vue 响应式对象的序列化问题
    const courseData = {
      name: formData.name,
      code: formData.code,
      passingScore: formData.passingScore,
      status: formData.status
    }

    if (editId.value) {
      // 编辑
      const success = await window.api.db.updateCourse(editId.value, courseData)
      if (success) {
        message.success('编辑成功')
        await loadCourses()
        await loadStatistics()
        await performSearch()
      } else {
        message.error('编辑失败')
      }
    } else {
      // 新增
      const newCourse = await window.api.db.addCourse(courseData)
      if (newCourse) {
        message.success('新增成功')
        await loadCourses()
        await loadStatistics()
        await performSearch()
      } else {
        message.error('新增失败')
      }
    }
    modalVisible.value = false
    resetForm()
  } catch (error) {
    console.error('提交失败:', error)
    message.error('提交失败：' + error.message)
  }
}

const handleCancel = () => {
  modalVisible.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    code: '',
    passingScore: 60,
    status: 'active'
  })
  formRef.value?.resetFields()
}

onMounted(async () => {
  await loadCourses()
  await loadStatistics()
  await performSearch()
})
</script>

<style scoped>
.course-manage {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100%;
}

.content {
  max-width: 1400px;
  margin: 0 auto;
}

.action-card :deep(.ant-card-body) {
  background: #ffffff;
}

.table-card :deep(.ant-card-head) {
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.table-card :deep(.ant-card-head-title) {
  color: rgba(0, 0, 0, 0.85);
}

.table-card :deep(.ant-card-body) {
  background: #ffffff;
  padding: 0;
}

.table-card :deep(.ant-table) {
  background: #ffffff;
}

.table-card :deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  color: rgba(0, 0, 0, 0.85);
  border-bottom: 1px solid #f0f0f0;
}

.table-card :deep(.ant-table-tbody > tr > td) {
  background: #ffffff;
  color: rgba(0, 0, 0, 0.85);
  border-bottom: 1px solid #f0f0f0;
}

.table-card :deep(.ant-table-tbody > tr:hover > td) {
  background: #fafafa !important;
}

.stat-card :deep(.ant-card-body) {
  background: #ffffff;
  text-align: center;
}

.stat-card :deep(.ant-statistic-title) {
  color: rgba(0, 0, 0, 0.65);
}

.stat-card :deep(.ant-statistic-content) {
  color: rgba(0, 0, 0, 0.85);
}

:deep(.ant-page-header) {
  background: #ffffff;
}

:deep(.ant-page-header-heading-title) {
  color: rgba(0, 0, 0, 0.85);
}

:deep(.ant-page-header-heading-sub-title) {
  color: rgba(0, 0, 0, 0.45);
}

:deep(.ant-modal-content) {
  background: #ffffff;
}

:deep(.ant-modal-header) {
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-modal-title) {
  color: rgba(0, 0, 0, 0.85);
}

:deep(.ant-modal-body) {
  background: #ffffff;
}

:deep(.ant-form-item-label > label) {
  color: rgba(0, 0, 0, 0.85);
}

/* Search input wrapper styling */
:deep(.ant-input-affix-wrapper) {
  background: #ffffff !important;
  border: 1px solid #d9d9d9 !important;
  color: rgba(0, 0, 0, 0.85) !important;
}

:deep(.ant-input-affix-wrapper:hover) {
  border-color: #40a9ff !important;
}

:deep(.ant-input-affix-wrapper-focused) {
  border-color: #40a9ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

/* Inner input within affix wrapper */
:deep(.ant-input-affix-wrapper .ant-input) {
  background: transparent !important;
  border: none !important;
  color: rgba(0, 0, 0, 0.85) !important;
  box-shadow: none !important;
}

/* Standalone inputs */
:deep(.ant-input:not(.ant-input-affix-wrapper .ant-input)) {
  background: #ffffff !important;
  border: 1px solid #d9d9d9 !important;
  color: rgba(0, 0, 0, 0.85) !important;
}

:deep(.ant-input:not(.ant-input-affix-wrapper .ant-input):hover) {
  border-color: #40a9ff !important;
}

:deep(.ant-input:not(.ant-input-affix-wrapper .ant-input):focus,
       .ant-input:not(.ant-input-affix-wrapper .ant-input).ant-input-focused) {
  border-color: #40a9ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

:deep(.ant-input-affix-wrapper .ant-input-suffix) {
  color: rgba(0, 0, 0, 0.65) !important;
}

:deep(.ant-select .ant-select-selector) {
  background: #ffffff !important;
  border: 1px solid #d9d9d9 !important;
  color: rgba(0, 0, 0, 0.85) !important;
}

:deep(.ant-select:hover .ant-select-selector) {
  border-color: #40a9ff !important;
}

:deep(.ant-select-focused .ant-select-selector) {
  border-color: #40a9ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

:deep(.ant-select-selection-item) {
  color: rgba(0, 0, 0, 0.85) !important;
}

:deep(.ant-select-selection-placeholder) {
  color: rgba(0, 0, 0, 0.45) !important;
}

:deep(.ant-textarea) {
  background: #ffffff !important;
  border: 1px solid #d9d9d9 !important;
  color: rgba(0, 0, 0, 0.85) !important;
}

:deep(.ant-textarea:hover) {
  border-color: #40a9ff !important;
}

:deep(.ant-textarea:focus, .ant-textarea-focused) {
  border-color: #40a9ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

:deep(.ant-input-number) {
  width: 100%;
}

:deep(.ant-input-number-input) {
  background: #ffffff !important;
  border: 1px solid #d9d9d9 !important;
  color: rgba(0, 0, 0, 0.85) !important;
}

:deep(.ant-input-number:hover .ant-input-number-input) {
  border-color: #40a9ff !important;
}

:deep(.ant-input-number-focused .ant-input-number-input) {
  border-color: #40a9ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

:deep(.ant-descriptions-item-label) {
  color: rgba(0, 0, 0, 0.65);
}

:deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.85);
}

/* Light mode scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>