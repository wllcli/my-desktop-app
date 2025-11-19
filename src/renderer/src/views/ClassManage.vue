<template>
  <div class="class-manage">
    <a-page-header
      title="班级管理"
      sub-title="管理所有班级信息"
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
                placeholder="搜索班级名称"
                style="width: 300px"
                @search="handleSearch"
                allow-clear
              />
              <a-select
                v-model:value="filterGrade"
                placeholder="选择年级"
                style="width: 120px"
                allow-clear
                @change="handleFilter"
              >
                <a-select-option value="一年级">一年级</a-select-option>
                <a-select-option value="二年级">二年级</a-select-option>
                <a-select-option value="三年级">三年级</a-select-option>
                <a-select-option value="四年级">四年级</a-select-option>
                <a-select-option value="五年级">五年级</a-select-option>
                <a-select-option value="六年级">六年级</a-select-option>
              </a-select>
            </a-space>
          </a-col>
          <a-col :span="12" style="text-align: right;">
            <a-button type="primary" @click="showAddModal">
              <PlusOutlined />
              新增班级
            </a-button>
          </a-col>
        </a-row>
      </a-card>

      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px;">
        <a-col :span="6">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="总班级数" :value="filteredData.length" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="总学生数" :value="totalStudents" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="活跃班级" :value="activeClasses" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="平均人数" :value="averageStudents" />
          </a-card>
        </a-col>
      </a-row>

      <!-- 班级列表 -->
      <a-card
        title="班级列表"
        class="table-card"
        style="background: #ffffff; border: 1px solid #e8e8e8;"
      >
        <a-table
          :columns="columns"
          :data-source="filteredData"
          :pagination="pagination"
          row-key="id"
          :scroll="{ x: 1200 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                {{ record.status === 'active' ? '活跃' : '停用' }}
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
                  title="确定要删除这个班级吗？"
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
        <a-form-item label="班级名称" name="name">
          <a-input v-model:value="formData.name" placeholder="请输入班级名称" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="年级" name="grade">
              <a-select v-model:value="formData.grade" placeholder="选择年级">
                <a-select-option value="一年级">一年级</a-select-option>
                <a-select-option value="二年级">二年级</a-select-option>
                <a-select-option value="三年级">三年级</a-select-option>
                <a-select-option value="四年级">四年级</a-select-option>
                <a-select-option value="五年级">五年级</a-select-option>
                <a-select-option value="六年级">六年级</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="学年" name="academicYear">
              <a-input v-model:value="formData.academicYear" placeholder="请输入学年，如：2024-2025" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="班级人数" name="studentCount">
              <a-input-number
                v-model:value="formData.studentCount"
                :min="1"
                :max="60"
                style="width: 100%"
                placeholder="学生人数"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态" name="status">
              <a-select v-model:value="formData.status" placeholder="选择状态">
                <a-select-option value="active">活跃</a-select-option>
                <a-select-option value="inactive">停用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="备注" name="description">
          <a-textarea
            v-model:value="formData.description"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 详情模态框 -->
    <a-modal
      v-model:open="viewModalVisible"
      title="班级详情"
      :footer="null"
      width="600px"
    >
      <a-descriptions :column="2" bordered v-if="viewData">
        <a-descriptions-item label="班级名称">{{ viewData.name }}</a-descriptions-item>
        <a-descriptions-item label="年级">{{ viewData.grade }}</a-descriptions-item>
        <a-descriptions-item label="学年">{{ viewData.academicYear }}</a-descriptions-item>
        <a-descriptions-item label="学生人数">{{ viewData.studentCount }}人</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="viewData.status === 'active' ? 'green' : 'red'">
            {{ viewData.status === 'active' ? '活跃' : '停用' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ viewData.createTime }}</a-descriptions-item>
        <a-descriptions-item label="备注" :span="2">{{ viewData.description || '无' }}</a-descriptions-item>
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
  EyeOutlined
} from '@ant-design/icons-vue'

// 班级数据接口
interface ClassData {
  id: number
  name: string
  grade: string
  academicYear: string
  studentCount: number
  status: 'active' | 'inactive'
  description: string
  createTime: string
}

// 响应式数据
const searchText = ref('')
const filterGrade = ref('')
const modalVisible = ref(false)
const viewModalVisible = ref(false)
const modalTitle = ref('新增班级')
const editId = ref<number | null>(null)
const viewData = ref<ClassData | null>(null)
const formRef = ref()

