import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 定义班级数据接口
export interface ClassData {
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

// 定义学生数据接口
export interface StudentData {
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

// 定义课程数据接口
export interface CourseData {
  id?: number
  name: string
  code: string
  passingScore: number
  status: 'active' | 'inactive'
  createTime: string
  updateTime?: string
}

// 定义成绩数据接口
export interface ScoreData {
  id?: number
  studentId: number
  studentName: string
  studentNumber?: string
  className: string
  courseId: number
  courseName: string
  courseCode: string
  score: number
  examType: 'midterm' | 'final' | 'regular' | 'quiz' | 'assignment'
  academicYear: string
  semester: 'first' | 'second'
  examDate: string
  status: 'active' | 'inactive'
  createTime: string
  updateTime?: string
}

// 定义成绩统计信息接口
export interface ScoreStatistics {
  totalScores: number
  averageScore: number
  highestScore: number
  lowestScore: number
  passRate: number
  excellentRate: number
  goodRate: number
  averageByClass: { className: string; average: number; count: number }[]
  scoreDistribution: {
    range: string
    count: number
    percentage: number
  }[]
}

// Custom APIs for renderer
const api = {
  // 班级管理数据库 API
  db: {
    // 获取所有班级
    getAllClasses: (): Promise<ClassData[]> =>
      ipcRenderer.invoke('db:getAllClasses'),

    // 搜索班级
    searchClasses: (searchText?: string, grade?: string, academicYear?: string): Promise<ClassData[]> =>
      ipcRenderer.invoke('db:searchClasses', searchText, grade, academicYear),

    // 添加班级
    addClass: (classData: Omit<ClassData, 'id' | 'createTime' | 'updateTime' | 'studentCount'>): Promise<ClassData | null> =>
      ipcRenderer.invoke('db:addClass', classData),

    // 更新班级
    updateClass: (id: number, classData: Partial<ClassData>): Promise<{ success: boolean; message?: string }> =>
      ipcRenderer.invoke('db:updateClass', id, classData),

    // 检查班级是否有活跃学生
    hasActiveStudents: (classId: number): Promise<boolean> =>
      ipcRenderer.invoke('db:hasActiveStudents', classId),

    // 获取班级活跃学生数量
    getActiveStudentCount: (classId: number): Promise<number> =>
      ipcRenderer.invoke('db:getActiveStudentCount', classId),

    // 删除班级
    deleteClass: (id: number): Promise<boolean> =>
      ipcRenderer.invoke('db:deleteClass', id),

    // 获取统计信息
    getStatistics: (): Promise<{
      totalClasses: number
      totalStudents: number
      activeClasses: number
      averageStudents: number
    } | null> =>
      ipcRenderer.invoke('db:getStatistics'),

    // 数据库管理
    getDatabasePath: (): Promise<string> =>
      ipcRenderer.invoke('db:getDatabasePath'),

    exportDatabase: (exportPath: string): Promise<boolean> =>
      ipcRenderer.invoke('db:exportDatabase', exportPath),

    importDatabase: (importPath: string): Promise<boolean> =>
      ipcRenderer.invoke('db:importDatabase', importPath),

    verifyDatabase: (): Promise<{ valid: boolean; error?: string }> =>
      ipcRenderer.invoke('db:verifyDatabase'),

    // 学生管理数据库 API
    getAllStudents: (): Promise<StudentData[]> =>
      ipcRenderer.invoke('db:getAllStudents'),

    searchStudents: (searchText?: string, classId?: number): Promise<StudentData[]> =>
      ipcRenderer.invoke('db:searchStudents', searchText, classId),

    addStudent: (studentData: Omit<StudentData, 'id' | 'createTime' | 'updateTime'>): Promise<StudentData | null> =>
      ipcRenderer.invoke('db:addStudent', studentData),

    updateStudent: (id: number, studentData: Partial<StudentData>): Promise<boolean> =>
      ipcRenderer.invoke('db:updateStudent', id, studentData),

    deleteStudent: (id: number): Promise<boolean> =>
      ipcRenderer.invoke('db:deleteStudent', id),

    // 课程管理数据库 API
    getAllCourses: (): Promise<CourseData[]> =>
      ipcRenderer.invoke('db:getAllCourses'),

    searchCourses: (searchText?: string, status?: string): Promise<CourseData[]> =>
      ipcRenderer.invoke('db:searchCourses', searchText, status),

    addCourse: (courseData: Omit<CourseData, 'id' | 'createTime' | 'updateTime'>): Promise<CourseData | null> =>
      ipcRenderer.invoke('db:addCourse', courseData),

    updateCourse: (id: number, courseData: Partial<CourseData>): Promise<boolean> =>
      ipcRenderer.invoke('db:updateCourse', id, courseData),

    deleteCourse: (id: number): Promise<boolean> =>
      ipcRenderer.invoke('db:deleteCourse', id),

    getCourseStatistics: (): Promise<{
      totalCourses: number
      activeCourses: number
      averagePassingScore: number
    } | null> =>
      ipcRenderer.invoke('db:getCourseStatistics'),

    isCourseCodeExists: (code: string, excludeId?: number): Promise<boolean> =>
      ipcRenderer.invoke('db:isCourseCodeExists', code, excludeId),

    // 成绩管理数据库 API
    // 获取所有成绩
    getAllScores: (): Promise<ScoreData[]> =>
      ipcRenderer.invoke('db:getAllScores'),

    // 搜索成绩
    searchScores: (
      searchText?: string,
      courseId?: number,
      classId?: number,
      examType?: string,
      academicYear?: string,
      semester?: string
    ): Promise<ScoreData[]> =>
      ipcRenderer.invoke('db:searchScores', searchText, courseId, classId, examType, academicYear, semester),

    // 添加成绩
    addScore: (scoreData: Omit<ScoreData, 'id' | 'createTime' | 'updateTime'>): Promise<ScoreData | null> =>
      ipcRenderer.invoke('db:addScore', scoreData),

    // 更新成绩
    updateScore: (id: number, scoreData: Partial<ScoreData>): Promise<boolean> =>
      ipcRenderer.invoke('db:updateScore', id, scoreData),

    // 删除成绩
    deleteScore: (id: number): Promise<boolean> =>
      ipcRenderer.invoke('db:deleteScore', id),

    // 获取学生成绩统计
    getStudentScoreStatistics: (studentId: number, academicYear?: string, semester?: string): Promise<ScoreStatistics | null> =>
      ipcRenderer.invoke('db:getStudentScoreStatistics', studentId, academicYear, semester),

    // 获取课程成绩统计
    getCourseScoreStatistics: (courseId: number, academicYear?: string, semester?: string): Promise<ScoreStatistics | null> =>
      ipcRenderer.invoke('db:getCourseScoreStatistics', courseId, academicYear, semester)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
