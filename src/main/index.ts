import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// 导入数据库服务
import { dbService } from './database'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 班级管理 IPC 处理器
  // 获取所有班级
  ipcMain.handle('db:getAllClasses', () => {
    return dbService.getAllClasses()
  })

  // 搜索班级
  ipcMain.handle('db:searchClasses', (_, searchText: string, grade: string, academicYear: string) => {
    return dbService.searchClasses(searchText, grade, academicYear)
  })

  // 添加班级
  ipcMain.handle('db:addClass', (_, classData) => {
    return dbService.addClass(classData)
  })

  // 更新班级
  ipcMain.handle('db:updateClass', (_, id: number, classData) => {
    return dbService.updateClass(id, classData)
  })

  // 检查班级是否有活跃学生
  ipcMain.handle('db:hasActiveStudents', (_, classId: number) => {
    return dbService.hasActiveStudents(classId)
  })

  // 获取班级活跃学生数量
  ipcMain.handle('db:getActiveStudentCount', (_, classId: number) => {
    return dbService.getActiveStudentCount(classId)
  })

  // 删除班级
  ipcMain.handle('db:deleteClass', (_, id: number) => {
    return dbService.deleteClass(id)
  })

  // 获取统计信息
  ipcMain.handle('db:getStatistics', () => {
    return dbService.getStatistics()
  })

  // 数据库管理
  ipcMain.handle('db:getDatabasePath', () => {
    return dbService.getDatabasePath()
  })

  ipcMain.handle('db:exportDatabase', (_, exportPath: string) => {
    return dbService.exportDatabase(exportPath)
  })

  ipcMain.handle('db:importDatabase', (_, importPath: string) => {
    return dbService.importDatabase(importPath)
  })

  ipcMain.handle('db:verifyDatabase', () => {
    return dbService.verifyDatabase()
  })

  // 学生管理 IPC 处理器
  // 获取所有学生
  ipcMain.handle('db:getAllStudents', () => {
    return dbService.getAllStudents()
  })

  // 搜索学生
  ipcMain.handle('db:searchStudents', (_, searchText: string, classId: number) => {
    return dbService.searchStudents(searchText, classId)
  })

  // 添加学生
  ipcMain.handle('db:addStudent', (_, studentData) => {
    return dbService.addStudent(studentData)
  })

  // 更新学生
  ipcMain.handle('db:updateStudent', (_, id: number, studentData) => {
    return dbService.updateStudent(id, studentData)
  })

  // 删除学生
  ipcMain.handle('db:deleteStudent', (_, id: number) => {
    return dbService.deleteStudent(id)
  })

  // 课程管理 IPC 处理器
  // 获取所有课程
  ipcMain.handle('db:getAllCourses', () => {
    return dbService.getAllCourses()
  })

  // 搜索课程
  ipcMain.handle('db:searchCourses', (_, searchText: string, status: string) => {
    return dbService.searchCourses(searchText, status)
  })

  // 添加课程
  ipcMain.handle('db:addCourse', (_, courseData) => {
    return dbService.addCourse(courseData)
  })

  // 更新课程
  ipcMain.handle('db:updateCourse', (_, id: number, courseData) => {
    return dbService.updateCourse(id, courseData)
  })

  // 删除课程
  ipcMain.handle('db:deleteCourse', (_, id: number) => {
    return dbService.deleteCourse(id)
  })

  // 获取课程统计信息
  ipcMain.handle('db:getCourseStatistics', () => {
    return dbService.getCourseStatistics()
  })

  // 检查课程代码是否已存在
  ipcMain.handle('db:isCourseCodeExists', (_, code: string, excludeId?: number) => {
    return dbService.isCourseCodeExists(code, excludeId)
  })

  // 成绩管理 IPC 处理器
  // 获取所有成绩
  ipcMain.handle('db:getAllScores', () => {
    return dbService.getAllScores()
  })

  // 搜索成绩
  ipcMain.handle('db:searchScores', (_, searchText, courseId, classId, examType, academicYear, semester) => {
    return dbService.searchScores(searchText, courseId, classId, examType, academicYear, semester)
  })

  // 添加成绩
  ipcMain.handle('db:addScore', (_, scoreData) => {
    return dbService.addScore(scoreData)
  })

  // 更新成绩
  ipcMain.handle('db:updateScore', (_, id: number, scoreData) => {
    return dbService.updateScore(id, scoreData)
  })

  // 删除成绩
  ipcMain.handle('db:deleteScore', (_, id: number) => {
    return dbService.deleteScore(id)
  })

  // 获取学生成绩统计
  ipcMain.handle('db:getStudentScoreStatistics', (_, studentId: number, academicYear, semester) => {
    return dbService.getStudentScoreStatistics(studentId, academicYear, semester)
  })

  // 获取课程成绩统计
  ipcMain.handle('db:getCourseScoreStatistics', (_, courseId: number, academicYear, semester) => {
    return dbService.getCourseScoreStatistics(courseId, academicYear, semester)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
