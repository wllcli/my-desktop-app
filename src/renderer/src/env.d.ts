/// <reference types="vite/client" />

interface ElectronAPI {
  // 可以在这里添加其他 electronAPI 的类型定义
}

interface Api {
  db: {
    getAllClasses: () => Promise<ClassData[]>
    searchClasses: (searchText?: string, grade?: string) => Promise<ClassData[]>
    addClass: (classData: Omit<ClassData, 'id' | 'createTime' | 'updateTime' | 'studentCount'>) => Promise<ClassData | null>
    updateClass: (id: number, classData: Partial<ClassData>) => Promise<{ success: boolean; message?: string }>
    // 检查班级是否有活跃学生
    hasActiveStudents: (classId: number) => Promise<boolean>
    // 获取班级活跃学生数量
    getActiveStudentCount: (classId: number) => Promise<number>
    deleteClass: (id: number) => Promise<boolean>
    getStatistics: () => Promise<{
      totalClasses: number
      totalStudents: number
      activeClasses: number
      averageStudents: number
    } | null>
    // 数据库管理
    getDatabasePath: () => Promise<string>
    exportDatabase: (exportPath: string) => Promise<boolean>
    importDatabase: (importPath: string) => Promise<boolean>
    verifyDatabase: () => Promise<{ valid: boolean; error?: string }>
    // 学生管理
    getAllStudents: () => Promise<StudentData[]>
    searchStudents: (searchText?: string, classId?: number) => Promise<StudentData[]>
    addStudent: (studentData: Omit<StudentData, 'id' | 'createTime' | 'updateTime'>) => Promise<StudentData | null>
    updateStudent: (id: number, studentData: Partial<StudentData>) => Promise<boolean>
    deleteStudent: (id: number) => Promise<boolean>
    // 批量添加学生
    batchAddStudents: (students: any[]) => Promise<{ success: boolean; message: string; count: number }>
    
    // 成绩管理
    getAllScores: () => Promise<ScoreData[]>
    searchScores: (
      searchText?: string,
      courseId?: number,
      classId?: number,
      examType?: string,
      academicYear?: string,
      semester?: string
    ) => Promise<ScoreData[]>
    addScore: (scoreData: Omit<ScoreData, 'id' | 'createTime' | 'updateTime'>) => Promise<ScoreData | null>
    // 批量添加成绩
    batchAddScores: (scores: any[]) => Promise<{ success: boolean; message: string; count: number }>
    updateScore: (id: number, scoreData: Partial<ScoreData>) => Promise<boolean>
    deleteScore: (id: number) => Promise<boolean>
    // 课程管理
    getAllCourses: () => Promise<CourseData[]>
    searchCourses: (searchText?: string, status?: string) => Promise<CourseData[]>
    addCourse: (courseData: Omit<CourseData, 'id' | 'createTime' | 'updateTime'>) => Promise<CourseData | null>
    updateCourse: (id: number, courseData: Partial<CourseData>) => Promise<boolean>
    deleteCourse: (id: number) => Promise<boolean>
    getCourseStatistics: () => Promise<{
      totalCourses: number
      activeCourses: number
      averagePassingScore: number
    } | null>
    isCourseCodeExists: (code: string, excludeId?: number) => Promise<boolean>
  }
}

interface Window {
  electron: ElectronAPI
  api: Api
}

// 班级数据接口
interface ClassData {
  id?: number
  name: string
  grade: string
  academicYear: string
  studentCount: number
  status: 'active' | 'inactive'
  description: string
  createTime: string
  updateTime?: string
}

// 学生数据接口
interface StudentData {
  id?: number
  name: string
  gender?: '男' | '女'
  classId: number
  className: string
  studentNumber?: string
  phone?: string
  status: 'active' | 'inactive'
  createTime: string
  updateTime?: string
}

// 课程数据接口
interface CourseData {
  id?: number
  name: string
  code: string
  passingScore: number
  status: 'active' | 'inactive'
  createTime: string
  updateTime?: string
}
