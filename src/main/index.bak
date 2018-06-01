'use strict'

import { app, BrowserWindow, ipcMain, dialog, globalShortcut, Menu } from 'electron'
import { autoUpdater } from 'electron-updater'
const path = require('path')
const glob = require('glob')
// const autoUpdater = require('./auto-updater')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
function initialize () {
  /**
   * Initial window options
   */
  const shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()
  // loadDemos()
  // autoUpdater.updateMenu()
  function createWindow () { // 定制窗口
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
      height: 563,
      useContentSize: true,
      width: 1006,
      frame: false,
      title: app.getName()
    })
    mainWindow.loadURL(winURL)
    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }
  app.on('ready', () => {
    globalShortcut.register('CommandOrControl+Alt+K', () => {
      dialog.showMessageBox({
        type: 'info',
        message: 'Success!',
        detail: 'You pressed the registered global shortcut keybinding.',
        buttons: ['OK']
      })
    })
  })
  app.on('ready', () => {
    createWindow()
    autoUpdater.checkForUpdates() // 检查是否有有效更新
    // autoUpdater.initialize()
  })
  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}
function createModal (modalName, config, url) {
  Menu.setApplicationMenu(null)
  modalName = new BrowserWindow(config)
  modalName.loadURL(url)
  modalName.once('ready-to-show', () => {
    modalName.show()
  })
}
// autoUpdater.on('update-not-available', (info) => {
//   mainWindow.webContents.send('update-not-available')
// })
autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('checking-for-update')
})
autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('update-not-available')
})
// when the update is ready, notify the BrowserWindow
// autoUpdater.on('update-downloaded', (info) => { // 当更新准备，通知浏览器窗口
//   mainWindow.webContents.send('updateReady', info)
// })
// autoUpdater.on('update-not-avilable', (info) => {
//   mainWindow.webContents.send('update-not-available')
// })
ipcMain.on('get-app-path', (event) => {
  event.sender.send('got-app-path', app.getAppPath())
})
ipcMain.on('get-app-version', (event) => {
  event.sender.send('got-app-version', app.getVersion())
})
ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, (files) => {
    if (files) {
      event.sender.send('selected-directory', files)
    }
  })
})
ipcMain.on('quitAndInstall', (event, arg) => {
  autoUpdater.quitAndInstall() // 退出并重新安装
})
ipcMain.on('checkForUpdates', (event, arg) => {
  autoUpdater.checkForUpdates() // 退出并重新安装
})
ipcMain.on('close', e => mainWindow.close())
ipcMain.on('about', e => {
  let modal
  let url = winURL + '#/about'
  createModal(modal, {
    modal: true,
    width: 400,
    height: 200,
    resizable: false,
    parent: mainWindow,
    icon: '../../build/icons/icon.ico',
    title: 'yyyy'
  }, url)
})
let modalUpdateSetup
ipcMain.on('close-update-setup', e => {
  modalUpdateSetup.close()
})
let modalUpdateChecking
ipcMain.on('checkVersion', e => {
  let url = winURL + '#/checkingUpdate'
  createModal(modalUpdateChecking, {
    modal: true,
    width: 400,
    height: 200,
    parent: mainWindow,
    icon: '../../build/icons/icon.ico',
    title: 'checking'
  }, url)
  // when the update is ready, notify the BrowserWindow
  autoUpdater.on('update-downloaded', (info) => { // 当更新准备，通知浏览器窗口
    modalUpdateChecking.webContents.send('updateReady')
  })
  autoUpdater.on('update-not-available', () => {
    modalUpdateChecking.webContents.send('update-not-available')
  })
})
ipcMain.on('setup-update', e => {
  let modal
  let url = winURL + '#/updateSetup'
  createModal(modal, {
    modal: true,
    width: 400,
    height: 200,
    resizable: false,
    parent: mainWindow,
    icon: '../../build/icons/icon.ico',
    title: 'yyyy'
  }, url)
})

function loadDemos () {
  const files = glob.sync(path.join(__dirname, 'main-process', '/*.js'))
  files.forEach((file) => { require(file) })
  // autoUpdater.updateMenu()
}
function makeSingleInstance () {
  if (process.mas) return false
  return app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore() // 主窗口将被恢复并获取聚焦
      mainWindow.focus()
    }
  })
}
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    // autoUpdater.createShortcut(() => { app.quit() })
    break
  case '--squirrel-uninstall':
    // autoUpdater.removeShortcut(() => { app.quit() })
    break
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit()
    break
  default:
    initialize()
}
