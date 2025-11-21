<template>
  <div class="score-manage">
    <a-page-header
      title="成绩管理"
      sub-title="管理所有学生成绩信息"
      style="background: #ffffff; border: 1px solid #e8e8e8; margin-bottom: 24px;"
    />

    <div class="content">
      <!-- 操作区域 -->
      <a-card class="action-card" style="background: #ffffff; border: 1px solid #e8e8e8; margin-bottom: 24px;">
        <a-row justify="space-between" align="middle">
          <a-col :span="16">
            <a-space wrap>
              <a-input-search
                v-model:value="searchText"
                placeholder="搜索学生姓名、学号或课程"
                style="width: 300px"
                @search="handleSearch"
                allow-clear
              />
              <a-select
                v-model:value="filterCourseId"
                placeholder="选择课程"
                style="width: 200px"
                allow-clear
                @change="handleFilter"
              >
                <a-select-option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.name }} ({{ course.code }})
                </a-select-option>
              </a-select>
              <a-select
                v-model:value="filterClassId"
                placeholder="选择班级"
                style="width: 150px"
                allow-clear
                @change="handleFilter"
              >
                <a-select-option v-for="cls in classes" :key="cls.id" :value="cls.id">
                  {{ cls.name }}
                </a-select-option>
              </a-select>
              <a-select
                v-model:value="filterExamType"
                placeholder="考试类型"
                style="width: 120px"
                allow-clear
                @change="handleFilter"
              >
                <a-select-option value="midterm">期中</a-select-option>
                <a-select-option value="final">期末</a-select-option>
                <a-select-option value="regular">平时</a-select-option>
                <a-select-option value="quiz">测验</a-select-option>
                <a-select-option value="assignment">作业</a-select-option>
              </a-select>
              <a-select
                v-model:value="filterAcademicYear"
                placeholder="学年"
                style="width: 120px"
                allow-clear
                @change="handleFilter"
              >
                <a-select-option
                  v-for="option in academicYearOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </a-select-option>
              </a-select>
              <a-select
                v-model:value="filterSemester"
                placeholder="学期"
                style="width: 100px"
                allow-clear
                @change="handleFilter"
              >
                <a-select-option value="first">第一学期</a-select-option>
                <a-select-option value="second">第二学期</a-select-option>
              </a-select>
              <a-button @click.stop.prevent="handleReset" style="pointer-events: auto; position: relative; z-index: 1;">
                <template #icon>
                  <ReloadOutlined />
                </template>
                重置
              </a-button>
            </a-space>
          </a-col>
          <a-col :span="8" style="text-align: right;">
            <a-button type="primary" @click="showAddModal">
              <template #icon>
                <PlusOutlined />
              </template>
              录入成绩
            </a-button>
          </a-col>
        </a-row>
      </a-card>

      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px;">
        <a-col :span="6">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="总成绩数" :value="filteredData.length" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="平均分" :value="averageScore" :precision="2" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="及格率" :value="passRate" suffix="%" :precision="1" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" style="background: #ffffff; border: 1px solid #e8e8e8;">
            <a-statistic title="优秀率" :value="excellentRate" suffix="%" :precision="1" />
          </a-card>
        </a-col>
      </a-row>

      <!-- 成绩列表 -->
      <a-card
        title="成绩列表"
        class="table-card"
        style="background: #ffffff; border: 1px solid #e8e8e8;"
      >
        <a-table
          :columns="columns"
          :data-source="filteredData"
          :pagination="pagination"
          row-key="id"
          :scroll="{ x: 1500 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'score'">
              <a-tag :color="getScoreColor(record.score)">{{ record.score }}分</a-tag>
            </template>
            <template v-if="column.key === 'examType'">
              <a-tag :color="getExamTypeColor(record.examType)">
                {{ getExamTypeText(record.examType) }}
              </a-tag>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                {{ record.status === 'active' ? '有效' : '无效' }}
              </a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="link" size="small" @click="handleEdit(record)">
                  <template #icon>
                    <EditOutlined />
                  </template>
                  编辑
                </a-button>
                <a-button type="link" size="small" @click="handleView(record)">
                  <template #icon>
                    <EyeOutlined />
                  </template>
                  查看
                </a-button>
                <a-popconfirm
                  title="确定要删除这个成绩记录吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDelete(record.id)"
                >
                  <a-button type="link" size="small" danger>
                    <template #icon>
                      <DeleteOutlined />
                    </template>
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
      width="700px"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="学生姓名" name="studentId">
              <a-select
                v-model:value="formData.studentId"
                placeholder="选择学生"
                show-search
                :filter-option="filterStudentOption"
                @change="handleStudentChange"
              >
                <a-select-option v-for="student in students" :key="student.id" :value="student.id">
                  {{ student.name }} ({{ student.studentNumber || '无学号' }})
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="课程" name="courseId">
              <a-select
                v-model:value="formData.courseId"
                placeholder="选择课程"
                @change="handleCourseChange"
              >
                <a-select-option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.name }} ({{ course.code }})
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="成绩分数" name="score">
              <a-input-number
                v-model:value="formData.score"
                :min="0"
                :max="100"
                style="width: 100%"
                placeholder="输入分数"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="考试类型" name="examType">
              <a-select v-model:value="formData.examType" placeholder="选择类型">
                <a-select-option value="midterm">期中</a-select-option>
                <a-select-option value="final">期末</a-select-option>
                <a-select-option value="regular">平时</a-select-option>
                <a-select-option value="quiz">测验</a-select-option>
                <a-select-option value="assignment">作业</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="考试日期" name="examDate">
              <a-date-picker
                v-model:value="formData.examDate"
                style="width: 100%"
                placeholder="选择日期"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="学年" name="academicYear">
              <a-select
                v-model:value="formData.academicYear"
                placeholder="选择学年（选择学生后自动填充）"
                allow-clear
              >
                <a-select-option
                  v-for="option in academicYearOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="学期" name="semester">
              <a-select v-model:value="formData.semester" placeholder="选择学期">
                <a-select-option value="first">第一学期</a-select-option>
                <a-select-option value="second">第二学期</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="状态" name="status">
              <a-select v-model:value="formData.status" placeholder="选择状态">
                <a-select-option value="active">有效</a-select-option>
                <a-select-option value="inactive">无效</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 详情模态框 -->
    <a-modal
      v-model:open="viewModalVisible"
      title="成绩详情"
      :footer="null"
      width="600px"
    >
      <a-descriptions :column="2" bordered v-if="viewData">
        <a-descriptions-item label="学生姓名">{{ viewData.studentName }}</a-descriptions-item>
        <a-descriptions-item label="学号">{{ viewData.studentNumber || '无' }}</a-descriptions-item>
        <a-descriptions-item label="班级">{{ viewData.className }}</a-descriptions-item>
        <a-descriptions-item label="课程">{{ viewData.courseName }}</a-descriptions-item>
        <a-descriptions-item label="课程代码">{{ viewData.courseCode }}</a-descriptions-item>
        <a-descriptions-item label="成绩分数">
          <a-tag :color="getScoreColor(viewData.score)">{{ viewData.score }}分</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="考试类型">
          <a-tag :color="getExamTypeColor(viewData.examType)">
            {{ getExamTypeText(viewData.examType) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="考试日期">{{ viewData.examDate }}</a-descriptions-item>
        <a-descriptions-item label="学年">{{ viewData.academicYear }}</a-descriptions-item>
        <a-descriptions-item label="学期">{{ viewData.semester === 'first' ? '第一学期' : '第二学期' }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="viewData.status === 'active' ? 'green' : 'red'">
            {{ viewData.status === 'active' ? '有效' : '无效' }}
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
import dayjs from 'dayjs'

// 获取当前学年 - 先定义函数
const getCurrentAcademicYear = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1 // 月份是0-based

  // 如果是8月及以后，属于当前学年的第一学期（如2024年8月属于2024-2025学年）
  // 如果是7月及以前，属于当前学年的第二学期（如2024年7月属于2023-2024学年）
  if (currentMonth >= 8) {
    return `${currentYear}-${currentYear + 1}`
  } else {
    return `${currentYear - 1}-${currentYear}`
  }
}

// 响应式数据
const searchText = ref('')
const filterCourseId = ref<number | null>(null)
const filterClassId = ref<number | null>(null)
const filterExamType = ref('')
const filterAcademicYear = ref(getCurrentAcademicYear()) // 默认当前学年
const filterSemester = ref('')
const modalVisible = ref(false)
const viewModalVisible = ref(false)
const modalTitle = ref('录入成绩')
const editId = ref<number | null>(null)
const viewData = ref<ScoreData | null>(null)
const formRef = ref()

const defaultAcademicYear = ref(getCurrentAcademicYear())

// 生成学年选项
const academicYearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const options = [
    {
      value: defaultAcademicYear.value,
      label: `${defaultAcademicYear.value} (当前)`
    }
  ]

  // 生成过去5年的选项
  for (let i = 0; i < 5; i++) {
    const startYear = currentYear - i - 1
    const endYear = startYear + 1
    const academicYear = `${startYear}-${endYear}`

    // 避免重复添加当前学年
    if (academicYear !== defaultAcademicYear.value) {
      options.push({
        value: academicYear,
        label: academicYear
      })
    }
  }

  return options
})

