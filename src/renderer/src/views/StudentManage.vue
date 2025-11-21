<template>
  <div class="student-manage">
    <a-page-header
      title="学生管理"
      sub-title="管理所有学生信息"
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
                placeholder="搜索学生姓名或学号"
                style="width: 300px"
                @search="handleSearch"
                allow-clear
              />
              <a-select
                v-model:value="filterClassId"
                placeholder="选择班级"
                style="width: 200px"
                allow-clear
                @change="handleFilter"
              >
                <a-select-option v-for="cls in classes" :key="cls.id" :value="cls.id">
                  {{ cls.name }} ({{ cls.grade }})
                </a-select-option>
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
            <a-button type="primary" @click="showAddModal">
              <PlusOutlined />
              新增学生
            </a-button>
          </a-col>
        </a-row>
      </a-card>

      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px;">
        <a-col :span="6">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="总学生数" :value="filteredData.length" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="男学生" :value="maleStudentsCount" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="女学生" :value="femaleStudentsCount" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="活跃学生" :value="activeStudentsCount" />
          </a-card>
        </a-col>
      </a-row>

      <!-- 学生列表 -->
      <a-card
        title="学生列表"
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
            <template v-if="column.key === 'gender'">
              <a-tag :color="record.gender === '男' ? 'blue' : 'pink'">
                {{ record.gender || '未设置' }}
              </a-tag>
            </template>
            <template v-if="column.key === 'className'">
              <a-tag color="green">{{ record.className }}</a-tag>
            </template>
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
                  title="确定要删除这个学生吗？"
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
            <a-form-item label="学生姓名" name="name">
              <a-input v-model:value="formData.name" placeholder="请输入学生姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="性别" name="gender">
              <a-select v-model:value="formData.gender" placeholder="选择性别">
                <a-select-option value="男">男</a-select-option>
                <a-select-option value="女">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="所属班级" name="classId">
              <a-select v-model:value="formData.classId" placeholder="选择班级" @change="handleClassChange">
                <a-select-option v-for="cls in classes" :key="cls.id" :value="cls.id">
                  {{ cls.name }} ({{ cls.grade }})
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="学号" name="studentNumber">
              <a-input v-model:value="formData.studentNumber" placeholder="请输入学号" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="联系电话" name="phone">
              <a-input v-model:value="formData.phone" placeholder="请输入联系电话" />
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
      </a-form>
    </a-modal>

    <!-- 详情模态框 -->
    <a-modal
      v-model:open="viewModalVisible"
      title="学生详情"
      :footer="null"
      width="600px"
    >
      <a-descriptions :column="2" bordered v-if="viewData">
        <a-descriptions-item label="学生姓名">{{ viewData.name }}</a-descriptions-item>
        <a-descriptions-item label="性别">
          <a-tag :color="viewData.gender === '男' ? 'blue' : 'pink'">
            {{ viewData.gender || '未设置' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="所属班级">{{ viewData.className }}</a-descriptions-item>
        <a-descriptions-item label="学号">{{ viewData.studentNumber || '未设置' }}</a-descriptions-item>
        <a-descriptions-item label="联系电话">{{ viewData.phone || '未设置' }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="viewData.status === 'active' ? 'green' : 'red'">
            {{ viewData.status === 'active' ? '活跃' : '停用' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ viewData.createTime }}</a-descriptions-item>
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

// 使用全局的 StudentData 接口，在 env.d.ts 中定义

// 响应式数据
const searchText = ref('')
const filterClassId = ref<number | null>(null)
const modalVisible = ref(false)
const viewModalVisible = ref(false)
const modalTitle = ref('新增学生')
const editId = ref<number | null>(null)
const viewData = ref<StudentData | null>(null)
const formRef = ref()

// 班级数据
const classes = ref<ClassData[]>([])

// 表格列定义
const columns = [
  {
    title: '学生姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    width: 80
  },
  {
    title: '所属班级',
    dataIndex: 'className',
    key: 'className',
    width: 150
  },
  {
    title: '学号',
    dataIndex: 'studentNumber',
    key: 'studentNumber',
    width: 120
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    width: 120
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
  gender: '' as '男' | '女' | '',
  classId: null as number | null,
  className: '',
  studentNumber: '',
  phone: '',
  status: 'active' as 'active' | 'inactive'
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入学生姓名' }],
  classId: [{ required: true, message: '请选择班级' }],
  status: [{ required: true, message: '请选择状态' }]
}

// 学生数据
const studentData = ref<StudentData[]>([])

// 加载学生数据
const loadStudents = async () => {
  try {
    studentData.value = await window.api.db.getAllStudents()
    pagination.total = studentData.value.length
  } catch (error) {
    console.error('加载学生数据失败:', error)
    message.error('加载数据失败')
  }
}

// 加载班级数据
const loadClasses = async () => {
  try {
    classes.value = await window.api.db.getAllClasses()
  } catch (error) {
    console.error('加载班级数据失败:', error)
    message.error('加载班级数据失败')
  }
}

// 计算属性
const filteredData = ref<StudentData[]>([])

const maleStudentsCount = computed(() => {
  return filteredData.value.filter(s => s.gender === '男').length
})

const femaleStudentsCount = computed(() => {
  return filteredData.value.filter(s => s.gender === '女').length
})

const activeStudentsCount = computed(() => {
  return filteredData.value.filter(s => s.status === 'active').length
})

// 搜索函数
const performSearch = async () => {
  try {
    const searchQuery = searchText.value || undefined
    const classQuery = filterClassId.value || undefined

    filteredData.value = await window.api.db.searchStudents(searchQuery, classQuery)
    pagination.total = filteredData.value.length
  } catch (error) {
    console.error('搜索失败:', error)
    message.error('搜索失败')
    filteredData.value = studentData.value
    pagination.total = studentData.value.length
  }
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
  filterClassId.value = null
  pagination.current = 1
  await performSearch()
}

const showAddModal = () => {
  modalTitle.value = '新增学生'
  editId.value = null
  resetForm()
  modalVisible.value = true
}

const handleEdit = (record: StudentData) => {
  modalTitle.value = '编辑学生'
  editId.value = record.id
  Object.assign(formData, record)
  modalVisible.value = true
}

const handleView = (record: StudentData) => {
  viewData.value = record
  viewModalVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    const success = await window.api.db.deleteStudent(id)
    if (success) {
      message.success('删除成功')
      await loadStudents()
      await performSearch()
    } else {
      message.error('删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    message.error('删除失败')
  }
}

const handleClassChange = (classId: number) => {
  const selectedClass = classes.value.find(c => c.id === classId)
  if (selectedClass) {
    formData.className = selectedClass.name
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()

    if (!formData.classId) {
      message.error('请选择班级')
      return
    }

    // 创建纯对象，避免 Vue 响应式对象的序列化问题
    const studentData = {
      name: formData.name,
      gender: formData.gender || undefined,
      classId: formData.classId,
      className: formData.className,
      studentNumber: formData.studentNumber || undefined,
      phone: formData.phone || undefined,
      status: formData.status
    }

    if (editId.value) {
      // 编辑
      const success = await window.api.db.updateStudent(editId.value, studentData)
      if (success) {
        message.success('编辑成功')
        await loadStudents()
        await performSearch()
      } else {
        message.error('编辑失败')
      }
    } else {
      // 新增
      const newStudent = await window.api.db.addStudent(studentData)
      if (newStudent) {
        message.success('新增成功')
        await loadStudents()
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
    gender: '',
    classId: null,
    className: '',
    studentNumber: '',
    phone: '',
    status: 'active'
  })
  formRef.value?.resetFields()
}

onMounted(async () => {
  await loadClasses()
  await loadStudents()
  await performSearch()
})
</script>

<style scoped>
.student-manage {
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