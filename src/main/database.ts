import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'

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

class DatabaseService {
  private db: Database.Database | null = null
  private dbPath: string = ''

  constructor() {
    this.initDatabase()
  }

  // 初始化数据库
  private initDatabase() {
    try {
      // 获取用户数据目录
      const userDataPath = app.getPath('userData')
      this.dbPath = path.join(userDataPath, 'class_management.db')

      // 确保数据目录存在
      const fs = require('fs')
      if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true })
      }

      // 数据库备份机制
      this.backupDatabase()

      // 创建数据库连接
      this.db = new Database(this.dbPath)
      this.db.pragma('journal_mode = WAL')

      // 创建班级表
      this.createTables()

      // 数据库迁移检查
      this.migrateDatabase()

      console.log('数据库初始化成功:', this.dbPath)
    } catch (error) {
      console.error('数据库初始化失败:', error)
    }
  }

  // 数据库备份
  private backupDatabase() {
    try {
      const fs = require('fs')
      const backupPath = this.dbPath.replace('.db', '_backup.db')

      // 如果主数据库存在且备份不存在，创建备份
      if (fs.existsSync(this.dbPath) && !fs.existsSync(backupPath)) {
        fs.copyFileSync(this.dbPath, backupPath)
        console.log('数据库备份已创建:', backupPath)
      }
    } catch (error) {
      console.warn('数据库备份失败:', error)
    }
  }

  // 数据库迁移
  private migrateDatabase() {
    if (!this.db) return

    try {
      // 检查数据库版本表是否存在
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS db_version (
          id INTEGER PRIMARY KEY,
          version TEXT NOT NULL,
          migrated_at TEXT NOT NULL
        )
      `)

      // 获取当前版本
      const currentVersion = '1.0.0'
      const result = this.db.prepare('SELECT version FROM db_version ORDER BY id DESC LIMIT 1').get()

      if (!result || result.version !== currentVersion) {
        console.log('执行数据库迁移...')

        // 执行迁移逻辑（如果需要）
        this.performMigrations(result?.version)

        // 更新版本信息
        this.db.prepare(`
          INSERT INTO db_version (version, migrated_at) VALUES (?, ?)
        `).run(currentVersion, new Date().toISOString())

        console.log('数据库迁移完成')
      }
    } catch (error) {
      console.error('数据库迁移失败:', error)
    }
  }

  // 执行具体的迁移操作
  private performMigrations(fromVersion?: string) {
    if (!this.db) return

    try {
      // 根据版本执行不同的迁移
      if (!fromVersion) {
        // 首次安装，无需迁移
        console.log('首次安装数据库')
      } else if (fromVersion < '1.0.0') {
        // 示例：添加新字段或表
        console.log('执行升级迁移')

        // 这里可以添加具体的迁移逻辑，例如：
        // ALTER TABLE classes ADD COLUMN new_field TEXT;
      }
    } catch (error) {
      console.error('执行迁移失败:', error)
    }
  }

  // 获取数据库路径
  public getDatabasePath(): string {
    return this.dbPath
  }

  // 导出数据库
  public exportDatabase(exportPath: string): boolean {
    try {
      const fs = require('fs')
      fs.copyFileSync(this.dbPath, exportPath)
      console.log('数据库导出成功:', exportPath)
      return true
    } catch (error) {
      console.error('数据库导出失败:', error)
      return false
    }
  }

  // 导入数据库
  public importDatabase(importPath: string): boolean {
    try {
      const fs = require('fs')

      // 备份当前数据库
      this.backupDatabase()

      // 导入新数据库
      fs.copyFileSync(importPath, this.dbPath)

      // 重新连接数据库
      this.db?.close()
      this.db = new Database(this.dbPath)
      this.db.pragma('journal_mode = WAL')

      console.log('数据库导入成功:', importPath)
      return true
    } catch (error) {
      console.error('数据库导入失败:', error)
      return false
    }
  }

  // 数据完整性检查
  public verifyDatabase(): { valid: boolean; error?: string } {
    try {
      if (!this.db) return { valid: false, error: '数据库未连接' }

      // 检查表是否存在
      const tables = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
      const hasClassesTable = tables.some((table: any) => table.name === 'classes')

      if (!hasClassesTable) {
        return { valid: false, error: '缺少必要的数据表' }
      }

      // 检查表结构
      const columns = this.db.prepare("PRAGMA table_info(classes)").all()
      const requiredColumns = ['id', 'name', 'grade', 'academic_year', 'student_count', 'status']

      for (const column of requiredColumns) {
        if (!columns.some((col: any) => col.name === column)) {
          return { valid: false, error: `缺少必要字段: ${column}` }
        }
      }

      return { valid: true }
    } catch (error) {
      return { valid: false, error: error.message }
    }
  }

  // 创建表
  private createTables() {
    if (!this.db) return

    const createClassesTable = `
      CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        grade TEXT NOT NULL,
        academic_year TEXT NOT NULL,
        student_count INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        description TEXT DEFAULT '',
        create_time TEXT NOT NULL,
        update_time TEXT DEFAULT ''
      )
    `

    const createStudentsTable = `
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        gender TEXT,
        class_id INTEGER NOT NULL,
        class_name TEXT NOT NULL,
        student_number TEXT,
        phone TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        create_time TEXT NOT NULL,
        update_time TEXT DEFAULT '',
        FOREIGN KEY (class_id) REFERENCES classes(id)
      )
    `

    this.db.exec(createClassesTable)
    this.db.exec(createStudentsTable)

    // 创建索引
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_classes_name ON classes(name);
      CREATE INDEX IF NOT EXISTS idx_classes_grade ON classes(grade);
      CREATE INDEX IF NOT EXISTS idx_classes_academic_year ON classes(academic_year);
      CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);
      CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
      CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
      CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
    `)

    // 创建课程表
    const createCoursesTable = `
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        passing_score REAL NOT NULL DEFAULT 60,
        status TEXT NOT NULL DEFAULT 'active',
        create_time TEXT NOT NULL,
        update_time TEXT DEFAULT ''
      )
    `

    this.db.exec(createCoursesTable)

    // 创建课程表索引
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_courses_name ON courses(name);
      CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
      CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
    `)

    // 创建成绩表
    const createScoresTable = `
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        student_name TEXT NOT NULL,
        student_number TEXT,
        class_name TEXT NOT NULL,
        course_id INTEGER NOT NULL,
        course_name TEXT NOT NULL,
        course_code TEXT NOT NULL,
        score REAL NOT NULL,
        exam_type TEXT NOT NULL,
        academic_year TEXT NOT NULL,
        semester TEXT NOT NULL,
        exam_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        create_time TEXT NOT NULL,
        update_time TEXT DEFAULT '',
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
      )
    `

    this.db.exec(createScoresTable)

    // 创建成绩表索引
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_scores_student_id ON scores(student_id);
      CREATE INDEX IF NOT EXISTS idx_scores_course_id ON scores(course_id);
      CREATE INDEX IF NOT EXISTS idx_scores_exam_type ON scores(exam_type);
      CREATE INDEX IF NOT EXISTS idx_scores_academic_year ON scores(academic_year);
      CREATE INDEX IF NOT EXISTS idx_scores_semester ON scores(semester);
      CREATE INDEX IF NOT EXISTS idx_scores_status ON scores(status);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_scores_unique ON scores(student_id, course_id, exam_type, academic_year, semester);
    `)
  }

  // 获取所有班级
  getAllClasses(): ClassData[] {
    if (!this.db) return []

    try {
      const stmt = this.db.prepare(`
        SELECT
          c.id, c.name, c.grade, c.academic_year as academicYear,
          COALESCE(s.student_count, 0) as studentCount, c.status, c.description,
          c.create_time as createTime, c.update_time as updateTime
        FROM classes c
        LEFT JOIN (
          SELECT class_id, COUNT(*) as student_count
          FROM students
          WHERE status = 'active'
          GROUP BY class_id
        ) s ON c.id = s.class_id
        ORDER BY c.create_time DESC
      `)

      return stmt.all() as ClassData[]
    } catch (error) {
      console.error('获取班级列表失败:', error)
      return []
    }
  }

  // 根据条件搜索班级
  searchClasses(searchText?: string, grade?: string, academicYear?: string): ClassData[] {
    if (!this.db) return []

    try {
      let query = `
        SELECT
          c.id, c.name, c.grade, c.academic_year as academicYear,
          COALESCE(s.student_count, 0) as studentCount, c.status, c.description,
          c.create_time as createTime, c.update_time as updateTime
        FROM classes c
        LEFT JOIN (
          SELECT class_id, COUNT(*) as student_count
          FROM students
          WHERE status = 'active'
          GROUP BY class_id
        ) s ON c.id = s.class_id
        WHERE 1=1
      `

      const params: any[] = []

      if (searchText) {
        query += ` AND c.name LIKE ?`
        params.push(`%${searchText}%`)
      }

      if (grade) {
        query += ` AND c.grade = ?`
        params.push(grade)
      }

      if (academicYear) {
        query += ` AND c.academic_year = ?`
        params.push(academicYear)
      }

      query += ` ORDER BY c.create_time DESC`

      const stmt = this.db.prepare(query)
      return stmt.all(...params) as ClassData[]
    } catch (error) {
      console.error('搜索班级失败:', error)
      return []
    }
  }

  // 添加班级
  addClass(classData: Omit<ClassData, 'id' | 'createTime' | 'updateTime' | 'studentCount'>): ClassData | null {
    if (!this.db) return null

    try {
      const now = new Date().toLocaleString()

      const stmt = this.db.prepare(`
        INSERT INTO classes (name, grade, academic_year, student_count, status, description, create_time)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)

      const result = stmt.run(
        classData.name,
        classData.grade,
        classData.academicYear,
        0, // 新班级默认学生数为 0
        classData.status,
        classData.description,
        now
      )

      // 返回插入的数据，包含实际的学生计数
      const inserted = this.db.prepare(`
        SELECT
          c.id, c.name, c.grade, c.academic_year as academicYear,
          COALESCE(s.student_count, 0) as studentCount, c.status, c.description,
          c.create_time as createTime, c.update_time as updateTime
        FROM classes c
        LEFT JOIN (
          SELECT class_id, COUNT(*) as student_count
          FROM students
          WHERE status = 'active'
          GROUP BY class_id
        ) s ON c.id = s.class_id
        WHERE c.id = ?
      `).get(result.lastInsertRowid) as ClassData

      return inserted
    } catch (error) {
      console.error('添加班级失败:', error)
      return null
    }
  }

  // 更新班级
  updateClass(id: number, classData: Partial<ClassData>): { success: boolean; message?: string } {
    if (!this.db) return { success: false, message: '数据库连接失败' }

    try {
      // 检查是否要将班级状态改为 'inactive'
      if (classData.status === 'inactive') {
        // 检查该班级是否还有活跃学生
        if (this.hasActiveStudents(id)) {
          const activeCount = this.getActiveStudentCount(id)
          return {
            success: false,
            message: `该班级还有 ${activeCount} 名活跃学生，无法停用。请先将所有学生状态设置为停用或转移到其他班级。`
          }
        }
      }

      const now = new Date().toLocaleString()

      const fields = []
      const params = []

      if (classData.name !== undefined) {
        fields.push('name = ?')
        params.push(classData.name)
      }
      if (classData.grade !== undefined) {
        fields.push('grade = ?')
        params.push(classData.grade)
      }
      if (classData.academicYear !== undefined) {
        fields.push('academic_year = ?')
        params.push(classData.academicYear)
      }
      // 移除 studentCount 的更新，因为学生数应该是动态计算的
      if (classData.status !== undefined) {
        fields.push('status = ?')
        params.push(classData.status)
      }
      if (classData.description !== undefined) {
        fields.push('description = ?')
        params.push(classData.description)
      }

      if (fields.length === 0) return { success: false, message: '没有需要更新的字段' }

      fields.push('update_time = ?')
      params.push(now)
      params.push(id)

      const stmt = this.db.prepare(`
        UPDATE classes SET ${fields.join(', ')} WHERE id = ?
      `)

      const result = stmt.run(...params)
      if (result.changes > 0) {
        return { success: true }
      } else {
        return { success: false, message: '更新失败，班级不存在' }
      }
    } catch (error) {
      console.error('更新班级失败:', error)
      return { success: false, message: '更新失败: ' + error.message }
    }
  }

  // 删除班级
  deleteClass(id: number): boolean {
    if (!this.db) return false

    try {
      const stmt = this.db.prepare('DELETE FROM classes WHERE id = ?')
      const result = stmt.run(id)
      return result.changes > 0
    } catch (error) {
      console.error('删除班级失败:', error)
      return false
    }
  }

  // 获取所有学生
  getAllStudents(): StudentData[] {
    if (!this.db) return []

    try {
      const stmt = this.db.prepare(`
        SELECT
          id, name, gender, class_id as classId, class_name as className,
          student_number as studentNumber, phone, status,
          create_time as createTime, update_time as updateTime
        FROM students
        ORDER BY create_time DESC
      `)

      return stmt.all() as StudentData[]
    } catch (error) {
      console.error('获取学生列表失败:', error)
      return []
    }
  }

  // 根据条件搜索学生
  searchStudents(searchText?: string, classId?: number): StudentData[] {
    if (!this.db) return []

    try {
      let query = `
        SELECT
          id, name, gender, class_id as classId, class_name as className,
          student_number as studentNumber, phone, status,
          create_time as createTime, update_time as updateTime
        FROM students
        WHERE 1=1
      `

      const params: any[] = []

      if (searchText) {
        query += ` AND (name LIKE ? OR student_number LIKE ?)`
        params.push(`%${searchText}%`, `%${searchText}%`)
      }

      if (classId) {
        query += ` AND class_id = ?`
        params.push(classId)
      }

      query += ` ORDER BY create_time DESC`

      const stmt = this.db.prepare(query)
      return stmt.all(...params) as StudentData[]
    } catch (error) {
      console.error('搜索学生失败:', error)
      return []
    }
  }

  // 添加学生
  addStudent(studentData: Omit<StudentData, 'id' | 'createTime' | 'updateTime'>): StudentData | null {
    if (!this.db) return null

    try {
      const now = new Date().toLocaleString()

      const stmt = this.db.prepare(`
        INSERT INTO students (name, gender, class_id, class_name, student_number, phone, status, create_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)

      const result = stmt.run(
        studentData.name,
        studentData.gender,
        studentData.classId,
        studentData.className,
        studentData.studentNumber,
        studentData.phone,
        studentData.status,
        now
      )

      // 返回插入的数据
      const inserted = this.db.prepare(`
        SELECT
          id, name, gender, class_id as classId, class_name as className,
          student_number as studentNumber, phone, status,
          create_time as createTime, update_time as updateTime
        FROM students WHERE id = ?
      `).get(result.lastInsertRowid) as StudentData

      return inserted
    } catch (error) {
      console.error('添加学生失败:', error)
      return null
    }
  }

  // 批量添加学生
  batchAddStudents(students: { name: string; gender: string; className: string; studentNumber: string; phone: string }[]): { success: boolean; message: string; count: number } {
    if (!this.db) return { success: false, message: '数据库未连接', count: 0 }

    try {
      const now = new Date().toLocaleString()
      let successCount = 0
      let failCount = 0

      const insertStudent = this.db.prepare(`
        INSERT INTO students (name, gender, class_id, class_name, student_number, phone, status, create_time)
        VALUES (?, ?, ?, ?, ?, ?, 'active', ?)
      `)

      const findClass = this.db.prepare('SELECT id FROM classes WHERE name = ?')

      const transaction = this.db.transaction((students) => {
        for (const student of students) {
          // 查找班级ID
          const classResult = findClass.get(student.className) as { id: number } | undefined
          
          if (!classResult) {
            console.warn(`班级不存在: ${student.className}`)
            failCount++
            continue
          }

          try {
            insertStudent.run(
              student.name,
              student.gender,
              classResult.id,
              student.className,
              student.studentNumber,
              student.phone,
              now
            )
            successCount++
          } catch (err) {
            console.error(`添加学生失败: ${student.name}`, err)
            failCount++
          }
        }
      })

      transaction(students)

      return {
        success: true,
        message: `导入完成: 成功 ${successCount} 条，失败 ${failCount} 条`,
        count: successCount
      }
    } catch (error) {
      console.error('批量添加学生失败:', error)
      return { success: false, message: '批量添加失败: ' + error.message, count: 0 }
    }
  }

  // 更新学生
  updateStudent(id: number, studentData: Partial<StudentData>): boolean {
    if (!this.db) return false

    try {
      const now = new Date().toLocaleString()

      const fields = []
      const params = []

      if (studentData.name !== undefined) {
        fields.push('name = ?')
        params.push(studentData.name)
      }
      if (studentData.gender !== undefined) {
        fields.push('gender = ?')
        params.push(studentData.gender)
      }
      if (studentData.classId !== undefined) {
        fields.push('class_id = ?')
        params.push(studentData.classId)
      }
      if (studentData.className !== undefined) {
        fields.push('class_name = ?')
        params.push(studentData.className)
      }
      if (studentData.studentNumber !== undefined) {
        fields.push('student_number = ?')
        params.push(studentData.studentNumber)
      }
      if (studentData.phone !== undefined) {
        fields.push('phone = ?')
        params.push(studentData.phone)
      }
      if (studentData.status !== undefined) {
        fields.push('status = ?')
        params.push(studentData.status)
      }

      if (fields.length === 0) return false

      fields.push('update_time = ?')
      params.push(now)
      params.push(id)

      const stmt = this.db.prepare(`
        UPDATE students SET ${fields.join(', ')} WHERE id = ?
      `)

      const result = stmt.run(...params)
      return result.changes > 0
    } catch (error) {
      console.error('更新学生失败:', error)
      return false
    }
  }

  // 删除学生
  deleteStudent(id: number): boolean {
    if (!this.db) return false

    try {
      const stmt = this.db.prepare('DELETE FROM students WHERE id = ?')
      const result = stmt.run(id)
      return result.changes > 0
    } catch (error) {
      console.error('删除学生失败:', error)
      return false
    }
  }

  // 检查班级是否有活跃学生
  hasActiveStudents(classId: number): boolean {
    if (!this.db) return false

    try {
      const stmt = this.db.prepare('SELECT COUNT(*) as count FROM students WHERE class_id = ? AND status = ?')
      const result = stmt.get(classId, 'active') as { count: number }
      return result.count > 0
    } catch (error) {
      console.error('检查班级活跃学生失败:', error)
      return false
    }
  }

  // 获取班级活跃学生数量
  getActiveStudentCount(classId: number): number {
    if (!this.db) return 0

    try {
      const stmt = this.db.prepare('SELECT COUNT(*) as count FROM students WHERE class_id = ? AND status = ?')
      const result = stmt.get(classId, 'active') as { count: number }
      return result.count || 0
    } catch (error) {
      console.error('获取班级活跃学生数量失败:', error)
      return 0
    }
  }

  // 获取统计信息
  getStatistics() {
    if (!this.db) return null

    try {
      const stmt = this.db.prepare(`
        SELECT
          COUNT(*) as totalClasses,
          COALESCE(SUM(s.student_count), 0) as totalStudents,
          COUNT(CASE WHEN c.status = 'active' THEN 1 END) as activeClasses,
          COALESCE(ROUND(AVG(s.student_count), 1), 0) as averageStudents
        FROM classes c
        LEFT JOIN (
          SELECT class_id, COUNT(*) as student_count
          FROM students
          WHERE status = 'active'
          GROUP BY class_id
        ) s ON c.id = s.class_id
      `)

      return stmt.get() as {
        totalClasses: number
        totalStudents: number
        activeClasses: number
        averageStudents: number
      }
    } catch (error) {
      console.error('获取统计信息失败:', error)
      return null
    }
  }

  // ===================== 课程管理方法 =====================

  // 获取所有课程
  getAllCourses(): CourseData[] {
    if (!this.db) return []

    try {
      const stmt = this.db.prepare(`
        SELECT
          id, name, code, passing_score as passingScore, status,
          create_time as createTime, update_time as updateTime
        FROM courses
        ORDER BY create_time DESC
      `)

      return stmt.all() as CourseData[]
    } catch (error) {
      console.error('获取课程列表失败:', error)
      return []
    }
  }

  // 根据条件搜索课程
  searchCourses(searchText?: string, status?: string): CourseData[] {
    if (!this.db) return []

    try {
      let query = `
        SELECT
          id, name, code, passing_score as passingScore, status,
          create_time as createTime, update_time as updateTime
        FROM courses
        WHERE 1=1
      `

      const params: any[] = []

      if (searchText) {
        query += ` AND (name LIKE ? OR code LIKE ?)`
        params.push(`%${searchText}%`, `%${searchText}%`)
      }

      if (status) {
        query += ` AND status = ?`
        params.push(status)
      }

      query += ` ORDER BY create_time DESC`

      const stmt = this.db.prepare(query)
      return stmt.all(...params) as CourseData[]
    } catch (error) {
      console.error('搜索课程失败:', error)
      return []
    }
  }

  // 添加课程
  addCourse(courseData: Omit<CourseData, 'id' | 'createTime' | 'updateTime'>): CourseData | null {
    if (!this.db) return null

    try {
      const now = new Date().toLocaleString()

      const stmt = this.db.prepare(`
        INSERT INTO courses (name, code, passing_score, status, create_time)
        VALUES (?, ?, ?, ?, ?)
      `)

      const result = stmt.run(
        courseData.name,
        courseData.code,
        courseData.passingScore,
        courseData.status,
        now
      )

      // 返回插入的数据
      const inserted = this.db.prepare(`
        SELECT
          id, name, code, passing_score as passingScore, status,
          create_time as createTime, update_time as updateTime
        FROM courses WHERE id = ?
      `).get(result.lastInsertRowid) as CourseData

      return inserted
    } catch (error) {
      console.error('添加课程失败:', error)
      return null
    }
  }

  // 更新课程
  updateCourse(id: number, courseData: Partial<CourseData>): boolean {
    if (!this.db) return false

    try {
      const now = new Date().toLocaleString()

      const fields = []
      const params = []

      if (courseData.name !== undefined) {
        fields.push('name = ?')
        params.push(courseData.name)
      }
      if (courseData.code !== undefined) {
        fields.push('code = ?')
        params.push(courseData.code)
      }
      if (courseData.passingScore !== undefined) {
        fields.push('passing_score = ?')
        params.push(courseData.passingScore)
      }
      if (courseData.status !== undefined) {
        fields.push('status = ?')
        params.push(courseData.status)
      }

      if (fields.length === 0) return false

      fields.push('update_time = ?')
      params.push(now)
      params.push(id)

      const stmt = this.db.prepare(`
        UPDATE courses SET ${fields.join(', ')} WHERE id = ?
      `)

      const result = stmt.run(...params)
      return result.changes > 0
    } catch (error) {
      console.error('更新课程失败:', error)
      return false
    }
  }

  // 删除课程
  deleteCourse(id: number): boolean {
    if (!this.db) return false

    try {
      const stmt = this.db.prepare('DELETE FROM courses WHERE id = ?')
      const result = stmt.run(id)
      return result.changes > 0
    } catch (error) {
      console.error('删除课程失败:', error)
      return false
    }
  }

  // 获取课程统计信息
  getCourseStatistics() {
    if (!this.db) return null

    try {
      const stmt = this.db.prepare(`
        SELECT
          COUNT(*) as totalCourses,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as activeCourses,
          ROUND(AVG(passing_score), 1) as averagePassingScore
        FROM courses
      `)

      return stmt.get() as {
        totalCourses: number
        activeCourses: number
        averagePassingScore: number
      }
    } catch (error) {
      console.error('获取课程统计信息失败:', error)
      return null
    }
  }

  // 检查课程代码是否已存在
  isCourseCodeExists(code: string, excludeId?: number): boolean {
    if (!this.db) return false

    try {
      let query = 'SELECT COUNT(*) as count FROM courses WHERE code = ?'
      const params = [code]

      if (excludeId) {
        query += ' AND id != ?'
        params.push(excludeId)
      }

      const stmt = this.db.prepare(query)
      const result = stmt.get(...params) as { count: number }
      return result.count > 0
    } catch (error) {
      console.error('检查课程代码失败:', error)
      return false
    }
  }

  // ===================== 成绩管理方法 =====================

  // 获取所有成绩
  getAllScores(): ScoreData[] {
    if (!this.db) return []

    try {
      const stmt = this.db.prepare(`
        SELECT
          id, student_id as studentId, student_name as studentName, student_number as studentNumber,
          class_name as className, course_id as courseId, course_name as courseName, course_code as courseCode,
          score, exam_type as examType, academic_year as academicYear, semester, exam_date as examDate,
          status, create_time as createTime, update_time as updateTime
        FROM scores
        ORDER BY exam_date DESC, create_time DESC
      `)

      return stmt.all() as ScoreData[]
    } catch (error) {
      console.error('获取成绩列表失败:', error)
      return []
    }
  }

  // 根据条件搜索成绩
  searchScores(
    searchText?: string,
    courseId?: number,
    classId?: number,
    examType?: string,
    academicYear?: string,
    semester?: string
  ): ScoreData[] {
    if (!this.db) return []

    try {
      let query = `
        SELECT
          id, student_id as studentId, student_name as studentName, student_number as studentNumber,
          class_name as className, course_id as courseId, course_name as courseName, course_code as courseCode,
          score, exam_type as examType, academic_year as academicYear, semester, exam_date as examDate,
          status, create_time as createTime, update_time as updateTime
        FROM scores
        WHERE 1=1
      `

      const params: any[] = []

      if (searchText) {
        query += ` AND (student_name LIKE ? OR student_number LIKE ? OR course_name LIKE ?)`
        params.push(`%${searchText}%`, `%${searchText}%`, `%${searchText}%`)
      }

      if (courseId) {
        query += ` AND course_id = ?`
        params.push(courseId)
      }

      if (classId) {
        query += ` AND student_id IN (SELECT id FROM students WHERE class_id = ?)`
        params.push(classId)
      }

      if (examType) {
        query += ` AND exam_type = ?`
        params.push(examType)
      }

      if (academicYear) {
        query += ` AND academic_year = ?`
        params.push(academicYear)
      }

      if (semester) {
        query += ` AND semester = ?`
        params.push(semester)
      }

      query += ` ORDER BY exam_date DESC, create_time DESC`

      const stmt = this.db.prepare(query)
      return stmt.all(...params) as ScoreData[]
    } catch (error) {
      console.error('搜索成绩失败:', error)
      return []
    }
  }

  // 添加成绩
  addScore(scoreData: Omit<ScoreData, 'id' | 'createTime' | 'updateTime'>): ScoreData | null {
    if (!this.db) return null

    try {
      const now = new Date().toLocaleString()

      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO scores (
          student_id, student_name, student_number, class_name, course_id, course_name, course_code,
          score, exam_type, academic_year, semester, exam_date, status, create_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      const result = stmt.run(
        scoreData.studentId,
        scoreData.studentName,
        scoreData.studentNumber,
        scoreData.className,
        scoreData.courseId,
        scoreData.courseName,
        scoreData.courseCode,
        scoreData.score,
        scoreData.examType,
        scoreData.academicYear,
        scoreData.semester,
        scoreData.examDate,
        scoreData.status,
        now
      )

      // 返回插入的数据
      const inserted = this.db.prepare(`
        SELECT
          id, student_id as studentId, student_name as studentName, student_number as studentNumber,
          class_name as className, course_id as courseId, course_name as courseName, course_code as courseCode,
          score, exam_type as examType, academic_year as academicYear, semester, exam_date as examDate,
          status, create_time as createTime, update_time as updateTime
        FROM scores WHERE id = ?
      `).get(result.lastInsertRowid) as ScoreData

      return inserted
    } catch (error) {
      console.error('添加成绩失败:', error)
      return null
    }
  }

  // 更新成绩
  updateScore(id: number, scoreData: Partial<ScoreData>): boolean {
    if (!this.db) return false

    try {
      const now = new Date().toLocaleString()

      const fields = []
      const params = []

      if (scoreData.score !== undefined) {
        fields.push('score = ?')
        params.push(scoreData.score)
      }
      if (scoreData.examType !== undefined) {
        fields.push('exam_type = ?')
        params.push(scoreData.examType)
      }
      if (scoreData.examDate !== undefined) {
        fields.push('exam_date = ?')
        params.push(scoreData.examDate)
      }
      if (scoreData.status !== undefined) {
        fields.push('status = ?')
        params.push(scoreData.status)
      }

      if (fields.length === 0) return false

      fields.push('update_time = ?')
      params.push(now)
      params.push(id)

      const stmt = this.db.prepare(`
        UPDATE scores SET ${fields.join(', ')} WHERE id = ?
      `)

      const result = stmt.run(...params)
      return result.changes > 0
    } catch (error) {
      console.error('更新成绩失败:', error)
      return false
    }
  }

  // 删除成绩
  deleteScore(id: number): boolean {
    if (!this.db) return false

    try {
      const stmt = this.db.prepare('DELETE FROM scores WHERE id = ?')
      const result = stmt.run(id)
      return result.changes > 0
    } catch (error) {
      console.error('删除成绩失败:', error)
      return false
    }
  }

  // 获取学生成绩统计
  getStudentScoreStatistics(studentId: number, academicYear?: string, semester?: string): ScoreStatistics | null {
    if (!this.db) return null

    try {
      let query = `
        SELECT
          COUNT(*) as totalScores,
          AVG(score) as averageScore,
          MAX(score) as highestScore,
          MIN(score) as lowestScore,
          COUNT(CASE WHEN score >= 60 THEN 1 END) as passCount,
          COUNT(CASE WHEN score >= 90 THEN 1 END) as excellentCount,
          COUNT(CASE WHEN score >= 80 THEN 1 END) as goodCount
        FROM scores
        WHERE student_id = ? AND status = 'active'
      `

      const params = [studentId]

      if (academicYear) {
        query += ` AND academic_year = ?`
        params.push(academicYear)
      }

      if (semester) {
        query += ` AND semester = ?`
        params.push(semester)
      }

      const result = this.db.prepare(query).get(...params) as any

      if (!result || result.totalScores === 0) return null

      const totalScores = result.totalScores
      const passRate = (result.passCount / totalScores) * 100
      const excellentRate = (result.excellentCount / totalScores) * 100
      const goodRate = (result.goodCount / totalScores) * 100

      // 获取按班级分组的统计（这里学生只有一个班级，所以主要是获取该学生的班级统计）
      const classQuery = `
        SELECT s.class_name as className, AVG(s.score) as average, COUNT(*) as count
        FROM scores s
        WHERE s.student_id = ? AND s.status = 'active'
        ${academicYear ? 'AND s.academic_year = ?' : ''}
        ${semester ? 'AND s.semester = ?' : ''}
        GROUP BY s.class_name
      `

      const classParams = [studentId]
      if (academicYear) classParams.push(academicYear)
      if (semester) classParams.push(semester)

      const classResults = this.db.prepare(classQuery).all(...classParams) as { className: string; average: number; count: number }[]

      // 获取分数分布
      const distributionQuery = `
        SELECT
          CASE
            WHEN score >= 90 THEN '优秀(90-100)'
            WHEN score >= 80 THEN '良好(80-89)'
            WHEN score >= 70 THEN '中等(70-79)'
            WHEN score >= 60 THEN '及格(60-69)'
            ELSE '不及格(0-59)'
          END as range,
          COUNT(*) as count
        FROM scores
        WHERE student_id = ? AND status = 'active'
        ${academicYear ? 'AND academic_year = ?' : ''}
        ${semester ? 'AND semester = ?' : ''}
        GROUP BY range
        ORDER BY MIN(score) DESC
      `

      const distributionParams = [studentId]
      if (academicYear) distributionParams.push(academicYear)
      if (semester) distributionParams.push(semester)

      const distributionResults = this.db.prepare(distributionQuery).all(...distributionParams) as { range: string; count: number }[]

      const scoreDistribution = distributionResults.map(item => ({
        range: item.range,
        count: item.count,
        percentage: (item.count / totalScores) * 100
      }))

      return {
        totalScores,
        averageScore: Math.round(result.averageScore * 100) / 100,
        highestScore: result.highestScore,
        lowestScore: result.lowestScore,
        passRate: Math.round(passRate * 100) / 100,
        excellentRate: Math.round(excellentRate * 100) / 100,
        goodRate: Math.round(goodRate * 100) / 100,
        averageByClass: classResults.map(item => ({
          ...item,
          average: Math.round(item.average * 100) / 100
        })),
        scoreDistribution
      }
    } catch (error) {
      console.error('获取学生成绩统计失败:', error)
      return null
    }
  }

  // 获取课程成绩统计
  getCourseScoreStatistics(courseId: number, academicYear?: string, semester?: string): ScoreStatistics | null {
    if (!this.db) return null

    try {
      let query = `
        SELECT
          COUNT(*) as totalScores,
          AVG(score) as averageScore,
          MAX(score) as highestScore,
          MIN(score) as lowestScore,
          COUNT(CASE WHEN score >= 60 THEN 1 END) as passCount,
          COUNT(CASE WHEN score >= 90 THEN 1 END) as excellentCount,
          COUNT(CASE WHEN score >= 80 THEN 1 END) as goodCount
        FROM scores
        WHERE course_id = ? AND status = 'active'
      `

      const params = [courseId]

      if (academicYear) {
        query += ` AND academic_year = ?`
        params.push(academicYear)
      }

      if (semester) {
        query += ` AND semester = ?`
        params.push(semester)
      }

      const result = this.db.prepare(query).get(...params) as any

      if (!result || result.totalScores === 0) return null

      const totalScores = result.totalScores
      const passRate = (result.passCount / totalScores) * 100
      const excellentRate = (result.excellentCount / totalScores) * 100
      const goodRate = (result.goodCount / totalScores) * 100

      // 获取按班级分组的统计
      const classQuery = `
        SELECT s.class_name as className, AVG(s.score) as average, COUNT(*) as count
        FROM scores s
        WHERE s.course_id = ? AND s.status = 'active'
        ${academicYear ? 'AND s.academic_year = ?' : ''}
        ${semester ? 'AND s.semester = ?' : ''}
        GROUP BY s.class_name
        ORDER BY average DESC
      `

      const classParams = [courseId]
      if (academicYear) classParams.push(academicYear)
      if (semester) classParams.push(semester)

      const classResults = this.db.prepare(classQuery).all(...classParams) as { className: string; average: number; count: number }[]

      // 获取分数分布
      const distributionQuery = `
        SELECT
          CASE
            WHEN score >= 90 THEN '优秀(90-100)'
            WHEN score >= 80 THEN '良好(80-89)'
            WHEN score >= 70 THEN '中等(70-79)'
            WHEN score >= 60 THEN '及格(60-69)'
            ELSE '不及格(0-59)'
          END as range,
          COUNT(*) as count
        FROM scores
        WHERE course_id = ? AND status = 'active'
        ${academicYear ? 'AND academic_year = ?' : ''}
        ${semester ? 'AND semester = ?' : ''}
        GROUP BY range
        ORDER BY MIN(score) DESC
      `

      const distributionParams = [courseId]
      if (academicYear) distributionParams.push(academicYear)
      if (semester) distributionParams.push(semester)

      const distributionResults = this.db.prepare(distributionQuery).all(...distributionParams) as { range: string; count: number }[]

      const scoreDistribution = distributionResults.map(item => ({
        range: item.range,
        count: item.count,
        percentage: (item.count / totalScores) * 100
      }))

      return {
        totalScores,
        averageScore: Math.round(result.averageScore * 100) / 100,
        highestScore: result.highestScore,
        lowestScore: result.lowestScore,
        passRate: Math.round(passRate * 100) / 100,
        excellentRate: Math.round(excellentRate * 100) / 100,
        goodRate: Math.round(goodRate * 100) / 100,
        averageByClass: classResults.map(item => ({
          ...item,
          average: Math.round(item.average * 100) / 100
        })),
        scoreDistribution
      }
    } catch (error) {
      console.error('获取课程成绩统计失败:', error)
      return null
    }
  }

  // 关闭数据库连接
  close() {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// 导出单例
export const dbService = new DatabaseService()

// 应用退出时关闭数据库
app.on('before-quit', () => {
  dbService.close()
})