// 基础数据
const scoreData = ref<ScoreData[]>([])
const students = ref<StudentData[]>([])
const classes = ref<ClassData[]>([])
const courses = ref<CourseData[]>([])

// 表格列定义
const columns = [
  {
    title: '学生姓名',
    dataIndex: 'studentName',
    key: 'studentName',
    width: 100,
    fixed: 'left'
  },
  {
    title: '学号',
    dataIndex: 'studentNumber',
    key: 'studentNumber',
    width: 120
  },
  {
    title: '班级',
    dataIndex: 'className',
    key: 'className',
    width: 100
  },
  {
    title: '课程',
    dataIndex: 'courseName',
    key: 'courseName',
    width: 150
  },
  {
    title: '课程代码',
    dataIndex: 'courseCode',
    key: 'courseCode',
    width: 100
  },
  {
    title: '分数',
    dataIndex: 'score',
    key: 'score',
    width: 80,
    sorter: (a: ScoreData, b: ScoreData) => a.score - b.score
  },
  {
    title: '考试类型',
    dataIndex: 'examType',
    key: 'examType',
    width: 100
  },
  {
    title: '学年',
    dataIndex: 'academicYear',
    key: 'academicYear',
    width: 100
  },
  {
    title: '学期',
    dataIndex: 'semester',
    key: 'semester',
    width: 80
  },
  {
    title: '考试日期',
    dataIndex: 'examDate',
    key: 'examDate',
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
    width: 180,
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
  studentId: null as number | null,
  studentName: '',
  studentNumber: '',
  className: '',
  courseId: null as number | null,
  courseName: '',
  courseCode: '',
  score: null as number | null,
  examType: '' as 'midterm' | 'final' | 'regular' | 'quiz' | 'assignment',
  academicYear: '',
  semester: '' as 'first' | 'second',
  examDate: '',
  status: 'active' as 'active' | 'inactive'
})