// 表格列定义
const columns = [
  {
    title: '班级名称',
    dataIndex: 'name',
    key: 'name',
    width: 120
  },
  {
    title: '年级',
    dataIndex: 'grade',
    key: 'grade',
    width: 80
  },
  {
    title: '学年',
    dataIndex: 'academicYear',
    key: 'academicYear',
    width: 120
  },
  {
    title: '学生人数',
    dataIndex: 'studentCount',
    key: 'studentCount',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80
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
  grade: '',
  academicYear: '',
  studentCount: 30,
  status: 'active' as 'active' | 'inactive',
  description: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入班级名称' }],
  grade: [{ required: true, message: '请选择年级' }],
  academicYear: [{ required: true, message: '请选择学年' }],
  studentCount: [{ required: true, message: '请输入学生人数' }]
}

// 模拟班级数据
const classData = ref<ClassData[]>([
  {
    id: 1,
    name: '一年级一班',
    grade: '一年级',
    academicYear: '2024-2025',
    studentCount: 32,
    status: 'active',
    description: '优秀班级，学习氛围浓厚',
    createTime: '2024-01-15 09:00:00'
  },
  {
    id: 2,
    name: '一年级二班',
    grade: '一年级',
    academicYear: '2024-2025',
    studentCount: 30,
    status: 'active',
    description: '',
    createTime: '2024-01-15 10:00:00'
  },
  {
    id: 3,
    name: '二年级三班',
    grade: '二年级',
    academicYear: '2024-2025',
    studentCount: 28,
    status: 'active',
    description: '数学特长班',
    createTime: '2024-01-16 08:30:00'
  },
  {
    id: 4,
    name: '三年级一班',
    grade: '三年级',
    academicYear: '2023-2024',
    studentCount: 35,
    status: 'inactive',
    description: '临时停课',
    createTime: '2024-01-10 14:00:00'
  },
  {
    id: 5,
    name: '四年级二班',
    grade: '四年级',
    academicYear: '2024-2025',
    studentCount: 33,
    status: 'active',
    description: '英语实验班',
    createTime: '2024-01-12 11:00:00'
  }
])

// 计算属性
const filteredData = computed(() => {
  let filtered = classData.value

  if (searchText.value) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchText.value.toLowerCase())
    )
  }

  if (filterGrade.value) {
    filtered = filtered.filter(item => item.grade === filterGrade.value)
  }

  pagination.total = filtered.length
  return filtered
})

const totalStudents = computed(() => {
  return classData.value.reduce((sum, item) => sum + item.studentCount, 0)
})

const activeClasses = computed(() => {
  return classData.value.filter(item => item.status === 'active').length
})

const averageStudents = computed(() => {
  if (classData.value.length === 0) return 0
  return Math.round(totalStudents.value / classData.value.length)
})

// 方法
const handleSearch = () => {
  pagination.current = 1
}

const handleFilter = () => {
  pagination.current = 1
}

const showAddModal = () => {
  modalTitle.value = '新增班级'
  editId.value = null
  resetForm()
  modalVisible.value = true
}

const handleEdit = (record: ClassData) => {
  modalTitle.value = '编辑班级'
  editId.value = record.id
  Object.assign(formData, record)
  modalVisible.value = true
}

const handleView = (record: ClassData) => {
  viewData.value = record
  viewModalVisible.value = true
}

const handleDelete = (id: number) => {
  const index = classData.value.findIndex(item => item.id === id)
  if (index !== -1) {
    classData.value.splice(index, 1)
    message.success('删除成功')
  }
}

const handleSubmit = () => {
  formRef.value?.validate().then(() => {
    if (editId.value) {
      // 编辑
      const index = classData.value.findIndex(item => item.id === editId.value)
      if (index !== -1) {
        classData.value[index] = {
          ...classData.value[index],
          ...formData
        }
      }
      message.success('编辑成功')
    } else {
      // 新增
      const newClass: ClassData = {
        id: Date.now(),
        ...formData,
        createTime: new Date().toLocaleString()
      }
      classData.value.unshift(newClass)
      message.success('新增成功')
    }
    modalVisible.value = false
    resetForm()
  })
}

const handleCancel = () => {
  modalVisible.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    grade: '',
    academicYear: '',
    studentCount: 30,
    status: 'active',
    description: ''
  })
  formRef.value?.resetFields()
}

onMounted(() => {
  pagination.total = classData.value.length
})
</script>

<style scoped>
.class-manage {
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

/* Search input wrapper styling - remove borders from inner input to prevent double borders */
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

/* Inner input within affix wrapper - no border to prevent double borders */
:deep(.ant-input-affix-wrapper .ant-input) {
  background: transparent !important;
  border: none !important;
  color: rgba(0, 0, 0, 0.85) !important;
  box-shadow: none !important;
}

/* Standalone inputs (not in affix wrapper) */
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