// 表单验证规则
const rules = {
  studentId: [{ required: true, message: '请选择学生' }],
  courseId: [{ required: true, message: '请选择课程' }],
  score: [
    { required: true, message: '请输入分数' },
    { type: 'number', min: 0, max: 100, message: '分数必须在0-100之间' }
  ],
  examType: [{ required: true, message: '请选择考试类型' }],
  examDate: [{ required: true, message: '请选择考试日期' }],
  academicYear: [{ required: true, message: '请选择学年' }],
  semester: [{ required: true, message: '请选择学期' }],
  status: [{ required: true, message: '请选择状态' }]
}

// 计算属性
const filteredData = ref<ScoreData[]>([])

const averageScore = computed(() => {
  if (filteredData.value.length === 0) return 0
  const total = filteredData.value.reduce((sum, item) => sum + item.score, 0)
  return Math.round((total / filteredData.value.length) * 100) / 100
})

const passRate = computed(() => {
  if (filteredData.value.length === 0) return 0
  const passCount = filteredData.value.filter(item => item.score >= 60).length
  return Math.round((passCount / filteredData.value.length) * 1000) / 10
})

const excellentRate = computed(() => {
  if (filteredData.value.length === 0) return 0
  const excellentCount = filteredData.value.filter(item => item.score >= 90).length
  return Math.round((excellentCount / filteredData.value.length) * 1000) / 10
})

// 工具方法
const getScoreColor = (score: number) => {
  if (score >= 90) return 'green'
  if (score >= 80) return 'blue'
  if (score >= 70) return 'orange'
  if (score >= 60) return 'gold'
  return 'red'
}

const getExamTypeColor = (examType: string) => {
  const colors = {
    midterm: 'blue',
    final: 'red',
    regular: 'green',
    quiz: 'orange',
    assignment: 'purple'
  }
  return colors[examType as keyof typeof colors] || 'default'
}

const getExamTypeText = (examType: string) => {
  const texts = {
    midterm: '期中',
    final: '期末',
    regular: '平时',
    quiz: '测验',
    assignment: '作业'
  }
  return texts[examType as keyof typeof texts] || '未知'
}

const filterStudentOption = (input: string, option: any) => {
  const student = students.value.find(s => s.id === option.value)
  if (!student) return false
  return student.name.toLowerCase().includes(input.toLowerCase()) ||
         (student.studentNumber && student.studentNumber.toLowerCase().includes(input.toLowerCase()))
}

// 数据加载
const loadScores = async () => {
  try {
    scoreData.value = await window.api.db.getAllScores()
    pagination.total = scoreData.value.length
  } catch (error) {
    console.error('加载成绩数据失败:', error)
    message.error('加载数据失败')
  }
}

const loadStudents = async () => {
  try {
    students.value = await window.api.db.getAllStudents()
  } catch (error) {
    console.error('加载学生数据失败:', error)
    message.error('加载学生数据失败')
  }
}

const loadClasses = async () => {
  try {
    classes.value = await window.api.db.getAllClasses()
  } catch (error) {
    console.error('加载班级数据失败:', error)
    message.error('加载班级数据失败')
  }
}

const loadCourses = async () => {
  try {
    courses.value = await window.api.db.getAllCourses()
  } catch (error) {
    console.error('加载课程数据失败:', error)
    message.error('加载课程数据失败')
  }
}

// 搜索函数
const performSearch = async () => {
  try {
    filteredData.value = await window.api.db.searchScores(
      searchText.value || undefined,
      filterCourseId.value || undefined,
      filterClassId.value || undefined,
      filterExamType.value || undefined,
      filterAcademicYear.value || undefined,
      filterSemester.value || undefined
    )
    pagination.total = filteredData.value.length
  } catch (error) {
    console.error('搜索失败:', error)
    message.error('搜索失败')
    filteredData.value = scoreData.value
    pagination.total = scoreData.value.length
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
  filterCourseId.value = null
  filterClassId.value = null
  filterExamType.value = ''
  filterAcademicYear.value = ''
  filterSemester.value = ''
  pagination.current = 1
  await performSearch()
}

const handleStudentChange = (studentId: number) => {
  const student = students.value.find(s => s.id === studentId)
  if (student) {
    formData.studentName = student.name
    formData.studentNumber = student.studentNumber || ''
    formData.className = student.className

    // 根据学生所属班级自动填充学年
    const studentClass = classes.value.find(cls => cls.name === student.className)
    if (studentClass) {
      formData.academicYear = studentClass.academicYear
    }
  }
}

const handleCourseChange = (courseId: number) => {
  const course = courses.value.find(c => c.id === courseId)
  if (course) {
    formData.courseName = course.name
    formData.courseCode = course.code
  }
}

const showAddModal = () => {
  modalTitle.value = '录入成绩'
  editId.value = null
  resetForm()
  modalVisible.value = true
}

const handleEdit = (record: ScoreData) => {
  modalTitle.value = '编辑成绩'
  editId.value = record.id
  Object.assign(formData, {
    ...record,
    examDate: record.examDate ? dayjs(record.examDate) : null
  })
  modalVisible.value = true
}

const handleView = (record: ScoreData) => {
  viewData.value = record
  viewModalVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    const success = await window.api.db.deleteScore(id)
    if (success) {
      message.success('删除成功')
      await loadScores()
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

    if (!formData.studentId || !formData.courseId) {
      message.error('请选择学生和课程')
      return
    }

    // 创建纯对象
    const scoreData = {
      studentId: formData.studentId,
      studentName: formData.studentName,
      studentNumber: formData.studentNumber || undefined,
      className: formData.className,
      courseId: formData.courseId,
      courseName: formData.courseName,
      courseCode: formData.courseCode,
      score: formData.score!,
      examType: formData.examType,
      academicYear: formData.academicYear,
      semester: formData.semester,
      examDate: formData.examDate ? dayjs(formData.examDate).format('YYYY-MM-DD') : '',
      status: formData.status
    }

    if (editId.value) {
      // 编辑
      const success = await window.api.db.updateScore(editId.value, scoreData)
      if (success) {
        message.success('编辑成功')
        await loadScores()
        await performSearch()
      } else {
        message.error('编辑失败')
      }
    } else {
      // 新增
      const newScore = await window.api.db.addScore(scoreData)
      if (newScore) {
        message.success('录入成功')
        await loadScores()
        await performSearch()
      } else {
        message.error('录入失败')
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
    studentId: null,
    studentName: '',
    studentNumber: '',
    className: '',
    courseId: null,
    courseName: '',
    courseCode: '',
    score: null,
    examType: '',
    academicYear: defaultAcademicYear.value, // 默认当前学年
    semester: '',
    examDate: '',
    status: 'active'
  })
  formRef.value?.resetFields()
}

onMounted(async () => {
  // 按顺序加载数据，确保依赖关系正确
  await loadClasses()
  await loadStudents()
  await loadCourses()
  await loadScores()
  await performSearch()
})
</script>

<style scoped>
.score-manage {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100%;
}

.content {
  max-width: 1600px;
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